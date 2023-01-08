/**
 * Create a promise that resolves after a given delay.
 * @param ms The amount of milliseconds to delay
 * @return A promise that resolves in `ms` milliseconds
 * @example
 * await sleep(1000)
 */
export const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))
