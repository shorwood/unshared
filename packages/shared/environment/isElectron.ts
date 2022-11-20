/**
 * Check if process is running in an Electron app.
 * @returns `true` if process is running in an Electron app
 */
export const isElectron = () => {
  // --- Detect on Node.js
  if (typeof process !== 'undefined' && process.versions?.electron)
    return true

  // --- Detect on Client
  if (typeof navigator !== 'undefined') {
    const userAgent = navigator.userAgent.toLowerCase()
    return userAgent.includes(' electron/')
  }
}
