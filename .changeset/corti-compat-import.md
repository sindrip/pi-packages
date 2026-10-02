---
"@sindripetur/pi-provider-corti": patch
---

Import the OpenAI-completions adapter from the virtualized
`@earendil-works/pi-ai/compat` entrypoint instead of
`@earendil-works/pi-ai/api/openai-completions.lazy`. Pi only virtualizes a
fixed set of `pi-ai` subpaths (``, `/compat`, `/oauth`, `/providers/all`)
for extensions; the `api/*` subpath is not provided and `pi-ai` is not
physically installed next to the extension, so the previous import failed
to resolve at load time with "Cannot find module". `compat` re-exports
`openAICompletionsApi`, matching the pattern used by the official provider
examples.
