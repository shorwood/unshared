import type { Awaitable } from '@unshared/functions/awaitable'
import type { Hash, HashOptions } from 'node:crypto'
import type { Derive } from './deriveStream'
import { createHash } from 'node:crypto'
import { deriveStream } from './deriveStream'

/**
 * Computes the hash of a stream of bytes without consuming the stream. This
 * function will intercept the chunks read from subsequent calls to `read()`,
 * update the hash with the chunk, and then pass the chunks back into the stream.
 *
 * This function returns an `Awaitable` value, which means that the synchronous
 * value is the `Derive` stream itself, and the asynchronous value is the final
 * `Hash` object once the stream has been consumed by an external stream.
 *
 * @param algorithm The algorithm to use.
 * @param options The options to use.
 * @returns A resolvable stream that resolves to the hash of the stream.
 * @example
 * // Pipe the `request.body` to a file.
 * const writeStream = fs.createWriteStream('file.copy.txt')
 * const checksum = await deriveStreamHash('sha256')
 * request.body.pipe(checksum).pipe(writeStream)
 *
 * // Once the hash has been computed, store it in a file.
 * await checksum // Hash { ... }
 * await writeFileSync('file.sha256.txt', checksum.digest('hex'))
 */
export function deriveStreamHash(algorithm: string, options?: HashOptions): Awaitable<Derive, Hash> {
  const hash = createHash(algorithm, options)
  return deriveStream(({ chunk }) => { hash.update(chunk); return hash }, hash)
}
