/**
 * Check if process is running on Minikube
 * @returns `true` if process is running on Minikube
 */
export const isMinikube = async(): Promise<boolean> => {
  const { access } = await import('node:fs/promises')
  try { await access('/etc/kubernetes/minikube'); return true }
  catch { return false }
}
