/**
 * Delay execution by `ms` milliseconds
 * @param {number} ms The amount of milliseconds to delay
 * @returns {Promise<void>} A promise that resolves in `ms` milliseconds
 * @example
 * await delay(1000)
 */
export const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))
