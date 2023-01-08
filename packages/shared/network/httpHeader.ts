export enum HttpHeader {
  /**
   * > **Warning:** The header was removed from the specification in [draft 8](https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-client-hints-08).
   *
   * The **`Accept-CH-Lifetime`** header is set by the server to
   * specify the persistence of the [client hint headers](/en-US/docs/Web/HTTP/Client_hints) it specified using [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH), that the client should
   * include in subsequent requests.
   *
   *
   *
   * > **Note:** Client Hints are accessible only on secure origins (via TLS).
   * > [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH) and [Accept-CH-Lifetime](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH-Lifetime) headers should be persisted for all secure requests
   * > to ensure Client Hints are sent reliably.
   */
  'Accept-CH-Lifetime' = 'Accept-CH-Lifetime',
  /**
   * The **`Accept-CH`** header may be set by a server to specify
   * which [client hints](/en-US/docs/Web/HTTP/Client_hints) headers a client
   * should include in subsequent requests.
   *
   *
   *
   * > **Note:** Client hints are accessible only on secure origins (via TLS).
   * > `Accept-CH` (and `Accept-CH-Lifetime`) headers should be persisted for all secure requests to ensure client hints are sent reliably.
   */
  'Accept-CH' = 'Accept-CH',
  /**
   * > **Warning:** Do not use this header. Browsers omit this header and servers should ignore it.
   *
   * The **`Accept-Charset`** request HTTP header was a header that advertised a client's supported [character encodings](https://developer.mozilla.org/en-US/docs/glossary/character_encoding). It is no longer widely used.
   *
   * UTF-8 is well-supported and the overwhelmingly preferred choice for character encoding. To [guarantee better privacy through less configuration-based entropy](https://www.eff.org/deeplinks/2010/01/primer-information-theory-and-privacy), all browsers omit the `Accept-Charset` header. Chrome, Firefox, Internet Explorer, Opera, and Safari abandoned this header.
   *
   * Today, `Accept-Charset` is most notable for being one of several [forbidden header names](/en-US/docs/Glossary/Forbidden_header_name).
   */
  'Accept-Charset' = 'Accept-Charset',
  /**
   * The **`Accept-Encoding`** request HTTP header indicates the content encoding (usually a compression algorithm) that the client can understand. The server uses [content negotiation](/en-US/docs/Web/HTTP/Content_negotiation) to select one of the proposals and informs the client of that choice with the [Content-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding) response header.
   *
   * Even if both the client and the server support the same compression algorithms, the server may choose not to compress the body of a response if the `identity` value is also acceptable. Two common cases lead to this:
   *
   * - The data to be sent is already compressed, therefore a second compression will not reduce the transmitted data size. This is true for pre-compressed image formats (JPEG, for instance);
   * - The server is overloaded and cannot allocate computing resources to perform the compression. For example, Microsoft recommends not to compress if a server uses more than 80% of its computational power.
   *
   * As long as the `identity;q=0` or `*;q=0` directives do not explicitly forbid the `identity` value that means no encoding, the server must never return a [406](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/406) `Not Acceptable` error.
   *
   * > **Note:**
   * >
   * > - An IANA registry maintains [a complete list of official content encodings](https://www.iana.org/assignments/http-parameters/http-parameters.xml#http-parameters-1).
   * > - Two other content encodings, namely `bzip` and `bzip2`, are sometimes used, These non-standard encodings implement the algorithm that these two UNIX programs use. Note that `bzip` was discontinued due to patent licensing issues.
   */
  'Accept-Encoding' = 'Accept-Encoding',
  /**
   * The **`Accept-Language`** request HTTP header indicates the natural language and locale that the client prefers.
   * The server uses [content negotiation](/en-US/docs/Web/HTTP/Content_negotiation) to select one of the proposals and informs the client of the choice with the [Content-Language](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Language) response header. Browsers set required values for this header according to their active user interface language. Users rarely change it, and such changes are not recommended because they may lead to fingerprinting.
   *
   * This header serves as a hint when the server cannot determine the target content language otherwise (for example, use a specific URL that depends on an explicit user decision). The server should never override an explicit user language choice. The content of `Accept-Language` is often out of a user's control (when traveling, for instance). A user may also want to visit a page in a language different from the user interface language.
   *
   * The server possibly can send back a [406](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/406) (Not Acceptable) error code when unable to serve content in a matching language. However, such a behavior is rarely implemented for a better user experience, and servers often ignore the `Accept-Language` header in such cases.
   */
  'Accept-Language' = 'Accept-Language',
  /**
   * The **`Accept-Patch`** response HTTP header advertises which media-type the server is able to understand in a PATCH request.
   *
   * **`Accept-Patch`** in response to any method means that PATCH is allowed on the resource identified by the Request-URI. Two common cases lead to this:
   *
   * A server receiving a PATCH request with an unsupported media type could reply with [415](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/415) `Unsupported Media Type` and an Accept-Patch header referencing one or more supported media types.
   *
   * > **Note:**
   * >
   * > - An IANA registry maintains [a complete list of official content encodings](https://www.iana.org/assignments/http-parameters/http-parameters.xml#http-parameters-1).
   * > - Two others content encoding, `bzip` and `bzip2`, are sometimes used, though not standard. They implement the algorithm used by these two UNIX programs. Note that the first one was discontinued due to patent licensing problems.
   */
  'Accept-Patch' = 'Accept-Patch',
  /**
   * The **`Accept-Post`** response HTTP header advertises which [media types](/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types) are accepted by the server for HTTP post requests.
   *
   * **`Accept-Post`** in response to any method means that `POST` is allowed on the requested resource (any document/media format in the header further indicates that the document format is allowed).
   *
   * For example, a server receiving a `POST` request with an unsupported media type could reply with [415](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/415) `Unsupported Media Type` and an **`Accept-Post`** header referencing one or more supported media types.
   *
   * > **Note:** An IANA registry maintains [a complete list of official content encodings](https://www.iana.org/assignments/http-parameters/http-parameters.xml#http-parameters-1).
   */
  'Accept-Post' = 'Accept-Post',
  /**
   * The **`Accept-Ranges`** HTTP response header is a marker used
   * by the server to advertise its support for partial requests from the client for file downloads. The value of this field
   * indicates the unit that can be used to define a range.
   *
   * In the presence of an `Accept-Ranges` header, the browser may try to
   * _resume_ an interrupted download instead of trying to restart the download.
   */
  'Accept-Ranges' = 'Accept-Ranges',
  /**
   * The **`Accept`** request HTTP header indicates which content types, expressed as [MIME types](/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types), the client is able to understand. The server uses [content negotiation](/en-US/docs/Web/HTTP/Content_negotiation) to select one of the proposals and informs the client of the choice with the [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) response header. Browsers set required values for this header based on the context of the request. For example, a browser uses different values in a request when fetching a CSS stylesheet, image, video, or a script.
   */
  'Accept' = 'Accept',
  /**
   * The **`Access-Control-Allow-Credentials`** response header
   * tells browsers whether to expose the response to the frontend JavaScript code when the
   * request's credentials mode ([Request.credentials](https://developer.mozilla.org/en-US/docs/domxref/Request.credentials)) is `include`.
   *
   * When a request's credentials mode ([Request.credentials](https://developer.mozilla.org/en-US/docs/domxref/Request.credentials)) is
   * `include`, browsers will only expose the response to the frontend JavaScript code
   * if the `Access-Control-Allow-Credentials` value is `true`.
   *
   * Credentials are cookies, authorization headers, or TLS client certificates.
   *
   * When used as part of a response to a preflight request, this indicates whether or not
   * the actual request can be made using credentials. Note that simple [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET)
   * requests are not preflighted. So, if a request is made for a resource with
   * credentials, and if this header is not returned with the resource, the response is ignored
   * by the browser and not returned to the web content.
   *
   * The `Access-Control-Allow-Credentials` header works in conjunction with the
   * [XMLHttpRequest.withCredentials](https://developer.mozilla.org/en-US/docs/domxref/XMLHttpRequest.withCredentials) property or with the
   * `credentials` option in the [Request()](https://developer.mozilla.org/en-US/docs/domxref/Request.Request())
   * constructor of the Fetch API. For a CORS request with credentials, for browsers
   * to expose the response to the frontend JavaScript code, both the server (using the
   * `Access-Control-Allow-Credentials` header) and the client (by setting the
   * credentials mode for the XHR, Fetch, or Ajax request) must indicate that they're opting
   * into including credentials.
   */
  'Access-Control-Allow-Credentials' = 'Access-Control-Allow-Credentials',
  /**
   * The **`Access-Control-Allow-Headers`** response header is used in response to a [preflight request](https://developer.mozilla.org/en-US/docs/glossary/preflight_request) which includes the [Access-Control-Request-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Request-Headers) to indicate which HTTP headers can be used during the actual request.
   *
   * This header is required if the request has an [Access-Control-Request-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Request-Headers) header.
   *
   * > **Note:** [CORS-safelisted request headers](https://developer.mozilla.org/en-US/docs/glossary/CORS-safelisted_request_header) are always allowed and usually aren't listed in `Access-Control-Allow-Headers` (unless there is a need to circumvent the safelist [additional restrictions](/en-US/docs/Glossary/CORS-safelisted_request_header#additional_restrictions)).
   */
  'Access-Control-Allow-Headers' = 'Access-Control-Allow-Headers',
  /**
   * The **`Access-Control-Allow-Methods`** response header
   * specifies one or more methods allowed when accessing a resource in response to a
   * [preflight request](https://developer.mozilla.org/en-US/docs/glossary/preflight_request).
   */
  'Access-Control-Allow-Methods' = 'Access-Control-Allow-Methods',
  /**
   * The **`Access-Control-Allow-Origin`** response header indicates whether the response can be shared with requesting code from the given [origin](https://developer.mozilla.org/en-US/docs/glossary/origin).
   */
  'Access-Control-Allow-Origin' = 'Access-Control-Allow-Origin',
  /**
   * The **`Access-Control-Expose-Headers`** response header allows a server to indicate which response headers should be made available to scripts running in the browser, in response to a cross-origin request.
   *
   * Only the [CORS-safelisted response headers](https://developer.mozilla.org/en-US/docs/Glossary/CORS-safelisted_response_header) are exposed by default. For clients to be able to access other headers, the server must list them using the `Access-Control-Expose-Headers` header.
   */
  'Access-Control-Expose-Headers' = 'Access-Control-Expose-Headers',
  /**
   * The **`Access-Control-Max-Age`** response header indicates how long the results of a [preflight request](https://developer.mozilla.org/en-US/docs/glossary/preflight_request) (that is the information contained in the [Access-Control-Allow-Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Methods) and [Access-Control-Allow-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers) headers) can be cached.
   */
  'Access-Control-Max-Age' = 'Access-Control-Max-Age',
  /**
   * The **`Access-Control-Request-Headers`** request header is used by browsers when issuing a [preflight request](https://developer.mozilla.org/en-US/docs/glossary/preflight_request) to let the server know which [HTTP headers](/en-US/docs/Web/HTTP/Headers) the client might send when the actual request is made (such as with [setRequestHeader()](https://developer.mozilla.org/en-US/docs/domxref/XMLHttpRequest.setRequestHeader())). The complementary server-side header of [Access-Control-Allow-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers) will answer this browser-side header.
   */
  'Access-Control-Request-Headers' = 'Access-Control-Request-Headers',
  /**
   * The **`Access-Control-Request-Method`** request header is used
   * by browsers when issuing a [preflight request](https://developer.mozilla.org/en-US/docs/glossary/preflight_request), to let the server know
   * which [HTTP method](/en-US/docs/Web/HTTP/Methods) will be used when the
   * actual request is made. This header is necessary as the preflight request is always an
   * [OPTIONS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/OPTIONS) and doesn't use the same method as the actual request.
   */
  'Access-Control-Request-Method' = 'Access-Control-Request-Method',
  /**
   * The **`Age`** header contains the time in seconds the object was in a proxy cache.
   *
   * The `Age` header is usually close to zero. If it is `Age: 0`, it was probably fetched from the origin server; otherwise, it was usually calculated as
   * a difference between the proxy's current date and the [Date](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Date) general header included in the HTTP response.
   */
  'Age' = 'Age',
  /**
   * The **`Allow`** header lists the set of methods supported by a resource.
   *
   * This header must be sent if the server responds with a [405](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405) `Method Not Allowed` status code to indicate which request methods can be used. An empty `Allow` header indicates that the resource allows no request methods, which might occur temporarily for a given resource, for example.
   */
  'Allow' = 'Allow',
  /**
   * The [Alt-Svc](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Alt-Svc) HTTP header allows a server to indicate that another network location (the "alternative service") can be treated as authoritative for that origin when making future requests.
   *
   * Doing so allows new protocol versions to be advertised without affecting in-flight requests, and can also help servers manage traffic. Using an alternative service is not visible to the end user; it does not change the URL or the origin of the request, and does not introduce extra round trips.
   */
  'Alt-Svc' = 'Alt-Svc',
  /**
   * The HTTP **`Authorization`** request header can be used to provide credentials that authenticate a user agent with a server, allowing access to a protected resource.
   *
   * The **`Authorization`** header is usually, but not always, sent after the user agent first attempts to request a protected resource without credentials.
   * The server responds with a [401](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401) `Unauthorized` message that includes at least one [WWW-Authenticate](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/WWW-Authenticate) header.
   * This header indicates what authentication schemes can be used to access the resource (and any additional information needed by the client to use them).
   * The user-agent should select the most secure authentication scheme that it supports from those offered, prompt the user for their credentials, and then re-request the resource (including the encoded credentials in the **`Authorization`** header).
   *
   * > **Note:** This header is part of the [General HTTP authentication framework](/en-US/docs/Web/HTTP/Authentication#the_general_http_authentication_framework).
   * > It can be used with a number of [authentication schemes](/en-US/docs/Web/HTTP/Authentication#authentication_schemes).
   */
  'Authorization' = 'Authorization',
  /**
   * The **`Cache-Control`** HTTP header field holds _directives_ (instructions) — in both requests and responses — that control [caching](/en-US/docs/Web/HTTP/Caching) in browsers and shared caches (e.g. Proxies, CDNs).
   */
  'Cache-Control' = 'Cache-Control',
  /**
   * The **`Clear-Site-Data`** header clears browsing data (cookies, storage, cache) associated with the requesting website. It allows web developers to have more control over the data stored by a client browser for their origins.
   */
  'Clear-Site-Data' = 'Clear-Site-Data',
  /**
   * The **`Connection`** general header controls whether the
   * network connection stays open after the current transaction finishes. If the value sent
   * is `keep-alive`, the connection is persistent and not closed, allowing for
   * subsequent requests to the same server to be done.
   *
   * > **Warning:** Connection-specific header fields such as
   * > [Connection](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Connection) and [Keep-Alive](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Keep-Alive) are prohibited
   * > in [HTTP/2](https://httpwg.org/specs/rfc9113.html#ConnectionSpecific) and
   * > [HTTP/3](https://httpwg.org/specs/rfc9114.html#header-formatting). Chrome and
   * > Firefox ignore them in HTTP/2 responses, but Safari conforms to the HTTP/2
   * > spec requirements and does not load any response that contains them.
   *
   * Except for the standard hop-by-hop headers ([Keep-Alive](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Keep-Alive),
   * [Transfer-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Transfer-Encoding), [TE](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/TE), [Connection](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Connection),
   * [Trailer](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Trailer), [Upgrade](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Upgrade),
   * [Proxy-Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Proxy-Authorization) and [Proxy-Authenticate](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Proxy-Authenticate)), any
   * hop-by-hop headers used by the message must be listed in the `Connection`
   * header, so that the first proxy knows it has to consume them and not forward them
   * further. Standard hop-by-hop headers are also required to be listed.
   */
  'Connection' = 'Connection',
  /**
   * In a regular HTTP response, the **`Content-Disposition`** response header is a header indicating if the content is expected to be displayed _inline_ in the browser, that is, as a Web page or as part of a Web page, or as an _attachment_, that is downloaded and saved locally.
   *
   * In a `multipart/form-data` body, the HTTP **`Content-Disposition`** general header is a header that must be used on each subpart of a multipart body to give information about the field it applies to. The subpart is delimited by the _boundary_ defined in the [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) header. Used on the body itself, `Content-Disposition` has no effect.
   *
   * The `Content-Disposition` header is defined in the larger context of MIME messages for e-mail, but only a subset of the possible parameters apply to HTTP forms and [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/POST) requests. Only the value `form-data`, as well as the optional directive `name` and `filename`, can be used in the HTTP context.
   */
  'Content-Disposition' = 'Content-Disposition',
  /**
   * The **`Content-DPR`** response header is used to confirm the _image_ device to pixel ratio in requests where the screen [DPR](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/DPR) [client hint](/en-US/docs/Web/HTTP/Client_hints) was used to select an image resource.
   *
   *
   *
   * If the [DPR](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/DPR) client hint is used to select an image the server must specify `Content-DPR` in the response. If the value in `Content-DPR` is different from the [DPR](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/DPR) value in the request (i.e. image DPR is not the same as screen DPR) then the client must use the `Content-DPR` for determining intrinsic image size and scaling the image.
   *
   * If the `Content-DPR` header appears more than once in a message the last occurrence is used.
   *
   * > **Note:**
   * >
   * > - `Content-DPR` was removed from the client hints specification in [draft-ietf-httpbis-client-hints-07](https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-client-hints-07). The [Responsive Image Client Hints](https://wicg.github.io/responsive-image-client-hints/) spec proposes to replace this header by specifying intrinsic resolution/dimensions in EXIF metadata.
   */
  'Content-DPR' = 'Content-DPR',
  /**
   * The **`Content-Encoding`** [representation header](https://developer.mozilla.org/en-US/docs/Glossary/representation_header) lists any encodings that have been applied to the representation (message payload), and in what order.
   * This lets the recipient know how to decode the representation in order to obtain the original payload format.
   * Content encoding is mainly used to compress the message data without losing information about the origin media type.
   *
   * Note that the original media/content type is specified in the [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) header, and that the `Content-Encoding` applies to the representation, or "coded form", of the data. If the original media is encoded in some way (e.g. a zip file) then this information would not be included in the `Content-Encoding` header.
   *
   * Servers are encouraged to compress data as much as possible, and should use content encoding where appropriate. Compressing a compressed media type such as a zip or jpeg may not be appropriate, as this can make the payload larger.
   */
  'Content-Encoding' = 'Content-Encoding',
  /**
   * The **`Content-Language`** [representation header](https://developer.mozilla.org/en-US/docs/Glossary/representation_header) is used to **describe the language(s) intended for the audience**, so users can differentiate it according to their own preferred language.
   *
   * For example, if "`Content-Language: de-DE`" is set, it says that the document is intended for German language speakers (however, it doesn't indicate the document is written in German. For example, it might be written in English as part of a language course for German speakers. If you want to indicate which language the document is written in, use the [`lang` attribute](/en-US/docs/Web/HTML/Global_attributes/lang) instead).
   *
   * If no `Content-Language` is specified, the default is that the content is intended for all language audiences. Multiple language tags are also possible, as well as applying the `Content-Language` header to various media types and not only to textual documents.
   */
  'Content-Language' = 'Content-Language',
  /**
   * The **`Content-Length`** header indicates the size of the message body, in bytes, sent to the recipient.
   */
  'Content-Length' = 'Content-Length',
  /**
   * The **`Content-Location`** header indicates an alternate
   * location for the returned data. The principal use is to indicate the URL of a resource
   * transmitted as the result of [content negotiation](/en-US/docs/Web/HTTP/Content_negotiation).
   *
   * [Location](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Location) and `Content-Location` are different.
   * `Location` indicates the URL of a redirect, while
   * `Content-Location` indicates the direct URL to use to access the resource,
   * without further content negotiation in the future. `Location` is a header
   * associated with the response, while `Content-Location` is associated with the
   * data returned. This distinction may seem abstract without [examples](#examples).
   */
  'Content-Location' = 'Content-Location',
  /**
   * The **`Content-Range`** response HTTP header indicates where in
   * a full body message a partial message belongs.
   */
  'Content-Range' = 'Content-Range',
  /**
   * The HTTP **`Content-Security-Policy-Report-Only`** response header allows web developers to experiment with policies by monitoring (but not enforcing) their effects. These violation reports consist of [JSON](https://developer.mozilla.org/en-US/docs/Glossary/JSON) documents sent via an HTTP `POST` request to the specified URI.
   *
   * For more information, see also this article on [Content Security Policy (CSP)](/en-US/docs/Web/HTTP/CSP).
   */
  'Content-Security-Policy-Report-Only' = 'Content-Security-Policy-Report-Only',
  /**
   * The HTTP **`Content-Security-Policy`** response header allows
   * web site administrators to control resources the user agent is allowed to load for a
   * given page. With a few exceptions, policies mostly involve specifying server origins and
   * script endpoints. This helps guard against cross-site scripting attacks
   * ([Cross-site_scripting](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting)).
   *
   * For more information, see the introductory article on [Content Security Policy (CSP)](/en-US/docs/Web/HTTP/CSP).
   */
  'Content-Security-Policy' = 'Content-Security-Policy',
  /**
   * The **`Content-Type`** representation header is used to indicate the original [media type](https://developer.mozilla.org/en-US/docs/Glossary/MIME_type) of the resource (prior to any content encoding applied for sending).
   *
   * In responses, a `Content-Type` header provides the client with the actual content type of the returned content. This header's value may be ignored, for example when browsers perform MIME sniffing; set the [X-Content-Type-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options) header value to `nosniff` to prevent this behavior.
   *
   * In requests, (such as [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/POST) or [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/PUT)), the client tells the server what type of data is actually sent.
   */
  'Content-Type' = 'Content-Type',
  /**
   * The **`Cookie`** HTTP request header contains stored [HTTP cookies](/en-US/docs/Web/HTTP/Cookies) associated with the server (i.e. previously sent by the server with the [Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie) header or set in JavaScript using [Document.cookie](https://developer.mozilla.org/en-US/docs/domxref/Document.cookie)).
   *
   * The `Cookie` header is optional and may be omitted if, for example, the browser's privacy settings block cookies.
   */
  'Cookie' = 'Cookie',
  /**
   * The HTTP **`Cross-Origin-Embedder-Policy`** (COEP) response header prevents a document from loading any cross-origin resources that don't explicitly grant the document permission (using [CORP](
   */
  'Cross-Origin-Embedder-Policy' = 'Cross-Origin-Embedder-Policy',
  /**
   * The HTTP **`Cross-Origin-Opener-Policy`** (COOP) response header allows you to ensure a top-level document does not share a browsing context group with cross-origin documents.
   *
   * COOP will process-isolate your document and potential attackers can't access your global object if they were to open it in a popup, preventing a set of cross-origin attacks dubbed [XS-Leaks](https://github.com/xsleaks/xsleaks).
   *
   * If a cross-origin document with COOP is opened in a new window, the opening document will not have a reference to it, and the [`window.opener`](/en-US/docs/Web/API/Window/opener) property of the new window will be `null`. This allows you to have more control over references to a window than [`rel=noopener`](/en-US/docs/Web/HTML/Link_types/noopener), which only affects outgoing navigations.
   */
  'Cross-Origin-Opener-Policy' = 'Cross-Origin-Opener-Policy',
  /**
   * The HTTP **`Cross-Origin-Resource-Policy`** response header
   * conveys a desire that the browser blocks no-cors cross-origin/cross-site requests to the
   * given resource.
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
   * > fetch('https://httpbin.org/get', {
   * >   'headers': {
   * >     'Date': (new Date()).toUTCString()
   * >   }
   * > })
   * > ```
   */
  'Date' = 'Date',
  /**
   * The **`Device-Memory`** [device client hint](/en-US/docs/Web/HTTP/Client_hints#device_client_hints) request header field indicates the approximate amount of available RAM on the client device. The header is part of the [Device Memory API](/en-US/docs/Web/API/Device_Memory_API).
   *
   *
   *
   * > **Note:**
   * >
   * > - Client Hints are accessible only on secure origins (via TLS).
   * > - A server has to opt in to receive the `Device-Memory` header from the client, by sending the [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH) response header.
   * > - Servers that opt in to the `Device-Memory` client hint will typically also specify it in the [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) header. This informs caches that the server may send different responses based on the header value in a request.
   */
  'Device-Memory' = 'Device-Memory',
  /**
   * The **`Digest`** response HTTP header provides a [digest](https://developer.mozilla.org/en-US/docs/Glossary/digest) of the _selected representation_ of the requested resource.
   *
   * Representations are different forms of a particular resource that might be returned from a request: for example, the same resource might be formatted in a particular media type such as XML or JSON, localized to a particular written language or geographical region, and/or compressed or otherwise encoded for transmission.
   * The _selected representation_ is the actual format of a resource that is returned following [content negotiation](/en-US/docs/Web/HTTP/Content_negotiation), and can be determined from the response's [Representation headers](https://developer.mozilla.org/en-US/docs/Glossary/Representation_header).
   *
   * The digest applies to the whole representation of a resource, not to a particular message.
   * It can be used to verify that the representation data has not been modified during transmission.
   *
   * > **Note:** While a representation may be fully contained in the message body of a single response, it can also be sent using multiple messages in response to a [range request](/en-US/docs/Web/HTTP/Range_requests), or omitted altogether in response to a [HEAD](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/HEAD) request.
   */
  'Digest' = 'Digest',
  /**
   * The **`DNT`** (**D**o **N**ot
   * **T**rack) request header indicates the user's tracking preference. It lets
   * users indicate whether they would prefer privacy rather than personalized content.
   */
  'DNT' = 'DNT',
  /**
   * The **`Downlink`** [Client hint](/en-US/docs/Web/HTTP/Client_hints) request header field provides the approximate bandwidth of the client's connection to the server, in Mbps.
   *
   *
   *
   * The `Downlink` value is given in Mbps and rounded to the nearest 25 kilobits per second to prevent fingerprinting; There are many other mechanisms an attacker might use to obtain similar information.
   *
   * The hint allows a server to choose what information is sent based on the network bandwidth. For example, a server might choose to send smaller versions of images and other resources on low bandwidth networks.
   *
   * > **Note:** The [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) header is used in responses to indicate that a different resource is sent for every different value of the header (see [HTTP Caching > Varying responses](/en-US/docs/Web/HTTP/Caching#varying_responses)). Even if [Downlink](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Downlink) is used to configure what resources are sent, consider omitting it in the [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) header — it is likely to change often, which effectively makes the resource uncacheable.
   */
  'Downlink' = 'Downlink',
  /**
   * The **`DPR`** [device client hint](/en-US/docs/Web/HTTP/Client_hints) request header provides the client device pixel ratio. This ratio is the number of physical device pixels corresponding to every [CSS pixel](https://developer.mozilla.org/en-US/docs/Glossary/CSS_pixel).
   *
   *
   *
   * The hint is useful when selecting image sources that best correspond to a screen's pixel density. This is similar to the role played by `x` descriptors in the `<img>` [`srcset`](/en-US/docs/Web/HTML/Element/img#attr-srcset) attribute to allow user agents to select a preferred image.
   *
   * If a server uses the `DPR` hint to choose which resource is sent in a response, the response must include the [Content-DPR](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-DPR) header. The client must use the value in `Content-DPR` for layout if it differs from the value in the request's `DPR` header.
   *
   * If the `DPR` header appears more than once in a message the last occurrence is used.
   *
   * > **Note:**
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
   * and also indicates that the intermediary understands the [425 (Too Early)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/425) status code.
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
   * > **Note:** A server that specifies [ECT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ECT) in [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH) may also specify it in [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) to indicate that responses should be cached for different ECT values.
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
   * > **Note:** When a site enables the `Expect-CT` header, they are requesting that the browser check that any certificate for that site appears in **[public CT logs](https://github.com/google/certificate-transparency-community-site/blob/master/docs/google/known-logs.md)**.
   *
   * > **Note:** Browsers **ignore** the `Expect-CT` header over HTTP; the header only has effect on HTTPS connections.
   *
   * > **Note:** The `Expect-CT` is mostly obsolete since June 2021. Since May 2018, all new TLS certificates are expected to support SCTs by default. Certificates issued before March 2018 were allowed to have a lifetime of 39 months, so they had expired in June 2021. Chromium plans to deprecate `Expect-CT` header and to eventually remove it.
   */
  'Expect-CT' = 'Expect-CT',
  /**
   * The **`Expect`** HTTP request header indicates expectations
   * that need to be met by the server to handle the request successfully.
   *
   * Upon `Expect: 100-continue`, the server responds with:
   *
   * - [100](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/100) (Continue) if the information from the request header is insufficient to
   *   resolve the response and the client should proceed with sending the body.
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
   * > **Note:** If there is a [Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) header
   * > with the `max-age` or `s-maxage` directive in the response,
   * > the `Expires` header is ignored.
   */
  'Expires' = 'Expires',
  /**
   * > **Warning:** The header has now been renamed to `Permissions-Policy` in the spec, and this article will eventually be updated to reflect that change.
   *
   * The HTTP **`Feature-Policy`** header provides a mechanism to allow and deny the use of browser features in its own frame, and in content within any [iframe](https://developer.mozilla.org/en-US/docs/HTMLElement/iframe) elements in the document.
   *
   * For more information, see the main [Feature Policy](/en-US/docs/Web/HTTP/Feature_Policy) article.
   */
  'Feature-Policy' = 'Feature-Policy',
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
   * > **Warning:** You must not use the `From` header for access control or authentication.
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
   *   come from the same resource as the previous one.
   * - For other methods, and in particular for [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/PUT), `If-Match` can be used to prevent the [lost update problem](https://www.w3.org/1999/04/Editing/#3.1).
   *   It can check if the modification of a resource that the user wants to upload will not override another change that has been done since the original resource was fetched.
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
   * The HyperText Transfer Protocol (HTTP) **`If-Unmodified-Since`** request header makes the
   * request for the resource conditional: the server will send the requested resource or accept it in
   * the case of a [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/POST) or another non-[safe](https://developer.mozilla.org/en-US/docs/Glossary/Safe/HTTP) method only if the resource has not been modified after the date specified by this HTTP header. If the resource has been modified
   * after the specified date, the response will be a [412 Precondition Failed](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/412) error.
   *
   * The **`If-Unmodified-Since`** HTTP header is commonly used in the following situations:
   *
   * - In conjunction with non-[safe](https://developer.mozilla.org/en-US/docs/Glossary/Safe/HTTP) methods, like [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/POST),
   *   this header can be used to implement an [optimistic concurrency control](https://en.wikipedia.org/wiki/Optimistic_concurrency_control), as is done by some wikis: editions are rejected if the
   *   stored document has been modified since the original was retrieved.
   * - In conjunction with a range request using the [Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Range) header, this header can
   *   be used to ensure that the new fragment requested comes from an unmodified document.
   */
  'If-Unmodified-Since' = 'If-Unmodified-Since',
  /**
   * The **`Keep-Alive`** general header allows the sender to hint about how the connection may be used to set a timeout and a maximum amount of requests.
   *
   * > **Note:** Set the [Connection](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Connection) header to "keep-alive" for this header to have any effect.
   *
   * > **Warning:** Connection-specific header fields such as
   * > [Connection](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Connection) and [Keep-Alive](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Keep-Alive) are prohibited
   * > in [HTTP/2](https://httpwg.org/specs/rfc9113.html#ConnectionSpecific) and
   * > [HTTP/3](https://httpwg.org/specs/rfc9114.html#header-formatting). Chrome and
   * > Firefox ignore them in HTTP/2 responses, but Safari conforms to the HTTP/2
   * > specification requirements and does not load any response that contains them.
   */
  'Keep-Alive' = 'Keep-Alive',
  /**
   * The non-standard **`Large-Allocation`** response header tells the browser that the page being loaded is going to want to perform a large allocation.
   * It's not implemented in current versions of any browser, but is harmless to send to any browser.
   *
   * [WebAssembly](/en-US/docs/WebAssembly) or asm.js applications can use large
   * contiguous blocks of allocated memory. For complex games, for example, these allocations
   * can be quite large, sometimes as large as 1GB. The `Large-Allocation` tells
   * the browser that the web content in the to-be-loaded page is going to want to perform a
   * large contiguous memory allocation and the browser can react to this header by starting
   * a dedicated process for the to-be-loaded document, for example.
   */
  'Large-Allocation' = 'Large-Allocation',
  /**
   * The **`Last-Modified`** response HTTP header contains a date
   * and time when the origin server believes the resource was last modified. It is used
   * as a validator to determine if the resource is the same as the previously stored one. Less accurate
   * than an [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) header, it is a fallback mechanism. Conditional requests
   * containing [If-Modified-Since](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Modified-Since) or [If-Unmodified-Since](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Unmodified-Since)
   * headers make use of this field.
   */
  'Last-Modified' = 'Last-Modified',
  /**
   * The HTTP **`Link`** entity-header field provides a means for serializing one or more links in HTTP headers. It is semantically equivalent to the HTML [link](https://developer.mozilla.org/en-US/docs/HTMLElement/link) element.
   */
  'Link' = 'Link',
  /**
   * The **`Location`** response header indicates the URL to
   * redirect a page to. It only provides a meaning when served with a
   * `3xx` (redirection) or `201` (created) status response.
   *
   * In cases of redirection, the HTTP method used to make the new request to fetch the page
   * pointed to by `Location` depends on the original method and the kind of
   * redirection:
   *
   * - [303](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/303) (See Other) responses always lead to the use of a
   *   [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) method.
   * - [307](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/307) (Temporary Redirect) and
   *   [308](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/308) (Permanent Redirect) don't change the method used in the
   *   original request.
   * - [301](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/301) (Moved Permanently) and [302](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/302) (Found) don't
   *   change the method most of the time, though older user-agents may (so you basically
   *   don't know).
   *
   * All responses with one of these status codes send a `Location` header.
   *
   * In cases of resource creation, it indicates the URL to the newly created resource.
   *
   * `Location` and [Content-Location](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Location) are different.
   * `Location` indicates the target of a redirection or the URL of a newly
   * created resource. [Content-Location](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Location) indicates the direct URL to
   * use to access the resource when [content negotiation](/en-US/docs/Web/HTTP/Content_negotiation) happened,
   * without the need of further content negotiation. `Location` is a header
   * associated with the response, while [Content-Location](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Location) is associated
   * with the entity returned.
   */
  'Location' = 'Location',
  /**
   * The **`Max-Forwards`** request HTTP header is used with the [`TRACE`](/en-US/docs/Web/HTTP/Methods/TRACE) method to limit the number of nodes (usually proxies) that request goes through. Its value is an integer value indicating the _maximum amount_ of nodes it must visit. At each node, the value is decremented and the `TRACE` request is forwarded to the next node, until the destination is reached, or the received value of `Max-Forwards` is zero. The request is then sent back, except for some headers, as the body of a `200 OK` response.
   *
   * If the `Max-Forwards` header is not present in a `TRACE` request, a node will assume that there is no maximum number of forwards.
   */
  'Max-Forwards' = 'Max-Forwards',
  /**
   * The HTTP **`NEL`** response header is used to configure network request logging.
   */
  'NEL' = 'NEL',
  /**
   * The **`Origin`** request header indicates the [origin](https://developer.mozilla.org/en-US/docs/glossary/origin) (scheme, hostname, and port) that _caused_ the request.
   * For example, if a user agent needs to request resources included in a page, or fetched by scripts that it executes, then the origin of the page may be included in the request.
   */
  'Origin' = 'Origin',
  /**
   * The **`Pragma`** HTTP/1.0 general header is an
   * implementation-specific header that may have various effects along the request-response
   * chain. This header serves for backwards compatibility with the HTTP/1.0 caches that do not have a
   * [Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) HTTP/1.1 header.
   *
   * > **Note:** `Pragma` is not specified for HTTP responses and is
   * > therefore not a reliable replacement for the general HTTP/1.1
   * > `Cache-Control` header, although its behavior is the same as
   * > `Cache-Control: no-cache` if the `Cache-Control` header field
   * > is omitted in a request. Use `Pragma` only for backwards compatibility with
   * > HTTP/1.0 clients.
   */
  'Pragma' = 'Pragma',
  /**
   * The HTTP **`Proxy-Authenticate`** response header defines the
   * authentication method that should be used to gain access to a resource behind a
   * [proxy server](https://developer.mozilla.org/en-US/docs/Glossary/proxy_server). It authenticates the request to the proxy server, allowing
   * it to transmit the request further.
   *
   * The `Proxy-Authenticate` header is sent along with a [407](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/407)
   * `Proxy Authentication Required`.
   */
  'Proxy-Authenticate' = 'Proxy-Authenticate',
  /**
   * The HTTP **`Proxy-Authorization`** request header contains the
   * credentials to authenticate a user agent to a proxy server, usually after the server has
   * responded with a [407](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/407) `Proxy Authentication Required` status
   * and the [Proxy-Authenticate](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Proxy-Authenticate) header.
   */
  'Proxy-Authorization' = 'Proxy-Authorization',
  /**
   * The **`Range`** HTTP request header indicates the part of a document that the server should return. Several parts can be requested with one `Range` header at once, and the server may send back these ranges in a multipart document. If the server sends back ranges, it uses the [206 Partial Content](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/206) for the response. If the ranges are invalid, the server returns the [416 Range Not Satisfiable](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/416) error. The server can also ignore the `Range` header and return the whole document with a [200](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200) status code.
   */
  'Range' = 'Range',
  /**
   * The **`Referer`** HTTP request header contains the absolute or partial address from which a resource has been requested.
   * The `Referer` header allows a server to identify referring pages that people are visiting from or where requested resources are being used.
   * This data can be used for analytics, logging, optimized caching, and more.
   *
   * When you click a link, the **`Referer`** contains the address of the page that includes the link.
   * When you make resource requests to another domain, the **`Referer`** contains the address of the page that uses the requested resource.
   *
   * The `Referer` header can contain an _origin_, _path_, and _querystring_, and may not contain URL fragments (i.e. `#section`) or `username:password` information.
   * The request's _referrer policy_ defines the data that can be included. See [Referrer-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy) for more [information](/en-US/docs/Web/HTTP/Headers/Referrer-Policy#directives) and [examples](/en-US/docs/Web/HTTP/Headers/Referrer-Policy#examples).
   *
   * > **Note:** The header name "referer" is actually a misspelling of the word "referrer".
   * > See [HTTP referer on Wikipedia](https://en.wikipedia.org/wiki/HTTP_referer) for more details.
   *
   * > **Warning:** This header may have undesirable consequences for user security and privacy.
   * > See [Referer header: privacy and security concerns](/en-US/docs/Web/Security/Referer_header:_privacy_and_security_concerns) for more information and mitigation hints.
   */
  'Referer' = 'Referer',
  /**
   * The **`Referrer-Policy`** [HTTP header](https://developer.mozilla.org/en-US/docs/glossary/HTTP_header) controls how much [referrer information](/en-US/docs/Web/Security/Referer_header:_privacy_and_security_concerns) (sent with the [Referer](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer) header) should be included with requests. Aside from the HTTP header, you can [set this policy in HTML](#integration_with_html).
   */
  'Referrer-Policy' = 'Referrer-Policy',
  /**
   * The **`Retry-After`** response HTTP header indicates how long
   * the user agent should wait before making a follow-up request. There are three main cases
   * this header is used:
   *
   * - When sent with a  (Service Unavailable) response, this indicates
   *   how long the service is expected to be unavailable.
   * - When sent with a  (Too Many Requests) response, this indicates
   *   how long to wait before making a new request.
   * - When sent with a redirect response, such as  (Moved Permanently),
   *   this indicates the minimum time that the user agent is asked to wait before issuing
   *   the redirected request.
   */
  'Retry-After' = 'Retry-After',
  /**
   * The **`RTT`** [Client hint](/en-US/docs/Web/HTTP/Client_hints) request header field provides the approximate round trip time on the application layer, in milliseconds. The RTT hint, unlike transport layer RTT, includes server processing time.
   *
   *
   *
   * The RTT value is rounded to the nearest 25 milliseconds to prevent fingerprinting; There are many other mechanisms an attacker might use to obtain similar round-trip information.
   *
   * The hint allows a server to choose what information is sent based on the network responsiveness/latency. For example, it might choose to send fewer resources.
   *
   * > **Note:** The [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) header is used in responses to indicate that a different resource is sent for every different value of the header (see [HTTP Caching > Varying responses](/en-US/docs/Web/HTTP/Caching#varying_responses)). Even if [RTT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/RTT) is used to configure what resources are sent consider omitting it in the [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) header — it is likely to change often, which effectively makes the resource uncacheable.
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
   * > **Note:** Disabling HTTP/2 Server Push ([Server Push", "8.2](https://developer.mozilla.org/en-US/docs/RFC/7540)) might be desirable too for reducing data downloads.
   */
  'Save-Data' = 'Save-Data',
  /**
   * The **`Sec-CH-Prefers-Reduced-Motion`** [user agent client hint](/en-US/docs/Web/HTTP/Client_hints#user_preference_media_features_client_hints) request header indicates the user agent's preference for animations to be displayed with reduced motion.
   *
   * If a server signals to a client via the [Accept-CH](https://developer.mozilla.org/en-US/docs/httpheader/Accept-CH) header that it accepts `Sec-CH-Prefers-Reduced-Motion`, the client can then respond with this header to indicate the user's preference for reduced motion. The server can send the client appropriately adapted content, for example, JavaScript or CSS, to reduce the motion of any animations presented on subsequent rendered content. This could include reducing the speed or amplitude of movement to reduce discomfort for those with vestibular motion disorders.
   *
   * This header is modeled on the [prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/cssxref/@media/prefers-reduced-motion) media query.
   */
  'Sec-CH-Prefers-Reduced-Motion' = 'Sec-CH-Prefers-Reduced-Motion',
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
   * > **Note:** This is similar to [Sec-CH-UA](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-CH-UA), but includes the full version number instead of the significant version number for each brand.
   */
  'Sec-CH-UA-Full-Version-List' = 'Sec-CH-UA-Full-Version-List',
  /**
   * > **Note:** This is being replaced by the [Sec-CH-UA-Full-Version-List](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-CH-UA-Full-Version-List).
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
   * This allows servers determine whether to service a request based on whether it is appropriate for how it is _expected_ to be used. For example, a request with an `audio` destination should request audio data, not some other type of resource (for example, a document that includes sensitive user information).
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
   * The **`Sec-GPC`** (**G**lobal **P**rivacy **C**ontrol) request header indicates whether the user consents to a website or service selling or sharing their personal information with third parties.
   */
  'Sec-GPC' = 'Sec-GPC',
  /**
   * The **Sec-WebSocket-Accept** header is used in the websocket opening
   * handshake. It would appear in the response headers. That is, this is header is sent from
   * server to client to inform that server is willing to initiate a websocket connection.
   */
  'Sec-WebSocket-Accept' = 'Sec-WebSocket-Accept',
  /**
   * The **`Server-Timing`** header communicates one or more metrics and descriptions for a given request-response cycle. It is used to surface any backend server timing metrics (e.g. database read/write, CPU time, file system access, etc.) in the developer tools in the user's browser or in the [PerformanceServerTiming](https://developer.mozilla.org/en-US/docs/domxref/PerformanceServerTiming) interface.
   */
  'Server-Timing' = 'Server-Timing',
  /**
   * The **`Server`** header describes the
   * software used by the origin server that handled the request — that is, the server that
   * generated the response.
   *
   * > **Warning:** Avoid overly-detailed `Server` values, as they can reveal information that
   * > may make it (slightly) easier for attackers to exploit known security holes.
   */
  'Server' = 'Server',
  /**
   * The **`Service-Worker-Navigation-Preload`** request header indicates that the request was the result of a [fetch()](https://developer.mozilla.org/en-US/docs/domxref/fetch()) operation made during service worker navigation preloading.
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
   * > **Warning:** Browsers block frontend JavaScript code from accessing the `Set-Cookie` header, as required by the Fetch spec, which defines `Set-Cookie` as a [forbidden response-header name](https://fetch.spec.whatwg.org/#forbidden-response-header-name) that [must be filtered out](https://fetch.spec.whatwg.org/#ref-for-forbidden-response-header-name%E2%91%A0) from any response exposed to frontend code.
   *
   * For more information, see the guide on [Using HTTP cookies](/en-US/docs/Web/HTTP/Cookies).
   */
  'Set-Cookie' = 'Set-Cookie',
  /**
   * The **`SourceMap`** [HTTP](/en-US/docs/Web/HTTP) response header links generated code to a [source map](https://firefox-source-docs.mozilla.org/devtools-user/debugger/how_to/use_a_source_map/index.html), enabling the browser to reconstruct the original source and present the reconstructed original in the debugger.
   */
  'SourceMap' = 'SourceMap',
  /**
   * The HTTP **`Strict-Transport-Security`** response header (often abbreviated as [HSTS](https://developer.mozilla.org/en-US/docs/Glossary/HSTS)) informs browsers that the site should only be accessed using HTTPS, and that any future attempts to access it using HTTP should automatically be converted to HTTPS.
   *
   * > **Note:** This is more secure than simply configuring a HTTP to HTTPS (301) redirect on your server, where the initial HTTP connection is still vulnerable to a man-in-the-middle attack.
   */
  'Strict-Transport-Security' = 'Strict-Transport-Security',
  /**
   * The **`TE`** request header specifies the transfer encodings
   * the user agent is willing to accept. (you could informally call it
   * `Accept-Transfer-Encoding`, which would be more intuitive).
   *
   * > **Note:** In
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
   * The **`Timing-Allow-Origin`** response header specifies origins that are allowed to see values of attributes retrieved via features of the [Resource Timing API](/en-US/docs/Web/API/Resource_Timing_API), which would otherwise be reported as zero due to cross-origin restrictions.
   */
  'Timing-Allow-Origin' = 'Timing-Allow-Origin',
  /**
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
   * > **Note:** The [TE](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/TE) request header needs to be set to "trailers" to allow
   * > trailer fields.
   */
  'Trailer' = 'Trailer',
  /**
   * The **`Transfer-Encoding`** header specifies the form of encoding used to safely transfer the [payload body](https://developer.mozilla.org/en-US/docs/Glossary/Payload_body) to the user.
   *
   * > **Note:** [HTTP/2](https://en.wikipedia.org/wiki/HTTP/2) disallows all uses of the Transfer-Encoding header other than the HTTP/2 specific: `"trailers"`. HTTP 2 provides its own more efficient mechanisms for data streaming than chunked transfer and forbids the use of the header. Usage of the header in HTTP/2 may likely result in a specific `protocol error` as HTTP/2 Protocol prohibits the use.
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
   * > **Warning:** HTTP/2 explicitly disallows the use of this mechanism/header; it is specific to HTTP/1.1.
   */
  'Upgrade' = 'Upgrade',
  /**
   * The **User-Agent** [request header](https://developer.mozilla.org/en-US/docs/Glossary/request_header) is a characteristic string that lets servers and network peers identify the application, operating system, vendor, and/or version of the requesting [user agent](https://developer.mozilla.org/en-US/docs/Glossary/user_agent).
   *
   * > **Warning:** Please read [Browser detection using the user agent](/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent) for why serving different Web pages or services to different browsers is usually a bad idea.
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
   * > **Note:**
   * >
   * > - Client Hints are accessible only on secure origins (via TLS).
   * > - A server has to opt in to receive the `Viewport-Width` header from the client, by sending the [Accept-CH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH) response header.
   * > - Servers that opt in to the `Viewport-Width` client hint will typically also specify it in the [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) header. This informs caches that the server may send different responses based on the header value in a request.
   * > - `Viewport-Width` was removed from the original client hints specification in [draft-ietf-httpbis-client-hints-07](https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-client-hints-07). The proposed replacement is [`Sec-CH-Viewport-Width`](https://wicg.github.io/responsive-image-client-hints/#sec-ch-viewport-width) (Responsive Image Client Hints).
   */
  'Viewport-Width' = 'Viewport-Width',
  /**
   * The **`Want-Digest`** HTTP header is primarily used in a request, to ask the server to provide a [digest](https://developer.mozilla.org/en-US/docs/Glossary/digest) of the requested resource using the [Digest](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Digest) response header.
   *
   * The header contains identifiers for one or more digest algorithms that the sender wishes the server to use to create the digest.
   * The request may use [quality values](https://developer.mozilla.org/en-US/docs/Glossary/quality_values) to indicate its preference/order for particular digest algorithms.
   *
   * If `Want-Digest` does not include any digest algorithms that the server supports, the server may respond with:
   *
   * - a digest calculated using a different digest algorithm, or
   * - a [`400 Bad Request`](/en-US/docs/Web/HTTP/Status/400) error, and include another `Want-Digest` header with that response, listing the algorithms that it does support.
   *
   * See the page for the [Digest](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Digest) header for more information.
   */
  'Want-Digest' = 'Want-Digest',
  /**
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
   * > **Note:**
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
   * > **Note:** This header is part of the [General HTTP authentication framework](/en-US/docs/Web/HTTP/Authentication#the_general_http_authentication_framework), which can be used with a number of [authentication schemes](/en-US/docs/Web/HTTP/Authentication#authentication_schemes).
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
   * marker used by the server to indicate that the [MIME types](/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types) advertised in the
   * [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) headers should be followed and not be changed. The header allows you to avoid [MIME type sniffing](/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types#mime_sniffing) by saying that the MIME types are deliberately
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
   * > **Note:** `X-Content-Type-Options` only apply
   * > [request-blocking due to `nosniff`](https://fetch.spec.whatwg.org/#should-response-to-request-be-blocked-due-to-nosniff?)
   * > for [request destinations](https://fetch.spec.whatwg.org/#concept-request-destination) of "`script`"
   * > and "`style`". However, it also
   * > [enables Cross-Origin Read Blocking (CORB)](https://chromium.googlesource.com/chromium/src/+/master/services/network/cross_origin_read_blocking_explainer.md#determining-whether-a-response-is-corb_protected)
   * > protection for HTML, TXT, JSON and XML files (excluding SVG `image/svg+xml`).
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
   * > **Warning:** Improper use of this header can be a security risk. For details, see the [Security and privacy concerns](#security_and_privacy_concerns) section.
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
   *
   * This header is used for debugging, statistics, and generating location-dependent
   * content and by design it exposes privacy sensitive information, such as the IP address
   * of the client. Therefore the user's privacy must be kept in mind when deploying this
   * header.
   *
   * A standardized version of this header is the HTTP [Forwarded](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Forwarded) header.
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
   * The **`X-Frame-Options`** [HTTP](/en-US/docs/Web/HTTP) response header can be used to indicate whether or not a browser should be allowed to render a page in a [frame](https://developer.mozilla.org/en-US/docs/HTMLElement/frame), [iframe](https://developer.mozilla.org/en-US/docs/HTMLElement/iframe), [embed](https://developer.mozilla.org/en-US/docs/HTMLElement/embed) or [object](https://developer.mozilla.org/en-US/docs/HTMLElement/object). Sites can use this to avoid [click-jacking](/en-US/docs/Web/Security/Types_of_attacks#click-jacking) attacks, by ensuring that their content is not embedded into other sites.
   *
   * The added security is provided only if the user accessing the document is using a browser that supports `X-Frame-Options`.
   *
   * > **Note:** The [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) HTTP header has a [frame-ancestors](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors) directive which [obsoletes](https://w3c.github.io/webappsec-csp/#frame-ancestors-and-frame-options) this header for supporting browsers.
   */
  'X-Frame-Options' = 'X-Frame-Options',
  /**
   * The HTTP **`X-XSS-Protection`** response header is a feature of Internet Explorer, Chrome and Safari that stops pages from loading when they detect reflected cross-site scripting ([XSS](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting)) attacks. These protections are largely unnecessary in modern browsers when sites implement a strong [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) that disables the use of inline JavaScript (`'unsafe-inline'`).
   *
   * > **Warning:** Even though this feature can protect users of older web browsers that don't yet support [CSP](https://developer.mozilla.org/en-US/docs/Glossary/CSP), in some cases, **XSS protection can create XSS vulnerabilities** in otherwise safe websites. See the section below for more information.
   *
   * > **Note:**
   * >
   * > - Chrome has [removed their XSS Auditor](https://chromestatus.com/feature/5021976655560704)
   * > - Firefox has not, and [will not implement `X-XSS-Protection`](https://bugzilla.mozilla.org/show_bug.cgi?id=528661)
   * > - Edge has [retired their XSS filter](https://blogs.windows.com/windows-insider/2018/07/25/announcing-windows-10-insider-preview-build-17723-and-build-18204/)
   * >
   * > This means that if you do not need to support legacy browsers, it is recommended that you use [`Content-Security-Policy`](/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) without allowing `unsafe-inline` scripts instead.
   */
  'X-XSS-Protection' = 'X-XSS-Protection',
}
