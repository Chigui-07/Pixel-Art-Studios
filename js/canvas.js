window.PixelCanvas = (() => {
  const size = 16;
  let currentTool = "pencil";
  let currentColor = "#e94f37";
  let drawing = false;

  const canvas = document.getElementById("pixelCanvas");
  const paintedPixels = document.getElementById("paintedPixels");

  function updateCounter() {
    const count = [...canvas.children].filter(pixel => pixel.dataset.painted === "true").length;
    paintedPixels.textContent = `${count} píxel${count === 1 ? "" : "es"} usado${count === 1 ? "" : "s"}`;
  }

  function paint(pixel) {
    if (!pixel || !pixel.classList.contains("pixel")) return;

    if (currentTool === "eraser") {
      pixel.style.background = "#ffffff";
      pixel.dataset.painted = "false";
    } else {
      pixel.style.background = currentColor;
      pixel.dataset.painted = "true";
    }

    updateCounter();
  }

  function buildGrid() {
    canvas.innerHTML = "";

    for (let i = 0; i < size * size; i++) {
      const pixel = document.createElement("div");
      pixel.className = "pixel";
      pixel.dataset.painted = "false";

      pixel.addEventListener("pointerdown", event => {
        drawing = true;
        event.currentTarget.setPointerCapture?.(event.pointerId);
        paint(pixel);
      });

      pixel.addEventListener("pointerenter", () => {
        if (drawing) paint(pixel);
      });

      canvas.appendChild(pixel);
    }

    updateCounter();
  }

  window.addEventListener("pointerup", () => {
    drawing = false;
  });

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