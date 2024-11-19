/* eslint-disable unicorn/prevent-abbreviations */
export enum HttpHeader {

  /**
   * The HTTP **`Accept-CH`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) may be set by a server to specify which [client hint](/en-US/docs/Web/HTTP/Client_hints) headers should be included by the client in subsequent requests.
   * To ensure client hints are sent reliably, the `Accept-CH` header should be persisted for all secure requests.
   */
  'Accept-CH' = 'Accept-CH',

  /**
   * > [!WARNING]
   * > Do not use this header. Browsers omit this header and servers should ignore it.
   *
   * The HTTP **`Accept-Charset`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) was a header that advertised a client's supported [character encodings](https://developer.mozilla.org/en-US/docs/glossary/character_encoding). It is no longer widely used.
   *
   * UTF-8 is well-supported and the overwhelmingly preferred choice for character encoding. To [guarantee better privacy through less configuration-based entropy](https://www.eff.org/deeplinks/2010/01/primer-information-theory-and-privacy), all browsers omit the `Accept-Charset` header.
   *
   * Today, `Accept-Charset` is most notable for being one of several [forbidden header names](/en-US/docs/Glossary/Forbidden_header_name).
   */
  'Accept-Charset' = 'Accept-Charset',

  /**
   * The HTTP **`Accept-Encoding`** [request](https://developer.mozilla.org/en-US/docs/glossary/request_header) and [response header](https://developer.mozilla.org/en-US/docs/glossary/response_header) indicates the content encoding (usually a compression algorithm) that the recipient can understand.
   * In requests, the server uses [content negotiation](/en-US/docs/Web/HTTP/Content_negotiation) to select one of the encoding proposals from the client and informs the client of that choice with the [Content-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding) response header.
   * In responses, it provides information about which content encodings the server can understand in messages to the requested resource, so that the encoding can be used in subsequent requests to the resource. For example, this might be sent in the response to a `PUT` request to a resource that used an unsupported encoding.
   *
   * Even if both the client and the server support the same compression algorithms, the server may choose not to compress the body of a response if the `identity` value is also acceptable.
   * This happens in two common cases:
   *
   * 1. The data is already compressed, meaning a second round of compression will not reduce the transmitted data size, and may actually increase the size of the content in some cases.
   * This is true for pre-compressed image formats (JPEG, for instance).
   * 2. The server is overloaded and cannot allocate computing resources to perform the compression. For example, Microsoft recommends not to compress if a server uses more than 80% of its computational power.
   *
   * As long as the `identity;q=0` or `*;q=0` directives do not explicitly forbid the `identity` value that means no encoding, the server must never return a [406 Not Acceptable](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/406) error.
   *
   * > [!NOTE]
   * > IANA maintains [a list of official content encodings](https://www.iana.org/assignments/http-parameters/http-parameters.xhtml#content-coding).
   * > The `bzip` and `bzip2` encodings are non-standard, but may be used in some cases, particularly for legacy support.
   */
  'Accept-Encoding' = 'Accept-Encoding',

  /**
   * The HTTP **`Accept-Language`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) indicates the natural language and locale that the client prefers.
   * The server uses [content negotiation](/en-US/docs/Web/HTTP/Content_negotiation) to select one of the proposals and informs the client of the choice with the [Content-Language](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Language) response header.
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
   */
  'Accept-Language' = 'Accept-Language',

  /**
   * The HTTP **`Accept-Patch`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) advertises which [media types](/en-US/docs/Web/HTTP/MIME_types) the server is able to understand in a [PATCH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/PATCH) request.
   * For example, a server receiving a `PATCH` request with an unsupported media type could reply with [415 Unsupported Media Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/415) and an `Accept-Patch` header referencing one or more supported media types.
   *
   * The header should appear in [OPTIONS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/OPTIONS) requests to a resource that supports the `PATCH` method.
   * An `Accept-Patch` header in a response to any request method implicitly means that a `PATCH` is allowed on the target resource in the request.
   *
   * > [!NOTE]
   * > IANA maintains [a list of official content encodings](https://www.iana.org/assignments/http-parameters/http-parameters.xhtml#content-coding).
   * > The `bzip` and `bzip2` encodings are non-standard but may be used in some cases, particularly for legacy support.
   */
  'Accept-Patch' = 'Accept-Patch',

  /**
   * The HTTP **`Accept-Post`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) advertises which [media types](/en-US/docs/Web/HTTP/MIME_types) are accepted by the server in a [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/POST) request.
   * For example, a server receiving a `POST` request with an unsupported media type could reply with [415 Unsupported Media Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/415) and an `Accept-Post` header referencing one or more supported media types.
   *
   * The header should appear in [OPTIONS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/OPTIONS) requests to a resource that supports the `POST` method.
   * An `Accept-Post` header in a response to any request method implicitly means that a `POST` is allowed on the target resource in the request.
   *
   * > [!NOTE]
   * > IANA maintains [a list of official content encodings](https://www.iana.org/assignments/http-parameters/http-parameters.xhtml#content-coding).
   * > The `bzip` and `bzip2` encodings are non-standard but may be used in some cases, particularly for legacy support.
   */
  'Accept-Post' = 'Accept-Post',

  /**
   * The HTTP **`Accept-Ranges`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) is used by the server to advertise its support for [range requests](/en-US/docs/Web/HTTP/Range_requests), allowing clients to request part or several parts of a resource.
   * The value of this header indicates the unit that can be used to define a range.
   *
   * For example, a response with an `Accept-Ranges` header indicates that the server is capable of _resuming_ an interrupted download instead of a client restarting the transfer in full.
   */
  'Accept-Ranges' = 'Accept-Ranges',

  /**
   * The HTTP **`Accept`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) indicates which content types, expressed as [MIME types](/en-US/docs/Web/HTTP/MIME_types), the client is able to understand.
   * The server uses [content negotiation](/en-US/docs/Web/HTTP/Content_negotiation) to select one of the proposals and informs the client of the choice with the [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) response header.
   * Browsers set required values for this header based on the context of the request.
   * For example, a browser uses different values in a request when fetching a CSS stylesheet, image, video, or a script.
   *
   *
   *
   * \* Values can't contain [CORS-unsafe request header bytes](https://fetch.spec.whatwg.org/#cors-unsafe-request-header-byte), including `"():<>?@[\]{},`, Delete `0x7F`, and control characters `0x00` to `0x19`, except for Tab `0x09`.
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
   * If the server's response to the preflight request sets the `Access-Control-Allow-Credentials` header to `true`, then the real request will include credentials; otherwise, the browser reports a network error.
   * - For non-preflighted requests: The request will include credentials, and if the server's response does not set the `Access-Control-Allow-Credentials` header to `true`, the browser reports a network error.
   */
  'Access-Control-Allow-Credentials' = 'Access-Control-Allow-Credentials',

  /**
   * The HTTP **`Access-Control-Allow-Headers`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) is used in response to a [preflight request](https://developer.mozilla.org/en-US/docs/Glossary/preflight_request) to indicate the HTTP headers that can be used during the actual request.
   * This header is required if the preflight request contains [Access-Control-Request-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Request-Headers).
   *
   * > [!NOTE]
   * > The [CORS-safelisted request headers](https://developer.mozilla.org/en-US/docs/glossary/CORS-safelisted_request_header) are always allowed and usually aren't listed in `Access-Control-Allow-Headers` unless there is a need to circumvent the [additional safelist restrictions](/en-US/docs/Glossary/CORS-safelisted_request_header#additional_restrictions).
   */
  'Access-Control-Allow-Headers' = 'Access-Control-Allow-Headers',

  /**
   * The HTTP **`Access-Control-Allow-Methods`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) specifies one or more [HTTP request methods](/en-US/docs/Web/HTTP/Methods) allowed when accessing a resource in response to a [preflight request](https://developer.mozilla.org/en-US/docs/glossary/preflight_request).
   */
  'Access-Control-Allow-Methods' = 'Access-Control-Allow-Methods',

  /**
   * The HTTP **`Access-Control-Allow-Origin`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) indicates whether the response can be shared with requesting code from the given [origin](https://developer.mozilla.org/en-US/docs/Glossary/origin).
   */
  'Access-Control-Allow-Origin' = 'Access-Control-Allow-Origin',

  /**
   * The HTTP **`Access-Control-Expose-Headers`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) allows a server to indicate which response headers should be made available to scripts running in the browser in response to a cross-origin request.
   *
   * Only the [CORS-safelisted response headers](https://developer.mozilla.org/en-US/docs/Glossary/CORS-safelisted_response_header) are exposed by default. For clients to be able to access other headers, the server must list them using the `Access-Control-Expose-Headers` header.
   */
  'Access-Control-Expose-Headers' = 'Access-Control-Expose-Headers',

  /**
   * The HTTP **`Access-Control-Max-Age`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) indicates how long the results of a [preflight request](https://developer.mozilla.org/en-US/docs/glossary/preflight_request) (that is, the information contained in the [Access-Control-Allow-Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Methods) and [Access-Control-Allow-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers) headers) can be cached.
   */
  'Access-Control-Max-Age' = 'Access-Control-Max-Age',

  /**
   * The HTTP **`Access-Control-Request-Headers`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) is used by browsers when issuing a [preflight request](https://developer.mozilla.org/en-US/docs/glossary/preflight_request) to let the server know which [HTTP headers](/en-US/docs/Web/HTTP/Headers) the client might send when the actual request is made (such as with [fetch()](https://developer.mozilla.org/en-US/docs/domxref/Window/fetch) or [XMLHttpRequest.setRequestHeader()](https://developer.mozilla.org/en-US/docs/domxref/XMLHttpRequest.setRequestHeader())). The complementary server-side header of [Access-Control-Allow-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers) will answer this browser-side header.
   */
  'Access-Control-Request-Headers' = 'Access-Control-Request-Headers',

  /**
   * The HTTP **`Access-Control-Request-Method`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) is used by browsers when issuing a [preflight request](https://developer.mozilla.org/en-US/docs/glossary/preflight_request) to let the server know which [HTTP method](/en-US/docs/Web/HTTP/Methods) will be used when the actual request is made.
   * This header is necessary because the preflight request is always an [OPTIONS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/OPTIONS) and doesn't use the same method as the actual request.
   */
  'Access-Control-Request-Method' = 'Access-Control-Request-Method',

  /**
   * The HTTP **`Age`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) indicates the time in seconds for which an object was in a proxy cache.
   *
   * The header value is usually close to zero.
   * If the value is `0`, the object was probably fetched from the origin server; otherwise, the value is usually calculated as a difference between the proxy's current date and the [Date](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Date) general header included in the HTTP response.
   */
  'Age' = 'Age',

  /**
   * The HTTP **`Allow`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) lists the set of [request methods](/en-US/docs/Web/HTTP/Methods) supported by a resource.
   * This header must be sent if the server responds with a [405 Method Not Allowed](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405) status code to indicate which request methods can be used instead.
   * An empty `Allow` value indicates that the resource allows no request methods, which might occur temporarily for a given resource.
   */
  'Allow' = 'Allow',

  /**
   * The HTTP **`Alt-Svc`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) lets a server indicate that another network location (the "alternative service") can be treated as authoritative for that origin when making future requests.
   *
   * Doing so allows new protocol versions to be advertised without affecting in-flight requests and can also help servers manage traffic. Using an alternative service is not visible to the end user; it does not change the URL or the origin of the request and does not introduce additional round trips.
   */
  'Alt-Svc' = 'Alt-Svc',

  /**
   * The HTTP **`Alt-Used`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) is used to identify the alternative service in use, just as the [Host](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Host) HTTP header field identifies the host and port of the origin.
   *
   * The is intended to allow alternative services to detect loops, differentiate traffic for purposes of load balancing, and generally to ensure that it is possible to identify the intended destination of traffic, since introducing this information after a protocol is in use has proven to be problematic.
   *
   * When a client uses an alternative service for a request, it can indicate this to the server using the `Alt-Used` HTTP header.
   */
  'Alt-Used' = 'Alt-Used',

  /**
   * The HTTP **`Attribution-Reporting-Eligible`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) indicates that the corresponding response is eligible to register an attribution source or trigger.
   *
   * This header is never set manually and is instead sent by the browser in response to various HTML element or JavaScript request settings. Depending on the allowed registrations specified in the `Attribution-Reporting-Eligible` value, the server is expected to respond with either an [Attribution-Reporting-Register-Source](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Attribution-Reporting-Register-Source) or [Attribution-Reporting-Register-Trigger](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Attribution-Reporting-Register-Trigger) header to complete the registration of an attribution source or trigger, respectively.
   *
   * See the [Attribution Reporting API](/en-US/docs/Web/API/Attribution_Reporting_API) for more details.
   */
  'Attribution-Reporting-Eligible' = 'Attribution-Reporting-Eligible',

  /**
   * The HTTP **`Attribution-Reporting-Register-Source`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) registers a page feature as an [attribution source](/en-US/docs/Web/API/Attribution_Reporting_API/Registering_sources). This header is included as part of a response to a request that contains the [Attribution-Reporting-Eligible](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Attribution-Reporting-Eligible) header. It provides the information that the browser should store when a user interacts with the attribution source. The information you include in this header also determines the types of reports the browser can generate.
   *
   * See the [Attribution Reporting API](/en-US/docs/Web/API/Attribution_Reporting_API) for more details.
   *
   * > [!NOTE]
   * > If the calling site does not have the Attribution Reporting API included in a successful [privacy sandbox enrollment process](/en-US/docs/Web/Privacy/Privacy_sandbox/Enrollment), the `Attribution-Reporting-Register-Source` header is ignored and attribution sources are not registered.
   */
  'Attribution-Reporting-Register-Source' = 'Attribution-Reporting-Register-Source',

  /**
   * The HTTP **`Attribution-Reporting-Register-Trigger`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) registers a page feature as an [attribution trigger](/en-US/docs/Web/API/Attribution_Reporting_API/Registering_triggers). This header is included as part of a response to a request that contains the [Attribution-Reporting-Eligible](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Attribution-Reporting-Eligible) header.
   *
   * See the [Attribution Reporting API](/en-US/docs/Web/API/Attribution_Reporting_API) for more details.
   *
   * > [!NOTE]
   * > If the calling site does not have the Attribution Reporting API included in a successful [privacy sandbox enrollment process](/en-US/docs/Web/Privacy/Privacy_sandbox/Enrollment), the `Attribution-Reporting-Register-Trigger` header is ignored and attribution triggers are not registered.
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
   * > This header is part of the [General HTTP authentication framework](/en-US/docs/Web/HTTP/Authentication#the_general_http_authentication_framework).
   * > It can be used with a number of [authentication schemes](/en-US/docs/Web/HTTP/Authentication#authentication_schemes).
   */
  'Authorization' = 'Authorization',

  /**
   * The HTTP **`Cache-Control`** header holds _directives_ (instructions) in both requests and responses that control [caching](/en-US/docs/Web/HTTP/Caching) in browsers and shared caches (e.g., Proxies, CDNs).
   */
  'Cache-Control' = 'Cache-Control',

  /**
   * The HTTP **`Clear-Site-Data`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) sends a signal to the client that it should remove all browsing data of certain types (cookies, storage, cache) associated with the requesting website.
   * It allows web developers to have more control over the data stored by browsers for their origins.
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
   * All [hop-by-hop headers](/en-US/docs/Web/HTTP/Compression#hop-by-hop_compression), including the standard hop-by-hop headers ([Keep-Alive](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Keep-Alive),
   * [Transfer-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Transfer-Encoding), [TE](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/TE), `Connection`,
   * [Trailer](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Trailer), [Upgrade](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Upgrade),
   * [Proxy-Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Proxy-Authorization), and [Proxy-Authenticate](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Proxy-Authenticate)) must be listed in the `Connection`
   * header, so that the first proxy knows it has to consume them and not forward them
   * further.
   *
   * The default value of `Connection` changed between HTTP/1.0 and HTTP/1.1.
   * Therefore, to ensure backwards compatibility, browsers often send `Connection: keep-alive` explicitly, even though it's the default in HTTP/1.1.
   */
  'Connection' = 'Connection',

  /**
   * The HTTP **`Content-Digest`** header provides a [digest](https://developer.mozilla.org/en-US/docs/Glossary/digest) of the message content in an HTTP message.
   * As such, `Content-Digest` is dependent on among other things [Content-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding) and [Content-Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Range), but not dependent on, for example, HTTP/1.1's [Transfer-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Transfer-Encoding).
   * `Content-Digest` may coincide with [Repr-Digest](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Repr-Digest) if a representation was sent in a single message.
   *
   * In this setting, _content_ refers to a particular octet representation of the [selected representation](https://www.rfc-editor.org/rfc/rfc9110#section-6.4) of the target resource.
   *
   * A client can request that a server emit a `Content-Digest` by issuing [Want-Content-Digest](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Want-Content-Digest).
   */
  'Content-Digest' = 'Content-Digest',

  /**
   * The HTTP **`Content-Disposition`** header indicates whether content should be displayed _inline_ in the browser as a web page or part of a web page or downloaded as an _attachment_ locally.
   *
   * In a multipart body, the header must be used on each subpart to provide information about its corresponding field. The subpart is delimited by the _boundary_ defined in the [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) header. When used on the body itself, `Content-Disposition` has no effect.
   *
   * The `Content-Disposition` header is defined in the larger context of MIME messages for email, but only a subset of the possible parameters apply to HTTP forms and [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/POST) requests. Only the value `form-data`, as well as the optional directive `name` and `filename`, can be used in the HTTP context.
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
   * Content encoding differs to [Transfer-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Transfer-Encoding) in that `Transfer-Encoding` handles how HTTP messages themselves are delivered across the network on a [hop-by-hop basis](/en-US/docs/Web/HTTP/Headers#hop-by-hop_headers).
   */
  'Content-Encoding' = 'Content-Encoding',

  /**
   * The HTTP **`Content-Language`** [representation header](https://developer.mozilla.org/en-US/docs/Glossary/representation_header) is used to describe the language(s) intended for the audience, so users can differentiate it according to their own preferred language.
   *
   * For example, `Content-Language: de-DE` indicates that the document is intended for German language speakers. The document may be written in English, not German, as part of a language course for German speakers. To indicate the language the document is **written in**, use the [`lang`](/en-US/docs/Web/HTML/Global_attributes/lang) attribute instead.
   *
   * If no `Content-Language` is specified, the default is that the content is intended for all language audiences. Multiple language tags are also possible, as well as applying the `Content-Language` header to various media types and not only to textual documents.
   *
   *
   *
   * \* Values can only be `0-9`, `A-Z`, `a-z`, a space, or the characters `*,-.;=`.
   */
  'Content-Language' = 'Content-Language',

  /**
   * The HTTP **`Content-Length`** header indicates the size, in bytes, of the message body sent to the recipient.
   */
  'Content-Length' = 'Content-Length',

  /**
   * The HTTP **`Content-Location`** [representation header](https://developer.mozilla.org/en-US/docs/Glossary/representation_header) indicates an alternate location for the returned data.
   * It's main use is to indicate the URL of a resource transmitted as the result of [content negotiation](/en-US/docs/Web/HTTP/Content_negotiation).
   *
   * The `Content-Location` header is different from the [Location](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Location) header.
   * `Content-Location` indicates the direct URL to access the resource when [content negotiation](/en-US/docs/Web/HTTP/Content_negotiation) has happened, allowing the client to bypass future content negotiation for this resource.
   * `Location`, on the other hand, indicates either the target of a `3XX` redirection or the URL of a newly created resource in a [201 Created](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201) response.
   */
  'Content-Location' = 'Content-Location',

  /**
   * The HTTP **`Content-Range`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) is used in [range requests](/en-US/docs/Web/HTTP/Range_requests) to indicate where the content of a response body belongs in relation to a complete resource.
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
   * For more information, see our [Content Security Policy (CSP)](/en-US/docs/Web/HTTP/CSP) guide.
   *
   * > [!NOTE]
   * > The header can also be used with the deprecated [report-uri](https://developer.mozilla.org/en-US/docs/CSP/report-uri) directive (this is being replaced by [report-to](https://developer.mozilla.org/en-US/docs/CSP/report-to)).
   * > The usage and resulting report syntax is slightly different; see the [report-uri](https://developer.mozilla.org/en-US/docs/CSP/report-uri) topic for more details.
   */
  'Content-Security-Policy-Report-Only' = 'Content-Security-Policy-Report-Only',

  /**
   * The HTTP **`Content-Security-Policy`** response header allows
   * website administrators to control resources the user agent is allowed to load for a
   * given page. With a few exceptions, policies mostly involve specifying server origins and
   * script endpoints. This helps guard against cross-site scripting attacks
   * ([Cross-site_scripting](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting)).
   *
   * For more information, see the introductory article on [Content Security Policy (CSP)](/en-US/docs/Web/HTTP/CSP).
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
   * > This value may be ignored if browsers perform [MIME sniffing](/en-US/docs/Web/HTTP/MIME_types#mime_sniffing) (or content sniffing) on responses.
   * > To prevent browsers from using MIME sniffing, set the [X-Content-Type-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options) header value to `nosniff`.
   * > See [MIME type verification](/en-US/docs/Web/Security/Practical_implementation_guides/MIME_types) for more details.
   *
   *
   *
   * \* Values can't contain a [CORS-unsafe request header byte](https://fetch.spec.whatwg.org/#cors-unsafe-request-header-byte): `"():<>?@[\]{},`, Delete `0x7F`, and control characters `0x00` to `0x19` except for Tab `0x09`.
   * It also needs to have a media type of its parsed value (ignoring parameters) of either `application/x-www-form-urlencoded`, `multipart/form-data`, or `text/plain`.
   */
  'Content-Type' = 'Content-Type',

  /**
   * The HTTP **`Cookie`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) contains stored [HTTP cookies](/en-US/docs/Web/HTTP/Cookies) associated with the server (i.e., previously sent by the server with the [Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie) header or set in JavaScript using [Document.cookie](https://developer.mozilla.org/en-US/docs/domxref/Document.cookie)).
   *
   * The `Cookie` header is optional and may be omitted if, for example, the browser's privacy settings block cookies.
   */
  'Cookie' = 'Cookie',

  /**
   * The HTTP **`Critical-CH`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) is used along with [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH) to identify the accepted [client hints](/en-US/docs/Web/HTTP/Client_hints) that are [critical](/en-US/docs/Web/HTTP/Client_hints#critical_client_hints).
   *
   * User agents receiving a response with `Critical-CH` must check if the indicated critical headers were sent in the original request. If not, the user agent will retry the request along with the critical headers rather than render the page. This approach ensures that client preferences set using critical client hints are always used, even if not included in the first request, or following server configuration changes.
   *
   * Each header listed in the `Critical-CH` header should also be present in the `Accept-CH` and `Vary` headers.
   */
  'Critical-CH' = 'Critical-CH',

  /**
   * The HTTP **`Cross-Origin-Embedder-Policy`** (COEP) [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) configures embedding cross-origin resources into the document.
   */
  'Cross-Origin-Embedder-Policy' = 'Cross-Origin-Embedder-Policy',

  /**
   * The HTTP **`Cross-Origin-Opener-Policy`** (COOP) [response header](https://developer.mozilla.org/en-US/docs/glossary/response_header) allows a website to control whether a new top-level document, opened using [Window.open()](https://developer.mozilla.org/en-US/docs/domxref/Window.open()) or by navigating to a new page, is opened in the same [browsing context group](https://developer.mozilla.org/en-US/docs/glossary/Browsing_context) (BCG) or in a new browsing context group.
   *
   * When opened in a new BCG, any references between the new document and its opener are severed, and the new document may be process-isolated from its opener.
   * This ensures that potential attackers can't open your documents with [Window.open()](https://developer.mozilla.org/en-US/docs/domxref/Window.open()) and then use the returned value to access its global object, and thereby prevents a set of cross-origin attacks referred to as [XS-Leaks](https://xsleaks.dev/).
   *
   * It also means that any object opened by your document in a new BCG can't access it using [`window.opener`](/en-US/docs/Web/API/Window/opener).
   * This allows you to have more control over references to a window than [`rel=noopener`](/en-US/docs/Web/HTML/Attributes/rel/noopener), which affects outgoing navigations but not documents opened with [Window.open()](https://developer.mozilla.org/en-US/docs/domxref/Window.open()).
   *
   * The behaviour depends on the policies of both the new document and its opener, and whether the new document is opened following a navigation or using [Window.open()](https://developer.mozilla.org/en-US/docs/domxref/Window.open()).
   */
  'Cross-Origin-Opener-Policy' = 'Cross-Origin-Opener-Policy',

  /**
   * The HTTP **`Cross-Origin-Resource-Policy`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) indicates that the browser should block no-cors cross-origin or cross-site requests to the given resource.
   */
  'Cross-Origin-Resource-Policy' = 'Cross-Origin-Resource-Policy',

  /**
   * The **`Date`** general HTTP header contains the date and time
   * at which the message originated.
   *
   * > **Warning:** `Date` is listed
   * > in the [forbidden header names](https://fetch.spec.whatwg.org/#forbidden-header-name)
   * > in the fetch spec, so this code will not send the `Date` header:
   * >
   * > ```js
   * > fetch("https://httpbin.org/get", {
   * >   headers: {
   * >     Date: new Date().toUTCString(),
   * >   },
   * > });
   * > ```
   */
  'Date' = 'Date',

  /**
   * The **`Device-Memory`** [device client hint](/en-US/docs/Web/HTTP/Client_hints#device_client_hints) request header field indicates the approximate amount of available RAM on the client device. The header is part of the [Device Memory API", "", "nocode](https://developer.mozilla.org/en-US/docs/DOMxRef/Device_Memory_API).
   *
   *
   *
   * > [!NOTE]
   * >
   * > - Client Hints are accessible only on secure origins (via TLS).
   * > - A server has to opt in to receive the `Device-Memory` header from the client, by sending the [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH) response header.
   * > - Servers that opt in to the `Device-Memory` client hint will typically also specify it in the [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) header. This informs caches that the server may send different responses based on the header value in a request.
   */
  'Device-Memory' = 'Device-Memory',

  /**
   * > [!NOTE]
   * > This header was removed from the specification in [draft 8](https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-digest-headers-08).
   * > Use [Content-Digest](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Digest) instead.
   * > For `id-*` digest algorithms, use [Repr-Digest](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Repr-Digest).
   *
   * The **`Digest`** response or request HTTP header provides the other side with a [digest](https://developer.mozilla.org/en-US/docs/Glossary/digest) of the [Content-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding)-encoded _selected representation_. It can be requested by using the [Want-Digest](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Want-Digest) header.
   *
   * Representations are different forms of a particular resource that might be returned from a request: for example, the same resource might be formatted in a particular media type such as XML or JSON, localized to a particular written language or geographical region, and/or compressed or otherwise encoded for transmission.
   * The _selected representation_ is the actual format of a resource that is returned following [content negotiation](/en-US/docs/Web/HTTP/Content_negotiation), and can be determined from the response's [Representation headers](https://developer.mozilla.org/en-US/docs/Glossary/Representation_header).
   *
   * The digest applies to the whole representation of a resource, not to a particular message.
   * It can be used to verify that the representation data has not been modified during transmission.
   *
   * > [!NOTE]
   * > While a representation may be fully contained in the message body of a single response, it can also be sent using multiple messages in response to a [range request](/en-US/docs/Web/HTTP/Range_requests), or omitted altogether in response to a [HEAD](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/HEAD) request.
   */
  'Digest' = 'Digest',

  /**
   * > [!NOTE]
   * > The DNT (Do Not Track) specification has been discontinued. See [Navigator.doNotTrack](https://developer.mozilla.org/en-US/docs/domxref/Navigator.doNotTrack) for more information.
   *
   * The **`DNT`** (**D**o **N**ot
   * **T**rack) request header indicates the user's tracking preference. It lets
   * users indicate whether they would prefer privacy rather than personalized content.
   *
   * DNT is deprecated in favor of [Global Privacy Control](https://globalprivacycontrol.org/), which is communicated to servers using the [Sec-GPC](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-GPC) header, and accessible to clients from [navigator.globalPrivacyControl](https://developer.mozilla.org/en-US/docs/domxref/navigator.globalPrivacyControl).
   */
  'DNT' = 'DNT',

  /**
   * The **`Downlink`** [Client hint](/en-US/docs/Web/HTTP/Client_hints) request header field provides the approximate bandwidth of the client's connection to the server, in Mbps.
   *
   *
   *
   * The `Downlink` value is given in Mbps and rounded to the nearest 25 kilobits per second to prevent [fingerprinting](/en-US/docs/Glossary/Fingerprinting). There are many other mechanisms an attacker might use to obtain similar information.
   *
   * The hint allows a server to choose what information is sent based on the network bandwidth. For example, a server might choose to send smaller versions of images and other resources on low bandwidth networks.
   *
   * > [!NOTE]
   * > The [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) header is used in responses to indicate that a different resource is sent for every different value of the header (see [HTTP Caching Vary](/en-US/docs/Web/HTTP/Caching#vary)). Even if `Downlink` is used to configure what resources are sent, consider omitting it in the [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) header — it is likely to change often, which effectively makes the resource uncacheable.
   */
  'Downlink' = 'Downlink',

  /**
   * The **`DPR`** [device client hint](/en-US/docs/Web/HTTP/Client_hints) request header provides the client device pixel ratio. This ratio is the number of physical device pixels corresponding to every [CSS pixel](https://developer.mozilla.org/en-US/docs/Glossary/CSS_pixel).
   *
   *
   *
   * The hint is useful when selecting image sources that best correspond to a screen's pixel density. This is similar to the role played by `x` descriptors in the `<img>` [`srcset`](/en-US/docs/Web/HTML/Element/img#srcset) attribute to allow user agents to select a preferred image.
   *
   * If a server uses the `DPR` hint to choose which resource is sent in a response, the response must include the [Content-DPR](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-DPR) header. The client must use the value in `Content-DPR` for layout if it differs from the value in the request's `DPR` header.
   *
   * If the `DPR` header appears more than once in a message the last occurrence is used.
   *
   * > [!NOTE]
   * >
   * > - Client Hints are accessible only on secure origins (via TLS).
   * > - A server has to opt in to receive the `DPR` header from the client, by sending the [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH) response header.
   * > - Servers that opt in to the `DPR` client hint will typically also specify it in the [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) header. This informs caches that the server may send different responses based on the header value in a request.
   * > - `DPR` was removed from the client hints specification in [draft-ietf-httpbis-client-hints-07](https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-client-hints-07). The proposed replacement is [`Sec-CH-DPR`](https://wicg.github.io/responsive-image-client-hints/#sec-ch-dpr) (Responsive Image Client Hints).
   */
  'DPR' = 'DPR',

  /**
   * The **`Early-Data`** header is set by
   * an intermediary to indicate that the request has been conveyed in [TLS early data](/en-US/docs/Web/Security/Transport_Layer_Security#tls_1.3),
   * and also indicates that the intermediary understands the [425 Too Early](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/425) status code.
   *
   * The `Early-Data` header is **not** set by the originator of the
   * request (i.e., a browser).
   */
  'Early-Data' = 'Early-Data',

  /**
   * The **`ECT`** [Client hint](/en-US/docs/Web/HTTP/Client_hints) request header field indicates the [effective connection type](https://developer.mozilla.org/en-US/docs/Glossary/effective_connection_type): `slow-2g`, `2g`, `3g`, `4g`.
   *
   *
   *
   * The value represents the "network profile" that best matches the connection's latency and bandwidth, rather than the actual mechanisms used for transferring the data. For example, `2g` might be used to represent a slow Wi-Fi connection with high latency and low bandwidth, while `4g` might be used to represent a fast fibre-based broadband network.
   *
   * The hint allows a server to choose what information is sent based on the broad characteristics of the network. For example, a server might choose to send smaller versions of images and other resources on less capable connections. The value might also be used as a starting point for determining what information is sent, which is further refined using information in [RTT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/RTT) and [Downlink](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Downlink) hints.
   *
   * > [!NOTE]
   * > A server that specifies `ECT` in [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH) may also specify it in [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) to indicate that responses should be cached for different ECT values.
   */
  'ECT' = 'ECT',

  /**
   * The **`ETag`** (or **entity tag**) HTTP response header is an identifier for a
   * specific version of a resource. It lets caches be more efficient and save bandwidth, as
   * a web server does not need to resend a full response if the content was not changed.
   * Additionally, etags help to prevent simultaneous updates of a resource from overwriting
   * each other (["mid-air collisions"](#avoiding_mid-air_collisions)).
   *
   * If the resource at a given URL changes, a new `Etag` value _must_ be
   * generated. A comparison of them can determine whether two representations of a resource
   * are the same.
   */
  'ETag' = 'ETag',

  /**
   * The `Expect-CT` header lets sites opt in to reporting and/or enforcement of [Certificate Transparency](/en-US/docs/Web/Security/Certificate_Transparency) requirements. Certificate Transparency (CT) aims to prevent the use of misissued certificates for that site from going unnoticed.
   *
   * Only Google Chrome and other Chromium-based browsers implemented `Expect-CT`, and Chromium has deprecated the header from version 107, because Chromium now enforces CT by default. See the [Chrome Platform Status](https://chromestatus.com/feature/6244547273687040) update.
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
   * > The `Expect-CT` is mostly obsolete since June 2021. Since May 2018, all new TLS certificates are expected to support SCTs by default. Certificates issued before March 2018 were allowed to have a lifetime of 39 months, so they had expired in June 2021. Chromium plans to deprecate `Expect-CT` header and to eventually remove it.
   */
  'Expect-CT' = 'Expect-CT',

  /**
   * The **`Expect`** HTTP request header indicates expectations
   * that need to be met by the server to handle the request successfully.
   *
   * Upon `Expect: 100-continue`, the server responds with:
   *
   * - [100](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/100) (Continue) if the information from the request header is insufficient to
   * resolve the response and the client should proceed with sending the body.
   * - [417](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/417) (Expectation Failed) if the server cannot meet the expectation
   *
   * or any other status otherwise (e.g. a 4xx status for a client error, or a 2xx status if the
   * request can be resolved successfully without further processing).
   *
   * For example, the server may reject a request if its [Content-Length](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Length) is
   * too large.
   *
   * No common browsers send the `Expect` header, but some other clients such as
   * cURL do so by default.
   */
  'Expect' = 'Expect',

  /**
   * The **`Expires`** HTTP header contains the date/time after which the
   * response is considered expired.
   *
   * Invalid expiration dates with value 0 represent a date in the past and mean that the
   * resource is already expired.
   *
   * > [!NOTE]
   * > If there is a [Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) header
   * > with the `max-age` or `s-maxage` directive in the response,
   * > the `Expires` header is ignored.
   */
  'Expires' = 'Expires',

  /**
   * The **`Forwarded`** request header contains information that may be added by [reverse proxy servers](/en-US/docs/Web/HTTP/Proxy_servers_and_tunneling) (load balancers, CDNs, and so on) that would otherwise be altered or lost when proxy servers are involved in the path of the request.
   *
   * For example, if a client is connecting to a web server through an HTTP proxy (or load balancer), server logs will only contain the IP address, host address, and protocol of the proxy; this header can be used to identify the IP address, host, and protocol, of the original request.
   * The header is optional and may be added to, modified, or removed, by any of the proxy servers on the path to the server.
   *
   * This header is used for debugging, statistics, and generating location-dependent content.
   * By design, it exposes privacy sensitive information, such as the IP address of the client.
   * Therefore, the user's privacy must be kept in mind when deploying this header.
   *
   * The alternative and de-facto standard versions of this header are the [X-Forwarded-For](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For), [X-Forwarded-Host](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-Host) and [X-Forwarded-Proto](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-Proto) headers.
   */
  'Forwarded' = 'Forwarded',

  /**
   * The **`From`** request header contains an Internet email
   * address for a human user who controls the requesting user agent.
   *
   * If you are running a robotic user agent (e.g. a crawler), the `From` header
   * must be sent, so you can be contacted if problems occur on servers, such as if the
   * robot is sending excessive, unwanted, or invalid requests.
   *
   * > [!WARNING]
   * > You must not use the `From` header for access control or authentication.
   */
  'From' = 'From',

  /**
   * The **`Host`** request header specifies the host and port
   * number of the server to which the request is being sent.
   *
   * If no port is included, the default port for the service requested is implied (e.g.,
   * `443` for an HTTPS URL, and `80` for an HTTP URL).
   *
   * A `Host` header field must be sent in all HTTP/1.1 request messages. A
   * [400](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400) (Bad Request) status code may be sent to any HTTP/1.1 request
   * message that lacks or contains more than one `Host` header field.
   */
  'Host' = 'Host',

  /**
   * The **`If-Match`** HTTP request header makes a request conditional.
   *
   * A server will only return requested resources for [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) and [HEAD](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/HEAD) methods, or upload resource for [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/PUT) and other non-safe methods, if the resource matches one of the listed [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) values.
   * If the conditional does not match then the [412](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/412) (Precondition Failed) response is returned.
   *
   * The comparison with the stored [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) uses the _strong comparison algorithm_, meaning two files are considered identical byte by byte only.
   * If a listed `ETag` has the `W/` prefix indicating a weak entity tag, this comparison algorithm will never match it.
   *
   * There are two common use cases:
   *
   * - For [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) and [HEAD](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/HEAD) methods, used in combination with a [Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Range) header, it can guarantee that the new ranges requested
   * come from the same resource as the previous one.
   * - For other methods, and in particular for [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/PUT), `If-Match` can be used to prevent the [lost update problem](https://www.w3.org/1999/04/Editing/#3.1).
   * It can check if the modification of a resource that the user wants to upload will not override another change that has been done since the original resource was fetched.
   */
  'If-Match' = 'If-Match',

  /**
   * The **`If-Modified-Since`** request HTTP header makes the
   * request conditional: the server sends back the requested resource, with a
   * [200](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200) status, only if it has been last modified after the given date. If
   * the resource has not been modified since, the response is a [304](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/304)
   * without any body; the [Last-Modified](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Last-Modified) response header of a previous
   * request contains the date of last modification. Unlike
   * [If-Unmodified-Since](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Unmodified-Since), `If-Modified-Since` can only be used
   * with a [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) or [HEAD](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/HEAD).
   *
   * When used in combination with [If-None-Match](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-None-Match), it is ignored, unless
   * the server doesn't support `If-None-Match`.
   *
   * The most common use case is to update a cached entity that has no associated
   * [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag).
   */
  'If-Modified-Since' = 'If-Modified-Since',

  /**
   * The **`If-None-Match`** HTTP request header makes the request conditional. For [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) and [HEAD](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/HEAD) methods, the server will return the requested resource, with a [200](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200) status, only if it doesn't have an [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) matching the given ones. For other methods, the request will be processed only if the eventually existing resource's [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) doesn't match any of the values listed.
   *
   * When the condition fails for [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) and [HEAD](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/HEAD) methods, then the server must return HTTP status code 304 (Not Modified). For methods that apply server-side changes, the status code 412 (Precondition Failed) is used. Note that the server generating a 304 response MUST generate any of the following header fields that would have been sent in a 200 (OK) response to the same request: Cache-Control, Content-Location, Date, ETag, Expires, and Vary.
   *
   * The comparison with the stored [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) uses the _weak comparison algorithm_, meaning two files are considered identical if the content is equivalent — they don't have to be identical byte by byte. For example, two pages that differ by their creation date in the footer would still be considered identical.
   *
   * When used in combination with [If-Modified-Since](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Modified-Since), **`If-None-Match`** has precedence (if the server supports it).
   *
   * There are two common use cases:
   *
   * - For [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) and [HEAD](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/HEAD) methods, to update a cached entity that has an associated [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag).
   * - For other methods, and in particular for [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/PUT), `If-None-Match` used with the `*` value can be used to save a file not known to exist, guaranteeing that another upload didn't happen before, losing the data of the previous put; this problem is a variation of the [lost update problem](https://www.w3.org/1999/04/Editing/#3.1).
   */
  'If-None-Match' = 'If-None-Match',

  /**
   * The **`If-Range`** HTTP request header makes a range request
   * conditional: if the condition is fulfilled, the range request is issued, and the
   * server sends back a [206](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/206) `Partial Content` answer with the
   * appropriate body. If the condition is not fulfilled, the full resource is sent back
   * with a [200](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200) `OK` status.
   *
   * This header can be used either with the [Last-Modified](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Last-Modified) validator or
   * with [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag), but not with both.
   *
   * The most common use case is to resume a download, to guarantee that the stored resource
   * has not been modified since the last fragment has been received.
   */
  'If-Range' = 'If-Range',

  /**
   * The HTTP **`If-Unmodified-Since`** [request header](https://developer.mozilla.org/en-US/docs/glossary/request_header) makes the request for the resource [conditional](/en-US/docs/Web/HTTP/Conditional_requests).
   * The server will send the requested resource (or accept it in the case of a [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/POST) or another non-[safe](https://developer.mozilla.org/en-US/docs/Glossary/Safe/HTTP) method) only if the resource on the server has not been modified after the date in the request header.
   * If the resource has been modified after the specified date, the response will be a [412 Precondition Failed](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/412) error.
   *
   * The `If-Unmodified-Since` header is commonly used in the following situations:
   *
   * - In conjunction with non-[safe](https://developer.mozilla.org/en-US/docs/Glossary/Safe/HTTP) methods like [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/POST), this header can be used to implement an [optimistic concurrency control](https://en.wikipedia.org/wiki/Optimistic_concurrency_control), as is done by some wikis: revision are rejected if the stored document has been modified since the original was retrieved, avoiding conflicts.
   * - In conjunction with a range request using the [Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Range) header, this header can be used to ensure that the new fragment requested comes from an unmodified document.
   */
  'If-Unmodified-Since' = 'If-Unmodified-Since',

  /**
   * The **`Keep-Alive`** general header allows the sender to hint about how the connection may be used to set a timeout and a maximum amount of requests.
   *
   * > [!NOTE]
   * > Set the [Connection](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Connection) header to "keep-alive" for this header to have any effect.
   *
   * > [!WARNING]
   * > Connection-specific header fields such as
   * > [Connection](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Connection) and `Keep-Alive` are prohibited
   * > in [HTTP/2](https://httpwg.org/specs/rfc9113.html#ConnectionSpecific) and
   * > [HTTP/3](https://httpwg.org/specs/rfc9114.html#header-formatting). Chrome and
   * > Firefox ignore them in HTTP/2 responses, but Safari conforms to the HTTP/2
   * > specification requirements and does not load any response that contains them.
   */
  'Keep-Alive' = 'Keep-Alive',

  /**
   * The HTTP **`Last-Modified`** [response header](https://developer.mozilla.org/en-US/docs/glossary/response_header) contains a date and time when the origin server believes the resource was last modified.
   * It is used as a validator in [conditional requests](/en-US/docs/Web/HTTP/Conditional_requests) ([If-Modified-Since](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Modified-Since) or [If-Unmodified-Since](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Unmodified-Since)) to determine if a requested resource is the same as one already stored by the client.
   * It is less accurate than an [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) for determining file contents, but can be used as a fallback mechanism if ETags are unavailable.
   *
   * `Last-Modified` is also used by [crawlers](/en-US/docs/Glossary/Crawler) to adjust crawl frequency, by browsers in [heuristic caching](/en-US/docs/Web/HTTP/Caching#heuristic_caching), and by content management systems (CMS) to display the time the content was last modified.
   */
  'Last-Modified' = 'Last-Modified',

  /**
   * The HTTP **`Link`** header provides a means for serializing one or more links in HTTP headers.
   * This allows the server to point a client to another resource containing metadata about the requested resource.
   * This header has the same semantics as the HTML [link](https://developer.mozilla.org/en-US/docs/HTMLElement/link) element.
   * One benefit of using the `Link` header is that the browser can start preconnecting or preloading resources before the HTML itself is fetched and processed.
   *
   * In practice, most [`rel` link types](/en-US/docs/Web/HTML/Attributes/rel) don't have an effect when used with the HTTP header.
   * For example, the `icon` relation only works in HTML, and `stylesheet` does not work reliably across browsers (only in Firefox).
   * The only relations that work reliably are [`preconnect`](/en-US/docs/Web/HTML/Attributes/rel/preconnect) and [`preload`](/en-US/docs/Web/HTML/Attributes/rel/preload), which can be combined with .
   */
  'Link' = 'Link',

  /**
   * The HTTP **`Location`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) indicates the URL to redirect a page to.
   * It only provides a meaning when served with a `3XX` [redirection response](/en-US/docs/Web/HTTP/Status#redirection_messages) or a [201 Created](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201) status response.
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
   * `Content-Location` indicates the URL to use to directly access the resource in future when [content negotiation](/en-US/docs/Web/HTTP/Content_negotiation) occurred.
   * `Location` is associated with the response, while [Content-Location](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Location) is associated with the representation that was returned.
   */
  'Location' = 'Location',

  /**
   * The HTTP **`Max-Forwards`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) is used with the [TRACE](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/TRACE) method to limit the number of nodes (usually [proxies](https://developer.mozilla.org/en-US/docs/Glossary/Proxy_server)) that the request goes through.
   * Its value is an integer indicating the _maximum amount_ of nodes it must visit.
   * At each node, the value is decremented and the `TRACE` request is forwarded to the next node until the destination is reached or the received value of `Max-Forwards` is zero.
   * The request is then sent back (excluding sensitive headers where appropriate) as the body of a [200](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200) response.
   * This allows the client to see what is being received at the other end of the request chain (the [Via](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Via) header is of particular interest) for testing or diagnostic purposes.
   *
   * If the `Max-Forwards` header is not present in a `TRACE` request, a node will assume that there is no maximum number of forwards.
   */
  'Max-Forwards' = 'Max-Forwards',

  /**
   * The HTTP **`NEL`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) is used to configure network request logging.
   */
  'NEL' = 'NEL',

  /**
   * The HTTP **`No-Vary-Search`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) specifies a set of rules that define how a URL's query parameters will affect cache matching.
   * These rules dictate whether the same URL with different URL parameters should be saved as separate browser cache entries.
   *
   * > [!NOTE]
   * > The [Speculation Rules API](/en-US/docs/Web/API/Speculation_Rules_API) can include an `expects_no_vary_search` field, which indicates to the browser what the expected `No-Vary-Search` value will be (if any) for documents that it is receiving prefetch/prerender requests for via the speculation rules.
   * > The browser can use this to determine ahead of time whether it is more useful to wait for an existing prefetch/prerender to finish, or start a new fetch request when the speculation rule is matched.
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
   */
  'Observe-Browsing-Topics' = 'Observe-Browsing-Topics',

  /**
   * The HTTP **`Origin-Agent-Cluster`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) is used to request that the associated [Document](https://developer.mozilla.org/en-US/docs/domxref/Document) should be placed in an _origin-keyed [agent cluster](https://tc39.es/ecma262/#sec-agent-clusters)_. This means that operating system resources (for example, the operating system process) used to evaluate the document should be shared only with other documents from the same [origin](https://developer.mozilla.org/en-US/docs/glossary/origin).
   *
   * The effect of this is that a resource-intensive document will be less likely to degrade the performance of documents from other origins.
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
   * - Send [`WebAssembly.Module`](/en-US/docs/WebAssembly/JavaScript_interface/Module) objects to other same-site cross-origin pages using [postMessage()](https://developer.mozilla.org/en-US/docs/domxref/Window.postMessage()).
   * - Send [SharedArrayBuffer](https://developer.mozilla.org/en-US/docs/jsxref/SharedArrayBuffer) or [`WebAssembly.Memory`](/en-US/docs/WebAssembly/JavaScript_interface/Memory) objects to other same-site cross-origin pages.
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
   */
  'Origin-Agent-Cluster' = 'Origin-Agent-Cluster',

  /**
   * The HTTP **`Origin`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) indicates the [origin](https://developer.mozilla.org/en-US/docs/glossary/origin) ([scheme](/en-US/docs/Web/URI/Schemes), hostname, and port) that _caused_ the request.
   * For example, if a user agent needs to request resources included in a page, or fetched by scripts that it executes, then the origin of the page may be included in the request.
   */
  'Origin' = 'Origin',

  /**
   * The HTTP **`Permissions-Policy`** header provides a mechanism to allow and deny the use of browser features in a document or within any [iframe](https://developer.mozilla.org/en-US/docs/HTMLElement/iframe) elements in the document.
   *
   * For more information, see the main [Permissions Policy](/en-US/docs/Web/HTTP/Permissions_Policy) article.
   */
  'Permissions-Policy' = 'Permissions-Policy',

  /**
   * The HTTP **`Pragma`** header is an implementation-specific header that may have various effects along the request-response chain.
   * This header serves for backwards compatibility with HTTP/1.0 caches that do not support the [Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) HTTP/1.1 header.
   *
   * > [!NOTE]
   * > The `Pragma` header is not specified for HTTP responses and is therefore not a reliable replacement for the HTTP/1.1 `Cache-Control` header, although its behavior is the same as `Cache-Control: no-cache` if the `Cache-Control` header field is omitted in a request.
   * > Use `Pragma` only for backwards compatibility with HTTP/1.0 clients.
   */
  'Pragma' = 'Pragma',

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
   */
  'Priority' = 'Priority',

  /**
   * The HTTP **`Proxy-Authenticate`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) defines the [authentication](/en-US/docs/Web/HTTP/Authentication) method (or [challenge](https://developer.mozilla.org/en-US/docs/Glossary/Challenge)) that should be used to gain access to a resource behind a [proxy server](https://developer.mozilla.org/en-US/docs/Glossary/proxy_server).
   * It is sent in a [407 Proxy Authentication Required](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/407) response so a client can identify itself to a proxy that requires authentication.
   */
  'Proxy-Authenticate' = 'Proxy-Authenticate',

  /**
   * The HTTP **`Proxy-Authorization`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) contains the credentials to authenticate a client with a proxy server, typically after the server has responded with a [407 Proxy Authentication Required](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/407) status with the [Proxy-Authenticate](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Proxy-Authenticate) header.
   */
  'Proxy-Authorization' = 'Proxy-Authorization',

  /**
   * The HTTP **`Range`** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) indicates the part of a resource that the server should return.
   * Several parts can be requested at the same time in one `Range` header, and the server may send back these ranges in a multipart document.
   * If the server sends back ranges, it uses the [206 Partial Content](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/206) status code for the response.
   * If the ranges are invalid, the server returns the [416 Range Not Satisfiable](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/416) error.
   *
   * A server that doesn't support range requests may ignore the `Range` header and return the whole resource with a [200](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200) status code.
   * Older browsers used a response header of [Accept-Ranges: none](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Ranges) to disable features like 'pause' or 'resume' in download managers, but since ignoring the `Range` header has the same effect as `Accept-Ranges: none`, the header is rarely used in this way.
   *
   * Currently only [`bytes` units are registered](https://www.iana.org/assignments/http-parameters/http-parameters.xhtml#range-units) which are _offsets_ (zero-indexed & inclusive).
   * If the requested data has a [content coding](/en-US/docs/Web/HTTP/Headers/Content-Encoding) applied, each byte range represents the encoded sequence of bytes, not the bytes that would be obtained after decoding.
   *
   * The header is a [CORS-safelisted request header](/en-US/docs/Glossary/CORS-safelisted_request_header) when the directive specifies a single byte range.
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
   * The `Referer` header can contain an _origin_, _path_, and _querystring_, and may not contain [URL fragments](/en-US/docs/Web/URI/Fragment) (i.e., `#section`) or `username:password` information.
   * The request's _referrer policy_ defines the data that can be included. See [Referrer-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy) for more [information](/en-US/docs/Web/HTTP/Headers/Referrer-Policy#directives) and [examples](/en-US/docs/Web/HTTP/Headers/Referrer-Policy#examples).
   *
   * > [!NOTE]
   * > The header name "referer" is actually a misspelling of the word "referrer".
   * > See [HTTP referer on Wikipedia](https://en.wikipedia.org/wiki/HTTP_referer) for more details.
   *
   * > [!WARNING]
   * > This header may have undesirable consequences for user security and privacy.
   * > See [Referer header: privacy and security concerns](/en-US/docs/Web/Security/Referer_header:_privacy_and_security_concerns) for more information and mitigation hints.
   */
  'Referer' = 'Referer',

  /**
   * The HTTP **`Referrer-Policy`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) controls how much [referrer information](/en-US/docs/Web/Security/Referer_header:_privacy_and_security_concerns) (sent with the [Referer](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer) header) should be included with requests.
   * Aside from the HTTP header, you can [set this policy in HTML](#integration_with_html).
   */
  'Referrer-Policy' = 'Referrer-Policy',

  /**
   * The HTTP **`Refresh`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) directs a web browser to either refresh or redirect the page when a specified amount of time has passed after the page was fully loaded.
   * It is exactly equivalent to using [`
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
   */
  'Report-To' = 'Report-To',

  /**
   * The HTTP **`Reporting-Endpoints`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/response_header) allows website administrators to specify one or more endpoints that can be sent reports generated by the [Reporting API](/en-US/docs/Web/API/Reporting_API).
   *
   * The endpoints can be used, for example, as targets for sending CSP violation reports, [Cross-Origin-Opener-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy) reports, or other generic violations.
   *
   * When used for reporting [Content Security Policy (CSP)](/en-US/docs/Web/HTTP/CSP#violation_reporting) errors, the header is used in combination with the [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) header [report-to](https://developer.mozilla.org/en-US/docs/CSP/report-to) directive.
   * For more details on setting up CSP reporting, see the [Content Security Policy (CSP)](/en-US/docs/Web/HTTP/CSP#violation_reporting) documentation.
   *
   * > [!NOTE]
   * > This header replaces [Report-To](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Report-To)  for declaring endpoints, and should be used in preference.
   */
  'Reporting-Endpoints' = 'Reporting-Endpoints',

  /**
   * The **`Repr-Digest`** response or request header provides a [digest](https://developer.mozilla.org/en-US/docs/Glossary/digest) of the [selected representation](https://www.rfc-editor.org/rfc/rfc9110#section-6.4) of the target resource. It is invariant under e.g., [Content-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding) or [Content-Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Range), which do affect the [Content-Digest](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Digest). Furthermore, [Content Negotiation](/en-US/docs/Web/HTTP/Content_negotiation) can result in different selected representations with different representation digests.
   */
  'Repr-Digest' = 'Repr-Digest',

  /**
   * The **`Retry-After`** response HTTP header indicates how long
   * the user agent should wait before making a follow-up request. There are three main cases
   * this header is used:
   *
   * - When sent with a  (Service Unavailable) response, this indicates
   * how long the service is expected to be unavailable.
   * - When sent with a  (Too Many Requests) response, this indicates
   * how long to wait before making a new request.
   * - When sent with a redirect response, such as  (Moved Permanently),
   * this indicates the minimum time that the user agent is asked to wait before issuing
   * the redirected request.
   */
  'Retry-After' = 'Retry-After',

  /**
   * The **`RTT`** [Client hint](/en-US/docs/Web/HTTP/Client_hints) request header field provides the approximate round trip time on the application layer, in milliseconds. The RTT hint, unlike transport layer RTT, includes server processing time.
   *
   *
   *
   * The RTT value is rounded to the nearest 25 milliseconds to prevent [fingerprinting](/en-US/docs/Glossary/Fingerprinting). There are many other mechanisms an attacker might use to obtain similar round-trip information.
   *
   * The hint allows a server to choose what information is sent based on the network responsiveness/latency. For example, it might choose to send fewer resources.
   *
   * > [!NOTE]
   * > The [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) header is used in responses to indicate that a different resource is sent for every different value of the header (see [HTTP Caching Vary](/en-US/docs/Web/HTTP/Caching#vary)). Even if `RTT` is used to configure what resources are sent consider omitting it in the [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) header — it is likely to change often, which effectively makes the resource uncacheable.
   */
  'RTT' = 'RTT',

  /**
   * The **`Save-Data`** [network client hint](/en-US/docs/Web/HTTP/Client_hints#network_client_hints) request header field is a boolean which indicates the client's preference for reduced data usage.
   * This could be for reasons such as high transfer costs, slow connection speeds, etc.
   *
   * **`Save-Data`** is a [low entropy hint](/en-US/docs/Web/HTTP/Client_hints#low_entropy_hints), and hence may be sent by the client even if not requested by the server using an [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH) response header.
   * Further, it should be used to reduce data sent to the client irrespective of the values of other client hints that indicate network capability, like [Downlink](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Downlink) and [RTT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/RTT).
   *
   *
   *
   * A value of `On` indicates explicit user opt-in into a reduced data usage
   * mode on the client, and when communicated to origins allows them to deliver alternative
   * content to reduce the data downloaded such as smaller image and video resources,
   * different markup and styling, disabled polling and automatic updates, and so on.
   *
   * > [!NOTE]
   * > Disabling HTTP/2 Server Push ([Server Push", "8.2](https://developer.mozilla.org/en-US/docs/RFC/7540)) may reduce data downloads.
   * > Note that this feature is no longer supported by default in most major browser engines.
   */
  'Save-Data' = 'Save-Data',

  /**
   * > [!WARNING]
   * > This feature is currently opposed by two browser vendors. See the [Standards positions](/en-US/docs/Web/API/Topics_API#standards_positions) section for details of opposition.
   *
   * > [!NOTE]
   * > An [Enrollment process](/en-US/docs/Web/Privacy/Privacy_sandbox/Enrollment) is required to use this feature in your applications.
   *
   * The **`Sec-Browsing-Topics`** request header sends the selected topics for the current user along with the associated request, which are used by an ad tech platform to choose a personalized ad to display.
   *
   * If the calling site does not have the Topics API included in a successful [privacy sandbox enrollment process](/en-US/docs/Web/Privacy/Privacy_sandbox/Enrollment), attempting to create or modify `Sec-Browsing-Topics` fails silently, and any existing `Sec-Browsing-Topics` header is deleted.
   *
   * See [Using the Topics API](/en-US/docs/Web/API/Topics_API/Using) for more details.
   */
  'Sec-Browsing-Topics' = 'Sec-Browsing-Topics',

  /**
   * The **`Sec-CH-Prefers-Color-Scheme`** [user preference media feature client hint](/en-US/docs/Web/HTTP/Client_hints#user_preference_media_features_client_hints) request header provides the user's preference for light or dark color themes. A user indicates their preference through an operating system setting (for example, light or dark mode) or a user agent setting.
   *
   * If a server signals to a client via the [Accept-CH](https://developer.mozilla.org/en-US/docs/httpheader/Accept-CH) header that it accepts `Sec-CH-Prefers-Color-Scheme`, the client can then respond with this header to indicate the user's preference for a specific color scheme. The server can send the client appropriately adapted content including images or CSS to display a light or dark mode for subsequent rendered content.
   *
   * This header is modeled on the [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/cssxref/@media/prefers-color-scheme) media query.
   */
  'Sec-CH-Prefers-Color-Scheme' = 'Sec-CH-Prefers-Color-Scheme',

  /**
   * The **`Sec-CH-Prefers-Reduced-Motion`** [user agent client hint](/en-US/docs/Web/HTTP/Client_hints#user_preference_media_features_client_hints) request header indicates the user agent's preference for animations to be displayed with reduced motion.
   *
   * If a server signals to a client via the [Accept-CH](https://developer.mozilla.org/en-US/docs/httpheader/Accept-CH) header that it accepts `Sec-CH-Prefers-Reduced-Motion`, the client can then respond with this header to indicate the user's preference for reduced motion. The server can send the client appropriately adapted content, for example, JavaScript or CSS, to reduce the motion of any animations presented on subsequent rendered content. This could include reducing the speed or amplitude of movement to reduce discomfort for those with vestibular motion disorders.
   *
   * This header is modeled on the [prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/cssxref/@media/prefers-reduced-motion) media query.
   */
  'Sec-CH-Prefers-Reduced-Motion' = 'Sec-CH-Prefers-Reduced-Motion',

  /**
   * The **`Sec-CH-Prefers-Reduced-Transparency`** [user agent client hint](/en-US/docs/Web/HTTP/Client_hints#user_preference_media_features_client_hints) request header indicates the user agent's preference for reduced transparency.
   *
   * If a server signals to a client via the [Accept-CH](https://developer.mozilla.org/en-US/docs/httpheader/Accept-CH) header that it accepts `Sec-CH-Prefers-Reduced-Transparency`, the client can then respond with this header to indicate the user's preference for reduced transparency. The server can send the client appropriately adapted content — for example, CSS or images — to reduce the transparency of the content.
   *
   * This header is modeled on the [prefers-reduced-transparency](https://developer.mozilla.org/en-US/docs/cssxref/@media/prefers-reduced-transparency) media query.
   */
  'Sec-CH-Prefers-Reduced-Transparency' = 'Sec-CH-Prefers-Reduced-Transparency',

  /**
   * The **`Sec-CH-UA-Arch`** [user agent client hint](/en-US/docs/Web/HTTP/Client_hints#user-agent_client_hints) request header provides the user-agent's underlying CPU architecture, such as ARM or x86.
   *
   * This might be used by a server, for example, to select and offer the correct binary format of an executable for a user to download.
   */
  'Sec-CH-UA-Arch' = 'Sec-CH-UA-Arch',

  /**
   * The **`Sec-CH-UA-Bitness`** [user agent client hint](/en-US/docs/Web/HTTP/Client_hints#user-agent_client_hints) request header provides the "bitness" of the user-agent's underlying CPU architecture.
   * This is the size in bits of an integer or memory address—typically 64 or 32 bits.
   *
   * This might be used by a server, for example, to select and offer the correct binary format of an executable for a user to download.
   */
  'Sec-CH-UA-Bitness' = 'Sec-CH-UA-Bitness',

  /**
   * The **`Sec-CH-UA-Full-Version-List`** [user agent client hint](/en-US/docs/Web/HTTP/Client_hints#user-agent_client_hints) request header provides the user-agent's branding and full version information.
   *
   *
   *
   * The **`Sec-CH-UA-Full-Version-List`** header provides the brand and full version information for each brand associated with the browser, in a comma-separated list.
   *
   * A brand is a commercial name for the user agent like: Chromium, Opera, Google Chrome, Microsoft Edge, Firefox, and Safari.
   * A user agent might have several associated brands.
   * For example, Opera, Chrome, and Edge are all based on Chromium, and will provide both brands in the **`Sec-CH-UA-Full-Version-List`** header.
   *
   * The header therefore allows the server to customize its response based on both shared brands and on particular customizations in their specific respective builds.
   *
   * The header may include "fake" brands in any position and with any name.
   * This is a feature designed to prevent servers from rejecting unknown user agents outright, forcing user agents to lie about their brand identity.
   *
   * > [!NOTE]
   * > This is similar to [Sec-CH-UA](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-CH-UA), but includes the full version number instead of the significant version number for each brand.
   */
  'Sec-CH-UA-Full-Version-List' = 'Sec-CH-UA-Full-Version-List',

  /**
   * > [!NOTE]
   * > This is being replaced by the [Sec-CH-UA-Full-Version-List](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-CH-UA-Full-Version-List).
   *
   * The **`Sec-CH-UA-Full-Version`** [user agent client hint](/en-US/docs/Web/HTTP/Client_hints#user-agent_client_hints) request header provides the user-agent's full version string.
   */
  'Sec-CH-UA-Full-Version' = 'Sec-CH-UA-Full-Version',

  /**
   * The **`Sec-CH-UA-Mobile`** [user agent client hint](/en-US/docs/Web/HTTP/Client_hints#user-agent_client_hints) request header indicates whether the browser is on a mobile device.
   * It can also be used by a desktop browser to indicate a preference for a "mobile" user experience.
   *
   * `Sec-CH-UA-Mobile` is a [low entropy hint](/en-US/docs/Web/HTTP/Client_hints#low_entropy_hints).
   * Unless blocked by a user agent permission policy, it is sent by default, without the server opting in by sending [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH).
   */
  'Sec-CH-UA-Mobile' = 'Sec-CH-UA-Mobile',

  /**
   * The **`Sec-CH-UA-Model`** [user agent client hint](/en-US/docs/Web/HTTP/Client_hints#user-agent_client_hints) request header indicates the device model on which the browser is running.
   */
  'Sec-CH-UA-Model' = 'Sec-CH-UA-Model',

  /**
   * The **`Sec-CH-UA-Platform-Version`** [user agent client hint](/en-US/docs/Web/HTTP/Client_hints#user-agent_client_hints) request header provides the version of the operating system on which the user agent is running.
   */
  'Sec-CH-UA-Platform-Version' = 'Sec-CH-UA-Platform-Version',

  /**
   * The **`Sec-CH-UA-Platform`** [user agent client hint](/en-US/docs/Web/HTTP/Client_hints#user-agent_client_hints) request header provides the platform or operating system on which the user agent is running.
   * For example: "Windows" or "Android".
   *
   * `Sec-CH-UA-Platform` is a [low entropy hint](/en-US/docs/Web/HTTP/Client_hints#low_entropy_hints).
   * Unless blocked by a user agent permission policy, it is sent by default (without the server opting in by sending [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH)).
   */
  'Sec-CH-UA-Platform' = 'Sec-CH-UA-Platform',

  /**
   * The **`Sec-CH-UA`** [user agent client hint](/en-US/docs/Web/HTTP/Client_hints#user-agent_client_hints) request header provides the user-agent's branding and significant version information.
   *
   *
   *
   * The **`Sec-CH-UA`** header provides the brand and significant version for each brand associated with the browser in a comma-separated list.
   *
   * A brand is a commercial name for the user agent like: Chromium, Opera, Google Chrome, Microsoft Edge, Firefox, and Safari.
   * A user agent might have several associated brands.
   * For example, Opera, Chrome, and Edge are all based on Chromium, and will provide both brands in the **`Sec-CH-UA`** header.
   *
   * The _significant version_ is the "marketing" version identifier that is used to distinguish between major releases of the brand.
   * For example a Chromium build with _full version number_ "96.0.4664.45" has a significant version number of "96".
   *
   * The header therefore allows the server to customize its response based on both shared brands and on particular customizations in their respective versions.
   *
   * `Sec-CH-UA` is a [low entropy hint](/en-US/docs/Web/HTTP/Client_hints#low_entropy_hints).
   * Unless blocked by a user agent permission policy, it is sent by default, without the server opting in by sending [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH).
   *
   * The header may include "fake" brands in any position and with any name.
   * This is a feature designed to prevent servers from rejecting unknown user agents outright, forcing user agents to lie about their brand identity.
   *
   * > **Note:** [Sec-CH-UA-Full-Version-List](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-CH-UA-Full-Version-List) is the same as **`Sec-CH-UA`**, but includes the full version number rather than the significant version number for each brand.
   */
  'Sec-CH-UA' = 'Sec-CH-UA',

  /**
   * The **`Sec-Fetch-Dest`** [fetch metadata request header](https://developer.mozilla.org/en-US/docs/Glossary/Fetch_metadata_request_header) indicates the request's _destination_. That is the initiator of the original fetch request, which is where (and how) the fetched data will be used.
   *
   * This allows servers to determine whether to service a request based on whether it is appropriate for how it is _expected_ to be used. For example, a request with an `audio` destination should request audio data, not some other type of resource (for example, a document that includes sensitive user information).
   */
  'Sec-Fetch-Dest' = 'Sec-Fetch-Dest',

  /**
   * The **`Sec-Fetch-Mode`** [fetch metadata request header](https://developer.mozilla.org/en-US/docs/Glossary/Fetch_metadata_request_header) indicates the [mode](/en-US/docs/Web/API/Request/mode) of the request.
   *
   * Broadly speaking, this allows a server to distinguish between: requests originating from a user navigating between HTML pages, and requests to load images and other resources. For example, this header would contain `navigate` for top level navigation requests, while `no-cors` is used for loading an image.
   */
  'Sec-Fetch-Mode' = 'Sec-Fetch-Mode',

  /**
   * The **`Sec-Fetch-Site`** [fetch metadata request header](https://developer.mozilla.org/en-US/docs/Glossary/Fetch_metadata_request_header) indicates the relationship between a request initiator's origin and the origin of the requested resource.
   *
   * In other words, this header tells a server whether a request for a resource is coming from the same origin, the same site, a different site, or is a "user initiated" request. The server can then use this information to decide if the request should be allowed.
   *
   * Same-origin requests would usually be allowed by default, but what happens for requests from other origins may further depend on what resource is being requested, or information in other [Fetch metadata request headers](https://developer.mozilla.org/en-US/docs/Glossary/Fetch_metadata_request_header). By default, requests that are not accepted should be rejected with a [403](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403) response code.
   */
  'Sec-Fetch-Site' = 'Sec-Fetch-Site',

  /**
   * The **`Sec-Fetch-User`** [fetch metadata request header](https://developer.mozilla.org/en-US/docs/Glossary/Fetch_metadata_request_header) is only sent for requests initiated by user activation, and its value will always be `?1`.
   *
   * A server can use this header to identify whether a navigation request from a document, iframe, etc., was originated by the user.
   */
  'Sec-Fetch-User' = 'Sec-Fetch-User',

  /**
   * The **`Sec-GPC`** ([**G**lobal **P**rivacy **C**ontrol](https://globalprivacycontrol.org/)) request header indicates whether the user consents to a website or service selling or sharing their personal information with third parties.
   *
   * The specification does not define how the user can withdraw or grant consent for website.
   * Where possible the mechanism will be indicated in the [browser compatibility](#browser_compatibility) section below.
   */
  'Sec-GPC' = 'Sec-GPC',

  /**
   * The **`Sec-Purpose`** [fetch metadata request header](https://developer.mozilla.org/en-US/docs/Glossary/Fetch_metadata_request_header) indicates the purpose for which the requested resource will be used, when that purpose is something other than immediate use by the user-agent.
   *
   * The only purpose that is currently defined is `prefetch`, which indicates that the resource is being requested in anticipation that it will be needed by a page that is likely to be navigated to in the near future, such as a page linked in search results or a link that a user has hovered over.
   * The server can use this knowledge to: adjust the caching expiry for the request, disallow the request, or perhaps to treat it differently when counting page visits.
   *
   * The header is sent when a page is loaded that has a [`
   */
  'Sec-Purpose' = 'Sec-Purpose',

  /**
   * The **Sec-WebSocket-Accept** HTTP [response header](https://developer.mozilla.org/en-US/docs/glossary/response_header) is used in the [WebSocket](/en-US/docs/Web/API/WebSockets_API) opening [handshake](/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers#the_websocket_handshake) to indicate that the server is willing to upgrade to a WebSocket connection.
   *
   * This header must appear no more than once in the response, and has a directive value that is calculated from the [Sec-WebSocket-Key](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-WebSocket-Key) request header sent in the corresponding request.
   */
  'Sec-WebSocket-Accept' = 'Sec-WebSocket-Accept',

  /**
   * The **Sec-WebSocket-Extensions** HTTP [request](https://developer.mozilla.org/en-US/docs/glossary/request_header) and [response header](https://developer.mozilla.org/en-US/docs/glossary/response_header) is used in the [WebSocket](/en-US/docs/Web/API/WebSockets_API) opening [handshake](/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers#the_websocket_handshake) to negotiate a protocol extension used by the client and server.
   *
   * In a request the header specifies one or more extensions that the web application would like to use, in order of preference.
   * These can be added as in multiple headers, or as comma separate values added to a single header.
   *
   * In a response the header can only appear once, where it specifies the extension selected by the server from the client's preferences.
   * This value must be the first extension that the server supports from the list provided in the request header.
   *
   * The request header is automatically added by the browser based on its own capabilities, and does not depend on parameters passed to the constructor when the `WebSocket` is created.
   */
  'Sec-WebSocket-Extensions' = 'Sec-WebSocket-Extensions',

  /**
   * The **Sec-WebSocket-Key** HTTP [request header](https://developer.mozilla.org/en-US/docs/glossary/request_header) is used in the [WebSocket](/en-US/docs/Web/API/WebSockets_API) opening [handshake](/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers#the_websocket_handshake) to allow a client (user agent) to confirm that it "really wants" to request that an HTTP client is upgraded to become a WebSocket.
   *
   * The value of the key is computed using an algorithm defined in the WebSocket specification, so this _does not provide security_.
   * Instead, it helps to prevent non-WebSocket clients from inadvertently, or through misuse, requesting a WebSocket connection.
   *
   * This header is automatically added by user agents when a script opens a WebSocket; it cannot be added using the [fetch()](https://developer.mozilla.org/en-US/docs/domxref/Window/fetch) or [XMLHttpRequest.setRequestHeader()](https://developer.mozilla.org/en-US/docs/domxref/XMLHttpRequest.setRequestHeader()) methods.
   *
   * The server's [Sec-WebSocket-Accept](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-WebSocket-Accept) response header should include a value computed based upon the specified key value.
   * The user agent can then validate this before this before confirming the connection.
   */
  'Sec-WebSocket-Key' = 'Sec-WebSocket-Key',

  /**
   * The **`Sec-WebSocket-Protocol`** HTTP [request](https://developer.mozilla.org/en-US/docs/glossary/request_header) and [response header](https://developer.mozilla.org/en-US/docs/glossary/response_header) is used in the [WebSocket](/en-US/docs/Web/API/WebSockets_API) opening [handshake](/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers#the_websocket_handshake) to negotiate a [sub-protocol](/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers#subprotocols) to use in the communication.
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
   */
  'Sec-WebSocket-Protocol' = 'Sec-WebSocket-Protocol',

  /**
   * The **Sec-WebSocket-Version** HTTP [request](https://developer.mozilla.org/en-US/docs/glossary/request_header) and [response header](https://developer.mozilla.org/en-US/docs/glossary/response_header) is used in the [WebSocket](/en-US/docs/Web/API/WebSockets_API) opening [handshake](/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers#the_websocket_handshake) to indicate the WebSocket protocol supported by the client, and the protocol versions supported by the server if it does _not_ support the version specified in the request.
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
   */
  'Sec-WebSocket-Version' = 'Sec-WebSocket-Version',

  /**
   * The **`Server-Timing`** header communicates one or more metrics and descriptions for a given request-response cycle. It is used to surface any backend server timing metrics (e.g. database read/write, CPU time, file system access, etc.) in the developer tools in the user's browser or in the [PerformanceServerTiming](https://developer.mozilla.org/en-US/docs/domxref/PerformanceServerTiming) interface.
   */
  'Server-Timing' = 'Server-Timing',

  /**
   * The **`Server`** header describes the software used by the origin server that handled the request and generated a response.
   *
   * The benefits of advertising the server type and version via this header are that it helps with analytics and identifying how widespread specific interoperability issues are.
   * Historically, clients have used the server version information to avoid known limitations, such as inconsistent support for [range requests](/en-US/docs/Web/HTTP/Range_requests) in specific software versions.
   *
   * > [!WARNING]
   * > The presence of this header in responses, especially when it contains fine-grained implementation details about server software, may make known vulnerabilities easier to detect.
   *
   * Too much detail in the `Server` header is not advised for response latency and the security reason mentioned above.
   * It's debatable whether obscuring the information in this header provides much benefit because fingerprinting server software is possible via other means.
   * In general, a more robust approach to server security is to ensure software is regularly updated or patched against known vulnerabilities instead.
   */
  'Server' = 'Server',

  /**
   * The **`Service-Worker-Navigation-Preload`** request header indicates that the request was the result of a [fetch()](https://developer.mozilla.org/en-US/docs/domxref/Window/fetch) operation made during service worker navigation preloading.
   * It allows a server to respond with a different resource than for a normal `fetch()`.
   *
   * If a different response may result from setting this header, the server must set `Vary: Service-Worker-Navigation-Preload` to ensure that the different responses are cached.
   *
   * For more information see [NavigationPreloadManager.setHeaderValue()](https://developer.mozilla.org/en-US/docs/domxref/NavigationPreloadManager.setHeaderValue()) (and [NavigationPreloadManager](https://developer.mozilla.org/en-US/docs/domxref/NavigationPreloadManager)).
   */
  'Service-Worker-Navigation-Preload' = 'Service-Worker-Navigation-Preload',

  /**
   * The **`Set-Cookie`** HTTP response header is used to send a cookie from the server to the user agent, so that the user agent can send it back to the server later.
   * To send multiple cookies, multiple **`Set-Cookie`** headers should be sent in the same response.
   *
   * > [!WARNING]
   * > Browsers block frontend JavaScript code from accessing the `Set-Cookie` header, as required by the Fetch spec, which defines `Set-Cookie` as a [forbidden response-header name](https://fetch.spec.whatwg.org/#forbidden-response-header-name) that [must be filtered out](https://fetch.spec.whatwg.org/#ref-for-forbidden-response-header-name%E2%91%A0) from any response exposed to frontend code.
   * >
   * > When a [Fetch API](/en-US/docs/Web/API/Fetch_API/Using_Fetch) or [XMLHttpRequest API](/en-US/docs/Web/API/XMLHttpRequest_API) request [uses CORS](/en-US/docs/Web/HTTP/CORS#what_requests_use_cors), browsers will ignore `Set-Cookie` headers present in the server's response unless the request includes credentials. Visit [Using the Fetch API - Including credentials](/en-US/docs/Web/API/Fetch_API/Using_Fetch#including_credentials) and the [XMLHttpRequest article](/en-US/docs/Web/API/XMLHttpRequest_API) to learn how to include credentials.
   *
   * For more information, see the guide on [Using HTTP cookies](/en-US/docs/Web/HTTP/Cookies).
   */
  'Set-Cookie' = 'Set-Cookie',

  /**
   * The **`Set-Login`** [response header](https://developer.mozilla.org/en-US/docs/Glossary/Response_header) is sent by a federated identity provider (IdP) to set its login status — by this, we mean "whether any users are logged into the IdP on the current browser or not". This is stored by the browser and used by the [FedCM API](/en-US/docs/Web/API/FedCM_API) to reduce the number of requests it makes to the IdP (because it does not need to waste time requesting accounts when there are no users logged in to the IdP). It also mitigates [potential timing attacks](https://github.com/w3c-fedid/FedCM/issues/447).
   *
   * The header may be set on any response resulting from a top-level navigation or a same-origin subresource request on the IdP's origin site — basically, any interaction with the IdP site may result in this header being set, and the login status being stored by the browser.
   *
   * See [Update login status using the Login Status API](/en-US/docs/Web/API/FedCM_API/IDP_integration#update_login_status_using_the_login_status_api) for more information about FedCM login status.
   */
  'Set-Login' = 'Set-Login',

  /**
   * The **`SourceMap`** [HTTP](/en-US/docs/Web/HTTP) response header links generated code to a [source map](https://firefox-source-docs.mozilla.org/devtools-user/debugger/how_to/use_a_source_map/index.html), enabling the browser to reconstruct the original source and present the reconstructed original in the debugger.
   */
  'SourceMap' = 'SourceMap',

  /**
   * The **`Speculation-Rules`** response header provides one or more URLs pointing to text resources containing speculation rule JSON definitions. When the response is an HTML document, these rules will be added to the document's speculation rule set. See the [Speculation Rules API](/en-US/docs/Web/API/Speculation_Rules_API) for more information.
   *
   * The resource file containing the speculation rules JSON can have any valid name and extension, but it must be served with an `application/speculationrules+json` MIME type.
   *
   * > [!NOTE]
   * > This mechanism provides an alternative to specifying the JSON definition inside an inline [`
   */
  'Speculation-Rules' = 'Speculation-Rules',

  /**
   * The HTTP **`Strict-Transport-Security`** response header (often abbreviated as [HSTS](https://developer.mozilla.org/en-US/docs/Glossary/HSTS)) informs browsers that the site should only be accessed using HTTPS, and that any future attempts to access it using HTTP should automatically be converted to HTTPS.
   *
   * > [!NOTE]
   * > This is more secure than simply configuring a HTTP to HTTPS (301) redirect on your server, where the initial HTTP connection is still vulnerable to a man-in-the-middle attack.
   */
  'Strict-Transport-Security' = 'Strict-Transport-Security',

  /**
   * The **`Supports-Loading-Mode`** header allows a response to opt-in to being loaded in a novel, higher-risk context that it would otherwise fail to be loaded in.
   */
  'Supports-Loading-Mode' = 'Supports-Loading-Mode',

  /**
   * The **`TE`** request header specifies the transfer encodings
   * the user agent is willing to accept. (you could informally call it
   * `Accept-Transfer-Encoding`, which would be more intuitive).
   *
   * > [!NOTE]
   * > In
   * > [HTTP/2](https://httpwg.org/specs/rfc9113.html#ConnectionSpecific) and
   * > [HTTP/3](https://httpwg.org/specs/rfc9114.html#header-formatting), the `TE`
   * > header field is only accepted if the `trailers` value is set.
   *
   * See also the [Transfer-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Transfer-Encoding) response header for more details on
   * transfer encodings. Note that `chunked` is always acceptable for HTTP/1.1
   * recipients and you don't have to specify `"chunked"` using the
   * `TE` header. However, it is useful for setting if the client is accepting
   * trailer fields in a chunked transfer coding using the "trailers" value.
   */
  'TE' = 'TE',

  /**
   * The **`Timing-Allow-Origin`** response header specifies origins that are allowed to see values of attributes retrieved via features of the [Resource Timing API](/en-US/docs/Web/API/Performance_API/Resource_timing), which would otherwise be reported as zero due to cross-origin restrictions.
   */
  'Timing-Allow-Origin' = 'Timing-Allow-Origin',

  /**
   * > [!NOTE]
   * > The DNT (Do Not Track) specification has been discontinued. See [Navigator.doNotTrack](https://developer.mozilla.org/en-US/docs/domxref/Navigator.doNotTrack) for more information.
   *
   * The **`Tk`** response header indicates the tracking status that
   * applied to the corresponding request.
   */
  'Tk' = 'Tk',

  /**
   * The **Trailer** response header allows the sender to include additional
   * fields at the end of chunked messages in order to supply metadata that might be
   * dynamically generated while the message body is sent, such as a message integrity check,
   * digital signature, or post-processing status.
   *
   * > [!NOTE]
   * > The [TE](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/TE) request header needs to be set to "trailers" to allow
   * > trailer fields.
   */
  'Trailer' = 'Trailer',

  /**
   * The **`Transfer-Encoding`** header specifies the form of encoding used to transfer messages between nodes on the network.
   *
   * > [!WARNING]
   * > HTTP/2 disallows all uses of the Transfer-Encoding header other than the HTTP/2 specific: `"trailers"`.
   * > HTTP/2 and later provides its own more efficient mechanisms for data streaming than chunked transfer and forbids the use of the header.
   * > Usage of the header in HTTP/2 may likely result in a specific `protocol error` as HTTP/2 Protocol prohibits the use.
   *
   * `Transfer-Encoding` is a [hop-by-hop header](/en-US/docs/Web/HTTP/Headers#hop-by-hop_headers), that is applied to a message between two nodes, not to a resource itself.
   * Each segment of a multi-node connection can use different `Transfer-Encoding` values.
   * If you want to compress data over the whole connection, use the end-to-end [Content-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding) header instead.
   *
   * When present on a response to a [HEAD](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/HEAD) request that has no body, it indicates the value that would have applied to the corresponding [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) message.
   */
  'Transfer-Encoding' = 'Transfer-Encoding',

  /**
   * The HTTP **`Upgrade-Insecure-Requests`** request header sends a signal to the server expressing the client's preference for an encrypted and authenticated response, and that it can successfully handle the [upgrade-insecure-requests](https://developer.mozilla.org/en-US/docs/CSP/upgrade-insecure-requests) [CSP](/en-US/docs/Web/HTTP/CSP) directive.
   */
  'Upgrade-Insecure-Requests' = 'Upgrade-Insecure-Requests',

  /**
   * The HTTP 1.1 (only) `Upgrade` header can be used to upgrade an already established client/server connection to a different protocol (over the same transport protocol). For example, it can be used by a client to upgrade a connection from HTTP 1.1 to HTTP 2.0, or an HTTP or HTTPS connection into a WebSocket.
   *
   * > [!WARNING]
   * > HTTP/2 explicitly disallows the use of this mechanism/header; it is specific to HTTP/1.1.
   */
  'Upgrade' = 'Upgrade',

  /**
   * The **User-Agent** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) is a characteristic string that lets servers and network peers identify the application, operating system, vendor, and/or version of the requesting [user agent](https://developer.mozilla.org/en-US/docs/Glossary/user_agent).
   *
   * > [!WARNING]
   * > Please read [Browser detection using the user agent](/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent) for why serving different Web pages or services to different browsers is usually a bad idea.
   */
  'User-Agent' = 'User-Agent',

  /**
   * The **`Vary`** HTTP response header describes the parts of the request message aside from the method and URL that influenced the content of the response it occurs in. Most often, this is used to create a cache key when [content negotiation](/en-US/docs/Web/HTTP/Content_negotiation) is in use.
   *
   * The same `Vary` header value should be used on all responses for a given URL, including [304](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/304) `Not Modified` responses and the "default" response.
   */
  'Vary' = 'Vary',

  /**
   * The **`Via`** general header is added by proxies, both forward
   * and reverse, and can appear in the request or response headers. It
   * is used for tracking message forwards, avoiding request loops, and identifying the
   * protocol capabilities of senders along the request/response chain.
   */
  'Via' = 'Via',

  /**
   * The **`Viewport-Width`** [device client hint](/en-US/docs/Web/HTTP/Client_hints) request header provides the client's layout viewport width in [CSS pixels](https://developer.mozilla.org/en-US/docs/Glossary/CSS_pixel). The value is rounded up to the smallest following integer (i.e. ceiling value).
   *
   *
   *
   * The hint can be used with other screen-specific hints to deliver images optimized for a specific screen size, or to omit resources that are not needed for a particular screen width.
   *
   * If the `Viewport-Width` header appears more than once in a message the last occurrence is used.
   *
   * > [!NOTE]
   * >
   * > - Client Hints are accessible only on secure origins (via TLS).
   * > - A server has to opt in to receive the `Viewport-Width` header from the client, by sending the [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH) response header.
   * > - Servers that opt in to the `Viewport-Width` client hint will typically also specify it in the [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) header. This informs caches that the server may send different responses based on the header value in a request.
   * > - `Viewport-Width` was removed from the original client hints specification in [draft-ietf-httpbis-client-hints-07](https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-client-hints-07). The proposed replacement is [`Sec-CH-Viewport-Width`](https://wicg.github.io/responsive-image-client-hints/#sec-ch-viewport-width) (Responsive Image Client Hints).
   */
  'Viewport-Width' = 'Viewport-Width',

  /**
   * The **`Want-Content-Digest`** request or response header states the wish for a [Content-Digest](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Digest) header. It is the `Content-` analogue of [Want-Repr-Digest](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Want-Repr-Digest).
   */
  'Want-Content-Digest' = 'Want-Content-Digest',

  /**
   * > [!NOTE]
   * > This header was removed from the specification in [draft 8](https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-digest-headers-08).
   * > Use [Want-Content-Digest](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Want-Content-Digest) instead.
   * > For `id-*` digest algorithms, use [Want-Repr-Digest](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Want-Repr-Digest).
   *
   * The **`Want-Digest`** request or response HTTP header requests the other side to provide a [digest](https://developer.mozilla.org/en-US/docs/Glossary/digest) using the [Digest](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Digest) header.
   *
   * The header contains identifiers for one or more digest algorithms that the sender wishes the server to use to create the digest.
   * The request may use [quality values](https://developer.mozilla.org/en-US/docs/Glossary/quality_values) to indicate its preference/order for particular digest algorithms.
   *
   * If `Want-Digest` does not include any digest algorithms that the server supports, the server may respond with:
   *
   * - a digest calculated using a different digest algorithm, or
   * - a [`400 Bad Request`](/en-US/docs/Web/HTTP/Status/400) error, and include another `Want-Digest` header with that response, listing the algorithms that it does support.
   *
   * See also the [Digest](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Digest) header.
   */
  'Want-Digest' = 'Want-Digest',

  /**
   * The **`Want-Repr-Digest`** request or response header states the wish for a [Repr-Digest](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Repr-Digest) header.
   */
  'Want-Repr-Digest' = 'Want-Repr-Digest',

  /**
   * > [!NOTE]
   * > The header was deprecated because it is not widely generated or surfaced to users (see [RFC9111](https://www.rfc-editor.org/rfc/rfc9111#field.warning)).
   * > Some of the information can be inferred from other headers such as [Age](https://developer.mozilla.org/en-US/docs/httpheader/Age).
   *
   * The **`Warning`** HTTP header contains information about possible problems with the status of the message.
   * More than one `Warning` header may appear in a response.
   *
   * `Warning` header fields can, in general, be applied to any message.
   * However, some warn-codes are specific to caches and can only be applied to response messages.
   */
  'Warning' = 'Warning',

  /**
   * The **`Width`** [device client hint](/en-US/docs/Web/HTTP/Client_hints#device_client_hints) request header field indicates the desired resource width in physical pixels — the intrinsic size of an image. The provided pixel value is a number rounded to the smallest following integer (i.e. ceiling value).
   *
   *
   *
   * The hint is particularly useful because it allows the client to request a resource that is optimal for both the screen and the layout: taking into account both the density-corrected width of the screen and the image's extrinsic size within the layout.
   *
   * If the desired resource width is not known at the time of the request or the resource does not have a display width, the `Width` header field can be omitted.
   *
   * If the `Width` header appears more than once in a message the last occurrence is used.
   *
   * > [!NOTE]
   * >
   * > - Client Hints are accessible only on secure origins (via TLS).
   * > - A server has to opt in to receive the `Width` header from the client, by sending the [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH) response header.
   * > - Servers that opt in to the `Width` client hint will typically also specify it in the [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) header. This informs caches that the server may send different responses based on the header value in a request.
   * > - `Width` was removed from the client hints specification in [draft-ietf-httpbis-client-hints-07](https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-client-hints-07). The proposed replacement is [`Sec-CH-Width`](https://wicg.github.io/responsive-image-client-hints/#sec-ch-width) (Responsive Image Client Hints).
   */
  'Width' = 'Width',

  /**
   * The HTTP **`WWW-Authenticate`** response header defines the [HTTP authentication](/en-US/docs/Web/HTTP/Authentication) methods ("challenges") that might be used to gain access to a specific resource.
   *
   * > [!NOTE]
   * > This header is part of the [General HTTP authentication framework](/en-US/docs/Web/HTTP/Authentication#the_general_http_authentication_framework), which can be used with a number of [authentication schemes](/en-US/docs/Web/HTTP/Authentication#authentication_schemes).
   * > Each "challenge" lists a scheme supported by the server and additional parameters that are defined for that scheme type.
   *
   * A server using [HTTP authentication](/en-US/docs/Web/HTTP/Authentication) will respond with a [401](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401) `Unauthorized` response to a request for a protected resource.
   * This response must include at least one `WWW-Authenticate` header and at least one [challenge](https://developer.mozilla.org/en-US/docs/Glossary/challenge), to indicate what authentication schemes can be used to access the resource (and any additional data that each particular scheme needs).
   *
   * Multiple challenges are allowed in one `WWW-Authenticate` header, and multiple `WWW-Authenticate` headers are allowed in one response.
   * A server may also include the `WWW-Authenticate` header in other response messages to indicate that supplying credentials might affect the response.
   *
   * After receiving the `WWW-Authenticate` header, a client will typically prompt the user for credentials, and then re-request the resource.
   * This new request uses the [Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization) header to supply the credentials to the server, encoded appropriately for the selected "challenge" authentication method.
   * The client is expected to select the most secure of the challenges it understands (note that in some cases the "most secure" method is debatable).
   */
  'WWW-Authenticate' = 'WWW-Authenticate',

  /**
   * The **`X-Content-Type-Options`** response HTTP header is a
   * marker used by the server to indicate that the [MIME types](/en-US/docs/Web/HTTP/MIME_types) advertised in the
   * [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) headers should be followed and not be changed. The header allows you to avoid [MIME type sniffing](/en-US/docs/Web/HTTP/MIME_types#mime_sniffing) by saying that the MIME types are deliberately
   * configured.
   *
   * This header was introduced by Microsoft in IE 8 as a way for webmasters to block
   * content sniffing that was happening and could transform non-executable MIME types into
   * executable MIME types. Since then, other browsers have introduced it, even if their MIME
   * sniffing algorithms were less aggressive.
   *
   * Starting with Firefox 72, top-level
   * documents also avoid MIME sniffing (if [Content-type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-type) is provided). This can cause HTML web pages
   * to be downloaded instead of being rendered when they are served with a MIME type other
   * than `text/html`. Make sure to set both headers correctly.
   *
   * Site security testers usually expect this header to be set.
   *
   * > **Note:** `X-Content-Type-Options` only apply request-blocking [due to `nosniff`](https://fetch.spec.whatwg.org/#ref-for-determine-nosniff) for [request destinations](/en-US/docs/Web/API/Request/destination) of `"script"` and `"style"`.
   * > However, it also [enables Cross-Origin Read Blocking (CORB)](https://chromium.googlesource.com/chromium/src/+/master/services/network/cross_origin_read_blocking_explainer.md#determining-whether-a-response-is-corb_protected) protection for HTML, TXT, JSON and XML files (excluding SVG `image/svg+xml`).
   */
  'X-Content-Type-Options' = 'X-Content-Type-Options',

  /**
   * The **`X-DNS-Prefetch-Control`** HTTP response header controls
   * DNS prefetching, a feature by which browsers proactively perform domain name resolution
   * on both links that the user may choose to follow as well as URLs for items referenced by
   * the document, including images, CSS, JavaScript, and so forth.
   *
   * This prefetching is performed in the background, so that the [DNS](https://developer.mozilla.org/en-US/docs/glossary/DNS) is
   * likely to have been resolved by the time the referenced items are needed. This reduces
   * latency when the user clicks a link.
   */
  'X-DNS-Prefetch-Control' = 'X-DNS-Prefetch-Control',

  /**
   * The **`X-Forwarded-For`** (XFF) request header is a de-facto standard header for identifying the originating IP address of a client connecting to a web server through a proxy server.
   *
   * > [!WARNING]
   * > Improper use of this header can be a security risk. For details, see the [Security and privacy concerns](#security_and_privacy_concerns) section.
   *
   * When a client connects directly to a server, the
   * client's IP address is sent to the server (and is often written to server
   * access logs). But if a client connection passes through any [forward or reverse](https://en.wikipedia.org/wiki/Proxy_server) proxies, the server only
   * sees the final proxy's IP address, which is often of little use. That's especially true if
   * the final proxy is a load balancer which is part of the same installation
   * as the server. So, to provide a more-useful client IP address to the server, the `X-Forwarded-For` request header is
   * used.
   *
   * For detailed guidance on using this header, see the [Parsing](#parsing) and [Selecting an IP address](#selecting_an_ip_address) sections.
   *
   *
   *
   * A standardized version of this header is the HTTP [Forwarded](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Forwarded) header.
   */
  'X-Forwarded-For' = 'X-Forwarded-For',

  /**
   * The **`X-Forwarded-Host`** (XFH) header is a de-facto standard
   * header for identifying the original host requested by the client in the
   * [Host](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Host) HTTP request header.
   *
   * Host names and ports of reverse proxies (load balancers, CDNs) may differ from the
   * origin server handling the request, in that case the `X-Forwarded-Host`
   * header is useful to determine which Host was originally used.
   */
  'X-Forwarded-Host' = 'X-Forwarded-Host',

  /**
   * The **`X-Forwarded-Proto`** (XFP) header is a de-facto standard
   * header for identifying the protocol (HTTP or HTTPS) that a client used to connect to
   * your proxy or load balancer. Your server access logs contain the protocol used between
   * the server and the load balancer, but not the protocol used between the client and the
   * load balancer. To determine the protocol used between the client and the load balancer,
   * the `X-Forwarded-Proto` request header can be used.
   *
   * A standardized version of this header is the HTTP [Forwarded](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Forwarded) header.
   */
  'X-Forwarded-Proto' = 'X-Forwarded-Proto',

  /**
   * > [!WARNING]
   * > Instead of this header, use the [frame-ancestors](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors) directive in a [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) header.
   *
   * The **`X-Frame-Options`** [HTTP](/en-US/docs/Web/HTTP) response header can be used to indicate whether a browser should be allowed to render a page in a [frame](https://developer.mozilla.org/en-US/docs/HTMLElement/frame), [iframe](https://developer.mozilla.org/en-US/docs/HTMLElement/iframe), [embed](https://developer.mozilla.org/en-US/docs/HTMLElement/embed) or [object](https://developer.mozilla.org/en-US/docs/HTMLElement/object). Sites can use this to avoid [click-jacking](/en-US/docs/Web/Security/Types_of_attacks#click-jacking) attacks, by ensuring that their content is not embedded into other sites.
   *
   * The added security is provided only if the user accessing the document is using a browser that supports `X-Frame-Options`.
   */
  'X-Frame-Options' = 'X-Frame-Options',

  /**
   * The HTTP **`X-XSS-Protection`** response header was a feature of Internet Explorer, Chrome and Safari that stopped pages from loading when they detected reflected cross-site scripting ([XSS](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting)) attacks. These protections are largely unnecessary in modern browsers when sites implement a strong [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) that disables the use of inline JavaScript (`'unsafe-inline'`).
   *
   * > [!WARNING]
   * > Even though this feature can protect users of older web browsers that don't yet support [CSP](https://developer.mozilla.org/en-US/docs/Glossary/CSP), in some cases, **XSS protection can create XSS vulnerabilities** in otherwise safe websites. See the section below for more information.
   *
   * > [!NOTE]
   * >
   * > - Chrome has [removed their XSS Auditor](https://chromestatus.com/feature/5021976655560704)
   * > - Firefox has not, and [will not implement `X-XSS-Protection`](https://bugzil.la/528661)
   * > - Edge has [retired their XSS filter](https://blogs.windows.com/windows-insider/2018/07/25/announcing-windows-10-insider-preview-build-17723-and-build-18204/)
   * >
   * > This means that if you do not need to support legacy browsers, it is recommended that you use [`Content-Security-Policy`](/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) without allowing `unsafe-inline` scripts instead.
   */
  'X-XSS-Protection' = 'X-XSS-Protection',
}
