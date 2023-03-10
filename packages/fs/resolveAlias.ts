import { MaybeArray } from '@unshared/types/MaybeArray'

/**
 * Resolve a path based on a list of aliases.
 *
 * @param path The path to resolve.
 * @param aliases The aliases to use.
 * @returns If the path was found, returns it's absolute path.
 * @throws If the path was not found.
 * @example
 * const aliases = { '@/*': ['/usr/bin/*', '/usr/local/bin/*'] }
 * resolveAlias('@/cat', aliases) // '/usr/bin/cat'
 */
export const resolveAlias = async(path: string, aliases: Record<string, MaybeArray<string>> = {}): Promise<string> => {
  const { resolve } = await import('node:path')

  // --- Try with each alias.
  for (const alias in aliases) {
    const aliasPaths = Array.isArray(aliases[alias]) ? aliases[alias] : [aliases[alias]]
    const pathExp = new RegExp(`^${alias.replace(/\*/g, '(.*)')}$`)
    const pathMatch = path.match(pathExp)
    if (!pathMatch) continue

    // --- Return the first path that resolves.
    for (const aliasPath of aliasPaths) {
      const pathUnaliased = aliasPath.replace('*', pathMatch[1])
      const pathAbsolute = resolve(pathUnaliased)
      try { return require.resolve(pathAbsolute, { paths: aliasPaths }) }
      catch {}
    }
  }

  // --- Throw if the import was not found.
  throw new Error(`Could not resolve alias "${path}".`)
}
