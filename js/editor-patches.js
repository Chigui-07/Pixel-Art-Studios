(() => {
  function updateTutorialSizeNote() {
    const tutorialPanel = document.querySelector('.tutorial-panel');
    const sizeSelect = document.getElementById('sizeSelect');
    if (!tutorialPanel || !sizeSelect) return;

    tutorialPanel.querySelector('.format-tabs')?.style.setProperty('display', 'none', 'important');

    let note = document.getElementById('tutorialCanvasSizeNote');
    if (!note) {
      note = document.createElement('p');
      note.id = 'tutorialCanvasSizeNote';
      note.className = 'format-note';
      const meta = document.getElementById('tutorialMeta');
      meta?.insertAdjacentElement('afterend', note);
    }

    const size = Number(sizeSelect.value || window.PixelCanvas?.getSize?.() || 16);
    const hasTutorial = Boolean(window.PixelTutorials?.apple?.[size]);
    note.textContent = hasTutorial
      ? `Tutorial adaptado automáticamente al lienzo actual: ${size}×${size}.`
      : `Lienzo actual: ${size}×${size}. No hay tutorial específico para este tamaño; se mantiene el modo libre.`;
  }

  function installAnimationCloseButton() {
    const animationWrap = document.querySelector('.workspace-wrap');
    const animationLab = animationWrap?.querySelector('.animation-lab');
    if (!animationLab || document.getElementById('closeAnimationPanelBtn')) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.id = 'closeAnimationPanelBtn';
    button.className = 'editor-panel-close';
    button.textContent = '✕ Cerrar animación';
    button.addEventListener('click', () => window.PixelWorkspace?.toggleAnimation?.(false));
    animationLab.insertBefore(button, animationLab.firstChild);
  }

  function sync() {
    updateTutorialSizeNote();
    installAnimationCloseButton();
  }

  window.addEventListener('pixelsizechange', () => requestAnimationFrame(updateTutorialSizeNote));
  window.addEventListener('pixelprojectloaded', () => requestAnimationFrame(updateTutorialSizeNote));
  document.getElementById('sizeSelect')?.addEventListener('change', () => requestAnimationFrame(updateTutorialSizeNote));

  const observer = new MutationObserver(sync);
  observer.observe(document.body, { childList: true, subtree: true });

  sync();
})();