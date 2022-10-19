/**
 * Map each line of a string to a new string.
 * @param {string} string The string to map.
 * @param {Function} mapper The mapper function.
 */
export const mapLines = (value: string, iterator: (line: string, index: number, lines: string[]) => string): string => 
  value.split('\n')
    .map(iterator)
    .join('\n')
