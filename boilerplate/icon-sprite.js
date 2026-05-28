// Loads the project's full _icon_sprite.json and injects only the icons
// you list (by base name) into a single SVG <defs> sprite at <body>.
// Usage:
//   await loadIconSprite([
//     'ChevronRight', 'Plus', 'Pencil', 'EllipsisVertical', ...
//   ]);
// Then reference: <svg ...><use href="#chevron-right"/></svg>
//
// Variant selector:
//   - Pass 'r' (default) for regular weight, 's' for solid.
//   - Or pass an object: { base: 'Heart', variant: 's', id: 'heart-solid' }.
(function () {
  function kebab(name) {
    return name
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
      .toLowerCase();
  }

  async function loadIconSprite(items, opts = {}) {
    const url = opts.spriteUrl || '_icon_sprite.json';
    const data = await fetch(url).then(r => r.json());
    const byBase = Object.fromEntries(data.bases.map(b => [b.base, b]));

    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.position = 'absolute';
    const defs = document.createElementNS(svgNS, 'defs');
    svg.appendChild(defs);

    for (const raw of items) {
      const item = typeof raw === 'string' ? { base: raw } : raw;
      const variant = item.variant || 'r';
      const id = item.id || kebab(item.base);
      const def = byBase[item.base];
      if (!def) {
        console.warn('icon-sprite: missing icon', item.base);
        continue;
      }
      const v = def[variant] || def.r || def.s;
      const symbol = document.createElementNS(svgNS, 'symbol');
      symbol.setAttribute('id', id);
      symbol.setAttribute('viewBox', v.viewBox);
      for (const d of v.paths) {
        const p = document.createElementNS(svgNS, 'path');
        p.setAttribute('d', d);
        symbol.appendChild(p);
      }
      defs.appendChild(symbol);
    }

    document.body.appendChild(svg);
  }

  window.loadIconSprite = loadIconSprite;
})();
