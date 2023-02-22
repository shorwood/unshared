# Magic

### File type detection

```ts
/**
 * Infer the type of the file from its magic headers
 *
 * @param source The source file
 * @returns The type of the file
 * @example
 * magicHeader(fileBuffer) // "image/png"
 */
function getMagicHeader(source: BinaryLike): string
function setMagicHeader(source: BinaryLike, header: BinaryLike): void
function getMimeType(source: BinaryLike): string
function setMimeType(source: BinaryLike, mime: string): void
function getEncoding(source: BinaryLike): string
function setEncoding(source: BinaryLike, encoding: string): void
function getCharset(source: BinaryLike): string
function setCharset(source: BinaryLike, charset: string): void
```
