/**
 * Iterator for the {@link mapLines} function. Receives the current line, its index and the array of lines.
 *
 * @param line The current line.
 * @param index The index of the current line.
 * @param lines The array of lines.
 * @returns The mapped line.
 */
export type MapLinesIterator = (line: string, index: number, lines: string[]) => string

/**
 * Map each line of a string to a new string.
 *
 * @param value The string to map.
 * @param iterator The mapper function.
 * @returns The mapped string.
 * @throws If `value` is not a string or `iterator` is not a function.
 * @example mapLines('foo\nbar\nbaz', (str, i) => `${i}:${str}`) // => '0:foo\n1:bar\n2:baz'
 */
export function mapLines(value: string, iterator: MapLinesIterator): string {
  return value.split('\n').map(iterator).join('\n')
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should map each line of a string to a new string', () => {
    const result = mapLines('foo\nbar\nbaz', (line, index, lines) => `${index + 1}/${lines.length}:${line}`)
    expect(result).toEqual('1/3:foo\n2/3:bar\n3/3:baz')
  })
}
