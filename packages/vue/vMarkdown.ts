/* eslint-disable sonarjs/slow-regex */
import type { Directive, DirectiveHook } from 'vue'
import { escapeHtml } from '@unshared/string/escapeHtml'
import DOMPurify from 'dompurify'
import { marked } from 'marked'

export type VMarkdownModifier =
  | 'async'
  | 'breaks'
  | 'gfm'
  | 'html'

const toMarkdown: DirectiveHook<HTMLElement, any, string | undefined, VMarkdownModifier> = (element, binding) => {
  if (!binding.value) return
  const markdown = binding.modifiers.html ? binding.value : escapeHtml(binding.value).replaceAll(/{{([^}]+)}}/g, '`$1`')
  const { gfm = true, breaks = false, async = false } = binding.modifiers
  const html = marked(markdown, { gfm, breaks, async })
  if (html instanceof Promise) {
    html
      .then((resolvedHtml) => {
        const htmlSafe = DOMPurify.sanitize(resolvedHtml)
        element.setHTMLUnsafe(htmlSafe)
      })
      .catch((error) => {
        console.warn('Error rendering markdown for element:', element, error)
        element.textContent = ''
      })
  }
  else {
    const htmlSafe = DOMPurify.sanitize(html)
    element.setHTMLUnsafe(htmlSafe)
  }
}

/**
 * The `v-markdown` directive is used to render markdown content in the UI. It takes a string
 * of markdown content and renders it as HTML. This directive is useful for displaying
 * formatted text in the UI.
 *
 * @example
 * ```vue
 * <script setup>
 * import { vMarkdown } from 'unshared/vue/vMarkdown'
 * </script>
 *
 * <template>
 *   <div v-markdown="markdownContent" />
 * </template>
 * ```
 */
export const vMarkdown: Directive<HTMLElement, string | undefined, VMarkdownModifier> = {
  updated: toMarkdown,
  mounted: toMarkdown,
}
