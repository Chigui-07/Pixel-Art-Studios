(() => {
  const mainStudio = document.querySelector('.studio-layout');
  const animationWrap = document.querySelector('.workspace-wrap');
  const aiWrap = document.querySelector('.ai-lab-wrap');
  const header = document.querySelector('.topbar');
  const toolsPanel = document.querySelector('.tools-panel');
  const canvasPanel = document.querySelector('.canvas-panel');
  const tutorialPanel = document.querySelector('.tutorial-panel');
  if (!mainStudio || document.getElementById('workspaceHome')) return;

  const style = document.createElement('style');
  style.id = 'workspaceMenuStyles';
  style.textContent = `
    body.workspace-mode-home .studio-layout,
    body.workspace-mode-home .workspace-wrap,
    body.workspace-mode-home .ai-lab-wrap,
    body.workspace-mode-home .project-wrap,
    body.workspace-mode-home .editor-commandbar { display:none !important; }

    body.workspace-mode-library .studio-layout,
    body.workspace-mode-library .workspace-wrap,
    body.workspace-mode-library .ai-lab-wrap,
    body.workspace-mode-library .project-wrap,
    body.workspace-mode-library .editor-commandbar { display:none !important; }

    body.workspace-mode-editor .project-wrap,
    body.workspace-mode-editor .ai-lab-wrap { display:none !important; }

    body.workspace-mode-editor .topbar { display:none; }
    body.workspace-mode-home .topbar,
    body.workspace-mode-library .topbar { display:flex; }

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
    .workspace-modal-backdrop[hidden] { display:none !important; }
    .workspace-modal { width:min(520px,100%); border:1px solid var(--border); background:var(--panel); padding:1.35rem; }
    .workspace-modal h3 { margin:.3rem 0 .6rem; }
    .workspace-modal p { color:var(--muted); line-height:1.5; }
    .workspace-modal input { width:100%; padding:.8rem; margin:.7rem 0; border:1px solid var(--border); background:var(--panel-2); color:var(--text); }
    .workspace-modal-actions { display:flex; gap:.55rem; justify-content:flex-end; margin-top:.8rem; }
    .project-list { display:grid; gap:.65rem; margin-top:1rem; }
    .project-row { display:grid; grid-template-columns:1fr auto auto; gap:.6rem; align-items:center; padding:.85rem; border:1px solid var(--border); background:#18181f; }
    .project-row small { display:block; margin-top:.25rem; color:var(--muted); }
    .empty-library { border:1px dashed var(--border); padding:2rem; text-align:center; color:var(--muted); }

    .editor-commandbar {
      width:min(1550px,100%);
      margin:0 auto;
      padding:.8rem 2rem 0;
      display:flex;
      flex-wrap:wrap;
      gap:.55rem;
      align-items:center;
    }
    .editor-commandbar .editor-spacer { flex:1; }
    .editor-commandbar button { min-height:42px; }
    .editor-commandbar button.active { border-color:var(--accent); }

    body.workspace-mode-editor .studio-layout {
      width:min(1550px,100%);
      grid-template-columns:86px minmax(420px,1fr) 280px;
      gap:1rem;
      padding-top:1rem;
    }

    body.workspace-mode-editor .tools-panel {
      position:sticky;
      top:68px;
      padding:.65rem;
      display:block;
      min-width:0;
    }
    body.workspace-mode-editor .tools-panel > * { display:none !important; }
    body.workspace-mode-editor .tools-panel .tool-buttons { display:grid !important; margin:0; grid-template-columns:1fr; gap:.45rem; }
    body.workspace-mode-editor .tools-panel .tool-buttons button {
      width:100%;
      min-height:54px;
      padding:.55rem .25rem;
      overflow:hidden;
      white-space:nowrap;
      font-size:0;
    }
    body.workspace-mode-editor .tools-panel .tool-buttons button::first-letter { font-size:1.25rem; }
    body.workspace-mode-editor .tools-panel .tool-buttons #handBtn { font-size:0; }
    body.workspace-mode-editor .tools-panel .tool-buttons #handBtn::before { content:'🖐️'; font-size:1.25rem; }

    body.workspace-mode-editor .canvas-panel { min-width:0; }
    body.workspace-mode-editor .canvas-viewport { min-height:660px; }

    .editor-inspector {
      border:1px solid var(--border);
      background:var(--panel);
      padding:1rem;
      position:sticky;
      top:68px;
      max-height:calc(100vh - 85px);
      overflow:auto;
    }
    .editor-inspector h3 { margin:.2rem 0 1rem; }
    .editor-inspector .tool-group,
    .editor-inspector .zoom-control,
    .editor-inspector .status-card,
    .editor-inspector .action-status,
    .editor-inspector .shortcut-card { display:block !important; }
    .editor-inspector .tool-group { margin-top:1rem; }
    .editor-inspector .zoom-control { display:flex !important; }
    .editor-inspector .status-card { display:flex !important; }

    body.workspace-mode-editor .tutorial-panel {
      position:fixed;
      z-index:100;
      top:64px;
      right:0;
      width:min(410px,92vw);
      height:calc(100vh - 64px);
      overflow:auto;
      box-shadow:-12px 0 28px rgba(0,0,0,.35);
      transform:translateX(102%);
      transition:transform .2s ease;
    }
    body.workspace-mode-editor.tutorial-open .tutorial-panel { transform:translateX(0); }

    body.workspace-mode-editor .workspace-wrap { display:none; }
    body.workspace-mode-editor.animation-open .workspace-wrap { display:block; }

    .editor-panel-close {
      width:100%;
      margin-bottom:.8rem;
    }

    @media(max-width:1000px){
      .workspace-grid{grid-template-columns:1fr;}
      .workspace-home,.workspace-library{padding:1rem;}
      .project-row{grid-template-columns:1fr;}
      .workspace-nav strong{display:none;}
      body.workspace-mode-editor .studio-layout { grid-template-columns:76px minmax(0,1fr); }
      .editor-inspector { grid-column:1 / -1; position:static; max-height:none; }
    }
    @media(max-width:700px){
      .editor-commandbar{padding:.7rem 1rem 0;}
      body.workspace-mode-editor .studio-layout{padding:1rem; grid-template-columns:64px minmax(300px,1fr);}
      body.workspace-mode-editor .canvas-viewport{min-height:480px;}
    }
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

  const commandbar = document.createElement('div');
  commandbar.className = 'editor-commandbar';
  commandbar.innerHTML = `
    <button type="button" id="editorUndoBtn">↶ Deshacer</button>
    <button type="button" id="editorRedoBtn">↷ Rehacer</button>
    <span class="editor-spacer"></span>
    <button type="button" id="editorTutorialBtn">📖 Tutorial</button>
    <button type="button" id="editorAnimationBtn">🎞️ Animar</button>
    <button type="button" id="editorAiBtn">🤖 IA</button>
    <button type="button" id="editorExportBtn">⬇ Exportar</button>
  `;
  mainStudio.insertAdjacentElement('beforebegin', commandbar);

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

  function buildInspector() {
    if (!toolsPanel || document.getElementById('editorInspector')) return;
    const inspector = document.createElement('aside');
    inspector.id = 'editorInspector';
    inspector.className = 'editor-inspector';
    inspector.innerHTML = `<p class="eyebrow">PROPIEDADES</p><h3>Color y lienzo</h3>`;

    const groups = [...toolsPanel.querySelectorAll('.tool-group')];
    groups.forEach(group => inspector.appendChild(group));
    const zoom = toolsPanel.querySelector('.zoom-control');
    const status = toolsPanel.querySelector('.status-card');
    const action = toolsPanel.querySelector('.action-status');
    const shortcuts = toolsPanel.querySelector('.shortcut-card');
    if (zoom) inspector.appendChild(zoom);
    if (status) inspector.appendChild(status);
    if (action) inspector.appendChild(action);
    if (shortcuts) inspector.appendChild(shortcuts);
    mainStudio.appendChild(inspector);

    toolsPanel.querySelector('.panel-title-row')?.remove();
    toolsPanel.querySelector('.history-actions')?.style.setProperty('display','none','important');
    toolsPanel.querySelector('.utility-actions')?.style.setProperty('display','none','important');
  }

  function prepareTutorialDrawer() {
    if (!tutorialPanel || tutorialPanel.querySelector('.editor-panel-close')) return;
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'editor-panel-close';
    close.textContent = '✕ Cerrar tutorial';
    close.addEventListener('click', () => toggleTutorial(false));
    tutorialPanel.insertBefore(close, tutorialPanel.firstChild);
  }

  buildInspector();
  prepareTutorialDrawer();

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
    document.body.classList.remove('workspace-mode-home','workspace-mode-editor','workspace-mode-library','tutorial-open','animation-open');
    document.body.classList.add(`workspace-mode-${mode}`);
    home.hidden = mode !== 'home';
    library.hidden = mode !== 'library';
    saveBtn.hidden = mode !== 'editor';
    if (mode !== 'home') window.scrollTo({ top:0, behavior:'smooth' });
  }

  function toggleTutorial(force) {
    const next = typeof force === 'boolean' ? force : !document.body.classList.contains('tutorial-open');
    document.body.classList.toggle('tutorial-open', next);
    document.getElementById('editorTutorialBtn')?.classList.toggle('active', next);
  }

  function toggleAnimation(force) {
    const next = typeof force === 'boolean' ? force : !document.body.classList.contains('animation-open');
    document.body.classList.toggle('animation-open', next);
    document.getElementById('editorAnimationBtn')?.classList.toggle('active', next);
    if (next) animationWrap?.scrollIntoView({ behavior:'smooth', block:'start' });
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
  document.getElementById('editorUndoBtn')?.addEventListener('click', () => document.getElementById('undoBtn')?.click());
  document.getElementById('editorRedoBtn')?.addEventListener('click', () => document.getElementById('redoBtn')?.click());
  document.getElementById('editorExportBtn')?.addEventListener('click', () => document.getElementById('exportBtn')?.click());
  document.getElementById('editorTutorialBtn')?.addEventListener('click', () => toggleTutorial());
  document.getElementById('editorAnimationBtn')?.addEventListener('click', () => toggleAnimation());
  document.getElementById('editorAiBtn')?.addEventListener('click', () => window.open('ai-studio.html', '_blank', 'noopener'));

  modalBackdrop.addEventListener('click', event => { if (event.target === modalBackdrop) closeModal(); });
  window.addEventListener('pixelprojectchange', () => refreshProjectInfo());
  window.addEventListener('pixelsaved', () => refreshProjectInfo('Guardado ✓'));

  document.querySelector('.version')?.replaceChildren(document.createTextNode('v0.7 editor redesign'));
  setMode('home');
  refreshProjectInfo();

  window.PixelWorkspace = { setMode, smartSave, renderLoader, toggleTutorial, toggleAnimation };
})();