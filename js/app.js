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

const tutorial = window.PixelTutorials.apple;
let currentStep = 0;

function setActiveTool(tool) {
  const pencilActive = tool === "pencil";
  pencilBtn.classList.toggle("active", pencilActive);
  eraserBtn.classList.toggle("active", !pencilActive);
  toolStatus.textContent = pencilActive ? "Lápiz" : "Borrador";
  window.PixelCanvas.setTool(tool);
}

function renderTutorial() {
  tutorialTitle.textContent = tutorial.title;
  tutorialMeta.textContent = tutorial.meta;
  instruction.textContent = tutorial.steps[currentStep];
  stepCounter.textContent = `Paso ${currentStep + 1} de ${tutorial.steps.length}`;
  progressBar.style.width = `${((currentStep + 1) / tutorial.steps.length) * 100}%`;
  prevStep.disabled = currentStep === 0;
  nextStep.textContent = currentStep === tutorial.steps.length - 1 ? "Terminado ✓" : "Siguiente →";
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

setActiveTool("pencil");
renderTutorial();