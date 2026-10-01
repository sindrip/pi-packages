---
"@sindripetur/pi-provider-corti": patch
---

Import the OpenAI-completions API adapter via the native
`@earendil-works/pi-ai/api/openai-completions.lazy` export instead of the
temporary `@earendil-works/pi-ai/compat` surface, which will be removed.
