window.PixelLayers = (() => {
  if (!window.PixelCanvas?.getLayerState) return null;

  let panel = null;
  let list = null;
  let nameInput = null;

  const style = document.createElement('style');
  style.id = 'pixelLayersStyles';
  style.textContent = `
    .layers-panel { margin-top:1.15rem; padding-top:1rem; border-top:1px solid var(--border); }
    .layers-panel-head { display:flex; align-items:center; justify-content:space-between; gap:.5rem; }
    .layers-panel-head h4 { margin:0; }
    .layers-toolbar { display:grid; grid-template-columns:repeat(3,1fr); gap:.4rem; margin:.7rem 0; }
    .layers-list { display:grid; gap:.45rem; }
    .layer-row { display:grid; grid-template-columns:auto minmax(0,1fr) auto; align-items:center; gap:.45rem; padding:.55rem; border:1px solid var(--border); background:var(--panel-2); }
    .layer-row.active { border-color:var(--accent); box-shadow:inset 0 0 0 1px var(--accent); }
    .layer-row-name { min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; cursor:pointer; }
    .layer-row-actions { display:flex; gap:.25rem; }
    .layer-row-actions button, .layer-visibility { min-width:34px; padding:.35rem; }
    .layer-name-edit { width:100%; box-sizing:border-box; margin:.55rem 0 0; padding:.55rem; background:var(--panel-2); color:var(--text); border:1px solid var(--border); }
    .layers-note { color:var(--muted); font-size:.72rem; line-height:1.4; margin:.55rem 0 0; }
  `;
  document.head.appendChild(style);

  function state() { return window.PixelCanvas.getLayerState(); }

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

      const label = document.createElement('button');
      label.type = 'button';
      label.className = 'layer-row-name';
      label.textContent = layer.name;
      label.title = `Editar ${layer.name}`;
      label.addEventListener('click', () => window.PixelCanvas.setActiveLayer(layer.id));
      label.addEventListener('dblclick', () => {
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

      row.append(eye, label, actions);
      row.addEventListener('click', () => window.PixelCanvas.setActiveLayer(layer.id));
      list.appendChild(row);
    });

    const active = data.layers.find(layer => layer.id === data.activeLayerId);
    if (nameInput) nameInput.value = active?.name || '';
  }

  function install() {
    const inspector = document.getElementById('editorInspector');
    if (!inspector || document.getElementById('pixelLayersPanel')) return false;

    panel = document.createElement('section');
    panel.id = 'pixelLayersPanel';
    panel.className = 'layers-panel';
    panel.innerHTML = `
      <div class="layers-panel-head"><div><p class="eyebrow">CAPAS</p><h4>Composición</h4></div><button type="button" id="addLayerBtn" title="Nueva capa">＋</button></div>
      <div class="layers-toolbar">
        <button type="button" id="duplicateLayerBtn">Duplicar</button>
        <button type="button" id="deleteLayerBtn">Eliminar</button>
        <button type="button" id="renameLayerBtn">Renombrar</button>
      </div>
      <div id="layersList" class="layers-list"></div>
      <input id="activeLayerName" class="layer-name-edit" type="text" maxlength="60" aria-label="Nombre de la capa activa">
      <p class="layers-note">Las herramientas editan únicamente la capa activa. La exportación combina todas las capas visibles.</p>
    `;
    inspector.appendChild(panel);
    list = panel.querySelector('#layersList');
    nameInput = panel.querySelector('#activeLayerName');

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