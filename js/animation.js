window.PixelAnimation = (() => {
  const timeline = document.getElementById("frameTimeline");
  const controls = document.querySelector(".animation-controls");
  const addBtn = document.getElementById("addFrameBtn");
  const duplicateBtn = document.getElementById("duplicateFrameBtn");
  const deleteBtn = document.getElementById("deleteFrameBtn");
  const playBtn = document.getElementById("playAnimationBtn");
  const stopBtn = document.getElementById("stopAnimationBtn");
  const fpsSelect = document.getElementById("fpsSelect");
  const exportSheetBtn = document.getElementById("exportSheetBtn");
  const frameStatus = document.getElementById("frameStatus");
  const pixelCanvas = document.getElementById("pixelCanvas");

  let frames = [];
  let currentIndex = 0;
  let timer = null;
  let isPlaying = false;
  let onionEnabled = true;
  let onionOpacity = 0.28;

  function installStyles() {
    if (document.getElementById("animationProStyles")) return;
    const style = document.createElement("style");
    style.id = "animationProStyles";
    style.textContent = `
      .animation-pro-controls { display:flex; flex-wrap:wrap; gap:.55rem; align-items:end; margin:.75rem 0 1rem; }
      .animation-pro-controls label { display:grid; gap:.25rem; color:var(--muted); font-size:.78rem; }
      .animation-pro-controls input[type="number"] { width:105px; padding:.68rem; border:1px solid var(--border); background:var(--panel-2); color:var(--text); }
      .animation-pro-controls input[type="range"] { width:120px; accent-color:var(--accent); }
      .frame-card { position:relative; }
      .frame-card .frame-meta { color:var(--muted); font-size:.67rem; }
      .frame-card.drag-target { border-color:var(--accent-2); }
      .pixel { position:relative; }
      .pixel.onion-pixel::after { content:""; position:absolute; inset:0; pointer-events:none; background:var(--onion-color); opacity:var(--onion-opacity,.28); }
      .onion-toggle.active { border-color:var(--accent); box-shadow:inset 0 0 0 1px var(--accent); }
      .timeline-help { margin:.3rem 0 0; color:var(--muted); font-size:.75rem; }
    `;
    document.head.appendChild(style);
  }

  function installControls() {
    if (!controls || document.getElementById("frameDurationInput")) return;

    const extra = document.createElement("div");
    extra.className = "animation-pro-controls";
    extra.innerHTML = `
      <button id="moveFrameLeftBtn" type="button">← Mover frame</button>
      <button id="moveFrameRightBtn" type="button">Mover frame →</button>
      <label>Duración del frame (ms)
        <input id="frameDurationInput" type="number" min="40" max="5000" step="10" value="167">
      </label>
      <button id="onionToggleBtn" class="onion-toggle active" type="button">🧅 Onion skin</button>
      <label>Opacidad onion
        <input id="onionOpacityInput" type="range" min="10" max="70" step="5" value="30">
      </label>
    `;
    controls.insertAdjacentElement("afterend", extra);

    const help = document.createElement("p");
    help.className = "timeline-help";
    help.textContent = "El onion skin muestra el frame anterior sobre los píxeles vacíos del frame actual. Cada frame puede tener una duración diferente.";
    extra.insertAdjacentElement("afterend", help);

    document.getElementById("moveFrameLeftBtn")?.addEventListener("click", () => moveFrame(-1));
    document.getElementById("moveFrameRightBtn")?.addEventListener("click", () => moveFrame(1));
    document.getElementById("frameDurationInput")?.addEventListener("change", event => {
      if (!frames[currentIndex]) return;
      const next = Math.max(40, Math.min(5000, Number(event.target.value) || defaultDuration()));
      frames[currentIndex].durationMs = next;
      event.target.value = String(next);
      renderTimeline();
      updateStatus();
    });
    document.getElementById("onionToggleBtn")?.addEventListener("click", event => {
      onionEnabled = !onionEnabled;
      event.currentTarget.classList.toggle("active", onionEnabled);
      event.currentTarget.textContent = onionEnabled ? "🧅 Onion skin" : "🧅 Onion apagado";
      renderOnionSkin();
    });
    document.getElementById("onionOpacityInput")?.addEventListener("input", event => {
      onionOpacity = Number(event.target.value) / 100;
      renderOnionSkin();
    });
  }

  function updateVersionBadge() {
    const version = document.querySelector(".version");
    if (version) version.textContent = "v0.4.1";
    document.querySelectorAll(".mini-badge").forEach(badge => {
      if (/^v0\.4$/.test(badge.textContent.trim())) badge.textContent = "v0.4.1";
    });
  }

  function defaultDuration() {
    return Math.round(1000 / Number(fpsSelect?.value || 6));
  }

  function cloneState(state) {
    return { size: state.size, pixels: [...state.pixels] };
  }

  function makeFrame(state) {
    return { state: cloneState(state), durationMs: defaultDuration() };
  }

  function blankState(size) {
    return { size, pixels: new Array(size * size).fill("#ffffff") };
  }

  function saveCurrent() {
    if (!frames[currentIndex] || isPlaying) return;
    frames[currentIndex].state = cloneState(window.PixelCanvas.getState());
  }

  function clearOnionSkin() {
    if (!pixelCanvas) return;
    [...pixelCanvas.children].forEach(pixel => {
      pixel.classList.remove("onion-pixel");
      pixel.style.removeProperty("--onion-color");
      pixel.style.removeProperty("--onion-opacity");
    });
  }

  function renderOnionSkin() {
    clearOnionSkin();
    if (!onionEnabled || isPlaying || currentIndex <= 0 || !pixelCanvas) return;

    const previous = frames[currentIndex - 1]?.state;
    const current = frames[currentIndex]?.state;
    if (!previous || !current || previous.size !== current.size) return;

    [...pixelCanvas.children].forEach((pixel, index) => {
      const currentColor = current.pixels[index]?.toLowerCase();
      const previousColor = previous.pixels[index]?.toLowerCase();
      if ((currentColor === "#ffffff" || !currentColor) && previousColor && previousColor !== "#ffffff") {
        pixel.classList.add("onion-pixel");
        pixel.style.setProperty("--onion-color", previousColor);
        pixel.style.setProperty("--onion-opacity", String(onionOpacity));
      }
    });
  }

  function updateDurationControl() {
    const input = document.getElementById("frameDurationInput");
    if (input && frames[currentIndex]) input.value = String(frames[currentIndex].durationMs);
  }

  function loadFrame(index) {
    if (!frames[index] || isPlaying) return;
    saveCurrent();
    currentIndex = index;
    window.PixelCanvas.loadState(cloneState(frames[index].state));
    renderTimeline();
    updateStatus();
    updateDurationControl();
    renderOnionSkin();
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

      const meta = document.createElement("span");
      meta.className = "frame-meta";
      meta.textContent = `${frame.durationMs} ms`;
      button.appendChild(meta);

      button.addEventListener("click", () => loadFrame(index));
      timeline.appendChild(button);
    });
  }

  function updateStatus() {
    if (!frameStatus) return;
    const duration = frames[currentIndex]?.durationMs || defaultDuration();
    frameStatus.textContent = `${frames.length} frame${frames.length === 1 ? "" : "s"} · activo ${currentIndex + 1} · ${duration} ms`;
    deleteBtn.disabled = frames.length <= 1 || isPlaying;
    duplicateBtn.disabled = isPlaying;
    addBtn.disabled = isPlaying;
    stopBtn.disabled = !isPlaying;
    playBtn.disabled = isPlaying || frames.length < 2;

    const left = document.getElementById("moveFrameLeftBtn");
    const right = document.getElementById("moveFrameRightBtn");
    if (left) left.disabled = currentIndex <= 0 || isPlaying;
    if (right) right.disabled = currentIndex >= frames.length - 1 || isPlaying;
  }

  function addFrame() {
    saveCurrent();
    const size = window.PixelCanvas.getSize();
    frames.splice(currentIndex + 1, 0, makeFrame(blankState(size)));
    currentIndex++;
    window.PixelCanvas.loadState(cloneState(frames[currentIndex].state));
    renderTimeline();
    updateStatus();
    updateDurationControl();
    renderOnionSkin();
  }

  function duplicateFrame() {
    saveCurrent();
    const source = frames[currentIndex];
    const copy = { state: cloneState(source.state), durationMs: source.durationMs };
    frames.splice(currentIndex + 1, 0, copy);
    currentIndex++;
    window.PixelCanvas.loadState(cloneState(copy.state));
    renderTimeline();
    updateStatus();
    updateDurationControl();
    renderOnionSkin();
  }

  function deleteFrame() {
    if (frames.length <= 1 || isPlaying) return;
    frames.splice(currentIndex, 1);
    currentIndex = Math.min(currentIndex, frames.length - 1);
    window.PixelCanvas.loadState(cloneState(frames[currentIndex].state));
    renderTimeline();
    updateStatus();
    updateDurationControl();
    renderOnionSkin();
  }

  function moveFrame(direction) {
    if (isPlaying) return;
    saveCurrent();
    const target = currentIndex + direction;
    if (target < 0 || target >= frames.length) return;
    [frames[currentIndex], frames[target]] = [frames[target], frames[currentIndex]];
    currentIndex = target;
    renderTimeline();
    updateStatus();
    updateDurationControl();
    renderOnionSkin();
  }

  function playFrame(index) {
    if (!isPlaying || !frames[index]) return;
    currentIndex = index;
    clearOnionSkin();
    window.PixelCanvas.loadState(cloneState(frames[index].state), { resetHistory: false });
    renderTimeline();
    updateStatus();

    timer = setTimeout(() => {
      playFrame((index + 1) % frames.length);
    }, Math.max(40, frames[index].durationMs || defaultDuration()));
  }

  function play() {
    if (frames.length < 2 || isPlaying) return;
    saveCurrent();
    isPlaying = true;
    updateStatus();
    playFrame(currentIndex);
  }

  function stop() {
    if (!isPlaying) return;
    clearTimeout(timer);
    timer = null;
    isPlaying = false;
    window.PixelCanvas.loadState(cloneState(frames[currentIndex].state));
    renderTimeline();
    updateStatus();
    updateDurationControl();
    renderOnionSkin();
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
    if (isPlaying) stop();
    frames = [makeFrame(blankState(Number(size)))];
    currentIndex = 0;
    renderTimeline();
    updateStatus();
    updateDurationControl();
    clearOnionSkin();
  }

  function syncCurrentFrame() {
    if (!isPlaying && frames[currentIndex]) {
      frames[currentIndex].state = cloneState(window.PixelCanvas.getState());
      renderTimeline();
      renderOnionSkin();
    }
  }

  addBtn?.addEventListener("click", addFrame);
  duplicateBtn?.addEventListener("click", duplicateFrame);
  deleteBtn?.addEventListener("click", deleteFrame);
  playBtn?.addEventListener("click", play);
  stopBtn?.addEventListener("click", stop);
  exportSheetBtn?.addEventListener("click", exportSpriteSheet);
  fpsSelect?.addEventListener("change", () => {
    const nextDefault = defaultDuration();
    if (frames[currentIndex]) {
      frames[currentIndex].durationMs = nextDefault;
      updateDurationControl();
      renderTimeline();
      updateStatus();
    }
  });

  window.addEventListener("pixelhistorychange", syncCurrentFrame);
  window.addEventListener("pixelstatechange", () => {
    if (!isPlaying) syncCurrentFrame();
  });
  window.addEventListener("pixelsizechange", event => resetForSize(event.detail.size));

  installStyles();
  installControls();
  updateVersionBadge();
  frames = [makeFrame(window.PixelCanvas.getState())];
  renderTimeline();
  updateStatus();
  updateDurationControl();
  renderOnionSkin();

  return {
    addFrame,
    duplicateFrame,
    deleteFrame,
    moveFrame,
    play,
    stop,
    exportSpriteSheet,
    resetForSize,
    getFrames: () => frames.map(frame => ({ state: cloneState(frame.state), durationMs: frame.durationMs }))
  };
})();