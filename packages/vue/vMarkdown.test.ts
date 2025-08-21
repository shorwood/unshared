/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { VMarkdownModifier } from './vMarkdown'
import { vMarkdown } from './vMarkdown'

function applyDirective(value: string | undefined, modifiers: Partial<Record<VMarkdownModifier, boolean>> = {}) {
  const element = document.createElement('div')
  element.setHTMLUnsafe = (html: string) => element.innerHTML = html.trim()
  // @ts-expect-error: ignore
  vMarkdown.mounted(element, { modifiers, value })
  return element
}

// @vitest-environment happy-dom
describe('vMarkdown', () => {
  describe('hooks', () => {
    it('should define update and mount hooks', () => {
      // @ts-expect-error: ignore
      expect(vMarkdown.updated).toBeDefined()
      // @ts-expect-error: ignore
      expect(vMarkdown.mounted).toBeDefined()
      // @ts-expect-error: ignore
      expect(vMarkdown.mounted).toBe(vMarkdown.updated)
    })
  })

  describe('rendering', () => {
    it('should render markdown content as HTML', () => {
      const element = applyDirective('# Hello World\n\nThis is a **test**.')
      const expected = '<h1>Hello World</h1>\n<p>This is a <strong>test</strong>.</p>'
      expect(element.innerHTML).toBe(expected)
    })

    it('should handle empty markdown content', () => {
      const element = applyDirective('')
      expect(element.innerHTML).toBe('')
    })

    it('should handle undefined markdown content', () => {
      const element = applyDirective(undefined)
      expect(element.innerHTML).toBe('')
    })
  })

  describe('github flavored markdown', () => {
    it('should not render GFM tables', () => {
      const element = applyDirective('|Header|\n|---|\n|Cell1|\n|Cell2|', { gfm: false })
      const expected = '<p>|Header|\n|---|\n|Cell1|\n|Cell2|</p>'
      expect(element.innerHTML).toBe(expected)
    })

    it('should render GFM tables by default', () => {
      const element = applyDirective('|Header|\n|---|\n|Cell1|\n|Cell2|')
      const expected = '<table>\n<thead>\n<tr>\n<th>Header</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>Cell1</td>\n</tr>\n<tr>\n<td>Cell2</td>\n</tr>\n</tbody></table>'
      expect(element.innerHTML).toBe(expected)
    })
  })

  describe('breaks', () => {
    it('should not respect line breaks in markdown by default', () => {
      const element = applyDirective('Line 1\nLine 2')
      const expected = '<p>Line 1\nLine 2</p>'
      expect(element.innerHTML).toBe(expected)
    })

    it('should respect line breaks in markdown', () => {
      const element = applyDirective('Line 1\nLine 2', { breaks: true })
      const expected = '<p>Line 1<br>Line 2</p>'
      expect(element.innerHTML).toBe(expected)
    })
  })

  describe('escape', () => {
    it('should escape HTML in markdown content by default', () => {
      const element = applyDirective('<h1>Hello</h1>World')
      const expected = '<p>&lt;h1&gt;Hello&lt;/h1&gt;World</p>'
      expect(element.innerHTML).toBe(expected)
    })

    it('should include HTML in markdown content when html modifier is used', () => {
      const element = applyDirective('<h1>Hello</h1>World', { html: true })
      const expected = '<h1>Hello</h1>World'
      expect(element.innerHTML).toBe(expected)
    })

    it('should purify HTML content when html modifier is used', () => {
      const element = applyDirective('<h1>Hello<script>alert("XSS")</script></h1>World', { html: true })
      const expected = '<h1>Hello</h1>World'
      expect(element.innerHTML).toBe(expected)
    })
  })

  describe('async', () => {
    it('should render async content correctly', async() => {
      const element = applyDirective('Hello, World!', { async: true })
      await new Promise(resolve => setTimeout(resolve, 1)) // Wait for async rendering
      const expected = '<p>Hello, World!</p>'
      expect(element.innerHTML).toBe(expected)
    })
  })
})
