window.PixelProject = (() => {
  const STORAGE_KEY = "pixel-art-studios-project-v1";
  let projectName = "RUMBO Asset";

  function installStyles() {
    if (document.getElementById("projectStyles")) return;
    const style = document.createElement("style");
    style.id = "projectStyles";
    style.textContent = `
      .project-wrap { width:min(1550px,100%); margin:0 auto; padding:0 2rem 2rem; }
      .project-controls { display:flex; flex-wrap:wrap; gap:.6rem; align-items:end; }
      .project-controls label { display:grid; gap:.3rem; color:var(--muted); font-size:.8rem; min-width:220px; flex:1 1 260px; }
      .project-controls input[type="text"] { width:100%; padding:.72rem; border:1px solid var(--border); background:var(--panel-2); color:var(--text); }
      .project-status { margin:.8rem 0 0; color:var(--muted); font-size:.8rem; }
      @media (max-width:780px){ .project-wrap{padding:0 1rem 1rem;} }
    `;
    document.head.appendChild(style);
  }

  function installUI() {
    if (document.getElementById("projectPanel")) return;
    const animationWrap = document.querySelector(".workspace-wrap");
    if (!animationWrap) return;

    const wrap = document.createElement("section");
    wrap.className = "project-wrap";
    wrap.id = "projectPanel";
    wrap.innerHTML = `
      <div class="panel">
        <div class="panel-title-row">
          <div>
            <p class="eyebrow">PROYECTO</p>
            <h2>Guardar trabajo</h2>
          </div>
          <span class="mini-badge">producción</span>
        </div>
        <p class="ai-intro">Guarda el lienzo, todos los frames y sus duraciones. Para assets importantes de RUMBO usa también “Exportar proyecto” para tener un archivo de respaldo.</p>
        <div class="project-controls">
          <label>Nombre del proyecto
            <input id="projectNameInput" type="text" value="RUMBO Asset" maxlength="80">
          </label>
          <button id="saveBrowserBtn" type="button">💾 Guardar en navegador</button>
          <button id="loadBrowserBtn" type="button">↥ Cargar guardado</button>
          <button id="exportProjectBtn" type="button">⬇ Exportar proyecto</button>
          <button id="importProjectBtn" type="button">⬆ Importar proyecto</button>
          <input id="projectFileInput" type="file" accept=".json,.pixelstudio.json,application/json" hidden>
        </div>
        <p id="projectStatus" class="project-status">Sin cambios guardados en esta sesión.</p>
      </div>
    `;
    animationWrap.parentNode.insertBefore(wrap, animationWrap);

    const nameInput = document.getElementById("projectNameInput");
    nameInput?.addEventListener("input", () => { projectName = nameInput.value.trim() || "RUMBO Asset"; });
    document.getElementById("saveBrowserBtn")?.addEventListener("click", saveToBrowser);
    document.getElementById("loadBrowserBtn")?.addEventListener("click", loadFromBrowser);
    document.getElementById("exportProjectBtn")?.addEventListener("click", exportProject);
    document.getElementById("importProjectBtn")?.addEventListener("click", () => document.getElementById("projectFileInput")?.click());
    document.getElementById("projectFileInput")?.addEventListener("change", importProjectFile);
  }

  function status(message) {
    const el = document.getElementById("projectStatus");
    if (el) el.textContent = message;
  }

  function buildProject() {
    const animation = window.PixelAnimation?.getProjectState?.();
    return {
      format: "pixel-art-studios-project-v1",
      appVersion: "0.5",
      name: projectName,
      savedAt: new Date().toISOString(),
      canvas: window.PixelCanvas.getState(),
      animation: animation || null
    };
  }

  function validateProject(data) {
    if (!data || data.format !== "pixel-art-studios-project-v1") throw new Error("Formato de proyecto no reconocido.");
    if (!data.canvas || !Array.isArray(data.canvas.pixels) || !Number(data.canvas.size)) throw new Error("El proyecto no contiene un lienzo válido.");
    return data;
  }

  function applyProject(data) {
    validateProject(data);
    projectName = data.name || "RUMBO Asset";
    const nameInput = document.getElementById("projectNameInput");
    if (nameInput) nameInput.value = projectName;

    if (data.animation?.frames?.length && window.PixelAnimation?.loadProjectState) {
      window.PixelAnimation.loadProjectState(data.animation);
    } else {
      window.PixelCanvas.loadState(data.canvas);
    }

    const sizeSelect = document.getElementById("sizeSelect");
    const sizeLabel = document.getElementById("canvasSizeLabel");
    if (sizeSelect) sizeSelect.value = String(data.canvas.size);
    if (sizeLabel) sizeLabel.textContent = `${data.canvas.size} × ${data.canvas.size}`;
    status(`Proyecto cargado: ${projectName}`);
    window.dispatchEvent(new CustomEvent("pixelprojectloaded", { detail: data }));
  }

  function saveToBrowser() {
    try {
      const project = buildProject();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
      status(`Guardado en este navegador · ${new Date().toLocaleTimeString()}`);
    } catch (error) {
      status(`No se pudo guardar: ${error.message}`);
    }
  }

  function loadFromBrowser() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return status("Todavía no hay un proyecto guardado en este navegador.");
      applyProject(JSON.parse(raw));
    } catch (error) {
      status(`No se pudo cargar: ${error.message}`);
    }
  }

  function safeFileName(name) {
    return (name || "pixel-project").trim().replace(/[^a-z0-9áéíóúüñ_-]+/gi, "-").replace(/^-+|-+$/g, "") || "pixel-project";
  }

  function exportProject() {
    try {
      const project = buildProject();
      const blob = new Blob([JSON.stringify(project, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${safeFileName(project.name)}.pixelstudio.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      status("Proyecto exportado como archivo de respaldo.");
    } catch (error) {
      status(`No se pudo exportar: ${error.message}`);
    }
  }

  async function importProjectFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      applyProject(data);
      status(`Importado: ${file.name}`);
    } catch (error) {
      status(`Archivo inválido: ${error.message}`);
    } finally {
      event.target.value = "";
    }
  }

  installStyles();
  installUI();

  return { buildProject, applyProject, saveToBrowser, loadFromBrowser, exportProject };
})();