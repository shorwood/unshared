import { expect, it } from 'vitest'
import { escapeHtml } from './escapeHtml'

it.each([

  ['foo&lt;bar&gt;baz', 'foo<bar>baz'],
  ['foo&amp;bar&amp;baz', 'foo&bar&baz'],
  ['foo&quot;bar&quot;baz', 'foo"bar"baz'],
  ['foo&#39;bar&#39;baz', 'foo\'bar\'baz'],
  ['foo&#x27;bar&#x27;baz', 'foo\'bar\'baz'],
  ['&amp;&lt;&gt;&quot;&#39;', '&<>"\''],

])('should escape HTML special characters to %s', (expected, value) => {
  const result = escapeHtml(value)
  expect(result).toEqual(expected)
})
