import type { Awaitable } from '@unshared/functions/awaitable'
import type { Derive } from './deriveStream'
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
export function deriveStreamLength(): Awaitable<Derive, number> {
  return deriveStream(({ chunk, value }) => value + chunk.length, 0)
}
