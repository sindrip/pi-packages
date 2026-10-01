---
"@sindripetur/pi-provider-corti": patch
---

Use Corti's standard `CORTI_BEARER` credential path via pi-ai's
`envApiKeyAuth`, removing the hand-rolled pasteLogin/createAuth/check/resolve
auth glue. `/login corti` still works, and the `CORTI_BEARER` environment
variable now resolves without a stored credential, so users of
`npx @corti/cli models init` no longer need to authenticate twice.
