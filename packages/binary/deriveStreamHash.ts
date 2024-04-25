import { Hash, HashOptions, createHash } from 'node:crypto'
import { Awaitable } from '@unshared/functions/awaitable'
import { Derive, deriveStream } from './deriveStream'

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

/* v8 ignore next */
if (import.meta.vitest) {
  const { Readable } = await import('node:stream')

  test('should not consume the stream chunks', async() => {
    const stream = Readable.from('Hello, world!')
    const checksum = deriveStreamHash('sha256')
    void stream.pipe(checksum)
    const chunks = await checksum.toArray()
    const buffer = Buffer.concat(chunks).toString('utf8')
    expect(buffer).toBe('Hello, world!')
  })

  test('should derive the SHA-256 checksum from the stream chunks', async() => {
    const stream = Readable.from('Hello, world!')
    const checksum = deriveStreamHash('sha256')
    void stream.pipe(checksum)
    const sha256 = await checksum.then(hash => hash.digest('hex'))
    expect(sha256).toBe('315f5bdb76d078c43b8ac0064e4a0164612b1fce77c869345bfc94c75894edd3')
  })
}
