window.PixelAISchema = (() => {
  const FORMAT = "pixel-art-ai-studio-v1";
  const VALID_SIZES = new Set([8, 12, 16, 24, 32, 48, 64]);
  const VALID_TYPES = new Set(["object", "character", "tile", "scene", "animation", "effect"]);

  const RUMBO_PROFILE = {
    profile: "RUMBO",
    outline: "soft-dark",
    lighting: "top-left",
    detail: "medium",
    paletteMode: "limited",
    background: "transparent",
    antiAliasing: false
  };

  const MASTER_PROMPT = `Eres el motor de generación de Pixel Art AI Studio.
Responde únicamente con JSON válido usando el formato pixel-art-ai-studio-v1.
Todo resultado debe ser pixel art editable, con fondo transparente, sin anti-aliasing y con una paleta limitada.
Cada frame debe usar una matriz 2D cuyos valores sean ids existentes en palette.
Siempre debe existir el id T con hex transparent.
Los tamaños permitidos son 8, 12, 16, 24, 32, 48 y 64.
Para estilo RUMBO usa contorno oscuro suave, luz superior izquierda, detalle medio, silueta clara y legibilidad para juego 2D.
Un asset estático usa exactamente 1 frame. Una animación usa 2 o más frames con tamaño, paleta, proporciones y diseño consistentes.
No devuelvas markdown, comentarios ni texto fuera del JSON.`;

  function hslToHex(value) {
    const match = String(value).trim().match(/^hsl\(\s*([\d.]+)(?:deg)?[ ,]+([\d.]+)%[ ,]+([\d.]+)%\s*\)$/i);
    if (!match) return null;
    let h = ((Number(match[1]) % 360) + 360) % 360;
    const s = Math.max(0, Math.min(100, Number(match[2]))) / 100;
    const l = Math.max(0, Math.min(100, Number(match[3]))) / 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (h < 60) [r,g,b] = [c,x,0];
    else if (h < 120) [r,g,b] = [x,c,0];
    else if (h < 180) [r,g,b] = [0,c,x];
    else if (h < 240) [r,g,b] = [0,x,c];
    else if (h < 300) [r,g,b] = [x,0,c];
    else [r,g,b] = [c,0,x];
    const hex = n => Math.round((n + m) * 255).toString(16).padStart(2,"0");
    return `#${hex(r)}${hex(g)}${hex(b)}`;
  }

  function normalizeHex(value) {
    if (String(value).toLowerCase() === "transparent") return "transparent";
    const raw = String(value || "").trim();
    if (/^#[0-9a-f]{6}$/i.test(raw)) return raw.toLowerCase();
    return hslToHex(raw);
  }

  function validate(asset) {
    const errors = [];
    if (!asset || typeof asset !== "object") return { ok:false, errors:["Asset vacío o inválido."] };
    if (asset.format !== FORMAT) errors.push(`format debe ser ${FORMAT}.`);
    if (!VALID_TYPES.has(asset.assetType)) errors.push("assetType no reconocido.");

    const width = Number(asset.canvas?.width);
    const height = Number(asset.canvas?.height);
    if (!VALID_SIZES.has(width) || width !== height) errors.push("El lienzo debe ser cuadrado y usar un tamaño permitido.");

    if (!Array.isArray(asset.palette) || !asset.palette.length) errors.push("palette es obligatoria.");
    const ids = new Set();
    let transparentFound = false;
    for (const entry of asset.palette || []) {
      if (!entry?.id || ids.has(entry.id)) errors.push("Cada color necesita un id único.");
      ids.add(entry?.id);
      const normalized = normalizeHex(entry?.hex);
      if (!normalized) errors.push(`Color inválido en palette: ${entry?.id || "sin id"}.`);
      else entry.hex = normalized;
      if (entry?.id === "T" && normalized === "transparent") transparentFound = true;
    }
    if (!transparentFound) errors.push("La paleta debe incluir T = transparent.");

    if (!Array.isArray(asset.frames) || !asset.frames.length) errors.push("Debe existir al menos un frame.");
    if (asset.assetType === "animation" && (asset.frames?.length || 0) < 2) errors.push("Una animación necesita al menos 2 frames.");
    if (asset.assetType !== "animation" && (asset.frames?.length || 0) !== 1) errors.push("Un asset estático debe tener exactamente 1 frame.");

    for (const frame of asset.frames || []) {
      if (!Number.isInteger(Number(frame.durationMs)) || Number(frame.durationMs) <= 0) errors.push("durationMs debe ser un entero positivo.");
      if (!Array.isArray(frame.pixels) || frame.pixels.length !== height) {
        errors.push(`Frame ${frame?.id || "sin id"}: número de filas incorrecto.`);
        continue;
      }
      frame.pixels.forEach((row, rowIndex) => {
        if (!Array.isArray(row) || row.length !== width) {
          errors.push(`Frame ${frame?.id || "sin id"}: fila ${rowIndex} con ancho incorrecto.`);
          return;
        }
        row.forEach(pixelId => {
          if (!ids.has(pixelId)) errors.push(`Frame ${frame?.id || "sin id"}: id de color desconocido ${pixelId}.`);
        });
      });
    }

    return { ok: errors.length === 0, errors };
  }

  function paletteMap(asset) {
    return new Map((asset.palette || []).map(entry => [entry.id, normalizeHex(entry.hex) || "transparent"]));
  }

  function frameToFlat(asset, frameIndex = 0) {
    const frame = asset.frames?.[frameIndex];
    if (!frame) return null;
    const map = paletteMap(asset);
    return frame.pixels.flat().map(id => map.get(id) || "transparent");
  }

  function animationProjectState(asset) {
    const checked = validate(asset);
    if (!checked.ok) throw new Error(checked.errors[0]);
    const size = Number(asset.canvas.width);
    return {
      frames: asset.frames.map((frame, index) => ({
        state: { size, pixels: frameToFlat(asset, index) },
        durationMs: Number(frame.durationMs)
      })),
      currentIndex: 0,
      fps: Number(asset.animation?.defaultFps || 6),
      onionEnabled: true,
      onionOpacity: 0.28
    };
  }

  function applyToStudio(asset) {
    const checked = validate(asset);
    if (!checked.ok) throw new Error(checked.errors.join(" "));
    const size = Number(asset.canvas.width);
    const first = { size, pixels: frameToFlat(asset, 0) };
    const sizeSelect = document.getElementById("sizeSelect");
    const sizeLabel = document.getElementById("canvasSizeLabel");
    if (sizeSelect) sizeSelect.value = String(size);
    if (sizeLabel) sizeLabel.textContent = `${size} × ${size}`;

    if (asset.assetType === "animation" && window.PixelAnimation?.loadProjectState) {
      window.PixelAnimation.loadProjectState(animationProjectState(asset));
    } else {
      window.PixelCanvas.loadState(first);
    }
    window.dispatchEvent(new CustomEvent("pixelaiassetloaded", { detail: asset }));
    return true;
  }

  return {
    FORMAT,
    VALID_SIZES: [...VALID_SIZES],
    VALID_TYPES: [...VALID_TYPES],
    RUMBO_PROFILE,
    MASTER_PROMPT,
    validate,
    paletteMap,
    frameToFlat,
    animationProjectState,
    applyToStudio
  };
})();