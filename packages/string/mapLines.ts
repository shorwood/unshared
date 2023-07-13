/**
 * Map each line of a string to a new string.
 *
 * @param value The string to map.
 * @param iterator The mapper function.
 * @returns The mapped string.
 * @throws If `value` is not a string or `iterator` is not a function.
 * @example mapLines('foo\nbar\nbaz', (str, i) => `${i}:${str}`) // => '0:foo\n1:bar\n2:baz'
 */
export function mapLines(value: string, iterator: (line: string, index: number, lines: string[]) => string): string {
  return value.split('\n').map(iterator).join('\n')
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should map each line of a string to a new string', () => {
    const result = mapLines('foo\nbar\nbaz', (line, index, lines) => `${index}/${lines.length}:${line}`)
    expect(result).toEqual('0/3:foo\n1/3:bar\n2/3:baz')
  })
}
