import { readFile } from 'node:fs/promises'

/**
 * Check if process is running in a Docker container
 *
 * @returns `true` if process is running in a Docker container
 */
export async function isDocker() {
  try {
    const cgroupContent = await readFile('/proc/self/cgroup', 'utf8')
    return /docker/i.test(cgroupContent)
  }
  catch {
    return false
  }
}
