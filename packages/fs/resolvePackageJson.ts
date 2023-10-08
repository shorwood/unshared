import { vol } from 'memfs'
import { findAncestor } from './findAncestor'

/**
 * Resolve the path of the `package.json` file from a directory.
 *
 * @param path The path to start from.
 * @returns The path of the `package.json` file.
 * @example resolvePackageJson('/home/user/project') // '/home/user/project/package.json'
 */
export async function resolvePackageJson(path: string): Promise<string> {
  return findAncestor('package.json', path)
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should get the package.json path', async() => {
    vol.fromJSON({
      '/home/user/package.json': '{}',
      '/home/user/project/package.json': '{}',
    })
    const result = await resolvePackageJson('/home/user/project')
    expect(result).toStrictEqual('/home/user/project/package.json')
  })

  it('should get the package.json at the root', async() => {
    vol.fromJSON({
      '/package.json': '{}',
    })
    const result = await resolvePackageJson('/home/user/project')
    expect(result).toStrictEqual('/package.json')
  })
}
