/**
 * Create a promise that resolves after a given delay.
 * @param {number} ms The amount of milliseconds to delay
 * @returns {Promise<void>} A promise that resolves in `ms` milliseconds
 * @example
 * await sleep(1000)
 */
export const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))
