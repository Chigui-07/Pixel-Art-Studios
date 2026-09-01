window.PixelCanvas = (() => {
  const EMPTY = "#ffffff";
  const MAX_HISTORY = 60;

  let size = 16;
  let currentTool = "pencil";
  let currentColor = "#e94f37";
  let drawing = false;
  let lastPaintedPixel = null;
  let shapeStart = null;
  let shapeEnd = null;
  let history = [];
  let historyIndex = -1;
  let zoom = 1;

  const canvas = document.getElementById("pixelCanvas");
  const paintedPixels = document.getElementById("paintedPixels");
  const coordinateLabel = document.getElementById("coordinateLabel");

  function normalizeColor(color) {
    if (!color) return EMPTY;
    if (color.startsWith("rgb")) {
      const values = color.match(/\d+/g)?.slice(0, 3).map(Number) || [255, 255, 255];
      return `#${values.map(value => value.toString(16).padStart(2, "0")).join("")}`;
    }
    return color.toLowerCase();
  }

  function getPixels() {
    return [...canvas.children];
  }

  function getPixelColor(pixel) {
    if (!pixel) return EMPTY;
    return normalizeColor(pixel.style.background || EMPTY);
  }

  function setPixelColor(pixel, color) {
    if (!pixel) return;
    const normalized = normalizeColor(color);
    pixel.style.background = normalized;
    pixel.dataset.painted = normalized === EMPTY ? "false" : "true";
  }

  function updateCounter() {
    const count = getPixels().filter(pixel => pixel.dataset.painted === "true").length;
    paintedPixels.textContent = `${count} píxel${count === 1 ? "" : "es"} usado${count === 1 ? "" : "s"}`;
  }

  function snapshot() {
    return getPixels().map(getPixelColor);
  }

  function restore(state) {
    if (!state || state.length !== size * size) return;
    getPixels().forEach((pixel, index) => setPixelColor(pixel, state[index]));
    updateCounter();
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

  function canUndo() {
    return historyIndex > 0;
  }

  function canRedo() {
    return historyIndex < history.length - 1;
  }

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
    updateCounter();
  }

  function floodFill(startPixel) {
    const target = getPixelColor(startPixel);
    const replacement = normalizeColor(currentColor);
    if (target === replacement) return false;

    const start = coordsFromPixel(startPixel);
    const queue = [start];
    let cursor = 0;
    const visited = new Set();

    while (cursor < queue.length) {
      const point = queue[cursor++];
      const key = `${point.x},${point.y}`;
      if (visited.has(key)) continue;
      visited.add(key);

      const pixel = pixelAt(point.x, point.y);
      if (!pixel || getPixelColor(pixel) !== target) continue;

      setPixelColor(pixel, replacement);
      queue.push(
        { x: point.x + 1, y: point.y },
        { x: point.x - 1, y: point.y },
        { x: point.x, y: point.y + 1 },
        { x: point.x, y: point.y - 1 }
      );
    }

    updateCounter();
    return true;
  }

  function drawLine(from, to) {
    let x0 = from.x;
    let y0 = from.y;
    const x1 = to.x;
    const y1 = to.y;
    const dx = Math.abs(x1 - x0);
    const sx = x0 < x1 ? 1 : -1;
    const dy = -Math.abs(y1 - y0);
    const sy = y0 < y1 ? 1 : -1;
    let error = dx + dy;

    while (true) {
      setPixelColor(pixelAt(x0, y0), currentColor);
      if (x0 === x1 && y0 === y1) break;
      const twice = 2 * error;
      if (twice >= dy) {
        error += dy;
        x0 += sx;
      }
      if (twice <= dx) {
        error += dx;
        y0 += sy;
      }
    }
  }

  function drawRectangle(from, to) {
    const minX = Math.min(from.x, to.x);
    const maxX = Math.max(from.x, to.x);
    const minY = Math.min(from.y, to.y);
    const maxY = Math.max(from.y, to.y);

    for (let x = minX; x <= maxX; x++) {
      setPixelColor(pixelAt(x, minY), currentColor);
      setPixelColor(pixelAt(x, maxY), currentColor);
    }
    for (let y = minY; y <= maxY; y++) {
      setPixelColor(pixelAt(minX, y), currentColor);
      setPixelColor(pixelAt(maxX, y), currentColor);
    }
  }

  function finishShape() {
    if (!shapeStart || !shapeEnd) return false;
    if (currentTool === "line") drawLine(shapeStart, shapeEnd);
    if (currentTool === "rect") drawRectangle(shapeStart, shapeEnd);
    updateCounter();
    pushHistory();
    return true;
  }

  function stopDrawing() {
    if (!drawing) return;

    if (currentTool === "line" || currentTool === "rect") {
      finishShape();
    } else if (currentTool === "pencil" || currentTool === "eraser") {
      pushHistory();
    }

    drawing = false;
    lastPaintedPixel = null;
    shapeStart = null;
    shapeEnd = null;
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
      pixel.style.background = EMPTY;
      canvas.appendChild(pixel);
    }

    history = [];
    historyIndex = -1;
    updateCounter();
    pushHistory();
  }

  canvas.addEventListener("pointerdown", event => {
    const pixel = event.target.closest(".pixel");
    if (!pixel) return;

    const coords = coordsFromPixel(pixel);
    coordinateLabel.textContent = `x: ${coords.x} · y: ${coords.y}`;

    if (currentTool === "eyedropper") {
      const picked = getPixelColor(pixel);
      setColor(picked);
      window.dispatchEvent(new CustomEvent("pixelcolorpicked", { detail: { color: picked } }));
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

    if (currentTool === "line" || currentTool === "rect") {
      shapeStart = coords;
      shapeEnd = coords;
    } else {
      applyDirect(pixel);
    }

    try {
      canvas.setPointerCapture(event.pointerId);
    } catch (_) {}

    event.preventDefault();
  });

  canvas.addEventListener("pointermove", event => {
    const pixel = pixelFromPointer(event);

    if (pixel) {
      const coords = coordsFromPixel(pixel);
      coordinateLabel.textContent = `x: ${coords.x} · y: ${coords.y}`;

      if (drawing && (currentTool === "line" || currentTool === "rect")) {
        shapeEnd = coords;
      }
    }

    if (!drawing || (currentTool !== "pencil" && currentTool !== "eraser")) return;
    if (pixel) applyDirect(pixel);
    event.preventDefault();
  });

  canvas.addEventListener("pointerleave", () => {
    coordinateLabel.textContent = "x: — · y: —";
    if (drawing && (currentTool === "pencil" || currentTool === "eraser")) {
      lastPaintedPixel = null;
    }
  });

  canvas.addEventListener("pointerup", event => {
    try {
      canvas.releasePointerCapture(event.pointerId);
    } catch (_) {}
    stopDrawing();
  });

  window.addEventListener("pointerup", stopDrawing);
  window.addEventListener("pointercancel", stopDrawing);
  window.addEventListener("blur", stopDrawing);
  canvas.addEventListener("contextmenu", event => event.preventDefault());

  function setTool(tool) {
    currentTool = tool;
    stopDrawing();
  }

  function setColor(color) {
    currentColor = normalizeColor(color);
  }

  function getColor() {
    return currentColor;
  }

  function clear() {
    const hasPaint = getPixels().some(pixel => pixel.dataset.painted === "true");
    if (!hasPaint) return false;
    getPixels().forEach(pixel => setPixelColor(pixel, EMPTY));
    updateCounter();
    pushHistory();
    return true;
  }

  function resize(newSize) {
    buildGrid(newSize);
  }

  function toggleGrid(force) {
    const show = typeof force === "boolean" ? force : canvas.classList.contains("grid-hidden");
    canvas.classList.toggle("grid-hidden", !show);
    return show;
  }

  function setZoom(nextZoom) {
    zoom = Math.min(1.75, Math.max(0.6, Number(nextZoom)));
    canvas.style.width = `${Math.round(640 * zoom)}px`;
    return zoom;
  }

  function getZoom() {
    return zoom;
  }

  function exportPNG() {
    const output = document.createElement("canvas");
    output.width = size;
    output.height = size;
    const context = output.getContext("2d");
    context.imageSmoothingEnabled = false;

    getPixels().forEach((pixel, index) => {
      context.fillStyle = getPixelColor(pixel);
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
    setTool,
    setColor,
    getColor,
    clear,
    resize,
    undo,
    redo,
    canUndo,
    canRedo,
    toggleGrid,
    setZoom,
    getZoom,
    exportPNG,
    getSize: () => size
  };
})();