# Fonts

Self-hosted fonts go here. The template draws on the system font stack, so this folder holds no
fonts yet.

To self-host a typeface:

1. Put its WOFF2 files here, with the typeface's licence beside them (for example
   `OFL-<family>.txt` for an SIL Open Font License face).
2. List each file in `FRAME_FONTS` in `packages/frame/fonts.ts`, and the ones the header and footer
   draw with in `PRELOAD_FONTS`.
3. Point `--frame-font-sans` or `--frame-font-mono` in `packages/frame/site-frame.css` at the new
   family.

Both sites serve this folder at `/fonts/` under their base path: the site through
`apps/site/vite.config.ts`, the docs through `staticDirectories` in
`apps/docs/docusaurus.config.ts`. `npm run check:fonts` checks every font URL in a sub-path build.
