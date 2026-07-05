const siteRoot = new URL('../', document.currentScript.src);

function initTagExplorer(root) {
  const buttons = root.querySelectorAll('[data-tag-target]');
  const panels = root.querySelectorAll('.tag-explorer-panel');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      buttons.forEach(item => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-selected', String(active));
      });
      panels.forEach(panel => {
        panel.hidden = panel.id !== button.dataset.tagTarget;
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-tag-explorer]').forEach(initTagExplorer);

  const articleMenu = document.querySelector('#header-post #menu');
  if (articleMenu && window.matchMedia('(min-width: 501px)').matches) {
    articleMenu.style.display = 'inline';
  }

  const modal = document.createElement('div');
  modal.className = 'tag-modal';
  modal.hidden = true;
  modal.innerHTML = `
    <div class="tag-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="tag-modal-title">
      <header>
        <h1 id="tag-modal-title">标签</h1>
        <button class="tag-modal-close" type="button" aria-label="关闭">×</button>
      </header>
      <div class="tag-modal-content">加载中…</div>
    </div>`;
  document.body.appendChild(modal);

  let loaded = false;
  let closeTimer;
  const closeButton = modal.querySelector('.tag-modal-close');

  async function openModal() {
    clearTimeout(closeTimer);
    modal.hidden = false;
    document.body.classList.add('tag-modal-open');
    requestAnimationFrame(() => modal.classList.add('is-open'));
    closeButton.focus();

    if (!loaded) {
      const response = await fetch(new URL('tag-explorer-fragment.html', siteRoot));
      const content = modal.querySelector('.tag-modal-content');
      content.innerHTML = await response.text();
      content.querySelectorAll('[data-tag-explorer]').forEach(initTagExplorer);
      loaded = true;
    }
  }

  function closeModal() {
    modal.classList.remove('is-open');
    document.body.classList.remove('tag-modal-open');
    closeTimer = setTimeout(() => {
      modal.hidden = true;
    }, 280);
  }

  document.querySelectorAll('#nav a[href*="/tags/"]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      openModal();
    });
  });

  closeButton.addEventListener('click', closeModal);
  modal.addEventListener('click', event => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !modal.hidden) closeModal();
  });
});
