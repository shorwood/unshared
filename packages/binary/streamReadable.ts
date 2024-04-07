import { nextTick } from 'node:process'
import { Readable } from 'node:stream'

export interface StreamReadableOptions {
  /**
   * The timeout to wait for the stream to become readable. If the stream
   * does not become readable within the timeout, the promise will reject.
   *
   * @default Number.POSITIVE_INFINITY
   */
  timeout?: number
}

/**
 * Returns a promise that resolves once a stream is readable and rejects
 * if the stream is not readable or has already ended. This function is
 * useful for ensuring that a stream is in a valid state before piping
 * it to another stream or consuming it.
 *
 * @param stream The stream to check.
 * @param options The options to use.
 * @returns A promise that resolves if the stream is readable.
 * @example
 * // Stream is readable
 * const stream = fs.createReadStream('file.txt')
 * await streamReadable(stream) // Ok
 *
 * // Stream is not readable
 * const stream = fs.createReadStream('file.txt').close()
 * await streamReadable(stream) // Error
 */
export async function streamReadable(stream: Readable, options: StreamReadableOptions = {}): Promise<void> {
  await new Promise(nextTick)

  return new Promise((resolve, reject) => {
    // --- If the stream is destroyed, has ended or the timeout, (if any) has exceeded, reject the promise.
    if (stream.readableEnded) {
      const error = new Error('Cannot read the stream: The stream has ended.')
      return reject(error)
    }
    if (stream.destroyed) {
      const error = new Error('Cannot read the stream: The stream has been destroyed.')
      return reject(error)
    }
    if (options.timeout) {
      const error = new Error('Cannot read the stream: Timeout exceeded.')
      setTimeout(() => reject(error), options.timeout)
    }

    // --- Otherwise, await for either an error or readable event.
    stream.once('end', resolve)
    stream.once('pause', resolve)
    stream.once('error', reject)
    stream.once('readable', resolve)
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  const { PassThrough } = await import('node:stream')

  it('should resolve if the stream is readable', async() => {
    const stream = Readable.from('Hello')
    const result = streamReadable(stream)
    await expect(result).resolves.toBeUndefined()
  })

  it('should reject if the stream has been destroyed', async() => {
    const stream = new Readable()
    stream.destroy()
    const shouldReject = streamReadable(stream)
    await expect(shouldReject).rejects.toThrow('Cannot read the stream: The stream has been destroyed.')
  })

  it('should reject if the stream has ended', async() => {
    const stream = new Readable()
    // eslint-disable-next-line unicorn/no-null
    stream.push(null)
    stream.read()
    const shouldReject = streamReadable(stream)
    await expect(shouldReject).rejects.toThrow('Cannot read the stream: The stream has ended.')
  })

  it('should reject if the timeout has exceeded', async() => {
    const stream = new PassThrough()
    const shouldReject = streamReadable(stream, { timeout: 1 })
    await expect(shouldReject).rejects.toThrow('Cannot read the stream: Timeout exceeded.')
  })
}
