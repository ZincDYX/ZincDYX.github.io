'use strict';

const fs = require('fs');
const path = require('path');

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

function readProjectLinks() {
  const projectsPath = path.join(hexo.source_dir, 'projects', 'index.md');
  if (!fs.existsSync(projectsPath)) return [];

  const markdown = fs.readFileSync(projectsPath, 'utf8');
  const links = [];
  const headingLink = /^#{1,6}\s+\[([^\]]+)\]\(([^)]+)\)/gm;
  let match;

  while ((match = headingLink.exec(markdown)) !== null) {
    links.push({
      name: match[1].trim(),
      url: match[2].trim()
    });
  }

  return links;
}

hexo.locals.set('projectLinks', readProjectLinks);

hexo.extend.filter.register('markdown-it:renderer', function enableGithubAlerts(md) {
  const alertTypes = new Set(['NOTE', 'TIP', 'IMPORTANT', 'WARNING', 'CAUTION']);

  md.block.ruler.before('blockquote', 'github_alert', (state, startLine, endLine, silent) => {
    const start = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];
    const firstLine = state.src.slice(start, max);
    const match = firstLine.match(/^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(.*)$/i);

    if (!match) return false;
    if (silent) return true;

    const type = match[1].toUpperCase();
    if (!alertTypes.has(type)) return false;

    const title = match[2].trim() || type[0] + type.slice(1).toLowerCase();
    const lines = [];
    let nextLine = startLine + 1;

    while (nextLine < endLine) {
      const lineStart = state.bMarks[nextLine] + state.tShift[nextLine];
      const lineEnd = state.eMarks[nextLine];
      const line = state.src.slice(lineStart, lineEnd);

      if (line.trim() === '') {
        lines.push('');
        nextLine += 1;
        continue;
      }

      if (!line.startsWith('>')) break;

      lines.push(line.replace(/^>\s?/, ''));
      nextLine += 1;
    }

    const renderedContent = md.render(lines.join('\n'));
    const token = state.push('html_block', '', 0);
    token.map = [startLine, nextLine];
    token.content = `<div class="markdown-alert markdown-alert-${type.toLowerCase()}">\n` +
      `<p class="markdown-alert-title">${md.utils.escapeHtml(title)}</p>\n` +
      `${renderedContent}</div>\n`;
    state.line = nextLine;

    return true;
  });
});

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
  const pixelFont = sitePath('fonts/ark-pixel-12px-proportional-zh_cn.woff2');

  if (!html.includes(pixelFont)) {
    html = html.replace('</head>', `<link rel="preload" href="${pixelFont}" as="font" type="font/woff2" crossorigin>\n</head>`);
  }
  if (!html.includes(stylesheet)) {
    html = html.replace('</head>', `<link rel="stylesheet" href="${stylesheet}">\n</head>`);
  }
  if (!html.includes(script)) {
    html = html.replace('</body>', `<script src="${script}" defer></script>\n</body>`);
  }

  return html;
});
