window.PixelLayers = (() => {
  if (!window.PixelCanvas?.getLayerState) return null;

  let panel = null;
  let list = null;
  let nameInput = null;
  let activeLabel = null;

  const style = document.createElement('style');
  style.id = 'pixelLayersStyles';
  style.textContent = `
    .layers-panel { margin-top:1.15rem; padding-top:1rem; border-top:1px solid var(--border); }
    .layers-panel-head { display:flex; align-items:center; justify-content:space-between; gap:.5rem; }
    .layers-panel-head h4 { margin:0; }
    .layers-toolbar { display:grid; grid-template-columns:repeat(3,1fr); gap:.4rem; margin:.7rem 0; }
    .layers-active-label { margin:.25rem 0 .65rem; padding:.55rem .65rem; border:1px solid var(--border); background:var(--panel-2); font-size:.78rem; }
    .layers-active-label strong { color:var(--accent); }
    .layers-list { display:grid; gap:.45rem; }
    .layer-row { display:grid; grid-template-columns:auto 42px minmax(0,1fr) auto; align-items:center; gap:.45rem; padding:.55rem; border:1px solid var(--border); background:var(--panel-2); cursor:pointer; }
    .layer-row.active { border-color:var(--accent); box-shadow:inset 0 0 0 1px var(--accent); background:rgba(255,255,255,.04); }
    .layer-row.active .layer-row-name::after { content:'  · ACTIVA'; color:var(--accent); font-size:.64rem; font-weight:700; }
    .layer-thumb { width:40px; height:40px; display:grid; border:1px solid var(--border); background-color:#fff; background-image:linear-gradient(45deg,#ddd 25%,transparent 25%),linear-gradient(-45deg,#ddd 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#ddd 75%),linear-gradient(-45deg,transparent 75%,#ddd 75%); background-size:8px 8px; background-position:0 0,0 4px,4px -4px,-4px 0; overflow:hidden; image-rendering:pixelated; }
    .layer-thumb span { min-width:0; min-height:0; }
    .layer-row-name { min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; cursor:pointer; text-align:left; }
    .layer-row-actions { display:flex; gap:.25rem; }
    .layer-row-actions button, .layer-visibility { min-width:34px; padding:.35rem; }
    .layer-name-edit { width:100%; box-sizing:border-box; margin:.55rem 0 0; padding:.55rem; background:var(--panel-2); color:var(--text); border:1px solid var(--border); }
    .layers-note { color:var(--muted); font-size:.72rem; line-height:1.4; margin:.55rem 0 0; }
  `;
  document.head.appendChild(style);

  function state() { return window.PixelCanvas.getLayerState(); }

  function buildThumb(layer, size) {
    const thumb = document.createElement('div');
    thumb.className = 'layer-thumb';
    thumb.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    layer.pixels.forEach(color => {
      const px = document.createElement('span');
      px.style.background = color === 'transparent' ? 'transparent' : color;
      thumb.appendChild(px);
    });
    return thumb;
  }

  function activateLayer(id) {
    if (!window.PixelCanvas.setActiveLayer(id)) return;
    requestAnimationFrame(render);
  }

  function render() {
    if (!list) return;
    const data = state();
    list.innerHTML = '';
    [...data.layers].reverse().forEach(layer => {
      const row = document.createElement('div');
      row.className = `layer-row${layer.id === data.activeLayerId ? ' active' : ''}`;
      row.dataset.layerId = layer.id;

      const eye = document.createElement('button');
      eye.type = 'button';
      eye.className = 'layer-visibility';
      eye.title = layer.visible ? 'Ocultar capa' : 'Mostrar capa';
      eye.textContent = layer.visible ? '👁' : '◌';
      eye.addEventListener('click', event => {
        event.stopPropagation();
        window.PixelCanvas.toggleLayerVisibility(layer.id);
      });

      const thumb = buildThumb(layer, data.size);

      const label = document.createElement('button');
      label.type = 'button';
      label.className = 'layer-row-name';
      label.textContent = layer.name;
      label.title = `Editar ${layer.name}`;
      label.addEventListener('click', event => {
        event.stopPropagation();
        activateLayer(layer.id);
      });
      label.addEventListener('dblclick', event => {
        event.stopPropagation();
        const next = prompt('Nombre de la capa:', layer.name);
        if (next) window.PixelCanvas.renameLayer(layer.id, next);
      });

      const actions = document.createElement('div');
      actions.className = 'layer-row-actions';
      const up = document.createElement('button');
      up.type = 'button'; up.textContent = '↑'; up.title = 'Subir capa';
      up.addEventListener('click', event => { event.stopPropagation(); window.PixelCanvas.moveLayer(layer.id, 'up'); });
      const down = document.createElement('button');
      down.type = 'button'; down.textContent = '↓'; down.title = 'Bajar capa';
      down.addEventListener('click', event => { event.stopPropagation(); window.PixelCanvas.moveLayer(layer.id, 'down'); });
      actions.append(up, down);

      row.append(eye, thumb, label, actions);
      row.addEventListener('click', () => activateLayer(layer.id));
      list.appendChild(row);
    });

    const active = data.layers.find(layer => layer.id === data.activeLayerId);
    if (nameInput) nameInput.value = active?.name || '';
    if (activeLabel) activeLabel.innerHTML = `Editando: <strong>${active?.name || '—'}</strong>`;
  }

  function install() {
    const inspector = document.getElementById('editorInspector');
    if (!inspector || document.getElementById('pixelLayersPanel')) return false;

    panel = document.createElement('section');
    panel.id = 'pixelLayersPanel';
    panel.className = 'layers-panel';
    panel.innerHTML = `
      <div class="layers-panel-head"><div><p class="eyebrow">CAPAS</p><h4>Composición</h4></div><button type="button" id="addLayerBtn" title="Nueva capa">＋</button></div>
      <div id="layersActiveLabel" class="layers-active-label"></div>
      <div class="layers-toolbar">
        <button type="button" id="duplicateLayerBtn">Duplicar</button>
        <button type="button" id="deleteLayerBtn">Eliminar</button>
        <button type="button" id="renameLayerBtn">Renombrar</button>
      </div>
      <div id="layersList" class="layers-list"></div>
      <input id="activeLayerName" class="layer-name-edit" type="text" maxlength="60" aria-label="Nombre de la capa activa">
      <p class="layers-note">Haz clic en una fila o miniatura para cambiar de capa. Todas las capas visibles se siguen viendo juntas; solo se edita la capa marcada como ACTIVA.</p>
    `;
    inspector.appendChild(panel);
    list = panel.querySelector('#layersList');
    nameInput = panel.querySelector('#activeLayerName');
    activeLabel = panel.querySelector('#layersActiveLabel');

    panel.querySelector('#addLayerBtn').addEventListener('click', () => window.PixelCanvas.addLayer());
    panel.querySelector('#duplicateLayerBtn').addEventListener('click', () => window.PixelCanvas.duplicateLayer());
    panel.querySelector('#deleteLayerBtn').addEventListener('click', () => {
      if (!window.PixelCanvas.deleteLayer()) alert('Debe quedar al menos una capa.');
    });
    panel.querySelector('#renameLayerBtn').addEventListener('click', () => {
      const data = state();
      const active = data.layers.find(layer => layer.id === data.activeLayerId);
      const next = prompt('Nombre de la capa:', active?.name || 'Capa');
      if (next) window.PixelCanvas.renameLayer(data.activeLayerId, next);
    });
    nameInput.addEventListener('change', () => {
      const data = state();
      window.PixelCanvas.renameLayer(data.activeLayerId, nameInput.value);
    });

    render();
    return true;
  }

  window.addEventListener('pixellayerchange', render);
  window.addEventListener('pixelsizechange', () => requestAnimationFrame(render));
  window.addEventListener('pixelprojectloaded', () => requestAnimationFrame(render));

  if (!install()) {
    const observer = new MutationObserver(() => {
      if (install()) observer.disconnect();
    });
    observer.observe(document.body, { childList:true, subtree:true });
  }

  return { render, getState: state };
})();