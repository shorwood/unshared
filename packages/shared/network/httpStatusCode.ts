export enum HttpStatusCode {
  /**
   * The HTTP **`100 Continue`** informational status response code
   * indicates that everything so far is OK and that the client should continue with the
   * request or ignore it if it is already finished.
   *
   * To have a server check the request's headers, a client must send
   * [Expect](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Expect)`: 100-continue` as a header in its initial request
   * and receive a `100 Continue` status code in response before sending the body.
   */
  CONTINUE = 100,
  /**
   * The HTTP **`101 Switching Protocols`** response code indicates
   * a protocol to which the server switches.
   * The protocol is specified in the [Upgrade](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Upgrade) request header received from a client.
   *
   * The server includes in this response an [Upgrade](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Upgrade) response header to
   * indicate the protocol it switched to. The process is described in the following article:
   * [Protocol upgrade mechanism](/en-US/docs/Web/HTTP/Protocol_upgrade_mechanism).
   */
  SWITCHING_PROTOCOLS = 101,
  /**
   * The HTTP **`103 Early Hints`** information response status code
   * is primarily intended to be used with the [Link](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Link) header to allow the
   * user agent to start preloading resources while the server is still preparing a response.
   */
  EARLY_HINTS = 103,
  /**
   * The HTTP **`200 OK`** success status response code indicates that the request has succeeded. A 200 response is cacheable by default.
   *
   * The meaning of a success depends on the HTTP request method:
   *
   * - [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET): The resource has been fetched and is transmitted in the message body.
   * - [HEAD](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/HEAD): The representation headers are included in the response without any message body
   * - [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/POST): The resource describing the result of the action is transmitted in the message body
   * - [TRACE](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/TRACE): The message body contains the request message as received by the server.
   *
   * The successful result of a [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/PUT) or a [DELETE](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/DELETE) is often not a `200 OK` but a [204](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204) `No Content` (or a [201](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201) `Created` when the resource is uploaded for the first time).
   */
  OK = 200,
  /**
   * The HTTP **`201 Created`** success status response code indicates that the request has
   * succeeded and has led to the creation of a resource. The new resource, or a description
   * and link to the new resource, is effectively created before the response is sent back
   * and the newly created items are returned in the body of the message, located at either
   * the URL of the request, or at the URL in the value of the [Location](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Location) header.
   *
   * The common use case of this status code is as the result of a [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/POST)
   * request.
   */
  CREATED = 201,
  /**
   * The HyperText Transfer Protocol (HTTP) **`202 Accepted`**
   * response status code indicates that the request has been accepted for processing, but
   * the processing has not been completed; in fact, processing may not have started yet. The
   * request might or might not eventually be acted upon, as it might be disallowed when
   * processing actually takes place.
   *
   * 202 is non-committal, meaning that there is no way for the HTTP to later send an
   * asynchronous response indicating the outcome of processing the request. It is intended
   * for cases where another process or server handles the request, or for batch processing.
   */
  ACCEPTED = 202,
  /**
   * The HTTP **`203 Non-Authoritative Information`** response
   * status indicates that the request was successful but the enclosed payload has been
   * modified by a transforming [proxy](https://developer.mozilla.org/en-US/docs/Glossary/Proxy_server) from that of the origin
   * server's [200](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200) (`OK`) response .
   *
   * The `203` response is similar to the value
   * [`214`](/en-US/docs/Web/HTTP/Headers/Warning#warning_codes),
   * meaning `Transformation Applied`, of the [Warning](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Warning) header
   * code, which has the additional advantage of being applicable to responses with any
   * status code.
   */
  NON_AUTHORITATIVE_INFORMATION = 203,
  /**
   * The HTTP **`204 No Content`** success status response code
   * indicates that a request has succeeded, but that the client doesn't need to navigate away
   * from its current page.
   *
   * This might be used, for example, when implementing "save and continue editing" functionality for a wiki site.
   * In this case a [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/PUT) request would be used to save the page, and the `204 No Content` response
   * would be sent to indicate that the editor should not be replaced by some other page.
   *
   * A 204 response is cacheable by default (an [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) header is included in such a response).
   */
  NO_CONTENT = 204,
  /**
   * The HTTP **`205 Reset Content`** response status tells the
   * client to reset the document view, so for example to clear the content of a form, reset
   * a canvas state, or to refresh the UI.
   */
  RESET_CONTENT = 205,
  /**
   * The HTTP **`206 Partial Content`** success status response code
   * indicates that the request has succeeded and the body contains the requested ranges
   * of data, as described in the [Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Range) header of the request.
   *
   * If there is only one range, the [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) of the whole response is
   * set to the type of the document, and a [Content-Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Range) is provided.
   *
   * If several ranges are sent back, the [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) is set to
   * `multipart/byteranges` and each fragment covers one range, with
   * [Content-Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Range) and [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) describing it.
   */
  PARTIAL_CONTENT = 206,
  /**
   * The HTTP **`300 Multiple Choices`** redirect status response
   * code indicates that the request has more than one possible responses. The user-agent
   * or the user should choose one of them. As there is no standardized way of choosing one
   * of the responses, this response code is very rarely used.
   *
   * If the server has a preferred choice, it should generate a [Location](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Location)
   * header.
   */
  MULTIPLE_CHOICES = 300,
  /**
   * The HyperText Transfer Protocol (HTTP) **`301 Moved Permanently`** redirect status response code indicates that the requested resource has been definitively moved to the URL given by the [Location](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Location) headers. A browser redirects to the new URL and search engines update their links to the resource.
   *
   * > **Note:** Although the [specification](#specifications) requires the method and the body to remain unchanged when the redirection is performed, not all user-agents meet this requirement. Use the `301` code only as a response for [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) or [HEAD](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/HEAD) methods and use the [308 Permanent Redirect](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/308) for [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/POST) methods instead, as the method change is explicitly prohibited with this status.
   */
  MOVED_PERMANENTLY = 301,
  /**
   * The HyperText Transfer Protocol (HTTP) **`302 Found`** redirect
   * status response code indicates that the resource requested has been temporarily moved to
   * the URL given by the [Location](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Location) header. A browser redirects to this page
   * but search engines don't update their links to the resource (in 'SEO-speak', it is said
   * that the 'link-juice' is not sent to the new URL).
   *
   * Even if the specification requires the method (and the body) not to be altered when the
   * redirection is performed, not all user-agents conform here - you can still find this
   * type of bugged software out there. It is therefore recommended to set the
   * `302` code only as a response for [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) or
   * [HEAD](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/HEAD) methods and to use [307 Temporary Redirect](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/307) instead, as the method change is explicitly prohibited in that case.
   *
   * In the cases where you want the method used to be changed to [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET), use
   * [303 See Other](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/303) instead. This is useful when you want to give a
   * response to a [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/PUT) method that is not the uploaded resource but a
   * confirmation message such as: 'you successfully uploaded XYZ'.
   */
  FOUND = 302,
  /**
   * The HyperText Transfer Protocol (HTTP) **`303 See Other`**
   * redirect status response code indicates that the redirects don't link to the requested resource itself, but to another page (such as a confirmation page, a representation of a real-world object — see [HTTP range-14](https://en.wikipedia.org/wiki/HTTPRange-14) — or an upload-progress page). This response code is often sent back as a result of
   * [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/PUT) or [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/POST). The method used to display this
   * redirected page is always [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET).
   */
  SEE_OTHER = 303,
  /**
   * The HTTP **`304 Not Modified`** client redirection response
   * code indicates that there is no need to retransmit the requested resources. It is an
   * implicit redirection to a cached resource. This happens when the request method is
   * a [safe](https://developer.mozilla.org/en-US/docs/glossary/Safe/HTTP) method, such as [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) or [HEAD](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/HEAD),
   * or when the request is conditional and uses an [If-None-Match](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-None-Match) or an
   * [If-Modified-Since](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Modified-Since) header.
   *
   * The equivalent [200](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200) `OK` response would have included the
   * headers [Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control), [Content-Location](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Location),
   * [Date](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Date), [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag), [Expires](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Expires), and
   * [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary).
   *
   * > **Note:** Many [developer tools' network panels](https://firefox-source-docs.mozilla.org/devtools-user/network_monitor/index.html)
   * > of browsers create extraneous requests leading to `304` responses, so that
   * > access to the local cache is visible to developers.
   */
  NOT_MODIFIED = 304,
  /**
   * [HTTP](https://developer.mozilla.org/en-US/docs/Glossary/HTTP) **`307 Temporary Redirect`** redirect
   * status response code indicates that the resource requested has been temporarily moved to
   * the URL given by the [Location](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Location) headers.
   *
   * The method and the body of the original request are reused to perform the redirected
   * request. In the cases where you want the method used to be changed to
   * [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET), use [303 See Other](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/303) instead. This is
   * useful when you want to give an answer to a [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/PUT) method that is not the
   * uploaded resources, but a confirmation message (like "You successfully uploaded XYZ").
   *
   * The only difference between `307` and [302](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/302) is that
   * `307` guarantees that the method and the body will not be changed when the
   * redirected request is made. With `302`, some old clients were incorrectly
   * changing the method to [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET): the behavior with non-`GET`
   * methods and `302` is then unpredictable on the Web, whereas the behavior with
   * `307` is predictable. For `GET` requests, their behavior is
   * identical.
   */
  TEMPORARY_REDIRECT = 307,
  /**
   * The HyperText Transfer Protocol (HTTP)
   * **`308 Permanent Redirect`** redirect status response code
   * indicates that the resource requested has been definitively moved to the URL given by
   * the [Location](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Location) headers. A browser redirects to this page and search
   * engines update their links to the resource (in 'SEO-speak', it is said that the
   * 'link-juice' is sent to the new URL).
   *
   * The request method and the body will not be altered, whereas [301](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/301) may
   * incorrectly sometimes be changed to a [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) method.
   *
   * > **Note:** Some Web applications may use the
   * > `308 Permanent Redirect` in a non-standard way and for other purposes. For
   * > example, Google Drive uses a `308 Resume Incomplete` response to indicate
   * > to the client when an incomplete upload stalled. (See [Perform a resumable download](https://developers.google.com/drive/api/guides/manage-uploads) on Google Drive documentation.)
   */
  PERMANENT_REDIRECT = 308,
  /**
   * The HyperText Transfer Protocol (HTTP) **`400 Bad Request`** response status code indicates that the server cannot or will not process the request due to something that is perceived to be a client error (for example, malformed request syntax, invalid request message framing, or deceptive request routing).
   *
   * > **Warning:** The client should not repeat this request without modification.
   */
  BAD_REQUEST = 400,
  /**
   * The HyperText Transfer Protocol (HTTP) **`401 Unauthorized`** response status code indicates that the client request has not been
   * completed because it lacks valid authentication credentials for the requested resource.
   *
   * This status code is sent with an HTTP [WWW-Authenticate](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/WWW-Authenticate) response header that contains
   * information on how the client can request for the resource again after prompting the user for authentication credentials.
   *
   * This status code is similar to the [403 Forbidden](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403) status code, except that in situations resulting in this
   * status code, user authentication can allow access to the resource.
   */
  UNAUTHORIZED = 401,
  /**
   * The HTTP **`402 Payment Required`** is a nonstandard response status code that is reserved for future use. This status code was created to enable digital cash or (micro) payment systems and would indicate that the requested content is not available until the client makes a payment.
   *
   * Sometimes, this status code indicates that the request cannot be processed until the client makes a payment. However, no standard use convention exists and different entities use it in different contexts.
   */
  PAYMENT_REQUIRED = 402,
  /**
   * The HTTP **`403 Forbidden`** response status code indicates that the server understands the request but refuses to authorize it.
   *
   * This status is similar to [401](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401), but for the **`403 Forbidden`** status code, re-authenticating makes no difference. The access is tied to the application logic, such as insufficient rights to a resource.
   */
  FORBIDDEN = 403,
  /**
   * The HTTP **`404 Not Found`** response status code indicates that the server cannot find the requested resource.
   * Links that lead to a 404 page are often called broken or dead links and can be subject to [link rot](https://en.wikipedia.org/wiki/Link_rot).
   *
   * A 404 status code only indicates that the resource is missing: not whether the absence is temporary or permanent.
   * If a resource is permanently removed, use the [410](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/410) (Gone) status instead.
   */
  NOT_FOUND = 404,
  /**
   * The HyperText Transfer Protocol (HTTP) **`405 Method Not Allowed`** response status code indicates that the server knows the request method, but the target resource doesn't support this method.
   *
   * The server **must** generate an **`Allow`** header field in a 405 status code response. The field must contain a list of methods that the target resource currently supports.
   */
  METHOD_NOT_ALLOWED = 405,
  /**
   * The HyperText Transfer Protocol (HTTP) **`406 Not Acceptable`**
   * client error response code indicates that the server cannot produce a response matching
   * the list of acceptable values defined in the request's proactive [content negotiation](/en-US/docs/Web/HTTP/Content_negotiation) headers, and
   * that the server is unwilling to supply a default representation.
   *
   * Proactive content negotiation headers include:
   *
   * - [Accept](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept)
   * - [Accept-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding)
   * - [Accept-Language](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language)
   *
   * In practice, this error is very rarely used. Instead of responding using this error
   * code, which would be cryptic for the end user and difficult to fix, servers ignore the
   * relevant header and serve an actual page to the user. It is assumed that even if the
   * user won't be completely happy, they will prefer this to an error code.
   *
   * If a server returns such an error status, the body of the message should contain the
   * list of the available representations of the resources, allowing the user to choose
   * among them.
   */
  NOT_ACCEPTABLE = 406,
  /**
   * The HTTP **`407 Proxy Authentication Required`** client error
   * status response code indicates that the request has not been applied because it lacks
   * valid authentication credentials for a [proxy server](https://developer.mozilla.org/en-US/docs/Glossary/proxy_server) that is between the
   * browser and the server that can access the requested resource.
   *
   * This status is sent with a [Proxy-Authenticate](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Proxy-Authenticate) header that contains
   * information on how to authorize correctly.
   */
  PROXY_AUTHENTICATION_REQUIRED = 407,
  /**
   * The HyperText Transfer Protocol (HTTP)
   * **`408 Request Timeout`** response status code means that the
   * server would like to shut down this unused connection. It is sent on an idle connection
   * by some servers, _even without any previous request by the client_.
   *
   * A server should send the "close" [Connection](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Connection) header field in the
   * response, since `408` implies that the server has decided to close the
   * connection rather than continue waiting.
   *
   * This response is used much more since some browsers, like Chrome, Firefox 27+, and IE9,
   * use HTTP pre-connection mechanisms to speed up surfing.
   *
   * > **Note:** some servers merely shut down the connection without sending
   * > this message.
   */
  REQUEST_TIMEOUT = 408,
  /**
   * The HTTP **`409 Conflict`** response status code indicates a request conflict with the current state of the target resource.
   *
   * Conflicts are most likely to occur in response to a [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/PUT) request. For example, you may get a 409 response when uploading a file that is older than the existing one on the server, resulting in a version control conflict.
   */
  CONFLICT = 409,
  /**
   * The HyperText Transfer Protocol (HTTP) **`410 Gone`** client error response code indicates that access to the target resource is no longer available at the origin server and that this condition is likely to be permanent.
   *
   * If you don't know whether this condition is temporary or permanent, a  status code should be used instead.
   *
   * > **Note:** A 410 response is cacheable by default.
   */
  GONE = 410,
  /**
   * The HyperText Transfer Protocol (HTTP)
   * **`411 Length Required`** client error response code indicates
   * that the server refuses to accept the request without a defined
   * [Content-Length](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Length) header.
   *
   * > **Note:** by specification, when sending data in a series of chunks, the
   * > `Content-Length` header is omitted and at the beginning of each chunk you
   * > need to add the length of the current chunk in hexadecimal format. See
   * > [Transfer-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Transfer-Encoding) for more details.
   */
  LENGTH_REQUIRED = 411,
  /**
   * The HyperText Transfer Protocol (HTTP)
   * **`412 Precondition Failed`** client error response code
   * indicates that access to the target resource has been denied. This happens with
   * conditional requests on methods other than [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) or
   * [HEAD](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/HEAD) when the condition defined by the
   * [If-Unmodified-Since](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Unmodified-Since) or [If-None-Match](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-None-Match) headers is not
   * fulfilled. In that case, the request, usually an upload or a modification of a resource,
   * cannot be made and this error response is sent back.
   */
  PRECONDITION_FAILED = 412,
  /**
   * The HTTP **`413 Payload Too Large`** response status code indicates that the request entity is larger than limits defined by server; the server might close the connection or return a [Retry-After](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After) header field.
   */
  PAYLOAD_TOO_LARGE = 413,
  /**
   * The HTTP **`414 URI Too Long`** response status code indicates
   * that the URI requested by the client is longer than the server is willing to interpret.
   *
   * There are a few rare conditions when this might occur:
   *
   * - when a client has improperly converted a [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/POST) request to a
   *   [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) request with long query information,
   * - when the client has descended into a loop of redirection (for example, a redirected
   *   URI prefix that points to a suffix of itself),
   * - or when the server is under attack by a client attempting to exploit potential
   *   security holes.
   */
  URI_TOO_LONG = 414,
  /**
   * The HTTP **`415 Unsupported Media Type`** client error response
   * code indicates that the server refuses to accept the request because the payload format
   * is in an unsupported format.
   *
   * The format problem might be due to the request's indicated
   * [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) or [Content-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding), or as a result of
   * inspecting the data directly.
   */
  UNSUPPORTED_MEDIA_TYPE = 415,
  /**
   * The HyperText Transfer Protocol (HTTP) **`416 Range Not Satisfiable`** error response code indicates that a server cannot serve the requested ranges. The most likely reason is that the document doesn't contain such ranges, or that the [Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Range) header value, though syntactically correct, doesn't make sense.
   *
   * The `416` response message contains a [Content-Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Range) indicating an unsatisfied range (that is a `'*'`) followed by a `'/'` and the current length of the resource. E.g. `Content-Range: bytes * /12777`
   *
   * Faced with this error, browsers usually either abort the operation (for example, a download will be considered as non-resumable) or ask for the whole document again.
   */
  RANGE_NOT_SATISFIABLE = 416,
  /**
   * The HTTP **`417 Expectation Failed`** client error response
   * code indicates that the expectation given in the request's [Expect](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Expect)
   * header could not be met.
   *
   * See the [Expect](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Expect) header for more details.
   */
  EXPECTATION_FAILED = 417,
  /**
   * The HTTP **`418 I'm a teapot`** client error response code indicates that the server refuses to brew coffee because it is, permanently, a teapot. A combined coffee/tea pot that is temporarily out of coffee should instead return 503. This error is a reference to Hyper Text Coffee Pot Control Protocol defined in April Fools' jokes in 1998 and 2014.
   *
   * Some websites use this response for requests they do not wish to handle, such as automated queries.
   */
  I_M_A_TEAPOT = 418,
  /**
   * The HyperText Transfer Protocol (HTTP)
   * **`422 Unprocessable Entity`** response status code indicates
   * that the server understands the content type of the request entity, and the syntax of
   * the request entity is correct, but it was unable to process the contained instructions.
   *
   * > **Warning:** The client should not repeat this request without modification.
   */
  UNPROCESSABLE_ENTITY = 422,
  /**
   * The HyperText Transfer Protocol (HTTP) **`425 Too Early`**
   * response status code indicates that the server is unwilling to risk processing a request
   * that might be replayed, which creates the potential for a replay attack.
   */
  TOO_EARLY = 425,
  /**
   * The HTTP **`426 Upgrade Required`** client error response code
   * indicates that the server refuses to perform the request using the current protocol but
   * might be willing to do so after the client upgrades to a different protocol.
   *
   * The server sends an [Upgrade](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Upgrade) header with this response to indicate the
   * required protocol(s).
   */
  UPGRADE_REQUIRED = 426,
  /**
   * The HTTP **`428 Precondition Required`** response status code
   * indicates that the server requires the request to be [conditional](/en-US/docs/Web/HTTP/Conditional_requests).
   *
   * Typically, this means that a required precondition header, such
   * as [If-Match](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Match), **is missing**.
   *
   * When a precondition header is **not matching** the server side state, the
   * response should be  `Precondition Failed`.
   */
  PRECONDITION_REQUIRED = 428,
  /**
   * The HTTP **`429 Too Many Requests`** response status code indicates the user has sent too many requests in a given amount of time ("rate limiting").
   *
   * A [Retry-After](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After) header might be included to this response indicating how long to wait before making a new request.
   */
  TOO_MANY_REQUESTS = 429,
  /**
   * The HTTP **`431 Request Header Fields Too Large`** response status code
   * indicates that the server refuses to process the request because the request's
   * [HTTP headers](/en-US/docs/Web/HTTP/Headers) are too long.
   * The request _may_ be resubmitted after reducing the size of the request headers.
   *
   * 431 can be used when the **total size** of request headers is too large,
   * or when a **single** header field is too large. To help those running into
   * this error, indicate which of the two is the problem in the response body — ideally,
   * also include which headers are too large. This lets users attempt to fix the problem,
   * such as by clearing their cookies.
   *
   * Servers will often produce this status if:
   *
   * - The  URL is too long
   * - There are too many [Cookies](/en-US/docs/Web/HTTP/Cookies) sent in the
   *   request
   */
  REQUEST_HEADER_FIELDS_TOO_LARGE = 431,
  /**
   * The HyperText Transfer Protocol (HTTP) **`451 Unavailable For Legal Reasons`** client error response code indicates that the user requested a resource that is not available due to legal reasons, such as a web page for which a legal action has been issued.
   */
  UNAVAILABLE_FOR_LEGAL_REASONS = 451,
  /**
   * The HyperText Transfer Protocol (HTTP) **`500 Internal Server Error`** server error response code indicates that the server encountered an unexpected condition that prevented it from fulfilling the request.
   *
   * This error response is a generic "catch-all" response. Usually, this indicates the server cannot find a better 5xx error code to response. Sometimes, server administrators log error responses like the 500 status code with more details about the request to prevent the error from happening again in the future.
   */
  INTERNAL_SERVER_ERROR = 500,
  /**
   * The HyperText Transfer Protocol (HTTP) **`501 Not Implemented`** server error response code means that **the server does not support the functionality required to fulfill the request**.
   *
   * This status can also send a [Retry-After](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After) header, telling the requester when to check back to see if the functionality is supported by then.
   *
   * `501` is the appropriate response when the server does not recognize the request method and is incapable of supporting it for any resource. The only methods that servers are required to support (and therefore that must not return `501`) are [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) and [HEAD](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/HEAD).
   *
   * If the server _does_ recognize the method, but intentionally does not support it, the appropriate response is .
   *
   * > **Note:**
   * >
   * > - A 501 error is not something you can fix, but requires a fix by the web server you are trying to access.
   * > - A 501 response is cacheable by default; that is, unless caching headers instruct otherwise.
   */
  NOT_IMPLEMENTED = 501,
  /**
   * The HyperText Transfer Protocol (HTTP) **`502 Bad Gateway`** server error response code indicates that the server, while acting as a gateway or proxy, received an invalid response from the upstream server.
   *
   * > **Note:** A [Gateway](<https://en.wikipedia.org/wiki/Gateway_(telecommunications)>) might refer to different things in networking and a 502 error is usually not something you can fix, but requires a fix by the web server or the proxies you are trying to get access through.
   */
  BAD_GATEWAY = 502,
  /**
   * The HyperText Transfer Protocol (HTTP) **`503 Service Unavailable`** server error response code indicates that the server is not ready to handle the request.
   *
   * Common causes are a server that is down for maintenance or that is overloaded. This response should be used for temporary conditions and the [Retry-After](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After) HTTP header should, if possible, contain the estimated time for the recovery of the service.
   *
   * > **Note:** together with this response, a user-friendly page explaining the problem should be sent.
   *
   * Caching-related headers that are sent along with this response should be taken care of, as a 503 status is often a temporary condition and responses shouldn't usually be cached.
   */
  SERVICE_UNAVAILABLE = 503,
  /**
   * The HyperText Transfer Protocol (HTTP) **`504 Gateway Timeout`** server error response code indicates that the server, while acting as a gateway or proxy, did not get a response in time from the upstream server that it needed in order to complete the request.
   *
   * > **Note:** A [Gateway](<https://en.wikipedia.org/wiki/Gateway_(telecommunications)>) might refer to different things in networking and a 504 error is usually not something you can fix, but requires a fix by the web server or the proxies you are trying to get access through.
   */
  GATEWAY_TIMEOUT = 504,
  /**
   * The HyperText Transfer Protocol (HTTP)
   * **`505 HTTP Version Not Supported`** response status code
   * indicates that the HTTP version used in the request is not supported by the server.
   */
  HTTP_VERSION_NOT_SUPPORTED = 505,
  /**
   * The HyperText Transfer Protocol (HTTP) **`506 Variant Also Negotiates`** response status code may be given in the context of Transparent Content Negotiation (see [RFC 2295](https://datatracker.ietf.org/doc/html/rfc2295)). This protocol enables a client to retrieve the best variant of a given resource, where the server supports multiple variants.
   *
   * The **`Variant Also Negotiates`** status code indicates an internal server configuration error in which the chosen variant is itself configured to engage in content negotiation, so is not a proper negotiation endpoint.
   */
  VARIANT_ALSO_NEGOTIATES = 506,
  /**
   * The HyperText Transfer Protocol (HTTP) **`507 Insufficient Storage`** response status code may be given in the context of the Web Distributed Authoring and Versioning (WebDAV) protocol (see [RFC 4918](https://datatracker.ietf.org/doc/html/rfc4918)).
   *
   * It indicates that a method could not be performed because the server cannot store the representation needed to successfully complete the request.
   */
  INSUFFICIENT_STORAGE = 507,
  /**
   * The HyperText Transfer Protocol (HTTP) **`508 Loop Detected`**
   * response status code may be given in the context of the Web Distributed Authoring and
   * Versioning (WebDAV) protocol.
   *
   * It indicates that the server terminated an operation because it encountered an infinite
   * loop while processing a request with "Depth: infinity". This status indicates that the
   * entire operation failed.
   */
  LOOP_DETECTED = 508,
  /**
   * The HyperText Transfer Protocol (HTTP) **`510 Not Extended`**
   * response status code is sent in the context of the HTTP Extension Framework, defined in
   * [RFC 2774](https://datatracker.ietf.org/doc/html/rfc2774).
   *
   * In that specification a client may send a request that contains an extension
   * declaration, that describes the extension to be used. If the server receives such a
   * request, but any described extensions are not supported for the request, then the server
   * responds with the 510 status code.
   */
  NOT_EXTENDED = 510,
  /**
   * The HTTP **`511 Network Authentication Required`** response
   * status code indicates that the client needs to authenticate to gain network access.
   *
   * This status is not generated by origin servers, but by intercepting proxies that
   * control access to the network.
   *
   * Network operators sometimes require some authentication, acceptance of terms, or other
   * user interaction before granting access (for example in an internet café or at an
   * airport). They often identify clients who have not done so using their Media Access
   * Control (MAC) addresses.
   */
  NETWORK_AUTHENTICATION_REQUIRED = 511,
}
