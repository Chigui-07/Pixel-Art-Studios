window.PixelProject = (() => {
  const STORAGE_KEY = "pixel-art-studios-projects-v2";
  const ACTIVE_KEY = "pixel-art-studios-active-project-v2";
  let currentProjectId = localStorage.getItem(ACTIVE_KEY) || null;
  let currentProjectName = null;

  function uid() {
    return `px-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function readStore() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); }
    catch (_) { return {}; }
  }

  function writeStore(store) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }

  function buildProject(name = currentProjectName || "Proyecto sin nombre") {
    const animation = window.PixelAnimation?.getProjectState?.();
    return {
      format: "pixel-art-studios-project-v1",
      appVersion: "0.9-layers",
      id: currentProjectId,
      name,
      savedAt: new Date().toISOString(),
      canvas: window.PixelCanvas.getState(),
      layers: window.PixelCanvas.getLayerState?.() || null,
      animation: animation || null
    };
  }

  function validateProject(data) {
    if (!data || data.format !== "pixel-art-studios-project-v1") throw new Error("Formato de proyecto no reconocido.");
    if (!data.canvas || !Array.isArray(data.canvas.pixels) || !Number(data.canvas.size)) throw new Error("Proyecto inválido.");
    return data;
  }

  function applyProject(data) {
    validateProject(data);
    currentProjectId = data.id || uid();
    currentProjectName = data.name || "Proyecto";
    localStorage.setItem(ACTIVE_KEY, currentProjectId);

    if (data.layers?.layers?.length && window.PixelCanvas.loadLayerState) {
      window.PixelCanvas.loadLayerState(data.layers);
    } else {
      window.PixelCanvas.loadState(data.canvas);
    }

    if (data.animation?.frames?.length && window.PixelAnimation?.loadProjectState) {
      window.PixelAnimation.loadProjectState(data.animation, { preserveCanvas: true });
    }

    const sizeSelect = document.getElementById("sizeSelect");
    const sizeLabel = document.getElementById("canvasSizeLabel");
    if (sizeSelect) sizeSelect.value = String(data.canvas.size);
    if (sizeLabel) sizeLabel.textContent = `${data.canvas.size} × ${data.canvas.size}`;
    window.dispatchEvent(new CustomEvent("pixelprojectloaded", { detail: data }));
    window.dispatchEvent(new CustomEvent("pixelprojectchange", { detail: getCurrentInfo() }));
  }

  function saveNamed(name) {
    const clean = String(name || "").trim();
    if (!clean) return false;
    if (!currentProjectId) currentProjectId = uid();
    currentProjectName = clean;
    const store = readStore();
    const project = buildProject(clean);
    project.id = currentProjectId;
    store[currentProjectId] = project;
    writeStore(store);
    localStorage.setItem(ACTIVE_KEY, currentProjectId);
    window.dispatchEvent(new CustomEvent("pixelprojectsaved", { detail: project }));
    window.dispatchEvent(new CustomEvent("pixelprojectchange", { detail: getCurrentInfo() }));
    return true;
  }

  function saveCurrent() {
    if (!currentProjectId || !currentProjectName) return false;
    return saveNamed(currentProjectName);
  }

  function newProject() {
    currentProjectId = null;
    currentProjectName = null;
    localStorage.removeItem(ACTIVE_KEY);
    window.dispatchEvent(new CustomEvent("pixelprojectchange", { detail: getCurrentInfo() }));
  }

  function getProjects() {
    return Object.values(readStore()).sort((a, b) => String(b.savedAt).localeCompare(String(a.savedAt)));
  }

  function loadProjectById(id) {
    const project = readStore()[id];
    if (!project) return false;
    applyProject(project);
    return true;
  }

  function deleteProject(id) {
    const store = readStore();
    if (!store[id]) return false;
    delete store[id];
    writeStore(store);
    if (currentProjectId === id) newProject();
    return true;
  }

  function exportCurrent() {
    if (!currentProjectName) return false;
    const project = buildProject(currentProjectName);
    project.id = currentProjectId;
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${currentProjectName.replace(/[^a-z0-9áéíóúüñ_-]+/gi, "-")}.pixelstudio.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    return true;
  }

  async function importFile(file) {
    const data = validateProject(JSON.parse(await file.text()));
    data.id = uid();
    currentProjectId = data.id;
    currentProjectName = data.name || file.name.replace(/\.pixelstudio\.json$|\.json$/i, "");
    data.name = currentProjectName;
    const store = readStore();
    store[data.id] = data;
    writeStore(store);
    applyProject(data);
    return data;
  }

  function getCurrentInfo() {
    return { id: currentProjectId, name: currentProjectName, named: Boolean(currentProjectId && currentProjectName) };
  }

  if (currentProjectId) {
    const stored = readStore()[currentProjectId];
    if (stored) currentProjectName = stored.name || null;
    else newProject();
  }

  return {
    buildProject, applyProject, saveNamed, saveCurrent, newProject,
    getProjects, loadProjectById, deleteProject, exportCurrent, importFile, getCurrentInfo
  };
})();