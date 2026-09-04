(() => {
  const objectInput = document.getElementById("aiObject");
  const categorySelect = document.getElementById("aiCategory");
  const sizeSelect = document.getElementById("aiSize");
  const styleSelect = document.getElementById("aiStyle");
  const detailSelect = document.getElementById("aiDetail");
  const paletteSelect = document.getElementById("aiPalette");
  const lightingSelect = document.getElementById("aiLighting");
  const perspectiveSelect = document.getElementById("aiPerspective");
  const backgroundSelect = document.getElementById("aiBackground");
  const outlineSelect = document.getElementById("aiOutline");
  const stepsSelect = document.getElementById("aiSteps");
  const notesInput = document.getElementById("aiNotes");
  const generateBtn = document.getElementById("aiGenerateBtn");
  const applyBtn = document.getElementById("aiApplyBtn");
  const copyBtn = document.getElementById("aiCopyBtn");
  const output = document.getElementById("aiOutput");
  const state = document.getElementById("aiState");

  if (!generateBtn) return;

  let latestSpec = null;

  const presets = {
    manzana: { category: "food", style: "classic", palette: "warm", perspective: "front" },
    espada: { category: "item", style: "rpg", palette: "metal", perspective: "diagonal" },
    arbol: { category: "nature", style: "rpg", palette: "natural", perspective: "front" },
    árbol: { category: "nature", style: "rpg", palette: "natural", perspective: "front" },
    cofre: { category: "item", style: "rpg", palette: "warm", perspective: "three-quarter" },
    casa: { category: "building", style: "rpg", palette: "natural", perspective: "three-quarter" },
    personaje: { category: "character", style: "rpg", palette: "balanced", perspective: "front" }
  };

  function normalizedObject() {
    return objectInput.value.trim();
  }

  function suggestPreset() {
    const key = normalizedObject().toLowerCase();
    const match = Object.keys(presets).find(name => key.includes(name));
    if (!match) return;
    const preset = presets[match];
    categorySelect.value = preset.category;
    styleSelect.value = preset.style;
    paletteSelect.value = preset.palette;
    perspectiveSelect.value = preset.perspective;
  }

  function buildSpec() {
    const subject = normalizedObject() || "objeto sin nombre";
    return {
      version: "pixel-art-studio-spec-v1",
      subject,
      category: categorySelect.value,
      canvas: `${sizeSelect.value}x${sizeSelect.value}`,
      style: styleSelect.value,
      detail: detailSelect.value,
      palette: paletteSelect.value,
      lighting: lightingSelect.value,
      perspective: perspectiveSelect.value,
      background: backgroundSelect.value,
      outline: outlineSelect.value,
      tutorialSteps: Number(stepsSelect.value),
      extraNotes: notesInput.value.trim(),
      requestedOutput: [
        "pixel-art blueprint",
        "recommended palette",
        "step-by-step tutorial",
        "pixel coordinates per step",
        "final sprite preview"
      ]
    };
  }

  function renderSpec(spec) {
    const readable = [
      `OBJETO: ${spec.subject}`,
      `CATEGORÍA: ${spec.category}`,
      `FORMATO: ${spec.canvas}`,
      `ESTILO: ${spec.style}`,
      `DETALLE: ${spec.detail}`,
      `PALETA: ${spec.palette}`,
      `LUZ: ${spec.lighting}`,
      `PERSPECTIVA: ${spec.perspective}`,
      `FONDO: ${spec.background}`,
      `CONTORNO: ${spec.outline}`,
      `PASOS: ${spec.tutorialSteps}`,
      spec.extraNotes ? `NOTAS: ${spec.extraNotes}` : "NOTAS: —",
      "",
      "SALIDA FUTURA DE IA:",
      "• paleta recomendada",
      "• instrucciones paso a paso",
      "• coordenadas de píxeles por paso",
      "• guía gráfica acumulativa",
      "• sprite final"
    ].join("\n");
    output.textContent = readable;
  }

  function setState(text) {
    state.textContent = text;
  }

  objectInput.addEventListener("change", suggestPreset);

  generateBtn.addEventListener("click", () => {
    latestSpec = buildSpec();
    renderSpec(latestSpec);
    applyBtn.disabled = false;
    copyBtn.disabled = false;
    setState("Especificación lista · prototipo local");
  });

  applyBtn.addEventListener("click", () => {
    if (!latestSpec) return;
    const editorSize = document.getElementById("sizeSelect");
    editorSize.value = sizeSelect.value;
    editorSize.dispatchEvent(new Event("change", { bubbles: true }));
    setState(`Formato ${latestSpec.canvas} aplicado al editor`);
    document.getElementById("pixelCanvas")?.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  copyBtn.addEventListener("click", async () => {
    if (!latestSpec) return;
    const text = JSON.stringify(latestSpec, null, 2);
    try {
      await navigator.clipboard.writeText(text);
      setState("Especificación copiada al portapapeles");
    } catch (_) {
      setState("No se pudo copiar automáticamente");
    }
  });
})();