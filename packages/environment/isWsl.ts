import { readFile } from 'node:fs/promises'

/**
 * Check if process is running in a Windows Subsystem for Linux (WSL) environment.
 * This is done by checking for the existence of `/proc/version` and searching
 * for the string `wsl` in the file contents.
 *
 * @returns `true` if process is running in a WSL environment.
 * @example await isWsl() // true
 */
export async function isWsl() {
  try {
    const versionContent = await readFile('/proc/version', 'utf8')
    return /wsl/i.test(versionContent)
  }
  catch {
    return false
  }
}
