/**
 * Check if process is running in a Kubernetes environment
 * @returns `true` if process is running in a Kubernetes environment
 */
export const isKubernetes = async() => {
  const { access, readFile } = await import('node:fs/promises')
  try {
    await access('/proc/self/cgroup')
    const cgroupContent = await readFile('/proc/self/cgroup', 'utf8')
    return /kubernetes/i.test(cgroupContent)
  }
  catch { return false }
}
