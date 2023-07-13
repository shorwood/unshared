# Stream
### Stream analysis

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
