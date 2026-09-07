(() => {
  function loadScript(src, flag, onload) {
    const existing = document.querySelector(`script[${flag}]`);
    if (existing) {
      if (onload) {
        if (existing.dataset.loaded === "true") onload();
        else existing.addEventListener("load", onload, { once:true });
      }
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.setAttribute(flag, "true");
    script.addEventListener("load", () => { script.dataset.loaded = "true"; }, { once:true });
    if (onload) script.addEventListener("load", onload, { once:true });
    document.body.appendChild(script);
  }

  function loadSelectionHotkeys() {
    loadScript("js/selection-hotkeys.js?v=1.0-ai.1", "data-pixel-selection-hotkeys");
  }

  function loadSelectionModule() {
    if (window.PixelSelection) return loadSelectionHotkeys();
    loadScript("js/selection.js?v=1.0-ai.1", "data-pixel-selection", loadSelectionHotkeys);
  }

  function loadEditorExtras() {
    loadScript("js/editor-patches.js?v=1.0-ai.1", "data-editor-patches", loadSelectionModule);
    loadScript("js/shape-preview.js?v=1.0-ai.1", "data-shape-preview");
  }

  function loadWorkspace() {
    if (window.PixelWorkspace) return loadEditorExtras();
    loadScript("js/workspace.js?v=1.0-ai.1", "data-pixel-workspace", loadEditorExtras);
  }

  function loadAIGenerator() {
    if (window.PixelAIGenerator) return loadWorkspace();
    loadScript("js/ai-generator.js?v=1.0-ai.1", "data-pixel-ai-generator", loadWorkspace);
  }

  function loadProject() {
    if (window.PixelProject) return loadAIGenerator();
    loadScript("js/project.js?v=1.0-ai.1", "data-pixel-project", loadAIGenerator);
  }

  // Flujo crítico en orden fijo: proyecto -> generador -> interfaz.
  // Así el menú nunca se inicializa antes de que el motor de generación exista.
  loadProject();
})();