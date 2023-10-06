import { vol } from 'memfs'
import { PackageJSON } from 'types-pkg-json'
import { FSObjectOptions, loadObject } from './loadObject'
import { resolvePackageJson } from './resolvePackageJson'

/**
 * Get a reactive `PackageJSON` object from a context directory or a package name.
 * The object is two-way bound to the `package.json` file. Meaning that any change
 * to the file will be reflected in the object and any change to the object will
 * be reflected in the file.
 *
 * @param path The context directory or package name.
 * @param options The options to pass to the {@link loadObject} function.
 * @returns A reactive `PackageJSON` object.
 */
export async function loadPackageJson(path: string, options?: FSObjectOptions<PackageJSON>): Promise<PackageJSON> {
  const packageJsonPath = await resolvePackageJson(path)
  return loadObject<PackageJSON>(packageJsonPath, options)
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should get the package.json', async() => {
    vol.fromJSON({ '/package.json': JSON.stringify({ name: 'foobar' }) })
    const result = await loadPackageJson('/home/user/foobar')
    expect(result).toStrictEqual({ name: 'foobar' })
  })
}
