import { execFile } from 'node:child_process'

/**
 * Get the hash of a commit in a repository at a given path.
 *
 * @param path The path to the repository directory.
 * @param name The name or refence of the commit.
 * @returns The git hash of the current commit.
 * @example await getGitHash() // 'a1b2c3d4e5f6g7h8i9j0'
 */
export async function getGitHash(path = process.cwd(), name = 'HEAD'): Promise<string> {
  return await new Promise<string>((resolve, reject) => {
    execFile(
      '/usr/bin/git',
      ['-C', path, 'rev-parse', name],
      { encoding: 'utf8' },
      (error, stdout) => (error ? reject(error as Error) : resolve(stdout.trim())),
    )
  })
}
