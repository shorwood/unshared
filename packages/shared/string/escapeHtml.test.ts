import { expect, it } from 'vitest'
import { escapeHtml } from './escapeHtml'

it('should escape HTML', () => {
  expect(escapeHtml('&<>"\'')).toEqual('&amp;&lt;&gt;&quot;&#39;')
})
