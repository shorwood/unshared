export interface EnumEntry {

  /**
   * The JSDoc documentation for the enum entry.
   *
   * @example `This is a document.\n@default 0`
   */
  document?: string

  /**
   * The key of the enum entry.
   *
   * @example `Zero`
   */
  key: string

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
 * const responseJson = await response.json()
 * const categories = responseJson.map(({ name, id }) => ({ name, value: id }))
 * const declaration = buildEnum('Category', categories)
 * await writeFile('categories.ts', declaration)
 *
 * // categories.ts
 * export enum MyEnum {
 *   Category1 = <uuid>,
 *   Category2 = <uuid>,
 *   ...
 * }
 */
export function buildEnum(exportName: string, entries: EnumEntry[]) {
  const enumDeclarations: string[] = []
  for (const entry of entries) {
    const key = entry.key.includes(' ') ? `'${entry.key}'` : entry.key
    const document = entry.document?.replace(/^/gm, ' * ')
    const documentPart = document ? `/**\n${document}\n */\n` : ''
    const declaration = `${documentPart}${key} = ${entry.value},`
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

/* v8 ignore next */
if (import.meta.vitest) {
  const { dedent } = await import('@unshared/string/dedent')

  test('should build an enum', () => {
    const result = buildEnum('Test', [
      { key: 'Zero', value: '0' },
      { document: 'Document\n@default 1', key: 'One', value: '1' },
    ])

    expect(result).toStrictEqual(dedent(`
      export enum Test {
        Zero = 0,
        /**
         * Document
         * @default 1
         */
        One = 1,
      }
    `))
  })

  test('should build a default enum', () => {
    const result = buildEnum('default', [
      { key: 'Zero', value: '0' },
      { document: 'Document\n@default 1', key: 'One', value: '1' },
    ])

    expect(result).toStrictEqual(dedent(`
      export default enum {
        Zero = 0,
        /**
         * Document
         * @default 1
         */
        One = 1,
      }
    `))
  })
}
