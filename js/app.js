const toolButtons = {
  pencil: document.getElementById("pencilBtn"),
  eraser: document.getElementById("eraserBtn"),
  fill: document.getElementById("fillBtn"),
  eyedropper: document.getElementById("eyedropperBtn"),
  line: document.getElementById("lineBtn"),
  rect: document.getElementById("rectBtn"),
  ellipse: document.getElementById("ellipseBtn")
};

const toolNames = {
  pencil: "Lápiz",
  eraser: "Borrador",
  fill: "Relleno",
  eyedropper: "Cuentagotas",
  line: "Línea",
  rect: "Rectángulo",
  ellipse: "Elipse"
};

const toolMessages = {
  pencil: "Lápiz activo: mantén presionado y arrastra.",
  eraser: "Borrador activo: mantén presionado y arrastra.",
  fill: "Relleno activo: haz clic dentro de una zona cerrada.",
  eyedropper: "Cuentagotas activo: haz clic en cualquier píxel para tomar su color.",
  line: "Línea activa: presiona el inicio y suelta en el final.",
  rect: "Rectángulo activo: presiona una esquina y suelta en la opuesta.",
  ellipse: "Elipse activa: presiona una esquina del área y suelta en la opuesta."
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

const paletteColors = [
  "#74232a", "#8f2d2d", "#d13b46", "#d94343", "#e94f55", "#ff7468",
  "#ffd0c7", "#6e2027", "#70452d", "#4f7f3d", "#5f9348", "#f2b84b",
  "#ffffff", "#1c1c24"
];

let currentSize = 16;
let currentStep = 0;
let gridVisible = true;
let statusTimer = null;

function showStatus(message) {
  actionStatus.textContent = message;
  actionStatus.classList.add("visible");
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => actionStatus.classList.remove("visible"), 2200);
}

function currentTutorial() { return window.PixelTutorials.apple[currentSize]; }

function setColor(color, announce = false) {
  const normalized = color.toLowerCase();
  colorPicker.value = normalized;
  colorHex.textContent = normalized.toUpperCase();
  window.PixelCanvas.setColor(normalized);
  if (announce) showStatus(`Color activo: ${normalized.toUpperCase()}`);
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

function setActiveTool(tool) {
  Object.entries(toolButtons).forEach(([name, button]) => button.classList.toggle("active", name === tool));
  toolStatus.textContent = toolNames[tool];
  window.PixelCanvas.setTool(tool);
  showStatus(toolMessages[tool]);
}

function buildGuideCanvas() {
  guideCanvas.innerHTML = "";
  guideCanvas.style.gridTemplateColumns = `repeat(${currentSize}, 1fr)`;
  for (let i = 0; i < currentSize * currentSize; i++) {
    const pixel = document.createElement("div");
    pixel.className = "guide-pixel";
    guideCanvas.appendChild(pixel);
  }
}

function getPixelIndex(x, y) { return y * currentSize + x; }

function renderGuide() {
  const tutorial = currentTutorial();
  const guidePixels = guideCanvas.children;
  Array.from(guidePixels).forEach(pixel => {
    pixel.style.background = "#ffffff";
    pixel.classList.remove("current-step-pixel");
  });

  tutorial.steps.forEach((step, stepIndex) => {
    if (stepIndex > currentStep) return;
    step.pixels.forEach(([x, y]) => {
      const pixel = guidePixels[getPixelIndex(x, y)];
      if (!pixel) return;
      const customColor = step.pixelColors?.[`${x},${y}`];
      pixel.style.background = customColor || step.color;
      if (stepIndex === currentStep) pixel.classList.add("current-step-pixel");
    });
  });
}

function renderTutorial() {
  const tutorial = currentTutorial();
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
  showStatus(`Formato cambiado a ${currentSize}×${currentSize}. El lienzo se reinició.`);
}

function updateHistoryButtons() {
  undoBtn.disabled = !window.PixelCanvas.canUndo();
  redoBtn.disabled = !window.PixelCanvas.canRedo();
}

function updateZoomLabel() { zoomLabel.textContent = `${Math.round(window.PixelCanvas.getZoom() * 100)}%`; }

Object.entries(toolButtons).forEach(([tool, button]) => button.addEventListener("click", () => setActiveTool(tool)));
colorPicker.addEventListener("input", event => setColor(event.target.value));

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
  showStatus(`Zoom: ${zoomLabel.textContent}`);
});
zoomOutBtn.addEventListener("click", () => {
  window.PixelCanvas.setZoom(window.PixelCanvas.getZoom() - 0.15);
  updateZoomLabel();
  showStatus(`Zoom: ${zoomLabel.textContent}`);
});

prevStep.addEventListener("click", () => { if (currentStep > 0) { currentStep--; renderTutorial(); } });
nextStep.addEventListener("click", () => {
  const tutorial = currentTutorial();
  if (currentStep < tutorial.steps.length - 1) { currentStep++; renderTutorial(); }
  else showStatus("Tutorial completado. 🍎");
});

window.addEventListener("pixelhistorychange", updateHistoryButtons);
window.addEventListener("pixelcolorpicked", event => {
  setColor(event.detail.color);
  showStatus(`Color tomado: ${event.detail.color.toUpperCase()}`);
});

document.addEventListener("keydown", event => {
  const tag = document.activeElement?.tagName;
  if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
  const key = event.key.toLowerCase();
  if ((event.ctrlKey || event.metaKey) && key === "z") {
    event.preventDefault();
    if (event.shiftKey) window.PixelCanvas.redo(); else window.PixelCanvas.undo();
    return;
  }
  if ((event.ctrlKey || event.metaKey) && key === "y") {
    event.preventDefault();
    window.PixelCanvas.redo();
    return;
  }
  const shortcuts = { p: "pencil", e: "eraser", f: "fill", i: "eyedropper", l: "line", r: "rect", o: "ellipse" };
  if (shortcuts[key]) setActiveTool(shortcuts[key]);
});

buildPalette();
buildGuideCanvas();
setActiveTool("pencil");
renderTutorial();
updateHistoryButtons();
updateZoomLabel();