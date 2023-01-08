/**
 * Import a module from an inline script.
 * @param script The script to import from.
 * @returns The imported module.
 */
export async function importInline<T>(script: string): Promise<T> {
  const { tmpdir } = await import('node:os')
  const { join } = await import('node:path')
  const { randomUUID } = await import('node:crypto')
  const { writeFile, mkdir } = await import('node:fs/promises')

  // --- Create a temporary module file
  const moduleDirectory = tmpdir()
  const modulePath = `${join(moduleDirectory, randomUUID())}.js`
  await mkdir(moduleDirectory, { recursive: true })
  await writeFile(modulePath, script)

  // --- Import the module
  return await import(modulePath)
}
