import { randomBytes } from 'node:crypto'

/* c8 ignore next */
if (import.meta.vitest) {
  it('should fork a stream into two copies', async() => {
    const buffer = randomBytes(2048)
    const stream = new WritableStream()
    const [stream1, stream2] = streamFork(stream)
    stream.getWriter().write(buffer)
  })
}

/**
 * Forks a stream into a copy of itself.
 *
 * @param stream The stream to fork.
 * @returns Two streams that are copies of each other.
 */
export function streamFork(stream: ReadableStream): [ReadableStream, ReadableStream] {}
