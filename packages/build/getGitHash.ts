import { execFile } from 'node:child_process'
import { cwd } from 'node:process'

/**
 * Get the hash of a commit in a repository at a given path.
 *
 * @param path The path to the repository directory. (Default: `process.cwd()`)
 * @param name The name or refence of the commit. (Default: `'HEAD'`)
 * @returns The git hash of the current commit.
 * @example getGitHash() // 'a1b2c3d4e5f6g7h8i9j0'
 */
export async function getGitHash(path: string = cwd(), name = 'HEAD'): Promise<string> {
  return await new Promise<string>((resolve, reject) => {
    execFile(
      'git', ['-C', path, 'rev-parse', name],
      { encoding: 'utf8' },
      (error, stdout) => (error ? reject(error) : resolve(stdout.trim())),
    )
  })
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should get the git hash of the current commit', async() => {
    const result = await getGitHash()
    expect(result).toMatch(/^[\da-f]{40}$/)
  })
}