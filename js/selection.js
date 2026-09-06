window.PixelSelection = (() => {
  const canvas = document.getElementById('pixelCanvas');
  const toolGrid = document.querySelector('.tool-buttons.tool-grid');
  const toolStatus = document.getElementById('toolStatus');
  const actionStatus = document.getElementById('actionStatus');
  if (!canvas || !toolGrid || !window.PixelCanvas) return null;

  const EMPTY = window.PixelCanvas.getEmptyColor?.() || 'transparent';
  let active = false;
  let selecting = false;
  let moving = false;
  let start = null;
  let selection = null;
  let moveOrigin = null;
  let moveStart = null;
  let clipboard = null;
  let statusTimer = null;

  const style = document.createElement('style');
  style.textContent = `
    .pixel.selection-cell { position:relative; box-shadow:inset 0 0 0 2px rgba(255,213,79,.9); }
    .pixel.selection-edge-top { border-top:2px dashed #ffd54f !important; }
    .pixel.selection-edge-right { border-right:2px dashed #ffd54f !important; }
    .pixel.selection-edge-bottom { border-bottom:2px dashed #ffd54f !important; }
    .pixel.selection-edge-left { border-left:2px dashed #ffd54f !important; }
    .pixel-canvas.selection-mode { cursor:crosshair; }
    .pixel-canvas.selection-moving { cursor:move; }
    .selection-actions { display:grid; gap:.5rem; margin-top:1rem; }
    .selection-actions .selection-row { display:grid; grid-template-columns:repeat(3,1fr); gap:.45rem; }
    .selection-actions .selection-clear { width:100%; }
    .selection-hint { color:var(--muted); font-size:.75rem; line-height:1.45; margin:.55rem 0 0; }
  `;
  document.head.appendChild(style);

  const selectBtn = document.createElement('button');
  selectBtn.id = 'selectBtn';
  selectBtn.type = 'button';
  selectBtn.textContent = '⬚ Selección';
  selectBtn.title = 'Selección rectangular (S)';
  toolGrid.appendChild(selectBtn);

  function showStatus(message) {
    if (!actionStatus) return;
    actionStatus.textContent = message;
    actionStatus.classList.add('visible');
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => actionStatus.classList.remove('visible'), 2200);
  }

  function editableState() {
    return window.PixelCanvas.getActiveLayerState?.() || window.PixelCanvas.getState();
  }

  function loadEditableState(state, options = {}) {
    if (window.PixelCanvas.loadActiveLayerState) return window.PixelCanvas.loadActiveLayerState(state, options);
    return window.PixelCanvas.loadState(state, options);
  }

  function coords(pixel) {
    const size = window.PixelCanvas.getSize();
    const index = Number(pixel.dataset.index);
    return { x:index % size, y:Math.floor(index / size) };
  }

  function pixelAt(x,y) {
    const size = window.PixelCanvas.getSize();
    if (x < 0 || y < 0 || x >= size || y >= size) return null;
    return canvas.children[y * size + x] || null;
  }

  function pointFromEvent(event) {
    const element = document.elementFromPoint(event.clientX,event.clientY);
    const pixel = element?.closest?.('.pixel');
    return pixel && canvas.contains(pixel) ? coords(pixel) : null;
  }

  function rectFrom(a,b) {
    return {
      x:Math.min(a.x,b.x), y:Math.min(a.y,b.y),
      w:Math.abs(a.x-b.x)+1, h:Math.abs(a.y-b.y)+1
    };
  }

  function contains(rect,p) {
    return rect && p.x >= rect.x && p.x < rect.x+rect.w && p.y >= rect.y && p.y < rect.y+rect.h;
  }

  function clearVisual() {
    [...canvas.children].forEach(pixel => {
      pixel.classList.remove('selection-cell','selection-edge-top','selection-edge-right','selection-edge-bottom','selection-edge-left');
    });
  }

  function renderSelection() {
    clearVisual();
    if (!selection) return;
    for (let y=selection.y; y<selection.y+selection.h; y++) {
      for (let x=selection.x; x<selection.x+selection.w; x++) {
        const pixel = pixelAt(x,y);
        if (!pixel) continue;
        pixel.classList.add('selection-cell');
        if (y===selection.y) pixel.classList.add('selection-edge-top');
        if (y===selection.y+selection.h-1) pixel.classList.add('selection-edge-bottom');
        if (x===selection.x) pixel.classList.add('selection-edge-left');
        if (x===selection.x+selection.w-1) pixel.classList.add('selection-edge-right');
      }
    }
  }

  function activate() {
    active = true;
    [...toolGrid.querySelectorAll('button')].forEach(btn => btn.classList.toggle('active',btn===selectBtn));
    canvas.classList.add('selection-mode');
    window.PixelCanvas.setTool('select');
    if (toolStatus) toolStatus.textContent = 'Selección';
    showStatus('Selección activa: arrastra un rectángulo. Arrastra dentro de la selección para moverla.');
  }

  function deactivate() {
    active = false;
    selecting = moving = false;
    canvas.classList.remove('selection-mode','selection-moving');
  }

  function deselect() {
    selection = null;
    start = null;
    selecting = false;
    moving = false;
    moveOrigin = null;
    moveStart = null;
    clearVisual();
    canvas.classList.remove('selection-moving');
    showStatus('Selección quitada.');
    return true;
  }

  function selectedData() {
    if (!selection) return null;
    const state = editableState();
    const pixels=[];
    for (let y=0; y<selection.h; y++) {
      for (let x=0; x<selection.w; x++) {
        pixels.push(state.pixels[(selection.y+y)*state.size+(selection.x+x)] || EMPTY);
      }
    }
    return { w:selection.w,h:selection.h,pixels };
  }

  function copy() {
    const data=selectedData();
    if (!data) return showStatus('Primero crea una selección.');
    clipboard={...data,pixels:[...data.pixels]};
    showStatus(`Copiado ${data.w}×${data.h}.`);
    return true;
  }

  function cut() {
    const data=selectedData();
    if (!data) return showStatus('Primero crea una selección.');
    clipboard={...data,pixels:[...data.pixels]};
    const state=editableState();
    for (let y=selection.y;y<selection.y+selection.h;y++) {
      for (let x=selection.x;x<selection.x+selection.w;x++) state.pixels[y*state.size+x]=EMPTY;
    }
    loadEditableState(state,{resetHistory:false});
    window.PixelCanvas.commitHistory();
    renderSelection();
    showStatus('Selección cortada.');
    return true;
  }

  function paste() {
    if (!clipboard) return showStatus('No hay nada copiado.');
    const state=editableState();
    const x0=selection?.x ?? Math.max(0,Math.floor((state.size-clipboard.w)/2));
    const y0=selection?.y ?? Math.max(0,Math.floor((state.size-clipboard.h)/2));
    for (let y=0;y<clipboard.h;y++) {
      for (let x=0;x<clipboard.w;x++) {
        const tx=x0+x, ty=y0+y;
        if (tx<0||ty<0||tx>=state.size||ty>=state.size) continue;
        state.pixels[ty*state.size+tx]=clipboard.pixels[y*clipboard.w+x];
      }
    }
    loadEditableState(state,{resetHistory:false});
    window.PixelCanvas.commitHistory();
    selection={x:x0,y:y0,w:clipboard.w,h:clipboard.h};
    renderSelection();
    showStatus(`Pegado ${clipboard.w}×${clipboard.h}.`);
    return true;
  }

  function deleteSelection() {
    if (!selection) return false;
    const state=editableState();
    for (let y=selection.y;y<selection.y+selection.h;y++) {
      for (let x=selection.x;x<selection.x+selection.w;x++) state.pixels[y*state.size+x]=EMPTY;
    }
    loadEditableState(state,{resetHistory:false});
    window.PixelCanvas.commitHistory();
    renderSelection();
    showStatus('Contenido de la selección eliminado.');
    return true;
  }

  function moveSelectionTo(point) {
    if (!selection || !moveOrigin || !moveStart) return;
    const size=moveOrigin.size;
    const dx=point.x-moveStart.x, dy=point.y-moveStart.y;
    const next=[...moveOrigin.pixels];
    const grabbed=[];
    for (let y=0;y<selection.h;y++) for (let x=0;x<selection.w;x++) {
      const sx=selection.x+x, sy=selection.y+y;
      grabbed.push(moveOrigin.pixels[sy*size+sx]);
      next[sy*size+sx]=EMPTY;
    }
    for (let y=0;y<selection.h;y++) for (let x=0;x<selection.w;x++) {
      const tx=selection.x+x+dx, ty=selection.y+y+dy;
      if (tx<0||ty<0||tx>=size||ty>=size) continue;
      const color=grabbed[y*selection.w+x];
      if (color!==EMPTY) next[ty*size+tx]=color;
    }
    loadEditableState({size,pixels:next},{resetHistory:false});
    selection={...selection,x:Math.max(0,Math.min(size-selection.w,selection.x+dx)),y:Math.max(0,Math.min(size-selection.h,selection.y+dy))};
    moveStart=point;
    moveOrigin=editableState();
    renderSelection();
  }

  canvas.addEventListener('pointerdown',event=>{
    if (!active) return;
    const pixel=event.target.closest('.pixel');
    if (!pixel) return;
    const p=coords(pixel);
    if (selection && contains(selection,p)) {
      moving=true;
      moveStart=p;
      moveOrigin=editableState();
      canvas.classList.add('selection-moving');
    } else {
      selecting=true;
      start=p;
      selection={x:p.x,y:p.y,w:1,h:1};
      renderSelection();
    }
    event.preventDefault();
    event.stopPropagation();
  },true);

  window.addEventListener('pointermove',event=>{
    if (!active || (!selecting&&!moving)) return;
    const p=pointFromEvent(event);
    if (!p) return;
    if (selecting) {
      selection=rectFrom(start,p);
      renderSelection();
    } else if (moving) moveSelectionTo(p);
    event.preventDefault();
  });

  window.addEventListener('pointerup',()=>{
    if (!active) return;
    if (moving) window.PixelCanvas.commitHistory();
    if (selecting && selection) showStatus(`Selección ${selection.w}×${selection.h}.`);
    selecting=moving=false;
    canvas.classList.remove('selection-moving');
  });

  selectBtn.addEventListener('click',activate);
  toolGrid.addEventListener('click',event=>{
    const button=event.target.closest('button');
    if (button && button!==selectBtn) deactivate();
  });

  document.addEventListener('keydown',event=>{
    const tag=document.activeElement?.tagName;
    if (['INPUT','TEXTAREA','SELECT'].includes(tag)) return;
    const key=event.key.toLowerCase();
    if (!event.ctrlKey && !event.metaKey && key==='s') { event.preventDefault(); activate(); return; }
    if ((event.ctrlKey||event.metaKey) && key==='c' && active) { event.preventDefault(); copy(); return; }
    if ((event.ctrlKey||event.metaKey) && key==='x' && active) { event.preventDefault(); cut(); return; }
    if ((event.ctrlKey||event.metaKey) && key==='v' && active) { event.preventDefault(); paste(); return; }
    if ((event.key==='Delete'||event.key==='Backspace') && active && selection) { event.preventDefault(); deleteSelection(); }
    if (event.key==='Escape' && active) { event.preventDefault(); deselect(); }
  });

  window.addEventListener('pixelsizechange',()=>{ selection=null; clearVisual(); });
  window.addEventListener('pixelprojectloaded',()=>{ selection=null; clearVisual(); });
  window.addEventListener('pixellayerchange',()=>{ selection=null; clearVisual(); });

  function installActions() {
    const inspector=document.getElementById('editorInspector');
    if (!inspector || document.getElementById('selectionActions')) return;
    const block=document.createElement('div');
    block.id='selectionActions';
    block.className='selection-actions';
    block.innerHTML=`<p class="eyebrow">SELECCIÓN</p><div class="selection-row"><button type="button">Copiar</button><button type="button">Cortar</button><button type="button">Pegar</button></div><button type="button" class="selection-clear">✕ Quitar selección</button><p class="selection-hint">S seleccionar · Ctrl+C copiar · Ctrl+X cortar · Ctrl+V pegar · Supr eliminar · Esc quitar selección · arrastra dentro para mover.</p>`;
    const buttons=block.querySelectorAll('button');
    buttons[0].addEventListener('click',copy);
    buttons[1].addEventListener('click',cut);
    buttons[2].addEventListener('click',paste);
    buttons[3].addEventListener('click',deselect);
    inspector.appendChild(block);
  }
  installActions();
  setTimeout(installActions,0);

  return { activate, deselect, copy, cut, paste, deleteSelection, getSelection:()=>selection?{...selection}:null };
})();