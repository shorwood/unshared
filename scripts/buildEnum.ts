/**
 * Generate a TypeScript file that exports a const object with the given name and properties.
 * @param exportName The name of the exported const object.
 * @param entries The entries of the exported const object.
 * @returns The generated TypeScript file.
 */
export const buildEnum = (exportName: string, entries: { document: string; key: string; value: string }[]) => {
  // --- Build the properties
  const properties = entries
    .map(({ document, key, value }) => `/**\n${document}\n */\n${key} = ${value},`)
    .join('\n')
    .split('\n')
    .map(line => `  ${line.trimEnd()}`)
    .join('\n')

  // --- Build the output string
  return `export enum ${exportName} {\n${properties}\n}\n`
}
