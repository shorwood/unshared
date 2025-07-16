/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable jsdoc/check-indentation */
export enum HttpHeader {

  /**
   * The HTTP **`Accept-CH`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) may be set by a server to specify which [client hint](/en-US/docs/Web/HTTP/Guides/Client_hints) headers should be included by the client in subsequent requests.
   * To ensure client hints are sent reliably, the `Accept-CH` header should be persisted for all secure requests.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Accept-CH: <client-hints-headers>
   *
   * // Client hint headers in a comma-separated list
   * Accept-CH: <ch-header-one>, <ch-header-two>
   * ```
   *
   * ## Examples
   *
   * ### Client hint response headers
   *
   * The following response headers indicate that the server accepts `Viewport-Width` and `Width` [device client hints](/en-US/docs/Web/HTTP/Guides/Client_hints#device_client_hints) in subsequent requests.
   * The [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) header indicates which values were used to [vary the response](/en-US/docs/Web/HTTP/Guides/Client_hints#caching_and_client_hints) based on the accepted client hints.
   *
   * ```http
   * Accept-CH: Viewport-Width, Width
   * Vary: Viewport-Width, Width
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary)
   */
  'Accept-CH' = 'Accept-CH',

  /**
   * The HTTP **`Accept-Encoding`** [request](https://developer.mozilla.org/en-US/docs/glossary/request_header) and [response header](https://developer.mozilla.org/en-US/docs/glossary/response_header) indicates the content encoding (usually a compression algorithm) that the sender can understand.
   * In requests, the server uses [content negotiation](/en-US/docs/Web/HTTP/Guides/Content_negotiation) to select one of the encoding proposals from the client and informs the client of that choice with the [Content-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding) response header.
   * In responses, it provides information about which content encodings the server can understand in messages to the requested resource, so that the encoding can be used in subsequent requests to the resource.
   * For example, `Accept-Encoding` is included in a [415 Unsupported Media Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/415) response if a request to a resource (e.g., [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/PUT)) used an unsupported encoding.
   *
   * Even if both the client and the server support the same compression algorithms, the server may choose not to compress the body of a response if the `identity` value is also acceptable.
   * This happens in two common cases:
   *
   * 1. The data is already compressed, meaning a second round of compression will not reduce the transmitted data size, and may actually increase the size of the content in some cases.
   *    This is true for pre-compressed image formats (JPEG, for instance).
   * 2. The server is overloaded and cannot allocate computing resources to perform the compression. For example, Microsoft recommends not to compress if a server uses more than 80% of its computational power.
   *
   * As long as the `identity;q=0` or `*;q=0` directives do not explicitly forbid the `identity` value that means no encoding, the server must never return a [406 Not Acceptable](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/406) error.
   *
   * > [!NOTE]
   * > IANA maintains [a list of official content encodings](https://www.iana.org/assignments/http-parameters/http-parameters.xhtml#content-coding).
   * > The `bzip` and `bzip2` encodings are non-standard, but may be used in some cases, particularly for legacy support.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Accept-Encoding: gzip
   * Accept-Encoding: compress
   * Accept-Encoding: deflate
   * Accept-Encoding: br
   * Accept-Encoding: zstd
   * Accept-Encoding: dcb
   * Accept-Encoding: dcz
   * Accept-Encoding: identity
   * Accept-Encoding: *
   *
   * // Multiple algorithms, weighted with the quality value syntax:
   * Accept-Encoding: deflate, gzip;q=1.0, *;q=0.5
   * ```
   *
   * ## Directives
   *
   * - `gzip`
   *   - : A compression format that uses the [Lempel-Ziv coding](https://en.wikipedia.org/wiki/LZ77_and_LZ78#LZ77) (LZ77) with a 32-bit CRC.
   * - `compress`
   *   - : A compression format that uses the [Lempel-Ziv-Welch](https://en.wikipedia.org/wiki/LZW) (LZW) algorithm.
   * - `deflate`
   *   - : A compression format that uses the [zlib](https://en.wikipedia.org/wiki/Zlib) structure with the [_deflate_](https://en.wikipedia.org/wiki/DEFLATE) compression algorithm.
   * - `br`
   *   - : A compression format that uses the [Brotli](https://en.wikipedia.org/wiki/Brotli) algorithm.
   * - `zstd`
   *   - : A compression format that uses the [Zstandard](https://en.wikipedia.org/wiki/Zstd) algorithm.
   * - `dcb`
   *   - : A format that uses the [Dictionary-Compressed Brotli](https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-compression-dictionary#name-dictionary-compressed-brotl) algorithm. See [Compression Dictionary Transport](/en-US/docs/Web/HTTP/Guides/Compression_dictionary_transport).
   * - `dcz`
   *   - : A format that uses the [Dictionary-Compressed Zstandard](https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-compression-dictionary#name-dictionary-compressed-zstan) algorithm. See [Compression Dictionary Transport](/en-US/docs/Web/HTTP/Guides/Compression_dictionary_transport).
   * - `identity`
   *   - : Indicates the identity function (that is, without modification or compression). This value is always considered as acceptable, even if omitted.
   * - `*` (wildcard)
   *   - : Matches any content encoding not already listed in the header. This is the default value if the header is not present. This directive does not suggest that any algorithm is supported but indicates that no preference is expressed.
   * - `;q=` (qvalues weighting)
   *   - : Any value is placed in an order of preference expressed using a relative [quality value](/en-US/docs/Glossary/Quality_values) called _weight_.
   *
   * ## Examples
   *
   * ### Default Accept-Encoding values
   *
   * Browser navigation typically has the following `Accept-Encoding` request header value:
   *
   * ```http
   * GET /en-US/ HTTP/2
   * Host: developer.mozilla.org
   * Accept-Encoding: gzip, deflate, br, zstd
   * ```
   *
   * ### Weighted Accept-Encoding values
   *
   * The following header shows `Accept-Encoding` preferences using a quality value between `0` (lowest priority) and `1` (highest-priority).
   * Brotli compression is weighted at `1.0`, making `br` the client's first choice, followed by `gzip` at `0.8` priority, and then any other content encoding at `0.1`:
   *
   * ```http
   * Accept-Encoding: br;q=1.0, gzip;q=0.8, *;q=0.1
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [415 Unsupported Media Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/415)
   * - HTTP [content negotiation](/en-US/docs/Web/HTTP/Guides/Content_negotiation)
   * - A header with the result of the content negotiation: [Content-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding)
   * - Other similar headers: [TE](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/TE), [Accept](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept), [Accept-Language](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language)
   * - [Brotli compression](https://developer.mozilla.org/en-US/docs/Glossary/Brotli_compression)
   * - [GZip compression](https://developer.mozilla.org/en-US/docs/Glossary/GZip_compression)
   * - [Zstandard compression](https://developer.mozilla.org/en-US/docs/Glossary/Zstandard_compression)
   * - [Compression Dictionary Transport guide](/en-US/docs/Web/HTTP/Guides/Compression_dictionary_transport)
   */
  'Accept-Encoding' = 'Accept-Encoding',

  /**
   * The HTTP **`Accept-Language`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) indicates the natural language and locale that the client prefers.
   * The server uses [content negotiation](/en-US/docs/Web/HTTP/Guides/Content_negotiation) to select one of the proposals and informs the client of the choice with the [Content-Language](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Language) response header.
   * Browsers set required values for this header according to their active user interface language.
   * Users can also configure additional preferred languages through browser settings.
   *
   * The `Accept-Language` header generally lists the same locales as the [navigator.languages](https://developer.mozilla.org/en-US/docs/domxref/navigator.languages) property, with decreasing `q` values ([quality values](/en-US/docs/Glossary/Quality_values)). Some browsers, like Chrome and Safari, add language-only fallback tags in `Accept-Language`. For example, `en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7` when `navigator.languages` is `["en-US", "zh-CN"]`. For privacy purposes (reducing [fingerprinting](https://developer.mozilla.org/en-US/docs/Glossary/fingerprinting)), both `Accept-Language` and `navigator.languages` may not include the full list of user preferences. For example, in Safari (always) and Chrome's incognito mode, only one language is listed.
   *
   * This header serves as a hint when the server cannot determine the target content language otherwise (for example, use a specific URL that depends on an explicit user decision).
   * The server should never override an explicit user language choice. The content of `Accept-Language` is often out of a user's control (when traveling, for instance).
   * A user may also want to visit a page in a language different from the user interface language.
   *
   * The server may send back a [406 Not Acceptable](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/406) error code when unable to serve content in a matching language, but this is rarely implemented.
   * Servers often ignore the `Accept-Language` header in such cases and send a successful response with the most appropriate resource instead for a better user experience.
   *
   *
   *
   * \* Values can only be `0-9`, `A-Z`, `a-z`, space, or the characters `*,-.;=`.
   *
   * ## Syntax
   *
   * ```http
   * Accept-Language: <language>
   * Accept-Language: *
   *
   * // Multiple types, weighted with the quality value syntax:
   * Accept-Language: fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5
   * ```
   *
   * ## Directives
   *
   * - `<language>`
   *   - : A language tag (which is sometimes referred to as a "locale identifier").
   *     This consists of a 2-3 letter base language tag that indicates a language, optionally followed by additional subtags separated by `-`.
   *     The most common extra information is the country or region variant (like `en-US` or `fr-CA`) or the type of alphabet to use (like `sr-Latn`).
   *     Other variants, like the type of orthography (`de-DE-1996`), are usually not used in the context of this header.
   * - `*` (wildcard)
   *   - : Any language not matched by any other language present in the `Accept-Language` field.
   * - `;q=` (q-factor weighting)
   *   - : Any value placed in an order of preference expressed using a relative [quality value](https://developer.mozilla.org/en-US/docs/Glossary/Quality_values) called _weight_.
   *     The quality value defaults to `1`.
   *
   * ## Examples
   *
   * ### Using Accept-Language headers
   *
   * The following request has a preference for German using the `de` base language:
   *
   * ```http
   * Accept-Language: de
   * ```
   *
   * ### Using quality values in Accept-Language
   *
   * The following request indicates a stronger preference for Danish, but accepts British English and other types of English at a lower priority:
   *
   * ```http
   * Accept-Language: da, en-gb;q=0.8, en;q=0.7
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - HTTP [content negotiation](/en-US/docs/Web/HTTP/Guides/Content_negotiation)
   * - A header with the result of the content negotiation: [Content-Language](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Language)
   * - Other similar headers: [TE](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/TE), [Accept-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding), [Accept](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept)
   */
  'Accept-Language' = 'Accept-Language',

  /**
   * The HTTP **`Accept-Patch`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) advertises which [media types](/en-US/docs/Web/HTTP/Guides/MIME_types) the server is able to understand in a [PATCH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/PATCH) request.
   * For example, a server receiving a `PATCH` request with an unsupported media type could reply with [415 Unsupported Media Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/415) and an `Accept-Patch` header referencing one or more supported media types.
   *
   * The header should appear in [OPTIONS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/OPTIONS) requests to a resource that supports the `PATCH` method.
   * An `Accept-Patch` header in a response to any request method implicitly means that a `PATCH` is allowed on the target resource in the request.
   *
   * > [!NOTE]
   * > IANA maintains [a list of official content encodings](https://www.iana.org/assignments/http-parameters/http-parameters.xhtml#content-coding).
   * > The `bzip` and `bzip2` encodings are non-standard but may be used in some cases, particularly for legacy support.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Accept-Patch: <media-type>/<subtype>
   * Accept-Patch: <media-type>/*
   * Accept-Patch: * /*
   *
   * // Comma-separated list of media types
   * Accept-Patch: <media-type>/<subtype>, <media-type>/<subtype>
   * ```
   *
   * ## Directives
   *
   * - `<media-type>/<subtype>`
   *   - : A single, precise [media type](/en-US/docs/Web/HTTP/Guides/MIME_types), like `text/html`.
   * - `<media-type>/*`
   *   - : A media type without a subtype.
   *     For example, `image/*` corresponds to `image/png`, `image/svg`, `image/gif`, and other image types.
   * - `* /*`
   *   - : Any media type.
   *
   * ## Examples
   *
   * ```http
   * Accept-Patch: application/json
   * Accept-Patch: application/json, text/plain
   * Accept-Patch: text/plain;charset=utf-8
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * Browser compatibility is not relevant for this header.
   * The server sends the header, and the specification doesn't define client behavior.
   *
   * ## See also
   *
   * - [Accept-Post](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Post)
   * - [415 Unsupported Media Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/415)
   * - [PATCH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/PATCH) request method
   */
  'Accept-Patch' = 'Accept-Patch',

  /**
   * The HTTP **`Accept-Post`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) advertises which [media types](/en-US/docs/Web/HTTP/Guides/MIME_types) are accepted by the server in a [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/POST) request.
   * For example, a server receiving a `POST` request with an unsupported media type could reply with [415 Unsupported Media Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/415) and an `Accept-Post` header referencing one or more supported media types.
   *
   * The header should appear in [OPTIONS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/OPTIONS) requests to a resource that supports the `POST` method.
   * An `Accept-Post` header in a response to any request method implicitly means that a `POST` is allowed on the target resource in the request.
   *
   * > [!NOTE]
   * > IANA maintains [a list of official content encodings](https://www.iana.org/assignments/http-parameters/http-parameters.xhtml#content-coding).
   * > The `bzip` and `bzip2` encodings are non-standard but may be used in some cases, particularly for legacy support.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Accept-Post: <media-type>/<subtype>
   * Accept-Post: <media-type>/*
   * Accept-Post: * /*
   *
   * // Comma-separated list of media types
   * Accept-Post: <media-type>/<subtype>, <media-type>/<subtype>
   * ```
   *
   * > [!NOTE]
   * > The `Accept-Post` header specifies a media range in the same way as [Accept](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept), except that it has no notion of preference via `q` ([quality values](https://developer.mozilla.org/en-US/docs/Glossary/quality_values)) arguments.
   * > This is because `Accept-Post` is a response header while `Accept` is a request header.
   *
   * ## Directives
   *
   * - `<media-type>/<subtype>`
   *   - : A single, precise [media type](/en-US/docs/Web/HTTP/Guides/MIME_types), like `text/html`.
   * - `<media-type>/*`
   *   - : A media type without a subtype.
   *     For example, `image/*` corresponds to `image/png`, `image/svg`, `image/gif`, and other image types.
   * - `* /*`
   *   - : Any media type.
   *
   * ## Examples
   *
   * ```http
   * Accept-Post: application/json, text/plain
   * Accept-Post: image/webp
   * Accept-Post: * /*
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * Browser compatibility is not relevant for this header.
   * The header is sent by the server and the specification does not define client behavior.
   *
   * ## See also
   *
   * - [Accept-Patch](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Patch)
   * - [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/POST) request method
   */
  'Accept-Post' = 'Accept-Post',

  /**
   * The HTTP **`Accept-Ranges`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) is used by the server to advertise its support for [range requests](/en-US/docs/Web/HTTP/Guides/Range_requests), allowing clients to request part or several parts of a resource.
   * The value of this header indicates the unit that can be used to define a range.
   *
   * For example, a response with an `Accept-Ranges` header indicates that the server is capable of _resuming_ an interrupted download instead of a client restarting the transfer in full.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Accept-Ranges: <range-unit>
   * Accept-Ranges: none
   * ```
   *
   * ## Directives
   *
   * - `<range-unit>`
   *   - : The range unit that the server supports, although `bytes` is the only range unit formally defined by [7233](https://developer.mozilla.org/en-US/docs/RFC/7233).
   *     Range units are registered in the [HTTP Range Unit Registry](https://www.iana.org/assignments/http-parameters/http-parameters.xhtml#range-units).
   * - `none`
   *   - : No range unit is supported.
   *     This is equivalent to omitting the header and is, therefore, rarely used.
   *     This value was used in legacy browsers to disable or remove the pause buttons in the download manager if servers had no support for range requests.
   *
   * ## Examples
   *
   * ```http
   * Accept-Ranges: bytes
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [HTTP range requests](/en-US/docs/Web/HTTP/Guides/Range_requests) guide
   * - [HTTP conditional requests](/en-US/docs/Web/HTTP/Guides/Conditional_requests) guide
   * - [Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Range), [If-Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Range) request headers
   * - [IANA HTTP Range Unit Registry](https://www.iana.org/assignments/http-parameters/http-parameters.xhtml#range-units)
   */
  'Accept-Ranges' = 'Accept-Ranges',

  /**
   * The HTTP **`Accept`** [request](https://developer.mozilla.org/en-US/docs/Glossary/request_header) and [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) indicates which content types, expressed as [MIME types](/en-US/docs/Web/HTTP/Guides/MIME_types), the sender is able to understand.
   * In requests, the server uses [content negotiation](/en-US/docs/Web/HTTP/Guides/Content_negotiation) to select one of the proposals and informs the client of the choice with the [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) response header.
   * In responses, it provides information about which content types the server can understand in messages to the requested resource, so that the content type can be used in subsequent requests to the resource.
   *
   * Browsers set required values for this header based on the context of the request.
   * For example, a browser uses different values in a request when fetching a CSS stylesheet, image, video, or a script.
   *
   *
   *
   * \* Values can't contain [CORS-unsafe request header bytes](https://fetch.spec.whatwg.org/#cors-unsafe-request-header-byte), including `"():<>?@[\]{},`, Delete `0x7F`, and control characters `0x00` to `0x19`, except for Tab `0x09`.
   *
   * ## Syntax
   *
   * ```http
   * Accept: <media-type>/<MIME_subtype>
   * Accept: <media-type>/*
   * Accept: * /*
   *
   * // Multiple types, weighted with the quality value syntax
   * Accept: text/html, application/xhtml+xml, application/xml;q=0.9, image/webp, * /*;q=0.8
   * ```
   *
   * ## Directives
   *
   * - `<media-type>/<subtype>`
   *   - : A single, precise [media type](/en-US/docs/Web/HTTP/Guides/MIME_types), like `text/html`.
   * - `<media-type>/*`
   *   - : A media type without a subtype.
   *     For example, `image/*` corresponds to `image/png`, `image/svg`, `image/gif`, and other image types.
   * - `* /*`
   *   - : Any media type.
   * - `;q=` (q-factor weighting)
   *   - : A value in order of preference expressed using a relative [quality value](https://developer.mozilla.org/en-US/docs/Glossary/quality_values) called the _weight_.
   *
   * ## Examples
   *
   * ### Using default Accept request headers
   *
   * HTTP requests made using command line tools such as [curl](https://curl.se/) and [wget](https://www.gnu.org/software/wget/) use `* /*` as the default `Accept` value:
   *
   * ```http
   * GET / HTTP/1.1
   * Host: example.com
   * User-Agent: curl/8.7.1
   * Accept: * /*
   * ```
   *
   * Browser navigation typically has the following `Accept` request header value:
   *
   * ```http
   * GET /en-US/ HTTP/2
   * Host: developer.mozilla.org
   * Accept: text/html,application/xhtml+xml,application/xml;q=0.9,* /*;q=0.8
   * …
   * ```
   *
   * After receiving the document, the default `Accept` values in requests for images on the `developer.mozilla.org` example look like this:
   *
   * ```http
   * Accept: image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,* /*;q=0.5
   * ```
   *
   * ### Configuring Accept request headers for JSON responses
   *
   * Systems that involve API interaction commonly request `application/json` responses.
   * Here's an example of a [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) request where the client specifically requests a JSON response:
   *
   * ```http
   * GET /users/123 HTTP/1.1
   * Host: example.com
   * Authorization: Bearer abcd123
   * Accept: application/json
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - HTTP [content negotiation](/en-US/docs/Web/HTTP/Guides/Content_negotiation)
   * - [List of default Accept values](/en-US/docs/Web/HTTP/Guides/Content_negotiation/List_of_default_Accept_values)
   * - [CORS safelist request header restrictions](/en-US/docs/Glossary/CORS-safelisted_request_header#additional_restrictions)
   * - A header with the result of the content negotiation: [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type)
   * - Other similar headers: [TE](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/TE), [Accept-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding), [Accept-Language](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language)
   */
  'Accept' = 'Accept',

  /**
   * The HTTP **`Access-Control-Allow-Credentials`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) tells browsers whether the server allows credentials to be included in cross-origin HTTP requests.
   *
   * Credentials include cookies, [Transport Layer Security (TLS)](https://developer.mozilla.org/en-US/docs/glossary/TLS) client certificates, or authentication headers containing a username and password.
   * By default, these credentials are not sent in cross-origin requests, and doing so can make a site vulnerable to [Cross-Site Request Forgery (CSRF)](https://developer.mozilla.org/en-US/docs/Glossary/CSRF) attacks.
   *
   * A client can ask for credentials to be included in cross-site requests in several ways:
   *
   * - Using [fetch()](https://developer.mozilla.org/en-US/docs/domxref/Window/fetch), by setting the [`credentials`](/en-US/docs/Web/API/RequestInit#credentials) option to `"include"`.
   * - Using [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/domxref/XMLHttpRequest), by setting the [XMLHttpRequest.withCredentials](https://developer.mozilla.org/en-US/docs/domxref/XMLHttpRequest.withCredentials) property to `true`.
   * - Using [EventSource()](https://developer.mozilla.org/en-US/docs/domxref/EventSource()), by setting the [EventSource.withCredentials](https://developer.mozilla.org/en-US/docs/domxref/EventSource.withCredentials) property to `true`.
   *
   * When credentials are included:
   *
   * - For [preflighted](https://developer.mozilla.org/en-US/docs/glossary/Preflight_request) requests: The preflight request does not include credentials.
   *   If the server's response to the preflight request sets the `Access-Control-Allow-Credentials` header to `true`, then the real request will include credentials; otherwise, the browser reports a network error.
   * - For non-preflighted requests: The request will include credentials, and if the server's response does not set the `Access-Control-Allow-Credentials` header to `true`, the browser reports a network error.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Access-Control-Allow-Credentials: true
   * ```
   *
   * ## Directives
   *
   * - `true`
   *   - : The server allows credentials to be included in cross-origin HTTP requests.
   *     This is the only valid value for this header and is case-sensitive.
   *     If you don't need credentials, omit this header entirely rather than setting its value to `false`.
   *
   * ## Examples
   *
   * Allow credentials:
   *
   * ```http
   * Access-Control-Allow-Credentials: true
   * ```
   *
   * Using [fetch()](https://developer.mozilla.org/en-US/docs/domxref/Window/fetch) with credentials:
   *
   * ```js
   * fetch(url, {
   *   credentials: "include",
   * });
   * ```
   *
   * Using [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/domxref/XMLHttpRequest) with credentials:
   *
   * ```js
   * const xhr = new XMLHttpRequest();
   * xhr.open("GET", "http://example.com/", true);
   * xhr.withCredentials = true;
   * xhr.send(null);
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [XMLHttpRequest.withCredentials](https://developer.mozilla.org/en-US/docs/domxref/XMLHttpRequest.withCredentials)
   * - [Request()](https://developer.mozilla.org/en-US/docs/domxref/Request.Request())
   */
  'Access-Control-Allow-Credentials' = 'Access-Control-Allow-Credentials',

  /**
   * The HTTP **`Access-Control-Allow-Headers`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) is used in response to a [preflight request](https://developer.mozilla.org/en-US/docs/Glossary/preflight_request) to indicate the HTTP headers that can be used during the actual request.
   * This header is required if the preflight request contains [Access-Control-Request-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Request-Headers).
   *
   * > [!NOTE]
   * > The [CORS-safelisted request headers](https://developer.mozilla.org/en-US/docs/glossary/CORS-safelisted_request_header) are always allowed and usually aren't listed in `Access-Control-Allow-Headers` unless there is a need to circumvent the [additional safelist restrictions](/en-US/docs/Glossary/CORS-safelisted_request_header#additional_restrictions).
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Access-Control-Allow-Headers: <header-name>
   * Access-Control-Allow-Headers: <header-name>, <header-name>
   * Access-Control-Allow-Headers: *
   * ```
   *
   * ## Directives
   *
   * - `<header-name>`
   *   - : The name of a supported request header. The header may list any number of headers, separated by commas.
   * - `*` (wildcard)
   *   - : Any header.
   *     The value `*` only counts as a special wildcard value for requests without credentials (requests without [HTTP cookies](/en-US/docs/Web/HTTP/Guides/Cookies) or HTTP authentication information).
   *     In requests with credentials, it is treated as the literal header name `*` without special semantics.
   *     The [Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization) header doesn't accept wildcard and always needs to be listed explicitly.
   *
   * ## Examples
   *
   * ### Implementing a custom header
   *
   * Below is an example of an `Access-Control-Allow-Headers` header.
   * It indicates that a custom header named `X-Custom-Header` is supported by CORS requests to the server, in addition to the [CORS-safelisted request headers](https://developer.mozilla.org/en-US/docs/Glossary/CORS-safelisted_request_header).
   *
   * ```http
   * Access-Control-Allow-Headers: X-Custom-Header
   * ```
   *
   * ### Supporting multiple headers
   *
   * This example shows `Access-Control-Allow-Headers` when it specifies support for multiple headers.
   *
   * ```http
   * Access-Control-Allow-Headers: X-Custom-Header, Upgrade-Insecure-Requests
   * ```
   *
   * ### Bypassing additional restrictions on CORS-safelisted headers
   *
   * Although [CORS-safelisted request headers](https://developer.mozilla.org/en-US/docs/glossary/CORS-safelisted_request_header) are always allowed and don't usually need to be listed in `Access-Control-Allow-Headers`, listing them anyway will circumvent the [additional restrictions](/en-US/docs/Glossary/CORS-safelisted_request_header#additional_restrictions) that apply.
   *
   * ```http
   * Access-Control-Allow-Headers: Accept
   * ```
   *
   * ### Handling preflight requests
   *
   * Let's look at an example of a [preflight request](https://developer.mozilla.org/en-US/docs/glossary/preflight_request) involving `Access-Control-Allow-Headers`.
   *
   * #### Request
   *
   * First, the preflight request is an [OPTIONS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/OPTIONS) request that includes some combination of the three preflight request headers: [Access-Control-Request-Method](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Request-Method), [Access-Control-Request-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Request-Headers), and [Origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin).
   *
   * The preflight request below tells the server that we want to send a CORS `GET` request with the headers listed in [Access-Control-Request-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Request-Headers) ([Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) and `X-Requested-With`).
   *
   * ```http
   * OPTIONS /resource/foo
   * Access-Control-Request-Method: GET
   * Access-Control-Request-Headers: content-type,x-requested-with
   * Origin: https://foo.bar.org
   * ```
   *
   * #### Response
   *
   * If the CORS request indicated by the preflight request is authorized, the server will respond to the preflight request with a message that indicates the allowed origin, methods, and headers. Below, we see that `Access-Control-Allow-Headers` includes the headers that were requested.
   *
   * ```http
   * HTTP/1.1 200 OK
   * Content-Length: 0
   * Connection: keep-alive
   * Access-Control-Allow-Origin: https://foo.bar.org
   * Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE
   * Access-Control-Allow-Headers: Content-Type, x-requested-with
   * Access-Control-Max-Age: 86400
   * ```
   *
   * If the requested method isn't supported, the server will respond with an error.
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Access-Control-Allow-Origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin)
   * - [Access-Control-Expose-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers)
   * - [Access-Control-Allow-Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Methods)
   * - [Access-Control-Request-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Request-Headers)
   */
  'Access-Control-Allow-Headers' = 'Access-Control-Allow-Headers',

  /**
   * The HTTP **`Access-Control-Allow-Methods`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) specifies one or more [HTTP request methods](/en-US/docs/Web/HTTP/Reference/Methods) allowed when accessing a resource in response to a [preflight request](https://developer.mozilla.org/en-US/docs/glossary/preflight_request).
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Access-Control-Allow-Methods: <method>, <method>, …
   * Access-Control-Allow-Methods: *
   * ```
   *
   * ## Directives
   *
   * - `<method>`
   *   - : A comma-separated list of the allowed request methods. `GET`, `HEAD`, and `POST` are always allowed, regardless of whether they are specified in this header, as they are defined as [CORS-safelisted method](https://fetch.spec.whatwg.org/#cors-safelisted-method)s.
   * - `*` (wildcard)
   *   - : All HTTP methods.
   *     It has this meaning only for requests without credentials (requests without [HTTP cookies](/en-US/docs/Web/HTTP/Guides/Cookies) or HTTP authentication information). In requests with credentials, it is
   *     treated as the literal method name `*` without special semantics.
   *
   * ## Examples
   *
   * ```http
   * Access-Control-Allow-Methods: PUT, DELETE
   * Access-Control-Allow-Methods: *
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Access-Control-Allow-Origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin)
   * - [Access-Control-Expose-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers)
   * - [Access-Control-Allow-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers)
   * - [Access-Control-Request-Method](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Request-Method)
   * - [HTTP request methods](/en-US/docs/Web/HTTP/Reference/Methods)
   */
  'Access-Control-Allow-Methods' = 'Access-Control-Allow-Methods',

  /**
   * The HTTP **`Access-Control-Allow-Origin`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) indicates whether the response can be shared with requesting code from the given [origin](https://developer.mozilla.org/en-US/docs/Glossary/origin).
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Access-Control-Allow-Origin: *
   * Access-Control-Allow-Origin: <origin>
   * Access-Control-Allow-Origin: null
   * ```
   *
   * ## Directives
   *
   * - `*` (wildcard)
   *   - : The requesting code from any origin is allowed to access the resource.
   *     For requests _without credentials_, the literal value `*` can be specified as a wildcard.
   *     Attempting to use the wildcard with credentials [results in an error](/en-US/docs/Web/HTTP/Guides/CORS/Errors/CORSNotSupportingCredentials).
   * - `<origin>`
   *   - : Specifies a single origin. If the server supports clients from multiple origins, it must return the origin for the specific client making the request.
   * - `null`
   *   - : Specifies the origin "null".
   *     > [!NOTE]
   *     > The value `null` should not be used. It may seem safe to return `Access-Control-Allow-Origin: "null"`; however, the origin of resources that use a non-hierarchical scheme (such as `data:` or `file:`) and sandboxed documents is serialized as `null`.
   *     > Many browsers will grant such documents access to a response with an `Access-Control-Allow-Origin: null` header, and any origin can create a hostile document with a `null` origin.
   *     > Therefore, the `null` value for the `Access-Control-Allow-Origin` header should be avoided.
   *
   * ## Examples
   *
   * A response that tells the browser to allow code from any origin to access a resource will include the following:
   *
   * ```http
   * Access-Control-Allow-Origin: *
   * ```
   *
   * A response that tells the browser to allow requesting code from the origin `https://developer.mozilla.org` to access a resource will include the following:
   *
   * ```http
   * Access-Control-Allow-Origin: https://developer.mozilla.org
   * ```
   *
   * Limiting the possible `Access-Control-Allow-Origin` values to a set of allowed origins requires code on the server side to check the value of the [Origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin) request header, compare that to a list of allowed origins, and then if the [Origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin) value is in the list, set the `Access-Control-Allow-Origin` value to the same value as the [Origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin) value.
   *
   * ### CORS and caching
   *
   * Suppose the server sends a response with an `Access-Control-Allow-Origin` value with an explicit origin (rather than the `*` wildcard). In that case, the response should also include a [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) response header with the value `Origin` — to indicate to browsers that server responses can differ based on the value of the `Origin` request header.
   *
   * ```http
   * Access-Control-Allow-Origin: https://developer.mozilla.org
   * Vary: Origin
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin)
   * - [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary)
   * - [Cross-Origin Resource Sharing (CORS)](/en-US/docs/Web/HTTP/Guides/CORS)
   * - [Cross-Origin-Resource-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Resource-Policy)
   */
  'Access-Control-Allow-Origin' = 'Access-Control-Allow-Origin',

  /**
   * The HTTP **`Access-Control-Expose-Headers`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) allows a server to indicate which response headers should be made available to scripts running in the browser in response to a cross-origin request.
   *
   * Only the [CORS-safelisted response headers](https://developer.mozilla.org/en-US/docs/Glossary/CORS-safelisted_response_header) are exposed by default. For clients to be able to access other headers, the server must list them using the `Access-Control-Expose-Headers` header.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Access-Control-Expose-Headers: [<header-name>[, <header-name>]*]
   * Access-Control-Expose-Headers: *
   * ```
   *
   * ## Directives
   *
   * - `<header-name>`
   *   - : A list of zero or more comma-separated [header names](/en-US/docs/Web/HTTP/Reference/Headers) that clients are allowed to access from a response.
   *     These are _in addition_ to the [CORS-safelisted response headers](https://developer.mozilla.org/en-US/docs/Glossary/CORS-safelisted_response_header).
   * - `*` (wildcard)
   *   - : Any header.
   *     The value `*` only counts as a special wildcard value for requests without credentials (requests without [HTTP cookies](/en-US/docs/Web/HTTP/Guides/Cookies) or HTTP authentication information).
   *     In requests with credentials, it is treated as the literal header name `*`.
   *
   * ## Examples
   *
   * The [CORS-safelisted response headers](https://developer.mozilla.org/en-US/docs/Glossary/CORS-safelisted_response_header) are: [Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control), [Content-Language](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Language), [Content-Length](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Length), [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type), [Expires](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Expires), [Last-Modified](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Last-Modified), [Pragma](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Pragma). To expose a non-CORS-safelisted response header, you can specify:
   *
   * ```http
   * Access-Control-Expose-Headers: Content-Encoding
   * ```
   *
   * To additionally expose a custom header, like `Kuma-Revision`, you can specify multiple headers separated by a comma:
   *
   * ```http
   * Access-Control-Expose-Headers: Content-Encoding, Kuma-Revision
   * ```
   *
   * For requests without credentials, a server can also respond with a wildcard value:
   *
   * ```http
   * Access-Control-Expose-Headers: *
   * ```
   *
   * A server can also respond with the `*` value for requests with credentials, but in this case it would refer to a header named `*`.
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Access-Control-Allow-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers)
   * - [Access-Control-Allow-Origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin)
   */
  'Access-Control-Expose-Headers' = 'Access-Control-Expose-Headers',

  /**
   * The HTTP **`Access-Control-Max-Age`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) indicates how long the results of a [preflight request](https://developer.mozilla.org/en-US/docs/glossary/preflight_request) (that is, the information contained in the [Access-Control-Allow-Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Methods) and [Access-Control-Allow-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers) headers) can be cached.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Access-Control-Max-Age: <delta-seconds>
   * ```
   *
   * ## Directives
   *
   * - `<delta-seconds>`
   *   - : Maximum number of seconds for which the results can be cached as an unsigned non-negative integer.
   *     Firefox [caps this at 24 hours](https://searchfox.org/mozilla-central/source/netwerk/protocol/http/nsCORSListenerProxy.cpp#1207) (86400 seconds).
   *     Chromium (prior to v76) [caps at 10 minutes](https://source.chromium.org/chromium/chromium/src/+/main:services/network/public/cpp/cors/preflight_result.cc;drc=52002151773d8cd9ffc5f557cd7cc880fddcae3e;l=36) (600 seconds).
   *     Chromium (starting in v76) [caps at 2 hours](https://source.chromium.org/chromium/chromium/src/+/main:services/network/public/cpp/cors/preflight_result.cc;drc=49e7c0b4886cac1f3d09dc046bd528c9c811a0fa;l=31) (7200 seconds).
   *     The default value is 5 seconds.
   *
   * ## Examples
   *
   * Cache results of a preflight request for 10 minutes:
   *
   * ```http
   * Access-Control-Max-Age: 600
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Access-Control-Allow-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers)
   * - [Access-Control-Allow-Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Methods)
   */
  'Access-Control-Max-Age' = 'Access-Control-Max-Age',

  /**
   * The HTTP **`Access-Control-Request-Headers`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) is used by browsers when issuing a [preflight request](https://developer.mozilla.org/en-US/docs/glossary/preflight_request) to let the server know which [HTTP headers](/en-US/docs/Web/HTTP/Reference/Headers) the client might send when the actual request is made (such as with [fetch()](https://developer.mozilla.org/en-US/docs/domxref/Window/fetch) or [XMLHttpRequest.setRequestHeader()](https://developer.mozilla.org/en-US/docs/domxref/XMLHttpRequest.setRequestHeader())). The complementary server-side header of [Access-Control-Allow-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers) will answer this browser-side header.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Access-Control-Request-Headers: <header-name>,<header-name>,…
   * ```
   *
   * ## Directives
   *
   * - `<header-name>`
   *   - : A sorted list of unique, comma-separated, lowercase [HTTP headers](/en-US/docs/Web/HTTP/Reference/Headers) that are included in the request.
   *
   * ## Examples
   *
   * ```http
   * Access-Control-Request-Headers: content-type,x-pingother
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Access-Control-Request-Method](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Request-Method)
   */
  'Access-Control-Request-Headers' = 'Access-Control-Request-Headers',

  /**
   * The HTTP **`Access-Control-Request-Method`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) is used by browsers when issuing a [preflight request](https://developer.mozilla.org/en-US/docs/glossary/preflight_request) to let the server know which [HTTP method](/en-US/docs/Web/HTTP/Reference/Methods) will be used when the actual request is made.
   * This header is necessary because the preflight request is always an [OPTIONS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/OPTIONS) and doesn't use the same method as the actual request.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Access-Control-Request-Method: <method>
   * ```
   *
   * ## Directives
   *
   * - `<method>`
   *   - : An [HTTP request method](/en-US/docs/Web/HTTP/Reference/Methods); for example, [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET), [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/POST), or [DELETE](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/DELETE).
   *
   * ## Examples
   *
   * ```http
   * Access-Control-Request-Method: POST
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Access-Control-Request-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Request-Headers)
   */
  'Access-Control-Request-Method' = 'Access-Control-Request-Method',

  /**
   * The HTTP **`Age`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) indicates the time in seconds for which an object was in a proxy cache.
   *
   * The header value is usually close to zero.
   * If the value is `0`, the object was probably fetched from the origin server; otherwise, the value is usually calculated as a difference between the proxy's current date and the [Date](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Date) general header included in the HTTP response.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Age: <delta-seconds>
   * ```
   *
   * ## Directives
   *
   * - `<delta-seconds>`
   *   - : A non-negative integer that represents the time in seconds for which the object was in a proxy cache.
   *
   * ## Examples
   *
   * ```http
   * Age: 24
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)
   * - [Expires](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Expires)
   */
  'Age' = 'Age',

  /**
   * The HTTP **`Allow`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) lists the set of [request methods](/en-US/docs/Web/HTTP/Reference/Methods) supported by a resource.
   * This header must be sent if the server responds with a [405 Method Not Allowed](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405) status code to indicate which request methods can be used instead.
   * An empty `Allow` value indicates that the resource allows no request methods, which might occur temporarily for a given resource.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Allow: <http-methods>
   * ```
   *
   * ## Directives
   *
   * - `<http-methods>`
   *   - : A comma-separated list of allowed request methods supported by a resource.
   *
   * ## Examples
   *
   * ```http
   * Allow: GET, POST, HEAD
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [405 Method Not Allowed](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405) status code
   * - [Server](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server)
   * - [OPTIONS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/OPTIONS)
   */
  'Allow' = 'Allow',

  /**
   * The HTTP **`Alt-Svc`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) lets a server indicate that another network location (the "alternative service") can be treated as authoritative for that origin when making future requests.
   *
   * Doing so allows new protocol versions to be advertised without affecting in-flight requests and can also help servers manage traffic. Using an alternative service is not visible to the end user; it does not change the URL or the origin of the request and does not introduce additional round trips.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Alt-Svc: clear
   * Alt-Svc: <protocol-id>=<alt-authority>; ma=<max-age>
   * Alt-Svc: <protocol-id>=<alt-authority>; ma=<max-age>; persist=1
   * ```
   *
   * - `clear`
   *   - : All alternative services of the origin are invalidated.
   * - `<protocol-id>`
   *   - : The [Application-Layer Protocol Negotiation (ALPN)](https://developer.mozilla.org/en-US/docs/Glossary/ALPN) protocol identifier. Examples include `h2` for HTTP/2 and `h3-25` for draft 25 of the HTTP/3 protocol.
   * - `<alt-authority>`
   *   - : A quoted string specifying the alternative authority, consisting of an optional host override, a colon, and a mandatory port number.
   * - `ma=<max-age>`
   *   - : The number of seconds for which the alternative service is considered fresh.
   *     If omitted, it defaults to 24 hours.
   *     Alternative service entries can be cached for up to `<max-age>` seconds, minus the age of the response (from the [Age](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Age) header).
   *     Once the cached entry expires, the client can no longer use this alternative service for new connections.
   * - `persist=1`
   *   - : Entries are not deleted by network configuration changes.
   *     Cached alternative service entries are usually cleared on such changes.
   *
   * Multiple entries can be specified in a single `Alt-Svc` header using comma as separator.
   * In that case, early entries are considered more preferable.
   *
   * ## Example
   *
   * ```http
   * Alt-Svc: h2=":443"; ma=2592000;
   * Alt-Svc: h2=":443"; ma=2592000; persist=1
   * Alt-Svc: h2="alt.example.com:443", h2=":443"
   * Alt-Svc: h3-25=":443"; ma=3600, h2=":443"; ma=3600
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Alternative Services](https://www.mnot.net/blog/2016/03/09/alt-svc) by HTTP Working Group chair, Mark Nottingham (2016)
   */
  'Alt-Svc' = 'Alt-Svc',

  /**
   * The HTTP **`Alt-Used`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) is used to identify the alternative service in use, just as the [Host](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Host) HTTP header field identifies the host and port of the origin.
   *
   * The is intended to allow alternative services to detect loops, differentiate traffic for purposes of load balancing, and generally to ensure that it is possible to identify the intended destination of traffic, since introducing this information after a protocol is in use has proven to be problematic.
   *
   * When a client uses an alternative service for a request, it can indicate this to the server using the `Alt-Used` HTTP header.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Alt-Used: <host>:<port>
   * ```
   *
   * ## Directives
   *
   * - `<host>`
   *   - : The domain name of the server.
   * - `<port>`
   *   - : The TCP port number on which the server is listening.
   *
   * ## Examples
   *
   * ```http
   * Alt-Used: alternate.example.net
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [Alt-Svc](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Alt-Svc)
   * - [Host](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Host)
   */
  'Alt-Used' = 'Alt-Used',

  /**
   * The HTTP **`Attribution-Reporting-Eligible`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) indicates that the corresponding response is eligible to register an attribution source or trigger.
   *
   * This header is never set manually and is instead sent by the browser in response to various HTML element or JavaScript request settings. Depending on the allowed registrations specified in the `Attribution-Reporting-Eligible` value, the server is expected to respond with either an [Attribution-Reporting-Register-Source](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Attribution-Reporting-Register-Source) or [Attribution-Reporting-Register-Trigger](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Attribution-Reporting-Register-Trigger) header to complete the registration of an attribution source or trigger, respectively.
   *
   * See the [Attribution Reporting API](/en-US/docs/Web/API/Attribution_Reporting_API) for more details.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Attribution-Reporting-Eligible: <allowed-registrations>
   * ```
   *
   * ## Directives
   *
   * - `<allowed-registrations>`
   *   - : A structured-header dictionary representing the registrations allowed in the corresponding response. Possible keys are:
   *     - `event-source`
   *       - : An [event-based attribution source](/en-US/docs/Web/API/Attribution_Reporting_API/Registering_sources#event-based_attribution_sources) can be registered.
   *     - `navigation-source`
   *       - : A [navigation-based attribution source](/en-US/docs/Web/API/Attribution_Reporting_API/Registering_sources#navigation-based_attribution_sources) can be registered.
   *     - `trigger`
   *       - : An [attribution trigger](/en-US/docs/Web/API/Attribution_Reporting_API/Registering_triggers) can be registered.
   *
   * Every response in a redirect chain can register at most one source or one trigger.
   *
   * ## Examples
   *
   * ```http
   * Attribution-Reporting-Eligible: trigger
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Attribution-Reporting-Register-Source](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Attribution-Reporting-Register-Source)
   * - [Attribution-Reporting-Register-Trigger](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Attribution-Reporting-Register-Trigger)
   * - [Attribution Reporting API](/en-US/docs/Web/API/Attribution_Reporting_API)
   */
  'Attribution-Reporting-Eligible' = 'Attribution-Reporting-Eligible',

  /**
   * The HTTP **`Attribution-Reporting-Register-Source`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) registers a page feature as an [attribution source](/en-US/docs/Web/API/Attribution_Reporting_API/Registering_sources). This header is included as part of a response to a request that contains the [Attribution-Reporting-Eligible](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Attribution-Reporting-Eligible) header. It provides the information that the browser should store when a user interacts with the attribution source. The information you include in this header also determines the types of reports the browser can generate.
   *
   * See the [Attribution Reporting API](/en-US/docs/Web/API/Attribution_Reporting_API) for more details.
   *
   * > [!NOTE]
   * > If the calling site does not have the Attribution Reporting API included in a successful [privacy sandbox enrollment process](/en-US/docs/Web/Privacy/Guides/Privacy_sandbox/Enrollment), the `Attribution-Reporting-Register-Source` header is ignored and attribution sources are not registered.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Attribution-Reporting-Register-Source: <json-string>
   * ```
   *
   * ## Directives
   *
   * - `<json-string>`
   *   - : A JSON string providing the information that the browser should store when the attribution source is interacted with. Available fields are as follows:
   *     - `"source_event_id"`
   *       - : A string representing an ID for the attribution source, which can be used to map it to other information when the attribution source is interacted with, or aggregate information at the reporting endpoint. The string must consist solely of a base-10-formatted 64-bit unsigned integer.
   *     - `"destination"`
   *       - : A single string or an array of 1–3 strings. These strings must contain a complete URL corresponding to the site (scheme + [eTLD+1](/en-US/docs/Glossary/eTLD)) on which a trigger is expected to occur. These are used to match the attribution trigger to the source when a trigger is interacted with.
   *     - `"aggregation_keys"`
   *       - : An object containing user-provided keys representing different data points to aggregate report values under.
   *     - `"aggregatable_report_window"`
   *       - : A string representing a time in seconds after which trigger data will no longer be included in generated aggregatable reports (this is called a **report window**). If not set, this defaults to the `"expiry"` value.
   *     - `"debug_key"`
   *       - : A base-10-formatted 64-bit unsigned integer representing a debug key. Set this if you want to generate a [debug report](/en-US/docs/Web/API/Attribution_Reporting_API/Generating_reports#debug_reports) alongside the associated attribution report.
   *     - `"debug_reporting"`
   *       - : A boolean value. If a `debug_key` is set, set this to `true` to specify that the generated debug report should be a verbose debug report.
   *     - `"event_level_epsilon"`
   *       - : A number equal to or greater than `0`, which controls the amount of [noise added to reports](/en-US/docs/Web/API/Attribution_Reporting_API/Generating_reports#adding_noise_to_reports). Lower values of epsilon result in more noise and therefore provide greater privacy protection. The maximum and default values will vary across implementations; Chrome for example has a maximum and default value of `14`.
   *     - `"event_report_window"`
   *       - : A string representing a time in seconds, after which subsequent triggers won't be attributable to this source for the purpose of producing event-level reports (this is called a **report window**). If not set, the event report window falls back to the `"expiry"` value.
   *         > [!NOTE]
   *         > If `"event_report_window"` is specified, `"event_report_windows"` cannot be specified, otherwise the source registration will fail.
   *     - `"event_report_windows"`
   *       - : An object representing a series of report windows, starting at `"start_time"`, with reports for this source being delivered after each specified end time in `"end_times"`. This can be used to vary the time of report delivery across multiple reports. If not set, the event report window falls back to the `"expiry"` value. Properties are as follows:
   *         - `"start_time"` : A non-negative number specifying the start time for the reporting windows. If not specified, it defaults to `0`.
   *         - `"end_times"`: An array of positive numbers specifying end times for subsequent report windows. The values must be increasing, and greater than `"start_time"`.
   *           > [!NOTE]
   *           > If `"event_report_windows"` is specified, `"event_report_window"` cannot be specified, otherwise the source registration will fail.
   *     - `"expiry"`
   *       - : A string representing an expiry time in seconds for the attribution source, after which it will no longer be active (i.e., subsequent triggers won't be attributable to this source). The maximum allowable expiry time is 2592000 seconds (30 days), which is also the default value if `"expiry"` is not explicitly set.
   *     - `"filter_data"`
   *       - : An object defining custom data that can be used to filter which conversions generate reports. See [Filters](/en-US/docs/Web/API/Attribution_Reporting_API/Generating_reports#filters) for more details.
   *     - `"max_event_level_reports"`
   *       - : A number between `0` and `20`, inclusive, which specifies the total number of event-level reports this source can generate. After this maximum is reached, the source is no longer capable of producing any new data. If not specified, `"max_event_level_reports"` defaults to `3` for navigation-based sources and `1` for event-based (image- or script-based) sources.
   *     - `"priority"`
   *       - : A string representing a priority value for the attribution source. By default, conversions are attributed to the most recent matching source. For both event-level and summary reports you set a higher priority number to prioritize specific sources. For example, a value of `2` takes priority over the default value of `1`. See [Report priorities and limits](/en-US/docs/Web/API/Attribution_Reporting_API/Generating_reports#report_priorities_and_limits) for more information.
   *     - `"trigger_data"`
   *       - : An array of 32-bit unsigned integers representing data that describes the different trigger events that could match this source. For example, "user added item to shopping cart" or "user signed up to mailing list" could be actions happening at the trigger site that could match this source and indicate a conversion of some kind that the advertiser is trying to measure. These must be matched against `"trigger_data"` specified in [triggers](/en-US/docs/Web/HTTP/Reference/Headers/Attribution-Reporting-Register-Trigger#trigger_data) for event-level attribution to take place. If omitted, `"trigger_data"` defaults to `[0, 1, 2, 3, 4, 5, 6, 7]` for navigation-based sources and `[0, 1]` for event-based (image- or script-based) sources.
   *
   *         > [!NOTE]
   *         > The values used to represent each event, and the number of elements in the array, are completely arbitrary and defined by you as the developer. The array may contain values that are not used, but values must be present in the array to be attributed to the source by the browser when a trigger is registered.
   *
   *     - `"trigger_data_matching"`
   *       - : A string that specifies how the `"trigger_data"` from the trigger is matched against the source's `"trigger_data"`. Possible values are:
   *         - `"exact"`: The `"trigger_data"` from the trigger must exactly match a value contained in the source's `"trigger_data"`; if there is no such match, no event-level attribution takes place.
   *         - `"modulus"`: In this case, the following calculation is performed — `d % allowedValues.size` — where `d` is the `"trigger_data"` from the trigger, and `allowedValues` is the sequence of values in the source's `"trigger_data"` array. If the result of this calculation matches a value in the source's `"trigger_data"` array, the match is a success. In such a case, the value will always match, unless `allowedValues` is empty.
   *
   *         `"modulus"` mode exists primarily for backwards compatibility with the API's behavior before `"exact"` was introduced, and as such, you'd be unlikely to use it. It is still useful in particular cases that require a very specific kind of compression resulting in smaller registration headers. This can be required when using complex filtering logic that needs to set different trigger data based on the source type according to the maximum number of source `"trigger_data"` items.
   *
   *         > [!NOTE]
   *         > If `"modulus"` is used, the source's `"trigger_data"` must form a contiguous sequence of integers starting at 0. If the trigger data does not form such a sequence, an error occurs.
   *
   *         If not specified, `"trigger_data_matching"` defaults to `"modulus"`. Again, the reason for this is backwards compatibility: omitting the `"trigger_data_matching"` field needs to result in the same behavior observed before this field was introduced.
   *
   * ## Examples
   *
   * ### Registering a source for an event-level report
   *
   * A Node.js server might set the `Attribution-Reporting-Register-Source` response header as follows to make a browser generate an event-level report when a trigger is matched to a source:
   *
   * ```js
   * res.set(
   *   "Attribution-Reporting-Register-Source",
   *   JSON.stringify({
   *     source_event_id: "412444888111012",
   *     destination: "https://shop.example",
   *     trigger_data: [0, 1, 2, 3, 4],
   *     trigger_data_matching: "exact",
   *     expiry: "604800",
   *     priority: "100",
   *     debug_key: "122939999",
   *     event_report_window: "86400",
   *   }),
   * );
   * ```
   *
   * ### Registering a source for a summary report
   *
   * To make the browser generate a summary report when a trigger is matched to a source, you need to include some extra fields, _in addition_ to those required for event-level report generation.
   *
   * ```js
   * res.set(
   *   "Attribution-Reporting-Register-Source",
   *   JSON.stringify({
   *     source_event_id: "412444888111012",
   *     destination: "https://shop.example",
   *     trigger_data: [0, 1, 2, 3, 4],
   *     trigger_data_matching: "exact",
   *     expiry: "604800",
   *     priority: "100",
   *     debug_key: "122939999",
   *     event_report_window: "86400",
   *
   *     aggregation_keys: {
   *       campaignCounts: "0x159",
   *       geoValue: "0x5",
   *     },
   *     aggregatable_report_window: "86400",
   *   }),
   * );
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Attribution-Reporting-Eligible](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Attribution-Reporting-Eligible)
   * - [Attribution-Reporting-Register-Trigger](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Attribution-Reporting-Register-Trigger)
   * - [Attribution Reporting API](/en-US/docs/Web/API/Attribution_Reporting_API)
   */
  'Attribution-Reporting-Register-Source' = 'Attribution-Reporting-Register-Source',

  /**
   * The HTTP **`Attribution-Reporting-Register-Trigger`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) registers a page feature as an [attribution trigger](/en-US/docs/Web/API/Attribution_Reporting_API/Registering_triggers). This header is included as part of a response to a request that contains the [Attribution-Reporting-Eligible](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Attribution-Reporting-Eligible) header.
   *
   * See the [Attribution Reporting API](/en-US/docs/Web/API/Attribution_Reporting_API) for more details.
   *
   * > [!NOTE]
   * > If the calling site does not have the Attribution Reporting API included in a successful [privacy sandbox enrollment process](/en-US/docs/Web/Privacy/Guides/Privacy_sandbox/Enrollment), the `Attribution-Reporting-Register-Trigger` header is ignored and attribution triggers are not registered.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Attribution-Reporting-Register-Trigger: <json-string>
   * ```
   *
   * ## Directives
   *
   * - `<json-string>`
   *   - : A JSON string providing data that can be included in generated reports, such as the ID of the trigger, and priority and deduplication values. Available fields are as follows:
   *     - `"aggregatable_trigger_data"`
   *       - : An array of objects, each one defining an aggregation key to apply to different source keys. Each object contains the following properties:
   *         - `"key_piece"`
   *           - : A hexadecimal value representing a key.
   *         - `"source_keys"`
   *           - : An array containing one or more key values for the data.
   *     - `"aggregatable_values"`
   *       - : An object containing properties representing a value for each data point defined in `"aggregatable_trigger_data"`. In each case, the property name is equal to the name defined in `"source_keys"`, and the property value is whatever arbitrary value you require.
   *     - `"debug_key"`
   *       - : A number representing a debug key. Set this if you want to generate a [debug report](/en-US/docs/Web/API/Attribution_Reporting_API/Generating_reports#debug_reports) alongside the associated attribution report.
   *     - `"debug_reporting"`
   *       - : A boolean value. If a `debug_key` is set, set this to `true` to specify that the generated debug report should be a verbose debug report.
   *     - `"filters"`
   *       - : An object containing custom data that can be used to filter which triggers generate reports. See [Filters](/en-US/docs/Web/API/Attribution_Reporting_API/Generating_reports#filters) for more details.
   *     - `"event_trigger_data"`
   *       - : An object representing data about the trigger. Available sub-fields are as follows:
   *         - `"trigger_data"`
   *           - : A string representing data that describes the trigger, which is typically used to indicate events such as "user added item to shopping cart" or "user signed up to mailing list". This value will be included in the generated event-level report, if any, although it will be subject to modification based on the attributed source's [`"trigger_data_matching"`](/en-US/docs/Web/HTTP/Reference/Headers/Attribution-Reporting-Register-Source#trigger_data_matching) field.
   *
   *             > [!NOTE]
   *             > The values used to represent each event, and the number of elements in the array, are completely arbitrary and defined by you as the developer. The array may contain values that are not used, but values must be present in the array to be attributed to the source by the browser when a trigger is registered.
   *
   *         - `"priority"`
   *           - : A string representing a priority value for the attribution trigger. By default, triggers are attributed to the most recent matching source. For both event-level and summary reports you set a higher priority number to make the trigger match older sources. For example, a value of `2` takes priority over the default value of `1`. See [Report priorities and limits](/en-US/docs/Web/API/Attribution_Reporting_API/Generating_reports#report_priorities_and_limits) for more information.
   *         - `"deduplication_key"`
   *           - : A string representing a unique key that can be used to prevent attributions from being duplicated — for example if a user were to add the same item to a shopping cart multiple times. See [Prevent duplication in reports](https://privacysandbox.google.com/private-advertising/attribution-reporting/prevent-duplication) for more information.
   *         - `"filters"`
   *           - : An object containing filters that perform selective filtering to set `"trigger_data"`, `"priority"`, and `"deduplication_key"` based on the `filter_data` set in a corresponding [Attribution-Reporting-Register-Source](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Attribution-Reporting-Register-Source) header. See [Filters](/en-US/docs/Web/API/Attribution_Reporting_API/Generating_reports#filters) for more information.
   *
   * ## Examples
   *
   * ### Registering a trigger for an event-level report
   *
   * A Node.js server might set the `Attribution-Reporting-Register-Trigger` response header as follows to register a trigger intended to match an event-level report attribution source:
   *
   * ```js
   * res.set(
   *   "Attribution-Reporting-Register-Trigger",
   *   JSON.stringify({
   *     event_trigger_data: [
   *       {
   *         trigger_data: "4",
   *         priority: "1000000000000",
   *         deduplication_key: "2345698765",
   *       },
   *     ],
   *     debug_key: "1115698977",
   *   }),
   * );
   * ```
   *
   * ### Registering a trigger for a summary report
   *
   * When registering a trigger intended to match with a summary report attribution source, you need to include the following fields:
   *
   * ```js
   * res.set(
   *   "Attribution-Reporting-Register-Trigger",
   *   JSON.stringify({
   *     aggregatable_trigger_data: [
   *       {
   *         key_piece: "0x400",
   *         source_keys: ["campaignCounts"],
   *       },
   *       {
   *         key_piece: "0xA80",
   *         source_keys: ["geoValue", "nonMatchingKeyIdsAreIgnored"],
   *       },
   *     ],
   *     aggregatable_values: {
   *       campaignCounts: 32768,
   *       geoValue: 1664,
   *     },
   *     debug_key: "1115698977",
   *   }),
   * );
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Attribution-Reporting-Eligible](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Attribution-Reporting-Eligible)
   * - [Attribution-Reporting-Register-Source](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Attribution-Reporting-Register-Source)
   * - [Attribution Reporting API](/en-US/docs/Web/API/Attribution_Reporting_API)
   */
  'Attribution-Reporting-Register-Trigger' = 'Attribution-Reporting-Register-Trigger',

  /**
   * The HTTP **`Authorization`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) can be used to provide credentials that authenticate a user agent with a server, allowing access to protected resources.
   *
   * The `Authorization` header is usually, but not always, sent after the user agent first attempts to request a protected resource without credentials.
   * The server responds with a [401 Unauthorized](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401) message that includes at least one [WWW-Authenticate](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/WWW-Authenticate) header.
   * This header indicates the authentication schemes that can be used to access the resource and any additional information needed by the client to use them.
   * The user-agent should select the most secure authentication scheme that it supports from those offered, prompt the user for their credentials, and then re-request the resource with the encoded credentials in the `Authorization` header.
   *
   * This header is stripped from cross-origin redirects.
   *
   * > [!NOTE]
   * > This header is part of the [General HTTP authentication framework](/en-US/docs/Web/HTTP/Guides/Authentication#the_general_http_authentication_framework).
   * > It can be used with a number of [authentication schemes](/en-US/docs/Web/HTTP/Guides/Authentication#authentication_schemes).
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Authorization: <auth-scheme> <authorization-parameters>
   *
   * // Basic authentication
   * Authorization: Basic <credentials>
   *
   * // Digest authentication
   * Authorization: Digest username=<username>,
   *     realm="<realm>",
   *     uri="<url>",
   *     algorithm=<algorithm>,
   *     nonce="<nonce>",
   *     nc=<nc>,
   *     cnonce="<cnonce>",
   *     qop=<qop>,
   *     response="<response>",
   *     opaque="<opaque>"
   * ```
   *
   * ## Directives
   *
   * - `<auth-scheme>`
   *   - : The [Authentication scheme](/en-US/docs/Web/HTTP/Guides/Authentication#authentication_schemes) that defines how the credentials are encoded.
   *     Some of the more common types are (case-insensitive): [`Basic`](/en-US/docs/Web/HTTP/Guides/Authentication#basic_authentication_scheme), `Digest`, `Negotiate` and `AWS4-HMAC-SHA256`.
   *
   *     > [!NOTE]
   *     > For more information/options see [HTTP Authentication > Authentication schemes](/en-US/docs/Web/HTTP/Guides/Authentication#authentication_schemes)
   *
   * Other than `<auth-scheme>`, the remaining directives are specific to each [authentication scheme](/en-US/docs/Web/HTTP/Guides/Authentication#authentication_schemes).
   * Generally, you will need to check the relevant specifications for these (keys for a small subset of schemes are listed below).
   *
   * ### Basic authentication
   *
   * - `<credentials>`
   *   - : The credentials, encoded according to the specified scheme.
   *
   *     > [!NOTE]
   *     > For information about the encoding algorithm, see the examples: below, in [WWW-Authenticate](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/WWW-Authenticate), in [HTTP Authentication](/en-US/docs/Web/HTTP/Guides/Authentication), and in the relevant specifications.
   *
   * ### Digest authentication
   *
   * - `<response>`
   *   - : A string of the hex digits that proves that the user knows a password.
   *     The algorithm encodes the username and password, realm, cnonce, qop, nc, and so on.
   *     It is described in detail in the specification.
   * - `username`
   *   - : A quoted string containing user's name for the specified `realm` in either plain text or the hash code in hexadecimal notation.
   *     If the name contains characters that aren't allowed in the field, then `username*` can be used instead (not "as well").
   * - `username*`
   *   - : The user's name formatted using an extended notation defined in RFC5987.
   *     This should be used only if the name can't be encoded in `username` and if `userhash` is set `"false"`.
   * - `uri`
   *   - : The _Effective Request URI_. See the specification for more information.
   * - `realm`
   *   - : Realm of the requested username/password (again, should match the value in the corresponding [WWW-Authenticate](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/WWW-Authenticate) response for the resource being requested).
   * - `opaque`
   *   - : The value in the corresponding [WWW-Authenticate](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/WWW-Authenticate) response for the resource being requested.
   * - `algorithm`
   *   - : The algorithm used to calculate the digest. Must be a supported algorithm from the [WWW-Authenticate](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/WWW-Authenticate) response for the resource being requested.
   * - `qop`
   *   - : A token indicating the _quality of protection_ applied to the message.
   *     Must match the one value in the set specified in the [WWW-Authenticate](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/WWW-Authenticate) response for the resource being requested.
   *     - `"auth"`: Authentication
   *     - `"auth-int"`: Authentication with integrity protection
   * - `cnonce`
   *   - : An quoted [ASCII](https://developer.mozilla.org/en-US/docs/Glossary/ASCII)-only string value provided by the client.
   *     This is used by both the client and server to provide mutual authentication, provide some message integrity protection, and avoid "chosen plaintext
   *     attacks".
   *     See the specification for additional information.
   * - `nc`
   *   - : Nonce count. The hexadecimal count of requests in which the client has sent the current `cnonce` value (including the current request).
   *     The server can use duplicate `nc` values to recognize replay requests.
   * - `userhash`
   *   - : `"true"` if the username has been hashed. `"false"` by default.
   *
   * ## Examples
   *
   * ### Basic authentication
   *
   * For `Basic` authentication, the credentials are constructed by first combining the username and the password with a colon (e.g., `aladdin:opensesame`), and then by encoding the resulting string in [`base64`](/en-US/docs/Glossary/Base64) (e.g., `YWxhZGRpbjpvcGVuc2VzYW1l`).
   *
   * ```http
   * Authorization: Basic YWxhZGRpbjpvcGVuc2VzYW1l
   * ```
   *
   * > [!WARNING]
   * > [Base64](https://developer.mozilla.org/en-US/docs/Glossary/Base64)-encoding can easily be reversed to obtain the original name and password, so `Basic` authentication offers no cryptographic security.
   * > [HTTPS](https://developer.mozilla.org/en-US/docs/Glossary/HTTPS) is always recommended when using authentication, but is even more so when using `Basic` authentication.
   *
   * See also [HTTP authentication](/en-US/docs/Web/HTTP/Guides/Authentication) for examples on how to configure Apache or Nginx servers to password protect your site with HTTP basic authentication.
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [HTTP authentication](/en-US/docs/Web/HTTP/Guides/Authentication)
   * - [WWW-Authenticate](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/WWW-Authenticate)
   * - [Proxy-Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Proxy-Authorization)
   * - [Proxy-Authenticate](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Proxy-Authenticate)
   * - [401](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401), [403](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403), [407](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/407)
   */
  'Authorization' = 'Authorization',

  /**
   * The HTTP **`Available-Dictionary`** request header allows the browser to specify the best matching dictionary it has to allow the server to use [Compression Dictionary Transport](https://developer.mozilla.org/en-US/docs/glossary/Compression_Dictionary_Transport) for a resource request.
   *
   * Clients can send an `Available-Dictionary` header when they support `dcb` or `dcz` encodings. The header is a colon-surrounded base-64 encoded SHA-256 [hash](https://developer.mozilla.org/en-US/docs/glossary/Hash_function) of the dictionary contents.
   *
   * See the [Compression Dictionary Transport guide](/en-US/docs/Web/HTTP/Guides/Compression_dictionary_transport) for more information.
   *
   * ## Syntax
   *
   * ```http
   * Available-Dictionary: :<base64-hash>:
   * ```
   *
   * ## Directives
   *
   * - `<base64-hash>`
   *   - : A base-64 encoded SHA-256 [hash](https://developer.mozilla.org/en-US/docs/glossary/Hash_function) of the dictionary contents.
   *
   * ## Examples
   *
   * ```http
   * Accept-Encoding: gzip, br, zstd, dcb, dcz
   * Available-Dictionary: :pZGm1Av0IEBKARczz7exkNYsZb8LzaMrV7J32a2fFG4=:
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Compression Dictionary Transport guide](/en-US/docs/Web/HTTP/Guides/Compression_dictionary_transport)
   * - [Use-As-Dictionary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Use-As-Dictionary)
   * - [Dictionary-ID](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Dictionary-ID)
   */
  'Available-Dictionary' = 'Available-Dictionary',

  /**
   * The HTTP **`Cache-Control`** header holds _directives_ (instructions) in both requests and responses that control [caching](/en-US/docs/Web/HTTP/Guides/Caching) in browsers and shared caches (e.g., Proxies, CDNs).
   *
   *
   * <img src="/assets/hero.png?hash=deadbeef" width="900" height="400" />
   * ```
   *
   * You can add a long `max-age` value and `immutable` because the content will never change.
   *
   * ```http
   * # /assets/*
   * Cache-Control: max-age=31536000, immutable
   * ```
   *
   * When you update the library or edit the picture, new content should have a new URL, and caches aren't reused. That is called the "cache busting" pattern.
   *
   * Use a `no-cache` to make sure that the HTML response itself is not cached. `no-cache` could cause revalidation, and the client will correctly receive a new version of the HTML response and static assets.
   *
   * ```http
   * # /index.html
   * Cache-Control: no-cache
   * ```
   *
   * Note: If `index.html` is controlled under Basic Authentication or Digest Authentication, files under `/assets` are not stored in the shared cache. If `/assets/` files are suitable for storing in a shared cache, you also need one of `public`, `s-maxage` or `must-revalidate`.
   *
   * ### Up-to-date contents always
   *
   * For content that's generated dynamically, or that's static but updated often, you want a user to always receive the most up-to-date version.
   *
   * If you don't add a `Cache-Control` header because the response is not intended to be cached, that could cause an unexpected result. Cache storage is allowed to cache it heuristically — so if you have any requirements on caching, you should always indicate them explicitly, in the `Cache-Control` header.
   *
   * Adding `no-cache` to the response causes revalidation to the server, so you can serve a [fresh](/en-US/docs/Web/HTTP/Guides/Caching#fresh_and_stale_based_on_age) response every time — or if the client already has a new one, just respond `304 Not Modified`.
   *
   * ```http
   * Cache-Control: no-cache
   * ```
   *
   * Most HTTP/1.0 caches don't support `no-cache` directives, so historically `max-age=0` was used as a workaround. But only `max-age=0` could cause a [stale response](/en-US/docs/Web/HTTP/Guides/Caching#fresh_and_stale_based_on_age) to be reused when caches disconnected from the origin server. `must-revalidate` addresses that. That's why the example below is equivalent to `no-cache`.
   *
   * ```http
   * Cache-Control: max-age=0, must-revalidate
   * ```
   *
   * But for now, you can simply use `no-cache` instead.
   *
   * ### Clearing an already-stored cache
   *
   * There are no cache directives for clearing already-stored responses from caches on _intermediate_ servers.
   *
   * Imagine that clients/caches store a [fresh](/en-US/docs/Web/HTTP/Guides/Caching#fresh_and_stale_based_on_age) response for a path, with no request flight to the server. There is nothing a server could do to that path.
   *
   * [`Clear-Site-Data: cache`](/en-US/docs/Web/HTTP/Reference/Headers/Clear-Site-Data#cache) can be used to clear every stored response for a site in the browser cache, so use this with care.
   * Note that this will not affected shared or intermediate caches.
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [HTTP caching](/en-US/docs/Web/HTTP/Guides/Caching)
   * - [Caching Tutorial for Web Authors and Webmasters](https://www.mnot.net/cache_docs/)
   * - [Caching best practices & max-age gotchas](https://jakearchibald.com/2016/caching-best-practices/)
   * - [Cache-Control for Civilians](https://csswizardry.com/2019/03/cache-control-for-civilians/)
   * - [RFC 9111 – HTTP Caching](https://httpwg.org/specs/rfc9111.html)
   * - [RFC 5861 – HTTP Cache-Control Extensions for Stale Content](https://httpwg.org/specs/rfc5861.html)
   * - [RFC 8246 – HTTP Immutable Responses](https://httpwg.org/specs/rfc8246.html)
   */
  'Cache-Control' = 'Cache-Control',

  /**
   * The HTTP **`Clear-Site-Data`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) sends a signal to the client that it should remove all browsing data of certain types (cookies, storage, cache) associated with the requesting website.
   * It allows web developers to have more control over the data stored by browsers for their origins.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * // Single directive
   * Clear-Site-Data: "cache"
   *
   * // Multiple directives (comma separated)
   * Clear-Site-Data: "cache", "cookies"
   *
   * // Wild card
   * Clear-Site-Data: "*"
   * ```
   *
   * ## Directives
   *
   * > [!NOTE]
   * > All directives must comply with the [quoted-string grammar](https://datatracker.ietf.org/doc/html/rfc7230#section-3.2.6). A directive that does not include the double quotes is invalid.
   *
   * - `"cache"`
   *   - : The server signals that the client should remove locally cached data (the browser cache, see [HTTP caching](/en-US/docs/Web/HTTP/Guides/Caching)) for the origin of the response URL.
   *     Depending on the browser, this might also clear out things like pre-rendered pages, [backwards-forwards cache](https://developer.mozilla.org/en-US/docs/glossary/bfcache), script caches, WebGL shader caches, or address bar suggestions.
   *
   * - `"clientHints"`
   *   - : Indicates that the server will remove all [client hints](/en-US/docs/Web/HTTP/Guides/Client_hints) (requested via [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH)) stored for the origin of the response URL.
   *
   *     > [!NOTE]
   *     > In browsers that support the `"clientHints"` data type, client hints are also cleared when the `"cache"`, `"cookies"`, or `"*"` types are specified. `"clientHints"` is therefore only needed when none of those other types are specified.
   *
   * - `"cookies"`
   *   - : The server signals that the client should remove all cookies for the origin of the response URL. HTTP authentication credentials are also cleared out. This affects the entire registered domain, including subdomains. So `https://example.com` as well as `https://stage.example.com`, will have cookies cleared.
   *
   * - `"executionContexts"`
   *   - : The server signals that the client should reload all browsing contexts for the origin of the response ([Location.reload](https://developer.mozilla.org/en-US/docs/domxref/Location.reload)).
   *
   * - `"prefetchCache"`
   *   - : Used to clear [speculation rules", "", "nocode](https://developer.mozilla.org/en-US/docs/domxref/Speculation_Rules_API) prefetches that are scoped to the referrer origin.
   *
   * - `"prerenderCache"`
   *   - : Used to clear [speculation rules","", "nocode](https://developer.mozilla.org/en-US/docs/domxref/Speculation_Rules_API) prerenders that are scoped to the referrer origin.
   *
   * - `"storage"`
   *   - : The server signals that the client should remove all DOM storage for the origin of the response URL. This includes storage mechanisms such as:
   *     - localStorage (executes `localStorage.clear`),
   *     - sessionStorage (executes `sessionStorage.clear`),
   *     - IndexedDB (for each database execute [IDBFactory.deleteDatabase](https://developer.mozilla.org/en-US/docs/domxref/IDBFactory.deleteDatabase)),
   *     - Service worker registrations (for each service worker registration, execute [ServiceWorkerRegistration.unregister](https://developer.mozilla.org/en-US/docs/domxref/ServiceWorkerRegistration.unregister)),
   *     - Web SQL databases (deprecated),
   *     - [FileSystem API data](/en-US/docs/Web/API/File_and_Directory_Entries_API),
   *     - Plugin data (Flash via [`NPP_ClearSiteData`](https://wiki.mozilla.org/NPAPI:ClearSiteData)).
   *
   * - `"*"` (wildcard)
   *   - : The server signals that the client should clear all types of data for the origin of the response. If more data types are added in future versions of this header, they will also be covered by it.
   *
   * ## Examples
   *
   * ### Sign out of a website
   *
   * If a user signs out of your website or service, you might want to remove locally stored data, including any prefetched or prerendered content for [speculated navigations","", "nocode](https://developer.mozilla.org/en-US/docs/domxref/Speculation_Rules_API).
   * To do this, add the `Clear-Site-Data` header to the page that confirms the logging out from the site has been accomplished successfully (`https://example.com/logout`, for example):
   *
   * ```http
   * Clear-Site-Data: "cache", "cookies", "storage", "executionContexts", "prefetchCache", "prerenderCache"
   * ```
   *
   * ### Clearing cookies
   *
   * If this header is delivered with the response at `https://example.com/clear-cookies`, all cookies on the same domain `https://example.com` and any subdomains (like `https://stage.example.com`, etc.), will be cleared out.
   *
   * ```http
   * Clear-Site-Data: "cookies"
   * ```
   *
   * ### Clearing speculations
   *
   * If this header is delivered with the response at `https://example.com/change-state.json`, all [speculated navigations","", "nocode](https://developer.mozilla.org/en-US/docs/domxref/Speculation_Rules_API) prerenders on the same domain `https://example.com` and any subdomains (such as `https://stage.example.com`), will be cleared.
   *
   * ```http
   * Clear-Site-Data: "prerenderCache"
   * ```
   *
   * To clear both prefetch and prerender speculations, both `prefetchCache` and `prerenderCache` must be sent:
   *
   * ```http
   * Clear-Site-Data: "prefetchCache", "prerenderCache"
   * ```
   *
   * There are cases where clearing one or the other, or both, is appropriate.
   *
   * For example, a client-side rendered application that pulls in data from JavaScript might use `prerenderCache` on state change to discard the prerendered pages, but keep the prefetched HTML to use when the page is rendered (or prerendered again).
   *
   * On the other hand, if the prefetched HTML document contains stale data but the corresponding prerendered page is set up to refresh the data when it is displayed, you may not need to use `prerenderCache` but you probably will want to use the `prefetchCache` directive: so that the stale HTML isn't used in a future prerender.
   *
   * Finally, if the prefetched HTML document contains stale data, and also does not refresh stale content on prerendered pages, then specifying both `prefetchCache` and `prerenderCache` is most appropriate.
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)
   */
  'Clear-Site-Data' = 'Clear-Site-Data',

  /**
   * The HTTP **`Connection`** header controls whether the network connection stays open after the current transaction finishes.
   * If the value sent is `keep-alive`, the connection is persistent and not closed, allowing subsequent requests to the same server on the same connection.
   *
   * > [!WARNING]
   * > Connection-specific header fields such as
   * > `Connection` and [Keep-Alive](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Keep-Alive) are prohibited
   * > in [HTTP/2](https://httpwg.org/specs/rfc9113.html#ConnectionSpecific) and
   * > [HTTP/3](https://httpwg.org/specs/rfc9114.html#header-formatting). Chrome and
   * > Firefox ignore them in HTTP/2 responses, but Safari conforms to the HTTP/2
   * > spec requirements and does not load any response that contains them.
   *
   * All [hop-by-hop headers](/en-US/docs/Web/HTTP/Guides/Compression#hop-by-hop_compression), including the standard hop-by-hop headers ([Keep-Alive](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Keep-Alive),
   * [Transfer-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Transfer-Encoding), [TE](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/TE), `Connection`,
   * [Trailer](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Trailer), [Upgrade](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Upgrade),
   * [Proxy-Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Proxy-Authorization), and [Proxy-Authenticate](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Proxy-Authenticate)) must be listed in the `Connection`
   * header, so that the first proxy knows it has to consume them and not forward them
   * further.
   *
   * The default value of `Connection` changed between HTTP/1.0 and HTTP/1.1.
   * Therefore, to ensure backwards compatibility, browsers often send `Connection: keep-alive` explicitly, even though it's the default in HTTP/1.1.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Connection: keep-alive
   * Connection: close
   * ```
   *
   * ## Directives
   *
   * - `close`
   *   - : Indicates that either the client or the server would like to close the connection.
   *     This is the default on HTTP/1.0 requests.
   * - any comma-separated list of HTTP headers (usually `keep-alive` only)
   *   - : Indicates that the client would like to keep the connection open. Keeping a connection open
   *     is the default on HTTP/1.1 requests. The list of headers are the
   *     name of the header to be removed by the first non-transparent proxy or cache
   *     in-between: these headers define the connection between the emitter and the first
   *     entity, not the destination node.
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Connection management in HTTP/1.x](/en-US/docs/Web/HTTP/Guides/Connection_management_in_HTTP_1.x)
   * - [Protocol upgrade mechanism](/en-US/docs/Web/HTTP/Guides/Protocol_upgrade_mechanism)
   */
  'Connection' = 'Connection',

  /**
   * The HTTP **`Content-Digest`** [request](https://developer.mozilla.org/en-US/docs/Glossary/request_header) and [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) provides a [digest](https://developer.mozilla.org/en-US/docs/Glossary/hash_function) calculated using a hashing algorithm applied to the message content.
   * A recipient can use the `Content-Digest` to validate the HTTP message content for integrity purposes.
   *
   * The [Want-Content-Digest](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Want-Content-Digest) field lets a sender request a `Content-Digest` along with their hashing algorithm preferences.
   * A content digest will differ based on [Content-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding) and [Content-Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Range), but not [Transfer-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Transfer-Encoding).
   *
   * In certain cases, a [Repr-Digest](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Repr-Digest) can be used to validate the integrity of partial or multipart messages against the full representation.
   * For example, in [range requests](/en-US/docs/Web/HTTP/Guides/Range_requests), a `Repr-Digest` will always have the same value if only the requested byte ranges differ, whereas the content digest will be different for each part.
   * For this reason, a `Content-Digest` is identical to a [Repr-Digest](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Repr-Digest) when a representation is sent in a single message.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Content-Digest: <digest-algorithm>=<digest-value>
   *
   * // Multiple digest algorithms
   * Content-Digest: <digest-algorithm>=<digest-value>,<digest-algorithm>=<digest-value>, …
   * ```
   *
   * ## Directives
   *
   * - `<digest-algorithm>`
   *   - : The algorithm used to create a digest of the message content.
   *     Only two registered digest algorithms are considered secure: `sha-512` and `sha-256`.
   *     The insecure (legacy) registered digest algorithms are: `md5`, `sha` (SHA-1), `unixsum`, `unixcksum`, `adler` (ADLER32) and `crc32c`.
   * - `<digest-value>`
   *   - : The digest in bytes of the message content using the `<digest-algorithm>`.
   *     The choice of digest algorithm also determines the encoding to use: `sha-512` and `sha-256` use [base64](https://developer.mozilla.org/en-US/docs/Glossary/base64) encoding, while some legacy digest algorithms such as `unixsum` use a decimal integer.
   *     In contrast to earlier drafts of the specification, the standard base64-encoded digest bytes are wrapped in colons (`:`, ASCII 0x3A) as part of the [dictionary syntax](https://www.rfc-editor.org/rfc/rfc8941#name-byte-sequences).
   *
   * ## Description
   *
   * A `Digest` header was defined in previous specifications, but it proved problematic as the scope of what the digest applied to was not clear.
   * Specifically, it was difficult to distinguish whether a digest applied to the entire resource representation or to the specific content of a HTTP message.
   * As such, two separate headers were specified (`Content-Digest` and `Repr-Digest`) to convey HTTP message content digests and resource representation digests, respectively.
   *
   * ## Examples
   *
   * ### User-agent request for a SHA-256 Content-Digest
   *
   * In the following example, a user-agent requests a digest of the message content with a preference for SHA-256, followed by SHA-1 at a lower preference:
   *
   * ```http
   * GET /items/123 HTTP/1.1
   * Host: example.com
   * Want-Content-Digest: sha-256=10, sha=3
   * ```
   *
   * The server responds with a `Content-Digest` of the message content using the SHA-256 algorithm:
   *
   * ```http
   * HTTP/1.1 200 OK
   * Content-Type: application/json
   * Content-Digest: sha-256=:RK/0qy18MlBSVnWgjwz6lZEWjP/lF5HF9bvEF8FabDg=:
   *
   * {"hello": "world"}
   * ```
   *
   * ### Identical Content-Digest and Repr-Digest values
   *
   * A user-agent requests a resource without a `Want-Content-Digest` field:
   *
   * ```http
   * GET /items/123 HTTP/1.1
   * Host: example.com
   * ```
   *
   * The server is configured to send unsolicited digest headers in responses.
   * The `Repr-Digest` and `Content-Digest` fields have matching values because they are using the same algorithm, and in this case the whole resource is sent in one message:
   *
   * ```http
   * HTTP/1.1 200 OK
   * Content-Type: application/json
   * Content-Length: 19
   * Content-Digest: sha-256=:RK/0qy18MlBSVnWgjwz6lZEWjP/lF5HF9bvEF8FabDg=:
   * Repr-Digest: sha-256=:RK/0qy18MlBSVnWgjwz6lZEWjP/lF5HF9bvEF8FabDg=:
   *
   * {"hello": "world"}
   * ```
   *
   * ### Diverging Content-Digest and Repr-Digest values
   *
   * If the same request is repeated as the previous example, but uses a [HEAD](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/HEAD) method instead of a [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET), the `Repr-Digest` and `Content-Digest` fields will be different:
   *
   * ```http
   * GET /items/123 HTTP/1.1
   * Host: example.com
   * ```
   *
   * The `Repr-Digest` value will be the same as before, but there is no message body, so a different `Content-Digest` would be sent by the server:
   *
   * ```http
   * HTTP/1.1 200 OK
   * Content-Type: application/json
   * Content-Digest: sha-256=:47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=:
   * Repr-Digest: sha-256=:RK/0qy18MlBSVnWgjwz6lZEWjP/lF5HF9bvEF8FabDg=:
   * ```
   *
   * ### User-agent sending a Content-Digest in requests
   *
   * In the following example, a user-agent sends a digest of the message content using SHA-512.
   * It sends both a `Content-Digest` and a `Repr-Digest`, which differ from each other because of the `Content-Encoding`:
   *
   * ```http
   * POST /bank_transfer HTTP/1.1
   * Host: example.com
   * Content-Encoding: zstd
   * Content-Digest: sha-512=:ABC…=:
   * Repr-Digest: sha-512=:DEF…=:
   *
   * {
   *  "recipient": "Alex",
   *  "amount": 900000000
   * }
   * ```
   *
   * The server may calculate a digest of the content it has received and compare the result with the `Content-Digest` or `Repr-Digest` headers to validate the message integrity.
   * In requests like the example above, the `Repr-Digest` is more useful to the server as this is calculated over the decoded representation and would be more consistent in different scenarios.
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * This header has no specification-defined browser integration ("browser compatibility" does not apply).
   * Developers can set and get HTTP headers using `fetch()` in order to provide application-specific implementation behavior.
   *
   * ## See also
   *
   * - [Want-Content-Digest](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Want-Content-Digest) header to request a content digest
   * - [Repr-Digest](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Repr-Digest), [Want-Repr-Digest](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Want-Repr-Digest) representation digest headers
   * - [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag)
   * - [Digital Signatures for APIs](https://developer.ebay.com/develop/guides/digital-signatures-for-apis) SDK guide uses `Content-Digest`s for digital signatures in HTTP calls (developer.ebay.com)
   */
  'Content-Digest' = 'Content-Digest',

  /**
   * The HTTP **`Content-Disposition`** header indicates whether content should be displayed _inline_ in the browser as a web page or part of a web page or downloaded as an _attachment_ locally.
   *
   * In a multipart body, the header must be used on each subpart to provide information about its corresponding field. The subpart is delimited by the _boundary_ defined in the [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) header. When used on the body itself, `Content-Disposition` has no effect.
   *
   * The `Content-Disposition` header is defined in the larger context of MIME messages for email, but only a subset of the possible parameters apply to HTTP forms and [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/POST) requests. Only the value `form-data`, as well as the optional directive `name` and `filename`, can be used in the HTTP context.
   *
   *
   * ```
   *
   * The HTML file will be downloaded rather than displayed in the browser.
   * Most browsers will prompt users to save it with the `cool.html` file name by default (as specified in the `filename` directive).
   *
   * ### HTML posting multipart/form-data content type
   *
   * The following example shows an HTML form sent using `multipart/form-data` using the `Content-Disposition` header.
   * In practice, the boundary value `delimiter123` would be a browser-generated string like `----8721656041911415653955004498`:
   *
   * ```http
   * POST /test.html HTTP/1.1
   * Host: example.org
   * Content-Type: multipart/form-data;boundary="delimiter123"
   *
   * --delimiter123
   * Content-Disposition: form-data; name="field1"
   *
   * value1
   * --delimiter123
   * Content-Disposition: form-data; name="field2"; filename="example.txt"
   *
   * value2
   * --delimiter123--
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [HTML Forms](/en-US/docs/Learn_web_development/Extensions/Forms)
   * - The [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) defining the boundary of the multipart body.
   * - The [FormData](https://developer.mozilla.org/en-US/docs/domxref/FormData) interface used to prepare form data for use in the [fetch()](https://developer.mozilla.org/en-US/docs/domxref/Window/fetch) or [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/domxref/XMLHttpRequest) APIs.
   */
  'Content-Disposition' = 'Content-Disposition',

  /**
   * The HTTP **`Content-DPR`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) is used to confirm the _image_ device to pixel ratio (DPR) in requests where the screen [DPR](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/DPR) client hint was used to select an image resource.
   *
   * > [!NOTE]
   * > The `Content-DPR` header was removed from the client hints specification in [draft-ietf-httpbis-client-hints-07](https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-client-hints-07).
   * > The [Responsive Image Client Hints](https://wicg.github.io/responsive-image-client-hints/) specification proposes to replace this header by specifying intrinsic resolution/dimensions in EXIF metadata.
   *
   * If the `DPR` client hint is used to select an image, the server must specify `Content-DPR` in the response.
   * If the value in `Content-DPR` is different from the [DPR](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/DPR) value in the request (i.e., image DPR is not the same as screen DPR), the client must use the `Content-DPR` for determining intrinsic image size and scaling the image.
   *
   * If the `Content-DPR` header appears more than once in a message, the last occurrence is used.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Content-DPR: <number>
   * ```
   *
   * ## Directives
   *
   * - `<number>`
   *   - : The image device pixel ratio, calculated according to the following formula:
   *     Content-DPR = _Selected image resource size_ / (_Width_ / _DPR_)
   *
   * ## Examples
   *
   * See the [`DPR`](/en-US/docs/Web/HTTP/Reference/Headers/DPR#examples) header example.
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - Device client hints
   *   - [Device-Memory](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Device-Memory)
   *   - [DPR](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/DPR)
   *   - [Viewport-Width](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Viewport-Width)
   *   - [Width](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Width)
   * - [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH)
   * - [HTTP Caching: Vary](/en-US/docs/Web/HTTP/Guides/Caching#vary) and [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary)
   * - [Improving user privacy and developer experience with User-Agent Client Hints](https://developer.chrome.com/docs/privacy-security/user-agent-client-hints) on developer.chrome.com (2020)
   */
  'Content-DPR' = 'Content-DPR',

  /**
   * The HTTP **`Content-Encoding`** [representation header](https://developer.mozilla.org/en-US/docs/Glossary/representation_header) lists the encodings and the order in which they have been applied to a resource.
   * This lets the recipient know how to decode the data in order to obtain the original content format described in the [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) header.
   * Content encoding is mainly used to compress content without losing information about the original media type.
   *
   * Servers should compress data as much as possible, and should use content encoding where appropriate.
   * Compressing already compressed media types, such as .zip or .jpeg, is usually not appropriate because it can increase the file size.
   * If the original media is already encoded (e.g., as a .zip file), this information is not included in the `Content-Encoding` header.
   *
   * When the `Content-Encoding` header is present, other metadata (e.g., [Content-Length](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Length)) refer to the encoded form of the data, not the original resource, unless explicitly stated.
   * Content encoding differs to [Transfer-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Transfer-Encoding) in that `Transfer-Encoding` handles how HTTP messages themselves are delivered across the network on a [hop-by-hop basis](/en-US/docs/Web/HTTP/Reference/Headers#hop-by-hop_headers).
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Content-Encoding: gzip
   * Content-Encoding: compress
   * Content-Encoding: deflate
   * Content-Encoding: br
   * Content-Encoding: zstd
   * Content-Encoding: dcb
   * Content-Encoding: dcz
   *
   * // Multiple, in the order in which they were applied
   * Content-Encoding: deflate, gzip
   * ```
   *
   * ## Directives
   *
   * - `gzip`
   *   - : A format using the [Lempel-Ziv coding](https://en.wikipedia.org/wiki/LZ77_and_LZ78#LZ77) (LZ77), with a 32-bit CRC.
   *     This is the original format of the UNIX _gzip_ program.
   *     The HTTP/1.1 standard also recommends that the servers supporting this content-encoding should recognize `x-gzip` as an alias, for compatibility purposes.
   * - `compress`
   *   - : A format using the [Lempel-Ziv-Welch](https://en.wikipedia.org/wiki/LZW) (LZW) algorithm.
   *     The value name was taken from the UNIX _compress_ program, which implemented this algorithm.
   *     Like the compress program, which has disappeared from most UNIX distributions, this content-encoding is not used by many browsers today, partly because of a patent issue (it expired in 2003).
   * - `deflate`
   *   - : Using the [zlib](https://en.wikipedia.org/wiki/Zlib) structure (defined in ) with the [deflate](https://en.wikipedia.org/wiki/Deflate) compression algorithm (defined in ).
   * - `br`
   *   - : A format using the [Brotli](https://developer.mozilla.org/en-US/docs/glossary/Brotli_compression) algorithm structure (defined in ).
   * - `zstd`
   *   - : A format using the [Zstandard](https://developer.mozilla.org/en-US/docs/glossary/Zstandard_compression) algorithm structure (defined in ).
   * - `dcb`
   *   - : A format that uses the [Dictionary-Compressed Brotli algorithm](https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-compression-dictionary#name-dictionary-compressed-brotl). See [Compression Dictionary Transport](/en-US/docs/Web/HTTP/Guides/Compression_dictionary_transport).
   *
   * - `dcz`
   *   - : A format that uses the [Dictionary-Compressed Zstandard algorithm](https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-compression-dictionary#name-dictionary-compressed-zstan). See [Compression Dictionary Transport](/en-US/docs/Web/HTTP/Guides/Compression_dictionary_transport).
   *
   * ## Examples
   *
   * ### Compressing with gzip
   *
   * On the client side, you can advertise a list of compression schemes that will be sent along in an HTTP request. The [Accept-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding) header is used for negotiating content encoding.
   *
   * ```http
   * Accept-Encoding: gzip, deflate
   * ```
   *
   * The server responds with the scheme used, indicated by the `Content-Encoding` response header.
   *
   * ```http
   * Content-Encoding: gzip
   * ```
   *
   * Whether a server uses compression methods requested by the client depends on server configuration and capabilities.
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Accept-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding)
   * - [Transfer-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Transfer-Encoding)
   * - [Brotli compression](https://developer.mozilla.org/en-US/docs/Glossary/Brotli_compression)
   * - [GZip compression](https://developer.mozilla.org/en-US/docs/Glossary/GZip_compression)
   * - [Zstandard compression](https://developer.mozilla.org/en-US/docs/Glossary/Zstandard_compression)
   * - [Compression Dictionary Transport guide](/en-US/docs/Web/HTTP/Guides/Compression_dictionary_transport)
   */
  'Content-Encoding' = 'Content-Encoding',

  /**
   * The HTTP **`Content-Language`** [representation header](https://developer.mozilla.org/en-US/docs/Glossary/representation_header) is used to describe the language(s) intended for the audience, so users can differentiate it according to their own preferred language.
   *
   * For example, `Content-Language: de-DE` indicates that the document is intended for German language speakers. The document may be written in English, not German, as part of a language course for German speakers. To indicate the language the document is **written in**, use the [`lang`](/en-US/docs/Web/HTML/Reference/Global_attributes/lang) attribute instead.
   *
   * If no `Content-Language` is specified, the default is that the content is intended for all language audiences. Multiple language tags are also possible, as well as applying the `Content-Language` header to various media types and not only to textual documents.
   *
   *
   * ```
   *
   * Do **not** use this meta element to state the document language, as shown below:
   *
   * ```html example-bad
   * <meta http-equiv="content-language" content="de" />
   * ```
   *
   * ### Indicating a target audience for a resource
   *
   * The `Content-Language` header is used to specify the **page's intended audience** and can indicate that this is more than one language.
   *
   * ```http
   * Content-Language: de, en
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Accept-Language](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language)
   * - [HTTP headers, meta elements and language information](https://www.w3.org/International/questions/qa-http-and-lang.en)
   * - [HTML `lang` attribute](/en-US/docs/Web/HTML/Reference/Global_attributes/lang)
   */
  'Content-Language' = 'Content-Language',

  /**
   * The HTTP **`Content-Length`** header indicates the size, in bytes, of the message body sent to the recipient.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Content-Length: <length>
   * ```
   *
   * ## Directives
   *
   * - `<length>`
   *   - : The length in octets.
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Transfer-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Transfer-Encoding)
   */
  'Content-Length' = 'Content-Length',

  /**
   * The HTTP **`Content-Location`** [representation header](https://developer.mozilla.org/en-US/docs/Glossary/representation_header) indicates an alternate location for the returned data.
   * It's main use is to indicate the URL of a resource transmitted as the result of [content negotiation](/en-US/docs/Web/HTTP/Guides/Content_negotiation).
   *
   * The `Content-Location` header is different from the [Location](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Location) header.
   * `Content-Location` indicates the direct URL to access the resource when [content negotiation](/en-US/docs/Web/HTTP/Guides/Content_negotiation) has happened, allowing the client to bypass future content negotiation for this resource.
   * `Location`, on the other hand, indicates either the target of a `3XX` redirection or the URL of a newly created resource in a [201 Created](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201) response.
   *
   *
   *
   * (Lots more HTML…)
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Location](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Location)
   */
  'Content-Location' = 'Content-Location',

  /**
   * The HTTP **`Content-Range`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) is used in [range requests](/en-US/docs/Web/HTTP/Guides/Range_requests) to indicate where the content of a response body belongs in relation to a complete resource.
   *
   * It should only be included in [206 Partial Content](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/206) or [416 Range Not Satisfiable](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/416) responses.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Content-Range: <unit> <range>/<size>
   * Content-Range: <unit> <range>/*
   * Content-Range: <unit> * /<size>
   * ```
   *
   * ## Directives
   *
   * - `<unit>`
   *   - : The unit for specifying ranges.
   *     Currently, only `bytes` is supported.
   * - `<range>`
   *   - : A range with the format `<range-start>-<range-end>`, where `<range-start>` and `<range-end>` are integers for the start and end position (zero-indexed & inclusive) of the range in the given `<unit>`, respectively.
   *     `*` is used in a [416 Range Not Satisfiable](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/416) response to indicate that the value is not a range.
   * - `<size>`
   *   - : The total length of the document (or `*` if unknown).
   *
   * ## Examples
   *
   * ### Partial content response
   *
   * This [206 Partial Content](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/206) response shows a partial response, with the `Content-Range` indicating that it contains the first 1024 bytes of a 146515 byte file.
   *
   * ```http
   * HTTP/2 206
   * content-type: image/jpeg
   * content-length: 1024
   * content-range: bytes 0-1023/146515
   * …
   *
   * (binary content)
   * ```
   *
   * ### Range not satisfiable
   *
   * If the server cannot satisfy the requested range request, it should respond with a [416 Range Not Satisfiable](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/416) status, and the `Content-Range` should specify `*` for the range along with the total size of the resource.
   *
   * ```http
   * HTTP/2 416
   *
   * Content-Range: bytes * /67589
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [HTTP range requests](/en-US/docs/Web/HTTP/Guides/Range_requests) guide
   * - [If-Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Range), [Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Range) headers
   * - [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type)
   * - [206 Partial Content](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/206), [416 Range Not Satisfiable](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/416) status codes
   */
  'Content-Range' = 'Content-Range',

  /**
   * The HTTP **`Content-Security-Policy-Report-Only`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) helps to monitor Content Security Policy (CSP) violations and their effects without enforcing the security policies.
   * This header allows you to test or repair violations before a specific [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) is applied and enforced.
   *
   * The CSP [report-to](https://developer.mozilla.org/en-US/docs/CSP/report-to) directive must be specified for reports to be sent: if not, the operation won't have any effect.
   *
   * Violation reports are sent using the [Reporting API](/en-US/docs/Web/API/Reporting_API) to endpoints defined in a [Reporting-Endpoints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Reporting-Endpoints) HTTP response header and selected using the CSP [report-to](https://developer.mozilla.org/en-US/docs/CSP/report-to) directive.
   *
   * For more information, see our [Content Security Policy (CSP)](/en-US/docs/Web/HTTP/Guides/CSP) guide.
   *
   * > [!NOTE]
   * > The header can also be used with the deprecated [report-uri](https://developer.mozilla.org/en-US/docs/CSP/report-uri) directive (this is being replaced by [report-to](https://developer.mozilla.org/en-US/docs/CSP/report-to)).
   * > The usage and resulting report syntax is slightly different; see the [report-uri](https://developer.mozilla.org/en-US/docs/CSP/report-uri) topic for more details.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Content-Security-Policy-Report-Only: <policy-directive>; …; <policy-directive>; report-to <endpoint-name>
   * ```
   *
   * ## Directives
   *
   * The `Content-Security-Policy-Report-Only` header supports all [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) directives except `sandbox`, which is ignored.
   *
   * > [!NOTE]
   * > The CSP [report-to](https://developer.mozilla.org/en-US/docs/CSP/report-to) directive should be used with this header or it will have no effect.
   *
   * ## Examples
   *
   * ### Using Content-Security-Policy-Report-Only to send CSP reports
   *
   * To use the [report-to](https://developer.mozilla.org/en-US/docs/CSP/report-to) directive, you first need to define a corresponding endpoint using the [Reporting-Endpoints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Reporting-Endpoints) response header.
   * In the example below, we define a single endpoint named `csp-endpoint`.
   *
   * ```http
   * Reporting-Endpoints: csp-endpoint="https://example.com/csp-reports"
   * ```
   *
   * We can then define the destination of the report using [report-to](https://developer.mozilla.org/en-US/docs/CSP/report-to) and [report-uri](https://developer.mozilla.org/en-US/docs/CSP/report-uri), as shown below.
   * Note that this particular report would be triggered if the page loaded resources insecurely, or from inline code.
   *
   * ```http
   * Content-Security-Policy-Report-Only: default-src https:;
   *   report-uri /csp-report-url/;
   *   report-to csp-endpoint;
   * ```
   *
   * > [!NOTE]
   * > The `report-to` directive is preferred over the deprecated `report-uri`, but we declare both because `report-to` does not yet have full cross-browser support.
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy)
   * - CSP [report-to](https://developer.mozilla.org/en-US/docs/CSP/report-to) directive
   * - CSP [report-uri](https://developer.mozilla.org/en-US/docs/CSP/report-uri) directive
   */
  'Content-Security-Policy-Report-Only' = 'Content-Security-Policy-Report-Only',

  /**
   * The HTTP **`Content-Security-Policy`** response header allows website administrators to control resources the user agent is allowed to load for a given page. With a few exceptions, policies mostly involve specifying server origins and script endpoints.
   * This helps guard against [cross-site scripting](https://developer.mozilla.org/en-US/docs/Glossary/cross-site_scripting) attacks.
   *
   * See the [Content Security Policy (CSP)](/en-US/docs/Web/HTTP/Guides/CSP) guide for details about how a CSP is delivered to the browser, what it looks like, along with use cases and deployment strategies.
   *
   *
   * > ```
   * >
   * > If an attacker can inject an inline `<script>` element containing this code, the CSP will allow it to execute automatically.
   * >
   * > However, `'unsafe-hashes'` is much safer than `'unsafe-inline'`.
   *
   * ### 'inline-speculation-rules'
   *
   * By default, if a CSP contains a `default-src` or a `script-src` directive, then inline JavaScript is not allowed to execute. The `'inline-speculation-rules'` allows the browser to load inline `<script>` elements that have a [`type`](/en-US/docs/Web/HTML/Reference/Elements/script/type) attribute of [`speculationrules`](/en-US/docs/Web/HTML/Reference/Elements/script/type/speculationrules).
   *
   * See the [Speculation Rules API](/en-US/docs/Web/API/Speculation_Rules_API) for more information.
   *
   * ### 'strict-dynamic'
   *
   * The `'strict-dynamic'` keyword makes the trust conferred on a script by a [nonce](#nonce-nonce_value) or a [hash](#hash_algorithm-hash_value) extend to scripts that this script dynamically loads, for example by creating new `<script>` tags using [Document.createElement()](https://developer.mozilla.org/en-US/docs/domxref/Document.createElement()) and then inserting them into the document using [Node.appendChild()](https://developer.mozilla.org/en-US/docs/domxref/Node.appendChild()).
   *
   * If this keyword is present in a directive, then the following source expression values are all ignored:
   *
   * - [\<host-source>](#host-source)
   * - [\<scheme-source>](#scheme-source)
   * - [`'self'`](#self)
   * - [`'unsafe-inline'`](#unsafe-inline)
   *
   * See [The `strict-dynamic` keyword](/en-US/docs/Web/HTTP/Guides/CSP#the_strict-dynamic_keyword) in the CSP guide for more usage information.
   *
   * ### 'report-sample'
   *
   * If this expression is included in a directive controlling scripts or styles, and the directive causes the browser to block any inline scripts, inline styles, or event handler attributes, then the [violation report](/en-US/docs/Web/HTTP/Guides/CSP#violation_reporting) that the browser generates will contain a [sample](https://developer.mozilla.org/en-US/docs/domxref/CSPViolationReportBody.sample) property containing the first 40 characters of the blocked resource.
   *
   * ## CSP in workers
   *
   * [Workers](/en-US/docs/Web/API/Worker) are in general _not_ governed
   * by the content security policy of the document (or parent worker) that created them. To
   * specify a content security policy for the worker, set a
   * `Content-Security-Policy` response header for the request which requested the
   * worker script itself.
   *
   * The exception to this is if the worker script's origin is a globally unique identifier
   * (for example, if its URL has a scheme of data or blob). In this case, the worker does
   * inherit the content security policy of the document or worker that created it.
   *
   * ## Multiple content security policies
   *
   * The CSP mechanism allows multiple policies being specified for a resource, including
   * via the `Content-Security-Policy` header, the
   * [Content-Security-Policy-Report-Only](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy-Report-Only) header and a
   * [meta](https://developer.mozilla.org/en-US/docs/HTMLElement/meta) element.
   *
   * You can use the `Content-Security-Policy` header more than once, as in the
   * example below. Pay special attention to the [connect-src](https://developer.mozilla.org/en-US/docs/CSP/connect-src) directive here. Even
   * though the second policy would allow the connection, the first policy contains
   * `connect-src 'none'`. Adding additional policies _can only further
   * restrict_ the capabilities of the protected resource, which means that there will
   * be no connection allowed and, as the strictest policy, `connect-src 'none'`
   * is enforced.
   *
   * ```http
   * Content-Security-Policy: default-src 'self' http://example.com;
   *                           connect-src 'none';
   * Content-Security-Policy: connect-src http://example.com/;
   *                           script-src http://example.com/
   * ```
   *
   * ## Examples
   *
   * ### Disable unsafe inline code and only allow HTTPS resources
   *
   * This HTTP header sets the default policy to only allow resource loading (images, fonts, scripts, etc.) over HTTPS.
   * Because the `unsafe-inline` and `unsafe-eval` directives are not set, inline scripts will be blocked.
   *
   * ```http
   * Content-Security-Policy: default-src https:
   * ```
   *
   * The same restrictions can be applied using the HTML [meta](https://developer.mozilla.org/en-US/docs/htmlelement/meta) element.
   *
   * ```html
   * <meta http-equiv="Content-Security-Policy" content="default-src https:" />
   * ```
   *
   * ### Allow inline code and HTTPS resources, but disable plugins
   *
   * This policy could be used on a pre-existing site that uses too much inline code to fix, to ensure resources are loaded only over HTTPS and disable plugins:
   *
   * ```http
   * Content-Security-Policy: default-src https: 'unsafe-eval' 'unsafe-inline'; object-src 'none'
   * ```
   *
   * ### Report but don't enforce violations when testing
   *
   * This example sets the same restrictions as the previous example, but using the [Content-Security-Policy-Report-Only](https://developer.mozilla.org/en-US/docs/httpheader/Content-Security-Policy-Report-Only) header and the [report-to](https://developer.mozilla.org/en-US/docs/CSP/report-to) directive.
   * This approach is used during testing to report violations but not block code from executing.
   *
   * Endpoints (URLs) to send reports to are defined using the [Reporting-Endpoints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Reporting-Endpoints) HTTP response header.
   *
   * ```http
   * Reporting-Endpoints: csp-endpoint="https://example.com/csp-reports"
   * ```
   *
   * A particular endpoint is then selected as the report target in the CSP policy using the [report-to](https://developer.mozilla.org/en-US/docs/CSP/report-to) directive.
   *
   * ```http
   * Content-Security-Policy-Report-Only: default-src https:; report-uri /csp-violation-report-url/; report-to csp-endpoint
   * ```
   *
   * Note that the [report-uri](https://developer.mozilla.org/en-US/docs/CSP/report-uri)  directive is also specified above because `report-to` is not yet broadly supported by browsers.
   *
   * See [Content Security Policy (CSP) implementation](/en-US/docs/Web/Security/Practical_implementation_guides/CSP) for more examples.
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Content-Security-Policy-Report-Only](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy-Report-Only)
   * - [Learn about: Content Security Policy](/en-US/docs/Web/HTTP/Guides/CSP)
   * - [Content Security in WebExtensions](/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_Security_Policy)
   * - [Adopting a strict policy](https://csp.withgoogle.com/docs/strict-csp.html)
   * - [CSP Evaluator](https://github.com/google/csp-evaluator) - Evaluate your
   *   Content Security Policy
   */
  'Content-Security-Policy' = 'Content-Security-Policy',

  /**
   * The HTTP **`Content-Type`** [representation header](https://developer.mozilla.org/en-US/docs/Glossary/representation_header) is used to indicate the original [media type](https://developer.mozilla.org/en-US/docs/Glossary/MIME_type) of a resource before any content encoding is applied.
   *
   * In responses, the `Content-Type` header informs the client about the media type of the returned data.
   * In requests such as [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/POST) or [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/PUT), the client uses the `Content-Type` header to specify the type of content being sent to the server.
   * If a server implementation or configuration is strict about content type handling, a [415](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/415) client error response may be returned.
   *
   * The `Content-Type` header differs from [Content-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding) in that `Content-Encoding` helps the recipient understand how to decode data to its original form.
   *
   * > [!NOTE]
   * > This value may be ignored if browsers perform [MIME sniffing](/en-US/docs/Web/HTTP/Guides/MIME_types#mime_sniffing) (or content sniffing) on responses.
   * > To prevent browsers from using MIME sniffing, set the [X-Content-Type-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options) header value to `nosniff`.
   * > See [MIME type verification](/en-US/docs/Web/Security/Practical_implementation_guides/MIME_types) for more details.
   *
   *
   * ```
   *
   * ```http
   * POST /submit HTTP/1.1
   * Host: example.com
   * Content-Type: application/x-www-form-urlencoded
   * Content-Length: 15
   *
   * comment=Hello!
   * ```
   *
   * ### `Content-Type` in a REST API using JSON
   *
   * Many [REST](https://developer.mozilla.org/en-US/docs/Glossary/REST) APIs use `application/json` as a content type which is convenient for machine-to-machine communication or programmatic interaction.
   * The following example shows a [201 Created](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201) response showing the result of a successful request:
   *
   * ```http
   * HTTP/1.1 201 Created
   * Content-Type: application/json
   *
   * {
   *   "message": "New user created",
   *   "user": {
   *     "id": 123,
   *     "firstName": "Paul",
   *     "lastName": "Klee",
   *     "email": "p.klee@example.com"
   *   }
   * }
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Accept](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept), [Accept-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding), [Accept-Language](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language) headers
   * - [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary)
   * - [Content-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding)
   * - [Content-Disposition](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition)
   * - [206 Partial Content](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/206)
   * - [X-Content-Type-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options)
   */
  'Content-Type' = 'Content-Type',

  /**
   * The HTTP **`Cookie`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) contains stored [HTTP cookies](/en-US/docs/Web/HTTP/Guides/Cookies) associated with the server (i.e., previously sent by the server with the [Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie) header or set in JavaScript using [Document.cookie](https://developer.mozilla.org/en-US/docs/domxref/Document.cookie)).
   *
   * The `Cookie` header is optional and may be omitted if, for example, the browser's privacy settings block cookies.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Cookie: <cookie-list>
   * Cookie: name=value
   * Cookie: name=value; name2=value2; name3=value3
   * ```
   *
   * ## Directives
   *
   * - `<cookie-list>`
   *   - : A list of name-value pairs in the form of `<cookie-name>=<cookie-value>`.
   *     Pairs in the list are separated by a semicolon and a space.
   *
   * ## Examples
   *
   * ```http
   * Cookie: PHPSESSID=298zf09hf012fh2; csrftoken=u32t4o3tb3gg43; _gat=1
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [413 Content Too Large](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/413)
   * - [Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)
   * - [Document.cookie](https://developer.mozilla.org/en-US/docs/domxref/Document.cookie)
   */
  'Cookie' = 'Cookie',

  /**
   * The HTTP **`Critical-CH`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) is used along with [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH) to identify the accepted [client hints](/en-US/docs/Web/HTTP/Guides/Client_hints) that are [critical](/en-US/docs/Web/HTTP/Guides/Client_hints#critical_client_hints).
   *
   * User agents receiving a response with `Critical-CH` must check if the indicated critical headers were sent in the original request. If not, the user agent will retry the request along with the critical headers rather than render the page. This approach ensures that client preferences set using critical client hints are always used, even if not included in the first request, or following server configuration changes.
   *
   * Each header listed in the `Critical-CH` header should also be present in the `Accept-CH` and `Vary` headers.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Critical-CH: <ch-list>
   * ```
   *
   * ### Directives
   *
   * - `<ch-list>`
   *   - : A list of one or more comma-delimited client hint headers that the server considers to be critical client hints.
   *
   * ## Examples
   *
   * The client makes an initial request to the server:
   *
   * ```http
   * GET / HTTP/1.1
   * Host: example.com
   * ```
   *
   * The server responds, indicating via [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH) that it accepts [Sec-CH-Prefers-Reduced-Motion](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-CH-Prefers-Reduced-Motion). In this example, `Critical-CH` is also used to specify that `Sec-CH-Prefers-Reduced-Motion` is considered a critical client hint.
   *
   * ```http
   * HTTP/1.1 200 OK
   * Content-Type: text/html
   * Accept-CH: Sec-CH-Prefers-Reduced-Motion
   * Vary: Sec-CH-Prefers-Reduced-Motion
   * Critical-CH: Sec-CH-Prefers-Reduced-Motion
   * ```
   *
   * > [!NOTE]
   * > We've specified `Sec-CH-Prefers-Reduced-Motion` in the [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) header to indicate that responses should be separately cached based on the value of this header (even if the URL stays the same).
   * > Each header listed in the `Critical-CH` header should also be present in the `Accept-CH` and `Vary` headers.
   *
   * The client automatically retries the request (due to `Critical-CH` being specified above), telling the server via `Sec-CH-Prefers-Reduced-Motion` that it has a user preference for reduced-motion animations:
   *
   * ```http
   * GET / HTTP/1.1
   * Host: example.com
   * Sec-CH-Prefers-Reduced-Motion: "reduce"
   * ```
   *
   * The client will include the header in subsequent requests in the current session unless the `Accept-CH` changes in responses to indicate that it is no longer supported by the server.
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Client hints](/en-US/docs/Web/HTTP/Guides/Client_hints)
   * - [User-Agent Client Hints API](/en-US/docs/Web/API/User-Agent_Client_Hints_API)
   * - [Improving user privacy and developer experience with User-Agent Client Hints](https://developer.chrome.com/docs/privacy-security/user-agent-client-hints) (developer.chrome.com)
   * - [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH)
   * - [HTTP Caching: Vary](/en-US/docs/Web/HTTP/Guides/Caching#vary) and [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary)
   * - [PerformanceNavigationTiming.criticalCHRestart](https://developer.mozilla.org/en-US/docs/domxref/PerformanceNavigationTiming.criticalCHRestart)
   */
  'Critical-CH' = 'Critical-CH',

  /**
   * The HTTP **`Cross-Origin-Embedder-Policy`** (COEP) [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) configures the current document's policy for loading and embedding cross-origin resources.
   *
   * The policy for whether a particular resource is embeddable cross-site may be defined for that resource using the [Cross-Origin-Resource-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Resource-Policy) (CORP) header for a `no-cors` fetch, or using [CORS](/en-US/docs/Web/HTTP/Guides/CORS).
   * If neither of these policies are set, then by default, resources can be loaded or embedded into a document as though they had a CORP value of `cross-site`.
   *
   * The **`Cross-Origin-Embedder-Policy`** allows you to require that CORP or CORS headers be set in order to load cross-site resources into the current document.
   * You can also set the policy to keep the default behavior, or to allow the resources to be loaded, but strip any credentials that might otherwise be sent.
   * The policy applies to loaded resources, and resources in [iframe](https://developer.mozilla.org/en-US/docs/htmlelement/iframe)s and nested frames.
   *
   * > [!NOTE]
   * > The `Cross-Origin-Embedder-Policy` doesn't override or affect the embedding behavior for a resource for which CORP or CORS has been set.
   * > If CORP restricts a resource to being embedded only `same-origin`, it won't be loaded cross-origin into a resource irrespective of the COEP value.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Cross-Origin-Embedder-Policy: unsafe-none | require-corp | credentialless
   * ```
   *
   * ### Directives
   *
   * - `unsafe-none`
   *   - : Allows the document to load cross-origin resources **without** giving explicit permission through the CORS protocol or the [Cross-Origin-Resource-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Resource-Policy) header.
   *     This is the default value.
   * - `require-corp`
   *   - : A document can only load resources from the same origin, or resources explicitly marked as loadable from another origin.
   *
   *     Cross-origin resource loading will be blocked by COEP unless:
   *     - The resource is requested in `no-cors` mode and the response includes a [Cross-Origin-Resource-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Resource-Policy) header that allows it to be loaded into the document origin.
   *     - The resource is requested in `cors` mode and the resource supports and is permitted by CORS.
   *       This can be done, for example, in HTML using the [`crossorigin`](/en-US/docs/Web/HTML/Reference/Attributes/crossorigin) attribute, or in JavaScript by making a request with [`{mode="cors"}`](/en-US/docs/Web/API/RequestInit#cors).
   *
   * - `credentialless`
   *   - : A document can load cross-origin resources that are requested in [`no-cors` mode](/en-US/docs/Web/API/Request/mode) **without** an explicit permission via the [Cross-Origin-Resource-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Resource-Policy) header.
   *     In this case requests are sent without credentials: cookies are omitted in the request, and ignored in the response.
   *
   *     The cross-origin loading behavior for other [request modes](/en-US/docs/Web/API/Request/mode#cors) is the same as for [`require-corp`](#require-corp).
   *     For example, a cross-origin resource requested in `cors` mode must support (and be permitted by) CORS.
   *
   * ## Examples
   *
   * ### Features that depend on cross-origin isolation
   *
   * Certain features, such as access to [SharedArrayBuffer](https://developer.mozilla.org/en-US/docs/jsxref/SharedArrayBuffer) objects or using [Performance.now()](https://developer.mozilla.org/en-US/docs/domxref/Performance.now()) with unthrottled timers, are only available if your document is [cross-origin isolated","","nocode](https://developer.mozilla.org/en-US/docs/domxref/Window.crossOriginIsolated).
   *
   * To use these features in a document, you will need to set the COEP header with a value of `require-corp` or `credentialless`, and the [Cross-Origin-Opener-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy) header to `same-origin`.
   * In addition the feature must not be blocked by [Permissions-Policy: cross-origin-isolated](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy/cross-origin-isolated).
   *
   * ```http
   * Cross-Origin-Opener-Policy: same-origin
   * Cross-Origin-Embedder-Policy: require-corp
   * ```
   *
   * You can use the [Window.crossOriginIsolated](https://developer.mozilla.org/en-US/docs/domxref/Window.crossOriginIsolated) and [WorkerGlobalScope.crossOriginIsolated](https://developer.mozilla.org/en-US/docs/domxref/WorkerGlobalScope.crossOriginIsolated) properties to check if the features are restricted in window and worker contexts, respectively:
   *
   * ```js
   * const myWorker = new Worker("worker.js");
   *
   * if (crossOriginIsolated) {
   *   const buffer = new SharedArrayBuffer(16);
   *   myWorker.postMessage(buffer);
   * } else {
   *   const buffer = new ArrayBuffer(16);
   *   myWorker.postMessage(buffer);
   * }
   * ```
   *
   * ### Avoiding COEP blockage with CORS
   *
   * If you enable COEP using `require-corp` and want to embed a cross origin resource that supports [CORS](/en-US/docs/Web/HTTP/Guides/CORS), you will need to explicitly specify that it is requested in `cors` mode.
   *
   * For example, to fetch an image declared in HTML from a third-party site that supports CORS, you can use the [`crossorigin`](/en-US/docs/Web/HTML/Reference/Attributes/crossorigin) attribute so that it is requested in `cors` mode:
   *
   * ```html
   * <img src="https://thirdparty.com/img.png" crossorigin />
   * ```
   *
   * You can similarly use the [`HTMLScriptElement.crossOrigin`](/en-US/docs/Web/API/HTMLScriptElement/crossOrigin) attribute or fetch with `{ mode: 'cors' }` to request a file in CORS mode using JavaScript.
   *
   * If CORS is not supported for some images, a COEP value of `credentialless` can be used as an alternative to load the image without any explicit opt-in from the cross-origin server, at the cost of requesting it without cookies.
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Cross-Origin-Opener-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy)
   * - [Window.crossOriginIsolated](https://developer.mozilla.org/en-US/docs/domxref/Window.crossOriginIsolated) and [WorkerGlobalScope.crossOriginIsolated](https://developer.mozilla.org/en-US/docs/domxref/WorkerGlobalScope.crossOriginIsolated)
   * - [Cross Origin Opener Policy](https://web.dev/articles/why-coop-coep#coep) in _Why you need "cross-origin isolated" for powerful features_ on web.dev (2020)
   * - [COOP and COEP explained: Artur Janc, Charlie Reis, Anne van Kesteren](https://docs.google.com/document/d/1zDlfvfTJ_9e8Jdc8ehuV4zMEu9ySMCiTGMS9y0GU92k/edit?tab=t.0) (2020)
   */
  'Cross-Origin-Embedder-Policy' = 'Cross-Origin-Embedder-Policy',

  /**
   * The HTTP **`Cross-Origin-Opener-Policy`** (COOP) [response header](https://developer.mozilla.org/en-US/docs/glossary/response_header) allows a website to control whether a new top-level document, opened using [Window.open()](https://developer.mozilla.org/en-US/docs/domxref/Window.open()) or by navigating to a new page, is opened in the same [browsing context group](https://developer.mozilla.org/en-US/docs/glossary/Browsing_context) (BCG) or in a new browsing context group.
   *
   * When opened in a new BCG, any references between the new document and its opener are severed, and the new document may be process-isolated from its opener.
   * This ensures that potential attackers can't open your documents with [Window.open()](https://developer.mozilla.org/en-US/docs/domxref/Window.open()) and then use the returned value to access its global object, and thereby prevents a set of cross-origin attacks referred to as [XS-Leaks](https://xsleaks.dev/).
   *
   * It also means that any object opened by your document in a new BCG can't access it using [`window.opener`](/en-US/docs/Web/API/Window/opener).
   * This allows you to have more control over references to a window than [`rel=noopener`](/en-US/docs/Web/HTML/Reference/Attributes/rel/noopener), which affects outgoing navigations but not documents opened with [Window.open()](https://developer.mozilla.org/en-US/docs/domxref/Window.open()).
   *
   * The behavior depends on the policies of both the new document and its opener, and whether the new document is opened following a navigation or using [Window.open()](https://developer.mozilla.org/en-US/docs/domxref/Window.open()).
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Cross-Origin-Opener-Policy: unsafe-none
   * Cross-Origin-Opener-Policy: same-origin-allow-popups
   * Cross-Origin-Opener-Policy: same-origin
   * Cross-Origin-Opener-Policy: noopener-allow-popups
   * ```
   *
   * ### Directives
   *
   * - `unsafe-none`
   *   - : The document permits sharing its browsing context group with any other document, and may therefore be unsafe.
   *     It is used to opt-out a document from using COOP for process isolation.
   *     This is the default value.
   *
   *     On navigations, documents with `unsafe-none` will always open and be opened into a new BCG — unless the other document also has `unsafe-none` (or no COOP directive value).
   *
   *     Using `Window.open()`, documents with `unsafe-none` will always open documents with any other value into a new BCG.
   *     However documents with `unsafe-none` can be opened in the same BCG if the opener has the directive `same-origin-allow-popups`, `noopener-allow-popups`, or `unsafe-none`.
   *     A document with `same-origin` will always open a document with `unsafe-none` in a new BCG.
   *
   * - `same-origin`
   *   - : The document permits loading into BCGs that use COOP and contain only same-origin documents.
   *     This is used to provide [cross-origin isolation](/en-US/docs/Web/API/Window/crossOriginIsolated) for a BCG.
   *
   *     Documents with `same-origin` will only open and be opened in the same BCG if both documents are same-origin and have the `same-origin` directive.
   *
   * - `same-origin-allow-popups`
   *   - : This is similar to [`same-origin`](#same-origin) directive, except that it allows the opening of documents using [Window.open()](https://developer.mozilla.org/en-US/docs/domxref/Window.open()) in the same BCG if they have a COOP value of `unsafe-none`.
   *
   *     The directive is used to relax the `same-origin` restriction for integrations where a document needs the benefits of cross-origin isolation but also needs to open and retain a reference to trusted cross-origin documents.
   *     For example, when using a cross-origin service for OAuth or payments.
   *
   *     A document with this directive can open a document in the same BCG using [Window.open()](https://developer.mozilla.org/en-US/docs/domxref/Window.open()) if it has a COOP value of `unsafe-none`.
   *     In this case it does not matter if the opened document is cross-site or same-site.
   *
   *     Otherwise documents with `same-origin-allow-popups` will only open and be opened in the same BCG if both documents are same-origin and have the `same-origin-allow-popups` directive.
   *
   * - `noopener-allow-popups`
   *   - : Documents with this directive are always opened into a new BCG, except when opened by navigating from a document that also has `noopener-allow-popups`.
   *     It is used to support cases where there is a need to process-isolate _same-origin_ documents.
   *
   *     This severs the connections between the new document and its opener, isolating the browsing context for the current document regardless of the opener document's origin.
   *     This ensures that the opener can't run scripts in opened documents and vice versa — even if they are same-origin.
   *
   *     On navigations, a document with this directive will always open other documents in a new BCG unless they are same-origin and have the directive `noopener-allow-popups`.
   *     Using [Window.open()](https://developer.mozilla.org/en-US/docs/domxref/Window.open()), a document with this directive will open documents in a new BCG unless they have `unsafe-none`, and in this case it does not matter if they are same-site or cross-site.
   *
   * ## Description
   *
   * Generally you should set your policies such that only same-origin and trusted cross-origin resources that need to be able to script each other should be allowed to be opened in the same browser context group.
   * Other resources should be cross-origin isolated in their own group.
   *
   * The following sections show whether documents will be opened in the same BCG or a new BCG following a navigation or opening a window programmatically.
   *
   * > [!NOTE]
   * > The specification uses the term "popup" to refer to any document opened using [Window.open()](https://developer.mozilla.org/en-US/docs/domxref/Window.open()), whether it is a popup, tab, window, or other context.
   *
   * ### Navigations
   *
   * When navigating between documents, the new document is opened in the same BCG if the two documents have "matching coop policies", and otherwise into a new BCG.
   *
   * The policies match if either both documents have the policy `unsafe-none`, or if the policies are the same and the documents are same-origin.
   *
   * The table below shows how this rule affects whether documents are opened in the same or a new BCG for the different directive values.
   *
   * <!-- https://html.spec.whatwg.org/multipage/browsers.html#matching-coop -->
   *
   * | Opener (↓) / Opened (→)    | `unsafe-none` | `same-origin-allow-popups` | `same-origin`       | `noopener-allow-popups` |
   * | -------------------------- | ------------- | -------------------------- | ------------------- | ----------------------- |
   * | `unsafe-none`              | Same          | New                        | New                 | New                     |
   * | `same-origin-allow-popups` | New           | Same if same-origin        | New                 | New                     |
   * | `same-origin`              | New           | New                        | Same if same-origin | New                     |
   * | `noopener-allow-popups`    | New           | New                        | New                 | Same if same-origin     |
   *
   * ### Opening with Window.open()
   *
   * When opening a document using `Window.open()`, the new document is opened in a new BCG according to the following rules, which are evaluated in order:
   *
   * 1. If the new document has COOP set to `noopener-allow-popups` => open the new document in a new BCG
   * 2. If the new document has COOP set to `unsafe-none` and the opener document has COOP set to either `same-origin-allow-popups` or `noopener-allow-popups` => open the new document in the same BCG
   * 3. If the new document and the opening document have [matching COOP policies](#navigations) => open the new document in the same BCG
   * 4. Otherwise, open the new document in a new BCG
   *
   * The table below shows how these rules affect whether documents are opened in the same or a new BCG for the different directive values.
   *
   * <!-- https://html.spec.whatwg.org/multipage/browsers.html#check-browsing-context-group-switch-coop-value-popup -->
   *
   * | Opener (↓) / Opened (→)    | `unsafe-none` | `same-origin-allow-popups` | `same-origin`       | `noopener-allow-popups` |
   * | -------------------------- | ------------- | -------------------------- | ------------------- | ----------------------- |
   * | `unsafe-none`              | Same          | New                        | New                 | New                     |
   * | `same-origin-allow-popups` | Same          | Same if same-origin        | New                 | New                     |
   * | `same-origin`              | New           | New                        | Same if same-origin | New                     |
   * | `noopener-allow-popups`    | Same          | New                        | New                 | New                     |
   *
   * ## Examples
   *
   * ### Features that depend on cross-origin isolation
   *
   * Certain features, such as access to [SharedArrayBuffer](https://developer.mozilla.org/en-US/docs/jsxref/SharedArrayBuffer) objects or using [Performance.now()](https://developer.mozilla.org/en-US/docs/domxref/Performance.now()) with unthrottled timers, are only available if your document is [cross-origin isolated","","nocode](https://developer.mozilla.org/en-US/docs/domxref/Window.crossOriginIsolated).
   *
   * To use these features in a document, you will need to set the COOP header to `same-origin` and the [Cross-Origin-Embedder-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy) header to `require-corp` (or `credentialless`).
   * In addition the feature must not be blocked by [Permissions-Policy: cross-origin-isolated](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy/cross-origin-isolated).
   *
   * ```http
   * Cross-Origin-Opener-Policy: same-origin
   * Cross-Origin-Embedder-Policy: require-corp
   * ```
   *
   * You can use the [Window.crossOriginIsolated](https://developer.mozilla.org/en-US/docs/domxref/Window.crossOriginIsolated) and [WorkerGlobalScope.crossOriginIsolated](https://developer.mozilla.org/en-US/docs/domxref/WorkerGlobalScope.crossOriginIsolated) properties to check if a document is cross-origin isolated, and hence whether or not the features are restricted:
   *
   * ```js
   * const myWorker = new Worker("worker.js");
   *
   * if (crossOriginIsolated) {
   *   const buffer = new SharedArrayBuffer(16);
   *   myWorker.postMessage(buffer);
   * } else {
   *   const buffer = new ArrayBuffer(16);
   *   myWorker.postMessage(buffer);
   * }
   * ```
   *
   * ### Severing the opener relationship
   *
   * Consider a hypothetical origin `example.com` that has two very different applications on the same origin:
   *
   * - A chat application at `/chat` that enables any user to contact any other user and send them messages.
   * - A password management application at `/passwords` that contains all of the user's passwords, across different services.
   *
   * The administrators of the "passwords" application would very much like to ensure that it can't be directly scripted by the "chat" app, which by its nature has a larger XSS surface.
   * The "right way" to isolate these applications would be to host them on different origins, but in some cases that's not possible, and those two applications have to be on a single origin for historical, business, or branding reasons.
   *
   * The `Cross-Origin-Opener-Policy: noopener-allow-popups` header can be used to ensure that a document can't be scripted by a document that opens it.
   *
   * If `example.com/passwords` is served with `noopener-allow-popups` the `WindowProxy` returned by [Window.open()](https://developer.mozilla.org/en-US/docs/domxref/Window.open()) will indicate that the windows is closed ([Window.closed](https://developer.mozilla.org/en-US/docs/domxref/Window.closed) is `true`), so the opener can't script the passwords app:
   *
   * ```js
   * const handle = window.open("example.com/passwords", "passwordTab");
   * if (windowProxy.closed) {
   *   // The new window is closed so it can't be scripted.
   * }
   * ```
   *
   * Note that this alone is not considered a sufficient security measure.
   * The site would also need to do the following:
   *
   * - Use Fetch Metadata to block same-origin requests to the more-sensitive app that are not navigation requests.
   * - Ensure their authentication cookies are all `HttpOnly`.
   * - Ensure root-level Service-Workers are not installed by the less-sensitive app.
   * - Ensure that `postMessage` or `BroadcastChannel` on the more-sensitive app don't expose any sensitive information the any other same-origin app.
   * - Ensure their login page is served on a separate origin, due to password manager autofill being applied based on origin.
   * - Understand that the browser may still allocate the more-sensitive app in the same process as the less-sensitive one, making it vulnerable to Spectre-like attacks.
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Cross-Origin-Embedder-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy)
   */
  'Cross-Origin-Opener-Policy' = 'Cross-Origin-Opener-Policy',

  /**
   * The HTTP **`Cross-Origin-Resource-Policy`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) (CORP) indicates that the browser should block [`no-cors`](/en-US/docs/Web/API/RequestInit#no-cors) cross-origin or cross-site requests to the given resource.
   *
   * It specifies resource owner's policy for what sites/origins should be allowed to load this resource.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Cross-Origin-Resource-Policy: same-site | same-origin | cross-origin
   * ```
   *
   * ### Directives
   *
   * - `same-site`
   *   - : Resources can only be loaded from the same site.
   *
   * - `same-origin`
   *   - : Resources can only be loaded from the same origin.
   *
   * - `cross-origin`
   *   - : Resources can be loaded by any other origin/website.
   *
   * ## Examples
   *
   * For more examples, see https://resourcepolicy.fyi/.
   *
   * ### Disallowing cross-origin no-cors requests
   *
   * The `Cross-Origin-Resource-Policy` header below will cause compatible user agents to disallow cross-origin no-cors requests:
   *
   * ```http
   * Cross-Origin-Resource-Policy: same-origin
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Cross-Origin Resource Policy (CORP) explainer](/en-US/docs/Web/HTTP/Guides/Cross-Origin_Resource_Policy)
   * - [Consider deploying Cross-Origin Resource Policy](https://resourcepolicy.fyi/)
   * - [Cross-Origin-Embedder-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy)
   * - [Access-Control-Allow-Origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin)
   */
  'Cross-Origin-Resource-Policy' = 'Cross-Origin-Resource-Policy',

  /**
   * The HTTP **`Date`** [request](https://developer.mozilla.org/en-US/docs/Glossary/request_header) and [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) contains the date and time at which the message originated.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Date: <day-name>, <day> <month> <year> <hour>:<minute>:<second> GMT
   * ```
   *
   * ## Directives
   *
   * - `<day-name>`
   *   - : One of `Mon`, `Tue`, `Wed`, `Thu`, `Fri`, `Sat`, or `Sun` (case-sensitive).
   * - `<day>`
   *   - : 2 digit day number, e.g., "04" or "23".
   * - `<month>`
   *   - : One of `Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec` (case sensitive).
   * - `<year>`
   *   - : 4 digit year number, e.g., "1990" or "2016".
   * - `<hour>`
   *   - : 2 digit hour number, e.g., "09" or "23".
   * - `<minute>`
   *   - : 2 digit minute number, e.g., "04" or "59".
   * - `<second>`
   *   - : 2 digit second number, e.g., "04" or "59".
   * - GMT
   *   - : Greenwich Mean Time. HTTP dates are always expressed in GMT, never in local time.
   *
   * ## Examples
   *
   * ### Response with a Date header
   *
   * The following HTTP message is a successful `200` status, with a `Date` header showing the time the message originated.
   * Other headers are omitted for brevity:
   *
   * ```http
   * HTTP/1.1 200
   * Content-Type: text/html
   * Date: Tue, 29 Oct 2024 16:56:32 GMT
   *
   * <html lang="en-US" …
   * ```
   *
   * ### Attempting to set the field value in JavaScript
   *
   * The `Date` header is a [Forbidden request header](https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_request_header), so this code cannot set the message `Date` field:
   *
   * ```js example-bad
   * fetch("https://httpbin.org/get", {
   *   headers: {
   *     Date: new Date().toUTCString(),
   *   },
   * });
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Age](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Age)
   */
  'Date' = 'Date',

  /**
   * The HTTP **`Device-Memory`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) is used in [device client hints](/en-US/docs/Web/HTTP/Guides/Client_hints#device_client_hints) to indicate the approximate amount of available RAM on the client device, in gigabytes.
   * The header is part of the [Device Memory API", "", "nocode](https://developer.mozilla.org/en-US/docs/DOMxRef/Device_Memory_API).
   *
   * Client hints are accessible only on secure origins.
   * A server has to opt in to receive the `Device-Memory` header from the client, by first sending the [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH) response header.
   * Servers that opt in to the `Device-Memory` client hint will typically also specify it in the [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) header to inform caches that the server may send different responses based on the header value in a request.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Device-Memory: <number>
   * ```
   *
   * ## Directives
   *
   * - `<number>`
   *   - : The approximate amount of device RAM. Possible values are: `0.25`, `0.5`, `1`, `2`, `4`, `8`.
   *     The amount of device RAM can be used as a [fingerprinting](https://developer.mozilla.org/en-US/docs/glossary/fingerprinting) variable, so values for the header are intentionally coarse to reduce the potential for its misuse.
   *
   * ## Examples
   *
   * The server first needs to opt in to receive `Device-Memory` header by sending the [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH) response header containing `Device-Memory`:
   *
   * ```http
   * Accept-CH: Device-Memory
   * ```
   *
   * Then on subsequent requests the client might send `Device-Memory` header back:
   *
   * ```http
   * Device-Memory: 1
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Improving user privacy and developer experience with User-Agent Client Hints](https://developer.chrome.com/docs/privacy-security/user-agent-client-hints) (developer.chrome.com)
   * - [Device Memory API", "", "nocode](https://developer.mozilla.org/en-US/docs/DOMxRef/Device_Memory_API)
   * - [Navigator.deviceMemory](https://developer.mozilla.org/en-US/docs/DOMxRef/Navigator.deviceMemory)
   * - [WorkerNavigator.deviceMemory](https://developer.mozilla.org/en-US/docs/DOMxRef/WorkerNavigator.deviceMemory)
   * - Device client hints
   *   - [Content-DPR](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-DPR)
   *   - [DPR](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/DPR)
   *   - [Viewport-Width](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Viewport-Width)
   *   - [Width](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Width)
   * - [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH)
   * - [HTTP Caching: Vary](/en-US/docs/Web/HTTP/Guides/Caching#vary) and [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary)
   */
  'Device-Memory' = 'Device-Memory',

  /**
   * The HTTP **`Dictionary-ID`** request header references a dictionary that can be used in [Compression Dictionary Transport](https://developer.mozilla.org/en-US/docs/glossary/Compression_Dictionary_Transport) to compress the server's response.
   *
   * A server can indicate that a resource can be used as a dictionary by sending the [Use-As-Dictionary](https://developer.mozilla.org/en-US/docs/httpheader/Use-As-Dictionary) header with the response. The server may include an `id` directive in the `Use-As-Dictionary` header, thus assigning an ID value to the dictionary. If the server does this, then when the browser requests a resource that can be compressed using the dictionary, the resource request must include the `Dictionary-ID` header, and its value must match the ID that was given in `Use-As-Dictionary`.
   *
   * This allows the server to identify and find a dictionary that is referenced by some arbitrary key, rather than having to use the [dictionary hash](https://developer.mozilla.org/en-US/docs/glossary/hash_function) as a key (if that approach is used, the server will have to hash every response that includes the `Use-As-Dictionary` header just in case the resource might eventually be used as a dictionary).
   *
   * Note that while the server can identify and locate the dictionary from its `Dictionary-ID`, it must still check the hash from the `Available-Dictionary` header to confirm that it is a correct match.
   *
   * See the [Compression Dictionary Transport guide](/en-US/docs/Web/HTTP/Guides/Compression_dictionary_transport) for more information.
   *
   * ## Syntax
   *
   * ```http
   * Dictionary-ID: "<string-identifier>"
   * ```
   *
   * ## Directives
   *
   * - `<string-identifier>`
   *   - : A string representing the dictionary's server-assigned ID.
   *
   * ## Examples
   *
   * For example, suppose the server has sent a `Use-As-Dictionary` header containing an `id="dictionary-12345"` directive:
   *
   * ```http
   * Use-As-Dictionary: match="/js/app.*.js", id="dictionary-12345"
   * ```
   *
   * When the client requests a matching resource, it will include this `id` value in a `Dictionary-ID header`:
   *
   * ```http
   * Accept-Encoding: gzip, br, zstd, dcb, dcz
   * Available-Dictionary: :pZGm1Av0IEBKARczz7exkNYsZb8LzaMrV7J32a2fFG4=:
   * Dictionary-ID: "dictionary-12345"
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Compression Dictionary Transport guide](/en-US/docs/Web/HTTP/Guides/Compression_dictionary_transport)
   * - [Available-Dictionary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Available-Dictionary)
   * - [Use-As-Dictionary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Use-As-Dictionary)
   */
  'Dictionary-ID' = 'Dictionary-ID',

  /**
   * > [!NOTE]
   * > The DNT (Do Not Track) specification has been discontinued. See [Navigator.doNotTrack](https://developer.mozilla.org/en-US/docs/domxref/Navigator.doNotTrack) for more information.
   *
   * The HTTP **`DNT`** (Do Not Track) [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) indicates the user's tracking preference.
   * It lets users indicate whether they would prefer privacy rather than personalized content.
   *
   * DNT is deprecated in favor of [Global Privacy Control](https://globalprivacycontrol.org/), which is communicated to servers using the [Sec-GPC](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-GPC) header, and accessible to clients from [navigator.globalPrivacyControl](https://developer.mozilla.org/en-US/docs/domxref/navigator.globalPrivacyControl).
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * DNT: 0
   * DNT: 1
   * DNT: null
   * ```
   *
   * ## Directives
   *
   * - `0`
   *   - : The user prefers to allow tracking on the target site.
   * - `1`
   *   - : The user prefers not to be tracked on the target site.
   * - `null`
   *   - : The user has not specified a preference about tracking.
   *
   * ## Examples
   *
   * ### Reading Do Not Track status from JavaScript
   *
   * The user's DNT preference can also be read from JavaScript using the
   * [Navigator.doNotTrack](https://developer.mozilla.org/en-US/docs/domxref/Navigator.doNotTrack) property:
   *
   * ```js
   * navigator.doNotTrack; // "0", "1" or null
   * ```
   *
   * ## Specifications
   *
   * Part of the discontinued [Tracking Preference Expression (DNT)](https://w3c.github.io/dnt/drafts/tracking-dnt.html#dnt-header-field) specification.
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Navigator.doNotTrack](https://developer.mozilla.org/en-US/docs/domxref/Navigator.doNotTrack)
   * - [Tk](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Tk) header
   * - [Do Not Track on Wikipedia](https://en.wikipedia.org/wiki/Do_Not_Track)
   * - [What Does the "Track" in "Do Not Track" Mean? – EFF](https://www.eff.org/deeplinks/2011/02/what-does-track-do-not-track-mean)
   * - [DNT on Electronic Frontier Foundation](https://www.eff.org/issues/do-not-track)
   * - DNT browser settings help:
   *   - [Firefox](https://support.mozilla.org/en-US/kb/how-do-i-turn-do-not-track-feature)
   *   - [Chrome](https://support.google.com/chrome/answer/2790761)
   * - [GPC - Global Privacy Control](https://globalprivacycontrol.org/)
   *   - [Enabling GPC in Firefox](https://support.mozilla.org/en-US/kb/global-privacy-control?as=u&utm_source=inproduct)
   */
  'DNT' = 'DNT',

  /**
   * The HTTP **`Downlink`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) is used in [Client Hints](/en-US/docs/Web/HTTP/Guides/Client_hints) to provide the approximate bandwidth in Mbps of the client's connection to the server.
   *
   * The hint allows a server to choose what information is sent based on the network bandwidth.
   * For example, a server might choose to send smaller versions of images and other resources on low bandwidth networks.
   *
   * > [!NOTE]
   * > The [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) header is used in responses to indicate that a different resource is sent for every different value of the header (see [HTTP Caching Vary](/en-US/docs/Web/HTTP/Guides/Caching#vary)).
   * > Even if `Downlink` is used to configure what resources are sent, consider omitting it in the [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) header — it is likely to change often, which effectively makes the resource uncacheable.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Downlink: <number>
   * ```
   *
   * ## Directives
   *
   * - `<number>`
   *   - : The downlink rate in Mbps, rounded to the nearest 25 kilobits.
   *     The downlink rate may be used as a [fingerprinting](https://developer.mozilla.org/en-US/docs/glossary/fingerprinting) variable, so values for the header are intentionally coarse to reduce the potential for its misuse.
   *
   * ## Examples
   *
   * A server first needs to opt in to receive the `Downlink` header by sending the [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH) response header containing `Downlink`.
   *
   * ```http
   * Accept-CH: Downlink
   * ```
   *
   * Then on subsequent requests the client might send a `Downlink` header back:
   *
   * ```http
   * Downlink: 1.7
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Improving user privacy and developer experience with User-Agent Client Hints](https://developer.chrome.com/docs/privacy-security/user-agent-client-hints) (developer.chrome.com)
   * - Network client hints
   *   - [RTT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/RTT)
   *   - [ECT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ECT)
   *   - [Save-Data](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Save-Data)
   * - [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH)
   * - [HTTP Caching: Vary](/en-US/docs/Web/HTTP/Guides/Caching#vary) and [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary)
   * - [NetworkInformation.effectiveType](https://developer.mozilla.org/en-US/docs/domxref/NetworkInformation.effectiveType)
   */
  'Downlink' = 'Downlink',

  /**
   * > [!WARNING]
   * > The `DPR` header was removed from the client hints specification in [draft-ietf-httpbis-client-hints-07](https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-client-hints-07).
   * > The proposed replacement is [`Sec-CH-DPR`](https://wicg.github.io/responsive-image-client-hints/#sec-ch-dpr) (Responsive Image Client Hints).
   *
   * The HTTP **`DPR`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) provides [device client hints](/en-US/docs/Web/HTTP/Guides/Client_hints) about the client device pixel ratio (DPR).
   * This ratio is the number of physical device pixels corresponding to every [CSS pixel](https://developer.mozilla.org/en-US/docs/Glossary/CSS_pixel).
   *
   * The hint is useful when selecting image sources that best correspond to a screen's pixel density.
   * This is similar to the role played by `x` descriptors in the `
   *
   * ## Syntax
   *
   * ```http
   * DPR: <number>
   * ```
   *
   * ## Directives
   *
   * - `<number>`
   *   - : The client device pixel ratio.
   *
   * ## Examples
   *
   * A server must first opt in to receive the `DPR` header by sending the response header [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH) containing the directive `DPR`.
   *
   * ```http
   * Accept-CH: DPR
   * ```
   *
   * Then on subsequent requests the client might send `DPR` header to the server:
   *
   * ```http
   * DPR: 2.0
   * ```
   *
   * If a request with the `DPR` header (as shown above) is for an image resource, then the server response must include the [Content-DPR](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-DPR) header:
   *
   * ```http
   * Content-DPR: 2.0
   * ```
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - Device client hints
   *   - [Content-DPR](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-DPR)
   *   - [Device-Memory](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Device-Memory)
   *   - [Viewport-Width](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Viewport-Width)
   *   - [Width](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Width)
   * - [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH)
   * - [HTTP Caching: Vary](/en-US/docs/Web/HTTP/Guides/Caching#vary) and [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary)
   * - [Improving user privacy and developer experience with User-Agent Client Hints](https://developer.chrome.com/docs/privacy-security/user-agent-client-hints) (developer.chrome.com)
   */
  'DPR' = 'DPR',

  /**
   * The HTTP **`Early-Data`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) is set by an intermediary to indicate that the request has been conveyed in [TLS early data](/en-US/docs/Web/Security/Transport_Layer_Security#tls_1.3), and also indicates that the intermediary understands the [425 Too Early](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/425) status code.
   *
   * If a client has interacted with a server recently, early data (also known as zero round-trip time [(0-RTT) data](/en-US/docs/Web/Security/Transport_Layer_Security#tls_1.3)) allows the client to send data to a server in the first round trip of a connection, without waiting for the TLS [handshake](/en-US/docs/Glossary/TCP_handshake) to complete.
   * This reduces latency for repeat connections between a client and server, but has security implications, as early data is susceptible to replay attacks.
   *
   * The `Early-Data` header is **not** set by the originator of the request (i.e., a browser).
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Early-Data: 1
   * ```
   *
   * ## Examples
   *
   * ### A GET request with an Early-Data header
   *
   * A client that wants to use early data can send HTTP requests immediately after sending the TLS `ClientHello`.
   * Sending a request in early data implies that the client is willing to retry a request in response to a [425 Too Early](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/425) status code, so the `Early-Data` header is not included:
   *
   * ```http
   * GET /resource HTTP/1.1
   * Host: example.com
   * ```
   *
   * An intermediary that forwards a request prior to the completion of the TLS handshake with its client sends it with the `Early-Data` header set to `1`:
   *
   * ```http
   * GET /resource HTTP/1.1
   * Host: example.com
   * Early-Data: 1
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [425 Too Early](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/425)
   * - [Replay Attacks on 0-RTT](https://www.rfc-editor.org/rfc/rfc8446#appendix-E.5)
   */
  'Early-Data' = 'Early-Data',

  /**
   * The HTTP **`ECT`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) is used in [Client Hints](/en-US/docs/Web/HTTP/Guides/Client_hints) to indicate the [effective connection type](https://developer.mozilla.org/en-US/docs/Glossary/effective_connection_type): `slow-2g`, `2g`, `3g`, or `4g`.
   *
   * The value represents the "network profile" that best matches the connection's latency and bandwidth, rather than the actual mechanisms used for transferring the data.
   * For example, `2g` might be used to represent a slow Wi-Fi connection with high latency and low bandwidth, while `4g` might represent a fast fibre-based broadband network.
   *
   * The hint allows a server to choose what information is sent based on the broad characteristics of the network. For example, a server might choose to send smaller versions of images and other resources on less capable connections. The value might also be used as a starting point for determining what information is sent, which is further refined using information in [RTT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/RTT) and [Downlink](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Downlink) hints.
   *
   * > [!NOTE]
   * > A server that specifies `ECT` in [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH) may also specify it in [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) to indicate that responses should be cached for different ECT values.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * ECT: <value>
   * ```
   *
   * ## Directives
   *
   * - `<value>`
   *   - : A value indicating [effective connection type](https://developer.mozilla.org/en-US/docs/Glossary/effective_connection_type). Can be one of: `slow-2g`, `2g`, `3g`, or `4g`.
   *
   * ## Examples
   *
   * A server first needs to opt in to receive the `ECT` header by sending the [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH) response header containing `ECT`.
   *
   * ```http
   * Accept-CH: ECT
   * ```
   *
   * Then on subsequent requests the client might send an `ECT` header back:
   *
   * ```http
   * ECT: 2g
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Improving user privacy and developer experience with User-Agent Client Hints](https://developer.chrome.com/docs/privacy-security/user-agent-client-hints) (developer.chrome.com)
   * - Network client hints
   *   - [Downlink](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Downlink)
   *   - [RTT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/RTT)
   *   - [Save-Data](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Save-Data)
   *
   * - [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH)
   * - [HTTP Caching > Vary](/en-US/docs/Web/HTTP/Guides/Caching#vary) and [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary)
   * - [NetworkInformation.effectiveType](https://developer.mozilla.org/en-US/docs/domxref/NetworkInformation.effectiveType)
   */
  'ECT' = 'ECT',

  /**
   * The HTTP **`ETag`** (entity tag) [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) is an identifier for a specific version of a resource.
   * It lets [caches](/en-US/docs/Web/HTTP/Guides/Caching) be more efficient and save bandwidth, as a web server does not need to resend a full response if the content has not changed.
   * Additionally, ETags help to prevent simultaneous updates of a resource from overwriting each other (["mid-air collisions"](#avoiding_mid-air_collisions)).
   *
   * If the resource at a given URL changes, a new `Etag` value _must_ be generated.
   * A comparison of them can determine whether two representations of a resource are the same.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * ETag: W/"<etag_value>"
   * ETag: "<etag_value>"
   * ```
   *
   * ## Directives
   *
   * - `W/`
   *   - : `W/` (case-sensitive) indicates that a [weak validator](/en-US/docs/Web/HTTP/Guides/Conditional_requests#weak_validation) is used.
   *     Weak ETags are easy to generate, but are far less useful for comparisons.
   *     Strong validators are ideal for comparisons but can be very difficult to generate efficiently.
   *     Weak `ETag` values of two representations of the same resources might be semantically equivalent, but not byte-for-byte identical.
   *     This means weak ETags prevent caching when [byte range requests](/en-US/docs/Web/HTTP/Reference/Headers/Accept-Ranges) are used, but strong ETags mean range requests can still be cached.
   * - `<etag_value>`
   *   - : Entity tag that uniquely represents the requested resource. It is a string of [ASCII](https://developer.mozilla.org/en-US/docs/Glossary/ASCII) characters placed between double quotes, like `"675af34563dc-tr34"`.
   *     The method by which `ETag` values are generated is not specified.
   *     Typically, the ETag value is a hash of the content, a hash of the last modification timestamp, or just a revision number.
   *     For example, a wiki engine can use a hexadecimal hash of the documentation article content.
   *
   * ## Examples
   *
   * ```http
   * ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
   * ETag: W/"0815"
   * ```
   *
   * ### Avoiding mid-air collisions
   *
   * With the help of the `ETag` and the [If-Match](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Match) headers, you can detect mid-air edit collisions (conflicts).
   *
   * For example, when editing a wiki, the current wiki content may be hashed and put into an `Etag` header in the response:
   *
   * ```http
   * ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
   * ```
   *
   * When saving changes to a wiki page (posting data), the [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/POST) request
   * will contain the [If-Match](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Match) header containing the `ETag`
   * values to check freshness against.
   *
   * ```http
   * If-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"
   * ```
   *
   * If the hashes don't match, it means that the document has been edited in-between and a
   * [412 Precondition Failed](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/412) error is thrown.
   *
   * ### Caching of unchanged resources
   *
   * Another typical use of the `ETag` header is to cache resources that are unchanged.
   * If a user visits a given URL again (that has an `ETag` set), and it is _stale_ (too old to be considered usable), the client will send the value of its `ETag` along in an [If-None-Match](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-None-Match) header field:
   *
   * ```http
   * If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"
   * ```
   *
   * The server compares the client's `ETag` (sent with `If-None-Match`) with the `ETag` for its current version of the resource, and if both values match (that is, the resource has not changed), the server sends back a [304 Not Modified](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/304) status, without a body, which tells the client that the cached version of the response is still good to use (_fresh_).
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [If-Match](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Match), [If-None-Match](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-None-Match) headers
   * - [304 Not Modified](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/304), [412 Precondition Failed](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/412) response status codes
   * - [W3C Note: Editing the Web – Detecting the Lost Update Problem Using Unreserved Checkout](https://www.w3.org/1999/04/Editing/)
   */
  'ETag' = 'ETag',

  /**
   * The `Expect-CT` [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) lets sites opt in to reporting and/or enforcement of [Certificate Transparency](/en-US/docs/Web/Security/Certificate_Transparency) requirements.
   * Certificate Transparency (CT) aims to prevent the use of misissued certificates for that site from going unnoticed.
   *
   * Only Google Chrome and other Chromium-based browsers implemented `Expect-CT`, and Chromium has deprecated the header from version 107, because Chromium now enforces CT by default.
   * See the [Chrome Platform Status](https://chromestatus.com/feature/6244547273687040) update.
   *
   * CT requirements can be satisfied via any one of the following mechanisms:
   *
   * - X.509v3 certificate extension to allow embedding of signed certificate timestamps issued by individual logs. Most TLS certificates issued by publicly-trusted CAs and used online contain embedded CT.
   * - A TLS extension of type `signed_certificate_timestamp` sent during the handshake
   * - Supporting OCSP stapling (that is, the `status_request` TLS extension) and providing a `SignedCertificateTimestampList`
   *
   * > [!NOTE]
   * > When a site enables the `Expect-CT` header, they are requesting that the browser check that any certificate for that site appears in **[public CT logs](https://github.com/google/certificate-transparency-community-site/blob/master/docs/google/known-logs.md)**.
   *
   * > [!NOTE]
   * > Browsers **ignore** the `Expect-CT` header over HTTP; the header only has effect on HTTPS connections.
   *
   * > [!NOTE]
   * > The `Expect-CT` is mostly obsolete since June 2021.
   * > Since May 2018, all new TLS certificates are expected to support SCTs by default.
   * > Certificates issued before March 2018 were allowed to have a lifetime of 39 months, so they had expired in June 2021.
   * > Chromium plans to deprecate `Expect-CT` header and to eventually remove it.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Expect-CT: report-uri="<uri>",
   *            enforce,
   *            max-age=<age>
   * ```
   *
   * ## Directives
   *
   * - `max-age`
   *   - : The number of seconds after reception of the `Expect-CT` header field during which the user agent should regard the host of the received message as a known `Expect-CT` host.
   *
   *     If a cache receives a value greater than it can represent, or if any of its subsequent calculations overflows, the cache will consider this value to be either 2,147,483,648 (2^31) or the greatest positive integer it can represent.
   *
   * - `report-uri="<uri>"`
   *   - : The URI where the user agent should report `Expect-CT` failures.
   *
   *     When present with the `enforce` directive, the configuration is referred to as an "enforce-and-report" configuration, signalling to the user agent both that compliance to the Certificate Transparency policy should be enforced _and_ that violations should be reported.
   *
   * - `enforce`
   *   - : Signals to the user agent that compliance with the Certificate Transparency policy should be enforced (rather than only reporting compliance) and that the user agent should refuse future connections that violate its Certificate Transparency policy.
   *
   *     When both the `enforce` directive and the `report-uri` directive are present, the configuration is referred to as an "enforce-and-report" configuration, signalling to the user agent both that compliance to the Certificate Transparency policy should be enforced and that violations should be reported.
   *
   * ## Example
   *
   * The following example specifies enforcement of Certificate Transparency for 24 hours and reports violations to `foo.example.com`.
   *
   * ```http
   * Expect-CT: max-age=86400, enforce, report-uri="https://foo.example.com/report"
   * ```
   *
   * ## Notes
   *
   * Root CAs manually added to the trust store override and suppress `Expect-CT` reports/enforcement.
   *
   * Browsers will not remember an `Expect-CT` policy, unless the site has 'proven' it can serve a certificate satisfying the certificate transparency requirements. Browsers implement their own trust model regarding which CT logs are considered trusted for the certificate to have been logged to.
   *
   * Builds of Chrome are designed to stop enforcing the `Expect-CT` policy 10 weeks after the installation's build date.
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Secure Contexts](/en-US/docs/Web/Security/Secure_Contexts)
   * - Glossary terms:
   *   -
   *   -
   *   -
   */
  'Expect-CT' = 'Expect-CT',

  /**
   * The HTTP **`Expect`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) indicates that there are expectations that need to be met by the server in order to handle the complete request successfully.
   *
   * When a request has an `Expect: 100-continue` header, a server sends a [100 Continue](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/100) response to indicate that the server is ready or capable of receiving the rest of the request content.
   * Waiting for a `100` response can be helpful if a client anticipates that an error is likely, for example, when sending state-changing operations without previously verified authentication credentials.
   *
   * A [417 Expectation Failed](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/417) response is returned if the server cannot meet the expectation, or any other status otherwise (e.g., a [4XX](/en-US/docs/Web/HTTP/Reference/Status#client_error_responses) status for a client error, or a [2XX](/en-US/docs/Web/HTTP/Reference/Status#successful_responses) status if the request can be resolved successfully without further processing).
   *
   * None of the more common browsers send the `Expect` header, but some clients (command-line tools) do so by default.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Expect: 100-continue
   * ```
   *
   * ## Directives
   *
   * There is only one defined expectation:
   *
   * - `100-continue`
   *   - : Informs recipients that the client is about to send a (presumably large) message body in this request and wishes to receive a [100 Continue](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/100) interim response.
   *
   * ## Examples
   *
   * ### Large message body
   *
   * A client sends a request with `Expect` header and waits for the server to respond before sending the message body.
   *
   * ```http
   * PUT /somewhere/fun HTTP/1.1
   * Host: origin.example.com
   * Content-Type: video/h264
   * Content-Length: 1234567890987
   * Expect: 100-continue
   * ```
   *
   * The server checks the headers and generates the response, where a [100 Continue](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/100) instructs the client to send the message body:
   *
   * ```http
   * HTTP/1.1 100 Continue
   * ```
   *
   * The client completes the request by sending the actual data:
   *
   * ```http
   * [Video data as content for PUT request]
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [417 Expectation Failed](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/417)
   * - [100 Continue](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/100)
   */
  'Expect' = 'Expect',

  /**
   * The HTTP **`Expires`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) contains the date/time after which the response is considered expired in the context of [HTTP caching](/en-US/docs/Web/HTTP/Guides/Caching).
   *
   * The value `0` is used to represent a date in the past, indicating the resource has already expired.
   *
   * > [!NOTE]
   * > If there is a [Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) header with the `max-age` or `s-maxage` directive in the response, the `Expires` header is ignored.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Expires: <day-name>, <day> <month> <year> <hour>:<minute>:<second> GMT
   * ```
   *
   * ## Directives
   *
   * - `<day-name>`
   *   - : One of `Mon`, `Tue`, `Wed`, `Thu`, `Fri`, `Sat`, or `Sun` (case-sensitive).
   * - `<day>`
   *   - : 2 digit day number, e.g., "04" or "23".
   * - `<month>`
   *   - : One of `Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec` (case sensitive).
   * - `<year>`
   *   - : 4 digit year number, e.g., "1990" or "2016".
   * - `<hour>`
   *   - : 2 digit hour number, e.g., "09" or "23".
   * - `<minute>`
   *   - : 2 digit minute number, e.g., "04" or "59".
   * - `<second>`
   *   - : 2 digit second number, e.g., "04" or "59".
   * - GMT
   *   - : Greenwich Mean Time. HTTP dates are always expressed in GMT, never in local time.
   *
   * ## Examples
   *
   * ```http
   * Expires: Wed, 21 Oct 2015 07:28:00 GMT
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [HTTP caching](/en-US/docs/Web/HTTP/Guides/Caching) guide
   * - [Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)
   * - [Age](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Age)
   */
  'Expires' = 'Expires',

  /**
   * The HTTP **`Forwarded`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) contains information that may be added by [reverse proxy servers](/en-US/docs/Web/HTTP/Guides/Proxy_servers_and_tunneling) (load balancers, CDNs, etc.) that would otherwise be altered or lost when proxy servers are involved in the path of the request.
   *
   * For example, if a client is connecting to a web server through an HTTP proxy (or load balancer), server logs will only contain the IP address, host address, and protocol of the proxy; this header can be used to identify the IP address, host, and protocol, of the original request.
   * The header is optional and may be added to, modified, or removed, by any of the proxy servers on the path to the server.
   *
   * This header is used for debugging, statistics, and generating location-dependent content.
   * By design, it exposes privacy sensitive information, such as the IP address of the client.
   * Therefore, the user's privacy must be kept in mind when using this header.
   *
   * The alternative and de-facto standard versions of this header are the [X-Forwarded-For](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For), [X-Forwarded-Host](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-Host) and [X-Forwarded-Proto](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-Proto) headers.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Forwarded: by=<identifier>;for=<identifier>;host=<host>;proto=<http|https>
   * ```
   *
   * Directives are `key=value` pairs, separated by a semicolon.
   *
   * If there are multiple proxy servers between the client and server, they may each specify their own forwarding information.
   * This can be done by adding a new `Forwarded` header to the end of the header block, or by appending the information to the end of the last `Forwarded` header in a comma-separated list.
   *
   * ## Directives
   *
   * - `by`
   *   - : The interface where the request came in to the proxy server.
   *     The identifier can be:
   *     - an obfuscated identifier (such as "hidden" or "secret").
   *       This should be treated as the default.
   *     - an IP address (v4 or v6, optionally with a port, and ipv6 quoted and enclosed in square brackets)
   *     - "unknown" when the preceding entity is not known (and you still want to indicate that forwarding of the request was made)
   *
   * - `for`
   *   - : The client that initiated the request and subsequent proxies in a chain of proxies.
   *     The identifier has the same possible values as the `by` directive.
   * - `host`
   *   - : The [Host](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Host) request header field as received by the proxy.
   * - `proto`
   *   - : Indicates which protocol was used to make the request (typically "http" or "https").
   *
   * ## Examples
   *
   * ### Using the `Forwarded` header
   *
   * ```http
   * Forwarded: for="_mdn"
   *
   * # case insensitive
   * Forwarded: For="[2001:db8:cafe::17]:4711"
   *
   * # separated by semicolon
   * Forwarded: for=192.0.2.60;proto=http;by=203.0.113.43
   *
   * # Values from multiple proxy servers can be appended using a comma
   * Forwarded: for=192.0.2.43, for=198.51.100.17
   * ```
   *
   * ### Transitioning from `X-Forwarded-For` to `Forwarded`
   *
   * If your application, server, or proxy supports the standardized `Forwarded` header, the [X-Forwarded-For](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For) header can be replaced.
   * Note that an IPv6 address is quoted and enclosed in square brackets in `Forwarded` (unlike in the [X-Forwarded-For](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For) header).
   *
   * ```http
   * X-Forwarded-For: 192.0.2.172
   * Forwarded: for=192.0.2.172
   *
   * X-Forwarded-For: 192.0.2.43, 2001:db8:cafe::17
   * Forwarded: for=192.0.2.43, for="[2001:db8:cafe::17]"
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [X-Forwarded-For](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For)
   * - [X-Forwarded-Host](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-Host)
   * - [X-Forwarded-Proto](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-Proto)
   * - [Via](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Via) – provides information about the proxy itself, not about the client connecting to it.
   */
  'Forwarded' = 'Forwarded',

  /**
   * The HTTP **`From`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) contains an Internet email address for an administrator who controls an automated user agent.
   *
   * If you are running a robotic user agent (a web crawler, for example), the `From` header must be sent in requests so you can be contacted if problems occur, such as a bot sending excessive, unwanted, or invalid requests.
   *
   * > [!WARNING]
   * > You must not use the `From` header for access control or authentication.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * From: <email>
   * ```
   *
   * ## Directives
   *
   * - `<email>`
   *   - : A machine-usable email address.
   *
   * ## Examples
   *
   * ```http
   * From: webmaster@example.org
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Host](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Host)
   */
  'From' = 'From',

  /**
   * The HTTP **`Host`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) specifies the host and port number of the server to which the request is being sent.
   *
   * If no port is included, the default port for the service requested is implied (e.g., `443` for an HTTPS URL, and `80` for an HTTP URL).
   *
   * A `Host` header field must be sent in all HTTP/1.1 request messages.
   * A [400 Bad Request](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400) status code may be sent to any HTTP/1.1 request message that lacks or contains more than one `Host` header field.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Host: <host>:<port>
   * ```
   *
   * ## Directives
   *
   * - `<host>`
   *   - : The domain name of the server (for virtual hosting).
   * - `<port>`
   *   - : TCP port number on which the server is listening.
   *
   * ## Examples
   *
   * ```http
   * Host: developer.mozilla.org
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [400](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400)
   * - [base](https://developer.mozilla.org/en-US/docs/HTMLElement/base)
   */
  'Host' = 'Host',

  /**
   * The HTTP **`If-Match`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) makes a request [conditional](/en-US/docs/Web/HTTP/Guides/Conditional_requests).
   * A server will return resources for [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) and [HEAD](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/HEAD) methods, or upload resource for [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/PUT) and other non-safe methods, only if the resource matches one of the [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) values in the `If-Match` request header.
   * If the conditional does not match, the [412 Precondition Failed](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/412) response is returned instead.
   *
   * The comparison with the stored [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) uses the _strong comparison algorithm_, meaning two files are considered identical byte-by-byte.
   * If a listed `ETag` has the `W/` prefix indicating a weak entity tag, this comparison algorithm will never match it.
   *
   * There are two common use cases:
   *
   * - For [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) and [HEAD](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/HEAD) methods, used in combination with a [Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Range) header, it can guarantee that the new ranges requested
   *   come from the same resource as the previous one.
   * - For other methods, and in particular for [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/PUT), `If-Match` can be used to prevent the [lost update problem](https://www.w3.org/1999/04/Editing/#3.1).
   *   It can check if the modification of a resource that the user wants to upload will not override another change that has been done since the original resource was fetched.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * If-Match: <etag_value>
   * If-Match: <etag_value>, <etag_value>, …
   * ```
   *
   * ## Directives
   *
   * - `<etag_value>`
   *   - : Entity tags uniquely representing the requested resources.
   *     They are a string of [ASCII](https://developer.mozilla.org/en-US/docs/Glossary/ASCII) characters placed between double quotes (like `"675af34563dc-tr34"`).
   *     They may be prefixed by `W/` to indicate that they are 'weak', i.e., that they represent the resource semantically but not byte-by-byte.
   *     However, in an `If-Match` header, weak entity tags will never match.
   * - `*`
   *   - : The asterisk is a special value representing any resource.
   *     Note that this must match as `false` if the origin server does not have a current representation for the target resource.
   *
   * ## Examples
   *
   * ```http
   * If-Match: "bfc13a64729c4290ef5b2c2730249c88ca92d82d"
   *
   * If-Match: "67ab43", "54ed21", "7892dd"
   *
   * If-Match: *
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag)
   * - [If-None-Match](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-None-Match), [If-Modified-Since](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Modified-Since), [If-Unmodified-Since](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Unmodified-Since) conditional request headers
   * - [412 Precondition Failed](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/412)
   */
  'If-Match' = 'If-Match',

  /**
   * The HTTP **`If-Modified-Since`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) makes a request [conditional](/en-US/docs/Web/HTTP/Guides/Conditional_requests).
   * The server sends back the requested resource, with a [200](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200) status, only if it has been modified after the date in the `If-Modified-Since` header.
   * If the resource has not been modified since, the response is a [304](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/304) without any body, and the [Last-Modified](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Last-Modified) response header of the previous request contains the date of the last modification.
   *
   * Unlike [If-Unmodified-Since](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Unmodified-Since), `If-Modified-Since` can only be used with a [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) or [HEAD](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/HEAD).
   * When used in combination with [If-None-Match](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-None-Match), it is ignored, unless the server doesn't support `If-None-Match`.
   *
   * The most common use case is to update a cached entity that has no associated [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag).
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * If-Modified-Since: <day-name>, <day> <month> <year> <hour>:<minute>:<second> GMT
   * ```
   *
   * ## Directives
   *
   * - `<day-name>`
   *   - : One of `Mon`, `Tue`, `Wed`, `Thu`, `Fri`, `Sat`, or `Sun` (case-sensitive).
   * - `<day>`
   *   - : 2 digit day number, e.g., "04" or "23".
   * - `<month>`
   *   - : One of `Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec` (case sensitive).
   * - `<year>`
   *   - : 4 digit year number, e.g., "1990" or "2016".
   * - `<hour>`
   *   - : 2 digit hour number, e.g., "09" or "23".
   * - `<minute>`
   *   - : 2 digit minute number, e.g., "04" or "59".
   * - `<second>`
   *   - : 2 digit second number, e.g., "04" or "59".
   * - GMT
   *   - : Greenwich Mean Time. HTTP dates are always expressed in GMT, never in local time.
   *
   * ## Examples
   *
   * ```http
   * If-Modified-Since: Wed, 21 Oct 2015 07:28:00 GMT
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag)
   * - [If-Match](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Match), [If-None-Match](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-None-Match), [If-Unmodified-Since](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Unmodified-Since) conditional request headers
   * - [304 Not Modified](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/304), [412 Precondition Failed](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/412) response status codes
   */
  'If-Modified-Since' = 'If-Modified-Since',

  /**
   * The HTTP **`If-None-Match`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) makes a request [conditional](/en-US/docs/Web/HTTP/Guides/Conditional_requests).
   * The server returns the requested resource in [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) and [HEAD](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/HEAD) methods with a [200](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200) status, only if it doesn't have an [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) matching the ones in the `If-None-Match` header.
   * For other methods, the request will be processed only if the eventually existing resource's [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) doesn't match any of the values listed.
   *
   * When the condition fails for [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) and [HEAD](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/HEAD) methods, the server must return a [304 Not Modified](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/304) and any of the following header fields that would have been sent in a 200 response to the same request: `Cache-Control`, `Content-Location`, `Date`, `ETag`, `Expires`, and `Vary`.
   * For methods that apply server-side changes, the [412 Precondition Failed](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/412) is used when the condition fails.
   *
   * The comparison with the stored ETag uses the _weak comparison algorithm_, meaning two files are considered identical if the content is equivalent — they don't have to be identical byte-by-byte.
   * For example, two pages that differ by their creation date in the footer would still be considered identical.
   *
   * When used in combination with [If-Modified-Since](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Modified-Since), `If-None-Match` has precedence if the server supports it.
   *
   * There are two common cases for using `If-None-Match` in requests:
   *
   * - For [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) and [HEAD](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/HEAD) methods, to update a cached entity that has an associated ETag.
   * - For other methods, and in particular for [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/PUT), `If-None-Match` used with the `*` value can be used to save a file only if it does not already exist, guaranteeing that the upload won't accidentally overwrite another upload and lose the data of the previous `PUT`; this problem is a variation of the [lost update problem](https://www.w3.org/1999/04/Editing/#3.1).
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * If-None-Match: "<etag_value>"
   * If-None-Match: "<etag_value>", "<etag_value>", …
   * If-None-Match: *
   * ```
   *
   * ## Directives
   *
   * - `<etag_value>`
   *   - : Entity tags uniquely representing the requested resources. They are a string of [ASCII](https://developer.mozilla.org/en-US/docs/Glossary/ASCII) characters placed between double quotes (Like `"675af34563dc-tr34"`) and may be prefixed by `W/` to indicate that the weak comparison algorithm should be used (this is useless with `If-None-Match` as it only uses that algorithm).
   * - `*`
   *   - : The asterisk is a special value representing any resource. They are only useful when uploading a resource, usually with [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/PUT), to check if another resource with the identity has already been uploaded before.
   *
   * ## Examples
   *
   * ```http
   * If-None-Match: "bfc13a64729c4290ef5b2c2730249c88ca92d82d"
   *
   * If-None-Match: W/"67ab43", "54ed21", "7892dd"
   *
   * If-None-Match: *
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag)
   * - [If-Match](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Match), [If-Modified-Since](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Modified-Since), [If-Unmodified-Since](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Unmodified-Since) conditional request headers
   * - [304 Not Modified](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/304), [412 Precondition Failed](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/412) response status codes
   */
  'If-None-Match' = 'If-None-Match',

  /**
   * The HTTP **`If-Range`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) makes a range request [conditional](/en-US/docs/Web/HTTP/Guides/Conditional_requests).
   * If the condition is fulfilled, a [range request](/en-US/docs/Web/HTTP/Guides/Range_requests) is issued, and the server sends back a [206 Partial Content](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/206) response with part (or parts) of the resource in the body.
   * If the condition is not fulfilled, the full resource is sent back with a [200 OK](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200) status.
   *
   * This header can be used either with the [Last-Modified](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Last-Modified) validator or with [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag), but not with both.
   *
   * The most common use case is to resume a download with guarantees that the resource on the server has not been modified since the last part has been received by the client.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * If-Range: <day-name>, <day> <month> <year> <hour>:<minute>:<second> GMT
   * If-Range: <etag>
   * ```
   *
   * ## Directives
   *
   * - `<etag>`
   *   - : An entity tag uniquely representing the requested resource. It is a string of ASCII
   *     characters placed between double quotes (Like `"675af34563dc-tr34"`). A weak entity tag (one prefixed by `W/`) must not be used in this header.
   * - `<day-name>`
   *   - : One of `Mon`, `Tue`, `Wed`, `Thu`, `Fri`, `Sat`, or `Sun` (case-sensitive).
   * - `<day>`
   *   - : 2 digit day number, e.g., "04" or "23".
   * - `<month>`
   *   - : One of `Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec` (case sensitive).
   * - `<year>`
   *   - : 4 digit year number, e.g., "1990" or "2016".
   * - `<hour>`
   *   - : 2 digit hour number, e.g., "09" or "23".
   * - `<minute>`
   *   - : 2 digit minute number, e.g., "04" or "59".
   * - `<second>`
   *   - : 2 digit second number, e.g., "04" or "59".
   * - GMT
   *   - : Greenwich Mean Time. HTTP dates are always expressed in GMT, never in local time.
   *
   * ## Examples
   *
   * ```http
   * If-Range: Wed, 21 Oct 2015 07:28:00 GMT
   *
   * If-Range: "67ab43"
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [HTTP Conditional Requests](/en-US/docs/Web/HTTP/Guides/Conditional_requests) guide
   * - [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag)
   * - [Last-Modified](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Last-Modified)
   * - [If-Match](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Match), [If-Modified-Since](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Modified-Since), [If-Unmodified-Since](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Unmodified-Since), [If-None-Match](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-None-Match) conditional request headers
   * - [206 Partial Content](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/206), [412 Precondition Failed](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/412), [416 Range Not Satisfiable](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/416) response status codes
   */
  'If-Range' = 'If-Range',

  /**
   * The HTTP **`If-Unmodified-Since`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) makes the request for the resource [conditional](/en-US/docs/Web/HTTP/Guides/Conditional_requests).
   * The server will send the requested resource (or accept it in the case of a [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/POST) or another non-[safe](https://developer.mozilla.org/en-US/docs/Glossary/Safe/HTTP) method) only if the resource on the server has not been modified after the date in the request header.
   * If the resource has been modified after the specified date, the response will be a [412 Precondition Failed](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/412) error.
   *
   * The `If-Unmodified-Since` header is commonly used in the following situations:
   *
   * - In conjunction with non-[safe](https://developer.mozilla.org/en-US/docs/Glossary/Safe/HTTP) methods like [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/POST), this header can be used to implement an [optimistic concurrency control](https://en.wikipedia.org/wiki/Optimistic_concurrency_control), as is done by some wikis: revision are rejected if the stored document has been modified since the original was retrieved, avoiding conflicts.
   * - In conjunction with a range request using the [Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Range) header, this header can be used to ensure that the new fragment requested comes from an unmodified document.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * If-Unmodified-Since: <day-name>, <day> <month> <year> <hour>:<minute>:<second> GMT
   * ```
   *
   * ## Directives
   *
   * - `<day-name>`
   *   - : One of `Mon`, `Tue`, `Wed`, `Thu`, `Fri`, `Sat`, or `Sun` (case-sensitive).
   * - `<day>`
   *   - : 2 digit day number, e.g., "04" or "23".
   * - `<month>`
   *   - : One of `Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec` (case sensitive).
   * - `<year>`
   *   - : 4 digit year number, e.g., "1990" or "2016".
   * - `<hour>`
   *   - : 2 digit hour number, e.g., "09" or "23".
   * - `<minute>`
   *   - : 2 digit minute number, e.g., "04" or "59".
   * - `<second>`
   *   - : 2 digit second number, e.g., "04" or "59".
   * - GMT
   *   - : Greenwich Mean Time. HTTP dates are always expressed in GMT, never in local time.
   *
   * ## Examples
   *
   * ```http
   * If-Unmodified-Since: Wed, 21 Oct 2015 07:28:00 GMT
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [HTTP Conditional Requests](/en-US/docs/Web/HTTP/Guides/Conditional_requests) guide
   * - [Last-Modified](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Last-Modified)
   * - [If-Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Range), [Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Range) range request headers
   * - [If-Match](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Match), [If-Modified-Since](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Modified-Since), [If-None-Match](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-None-Match) conditional request headers
   * - [304 Not Modified](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/304), [412 Precondition Failed](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/412) response status codes
   */
  'If-Unmodified-Since' = 'If-Unmodified-Since',

  /**
   * The HTTP **`Integrity-Policy-Report-Only`** response header allows website administrators to report on resources that the user agent loads that would violate [Subresource Integrity](/en-US/docs/Web/Security/Subresource_Integrity) guarantees if the integrity policy was enforced (using the [Integrity-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Integrity-Policy) header).
   *
   * Reports may be generated for requests on specified [request destinations](/en-US/docs/Web/API/Request/destination) that omit integrity metadata, or that are made in [no-cors](/en-US/docs/Web/API/Request/mode#no-cors) mode.
   * For reports to be sent to a reporting endpoint, the `Integrity-Policy-Report-Only` header must specify a valid reporting endpoint name that matches an endpoint declared using the [Reporting-Endpoints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Reporting-Endpoints) header.
   * Reports are generated using the [Reporting API](/en-US/docs/Web/API/Reporting_API), and may also be observed in the page for which the integrity policy is being reported, using a [ReportingObserver](/en-US/docs/Web/API/ReportingObserver).
   * The format of the report body is given by the [IntegrityViolationReportBody](https://developer.mozilla.org/en-US/docs/domxref/IntegrityViolationReportBody) dictionary (a JSON-serialized form of this body is sent in POSTs to reporting server endpoints).
   *
   * The header allow developers to test [integrity policies](/en-US/docs/Web/Security/Subresource_Integrity#integrity_policy) and fix any content issues before eventually deploying an [Integrity-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Integrity-Policy) header to enforce the policy.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Integrity-Policy-Report-Only: blocked-destinations=(<destination>),sources=(<source>),endpoints=(<endpoint>)
   * ```
   *
   * The header values are defined as structured field dictionaries with the following keys:
   *
   * - `blocked-destinations`
   *   - : A list of [request destinations](/en-US/docs/Web/API/Request/destination) that must include valid integrity metadata.
   *     Allowed values are:
   *     - `script`
   *       - : Script resources.
   *
   * - `sources`
   *   - : A list of integrity sources that must include integrity metadata.
   *     Allowed values are:
   *     - `inline`
   *       - : The integrity metadata source is inline to the content, such as the [integrity attribute](/en-US/docs/Web/API/HTMLScriptElement/integrity).
   *         This is the default.
   *
   *         As this is the default and only value, omitting `sources` is equivalent to specifying `sources=(inline)`.
   *
   * - `endpoints`
   *   - : A list of [reporting endpoint names](/en-US/docs/Web/HTTP/Reference/Headers/Reporting-Endpoints#endpoint) that indicate where reports will be sent.
   *     The reporting endpoints must be defined in a [Reporting-Endpoints](https://developer.mozilla.org/en-US/docs/httpheader/Reporting-Endpoints) header.
   *
   * ## Examples
   *
   * ### Reporting when scripts lack integrity metadata
   *
   * This example shows a document that reports when any [script](https://developer.mozilla.org/en-US/docs/htmlelement/script) (or `HTMLScriptElement`) does not specify an `integrity` attribute, or when a script resource is requested in [no-cors](/en-US/docs/Web/API/Request/mode#no-cors) mode.
   *
   * Note that the `integrity-endpoint` used in `Integrity-Policy-Report-Only` is defined in the [Reporting-Endpoints](https://developer.mozilla.org/en-US/docs/httpheader/Reporting-Endpoints) header.
   *
   * ```http
   * Reporting-Endpoints: integrity-endpoint=https://example.com/integrity, backup-integrity-endpoint=https://report-provider.example/integrity
   * Integrity-Policy-Report-Only: blocked-destinations=(script), endpoints=(integrity-endpoint, backup-integrity-endpoint)
   * ```
   *
   * The [report payload](/en-US/docs/Web/API/Reporting_API#reporting_server_endpoints) might look like this.
   *
   * ```json
   * {
   *   "type": "integrity-violation",
   *   "url": "https://example.com",
   *   "body": {
   *     "documentURL": "https://example.com",
   *     "blockedURL": "https://example.com/main.js",
   *     "destination": "script",
   *     "reportOnly": false
   *   }
   * }
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Integrity-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Integrity-Policy)
   * - [Reporting-Endpoints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Reporting-Endpoints)
   * - [Integrity Policy](/en-US/docs/Web/Security/Subresource_Integrity#integrity_policy)
   * - [Reporting API](/en-US/docs/Web/API/Reporting_API)
   */
  'Integrity-Policy-Report-Only' = 'Integrity-Policy-Report-Only',

  /**
   * The HTTP **`Integrity-Policy`** response header allows website administrators to ensure that all resources the user agent loads (of a certain type) have [Subresource Integrity](/en-US/docs/Web/Security/Subresource_Integrity) guarantees.
   *
   * When set the user agent will block requests on specified [request destinations](/en-US/docs/Web/API/Request/destination) that omit integrity metadata, and will also block requests in [no-cors](/en-US/docs/Web/API/Request/mode#no-cors) mode from ever being made.
   *
   * Violation reports may also be sent to if the header includes a reporting endpoint name that matches an endpoint declared using the [Reporting-Endpoints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Reporting-Endpoints) header.
   * Reports are generated using the [Reporting API](/en-US/docs/Web/API/Reporting_API), and may also be observed in the page for which the integrity policy is being enforced, using a [ReportingObserver](/en-US/docs/Web/API/ReportingObserver).
   * The format of the report body is given by the [IntegrityViolationReportBody](https://developer.mozilla.org/en-US/docs/domxref/IntegrityViolationReportBody) dictionary (a JSON-serialized form of this body is sent in POSTs to reporting server endpoints).
   *
   * This helps guard against content manipulation of fetched subresources.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Integrity-Policy: blocked-destinations=(<destination>),sources=(<source>),endpoints=(<endpoint>)
   * ```
   *
   * The header values are defined as structured field dictionaries with the following keys:
   *
   * - `blocked-destinations`
   *   - : A list of [request destinations](/en-US/docs/Web/API/Request/destination) that must include valid integrity metadata.
   *     Allowed values are:
   *     - `script`
   *       - : Script resources.
   *
   * - `sources`
   *   - : A list of integrity sources that must include integrity metadata.
   *     Allowed values are:
   *     - `inline`
   *       - : The integrity metadata source is inline to the content, such as the [integrity attribute](/en-US/docs/Web/API/HTMLScriptElement/integrity).
   *         This is the default.
   *
   *         As this is the default and only value, omitting `sources` is equivalent to specifying `sources=(inline)`.
   *
   * - `endpoints`
   *   - : A list of [reporting endpoint names](/en-US/docs/Web/HTTP/Reference/Headers/Reporting-Endpoints#endpoint) that indicate where reports will be sent.
   *     The reporting endpoints must be defined in a [Reporting-Endpoints](https://developer.mozilla.org/en-US/docs/httpheader/Reporting-Endpoints) header.
   *
   * ## Examples
   *
   * ### Blocking and reporting when scripts lack integrity metadata
   *
   * This example shows a document that blocks and reports when any [script](https://developer.mozilla.org/en-US/docs/htmlelement/script) (or `HTMLScriptElement`) does not specify an `integrity` attribute, or when a script resource is requested in [no-cors](/en-US/docs/Web/API/Request/mode#no-cors) mode.
   *
   * Note that the `integrity-endpoint` used in `Integrity-Policy` is defined in the [Reporting-Endpoints](https://developer.mozilla.org/en-US/docs/httpheader/Reporting-Endpoints) header.
   *
   * ```http
   * Reporting-Endpoints: integrity-endpoint=https://example.com/integrity, backup-integrity-endpoint=https://report-provider.example/integrity
   * Integrity-Policy: blocked-destinations=(script), endpoints=(integrity-endpoint, backup-integrity-endpoint)
   * ```
   *
   * The [report payload](/en-US/docs/Web/API/Reporting_API#reporting_server_endpoints) might look like this.
   *
   * ```json
   * {
   *   "type": "integrity-violation",
   *   "url": "https://example.com",
   *   "body": {
   *     "documentURL": "https://example.com",
   *     "blockedURL": "https://example.com/main.js",
   *     "destination": "script",
   *     "reportOnly": false
   *   }
   * }
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Integrity-Policy-Report-Only](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Integrity-Policy-Report-Only)
   * - [Integrity Policy](/en-US/docs/Web/Security/Subresource_Integrity#integrity_policy)
   * - [Reporting API](/en-US/docs/Web/API/Reporting_API)
   */
  'Integrity-Policy' = 'Integrity-Policy',

  /**
   * The HTTP **`Keep-Alive`** [request](https://developer.mozilla.org/en-US/docs/Glossary/request_header) and [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) allows the sender to hint how a connection may be used in terms of a timeout and a maximum amount of requests.
   *
   * > [!NOTE]
   * > For `Keep-Alive` to have any effect, the message must also include a [Connection: keep-alive](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Connection) header.
   *
   * HTTP/1.0 closes the connection after each request/response interaction by default, so persistent connections in HTTP/1.0 must be explicitly negotiated.
   * Some clients and servers might wish to be compatible with previous approaches to persistent connections, and can do this with a `Connection: keep-alive` request header.
   * Additional parameters for the connection can be requested with the `Keep-Alive` header.
   *
   * > [!WARNING]
   * > Connection-specific header fields such as [Connection](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Connection) and `Keep-Alive` are prohibited in [HTTP/2](https://httpwg.org/specs/rfc9113.html#ConnectionSpecific) and [HTTP/3](https://httpwg.org/specs/rfc9114.html#header-formatting).
   * > Chrome and Firefox ignore them in HTTP/2 responses, but Safari conforms to the HTTP/2 specification requirements and does not load any response that contains them.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Keep-Alive: <parameters>
   * ```
   *
   * ## Directives
   *
   * - `<parameters>`
   *   - : A comma-separated list of parameters, each consisting of an identifier and a value separated by the equal sign (`=`).
   *     The following identifiers are possible:
   *     - `timeout`
   *       - : An integer that is the time in seconds that the host will allow an idle connection to remain open before it is closed.
   *         A connection is idle if no data is sent or received by a host. A host may keep an idle connection open for longer than `timeout` seconds, but the host should attempt to retain a connection for at least `timeout` seconds.
   *     - `max`
   *       - : An integer that is the maximum number of requests that can be sent on this connection before closing it.
   *         Unless `0`, this value is ignored for non-pipelined connections as another request will be sent in the next response.
   *         An HTTP pipeline can use it to limit the pipelining.
   *
   * ## Examples
   *
   * A response containing a `Keep-Alive` header:
   *
   * ```http
   * HTTP/1.1 200 OK
   * Connection: Keep-Alive
   * Content-Encoding: gzip
   * Content-Type: text/html; charset=utf-8
   * Date: Thu, 11 Aug 2016 15:23:13 GMT
   * Keep-Alive: timeout=5, max=200
   * Last-Modified: Mon, 25 Jul 2016 04:32:39 GMT
   * Server: Apache
   *
   * (body)
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Connection](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Connection)
   * - [Connection management in HTTP/1.x](/en-US/docs/Web/HTTP/Guides/Connection_management_in_HTTP_1.x)
   */
  'Keep-Alive' = 'Keep-Alive',

  /**
   * The HTTP **`Last-Modified`** [response header](https://developer.mozilla.org/en-US/docs/glossary/response_header) contains a date and time when the origin server believes the resource was last modified.
   * It is used as a validator in [conditional requests](/en-US/docs/Web/HTTP/Guides/Conditional_requests) ([If-Modified-Since](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Modified-Since) or [If-Unmodified-Since](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Unmodified-Since)) to determine if a requested resource is the same as one already stored by the client.
   * It is less accurate than an [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) for determining file contents, but can be used as a fallback mechanism if ETags are unavailable.
   *
   * `Last-Modified` is also used by [crawlers](/en-US/docs/Glossary/Crawler) to adjust crawl frequency, by browsers in [heuristic caching](/en-US/docs/Web/HTTP/Guides/Caching#heuristic_caching), and by content management systems (CMS) to display the time the content was last modified.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Last-Modified: <day-name>, <day> <month> <year> <hour>:<minute>:<second> GMT
   * ```
   *
   * ## Directives
   *
   * - `<day-name>`
   *   - : One of "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", or "Sun" (case-sensitive).
   * - `<day>`
   *   - : 2 digit day number, e.g., "04" or "23".
   * - `<month>`
   *   - : One of "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" (case-sensitive).
   * - `<year>`
   *   - : 4 digit year number, e.g., "1990" or "2016".
   * - `<hour>`
   *   - : 2 digit hour number, e.g., "09" or "23".
   * - `<minute>`
   *   - : 2 digit minute number, e.g., "04" or "59".
   * - `<second>`
   *   - : 2 digit second number, e.g., "04" or "59".
   * - GMT
   *   - : Greenwich Mean Time. HTTP dates are always expressed in GMT, never in local time.
   *
   * ## Examples
   *
   * ```http
   * Last-Modified: Wed, 21 Oct 2015 07:28:00 GMT
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Etag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Etag)
   * - [HTTP Conditional Requests](/en-US/docs/Web/HTTP/Guides/Conditional_requests) guide
   * - [If-Match](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Match), [If-Modified-Since](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Modified-Since), [If-Unmodified-Since](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Unmodified-Since), [If-None-Match](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-None-Match) conditional request headers
   * - [304 Not Modified](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/304), [412 Precondition Failed](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/412) response status codes
   */
  'Last-Modified' = 'Last-Modified',

  /**
   * The HTTP **`Link`** header provides a means for serializing one or more links in HTTP headers.
   * This allows the server to point a client to another resource containing metadata about the requested resource.
   * This header has the same semantics as the HTML [link](https://developer.mozilla.org/en-US/docs/HTMLElement/link) element.
   * One benefit of using the `Link` header is that the browser can start preconnecting or preloading resources before the HTML itself is fetched and processed.
   *
   * In practice, most [`rel` link types](/en-US/docs/Web/HTML/Reference/Attributes/rel) don't have an effect when used with the HTTP header.
   * For example, the `icon` relation only works in HTML, and `stylesheet` does not work reliably across browsers (only in Firefox).
   * The only relations that work reliably are [`preconnect`](/en-US/docs/Web/HTML/Reference/Attributes/rel/preconnect) and [`preload`](/en-US/docs/Web/HTML/Reference/Attributes/rel/preload), which can be combined with .
   *
   * ; rel=preload; as=style; fetchpriority="high"
   * ```
   *
   * Note that both the internal prioritization for fetching resources and the effect of the `fetchpriority` directive are browser-dependent.
   * The `fetchpriority` directive should be used sparingly, and only in cases where a browser cannot infer that a particular resource should be treated with a different priority.
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [103 Early Hints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103)
   * - [link](https://developer.mozilla.org/en-US/docs/HTMLElement/link)
   * - [Link Relations](https://www.iana.org/assignments/link-relations/link-relations.xhtml) IANA registry
   * - [Optimize resource loading with the Fetch Priority API](https://web.dev/articles/fetch-priority?hl=en#browser_priority_and_fetchpriority) for information about how this API affects priorities on Chrome.
   */
  'Link' = 'Link',

  /**
   * The HTTP **`Location`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) indicates the URL to redirect a page to.
   * It only provides a meaning when served with a `3XX` [redirection response](/en-US/docs/Web/HTTP/Reference/Status#redirection_messages) or a [201 Created](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201) status response.
   *
   * In redirections, the HTTP method used to make the redirected request to fetch the page pointed to by `Location` depends on the original method and the kind of redirection:
   *
   * - [303 See Other](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/303) responses always result in a [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) request in the redirection.
   * - [307 Temporary Redirect](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/307) and [308 Permanent Redirect](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/308) use the same method as the initiating request.
   * - [301 Moved Permanently](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/301) and [302 Found](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/302) should use the same request method as the initiating request, although this is not guaranteed for older user-agents.
   *
   * All responses with one of the above status codes include a `Location` header.
   *
   * In cases of resource creation, it indicates the URL of the newly-created resource so that a client can make a request for it immediately.
   *
   * `Location` and [Content-Location](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Location) are different.
   * `Content-Location` indicates the URL to use to directly access the resource in future when [content negotiation](/en-US/docs/Web/HTTP/Guides/Content_negotiation) occurred.
   * `Location` is associated with the response, while [Content-Location](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Location) is associated with the representation that was returned.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Location: <url>
   * ```
   *
   * ## Directives
   *
   * - `<url>`
   *   - : May be relative to the request URL or an absolute URL.
   *
   * ## Examples
   *
   * ```http
   * Location: /index.html
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Content-Location](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Location)
   * - Status responses including a `Location` header: [201](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201), [301](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/301), [302](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/302), [303](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/303), [307](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/307), [308](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/308).
   */
  'Location' = 'Location',

  /**
   * The HTTP **`Max-Forwards`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) is used with the [TRACE](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/TRACE) and [OPTIONS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/OPTIONS) method to limit the number of nodes (usually [proxies](https://developer.mozilla.org/en-US/docs/Glossary/Proxy_server)) that the request goes through.
   *
   * Its value is an integer indicating the _maximum amount_ of nodes it must visit.
   * At each node, the value is decremented and the request is forwarded to the next node until the destination is reached or the received value of `Max-Forwards` is zero.
   * The request is then sent back (excluding sensitive headers where appropriate) as the body of a [200](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200) response.
   * This allows the client to see what is being received at the other end of the request chain (the [Via](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Via) header is of particular interest) for testing or diagnostic purposes.
   *
   * If the `Max-Forwards` header is not present in a `TRACE` or `OPTIONS` request, a node will assume that there is no maximum number of forwards.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Max-Forwards: <integer>
   * ```
   *
   * ## Examples
   *
   * ```http
   * Max-Forwards: 0
   * Max-Forwards: 10
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * This feature is neither targeted at, nor implemented in, browsers.
   *
   * ## See also
   *
   * - [TRACE](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/TRACE) method
   * - [OPTIONS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/OPTIONS) method
   * - [405 Method Not Allowed](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405)
   */
  'Max-Forwards' = 'Max-Forwards',

  /**
   * The HTTP **`NEL`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) is used to configure network request logging.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * NEL: { "report_to": "name_of_reporting_group", "max_age": 12345, "include_subdomains": false, "success_fraction": 0.0, "failure_fraction": 1.0 }
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Network Error Logging (NEL) explainer](/en-US/docs/Web/HTTP/Guides/Network_Error_Logging)
   */
  'NEL' = 'NEL',

  /**
   * The HTTP **`No-Vary-Search`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) specifies a set of rules that define how a URL's query parameters will affect cache matching.
   * These rules dictate whether the same URL with different URL parameters should be saved as separate browser cache entries.
   *
   * This allows the browser to reuse existing resources despite mismatching URL parameters to avoid the expense of fetching the resource again, when the same content will be returned.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * No-Vary-Search: key-order
   * No-Vary-Search: params
   * No-Vary-Search: params=("param1" "param2")
   * No-Vary-Search: params, except=("param1" "param2")
   * No-Vary-Search: key-order, params, except=("param1")
   * ```
   *
   * ## Directives
   *
   * - `key-order`
   *   - : Indicates that URLs will not be cached as separate entries if _the order_ in which parameters appear in the URL is the only difference.
   *     The presence of other parameters _will_ cause URLs to be cached separately.
   * - `params`
   *   - : Either a boolean or a list of strings:
   *     - As a boolean (`params`), it indicates that URLs that differ only by their parameters will not be cached as separate entries.
   *     - An inner list of space-separated strings (`params=("param1" "param2")`).
   *       Indicates that URLs that differ only by the listed parameters will not be cached as separate entries.
   *       The presence of other parameters _will_ cause them to be cached separately.
   * - `except`
   *   - : An inner list of space-separated strings (`except=("param1" "param2")`).
   *     Indicates that URLs that differ only by the listed parameters _will_ be cached as separate entries.
   *     A boolean `params` directive has to be included for it to take effect (`params, except=("param1" "param2")`).
   *     The presence of other parameters that are not in the `except=` list _won't_ cause URLs to be cached as separate entries.
   *
   * ## Description
   *
   * ### Relationship with the Speculation Rules API
   *
   * The [Speculation Rules API](/en-US/docs/Web/API/Speculation_Rules_API) supports using the `No-Vary-Search` header to reuse an existing prefetched or prerendered page for different URL parameters — if they are included in the `No-Vary-Search` header.
   *
   * > [!WARNING]
   * > Additional care must be taken when using prerender with `No-Vary-Search` since the page may initially be prerendered with different URL parameters. `No-Vary-Search` is used for URL parameters that deliver the same resource from the server, but are used by the client for various reasons (client-side rendering, UTM parameters for analytics measurement, etc.). As the initial prerender may be for different URL parameters, any code depending on them should only run after prerender activation.
   *
   * The Speculation Rules API can also include an `expects_no_vary_search` field, which indicates to the browser what the expected `No-Vary-Search` value will be (if any) for documents that it is receiving prefetch/prerender requests for via the speculation rules. The browser can use this to determine ahead of time whether it is more useful to wait for an existing prefetch/prerender to finish, or start a new fetch request when the speculation rule is matched. See the ["expects_no_vary_search" example](/en-US/docs/Web/HTML/Reference/Elements/script/type/speculationrules#expects_no_vary_search_example) for an explanation of how this can be used.
   *
   * ## Examples
   *
   * ### Allowing responses from URLs with differently ordered params to match the same cache entry
   *
   * If you have for example a search page that stores its search criteria in URL parameters, and you can't guarantee that the parameters will be added to the URL in the same order each time, you can allow responses from URLs that are identical except for the order of the parameters to match the same cache entry using `key-order`:
   *
   * ```http
   * No-Vary-Search: key-order
   * ```
   *
   * When this header is added to the associated responses, the following URLs would be treated as equivalent when searching the cache:
   *
   * ```plain
   * https://search.example.com?a=1&b=2&c=3
   * https://search.example.com?b=2&a=1&c=3
   * ```
   *
   * The presence of different URL parameters, however, will cause these URLs to be cached separately. For example:
   *
   * ```plain
   * https://search.example.com?a=1&b=2&c=3
   * https://search.example.com?b=2&a=1&c=3&d=4
   * ```
   *
   * The below examples illustrate how to control which parameters are ignored in the context of cache matching.
   *
   * ### Allowing responses from URLs with a different param to match the same cache entry
   *
   * Consider a case where a user directory landing page, `/users`, has already been cached. An `id` parameter might be used to bring up information on a specific user, for example `/users?id=345`. Whether this URL should be considered identical for cache matching purposes depends on the behavior of the application:
   *
   * - If this parameter has the effect of loading a completely new page containing the information for the specified user, then the response from this URL should be cached separately.
   * - If this parameter has the effect of highlighting the specified user on the same page, and perhaps revealing a pullout panel displaying their data, then it would be better for the browser to use the cached response for `/users`. This could result in performance improvements around the loading of the user pages.
   *
   * If your application behaves like the second example described above, you could cause both `/users` and `/users?id=345` to be treated as identical for caching purposes via a `No-Vary-Search` header like so:
   *
   * ```http
   * No-Vary-Search: params=("id")
   * ```
   *
   * > [!NOTE]
   * > If a parameter is excluded from the cache key using `params`, if it is included in the URL it will be ignored for the purposes of cache matching, regardless of where it appears in the parameter list.
   *
   * ### Allowing responses from URLs with multiple different params to match the same cache entry
   *
   * Say you also had URL parameters that sorted the list of users on the page in ascending or descending alphabetical order, and specified the language to display the UI strings in, for example `/users?id=345&order=asc&lang=fr`.
   *
   * You could get the browser to ignore all of these when considering cache matching like so:
   *
   * ```http
   * No-Vary-Search: params=("id" "order" "lang")
   * ```
   *
   * > [!NOTE]
   * > As a [structured field](https://www.rfc-editor.org/rfc/rfc8941), the parameters should be space-separated, quoted strings — as shown above — and not comma-separated, which developers may be more used to.
   *
   * If you wanted the browser to ignore all of them _and_ any others that might be present when cache matching, you could use the boolean form of `params`:
   *
   * ```http
   * No-Vary-Search: params
   * ```
   *
   * ### Specifying params that _do_ cause cache matching misses
   *
   * Say the app behaved differently, with `/users` pointing to the main user directory landing page and `/users?id=345` pointing to a completely separate detail page for a specific user. In this case you would want the browser to ignore all the parameters mentioned above for cache matching purposes, _except_ for `id`, the presence of which would cause the browser to not match the `/users` cache entry and request `/users?id=345` from the server.
   *
   * This can be achieved like so:
   *
   * ```http
   * No-Vary-Search: params, except=("id")
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [HTTP Caching: Vary](/en-US/docs/Web/HTTP/Guides/Caching#vary) and [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) header
   */
  'No-Vary-Search' = 'No-Vary-Search',

  /**
   * > [!WARNING]
   * > This feature is currently opposed by two browser vendors. See the [Standards positions](/en-US/docs/Web/API/Topics_API#standards_positions) section for details of opposition.
   *
   * The HTTP **`Observe-Browsing-Topics`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) is used to mark topics of interest inferred from a calling site's URL (i.e., the site where the ad tech [iframe](https://developer.mozilla.org/en-US/docs/HTMLElement/iframe) is embedded) as observed in the response to a request generated by a [feature that enables the Topics API](/en-US/docs/Web/API/Topics_API/Using#what_api_features_enable_the_topics_api).
   * The browser will subsequently use those topics to calculate top topics for the current user for future epochs.
   *
   * See [Using the Topics API](/en-US/docs/Web/API/Topics_API/Using) for more details.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Observe-Browsing-Topics: ?1
   * ```
   *
   * ### Directives
   *
   * - `?1`
   *   - : A character sequence declaring that topics of interest inferred from a calling site's URL (i.e., the site where the ad tech `<iframe>` is embedded) are marked as observed. The browser will subsequently use those topics to calculate topics of interest for a user for future epochs.
   *
   * ## Specifications
   *
   * This feature is not part of an official standard, although it is specified in the [Topics API Unofficial Proposal Draft](https://patcg-individual-drafts.github.io/topics/).
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Topics API](/en-US/docs/Web/API/Topics_API)
   */
  'Observe-Browsing-Topics' = 'Observe-Browsing-Topics',

  /**
   * The HTTP **`Origin-Agent-Cluster`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) is used to request that the associated [Document](https://developer.mozilla.org/en-US/docs/domxref/Document) should be placed in an origin-keyed [agent cluster](/en-US/docs/Web/JavaScript/Reference/Execution_model#agent_clusters_and_memory_sharing).
   * This means that operating system resources (for example, the operating system process) used to evaluate the document should be shared only with other documents from the same [origin](https://developer.mozilla.org/en-US/docs/glossary/origin).
   *
   * The effect of this is that a resource-intensive document will be less likely to degrade the performance of documents from other origins.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Origin-Agent-Cluster: <boolean>
   * ```
   *
   * ### Directives
   *
   * - `<boolean>`
   *   - : `?1` indicates that the associated [Document](https://developer.mozilla.org/en-US/docs/domxref/Document) should be placed in an origin-keyed agent cluster.
   *     Values other than `?1` are ignored (e.g., the `?0` structured field for false).
   *
   * ## Description
   *
   * Modern web browsers have a multiprocess architecture in which pages from different origins can run in different operating system processes. This is important for performance, because it means that a resource-intensive page will not have as much of an impact on other pages that the user has open.
   *
   * However, browsers can't as a general rule run [same-site](https://developer.mozilla.org/en-US/docs/glossary/site), [cross-origin](https://developer.mozilla.org/en-US/docs/glossary/origin) pages in different processes, because of certain DOM APIs that depend on same-site, cross-origin communication. For example, by default, pages from the following two origins will share the same operating system resources:
   *
   * ```plain
   * https://apples.example.org
   * https://oranges.example.org
   * ```
   *
   * By setting the `Origin-Agent-Cluster` header, a page can request that the browser allocate dedicated resources to this origin that are not shared with any other origins.
   *
   * The browser is not required to honor the request. If it does, the [Window.originAgentCluster](https://developer.mozilla.org/en-US/docs/domxref/Window.originAgentCluster) property returns `true`, and the window is not able to do the following things, which all depend on same-site, cross-origin communication:
   *
   * - Use [Document.domain](https://developer.mozilla.org/en-US/docs/domxref/Document.domain).
   * - Send [`WebAssembly.Module`](/en-US/docs/WebAssembly/Reference/JavaScript_interface/Module) objects to other same-site cross-origin pages using [postMessage()](https://developer.mozilla.org/en-US/docs/domxref/Window.postMessage()).
   * - Send [SharedArrayBuffer](https://developer.mozilla.org/en-US/docs/jsxref/SharedArrayBuffer) or [`WebAssembly.Memory`](/en-US/docs/WebAssembly/Reference/JavaScript_interface/Memory) objects to other same-site cross-origin pages.
   *
   * Origin-keyed agent clusters should not be viewed as a security feature: browsers may ignore the request for various reasons, or choose to implement it in a way that does not provide memory protection (for example, using separate threads instead of separate processes). Instead, this feature is a hint that the user experience would be improved if this origin were allocated dedicated resources.
   *
   * For example, suppose your site includes a page from one origin that embeds a same-site, cross-origin iframe which runs a resource-intensive game. By setting `Origin-Agent-Cluster` on the document in the iframe, you can prevent the game from affecting the performance of the main page.
   *
   * The browser will ensure that all pages from a given origin are either origin-keyed or they are not. This means that:
   *
   * - If the first page from an origin does not set the header, then no other pages from that origin will be origin-keyed, even if those other pages do set the header.
   * - If the first page from an origin sets the header and is made origin-keyed, then all other pages from that origin will be origin-keyed whether they ask for it or not.
   *
   * To avoid this kind of unpredictable situation, you should set this header for all pages from a given origin, or none of them.
   *
   * ## Examples
   *
   * ```http
   * Origin-Agent-Cluster: ?1
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Window.originAgentCluster](https://developer.mozilla.org/en-US/docs/domxref/Window.originAgentCluster)
   * - [Agent clusters and memory sharing](/en-US/docs/Web/JavaScript/Reference/Execution_model#agent_clusters_and_memory_sharing) in _JavaScript execution model_
   * - [Requesting performance isolation with the Origin-Agent-Cluster header](https://web.dev/articles/origin-agent-cluster) on web.dev
   */
  'Origin-Agent-Cluster' = 'Origin-Agent-Cluster',

  /**
   * The HTTP **`Origin`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) indicates the [origin](https://developer.mozilla.org/en-US/docs/glossary/origin) ([scheme](/en-US/docs/Web/URI/Reference/Schemes), hostname, and port) that _caused_ the request.
   * For example, if a user agent needs to request resources included in a page, or fetched by scripts that it executes, then the origin of the page may be included in the request.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Origin: null
   * Origin: <scheme>://<hostname>
   * Origin: <scheme>://<hostname>:<port>
   * ```
   *
   * ## Directives
   *
   * - `null`
   *   - : The origin is "privacy sensitive", or is an _opaque origin_ as defined by the HTML specification (specific cases are listed in the [description](#description) section).
   * - `<scheme>`
   *   - : The protocol that is used.
   *     Usually, it is the HTTP protocol or its secured version, HTTPS.
   * - `<hostname>`
   *   - : The domain name or the IP address of the origin server.
   * - `<port>`
   *   - : Port number on which the server is listening.
   *     If no port is given, the default port for the requested service is implied from the scheme (e.g., `80` for an HTTP URL).
   *
   * ## Description
   *
   * The `Origin` header is similar to the [Referer](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer) header, but does not disclose the path, and may be `null`.
   * It is used to provide the security context for the origin request, except in cases where the origin information would be sensitive or unnecessary.
   *
   * Broadly speaking, user agents add the `Origin` request header to:
   *
   * - [cross origin](https://developer.mozilla.org/en-US/docs/Glossary/CORS) requests.
   * - [same-origin](/en-US/docs/Web/Security/Same-origin_policy) requests except for [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) or [HEAD](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/HEAD) requests (i.e., they are added to same-origin [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/POST), [OPTIONS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/OPTIONS), [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/PUT), [PATCH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/PATCH), and [DELETE](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/DELETE) requests).
   *
   * There are some exceptions to the above rules; for example, if a cross-origin [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) or [HEAD](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/HEAD) request is made in [no-cors mode](/en-US/docs/Web/API/Request/mode#value), the `Origin` header will not be added.
   *
   * The `Origin` header value may be `null` in a number of cases, including (non-exhaustively):
   *
   * - Origins whose [scheme](/en-US/docs/Web/URI/Reference/Schemes) is not one of `http`, `https`, `ftp`, `ws`, `wss`, or `gopher` (including `blob`, `file` and `data`).
   * - Cross-origin images and media data, including that in [img](https://developer.mozilla.org/en-US/docs/HTMLElement/img), [video](https://developer.mozilla.org/en-US/docs/HTMLElement/video) and [audio](https://developer.mozilla.org/en-US/docs/HTMLElement/audio) elements.
   * - Documents created programmatically using [createDocument()](https://developer.mozilla.org/en-US/docs/domxref/DOMImplementation.createDocument), generated from a `data:` URL, or that do not have a creator browsing context.
   * - Redirects across origins.
   * - [iframes](https://developer.mozilla.org/en-US/docs/HTMLElement/iframe) with a sandbox attribute that doesn't contain the value `allow-same-origin`.
   * - Responses that are network errors.
   * - [Referrer-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy) set to `no-referrer` for non-`cors` request modes (e.g., basic form posts).
   *
   * > [!NOTE]
   * > There is a more detailed listing of cases that may return `null` on Stack Overflow: [When do browsers send the Origin header? When do browsers set the origin to null?](https://stackoverflow.com/questions/42239643/when-do-browsers-send-the-origin-header-when-do-browsers-set-the-origin-to-null/42242802)
   *
   * ## Examples
   *
   * ```http
   * Origin: https://developer.mozilla.org
   * ```
   *
   * ```http
   * Origin: https://developer.mozilla.org:80
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Host](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Host)
   * - [Referer](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer)
   * - [Same-origin policy](/en-US/docs/Web/Security/Same-origin_policy)
   * - [When do browsers send the Origin header? When do browsers set the origin to null?](https://stackoverflow.com/questions/42239643/when-do-browsers-send-the-origin-header-when-do-browsers-set-the-origin-to-null/42242802) (Stack Overflow)
   */
  'Origin' = 'Origin',

  /**
   * The HTTP **`Permissions-Policy`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) provides a mechanism to allow and deny the use of browser features in a document or within any [iframe](https://developer.mozilla.org/en-US/docs/HTMLElement/iframe) elements in the document.
   *
   * For more information, see the main [Permissions Policy](/en-US/docs/Web/HTTP/Guides/Permissions_Policy) article.
   *
   *
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Permissions Policy](/en-US/docs/Web/HTTP/Guides/Permissions_Policy)
   * - [Document.featurePolicy](https://developer.mozilla.org/en-US/docs/DOMxRef/Document.featurePolicy) and [FeaturePolicy](https://developer.mozilla.org/en-US/docs/DOMxRef/FeaturePolicy)
   * - [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy)
   * - [Referrer-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy)
   */
  'Permissions-Policy' = 'Permissions-Policy',

  /**
   * The HTTP **`Pragma`** header is an implementation-specific header that may have various effects along the request-response chain.
   * This header serves for backwards compatibility with HTTP/1.0 caches that do not support the [Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) HTTP/1.1 header.
   *
   * > [!NOTE]
   * > The `Pragma` header is not specified for HTTP responses and is therefore not a reliable replacement for the HTTP/1.1 `Cache-Control` header, although its behavior is the same as `Cache-Control: no-cache` if the `Cache-Control` header field is omitted in a request.
   * > Use `Pragma` only for backwards compatibility with HTTP/1.0 clients.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Pragma: no-cache
   * ```
   *
   * ## Directives
   *
   * - `no-cache`
   *   - : Same as `Cache-Control: no-cache`. Forces caches to submit the request to the origin server for validation before a cached copy is released.
   *
   * ## Examples
   *
   * ```http
   * Pragma: no-cache
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)
   * - [Expires](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Expires)
   */
  'Pragma' = 'Pragma',

  /**
   * The HTTP **`Prefer`** header allows clients to indicate preferences for specific server behaviors during request processing.
   *
   * > [!NOTE]
   * > Browsers have no handling for the `Prefer` and [Preference-Applied](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Preference-Applied) headers: they are used in custom, implementation-specific clients.
   * > Ensure both client and server support this header before relying on it in production.
   * >
   * > Servers should silently ignore preferences that they do not support, as though the header were not present.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Prefer: <preference>
   * ```
   *
   * ## Directives
   *
   * - `respond-async`
   *   - : The client prefers asynchronous processing.
   *     For example, the server might respond with [202 Accepted](https://developer.mozilla.org/en-US/docs/httpstatus/202) response indicated that the request has been accepted, along with the [Location](https://developer.mozilla.org/en-US/docs/httpheader/Location) header that has a URL that the client can use to monitor the state of the processing.
   * - `return=minimal`
   *   - : Requests that the server return minimal content (a headers-only response).
   * - `return=representation`
   *   - : Requests a full resource representation in the response.
   * - `wait=<seconds>`
   *   - : The time within which the client expects the server to provide a response, from the point at which the request was received.
   *     If the `respond-async` preference is also provided, the server should respond asynchronously if processing the request will exceed the wait time.
   *     Otherwise, the server should consider that the client will timeout after the `wait` time (response behavior depends on server implementation).
   * - `handling=lenient`
   *   - : The client wishes the server to apply lenient validation and error handling to the processing of the request.
   * - `handling=strict`
   *   - : The client wishes the server to apply strict validation and error handling to the processing of the request.
   * - Custom preference
   *   - : Vendors or applications may define their own preferences to suit specific needs.
   *     For example, `Prefer: timezone=America/Los_Angeles`.
   *
   * ## Examples
   *
   * ### Requesting minimal response
   *
   * The following request asks for a minimal response.
   * This is typically a headers-only response (as opposed to `return=representation` where a representation is included in the response body):
   *
   * ```http
   * POST /resource HTTP/1.1
   * Host: example.com
   * Content-Type: application/json
   * Prefer: return=minimal
   *
   * {"id":123, "name": "abc"}
   * ```
   *
   * The server responds with a [201](https://developer.mozilla.org/en-US/docs/httpstatus/201), but does not include any response body.
   * The [Location](https://developer.mozilla.org/en-US/docs/httpheader/Location) header contains a URL with the location of the newly-created resource.
   * There's no need to include a `Preference-Applied` header because the absence of a response body is readily apparent:
   *
   * ```http
   * HTTP/1.1 201 Created
   * Location: /resource?id=123
   * ```
   *
   * ### Requesting asynchronous processing
   *
   * This example requests the server start an async processing task:
   *
   * ```http
   * POST /process HTTP/1.1
   * Host: example.com
   * Prefer: respond-async
   *
   * {
   *   "task": "check-broken-links"
   * }
   * ```
   *
   * The server responds with a [202 Accepted](https://developer.mozilla.org/en-US/docs/httpstatus/202) response indicated the request has been accepted and has not yet completed executing asynchronously.
   * A `Location` header points to a status monitor that represents the state of the processing:
   *
   * ```http
   * HTTP/1.1 202 Accepted
   * Location: http://example.com/tasks/123/status
   * ```
   *
   * ### Providing multiple preferences
   *
   * The following request includes two preferences; `timezone=Jupiter/Red_Spot` indicating a time zone preference for the client, and `handling=strict` for strict validation:
   *
   * ```http
   * GET /events HTTP/1.1
   * Host: example.com
   * Prefer: handling=strict, timezone=Jupiter/Red_Spot
   * ```
   *
   * In this implementation, an invalid time zone will throw an error:
   *
   * ```http
   * HTTP/1.1 400 Bad Request
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [Preference-Applied](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Preference-Applied)
   * - [Prefer header](https://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part1-protocol.html#_Toc31358871) on docs.oasis-open.org
   * - [Prefer header](https://docs.postgrest.org/en/v12/references/api/preferences.html) on docs.postgrest.org
   */
  'Prefer' = 'Prefer',

  /**
   * The HTTP **`Preference-Applied`** header informs the client about which preferences from the [Prefer](https://developer.mozilla.org/en-US/docs/httpheader/Prefer) request header were applied by the server.
   *
   * The server indicates if a preference is applied to a response if it would otherwise be ambiguous for the client.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Preference-Applied: <preference>
   * ```
   *
   * ## Examples
   *
   * ### Server applies timezone preferences
   *
   * The following request indicates that the client prefers events to be represented in a certain time zone:
   *
   * ```http
   * GET /events HTTP/1.1
   * Host: example.com
   * Prefer: timezone=America/Los_Angeles
   * ```
   *
   * The server supports the preference and sends back the content with a `Preference-Applied` header:
   *
   * ```http
   * HTTP/1.1 200 OK
   * Content-Type: application/json
   * Preference-Applied: timezone=America/Los_Angeles
   *
   * [
   *   {"t":"2023-10-18T05:37:59.611-07:00"},
   *   {"t":"2023-10-18T07:37:59.611-07:00"},
   *   {"t":"2023-10-18T09:37:59.611-07:00"}
   * ]
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [Prefer](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Prefer)
   * - [Prefer header](https://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part1-protocol.html#_Toc31358871) on docs.oasis-open.org
   * - [Prefer header](https://docs.postgrest.org/en/v12/references/api/preferences.html) on docs.postgrest.org
   */
  'Preference-Applied' = 'Preference-Applied',

  /**
   * The HTTP **`Priority`** header indicates a client's preference for the priority order at which the response containing the requested resource should be sent, relative to other resource requests on the same connection.
   * If the header is not specified in the request, a default priority is assumed.
   * The server may also include this header in responses in order to indicate it has an interest in changing the prioritization preferences the client advertized.
   * In responses, this information can be used as an input to the prioritization process for caching servers and other servers that are forwarding the response.
   *
   * The server is not bound by client prioritization and might only use client priorities as hints for its own prioritization process.
   * For example, a server may know that a specific image is vital for user experience and should be sent at the highest priority.
   * Server prioritization might also be affected by factors such as network congestion.
   *
   * This request may be cached, and the server is expected to control the cacheability or the applicability of the cached response using the header fields that control the caching behavior, such as [Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) and [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary).
   *
   * > [!NOTE]
   * > This header is one part of the "Extensible Prioritization Scheme for HTTP" defined in [9218](https://developer.mozilla.org/en-US/docs/rfc/9218).
   * > There are also HTTP/2 and HTTP/3 `PRIORITY_UPDATE` frames that can be used to re-prioritize a resource request after it has been sent.
   * > The request can be sent in any HTTP version.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Priority: u=<priority>
   * Priority: i
   * Priority: u=<priority>, i
   * ```
   *
   * ## Directives
   *
   * - `u=<priority>`
   *   - : The "urgency" (`u`) parameter specifies a priority value `<priority>` for the resource.
   *     The value is an integer between 0 and 7 inclusive, in descending order of priority (0 is the highest urgency).
   *     The default priority value for requests is 3.
   *     There is no default priority value for responses: the absence of the header in a response indicates that the server has chosen not to modify the client priority.
   *     A priority of 7 should only be used for resources that are unlikely to affect the user experience, such as background tasks or delivery of software updates.
   *
   *     Browsers should request documents that are likely to use other resources at the default priority level.
   *     The referenced resources should then be requested using values that reflect the relative impact on the user experience of their arrival time.
   *
   *     Servers may have a different view on the priority than the client, and can respond with a different value in order to provide a priority hint to intermediate servers.
   *     The intermediate server may take this value into consideration along with the original request priority.
   *     The absence of the `Priority` header in the response indicates that the server chosen not to modify the client priority.
   *
   * - `i`
   *   - : The incremental (`i`) directive, if present, indicates than an HTTP response can be processed incrementally.
   *
   *     Resources that can be processed incrementally are those where the recipient can potentially do something useful as soon as a chunk arrives, rather than waiting for the complete resource to be available.
   *
   *     If a browser sets this directive then the server may choose to concurrently serve all incremental requests with the same urgency.
   *     This distributes the multiple requests across the connection bandwidth, with the result that all the requests start being processed earlier, but take longer in total to complete.
   *
   *     If the browser does not set this directive then it is indicating that it will not process the resource incrementally.
   *     Servers should in this case send responses with the same urgency one by one, in the order in which their associated requests were generated.
   *
   * > [!NOTE]
   * > Servers are expected to ignore directives on this header that they do not understand.
   * > New directives that are added in future are expected to be compatible with these existing directives so that they can be safely ignored.
   *
   * ## Examples
   *
   * ### Setting resource urgency
   *
   * The following example shows a request for an HTML file.
   * The urgency isn't set, and so defaults to 3, with `i` being false.
   * This is the normal setting for a document that owns other resources.
   *
   * ```http
   * :method = GET
   * :scheme = https
   * :authority = example.net
   * :path = /index.html
   * ```
   *
   * The request below is a possible follow-on request for a CSS file used by the HTML.
   * The urgency is set to 2, indicating that the browser considers it to be quite high priority, but `i` is unset because the CSS file can't be handled incrementally.
   *
   * ```http
   * :method = GET
   * :scheme = https
   * :authority = example.net
   * :path = /style.css
   * priority = u=2
   * ```
   *
   * > [!NOTE]
   * > The requests above use the human-readable format from the HTTP/2 or HTTP/3 specifications.
   * > The HTTP/1.1 format used in most of this documentation would be something like:
   * >
   * > ```http
   * > GET /style.css HTTP/1.1
   * > Host: example.net
   * > Priority: u=2
   * > ```
   *
   * A response might look as shown below.
   * Note that in this case the `priority` is not specified, indicating that the server did not feel that it needed to change the priority for intermediate servers.
   *
   * ```http
   * :status: 200
   * content-type: text/css
   * content-length: 610
   * date: [current date]
   * ```
   *
   * ### Setting the incremental directive
   *
   * The header below shows a browser request for an image that can be rendered incrementally.
   * In this case, the priority is set to 4 (lower than the default of 3), and `i` is set to indicate that the client can process the JPG file incrementally.
   *
   * ```http
   * :method = GET
   * :path = /image.jpg
   * :scheme = https
   * :authority = example.net
   * priority = u=4, i
   * ```
   *
   * The server might send a response like the one below.
   * In this case the priority is set to 1, indicating that the server has an understanding that particular image should be sent at high priority.
   *
   * ```http
   * :status: 200
   * content-type = image/jpeg
   * content-length = 610
   * ...
   * priority = u=1, i
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)
   * - [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary)
   */
  'Priority' = 'Priority',

  /**
   * The HTTP **`Proxy-Authenticate`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) defines the [authentication](/en-US/docs/Web/HTTP/Guides/Authentication) method (or [challenge](https://developer.mozilla.org/en-US/docs/Glossary/Challenge)) that should be used to gain access to a resource behind a [proxy server](https://developer.mozilla.org/en-US/docs/Glossary/proxy_server).
   * It is sent in a [407 Proxy Authentication Required](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/407) response so a client can identify itself to a proxy that requires authentication.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Proxy-Authenticate: <challenge>, …
   * ```
   *
   * The value is a comma-separated list of challenges, where a `<challenge>` is comprised of an `<auth-scheme>`, followed by an optional `<token68>` or a comma-separated list of `<auth-params>`:
   *
   * ```plain
   * challenge = <auth-scheme> <auth-param>, …, <auth-paramN>
   * challenge = <auth-scheme> <token68>
   * ```
   *
   * For example:
   *
   * ```http
   * Proxy-Authenticate: <auth-scheme>
   * Proxy-Authenticate: <auth-scheme> token68
   * Proxy-Authenticate: <auth-scheme> auth-param1=param-token1
   * Proxy-Authenticate: <auth-scheme> auth-param1=param-token1, …, auth-paramN=param-tokenN
   * ```
   *
   * The presence of a `token68` or authentication parameters depends on the selected `<auth-scheme>`.
   * For example, [Basic authentication](/en-US/docs/Web/HTTP/Guides/Authentication#basic_authentication_scheme) requires a `<realm>`, and allows for optional use of `charset` key, but does not support a `token68`:
   *
   * ```http
   * Proxy-Authenticate: Basic realm="Dev", charset="UTF-8"
   * ```
   *
   * ## Directives
   *
   * - `<auth-scheme>`
   *   - : A case-insensitive token indicating the [Authentication scheme](/en-US/docs/Web/HTTP/Guides/Authentication#authentication_schemes) used.
   *     Some of the more common types are [`Basic`](/en-US/docs/Web/HTTP/Guides/Authentication#basic_authentication_scheme), `Digest`, `Negotiate` and `AWS4-HMAC-SHA256`.
   *     IANA maintains a [list of authentication schemes](https://www.iana.org/assignments/http-authschemes/http-authschemes.xhtml), but there are other schemes offered by host services.
   * - `<auth-param>`
   *   - : An authentication parameter whose format depends on the `<auth-scheme>`.
   *     `<realm>` is described below as it's a common authentication parameter among many auth schemes.
   *     - `<realm>`
   *       - : The string `realm` followed by `=` and a quoted string describing a protected area, for example `realm="staging environment"`.
   *         A realm allows a server to partition the areas it protects (if supported by a scheme that allows such partitioning).
   *         Some clients show this value to the user to inform them about which particular credentials are required — though most browsers stopped doing so to counter phishing.
   *         The only reliably supported character set for this value is `us-ascii`.
   *         If no realm is specified, clients often display a formatted hostname instead.
   * - `<token68>`
   *   - : A token that may be useful for some schemes.
   *     The token allows the 66 unreserved URI characters plus a few others.
   *     It can hold a [base64](https://developer.mozilla.org/en-US/docs/glossary/base64), base64url, base32, or base16 (hex) encoding, with or without padding, but excluding whitespace.
   *     The `token68` alternative to auth-param lists is supported for consistency with legacy authentication schemes.
   *
   * Generally, you will need to check the relevant specifications for the authentication parameters needed for each `<auth-scheme>`.
   *
   * > [!NOTE]
   * > See [WWW-Authenticate](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/WWW-Authenticate) for more details on authentication parameters.
   *
   * ## Examples
   *
   * ### Proxy-Authenticate Basic auth
   *
   * The following response indicates a Basic auth scheme is required with a realm:
   *
   * ```http
   * Proxy-Authenticate: Basic realm="Staging server"
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [WWW-Authenticate](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/WWW-Authenticate)
   * - [HTTP authentication](/en-US/docs/Web/HTTP/Guides/Authentication)
   * - [Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization), [Proxy-Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Proxy-Authorization)
   * - [401](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401), [403](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403), [407](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/407)
   */
  'Proxy-Authenticate' = 'Proxy-Authenticate',

  /**
   * The HTTP **`Proxy-Authorization`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) contains the credentials to authenticate a client with a proxy server, typically after the server has responded with a [407 Proxy Authentication Required](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/407) status with the [Proxy-Authenticate](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Proxy-Authenticate) header.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Proxy-Authorization: <auth-scheme> <credentials>
   * ```
   *
   * ## Directives
   *
   * - `<auth-scheme>`
   *   - : A case-insensitive token indicating the [Authentication scheme](/en-US/docs/Web/HTTP/Guides/Authentication#authentication_schemes) used.
   *     Some of the more common types are [`Basic`](/en-US/docs/Web/HTTP/Guides/Authentication#basic_authentication_scheme), `Digest`, `Negotiate` and `AWS4-HMAC-SHA256`.
   *     IANA maintains a [list of authentication schemes](https://www.iana.org/assignments/http-authschemes/http-authschemes.xhtml), but there are other schemes offered by host services.
   * - `<credentials>`
   *   - : Credentials use for the authentication scheme.
   *     Generally, you will need to check the relevant specifications for the format.
   *
   * > [!NOTE]
   * > See [Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization) for more details.
   *
   * ## Examples
   *
   * ### Basic authentication
   *
   * In `Basic` auth, credentials are sent in the format `<username>:<password>` (for example, `aladdin:opensesame`).
   * The resulting string is then [base64](/en-US/docs/Glossary/Base64) encoded (`YWxhZGRpbjpvcGVuc2VzYW1l`).
   *
   * ```http
   * Proxy-Authorization: Basic YWxhZGRpbjpvcGVuc2VzYW1l
   * ```
   *
   * > [!WARNING]
   * > Base64 encoding is reversible, and therefore offers no cryptographic security.
   * > This method can be considered equivalent to sending the credentials in clear text.
   * > [HTTPS](https://developer.mozilla.org/en-US/docs/Glossary/HTTPS) is always recommended when using authentication, but is even more so when using `Basic` authentication.
   *
   * ### Bearer authentication (auth token)
   *
   * ```http
   * Proxy-Authorization: Bearer kNTktNTA1My00YzLT1234
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [HTTP authentication](/en-US/docs/Web/HTTP/Guides/Authentication)
   * - [Proxy-Authenticate](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Proxy-Authenticate)
   * - [WWW-Authenticate](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/WWW-Authenticate)
   * - [Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization)
   * - [401](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401), [403](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403), [407](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/407)
   */
  'Proxy-Authorization' = 'Proxy-Authorization',

  /**
   * The HTTP **`Range`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) indicates the part of a resource that the server should return.
   * Several parts can be requested at the same time in one `Range` header, and the server may send back these ranges in a multipart document.
   * If the server sends back ranges, it uses the [206 Partial Content](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/206) status code for the response.
   * If the ranges are invalid, the server returns the [416 Range Not Satisfiable](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/416) error.
   *
   * A server that doesn't support range requests may ignore the `Range` header and return the whole resource with a [200](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200) status code.
   * Older browsers used a response header of [Accept-Ranges: none](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Ranges) to disable features like 'pause' or 'resume' in download managers, but since a server ignoring the `Range` header has the same meaning as responding with `Accept-Ranges: none`, the header is rarely used in this way.
   *
   * Currently only [`bytes` units are registered](https://www.iana.org/assignments/http-parameters/http-parameters.xhtml#range-units) which are _offsets_ (zero-indexed & inclusive).
   * If the requested data has a [content coding](/en-US/docs/Web/HTTP/Reference/Headers/Content-Encoding) applied, each byte range represents the encoded sequence of bytes, not the bytes that would be obtained after decoding.
   *
   * The header is a [CORS-safelisted request header](/en-US/docs/Glossary/CORS-safelisted_request_header) when the directive specifies a single byte range.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Range: <unit>=<range-start>-
   * Range: <unit>=<range-start>-<range-end>
   * Range: <unit>=<range-start>-<range-end>, …, <range-startN>-<range-endN>
   * Range: <unit>=-<suffix-length>
   * ```
   *
   * ## Directives
   *
   * - `<unit>`
   *   - : The unit in which ranges are defined.
   *     Currently only `bytes` are a registered unit.
   * - `<range-start>`
   *   - : An integer in the given unit indicating the start position of the request range.
   * - `<range-end>`
   *   - : An integer in the given unit indicating the end position of the requested range.
   *     This value is optional and, if omitted, the end of the resource is used as the end of the range.
   * - `<suffix-length>`
   *   - : An integer indicating the number of units at the end of the resource to return.
   *
   * ## Examples
   *
   * The following examples show how to make requests using the `Range` header for CORS-safelisted requests, and for requesting multiple ranges.
   * Other examples can be found in the [HTTP range requests](/en-US/docs/Web/HTTP/Guides/Range_requests) guide.
   *
   * ### Single byte ranges and CORS-safelisted requests
   *
   * The `Range` header is a [CORS-safelisted request header](/en-US/docs/Glossary/CORS-safelisted_request_header) when the value is a single byte range.
   * This means that it can be used in cross-origin requests without triggering a [preflight](/en-US/docs/Glossary/Preflight_request) request, which is useful for requesting media and resuming downloads.
   *
   * The following example requests the first 500 bytes of a resource:
   *
   * ```http
   * Range: bytes=0-499
   * ```
   *
   * To request the second 500 bytes:
   *
   * ```http
   * Range: bytes=500-999
   * ```
   *
   * Omitting the end position requests all remaining units of the resource, so the last 100 bytes of a resource with a length of 1000 bytes can be requested using:
   *
   * ```http
   * Range: bytes=900-
   * ```
   *
   * Alternatively, if it's unknown how large a resource is, the last `n` bytes can be requested using a suffix range of `-n`:
   *
   * ```http
   * Range: bytes=-100
   * ```
   *
   * ### Requesting multiple ranges
   *
   * Given a resource with a length of 10000 bytes, the following example requests three separate ranges; `200`-`999` (800 bytes), `2000`-`2499` (500 bytes), and finally `9500-`.
   * The ranges-specifier value `9500-` omits an end position which indicates that all bytes from 9500 onward are part of the third range (500 bytes).
   *
   * ```http
   * Range: bytes=200-999, 2000-2499, 9500-
   * ```
   *
   * This example requests the first 500 and last 500 bytes of the file.
   * The request may be rejected by the server if these ranges overlap (if the requested resource was less than 1000 bytes long, for instance).
   *
   * ```http
   * Range: bytes=0-499, -500
   * ```
   *
   * ### Checking if a server supports range requests
   *
   * The following curl command makes a [HEAD](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/HEAD) request for an image:
   *
   * ```bash
   * curl -v --http1.1 -I https://i.imgur.com/z4d4kWk.jpg
   * # or using the OPTIONS method:
   * # curl -v --http1.1 -X OPTIONS https://i.imgur.com/z4d4kWk.jpg
   * ```
   *
   * This results in the following HTTP request:
   *
   * ```http
   * HEAD /z4d4kWk.jpg HTTP/1.1
   * Host: i.imgur.com
   * User-Agent: curl/8.7.1
   * Accept: * /*
   * ```
   *
   * The server responds with a `200` response, and the `Accept-Ranges: bytes` header is present (some headers are omitted for brevity):
   *
   * ```http
   * HTTP/1.1 200 OK
   * Connection: keep-alive
   * Content-Length: 146515
   * Content-Type: image/jpeg
   * …
   * Accept-Ranges: bytes
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [If-Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Range) conditional request header
   * - [Content-Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Range) response header
   * - [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type)
   * - [Accept-Ranges](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Ranges)
   * - [206 Partial Content](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/206)
   * - [416 Range Not Satisfiable](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/416)
   * - [HTTP range requests](/en-US/docs/Web/HTTP/Guides/Range_requests) guide
   * - [CORS-safelisted request header](/en-US/docs/Glossary/CORS-safelisted_request_header)
   */
  'Range' = 'Range',

  /**
   * The HTTP **`Referer`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) contains the absolute or partial address from which a resource has been requested.
   * The `Referer` header allows a server to identify referring pages that people are visiting from or where requested resources are being used.
   * This data can be used for analytics, logging, optimized caching, and more.
   *
   * When you click a link, the `Referer` contains the address of the page that includes the link.
   * When you make resource requests to another domain, the `Referer` contains the address of the page that uses the requested resource.
   *
   * The `Referer` header can contain an _origin_, _path_, and _querystring_, and may not contain [URL fragments](/en-US/docs/Web/URI/Reference/Fragment) (i.e., `#section`) or `username:password` information.
   * The request's _referrer policy_ defines the data that can be included. See [Referrer-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy) for more [information](/en-US/docs/Web/HTTP/Reference/Headers/Referrer-Policy#directives) and [examples](/en-US/docs/Web/HTTP/Reference/Headers/Referrer-Policy#examples).
   *
   * The `Referer` should also be sent in requests following a [Refresh](https://developer.mozilla.org/en-US/docs/httpheader/Refresh) response (or equivalent [`
   *
   * ## Syntax
   *
   * ```http
   * Referer: <url>
   * ```
   *
   * ## Directives
   *
   * - `<url>`
   *   - : An absolute or partial address of the web page that makes the request.
   *     URL fragments (i.e., `#section`) and user info (i.e., `username:password` in `https://username:password@example.com/foo/bar/`) are not included.
   *     Origin, path, and query string may be included, depending on the [referrer policy](/en-US/docs/Web/HTTP/Reference/Headers/Referrer-Policy#directives).
   *
   * ## Examples
   *
   * ```http
   * Referer: https://developer.mozilla.org/en-US/docs/Web/JavaScript
   * Referer: https://example.com/page?q=123
   * Referer: https://example.com/
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Referrer-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy)
   * - [Same-origin policy](/en-US/docs/Web/Security/Same-origin_policy)
   * - [Fetch](/en-US/docs/Web/API/Fetch_API): [Request.referrerPolicy](https://developer.mozilla.org/en-US/docs/domxref/Request.referrerPolicy)
   * - [Tighter Control Over Your Referrers – Mozilla Security Blog](https://blog.mozilla.org/security/2015/01/21/meta-referrer/)
   * - [HTTP referer on Wikipedia](https://en.wikipedia.org/wiki/HTTP_referer)
   */
  'Referer' = 'Referer',

  /**
   * The HTTP **`Referrer-Policy`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) controls how much [referrer information](/en-US/docs/Web/Security/Referer_header:_privacy_and_security_concerns) (sent with the [Referer](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer) header) should be included with requests.
   * Aside from the HTTP header, you can [set this policy in HTML](#integration_with_html).
   *
   *
   * ```
   *
   * > [!WARNING]
   * > As seen above, the `noreferrer` link relation is written without a dash. When you specify the referrer policy for the entire document with a [meta](https://developer.mozilla.org/en-US/docs/HTMLElement/meta) element, it should be written _with_ a dash: `<meta name="referrer" content="no-referrer">`.
   *
   * ## Integration with CSS
   *
   * CSS can fetch resources referenced from stylesheets. These resources follow a referrer policy as well:
   *
   * - External CSS stylesheets use the default policy (`strict-origin-when-cross-origin`), unless it's overwritten by a `Referrer-Policy` HTTP header on the CSS stylesheet's response.
   * - For [style](https://developer.mozilla.org/en-US/docs/HTMLElement/style) elements or [`style` attributes](/en-US/docs/Web/API/HTMLElement/style), the owner document's referrer policy is used.
   *
   * ## Examples
   *
   * ### `no-referrer`
   *
   * | From document              | Navigation to | Referrer used   |
   * | -------------------------- | ------------- | --------------- |
   * | `https://example.com/page` | _anywhere_    | _(no referrer)_ |
   *
   * ### `no-referrer-when-downgrade`
   *
   * | From document               | Navigation to                   | Referrer used              |
   * | --------------------------- | ------------------------------- | -------------------------- |
   * | `https://example.com/page`  | `https://example.com/otherpage` | `https://example.com/page` |
   * | `https://example.com/page`  | `https://mozilla.org`           | `https://example.com/page` |
   * | `https://example.com/page`  | **http**://example.com          | _(no referrer)_            |
   * | **http**://example.com/page | _anywhere_                      | `http://example.com/page`  |
   *
   * ### `origin`
   *
   * | From document              | Navigation to | Referrer used          |
   * | -------------------------- | ------------- | ---------------------- |
   * | `https://example.com/page` | _anywhere_    | `https://example.com/` |
   *
   * ### `origin-when-cross-origin`
   *
   * | From document              | Navigation to                   | Referrer used              |
   * | -------------------------- | ------------------------------- | -------------------------- |
   * | `https://example.com/page` | `https://example.com/otherpage` | `https://example.com/page` |
   * | `https://example.com/page` | `https://mozilla.org`           | `https://example.com/`     |
   * | `https://example.com/page` | **http**://example.com/page     | `https://example.com/`     |
   *
   * ### `same-origin`
   *
   * | From document              | Navigation to                   | Referrer used              |
   * | -------------------------- | ------------------------------- | -------------------------- |
   * | `https://example.com/page` | `https://example.com/otherpage` | `https://example.com/page` |
   * | `https://example.com/page` | `https://mozilla.org`           | _(no referrer)_            |
   *
   * ### `strict-origin`
   *
   * | From document               | Navigation to          | Referrer used          |
   * | --------------------------- | ---------------------- | ---------------------- |
   * | `https://example.com/page`  | `https://mozilla.org`  | `https://example.com/` |
   * | `https://example.com/page`  | **http**://example.com | _(no referrer)_        |
   * | **http**://example.com/page | _anywhere_             | `http://example.com/`  |
   *
   * ### `strict-origin-when-cross-origin`
   *
   * | From document              | Navigation to                   | Referrer used              |
   * | -------------------------- | ------------------------------- | -------------------------- |
   * | `https://example.com/page` | `https://example.com/otherpage` | `https://example.com/page` |
   * | `https://example.com/page` | `https://mozilla.org`           | `https://example.com/`     |
   * | `https://example.com/page` | **http**://example.com          | _(no referrer)_            |
   *
   * ### `unsafe-url`
   *
   * | From document                    | Navigation to | Referrer used                    |
   * | -------------------------------- | ------------- | -------------------------------- |
   * | `https://example.com/page?q=123` | _anywhere_    | `https://example.com/page?q=123` |
   *
   * ### Specify a fallback policy
   *
   * If you want to specify a fallback policy in case the desired policy hasn't got wide enough browser support, use a comma-separated list with the desired policy specified last:
   *
   * ```http
   * Referrer-Policy: no-referrer, strict-origin-when-cross-origin
   * ```
   *
   * In the above scenario, `no-referrer` is used only if the browser does not support the `strict-origin-when-cross-origin` policy.
   *
   * > [!NOTE]
   * > Specifying multiple values is only supported in the `Referrer-Policy` HTTP header, and not in the `referrerpolicy` attribute.
   *
   * ## Browser-specific preferences/settings
   *
   * ### Firefox preferences
   *
   * You can configure the _default_ referrer policy in Firefox preferences. The preference names are version specific:
   *
   * - Firefox version 59 and later: `network.http.referer.defaultPolicy` (and `network.http.referer.defaultPolicy.pbmode` for private networks)
   * - Firefox versions 53 to 58: `network.http.referer.userControlPolicy`
   *
   * All of these settings take the same set of values: `0 = no-referrer`, `1 = same-origin`, `2 = strict-origin-when-cross-origin`, `3 = no-referrer-when-downgrade`.
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Web security > Referer header: privacy and security concerns](/en-US/docs/Web/Security/Referer_header:_privacy_and_security_concerns)
   * - When using [Fetch](/en-US/docs/Web/API/Fetch_API): [Request.referrerPolicy](https://developer.mozilla.org/en-US/docs/domxref/Request.referrerPolicy)
   * - [Same-origin policy](/en-US/docs/Web/Security/Same-origin_policy)
   * - [HTTP referer on Wikipedia](https://en.wikipedia.org/wiki/HTTP_referer)
   * - [Tighter Control Over Your Referrers – Mozilla Security Blog](https://blog.mozilla.org/security/2015/01/21/meta-referrer/)
   */
  'Referrer-Policy' = 'Referrer-Policy',

  /**
   * The HTTP **`Refresh`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) directs a web browser to either refresh or redirect the page when a specified amount of time has passed after the page was fully loaded.
   * It is exactly equivalent to using [`
   *
   * ## Syntax
   *
   * ```http
   * Refresh: <time>
   * Refresh: <time>, url=<url>
   * Refresh: <time>; url=<url>
   * ```
   *
   * - `<time>`
   *   - : A non-negative number of seconds after which to refresh the page. Fractional parts are recognized but ignored; you should only specify integers.
   * - `<url>`
   *   - : If present, the browser will redirect to the specified URL instead of refreshing with the current URL. This URL can be quoted or unquoted. The `url=` prefix is case-insensitive and optional.
   *
   * ## Examples
   *
   * ### Refreshing a page after a specific time
   *
   * This header will cause the browser to refresh the page 5 seconds after it is fully loaded (that is, after the [load](https://developer.mozilla.org/en-US/docs/domxref/Window/load_event) event):
   *
   * ```http
   * Refresh: 5
   * ```
   *
   * ### Redirecting after a specific time
   *
   * This header will cause the browser to redirect to the a URL 5 seconds after the page is fully loaded:
   *
   * ```http
   * Refresh: 5; url=https://example.com/
   * ```
   *
   * > [!NOTE]
   * > See the [`http-equiv="refresh"`](/en-US/docs/Web/HTML/Reference/Elements/meta/http-equiv#refresh) attribute in the HTML reference for important information about accessibility implications of automatic redirects.
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [meta](https://developer.mozilla.org/en-US/docs/htmlelement/meta)
   * - [Redirections in HTTP](/en-US/docs/Web/HTTP/Guides/Redirections)
   * - [The Refresh header is still with us](https://lists.w3.org/Archives/Public/ietf-http-wg/2019JanMar/0197.html) HTTP Working Group message (2019)
   */
  'Refresh' = 'Refresh',

  /**
   * > [!WARNING]
   * > This header has been replaced by the [Reporting-Endpoints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Reporting-Endpoints) HTTP response header.
   * > It is a deprecated part of an earlier iteration of the [Reporting API](/en-US/docs/Web/API/Reporting_API) specification.
   *
   * The HTTP **`Report-To`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) allows website administrators to define named groups of endpoints that can be used as the destination for warning and error reports, such as CSP violation reports, [Cross-Origin-Opener-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy) reports, deprecation reports, or other generic violations.
   *
   * `Report-To` is often used in conjunction with other headers that select a group of endpoints to use for a particular kind of report.
   * For example, the [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) header [report-to](https://developer.mozilla.org/en-US/docs/CSP/report-to) directive can be used to select the group used for reporting CSP violations.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Report-To: <json-field-value>
   * ```
   *
   * - `<json-field-value>`
   *   - : One or more endpoint-group definitions, defined as a JSON array that omits the surrounding `[` and `]` markers.
   *     Each object in the array has the following members:
   *     - `group`
   *       - : A name for the group of endpoints.
   *     - `max_age`
   *       - : The time in seconds that the browser should cache the reporting configuration.
   *     - `endpoints`
   *       - : An array of one or more URLs where the reports in the group should be sent.
   *
   * ## Examples
   *
   * ### Setting a CSP violation report endpoint
   *
   * This example shows how a server might use `Report-To` to define a group of endpoints, and then set the group as the location where CSP violation reports are sent.
   *
   * First a server might send a response with the `Report-To` HTTP response header as shown below.
   * This specifies a group of `url` endpoints identified by the group name `csp-endpoints`.
   *
   * ```http
   * Report-To: { "group": "csp-endpoints",
   *               "max_age": 10886400,
   *               "endpoints": [
   *                 { "url": "https://example.com/reports" },
   *                 { "url": "https://backup.com/reports" }
   *               ] }
   * ```
   *
   * The server can then specify that it wants this group to be the target for sending CSP violation reports by setting the group name as the value of the [report-to](https://developer.mozilla.org/en-US/docs/CSP/report-to) directive:
   *
   * ```http
   * Content-Security-Policy: script-src https://example.com/; report-to csp-endpoints
   * ```
   *
   * Given the headers above, any `script-src` CSP violations would result in violation reports being sent to both of the `url` values listed in `Report-To`.
   *
   * ### Specifying multiple reporting groups
   *
   * The example below demonstrates a `Report-To` header that specifies multiple endpoint groups.
   * Note that each group has a unique name, and that the groups are not bounded by the array markers.
   *
   * ```http
   * Report-To: { "group": "csp-endpoint-1",
   *               "max_age": 10886400,
   *               "endpoints": [
   *                 { "url": "https://example.com/csp-reports" }
   *               ] },
   *             { "group": "hpkp-endpoint",
   *               "max_age": 10886400,
   *               "endpoints": [
   *                 { "url": "https://example.com/hpkp-reports" }
   *               ] }
   * ```
   *
   * We can select an endpoint group as the target for violation reports by name, in the same way as we did in the previous example:
   *
   * ```http
   * Content-Security-Policy: script-src https://example.com/; report-to csp-endpoint-1
   * ```
   *
   * ## Specifications
   *
   * This header is no longer part of any specification.
   * It was previously part of the [Reporting API](/en-US/docs/Web/API/Reporting_API). <!-- https://github.com/w3c/reporting/pull/197 -->
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Reporting API](/en-US/docs/Web/API/Reporting_API) and [Reporting-Endpoints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Reporting-Endpoints) header
   * - [report-to](https://developer.mozilla.org/en-US/docs/CSP/report-to) CSP directive
   * - [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy), [Content-Security-Policy-Report-Only](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy-Report-Only) headers
   * - [Content Security Policy (CSP)](/en-US/docs/Web/HTTP/Guides/CSP#violation_reporting) guide
   */
  'Report-To' = 'Report-To',

  /**
   * The HTTP **`Reporting-Endpoints`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) allows website administrators to specify one or more endpoints that can be sent reports generated by the [Reporting API](/en-US/docs/Web/API/Reporting_API).
   *
   * The endpoints can be used, for example, as targets for sending CSP violation reports, [Cross-Origin-Opener-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy) reports, or other generic violations.
   *
   * When used for reporting [Content Security Policy (CSP)](/en-US/docs/Web/HTTP/Guides/CSP#violation_reporting) errors, the header is used in combination with the [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) header [report-to](https://developer.mozilla.org/en-US/docs/CSP/report-to) directive.
   * For more details on setting up CSP reporting, see the [Content Security Policy (CSP)](/en-US/docs/Web/HTTP/Guides/CSP#violation_reporting) documentation.
   *
   * > [!NOTE]
   * > This header replaces [Report-To](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Report-To)  for declaring endpoints, and should be used in preference.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Reporting-Endpoints: <endpoint>
   * Reporting-Endpoints: <endpoint>, …, <endpointN>
   * ```
   *
   * - `<endpoint>`
   *   - : A reporting endpoint in the format `<endpoint-name>="<URL>"`.
   *     The endpoints must have valid URIs in quoted strings (e.g., `my-endpoint="https://example.com/reports"`) and non-secure endpoints are ignored.
   *     A comma-separated list of endpoints may be provided.
   *
   * ## Examples
   *
   * ### Setting a CSP violation report endpoint
   *
   * The following example shows how the `Reporting-Endpoints` response header is used in conjunction with the [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) header to indicate where CSP violation reports are sent:
   *
   * ```http
   * Reporting-Endpoints: csp-endpoint="https://example.com/csp-reports"
   * Content-Security-Policy: default-src 'self'; report-to csp-endpoint
   * ```
   *
   * ### Specifying multiple reporting endpoints
   *
   * It's possible to specify multiple endpoints that can be used for different types of violation reports.
   *
   * ```http
   * Reporting-Endpoints: csp-endpoint="https://example.com/csp-reports",
   *                      permissions-endpoint="https://example.com/permissions-policy-reports"
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Reporting API](/en-US/docs/Web/API/Reporting_API)
   * - [Content Security Policy (CSP)](/en-US/docs/Web/HTTP/Guides/CSP#violation_reporting) guide
   * - [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) header
   * - [report-to](https://developer.mozilla.org/en-US/docs/CSP/report-to) directive
   */
  'Reporting-Endpoints' = 'Reporting-Endpoints',

  /**
   * The HTTP **`Repr-Digest`** [request](https://developer.mozilla.org/en-US/docs/Glossary/Request_header) and [response header](https://developer.mozilla.org/en-US/docs/Glossary/Response_header) provides a [digest](https://developer.mozilla.org/en-US/docs/Glossary/hash_function) of the selected representation of the target resource.
   * It can be used validate the integrity of the whole selected representation once it has been received and reconstructed.
   *
   * The _selected representation_ is the specific format of a resource chosen through [content negotiation](/en-US/docs/Web/HTTP/Guides/Content_negotiation).
   * Details about the representation can be determined from [representation headers](https://developer.mozilla.org/en-US/docs/Glossary/Representation_header), such as [Content-Language](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Language), [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type), and [Content-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding).
   *
   * The representation digest applies to the whole representation rather than the encoding or chunking of the messages that are used to send it.
   * A [Content-Digest](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Digest) applies to the content of a specific message, and will have different values based on the [Content-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding) and [Content-Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Range) of each message.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Repr-Digest: <digest-algorithm>=<digest-value>
   *
   * // Multiple digest algorithms
   * Repr-Digest: <digest-algorithm>=<digest-value>,…,<digest-algorithmN>=<digest-valueN>
   * ```
   *
   * ## Directives
   *
   * - `<digest-algorithm>`
   *   - : The algorithm used to create a digest of the representation.
   *     Only two registered digest algorithms are considered secure: `sha-512` and `sha-256`.
   *     The insecure (legacy) registered digest algorithms are: `md5`, `sha` (SHA-1), `unixsum`, `unixcksum`, `adler` (ADLER32) and `crc32c`.
   * - `<digest-value>`
   *   - : The digest in bytes of the representation using the `<digest-algorithm>`.
   *     The choice of digest algorithm also determines the encoding to use: `sha-512` and `sha-256` use [base64](https://developer.mozilla.org/en-US/docs/Glossary/base64) encoding, while some legacy digest algorithms such as `unixsum` use a decimal integer.
   *     In contrast to earlier drafts of the specification, the standard-base64-encoded digest bytes are wrapped in colons (`:`, ASCII 0x3A) as part of the [dictionary syntax](https://www.rfc-editor.org/rfc/rfc8941#name-byte-sequences).
   *
   * Usage of insecure digest algorithms is discouraged as collisions can realistically be forced, rendering the digest's usefulness weak.
   * Unless working with legacy systems (which is unlikely since most will expect the deprecated `Digest` header and not understand this specification), consider omitting a `Repr-Digest` instead of including one with an insecure digest algorithm.
   *
   * ## Description
   *
   * A `Digest` header was defined in previous specifications, but it proved problematic as the scope of what the digest applied to was not clear.
   * Specifically, it was difficult to distinguish whether a digest applied to the entire resource representation or to the specific content of a HTTP message.
   * As such, two separate headers were specified (`Content-Digest` and `Repr-Digest`) to convey HTTP message content digests and resource representation digests, respectively.
   *
   * ## Examples
   *
   * ### User-agent sending a Repr-Digest in requests
   *
   * In the following example, a user-agent sends a digest of the message content using SHA-512.
   * It sends both a `Content-Digest` and a `Repr-Digest`, which differ from each other because of the `Content-Encoding`:
   *
   * ```http
   * POST /bank_transfer HTTP/1.1
   * Host: example.com
   * Content-Encoding: zstd
   * Content-Digest: sha-512=:ABC…=:
   * Repr-Digest: sha-512=:DEF…=:
   *
   * {
   *  "recipient": "Alex",
   *  "amount": 900000000
   * }
   * ```
   *
   * The server may calculate a digest of the content it has received and compare the result with the `Content-Digest` or `Repr-Digest` headers to validate the message integrity.
   * In requests like the example above, the `Repr-Digest` is more useful to the server as this is calculated over the decoded representation and would be more consistent in different scenarios.
   *
   * ### HTTP response where `Repr-Digest` and `Content-Digest` coincide
   *
   * An HTTP server may send the whole representation unencoded in a single message.
   * In this case, `Repr-Digest` and `Content-Digest` have equal values for the same digest algorithms:
   *
   * ```http
   * …
   * Repr-Digest: sha-256=:AEGPTgUMw5e96wxZuDtpfm23RBU3nFwtgY5fw4NYORo=:
   * Content-Digest: sha-256=:AEGPTgUMw5e96wxZuDtpfm23RBU3nFwtgY5fw4NYORo=:
   * …
   * Content-Type: text/yaml
   * Content-Encoding: br
   * Content-Length: 38054
   * Content-Range: 0-38053/38054
   * …
   *
   * [message body]
   * ```
   *
   * ### HTTP responses where `Repr-Digest` and `Content-Digest` diverge
   *
   * A server may compress the content for sending.
   * In this case [Content-Digest](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Digest) will depend on the [Content-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding), and will therefore have a different value to the `Repr-Digest` header in a response:
   *
   * ```http
   * …
   * Repr-Digest: sha-256=:AEGPTgUMw5e96wxZuDtpfm23RBU3nFwtgY5fw4NYORo=:, sha-512=:U59TCCaZPA9Qio3CzHJVAgDnIAut53t5Sgkj2Gv4BvDd0b+OX9QpIdgWkzdXLmBsmvBrf3t5PBt+UrVK6k5dkw==:
   * Content-Digest: sha-256=:293wcr5IoFAsDCzdoDXR1Qppgf2yxOPO1bvQ3nZQtuI=:, unixsum=54809
   * …
   * Content-Type: text/html; charset=utf-8
   * Content-Encoding: br
   * …
   *
   * [message body]
   * ```
   *
   * In another response, the server uses a different compression method, resulting in a new `Content-Digest`, but the same `Repr-Digest` digests:
   *
   * ```http
   * …
   * Repr-Digest: sha-256=:AEGPTgUMw5e96wxZuDtpfm23RBU3nFwtgY5fw4NYORo=:, sha-512=:U59TCCaZPA9Qio3CzHJVAgDnIAut53t5Sgkj2Gv4BvDd0b+OX9QpIdgWkzdXLmBsmvBrf3t5PBt+UrVK6k5dkw==:
   * Content-Digest: sha-256=:rv9Jivc4TmcacLUshzN3OdX7Hz+ORnQRaiTaIKZQ0zk=:
   * …
   * Content-Type: text/html; charset=utf-8
   * Content-Encoding: zstd
   * …
   *
   * [message body]
   * ```
   *
   * ### Successful HTTP request-response employing `Want-Repr-Digest`, `Repr-Digest`, and `Content-Digest`
   *
   * The following [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/PUT) request includes a `Want-Repr-Digest` header, indicating that the server should include a `Repr-Digest` header with a `sha-256` digest if the operation is successful:
   *
   * ```http
   * PUT /api/transact HTTP/1.1
   * Want-Repr-Digest: sha-256=8
   * Content-Type: text/json
   * …
   *
   * [message body]
   * ```
   *
   * The server responds with a successful [201 Created](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201) response, including `Repr-Digest` and `Content-Digest` headers with sha-256 digests of the representation and content, respectively:
   *
   * ```http
   * HTTP/1.1 201 Created
   * Repr-Digest: sha-256=:W8oN3H3CmE/CBpV6ZPNozV2AIDzzQpWL7CCOXyDyDzI=:
   * Content-Encoding: br
   * Content-Digest: sha-256=:2IBI7hQn83oTCgB3Z/6apOl91WGoctRfRj/F9gkvVo8=:
   * …
   *
   * [message body]
   * ```
   *
   * ### Unsuccessful HTTP request-response employing `Repr-Digest`
   *
   * In the following message, a user-agent requests a resource with a specific sha-256 digest:
   *
   * ```http
   * GET /api/last-transaction HTTP/1.1
   * Accept: text/json
   * Repr-Digest: sha-256=:2IBI7hQn83oTCgB3Z/6apOl91WGoctRfRj/F9gkvVo8=:
   * …
   * ```
   *
   * A [406 Not Acceptable](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/406) is returned by the server to indicate the operation failed given a specific digest for the resource.
   * A `Repr-Digest` header is included with the SHA-256 digest value that would result in a successful response if the user-agent repeated the request with that value:
   *
   * ```http
   * HTTP/1.1 406 Not Acceptable
   * Repr-Digest: sha-256=:W8oN3H3CmE/CBpV6ZPNozV2AIDzzQpWL7CCOXyDyDzI=:
   * …
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * This header has no specification-defined browser integration ("browser compatibility" does not apply).
   * Developers can set and get HTTP headers using `fetch()` in order to provide application-specific implementation behavior.
   *
   * ## See also
   *
   * - [Content-Digest](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Digest), [Want-Content-Digest](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Want-Content-Digest), [Want-Repr-Digest](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Want-Repr-Digest)
   * - [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag)
   * - [Content-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding)
   * - [Digital Signatures for APIs](https://developer.ebay.com/develop/guides/digital-signatures-for-apis) SDK guide uses `Content-Digest`s for digital signatures in HTTP calls (developer.ebay.com)
   */
  'Repr-Digest' = 'Repr-Digest',

  /**
   * The HTTP **`Retry-After`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) indicates how long the user agent should wait before making a follow-up request.
   * There are three main cases this header is used:
   *
   * - In a [503 Service Unavailable](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/503) response, this indicates how long the service is expected to be unavailable.
   * - In a [429 Too Many Requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429) response, this indicates how long to wait before making a new request.
   * - In a redirect response, such as [301 Moved Permanently](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/301), this indicates the minimum time that the user agent is asked to wait before issuing the redirected request.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Retry-After: <http-date>
   * Retry-After: <delay-seconds>
   * ```
   *
   * ## Directives
   *
   * - `<http-date>`
   *   - : A date after which to retry. See the [Date](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Date) header for more details
   *     on the HTTP date format.
   * - `<delay-seconds>`
   *   - : A non-negative decimal integer indicating the seconds to delay after the response is
   *     received.
   *
   * ## Examples
   *
   * ### Dealing with scheduled downtime
   *
   * Support for the `Retry-After` header on both clients and servers is still
   * inconsistent. However, some crawlers and spiders, like the Googlebot, honor the
   * `Retry-After` header. It is useful to send it along with a `503` response, so that search engines will keep
   * indexing your site when the downtime is over.
   *
   * ```http
   * Retry-After: Wed, 21 Oct 2015 07:28:00 GMT
   * Retry-After: 120
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [503 Service Unavailable](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/503)
   * - [301 Moved Permanently](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/301)
   * - [How to deal with planned site downtime](https://developers.google.com/search/blog/2011/01/how-to-deal-with-planned-site-downtime) on developers.google.com (2011)
   */
  'Retry-After' = 'Retry-After',

  /**
   * The HTTP **`RTT`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) is a [network client hint](/en-US/docs/Web/HTTP/Guides/Client_hints#network_client_hints) which provides the approximate round trip time on the application layer, in milliseconds.
   * The RTT hint includes server processing time, unlike transport layer RTT.
   *
   * The RTT value is rounded to the nearest 25 milliseconds to prevent [fingerprinting](/en-US/docs/Glossary/Fingerprinting), although there are many other mechanisms an attacker might use to obtain similar round-trip information.
   *
   * The hint allows a server to choose what information is sent based on the network responsiveness/latency. For example, it might choose to send fewer resources.
   *
   * > [!NOTE]
   * > The [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) header is used in responses to indicate that a different resource is sent for every different value of the header (see [HTTP Caching Vary](/en-US/docs/Web/HTTP/Guides/Caching#vary)). Even if `RTT` is used to configure what resources are sent consider omitting it in the [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) header — it is likely to change often, which effectively makes the resource uncacheable.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * RTT: <number>
   * ```
   *
   * ## Directives
   *
   * - `<number>`
   *   - : The approximate round trip time in milliseconds, rounded to the nearest 25 milliseconds.
   *
   * ## Examples
   *
   * ### Using RTT client hints
   *
   * A server first needs to opt in to receive the `RTT` header by sending the [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH) response header containing `RTT`.
   *
   * ```http
   * Accept-CH: RTT
   * ```
   *
   * Then on subsequent requests the client might send an `RTT` header back:
   *
   * ```http
   * RTT: 125
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Downlink](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Downlink), [ECT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ECT), [Save-Data](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Save-Data) network client hints
   * - [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH)
   * - [HTTP Caching: Vary](/en-US/docs/Web/HTTP/Guides/Caching#vary) and [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary)
   * - [NetworkInformation.effectiveType](https://developer.mozilla.org/en-US/docs/domxref/NetworkInformation.effectiveType)
   * - [Improving user privacy and developer experience with User-Agent Client Hints](https://developer.chrome.com/docs/privacy-security/user-agent-client-hints) (developer.chrome.com)
   */
  'RTT' = 'RTT',

  /**
   * The HTTP **`Save-Data`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) is a [network client hint](/en-US/docs/Web/HTTP/Guides/Client_hints#network_client_hints) which indicates the client's preference for reduced data usage.
   * This could be for reasons such as high transfer costs, slow connection speeds, etc.
   *
   * `Save-Data` is a [low entropy hint](/en-US/docs/Web/HTTP/Guides/Client_hints#low_entropy_hints), and hence may be sent by the client even if not requested by the server using an [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH) response header.
   * Further, it should be used to reduce data sent to the client irrespective of the values of other client hints that indicate network capability, like [Downlink](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Downlink) and [RTT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/RTT).
   *
   * A value of `On` indicates explicit user opt-in into a reduced data usage mode on the client.
   * When communicated to origins, this allows them to deliver alternative content to reduce the data downloaded such as smaller image and video resources, different markup and styling, disabled polling and automatic updates, and so on.
   *
   * > [!NOTE]
   * > Disabling HTTP/2 Server Push ([Server Push", "8.2](https://developer.mozilla.org/en-US/docs/RFC/7540)) may reduce data downloads.
   * > Note that this feature is no longer supported by default in most major browser engines.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Save-Data: <sd-token>
   * ```
   *
   * ## Directives
   *
   * - `<sd-token>`
   *   - : A value indicating whether the client wants to opt in to reduced data usage mode.
   *     `on` indicates yes, while `off` (the default) indicates no.
   *
   * ## Examples
   *
   * ### Using `Save-Data: on`
   *
   * The following message requests a resource with `Save-Data` header indicating the client is opting in to reduced data mode:
   *
   * ```http
   * GET /image.jpg HTTP/1.1
   * Host: example.com
   * Save-Data: on
   * ```
   *
   * The server responds with a `200` response, and the [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) header indicates that `Save-Data` may have been used to create the response, and caches should be aware of this header to differentiate responses:
   *
   * ```http
   * HTTP/1.1 200 OK
   * Content-Length: 102832
   * Vary: Accept-Encoding, Save-Data
   * Cache-Control: public, max-age=31536000
   * Content-Type: image/jpeg
   *
   * […]
   * ```
   *
   * ### Omitting `Save-Data`
   *
   * In this case, the client requests the same resource without the `Save-Data` header:
   *
   * ```http
   * GET /image.jpg HTTP/1.1
   * Host: example.com
   * ```
   *
   * The server's response provides the full version of the content.
   * The [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) header ensures that responses should be separately cached based on the value of the `Save-Data` header.
   * This can ensure that the user is not served a lower-quality image from the cache when the `Save-Data` header is no longer present (e.g., after having switched from cellular to Wi-Fi).
   *
   * ```http
   * HTTP/1.1 200 OK
   * Content-Length: 481770
   * Vary: Accept-Encoding, Save-Data
   * Cache-Control: public, max-age=31536000
   * Content-Type: image/jpeg
   *
   * […]
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - CSS `@media` feature [`prefers-reduced-data`](/en-US/docs/Web/CSS/@media/prefers-reduced-data)
   * - [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) header which indicates that the content served varies depending on the value of `Save-Data` (see [HTTP Caching: Vary](/en-US/docs/Web/HTTP/Guides/Caching#vary))
   * - [NetworkInformation.saveData](https://developer.mozilla.org/en-US/docs/domxref/NetworkInformation.saveData)
   * - [Help Your Users `Save-Data`](https://css-tricks.com/help-users-save-data/) on css-tricks.com
   * - [Delivering Fast and Light Applications with Save-Data - web.dev](https://web.dev/articles/optimizing-content-efficiency-save-data) on web.dev
   * - [Improving user privacy and developer experience with User-Agent Client Hints](https://developer.chrome.com/docs/privacy-security/user-agent-client-hints) (developer.chrome.com)
   */
  'Save-Data' = 'Save-Data',

  /**
   * > [!WARNING]
   * > This feature is currently opposed by two browser vendors. See the [Standards positions](/en-US/docs/Web/API/Topics_API#standards_positions) section for details of opposition.
   *
   * > [!NOTE]
   * > An [Enrollment process](/en-US/docs/Web/Privacy/Guides/Privacy_sandbox/Enrollment) is required to use this feature in your applications.
   *
   * The HTTP **`Sec-Browsing-Topics`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) sends the selected topics for the current user along with the associated request, which are used by an ad tech platform to choose a personalized ad to display.
   *
   * If the calling site does not have the Topics API included in a successful [privacy sandbox enrollment process](/en-US/docs/Web/Privacy/Guides/Privacy_sandbox/Enrollment), attempting to create or modify `Sec-Browsing-Topics` fails silently, and any existing `Sec-Browsing-Topics` header is deleted.
   *
   * See [Using the Topics API](/en-US/docs/Web/API/Topics_API/Using) for more details.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Sec-Browsing-Topics: <array-of-observed-topics>
   * ```
   *
   * ## Directives
   *
   * A JSON object representing an array of up to three objects representing the current user's selected topics for the last three epochs. Each object contains the following properties:
   *
   * - `configVersion`
   *   - : A string identifying the algorithm (other than the model part) used to calculate the topic.
   * - `modelVersion`
   *   - : A string representing the model used to classify a string (such as a web page's hostname) into topic IDs.
   * - `taxonomyVersion`
   *   - : A string representing the taxonomy version used.
   * - `topic`
   *   - : A number representing the ID of the topic, which can be used by the browser to retrieve the topic from the taxonomy (see an example [taxonomy of interests](https://github.com/patcg-individual-drafts/topics/blob/main/taxonomy_v1.md)).
   * - `version`
   *   - : The `configVersion`, `modelVersion`, and `taxonomyVersion`, concatenated with colons (`:`) between each.
   *
   * ## Examples
   *
   * The exact property values may vary by browser implementation. An example header from Chrome might look as follows:
   *
   * ```http
   * Sec-Browsing-Topics: [{configVersion: "chrome.1", modelVersion: "1", taxonomyVersion: "1", topic: 43, version: "chrome.1:1:1"}]
   * ```
   *
   * ## Specifications
   *
   * This feature is not part of an official standard, although it is specified in the [Topics API Unofficial Proposal Draft](https://patcg-individual-drafts.github.io/topics/).
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Topics API](/en-US/docs/Web/API/Topics_API)
   */
  'Sec-Browsing-Topics' = 'Sec-Browsing-Topics',

  /**
   * The HTTP **`Sec-CH-Prefers-Color-Scheme`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) is a [media feature client hint](/en-US/docs/Web/HTTP/Guides/Client_hints#user_preference_media_features_client_hints) which provides the user's preference for light or dark color themes.
   * A user indicates their preference through an operating system setting (for example, light or dark mode) or a user agent setting.
   *
   * If a server signals to a client via the [Accept-CH](https://developer.mozilla.org/en-US/docs/httpheader/Accept-CH) header that it accepts `Sec-CH-Prefers-Color-Scheme`, the client can then respond with this header to indicate the user's preference for a specific color scheme. The server can send the client appropriately adapted content including images or CSS to display a light or dark mode for subsequent rendered content.
   *
   * This header is modeled on the [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/cssxref/@media/prefers-color-scheme) media query.
   *
   *
   *
   * ## Usage notes
   *
   * The **`Sec-CH-Prefers-Color-Scheme`** header allows sites to obtain user color scheme preference at request time; they could then choose to provide the relevant CSS for the user's preference inline, for performance reasons. If the server inlines the CSS, it might want to include a [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) response header specifying `Sec-CH-Prefers-Color-Scheme`, to indicate that the response is tailored for a particular color scheme.
   *
   * If performance is not a critical consideration in this context, you could instead handle the user's color scheme preference using the [`prefers-color-scheme`](/en-US/docs/Web/CSS/@media/prefers-color-scheme) media query, and/or the [Window.matchMedia()](https://developer.mozilla.org/en-US/docs/domxref/Window.matchMedia()) API.
   *
   * `Sec-CH-Prefers-Color-Scheme` is a high entropy hint so the site needs to opt into receiving it by sending an appropriate [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH) response header. A user agent may intentionally omit the `Sec-CH-Prefers-Color-Scheme` header to preserve user privacy since the user's preference could, in theory, be used for fingerprinting.
   *
   * ## Syntax
   *
   * ```http
   * Sec-CH-Prefers-Color-Scheme: <preference>
   * ```
   *
   * ### Directives
   *
   * - `<preference>`
   *   - : A string indicating the user agent's preference for dark or light content: `"light"` or `"dark"`.
   *     The value may originate from a corresponding setting in the underlying operating system.
   *
   * ## Examples
   *
   * ### Using Sec-CH-Prefers-Color-Scheme
   *
   * The client makes an initial request to the server:
   *
   * ```http
   * GET / HTTP/1.1
   * Host: example.com
   * ```
   *
   * The server responds, telling the client via [Accept-CH](https://developer.mozilla.org/en-US/docs/httpheader/Accept-CH) that it accepts `Sec-CH-Prefers-Color-Scheme`. In this example [Critical-CH](https://developer.mozilla.org/en-US/docs/httpheader/Critical-CH) is also used, indicating that `Sec-CH-Prefers-Color-Scheme` is considered a [critical client hint](/en-US/docs/Web/HTTP/Guides/Client_hints#critical_client_hints).
   *
   * ```http
   * HTTP/1.1 200 OK
   * Content-Type: text/html
   * Accept-CH: Sec-CH-Prefers-Color-Scheme
   * Vary: Sec-CH-Prefers-Color-Scheme
   * Critical-CH: Sec-CH-Prefers-Color-Scheme
   * ```
   *
   * > [!NOTE]
   * > We've also specified `Sec-CH-Prefers-Color-Scheme` in the [Vary](https://developer.mozilla.org/en-US/docs/httpheader/Vary) header to indicate that responses should be separately cached based on the value of this header (even if the URL stays the same).
   * > Each header listed in the `Critical-CH` header should also be present in the `Accept-CH` and `Vary` headers.
   *
   * The client automatically retries the request (due to `Critical-CH` being specified above), telling the server via `Sec-CH-Prefers-Color-Scheme` that it has a user preference for dark content:
   *
   * ```http
   * GET / HTTP/1.1
   * Host: example.com
   * Sec-CH-Prefers-Color-Scheme: "dark"
   * ```
   *
   * The client will include the header in subsequent requests in the current session, unless the `Accept-CH` changes in responses to indicate that it is no longer supported by the server.
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Client hints](/en-US/docs/Web/HTTP/Guides/Client_hints)
   * - [User-Agent Client Hints API](/en-US/docs/Web/API/User-Agent_Client_Hints_API)
   * - [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH)
   * - [HTTP Caching varying responses](/en-US/docs/Web/HTTP/Guides/Caching#vary) and [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) header
   * - [`prefers-color-scheme` CSS Media Query](/en-US/docs/Web/CSS/@media/prefers-color-scheme)
   * - [Improving user privacy and developer experience with User-Agent Client Hints](https://developer.chrome.com/docs/privacy-security/user-agent-client-hints) (developer.chrome.com)
   */
  'Sec-CH-Prefers-Color-Scheme' = 'Sec-CH-Prefers-Color-Scheme',

  /**
   * The HTTP **`Sec-CH-Prefers-Reduced-Motion`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) is a [user agent client hint](/en-US/docs/Web/HTTP/Guides/Client_hints#user_preference_media_features_client_hints) which indicates the user agent's preference for animations to be displayed with reduced motion.
   *
   * If a server signals to a client via the [Accept-CH](https://developer.mozilla.org/en-US/docs/httpheader/Accept-CH) header that it accepts `Sec-CH-Prefers-Reduced-Motion`, the client can then respond with this header to indicate the user's preference for reduced motion. The server can send the client appropriately adapted content, for example, JavaScript or CSS, to reduce the motion of any animations presented on subsequent rendered content. This could include reducing the speed or amplitude of movement to reduce discomfort for those with vestibular motion disorders.
   *
   * This header is modeled on the [prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/cssxref/@media/prefers-reduced-motion) media query.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Sec-CH-Prefers-Reduced-Motion: <preference>
   * ```
   *
   * ### Directives
   *
   * - `<preference>`
   *   - : The user agent's preference for reduced-motion animations. This is often taken from the underlying operating system's setting. The value of this directive can be either `no-preference` or `reduce`.
   *
   * ## Examples
   *
   * ### Using Sec-CH-Prefers-Reduced-Motion
   *
   * The client makes an initial request to the server:
   *
   * ```http
   * GET / HTTP/1.1
   * Host: example.com
   * ```
   *
   * The server responds, telling the client via [Accept-CH](https://developer.mozilla.org/en-US/docs/httpheader/Accept-CH) that it accepts `Sec-CH-Prefers-Reduced-Motion`. In this example [Critical-CH](https://developer.mozilla.org/en-US/docs/httpheader/Critical-CH) is also used, indicating that `Sec-CH-Prefers-Reduced-Motion` is considered a [critical client hint](/en-US/docs/Web/HTTP/Guides/Client_hints#critical_client_hints).
   *
   * ```http
   * HTTP/1.1 200 OK
   * Content-Type: text/html
   * Accept-CH: Sec-CH-Prefers-Reduced-Motion
   * Vary: Sec-CH-Prefers-Reduced-Motion
   * Critical-CH: Sec-CH-Prefers-Reduced-Motion
   * ```
   *
   * > [!NOTE]
   * > We've also specified `Sec-CH-Prefers-Reduced-Motion` in the [Vary](https://developer.mozilla.org/en-US/docs/httpheader/Vary) header to indicate to the browser that the served content will differ based on this header value, even if the URL stays the same, so the browser shouldn't just use an existing cached response and instead should cache this response separately. Each header listed in the `Critical-CH` header should also be present in the `Accept-CH` and `Vary` headers.
   *
   * The client automatically retries the request (due to `Critical-CH` being specified above), telling the server via `Sec-CH-Prefers-Reduced-Motion` that it has a user preference for reduced-motion animations:
   *
   * ```http
   * GET / HTTP/1.1
   * Host: example.com
   * Sec-CH-Prefers-Reduced-Motion: "reduce"
   * ```
   *
   * The client will include the header in subsequent requests in the current session unless the `Accept-CH` changes in responses to indicate that it is no longer supported by the server.
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Client hints](/en-US/docs/Web/HTTP/Guides/Client_hints)
   * - [User-Agent Client Hints API](/en-US/docs/Web/API/User-Agent_Client_Hints_API)
   * - [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH)
   * - [`prefers-reduced-motion` CSS Media Query](/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
   * - [HTTP Caching: Vary](/en-US/docs/Web/HTTP/Guides/Caching#vary) and [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) header
   * - [Improving user privacy and developer experience with User-Agent Client Hints](https://developer.chrome.com/docs/privacy-security/user-agent-client-hints) (developer.chrome.com)
   */
  'Sec-CH-Prefers-Reduced-Motion' = 'Sec-CH-Prefers-Reduced-Motion',

  /**
   * The HTTP **`Sec-CH-Prefers-Reduced-Transparency`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) is a [user agent client hint](/en-US/docs/Web/HTTP/Guides/Client_hints#user_preference_media_features_client_hints) that indicates the user agent's preference for reduced transparency.
   *
   * If a server signals to a client via the [Accept-CH](https://developer.mozilla.org/en-US/docs/httpheader/Accept-CH) header that it accepts `Sec-CH-Prefers-Reduced-Transparency`, the client can then respond with this header to indicate the user's preference for reduced transparency. The server can send the client appropriately adapted content — for example, CSS or images — to reduce the transparency of the content.
   *
   * This header is modeled on the [prefers-reduced-transparency](https://developer.mozilla.org/en-US/docs/cssxref/@media/prefers-reduced-transparency) media query.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Sec-CH-Prefers-Reduced-Transparency: <preference>
   * ```
   *
   * ### Directives
   *
   * - `<preference>`
   *   - : The user agent's preference for reduced transparency. This is often taken from the underlying operating system's setting. The value of this directive can be either `no-preference` or `reduce`.
   *
   * ## Examples
   *
   * ### Using Sec-CH-Prefers-Reduced-Transparency
   *
   * The client makes an initial request to the server:
   *
   * ```http
   * GET / HTTP/1.1
   * Host: example.com
   * ```
   *
   * The server responds, telling the client via [Accept-CH](https://developer.mozilla.org/en-US/docs/httpheader/Accept-CH) that it accepts `Sec-CH-Prefers-Reduced-Transparency`. In this example [Critical-CH](https://developer.mozilla.org/en-US/docs/httpheader/Critical-CH) is also used, indicating that `Sec-CH-Prefers-Reduced-Transparency` is considered a [critical client hint](/en-US/docs/Web/HTTP/Guides/Client_hints#critical_client_hints).
   *
   * ```http
   * HTTP/1.1 200 OK
   * Content-Type: text/html
   * Accept-CH: Sec-CH-Prefers-Reduced-Transparency
   * Vary: Sec-CH-Prefers-Reduced-Transparency
   * Critical-CH: Sec-CH-Prefers-Reduced-Transparency
   * ```
   *
   * > [!NOTE]
   * > We've also specified `Sec-CH-Prefers-Reduced-Transparency` in the [Vary](https://developer.mozilla.org/en-US/docs/httpheader/Vary) header, to indicate to the browser that the served content will differ based on this header value — even if the URL stays the same — so the browser shouldn't just use an existing cached response and instead should cache this response separately. Each header listed in the `Critical-CH` header should also be present in the `Accept-CH` and `Vary` headers.
   *
   * The client automatically retries the request (due to `Critical-CH` being specified above), telling the server via `Sec-CH-Prefers-Reduced-Transparency` that it has a user preference for reduced transparency:
   *
   * ```http
   * GET / HTTP/1.1
   * Host: example.com
   * Sec-CH-Prefers-Reduced-Transparency: "reduce"
   * ```
   *
   * The client will include the header in subsequent requests in the current session unless the `Accept-CH` changes in responses to indicate that it is no longer supported by the server.
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Client hints](/en-US/docs/Web/HTTP/Guides/Client_hints)
   * - [User-Agent Client Hints API](/en-US/docs/Web/API/User-Agent_Client_Hints_API)
   * - [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH)
   * - [HTTP Caching: Vary](/en-US/docs/Web/HTTP/Guides/Caching#vary) and the [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) header
   * - [Improving user privacy and developer experience with User-Agent Client Hints](https://developer.chrome.com/docs/privacy-security/user-agent-client-hints) (developer.chrome.com)
   */
  'Sec-CH-Prefers-Reduced-Transparency' = 'Sec-CH-Prefers-Reduced-Transparency',

  /**
   * The HTTP **`Sec-CH-UA-Arch`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) is a [user agent client hint](/en-US/docs/Web/HTTP/Guides/Client_hints#user_agent_client_hints) which contains the user-agent's underlying CPU architecture, such as ARM or x86.
   *
   * This might be used by a server, for example, to select and offer the correct binary format of an executable for a user to download.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Sec-CH-UA-Arch: <arch>
   * ```
   *
   * ### Directives
   *
   * - `<arch>`
   *   - : A string indicating the underlying platform architecture, such as: `"x86"`, `"ARM"`, `"[arm64-v8a, armeabi-v7a, armeabi]"`.
   *
   * ## Examples
   *
   * ### Using Sec-CH-UA-Arch
   *
   * A server requests the `Sec-CH-UA-Arch` header by including the [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH) in a response to some request from the client, using the name of the desired header as a token:
   *
   * ```http
   * HTTP/1.1 200 OK
   * Accept-CH: Sec-CH-UA-Arch
   * ```
   *
   * The client may choose to provide the hint, and add the `Sec-CH-UA-Arch` header to subsequent requests.
   * For example, on a Windows X86 based computer, the client might add the header as shown:
   *
   * ```http
   * GET /my/page HTTP/1.1
   * Host: example.site
   *
   * Sec-CH-UA: " Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"
   * Sec-CH-UA-Mobile: ?0
   * Sec-CH-UA-Platform: "Windows"
   * Sec-CH-UA-Arch: "x86"
   * ```
   *
   * Note above that the [low entropy headers](/en-US/docs/Web/HTTP/Guides/Client_hints#low_entropy_hints) are added to the request even though not specified in the server response.
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Client hints](/en-US/docs/Web/HTTP/Guides/Client_hints)
   * - [User-Agent Client Hints API](/en-US/docs/Web/API/User-Agent_Client_Hints_API)
   * - [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH)
   * - [HTTP Caching: Vary](/en-US/docs/Web/HTTP/Guides/Caching#vary) and [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) header
   * - [Improving user privacy and developer experience with User-Agent Client Hints](https://developer.chrome.com/docs/privacy-security/user-agent-client-hints) (developer.chrome.com)
   */
  'Sec-CH-UA-Arch' = 'Sec-CH-UA-Arch',

  /**
   * The HTTP **`Sec-CH-UA-Bitness`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) is a [user agent client hint](/en-US/docs/Web/HTTP/Guides/Client_hints#user_agent_client_hints) which provides the "bitness" of the user-agent's underlying CPU architecture.
   * This is the size in bits of an integer or memory address—typically 64 or 32 bits.
   *
   * This might be used by a server, for example, to select and offer the correct binary format of an executable for a user to download.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Sec-CH-UA-Bitness: <bitness>
   * ```
   *
   * ## Directives
   *
   * - `<bitness>`
   *   - : A string indicating the underlying platform architecture bitness, such as: `"64"`, `"32"`.
   *
   * ## Examples
   *
   * ### Using Sec-CH-UA-Bitness
   *
   * A server requests the `Sec-CH-UA-Bitness` header by including [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH) in a _response_ to any request from the client, using the name of the desired header as a token:
   *
   * ```http
   * HTTP/1.1 200 OK
   * Accept-CH: Sec-CH-UA-Bitness
   * ```
   *
   * The client may choose to provide the hint, and add the `Sec-CH-UA-Bitness` header to subsequent requests.
   * For example, on a Windows based 64-bit computer, the client might add the header as shown:
   *
   * ```http
   * GET /my/page HTTP/1.1
   * Host: example.site
   *
   * Sec-CH-UA: " Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"
   * Sec-CH-UA-Mobile: ?0
   * Sec-CH-UA-Platform: "Windows"
   * Sec-CH-UA-Bitness: "64"
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Client hints](/en-US/docs/Web/HTTP/Guides/Client_hints)
   * - [User-Agent Client Hints API](/en-US/docs/Web/API/User-Agent_Client_Hints_API)
   * - [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH)
   * - [HTTP Caching: Vary](/en-US/docs/Web/HTTP/Guides/Caching#vary) and [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) header
   * - [Improving user privacy and developer experience with User-Agent Client Hints](https://developer.chrome.com/docs/privacy-security/user-agent-client-hints) (developer.chrome.com)
   */
  'Sec-CH-UA-Bitness' = 'Sec-CH-UA-Bitness',

  /**
   * The HTTP **`Sec-CH-UA-Form-Factors`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/Request_header) is a [user agent client hint](/en-US/docs/Web/HTTP/Guides/Client_hints#user_agent_client_hints) which provides information on the user-agent's device form factor.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Sec-CH-UA-Form-Factors: <form-factor>
   * Sec-CH-UA-Form-Factors: <form-factor>, …, <form-factor>
   * ```
   *
   * ### Directives
   *
   * - `<form-factor>`
   *   - : A string indicating a common device form factor.
   *     All applicable form factors can be included.
   *     The meanings of the allowed values are:
   *     - `"Desktop"`
   *       - : A user-agent running on a personal computer.
   *     - `"Automotive"`
   *       - : A user-agent embedded in a vehicle, where the user may be responsible for operating the vehicle and have limited ability to interact.
   *     - `"Mobile"`
   *       - : Small, touch-oriented device typically carried on a user's person.
   *     - `"Tablet"`
   *       - : A touch-oriented device larger than `"Mobile"` and not typically carried on a user's person.
   *     - `"XR"`
   *       - : Immersive devices that augment or replace the environment around the user.
   *     - `"EInk"`
   *       - : A device characterized by slow screen updates and limited or no color resolution.
   *     - `"Watch"`
   *       - : A mobile device with a tiny screen (typically less than 2 inches), carried in such a way that the user can glance at it quickly.
   *
   * ## Examples
   *
   * ### Using Sec-CH-UA-Form-Factors
   *
   * A server requests the `Sec-CH-UA-Form-Factors` header by including the [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH) in a _response_ to any request from the client, using the name of the desired header as a token:
   *
   * ```http
   * HTTP/1.1 200 OK
   * Accept-CH: Sec-CH-UA-Form-Factors
   * ```
   *
   * The client may choose to provide the hint, and add the `Sec-CH-UA-Form-Factors` header to subsequent requests.
   * For example, the client might add the header as shown:
   *
   * ```http
   * GET /my/page HTTP/1.1
   * Host: example.site
   *
   * Sec-CH-UA-Mobile: ?0
   * Sec-CH-UA-Form-Factors: "EInk"
   * ```
   *
   * In this case, `"EInk"` means that the device is characterized by slow screen updates and limited color resolution, and as such, responses may differ depending on this hint.
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Client hints](/en-US/docs/Web/HTTP/Guides/Client_hints)
   * - [User-Agent Client Hints API](/en-US/docs/Web/API/User-Agent_Client_Hints_API)
   * - [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH)
   * - [HTTP Caching: Vary](/en-US/docs/Web/HTTP/Guides/Caching#vary) and [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) header
   * - [Improving user privacy and developer experience with User-Agent Client Hints](https://developer.chrome.com/docs/privacy-security/user-agent-client-hints) on developer.chrome.com
   */
  'Sec-CH-UA-Form-Factors' = 'Sec-CH-UA-Form-Factors',

  /**
   * The HTTP **`Sec-CH-UA-Full-Version-List`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) is a [user agent client hint](/en-US/docs/Web/HTTP/Guides/Client_hints#user_agent_client_hints) which provides the user-agent's branding and full version information.
   *
   * The **`Sec-CH-UA-Full-Version-List`** header provides the brand and full version information for each brand associated with the browser, in a comma-separated list.
   *
   * The header may include "fake" brands in any position and with any name.
   * This is a feature designed to prevent servers from rejecting unknown user agents outright, forcing user agents to lie about their brand identity.
   *
   * > [!NOTE]
   * > This is similar to [Sec-CH-UA](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-CH-UA), but includes the full version number instead of the significant version number for each brand.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Sec-CH-UA-Full-Version-List: "<brand>";v="<full version>", …
   * ```
   *
   * The value is a comma separated list of brands in the user agent brand list, and their associated full version number.
   *
   * ### Directives
   *
   * - `<brand>`
   *   - : A brand associated with the user agent, like "Chromium", "Google Chrome".
   *     This may be an intentionally incorrect brand like `" Not A;Brand"` or `"(Not(A:Brand"` (the actual value is expected change over time and be unpredictable).
   * - `<full version>`
   *   - : A full version number, such as 98.0.4750.0.
   *
   * ## Description
   *
   * A brand is a commercial name for the user agent like: Chromium, Opera, Google Chrome, Microsoft Edge, Firefox, and Safari.
   * A user agent might have several associated brands.
   * For example, Opera, Chrome, and Edge are all based on Chromium, and will provide both brands in the `Sec-CH-UA-Full-Version-List` header.
   *
   * The header allows the server to customize its response based on both shared brands and on particular customizations in their specific respective builds.
   *
   * ## Examples
   *
   * ### Using Sec-CH-UA-Full-Version-List
   *
   * A server requests the `Sec-CH-UA-Full-Version-List` header by including the [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH) in a _response_ to any request from the client, using the name of the desired header as a token:
   *
   * ```http
   * HTTP/1.1 200 OK
   * Accept-CH: Sec-CH-UA-Full-Version-List
   * ```
   *
   * The client may choose to provide the hint, and add the `Sec-CH-UA-Full-Version-List` header to subsequent requests, as shown below:
   *
   * ```http
   * GET /my/page HTTP/1.1
   * Host: example.site
   *
   * Sec-CH-UA: " Not A;Brand";v="99", "Chromium";v="98", "Google Chrome";v="98"
   * Sec-CH-UA-Mobile: ?0
   * Sec-CH-UA-Full-Version-List: " Not A;Brand";v="99.0.0.0", "Chromium";v="98.0.4750.0", "Google Chrome";v="98.0.4750.0"
   * Sec-CH-UA-Platform: "Linux"
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Client hints](/en-US/docs/Web/HTTP/Guides/Client_hints)
   * - [User-Agent Client Hints API](/en-US/docs/Web/API/User-Agent_Client_Hints_API)
   * - [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH)
   * - [HTTP Caching: Vary](/en-US/docs/Web/HTTP/Guides/Caching#vary) and [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) header
   * - [Improving user privacy and developer experience with User-Agent Client Hints](https://developer.chrome.com/docs/privacy-security/user-agent-client-hints) (developer.chrome.com)
   */
  'Sec-CH-UA-Full-Version-List' = 'Sec-CH-UA-Full-Version-List',

  /**
   * > [!NOTE]
   * > This is being replaced by the [Sec-CH-UA-Full-Version-List](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-CH-UA-Full-Version-List).
   *
   * The HTTP **`Sec-CH-UA-Full-Version`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) is a [user agent client hint](/en-US/docs/Web/HTTP/Guides/Client_hints#user_agent_client_hints) which provides the user-agent's full version string.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Sec-CH-UA-Full-Version: <version>
   * ```
   *
   * ### Directives
   *
   * - `<version>`
   *   - : A string containing the full version number, like "96.0.4664.93".
   *
   * ## Examples
   *
   * ### Using Sec-CH-UA-Full-Version
   *
   * A server requests the `Sec-CH-UA-Full-Version` header by including the [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH) in a _response_ to any request from the client, using the name of the desired header as a token:
   *
   * ```http
   * HTTP/1.1 200 OK
   * Accept-CH: Sec-CH-UA-Full-Version
   * ```
   *
   * The client may choose to provide the hint, and add the `Sec-CH-UA-Full-Version` header to subsequent requests.
   * For example, the client might add the header as shown:
   *
   * ```http
   * GET /my/page HTTP/1.1
   * Host: example.site
   *
   * Sec-CH-UA: " Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"
   * Sec-CH-UA-Mobile: ?0
   * Sec-CH-UA-Full-Version: "96.0.4664.110"
   * Sec-CH-UA-Platform: "Windows"
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Client hints](/en-US/docs/Web/HTTP/Guides/Client_hints)
   * - [User-Agent Client Hints API](/en-US/docs/Web/API/User-Agent_Client_Hints_API)
   * - [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH)
   * - [HTTP Caching: Vary](/en-US/docs/Web/HTTP/Guides/Caching#vary) and [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) header
   * - [Improving user privacy and developer experience with User-Agent Client Hints](https://developer.chrome.com/docs/privacy-security/user-agent-client-hints) (developer.chrome.com)
   */
  'Sec-CH-UA-Full-Version' = 'Sec-CH-UA-Full-Version',

  /**
   * The HTTP **`Sec-CH-UA-Mobile`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) is a [user agent client hint](/en-US/docs/Web/HTTP/Guides/Client_hints#user_agent_client_hints) which indicates whether the browser is on a mobile device.
   * It can also be used by a desktop browser to indicate a preference for a "mobile" user experience.
   *
   * `Sec-CH-UA-Mobile` is a [low entropy hint](/en-US/docs/Web/HTTP/Guides/Client_hints#low_entropy_hints).
   * Unless blocked by a user agent permission policy, it is sent by default, without the server opting in by sending [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH).
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Sec-CH-UA-Mobile: <boolean>
   * ```
   *
   * ### Directives
   *
   * - `<boolean>`
   *   - : `?1` indicates that the user-agent prefers a mobile experience (true).
   *     `?0` indicates that user-agent does not prefer a mobile experience (false).
   *
   * ## Examples
   *
   * ### Using Sec-CH-UA-Mobile
   *
   * As `Sec-CH-UA-Mobile` is a [low entropy hint](/en-US/docs/Web/HTTP/Guides/Client_hints#low_entropy_hints) it is typically sent in all requests.
   * A desktop browser would usually send requests with the following header:
   *
   * ```http
   * Sec-CH-UA-Mobile: ?0
   * ```
   *
   * A browser on a mobile device would usually send requests with the following header:
   *
   * ```http
   * Sec-CH-UA-Mobile: ?1
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Client hints](/en-US/docs/Web/HTTP/Guides/Client_hints)
   * - [User-Agent Client Hints API](/en-US/docs/Web/API/User-Agent_Client_Hints_API)
   * - [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH)
   * - [HTTP Caching: Vary](/en-US/docs/Web/HTTP/Guides/Caching#vary) and [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) header
   * - [Improving user privacy and developer experience with User-Agent Client Hints](https://developer.chrome.com/docs/privacy-security/user-agent-client-hints) (developer.chrome.com)
   */
  'Sec-CH-UA-Mobile' = 'Sec-CH-UA-Mobile',

  /**
   * The HTTP **`Sec-CH-UA-Model`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) is a [user agent client hint](/en-US/docs/Web/HTTP/Guides/Client_hints#user_agent_client_hints) which indicates the device model on which the browser is running.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Sec-CH-UA-Model: <device-version>
   * ```
   *
   * ### Directives
   *
   * - `<device-version>`
   *   - : A string containing the device version. For example "Pixel 3".
   *
   * ## Examples
   *
   * ### Using Sec-CH-UA-Model
   *
   * A server requests the `Sec-CH-UA-Model` header by including [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH) in a _response_ to any request from the client, using the name of the desired header as a token:
   *
   * ```http
   * HTTP/1.1 200 OK
   * Accept-CH: Sec-CH-UA-Model
   * ```
   *
   * The client may choose to provide the hint, and add the `Sec-CH-UA-Model` header to subsequent requests.
   * For example, on mobile phone the client might add the header as shown:
   *
   * ```http
   * GET /my/page HTTP/1.1
   * Host: example.site
   *
   * Sec-CH-UA: " Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"
   * Sec-CH-UA-Mobile: ?1
   * Sec-CH-UA-Platform: "Android"
   * Sec-CH-UA-Bitness: "64"
   * Sec-CH-UA-Model: "Pixel 3 XL"
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Client hints](/en-US/docs/Web/HTTP/Guides/Client_hints)
   * - [User-Agent Client Hints API](/en-US/docs/Web/API/User-Agent_Client_Hints_API)
   * - [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH)
   * - [HTTP Caching: Vary](/en-US/docs/Web/HTTP/Guides/Caching#vary) and [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) header
   * - [Improving user privacy and developer experience with User-Agent Client Hints](https://developer.chrome.com/docs/privacy-security/user-agent-client-hints) (developer.chrome.com)
   */
  'Sec-CH-UA-Model' = 'Sec-CH-UA-Model',

  /**
   * The HTTP **`Sec-CH-UA-Platform-Version`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) is a [user agent client hint](/en-US/docs/Web/HTTP/Guides/Client_hints#user_agent_client_hints) which provides the version of the operating system on which the user agent is running.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Sec-CH-UA-Platform-Version: <version>
   * ```
   *
   * ### Directives
   *
   * - `<version>`
   *   - : The version string typically contains the operating system version in a string, consisting of dot-separated major, minor and patch version numbers, for example `"11.0.0"`.
   *     The version string on Linux is always empty.
   *
   * ## Examples
   *
   * ### Using Sec-CH-UA-Platform-Version
   *
   * A server requests the `Sec-CH-UA-Platform-Version` header by including the [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH) in a _response_ to any request from the client, using the name of the desired header as a token:
   *
   * ```http
   * HTTP/1.1 200 OK
   * Accept-CH: Sec-CH-UA-Platform-Version
   * ```
   *
   * The client may choose to provide the hint, and add the `Sec-CH-UA-Platform-Version` header to subsequent requests.
   * For example, the following request headers might be sent from a browser running on Windows 10.
   *
   * ```http
   * GET /my/page HTTP/1.1
   * Host: example.site
   *
   * Sec-CH-UA: " Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"
   * Sec-CH-UA-Mobile: ?0
   * Sec-CH-UA-Platform: "Windows"
   * Sec-CH-UA-Platform-Version: "10.0.0"
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Client hints](/en-US/docs/Web/HTTP/Guides/Client_hints)
   * - [User-Agent Client Hints API](/en-US/docs/Web/API/User-Agent_Client_Hints_API)
   * - [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH)
   * - [HTTP Caching: Vary](/en-US/docs/Web/HTTP/Guides/Caching#vary) and [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) header
   * - [Improving user privacy and developer experience with User-Agent Client Hints](https://developer.chrome.com/docs/privacy-security/user-agent-client-hints) (developer.chrome.com)
   */
  'Sec-CH-UA-Platform-Version' = 'Sec-CH-UA-Platform-Version',

  /**
   * The HTTP **`Sec-CH-UA-Platform`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) is a [user agent client hint](/en-US/docs/Web/HTTP/Guides/Client_hints#user_agent_client_hints) which provides the platform or operating system on which the user agent is running.
   * For example: "Windows" or "Android".
   *
   * `Sec-CH-UA-Platform` is a [low entropy hint](/en-US/docs/Web/HTTP/Guides/Client_hints#low_entropy_hints).
   * Unless blocked by a user agent permission policy, it is sent by default (without the server opting in by sending [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH)).
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Sec-CH-UA-Platform: <platform>
   * ```
   *
   * ### Directives
   *
   * - `<platform>`
   *   - : One of the following strings: `"Android"`, `"Chrome OS"`, `"Chromium OS"`, `"iOS"`, `"Linux"`, `"macOS"`, `"Windows"`, or `"Unknown"`.
   *
   * ## Examples
   *
   * ### Using Sec-CH-UA-Platform
   *
   * As `Sec-CH-UA-Platform` is a [low entropy hint](/en-US/docs/Web/HTTP/Guides/Client_hints#low_entropy_hints) it is typically sent in all requests.
   * A browser running on a macOS computer might add the following header to all requests.
   *
   * ```http
   * Sec-CH-UA-Platform: "macOS"
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Client hints](/en-US/docs/Web/HTTP/Guides/Client_hints)
   * - [User-Agent Client Hints API](/en-US/docs/Web/API/User-Agent_Client_Hints_API)
   * - [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH)
   * - [HTTP Caching: Vary](/en-US/docs/Web/HTTP/Guides/Caching#vary) and [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) header
   * - [Improving user privacy and developer experience with User-Agent Client Hints](https://developer.chrome.com/docs/privacy-security/user-agent-client-hints) (developer.chrome.com)
   */
  'Sec-CH-UA-Platform' = 'Sec-CH-UA-Platform',

  /**
   * The HTTP **`Sec-CH-UA-WoW64`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/Request_header) is a [user agent client hint](/en-US/docs/Web/HTTP/Guides/Client_hints#user_agent_client_hints) indicating if a 32-bit user-agent application is running on a 64-bit Windows machine.
   *
   * [WoW64](https://en.wikipedia.org/wiki/WoW64) was commonly used to know which [NPAPI](https://en.wikipedia.org/wiki/NPAPI) plugin installer should be offered for download.
   * This client hint header is used for backwards compatibility considerations, to provide a one-to-one mapping from the user-agent string of certain browsers to UA client hints.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Sec-CH-UA-WoW64: <boolean>
   * ```
   *
   * ### Directives
   *
   * - `<boolean>`
   *   - : `?1` indicates that the user agent's binary is running in 32-bit mode on 64-bit Windows (true), while `?0` means that it is not (false).
   *
   * ## Examples
   *
   * ### Using Sec-CH-UA-WoW64
   *
   * A server requests the `Sec-CH-UA-WoW64` header by including the [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH) in a _response_ to any request from the client, using the name of the desired header as a token:
   *
   * ```http
   * HTTP/1.1 200 OK
   * Accept-CH: Sec-CH-UA-WoW64
   * ```
   *
   * The client may choose to provide the hint, and add the `Sec-CH-UA-WoW64` header to subsequent requests.
   * Adding `Sec-CH-UA-WoW64: ?1` means the user agent's binary is running in 32-bit mode on 64-bit Windows:
   *
   * ```http
   * GET /my/page HTTP/1.1
   * Host: example.site
   *
   * Sec-CH-UA-WoW64: ?1
   * Sec-CH-UA-Platform: "Windows"
   * Sec-CH-UA-Form-Factors: "Desktop"
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Client hints](/en-US/docs/Web/HTTP/Guides/Client_hints)
   * - [User-Agent Client Hints API](/en-US/docs/Web/API/User-Agent_Client_Hints_API)
   * - [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH)
   * - [HTTP Caching: Vary](/en-US/docs/Web/HTTP/Guides/Caching#vary) and [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) header
   * - [Improving user privacy and developer experience with User-Agent Client Hints](https://developer.chrome.com/docs/privacy-security/user-agent-client-hints) on developer.chrome.com
   */
  'Sec-CH-UA-WoW64' = 'Sec-CH-UA-WoW64',

  /**
   * The HTTP **`Sec-CH-UA`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) is a [user agent client hint](/en-US/docs/Web/HTTP/Guides/Client_hints#user_agent_client_hints) which provides the user-agent's branding and significant version information.
   *
   * The `Sec-CH-UA` header provides the brand and significant version for each brand associated with the browser in a comma-separated list.
   * The header therefore allows the server to customize its response based on both shared brands and on particular customizations in their respective versions.
   *
   * `Sec-CH-UA` is a [low entropy hint](/en-US/docs/Web/HTTP/Guides/Client_hints#low_entropy_hints).
   * Unless blocked by a user agent permission policy, it is sent by default, without the server opting in by sending [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH).
   *
   * The header may include "fake" brands in any position and with any name.
   * This is a feature designed to prevent servers from rejecting unknown user agents outright, forcing user agents to lie about their brand identity.
   *
   * > [!NOTE]
   * > The [Sec-CH-UA-Full-Version-List](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-CH-UA-Full-Version-List) header is the same as `Sec-CH-UA`, but includes the full version number rather than the significant version number for each brand.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Sec-CH-UA: "<brand>";v="<significant version>", …
   * ```
   *
   * The value is a comma separated list of brands in the user agent brand list, and their associated significant version number.
   *
   * ### Directives
   *
   * - `<brand>`
   *   - : A brand associated with the user agent, like "Chromium", "Google Chrome", or an intentionally incorrect brand like `"Not A;Brand"`.
   * - `<significant version>`
   *   - : The "marketing" version number associated with distinguishable web-exposed features.
   *
   * ## Description
   *
   * A brand is a commercial name for the user agent like: Chromium, Opera, Google Chrome, Microsoft Edge, Firefox, and Safari.
   * A user agent might have several associated brands.
   * For example, Opera, Chrome, and Edge are all based on Chromium, and will provide both brands in the `Sec-CH-UA` header.
   *
   * The _significant version_ is the "marketing" version identifier that is used to distinguish between major releases of the brand.
   * For example a Chromium build with _full version number_ "96.0.4664.45" has a significant version number of "96".
   *
   * ## Examples
   *
   * ### Different Sec-CH-UA brands
   *
   * `Sec-CH-UA` is a [low entropy hint](/en-US/docs/Web/HTTP/Guides/Client_hints#low_entropy_hints).
   * Unless explicitly blocked by a user agent policy, it will be sent in all requests (without the server having to opt in by sending [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH)).
   *
   * Strings from Chromium, Chrome, Edge, and Opera desktop browsers are shown below.
   * Note that they all share the "Chromium" brand, but have an additional brand indicating their origin.
   * They also have an intentionally incorrect brand string, which may appear in any position and have different text.
   *
   * ```http
   * Sec-CH-UA: "(Not(A:Brand";v="8", "Chromium";v="98"
   * ```
   *
   * ```http
   * Sec-CH-UA: " Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"
   * ```
   *
   * ```http
   * Sec-CH-UA: " Not A;Brand";v="99", "Chromium";v="96", "Microsoft Edge";v="96"
   * ```
   *
   * ```http
   * Sec-CH-UA: "Opera";v="81", " Not;A Brand";v="99", "Chromium";v="95"
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Client hints](/en-US/docs/Web/HTTP/Guides/Client_hints)
   * - [User-Agent Client Hints API](/en-US/docs/Web/API/User-Agent_Client_Hints_API)
   * - [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH)
   * - [HTTP Caching: Vary](/en-US/docs/Web/HTTP/Guides/Caching#vary) and [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary)
   * - [Improving user privacy and developer experience with User-Agent Client Hints](https://developer.chrome.com/docs/privacy-security/user-agent-client-hints) (developer.chrome.com)
   */
  'Sec-CH-UA' = 'Sec-CH-UA',

  /**
   * The HTTP **`Sec-Fetch-Dest`** [fetch metadata request header](https://developer.mozilla.org/en-US/docs/Glossary/fetch_metadata_request_header) indicates the request's _destination_.
   * That is the initiator of the original fetch request, which is where (and how) the fetched data will be used.
   *
   * This allows servers to determine whether to service a request based on whether it is appropriate for how it is _expected_ to be used. For example, a request with an `audio` destination should request audio data, not some other type of resource (for example, a document that includes sensitive user information).
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Sec-Fetch-Dest: audio
   * Sec-Fetch-Dest: audioworklet
   * Sec-Fetch-Dest: document
   * Sec-Fetch-Dest: embed
   * Sec-Fetch-Dest: empty
   * Sec-Fetch-Dest: fencedframe
   * Sec-Fetch-Dest: font
   * Sec-Fetch-Dest: frame
   * Sec-Fetch-Dest: iframe
   * Sec-Fetch-Dest: image
   * Sec-Fetch-Dest: manifest
   * Sec-Fetch-Dest: object
   * Sec-Fetch-Dest: paintworklet
   * Sec-Fetch-Dest: report
   * Sec-Fetch-Dest: script
   * Sec-Fetch-Dest: serviceworker
   * Sec-Fetch-Dest: sharedworker
   * Sec-Fetch-Dest: style
   * Sec-Fetch-Dest: track
   * Sec-Fetch-Dest: video
   * Sec-Fetch-Dest: webidentity
   * Sec-Fetch-Dest: worker
   * Sec-Fetch-Dest: xslt
   * ```
   *
   * Servers should ignore this header if it contains any other value.
   *
   * ## Directives
   *
   * > [!NOTE]
   * > These directives correspond to the values returned by [Request.destination](https://developer.mozilla.org/en-US/docs/domxref/Request.destination).
   *
   * - `audio`
   *   - : The destination is audio data. This might originate from an HTML [audio](https://developer.mozilla.org/en-US/docs/HTMLElement/audio) tag.
   * - `audioworklet`
   *   - : The destination is data being fetched for use by an audio worklet. This might originate from a call to [audioWorklet.addModule()](https://developer.mozilla.org/en-US/docs/domxref/Worklet.addModule()).
   * - `document`
   *   - : The destination is a document (HTML or XML), and the request is the result of a user-initiated top-level navigation (e.g., resulting from a user clicking a link).
   * - `embed`
   *   - : The destination is embedded content. This might originate from an HTML [embed](https://developer.mozilla.org/en-US/docs/HTMLElement/embed) tag.
   * - `empty`
   *   - : The destination is the empty string. This is used for destinations that do not have their own value. For example: [fetch()](https://developer.mozilla.org/en-US/docs/domxref/Window/fetch), [navigator.sendBeacon()](https://developer.mozilla.org/en-US/docs/domxref/navigator.sendBeacon()), [EventSource](https://developer.mozilla.org/en-US/docs/domxref/EventSource), [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/domxref/XMLHttpRequest), [WebSocket](https://developer.mozilla.org/en-US/docs/domxref/WebSocket), etc.
   * - `fencedframe`
   *   - : The destination is a [fenced frame](/en-US/docs/Web/API/Fenced_frame_API).
   * - `font`
   *   - : The destination is a font. This might originate from CSS [@font-face](https://developer.mozilla.org/en-US/docs/cssxref/@font-face).
   * - `frame`
   *   - : The destination is a frame. This might originate from an HTML [frame](https://developer.mozilla.org/en-US/docs/HTMLElement/frame) tag.
   * - `iframe`
   *   - : The destination is an iframe. This might originate from an HTML [iframe](https://developer.mozilla.org/en-US/docs/HTMLElement/iframe) tag.
   * - `image`
   *   - : The destination is an image. This might originate from an HTML [img](https://developer.mozilla.org/en-US/docs/HTMLElement/img), SVG [image](https://developer.mozilla.org/en-US/docs/SVGElement/image), CSS [background-image](https://developer.mozilla.org/en-US/docs/cssxref/background-image), CSS [cursor](https://developer.mozilla.org/en-US/docs/cssxref/cursor), CSS [list-style-image](https://developer.mozilla.org/en-US/docs/cssxref/list-style-image), etc.
   * - `manifest`
   *   - : The destination is a manifest. This might originate from an HTML [\<link rel=manifest>](/en-US/docs/Web/HTML/Reference/Attributes/rel/manifest).
   * - `object`
   *   - : The destination is an object. This might originate from an HTML [object](https://developer.mozilla.org/en-US/docs/HTMLElement/object) tag.
   * - `paintworklet`
   *   - : The destination is a paint worklet. This might originate from a call to .
   * - `report`
   *   - : The destination is a report (for example, a content security policy report).
   * - `script`
   *   - : The destination is a script. This might originate from an HTML [script](https://developer.mozilla.org/en-US/docs/HTMLElement/script) tag or a call to [WorkerGlobalScope.importScripts()](https://developer.mozilla.org/en-US/docs/domxref/WorkerGlobalScope.importScripts()).
   * - `serviceworker`
   *   - : The destination is a service worker. This might originate from a call to [navigator.serviceWorker.register()](https://developer.mozilla.org/en-US/docs/domxref/ServiceWorkerContainer.register).
   * - `sharedworker`
   *   - : The destination is a shared worker. This might originate from a [SharedWorker](https://developer.mozilla.org/en-US/docs/domxref/SharedWorker).
   * - `style`
   *   - : The destination is a style. This might originate from an HTML [&lt;link rel=stylesheet&gt;](https://developer.mozilla.org/en-US/docs/HTMLElement/link) or a CSS [@import](https://developer.mozilla.org/en-US/docs/cssxref/@import).
   * - `track`
   *   - : The destination is an HTML text track. This might originate from an HTML [track](https://developer.mozilla.org/en-US/docs/HTMLElement/track) tag.
   * - `video`
   *   - : The destination is video data. This might originate from an HTML [video](https://developer.mozilla.org/en-US/docs/HTMLElement/video) tag.
   * - `webidentity`
   *   - : The destination is an endpoint associated with verifying user identify. For example, it is used in the [FedCM API](/en-US/docs/Web/API/FedCM_API) to verify the authenticity of identity provider (IdP) endpoints, guarding against [CSRF](https://developer.mozilla.org/en-US/docs/glossary/CSRF) attacks.
   * - `worker`
   *   - : The destination is a [Worker](https://developer.mozilla.org/en-US/docs/domxref/Worker).
   * - `xslt`
   *   - : The destination is an XSLT transform.
   *
   * ## Examples
   *
   * ### Using Sec-Fetch-Dest
   *
   * A cross-site request generated by an [img](https://developer.mozilla.org/en-US/docs/HTMLElement/img) element would result in a request with the following HTTP request headers (note that the destination is `image`):
   *
   * ```http
   * Sec-Fetch-Dest: image
   * Sec-Fetch-Mode: no-cors
   * Sec-Fetch-Site: cross-site
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Sec-Fetch-Mode](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-Fetch-Mode), [Sec-Fetch-Site](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-Fetch-Site), [Sec-Fetch-User](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-Fetch-User) fetch metadata request headers
   * - [Protect your resources from web attacks with Fetch Metadata](https://web.dev/articles/fetch-metadata) (web.dev)
   * - [Fetch Metadata Request Headers playground](https://secmetadata.appspot.com/) (secmetadata.appspot.com)
   */
  'Sec-Fetch-Dest' = 'Sec-Fetch-Dest',

  /**
   * The HTTP **`Sec-Fetch-Mode`** [fetch metadata request header](https://developer.mozilla.org/en-US/docs/Glossary/fetch_metadata_request_header) indicates the [mode](/en-US/docs/Web/API/Request/mode) of the request.
   *
   * Broadly speaking, this allows a server to distinguish between requests originating from a user navigating between HTML pages, and requests to load images and other resources.
   * For example, this header would contain `navigate` for top level navigation requests, while `no-cors` is used for loading an image.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Sec-Fetch-Mode: cors
   * Sec-Fetch-Mode: navigate
   * Sec-Fetch-Mode: no-cors
   * Sec-Fetch-Mode: same-origin
   * Sec-Fetch-Mode: websocket
   * ```
   *
   * Servers should ignore this header if it contains any other value.
   *
   * ## Directives
   *
   * > [!NOTE]
   * > These directives correspond to the values in [`Request.mode`](/en-US/docs/Web/API/Request/mode#value).
   *
   * - `cors`
   *   - : The request is a [CORS protocol](/en-US/docs/Web/HTTP/Guides/CORS) request.
   * - `navigate`
   *   - : The request is initiated by navigation between HTML documents.
   * - `no-cors`
   *   - : The request is a no-cors request (see [`Request.mode`](/en-US/docs/Web/API/Request/mode#value)).
   * - `same-origin`
   *   - : The request is made from the same origin as the resource that is being requested.
   * - `websocket`
   *   - : The request is being made to establish a [WebSocket](/en-US/docs/Web/API/WebSockets_API) connection.
   *
   * ## Examples
   *
   * ### Using Sec-Fetch-Mode
   *
   * If a user clicks on a page link to another page on the same origin, the resulting request would have the following headers (note that the mode is `navigate`):
   *
   * ```http
   * Sec-Fetch-Dest: document
   * Sec-Fetch-Mode: navigate
   * Sec-Fetch-Site: same-origin
   * Sec-Fetch-User: ?1
   * ```
   *
   * A cross-site request generated by an [img](https://developer.mozilla.org/en-US/docs/HTMLElement/img) element would result in a request with the following HTTP request headers (note that the mode is `no-cors`):
   *
   * ```http
   * Sec-Fetch-Dest: image
   * Sec-Fetch-Mode: no-cors
   * Sec-Fetch-Site: cross-site
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Sec-Fetch-Dest](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-Fetch-Dest), [Sec-Fetch-Site](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-Fetch-Site), [Sec-Fetch-User](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-Fetch-User) fetch metadata request headers
   * - [Protect your resources from web attacks with Fetch Metadata](https://web.dev/articles/fetch-metadata) (web.dev)
   * - [Fetch Metadata Request Headers playground](https://secmetadata.appspot.com/) (secmetadata.appspot.com)
   */
  'Sec-Fetch-Mode' = 'Sec-Fetch-Mode',

  /**
   * The HTTP **`Sec-Fetch-Site`** [fetch metadata request header](https://developer.mozilla.org/en-US/docs/Glossary/fetch_metadata_request_header) indicates the relationship between a request initiator's origin and the origin of the requested resource.
   *
   * In other words, this header tells a server whether a request for a resource is coming from the same origin, the same site, a different site, or is a "user initiated" request. The server can then use this information to decide if the request should be allowed.
   *
   * Same-origin requests would usually be allowed by default, but what happens for requests from other origins may further depend on what resource is being requested, or information in another [fetch metadata request header](https://developer.mozilla.org/en-US/docs/Glossary/fetch_metadata_request_header). By default, requests that are not accepted should be rejected with a [403](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403) response code.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Sec-Fetch-Site: cross-site
   * Sec-Fetch-Site: same-origin
   * Sec-Fetch-Site: same-site
   * Sec-Fetch-Site: none
   * ```
   *
   * ## Directives
   *
   * - `cross-site`
   *   - : The request initiator and the server hosting the resource have a different site (i.e., a request by "potentially-evil.com" for a resource at "example.com").
   * - `same-origin`
   *   - : The request initiator and the server hosting the resource have the same [origin](https://developer.mozilla.org/en-US/docs/Glossary/origin) (same scheme, host and port).
   * - `same-site`
   *   - : The request initiator and the server hosting the resource have the same [site](https://developer.mozilla.org/en-US/docs/glossary/site), including the scheme.
   * - `none`
   *   - : This request is a user-originated operation. For example: entering a URL into the address bar, opening a bookmark, or dragging-and-dropping a file into the browser window.
   *
   * ## Examples
   *
   * A fetch request to `https://mysite.example/foo.json` originating from a web page on `https://mysite.example` (with the same port) is a same-origin request.
   * The browser will generate the `Sec-Fetch-Site: same-origin` header as shown below, and the server will typically allow the request:
   *
   * ```http
   * GET /foo.json
   * Sec-Fetch-Dest: empty
   * Sec-Fetch-Mode: cors
   * Sec-Fetch-Site: same-origin
   * ```
   *
   * A fetch request to the same URL from another site, for example `potentially-evil.com`, causes the browser to generate a different header (e.g., `Sec-Fetch-Site: cross-site`), which the server can choose to accept or reject:
   *
   * ```http
   * GET /foo.json
   * Sec-Fetch-Dest: empty
   * Sec-Fetch-Mode: cors
   * Sec-Fetch-Site: cross-site
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Sec-Fetch-Mode](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-Fetch-Mode), [Sec-Fetch-User](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-Fetch-User), [Sec-Fetch-Dest](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-Fetch-Dest) fetch metadata request headers
   * - [Protect your resources from web attacks with Fetch Metadata](https://web.dev/articles/fetch-metadata) (web.dev)
   * - [Fetch Metadata Request Headers playground](https://secmetadata.appspot.com/) (secmetadata.appspot.com)
   */
  'Sec-Fetch-Site' = 'Sec-Fetch-Site',

  /**
   * The HTTP **`Sec-Fetch-User`** [fetch metadata request header](https://developer.mozilla.org/en-US/docs/Glossary/fetch_metadata_request_header) is sent for requests initiated by user activation, and its value is always `?1`.
   *
   * A server can use this header to identify whether a navigation request from a document, iframe, etc., was originated by the user.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Sec-Fetch-User: ?1
   * ```
   *
   * ## Directives
   *
   * The value will always be `?1`. When a request is triggered by something other than a user activation, the spec requires browsers to omit the header completely.
   *
   * ## Examples
   *
   * ### Using Sec-Fetch-User
   *
   * If a user clicks on a page link to another page on the same origin, the resulting request would have the following headers:
   *
   * ```http
   * Sec-Fetch-Dest: document
   * Sec-Fetch-Mode: navigate
   * Sec-Fetch-Site: same-origin
   * Sec-Fetch-User: ?1
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Sec-Fetch-Dest](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-Fetch-Dest), [Sec-Fetch-Mode](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-Fetch-Mode), [Sec-Fetch-Site](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-Fetch-Site) fetch metadata request headers
   * - [Protect your resources from web attacks with Fetch Metadata](https://web.dev/articles/fetch-metadata) (web.dev)
   * - [Fetch Metadata Request Headers playground](https://secmetadata.appspot.com/) (secmetadata.appspot.com)
   */
  'Sec-Fetch-User' = 'Sec-Fetch-User',

  /**
   * The HTTP **`Sec-GPC`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) is part of the [Global Privacy Control](https://globalprivacycontrol.org/) (GPC) mechanism to indicate whether the user consents to a website or service selling or sharing their personal information with third parties.
   *
   * The specification does not define how the user can withdraw or grant consent for website.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Sec-GPC: <preference>
   * ```
   *
   * ## Directives
   *
   * - `<preference>`
   *   - : A value of `1` means the user has indicated that they prefer their information not be shared with, or sold to, third parties.
   *     Otherwise, the header is not sent, which indicates that either the user has not made a decision or the user is okay with their information being shared with or sold to third parties.
   *
   * ## Examples
   *
   * ### Reading Global Privacy Control status from JavaScript
   *
   * The user's GPC preference can also be read from JavaScript using the [Navigator.globalPrivacyControl](https://developer.mozilla.org/en-US/docs/domxref/Navigator.globalPrivacyControl) or [WorkerNavigator.globalPrivacyControl](https://developer.mozilla.org/en-US/docs/domxref/WorkerNavigator.globalPrivacyControl) property:
   *
   * ```js
   * navigator.globalPrivacyControl; // "false" or "true"
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Navigator.globalPrivacyControl](https://developer.mozilla.org/en-US/docs/domxref/Navigator.globalPrivacyControl)
   * - [DNT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/DNT) header
   * - [Tk](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Tk) header
   * - [globalprivacycontrol.org](https://globalprivacycontrol.org/)
   * - [Do Not Track on Wikipedia](https://en.wikipedia.org/wiki/Do_Not_Track)
   */
  'Sec-GPC' = 'Sec-GPC',

  /**
   * The HTTP **`Sec-Purpose`** [fetch metadata request header](https://developer.mozilla.org/en-US/docs/Glossary/fetch_metadata_request_header) indicates the purpose for which the requested resource will be used, when that purpose is something other than immediate use by the user-agent.
   *
   * The only purpose that is currently defined is `prefetch`, which indicates that the resource is being requested in anticipation that it will be needed by a page that is likely to be navigated to in the near future, such as a page linked in search results or a link that a user has hovered over.
   * The server can use this knowledge to: adjust the caching expiry for the request, disallow the request, or perhaps to treat it differently when counting page visits.
   *
   * The header is sent when a page is loaded that has a [`
   *
   * ## Syntax
   *
   * ```http
   * Sec-Purpose: prefetch
   * ```
   *
   * ## Directives
   *
   * The allowed tokens are:
   *
   * - `prefetch`
   *   - : The purpose is to prefetch a resource that may be needed in a probable future navigation.
   *
   * ## Examples
   *
   * ### A prefetch request
   *
   * Consider the case where a browser loads a file with a [`<link>`](/en-US/docs/Web/HTML/Reference/Elements/link) element that has the attribute `rel="prefetch"` and an `href` attribute containing the address of an image file.
   * The resulting `fetch()` should result in an HTTP request where `Sec-Purpose: prefetch`, `Sec-Fetch-Dest: empty`, and an `Accept` value that is the same as the browser uses for page navigation.
   *
   * An example of such a header (on Firefox) is given below:
   *
   * ```http
   * GET /images/some_image.png HTTP/1.1
   * Host: example.com
   * User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0
   * Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,* /*;q=0.8
   * Accept-Language: en-US,en;q=0.5
   * Accept-Encoding: gzip, deflate, br
   * Sec-Purpose: prefetch
   * Connection: keep-alive
   * Sec-Fetch-Dest: empty
   * Sec-Fetch-Mode: no-cors
   * Sec-Fetch-Site: same-origin
   * Pragma: no-cache
   * Cache-Control: no-cache
   * ```
   *
   * > [!NOTE]
   * > At time of writing Firefox incorrectly sets the `Accept` header as `Accept: * /*` for prefetches.
   * > The example has been modified to show what the `Accept` value should be.
   * > This issue can be tracked in [Firefox bug 1836334](https://bugzil.la/1836334).
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Sec-Fetch-Dest](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-Fetch-Dest), [Sec-Fetch-Mode](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-Fetch-Mode), [Sec-Fetch-Site](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-Fetch-Site), [Sec-Fetch-User](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-Fetch-User) fetch metadata request headers
   * - [Prefetch](https://developer.mozilla.org/en-US/docs/Glossary/Prefetch) (Glossary)
   * - [`<link>`](/en-US/docs/Web/HTML/Reference/Elements/link) element with attribute [`rel="prefetch"`](/en-US/docs/Web/HTML/Reference/Attributes/rel/prefetch)
   */
  'Sec-Purpose' = 'Sec-Purpose',

  /**
   * The HTTP **`Sec-Speculation-Tags`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) contains one or more `tag` values from the [speculation rules](/en-US/docs/Web/API/Speculation_Rules_API) that resulted in the speculation. This allows a server to identify which rule(s) caused a speculation and potentially block them.
   *
   * For example, a CDN may automatically insert speculation rules, but block speculations for resources not cached in the CDN to avoid unintended consequences. The `Sec-Speculation-Tags` header allows the CDN to differentiate between the rules it has inserted (which should be blocked in this case) and speculation rules added by the site owner (which should not be blocked).
   *
   *
   * ```
   *
   * Similar to the previous example, if the link is clicked immediately without waiting for the 200 millisecond hover, both rules would have triggered a speculation, therefore both tags will be included in the header. However, because the first rule does not include a `tag` field, it is represented in the header with a `null` value:
   *
   * ```http
   * Sec-Speculation-Tags: null, "cdn-rule"
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Speculation Rules API](/en-US/docs/Web/API/Speculation_Rules_API)
   * - [`<script type="speculationrules">`](/en-US/docs/Web/HTML/Reference/Elements/script/type/speculationrules)
   */
  'Sec-Speculation-Tags' = 'Sec-Speculation-Tags',

  /**
   * The HTTP **Sec-WebSocket-Accept** [response header](https://developer.mozilla.org/en-US/docs/glossary/response_header) is used in the [WebSocket](/en-US/docs/Web/API/WebSockets_API) opening [handshake](/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers#the_websocket_handshake) to indicate that the server is willing to upgrade to a WebSocket connection.
   *
   * This header must appear no more than once in the response, and has a directive value that is calculated from the [Sec-WebSocket-Key](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-WebSocket-Key) request header sent in the corresponding request.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Sec-WebSocket-Accept: <hashed key>
   * ```
   *
   * ## Directives
   *
   * - `<hashed key>`
   *   - : If a [Sec-WebSocket-Key](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-WebSocket-Key) header was provided, the value of this header is computed by taking the value of the key, concatenating the string `258EAFA5-E914-47DA-95CA-C5AB0DC85B11`, and taking the [SHA-1](https://en.wikipedia.org/wiki/SHA-1) hash of that concatenated string — resulting in a 20-byte value.
   *     That value is then [base64](/en-US/docs/Glossary/Base64) encoded to obtain the value of this property.
   *
   * ## Examples
   *
   * ### WebSocket opening handshake
   *
   * The client will initiate a WebSocket handshake with a request like the following.
   * Note that this starts as an HTTP `GET` request (HTTP/1.1 or later) and includes the [Upgrade](https://developer.mozilla.org/en-US/docs/httpheader/Upgrade) header indicating the intent to upgrade to a WebSocket connection.
   * It also includes `Sec-WebSocket-Key`, which is used in the calculation of `Sec-WebSocket-Accept` to confirm the intent to upgrade the connection to a WebSocket connection.
   *
   * ```http
   * GET /chat HTTP/1.1
   * Host: example.com:8000
   * Upgrade: websocket
   * Connection: Upgrade
   * Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
   * Sec-WebSocket-Version: 13
   * ```
   *
   * The response from the server should include the `Sec-WebSocket-Accept` header with a value that is calculated from the `Sec-WebSocket-Key` header in the request, and confirms the intent to upgrade the connection to a WebSocket connection:
   *
   * ```http
   * HTTP/1.1 101 Switching Protocols
   * Upgrade: websocket
   * Connection: Upgrade
   * Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Sec-WebSocket-Key](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-WebSocket-Key)
   * - [Sec-WebSocket-Version](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-WebSocket-Version)
   * - [Sec-WebSocket-Protocol](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-WebSocket-Protocol)
   * - [Sec-WebSocket-Extensions](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-WebSocket-Extensions)
   * - [The WebSocket handshake](/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers#the_websocket_handshake) in _Writing WebSocket servers_
   * - [HTTP Protocol upgrade mechanism](/en-US/docs/Web/HTTP/Guides/Protocol_upgrade_mechanism)
   */
  'Sec-WebSocket-Accept' = 'Sec-WebSocket-Accept',

  /**
   * The HTTP **Sec-WebSocket-Extensions** [request](https://developer.mozilla.org/en-US/docs/glossary/request_header) and [response header](https://developer.mozilla.org/en-US/docs/glossary/response_header) is used in the [WebSocket](/en-US/docs/Web/API/WebSockets_API) opening [handshake](/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers#the_websocket_handshake) to negotiate a protocol extension used by the client and server.
   *
   * In a request the header specifies one or more extensions that the web application would like to use, in order of preference.
   * These can be added as in multiple headers, or as comma separated values added to a single header.
   * Each extension can also have one or more parameters — these are semicolon-separated values listed after the extension.
   *
   * In a response the header can only appear once, where it specifies the extension selected by the server from the client's preferences.
   * This value must be the first extension that the server supports from the list provided in the request header.
   *
   * The request header is automatically added by the browser based on its own capabilities, and does not depend on parameters passed to the constructor when the `WebSocket` is created.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Sec-WebSocket-Extensions: <extensions>
   * ```
   *
   * ## Directives
   *
   * - `<extensions>`
   *   - : A comma-separated list of extensions to request (or for the server to agree to support).
   *     These are commonly selected from the [IANA WebSocket Extension Name Registry](https://www.iana.org/assignments/websocket/websocket.xml#extension-name) (custom extensions may also be used).
   *     Extensions which take parameters delineate them with semicolons.
   *
   * ## Examples
   *
   * ### WebSocket opening handshake
   *
   * The HTTP request below shows the opening handshake where a client supports the `permessage-deflate` extension (with `client_max_window_bits` parameter), and the `bbf-usp-protocol` extension.
   *
   * ```http
   * GET /chat HTTP/1.1
   * Host: example.com:8000
   * Upgrade: websocket
   * Connection: Upgrade
   * Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
   * Sec-WebSocket-Version: 13
   * Sec-WebSocket-Extensions: permessage-deflate; client_max_window_bits, bbf-usp-protocol
   * ```
   *
   * The request below with separate headers for each extension is equivalent:
   *
   * ```http
   * GET /chat HTTP/1.1
   * Host: example.com:8000
   * Upgrade: websocket
   * Connection: Upgrade
   * Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
   * Sec-WebSocket-Version: 13
   * Sec-WebSocket-Extensions: permessage-deflate; client_max_window_bits
   * Sec-WebSocket-Extensions: bbf-usp-protocol
   * ```
   *
   * The response below might be sent from a server to indicate that it will support the `permessage-deflate` extension:
   *
   * ```http
   * HTTP/1.1 101 Switching Protocols
   * Upgrade: websocket
   * Connection: Upgrade
   * Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
   * Sec-WebSocket-Extensions: permessage-deflate
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Sec-WebSocket-Accept](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-WebSocket-Accept)
   * - [Sec-WebSocket-Key](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-WebSocket-Key)
   * - [Sec-WebSocket-Version](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-WebSocket-Version)
   * - [Sec-WebSocket-Protocol](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-WebSocket-Protocol)
   * - [The WebSocket handshake](/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers#the_websocket_handshake) and [Subprotocols](/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers#subprotocols) in _Writing WebSocket servers_
   */
  'Sec-WebSocket-Extensions' = 'Sec-WebSocket-Extensions',

  /**
   * The HTTP **Sec-WebSocket-Key** [request header](https://developer.mozilla.org/en-US/docs/glossary/request_header) is used in the [WebSocket](/en-US/docs/Web/API/WebSockets_API) opening [handshake](/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers#the_websocket_handshake) to allow a client (user agent) to confirm that it "really wants" to request that an HTTP client is upgraded to become a WebSocket.
   *
   * The value of the key is computed using an algorithm defined in the WebSocket specification, so this _does not provide security_.
   * Instead, it helps to prevent non-WebSocket clients from inadvertently, or through misuse, requesting a WebSocket connection.
   *
   * This header is automatically added by user agents when a script opens a WebSocket; it cannot be added using the [fetch()](https://developer.mozilla.org/en-US/docs/domxref/Window/fetch) or [XMLHttpRequest.setRequestHeader()](https://developer.mozilla.org/en-US/docs/domxref/XMLHttpRequest.setRequestHeader()) methods.
   *
   * The server's [Sec-WebSocket-Accept](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-WebSocket-Accept) response header should include a value computed based upon the specified key value.
   * The user agent can then validate this before this before confirming the connection.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Sec-WebSocket-Key: <key>
   * ```
   *
   * ## Directives
   *
   * - `<key>`
   *   - : The key for this request to upgrade.
   *     This is a randomly selected 16-byte nonce that has been base64-encoded and isomorphic encoded.
   *     The user agent adds this when initiating the WebSocket connection.
   *
   * ## Examples
   *
   * ### WebSocket opening handshake
   *
   * The client will initiate a WebSocket handshake with a request like the following.
   * Note that this starts as an HTTP `GET` request (HTTP/1.1 or later), in addition to `Sec-WebSocket-Key`, the request includes the [Upgrade](https://developer.mozilla.org/en-US/docs/httpheader/Upgrade) header, indicating the intent to upgrade from HTTP to a WebSocket connection.
   *
   * ```http
   * GET /chat HTTP/1.1
   * Host: example.com:8000
   * Upgrade: websocket
   * Connection: Upgrade
   * Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
   * Sec-WebSocket-Version: 13
   * ```
   *
   * The response from the server should include the `Sec-WebSocket-Accept` header with a value that is calculated from the `Sec-WebSocket-Key` header in the request, and confirms the intent to upgrade the connection to a WebSocket connection:
   *
   * ```http
   * HTTP/1.1 101 Switching Protocols
   * Upgrade: websocket
   * Connection: Upgrade
   * Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Sec-WebSocket-Accept](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-WebSocket-Accept)
   * - [Sec-WebSocket-Version](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-WebSocket-Version)
   * - [Sec-WebSocket-Protocol](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-WebSocket-Protocol)
   * - [Sec-WebSocket-Extensions](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-WebSocket-Extensions)
   * - [The WebSocket handshake](/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers#the_websocket_handshake) in _Writing WebSocket servers_
   * - [HTTP Protocol upgrade mechanism](/en-US/docs/Web/HTTP/Guides/Protocol_upgrade_mechanism)
   */
  'Sec-WebSocket-Key' = 'Sec-WebSocket-Key',

  /**
   * The HTTP **`Sec-WebSocket-Protocol`** [request](https://developer.mozilla.org/en-US/docs/glossary/request_header) and [response header](https://developer.mozilla.org/en-US/docs/glossary/response_header) is used in the [WebSocket](/en-US/docs/Web/API/WebSockets_API) opening [handshake](/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers#the_websocket_handshake) to negotiate a [sub-protocol](/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers#subprotocols) to use in the communication.
   * This can be a well understood protocol, such as SOAP or WAMP, or a custom protocol understood by the client and server.
   *
   * In a request the header specifies one or more WebSocket sub-protocols that the web application would like to use, in order of preference.
   * These can be added as protocol values in multiple headers, or as comma separate values added to a single header.
   *
   * In a response it specifies the sub-protocol selected by the server.
   * This must be the first sub-protocol that the server supports from the list provided in the request header.
   *
   * The request header is automatically added and populated by the browser using values specified by the application in the [`protocols`](/en-US/docs/Web/API/WebSocket/WebSocket#protocols) argument to the `WebSocket()`.
   * The sub-protocol selected by the server is made available to the web application in [WebSocket.protocol](https://developer.mozilla.org/en-US/docs/domxref/WebSocket.protocol).
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Sec-WebSocket-Protocol: <sub-protocols>
   * ```
   *
   * ## Directives
   *
   * - `<sub-protocols>`
   *   - : A comma-separated list of sub-protocol names, in the order of preference.
   *     The sub-protocols may be selected from the [IANA WebSocket Subprotocol Name Registry](https://www.iana.org/assignments/websocket/websocket.xml#subprotocol-name), or may be a custom name jointly understood by the client and the server.
   *
   *     As a response header, this is a single sub-protocol that the server selected.
   *
   * ## Examples
   *
   * ### WebSocket opening handshake
   *
   * The sub-protocol is specified in the original WebSocket [handshake request](/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers#the_websocket_handshake).
   * The request below shows that the client prefers `soap`, but also supports `wamp`.
   *
   * ```http
   * GET /chat HTTP/1.1
   * Host: example.com:8000
   * Upgrade: websocket
   * Connection: Upgrade
   * Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
   * Sec-WebSocket-Version: 13
   * Sec-WebSocket-Protocol: soap, wamp
   * ```
   *
   * Specifying the protocols like this has the same effect:
   *
   * ```http
   * Sec-WebSocket-Protocol: soap
   * Sec-WebSocket-Protocol: wamp
   * ```
   *
   * The response from the server will include the `Sec-WebSocket-Protocol` header, selecting the first sub-protocol that it supports from the client's preferences.
   * Below that is shown as `soap`:
   *
   * ```http
   * HTTP/1.1 101 Switching Protocols
   * Upgrade: websocket
   * Connection: Upgrade
   * Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
   * Sec-WebSocket-Protocol: soap
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Sec-WebSocket-Accept](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-WebSocket-Accept)
   * - [Sec-WebSocket-Key](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-WebSocket-Key)
   * - [Sec-WebSocket-Version](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-WebSocket-Version)
   * - [Sec-WebSocket-Extensions](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-WebSocket-Extensions)
   * - [The WebSocket handshake](/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers#the_websocket_handshake) and [Subprotocols](/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers#subprotocols) in _Writing WebSocket servers_
   */
  'Sec-WebSocket-Protocol' = 'Sec-WebSocket-Protocol',

  /**
   * The HTTP **Sec-WebSocket-Version** [request](https://developer.mozilla.org/en-US/docs/glossary/request_header) and [response header](https://developer.mozilla.org/en-US/docs/glossary/response_header) is used in the [WebSocket](/en-US/docs/Web/API/WebSockets_API) opening [handshake](/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers#the_websocket_handshake) to indicate the WebSocket protocol supported by the client, and the protocol versions supported by the server if it does _not_ support the version specified in the request.
   *
   * The header can only appear once in a request, and specifies the WebSocket version that web application is using.
   * The current version of the protocol at time of writing is 13.
   * The header is automatically added to requests by user agents when a [WebSocket](https://developer.mozilla.org/en-US/docs/domxref/WebSocket) connection is established.
   *
   * The server uses the version to determine if it can understand the protocol.
   * If the server doesn't support the version, or any header in the handshake is not understood or has an incorrect value, the server should send a response with status [400 Bad Request](https://developer.mozilla.org/en-US/docs/httpstatus/400) and immediately close the socket.
   * It should also include `Sec-WebSocket-Version` in the `400` response, listing the versions that it does support.
   * The versions can be specified in individual headers, or as comma-separate values in a single header.
   *
   * The header should not be sent in responses if the server understands the version specified by the client.
   *
   *
   *
   * ## Syntax
   *
   * Request
   *
   * ```http
   * Sec-WebSocket-Version: <version>
   * ```
   *
   * Response (on error only):
   *
   * ```http
   * Sec-WebSocket-Version: <server-supported-versions>
   * ```
   *
   * ## Directives
   *
   * - `<version>`
   *   - : The WebSocket protocol version the client wishes to use when communicating with the server.
   *     This number should be the most recent version possible listed in the [IANA WebSocket Version Number Registry](https://www.iana.org/assignments/websocket/websocket.xml#version-number).
   *     The most recent final version of the WebSocket protocol is version 13.
   * - `<server-supported-versions>`
   *   - : On error, a comma-delineated list of the WebSocket protocol versions supported by the server.
   *     The header is not sent in responses if `<version>` is supported.
   *
   * ## Examples
   *
   * ### WebSocket opening handshake
   *
   * The version supported by the client is specified in the original `WebSocket` [handshake request](/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers#the_websocket_handshake).
   * For the current protocol, the version is "13", as shown below.
   *
   * ```http
   * GET /chat HTTP/1.1
   * Host: example.com:8000
   * Upgrade: websocket
   * Connection: Upgrade
   * Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
   * Sec-WebSocket-Version: 13
   * ```
   *
   * If the server supports version 13 of the protocol, then `Sec-WebSocket-Version` will not appear in the response.
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Sec-WebSocket-Accept](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-WebSocket-Accept)
   * - [Sec-WebSocket-Key](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-WebSocket-Key)
   * - [Sec-WebSocket-Protocol](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-WebSocket-Protocol)
   * - [Sec-WebSocket-Extensions](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-WebSocket-Extensions)
   * - [The WebSocket handshake](/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers#the_websocket_handshake) in _Writing WebSocket servers_
   */
  'Sec-WebSocket-Version' = 'Sec-WebSocket-Version',

  /**
   * The HTTP **`Server-Timing`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) communicates one or more performance metrics about the request-response cycle to the user agent.
   * It is used to surface backend server timing metrics (for example, database read/write, CPU time, file system access, etc.) in the developer tools in the user's browser or in the [PerformanceServerTiming](https://developer.mozilla.org/en-US/docs/domxref/PerformanceServerTiming) interface.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * // A single metric
   * Server-Timing: <timing-metric>
   *
   * // Multiple metrics as a comma-separated list
   * Server-Timing: <timing-metric>, …, <timing-metricN>
   * ```
   *
   * A `<timing-metric>` has a name, and may include an optional duration and an optional description.
   * For example:
   *
   * ```http
   * // A metric with a name only
   * Server-Timing: missedCache
   *
   * // A metric with a duration
   * Server-Timing: cpu;dur=2.4
   *
   * // A metric with a description and duration
   * Server-Timing: cache;desc="Cache Read";dur=23.2
   *
   * // Two metrics with duration values
   * Server-Timing: db;dur=53, app;dur=47.2
   * ```
   *
   * ## Directives
   *
   * - `<timing-metric>`
   *   - : A comma-separated list of one or more metrics with the following components separated by semi-colons:
   *     - `<name>`
   *       - : A name token (no spaces or special characters) for the metric that is implementation-specific or defined by the server, like `cacheHit`.
   *     - `<duration>`
   *       - : A duration as the string `dur`, followed by `=`, followed by a value, like `dur=23.2`.
   *     - `<description>`
   *       - : A description as the string `desc`, followed by `=`, followed by a value as a token or a quoted string, like `desc=prod` or `desc="DB lookup"`.
   *
   * Names and descriptions should be kept as short as possible (for example, use abbreviations and omit optional values) to minimize HTTP data overhead.
   *
   * ## Description
   *
   * ### Privacy and security
   *
   * The `Server-Timing` header may expose potentially sensitive application and infrastructure information.
   * Decide which metrics to send, when to send them, and who should see them based on the use case.
   * For example, you may decide to only show metrics to authenticated users and nothing on public responses.
   *
   * ### PerformanceServerTiming interface
   *
   * In addition to having `Server-Timing` header metrics appear in the developer tools of the browser, the [PerformanceServerTiming](https://developer.mozilla.org/en-US/docs/domxref/PerformanceServerTiming) interface enables tools to automatically collect and process metrics from JavaScript. This interface is restricted to the same origin, but you can use the [Timing-Allow-Origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Timing-Allow-Origin) header to specify the domains that are allowed to access the server metrics. The interface is only available in secure contexts (HTTPS) in some browsers.
   *
   * The components of the `Server-Timing` header map to the [PerformanceServerTiming](https://developer.mozilla.org/en-US/docs/domxref/PerformanceServerTiming) properties as follows:
   *
   * - `"name"` -> [PerformanceServerTiming.name](https://developer.mozilla.org/en-US/docs/domxref/PerformanceServerTiming.name)
   * - `"dur"` -> [PerformanceServerTiming.duration](https://developer.mozilla.org/en-US/docs/domxref/PerformanceServerTiming.duration)
   * - `"desc"` -> [PerformanceServerTiming.description](https://developer.mozilla.org/en-US/docs/domxref/PerformanceServerTiming.description)
   *
   * ## Examples
   *
   * ### Sending a metric using the Server-Timing header
   *
   * The following response includes a metric `custom-metric` with a duration of `123.45` milliseconds, and a description of "My custom metric":
   *
   * ```http
   * Server-Timing: custom-metric;dur=123.45;desc="My custom metric"
   * ```
   *
   * ### Server-Timing as HTTP trailer
   *
   * In the following response, the [Trailer](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Trailer) header is used to indicate that a `Server-Timing` header will follow the response body.
   * A metric `custom-metric` with a duration of `123.4` milliseconds is sent.
   *
   * ```http
   * HTTP/1.1 200 OK
   * Transfer-Encoding: chunked
   * Trailer: Server-Timing
   *
   * --- response body ---
   * Server-Timing: custom-metric;dur=123.4
   * ```
   *
   * > [!WARNING]
   * > Only the browser's DevTools can use the `Server-Timing` header as a HTTP trailer to display information in the Network -> Timings tab.
   * > The Fetch API cannot access HTTP trailers.
   * > See [Browser compatibility](#browser_compatibility) for more information.
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [PerformanceServerTiming](https://developer.mozilla.org/en-US/docs/domxref/PerformanceServerTiming)
   * - [Trailer](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Trailer) header
   */
  'Server-Timing' = 'Server-Timing',

  /**
   * The HTTP **`Server`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) describes the software used by the origin server that handled the request and generated a response.
   *
   * The benefits of advertising the server type and version via this header are that it helps with analytics and identifying how widespread specific interoperability issues are.
   * Historically, clients have used the server version information to avoid known limitations, such as inconsistent support for [range requests](/en-US/docs/Web/HTTP/Guides/Range_requests) in specific software versions.
   *
   * > [!WARNING]
   * > The presence of this header in responses, especially when it contains fine-grained implementation details about server software, may make known vulnerabilities easier to detect.
   *
   * Too much detail in the `Server` header is not advised for response latency and the security reason mentioned above.
   * It's debatable whether obscuring the information in this header provides much benefit because fingerprinting server software is possible via other means.
   * In general, a more robust approach to server security is to ensure software is regularly updated or patched against known vulnerabilities instead.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Server: <product>
   * ```
   *
   * ## Directives
   *
   * - `<product>`
   *   - : A name of the software or the product that handled the request.
   *     Usually in a format similar to .
   *
   * ## Examples
   *
   * ```http
   * Server: Apache/2.4.1 (Unix)
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Allow](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Allow)
   * - [HTTP Observatory](/en-US/observatory)
   * - [Prevent information disclosure via HTTP headers](https://owasp.org/www-project-secure-headers/index.html#prevent-information-disclosure-via-http-headers) - OWASP Secure Headers Project
   */
  'Server' = 'Server',

  /**
   * The HTTP **`Service-Worker-Allowed`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) is used to broaden the path restriction for a service worker's default `scope`.
   *
   * By default, the [`scope`](/en-US/docs/Web/API/ServiceWorkerContainer/register#scope) for a service worker registration is the directory where the service worker script is located.
   * For example, if the script `sw.js` is located in `/js/sw.js`, it can only control URLs under `/js/` by default.
   * Servers can use the `Service-Worker-Allowed` header to allow a service worker to control URLs outside of its own directory.
   *
   * A service worker intercepts all network requests within its scope, so you should avoid using overly-broad scopes unless necessary.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Service-Worker-Allowed: <scope>
   * ```
   *
   * ## Directives
   *
   * - `<scope>`
   *   - : A string representing a URL that defines a service worker's registration scope; that is, what range of URLs a service worker can control.
   *
   * ## Examples
   *
   * ### Using Service-Worker-Allowed to broaden service worker scope
   *
   * The JavaScript example below is included in `example.com/product/index.html`, and attempts to [register](/en-US/docs/Web/API/ServiceWorkerContainer/register) a service worker with a scope that applies to all resources under `example.com/`.
   *
   * ```js
   * navigator.serviceWorker.register("./sw.js", { scope: "/" }).then(
   *   (registration) => {
   *     console.log("Install succeeded, scoped to '/'", registration);
   *   },
   *   (error) => {
   *     console.error(`Service worker registration failed: ${error}`);
   *   },
   * );
   * ```
   *
   * The HTTP response to the service worker's script resource request (`./sw.js`) includes the `Service-Worker-Allowed` header set to `/`:
   *
   * ```http
   * HTTP/1.1 200 OK
   * Date: Mon, 16 Dec 2024 14:37:20 GMT
   * Service-Worker-Allowed: /
   *
   * // sw.js contents…
   * ```
   *
   * If the server doesn't set the header, the service worker registration will fail, as the `scope` option (`{ scope: "/" }`) requests a scope broader than the directory where the service worker script is located (`/product/sw.js`).
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Service-Worker](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Service-Worker) header
   * - [Service worker API](/en-US/docs/Web/API/Service_Worker_API)
   * - [ServiceWorkerRegistration](https://developer.mozilla.org/en-US/docs/domxref/ServiceWorkerRegistration)
   * - [Why is my service worker failing to register](/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers#why_is_my_service_worker_failing_to_register) in _Using Service Workers_.
   */
  'Service-Worker-Allowed' = 'Service-Worker-Allowed',

  /**
   * The HTTP **`Service-Worker-Navigation-Preload`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) indicates that the request was the result of a [fetch()](https://developer.mozilla.org/en-US/docs/domxref/Window/fetch) operation made during service worker navigation preloading.
   * It allows a server to respond with a different resource than for a normal `fetch()`.
   *
   * If a different response may result from setting this header, the server must include a [Vary: Service-Worker-Navigation-Preload](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) header in responses to ensure that different responses are cached.
   *
   * For more information see [NavigationPreloadManager.setHeaderValue()](https://developer.mozilla.org/en-US/docs/domxref/NavigationPreloadManager.setHeaderValue()) (and [NavigationPreloadManager](https://developer.mozilla.org/en-US/docs/domxref/NavigationPreloadManager)).
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Service-Worker-Navigation-Preload: <value>
   * ```
   *
   * ## Directives
   *
   * - `<value>`
   *   - : An arbitrary value that indicates what data should be sent in the response to the preload request.
   *     This defaults to `true`.
   *     It maybe set to any other string value in the service worker, using [NavigationPreloadManager.setHeaderValue()](https://developer.mozilla.org/en-US/docs/domxref/NavigationPreloadManager.setHeaderValue()).
   *
   * ## Examples
   *
   * ### Service worker navigation preloading headers
   *
   * The following request header is sent by default in navigation preload requests:
   *
   * ```http
   * Service-Worker-Navigation-Preload: true
   * ```
   *
   * The service worker can set a different header value using [NavigationPreloadManager.setHeaderValue()](https://developer.mozilla.org/en-US/docs/domxref/NavigationPreloadManager.setHeaderValue()).
   * For example, in order to request that a fragment of the requested resource be returned in JSON format, the value could be set with the string `json_fragment1`.
   *
   * ```http
   * Service-Worker-Navigation-Preload: json_fragment1
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [HTTP Caching: Vary](/en-US/docs/Web/HTTP/Guides/Caching#vary) and [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) header
   * - [Service Worker API](/en-US/docs/Web/API/Service_Worker_API)
   */
  'Service-Worker-Navigation-Preload' = 'Service-Worker-Navigation-Preload',

  /**
   * The HTTP **`Service-Worker`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) is included in fetches for a service worker's script resource.
   * This header helps administrators log service worker script requests for monitoring purposes.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Service-Worker: script
   * ```
   *
   * ## Directives
   *
   * - `script`
   *   - : A value indicating that this is a script.
   *     This is the only allowed directive for this header.
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Service-Worker-Allowed](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Service-Worker-Allowed) header
   * - [Service worker API](/en-US/docs/Web/API/Service_Worker_API)
   */
  'Service-Worker' = 'Service-Worker',

  /**
   * The HTTP **`Set-Cookie`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) is used to send a cookie from the server to the user agent, so that the user agent can send it back to the server later.
   * To send multiple cookies, multiple `Set-Cookie` headers should be sent in the same response.
   *
   * > [!WARNING]
   * > Browsers block frontend JavaScript code from accessing the `Set-Cookie` header, as required by the Fetch spec, which defines `Set-Cookie` as a [forbidden response header name](https://fetch.spec.whatwg.org/#forbidden-response-header-name) that [must be filtered out](https://fetch.spec.whatwg.org/#ref-for-forbidden-response-header-name%E2%91%A0) from any response exposed to frontend code.
   * >
   * > When a [Fetch API](/en-US/docs/Web/API/Fetch_API/Using_Fetch) or [XMLHttpRequest API](/en-US/docs/Web/API/XMLHttpRequest_API) request [uses CORS](/en-US/docs/Web/HTTP/Guides/CORS#what_requests_use_cors), browsers will ignore `Set-Cookie` headers present in the server's response unless the request includes credentials. Visit [Using the Fetch API - Including credentials](/en-US/docs/Web/API/Fetch_API/Using_Fetch#including_credentials) and the [XMLHttpRequest article](/en-US/docs/Web/API/XMLHttpRequest_API) to learn how to include credentials.
   *
   * For more information, see the guide on [Using HTTP cookies](/en-US/docs/Web/HTTP/Guides/Cookies).
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Set-Cookie: <cookie-name>=<cookie-value>
   * Set-Cookie: <cookie-name>=<cookie-value>; Domain=<domain-value>
   * Set-Cookie: <cookie-name>=<cookie-value>; Expires=<date>
   * Set-Cookie: <cookie-name>=<cookie-value>; HttpOnly
   * Set-Cookie: <cookie-name>=<cookie-value>; Max-Age=<number>
   * Set-Cookie: <cookie-name>=<cookie-value>; Partitioned
   * Set-Cookie: <cookie-name>=<cookie-value>; Path=<path-value>
   * Set-Cookie: <cookie-name>=<cookie-value>; Secure
   *
   * Set-Cookie: <cookie-name>=<cookie-value>; SameSite=Strict
   * Set-Cookie: <cookie-name>=<cookie-value>; SameSite=Lax
   * Set-Cookie: <cookie-name>=<cookie-value>; SameSite=None; Secure
   *
   * // Multiple attributes are also possible, for example:
   * Set-Cookie: <cookie-name>=<cookie-value>; Domain=<domain-value>; Secure; HttpOnly
   * ```
   *
   * ## Attributes
   *
   * - `<cookie-name>=<cookie-value>`
   *   - : Defines the cookie name and its value.
   *     A cookie definition begins with a name-value pair.
   *
   *     A `<cookie-name>` can contain any US-ASCII characters except for: control characters ([ASCII](https://developer.mozilla.org/en-US/docs/Glossary/ASCII) characters 0 up to 31 and ASCII character 127) or separator characters (space, tab and the characters: `( ) < > @ , ; : \ " / [ ] ? = { }`)
   *
   *     A `<cookie-value>` can optionally be wrapped in double quotes and include any US-ASCII character excluding control characters (ASCII characters 0 up to 31 and ASCII character 127), [Whitespace](https://developer.mozilla.org/en-US/docs/glossary/Whitespace), double quotes, commas, semicolons, and backslashes.
   *
   *     **Encoding**: Many implementations perform [percent-encoding](https://developer.mozilla.org/en-US/docs/Glossary/Percent-encoding) on cookie values.
   *     However, this is not required by the RFC specification.
   *     The percent-encoding does help to satisfy the requirements of the characters allowed for `<cookie-value>`.
   *
   *     > [!NOTE]
   *     > Some `<cookie-name>` have a specific semantic:
   *     >
   *     > **`__Secure-` prefix**: Cookies with names starting with `__Secure-` (dash is part of the prefix) must be set with the `secure` flag from a secure page (HTTPS).
   *     >
   *     > **`__Host-` prefix**: Cookies with names starting with `__Host-` are sent only to the host subdomain or domain that set them, and not to any other host.
   *     > They must be set with the `secure` flag, must be from a secure page (HTTPS), must not have a domain specified, and the path must be `/`.
   *
   * - `Domain=<domain-value>`
   *   - : Defines the host to which the cookie will be sent.
   *
   *     Only the current domain can be set as the value, or a domain of a higher order, unless it is a public suffix. Setting the domain will make the cookie available to it, as well as to all its subdomains.
   *
   *     If omitted, this attribute defaults to the host of the current document URL, not including subdomains.
   *
   *     Contrary to earlier specifications, leading dots in domain names (`.example.com`) are ignored.
   *
   *     Multiple host/domain values are _not_ allowed, but if a domain _is_ specified, then subdomains are always included.
   *
   * - `Expires=<date>`
   *   - : Indicates the maximum lifetime of the cookie as an HTTP-date timestamp.
   *     See [Date](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Date) for the required formatting.
   *
   *     If unspecified, the cookie becomes a **session cookie**.
   *     A session finishes when the client shuts down, after which
   *     the session cookie is removed.
   *
   *     > [!WARNING]
   *     > Many web browsers have a _session restore_ feature that will save all tabs and restore them the next time the browser is used. Session cookies will also be restored, as if the browser was never closed.
   *
   *     The `Expires` attribute is set by the server with a value relative to its own internal clock, which may differ from that of the client browser.
   *     Firefox and Chromium-based browsers internally use an expiry (max-age) value that is adjusted to compensate for clock difference, storing and expiring cookies based on the time intended by the server.
   *     The adjustment for clock skew is calculated from the value of the [DATE](https://developer.mozilla.org/en-US/docs/httpheader/DATE) header.
   *     Note that the specification explains how the attribute should be parsed, but does not indicate if/how the value should be corrected by the recipient.
   *
   * - `HttpOnly`
   *   - : Forbids JavaScript from accessing the cookie, for example, through the [Document.cookie](https://developer.mozilla.org/en-US/docs/domxref/Document.cookie) property.
   *     Note that a cookie that has been created with `HttpOnly` will still be sent with JavaScript-initiated requests, for example, when calling [XMLHttpRequest.send()](https://developer.mozilla.org/en-US/docs/domxref/XMLHttpRequest.send()) or [fetch()](https://developer.mozilla.org/en-US/docs/domxref/Window/fetch).
   *     This mitigates attacks against cross-site scripting ([XSS](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting)).
   *
   * - `Max-Age=<number>`
   *   - : Indicates the number of seconds until the cookie expires. A zero or negative number will expire the cookie immediately. If both `Expires` and `Max-Age` are set, `Max-Age` has precedence.
   *
   * - `Partitioned`
   *   - : Indicates that the cookie should be stored using partitioned storage.
   *     Note that if this is set, the [`Secure` directive](#secure) must also be set.
   *     See [Cookies Having Independent Partitioned State (CHIPS)](/en-US/docs/Web/Privacy/Guides/Privacy_sandbox/Partitioned_cookies) for more details.
   *
   * - `Path=<path-value>`
   *   - : Indicates the path that _must_ exist in the requested URL for the browser to send the `Cookie` header.
   *
   *     If omitted, this attribute defaults to the path component of the request URL. For example, if a cookie is set by a request to `https://example.com/docs/Web/HTTP/index.html`, the default path would be `/docs/Web/HTTP/`.
   *
   *     The forward slash (`/`) character is interpreted as a directory separator, and subdirectories are matched as well. For example, for `Path=/docs`,
   *     - the request paths `/docs`, `/docs/`, `/docs/Web/`, and `/docs/Web/HTTP` will all match.
   *     - the request paths `/`, `/docsets`, `/fr/docs` will not match.
   *
   *     > [!NOTE]
   *     > The `path` attribute lets you control what cookies the browser sends based on the different parts of a site.
   *     > It is not intended as a security measure, and [does not protect](/en-US/docs/Web/API/Document/cookie#security) against unauthorized reading of the cookie from a different path.
   *
   * - `SameSite=<samesite-value>`
   *   - : Controls whether or not a cookie is sent with cross-site requests: that is, requests originating from a different [site](https://developer.mozilla.org/en-US/docs/glossary/site), including the scheme, from the site that set the cookie. This provides some protection against certain cross-site attacks, including [cross-site request forgery (CSRF)](https://developer.mozilla.org/en-US/docs/Glossary/CSRF) attacks.
   *
   *     The possible attribute values are:
   *     - `Strict`
   *       - : Send the cookie only for requests originating from the same [site](https://developer.mozilla.org/en-US/docs/glossary/site) that set the cookie.
   *
   *     - `Lax`
   *       - : Send the cookie only for requests originating from the same [site](https://developer.mozilla.org/en-US/docs/glossary/site) that set the cookie, and for cross-site requests that meet both of the following criteria:
   *         - The request is a top-level navigation: this essentially means that the request causes the URL shown in the browser's address bar to change.
   *           - This would exclude, for example, requests made using the [fetch()](https://developer.mozilla.org/en-US/docs/domxref/Window.fetch()) API, or requests for subresources from [img](https://developer.mozilla.org/en-US/docs/htmlelement/img) or [script](https://developer.mozilla.org/en-US/docs/htmlelement/script) elements, or navigations inside [iframe](https://developer.mozilla.org/en-US/docs/htmlelement/iframe) elements.
   *
   *           - It would include requests made when the user clicks a link in the top-level browsing context from one site to another, or an assignment to [document.location](https://developer.mozilla.org/en-US/docs/domxref/Document.location), or a [form](https://developer.mozilla.org/en-US/docs/htmlelement/form) submission.
   *
   *         - The request uses a [safe](https://developer.mozilla.org/en-US/docs/glossary/Safe/HTTP) method: in particular, this excludes [POST](https://developer.mozilla.org/en-US/docs/httpmethod/POST), [PUT](https://developer.mozilla.org/en-US/docs/httpmethod/PUT), and [DELETE](https://developer.mozilla.org/en-US/docs/httpmethod/DELETE).
   *
   *         Some browsers use `Lax` as the default value if `SameSite` is not specified: see [Browser compatibility](#browser_compatibility) for details.
   *
   *         > [!NOTE]
   *         > When `Lax` is applied as a default, a more permissive version is used. In this more permissive version, cookies are also included in [POST](https://developer.mozilla.org/en-US/docs/httpmethod/POST) requests, as long as they were set no more than two minutes before the request was made.
   *
   *     - `None`
   *       - : Send the cookie with both cross-site and same-site requests.
   *         The `Secure` attribute must also be set when using this value.
   *
   * - `Secure`
   *   - : Indicates that the cookie is sent to the server only when a request is made with the `https:` scheme (except on localhost), and therefore, is more resistant to [man-in-the-middle](/en-US/docs/Glossary/MitM) attacks.
   *
   *     > [!NOTE]
   *     > Do not assume that `Secure` prevents all access to sensitive information in cookies (session keys, login details, etc.).
   *     > Cookies with this attribute can still be read/modified either with access to the client's hard disk or from JavaScript if the `HttpOnly` cookie attribute is not set.
   *     >
   *     > Insecure sites (`http:`) cannot set cookies with the `Secure` attribute. The `https:` requirements are ignored when the `Secure` attribute is set by localhost.
   *
   * ## Examples
   *
   * ### Session cookie
   *
   * Session cookies are removed when the client shuts down. Cookies are session cookies if they do not specify the `Expires` or `Max-Age` attribute.
   *
   * ```http
   * Set-Cookie: sessionId=38afes7a8
   * ```
   *
   * ### Permanent cookie
   *
   * Permanent cookies are removed at a specific date (`Expires`) or after a specific length of time (`Max-Age`) and not when the client is closed.
   *
   * ```http
   * Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT
   * ```
   *
   * ```http
   * Set-Cookie: id=a3fWa; Max-Age=2592000
   * ```
   *
   * ### Invalid domains
   *
   * A cookie for a domain that does not include the server that set it [should be rejected by the user agent](https://datatracker.ietf.org/doc/html/rfc6265#section-4.1.2.3).
   *
   * The following cookie will be rejected if set by a server hosted on `original-company.com`:
   *
   * ```http
   * Set-Cookie: qwerty=219ffwef9w0f; Domain=some-company.co.uk
   * ```
   *
   * A cookie for a subdomain of the serving domain will be rejected.
   *
   * The following cookie will be rejected if set by a server hosted on `example.com`:
   *
   * ```http
   * Set-Cookie: sessionId=e8bb43229de9; Domain=foo.example.com
   * ```
   *
   * ### Cookie prefixes
   *
   * Cookie names prefixed with `__Secure-` or `__Host-` can be used only if they are set with the `secure` attribute from a secure (HTTPS) origin.
   *
   * In addition, cookies with the `__Host-` prefix must have a path of `/` (meaning any path at the host) and must not have a `Domain` attribute.
   *
   * > [!WARNING]
   * > For clients that don't implement cookie prefixes, you cannot count on these additional assurances, and prefixed cookies will always be accepted.
   *
   * ```http
   * // Both accepted when from a secure origin (HTTPS)
   * Set-Cookie: __Secure-ID=123; Secure; Domain=example.com
   * Set-Cookie: __Host-ID=123; Secure; Path=/
   *
   * // Rejected due to missing Secure attribute
   * Set-Cookie: __Secure-id=1
   *
   * // Rejected due to the missing Path=/ attribute
   * Set-Cookie: __Host-id=1; Secure
   *
   * // Rejected due to setting a Domain
   * Set-Cookie: __Host-id=1; Secure; Path=/; Domain=example.com
   * ```
   *
   * ### Partitioned cookie
   *
   * ```http
   * Set-Cookie: __Host-example=34d8g; SameSite=None; Secure; Path=/; Partitioned;
   * ```
   *
   * > [!NOTE]
   * > Partitioned cookies must be set with `Secure`. In addition, it is recommended to use the `__Host` prefix when setting partitioned cookies to make them bound to the hostname and not the registrable domain.
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [HTTP cookies](/en-US/docs/Web/HTTP/Guides/Cookies)
   * - [Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cookie)
   * - [Document.cookie](https://developer.mozilla.org/en-US/docs/domxref/Document.cookie)
   * - [Samesite cookies explained](https://web.dev/articles/samesite-cookies-explained) (web.dev blog)
   */
  'Set-Cookie' = 'Set-Cookie',

  /**
   * The HTTP **`Set-Login`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) is sent by a federated identity provider (IdP) to set its login status, and indicates whether any users are logged into the IdP on the current browser or not.
   * This is stored by the browser and used by the [FedCM API](/en-US/docs/Web/API/FedCM_API) to reduce the number of requests it makes to the IdP as the browser doesn't need to request accounts when there are no users logged in to the IdP.
   * It also mitigates [potential timing attacks](https://github.com/w3c-fedid/FedCM/issues/447).
   *
   * The header may be set on any response resulting from a top-level navigation or a same-origin subresource request on the IdP's origin site.
   * Any interaction with the IdP site may result in this header being set, and the login status being stored by the browser.
   *
   * See [Update login status using the Login Status API](/en-US/docs/Web/API/FedCM_API/IDP_integration#update_login_status_using_the_login_status_api) for more information about FedCM login status.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Set-Login: <status>
   * ```
   *
   * ## Directives
   *
   * - `<status>`
   *   - : A string representing the login status to set for the IdP. Possible values are:
   *     - `logged-in`: The IdP has at least one user account signed in.
   *     - `logged-out`: All IdP user accounts are currently signed out.
   *
   *     > [!NOTE]
   *     > Browsers ignore this header if it contains any other value.
   *
   * ## Examples
   *
   * ```http
   * Set-Login: logged-in
   *
   * Set-Login: logged-out
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Federated Credential Management (FedCM) API](/en-US/docs/Web/API/FedCM_API)
   */
  'Set-Login' = 'Set-Login',

  /**
   * The HTTP **`SourceMap`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) provides the location of a [source map](https://developer.mozilla.org/en-US/docs/Glossary/source_map) for the resource.
   *
   * The HTTP `SourceMap` header has precedence over a source annotation (`sourceMappingURL=path-to-map.js.map`), and if both are present, the header URL is used to resolve the source map file.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * SourceMap: <url>
   * X-SourceMap: <url> (deprecated)
   * ```
   *
   * ### Directives
   *
   * - `<url>`
   *   - : A relative (to the request URL) or absolute URL pointing to a source map file.
   *
   * ## Examples
   *
   * ### Linking to a source map using the `SourceMap` header
   *
   * The following response contains an absolute path in the `SourceMap` header.
   *
   * ```http
   * HTTP/1.1 200 OK
   * Content-Type: text/javascript
   * SourceMap: /path/to/file.js.map
   *
   * <optimized-javascript>
   * ```
   *
   * Developer tools use the source map to reconstruct the original source from the optimized JavaScript returned in the response, allowing developers to debug the original code rather than the format that has been optimized for sending.
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Source map](https://developer.mozilla.org/en-US/docs/Glossary/Source_map)
   * - [Firefox Developer Tools: using a source map](https://firefox-source-docs.mozilla.org/devtools-user/debugger/how_to/use_a_source_map/index.html)
   * - [What are source maps?](https://web.dev/articles/source-maps) on web.dev (2023)
   */
  'SourceMap' = 'SourceMap',

  /**
   * The HTTP **`Speculation-Rules`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) provides one or more URLs pointing to text resources containing speculation rule JSON definitions. When the response is an HTML document, these rules will be added to the document's speculation rule set. See the [Speculation Rules API](/en-US/docs/Web/API/Speculation_Rules_API) for more information.
   *
   * The resource file containing the speculation rules JSON can have any valid name and extension, but it will be requested with a [`destination`](/en-US/docs/Web/API/Request/destination) type of [`speculationrules`](/en-US/docs/Web/API/Request/destination#speculationrules), and must be served with an `application/speculationrules+json` MIME type.
   *
   * > [!NOTE]
   * > This mechanism provides an alternative to specifying the JSON definition inside an inline [`
   *
   * ## Syntax
   *
   * ```http
   * Speculation-Rules: <url-list>
   * ```
   *
   * ## Directives
   *
   * - `<url-list>`
   *   - : A comma-separated list of URLs pointing to text resources containing speculation rule JSON definitions. The JSON contained in the text files must follow the same rules as that contained inside inline `<script type="speculationrules">` elements. See [Speculation rules JSON representation](/en-US/docs/Web/HTML/Reference/Elements/script/type/speculationrules#speculation_rules_json_representation) for the syntax reference.
   *
   * ## Examples
   *
   * ### Speculation-Rules field with a single file
   *
   * The following response contains one file reference:
   *
   * ```http
   * Speculation-Rules: "/rules/prefetch.json"
   * ```
   *
   * ### Speculation-Rules field with multiple files
   *
   * The following response contains multiple file reference as a comma-separated list:
   *
   * ```http
   * Speculation-Rules: "/rules/prefetch.json","/rules/prerender.json"
   * ```
   *
   * > [!NOTE]
   * > The URL values must be contained in quotes.
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Speculation Rules API](/en-US/docs/Web/API/Speculation_Rules_API)
   * - [`<script type="speculationrules">`](/en-US/docs/Web/HTML/Reference/Elements/script/type/speculationrules)
   */
  'Speculation-Rules' = 'Speculation-Rules',

  /**
   * The HTTP **`Strict-Transport-Security`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) (often abbreviated as [HSTS](https://developer.mozilla.org/en-US/docs/Glossary/HSTS)) informs browsers that the [host](https://developer.mozilla.org/en-US/docs/Glossary/host) should only be accessed using HTTPS, and that any future attempts to access it using HTTP should automatically be upgraded to HTTPS.
   * Additionally, on future connections to the host, the browser will not allow the user to bypass secure connection errors, such as an invalid certificate.
   * HSTS identifies a host by its domain name only.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Strict-Transport-Security: max-age=<expire-time>
   * Strict-Transport-Security: max-age=<expire-time>; includeSubDomains
   * Strict-Transport-Security: max-age=<expire-time>; includeSubDomains; preload
   * ```
   *
   * ## Directives
   *
   * - `max-age=<expire-time>`
   *   - : The time, in seconds, that the browser should remember that a host is only to be accessed using HTTPS.
   * - `includeSubDomains`
   *   - : If this directive is specified, the HSTS policy applies to all subdomains of the host's domain as well.
   * - `preload`
   *   - : See [Preloading Strict Transport Security](#preloading_strict_transport_security) for details. When using `preload`, the `max-age` directive must be at least `31536000` (1 year), and the `includeSubDomains` directive must be present.
   *
   * ## Description
   *
   * The `Strict-Transport-Security` header informs the browser that all connections to the host must use HTTPS.
   * Although it is a response header, it does not affect how the browser handles the current response, but rather
   * how it makes future requests.
   *
   * When an HTTPS response includes the `Strict-Transport-Security` header, the browser adds the host's domain name
   * to its persistent list of HSTS hosts.
   * If the domain name is already in the list, the expiration time and `includeSubDomains` directive are updated.
   * The host is identified only by its domain name. An IP address cannot be an HSTS host.
   * HSTS applies to all ports of the host, regardless of what port was used for the request.
   *
   * Before loading an `http` URL, the browser checks the domain name against its HSTS hosts list.
   * If the domain name is a case insensitive match for an HSTS host or is a subdomain of one that specified `includeSubDomains`,
   * then the browser replaces the URL scheme with `https`.
   * If the URL specifies port 80, the browser changes it to 443.
   * Any other explicit port number remains unchanged, and the browser connects to that port using HTTPS.
   *
   * If a TLS warning or error, such as an invalid certificate, occurs when connecting to an HSTS host,
   * the browser does not offer the user a way to proceed or "click through" the error message, which would compromise
   * the intention of strict security.
   *
   * > [!NOTE]
   * > The host must send the `Strict-Transport-Security` header over HTTPS only, not insecure HTTP.
   * > Browsers ignore the header if sent over HTTP to prevent a [manipulator-in-the-middle (MITM)](/en-US/docs/Web/Security/Attacks/MITM)
   * > from altering the header to expire prematurely or adding it for a host that doesn't support HTTPS.
   *
   * ### Expiration
   *
   * Every time the browser receives a `Strict-Transport-Security` header, it updates the host's HSTS expiration time by
   * adding `max-age` to the current time.
   * Using a fixed value for `max-age` can prevent HSTS from expiring, as each subsequent response will push the expiration farther into the future.
   *
   * If the `Strict-Transport-Security` header is missing in a response from a host that previously sent one, the previous header remains in effect until its expiration time.
   *
   * To disable HSTS, set `max-age=0`.
   * This only takes effect once the browser makes a secure request and receives the response header.
   * By design, you cannot disable HSTS over insecure HTTP.
   *
   * ### Subdomains
   *
   * The `includeSubDomains` directive instructs the browser to apply a domain's HSTS policy to its subdomains as well.
   * An HSTS policy for `secure.example.com` with `includeSubDomains` also applies to `login.secure.example.com`
   * and `admin.login.secure.example.com`. But it does not apply to `example.com` or `insecure.example.com`.
   *
   * Each subdomain host should include `Strict-Transport-Security` headers in its responses even if the
   * superdomain uses `includeSubDomains`, because a browser may contact a subdomain host before the superdomain.
   * For example, if `example.com` includes the HSTS header with `includeSubDomains`, but all existing links
   * go directly to `www.example.com`, the browser will never see `example.com`'s HSTS header.
   * Therefore, `www.example.com` also should send HSTS headers.
   *
   * The browser stores the HSTS policy for each domain and subdomain independently, regardless of the `includeSubDomains` directive.
   * If both `example.com` and `login.example.com` send HSTS headers, the browser stores two separate HSTS policies,
   * and they can expire independently. If `example.com` used `includeSubDomains`, then `login.example.com` remains covered
   * if either one of the policies expires.
   *
   * If `max-age=0`, `includeSubDomains` has no effect, since the domain that specified `includeSubDomains` is
   * immediately deleted from the HSTS hosts list; this does not delete separate HSTS policies of each subdomain.
   *
   * ### Insecure HTTP requests
   *
   * If the host accepts insecure HTTP requests, it should respond with a permanent redirect (such as status code [301](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/301))
   * having an `https` URL in the [Location](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Location) header.
   * The redirect must not include the `Strict-Transport-Security` header since the request used insecure HTTP
   * but the header must be sent via HTTPS only.
   * After the browser follows the redirect and makes a new request using HTTPS, the response
   * should include the `Strict-Transport-Security` header to ensure that future attempts to load an `http` URL
   * will use HTTPS immediately, without requiring a redirect.
   *
   * One weakness of HSTS is that it does not take effect until the browser has made at least one secure connection to the host
   * and received the `Strict-Transport-Security` header.
   * If the browser loads an insecure `http` URL prior to knowing that the host is an HSTS host, the initial request is
   * vulnerable to network attacks.
   * [Preloading](#preloading_strict_transport_security) mitigates this problem.
   *
   * ### Strict Transport Security example scenario
   *
   * 1. At home, the user visits `http://example.com/` for the first time.
   * 2. Since the URL scheme is `http` and the browser does not have it in its HSTS hosts list, the connection uses insecure HTTP.
   * 3. The server responds with a `301 Moved Permanently` redirect to `https://example.com/`.
   * 4. The browser makes a new request, this time using HTTPS.
   * 5. The response, made via HTTPS, includes the header:
   *
   *    ```http
   *    Strict-Transport-Security: max-age=31536000; includeSubDomains
   *    ```
   *
   *    The browser remembers `example.com` as an HSTS host, and that it specified `includeSubDomains`.
   *
   * 6. A few weeks later, the user is at the airport and decides to use the free Wi-Fi. But unknowingly, they connect to a rogue access point running on an attacker's laptop.
   * 7. The user opens `http://login.example.com/`. Because the browser remembers `example.com` as an HSTS host and the `includeSubDomains` directive was used, the browser uses HTTPS.
   * 8. The attacker intercepts the request with a fake HTTPS server, but does not have a valid certificate for the domain.
   * 9. The browser displays an invalid certificate error, and does not allow the user to bypass it, thus preventing them from giving their password to the attacker.
   *
   * ### Preloading Strict Transport Security
   *
   * Google maintains [an HSTS preload service](https://hstspreload.org/).
   * By following the guidelines and successfully submitting your domain, you can ensure that browsers will connect to your domain only via secure connections.
   * While the service is hosted by Google, all browsers are using this preload list.
   * However, it is not part of the HSTS specification and should not be treated as official.
   *
   * - Information regarding the HSTS preload list in Chrome: https://www.chromium.org/hsts/
   * - Consultation of the Firefox HSTS preload list: [nsSTSPreloadList.inc](https://searchfox.org/mozilla-central/source/security/manager/ssl/nsSTSPreloadList.inc)
   *
   * ## Examples
   *
   * ### Using Strict-Transport-Security
   *
   * All present and future subdomains will be HTTPS for a `max-age` of 1 year.
   * This blocks access to pages or subdomains that can only be served over HTTP.
   *
   * ```http
   * Strict-Transport-Security: max-age=31536000; includeSubDomains
   * ```
   *
   * Although a `max-age` of 1 year is acceptable for a domain, two years is the recommended value as explained on https://hstspreload.org.
   *
   * In the following example, `max-age` is set to 2 years, and is suffixed with `preload`, which is necessary for inclusion in all major web browsers' HSTS preload lists, like Chromium, Edge, and Firefox.
   *
   * ```http
   * Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Features restricted to secure contexts](/en-US/docs/Web/Security/Secure_Contexts/features_restricted_to_secure_contexts)
   * - [HTTP Strict Transport Security has landed!](https://blog.sidstamm.com/2010/08/http-strict-transport-security-has.html) on blog.sidstamm.com (2010)
   * - [HTTP Strict Transport Security (force HTTPS)](https://hacks.mozilla.org/2010/08/firefox-4-http-strict-transport-security-force-https/) on hacks.mozilla.org (2010)
   * - [HTTP Strict Transport Security](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html) cheatsheet on owasp.org
   * - [HTTP Strict Transport Security](https://en.wikipedia.org/wiki/HTTP_Strict_Transport_Security) on Wikipedia
   * - [HSTS preload service](https://hstspreload.org/)
   */
  'Strict-Transport-Security' = 'Strict-Transport-Security',

  /**
   * The HTTP **`Supports-Loading-Mode`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) allows a response to opt-in to being loaded in a novel, higher-risk context that it would otherwise fail to be loaded in.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Supports-Loading-Mode: <client-hint-headers>
   * ```
   *
   * ## Directives
   *
   * The `Supports-Loading-Mode` header value is a list of one or more tokens, which can include the following values:
   *
   * - `credentialed-prerender`
   *   - : Indicates that a destination origin opts in to loading documents via cross-origin, same-site [prerendering](/en-US/docs/Web/API/Speculation_Rules_API#using_prerendering).
   * - `fenced-frame`
   *   - : The response can loaded inside a [fenced frame](/en-US/docs/Web/API/Fenced_frame_API). Without this explicit opt-in, all navigations inside of a fenced frame will fail.
   *
   * ## Examples
   *
   * ```http
   * Supports-Loading-Mode: fenced-frame
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Fenced Frame API](/en-US/docs/Web/API/Fenced_frame_API)
   * - [Speculation Rules API](/en-US/docs/Web/API/Speculation_Rules_API)
   * - [Speculative loading](/en-US/docs/Web/Performance/Guides/Speculative_loading)
   * - [Prerender pages in Chrome for instant page navigations](https://developer.chrome.com/docs/web-platform/prerender-pages) on developer.chrome.com
   */
  'Supports-Loading-Mode' = 'Supports-Loading-Mode',

  /**
   * The HTTP **`TE`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) specifies the transfer encodings the user agent is willing to accept.
   * The transfer encodings are for message compression and chunking of data during transmission.
   *
   * Transfer encodings are applied at the protocol layer, so an application consuming responses receives the body as if no encoding was applied.
   *
   * > [!NOTE]
   * > In [HTTP/2](https://httpwg.org/specs/rfc9113.html#ConnectionSpecific) and [HTTP/3](https://httpwg.org/specs/rfc9114.html#header-formatting), the `TE` header field is only accepted if the `trailers` value is set.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * TE: compress
   * TE: deflate
   * TE: gzip
   * TE: trailers
   * ```
   *
   * Multiple directives in a comma-separated list with [quality values](https://developer.mozilla.org/en-US/docs/glossary/quality_values) as weights:
   *
   * ```http
   * TE: trailers, deflate;q=0.5
   * ```
   *
   * ## Directives
   *
   * - `compress`
   *   - : A format using the [Lempel-Ziv-Welch](https://en.wikipedia.org/wiki/LZW) (LZW) algorithm is accepted as a transfer coding name.
   * - `deflate`
   *   - : Using the [zlib](https://en.wikipedia.org/wiki/Zlib) structure is accepted as a transfer coding name.
   * - `gzip`
   *   - : A format using the [Lempel-Ziv coding](https://en.wikipedia.org/wiki/LZ77_and_LZ78#LZ77) (LZ77), with a 32-bit CRC is accepted as a transfer coding name.
   * - `trailers`
   *   - : Indicates that the client will not discard trailer fields in a [chunked transfer coding](/en-US/docs/Web/HTTP/Reference/Headers/Transfer-Encoding#chunked).
   * - `q`
   *   - : When multiple transfer codings are acceptable, the `q` parameter ([quality values](https://developer.mozilla.org/en-US/docs/glossary/quality_values)) syntax orders codings by preference.
   *
   * Note that `chunked` is always supported by HTTP/1.1 recipients, so you don't need to specify it using the `TE` header.
   * See the [Transfer-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Transfer-Encoding) header for more details.
   *
   * ## Examples
   *
   * ### Using the TE header with quality values
   *
   * In the following request, the client indicates a preference for `gzip`-encoded responses with `deflate` as a second preference using a `q` value:
   *
   * ```http
   * GET /resource HTTP/1.1
   * Host: example.com
   * TE: gzip; q=1.0, deflate; q=0.8
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Transfer-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Transfer-Encoding)
   * - [Content-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding)
   * - [Trailer](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Trailer)
   * - [Chunked transfer encoding](https://en.wikipedia.org/wiki/Chunked_transfer_encoding)
   */
  'TE' = 'TE',

  /**
   * The HTTP **`Timing-Allow-Origin`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) specifies origins that are allowed to see values of attributes retrieved via features of the [Resource Timing API](/en-US/docs/Web/API/Performance_API/Resource_timing), which would otherwise be reported as zero due to cross-origin restrictions.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Timing-Allow-Origin: *
   * Timing-Allow-Origin: <origin>, …, <originN>
   * ```
   *
   * ## Directives
   *
   * - `*` (wildcard)
   *   - : Any origin may see timing resources.
   * - `<origin>`
   *   - : Specifies a URI that may see the timing resources. You can specify multiple origins, separated by commas.
   *
   * ## Examples
   *
   * ### Using Timing-Allow-Origin
   *
   * To allow any resource to see timing resources:
   *
   * ```http
   * Timing-Allow-Origin: *
   * ```
   *
   * To allow `https://developer.mozilla.org` to see timing resources, you can specify:
   *
   * ```http
   * Timing-Allow-Origin: https://developer.mozilla.org
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Resource Timing API](/en-US/docs/Web/API/Performance_API/Resource_timing)
   * - [Server-Timing](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing) header
   * - [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) header
   */
  'Timing-Allow-Origin' = 'Timing-Allow-Origin',

  /**
   * > [!NOTE]
   * > The DNT (Do Not Track) specification has been discontinued. See [Navigator.doNotTrack](https://developer.mozilla.org/en-US/docs/domxref/Navigator.doNotTrack) for more information.
   * > An alternative is [Global Privacy Control](https://globalprivacycontrol.org/), which is communicated to servers using the [Sec-GPC](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-GPC) header, and accessible to clients from [navigator.globalPrivacyControl](https://developer.mozilla.org/en-US/docs/domxref/navigator.globalPrivacyControl).
   *
   * The HTTP **`Tk`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) indicates the tracking status that applied to the corresponding request.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Tk: !  (under construction)
   * Tk: ?  (dynamic)
   * Tk: G  (gateway or multiple parties)
   * Tk: N  (not tracking)
   * Tk: T  (tracking)
   * Tk: C  (tracking with consent)
   * Tk: P  (potential consent)
   * Tk: D  (disregarding DNT)
   * Tk: U  (updated)
   * ```
   *
   * ### Directives
   *
   * - `!`
   *   - : Under construction. The origin server is currently testing its communication of
   *     tracking status.
   * - `?`
   *   - : Dynamic. The origin server needs more information to determine tracking status.
   * - `G`
   *   - : Gateway or multiple parties. The server is acting as a gateway to an exchange
   *     involving multiple parties.
   * - `N`
   *   - : Not tracking.
   * - `T`
   *   - : Tracking.
   * - `C`
   *   - : Tracking with consent. The origin server believes it has received prior consent for
   *     tracking this user, user agent, or device.
   * - `P`
   *   - : Potential consent. The origin server does not know, in real-time, whether it has
   *     received prior consent for tracking this user, user agent, or device, but promises not
   *     to use or share any `DNT:1` data until such consent has been determined,
   *     and further promises to delete or permanently de-identify within 48 hours any
   *     `DNT:1` data received for which such consent has not been received.
   * - `D`
   *   - : Disregarding DNT. The origin server is unable or unwilling to respect a tracking
   *     preference received from the requesting user agent.
   * - `U`
   *   - : Updated. The request resulted in a potential change to the tracking status
   *     applicable to this user, user agent, or device.
   *
   * ## Examples
   *
   * A `Tk` header for a resource that claims not to be tracking would look like:
   *
   * ```http
   * Tk: N
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [DNT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/DNT) header
   * - [Navigator.doNotTrack](https://developer.mozilla.org/en-US/docs/domxref/Navigator.doNotTrack)
   * - [Do Not Track on Wikipedia](https://en.wikipedia.org/wiki/Do_Not_Track)
   * - [What Does the "Track" in "Do Not Track" Mean? – EFF](https://www.eff.org/deeplinks/2011/02/what-does-track-do-not-track-mean)
   * - [DNT on Electronic Frontier Foundation](https://www.eff.org/issues/do-not-track)
   * - [GPC - Global Privacy Control](https://globalprivacycontrol.org/)
   *   - [Enabling GPC in Firefox](https://support.mozilla.org/en-US/kb/global-privacy-control?as=u&utm_source=inproduct)
   */
  'Tk' = 'Tk',

  /**
   * The HTTP **Trailer** [request](https://developer.mozilla.org/en-US/docs/glossary/request_header) and [response header](https://developer.mozilla.org/en-US/docs/glossary/response_header) allows the sender to include additional fields at the end of chunked messages in order to supply metadata that might be dynamically generated while the message body is sent.
   *
   * > [!NOTE]
   * > The [TE](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/TE) request header needs to be set to `trailers` to allow trailer fields.
   *
   * > [!WARNING]
   * > Developers cannot access HTTP trailers via the Fetch API or XHR.
   * > Additionally, browsers ignore HTTP trailers, with the exception of [Server-Timing](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing).
   * > See [Browser compatibility](#browser_compatibility) for more information.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Trailer: header-names
   * ```
   *
   * ## Directives
   *
   * - `header-names`
   *   - : HTTP header fields which will be present in the trailer part of chunked messages.
   *     The following header names are **disallowed**:
   *     - [Content-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding), [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type), [Content-Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Range), and `Trailer`
   *     - Authentication headers (e.g., [Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization) or [Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie))
   *     - Message framing headers (e.g., [Transfer-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Transfer-Encoding) and [Content-Length](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Length))
   *     - Routing headers (e.g., [Host](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Host))
   *     - Request modifiers (e.g., controls and conditionals, like [Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control), [Max-Forwards](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Max-Forwards), or [TE](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/TE))
   *
   * ## Examples
   *
   * ### Server-Timing as HTTP trailer
   *
   * Some browsers support showing server timing data in developer tools when the [Server-Timing](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing) header is sent as a trailer.
   * In the following response, the `Trailer` header is used to indicate that a `Server-Timing` header will follow the response body.
   * A metric `custom-metric` with a duration of `123.4` milliseconds is sent:
   *
   * ```http
   * HTTP/1.1 200 OK
   * Transfer-Encoding: chunked
   * Trailer: Server-Timing
   *
   * --- response body ---
   * Server-Timing: custom-metric;dur=123.4
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Server-Timing](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing)
   * - [Transfer-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Transfer-Encoding)
   * - [TE](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/TE)
   * - [Chunked transfer encoding](https://en.wikipedia.org/wiki/Chunked_transfer_encoding)
   */
  'Trailer' = 'Trailer',

  /**
   * The HTTP **`Transfer-Encoding`** [request](https://developer.mozilla.org/en-US/docs/glossary/request_header) and [response header](https://developer.mozilla.org/en-US/docs/glossary/response_header) specifies the form of encoding used to transfer messages between nodes on the network.
   *
   * `Transfer-Encoding` is a [hop-by-hop header](/en-US/docs/Web/HTTP/Reference/Headers#hop-by-hop_headers), that is applied to a message between two nodes, not to a resource itself.
   * Each segment of a multi-node connection can use different `Transfer-Encoding` values.
   * If you want to compress data over the whole connection, use the end-to-end [Content-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding) header instead.
   *
   * In practice this header is rarely used, and in those cases it is almost always used with `chunked`.
   *
   * That said, the specification indicates that when present in a message it indicates the compression used on the message in that hop, and/or whether the message has been chunked.
   * For example, `Transfer-Encoding: gzip, chunked` indicates that the content has been compressed using the gzip coding and then chunked using the chunked coding while forming the message body.
   *
   * The header is optional in responses to a [HEAD](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/HEAD) request as these messages have no body and, therefore, no transfer encoding.
   * When present it indicates the value that would have applied to the corresponding response to a [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) message, if that `GET` request did not include a preferred `Transfer-Encoding`.
   *
   * > [!WARNING]
   * > HTTP/2 disallows all uses of the `Transfer-Encoding` header.
   * > HTTP/2 and later provide more efficient mechanisms for data streaming than chunked transfer.
   * > Usage of the header in HTTP/2 may likely result in a specific `protocol error`.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Transfer-Encoding: chunked
   * Transfer-Encoding: compress
   * Transfer-Encoding: deflate
   * Transfer-Encoding: gzip
   *
   * // Several values can be listed, separated by a comma
   * Transfer-Encoding: gzip, chunked
   * ```
   *
   * ## Directives
   *
   * - `chunked`
   *   - : Data is sent in a series of chunks.
   *     Content can be sent in streams of unknown size to be transferred as a sequence of length-delimited buffers, so the sender can keep a connection open, and let the recipient know when it has received the entire message.
   *     The [Content-Length](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Length) header must be omitted, and at the beginning of each chunk, a string of hex digits indicate the size of the chunk-data in octets, followed by `\r\n` and then the chunk itself, followed by another `\r\n`.
   *     The terminating chunk is a zero-length chunk.
   * - `compress`
   *   - : A format using the [Lempel-Ziv-Welch](https://en.wikipedia.org/wiki/LZW) (LZW) algorithm.
   *     The value name was taken from the UNIX _compress_ program, which implemented this algorithm.
   *     Like the compress program, which has disappeared from most UNIX distributions, this content-encoding is used by almost no browsers today, partly because of a patent issue (which expired in 2003).
   * - `deflate`
   *   - : Using the [zlib](https://en.wikipedia.org/wiki/Zlib) structure (defined in [RFC 1950](https://datatracker.ietf.org/doc/html/rfc1950)), with the [_deflate_](https://en.wikipedia.org/wiki/DEFLATE) compression algorithm (defined in [RFC 1951](https://datatracker.ietf.org/doc/html/rfc1952)).
   * - `gzip`
   *   - : A format using the [Lempel-Ziv coding](https://en.wikipedia.org/wiki/LZ77_and_LZ78#LZ77) (LZ77), with a 32-bit CRC.
   *     This is originally the format of the UNIX _gzip_ program.
   *     The HTTP/1.1 standard also recommends that the servers supporting this content-encoding should recognize `x-gzip` as an alias, for compatibility purposes.
   *
   * ## Examples
   *
   * ### Response with chunked encoding
   *
   * Chunked encoding is useful when larger amounts of data are sent to the client and the total size of the response may not be known until the request has been fully processed.
   * For example, when generating a large HTML table resulting from a database query or when transmitting large images.
   * A chunked response looks like this:
   *
   * ```http
   * HTTP/1.1 200 OK
   * Content-Type: text/plain
   * Transfer-Encoding: chunked
   *
   * 7\r\n
   * Mozilla\r\n
   * 11\r\n
   * Developer Network\r\n
   * 0\r\n
   * \r\n
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Accept-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding)
   * - [Content-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding)
   * - [Content-Length](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Length)
   * - [Chunked transfer encoding](https://en.wikipedia.org/wiki/Chunked_transfer_encoding)
   */
  'Transfer-Encoding' = 'Transfer-Encoding',

  /**
   * The HTTP **`Upgrade-Insecure-Requests`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) sends a signal to the server indicating the client's preference for an encrypted and authenticated response, and that the client can successfully handle the [upgrade-insecure-requests](https://developer.mozilla.org/en-US/docs/CSP/upgrade-insecure-requests) [CSP](/en-US/docs/Web/HTTP/Guides/CSP) directive.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Upgrade-Insecure-Requests: <boolean>
   * ```
   *
   * ## Directives
   *
   * - `<boolean>`
   *   - : `1` indicates 'true' and is the only valid value for this field.
   *
   * ## Examples
   *
   * ### Using Upgrade-Insecure-Requests
   *
   * A client's request signals to the server that it supports the upgrade mechanisms of [upgrade-insecure-requests](https://developer.mozilla.org/en-US/docs/CSP/upgrade-insecure-requests):
   *
   * ```http
   * GET / HTTP/1.1
   * Host: example.com
   * Upgrade-Insecure-Requests: 1
   * ```
   *
   * The server can now redirect to a secure version of the site. A [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) header can be used so that the site isn't served by caches to clients that don't support the upgrade mechanism.
   *
   * ```http
   * Location: https://example.com/
   * Vary: Upgrade-Insecure-Requests
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy)
   * - CSP [upgrade-insecure-requests](https://developer.mozilla.org/en-US/docs/CSP/upgrade-insecure-requests) directive
   * - [HTTP Caching: Vary](/en-US/docs/Web/HTTP/Guides/Caching#vary) and [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) header
   */
  'Upgrade-Insecure-Requests' = 'Upgrade-Insecure-Requests',

  /**
   * The HTTP `Upgrade` [request](https://developer.mozilla.org/en-US/docs/glossary/request_header) and [response header](https://developer.mozilla.org/en-US/docs/glossary/response_header) can be used to upgrade an already-established client/server connection to a different protocol (over the same transport protocol).
   * For example, it can be used by a client to upgrade a connection from HTTP/1.1 to HTTP/2, or an HTTP(S) connection to a WebSocket connection.
   *
   * > [!WARNING]
   * > HTTP/2 explicitly disallows the use of this mechanism and header; it is specific to HTTP/1.1.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Upgrade: <protocol>[/<protocol_version>]
   * Upgrade: <protocol>[/<protocol_version>], …, <protocolN>[/<protocol_versionN>]
   * ```
   *
   * ## Directives
   *
   * - `<protocol>`
   *   - : Protocols are listed, comma-separated, in order of descending preference.
   * - `<protocol_version>`
   *   - : An optional protocol version may be provided prefixed with a `/` forward slash.
   *
   * ## Description
   *
   * The `Upgrade` header field may be used by clients to invite a server to switch to one (or more) of the listed protocols, in descending preference order.
   * For example, the client might send a `GET` request as shown, listing the preferred protocols to switch to (in this case `example/1` and `foo/2`):
   *
   * ```http
   * GET /index.html HTTP/1.1
   * Host: www.example.com
   * Connection: upgrade
   * Upgrade: example/1, foo/2
   * ```
   *
   * > [!NOTE]
   * > The [Connection](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Connection) header with type `upgrade` must _always_ be sent with the `Upgrade` header.
   *
   * The server can ignore the request, for any reason, in which case it should respond as though the `Upgrade` header had not been sent (for example, with a ).
   * If the server will upgrade the connection, it must:
   *
   * 1. Send back a  response status with an `Upgrade` header that specifies the protocol(s) being switched to. For example:
   *
   *    ```http
   *    HTTP/1.1 101 Switching Protocols
   *    Upgrade: foo/2
   *    Connection: Upgrade
   *    ```
   *
   * 2. Send a response to the original request _using the new protocol_ (the server may only switch to a protocol with which it can complete the original request).
   *
   * A server may also send the header as part of a [426](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/426) `Upgrade Required` response, to indicate that the server won't perform the request using the current protocol, but might do so if the protocol is changed. The client can then request a protocol change using the process above.
   *
   * More detail and examples are provided in the topic [Protocol upgrade mechanism](/en-US/docs/Web/HTTP/Guides/Protocol_upgrade_mechanism).
   *
   * ## Examples
   *
   * ### Upgrade header with multiple protocols
   *
   * The following request lists multiple protocols in descending preference:
   *
   * ```http
   * Connection: upgrade
   * Upgrade: HTTP/2.0, SHTTP/1.3, IRC/6.9, RTA/x11
   * ```
   *
   * ### Upgrading to WebSocket
   *
   * This is a common combination of headers to use to begin upgrading a HTTP connection to WebSockets.
   * See [Upgrading to a WebSocket connection](/en-US/docs/Web/HTTP/Guides/Protocol_upgrade_mechanism#upgrading_to_a_websocket_connection) for more information.
   *
   * ```http
   * Connection: Upgrade
   * Upgrade: websocket
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Protocol upgrade mechanism](/en-US/docs/Web/HTTP/Guides/Protocol_upgrade_mechanism)
   * -
   * -
   * - [Connection](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Connection)
   */
  'Upgrade' = 'Upgrade',

  /**
   * The HTTP **`Use-As-Dictionary`** response header lists the matching criteria that the [Compression Dictionary Transport](https://developer.mozilla.org/en-US/docs/glossary/Compression_Dictionary_Transport) dictionary can be used for, for future requests.
   *
   * See the [Compression Dictionary Transport guide](/en-US/docs/Web/HTTP/Guides/Compression_dictionary_transport) for more information.
   *
   * ## Syntax
   *
   * ```http
   * Use-As-Dictionary: match="<url-pattern>"
   * Use-As-Dictionary: match-dest=("<destination1>" "<destination2>", …)
   * Use-As-Dictionary: id="<string-identifier>"
   * Use-As-Dictionary: type="raw"
   *
   * // Multiple, in any order
   * Content-Encoding: match="<url-pattern>", match-dest=("<destination1>")
   * ```
   *
   * ## Directives
   *
   * - `match`
   *   - : A string value containing a [URL Pattern](/en-US/docs/Web/API/URL_Pattern_API): only resources whose URLs match this pattern may use this resource as a dictionary. Regular expression capturing groups are not allowed, so [URLPattern.hasRegExpGroups](https://developer.mozilla.org/en-US/docs/domxref/URLPattern.hasRegExpGroups) must be `false`.
   * - `match-dest`
   *   - : A space-separated list of strings, with each string in quotes and the whole value enclosed in parentheses, that provides a list of [Fetch request destinations](/en-US/docs/Web/API/Request/destination) that requests must match if they are to use this dictionary.
   * - `id`
   *   - : A string value that specifies a server identifier for the dictionary. This ID value will then be added in the [Dictionary-ID](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Dictionary-ID) request header when the browser requests a resource which can use this dictionary.
   * - `type`
   *   - : A string value that describes the file format of the supplied dictionary. Currently only `raw` is supported (which is the default) so this is more for future compatibility.
   *
   * ## Examples
   *
   * ### Path prefix
   *
   * ```http
   * Use-As-Dictionary: match="/product/*"
   * ```
   *
   * This says the dictionary is only to be used for URLs starting with `/product/`.
   *
   * ### Versioned directories
   *
   * ```http
   * Use-As-Dictionary: match="/app/* /main.js"
   * ```
   *
   * This uses a wildcard to match multiple versions of a file.
   *
   * ### Destinations
   *
   * ```http
   * Use-As-Dictionary: match="/product/*", match-dest=("document")
   * ```
   *
   * This uses `match-dest` to ensure the dictionary is only used for `document` requests so `<script src="/product/js/app.js">` resource requests for example would not match.
   *
   * ```http
   * Use-As-Dictionary: match="/product/*", match-dest=("document" "frame")
   * ```
   *
   * This would allow the dictionary to match both top-level documents and iframes.
   *
   * ### Id
   *
   * ```http
   * Use-As-Dictionary: match="/product/*", id="dictionary-12345"
   * ```
   *
   * When `Use-As-Dictionary` includes an `id` directive, as in this example, the `id` value will be included in the [Dictionary-ID](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Dictionary-ID) request header for resources that can use this dictionary. The resource request will also include the SHA-256 hash of the dictionary surrounded by colons in the [Available-Dictionary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Available-Dictionary) header:
   *
   * ```http
   * Accept-Encoding: gzip, br, zstd, dcb, dcz
   * Available-Dictionary: :pZGm1Av0IEBKARczz7exkNYsZb8LzaMrV7J32a2fFG4=:
   * Dictionary-ID: "dictionary-12345"
   * ```
   *
   * The server must still check the hash from the `Available-Dictionary` header — the `Dictionary-ID` is additional information for the server to identify the dictionary but does not replace the need for the `Available-Dictionary` header.
   *
   * ### Type
   *
   * ```http
   * Use-As-Dictionary: match="/product/*", type="raw"
   * ```
   *
   * Currently, only `raw` is supported (which is the default) so this is more for future compatibility.
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Compression Dictionary Transport guide](/en-US/docs/Web/HTTP/Guides/Compression_dictionary_transport)
   * - [Available-Dictionary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Available-Dictionary)
   * - [Dictionary-ID](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Dictionary-ID)
   */
  'Use-As-Dictionary' = 'Use-As-Dictionary',

  /**
   * The HTTP **User-Agent** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) is a characteristic string that lets servers and network peers identify the application, operating system, vendor, and/or version of the requesting [user agent](https://developer.mozilla.org/en-US/docs/Glossary/user_agent).
   *
   * > [!WARNING]
   * > See [Browser detection using the user agent](/en-US/docs/Web/HTTP/Guides/Browser_detection_using_the_user_agent) for reasons why serving different content to different browsers is usually a bad idea.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * User-Agent: <product> / <product-version> <comment>
   * ```
   *
   * Common format for web browsers:
   *
   * ```http
   * User-Agent: Mozilla/5.0 (<system-information>) <platform> (<platform-details>) <extensions>
   * ```
   *
   * ### Directives
   *
   * - `<product>`
   *   - : A product identifier — its name or development codename.
   * - `<product-version>`
   *   - : Version number of the product.
   * - `<comment>`
   *   - : Zero or more comments containing more details. For example, sub-product information.
   *
   * ## Firefox UA string
   *
   * For more on Firefox- and Gecko-based user agent strings, see the [Firefox user agent string reference](/en-US/docs/Web/HTTP/Reference/Headers/User-Agent/Firefox). The UA string of Firefox is broken down into 4 components:
   *
   * ```plain
   * Mozilla/5.0 (platform; rv:gecko-version) Gecko/gecko-trail Firefox/firefox-version
   * ```
   *
   * 1. `Mozilla/5.0` is the general token that says that the browser is Mozilla-compatible. For historical reasons, almost every browser today sends it.
   * 2. **_platform_** describes the native platform that the browser is running on (Windows, Mac, Linux, Android, etc.) and if it is a mobile phone. [Firefox OS](https://developer.mozilla.org/en-US/docs/Glossary/Firefox_OS) phones say `Mobile` — the web is the platform. Note that **_platform_** can consist of multiple `;`-separated tokens. See below for further details and examples.
   * 3. **rv:_gecko-version_** indicates the release version of Gecko (such as "_17.0_"). In recent browsers, **_gecko-version_** is the same as **_firefox-version_**.
   * 4. **_Gecko/gecko-trail_** indicates that the browser is based on Gecko. (On the desktop, **_gecko-trail_** is always the fixed string `20100101`.)
   * 5. **_Firefox/firefox-version_** indicates that the browser is Firefox and provides the version (such as "_17.0_").
   *
   * ### Examples
   *
   * ```plain
   * Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0
   * Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:42.0) Gecko/20100101 Firefox/42.0
   * ```
   *
   * ## Chrome UA string
   *
   * The Chrome (or Chromium/Blink-based engines) user agent string is similar to Firefox's. For compatibility, it adds strings like `KHTML, like Gecko` and `Safari`.
   *
   * ### Examples
   *
   * ```plain
   * Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36
   * ```
   *
   * ## Opera UA string
   *
   * The Opera browser is also based on the Blink engine, which is why it almost looks the same as the Chrome UA string, but adds `"OPR/<version>"`.
   *
   * ### Examples
   *
   * ```plain
   * Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36 OPR/38.0.2220.41
   * ```
   *
   * Older, Presto-based Opera releases used:
   *
   * ```plain
   * Opera/9.80 (Macintosh; Intel Mac OS X; U; en) Presto/2.2.15 Version/10.00
   * Opera/9.60 (Windows NT 6.0; U; en) Presto/2.1.1
   * ```
   *
   * ## Microsoft Edge UA string
   *
   * The Edge browser is also based on the Blink engine. It adds `"Edg/<version>"`.
   *
   * ### Examples
   *
   * ```plain
   * Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59
   * ```
   *
   * ## Safari UA string
   *
   * In this example, the user agent string is mobile Safari's version. It contains the word `"Mobile"`.
   *
   * ### Examples
   *
   * ```plain
   * Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1
   * ```
   *
   * ## Crawler and bot UA strings
   *
   * ### Examples
   *
   * ```plain
   * Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)
   * ```
   *
   * ```plain
   * Mozilla/5.0 (compatible; YandexAccessibilityBot/3.0; +http://yandex.com/bots)
   * ```
   *
   * ## Library and net tool UA strings
   *
   * ### Examples
   *
   * ```plain
   * curl/7.64.1
   * ```
   *
   * ```plain
   * PostmanRuntime/7.26.5
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [User-Agent detection, history and checklist](https://hacks.mozilla.org/2013/09/user-agent-detection-history-and-checklist/)
   * - [Firefox user agent string reference](/en-US/docs/Web/HTTP/Reference/Headers/User-Agent/Firefox)
   * - [Browser detection using the user agent](/en-US/docs/Web/HTTP/Guides/Browser_detection_using_the_user_agent)
   * - [Client hints](/en-US/docs/Web/HTTP/Guides/Client_hints)
   */
  'User-Agent' = 'User-Agent',

  /**
   * The HTTP **`Vary`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) describes the parts of the request message (aside from the method and URL) that influenced the content of the response it occurs in.
   * Including a `Vary` header ensures that responses are separately cached based on the headers listed in the `Vary` field.
   * Most often, this is used to create a cache key when [content negotiation](/en-US/docs/Web/HTTP/Guides/Content_negotiation) is in use.
   *
   * The same `Vary` header value should be used on all responses for a given URL, including [304](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/304) `Not Modified` responses and the "default" response.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Vary: *
   * Vary: <header-name>, …, <header-nameN>
   * ```
   *
   * ## Directives
   *
   * - `*` (wildcard)
   *   - : Factors other than request headers influenced the generation of this response. Implies that the response is uncacheable.
   * - `<header-name>`
   *   - : A request header name that could have influenced the generation of this response.
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Content negotiation](/en-US/docs/Web/HTTP/Guides/Content_negotiation)
   * - [HTTP caching: Vary](/en-US/docs/Web/HTTP/Guides/Caching#vary)
   * - [Understanding The Vary Header](https://www.smashingmagazine.com/2017/11/understanding-vary-header/) on smashingmagazine.com (2017)
   * - [Best Practices for Using the Vary Header](https://www.fastly.com/blog/best-practices-using-vary-header) on fastly.com
   */
  'Vary' = 'Vary',

  /**
   * The **`Via`** [request](https://developer.mozilla.org/en-US/docs/glossary/request_header) and [response header](https://developer.mozilla.org/en-US/docs/glossary/response_header) is added by [proxies](https://developer.mozilla.org/en-US/docs/Glossary/Proxy_server), both forward and reverse.
   * It is used for tracking message forwards, avoiding request loops, and identifying the protocol capabilities of senders along the request/response chain.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Via: [<protocol-name>/]<protocol-version> <host>[:<port>]
   * Via: [<protocol-name>/]<protocol-version> <pseudonym>
   * ```
   *
   * ## Directives
   *
   * - `<protocol-name>`
   *   - : The name of the protocol used, such as "HTTP".
   * - `<protocol-version>`
   *   - : The version of the protocol used, such as "1.1".
   * - `<host>`
   *   - : Public proxy URL and optional `<port>`.
   *     If a host is not provided, then a `<pseudonym>` must be used.
   * - `<pseudonym>`
   *   - : Name/alias of an internal proxy.
   *     If a pseudonym is not provided, then a `<host>` must be used.
   *
   * ## Examples
   *
   * ```http
   * Via: 1.1 vegur
   * Via: HTTP/1.1 GWA
   * Via: 1.0 fred, 1.1 p.example.net
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [X-Forwarded-For](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For)
   * - [Heroku's proxy library Vegur](https://github.com/heroku/vegur)
   */
  'Via' = 'Via',

  /**
   * > [!WARNING]
   * > The `Viewport-Width` header was removed from the client hints specification in [draft-ietf-httpbis-client-hints-07](https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-client-hints-07).
   * > The proposed replacement is [`Sec-CH-Viewport-Width`](https://wicg.github.io/responsive-image-client-hints/#sec-ch-viewport-width) (Responsive Image Client Hints).
   *
   * The HTTP **`Viewport-Width`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) is a [device client hint](/en-US/docs/Web/HTTP/Guides/Client_hints) which provides the client's layout viewport width in [CSS pixels](https://developer.mozilla.org/en-US/docs/Glossary/CSS_pixel).
   * The value is rounded up to the smallest following integer (i.e., ceiling value).
   *
   * The hint can be used with other screen-specific hints to deliver images optimized for a specific screen size, or to omit resources that are not needed for a particular screen width.
   * If the `Viewport-Width` header appears more than once in a message the last occurrence is used.
   *
   * A server has to opt-in to receive the `Viewport-Width` header from the client, by sending the [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH) response header.
   * Servers that opt-in will typically also specify it in the [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) header which informs caches that the server may send different responses based on the header value in a request.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Viewport-Width: <number>
   * ```
   *
   * ## Directives
   *
   * - `<number>`
   *   - : The width of the user's viewport in [CSS pixels](https://developer.mozilla.org/en-US/docs/Glossary/CSS_pixel), rounded up to the nearest integer.
   *
   * ## Examples
   *
   * ### Using Viewport-Width
   *
   * A server must first opt-in to receive the `Viewport-Width` header by sending the response header [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH) containing the directive `Viewport-Width`.
   *
   * ```http
   * Accept-CH: Viewport-Width
   * ```
   *
   * In subsequent requests, the client might send `Viewport-Width` header:
   *
   * ```http
   * Viewport-Width: 320
   * ```
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Improving user privacy and developer experience with User-Agent Client Hints](https://developer.chrome.com/docs/privacy-security/user-agent-client-hints) (developer.chrome.com)
   * - [Content-DPR](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-DPR), [Device-Memory](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Device-Memory), [DPR](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/DPR), [Width](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Width) device client hints
   * - [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH)
   * - [HTTP Caching: Vary](/en-US/docs/Web/HTTP/Guides/Caching#vary) and [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) header
   */
  'Viewport-Width' = 'Viewport-Width',

  /**
   * The HTTP **`Want-Content-Digest`** [request](https://developer.mozilla.org/en-US/docs/glossary/request_header) and [response header](https://developer.mozilla.org/en-US/docs/glossary/response_header) indicates a preference for the recipient to send a [Content-Digest](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Digest) integrity header in messages associated with the request URI and representation metadata.
   *
   * The header includes hashing algorithm preferences that the recipient can use in subsequent messages.
   * The preferences only serve as a hint, and the recipient may ignore the algorithm choices, or the integrity headers entirely.
   *
   * Some implementations may send unsolicited `Content-Digest` headers without requiring a `Want-Content-Digest` header in a previous message.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Want-Content-Digest: <algorithm>=<preference>
   * Want-Content-Digest: <algorithm>=<preference>, …, <algorithmN>=<preferenceN>
   * ```
   *
   * ## Directives
   *
   * - `<algorithm>`
   *   - : The requested algorithm to create a digest of the message content.
   *     Only two registered digest algorithms are considered secure: `sha-512` and `sha-256`.
   *     The insecure (legacy) registered digest algorithms are: `md5`, `sha` (SHA-1), `unixsum`, `unixcksum`, `adler` (ADLER32) and `crc32c`.
   * - `<preference>`
   *   - : An integer from 0 to 9 where `0` means "not acceptable", and the values `1` to `9` convey ascending, relative, weighted preference.
   *     In contrast to earlier drafts of the specifications, the weighting is _not_ declared via `q` [quality values](/en-US/docs/Glossary/Quality_values).
   *
   * ## Examples
   *
   * ### Using Want-Content-Digest in requests
   *
   * The following message asks the recipient to send a `Content-Digest` header using SHA-512 algorithm:
   *
   * ```http
   * Want-Content-Digest: sha-512=9
   * ```
   *
   * ### Want-Content-Digest with multiple values
   *
   * The following header contains three algorithms, and indicates that SHA-256 is the preferred digest algorithm that the recipient should use, followed by SHA-512, and MD5:
   *
   * ```http
   * Want-Content-Digest: md5=1, sha-512=2, sha-256=3
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * This header has no specification-defined browser integration ("browser compatibility" does not apply).
   * Developers can set and get HTTP headers using `fetch()` in order to provide application-specific implementation behavior.
   *
   * ## See also
   *
   * - [Content-Digest](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Digest), [Repr-Digest](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Repr-Digest), [Want-Repr-Digest](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Want-Repr-Digest) digest headers
   * - [Digital Signatures for APIs](https://developer.ebay.com/develop/guides/digital-signatures-for-apis) SDK guide uses `Content-Digest`s for digital signatures in HTTP calls (developer.ebay.com)
   */
  'Want-Content-Digest' = 'Want-Content-Digest',

  /**
   * The HTTP **`Want-Repr-Digest`** [request](https://developer.mozilla.org/en-US/docs/glossary/request_header) and [response header](https://developer.mozilla.org/en-US/docs/glossary/response_header) indicates a preference for the recipient to send a [Repr-Digest](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Repr-Digest) integrity header in messages associated with the request URI and representation metadata.
   *
   * The header includes hashing algorithm preferences that the recipient can use in subsequent messages.
   * The preferences only serve as a hint, and the recipient may ignore the algorithm choices, or the integrity headers entirely.
   *
   * Some implementations may send unsolicited `Repr-Digest` headers without requiring a `Want-Repr-Digest` header in a previous message.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Want-Repr-Digest: <algorithm>=<preference>
   * Want-Repr-Digest: <algorithm>=<preference>, …, <algorithmN>=<preferenceN>
   * ```
   *
   * ## Directives
   *
   * - `<algorithm>`
   *   - : The requested algorithm to create a digest of the representation.
   *     Only two registered digest algorithms are considered secure: `sha-512` and `sha-256`.
   *     The insecure (legacy) registered digest algorithms are: `md5`, `sha` (SHA-1), `unixsum`, `unixcksum`, `adler` (ADLER32) and `crc32c`.
   * - `<preference>`
   *   - : An integer from 0 to 9 where `0` means "not acceptable", and the values `1` to `9` convey ascending, relative, weighted preference.
   *     In contrast to earlier drafts of the specifications, the weighting is _not_ declared via `q` [quality values](/en-US/docs/Glossary/Quality_values).
   *
   * ## Examples
   *
   * ```http
   * Want-Repr-Digest: sha-512=8, sha-256=6, adler=0, sha=1
   * Want-Repr-Digest: sha-512=10, sha-256=1, md5=0
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * This header has no specification-defined browser integration ("browser compatibility" does not apply).
   * Developers can set and get HTTP headers using `fetch()` in order to provide application-specific implementation behavior.
   *
   * ## See also
   *
   * - [Content-Digest](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Digest), [Repr-Digest](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Repr-Digest), [Want-Content-Digest](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Want-Content-Digest) digest headers
   * - [Digital Signatures for APIs](https://developer.ebay.com/develop/guides/digital-signatures-for-apis) SDK guide uses `Content-Digest`s for digital signatures in HTTP calls (developer.ebay.com)
   */
  'Want-Repr-Digest' = 'Want-Repr-Digest',

  /**
   * > [!NOTE]
   * > The header was deprecated because it is not widely generated or surfaced to users (see [RFC9111](https://www.rfc-editor.org/rfc/rfc9111#field.warning)).
   * > Some of the information can be inferred from other headers such as [Age](https://developer.mozilla.org/en-US/docs/httpheader/Age).
   *
   * The HTTP **`Warning`** [request](https://developer.mozilla.org/en-US/docs/glossary/request_header) and [response header](https://developer.mozilla.org/en-US/docs/glossary/response_header) contains information about possible problems with the status of the message.
   * More than one `Warning` header may appear in a response.
   *
   * `Warning` header fields can, in general, be applied to any message.
   * However, some warn-codes are specific to caches and can only be applied to response messages.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Warning: <warn-code> <warn-agent> <warn-text> [<warn-date>]
   * ```
   *
   * ## Directives
   *
   * - `<warn-code>`
   *   - : A three-digit warning number. The first digit indicates whether the `Warning` is required to be deleted from a stored response after validation.
   *     - `1xx` warn-codes describe the freshness or validation status of the response and will be deleted by a cache after successful validation.
   *     - `2xx` warn-codes describe some aspect of the representation that is not rectified by a validation and will not be deleted by a cache after validation unless a full response is sent.
   *
   * - `<warn-agent>`
   *   - : The name or pseudonym of the server or software adding the `Warning` header (might be "-" when the agent is unknown).
   * - `<warn-text>`
   *   - : An advisory text describing the error.
   * - `<warn-date>`
   *   - : A date. If more than one `Warning` header is sent, include a date that matches the [Date](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Date) header.
   *
   * ## Warning codes
   *
   * The [HTTP Warn Codes registry at iana.org](https://www.iana.org/assignments/http-warn-codes/http-warn-codes.xhtml) defines the namespace for warning codes.
   *
   * | Code | Text                             | Description                                                                                                                                                                                      |
   * | ---- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
   * | 110  | Response is Stale                | The response provided by a cache is stale (the expiration time set for the response has passed).                                                                                                 |
   * | 111  | Revalidation Failed              | An attempt to validate the stale response failed due to an inability to reach the server.                                                                                                        |
   * | 112  | Disconnected Operation           | The cache is intentionally disconnected from the rest of the network.                                                                                                                            |
   * | 113  | Heuristic Expiration             | A cache heuristically chose a [freshness lifetime](/en-US/docs/Web/HTTP/Guides/Caching#fresh_and_stale_based_on_age) greater than 24 hours and the age of the response is greater than 24 hours. |
   * | 199  | Miscellaneous Warning            | Arbitrary information that should be presented to a user or logged.                                                                                                                              |
   * | 214  | Transformation Applied           | Added by a proxy if it applies any transformation to the representation, such as changing the content-coding, media-type or the like.                                                            |
   * | 299  | Miscellaneous Persistent Warning | Arbitrary information that should be presented to a user or logged. This warn-code is similar to the warn-code 199 and additionally indicates a persistent warning.                              |
   *
   * ## Examples
   *
   * ```http
   * Warning: 110 anderson/1.3.37 "Response is stale"
   *
   * Date: Wed, 21 Oct 2015 07:28:00 GMT
   * Warning: 112 - "cache down" "Wed, 21 Oct 2015 07:28:00 GMT"
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Date](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Date)
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   */
  'Warning' = 'Warning',

  /**
   * > [!WARNING]
   * > The `Width` header was removed from the client hints specification in [draft-ietf-httpbis-client-hints-07](https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-client-hints-07). The proposed replacement is [`Sec-CH-Width`](https://wicg.github.io/responsive-image-client-hints/#sec-ch-width) (Responsive Image Client Hints).
   *
   * The HTTP **`Width`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) is a [device client hint](/en-US/docs/Web/HTTP/Guides/Client_hints#device_client_hints) which indicates the desired resource width in physical pixels — the intrinsic size of an image. The provided pixel value is a number rounded to the smallest following integer (i.e., ceiling value).
   *
   * The hint allows the client to request a resource that is optimal for both the screen and the layout: taking into account both the density-corrected width of the screen and the image's extrinsic size within the layout.
   *
   * If the desired resource width is not known at the time of the request or the resource does not have a display width, the `Width` header field can be omitted.
   * If the `Width` header appears more than once in a message the last occurrence is used.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * Width: <number>
   * ```
   *
   * ## Directives
   *
   * - `<number>`
   *   - : The width of the resource in physical pixels, rounded up to the nearest integer.
   *
   * ## Examples
   *
   * The server first needs to opt in to receive the `Width` header by sending the response headers [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH) containing `Width`.
   *
   * ```http
   * Accept-CH: Width
   * ```
   *
   * Then on subsequent requests the client might send `Width` header back:
   *
   * ```http
   * Width: 1920
   * ```
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Content-DPR](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-DPR), [Device-Memory](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Device-Memory), [DPR](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/DPR), [Viewport-Width](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Viewport-Width) device client hints
   * - [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH)
   * - [HTTP Caching: Vary](/en-US/docs/Web/HTTP/Guides/Caching#vary) and [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) header
   * - [Improving user privacy and developer experience with User-Agent Client Hints](https://developer.chrome.com/docs/privacy-security/user-agent-client-hints) (developer.chrome.com)
   */
  'Width' = 'Width',

  /**
   * The HTTP **`WWW-Authenticate`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) advertises the [HTTP authentication](/en-US/docs/Web/HTTP/Guides/Authentication) methods (or [challenges](https://developer.mozilla.org/en-US/docs/Glossary/challenge)) that might be used to gain access to a specific resource.
   *
   * This header is part of the [General HTTP authentication framework](/en-US/docs/Web/HTTP/Guides/Authentication#the_general_http_authentication_framework), which can be used with a number of [authentication schemes](/en-US/docs/Web/HTTP/Guides/Authentication#authentication_schemes).
   * Each challenge identifies a scheme supported by the server and additional parameters that are defined for that scheme type.
   *
   * A server using [HTTP authentication](/en-US/docs/Web/HTTP/Guides/Authentication) will respond with a [401 Unauthorized](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401) response to a request for a protected resource.
   * This response must include at least one `WWW-Authenticate` header and at least one challenge to indicate what authentication schemes can be used to access the resource and any additional data that each particular scheme needs.
   *
   * Multiple challenges are allowed in one `WWW-Authenticate` header, and multiple `WWW-Authenticate` headers are allowed in one response.
   * A server may also include the `WWW-Authenticate` header in other response messages to indicate that supplying credentials might affect the response.
   *
   * After receiving the `WWW-Authenticate` header, a client will typically prompt the user for credentials, and then re-request the resource.
   * This new request uses the [Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization) header to supply the credentials to the server, encoded appropriately for the selected authentication method.
   * The client is expected to select the most secure of the challenges it understands (note that in some cases the "most secure" method is debatable).
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * WWW-Authenticate: <challenge>
   * ```
   *
   * Where a `<challenge>` is comprised of an `<auth-scheme>`, followed by an optional `<token68>` or a comma-separated list of `<auth-params>`:
   *
   * ```plain
   * challenge = <auth-scheme> <auth-param>, …, <auth-paramN>
   * challenge = <auth-scheme> <token68>
   * ```
   *
   * For example:
   *
   * ```http
   * WWW-Authenticate: <auth-scheme>
   * WWW-Authenticate: <auth-scheme> token68
   * WWW-Authenticate: <auth-scheme> auth-param1=param-token1
   * WWW-Authenticate: <auth-scheme> auth-param1=param-token1, …, auth-paramN=param-tokenN
   * ```
   *
   * The presence of a `token68` or authentication parameters depends on the selected `<auth-scheme>`.
   * For example, [Basic authentication](/en-US/docs/Web/HTTP/Guides/Authentication#basic_authentication_scheme) requires a `<realm>`, and allows for optional use of `charset` key, but does not support a `token68`:
   *
   * ```http
   * WWW-Authenticate: Basic realm="Dev", charset="UTF-8"
   * ```
   *
   * Multiple challenges can be sent in a comma-separated list
   *
   * ```http
   * WWW-Authenticate: <challenge>, …, <challengeN>
   * ```
   *
   * Multiple headers can also be sent in a single response:
   *
   * ```http
   * WWW-Authenticate: <challenge>
   * WWW-Authenticate: <challengeN>
   * ```
   *
   * ## Directives
   *
   * - `<auth-scheme>`
   *   - : A case-insensitive token indicating the [Authentication scheme](/en-US/docs/Web/HTTP/Guides/Authentication#authentication_schemes) used.
   *     Some of the more common types are [`Basic`](/en-US/docs/Web/HTTP/Guides/Authentication#basic_authentication_scheme), `Digest`, `Negotiate` and `AWS4-HMAC-SHA256`.
   *     IANA maintains a [list of authentication schemes](https://www.iana.org/assignments/http-authschemes/http-authschemes.xhtml), but there are other schemes offered by host services.
   * - `<auth-param>`
   *   - : An authentication parameter whose format depends on the `<auth-scheme>`.
   *     `<realm>` is described below as it's a common authentication parameter among many auth schemes.
   *     - `<realm>`
   *       - : The string `realm` followed by `=` and a quoted string describing a protected area, for example `realm="staging environment"`.
   *         A realm allows a server to partition the areas it protects (if supported by a scheme that allows such partitioning).
   *         Some clients show this value to the user to inform them about which particular credentials are required — though most browsers stopped doing so to counter phishing.
   *         The only reliably supported character set for this value is `us-ascii`.
   *         If no realm is specified, clients often display a formatted hostname instead.
   * - `<token68>`
   *   - : A token that may be useful for some schemes.
   *     The token allows the 66 unreserved URI characters plus a few others.
   *     It can hold a [base64](https://developer.mozilla.org/en-US/docs/glossary/base64), base64url, base32, or base16 (hex) encoding, with or without padding, but excluding whitespace.
   *     The token68 alternative to auth-param lists is supported for consistency with legacy authentication schemes.
   *
   * Generally, you will need to check the relevant specifications for the authentication parameters needed for each `<auth-scheme>`.
   * The following sections describe token and auth parameters for some common auth schemes.
   *
   * ### Basic authentication directives
   *
   * - `<realm>`
   *   - : A `<realm>` as [described above](#realm).
   *     Note that the realm is mandatory for `Basic` authentication.
   * - `charset="UTF-8"`
   *   - : Tells the client the server's preferred encoding scheme when submitting a username and password.
   *     The only allowed value is the case-insensitive string `UTF-8`.
   *     This does not relate to the encoding of the realm string.
   *
   * ### Digest authentication directives
   *
   * - `<realm>`
   *   - : A `<realm>` as [described above](#realm) indicating which username/password to use.
   *     Minimally should include the host name, but might indicate the users or group that have access.
   * - `domain`
   *   - : A quoted, space-separated list of URI prefixes that define all the locations where the authentication information may be used.
   *     If this key is not specified then the authentication information may be used anywhere on the web root.
   * - `nonce`
   *   - : A server-specified quoted string that the server can use to control the lifetime in which particular credentials will be considered valid.
   *     This must be uniquely generated each time a 401 response is made, and may be regenerated more often (for example, allowing a digest to be used only once).
   *     The specification contains advice on possible algorithms for generating this value.
   *     The nonce value is opaque to the client.
   * - `opaque`
   *   - : A server-specified quoted string that should be returned unchanged in the [Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization).
   *     This is opaque to the client. The server is recommended to include Base64 or hexadecimal data.
   * - `stale`
   *   - : A case-insensitive flag indicating that the previous request from the client was rejected because the `nonce` used is too old (stale).
   *     If this is `true` the request can be retried using the same username/password encrypted using the new `nonce`.
   *     If it is any other value then the username/password are invalid and must be re-requested from the user.
   * - `algorithm`
   *   - : A string indicating the algorithm used to produce a digest.
   *     Valid non-session values are: `MD5` (default if `algorithm` not specified), `SHA-256`, `SHA-512`.
   *     Valid session values are: `MD5-sess`, `SHA-256-sess`, `SHA-512-sess`.
   * - `qop`
   *   - : Quoted string indicating the quality of protection supported by the server. This must be supplied, and unrecognized options must be ignored.
   *     - `"auth"`: Authentication
   *     - `"auth-int"`: Authentication with integrity protection
   * - `charset="UTF-8"`
   *   - : Tells the client the server's preferred encoding scheme when submitting a username and password.
   *     The only allowed value is the case-insensitive string "UTF-8".
   * - `userhash`
   *   - : A server may specify `"true"` to indicate that it supports username hashing (default is `"false"`)
   *
   * ### HTTP Origin-Bound Authentication (HOBA)
   *
   * - `<challenge>`
   *   - : A set of pairs in the format of `<len>:<value>` concatenated together to be given to a client.
   *     The challenge is made of up a nonce, algorithm, origin, realm, key identifier, and the challenge.
   * - `<max-age>`
   *   - : The number of seconds from the time the HTTP response is emitted for which responses to this challenge can be accepted.
   * - `<realm>`
   *   - : As above in the [directives](#directives) section.
   *
   * ## Examples
   *
   * ### Issuing multiple authentication challenges
   *
   * Multiple challenges may be specified in a single response header:
   *
   * ```http
   * HTTP/1.1 401 Unauthorized
   * WWW-Authenticate: challenge1, …, challengeN
   * ```
   *
   * Multiple challenges can be sent in separate `WWW-Authenticate` headers in the same response:
   *
   * ```http
   * HTTP/1.1 401 Unauthorized
   * WWW-Authenticate: challenge1
   * WWW-Authenticate: challengeN
   * ```
   *
   * ### Basic authentication
   *
   * A server that only supports basic authentication might have a `WWW-Authenticate` response header which looks like this:
   *
   * ```http
   * HTTP/1.1 401 Unauthorized
   * WWW-Authenticate: Basic realm="Staging server", charset="UTF-8"
   * ```
   *
   * A user-agent receiving this header would first prompt the user for their username and password, and then re-request the resource with the encoded credentials in the `Authorization` header.
   * The `Authorization` header might look like this:
   *
   * ```http
   * Authorization: Basic YWxhZGRpbjpvcGVuc2VzYW1l
   * ```
   *
   * For `Basic` authentication, the credentials are constructed by first combining the username and the password with a colon (`aladdin:opensesame`), and then by encoding the resulting string in [`base64`](/en-US/docs/Glossary/Base64) (`YWxhZGRpbjpvcGVuc2VzYW1l`).
   *
   * > [!NOTE]
   * > See also [HTTP authentication](/en-US/docs/Web/HTTP/Guides/Authentication) for examples on how to configure Apache or Nginx servers to password protect your site with HTTP basic authentication.
   *
   * ### Digest authentication with SHA-256 and MD5
   *
   * > [!NOTE]
   * > This example is taken from [7616](https://developer.mozilla.org/en-US/docs/RFC/7616) "HTTP Digest Access Authentication" (other examples in the specification show the use of `SHA-512`, `charset`, and `userhash`).
   *
   * The client attempts to access a document at URI `http://www.example.org/dir/index.html` that is protected via digest authentication.
   * The username for this document is "Mufasa" and the password is "Circle of Life" (note the single space between each of the words).
   *
   * The first time the client requests the document, no [Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization) header field is sent.
   * Here the server responds with an HTTP 401 message that includes a challenge for each digest algorithm it supports, in its order of preference (`SHA256` and then `MD5`)
   *
   * ```http
   * HTTP/1.1 401 Unauthorized
   * WWW-Authenticate: Digest
   *     realm="http-auth@example.org",
   *     qop="auth, auth-int",
   *     algorithm=SHA-256,
   *     nonce="7ypf/xlj9XXwfDPEoM4URrv/xwf94BcCAzFZH4GiTo0v",
   *     opaque="FQhe/qaU925kfnzjCev0ciny7QMkPqMAFRtzCUYo5tdS"
   * WWW-Authenticate: Digest
   *     realm="http-auth@example.org",
   *     qop="auth, auth-int",
   *     algorithm=MD5,
   *     nonce="7ypf/xlj9XXwfDPEoM4URrv/xwf94BcCAzFZH4GiTo0v",
   *     opaque="FQhe/qaU925kfnzjCev0ciny7QMkPqMAFRtzCUYo5tdS"
   * ```
   *
   * The client prompts the user for their username and password, and then responds with a new request that encodes the credentials in the [Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization) header field.
   * If the client chose the MD5 digest the [Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization) header field might look as shown below:
   *
   * ```http
   * Authorization: Digest username="Mufasa",
   *     realm="http-auth@example.org",
   *     uri="/dir/index.html",
   *     algorithm=MD5,
   *     nonce="7ypf/xlj9XXwfDPEoM4URrv/xwf94BcCAzFZH4GiTo0v",
   *     nc=00000001,
   *     cnonce="f2/wE4q74E6zIJEtWaHKaf5wv/H5QzzpXusqGemxURZJ",
   *     qop=auth,
   *     response="8ca523f5e9506fed4657c9700eebdbec",
   *     opaque="FQhe/qaU925kfnzjCev0ciny7QMkPqMAFRtzCUYo5tdS"
   * ```
   *
   * If the client chose the SHA-256 digest the [Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization) header field might look as shown below:
   *
   * ```http
   * Authorization: Digest username="Mufasa",
   *     realm="http-auth@example.org",
   *     uri="/dir/index.html",
   *     algorithm=SHA-256,
   *     nonce="7ypf/xlj9XXwfDPEoM4URrv/xwf94BcCAzFZH4GiTo0v",
   *     nc=00000001,
   *     cnonce="f2/wE4q74E6zIJEtWaHKaf5wv/H5QzzpXusqGemxURZJ",
   *     qop=auth,
   *     response="753927fa0e85d155564e2e272a28d1802ca10daf449
   *         6794697cf8db5856cb6c1",
   *     opaque="FQhe/qaU925kfnzjCev0ciny7QMkPqMAFRtzCUYo5tdS"
   * ```
   *
   * ### HOBA Authentication
   *
   * A server that supports HOBA authentication might have a `WWW-Authenticate` response header which looks like this:
   *
   * ```http
   * HTTP/1.1 401 Unauthorized
   * WWW-Authenticate: HOBA max-age="180", challenge="16:MTEyMzEyMzEyMw==1:028:https://www.example.com:8080:3:MTI48:NjgxNDdjOTctNDYxYi00MzEwLWJlOWItNGM3MDcyMzdhYjUz"
   * ```
   *
   * The to-be-signed blob challenge is made from these parts: `www.example.com` using port 8080, the nonce is `1123123123`, the algorithm for signing is RSA-SHA256, the key identifier is `123`, and finally the challenge is `68147c97-461b-4310-be9b-4c707237ab53`.
   *
   * A client would receive this header, extract the challenge, sign it with their private key that corresponds to key identifier 123 in our example using RSA-SHA256, and then send the result in the `Authorization` header as a dot-separated key id, challenge, nonce, and signature.
   *
   * ```http
   * Authorization: 123.16:MTEyMzEyMzEyMw==1:028:https://www.example.com:8080:3:MTI48:NjgxNDdjOTctNDYxYi00MzEwLWJlOWItNGM3MDcyMzdhYjUz.1123123123.<signature-of-challenge>
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [HTTP authentication](/en-US/docs/Web/HTTP/Guides/Authentication)
   * - [Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization)
   * - [Proxy-Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Proxy-Authorization)
   * - [Proxy-Authenticate](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Proxy-Authenticate)
   * - [401](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401), [403](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403), [407](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/407)
   */
  'WWW-Authenticate' = 'WWW-Authenticate',

  /**
   * The HTTP **`X-Content-Type-Options`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) indicates that the [MIME types](/en-US/docs/Web/HTTP/Guides/MIME_types) advertised in the [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) headers should be respected and not changed.
   * The header allows you to avoid [MIME type sniffing](/en-US/docs/Web/HTTP/Guides/MIME_types#mime_sniffing) by specifying that the MIME types are deliberately configured.
   *
   * Site security testers usually expect this header to be set.
   *
   * > [!NOTE]
   * > The `X-Content-Type-Options` header only apply request-blocking [due to `nosniff`](https://fetch.spec.whatwg.org/#ref-for-determine-nosniff) for [request destinations](/en-US/docs/Web/API/Request/destination) of `"script"` and `"style"`.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * X-Content-Type-Options: nosniff
   * ```
   *
   * ## Directives
   *
   * - `nosniff`
   *   - : Blocks a request if the request destination is of type
   *     `style` and the MIME type is not `text/css`,
   *     or of type `script` and the MIME type is not a [JavaScript MIME type](https://html.spec.whatwg.org/multipage/scripting.html#javascript-mime-type).
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type)
   * - The [original definition](https://learn.microsoft.com/en-us/archive/blogs/ie/ie8-security-part-vi-beta-2-update) of X-Content-Type-Options by Microsoft.
   * - Use [HTTP Observatory](/en-US/observatory) to test the security configuration of websites (including this header).
   * - [Mitigating MIME Confusion Attacks in Firefox](https://blog.mozilla.org/security/2016/08/26/mitigating-mime-confusion-attacks-in-firefox/)
   */
  'X-Content-Type-Options' = 'X-Content-Type-Options',

  /**
   * The HTTP **`X-DNS-Prefetch-Control`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) controls DNS prefetching, a feature by which browsers proactively perform domain name resolution on links that the user may choose to follow as well as URLs for items referenced by the document, including images, CSS, JavaScript, and so forth.
   *
   * The intention is that prefetching is performed in the background so that the [DNS](https://developer.mozilla.org/en-US/docs/glossary/DNS) resolution is complete by the time the referenced items are needed by the browser.
   * This reduces latency when the user clicks a link, for example.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * X-DNS-Prefetch-Control: on
   * X-DNS-Prefetch-Control: off
   * ```
   *
   * ### Directives
   *
   * - `on`
   *   - : Enables DNS prefetching. This is what browsers do if they support the feature when this header is not present.
   * - `off`
   *   - : Disables DNS prefetching. This is useful if you don't control the link on the pages or know that you don't want to leak information to these domains.
   *
   * ## Description
   *
   * DNS requests are very small in terms of bandwidth, but latency can be quite high,
   * especially on mobile networks. By speculatively prefetching DNS results, latency can be
   * reduced significantly at certain times, such as when the user clicks the link. In some
   * cases, latency can be reduced by a second.
   *
   * The implementation of this prefetching in some browsers allows domain name resolution
   * to occur in parallel with (instead of in serial with) the fetching of actual page
   * content. By doing this, the high-latency domain name resolution process doesn't cause
   * any delay while fetching content.
   *
   * Page load times – especially on mobile networks – can be measurably improved in this
   * way. If the domain names for images can be resolved in advance of the images being
   * requested, pages that load many images can see an improvement of 5% or more in the time
   * of loading images.
   *
   * ### Configuring prefetching in the browser
   *
   * In general, you don't need to do anything to manage prefetching. However, the user may
   * wish to disable prefetching. On Firefox, this can be done by setting the
   * `network.dns.disablePrefetch` preference to `true`.
   *
   * Also, by default, prefetching of embedded link hostnames is not performed on documents
   * loaded over [HTTPS](https://developer.mozilla.org/en-US/docs/glossary/HTTPS). On Firefox, this can be changed by setting the
   * `network.dns.disablePrefetchFromHTTPS` preference to `false`.
   *
   * ## Examples
   *
   * ### Turning on and off prefetching
   *
   * You can either send the `X-DNS-Prefetch-Control` header server-side, or from
   * individual documents, using the [`http-equiv`](/en-US/docs/Web/HTML/Reference/Elements/meta/http-equiv) attribute on
   * the [meta](https://developer.mozilla.org/en-US/docs/HTMLElement/meta) element, like this:
   *
   * ```html
   * <meta http-equiv="x-dns-prefetch-control" content="off" />
   * ```
   *
   * You can reverse this setting by setting `content` to `"on"`.
   *
   * ### Forcing lookup of specific hostnames
   *
   * You can force the lookup of specific hostnames without providing specific anchors using
   * that hostname by using the [`rel`](/en-US/docs/Web/HTML/Reference/Elements/link#rel) attribute on the
   * [link](https://developer.mozilla.org/en-US/docs/HTMLElement/link) element with a [link type](/en-US/docs/Web/HTML/Reference/Attributes/rel) of `dns-prefetch`:
   *
   * ```html
   * <link rel="dns-prefetch" href="https://www.mozilla.org" />
   * ```
   *
   * In this example, the domain name `www.mozilla.org` will be pre-resolved.
   *
   * Similarly, the link element can be used to resolve hostnames without providing a
   * complete URL, but only, by preceding the hostname with two slashes:
   *
   * ```html
   * <link rel="dns-prefetch" href="//www.mozilla.org" />
   * ```
   *
   * Forced prefetching of hostnames might be useful, for example, on the homepage of a site
   * to force pre-resolution of domain names that are referenced frequently throughout the
   * site even though they are not used on the home page itself. This will improve the
   * overall performance of site even though the performance of the home page may not be
   * affected.
   *
   * ## Specifications
   *
   * Not part of any current specification.
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [DNS Prefetching for Firefox (blog post)](https://bitsup.blogspot.com/2008/11/dns-prefetching-for-firefox.html)
   * - [Google Chrome handles DNS prefetching control](https://www.chromium.org/developers/design-documents/dns-prefetching/)
   */
  'X-DNS-Prefetch-Control' = 'X-DNS-Prefetch-Control',

  /**
   * The HTTP **`X-Forwarded-For`** (XFF) [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) is a de-facto standard header for identifying the originating IP address of a client connecting to a web server through a [proxy server](https://developer.mozilla.org/en-US/docs/Glossary/proxy_server).
   *
   * A standardized version of this header is the HTTP [Forwarded](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Forwarded) header, although it's much less frequently used.
   *
   * > [!WARNING]
   * > Improper use of this header can be a security risk.
   * > For details, see the [Security and privacy concerns](#security_and_privacy_concerns) section.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * X-Forwarded-For: <client>, <proxy>
   * X-Forwarded-For: <client>, <proxy>, …, <proxyN>
   * ```
   *
   * For example, an IPV6 client IP in the first header, an IPV4 client IP in the second header, and an IPV4 client IP and an IPV6 proxy IP in the third example:
   *
   * ```http
   * X-Forwarded-For: 2001:db8:85a3:8d3:1319:8a2e:370:7348
   * X-Forwarded-For: 203.0.113.195
   * X-Forwarded-For: 203.0.113.195, 2001:db8:85a3:8d3:1319:8a2e:370:7348
   * ```
   *
   * ## Directives
   *
   * - `<client>`
   *   - : The client IP address.
   * - `<proxy>`
   *   - : A proxy IP address.
   *     If a request goes through multiple proxies, the IP addresses of each successive proxy are listed.
   *     This means that the rightmost IP address is the IP address of the most recent proxy and the leftmost IP address is the address of the originating client (assuming well-behaved client and proxies).
   *
   * ## Description
   *
   * When a client connects directly to a server, the client's IP address is sent to the server and is often written to server access logs.
   * If a client connection passes through any forward or reverse proxies, the server only sees the final proxy's IP address, which is often of little use.
   * That's especially true if the final proxy is a load balancer which is part of the same deployment as the server.
   * To provide a more useful client IP address to the server, the `X-Forwarded-For` request header is used.
   *
   * For detailed guidance on using `X-Forwarded-For`, see the [Parsing](#parsing) and [Selecting an IP address](#selecting_an_ip_address) sections.
   *
   * ### Security and privacy concerns
   *
   * This header exposes privacy-sensitive information by design, such as the IP address of the client.
   * Therefore, the user's privacy must be kept in mind when using this header.
   *
   * If you know that all proxies in the request chain are trusted (i.e., you control them) and are configured correctly, the parts of the header added by your proxies can be trusted.
   * If any proxy is malicious or misconfigured, any part of the header not added by a trusted proxy may be spoofed or may have an unexpected format or contents.
   * If the server can be directly connected to from the internet — even if it is also behind a trusted reverse proxy — **no part** of the `X-Forwarded-For` IP list can be considered trustworthy or safe for security-related uses.
   *
   * Any security-related use of `X-Forwarded-For` (such as for rate limiting or IP-based access control) _must only_ use IP addresses added by a trusted proxy.
   * Using untrustworthy values can result in rate-limiter avoidance, access-control bypass, memory exhaustion, or other negative security or availability consequences.
   *
   * Leftmost (untrusted) values must only be used for cases where there is no negative impact from using spoofed values.
   *
   * ### Parsing
   *
   * Improper parsing of the `X-Forwarded-For` header may have a negative security impact with consequences as described in the previous section.
   * For this reason, the following points should be considered when parsing the header values.
   *
   * There may be multiple `X-Forwarded-For` headers present in a request.
   * The IP addresses in these headers must be treated as a single list, starting with the first IP address of the first header and continuing to the last IP address of the last header.
   * There are two ways of making this single list:
   *
   * - Join the `X-Forwarded-For` full header values with commas and then split by comma into a list, or
   * - split each `X-Forwarded-For` header by comma into lists and then join the lists.
   *
   * It is insufficient to use only one of multiple `X-Forwarded-For` headers.
   *
   * Some reverse proxies will automatically join multiple `X-Forwarded-For` headers into one, but it is safer not to assume that this is the case.
   *
   * ### Selecting an IP address
   *
   * When selecting an address, the full list of IPs (from all `X-Forwarded-For` headers) must be used.
   *
   * When choosing the `X-Forwarded-For` IP address closest to the client (untrustworthy and _not_ for security-related purposes), the first IP from the leftmost that is _a valid address_ and _not private/internal_ should be selected.
   *
   * > [!NOTE]
   * > We say "a valid address" above because spoofed values may not be actual IP addresses.
   * > Additionally, we say "not internal/private" because clients may have used proxies on their internal network, which may have added addresses from the [private IP space](https://en.wikipedia.org/wiki/Private_network).
   *
   * When choosing the first _trustworthy_ `X-Forwarded-For` client IP address, additional configuration is required.
   * There are two common methods:
   *
   * - Trusted proxy count
   *   - : The count of reverse proxies between the internet and the server is configured.
   *     The `X-Forwarded-For` IP list is searched from the rightmost by that count minus one.
   *     For example, if there is only one reverse proxy, that proxy will add the client's IP address, so the rightmost address should be used.
   *     If there are three reverse proxies, the last two IP addresses will be internal.
   * - Trusted proxy list
   *   - : The IPs or IP ranges of the trusted reverse proxies are configured.
   *     The `X-Forwarded-For` IP list is searched from the rightmost, skipping all addresses that are on the trusted proxy list.
   *     The first non-matching address is the target address.
   *
   * The first trustworthy `X-Forwarded-For` IP address may belong to an untrusted intermediate proxy rather than the actual client, but it is the only IP suitable to identify a client for security purposes.
   *
   * ## Examples
   *
   * ### Client and proxy IPs
   *
   * From the following `X-Forwarded-For` request header, we can infer that the client IP address is `203.0.113.195`, and the request has passed through two proxies.
   * The first proxy has an IPv6 address of `2001:db8:85a3:8d3:1319:8a2e:370:7348` and the last proxy in the request chain has an IPv4 address of `198.51.100.178`:
   *
   * ```http
   * X-Forwarded-For: 203.0.113.195,2001:db8:85a3:8d3:1319:8a2e:370:7348,198.51.100.178
   * ```
   *
   * ## Specifications
   *
   * Not part of any current specification. The standardized version of this header is [Forwarded](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Forwarded).
   *
   * ## See also
   *
   * - [X-Forwarded-Host](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-Host), [X-Forwarded-Proto](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-Proto) headers
   * - [Via](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Via)
   * - [Forwarded](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Forwarded)
   * - [What is X-Forwarded-For and when can you trust it?](https://httptoolkit.com/blog/what-is-x-forwarded-for/) httptoolkit.com (2024)
   */
  'X-Forwarded-For' = 'X-Forwarded-For',

  /**
   * The HTTP **`X-Forwarded-Host`** (XFH) [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) is a de-facto standard header for identifying the original host requested by the client in the [Host](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Host) HTTP request header.
   *
   * Host names and ports of reverse [proxies](https://developer.mozilla.org/en-US/docs/Glossary/Proxy_server) (load balancers, CDNs) may differ from the origin server handling the request, in that case the `X-Forwarded-Host` header is useful to determine which `Host` was originally used.
   *
   * A standardized version of this header is the HTTP [Forwarded](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Forwarded) header, although it's much less frequently used.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * X-Forwarded-Host: <host>
   * ```
   *
   * ## Directives
   *
   * - `<host>`
   *   - : The domain name of the forwarded server.
   *
   * ## Examples
   *
   * ```http
   * X-Forwarded-Host: id42.example-cdn.com
   * ```
   *
   * ## Specifications
   *
   * Not part of any current specification.
   *
   * ## See also
   *
   * - [X-Forwarded-For](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For), [X-Forwarded-Proto](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-Proto) headers
   * - [Host](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Host)
   * - [Forwarded](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Forwarded)
   */
  'X-Forwarded-Host' = 'X-Forwarded-Host',

  /**
   * The HTTP **`X-Forwarded-Proto`** (XFP) [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) is a de-facto standard header for identifying the protocol (HTTP or HTTPS) that a client used to connect to a [proxy](https://developer.mozilla.org/en-US/docs/Glossary/Proxy_server) or load balancer.
   *
   * Server access logs contain the protocol used between the server and the load balancer, but not the protocol used between the client and the load balancer.
   * To determine the protocol used between the client and the load balancer, the `X-Forwarded-Proto` request header can be used.
   *
   * A standardized version of this header is the HTTP [Forwarded](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Forwarded) header, although it's much less frequently used.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * X-Forwarded-Proto: <protocol>
   * ```
   *
   * ## Directives
   *
   * - `<protocol>`
   *   - : The forwarded protocol (`http` or `https`).
   *
   * ## Examples
   *
   * ### X-Forwarded-Proto client protocol
   *
   * The following header indicates that the original request was made over HTTPS before being forwarded by a proxy or load balancer:
   *
   * ```http
   * X-Forwarded-Proto: https
   * ```
   *
   * ### Non-standard forms
   *
   * The following forms may be seen in request headers:
   *
   * ```http
   * # Microsoft
   * Front-End-Https: on
   *
   * X-Forwarded-Protocol: https
   * X-Forwarded-Ssl: on
   * X-Url-Scheme: https
   * ```
   *
   * ## Specifications
   *
   * Not part of any current specification. The standardized version of this header is [Forwarded](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Forwarded).
   *
   * ## See also
   *
   * - [X-Forwarded-Host](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-Host), [X-Forwarded-For](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For) headers
   * - [Forwarded](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Forwarded)
   */
  'X-Forwarded-Proto' = 'X-Forwarded-Proto',

  /**
   * > [!NOTE]
   * > For more comprehensive options than offered by this header, see the [frame-ancestors](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors) directive in a [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) header.
   *
   * The HTTP **`X-Frame-Options`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) can be used to indicate whether a browser should be allowed to render a page in a [frame](https://developer.mozilla.org/en-US/docs/HTMLElement/frame), [iframe](https://developer.mozilla.org/en-US/docs/HTMLElement/iframe), [embed](https://developer.mozilla.org/en-US/docs/HTMLElement/embed) or [object](https://developer.mozilla.org/en-US/docs/HTMLElement/object). Sites can use this to avoid [clickjacking](/en-US/docs/Web/Security/Attacks/Clickjacking) attacks, by ensuring that their content is not embedded into other sites.
   *
   * The added security is provided only if the user accessing the document is using a browser that supports `X-Frame-Options`.
   *
   *
   * ```
   *
   * For more information, see the [Microsoft support article on setting this configuration using the IIS Manager](https://support.microsoft.com/en-US/office/mitigating-framesniffing-with-the-x-frame-options-header-1911411b-b51e-49fd-9441-e8301dcdcd79) user interface.
   *
   * ### Configuring HAProxy
   *
   * To configure HAProxy to send the `X-Frame-Options` header, add this to your front-end, listen, or backend configuration:
   *
   * ```plain
   * rspadd X-Frame-Options:\ SAMEORIGIN
   * ```
   *
   * Alternatively, in newer versions:
   *
   * ```plain
   * http-response set-header X-Frame-Options SAMEORIGIN
   * ```
   *
   * ### Configuring Express
   *
   * To set `X-Frame-Options` to `SAMEORIGIN` using [Helmet](https://helmetjs.github.io/) add the following to your server configuration:
   *
   * ```js
   * import helmet from "helmet";
   *
   * const app = express();
   * app.use(
   *   helmet({
   *     xFrameOptions: { action: "sameorigin" },
   *   }),
   * );
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) directive [frame-ancestors](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors)
   * - [ClickJacking Defenses - IEBlog](https://learn.microsoft.com/en-us/archive/blogs/ie/ie8-security-part-vii-clickjacking-defenses)
   * - [Combating ClickJacking with X-Frame-Options - IEInternals](https://learn.microsoft.com/en-us/archive/blogs/ieinternals/combating-clickjacking-with-x-frame-options)
   */
  'X-Frame-Options' = 'X-Frame-Options',

  /**
   * The HTTP **`X-Permitted-Cross-Domain-Policies`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) defines a meta-policy that controls whether site resources can be accessed cross-origin by a document running in a web client like Adobe Acrobat or Microsoft Silverlight.
   *
   * It can be used in cases where the website needs to declare a cross-domain policy, but cannot write to the root directory of the domain.
   *
   * Usage of this header is less common since Adobe Flash Player and Microsoft Silverlight have been deprecated.
   * Some security testing tools will still check for the presence of a `X-Permitted-Cross-Domain-Policies: none` header because it can mitigate the risk of an overly-permissive policy file added to your site by accident or through malicious actions.
   *
   *
   * ```
   *
   * The `X-Permitted-Cross-Domain-Policies` header can specify a meta-policy for the HTTP response it's included in, or override a meta-policy defined in the master cross-domain policy file, if present.
   * It takes the same values as the file's `permitted-cross-domain-policies` attribute and additionally `none-this-response`.
   *
   * Most commonly, it's used to prevent any access to site resources in cases where the developer does not have access to create a master cross-domain policy file in the site root.
   *
   * ## Examples
   *
   * ### Disallowing cross-domain policy files
   *
   * If you don't need to load application data in clients such as Adobe Flash Player or Adobe Acrobat (or legacy clients), then the header should be configured as `X-Permitted-Cross-Domain-Policies: none`:
   *
   * ```http
   * X-Permitted-Cross-Domain-Policies: none
   * ```
   *
   * ## Specifications
   *
   * Documented in the [Adobe Cross Domain Policy File Specification](https://www.adobe.com/devnet-docs/acrobatetk/tools/AppSec/CrossDomain_PolicyFile_Specification.pdf).
   *
   * ## See also
   *
   * - [Cross-Origin Resource Sharing (CORS)](/en-US/docs/Web/HTTP/Guides/CORS)
   * - [Practical security implementation guides](/en-US/docs/Web/Security/Practical_implementation_guides)
   * - [HTTP Observatory](/en-US/observatory/) header testing tool
   * - [Cross Domain Configuration](https://www.adobe.com/devnet-docs/acrobatetk/tools/AppSec/xdomain.html) on adobe.com
   * - [X-Permitted-Cross-Domain-Policies](https://github.com/OWASP/www-project-secure-headers/blob/master/tab_headers.md#x-permitted-cross-domain-policies) in OWASP Secure Headers Project
   */
  'X-Permitted-Cross-Domain-Policies' = 'X-Permitted-Cross-Domain-Policies',

  /**
   * The HTTP **`X-Powered-By`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) is a non-standard header for identifying the application or framework that generated the response.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * X-Powered-By: <application>
   * ```
   *
   * ## Directives
   *
   * - `<application>`
   *   - : A string describing the server application or framework.
   *
   * ## Examples
   *
   * ### Express X-Powered-By header
   *
   * Express applications will usually include the `X-Powered-By` header in responses with the string `express` as the field value:
   *
   * ```http
   * X-Powered-By: express
   * ```
   *
   * ## Specifications
   *
   * Not part of any current specification.
   *
   * ## See also
   *
   * - [X-Forwarded-Host](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-Host), [X-Forwarded-For](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For), [X-Forwarded-Proto](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-Proto) headers
   * - [Via](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Via)
   * - [Forwarded](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Forwarded)
   */
  'X-Powered-By' = 'X-Powered-By',

  /**
   * The **`X-Robots-Tag`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) defines how [crawlers](https://developer.mozilla.org/en-US/docs/glossary/Crawler) should index URLs.
   * While not part of any specification, it is a de-facto standard method for communicating with search bots, web crawlers, and similar user agents.
   * Search-related crawlers use the rules from the `X-Robots-Tag` header to adjust how to present web pages or other resources in search results.
   *
   * Indexing rules are defined in a `X-Robots-Tag` header or a [`
   *
   * ## Syntax
   *
   * ```http
   * X-Robots-Tag: <indexing-rule>
   * X-Robots-Tag: <indexing-rule>, …, <indexing-ruleN>
   * ```
   *
   * An optional `<bot-name>:` specifies the user agent that the subsequent rules should apply to:
   *
   * ```http
   * X-Robots-Tag: <indexing-rule>, <bot-name>: <indexing-rule>
   * X-Robots-Tag: <bot-name>: <indexing-rule>, …, <indexing-ruleN>
   * ```
   *
   * See [Specifying user agents](#specifying_user_agents) for an example.
   *
   * ## Directives
   *
   * Any of the following indexing rules may be used:
   *
   * - `all`
   *   - : No restrictions for indexing or serving in search results.
   *     This rule is the default value and has no effect if explicitly listed.
   * - `noindex`
   *   - : Do not show this page, media, or resource in search results.
   *     If omitted, the page, media, or resource may be indexed and shown in search results.
   * - `nofollow`
   *   - : Do not follow the links on this page.
   *     If omitted, search engines may use the links on the page to discover those linked pages.
   * - `none`
   *   - : Equivalent to `noindex, nofollow`.
   * - `nosnippet`
   *   - : Do not show a text snippet or video preview in the search results for this page.
   *     A static image thumbnail (if available) may still be visible.
   *     If omitted, search engines may generate a text snippet and video preview based on information found on the page.
   *     To exclude certain sections of your content from appearing in search result snippets, use the [`data-nosnippet` HTML attribute](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag#data-nosnippet-attr).
   * - `indexifembedded`
   *   - : A search engine is allowed to index the content of a page if it's embedded in another page through iframes or similar HTML elements, in spite of a `noindex` rule.
   *     `indexifembedded` only has an effect if it's accompanied by `noindex`.
   * - `max-snippet: <number>`
   *   - : Use a maximum of `<number>` characters as a textual snippet for this search result.
   *     Ignored if no valid `<number>` is specified.
   * - `max-image-preview: <setting>`
   *   - : The maximum size of an image preview for this page in a search results.
   *     If omitted, search engines may show an image preview of the default size.
   *     If you don't want search engines to use larger thumbnail images, specify a `max-image-preview` value of `standard` or `none`. Values include:
   *     - `none`
   *       - : No image preview is to be shown.
   *     - `standard`
   *       - : A default image preview may be shown.
   *     - `large`
   *       - : A larger image preview, up to the width of the viewport, may be shown.
   * - `max-video-preview: <number>`
   *   - : Use a maximum of `<number>` seconds as a video snippet for videos on this page in search results.
   *     If omitted, search engines may show a video snippet in search results, and the search engine decides how long a preview may be.
   *     Ignored if no valid `<number>` is specified.
   *     Special values are as follows:
   *     - `0`
   *       - : At most, a static image may be used, in accordance to the `max-image-preview` setting.
   *     - `-1`
   *       - : No video length limit.
   * - `notranslate`
   *   - : Don't offer translation of this page in search results.
   *     If omitted, search engines may translate the search result title and snippet into the language of the search query.
   * - `noimageindex`
   *   - : Do not index images on this page.
   *     If omitted, images on the page may be indexed and shown in search results.
   * - `unavailable_after: <date/time>`
   *   - : Requests not to show this page in search results after the specified `<date/time>`.
   *     Ignored if no valid `<date/time>` is specified.
   *     A date must be specified in a format such as [822](https://developer.mozilla.org/en-US/docs/RFC/822), [850](https://developer.mozilla.org/en-US/docs/RFC/850), or ISO 8601.
   *
   *     By default there is no expiration date for content.
   *     If omitted, this page may be shown in search results indefinitely.
   *     Crawlers are expected to considerably decrease the crawl rate of the URL after the specified date and time.
   *
   * ## Description
   *
   * Indexing rules via `<meta name="robots">` and `X-Robots-Tag` are discovered when a URL is crawled.
   * Most crawlers support rules in the `X-Robots-Tag` HTTP header that can be used in a `<meta name="robots">` element.
   *
   * In the case of conflicting robot rules within the `X-Robots-Tag` or between the `X-Robots-Tag` HTTP header and the `<meta name="robots">` element, the more restrictive rule applies.
   * For example, if a page has both `max-snippet:50` and `nosnippet` rules, the `nosnippet` rule will apply.
   * Indexing rules won't be discovered or applied if paths are blocked from being crawled by a `robots.txt` file.
   *
   * Some values are mutually exclusive, such as `index` and `noindex`, or `follow` and `nofollow`.
   * In these cases, the crawler's behavior is undefined and may vary.
   *
   * ### Interaction with robots.txt
   *
   * If a resource is blocked from crawling through a `robots.txt` file, then any information about indexing or serving rules specified using `<meta name="robots">` or the `X-Robots-Tag` HTTP header will not be detected and will therefore be ignored.
   *
   * A page that's blocked from crawling may still be indexed if it is referenced from another document (see the [`nofollow`](#nofollow) directive).
   * If you want to remove a page from search indexes, `X-Robots-Tag: noindex` will typically work, but a robot must first revisit the page to detect the `X-Robots-Tag` rule.
   *
   * ## Examples
   *
   * ### Using X-Robots-Tag
   *
   * The following `X-Robots-Tag` header adds `noindex`, asking crawlers not to show this page, media, or resource in search results:
   *
   * ```http
   * HTTP/1.1 200 OK
   * Date: Tue, 03 Dec 2024 17:08:49 GMT
   * X-Robots-Tag: noindex
   * ```
   *
   * ### Multiple headers
   *
   * The following response has two `X-Robots-Tag` headers, each with an indexing rule specified:
   *
   * ```http
   * HTTP/1.1 200 OK
   * Date: Tue, 03 Dec 2024 17:08:49 GMT
   * X-Robots-Tag: noimageindex
   * X-Robots-Tag: unavailable_after: Wed, 03 Dec 2025 13:09:53 GMT
   * ```
   *
   * ### Specifying user agents
   *
   * It's possible to specify which user agent the rules should apply to.
   * The following example contains two `X-Robots-Tag` headers which ask that `googlebot` not follow the links on this page and that a fictional `BadBot` crawler not index the page or follow any links on it, either:
   *
   * ```http
   * HTTP/1.1 200 OK
   * Date: Tue, 03 Dec 2024 17:08:49 GMT
   * X-Robots-Tag: BadBot: noindex, nofollow
   * X-Robots-Tag: googlebot: nofollow
   * ```
   *
   * In the response below, the same indexing rules are defined, but in a single header.
   * Each indexing rule applies to the user agent specified behind it:
   *
   * ```http
   * HTTP/1.1 200 OK
   * Date: Tue, 03 Dec 2024 17:08:49 GMT
   * X-Robots-Tag: BadBot: noindex, nofollow, googlebot: nofollow
   * ```
   *
   * For situations where multiple crawlers are specified along with different rules, the search engine will use the sum of the negative rules.
   * For example:
   *
   * ```http
   * X-Robots-Tag: nofollow
   * X-Robots-Tag: googlebot: noindex
   * ```
   *
   * The page containing these headers will be interpreted as having a `noindex, nofollow` rule when crawled by `googlebot`.
   *
   * ## Specifications
   *
   * Not part of any current specification.
   *
   * ## See also
   *
   * - [robots.txt](https://developer.mozilla.org/en-US/docs/Glossary/robots.txt)
   * - [Search engine](https://developer.mozilla.org/en-US/docs/Glossary/Search_engine)
   * - [`<meta name="robots">`](/en-US/docs/Web/HTML/Reference/Elements/meta/name/robots) HTML element ("robots tag")
   * - [robots.txt configuration](/en-US/docs/Web/Security/Practical_implementation_guides/Robots_txt) security guide
   * - [Robots Exclusion Protocol](https://developer.mozilla.org/en-US/docs/RFC/9309)
   * - [Using the X-Robots-Tag HTTP header](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag#xrobotstag) on developers.google.com
   */
  'X-Robots-Tag' = 'X-Robots-Tag',

  /**
   * > [!WARNING]
   * > Even though this feature can protect users of older web browsers that don't support [CSP](https://developer.mozilla.org/en-US/docs/Glossary/CSP), in some cases, **`X-XSS-Protection` can create XSS vulnerabilities** in otherwise safe websites.
   * > See the [Security considerations](#security_considerations) section below for more information.
   *
   * The HTTP **`X-XSS-Protection`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) was a feature of Internet Explorer, Chrome and Safari that stopped pages from loading when they detected reflected cross-site scripting ([XSS](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting)) attacks.
   * These protections are largely unnecessary in modern browsers when sites implement a strong [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) that disables the use of inline JavaScript (`'unsafe-inline'`).
   *
   * It is recommended that you use [`Content-Security-Policy`](/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy) instead of XSS filtering.
   *
   *
   * ```
   *
   * Nginx
   *
   * ```nginx
   * add_header "X-XSS-Protection" "1; mode=block";
   * ```
   *
   * ## Specifications
   *
   * Not part of any specifications or drafts.
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy)
   * - [Controlling the XSS Filter – Microsoft](https://learn.microsoft.com/en-us/archive/blogs/ieinternals/controlling-the-xss-filter)
   * - [Understanding XSS Auditor – Virtue Security](https://www.virtuesecurity.com/understanding-xss-auditor/)
   * - [The misunderstood X-XSS-Protection – blog.innerht.ml](https://web.archive.org/web/20230527023943/https://blog.innerht.ml/the-misunderstood-x-xss-protection/)
   */
  'X-XSS-Protection' = 'X-XSS-Protection',
}
