/**
 * Map each line of a string to a new string.
 * @param value The string to map.
 * @param iterator The mapper function.
 * @return The mapped string.
 * @example
 * mapLines('foo\nbar\nbaz', (line, index) => `${index}: ${line}`) // => '0: foo\n1: bar\n2: baz'
 */
export const mapLines = (value: string, iterator: (line: string, index: number, lines: string[]) => string): string =>
  value.split('\n')
    .map(iterator)
    .join('\n')
