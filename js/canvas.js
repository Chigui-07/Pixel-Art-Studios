window.PixelCanvas = (() => {
  const EMPTY = "transparent";
  const MAX_HISTORY = 60;

  let size = 16;
  let currentTool = "pencil";
  let currentColor = "#e94f37";
  let drawing = false;
  let lastPaintedPixel = null;
  let shapeStart = null;
  let shapeEnd = null;
  let moveStart = null;
  let moveOrigin = null;
  let moveOffset = { x: 0, y: 0 };
  let history = [];
  let historyIndex = -1;
  let zoom = 1;
  let layerCounter = 1;
  let layers = [];
  let activeLayerId = null;

  const canvas = document.getElementById("pixelCanvas");
  const paintedPixels = document.getElementById("paintedPixels");
  const coordinateLabel = document.getElementById("coordinateLabel");

  function normalizeColor(color) {
    if (!color || color === "transparent" || color === "rgba(0, 0, 0, 0)") return EMPTY;
    if (color.startsWith("rgba") && /,\s*0\s*\)$/.test(color)) return EMPTY;
    if (color.startsWith("rgb")) {
      const values = color.match(/\d+/g)?.slice(0, 3).map(Number) || [255, 255, 255];
      return `#${values.map(v => v.toString(16).padStart(2, "0")).join("")}`;
    }
    return color.toLowerCase();
  }

  function uid() { return `layer-${Date.now()}-${layerCounter++}`; }
  function blankPixels() { return new Array(size * size).fill(EMPTY); }
  function getPixels() { return [...canvas.children]; }
  function activeLayer() { return layers.find(layer => layer.id === activeLayerId) || layers[0] || null; }

  function compositePixels() {
    const result = blankPixels();
    layers.forEach(layer => {
      if (!layer.visible) return;
      layer.pixels.forEach((color, index) => {
        const normalized = normalizeColor(color);
        if (normalized !== EMPTY) result[index] = normalized;
      });
    });
    return result;
  }

  function getPixelColor(pixel) {
    if (!pixel) return EMPTY;
    const index = Number(pixel.dataset.index);
    return compositePixels()[index] || EMPTY;
  }

  function getActivePixelColor(pixel) {
    if (!pixel) return EMPTY;
    const layer = activeLayer();
    return layer ? normalizeColor(layer.pixels[Number(pixel.dataset.index)] || EMPTY) : EMPTY;
  }

  function paintDomPixel(pixel, color) {
    if (!pixel) return;
    const normalized = normalizeColor(color);
    pixel.dataset.color = normalized;
    pixel.dataset.painted = normalized === EMPTY ? "false" : "true";
    pixel.style.background = normalized === EMPTY ? "transparent" : normalized;
  }

  function renderAll() {
    const composite = compositePixels();
    getPixels().forEach((pixel, index) => paintDomPixel(pixel, composite[index]));
    updateCounter();
  }

  function setPixelColor(pixel, color) {
    const layer = activeLayer();
    if (!pixel || !layer) return;
    const index = Number(pixel.dataset.index);
    layer.pixels[index] = normalizeColor(color);
    renderAll();
  }

  function updateCounter() {
    if (!paintedPixels) return;
    const count = compositePixels().filter(color => normalizeColor(color) !== EMPTY).length;
    paintedPixels.textContent = `${count} píxel${count === 1 ? "" : "es"} usado${count === 1 ? "" : "s"}`;
  }

  function snapshot() {
    const layer = activeLayer();
    return layer ? [...layer.pixels] : blankPixels();
  }

  function restore(state) {
    const layer = activeLayer();
    if (!layer || !state || state.length !== size * size) return false;
    layer.pixels = state.map(normalizeColor);
    renderAll();
    return true;
  }

  function pushHistory() {
    const state = snapshot();
    const last = history[historyIndex];
    if (last && last.every((color, index) => color === state[index])) return;
    history = history.slice(0, historyIndex + 1);
    history.push(state);
    if (history.length > MAX_HISTORY) history.shift();
    historyIndex = history.length - 1;
    window.dispatchEvent(new CustomEvent("pixelhistorychange"));
    window.dispatchEvent(new CustomEvent("pixellayerchange", { detail: getLayerState() }));
  }

  function resetHistory() {
    history = [];
    historyIndex = -1;
    pushHistory();
  }

  function undo() {
    if (historyIndex <= 0) return false;
    historyIndex--;
    restore(history[historyIndex]);
    window.dispatchEvent(new CustomEvent("pixelhistorychange"));
    return true;
  }

  function redo() {
    if (historyIndex >= history.length - 1) return false;
    historyIndex++;
    restore(history[historyIndex]);
    window.dispatchEvent(new CustomEvent("pixelhistorychange"));
    return true;
  }

  function canUndo() { return historyIndex > 0; }
  function canRedo() { return historyIndex < history.length - 1; }

  function coordsFromPixel(pixel) {
    const index = Number(pixel.dataset.index);
    return { x: index % size, y: Math.floor(index / size) };
  }

  function pixelAt(x, y) {
    if (x < 0 || y < 0 || x >= size || y >= size) return null;
    return canvas.children[y * size + x] || null;
  }

  function pixelFromPointer(event) {
    const element = document.elementFromPoint(event.clientX, event.clientY);
    const pixel = element?.closest?.(".pixel");
    return pixel && canvas.contains(pixel) ? pixel : null;
  }

  function applyDirect(pixel) {
    if (!pixel || pixel === lastPaintedPixel) return;
    setPixelColor(pixel, currentTool === "eraser" ? EMPTY : currentColor);
    lastPaintedPixel = pixel;
  }

  function floodFill(startPixel) {
    const target = getActivePixelColor(startPixel);
    const replacement = normalizeColor(currentColor);
    if (target === replacement) return false;
    const start = coordsFromPixel(startPixel);
    const queue = [start];
    const visited = new Set();
    let cursor = 0;
    while (cursor < queue.length) {
      const point = queue[cursor++];
      const key = `${point.x},${point.y}`;
      if (visited.has(key)) continue;
      visited.add(key);
      const pixel = pixelAt(point.x, point.y);
      if (!pixel || getActivePixelColor(pixel) !== target) continue;
      const layer = activeLayer();
      layer.pixels[point.y * size + point.x] = replacement;
      queue.push(
        { x: point.x + 1, y: point.y }, { x: point.x - 1, y: point.y },
        { x: point.x, y: point.y + 1 }, { x: point.x, y: point.y - 1 }
      );
    }
    renderAll();
    return true;
  }

  function drawLine(from, to) {
    let x0 = from.x, y0 = from.y;
    const x1 = to.x, y1 = to.y;
    const dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
    const dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
    let error = dx + dy;
    const layer = activeLayer();
    while (true) {
      layer.pixels[y0 * size + x0] = currentColor;
      if (x0 === x1 && y0 === y1) break;
      const twice = 2 * error;
      if (twice >= dy) { error += dy; x0 += sx; }
      if (twice <= dx) { error += dx; y0 += sy; }
    }
    renderAll();
  }

  function drawRectangle(from, to) {
    const minX = Math.min(from.x, to.x), maxX = Math.max(from.x, to.x);
    const minY = Math.min(from.y, to.y), maxY = Math.max(from.y, to.y);
    const layer = activeLayer();
    for (let x = minX; x <= maxX; x++) {
      layer.pixels[minY * size + x] = currentColor;
      layer.pixels[maxY * size + x] = currentColor;
    }
    for (let y = minY; y <= maxY; y++) {
      layer.pixels[y * size + minX] = currentColor;
      layer.pixels[y * size + maxX] = currentColor;
    }
    renderAll();
  }

  function drawEllipse(from, to) {
    const minX = Math.min(from.x, to.x), maxX = Math.max(from.x, to.x);
    const minY = Math.min(from.y, to.y), maxY = Math.max(from.y, to.y);
    const rx = (maxX - minX) / 2, ry = (maxY - minY) / 2;
    const cx = minX + rx, cy = minY + ry;
    if (rx === 0 || ry === 0) return drawLine(from, to);
    const points = new Set();
    const steps = Math.max(24, Math.ceil(Math.PI * 2 * Math.max(rx, ry) * 2));
    const layer = activeLayer();
    for (let i = 0; i < steps; i++) {
      const angle = (i / steps) * Math.PI * 2;
      points.add(`${Math.round(cx + rx * Math.cos(angle))},${Math.round(cy + ry * Math.sin(angle))}`);
    }
    points.forEach(key => {
      const [x, y] = key.split(",").map(Number);
      layer.pixels[y * size + x] = currentColor;
    });
    renderAll();
  }

  function shiftedState(origin, dx, dy) {
    const result = blankPixels();
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const color = normalizeColor(origin[y * size + x]);
        if (color === EMPTY) continue;
        const nx = x + dx, ny = y + dy;
        if (nx >= 0 && nx < size && ny >= 0 && ny < size) result[ny * size + nx] = color;
      }
    }
    return result;
  }

  function previewMove(coords) {
    if (!moveStart || !moveOrigin) return;
    moveOffset = { x: coords.x - moveStart.x, y: coords.y - moveStart.y };
    restore(shiftedState(moveOrigin, moveOffset.x, moveOffset.y));
  }

  function finishShape() {
    if (!shapeStart || !shapeEnd) return false;
    if (currentTool === "line") drawLine(shapeStart, shapeEnd);
    if (currentTool === "rect") drawRectangle(shapeStart, shapeEnd);
    if (currentTool === "ellipse") drawEllipse(shapeStart, shapeEnd);
    pushHistory();
    return true;
  }

  function stopDrawing() {
    if (!drawing) return;
    if (["line", "rect", "ellipse"].includes(currentTool)) finishShape();
    else if (["pencil", "eraser", "move"].includes(currentTool)) pushHistory();
    drawing = false;
    lastPaintedPixel = null;
    shapeStart = shapeEnd = null;
    moveStart = moveOrigin = null;
    moveOffset = { x: 0, y: 0 };
  }

  function resetLayers() {
    const layer = { id: uid(), name: "Capa 1", visible: true, pixels: blankPixels() };
    layers = [layer];
    activeLayerId = layer.id;
  }

  function buildGrid(newSize = size) {
    size = Number(newSize);
    canvas.innerHTML = "";
    canvas.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    canvas.setAttribute("aria-label", `Lienzo de pixel art de ${size} por ${size}`);
    for (let i = 0; i < size * size; i++) {
      const pixel = document.createElement("div");
      pixel.className = "pixel";
      pixel.dataset.index = i;
      pixel.dataset.painted = "false";
      pixel.dataset.color = EMPTY;
      pixel.style.background = "transparent";
      canvas.appendChild(pixel);
    }
    resetLayers();
    renderAll();
    resetHistory();
    window.dispatchEvent(new CustomEvent("pixelsizechange", { detail: { size } }));
    window.dispatchEvent(new CustomEvent("pixellayerchange", { detail: getLayerState() }));
  }

  canvas.addEventListener("pointerdown", event => {
    const pixel = event.target.closest(".pixel");
    if (!pixel) return;
    const coords = coordsFromPixel(pixel);
    if (coordinateLabel) coordinateLabel.textContent = `x: ${coords.x} · y: ${coords.y}`;
    if (currentTool === "eyedropper") {
      const picked = getPixelColor(pixel);
      if (picked !== EMPTY) {
        setColor(picked);
        window.dispatchEvent(new CustomEvent("pixelcolorpicked", { detail: { color: picked } }));
      } else window.dispatchEvent(new CustomEvent("pixeltransparentpicked"));
      event.preventDefault();
      return;
    }
    if (currentTool === "fill") {
      if (floodFill(pixel)) pushHistory();
      event.preventDefault();
      return;
    }
    drawing = true;
    lastPaintedPixel = null;
    if (currentTool === "move") {
      moveStart = coords;
      moveOrigin = snapshot();
      moveOffset = { x: 0, y: 0 };
    } else if (["line", "rect", "ellipse"].includes(currentTool)) {
      shapeStart = coords;
      shapeEnd = coords;
    } else if (["pencil", "eraser"].includes(currentTool)) applyDirect(pixel);
    try { canvas.setPointerCapture(event.pointerId); } catch (_) {}
    event.preventDefault();
  });

  canvas.addEventListener("pointermove", event => {
    const pixel = pixelFromPointer(event);
    if (pixel) {
      const coords = coordsFromPixel(pixel);
      if (coordinateLabel) coordinateLabel.textContent = `x: ${coords.x} · y: ${coords.y}`;
      if (drawing && ["line", "rect", "ellipse"].includes(currentTool)) shapeEnd = coords;
      if (drawing && currentTool === "move") previewMove(coords);
    }
    if (!drawing || !["pencil", "eraser"].includes(currentTool)) return;
    if (pixel) applyDirect(pixel);
    event.preventDefault();
  });

  canvas.addEventListener("pointerleave", () => {
    if (coordinateLabel) coordinateLabel.textContent = "x: — · y: —";
    if (drawing && ["pencil", "eraser"].includes(currentTool)) lastPaintedPixel = null;
  });
  canvas.addEventListener("pointerup", event => {
    try { canvas.releasePointerCapture(event.pointerId); } catch (_) {}
    stopDrawing();
  });

  window.addEventListener("pointerup", stopDrawing);
  window.addEventListener("pointercancel", stopDrawing);
  window.addEventListener("blur", stopDrawing);
  canvas.addEventListener("contextmenu", event => event.preventDefault());

  function setTool(tool) { stopDrawing(); currentTool = tool; }
  function setColor(color) {
    const normalized = normalizeColor(color);
    if (normalized !== EMPTY) currentColor = normalized;
  }
  function getColor() { return currentColor; }

  function clear() {
    const layer = activeLayer();
    if (!layer || !layer.pixels.some(color => normalizeColor(color) !== EMPTY)) return false;
    layer.pixels = blankPixels();
    renderAll();
    pushHistory();
    return true;
  }

  function transformState(transformer) {
    const before = snapshot();
    const after = blankPixels();
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const target = transformer(x, y);
        after[target.y * size + target.x] = before[y * size + x];
      }
    }
    restore(after);
    pushHistory();
    return true;
  }

  function flipHorizontal() { return transformState((x, y) => ({ x: size - 1 - x, y })); }
  function flipVertical() { return transformState((x, y) => ({ x, y: size - 1 - y })); }
  function rotate90() { return transformState((x, y) => ({ x: size - 1 - y, y: x })); }
  function resize(newSize) { buildGrid(newSize); }

  function getState() { return { size, pixels: compositePixels() }; }
  function getActiveLayerState() { return { size, pixels: snapshot() }; }

  function loadActiveLayerState(state, options = {}) {
    if (!state || !Array.isArray(state.pixels) || Number(state.size) !== size || state.pixels.length !== size * size) return false;
    restore(state.pixels.map(normalizeColor));
    if (options.resetHistory !== false) resetHistory();
    else window.dispatchEvent(new CustomEvent("pixellayerchange", { detail: getLayerState() }));
    window.dispatchEvent(new CustomEvent("pixelstatechange"));
    return true;
  }

  function loadState(state, options = {}) {
    if (!state || !Array.isArray(state.pixels)) return false;
    if (Number(state.size) !== size) buildGrid(Number(state.size));
    if (state.pixels.length !== size * size) return false;
    const layer = { id: uid(), name: options.layerName || "Capa 1", visible: true, pixels: state.pixels.map(normalizeColor) };
    layers = [layer];
    activeLayerId = layer.id;
    renderAll();
    if (options.resetHistory !== false) resetHistory();
    window.dispatchEvent(new CustomEvent("pixelstatechange"));
    window.dispatchEvent(new CustomEvent("pixellayerchange", { detail: getLayerState() }));
    return true;
  }

  function getLayerState() {
    return {
      size,
      activeLayerId,
      layers: layers.map(layer => ({ id: layer.id, name: layer.name, visible: layer.visible, pixels: [...layer.pixels] }))
    };
  }

  function loadLayerState(state, options = {}) {
    if (!state || !Array.isArray(state.layers) || !state.layers.length) return false;
    const targetSize = Number(state.size || size);
    if (targetSize !== size) {
      size = targetSize;
      canvas.innerHTML = "";
      canvas.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
      for (let i = 0; i < size * size; i++) {
        const pixel = document.createElement("div");
        pixel.className = "pixel";
        pixel.dataset.index = i;
        canvas.appendChild(pixel);
      }
    }
    layers = state.layers.map((layer, index) => ({
      id: layer.id || uid(),
      name: layer.name || `Capa ${index + 1}`,
      visible: layer.visible !== false,
      pixels: Array.isArray(layer.pixels) && layer.pixels.length === size * size ? layer.pixels.map(normalizeColor) : blankPixels()
    }));
    activeLayerId = layers.some(layer => layer.id === state.activeLayerId) ? state.activeLayerId : layers[layers.length - 1].id;
    renderAll();
    if (options.resetHistory !== false) resetHistory();
    window.dispatchEvent(new CustomEvent("pixelsizechange", { detail: { size } }));
    window.dispatchEvent(new CustomEvent("pixellayerchange", { detail: getLayerState() }));
    return true;
  }

  function addLayer(name = `Capa ${layers.length + 1}`) {
    const layer = { id: uid(), name, visible: true, pixels: blankPixels() };
    const activeIndex = Math.max(0, layers.findIndex(item => item.id === activeLayerId));
    layers.splice(activeIndex + 1, 0, layer);
    activeLayerId = layer.id;
    resetHistory();
    renderAll();
    window.dispatchEvent(new CustomEvent("pixellayerchange", { detail: getLayerState() }));
    return layer.id;
  }

  function duplicateLayer(id = activeLayerId) {
    const index = layers.findIndex(layer => layer.id === id);
    if (index < 0) return false;
    const source = layers[index];
    const layer = { id: uid(), name: `${source.name} copia`, visible: source.visible, pixels: [...source.pixels] };
    layers.splice(index + 1, 0, layer);
    activeLayerId = layer.id;
    resetHistory();
    renderAll();
    window.dispatchEvent(new CustomEvent("pixellayerchange", { detail: getLayerState() }));
    return layer.id;
  }

  function deleteLayer(id = activeLayerId) {
    if (layers.length <= 1) return false;
    const index = layers.findIndex(layer => layer.id === id);
    if (index < 0) return false;
    layers.splice(index, 1);
    activeLayerId = layers[Math.min(index, layers.length - 1)].id;
    resetHistory();
    renderAll();
    window.dispatchEvent(new CustomEvent("pixellayerchange", { detail: getLayerState() }));
    return true;
  }

  function setActiveLayer(id) {
    if (!layers.some(layer => layer.id === id)) return false;
    activeLayerId = id;
    resetHistory();
    window.dispatchEvent(new CustomEvent("pixellayerchange", { detail: getLayerState() }));
    return true;
  }

  function toggleLayerVisibility(id) {
    const layer = layers.find(item => item.id === id);
    if (!layer) return false;
    layer.visible = !layer.visible;
    renderAll();
    window.dispatchEvent(new CustomEvent("pixellayerchange", { detail: getLayerState() }));
    return layer.visible;
  }

  function renameLayer(id, name) {
    const layer = layers.find(item => item.id === id);
    const clean = String(name || "").trim();
    if (!layer || !clean) return false;
    layer.name = clean;
    window.dispatchEvent(new CustomEvent("pixellayerchange", { detail: getLayerState() }));
    return true;
  }

  function moveLayer(id, direction) {
    const index = layers.findIndex(layer => layer.id === id);
    if (index < 0) return false;
    const next = direction === "up" ? index + 1 : index - 1;
    if (next < 0 || next >= layers.length) return false;
    [layers[index], layers[next]] = [layers[next], layers[index]];
    renderAll();
    window.dispatchEvent(new CustomEvent("pixellayerchange", { detail: getLayerState() }));
    return true;
  }

  function toggleGrid(force) {
    const show = typeof force === "boolean" ? force : canvas.classList.contains("grid-hidden");
    canvas.classList.toggle("grid-hidden", !show);
    return show;
  }

  function setZoom(nextZoom) {
    zoom = Math.min(2.5, Math.max(0.35, Number(nextZoom)));
    canvas.style.width = `${Math.round(640 * zoom)}px`;
    return zoom;
  }
  function getZoom() { return zoom; }

  function exportPNG() {
    const output = document.createElement("canvas");
    output.width = size;
    output.height = size;
    const context = output.getContext("2d");
    context.imageSmoothingEnabled = false;
    compositePixels().forEach((color, index) => {
      if (color === EMPTY) return;
      context.fillStyle = color;
      context.fillRect(index % size, Math.floor(index / size), 1, 1);
    });
    const link = document.createElement("a");
    link.download = `pixel-art-${size}x${size}.png`;
    link.href = output.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    link.remove();
    return true;
  }

  buildGrid();
  setZoom(1);

  return {
    setTool, setColor, getColor, clear, resize, undo, redo, canUndo, canRedo,
    toggleGrid, setZoom, getZoom, exportPNG, flipHorizontal, flipVertical, rotate90,
    getState, loadState, getActiveLayerState, loadActiveLayerState, commitHistory: pushHistory,
    getLayerState, loadLayerState, addLayer, duplicateLayer, deleteLayer, setActiveLayer,
    toggleLayerVisibility, renameLayer, moveLayer,
    getSize: () => size, getEmptyColor: () => EMPTY
  };
})();