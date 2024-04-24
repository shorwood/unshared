import { readFile } from 'node:fs/promises'

/**
 * Check if process is running in a Kubernetes environment
 *
 * @returns `true` if process is running in a Kubernetes environment
 */
export async function isKubernetes() {
  try {
    const cgroupContent = await readFile('/proc/self/cgroup', 'utf8')
    return /kubernetes/i.test(cgroupContent)
  }
  catch { return false }
}
