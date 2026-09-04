const toolGridElement = document.querySelector(".tool-buttons.tool-grid");
const handBtn = document.createElement("button");
handBtn.id = "handBtn";
handBtn.type = "button";
handBtn.textContent = "🖐️ Mano";
toolGridElement?.appendChild(handBtn);

const handStyle = document.createElement("style");
handStyle.textContent = `
  .canvas-viewport.hand-mode { cursor: grab; }
  .canvas-viewport.hand-mode.dragging { cursor: grabbing; }
  .canvas-viewport.hand-mode .pixel-canvas { cursor: inherit; }
`;
document.head.appendChild(handStyle);

const toolButtons = {
  pencil: document.getElementById("pencilBtn"),
  eraser: document.getElementById("eraserBtn"),
  fill: document.getElementById("fillBtn"),
  eyedropper: document.getElementById("eyedropperBtn"),
  line: document.getElementById("lineBtn"),
  rect: document.getElementById("rectBtn"),
  ellipse: document.getElementById("ellipseBtn"),
  hand: handBtn
};

const toolNames = {
  pencil: "Lápiz", eraser: "Borrador", fill: "Relleno", eyedropper: "Cuentagotas",
  line: "Línea", rect: "Rectángulo", ellipse: "Elipse", hand: "Mano"
};

const toolMessages = {
  pencil: "Lápiz activo: mantén presionado y arrastra.",
  eraser: "Borrador activo: mantén presionado y arrastra.",
  fill: "Relleno activo: haz clic dentro de una zona cerrada.",
  eyedropper: "Cuentagotas activo: haz clic en cualquier píxel para tomar su color.",
  line: "Línea activa: presiona el inicio y suelta en el final.",
  rect: "Rectángulo activo: presiona una esquina y suelta en la opuesta.",
  ellipse: "Elipse activa: presiona una esquina del área y suelta en la opuesta.",
  hand: "Mano activa: arrastra para desplazarte sin pintar."
};

const clearBtn = document.getElementById("clearBtn");
const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");
const gridBtn = document.getElementById("gridBtn");
const exportBtn = document.getElementById("exportBtn");
const flipHBtn = document.getElementById("flipHBtn");
const flipVBtn = document.getElementById("flipVBtn");
const rotateBtn = document.getElementById("rotateBtn");
const zoomInBtn = document.getElementById("zoomInBtn");
const zoomOutBtn = document.getElementById("zoomOutBtn");
const zoomLabel = document.getElementById("zoomLabel");
const sizeSelect = document.getElementById("sizeSelect");
const canvasSizeLabel = document.getElementById("canvasSizeLabel");
const colorPicker = document.getElementById("colorPicker");
const colorHex = document.getElementById("colorHex");
const lighterBtn = document.getElementById("lighterBtn");
const darkerBtn = document.getElementById("darkerBtn");
const quickPalette = document.getElementById("quickPalette");
const toolStatus = document.getElementById("toolStatus");
const actionStatus = document.getElementById("actionStatus");
const tutorialTitle = document.getElementById("tutorialTitle");
const tutorialMeta = document.getElementById("tutorialMeta");
const formatNote = document.getElementById("formatNote");
const instruction = document.getElementById("instruction");
const stepCounter = document.getElementById("stepCounter");
const progressBar = document.getElementById("progressBar");
const prevStep = document.getElementById("prevStep");
const nextStep = document.getElementById("nextStep");
const guideCanvas = document.getElementById("guideCanvas");
const stepColorSwatch = document.getElementById("stepColorSwatch");
const stepColorName = document.getElementById("stepColorName");
const formatTabs = [...document.querySelectorAll(".format-tab")];
const canvasViewport = document.getElementById("canvasViewport");

const paletteColors = [
  "#74232a", "#8f2d2d", "#d13b46", "#d94343", "#e94f55", "#ff7468",
  "#ffd0c7", "#6e2027", "#70452d", "#4f7f3d", "#5f9348", "#f2b84b",
  "#ffffff", "#1c1c24"
];

let currentSize = 16;
let currentStep = 0;
let gridVisible = true;
let statusTimer = null;
let activeTool = "pencil";
let temporaryHand = false;
let panning = false;
let panStartX = 0;
let panStartY = 0;
let panScrollLeft = 0;
let panScrollTop = 0;

function showStatus(message) {
  actionStatus.textContent = message;
  actionStatus.classList.add("visible");
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => actionStatus.classList.remove("visible"), 2200);
}

function currentTutorial() {
  return window.PixelTutorials.apple[currentSize] || null;
}

function setColor(color, announce = false) {
  const normalized = color.toLowerCase();
  colorPicker.value = normalized;
  colorHex.textContent = normalized.toUpperCase();
  window.PixelCanvas.setColor(normalized);
  if (announce) showStatus(`Color activo: ${normalized.toUpperCase()}`);
}

function adjustColor(amount) {
  const hex = window.PixelCanvas.getColor().replace("#", "");
  const channels = [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16));
  const adjusted = channels.map(v => Math.max(0, Math.min(255, v + amount)));
  setColor(`#${adjusted.map(v => v.toString(16).padStart(2, "0")).join("")}`, true);
}

function buildPalette() {
  quickPalette.innerHTML = "";
  paletteColors.forEach(color => {
    const swatch = document.createElement("button");
    swatch.type = "button";
    swatch.className = "palette-swatch";
    swatch.style.background = color;
    swatch.title = color.toUpperCase();
    swatch.setAttribute("aria-label", `Usar color ${color}`);
    swatch.addEventListener("click", () => setColor(color, true));
    quickPalette.appendChild(swatch);
  });
}

function refreshHandCursor() {
  const handMode = activeTool === "hand" || temporaryHand;
  canvasViewport?.classList.toggle("hand-mode", handMode);
  if (!handMode) canvasViewport?.classList.remove("dragging");
}

function setActiveTool(tool) {
  activeTool = tool;
  Object.entries(toolButtons).forEach(([name, button]) => button.classList.toggle("active", name === tool));
  toolStatus.textContent = toolNames[tool];
  window.PixelCanvas.setTool(tool);
  refreshHandCursor();
  showStatus(toolMessages[tool]);
}

function isHandMode() {
  return activeTool === "hand" || temporaryHand;
}

function startPan(event) {
  if (!isHandMode() || !canvasViewport) return;
  panning = true;
  panStartX = event.clientX;
  panStartY = event.clientY;
  panScrollLeft = canvasViewport.scrollLeft;
  panScrollTop = canvasViewport.scrollTop;
  canvasViewport.classList.add("dragging");
  event.preventDefault();
  event.stopPropagation();
}

function movePan(event) {
  if (!panning || !canvasViewport) return;
  canvasViewport.scrollLeft = panScrollLeft - (event.clientX - panStartX);
  canvasViewport.scrollTop = panScrollTop - (event.clientY - panStartY);
  event.preventDefault();
}

function stopPan() {
  if (!panning) return;
  panning = false;
  canvasViewport?.classList.remove("dragging");
}

canvasViewport?.addEventListener("pointerdown", startPan, true);
window.addEventListener("pointermove", movePan);
window.addEventListener("pointerup", stopPan);
window.addEventListener("pointercancel", stopPan);

function buildGuideCanvas() {
  const tutorial = currentTutorial();
  guideCanvas.innerHTML = "";
  if (!tutorial) return;
  guideCanvas.style.gridTemplateColumns = `repeat(${currentSize}, 1fr)`;
  for (let i = 0; i < currentSize * currentSize; i++) {
    const pixel = document.createElement("div");
    pixel.className = "guide-pixel";
    guideCanvas.appendChild(pixel);
  }
}

function renderGuide() {
  const tutorial = currentTutorial();
  if (!tutorial) return;
  const guidePixels = guideCanvas.children;
  Array.from(guidePixels).forEach(pixel => {
    pixel.style.background = "#ffffff";
    pixel.classList.remove("current-step-pixel");
  });
  tutorial.steps.forEach((step, stepIndex) => {
    if (stepIndex > currentStep) return;
    step.pixels.forEach(([x, y]) => {
      const pixel = guidePixels[y * currentSize + x];
      if (!pixel) return;
      pixel.style.background = step.pixelColors?.[`${x},${y}`] || step.color;
      if (stepIndex === currentStep) pixel.classList.add("current-step-pixel");
    });
  });
}

function renderTutorial() {
  const tutorial = currentTutorial();
  if (!tutorial) {
    tutorialTitle.textContent = "Modo libre";
    tutorialMeta.textContent = `${currentSize}×${currentSize} · Sin tutorial específico`;
    formatNote.textContent = "Este tamaño está disponible para crear y animar. La práctica de la manzana sigue disponible en 8×8, 16×16 y 32×32.";
    instruction.textContent = "Usa el lienzo libremente o cambia a uno de los tamaños de práctica para seguir el tutorial gráfico.";
    stepCounter.textContent = "Modo libre";
    progressBar.style.width = "0%";
    stepColorName.textContent = "Color libre";
    stepColorSwatch.style.background = window.PixelCanvas.getColor();
    prevStep.disabled = true;
    nextStep.disabled = true;
    guideCanvas.innerHTML = "";
    return;
  }

  nextStep.disabled = false;
  const step = tutorial.steps[currentStep];
  tutorialTitle.textContent = tutorial.title;
  tutorialMeta.textContent = tutorial.meta;
  formatNote.textContent = tutorial.note;
  instruction.textContent = step.text;
  stepCounter.textContent = `Paso ${currentStep + 1} de ${tutorial.steps.length}`;
  progressBar.style.width = `${((currentStep + 1) / tutorial.steps.length) * 100}%`;
  stepColorSwatch.style.background = step.color;
  stepColorName.textContent = step.colorName;
  setColor(step.color);
  prevStep.disabled = currentStep === 0;
  nextStep.textContent = currentStep === tutorial.steps.length - 1 ? "Terminado ✓" : "Siguiente →";
  renderGuide();
}

function setFormat(nextSize) {
  currentSize = Number(nextSize);
  currentStep = 0;
  sizeSelect.value = String(currentSize);
  canvasSizeLabel.textContent = `${currentSize} × ${currentSize}`;
  formatTabs.forEach(tab => tab.classList.toggle("active", Number(tab.dataset.size) === currentSize));
  window.PixelCanvas.resize(currentSize);
  buildGuideCanvas();
  renderTutorial();
  updateHistoryButtons();
  showStatus(`Formato cambiado a ${currentSize}×${currentSize}.`);
}

function updateHistoryButtons() {
  undoBtn.disabled = !window.PixelCanvas.canUndo();
  redoBtn.disabled = !window.PixelCanvas.canRedo();
}

function updateZoomLabel() { zoomLabel.textContent = `${Math.round(window.PixelCanvas.getZoom() * 100)}%`; }

Object.entries(toolButtons).forEach(([tool, button]) => button.addEventListener("click", () => setActiveTool(tool)));
colorPicker.addEventListener("input", event => setColor(event.target.value));
lighterBtn?.addEventListener("click", () => adjustColor(18));
darkerBtn?.addEventListener("click", () => adjustColor(-18));
clearBtn.addEventListener("click", () => showStatus(window.PixelCanvas.clear() ? "Lienzo limpiado." : "El lienzo ya está vacío."));
undoBtn.addEventListener("click", () => { if (window.PixelCanvas.undo()) showStatus("Acción deshecha."); });
redoBtn.addEventListener("click", () => { if (window.PixelCanvas.redo()) showStatus("Acción rehecha."); });
exportBtn.addEventListener("click", () => { window.PixelCanvas.exportPNG(); showStatus(`PNG ${currentSize}×${currentSize} exportado.`); });
flipHBtn.addEventListener("click", () => { window.PixelCanvas.flipHorizontal(); showStatus("Lienzo volteado horizontalmente."); });
flipVBtn.addEventListener("click", () => { window.PixelCanvas.flipVertical(); showStatus("Lienzo volteado verticalmente."); });
rotateBtn.addEventListener("click", () => { window.PixelCanvas.rotate90(); showStatus("Lienzo rotado 90°."); });
sizeSelect.addEventListener("change", event => setFormat(event.target.value));
formatTabs.forEach(tab => tab.addEventListener("click", () => setFormat(tab.dataset.size)));

gridBtn.addEventListener("click", () => {
  gridVisible = window.PixelCanvas.toggleGrid();
  gridBtn.classList.toggle("active", gridVisible);
  gridBtn.textContent = gridVisible ? "# Cuadrícula" : "# Sin cuadrícula";
  showStatus(gridVisible ? "Cuadrícula visible." : "Cuadrícula oculta.");
});

zoomInBtn.addEventListener("click", () => {
  window.PixelCanvas.setZoom(window.PixelCanvas.getZoom() + 0.15);
  updateZoomLabel();
});
zoomOutBtn.addEventListener("click", () => {
  window.PixelCanvas.setZoom(window.PixelCanvas.getZoom() - 0.15);
  updateZoomLabel();
});

prevStep.addEventListener("click", () => {
  if (currentStep > 0) { currentStep--; renderTutorial(); }
});
nextStep.addEventListener("click", () => {
  const tutorial = currentTutorial();
  if (!tutorial) return;
  if (currentStep < tutorial.steps.length - 1) { currentStep++; renderTutorial(); }
  else showStatus("Tutorial completado. 🍎");
});

window.addEventListener("pixelhistorychange", updateHistoryButtons);
window.addEventListener("pixelcolorpicked", event => setColor(event.detail.color, true));

document.addEventListener("keydown", event => {
  const tag = document.activeElement?.tagName;
  if (["INPUT", "SELECT", "TEXTAREA"].includes(tag)) return;

  if (event.code === "Space" && !event.repeat) {
    event.preventDefault();
    temporaryHand = true;
    refreshHandCursor();
    return;
  }

  const key = event.key.toLowerCase();
  if ((event.ctrlKey || event.metaKey) && key === "z") {
    event.preventDefault();
    event.shiftKey ? window.PixelCanvas.redo() : window.PixelCanvas.undo();
    return;
  }
  if ((event.ctrlKey || event.metaKey) && key === "y") {
    event.preventDefault();
    window.PixelCanvas.redo();
    return;
  }
  const shortcuts = { p: "pencil", e: "eraser", f: "fill", i: "eyedropper", l: "line", r: "rect", o: "ellipse", h: "hand" };
  if (shortcuts[key]) setActiveTool(shortcuts[key]);
});

document.addEventListener("keyup", event => {
  if (event.code !== "Space") return;
  temporaryHand = false;
  stopPan();
  refreshHandCursor();
});

window.addEventListener("blur", () => {
  temporaryHand = false;
  stopPan();
  refreshHandCursor();
});

buildPalette();
buildGuideCanvas();
setActiveTool("pencil");
renderTutorial();
updateHistoryButtons();
updateZoomLabel();