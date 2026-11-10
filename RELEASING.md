# Releasing the docs 📚

> 🏷️ How the docs version follows the product's release, and what changes when the product goes to v1.0.0

The docs are versioned after the product (see [apps/docs/README.md](apps/docs/README.md)).
`apps/docs/docs` is vNext, the working copy; each release has a snapshot in
`apps/docs/versioned_docs`, and the newest one is the default at `/docs/`.

## 🏷️ The versions

- **v0.1.0** is the first docs version. It is cut and in `apps/docs/versions.json`.
- **v1.0.0** is the next one. When the product cuts its first release candidate (`v1.0.0-rc.1`),
  the docs become v1.0.0, not another v0.x.

## 🚀 When rc.1 cuts, make v1.0.0

In the release's own PR:

1. Set `packages/frame/release.ts`: `version` to `v1.0.0`, `kind` to `release` (or leave
   `prerelease` while only the rc is out), `publishedOn` to the date, and `upcoming` to the version
   after it.
2. Run `npm run docs:version`. It snapshots vNext as `v1.0.0` and puts it first in
   `apps/docs/versions.json`.
3. Run `npm run check:docs` and `npm run check:docs-version`, which fails unless the release's
   version is cut and is the newest.
4. Re-take any screenshot whose screen changed. Pictures are light mode, numbered, with metadata
   stripped (`apps/docs/screenshots/slots.json` says how to reach each state).
5. Commit the snapshot, `versions.json` and the bump together, and say in the PR which template
   release the docs last synced to if it moved.

v0.1.0 stays in the version picker. A snapshot only changes to match what its release ships.
