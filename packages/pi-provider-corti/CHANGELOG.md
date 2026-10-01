# @sindripetur/pi-provider-corti

## 0.0.6

### Patch Changes

- 8c910c7: Import the OpenAI-completions API adapter via the native
  `@earendil-works/pi-ai/api/openai-completions.lazy` export instead of the
  temporary `@earendil-works/pi-ai/compat` surface, which will be removed.

## 0.0.5

### Patch Changes

- 4ab8b8d: Use Corti's standard `CORTI_BEARER` credential path via pi-ai's
  `envApiKeyAuth`, removing the hand-rolled pasteLogin/createAuth/check/resolve
  auth glue. `/login corti` still works, and the `CORTI_BEARER` environment
  variable now resolves without a stored credential, so users of
  `npx @corti/cli models init` no longer need to authenticate twice.

## 0.0.4

### Patch Changes

- a5f972c: Release 0.0.4 to verify the npm-workspace publish pipeline end-to-end.

## 0.0.3

### Patch Changes

- a97e715: Switch from pnpm workspace to npm workspaces; publish via `changeset publish` with npm provenance (no custom publish script).

## 0.0.2

### Patch Changes

- 4646592: Publish with npm provenance attestation via OIDC.

## 0.0.1

### Patch Changes

- 8a964cc: Add CI and changesets for publishing.
