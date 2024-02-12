# String

### Security

```ts
/**
 * Compute the entropy of a string using Dropbox's `zxcvbn` algorithm
 *
 * @param string The string to compute the entropy of a string
 * @param options
 * @returns The entropy of the string
 * @example
 * entropy("password") // 4.700439718141092
 * @see https://github.com/dropbox/zxcvbn
 */
function entropy(string: string, options?: EntropyOptions): number
function complexity(string: string, options?: ComplexityOptions): number
```

### Parsing data

```ts
/**
 * Parse a string as a boolean
 *
 * @param string The string to parse
 * @returns The parsed boolean
 * @example
 * parseBoolean("true") // true
 */
function parseBoolean(string: string): boolean
function parseNumber(string: string): number
function parseBigInt(string: string): bigint
function parseDate(string: string): Date
function parseJson(string: string): any
function parseXml(string: string): any
function parseYaml(string: string): any
function parseToml(string: string): any
function parseCsv(string: string): any
function parseTsv(string: string): any
function parseIni(string: string): any
function parseProperties(string: string): any
function parseEnvironment(string: string): any
function parse(string: string, options?: ParseOptions): any
```

```ts
/**
 * Stringify an object to a JSON string
 *
 * @param object The object to stringify
 * @returns The JSON string
 */
function stringifyBoolean(object: boolean): string
function stringifyNumber(object: number): string
function stringifyBigInt(object: bigint): string
function stringifyDate(object: Date): string
function stringifyJson(object: any): string
function stringifyXml(object: any): string
function stringifyYaml(object: any): string
function stringifyToml(object: any): string
function stringifyCsv(object: any): string
function stringifyTsv(object: any): string
function stringifyIni(object: any): string
function stringifyProperties(object: any): string
function stringifyEnvironment(object: any): string
function stringify(object: any, options?: StringifyOptions): string
```

### Encoding

```ts
/**
 * Encode a string to base64
 *
 * @param string The string to encode
 * @param encoding
 * @returns The base64 encoded string
 * @example
 * base64Encode("hello") // "aGVsbG8="
 */
function encodeBase64(string: Buffer | string, encoding?: BufferEncoding): string
function encodeBase32(string: Buffer | string, encoding?: BufferEncoding): string
function encodeBase16(string: Buffer | string, encoding?: BufferEncoding): string
function encodeBase85(string: Buffer | string, encoding?: BufferEncoding): string
function encodeHex(string: Buffer | string, encoding?: BufferEncoding): string
function encodeBinary(string: Buffer | string, encoding?: BufferEncoding): string
function encodeOctal(string: Buffer | string, encoding?: BufferEncoding): string
function encodeASCII(string: Buffer | string, encoding?: BufferEncoding): string
function encodeUTF8(string: Buffer | string, encoding?: BufferEncoding): string
```

### Decoding

```ts
/**
 * Decode a base64 encoded string
 *
 * @param string The base64 encoded string to decode
 * @param encoding
 * @returns The decoded string
 * @example
 * base64Decode("aGVsbG8=") // "hello"
 */
function decodeBase64(string: string, encoding?: BufferEncoding): Buffer
function decodeBase32(string: string, encoding?: BufferEncoding): Buffer
function decodeBase16(string: string, encoding?: BufferEncoding): Buffer
function decodeBase85(string: string, encoding?: BufferEncoding): Buffer
function decodeHex(string: string, encoding?: BufferEncoding): Buffer
function decodeBinary(string: string, encoding?: BufferEncoding): Buffer
function decodeOctal(string: string, encoding?: BufferEncoding): Buffer
function decodeASCII(string: string, encoding?: BufferEncoding): Buffer
function decodeUTF8(string: string, encoding?: BufferEncoding): Buffer
```

### Transforming

```ts
function truncate(string: string, length: number, options?: TruncateOptions): string
```

### Diffing

```ts
/**
 * Diff two strings using the Myers algorithm (just like the `diff` command)
 *
 * @param a The first string
 * @param b The second string
 * @param options The options
 * @returns The diff between the two strings.as a string
 * @example
 * diff("hello", "hi") // "h-ello\n+hi"
 */
function diff(a: string, b: string, options?: DiffOptions): string
function diffApply(string: string, diff: string, options?: DiffApplyOptions): string
function diffRollback(string: string, diff: string, options?: DiffRollbackOptions): string
```
