import type { Directive, DirectiveHook } from 'vue'
import HLJS from 'highlight.js/lib/core'
import HLJSJson from 'highlight.js/lib/languages/json'
import HLJSYaml from 'highlight.js/lib/languages/yaml'

export type VCodeBinding =
  | 'json'
  | 'yaml'

const toCode: DirectiveHook<HTMLElement, any, string | undefined, VCodeBinding> = (element, binding) => {
  if (!binding.value) return
  const language = Object.keys(binding.modifiers).pop()
  if (!language) return
  if (binding.modifiers.json) HLJS.registerLanguage('json', HLJSJson)
  if (binding.modifiers.yaml) HLJS.registerLanguage('yaml', HLJSYaml)
  const html = HLJS.highlight(binding.value, { language }).value
  element.setHTMLUnsafe(html)
}

/**
 * The `v-code` directive is used to render code snippets in the UI. It takes a string of code
 * and renders it as HTML. This directive is useful for displaying code snippets in the UI.
 *
 * @example
 * ```vue
 * <template>
 *   <pre v-code.javascript="codeSnippet" />
 * </template>
 */
export const vCode: Directive<HTMLElement, string | undefined, VCodeBinding> = {
  updated: toCode,
  mounted: toCode,
}
