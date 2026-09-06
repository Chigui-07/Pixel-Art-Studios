(() => {
  const mainStudio = document.querySelector('.studio-layout');
  const animationWrap = document.querySelector('.workspace-wrap');
  const aiWrap = document.querySelector('.ai-lab-wrap');
  const header = document.querySelector('.topbar');
  if (!mainStudio || document.getElementById('workspaceHome')) return;

  const style = document.createElement('style');
  style.id = 'workspaceMenuStyles';
  style.textContent = `
    body.workspace-mode-home .studio-layout,
    body.workspace-mode-home .workspace-wrap,
    body.workspace-mode-home .ai-lab-wrap,
    body.workspace-mode-home .project-wrap { display:none !important; }
    body.workspace-mode-library .studio-layout,
    body.workspace-mode-library .workspace-wrap,
    body.workspace-mode-library .ai-lab-wrap,
    body.workspace-mode-library .project-wrap { display:none !important; }
    body.workspace-mode-editor .project-wrap { display:none !important; }

    .workspace-home,.workspace-library { width:min(1200px,100%); margin:0 auto; padding:2rem; }
    .workspace-hero { border:1px solid var(--border); background:linear-gradient(135deg,#202029,#17171d); padding:2rem; margin-bottom:1.25rem; }
    .workspace-hero h2 { margin:.35rem 0 .7rem; font-size:clamp(1.8rem,4vw,3rem); }
    .workspace-hero p { max-width:780px; color:var(--muted); line-height:1.6; }
    .workspace-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:1rem; }
    .workspace-card { text-align:left; min-height:190px; padding:1.35rem; display:flex; flex-direction:column; justify-content:space-between; border:1px solid var(--border); background:var(--panel); color:var(--text); }
    .workspace-card:hover { border-color:var(--accent); transform:translateY(-2px); }
    .workspace-icon { font-size:2.2rem; }
    .workspace-card strong { display:block; margin:.85rem 0 .4rem; font-size:1.1rem; }
    .workspace-card small { color:var(--muted); line-height:1.5; }
    .workspace-state { margin-top:1rem; color:var(--accent); font-size:.74rem; font-weight:700; }
    .workspace-nav { position:sticky; top:0; z-index:60; display:flex; gap:.55rem; align-items:center; padding:.7rem 1rem; border-bottom:1px solid var(--border); background:rgba(21,21,27,.96); backdrop-filter:blur(8px); }
    .workspace-nav strong { margin-right:auto; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .workspace-nav button { padding:.55rem .75rem; }
    .workspace-save-status { color:var(--muted); font-size:.76rem; }
    .workspace-modal-backdrop { position:fixed; inset:0; z-index:1000; display:grid; place-items:center; padding:1rem; background:rgba(0,0,0,.72); }
    .workspace-modal { width:min(520px,100%); border:1px solid var(--border); background:var(--panel); padding:1.35rem; }
    .workspace-modal h3 { margin:.3rem 0 .6rem; }
    .workspace-modal p { color:var(--muted); line-height:1.5; }
    .workspace-modal input { width:100%; padding:.8rem; margin:.7rem 0; border:1px solid var(--border); background:var(--panel-2); color:var(--text); }
    .workspace-modal-actions { display:flex; gap:.55rem; justify-content:flex-end; margin-top:.8rem; }
    .project-list { display:grid; gap:.65rem; margin-top:1rem; }
    .project-row { display:grid; grid-template-columns:1fr auto auto; gap:.6rem; align-items:center; padding:.85rem; border:1px solid var(--border); background:#18181f; }
    .project-row small { display:block; margin-top:.25rem; color:var(--muted); }
    .empty-library { border:1px dashed var(--border); padding:2rem; text-align:center; color:var(--muted); }
    @media(max-width:800px){ .workspace-grid{grid-template-columns:1fr;} .workspace-home,.workspace-library{padding:1rem;} .project-row{grid-template-columns:1fr;} .workspace-nav strong{display:none;} }
  `;
  document.head.appendChild(style);

  const nav = document.createElement('nav');
  nav.className = 'workspace-nav';
  nav.innerHTML = `
    <strong id="workspaceProjectTitle">Pixel Art Studios</strong>
    <span id="workspaceSaveStatus" class="workspace-save-status"></span>
    <button type="button" id="workspaceHomeBtn">⌂ Inicio</button>
    <button type="button" id="workspaceSaveBtn" hidden>💾 Guardar</button>
  `;
  document.body.insertBefore(nav, document.body.firstChild);

  const home = document.createElement('section');
  home.id = 'workspaceHome';
  home.className = 'workspace-home';
  home.innerHTML = `
    <div class="workspace-hero">
      <p class="eyebrow">PIXEL ART STUDIOS</p>
      <h2>¿Qué quieres hacer?</h2>
      <p>Un inicio simple para entrar al taller, revisar tu biblioteca o continuar un proyecto guardado.</p>
    </div>
    <div class="workspace-grid">
      <button class="workspace-card" type="button" data-home-action="editor">
        <span><span class="workspace-icon">🎨</span><strong>Abrir editor</strong><small>Dibuja, anima, crea escenas, tilesets y assets desde un solo espacio de trabajo.</small></span>
        <span class="workspace-state">ENTRAR AL TALLER →</span>
      </button>
      <button class="workspace-card" type="button" data-home-action="library">
        <span><span class="workspace-icon">📚</span><strong>Biblioteca</strong><small>Consulta personajes, objetos, animaciones y otros assets reutilizables de RUMBO.</small></span>
        <span class="workspace-state">ABRIR BIBLIOTECA →</span>
      </button>
      <button class="workspace-card" type="button" data-home-action="load">
        <span><span class="workspace-icon">📂</span><strong>Cargar proyecto</strong><small>Continúa cualquiera de tus proyectos guardados o importa un archivo de Pixel Art Studios.</small></span>
        <span class="workspace-state">VER PROYECTOS →</span>
      </button>
    </div>
  `;
  if (header) header.insertAdjacentElement('afterend', home);
  else document.body.insertBefore(home, mainStudio);

  const library = document.createElement('section');
  library.id = 'workspaceLibrary';
  library.className = 'workspace-library';
  library.hidden = true;
  library.innerHTML = `
    <div class="workspace-hero">
      <p class="eyebrow">BIBLIOTECA RUMBO</p>
      <h2>Assets reutilizables</h2>
      <p>Aquí organizaremos personajes, objetos, tilesets, escenas y animaciones guardadas como assets.</p>
    </div>
    <div class="empty-library">📚 La estructura está lista. El siguiente paso será diseñar categorías, tarjetas y guardado de assets.</div>
  `;
  home.insertAdjacentElement('afterend', library);

  const modalBackdrop = document.createElement('div');
  modalBackdrop.className = 'workspace-modal-backdrop';
  modalBackdrop.hidden = true;
  modalBackdrop.innerHTML = `<div class="workspace-modal" id="workspaceModal"></div>`;
  document.body.appendChild(modalBackdrop);

  const saveBtn = document.getElementById('workspaceSaveBtn');
  const saveStatus = document.getElementById('workspaceSaveStatus');
  const projectTitle = document.getElementById('workspaceProjectTitle');

  function refreshProjectInfo(message = '') {
    const info = window.PixelProject?.getCurrentInfo?.() || { named:false, name:null };
    projectTitle.textContent = info.named ? info.name : 'Pixel Art Studios';
    if (message) saveStatus.textContent = message;
    else saveStatus.textContent = info.named ? 'Proyecto activo' : '';
  }

  function setMode(mode) {
    document.body.classList.remove('workspace-mode-home','workspace-mode-editor','workspace-mode-library');
    document.body.classList.add(`workspace-mode-${mode}`);
    home.hidden = mode !== 'home';
    library.hidden = mode !== 'library';
    saveBtn.hidden = mode !== 'editor';
    if (mode !== 'home') window.scrollTo({ top:0, behavior:'smooth' });
  }

  function closeModal() {
    modalBackdrop.hidden = true;
    document.getElementById('workspaceModal').innerHTML = '';
  }

  function openNameModal() {
    const modal = document.getElementById('workspaceModal');
    modal.innerHTML = `
      <p class="eyebrow">PRIMER GUARDADO</p>
      <h3>Nombre del proyecto</h3>
      <p>Solo te lo pediremos esta vez. Después el botón Guardar actualizará este mismo proyecto directamente.</p>
      <input id="firstProjectName" type="text" maxlength="80" placeholder="Ej. Nicolás base, Animación despertar..." autofocus>
      <div class="workspace-modal-actions">
        <button type="button" data-modal-close>Cancelar</button>
        <button type="button" id="confirmFirstSave">Guardar proyecto</button>
      </div>`;
    modalBackdrop.hidden = false;
    requestAnimationFrame(() => document.getElementById('firstProjectName')?.focus());
    document.getElementById('confirmFirstSave')?.addEventListener('click', () => {
      const name = document.getElementById('firstProjectName')?.value.trim();
      if (!name) return;
      if (window.PixelProject.saveNamed(name)) {
        closeModal();
        refreshProjectInfo('Guardado ✓');
      }
    });
  }

  function smartSave() {
    const info = window.PixelProject?.getCurrentInfo?.();
    if (!info?.named) return openNameModal();
    if (window.PixelProject.saveCurrent()) refreshProjectInfo('Guardado ✓');
  }

  function renderLoader() {
    const projects = window.PixelProject?.getProjects?.() || [];
    const modal = document.getElementById('workspaceModal');
    modal.innerHTML = `
      <p class="eyebrow">CARGAR PROYECTO</p>
      <h3>Tus proyectos</h3>
      <p>Abre un guardado del navegador o importa un archivo <code>.pixelstudio.json</code>.</p>
      <div id="savedProjectList" class="project-list"></div>
      <div class="workspace-modal-actions">
        <input id="workspaceImportInput" type="file" accept=".json,.pixelstudio.json,application/json" hidden>
        <button type="button" id="workspaceImportBtn">⬆ Importar archivo</button>
        <button type="button" data-modal-close>Cerrar</button>
      </div>`;
    const list = document.getElementById('savedProjectList');
    if (!projects.length) list.innerHTML = '<div class="empty-library">Todavía no hay proyectos guardados.</div>';
    projects.forEach(project => {
      const row = document.createElement('div');
      row.className = 'project-row';
      row.innerHTML = `<div><strong>${project.name}</strong><small>${new Date(project.savedAt).toLocaleString()}</small></div><button type="button">Abrir</button><button type="button">Eliminar</button>`;
      const [open, remove] = row.querySelectorAll('button');
      open.addEventListener('click', () => {
        if (window.PixelProject.loadProjectById(project.id)) {
          closeModal();
          setMode('editor');
          refreshProjectInfo('Proyecto cargado');
        }
      });
      remove.addEventListener('click', () => {
        window.PixelProject.deleteProject(project.id);
        renderLoader();
      });
      list.appendChild(row);
    });
    modalBackdrop.hidden = false;

    document.getElementById('workspaceImportBtn')?.addEventListener('click', () => document.getElementById('workspaceImportInput')?.click());
    document.getElementById('workspaceImportInput')?.addEventListener('change', async event => {
      const file = event.target.files?.[0];
      if (!file) return;
      try {
        await window.PixelProject.importFile(file);
        closeModal();
        setMode('editor');
        refreshProjectInfo('Proyecto importado');
      } catch (error) {
        alert(`No se pudo importar: ${error.message}`);
      }
    });
  }

  document.addEventListener('click', event => {
    if (event.target.closest('[data-modal-close]')) return closeModal();
    const action = event.target.closest('[data-home-action]')?.dataset.homeAction;
    if (action === 'editor') {
      window.PixelProject?.newProject?.();
      setMode('editor');
      refreshProjectInfo();
    }
    if (action === 'library') setMode('library');
    if (action === 'load') renderLoader();
  });

  document.getElementById('workspaceHomeBtn')?.addEventListener('click', () => { setMode('home'); refreshProjectInfo(); });
  saveBtn?.addEventListener('click', smartSave);
  modalBackdrop.addEventListener('click', event => { if (event.target === modalBackdrop) closeModal(); });
  window.addEventListener('pixelprojectchange', () => refreshProjectInfo());
  window.addEventListener('pixelsaved', () => refreshProjectInfo('Guardado ✓'));

  document.querySelector('.version')?.replaceChildren(document.createTextNode('v0.6 redesign'));
  setMode('home');
  refreshProjectInfo();

  window.PixelWorkspace = { setMode, smartSave, renderLoader };
})();