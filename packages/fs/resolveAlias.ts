import { resolve } from 'node:path'
import { MaybeArray } from '@unshared/types'

/**
 * Resolve a path based on a list of aliases. This allows you to resolve a path
 * using a much shorter alias and can be used to
 *
 * @param path The path to resolve.
 * @param aliases The aliases to use.
 * @returns If the path was found, returns it's absolute path.
 * @example
 * const aliases = { '@/*': ['/usr/bin/*', '/usr/local/bin/*'] }
 * resolveAlias('@/cat', aliases) // '/usr/bin/cat'
 */
export async function resolveAlias(path: string, aliases: Record<string, MaybeArray<string>> = {}): Promise<string> {
  // --- Try with each alias.
  for (const alias in aliases) {
    const aliasPaths = Array.isArray(aliases[alias]) ? aliases[alias] : [aliases[alias]]
    const pathExp = new RegExp(`^${alias.replaceAll('*', '(.*)')}$`)
    const pathMatch = path.match(pathExp)
    if (!pathMatch) continue

    // --- Return the first path that resolves.
    for (const aliasPath of aliasPaths) {
      const pathUnaliased = aliasPath.replace('*', pathMatch[1])
      const pathAbsolute = resolve(pathUnaliased)
      try {
        return require.resolve(pathAbsolute, { paths: aliasPaths })
      }
      catch {
        /** Ignore error. */
      }
    }
  }

  // --- Throw if the import was not found.
  throw new Error(`Could not resolve alias "${path}".`)
}
