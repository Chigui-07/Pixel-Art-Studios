window.PixelAnimation = (() => {
  const timeline = document.getElementById("frameTimeline");
  const addBtn = document.getElementById("addFrameBtn");
  const duplicateBtn = document.getElementById("duplicateFrameBtn");
  const deleteBtn = document.getElementById("deleteFrameBtn");
  const playBtn = document.getElementById("playAnimationBtn");
  const stopBtn = document.getElementById("stopAnimationBtn");
  const fpsSelect = document.getElementById("fpsSelect");
  const exportSheetBtn = document.getElementById("exportSheetBtn");
  const frameStatus = document.getElementById("frameStatus");

  let frames = [];
  let currentIndex = 0;
  let timer = null;
  let isPlaying = false;

  function cloneState(state) {
    return { size: state.size, pixels: [...state.pixels] };
  }

  function blankState(size) {
    return { size, pixels: new Array(size * size).fill("#ffffff") };
  }

  function saveCurrent() {
    if (!frames[currentIndex]) return;
    frames[currentIndex].state = cloneState(window.PixelCanvas.getState());
  }

  function loadFrame(index) {
    if (!frames[index]) return;
    saveCurrent();
    currentIndex = index;
    window.PixelCanvas.loadState(cloneState(frames[index].state));
    renderTimeline();
    updateStatus();
  }

  function makeThumb(frame) {
    const thumb = document.createElement("div");
    thumb.className = "frame-thumb";
    const { size, pixels } = frame.state;
    thumb.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    pixels.forEach(color => {
      const px = document.createElement("span");
      px.style.background = color;
      thumb.appendChild(px);
    });
    return thumb;
  }

  function renderTimeline() {
    if (!timeline) return;
    timeline.innerHTML = "";
    frames.forEach((frame, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `frame-card${index === currentIndex ? " active" : ""}`;
      button.appendChild(makeThumb(frame));
      const label = document.createElement("span");
      label.textContent = `Frame ${index + 1}`;
      button.appendChild(label);
      button.addEventListener("click", () => loadFrame(index));
      timeline.appendChild(button);
    });
  }

  function updateStatus() {
    if (!frameStatus) return;
    frameStatus.textContent = `${frames.length} frame${frames.length === 1 ? "" : "s"} · activo ${currentIndex + 1}`;
    deleteBtn.disabled = frames.length <= 1;
    stopBtn.disabled = !isPlaying;
    playBtn.disabled = isPlaying || frames.length < 2;
  }

  function addFrame() {
    saveCurrent();
    const size = window.PixelCanvas.getSize();
    frames.splice(currentIndex + 1, 0, { state: blankState(size) });
    currentIndex++;
    window.PixelCanvas.loadState(cloneState(frames[currentIndex].state));
    renderTimeline();
    updateStatus();
  }

  function duplicateFrame() {
    saveCurrent();
    const copy = { state: cloneState(frames[currentIndex].state) };
    frames.splice(currentIndex + 1, 0, copy);
    currentIndex++;
    window.PixelCanvas.loadState(cloneState(copy.state));
    renderTimeline();
    updateStatus();
  }

  function deleteFrame() {
    if (frames.length <= 1) return;
    frames.splice(currentIndex, 1);
    currentIndex = Math.min(currentIndex, frames.length - 1);
    window.PixelCanvas.loadState(cloneState(frames[currentIndex].state));
    renderTimeline();
    updateStatus();
  }

  function play() {
    if (frames.length < 2 || isPlaying) return;
    saveCurrent();
    isPlaying = true;
    updateStatus();
    let playbackIndex = currentIndex;
    const frameMs = 1000 / Number(fpsSelect.value || 6);

    timer = setInterval(() => {
      playbackIndex = (playbackIndex + 1) % frames.length;
      currentIndex = playbackIndex;
      window.PixelCanvas.loadState(cloneState(frames[currentIndex].state), { resetHistory: false });
      renderTimeline();
      updateStatus();
    }, frameMs);
  }

  function stop() {
    if (!isPlaying) return;
    clearInterval(timer);
    timer = null;
    isPlaying = false;
    window.PixelCanvas.loadState(cloneState(frames[currentIndex].state));
    renderTimeline();
    updateStatus();
  }

  function exportSpriteSheet() {
    saveCurrent();
    const size = frames[0].state.size;
    if (!frames.every(frame => frame.state.size === size)) return;

    const sheet = document.createElement("canvas");
    sheet.width = size * frames.length;
    sheet.height = size;
    const ctx = sheet.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    frames.forEach((frame, frameIndex) => {
      frame.state.pixels.forEach((color, pixelIndex) => {
        ctx.fillStyle = color;
        ctx.fillRect(
          frameIndex * size + (pixelIndex % size),
          Math.floor(pixelIndex / size),
          1,
          1
        );
      });
    });

    const link = document.createElement("a");
    link.download = `spritesheet-${size}x${size}-${frames.length}frames.png`;
    link.href = sheet.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function resetForSize(size) {
    stop();
    frames = [{ state: blankState(Number(size)) }];
    currentIndex = 0;
    renderTimeline();
    updateStatus();
  }

  function syncCurrentFrame() {
    if (!isPlaying && frames[currentIndex]) {
      frames[currentIndex].state = cloneState(window.PixelCanvas.getState());
      renderTimeline();
    }
  }

  addBtn?.addEventListener("click", addFrame);
  duplicateBtn?.addEventListener("click", duplicateFrame);
  deleteBtn?.addEventListener("click", deleteFrame);
  playBtn?.addEventListener("click", play);
  stopBtn?.addEventListener("click", stop);
  exportSheetBtn?.addEventListener("click", exportSpriteSheet);
  fpsSelect?.addEventListener("change", () => {
    if (isPlaying) { stop(); play(); }
  });

  window.addEventListener("pixelhistorychange", syncCurrentFrame);
  window.addEventListener("pixelstatechange", () => {
    if (!isPlaying) syncCurrentFrame();
  });
  window.addEventListener("pixelsizechange", event => resetForSize(event.detail.size));

  frames = [{ state: cloneState(window.PixelCanvas.getState()) }];
  renderTimeline();
  updateStatus();

  return { addFrame, duplicateFrame, deleteFrame, play, stop, exportSpriteSheet, resetForSize };
})();