import { createHash } from 'node:crypto'
import { Transform } from 'node:stream'
import { Awaitable } from '@unshared/functions/awaitable'
import { deriveStream } from './deriveStream'

/**
 * Computes the length of a stream of bytes without consuming the stream. This
 * function will intercept the chunks read from subsequent calls to `read()`,
 * update the total length with the chunk, and then pass the chunks back into
 * the stream.
 *
 * This function returns an `Awaitable` value, which means that the synchronous
 * value is the `Derive` stream itself, and the asynchronous value is the final
 * length once the stream has been consumed by an external consumer.
 *
 * @returns A resolvable stream that resolves to the length of the stream.
 * @example
 * // Store the request body in an S3 bucket.
 * const length = await deriveStreamLength()
 * await s3.upload({ Body: request.body })
 * 
 * // Once the length has been computed, print it to the console.
 * console.log(`Uploaded ${length} bytes`)
 */
export function deriveStreamLength(): Awaitable<Transform, number> {
  return deriveStream(({ chunk, value }) => value + chunk.length, 0)
}

/* c8 ignore next */
if (import.meta.vitest) {
  const valueUtf8 = 'Hello, world!'
  const valueBuffer = Buffer.from(valueUtf8, 'utf8')
  const valueSha256 = createHash('sha256').update(valueBuffer).digest('hex')
  const { Readable } = await import('node:stream')
  const { streamRead } = await import('./streamRead')

  it('should not consume the stream chunks', async() => {
    const stream = Readable.from(valueBuffer)
    const length = deriveStreamLength()
    stream.pipe(length)
    const buffer = await streamRead(length, 'utf8')
    expect(buffer).toEqual(valueUtf8)
  })

  it('should derive the length from the stream chunks', async() => {
    const stream = Readable.from(valueBuffer)
    const length = deriveStreamLength()
    stream.pipe(length)
    expect(length).resolves.toEqual(13)
  })
}
