# ledger-themes — agent orientation

Themes for [The Ledger](https://github.com/cpyle0819/the-ledger). Each theme is a
standalone, independently-published npm package; this repo is an npm-workspaces
monorepo holding them under `packages/`. A theme carries a `ledgerTheme` block in
its `package.json` and a `theme.css` that fills The Ledger's token contract, plus
optional logo/ambient web components, sounds, and fonts. No build step — themes
ship static `.css`/`.js`. The authoring contract lives in The Ledger's
[`THEMES.md`](https://github.com/cpyle0819/the-ledger/blob/main/THEMES.md) and
`public/base.css`; read those before editing a theme's tokens.

## Packages

- `packages/the-ledger` — the leather-and-parchment reference theme (light card).
- `packages/space-opera` — dark data-plate inversion; starfield ambient with
  flip-and-burn.
- `packages/professional` — clean corporate theme: neutral graphite chrome, white
  cards, IBM Plex type system, a single cobalt accent. No ambient, no sounds, flat
  surfaces. Greys are true neutrals to stay distinct from space-opera's blue chrome.
  Ships DARK; a light mode is a `mode` setting (`target: root`, writes
  `data-mode` on <html>) rendered as an Appearance segmented control in the gear.
  The `[data-mode="light"]` block in theme.css overrides only the chrome + canvas
  tokens; cards/ink/tiers/accent are shared. This uses the `mode`/`root` setting
  type added to the-ledger core (contract in theme.ts, control in ledger-settings,
  pre-paint replay in index.html) — the first theme to drive a whole-app mode.

## Dependencies

`@cpyle0819/ambience` (the ambient web-component library: `smoke-drift`,
`starfield`) is **github-only — never published to npm.** It's the root's
`devDependency` (`github:cpyle0819/ambience`) and each theme's `peerDependency`.
This is the load-bearing fact behind the release gotcha below.

## Releasing a theme

Publishing is **tag-triggered OIDC** (`.github/workflows/publish.yml`), not a
local `npm publish`. Push a tag `<pkg>-v<version>` (`the-ledger-v1.2.0`,
`space-opera-v1.1.1`); the workflow publishes only the matching package with
provenance. Steps:

1. Edit the theme, bump its `version` in `packages/<pkg>/package.json`.
2. **Run `npm ci` locally and confirm it exits 0** — this is the gate that a
   forgotten step fails (see below).
3. Commit and push to `main`.
4. Tag that commit `<pkg>-v<version>` and push the tag.
5. Watch the run: `gh run watch $(gh run list --workflow=publish.yml --limit 1 --json databaseId -q '.[0].databaseId') --exit-status`.

`npm run publish:all` publishes every package at once for a local/manual release;
the tag flow is the normal path.

### Gotcha: bump a peer-dep range → regenerate the lockfile, or CI 404s

When you change a theme's `@cpyle0819/ambience` peer range (e.g. `^2.0.0` →
`^2.1.1`), you MUST re-run `npm install` at the repo root and commit the updated
`package-lock.json` in the same change. The workflow runs `npm ci`, which fails
if the lockfile doesn't satisfy the declared range. And because ambience is
github-only, an unsatisfied range doesn't just warn — npm falls back to the npm
registry, finds nothing, and dies with `E404 @cpyle0819/ambience`, killing the
publish before it runs. A tag whose commit has a stale lockfile publishes
nothing.

Defensive cue: `npm ci` locally before tagging reproduces CI exactly and catches
this in one command. The tag points at a commit — if you fix the lockfile after
tagging, move the tag to the fixed commit (delete + recreate) or the workflow
keeps building the broken one.
