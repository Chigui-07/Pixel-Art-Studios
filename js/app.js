const pencilBtn = document.getElementById("pencilBtn");
const eraserBtn = document.getElementById("eraserBtn");
const clearBtn = document.getElementById("clearBtn");
const colorPicker = document.getElementById("colorPicker");
const toolStatus = document.getElementById("toolStatus");
const tutorialTitle = document.getElementById("tutorialTitle");
const tutorialMeta = document.getElementById("tutorialMeta");
const instruction = document.getElementById("instruction");
const stepCounter = document.getElementById("stepCounter");
const progressBar = document.getElementById("progressBar");
const prevStep = document.getElementById("prevStep");
const nextStep = document.getElementById("nextStep");
const guideCanvas = document.getElementById("guideCanvas");
const stepColorSwatch = document.getElementById("stepColorSwatch");
const stepColorName = document.getElementById("stepColorName");

const tutorial = window.PixelTutorials.apple;
let currentStep = 0;

function setActiveTool(tool) {
  const pencilActive = tool === "pencil";
  pencilBtn.classList.toggle("active", pencilActive);
  eraserBtn.classList.toggle("active", !pencilActive);
  toolStatus.textContent = pencilActive ? "Lápiz" : "Borrador";
  window.PixelCanvas.setTool(tool);
}

function buildGuideCanvas() {
  guideCanvas.innerHTML = "";
  for (let i = 0; i < 256; i++) {
    const pixel = document.createElement("div");
    pixel.className = "guide-pixel";
    guideCanvas.appendChild(pixel);
  }
}

function getPixelIndex(x, y) {
  return y * 16 + x;
}

function renderGuide() {
  const guidePixels = guideCanvas.children;

  Array.from(guidePixels).forEach(pixel => {
    pixel.style.background = "#ffffff";
    pixel.classList.remove("current-step-pixel");
  });

  tutorial.steps.forEach((step, stepIndex) => {
    if (stepIndex > currentStep) return;

    step.pixels.forEach(([x, y]) => {
      const pixel = guidePixels[getPixelIndex(x, y)];
      const customColor = step.pixelColors?.[`${x},${y}`];
      pixel.style.background = customColor || step.color;

      if (stepIndex === currentStep) {
        pixel.classList.add("current-step-pixel");
      }
    });
  });
}

function renderTutorial() {
  const step = tutorial.steps[currentStep];

  tutorialTitle.textContent = tutorial.title;
  tutorialMeta.textContent = tutorial.meta;
  instruction.textContent = step.text;
  stepCounter.textContent = `Paso ${currentStep + 1} de ${tutorial.steps.length}`;
  progressBar.style.width = `${((currentStep + 1) / tutorial.steps.length) * 100}%`;
  stepColorSwatch.style.background = step.color;
  stepColorName.textContent = step.colorName;
  colorPicker.value = step.color;
  window.PixelCanvas.setColor(step.color);

  prevStep.disabled = currentStep === 0;
  nextStep.textContent = currentStep === tutorial.steps.length - 1 ? "Terminado ✓" : "Siguiente →";

  renderGuide();
}

pencilBtn.addEventListener("click", () => setActiveTool("pencil"));
eraserBtn.addEventListener("click", () => setActiveTool("eraser"));
clearBtn.addEventListener("click", () => window.PixelCanvas.clear());
colorPicker.addEventListener("input", event => window.PixelCanvas.setColor(event.target.value));

prevStep.addEventListener("click", () => {
  if (currentStep > 0) {
    currentStep--;
    renderTutorial();
  }
});

nextStep.addEventListener("click", () => {
  if (currentStep < tutorial.steps.length - 1) {
    currentStep++;
    renderTutorial();
  }
});

buildGuideCanvas();
setActiveTool("pencil");
renderTutorial();