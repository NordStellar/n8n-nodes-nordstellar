# Development

Requires **Node.js 22** (see `.nvmrc`; this is the version n8n itself requires). With
[nvm](https://github.com/nvm-sh/nvm): `nvm use`.

```sh
npm install
npm run build
npm run lint
```

## Testing locally

```sh
npm run dev
```

`n8n-node dev` starts a local n8n instance with this node loaded and rebuilds on changes. When
it prints the URL, open **http://localhost:5678**, create a *NordStellar Integration API*
credential (base URL is pre-filled; paste your access token), then add a **NordStellar** node
and run e.g. *Project → Get Many*.

Don't run `npm run build` while `npm run dev` is running — both write to `dist/` and clobber
each other.

## Publishing

Publishing to npm runs automatically via GitHub Actions (`.github/workflows/publish.yml`) when a
GitHub Release is published. The workflow runs `npm run release` (`n8n-node release`), which in CI
lints, builds, and publishes with [provenance](https://docs.npmjs.com/generating-provenance-statements),
as required for verified community nodes. Set the `NPM_TOKEN` repository secret first.

Release flow:

1. Bump the version: `npm version patch` (or `minor` / `major`), then `git push --follow-tags`.
2. Create a GitHub Release whose tag matches the version (e.g. `v0.1.1`).
3. Publishing the release triggers the workflow; watch the Actions tab.

The version in `package.json` must match the release tag, and npm rejects re-publishing an
already-published version.
