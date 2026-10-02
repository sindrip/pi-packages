# @sindripetur/pi-provider-corti

## 0.1.1

### Patch Changes

- Import the OpenAI-completions adapter from the virtualized
  `@earendil-works/pi-ai/compat` entrypoint instead of
  `@earendil-works/pi-ai/api/openai-completions.lazy`. Pi only virtualizes a
  fixed set of `pi-ai` subpaths (``, `/compat`, `/oauth`, `/providers/all`)
  for extensions; the `api/*` subpath is not provided and `pi-ai` is not
  physically installed next to the extension, so the previous import failed
  to resolve at load time with "Cannot find module". `compat` re-exports
  `openAICompletionsApi`, matching the pattern used by the official provider
  examples.

## 0.1.0

### Minor Changes

- Squashed main into a single initial-release commit. Ships the Corti provider
  extension for Pi end to end: `CORTI_BEARER` bearer auth via pi-ai's
  `envApiKeyAuth`, a dynamic union catalog fetched from
  `/v1/models?experimental=true` (experimental models alongside stable), and
  malformed `/models` payload rejection so the last good catalog is retained.

## 0.0.6

### Patch Changes

- Request the full catalog (`/models?experimental=true`) so experimental models
  (-alpha/-betas) appear alongside stable ones; malformed `/models` payloads now
  throw instead of silently wiping the persisted catalog; imported the
  OpenAI-completions adapter via the native
  `@earendil-works/pi-ai/api/openai-completions.lazy` export rather than the
  temporary `compat` surface.

## 0.0.5

### Patch Changes

- Authenticate with Corti's standard `CORTI_BEARER` credential path via
  pi-ai's `envApiKeyAuth`, replacing hand-rolled auth glue.

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
