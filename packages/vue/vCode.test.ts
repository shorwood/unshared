/* oxlint-disable @typescript-eslint/no-unsafe-call */
import type { VCodeBinding } from './vCode'
import { vCode } from './vCode'

function applyDirective(value: string | undefined, modifiers: Partial<Record<VCodeBinding, boolean>> = {}) {
  const element = document.createElement('div')
  element.setHTMLUnsafe = (html: string) => element.innerHTML = html.trim()
  // @ts-expect-error: ignore
  vCode.mounted(element, { modifiers, value })
  return element
}

// @vitest-environment happy-dom
describe('vCode', () => {
  describe('hooks', () => {
    it('should define update and mount hooks', () => {
      // @ts-expect-error: ignore
      expect(vCode.updated).toBeDefined()
      // @ts-expect-error: ignore
      expect(vCode.mounted).toBeDefined()
      // @ts-expect-error: ignore
      expect(vCode.mounted).toBe(vCode.updated)
    })
  })

  describe('rendering', () => {
    it('should handle empty code content', () => {
      const element = applyDirective('', { json: true })
      expect(element.innerHTML).toBe('')
    })

    it('should handle undefined code content', () => {
      const element = applyDirective(undefined, { json: true })
      expect(element.innerHTML).toBe('')
    })
  })

  describe('json', () => {
    it('should render JSON code with syntax highlighting', () => {
      const jsonCode = '{"name": "test"}'
      const element = applyDirective(jsonCode, { json: true })
      const expected = '<span class="hljs-punctuation">{</span><span class="hljs-attr">"name"</span><span class="hljs-punctuation">:</span> <span class="hljs-string">"test"</span><span class="hljs-punctuation">}</span>'
      expect(element.innerHTML).toBe(expected)
    })

    it('should handle malformed JSON gracefully', () => {
      const malformedJson = '{"incomplete": "test'
      const element = applyDirective(malformedJson, { json: true })
      const expected = '<span class="hljs-punctuation">{</span><span class="hljs-attr">"incomplete"</span><span class="hljs-punctuation">:</span> <span class="hljs-string">"test</span>'
      expect(element.innerHTML).toBe(expected)
    })
  })

  describe('yaml', () => {
    it('should render YAML code with syntax highlighting', () => {
      const yamlCode = 'name: test'
      const element = applyDirective(yamlCode, { yaml: true })
      const expected = '<span class="hljs-attr">name:</span> <span class="hljs-string">test</span>'
      expect(element.innerHTML).toBe(expected)
    })

    it('should handle malformed YAML gracefully', () => {
      const malformedYaml = 'invalid: yaml\n  key: value'
      const element = applyDirective(malformedYaml, { yaml: true })
      const expected = '<span class="hljs-attr">invalid:</span> <span class="hljs-string">yaml</span>\n  <span class="hljs-attr">key:</span> <span class="hljs-string">value</span>'
      expect(element.innerHTML).toBe(expected)
    })
  })
})
