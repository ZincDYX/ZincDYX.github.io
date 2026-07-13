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

  const characterOptions = [
    {
      image: 'blogg.png', //不开心
      lines: [
        '在宿舍地板看到了不明棕色物体，以为是自己踩到屎了，结果是晚餐的巧克力泡芙碎渣掉到了地上。',
        '五岁那年我躺在地上试图和蚂蚁舌吻的时候，被我朋友的自行车碾到了头，从此智力和心态停留在了五岁。',
        '甲明知自己的枪法很差，但为了杀乙，也顾不了那么多了，遂从100米外向乙开枪，没想到居然打中了乙，致乙死亡。此案中甲杀害乙的罪过形式是()。A.直接故意 B.间接故意 C.疏忽大意的过失 D.过于自信的过失',
        '一想到这些话很多都是从推特上看到的，就感觉这个互联网世界算是完蛋了。'
      ]
    },
    {
      image: 'blogg2.png', //开心
      lines: [
        '现在宿舍屯的零食和水已经够我至少一星期不出宿舍了，现在在你面前的是超高校级的死宅。',
        '为什么路易十六的手指比较长？因为摘除顶芽能促进侧芽生长。',
      ]
    }
  ];
  const selectedCharacter = characterOptions[Math.floor(Math.random() * characterOptions.length)];
  const selectedLine = selectedCharacter.lines[Math.floor(Math.random() * selectedCharacter.lines.length)];
  const characterWrap = document.createElement('div');
  const character = document.createElement('img');
  const characterBubble = document.createElement('div');
  characterWrap.className = 'corner-character-wrap';
  character.className = 'corner-character';
  characterBubble.className = 'corner-character-bubble';
  characterBubble.dataset.shortText = '\u6211\u5199\u7684\u592a\u5c0f\u4e86\u5417\uff1f';
  character.src = new URL(`images/${selectedCharacter.image}`, siteRoot);
  character.alt = '';
  character.setAttribute('aria-hidden', 'true');
  character.decoding = 'async';
  characterBubble.textContent = selectedLine;
  characterWrap.append(characterBubble, character);
  document.body.appendChild(characterWrap);

  const articleMenu = document.querySelector('#header-post #menu');
  if (articleMenu && window.matchMedia('(min-width: 501px)').matches) {
    articleMenu.style.display = 'inline';
  }

  const articleNav = document.querySelector('#header-post #menu #nav');
  if (articleNav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < 50) {
        articleNav.style.display = '';
      }
    }, { passive: true });
  }

  const headerPost = document.querySelector('#header-post');
  const articleShare = document.querySelector('#header-post #share');
  if (headerPost && articleShare) {
    const syncShareState = () => {
      headerPost.classList.toggle('is-share-open', articleShare.style.display !== 'none');
    };

    new MutationObserver(syncShareState).observe(articleShare, {
      attributes: true,
      attributeFilter: ['style']
    });
    syncShareState();
  }

  const modal = document.createElement('div');
  modal.className = 'tag-modal';
  modal.hidden = true;
  modal.innerHTML = `
    <div class="tag-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="tag-modal-title">
      <header>
        <h1 id="tag-modal-title">Tag</h1>
        <button class="tag-modal-close" type="button" aria-label="Close">×</button>
      </header>
      <div class="tag-modal-content">Loading…</div>
    </div>`;
  document.body.appendChild(modal);

  let closeTimer;
  const closeButton = modal.querySelector('.tag-modal-close');
  const content = modal.querySelector('.tag-modal-content');
  const tagContent = fetch(new URL('tag-explorer-fragment.html', siteRoot))
    .then(response => {
      if (!response.ok) throw new Error(`Tag explorer request failed: ${response.status}`);
      return response.text();
    })
    .then(html => {
      content.innerHTML = html;
      content.querySelectorAll('[data-tag-explorer]').forEach(initTagExplorer);
    })
    .catch(() => {
      content.textContent = 'Failed to load tags. Please refresh and try again.';
    });

  async function openModal() {
    clearTimeout(closeTimer);
    modal.hidden = false;
    document.body.classList.add('tag-modal-open');
    requestAnimationFrame(() => modal.classList.add('is-open'));
    closeButton.focus();

    await tagContent;
  }

  function closeModal() {
    modal.classList.remove('is-open');
    document.body.classList.remove('tag-modal-open');
    closeTimer = setTimeout(() => {
      modal.hidden = true;
    }, 280);
  }

  document.querySelectorAll('a[href*="/tags/"]').forEach(link => {
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
