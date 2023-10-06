import { vol } from 'memfs'
import { TSConfigJSON } from 'types-tsconfig'
import { FSObjectOptions, loadObject } from './loadObject'
import { resolveTsConfig } from './resolveTsConfig'

/**
 * Get a reactive `TSConfig` object from a context directory or a package name.
 * The object is two-way bound to the `tsconfig.json` file. Meaning that any change
 * to the file will be reflected in the object and any change to the object will
 * be reflected in the file.
 *
 * @param path The context directory or package name.
 * @param options The options to pass to the {@link loadObject} function.
 * @returns A reactive `TSConfig` object.
 */
export async function loadTsConfigJson(path: string, options?: FSObjectOptions<TSConfigJSON>): Promise<TSConfigJSON> {
  const tsConfigJSONPath = await resolveTsConfig(path)
  return loadObject<TSConfigJSON>(tsConfigJSONPath, options)
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should get the tsconfig.json', async() => {
    vol.fromJSON({ '/tsconfig.json': JSON.stringify({ name: 'foobar' }) })
    const result = await loadTsConfigJson('/home/user/foobar')
    expect(result).toStrictEqual({ name: 'foobar' })
  })
}
