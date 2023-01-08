/**
 * Check if process is running in a CLI environment
 * @returns `true` if process is running in a CLI
 */
export const isCli = () => typeof process !== 'undefined' && process.argv?.length > 1
