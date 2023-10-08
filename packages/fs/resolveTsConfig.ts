import { vol } from 'memfs'
import { findAncestor } from './findAncestor'

/**
 * Resolve the path of the `tsconfig.json` file from a context directory.
 *
 * @param path The path to start from.
 * @returns The path of the `tsconfig.json` file.
 * @example resolvePackageJson('/home/user/project') // '/home/user/project/tsconfig.json'
 */
export async function resolveTsConfig(path: string): Promise<string> {
  return findAncestor('tsconfig.json', path)
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should get the tsconfig.json path', async() => {
    vol.fromJSON({
      '/home/user/tsconfig.json': '{}',
      '/home/user/project/tsconfig.json': '{}',
    })
    const result = await resolveTsConfig('/home/user/project')
    expect(result).toStrictEqual('/home/user/project/tsconfig.json')
  })

  it('should get the tsconfig.json at the root', async() => {
    vol.fromJSON({
      '/tsconfig.json': '{}',
    })
    const result = await resolveTsConfig('/home/user/project')
    expect(result).toStrictEqual('/tsconfig.json')
  })
}
