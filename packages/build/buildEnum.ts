export interface EnumEntry {
  /**
   * The JSDoc documentation for the enum entry.
   *
   * @example `This is a document.\n@default 0`
   */
  document?: string
  /**
   * The name of the enum entry.
   *
   * @example `Zero`
   */
  name: string
  /**
   * The value of the enum entry.
   *
   * @example `0`
   */
  value: string
}

/**
 * Generate a [TypeScript enum declaration](https://www.typescriptlang.org/docs/handbook/enums.html#enums-at-compile-time).
 * This is useful for generating TypeScript declarations from dynamic data.
 *
 * @param exportName The name of the exported const object.
 * @param entries The entries of the exported const object.
 * @returns The generated TypeScript declaration.
 * @throws If one of the parameters is of the wrong type.
 * @example
 * const response = await fetch('https://example.com/categories')
 * const categories = await response.json()
 * const entries = categories.map(({ name, id }) => ({ name, value: id }))
 * const declaration = buildEnum('Category', entries)
 * await writeFile('category.d.ts', declaration)
 *
 * // category.d.ts
 * export enum MyEnum {
 *   Category1 = <uuid>,
 *   Category2 = <uuid>,
 *   ...
 * }
 */
export const buildEnum = (exportName: string, entries: EnumEntry[]) => {
  if (typeof exportName !== 'string')
    throw new TypeError('Expected exportName to be a string')
  if (!Array.isArray(entries))
    throw new TypeError('Expected entries to be an array')

  // --- Assert the entries and build the declarations
  const enumDeclarations: string[] = []
  for (const entry of entries) {
    if (typeof entry !== 'object' || entry === null)
      throw new TypeError('Expected entries to be an array of objects')
    if (typeof entry.name !== 'string')
      throw new TypeError('Expected entry.name to be a string')
    if (typeof entry.value !== 'string')
      throw new TypeError('Expected entry.value to be a string')
    if (entry.document !== undefined && typeof entry.document !== 'string')
      throw new TypeError('Expected entry.document to be a string')
    const declaration = `/**\n${entry.document ?? ''}\n */\n${entry.name} = ${entry.value},`
    enumDeclarations.push(declaration)
  }

  // --- Join the properties
  const enumDeclaration = enumDeclarations
    .join('\n')
    .split('\n')
    .map(line => `  ${line.trimEnd()}`)
    .join('\n')

  // --- Build the prefix
  const prefix = exportName === 'default'
    ? 'export default enum'
    : `export enum ${exportName}`

  // --- Build the output string
  return `${prefix} {\n${enumDeclaration}\n}\n`
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should build an enum', () => {
    const result = buildEnum('Test', [
      { name: 'Zero', value: '0' },
      { name: 'One', value: '1', document: 'Document@default 1' },
    ])
    const expected = 'export enum Test {\n  Zero = 0,\n  /**\nDocument@default 1\n */\n  One = 1,\n}\n'
    expect(result).toEqual(expected)
  })

  it('should build a default enum', () => {
    const result = buildEnum('default', [
      { name: 'Zero', value: '0' },
      { name: 'One', value: '1', document: 'Document@default 1' },
    ])
    const expected = 'export default enum {\n  Zero = 0,\n  /**\nDocument@default 1\n */\n  One = 1,\n}\n'
    expect(result).toEqual(expected)
  })

  it('should throw an error if the export name is not a string', () => {
    // @ts-expect-error: invalid type
    const shouldThrow = () => buildEnum(0, [])
    expect(shouldThrow).toThrowError(TypeError)
  })

  it('should throw an error if the entries are not an array', () => {
    // @ts-expect-error: invalid type
    const shouldThrow = () => buildEnum('Test', {})
    expect(shouldThrow).toThrowError(TypeError)
  })

  it('should throw an error if the entry is not an object', () => {
    // @ts-expect-error: invalid type
    const shouldThrow = () => buildEnum('Test', [0])
    expect(shouldThrow).toThrowError(TypeError)
  })

  it('should throw an error if the entry name is not a string', () => {
    // @ts-expect-error: invalid type
    const shouldThrow = () => buildEnum('Test', [{ name: 0, value: '0' }])
    expect(shouldThrow).toThrowError(TypeError)
  })

  it('should throw an error if the entry value is not a string', () => {
    // @ts-expect-error: invalid type
    const shouldThrow = () => buildEnum('Test', [{ name: 'Zero', value: 0 }])
    expect(shouldThrow).toThrowError(TypeError)
  })
}
