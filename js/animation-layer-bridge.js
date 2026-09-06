(() => {
  if (!window.PixelAnimation || !window.PixelCanvas?.getLayerState || window.PixelAnimation.__layersBridge) return;

  const originalLoadProjectState = window.PixelAnimation.loadProjectState?.bind(window.PixelAnimation);
  if (!originalLoadProjectState) return;

  let editorLayersBackup = null;
  let workspaceWrapped = false;

  window.PixelAnimation.loadProjectState = function(data, options = {}) {
    if (!options.preserveCanvas) return originalLoadProjectState(data);

    const backup = window.PixelCanvas.getLayerState();
    const originalDispatch = window.dispatchEvent.bind(window);
    let result = false;

    window.dispatchEvent = function(event) {
      if (event?.type === 'pixelsizechange') return true;
      return originalDispatch(event);
    };

    try {
      result = originalLoadProjectState(data);
      window.PixelCanvas.loadLayerState(backup, { resetHistory: true });
    } finally {
      window.dispatchEvent = originalDispatch;
    }

    return result;
  };

  function installWorkspaceBridge() {
    if (workspaceWrapped || !window.PixelWorkspace?.toggleAnimation) return false;
    const originalToggle = window.PixelWorkspace.toggleAnimation.bind(window.PixelWorkspace);

    window.PixelWorkspace.toggleAnimation = function(force) {
      const currentlyOpen = document.body.classList.contains('animation-open');
      const opening = typeof force === 'boolean' ? force : !currentlyOpen;

      if (opening && !currentlyOpen) editorLayersBackup = window.PixelCanvas.getLayerState();
      const result = originalToggle(force);

      if (!opening && editorLayersBackup) {
        const backup = editorLayersBackup;
        editorLayersBackup = null;
        window.PixelCanvas.loadLayerState(backup, { resetHistory: true });
      }
      return result;
    };

    workspaceWrapped = true;
    return true;
  }

  if (!installWorkspaceBridge()) {
    const timer = setInterval(() => {
      if (installWorkspaceBridge()) clearInterval(timer);
    }, 50);
    setTimeout(() => clearInterval(timer), 5000);
  }

  window.PixelAnimation.__layersBridge = true;
})();