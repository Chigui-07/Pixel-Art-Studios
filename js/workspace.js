(() => {
  const mainStudio = document.querySelector('.studio-layout');
  const animationWrap = document.querySelector('.workspace-wrap');
  const aiWrap = document.querySelector('.ai-lab-wrap');
  const projectWrap = document.querySelector('.project-wrap');
  const tutorialPanel = document.querySelector('.tutorial-panel');
  const header = document.querySelector('.topbar');

  if (!mainStudio || document.getElementById('workspaceHome')) return;

  const style = document.createElement('style');
  style.id = 'workspaceMenuStyles';
  style.textContent = `
    body.workspace-mode-home .studio-layout,
    body.workspace-mode-home .workspace-wrap,
    body.workspace-mode-home .ai-lab-wrap,
    body.workspace-mode-home .project-wrap { display:none !important; }

    body.workspace-mode-draw .workspace-wrap,
    body.workspace-mode-draw .ai-lab-wrap { display:none !important; }

    body.workspace-mode-animation .ai-lab-wrap { display:none !important; }
    body.workspace-mode-animation .tutorial-panel { display:none !important; }
    body.workspace-mode-animation .studio-layout { grid-template-columns:minmax(220px,270px) minmax(420px,1fr); }

    body.workspace-mode-ai .studio-layout,
    body.workspace-mode-ai .workspace-wrap,
    body.workspace-mode-ai .project-wrap { display:none !important; }

    body.workspace-mode-project .studio-layout,
    body.workspace-mode-project .workspace-wrap,
    body.workspace-mode-project .ai-lab-wrap { display:none !important; }

    .workspace-home {
      width:min(1450px,100%);
      margin:0 auto;
      padding:2rem;
    }

    .workspace-hero {
      border:1px solid var(--border);
      background:linear-gradient(135deg,#202029,#17171d);
      padding:2rem;
      margin-bottom:1.25rem;
    }

    .workspace-hero h2 { margin:.35rem 0 .7rem; font-size:clamp(1.8rem,4vw,3rem); }
    .workspace-hero p { max-width:850px; color:var(--muted); line-height:1.6; }

    .workspace-grid {
      display:grid;
      grid-template-columns:repeat(3,minmax(0,1fr));
      gap:1rem;
    }

    .workspace-card {
      text-align:left;
      min-height:180px;
      padding:1.25rem;
      display:flex;
      flex-direction:column;
      justify-content:space-between;
      border:1px solid var(--border);
      background:var(--panel);
      color:var(--text);
    }

    .workspace-card:hover { border-color:var(--accent); transform:translateY(-2px); }
    .workspace-card .workspace-icon { font-size:2rem; }
    .workspace-card strong { display:block; margin:.75rem 0 .35rem; font-size:1.05rem; }
    .workspace-card small { color:var(--muted); line-height:1.45; }
    .workspace-card .workspace-state { margin-top:1rem; color:var(--accent); font-size:.72rem; font-weight:700; }

    .workspace-nav {
      position:sticky;
      top:0;
      z-index:50;
      display:flex;
      gap:.55rem;
      align-items:center;
      padding:.7rem 1rem;
      border-bottom:1px solid var(--border);
      background:rgba(21,21,27,.96);
      backdrop-filter:blur(8px);
    }

    .workspace-nav strong { margin-right:auto; }
    .workspace-nav button { padding:.55rem .75rem; }
    .workspace-nav button.active { border-color:var(--accent); }

    .workspace-section-label {
      width:min(1550px,100%);
      margin:1rem auto 0;
      padding:0 2rem;
      color:var(--muted);
      font-size:.8rem;
    }

    @media(max-width:1000px){ .workspace-grid{grid-template-columns:repeat(2,minmax(0,1fr));} }
    @media(max-width:700px){
      .workspace-home{padding:1rem;}
      .workspace-grid{grid-template-columns:1fr;}
      .workspace-nav{overflow-x:auto;}
      .workspace-nav strong{display:none;}
      .workspace-card{min-height:150px;}
    }
  `;
  document.head.appendChild(style);

  const nav = document.createElement('nav');
  nav.className = 'workspace-nav';
  nav.innerHTML = `
    <strong>Pixel Art Studios</strong>
    <button type="button" data-workspace="home">⌂ Inicio</button>
    <button type="button" data-workspace="draw">🎨 Editor</button>
    <button type="button" data-workspace="animation">🎞️ Animación</button>
    <button type="button" data-workspace="project">💾 Proyecto</button>
    <button type="button" data-workspace="ai">🤖 AI Lab</button>
  `;
  document.body.insertBefore(nav, document.body.firstChild);

  const home = document.createElement('section');
  home.id = 'workspaceHome';
  home.className = 'workspace-home';
  home.innerHTML = `
    <div class="workspace-hero">
      <p class="eyebrow">PIXEL ART STUDIOS · WORKSPACE</p>
      <h2>¿Qué vas a crear hoy?</h2>
      <p>Elige un área de trabajo. La versión estable sigue intacta en <strong>main</strong>; este rediseño vive en la rama <strong>redesign/menu-workspace</strong> mientras organizamos el estudio para producción de RUMBO.</p>
    </div>

    <div class="workspace-grid">
      <button class="workspace-card" type="button" data-workspace="draw" data-preset="object">
        <span><span class="workspace-icon">📦</span><strong>Objeto / Asset</strong><small>Muebles, comida, props, decoración, herramientas y objetos del mundo.</small></span>
        <span class="workspace-state">ABRIR EDITOR →</span>
      </button>

      <button class="workspace-card" type="button" data-workspace="draw" data-preset="character">
        <span><span class="workspace-icon">🧍</span><strong>Personaje</strong><small>Diseña sprites base, poses, ropa, expresiones y variantes de personajes.</small></span>
        <span class="workspace-state">ABRIR EDITOR →</span>
      </button>

      <button class="workspace-card" type="button" data-workspace="animation">
        <span><span class="workspace-icon">🎞️</span><strong>Animación</strong><small>Frames, onion skin, duración individual y spritesheets para movimientos y escenas.</small></span>
        <span class="workspace-state">ABRIR ANIMATION LAB →</span>
      </button>

      <button class="workspace-card" type="button" data-workspace="draw" data-preset="scene">
        <span><span class="workspace-icon">🏙️</span><strong>Escena</strong><small>Habitaciones, exteriores, fondos y composiciones para secuencias del juego.</small></span>
        <span class="workspace-state">ABRIR EDITOR →</span>
      </button>

      <button class="workspace-card" type="button" data-workspace="draw" data-preset="tile">
        <span><span class="workspace-icon">🧱</span><strong>Tileset</strong><small>Pisos, paredes, caminos, vegetación y piezas reutilizables de mapas.</small></span>
        <span class="workspace-state">ABRIR EDITOR →</span>
      </button>

      <button class="workspace-card" type="button" data-workspace="ai">
        <span><span class="workspace-icon">🤖</span><strong>AI Lab</strong><small>Prepara especificaciones para objetos, personajes, animaciones y escenas asistidas por IA.</small></span>
        <span class="workspace-state">ABRIR AI LAB →</span>
      </button>

      <button class="workspace-card" type="button" data-workspace="project">
        <span><span class="workspace-icon">💾</span><strong>Proyectos</strong><small>Guardar, cargar, importar y exportar trabajos completos de producción.</small></span>
        <span class="workspace-state">GESTIONAR PROYECTO →</span>
      </button>

      <button class="workspace-card" type="button" data-workspace="draw" data-preset="effect">
        <span><span class="workspace-icon">✨</span><strong>Efectos</strong><small>Brillos, polvo, lluvia, humo y pequeños efectos animados en pixel art.</small></span>
        <span class="workspace-state">ABRIR EDITOR →</span>
      </button>

      <button class="workspace-card" type="button" disabled>
        <span><span class="workspace-icon">📚</span><strong>Biblioteca RUMBO</strong><small>Personajes y assets reutilizables. Será el siguiente módulo grande.</small></span>
        <span class="workspace-state">PRÓXIMAMENTE</span>
      </button>
    </div>
  `;

  if (header) header.insertAdjacentElement('afterend', home);
  else document.body.insertBefore(home, mainStudio);

  const label = document.createElement('div');
  label.className = 'workspace-section-label';
  label.id = 'workspaceSectionLabel';
  mainStudio.insertAdjacentElement('beforebegin', label);

  function ensureProjectVisible() {
    const currentProject = document.querySelector('.project-wrap');
    return currentProject;
  }

  function applyPreset(preset) {
    const category = document.getElementById('aiCategory');
    if (!category || !preset) return;
    const map = {
      object: 'item',
      character: 'character',
      scene: 'scene',
      tile: 'tile',
      effect: 'item'
    };
    if (map[preset]) category.value = map[preset];
  }

  function setWorkspace(mode, preset = null) {
    document.body.classList.remove('workspace-mode-home','workspace-mode-draw','workspace-mode-animation','workspace-mode-ai','workspace-mode-project');
    document.body.classList.add(`workspace-mode-${mode}`);
    applyPreset(preset);

    home.hidden = mode !== 'home';
    const project = ensureProjectVisible();
    if (project) project.style.display = '';

    const labels = {
      home: '',
      draw: preset === 'character' ? 'PERSONAJE · EDITOR' : preset === 'scene' ? 'ESCENA · EDITOR' : preset === 'tile' ? 'TILESET · EDITOR' : preset === 'effect' ? 'EFECTOS · EDITOR' : 'OBJETO / ASSET · EDITOR',
      animation: 'ANIMACIÓN · EDITOR + TIMELINE',
      ai: 'AI LAB · ESPECIFICACIONES',
      project: 'PROYECTO · GUARDAR / CARGAR'
    };
    label.textContent = labels[mode] || '';
    label.hidden = mode === 'home';

    nav.querySelectorAll('[data-workspace]').forEach(button => {
      button.classList.toggle('active', button.dataset.workspace === mode);
    });

    if (mode !== 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('[data-workspace]');
    if (!button || button.disabled) return;
    setWorkspace(button.dataset.workspace, button.dataset.preset || null);
  });

  const observer = new MutationObserver(() => {
    const project = ensureProjectVisible();
    if (project && document.body.classList.contains('workspace-mode-home')) project.style.display = 'none';
  });
  observer.observe(document.body, { childList:true, subtree:false });

  document.querySelector('.version')?.replaceChildren(document.createTextNode('v0.6 redesign'));
  setWorkspace('home');

  window.PixelWorkspace = { setWorkspace };
})();