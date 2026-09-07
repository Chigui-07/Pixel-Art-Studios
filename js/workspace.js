(() => {
  const mainStudio = document.querySelector('.studio-layout');
  const animationWrap = document.querySelector('.workspace-wrap');
  const aiWrap = document.querySelector('.ai-lab-wrap');
  const header = document.querySelector('.topbar');
  const toolsPanel = document.querySelector('.tools-panel');
  const tutorialPanel = document.querySelector('.tutorial-panel');
  if (!mainStudio || document.getElementById('workspaceHome')) return;

  let latestAIResult = null;

  const style = document.createElement('style');
  style.id = 'workspaceMenuStyles';
  style.textContent = `
    body.workspace-mode-home .studio-layout,
    body.workspace-mode-home .workspace-wrap,
    body.workspace-mode-home .ai-lab-wrap,
    body.workspace-mode-home .project-wrap,
    body.workspace-mode-home .editor-commandbar,
    body.workspace-mode-library .studio-layout,
    body.workspace-mode-library .workspace-wrap,
    body.workspace-mode-library .ai-lab-wrap,
    body.workspace-mode-library .project-wrap,
    body.workspace-mode-library .editor-commandbar { display:none !important; }

    body.workspace-mode-editor .ai-lab-wrap,
    body.workspace-mode-editor .tutorial-panel,
    body.workspace-mode-editor #pixelLayersPanel,
    body.workspace-mode-editor .project-wrap { display:none !important; }
    body.workspace-mode-editor .topbar { display:none; }
    body.workspace-mode-home .topbar,
    body.workspace-mode-library .topbar { display:flex; }

    .workspace-home,.workspace-library { width:min(1180px,100%); margin:0 auto; padding:2rem; }
    .ai-home-shell { display:grid; grid-template-columns:minmax(0,1.25fr) minmax(280px,.75fr); gap:1.25rem; align-items:start; }
    .ai-create-card,.ai-preview-card,.workspace-secondary-card { border:1px solid var(--border); background:var(--panel); }
    .ai-create-card { padding:2rem; }
    .ai-create-card h2 { margin:.35rem 0 .65rem; font-size:clamp(2rem,5vw,3.6rem); line-height:1.05; }
    .ai-create-card > p { max-width:720px; color:var(--muted); line-height:1.6; }
    .ai-prompt-label { display:grid; gap:.55rem; margin-top:1.5rem; font-weight:700; }
    .ai-prompt-box { width:100%; min-height:150px; resize:vertical; box-sizing:border-box; padding:1rem; border:1px solid var(--border); background:var(--panel-2); color:var(--text); font:inherit; line-height:1.55; }
    .ai-prompt-box:focus { outline:1px solid var(--accent); border-color:var(--accent); }
    .ai-simple-options { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:.75rem; margin:1rem 0; }
    .ai-simple-options label { display:grid; gap:.35rem; color:var(--muted); font-size:.78rem; }
    .ai-simple-options select { width:100%; padding:.7rem; border:1px solid var(--border); background:var(--panel-2); color:var(--text); }
    .ai-home-actions { display:flex; flex-wrap:wrap; gap:.65rem; align-items:center; }
    .ai-home-actions button { min-height:46px; }
    .ai-generate-primary { padding-inline:1.25rem; border-color:var(--accent) !important; }
    .ai-generator-note { margin:.85rem 0 0; color:var(--muted); font-size:.75rem; line-height:1.5; }
    .ai-status { margin-top:1rem; min-height:1.35rem; color:var(--accent); font-size:.8rem; font-weight:700; }

    .ai-preview-card { padding:1.25rem; position:sticky; top:80px; }
    .ai-preview-card h3 { margin:.25rem 0 .4rem; }
    .ai-preview-meta { color:var(--muted); font-size:.78rem; margin-bottom:1rem; }
    .ai-pixel-preview-wrap { display:grid; place-items:center; min-height:310px; padding:1rem; border:1px solid var(--border); background:#111116; overflow:auto; }
    .ai-pixel-preview { width:min(290px,100%); aspect-ratio:1; display:grid; background-color:#fff; background-image:linear-gradient(45deg,#ddd 25%,transparent 25%),linear-gradient(-45deg,#ddd 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#ddd 75%),linear-gradient(-45deg,transparent 75%,#ddd 75%); background-size:16px 16px; background-position:0 0,0 8px,8px -8px,-8px 0; image-rendering:pixelated; }
    .ai-pixel-preview span { min-width:0; min-height:0; }
    .ai-preview-empty { color:var(--muted); text-align:center; line-height:1.6; padding:2rem; }
    .ai-palette-preview { display:flex; flex-wrap:wrap; gap:.35rem; margin-top:.85rem; }
    .ai-palette-chip { width:28px; height:28px; border:1px solid rgba(255,255,255,.2); }
    .ai-frame-badge { display:inline-block; margin-top:.65rem; padding:.35rem .5rem; border:1px solid var(--border); color:var(--accent); font-size:.72rem; }

    .workspace-secondary { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:1rem; margin-top:1.25rem; }
    .workspace-secondary-card { padding:1.15rem; text-align:left; color:var(--text); }
    .workspace-secondary-card strong { display:block; margin:.35rem 0; }
    .workspace-secondary-card small { color:var(--muted); line-height:1.5; }

    .workspace-hero { border:1px solid var(--border); background:linear-gradient(135deg,#202029,#17171d); padding:2rem; margin-bottom:1.25rem; }
    .workspace-hero h2 { margin:.35rem 0 .7rem; font-size:clamp(1.8rem,4vw,3rem); }
    .workspace-hero p { max-width:780px; color:var(--muted); line-height:1.6; }
    .empty-library { border:1px dashed var(--border); padding:2rem; text-align:center; color:var(--muted); }

    .workspace-nav { position:sticky; top:0; z-index:60; display:flex; gap:.55rem; align-items:center; padding:.7rem 1rem; border-bottom:1px solid var(--border); background:rgba(21,21,27,.96); backdrop-filter:blur(8px); }
    .workspace-nav strong { margin-right:auto; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .workspace-nav button { padding:.55rem .75rem; }
    .workspace-save-status { color:var(--muted); font-size:.76rem; }

    .workspace-modal-backdrop { position:fixed; inset:0; z-index:1000; display:grid; place-items:center; padding:1rem; background:rgba(0,0,0,.72); }
    .workspace-modal-backdrop[hidden] { display:none !important; }
    .workspace-modal { width:min(560px,100%); max-height:85vh; overflow:auto; border:1px solid var(--border); background:var(--panel); padding:1.35rem; }
    .workspace-modal h3 { margin:.3rem 0 .6rem; }
    .workspace-modal p { color:var(--muted); line-height:1.5; }
    .workspace-modal input { width:100%; box-sizing:border-box; padding:.8rem; margin:.7rem 0; border:1px solid var(--border); background:var(--panel-2); color:var(--text); }
    .workspace-modal-actions { display:flex; gap:.55rem; justify-content:flex-end; margin-top:.8rem; flex-wrap:wrap; }
    .project-list { display:grid; gap:.65rem; margin-top:1rem; }
    .project-row { display:grid; grid-template-columns:1fr auto auto; gap:.6rem; align-items:center; padding:.85rem; border:1px solid var(--border); background:#18181f; }
    .project-row small { display:block; margin-top:.25rem; color:var(--muted); }

    .editor-commandbar { width:min(1500px,100%); margin:0 auto; padding:.8rem 2rem 0; display:flex; flex-wrap:wrap; gap:.55rem; align-items:center; }
    .editor-commandbar .editor-spacer { flex:1; }
    .editor-commandbar button { min-height:42px; }
    .editor-commandbar button.active { border-color:var(--accent); }

    body.workspace-mode-editor .studio-layout { width:min(1500px,100%); grid-template-columns:86px minmax(420px,1fr) 280px; gap:1rem; padding-top:1rem; }
    body.workspace-mode-editor .tools-panel { position:sticky; top:68px; padding:.65rem; display:block; min-width:0; }
    body.workspace-mode-editor .tools-panel > * { display:none !important; }
    body.workspace-mode-editor .tools-panel .tool-buttons { display:grid !important; margin:0; grid-template-columns:1fr; gap:.45rem; }
    body.workspace-mode-editor .tools-panel .tool-buttons button { width:100%; min-height:54px; padding:.55rem .25rem; overflow:hidden; white-space:nowrap; font-size:0; }
    body.workspace-mode-editor .tools-panel .tool-buttons button::first-letter { font-size:1.25rem; }
    body.workspace-mode-editor .tools-panel .tool-buttons #handBtn { font-size:0; }
    body.workspace-mode-editor .tools-panel .tool-buttons #handBtn::before { content:'🖐️'; font-size:1.25rem; }
    body.workspace-mode-editor .canvas-panel { min-width:0; }
    body.workspace-mode-editor .canvas-viewport { min-height:650px; }
    .editor-inspector { border:1px solid var(--border); background:var(--panel); padding:1rem; position:sticky; top:68px; max-height:calc(100vh - 85px); overflow:auto; }
    .editor-inspector h3 { margin:.2rem 0 1rem; }
    .editor-inspector .tool-group,.editor-inspector .zoom-control,.editor-inspector .status-card,.editor-inspector .action-status,.editor-inspector .shortcut-card { display:block !important; }
    .editor-inspector .tool-group { margin-top:1rem; }
    .editor-inspector .zoom-control { display:flex !important; }
    .editor-inspector .status-card { display:flex !important; }
    body.workspace-mode-editor .workspace-wrap { display:none; }
    body.workspace-mode-editor.animation-open .workspace-wrap { display:block; }

    @media(max-width:900px){
      .ai-home-shell{grid-template-columns:1fr;}
      .ai-preview-card{position:static;}
      .ai-simple-options{grid-template-columns:1fr;}
      .workspace-home,.workspace-library{padding:1rem;}
      body.workspace-mode-editor .studio-layout{grid-template-columns:76px minmax(0,1fr);}
      .editor-inspector{grid-column:1/-1;position:static;max-height:none;}
    }
    @media(max-width:650px){
      .workspace-secondary{grid-template-columns:1fr;}
      .project-row{grid-template-columns:1fr;}
      .workspace-nav strong{display:none;}
      .editor-commandbar{padding:.7rem 1rem 0;}
      body.workspace-mode-editor .studio-layout{padding:1rem;grid-template-columns:64px minmax(280px,1fr);}
    }
  `;
  document.head.appendChild(style);

  if (tutorialPanel) tutorialPanel.hidden = true;
  if (aiWrap) aiWrap.hidden = true;

  const nav = document.createElement('nav');
  nav.className = 'workspace-nav';
  nav.innerHTML = `
    <strong id="workspaceProjectTitle">Pixel Art AI Studio</strong>
    <span id="workspaceSaveStatus" class="workspace-save-status"></span>
    <button type="button" id="workspaceHomeBtn">⌂ IA</button>
    <button type="button" id="workspaceSaveBtn" hidden>💾 Guardar</button>
  `;
  document.body.insertBefore(nav, document.body.firstChild);

  const commandbar = document.createElement('div');
  commandbar.className = 'editor-commandbar';
  commandbar.innerHTML = `
    <button type="button" id="editorUndoBtn">↶ Deshacer</button>
    <button type="button" id="editorRedoBtn">↷ Rehacer</button>
    <span class="editor-spacer"></span>
    <button type="button" id="editorAnimationBtn">🎞️ Animar</button>
    <button type="button" id="editorExportBtn">⬇ PNG</button>
  `;
  mainStudio.insertAdjacentElement('beforebegin', commandbar);

  const home = document.createElement('section');
  home.id = 'workspaceHome';
  home.className = 'workspace-home';
  home.innerHTML = `
    <div class="ai-home-shell">
      <section class="ai-create-card">
        <p class="eyebrow">PIXEL ART AI STUDIO</p>
        <h2>Dime qué quieres crear.</h2>
        <p>Describe un sprite o una animación. El resultado usa un formato universal de píxeles y frames para que siga siendo completamente editable.</p>

        <label class="ai-prompt-label">Descripción
          <textarea id="aiHomePrompt" class="ai-prompt-box" placeholder="Ej. Una cama de madera 32x32 para RUMBO con sábanas azules, o una lámpara parpadeando en 4 frames."></textarea>
        </label>

        <div class="ai-simple-options">
          <label>Tamaño
            <select id="aiHomeSize">
              <option value="auto" selected>Automático</option>
              <option value="8">8 × 8</option>
              <option value="12">12 × 12</option>
              <option value="16">16 × 16</option>
              <option value="24">24 × 24</option>
              <option value="32">32 × 32</option>
              <option value="48">48 × 48</option>
              <option value="64">64 × 64</option>
            </select>
          </label>
          <label>Tipo
            <select id="aiHomeType">
              <option value="object" selected>Objeto</option>
              <option value="character">Personaje</option>
              <option value="tile">Tile</option>
              <option value="scene">Escena</option>
              <option value="effect">Efecto</option>
              <option value="animation">Animación</option>
            </select>
          </label>
          <label>Estilo
            <select id="aiHomeStyle">
              <option value="rumbo" selected>RUMBO</option>
              <option value="free">Libre</option>
            </select>
          </label>
        </div>

        <div class="ai-home-actions">
          <button id="aiHomeGenerate" class="ai-generate-primary" type="button">✨ Generar pixel art</button>
          <button id="aiHomeClear" type="button">Limpiar</button>
          <button id="aiHomeOpenEditor" type="button" disabled>🎨 Abrir en editor</button>
        </div>
        <div id="aiHomeStatus" class="ai-status">Describe una idea para comenzar.</div>
        <p class="ai-generator-note">Motor universal v1: objetos y animaciones usan el mismo esquema. El generador local sigue siendo provisional; el formato ya está preparado para reemplazarlo por IA real.</p>
      </section>

      <aside class="ai-preview-card">
        <p class="eyebrow">RESULTADO</p>
        <h3 id="aiPreviewTitle">Esperando una idea</h3>
        <div id="aiPreviewMeta" class="ai-preview-meta">El resultado aparecerá aquí como píxeles editables.</div>
        <div class="ai-pixel-preview-wrap">
          <div id="aiPixelPreviewEmpty" class="ai-preview-empty">🤖<br>Escribe lo que quieres crear y pulsa <strong>Generar pixel art</strong>.</div>
          <div id="aiPixelPreview" class="ai-pixel-preview" hidden></div>
        </div>
        <div id="aiFrameBadge" class="ai-frame-badge" hidden></div>
        <div id="aiPalettePreview" class="ai-palette-preview"></div>
      </aside>
    </div>

    <div class="workspace-secondary">
      <button class="workspace-secondary-card" type="button" data-home-action="load"><span>📂</span><strong>Abrir proyecto</strong><small>Continúa uno de tus proyectos guardados o importa un archivo.</small></button>
      <button class="workspace-secondary-card" type="button" data-home-action="library"><span>📚</span><strong>Biblioteca</strong><small>Los assets que guardemos para RUMBO aparecerán aquí.</small></button>
    </div>
  `;
  if (header) header.insertAdjacentElement('afterend', home);
  else document.body.insertBefore(home, mainStudio);

  const library = document.createElement('section');
  library.id = 'workspaceLibrary';
  library.className = 'workspace-library';
  library.hidden = true;
  library.innerHTML = `
    <div class="workspace-hero"><p class="eyebrow">BIBLIOTECA</p><h2>Assets de RUMBO</h2><p>Aquí guardaremos objetos, personajes, tiles, efectos y animaciones generadas o editadas en Pixel Art AI Studio.</p></div>
    <div class="empty-library">📚 La biblioteca todavía está vacía. El formato universal ya permite almacenar sprites y animaciones de la misma manera.</div>
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
    inspector.innerHTML = `<p class="eyebrow">EDITOR</p><h3>Color y lienzo</h3>`;
    [...toolsPanel.querySelectorAll('.tool-group')].forEach(group => inspector.appendChild(group));
    for (const selector of ['.zoom-control','.status-card','.action-status','.shortcut-card']) {
      const node = toolsPanel.querySelector(selector); if (node) inspector.appendChild(node);
    }
    mainStudio.appendChild(inspector);
    toolsPanel.querySelector('.panel-title-row')?.remove();
    toolsPanel.querySelector('.history-actions')?.style.setProperty('display','none','important');
    toolsPanel.querySelector('.utility-actions')?.style.setProperty('display','none','important');
  }
  buildInspector();

  const saveBtn = document.getElementById('workspaceSaveBtn');
  const saveStatus = document.getElementById('workspaceSaveStatus');
  const projectTitle = document.getElementById('workspaceProjectTitle');

  function refreshProjectInfo(message = '') {
    const info = window.PixelProject?.getCurrentInfo?.() || { named:false, name:null };
    projectTitle.textContent = info.named ? info.name : 'Pixel Art AI Studio';
    saveStatus.textContent = message || (info.named ? 'Proyecto activo' : '');
  }

  function setMode(mode) {
    document.body.classList.remove('workspace-mode-home','workspace-mode-editor','workspace-mode-library','animation-open');
    document.body.classList.add(`workspace-mode-${mode}`);
    home.hidden = mode !== 'home';
    library.hidden = mode !== 'library';
    saveBtn.hidden = mode !== 'editor';
    if (mode !== 'home') window.scrollTo({ top:0, behavior:'smooth' });
  }

  function renderAIPreview(asset) {
    const preview = document.getElementById('aiPixelPreview');
    const empty = document.getElementById('aiPixelPreviewEmpty');
    const title = document.getElementById('aiPreviewTitle');
    const meta = document.getElementById('aiPreviewMeta');
    const palette = document.getElementById('aiPalettePreview');
    const frameBadge = document.getElementById('aiFrameBadge');
    if (!preview || !asset) return;

    const size = Number(asset.canvas.width);
    const flat = window.PixelAISchema.frameToFlat(asset,0);
    title.textContent = asset.name;
    meta.textContent = `${size}×${size} · ${asset.assetType} · ${asset.style.profile} · editable`;
    preview.innerHTML = '';
    preview.style.gridTemplateColumns = `repeat(${size},1fr)`;
    preview.style.gridTemplateRows = `repeat(${size},1fr)`;
    flat.forEach(color => {
      const px = document.createElement('span');
      px.style.background = color === 'transparent' ? 'transparent' : color;
      preview.appendChild(px);
    });
    empty.hidden = true;
    preview.hidden = false;

    frameBadge.hidden = false;
    frameBadge.textContent = asset.frames.length === 1 ? '1 frame · sprite estático' : `${asset.frames.length} frames · animación`;

    palette.innerHTML = '';
    asset.palette.filter(entry => entry.hex !== 'transparent').forEach(entry => {
      const chip = document.createElement('span');
      chip.className = 'ai-palette-chip';
      chip.style.background = entry.hex;
      chip.title = `${entry.id} · ${entry.role} · ${entry.hex}`;
      palette.appendChild(chip);
    });
  }

  function generateFromPrompt() {
    const prompt = document.getElementById('aiHomePrompt')?.value.trim();
    const status = document.getElementById('aiHomeStatus');
    if (!prompt) { status.textContent = 'Escribe primero qué quieres crear.'; return; }
    if (!window.PixelAIGenerator || !window.PixelAISchema) { status.textContent = 'El motor todavía está cargando.'; return; }
    try {
      latestAIResult = window.PixelAIGenerator.generate({
        prompt,
        size: document.getElementById('aiHomeSize')?.value || 'auto',
        type: document.getElementById('aiHomeType')?.value || 'object',
        style: document.getElementById('aiHomeStyle')?.value || 'rumbo'
      });
      const checked = window.PixelAISchema.validate(latestAIResult);
      if (!checked.ok) throw new Error(checked.errors[0]);
      window.PixelProject?.newProject?.();
      renderAIPreview(latestAIResult);
      document.getElementById('aiHomeOpenEditor').disabled = false;
      const size = latestAIResult.canvas.width;
      const frames = latestAIResult.frames.length;
      status.textContent = `Listo: ${size}×${size} · ${frames} frame${frames===1?'':'s'}. Abre el editor para retocarlo.`;
    } catch (error) {
      status.textContent = error.message || 'No se pudo generar.';
    }
  }

  function openGeneratedAsset() {
    if (!latestAIResult) return;
    try {
      window.PixelAIGenerator.apply(latestAIResult);
      setMode('editor');
      if (latestAIResult.assetType === 'animation') toggleAnimation(true);
      refreshProjectInfo(latestAIResult.assetType === 'animation' ? 'Animación generada' : 'Sprite generado');
    } catch (error) {
      document.getElementById('aiHomeStatus').textContent = error.message || 'No se pudo abrir en el editor.';
    }
  }

  function clearAIHome() {
    latestAIResult = null;
    document.getElementById('aiHomePrompt').value = '';
    document.getElementById('aiHomeOpenEditor').disabled = true;
    document.getElementById('aiHomeStatus').textContent = 'Describe una idea para comenzar.';
    document.getElementById('aiPreviewTitle').textContent = 'Esperando una idea';
    document.getElementById('aiPreviewMeta').textContent = 'El resultado aparecerá aquí como píxeles editables.';
    document.getElementById('aiPixelPreview').hidden = true;
    document.getElementById('aiPixelPreview').innerHTML = '';
    document.getElementById('aiPixelPreviewEmpty').hidden = false;
    document.getElementById('aiPalettePreview').innerHTML = '';
    document.getElementById('aiFrameBadge').hidden = true;
  }

  function toggleAnimation(force) {
    const next = typeof force === 'boolean' ? force : !document.body.classList.contains('animation-open');
    document.body.classList.toggle('animation-open', next);
    document.getElementById('editorAnimationBtn')?.classList.toggle('active', next);
    if (next) animationWrap?.scrollIntoView({ behavior:'smooth', block:'start' });
  }

  function closeModal() { modalBackdrop.hidden = true; document.getElementById('workspaceModal').innerHTML = ''; }

  function openNameModal() {
    const modal = document.getElementById('workspaceModal');
    modal.innerHTML = `<p class="eyebrow">PRIMER GUARDADO</p><h3>Nombre del proyecto</h3><p>Después podrás seguir guardando sobre el mismo proyecto con un clic.</p><input id="firstProjectName" type="text" maxlength="80" placeholder="Ej. Cama habitación Nicolás"><div class="workspace-modal-actions"><button type="button" data-modal-close>Cancelar</button><button type="button" id="confirmFirstSave">Guardar</button></div>`;
    modalBackdrop.hidden = false;
    requestAnimationFrame(() => document.getElementById('firstProjectName')?.focus());
    document.getElementById('confirmFirstSave')?.addEventListener('click', () => {
      const name = document.getElementById('firstProjectName')?.value.trim();
      if (name && window.PixelProject?.saveNamed?.(name)) { closeModal(); refreshProjectInfo('Guardado ✓'); }
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
    modal.innerHTML = `<p class="eyebrow">ABRIR PROYECTO</p><h3>Tus proyectos</h3><div id="savedProjectList" class="project-list"></div><div class="workspace-modal-actions"><input id="workspaceImportInput" type="file" accept=".json,.pixelstudio.json,application/json" hidden><button type="button" id="workspaceImportBtn">⬆ Importar</button><button type="button" data-modal-close>Cerrar</button></div>`;
    const list = document.getElementById('savedProjectList');
    if (!projects.length) list.innerHTML = '<div class="empty-library">Todavía no hay proyectos guardados.</div>';
    projects.forEach(project => {
      const row = document.createElement('div'); row.className = 'project-row';
      row.innerHTML = `<div><strong>${project.name}</strong><small>${new Date(project.savedAt).toLocaleString()}</small></div><button type="button">Abrir</button><button type="button">Eliminar</button>`;
      const [open, remove] = row.querySelectorAll('button');
      open.addEventListener('click', () => { if (window.PixelProject.loadProjectById(project.id)) { closeModal(); setMode('editor'); refreshProjectInfo('Proyecto cargado'); } });
      remove.addEventListener('click', () => { window.PixelProject.deleteProject(project.id); renderLoader(); });
      list.appendChild(row);
    });
    modalBackdrop.hidden = false;
    document.getElementById('workspaceImportBtn')?.addEventListener('click', () => document.getElementById('workspaceImportInput')?.click());
    document.getElementById('workspaceImportInput')?.addEventListener('change', async event => {
      const file = event.target.files?.[0]; if (!file) return;
      try { await window.PixelProject.importFile(file); closeModal(); setMode('editor'); refreshProjectInfo('Proyecto importado'); }
      catch (error) { alert(`No se pudo importar: ${error.message}`); }
    });
  }

  document.getElementById('aiHomeGenerate')?.addEventListener('click', generateFromPrompt);
  document.getElementById('aiHomeClear')?.addEventListener('click', clearAIHome);
  document.getElementById('aiHomeOpenEditor')?.addEventListener('click', openGeneratedAsset);
  document.getElementById('aiHomePrompt')?.addEventListener('keydown', event => { if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') generateFromPrompt(); });

  document.addEventListener('click', event => {
    if (event.target.closest('[data-modal-close]')) return closeModal();
    const action = event.target.closest('[data-home-action]')?.dataset.homeAction;
    if (action === 'library') setMode('library');
    if (action === 'load') renderLoader();
  });

  document.getElementById('workspaceHomeBtn')?.addEventListener('click', () => { setMode('home'); refreshProjectInfo(); });
  saveBtn?.addEventListener('click', smartSave);
  document.getElementById('editorUndoBtn')?.addEventListener('click', () => document.getElementById('undoBtn')?.click());
  document.getElementById('editorRedoBtn')?.addEventListener('click', () => document.getElementById('redoBtn')?.click());
  document.getElementById('editorExportBtn')?.addEventListener('click', () => document.getElementById('exportBtn')?.click());
  document.getElementById('editorAnimationBtn')?.addEventListener('click', () => toggleAnimation());
  modalBackdrop.addEventListener('click', event => { if (event.target === modalBackdrop) closeModal(); });
  window.addEventListener('pixelprojectchange', () => refreshProjectInfo());

  document.querySelector('.topbar h1')?.replaceChildren(document.createTextNode('Describe. Genera. Edita. Anima.'));
  document.querySelector('.version')?.replaceChildren(document.createTextNode('v1.1 universal assets'));
  setMode('home');
  refreshProjectInfo();

  window.PixelWorkspace = { setMode, smartSave, renderLoader, toggleAnimation, generateFromPrompt };
})();