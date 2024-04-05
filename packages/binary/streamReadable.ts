import { Readable } from "node:stream"

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
export function streamReadable(stream: Readable, options: StreamReadableOptions = {}): Promise<void> {
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
    stream.once('error', reject)
    stream.once('readable', resolve)
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  const { PassThrough } = await import('node:stream')
  const { nextTick } = await import('node:process')

  it('should resolve if the stream is readable', async() => {
    const stream = Readable.from('Hello')
    await streamReadable(stream)
  })

  it('should reject if the stream has been destroyed', async() => {
    const stream = new Readable()
    stream.destroy()
    const shouldReject = streamReadable(stream)
    await expect(shouldReject).rejects.toThrow('Cannot read the stream: The stream has been destroyed.')
  })

  it('should reject if the stream has ended', async() => {
    const stream = new Readable()
    stream.push(null)
    stream.read()
    await new Promise(nextTick)
    const shouldReject = streamReadable(stream)
    await expect(shouldReject).rejects.toThrow('Cannot read the stream: The stream has ended.')
  })

  it('should reject if the timeout has exceeded', async() => {
    const stream = new PassThrough()
    const shouldReject = streamReadable(stream, { timeout: 50 })
    await expect(shouldReject).rejects.toThrow('Cannot read the stream: Timeout exceeded.')
  })

  it('should reject if an error occurs', async() => {
    const stream = new PassThrough()
    const shouldReject = streamReadable(stream)
    stream.emit('error', new Error('Test'))
    await expect(shouldReject).rejects.toThrow('Test')
  })
}
