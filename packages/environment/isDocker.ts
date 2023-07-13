/**
 * Check if process is running in a Docker container
 *
 * @returns `true` if process is running in a Docker container
 */
export const isDocker = async() => {
  const { readFile } = await import('node:fs/promises')
  try {
    const cgroupContent = await readFile('/proc/self/cgroup', 'utf8')
    return /docker/i.test(cgroupContent)
  }
  catch { return false }
}
