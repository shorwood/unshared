# Archives

### `createArchive`: Creates an archive
```ts
/**
 * Creates a tar archive from a directory or memory stream/buffer
 *
 * @param source The source directory or stream/buffer
 * @param sources
 * @param options The options to use
 * @returns The tar archive as a readable stream
 * @example
 * const readStream = createReadStream('/path/to/file')
 * const writeStream = createWriteStream('/path/to/archive.zip')
 * const archive = createTar({ "file.txt": readStream })
 * archive.pipe(writeStream)
 */
function createTar(sources: Collection<BinaryLike>, options?: CreateTarOptions): Readable
function createZip(sources: Collection<BinaryLike>, options?: CreateTarOptions): Readable
function createRar(sources: Collection<BinaryLike>, options?: CreateTarOptions): Readable
function create7z(sources: Collection<BinaryLike>, options?: CreateTarOptions): Readable
function createArchive(sources: Collection<BinaryLike>, options?: CreateTarOptions): Readable
```

### `extractArchive`: Extracts an archive
```ts
/**
 * Extracts a tar archive and return a map of files
 *
 * @param source The source archive
 * @param options The options
 * @returns A promise that resolves to a map of files
 * @example
 * const readStream = createReadStream('/path/to/archive.tar')
 * const archive = await extractTar(readStream)
 * for (const file of archive) await writeFile(file.path, file.content)
 */
function extractTar(source: BinaryLike, options?: ExtractTarOptions): Awaitabale<Iterator<TarEntry>, ExtractTarReturnType>
function extractZip(source: BinaryLike, options?: ExtractZipOptions): Promise<ExtractZipReturnType>
function extractRar(source: BinaryLike, options?: ExtractRarOptions): Promise<ExtractRarReturnType>
function extract7z(source: BinaryLike, options?: Extract7zOptions): Promise<Extract7zReturnType>
function extractArchive(source: BinaryLike, options?: ExtractTarOptions): Promise<ExtractTarReturnType>
```

### 