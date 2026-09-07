(() => {
  function loadScript(src, flag, onload) {
    if (document.querySelector(`script[${flag}]`)) return;
    const script = document.createElement("script");
    script.src = src;
    script.setAttribute(flag, "true");
    if (onload) script.addEventListener("load", onload, { once:true });
    document.body.appendChild(script);
  }

  function loadProjectModule() {
    if (window.PixelProject) return;
    loadScript("js/project.js?v=1.0-ai", "data-pixel-project");
  }

  function loadSelectionHotkeys() {
    loadScript("js/selection-hotkeys.js?v=1.0-ai", "data-pixel-selection-hotkeys");
  }

  function loadSelectionModule() {
    if (window.PixelSelection) return loadSelectionHotkeys();
    loadScript("js/selection.js?v=1.0-ai", "data-pixel-selection", loadSelectionHotkeys);
  }

  function loadWorkspaceModule() {
    if (window.PixelWorkspace) return;
    loadScript("js/workspace.js?v=1.0-ai", "data-pixel-workspace");
  }

  function loadEditorPatches() {
    loadScript("js/editor-patches.js?v=1.0-ai", "data-editor-patches", loadSelectionModule);
  }

  function loadShapePreview() {
    loadScript("js/shape-preview.js?v=1.0-ai", "data-shape-preview");
  }

  function loadAIGenerator() {
    if (window.PixelAIGenerator) return;
    loadScript("js/ai-generator.js?v=1.0-ai", "data-pixel-ai-generator");
  }

  loadProjectModule();
  loadAIGenerator();
  loadWorkspaceModule();
  loadEditorPatches();
  loadShapePreview();

  // El antiguo AI Lab y el sistema de capas quedan pausados. La nueva entrada
  // principal de IA se construye desde workspace.js y genera píxeles editables.
})();