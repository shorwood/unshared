import { cwd } from 'node:process'
import { TSConfigJSON } from 'types-tsconfig'
import { getTsConfigPath } from './getTsConfigPath'
import { loadObject } from './loadObject'

/**
 * Get the content of the `tsconfig.json` file from a context directory.
 * @param path
 * The path to start from. Can be a file, a directory or a package name.
 * Defaults to the current working directory.
 * @returns The content of the `tsconfig.json` file.
 */
export const getTsConfig = async(from: string = cwd()): Promise<TSConfigJSON> => {
  const path = await getTsConfigPath(from)
  return loadObject<TSConfigJSON>(path)
}
