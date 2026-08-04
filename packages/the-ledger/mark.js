// <ledger-mark> — The Ledger's masthead logo: a tooled-leather nameplate. One
// oxblood-leather plate, tooled with a gold double-keyline border, carries a
// blind-embossed "TL" monogram at the left and a pasted, deckle-edged parchment
// label at the right bearing "The Ledger" in Libre Caslon Display, printed as
// iron-gall ink. The plate doubles as the app's standalone mark (public/seal.svg,
// also the favicon).
//
// This is a THEME ASSET, not an app component: it's the logo the-ledger theme
// declares in its manifest (`logo`), loaded by the theme controller and placed
// in the masthead. It's also the controller's fallback when a theme declares no
// logo of its own. A theme provides its own logo the same way — a self-
// registering custom element module served from the theme's folder.
//
// Plain JS (no build step) so it lives beside theme.css and ships as a static
// asset. Everything is live SVG: real <text> for the wordmark (accessible +
// crisp at any size, no font baked to paths) and static shapes for the plate.
// Shadow DOM keeps its gradients/ids from colliding with the page or a sibling
// theme's logo.
//
// Three design constraints drive the shapes:
//   1. Structured engraving, not a wax pour. The graphic is a rectilinear leather
//      plate with a fine tooled gold double-keyline and a blind-debossed monogram
//      — flat and pressed, read by edge relief (a lit crown up-left, a shaded
//      wall down-right), not by gloss.
//   2. One connected object. The monogram and the wordmark share a single leather
//      plate; the gold keyline frames both, so it reads as a bound nameplate
//      rather than a seal sitting next to floating text.
//   3. Ink needs paper. Iron-gall ink (#33291a) on the leather chrome (#3d2f1b)
//      is ~1.1:1 — unreadable. So the wordmark is printed on a parchment label
//      (#f3ead0) inset into the plate, where it clears WCAG AAA (~11.8:1).
//      Letterpress ink lives on a sheet, never floating on leather.

// Plate geometry. The plate's WIDTH is dynamic — trimmed to the measured wordmark
// once the display font loads — so only the fixed vertical metrics live here. The
// plate is vertically centered in the 64-unit box (top 6 + height 52 → mid-line
// at 32); the monogram and label share that mid-line.
const PLATE_X = 5, PLATE_Y = 6, PLATE_H = 52, PLATE_R = 8, MID = PLATE_Y + PLATE_H / 2;
const LABEL_X = 66, LABEL_Y = 12, LABEL_H = 40;   // parchment label, centered on MID
const TEXT_X = LABEL_X + 11;                        // wordmark left, padded inside the label

class LedgerMark extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;   // idempotent — connectedCallback can fire again on a move
    const root = this.attachShadow({ mode: 'open' });

    const H = 64, monoCx = 34;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    // Width is a generous guess (plate right ≈ 300), trimmed to the real glyph
    // advance in fit() once Libre Caslon Display has loaded.
    svg.setAttribute('viewBox', `0 0 305 ${H}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    // Decorative: the masthead <h1> carries the accessible name ("The Ledger").
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = `
      <defs>
        <!-- Tooled-leather face: warm oxblood-brown, lit upper-left so the plate
             reads as a raised, slightly domed pad of leather. -->
        <linearGradient id="lg-leather" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#4a3419"/>
          <stop offset="0.5" stop-color="#33230f"/>
          <stop offset="1" stop-color="#241708"/>
        </linearGradient>
        <!-- Gold-leaf tooling for the engraved keylines: the same fitting-brass
             as the masthead rule, lit crown to shadowed foot. -->
        <linearGradient id="lg-tool" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#e4c584"/>
          <stop offset="0.5" stop-color="#b08d4f"/>
          <stop offset="1" stop-color="#7a5f30"/>
        </linearGradient>
        <!-- Pasted-label paper: fresh lit parchment, a hair darker at the foot. -->
        <linearGradient id="lg-label" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#f3ead0"/>
          <stop offset="1" stop-color="#e2d3ac"/>
        </linearGradient>
        <!-- Drop shadow lifting the whole plate off the leather chrome. -->
        <filter id="lg-drop" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="1.5" dy="2.5" stdDeviation="1.3" flood-color="#000" flood-opacity="0.42"/>
        </filter>
        <!-- Deckle edge: low-frequency noise displacing the paper's outline so the
             label reads as a hand-torn, pasted sheet. Only the paper is filtered;
             the ink text is drawn outside the group and stays crisp. -->
        <filter id="lg-deckle" x="-6%" y="-16%" width="112%" height="132%" color-interpolation-filters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.014 0.09" numOctaves="2" seed="6" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="3.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>

      <!-- The leather nameplate: the plate itself (drop-shadowed), a blind (dark)
           inner line and a gold keyline over it for the tooled double border, and
           a fainter innermost gold rule. -->
      <rect data-ri="0" x="${PLATE_X}" y="${PLATE_Y}" width="295" height="${PLATE_H}" rx="${PLATE_R}"
            fill="url(#lg-leather)" stroke="#5c421f" stroke-opacity="0.6" stroke-width="1" filter="url(#lg-drop)"/>
      <rect data-ri="4" x="${PLATE_X + 4}" y="${PLATE_Y + 4}" width="287" height="${PLATE_H - 8}" rx="${PLATE_R - 3}"
            fill="none" stroke="#1a1206" stroke-opacity="0.55" stroke-width="2.4"/>
      <rect data-ri="4" x="${PLATE_X + 4}" y="${PLATE_Y + 4}" width="287" height="${PLATE_H - 8}" rx="${PLATE_R - 3}"
            fill="none" stroke="url(#lg-tool)" stroke-width="1.1"/>
      <rect data-ri="7" x="${PLATE_X + 7}" y="${PLATE_Y + 7}" width="281" height="${PLATE_H - 14}" rx="${PLATE_R - 5}"
            fill="none" stroke="url(#lg-tool)" stroke-opacity="0.5" stroke-width="0.7"/>

      <!-- Gold-tooled "TL": stamped in gold leaf, the same fitting-brass as the
           keylines, so it reads clearly on the dark leather (~7-10:1, WCAG AAA).
           A dark drop beneath keeps the tooled-into-leather relief — the tool
           bit the hide, then the leaf was laid in. Centered on the plate mid-line. -->
      <g font-family="'Libre Caslon Display', 'IM Fell English', Georgia, serif" font-size="26"
         text-anchor="middle" dominant-baseline="alphabetic">
        <text x="${monoCx + 0.6}" y="${MID + 9.8}" fill="#120b03" fill-opacity="0.55">TL</text>
        <text x="${monoCx}" y="${MID + 9}" fill="url(#lg-tool)" stroke="#6e5320" stroke-width="0.4" stroke-opacity="0.5">TL</text>
      </g>

      <!-- The pasted parchment label: a deckle-edged sheet with a thin gold rule,
           inset into the plate and centered on the mid-line. Drawn inside the
           deckle filter so its outline tears; the wordmark rides on top, crisp. -->
      <g filter="url(#lg-deckle)">
        <rect data-ri="6" x="${LABEL_X}" y="${LABEL_Y}" width="228" height="${LABEL_H}" rx="2.5"
              fill="url(#lg-label)" stroke="#c4ac7c" stroke-width="1"/>
        <rect data-ri="9" x="${LABEL_X + 3}" y="${LABEL_Y + 3}" width="222" height="${LABEL_H - 6}" rx="1.5"
              fill="none" stroke="#b8985a" stroke-opacity="0.45" stroke-width="0.7"/>
      </g>

      <!-- The wordmark: Libre Caslon Display, inked in solid iron-gall brown-black
           on the parchment label. -->
      <text class="lg-word" font-family="'Libre Caslon Display', 'IM Fell English', Georgia, serif"
            font-size="33" letter-spacing="0.4" x="${TEXT_X}" y="${MID + 11}"
            dominant-baseline="alphabetic" fill="#33291a">The Ledger</text>`;

    const style = document.createElement('style');
    style.textContent = ':host { display: block; height: 100%; } svg { height: 100%; width: auto; display: block; }';
    root.append(style, svg);

    // Trim the plate, label, keylines, and viewBox to the measured wordmark once
    // the display font is ready, so the nameplate hugs the text instead of the
    // guessed width. Each resizable rect declares data-ri = how far its right edge
    // sits inside the plate's right edge; width = (plateRight - ri) - x. getBBox
    // needs the node laid out; fonts.ready fires after Libre Caslon Display loads.
    const fit = () => {
      const word = svg.querySelector('.lg-word');
      if (!word) return;
      try {
        const box = word.getBBox();
        const plateRight = box.x + box.width + 11 /* label pad */ + 6 /* plate margin */;
        svg.querySelectorAll('[data-ri]').forEach(el => {
          const x = +el.getAttribute('x'), ri = +el.dataset.ri;
          el.setAttribute('width', Math.max(0, (plateRight - ri) - x));
        });
        svg.setAttribute('viewBox', `0 0 ${Math.ceil(plateRight + 5)} ${H}`);
      } catch { /* getBBox can throw if not yet rendered; the guess stands */ }
    };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit); else fit();
  }
}

if (!customElements.get('ledger-mark')) customElements.define('ledger-mark', LedgerMark);
