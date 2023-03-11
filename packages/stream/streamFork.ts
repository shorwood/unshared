import { Stream } from 'node:stream'

/**
 * Forks a stream into a copy of itself.
 *
 * @param stream The stream to fork.
 * @returns Two streams that are copies of each other.
 */
export function streamFork(stream: Stream): [Stream, Stream] {
  const { PassThrough } = require('node:stream') as typeof import('node:stream')
  const [stream1, stream2] = [new PassThrough(), new PassThrough()]
  stream.pipe(stream1)
  stream.pipe(stream2)
  return [stream1, stream2]
}
