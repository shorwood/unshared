import { PackageJSON } from 'types-pkg-json'
import { loadObject } from '../io/loadObject'
import { getPackageJsonPath } from './getPackageJsonPath'

/**
 * Get the content of the `package.json` file from a context directory.
 * @param from The path to start from. Can be a file, a directory or a package name.
 * @returns The content of the `package.json` file.
 */
export const getPackageJson = async(from: string): Promise<PackageJSON> => {
  const path = await getPackageJsonPath(from)
  return loadObject<PackageJSON>(path)
}
