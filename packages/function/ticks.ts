import { nextTick } from 'node:process'

/**
 * Await for a number of ticks in the event loop. Be careful when using this function, as it can
 * cause the event loop to be blocked for the specified number of ticks.
 *
 * @param ticks The number of ticks to wait for. Defaults to 1.
 * @example await ticks(100) // Wait for 100 ticks in the event loop.
 */
export async function ticks(ticks = 1) {
  for (let index = 0; index < ticks; index++)
    await new Promise(nextTick)
}

/** c8 ignore next */
if (import.meta.vitest) {
  const createTickCounter = () => {
    let stop = false
    let counter = 0
    const start = async() => {
      // eslint-disable-next-line no-unmodified-loop-condition
      while (!stop) { await new Promise(nextTick); counter++ }
    }
    start()
    return () => { stop = true; return counter }
  }

  it('should wait for a number of ticks', async() => {
    const getTicks = createTickCounter()
    await ticks(100)
    const ticksCount = getTicks()
    expect(ticksCount).toEqual(100)
  })

  it('should wait for one tick by default', async() => {
    const getTicks = createTickCounter()
    await ticks()
    const ticksCount = getTicks()
    expect(ticksCount).toEqual(1)
  })
}
