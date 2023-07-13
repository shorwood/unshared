import { execFile } from 'node:child_process'
import { cwd } from 'node:process'

/**
 * Get the remote URL of a repository at a given path.
 *
 * @param path The path to the repository. (Default: `process.cwd()`)
 * @param name The name of the remote. (Default: `'origin'`)
 * @returns The remote URL of the repository.
 * @example getGitRemoteUrl() // 'git@github.com:example/project.git'
 */
export async function getGitRemoteUrl(path: string = cwd(), name = 'origin'): Promise<string> {
  return await new Promise<string>((resolve, reject) => {
    execFile(
      'git', ['-C', path, 'config', '--get', `remote.${name}.url`],
      { encoding: 'utf8' },
      (error, stdout) => (error ? reject(error) : resolve(stdout.trim())),
    )
  })
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should get the remote URL of this repository', async() => {
    const result = await getGitRemoteUrl()
    const expected = 'git@github.com:shorwood/unshared.git'
    expect(result).toEqual(expected)
  })
}
