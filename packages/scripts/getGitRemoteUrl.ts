import { cwd } from 'node:process'
import { execFile } from 'node:child_process'

/**
 * Get the remote URL of a repository at a given path.
 *
 * @param path The path to the repository.
 * @param name The name of the remote.
 * @returns The remote URL of the repository.
 * @example await getGitRemoteUrl() // 'git@github.com:example/project.git'
 */
export async function getGitRemoteUrl(path = cwd(), name = 'origin'): Promise<string> {
  return await new Promise<string>((resolve, reject) => {
    execFile(
      'git',
      ['-C', path, 'config', '--get', `remote.${name}.url`],
      { encoding: 'utf8' },
      (error, stdout) => (error ? reject(error) : resolve(stdout.trim())),
    )
  })
}
