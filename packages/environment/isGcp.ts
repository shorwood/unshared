import { access } from 'node:fs/promises';

/**
 * Check if process is running on Google Cloud Functions
 *
 * @returns `true` if process is running on Google Cloud Functions
 */
export async function isGcp() {
  try {
    await access('/etc/gcp_conf'); return true
  }
  catch {
    return false
  }
}
