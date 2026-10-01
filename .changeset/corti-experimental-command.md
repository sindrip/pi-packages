---
"@sindripetur/pi-provider-corti": minor
---

Add a `/corti` slash command that opens an options menu to toggle experimental
(beta) models and refresh the catalog. When enabled, the provider fetches
`/models` with the experimental query param (matching `npx @corti/cli
--experimental`), so beta models become selectable in the model picker. The
toggle is in-memory and resets each pi start.
