/**
 * Check if process is running in a Windows Subsystem for Linux (WSL) environment
 *
 * @returns `true` if process is running in a WSL environment
 */
export const isWsl = async() => {
  const { readFile } = await import('node:fs/promises')
  try {
    const versionContent = await readFile('/proc/version', 'utf8')
    return /wsl/i.test(versionContent)
  }
  catch { return false }
}
