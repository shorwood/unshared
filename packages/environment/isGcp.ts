/**
 * Check if process is running on Google Cloud Functions
 *
 * @returns `true` if process is running on Google Cloud Functions
 */
export async function isGcp() {
  const { access } = await import('node:fs/promises')
  try { await access('/etc/gcp_conf'); return true }
  catch { return false }
}
