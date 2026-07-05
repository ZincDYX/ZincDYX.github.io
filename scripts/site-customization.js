'use strict';

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function sitePath(path) {
  const root = String(hexo.config.root || '/').replace(/\/?$/, '/');
  return root + String(path || '').replace(/^\/+/, '');
}

function renderTagExplorer(tagCollection) {
  const tags = [];

  tagCollection.each(tag => {
    if (tag.length > 0) tags.push(tag);
  });

  tags.sort((left, right) =>
    right.length - left.length || left.name.localeCompare(right.name, 'zh-CN')
  );

  if (!tags.length) {
    return '<p class="tag-explorer-empty">还没有标签。</p>';
  }

  const controls = tags.map((tag, index) => `
    <button class="tag-explorer-chip${index === 0 ? ' is-active' : ''}"
            type="button"
            aria-selected="${index === 0}"
            data-tag-target="tag-panel-${index}">
      ${escapeHtml(tag.name)}
    </button>`).join('');

  const panels = tags.map((tag, index) => {
    const posts = [];
    tag.posts.sort('date', 'desc').each(post => posts.push(post));
    const rows = posts.map(post => `
      <li>
        <a href="${escapeHtml(sitePath(post.path))}">
          <time>${escapeHtml(post.date.format('YYYY / MM / DD'))}</time>
          <span>${escapeHtml(post.title || post.slug)}</span>
        </a>
      </li>`).join('');

    return `
      <section id="tag-panel-${index}" class="tag-explorer-panel" ${index === 0 ? '' : 'hidden'}>
        <h2>${escapeHtml(tag.name)}</h2>
        <ul>${rows}</ul>
      </section>`;
  }).join('');

  return `
    <div class="tag-explorer" data-tag-explorer>
      <div class="tag-explorer-controls">${controls}</div>
      ${panels}
    </div>`;
}

hexo.extend.generator.register('tag-explorer', function generateTagExplorer(locals) {
  const content = renderTagExplorer(locals.tags);
  const assets = `<link rel="stylesheet" href="${sitePath('css/zinc-custom.css')}">` +
    `<script src="${sitePath('js/zinc-custom.js')}" defer></script>`;

  return [
    {
      path: 'tag-explorer-fragment.html',
      data: content,
      layout: false
    },
    {
      path: `${hexo.config.tag_dir || 'tags'}/index.html`,
      data: {
        title: '标签',
        content: assets + content,
        layout: ['page']
      }
    }
  ];
});

hexo.extend.filter.register('after_render:html', function injectSiteAssets(html) {
  const stylesheet = sitePath('css/zinc-custom.css');
  const script = sitePath('js/zinc-custom.js');

  if (!html.includes(stylesheet)) {
    html = html.replace('</head>', `<link rel="stylesheet" href="${stylesheet}">\n</head>`);
  }
  if (!html.includes(script)) {
    html = html.replace('</body>', `<script src="${script}" defer></script>\n</body>`);
  }

  return html;
});
