/**
 * Check if process is running on Azure Functions
 *
 * @returns `true` if process is running on Azure Functions
 */
export async function isAzure() {
  const { access } = await import('node:fs/promises')
  try { await access('/etc/azure.conf'); return true }
  catch { return false }
}
