(() => {
  if (!window.PixelAnimation || !window.PixelCanvas?.getLayerState || window.PixelAnimation.__layersBridge) return;

  const originalLoadProjectState = window.PixelAnimation.loadProjectState?.bind(window.PixelAnimation);
  if (!originalLoadProjectState) return;

  window.PixelAnimation.loadProjectState = function(data, options = {}) {
    if (!options.preserveCanvas) return originalLoadProjectState(data);
    const backup = window.PixelCanvas.getLayerState();
    const result = originalLoadProjectState(data);
    window.PixelCanvas.loadLayerState(backup, { resetHistory: true });
    return result;
  };

  window.PixelAnimation.__layersBridge = true;
})();