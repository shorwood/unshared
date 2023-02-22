# Stream

### Stream management

```ts
/**
 * Cast a value to a `Readable` stream.
 *
 * @param value The value to cast
 * @param options
 * @returns The value as a stream
 */
function toStream(value: BinaryLike, options?: ToStreamOptions): Readable
function streamConcat(...streams: BinaryLike[]): Readable
function streamSplit(stream: BinaryLike, options?: StreamSplitOptions): Readable
function streamFork(stream: BinaryLike, options?: StreamForkOptions): [Readable, Readable]
function streamDump(stream: BinaryLike, options?: StreamDumpOptions): Promise<Buffer | string>
function pipelineTry(...streams: BinaryLike[]): Readable
```

### Stream analysis

```ts
/**
 * Get the size of a stream
 *
 * @param stream The stream to get the size of
 * @returns The size of the stream
 * @example
 * const readStream = createReadStream('/path/to/file')
 * await streamSize(readStream) // 1234w
 */
function streamSize(stream: BinaryLike): Promise<number>
function streamChecksum(stream: BinaryLike, options?: StreamChecksumOptions): Promise<string>
function streamSeek(stream: BinaryLike, options?: StreamSeekOptions): Promise<Buffer>
function streamPeek(stream: BinaryLike, options?: StreamPeekOptions): Promise<Buffer>
```

### Stream queue

```ts
/**
 * Create a stream queue
 *
 * @param options The options to use
 * @returns The stream queue
 * @example
 * const queue = createStreamQueue()
 * queue.add(createReadStream('/path/to/file'))
 * queue.add(createReadStream('/path/to/other/file'))
 * queue.pipe(createWriteStream('/path/to/archive.tar'))
 * queue.on('end', () => console.log('Done!'))
 */
function createStreamQueue<T>(options?: StreamQueueOptions): StreamQueue<T>
```

### Stream transform

```ts
/**
 * Transform a stream
 *
 * @param stream The stream to transform
 * @param transform The transform function
 * @param options The options to use
 * @returns The transformed stream
 * @example
 * const readStream = createReadStream('/path/to/file')
 * const writeStream = createWriteStream('/path/to/other/file')
 * const transform = (chunk: Buffer) => chunk.toString().toUpperCase()
 * const transformer = createStreamTransform(transform)
 * readStream.pipe(transformer).pipe(writeStream)
 */
function createStreamTransform(transform: TransformFunction, options?: StreamTransformOptions): Readable
```
