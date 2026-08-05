// <professional-mark> — the Professional theme's masthead logo: a solid cobalt
// rounded-square tile carrying a stacked-ledger glyph (three ruled lines, the
// epic/story/task strata), beside "THE LEDGER" set in IBM Plex Sans. A flat,
// geometric corporate monogram — no gradient, no glow, no wax. Typography and a
// single accent color, matching the theme.
//
// A THEME ASSET (the professional theme package declares it as `logo`). Plain
// JS, self-registering, shadow-DOM encapsulated so its ids can't collide with a
// sibling theme's logo.
//
// Reads the theme's own font by name ('IBM Plex Sans'); the theme's `fonts` link
// loads it. Colors are baked (a logo is a fixed mark), tuned to the theme's
// graphite + cobalt palette.

class ProfessionalMark extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;   // idempotent
    const root = this.attachShadow({ mode: 'open' });

    // Layout mirrors <ledger-mark>: a 64-unit tile at the left, then the
    // wordmark; viewBox trimmed to the measured word once the font loads.
    const H = 64, tile = 56, gap = 18;
    const wordX = tile + gap;
    const tx = 4, ty = 4;   // tile top-left inset within the 64 box

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${wordX + 340} ${H}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('aria-hidden', 'true');   // the masthead <h1> carries the name
    svg.innerHTML = `
      <!-- Solid cobalt tile with a subtle top-light, corporate app-icon geometry. -->
      <defs>
        <linearGradient id="pm-tile" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#5985ff"/>
          <stop offset="1" stop-color="#3a63e6"/>
        </linearGradient>
      </defs>
      <rect x="${tx}" y="${ty}" width="${tile}" height="${tile}" rx="13"
            fill="url(#pm-tile)"/>
      <!-- Stacked-ledger glyph: three ruled strata (epic / story / task),
           descending width, in white. Flat, geometric, legible at any size. -->
      <g fill="#ffffff">
        <rect x="${tx + 13}" y="${ty + 15}" width="30" height="5.5" rx="2.75"/>
        <rect x="${tx + 13}" y="${ty + 25.25}" width="23" height="5.5" rx="2.75" opacity="0.9"/>
        <rect x="${tx + 13}" y="${ty + 35.5}" width="16" height="5.5" rx="2.75" opacity="0.78"/>
      </g>

      <!-- Wordmark: THE LEDGER, IBM Plex Sans semibold, moderate tracking. A
           two-weight lockup would over-decorate; one weight, even color. The fill
           reads the theme's --frame-text-strong chrome-text token (inherits through
           the shadow root), which flips near-white on the dark-mode chrome to
           near-black on the light-mode chrome — one mark, both modes, no baked
           literal. The tile and glyph are baked (cobalt + white read on either
           chrome). -->
      <g font-family="'IBM Plex Sans', 'Segoe UI', sans-serif" font-weight="600"
         font-size="30" letter-spacing="0.5" dominant-baseline="alphabetic">
        <text class="pm-word" x="${wordX}" y="43" fill="var(--frame-text-strong, #f4f3f6)">THE LEDGER</text>
      </g>`;

    const style = document.createElement('style');
    style.textContent = ':host { display: block; height: 100%; } svg { height: 100%; width: auto; display: block; }';
    root.append(style, svg);

    // Trim the viewBox to the measured wordmark once the display font is ready.
    const fit = () => {
      const word = svg.querySelector('.pm-word');
      if (!word) return;
      try {
        const box = word.getBBox();
        svg.setAttribute('viewBox', `0 0 ${Math.ceil(box.x + box.width + 6)} ${H}`);
      } catch { /* not laid out yet; the guess stands */ }
    };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit); else fit();
  }
}

if (!customElements.get('professional-mark')) customElements.define('professional-mark', ProfessionalMark);
