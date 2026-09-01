window.PixelCanvas = (() => {
  const size = 16;
  let currentTool = "pencil";
  let currentColor = "#e94f37";
  let drawing = false;
  let lastPaintedPixel = null;

  const canvas = document.getElementById("pixelCanvas");
  const paintedPixels = document.getElementById("paintedPixels");

  function updateCounter() {
    const count = [...canvas.children].filter(pixel => pixel.dataset.painted === "true").length;
    paintedPixels.textContent = `${count} píxel${count === 1 ? "" : "es"} usado${count === 1 ? "" : "s"}`;
  }

  function paint(pixel) {
    if (!pixel || !pixel.classList.contains("pixel") || pixel === lastPaintedPixel) return;

    if (currentTool === "eraser") {
      pixel.style.background = "#ffffff";
      pixel.dataset.painted = "false";
    } else {
      pixel.style.background = currentColor;
      pixel.dataset.painted = "true";
    }

    lastPaintedPixel = pixel;
    updateCounter();
  }

  function stopDrawing() {
    drawing = false;
    lastPaintedPixel = null;
  }

  function buildGrid() {
    canvas.innerHTML = "";

    for (let i = 0; i < size * size; i++) {
      const pixel = document.createElement("div");
      pixel.className = "pixel";
      pixel.dataset.painted = "false";
      canvas.appendChild(pixel);
    }

    updateCounter();
  }

  canvas.addEventListener("pointerdown", event => {
    const pixel = event.target.closest(".pixel");
    if (!pixel) return;

    drawing = true;
    lastPaintedPixel = null;
    paint(pixel);
    event.preventDefault();
  });

  canvas.addEventListener("pointermove", event => {
    if (!drawing) return;

    const element = document.elementFromPoint(event.clientX, event.clientY);
    const pixel = element?.closest?.(".pixel");

    if (pixel && canvas.contains(pixel)) {
      paint(pixel);
    }

    event.preventDefault();
  });

  canvas.addEventListener("pointerleave", () => {
    if (drawing) lastPaintedPixel = null;
  });

  window.addEventListener("pointerup", stopDrawing);
  window.addEventListener("pointercancel", stopDrawing);
  window.addEventListener("blur", stopDrawing);

  canvas.addEventListener("contextmenu", event => event.preventDefault());

  function setTool(tool) {
    currentTool = tool;
  }

  function setColor(color) {
    currentColor = color;
  }

  function clear() {
    [...canvas.children].forEach(pixel => {
      pixel.style.background = "#ffffff";
      pixel.dataset.painted = "false";
    });
    updateCounter();
  }

  buildGrid();

  return {
    setTool,
    setColor,
    clear
  };
})();