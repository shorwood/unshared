### Hashing

```ts
/**
 * Hash a string using the SHA-1 algorithm
 *
 * @param string The string to hash
 * @param encoding
 * @returns The hashed string
 * @example
 * hashSHA1("hello") // "aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d"
 */
function hashSHA1(string: Buffer | string, encoding?: BufferEncoding): string
function hashSHA256(string: Buffer | string, encoding?: BufferEncoding): string
function hashSHA512(string: Buffer | string, encoding?: BufferEncoding): string
function hashMD5(string: Buffer | string, encoding?: BufferEncoding): string
function hash(algorithm: string, string: Buffer | string, encoding?: BufferEncoding): string
```

### Encryption

```ts
/**
 * Encrypt a string using AES-256-CBC
 *
 * @param string The string to encrypt
 * @param options The options to use for encryption
 * @returns The encrypted string
 * @example
 */
function encryptAES256CBC(string: Buffer | string, options: EncryptOptions): string
function encryptAES256GCM(string: Buffer | string, options: EncryptOptions): string
function encryptAES192CBC(string: Buffer | string, options: EncryptOptions): string
function encryptAES192GCM(string: Buffer | string, options: EncryptOptions): string
function encryptAES128CBC(string: Buffer | string, options: EncryptOptions): string
function encryptAES128GCM(string: Buffer | string, options: EncryptOptions): string
function encrypt(algorithm: string, string: Buffer | string, options: EncryptOptions): string
```

### Decryption

```ts
/**
 * Decrypt a string using AES-256-CBC
 *
 * @param string The string to decrypt
 * @param options The options to use for decryption
 * @returns The decrypted string
 * @example
 */
function decryptAES256CBC(string: Buffer | string, options: DecryptOptions): Buffer
function decryptAES256GCM(string: Buffer | string, options: DecryptOptions): Buffer
function decryptAES192CBC(string: Buffer | string, options: DecryptOptions): Buffer
function decryptAES192GCM(string: Buffer | string, options: DecryptOptions): Buffer
function decryptAES128CBC(string: Buffer | string, options: DecryptOptions): Buffer
function decryptAES128GCM(string: Buffer | string, options: DecryptOptions): Buffer
function decrypt(algorithm: string, string: Buffer | string, options: DecryptOptions): Buffer
```

### Compression

```ts
/**
 * Compress a string using the deflate algorithm
 *
 * @param string The string to compress
 * @param encoding
 * @returns The compressed string
 * @example
 * compressDeflate("hello") // "x\x9C\xCBH\xCD\xC9\xC9\x07\x00\x06\xB0\x02\x15"
 */
function compressDeflate(string: Buffer | string, encoding?: BufferEncoding): string
function compressGzip(string: Buffer | string, encoding?: BufferEncoding): string
function compressBrotli(string: Buffer | string, encoding?: BufferEncoding): string
function compressLZMA(string: Buffer | string, encoding?: BufferEncoding): string
function compressLZ4(string: Buffer | string, encoding?: BufferEncoding): string
function compress(algorithm: string, string: Buffer | string, encoding?: BufferEncoding): string
```

### Decompression

```ts
/**
 * Decompress a string using the deflate algorithm
 *
 * @param string The string to decompress
 * @param encoding
 * @returns The decompressed string
 * @example
 * decompressDeflate("x\x9C\xCBH\xCD\xC9\xC9\x07\x00\x06\xB0\x02\x15") // "hello"
 */
function decompressDeflate(string: Buffer | string, encoding?: BufferEncoding): Buffer
function decompressGzip(string: Buffer | string, encoding?: BufferEncoding): Buffer
function decompressBrotli(string: Buffer | string, encoding?: BufferEncoding): Buffer
function decompressLZMA(string: Buffer | string, encoding?: BufferEncoding): Buffer
function decompressLZ4(string: Buffer | string, encoding?: BufferEncoding): Buffer
function decompress(algorithm: string, string: Buffer | string, encoding?: BufferEncoding): Buffer
```

### Checksum

```ts
/**
 * Generate a checksum for a string
 *
 * @param string The string to generate a checksum for
 * @param encoding
 * @returns The checksum
 * @example
 * checksum("hello") // "5d41402abc4b2a76b9719d911017c592"
 */
function checksum(string: Buffer | string, encoding?: BufferEncoding): string
function adler32(string: Buffer | string, encoding?: BufferEncoding): string
function crc32(string: Buffer | string, encoding?: BufferEncoding): string
function crc32c(string: Buffer | string, encoding?: BufferEncoding): string
function crc24(string: Buffer | string, encoding?: BufferEncoding): string
function crc16(string: Buffer | string, encoding?: BufferEncoding): string
function crc8(string: Buffer | string, encoding?: BufferEncoding): string
function crc(algorithm: string, string: Buffer | string, encoding?: BufferEncoding): string
```
