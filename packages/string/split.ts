import { StringSplit } from '@unshared/types/StringSplit'

/**
 * Split the string into an array of substrings using the specified delimiter.
 *
 * @param value The string to split.
 * @param delimiter The character to use as a separator.
 * @param limit A value used to limit the number of elements returned in the array.
 * @returns An array of substrings.
 * @example split('a,b,c', ',') // => ['a', 'b', 'c']
 */
export function split<S extends string, D extends string, N extends number = number>(value: S, delimiter: D, limit?: N): StringSplit<S, D, N>
export function split(value: string, delimiter: string | RegExp, limit?: number): string[]
export function split(value: string, delimiter: string | RegExp, limit?: number): string[] {
  return limit > 0
    ? value.split(delimiter, limit)
    : value.split(delimiter).slice(limit)
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should split a string', () => {
    const result = split('a,b,c', ',')
    expect(result).toEqual(['a', 'b', 'c'])
  })

  it('should split a string with a limit', () => {
    const result = split('a,b,c', ',', 2)
    expect(result).toEqual(['a', 'b'])
  })

  it('should split a string with a negative limit', () => {
    const result = split('a,b,c', ',', -2)
    expect(result).toEqual(['b', 'c'])
  })

  it('should throw if value is not a string', () => {
    // @ts-expect-error: invalid argument type.
    const shouldThrow = () => split(1, ',')
    expect(shouldThrow).toThrow(TypeError)
  })

  it('should throw if limit is not an integer', () => {
    const shouldThrow = () => split('a,b,c', ',', 1.1)
    expect(shouldThrow).toThrow(TypeError)
  })
}
