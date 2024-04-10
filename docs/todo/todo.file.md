# Magic

### File type detection

```ts
function getMagicHeader(mime: MimeType): string
function getMimeType(header: MagicHeader): string
function getEncoding(source: BinaryLike): string
function getCharset(source: BinaryLike): string
```
