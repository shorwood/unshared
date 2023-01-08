import { TSConfigJSON } from 'types-tsconfig'
import { loadObject } from '../io/loadObject'
import { getTsConfigPath } from './getTsConfigPath'

/**
 * Get the content of the `tsconfig.json` file from a context directory.
 * @param from The path to start from. Can be a file, a directory or a package name.
 * @returns The content of the `tsconfig.json` file.
 */
export const getTsConfig = async(from: string): Promise<TSConfigJSON> => {
  const path = await getTsConfigPath(from)
  return loadObject<TSConfigJSON>(path)
}
