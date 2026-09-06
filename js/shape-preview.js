(() => {
  const canvas = document.getElementById('pixelCanvas');
  if (!canvas || window.PixelShapePreview) return;

  let drawing = false;
  let start = null;
  let activeTool = null;
  const previewed = new Set();

  const style = document.createElement('style');
  style.id = 'pixelShapePreviewStyles';
  style.textContent = `
    .pixel.shape-preview-cell {
      position: relative;
      box-shadow: inset 0 0 0 2px var(--accent), inset 0 0 0 999px rgba(255,255,255,.10);
    }
  `;
  document.head.appendChild(style);

  function size() { return window.PixelCanvas?.getSize?.() || 16; }

  function coords(pixel) {
    const index = Number(pixel.dataset.index);
    const s = size();
    return { x: index % s, y: Math.floor(index / s) };
  }

  function pixelAt(x, y) {
    const s = size();
    if (x < 0 || y < 0 || x >= s || y >= s) return null;
    return canvas.children[y * s + x] || null;
  }

  function pointFromEvent(event) {
    const element = document.elementFromPoint(event.clientX, event.clientY);
    const pixel = element?.closest?.('.pixel');
    return pixel && canvas.contains(pixel) ? coords(pixel) : null;
  }

  function currentShapeTool() {
    if (document.getElementById('lineBtn')?.classList.contains('active')) return 'line';
    if (document.getElementById('rectBtn')?.classList.contains('active')) return 'rect';
    if (document.getElementById('ellipseBtn')?.classList.contains('active')) return 'ellipse';
    return null;
  }

  function clearPreview() {
    previewed.forEach(pixel => pixel.classList.remove('shape-preview-cell'));
    previewed.clear();
  }

  function addPoint(x, y) {
    const pixel = pixelAt(x, y);
    if (!pixel) return;
    pixel.classList.add('shape-preview-cell');
    previewed.add(pixel);
  }

  function previewLine(from, to) {
    let x0 = from.x, y0 = from.y;
    const x1 = to.x, y1 = to.y;
    const dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
    const dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
    let error = dx + dy;
    while (true) {
      addPoint(x0, y0);
      if (x0 === x1 && y0 === y1) break;
      const twice = 2 * error;
      if (twice >= dy) { error += dy; x0 += sx; }
      if (twice <= dx) { error += dx; y0 += sy; }
    }
  }

  function previewRect(from, to) {
    const minX = Math.min(from.x, to.x), maxX = Math.max(from.x, to.x);
    const minY = Math.min(from.y, to.y), maxY = Math.max(from.y, to.y);
    for (let x = minX; x <= maxX; x++) {
      addPoint(x, minY);
      addPoint(x, maxY);
    }
    for (let y = minY; y <= maxY; y++) {
      addPoint(minX, y);
      addPoint(maxX, y);
    }
  }

  function previewEllipse(from, to) {
    const minX = Math.min(from.x, to.x), maxX = Math.max(from.x, to.x);
    const minY = Math.min(from.y, to.y), maxY = Math.max(from.y, to.y);
    const rx = (maxX - minX) / 2, ry = (maxY - minY) / 2;
    const cx = minX + rx, cy = minY + ry;
    if (rx === 0 || ry === 0) return previewLine(from, to);
    const points = new Set();
    const steps = Math.max(24, Math.ceil(Math.PI * 2 * Math.max(rx, ry) * 2));
    for (let i = 0; i < steps; i++) {
      const angle = (i / steps) * Math.PI * 2;
      points.add(`${Math.round(cx + rx * Math.cos(angle))},${Math.round(cy + ry * Math.sin(angle))}`);
    }
    points.forEach(key => {
      const [x, y] = key.split(',').map(Number);
      addPoint(x, y);
    });
  }

  function render(to) {
    clearPreview();
    if (!drawing || !start || !to || !activeTool) return;
    if (activeTool === 'line') previewLine(start, to);
    if (activeTool === 'rect') previewRect(start, to);
    if (activeTool === 'ellipse') previewEllipse(start, to);
  }

  canvas.addEventListener('pointerdown', event => {
    activeTool = currentShapeTool();
    if (!activeTool) return;
    const pixel = event.target.closest('.pixel');
    if (!pixel) return;
    drawing = true;
    start = coords(pixel);
    render(start);
  }, true);

  window.addEventListener('pointermove', event => {
    if (!drawing) return;
    const point = pointFromEvent(event);
    if (point) render(point);
  });

  function finish() {
    if (!drawing) return;
    drawing = false;
    start = null;
    activeTool = null;
    requestAnimationFrame(clearPreview);
  }

  window.addEventListener('pointerup', finish);
  window.addEventListener('pointercancel', finish);
  window.addEventListener('blur', finish);
  window.addEventListener('pixelsizechange', clearPreview);

  window.PixelShapePreview = { clear: clearPreview };
})();