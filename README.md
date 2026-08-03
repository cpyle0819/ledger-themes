# ledger-themes

Themes for [The Ledger](https://github.com/cpyle0819/the-ledger). Each theme is a
standalone npm package — install just the one you want; nothing else comes with it.

A theme is a package carrying a `ledgerTheme` block in its `package.json`. The
Ledger discovers every installed theme package, serves its assets, and swaps the
stylesheet, fonts, logo, ambient, and sounds live. There is no build step: a theme
ships a `theme.css` (the token contract + its own decoration) and optional plain-JS
web components (logo, ambient). See The Ledger's `CLAUDE.md` for the token contract.

## Packages

| Package | Theme | Look |
|---|---|---|
| [`@cpyle0819/ledger-theme-the-ledger`](packages/the-ledger) | The Ledger | Leather, parchment, brass, wax seal — the reference theme. |
| [`@cpyle0819/ledger-theme-space-opera`](packages/space-opera) | Space Opera | Gunmetal data-plates, phosphor-cyan readouts, amber warnings — Expanse-cold. |

## Using a theme

Install the package into a Ledger deployment and it's discovered automatically:

```
npm install @cpyle0819/ledger-theme-space-opera
```

You install only the theme you name — each package is independent, so a consumer
never pulls another theme's bytes. (`the-ledger` also pulls its ambient dependency,
`smoke-drift`; `space-opera` currently ships no ambient.)

## Developing

This is an npm-workspaces monorepo.

```
npm install                       # link the workspace packages
npm publish --workspaces --access public   # publish every package (or use npm run publish:all)
```

Publish a single theme with `npm publish -w @cpyle0819/ledger-theme-space-opera`.
Scoped packages are private by default on npm, so each package sets
`publishConfig.access: "public"`.
