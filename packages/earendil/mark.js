// The masthead pairs a compass star with The Ledger's name in local serif type.
class EarendilMark extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    const root = this.attachShadow({ mode: 'open' });
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(':host { display: block; height: 100%; } svg { display: block; height: 100%; width: auto; max-width: 100%; }');
    root.adoptedStyleSheets = [sheet];
    root.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 205 40" aria-hidden="true">
        <g transform="translate(20 20) rotate(-8) scale(.6)">
          <circle r="25" fill="none" stroke="#bba16c" stroke-width=".7"/>
          <circle r="20" fill="none" stroke="#81979e" stroke-width=".5"/>
          <path d="M0-30 5-5 30 0 5 5 0 30-5 5-30 0-5-5Z" fill="#eee5c9"/>
          <path d="M0-30V0H30L5-5ZM0 30V0H-30L-5 5Z" fill="#bba16c"/>
          <circle r="3" fill="#142f40"/>
        </g>
        <text x="48" y="29" fill="#f8f4e9" font-family="Georgia, 'Times New Roman', serif"
          font-size="27" font-weight="400" font-style="italic">The Ledger</text>
      </svg>`;
  }
}

if (!customElements.get('earendil-mark')) customElements.define('earendil-mark', EarendilMark);
