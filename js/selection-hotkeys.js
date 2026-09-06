(() => {
  function inEditor() {
    return document.body.classList.contains('workspace-mode-editor');
  }

  function isTyping() {
    const tag = document.activeElement?.tagName;
    return ['INPUT', 'TEXTAREA', 'SELECT'].includes(tag) || document.activeElement?.isContentEditable;
  }

  function handleShortcut(event) {
    if (!inEditor() || isTyping() || !window.PixelSelection) return;
    if (!(event.ctrlKey || event.metaKey)) return;

    const code = event.code;
    if (code === 'KeyC') {
      if (!window.PixelSelection.getSelection?.()) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      window.PixelSelection.copy();
      return;
    }

    if (code === 'KeyX') {
      if (!window.PixelSelection.getSelection?.()) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      window.PixelSelection.cut();
      return;
    }

    if (code === 'KeyV') {
      event.preventDefault();
      event.stopImmediatePropagation();
      window.PixelSelection.paste();
    }
  }

  window.addEventListener('keydown', handleShortcut, true);

  function ensureSelectionActions() {
    const inspector = document.getElementById('editorInspector');
    if (!inspector || document.getElementById('selectionActions')) return;

    const block = document.createElement('div');
    block.id = 'selectionActions';
    block.className = 'selection-actions';
    block.innerHTML = `
      <p class="eyebrow">SELECCIÓN</p>
      <div class="selection-row">
        <button id="selectionCopyBtn" type="button">Copiar</button>
        <button id="selectionCutBtn" type="button">Cortar</button>
        <button id="selectionPasteBtn" type="button">Pegar</button>
      </div>
      <p class="selection-hint">S seleccionar · Ctrl+C copiar · Ctrl+X cortar · Ctrl+V pegar · Supr eliminar.</p>
    `;

    block.querySelector('#selectionCopyBtn')?.addEventListener('click', () => window.PixelSelection?.copy());
    block.querySelector('#selectionCutBtn')?.addEventListener('click', () => window.PixelSelection?.cut());
    block.querySelector('#selectionPasteBtn')?.addEventListener('click', () => window.PixelSelection?.paste());
    inspector.appendChild(block);
  }

  const observer = new MutationObserver(ensureSelectionActions);
  observer.observe(document.body, { childList: true, subtree: true });
  ensureSelectionActions();
})();