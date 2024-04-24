/**
 * Check if process is running in an Electron app.
 *
 * @returns `true` if process is running in an Electron app
 */
export function isElectron() {
  // --- Detect on Server
  if (typeof process === 'undefined') return false
  if (process.versions.electron !== undefined) return true

  // --- Detect on Client
  if (typeof navigator !== 'undefined') {
    const userAgent = navigator.userAgent.toLowerCase()
    return userAgent.includes(' electron/')
  }
}
