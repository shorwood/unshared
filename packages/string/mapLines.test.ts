import { mapLines } from './mapLines'

describe('mapLines', () => {
  test('should map each line of a string to a new string', () => {
    const result = mapLines('foo\nbar\nbaz', (line, index, lines) => `${index + 1}/${lines.length}:${line}`)
    expect(result).toBe('1/3:foo\n2/3:bar\n3/3:baz')
  })
})
