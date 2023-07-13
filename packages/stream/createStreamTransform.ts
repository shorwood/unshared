import { Readable, Transform } from 'node:stream'

/**
 * Wrap a function that takes a stream and some options and returns a Transform stream.
 *
 * @param fn The function to wrap.
 * @param options The options to pass to the function.
 * @returns The Transform stream.
 * @example createStreamTransform(streamDecompress, { encoding: 'utf8' })
 */
export function createStreamTransform<T extends object>(fn: (string: Readable, options?: T) => Transform): Transform {
  return new Transform({
    transform(chunk, encoding, callback) {
      this.push(chunk)
      callback()
    },
  })
}
