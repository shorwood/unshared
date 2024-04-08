import { randomBytes } from 'node:crypto'
import { Duplex, PassThrough, Readable, Transform } from 'node:stream'
import { sleep } from '@unshared/functions'
import { Tuple } from '@unshared/types'

/* c8 ignore next */
// if (import.meta.vitest) {
//   it('should fork a stream into two copies', async() => {
//     const buffer = randomBytes(2048)
//     const stream = new WritableStream()
//     const [stream1, stream2] = streamFork(stream, 2)
//     stream.getWriter().write(buffer)
//   })
// }

export class Fork<N extends number> extends Transform {
  constructor(public count: number) {
    super()
    this.streams = Array.from({ length: count }, () => new PassThrough({ writableCorked: 1 })) as Tuple<N, PassThrough>

    for (const stream of this.streams)
      this.pipe(stream)
  }

  /** The streams to fork into. */
  streams: Tuple<N, PassThrough>

  override _transform(chunk: Buffer | string, encoding: BufferEncoding, callback: (error?: Error | null, data?: any) => void) {
    console.log('chunk', chunk)
    for (const stream of this.streams)
      stream.write(chunk, encoding, callback)
  }
}

/**
 * Forks a stream into a copy of itself.
 *
 * @param stream The stream to fork.
 * @param count The number of copies to create.
 * @returns Two streams that are copies of each other.
 */
export function createStreamFork<N extends number>(stream: Readable, count: N): Tuple<N, Readable> {
  const fork = new Fork(count)
  stream.pipe(fork)
  return fork.streams
}

/** c8 ignore next */
if (import.meta.vitest) {
  const { streamRead } = await import('./streamRead')

  it('should fork a stream into two copies', async() => {
    const buffer = randomBytes(16)
    const stream = new PassThrough()
    const [stream1, stream2, stream3] = createStreamFork(stream, 3)
    stream.write(buffer)
    stream.end()

    const b1Chunks = []
    for await (const chunk of stream1) b1Chunks.push(chunk)
    const b1 = Buffer.concat(b1Chunks).toString('hex')

    const b2Chunks = []
    for await (const chunk of stream2) b2Chunks.push(chunk)
    const b2 = Buffer.concat(b2Chunks).toString('hex')

    await sleep(50)

    const b3Chunks = []
    for await (const chunk of stream3) b3Chunks.push(chunk)
    const b3 = Buffer.concat(b3Chunks).toString('hex')

    console.log({ b1, b2, b3 })
  })
}


