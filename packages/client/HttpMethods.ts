/* eslint-disable jsdoc/check-indentation */
export enum HttpMethod {

  /**
   * The **`CONNECT`** HTTP method requests that a [proxy](https://developer.mozilla.org/en-US/docs/Glossary/Proxy_server) establish a HTTP tunnel to a destination server, and if successful, blindly forward data in both directions until the tunnel is closed.
   *
   * The request target is unique to this method in that it consists of only the host and port number of the tunnel destination, separated by a colon (see [Syntax](#syntax) for details).
   * Any [2XX successful response status code](/en-US/docs/Web/HTTP/Reference/Status#successful_responses) means that the proxy will switch to 'tunnel mode' and any data in the success response body is from the server identified by the request target.
   *
   * If a website is behind a proxy and it's enforced via network rules that all external traffic must pass through the proxy, the `CONNECT` method allows you to establish a [TLS](https://developer.mozilla.org/en-US/docs/Glossary/TLS) ([HTTPS](https://developer.mozilla.org/en-US/docs/Glossary/HTTPS)) connection with that website:
   *
   * - The client asks the proxy to tunnel the [TCP](https://developer.mozilla.org/en-US/docs/Glossary/TCP) connection to the desired destination.
   * - The proxy server makes a secure connection to the server on behalf of the client.
   * - Once the connection is established, the proxy server continues to relay the TCP stream to and from the client.
   *
   * Aside from enabling secure access to websites behind proxies, a HTTP tunnel provides a way to allow traffic that would otherwise be restricted (SSH or FTP) over the HTTP(S) protocol.
   *
   * `CONNECT` is a hop-by-hop method, meaning proxies will only forward the `CONNECT` request if there is another inbound proxy in front of the origin server since most origin servers do not implement `CONNECT`.
   *
   * > [!WARNING]
   * > If you are running a proxy that supports `CONNECT`, restrict its use to a set of known ports or a configurable list of safe request targets.
   * > There are significant risks in establishing a tunnel to arbitrary servers, particularly when the destination is a well-known or reserved TCP port that is not intended for Web traffic.
   * > A loosely-configured proxy may be abused to forward traffic such as SMTP to relay spam email, for example.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * CONNECT <host>:<port> HTTP/1.1
   * ```
   *
   * - `<host>`
   *   - : A host which may be a registered hostname (e.g., `example.com`) or an IP address (IPv4, IPv6).
   * - `<port>`
   *   - : A port number in decimal (e.g., `80`, `443`). There is no default port, so a client **must** send one.
   *
   * ## Examples
   *
   * ### Proxy authorization
   *
   * A request for proxy servers that require authorization to create a tunnel looks as follows.
   * See the [Proxy-Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Proxy-Authorization) header for more information.
   *
   * ```http
   * CONNECT server.example.com:80 HTTP/1.1
   * Host: server.example.com:80
   * Proxy-Authorization: basic aGVsbG86d29ybGQ=
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [HTTP request methods](/en-US/docs/Web/HTTP/Reference/Methods)
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [HTTP headers](/en-US/docs/Web/HTTP/Reference/Headers)
   * - [Proxy server](https://developer.mozilla.org/en-US/docs/Glossary/Proxy_server) glossary entry
   * - [Proxy-Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Proxy-Authorization) header
   * - [How To Use SSH Over An HTTP Proxy](https://www.dimoulis.net/posts/ssh-over-proxy/) dimoulis.net (2023)
   */
  CONNECT = 'CONNECT',

  /**
   * The **`DELETE`** HTTP method asks the server to delete a specified resource.
   *
   * The `DELETE` method has no defined semantics for the message body, so this should be empty.
   *
   *
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * The browser doesn't use the `DELETE` method for user-initiated actions, so "browser compatibility" doesn't apply.
   * Developers can set this request method using [`fetch()`](/en-US/docs/Web/API/Window/fetch).
   *
   * ## See also
   *
   * - HTTP statuses: [200](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200), [202](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/202), [204](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204)
   * - [HTTP request methods](/en-US/docs/Web/HTTP/Reference/Methods)
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [HTTP headers](/en-US/docs/Web/HTTP/Reference/Headers)
   */
  DELETE = 'DELETE',

  /**
   * The **`GET`** HTTP method requests a representation of the specified resource.
   * Requests using `GET` should only be used to request data and shouldn't contain a body.
   *
   * > [!NOTE]
   * > The semantics of sending a message body in `GET` requests are undefined.
   * > Some servers may reject the request with a [4XX client error](/en-US/docs/Web/HTTP/Reference/Status#client_error_responses) response.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * GET <request-target>["?"<query>] HTTP/1.1
   * ```
   *
   * - `<request-target>`
   *   - : Identifies the target resource of the request when combined with the information provided in the [Host](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Host) header.
   *     This is an absolute path (e.g., `/path/to/file.html`) in requests to an origin server, and an absolute URL in requests to proxies (e.g., `http://www.example.com/path/to/file.html`).
   * - `<query>`
   *   - : An optional query component preceded by a question-mark `?`.
   *     Often used to carry identifying information in the form of `key=value` pairs.
   *
   * ## Examples
   *
   * ### Successfully retrieving a resource
   *
   * The following `GET` request asks for the resource at `example.com/contact`:
   *
   * ```http
   * GET /contact HTTP/1.1
   * Host: example.com
   * User-Agent: curl/8.6.0
   * Accept: * /*
   * ```
   *
   * The server sends back the resource with a [200 OK](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200) status code, indicating success:
   *
   * ```http
   * HTTP/1.1 200 OK
   * Content-Type: text/html; charset=UTF-8
   * Date: Fri, 21 Jun 2024 14:18:33 GMT
   * Last-Modified: Thu, 17 Oct 2019 07:18:26 GMT
   * Content-Length: 1234
   *
   * <!doctype html>
   * <!-- HTML content follows -->
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [HTTP request methods](/en-US/docs/Web/HTTP/Reference/Methods)
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [HTTP headers](/en-US/docs/Web/HTTP/Reference/Headers)
   * - [Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Range) header
   * - [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/POST) method
   */
  GET = 'GET',

  /**
   * The **`HEAD`** HTTP method requests the metadata of a resource in the form of [headers](/en-US/docs/Web/HTTP/Reference/Headers) that the server would have sent if the [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) method was used instead.
   * This method can be used in cases where a URL might produce a large download, for example, a `HEAD` request can read the [Content-Length](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Length) header to check the file size before downloading the file with a `GET`.
   *
   * If the response to a `HEAD` request shows that a cached URL response is now outdated, the cached copy is invalidated even if no `GET` request was made.
   *
   * > [!WARNING]
   * > If a response to a `HEAD` request has a body, the response body must be ignored.
   * > Any [representation headers](https://developer.mozilla.org/en-US/docs/glossary/Representation_header) that describe the erroneous body are assumed to describe the response body that a `GET` request would have received.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * HEAD <request-target>["?"<query>] HTTP/1.1
   * ```
   *
   * - `<request-target>`
   *   - : Identifies the target resource of the request when combined with the information provided in the [Host](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Host) header.
   *     This is an absolute path (e.g., `/path/to/file.html`) in requests to an origin server, and an absolute URL in requests to proxies (e.g., `http://www.example.com/path/to/file.html`).
   * - `<query>`
   *   - : An optional query component preceded by a question-mark `?`.
   *     Often used to carry identifying information in the form of `key=value` pairs.
   *
   * ## Examples
   *
   * ### Successfully retrieving resource metadata
   *
   * The following `curl` command creates a `HEAD` request for `example.com`:
   *
   * ```bash
   * curl --head example.com
   * ```
   *
   * This is the equivalent to a `GET` request, except the server shouldn't include a message body in the response.
   * It creates an HTTP request that looks like this:
   *
   * ```http
   * HEAD / HTTP/1.1
   * Host: example.com
   * User-Agent: curl/8.6.0
   * Accept: * /*
   * ```
   *
   * The server sends back a [200 OK](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200) response comprised only of headers.
   * The response is effectively metadata that describes the resource instead of the resource itself (some [caching](/en-US/docs/Web/HTTP/Guides/Caching) headers are omitted in this example for brevity):
   *
   * ```http
   * HTTP/1.1 200 OK
   * Content-Type: text/html; charset=UTF-8
   * Date: Wed, 04 Sep 2024 10:33:11 GMT
   * Content-Length: 1234567
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [HTTP request methods](/en-US/docs/Web/HTTP/Reference/Methods)
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [HTTP headers](/en-US/docs/Web/HTTP/Reference/Headers)
   * - [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) method
   */
  HEAD = 'HEAD',

  /**
   * The **`OPTIONS`** HTTP method requests permitted communication options for a given URL or server.
   * This can be used to test the allowed HTTP methods for a request, or to determine whether a request would succeed when making a CORS preflighted request.
   * A client can specify a URL with this method, or an asterisk (`*`) to refer to the entire server.
   *
   *
   *
   * \* Although an `OPTIONS` message with a request body is technically allowed, it has no defined semantics.
   * You may include a body in an `OPTIONS` message as long as you provide a valid [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) header, and when you know the server expects it, as behavior is implementation-specific.
   *
   * ## Syntax
   *
   * ```http
   * OPTIONS *|<request-target>["?"<query>] HTTP/1.1
   * ```
   *
   * The request target may be either in 'asterisk form' `*` indicating the whole server, or a request target as is common with other methods:
   *
   * - `*`
   *   - : Indicates that the client wishes to request `OPTIONS` for the server as a whole, as opposed to a specific named resource of that server.
   * - `<request-target>`
   *   - : Identifies the target resource of the request when combined with the information provided in the [Host](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Host) header.
   *     This is an absolute path (e.g., `/path/to/file.html`) in requests to an origin server, and an absolute URL in requests to proxies (e.g., `http://www.example.com/path/to/file.html`).
   * - `<query>`
   *   - : An optional query component preceded by a question-mark `?`.
   *     Often used to carry identifying information in the form of `key=value` pairs.
   *
   * ## Examples
   *
   * ### Identifying allowed request methods
   *
   * To find out which request methods a server supports, one can use the `curl` command-line program to issue an `OPTIONS` request:
   *
   * ```bash
   * curl -X OPTIONS https://example.org -i
   * ```
   *
   * This creates the following HTTP request:
   *
   * ```http
   * OPTIONS / HTTP/2
   * Host: example.org
   * User-Agent: curl/8.7.1
   * Accept: * /*
   * ```
   *
   * The response contains an [Allow](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Allow) header that holds the allowed methods:
   *
   * ```http
   * HTTP/1.1 204 No Content
   * Allow: OPTIONS, GET, HEAD, POST
   * Cache-Control: max-age=604800
   * Date: Thu, 13 Oct 2016 11:45:00 GMT
   * Server: EOS (lax004/2813)
   * ```
   *
   * ### Preflighted requests in CORS
   *
   * In [CORS](/en-US/docs/Web/HTTP/Guides/CORS), a [preflight request](/en-US/docs/Glossary/Preflight_request) is sent with the `OPTIONS` method so that the server can respond if it is acceptable to send the request. In this example, we will request permission for these parameters:
   *
   * - The [Access-Control-Request-Method](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Request-Method) header sent in the preflight request tells the server that when the actual request is sent, it will have a [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/POST) request method.
   * - The [Access-Control-Request-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Request-Headers) header tells the server that when the actual request is sent, it will have the `X-PINGOTHER` and `Content-Type` headers.
   *
   * ```http
   * OPTIONS /resources/post-here/ HTTP/1.1
   * Host: bar.example
   * Accept: text/html,application/xhtml+xml,application/xml;q=0.9,* /*;q=0.8
   * Accept-Language: en-us,en;q=0.5
   * Accept-Encoding: gzip,deflate
   * Connection: keep-alive
   * Origin: https://foo.example
   * Access-Control-Request-Method: POST
   * Access-Control-Request-Headers: content-type,x-pingother
   * ```
   *
   * The server now can respond if it will accept a request under these circumstances. In this example, the server response says that:
   *
   * - [Access-Control-Allow-Origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin)
   *   - : The `https://foo.example` origin is permitted to request the `bar.example/resources/post-here/` URL via the following:
   * - [Access-Control-Allow-Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Methods)
   *   - : [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/POST), [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET), and `OPTIONS` are permitted methods for the URL. (This header is similar to the [Allow](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Allow) response header, but used only for [CORS](/en-US/docs/Web/HTTP/Guides/CORS).)
   * - [Access-Control-Allow-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers)
   *   - : `X-PINGOTHER` and `Content-Type` are permitted request headers for the URL.
   * - [Access-Control-Max-Age](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Max-Age)
   *   - : The above permissions may be cached for 86,400 seconds (1 day).
   *
   * ```http
   * HTTP/1.1 200 OK
   * Date: Mon, 01 Dec 2008 01:15:39 GMT
   * Server: Apache/2.0.61 (Unix)
   * Access-Control-Allow-Origin: https://foo.example
   * Access-Control-Allow-Methods: POST, GET, OPTIONS
   * Access-Control-Allow-Headers: X-PINGOTHER, Content-Type
   * Access-Control-Max-Age: 86400
   * Vary: Accept-Encoding, Origin
   * Keep-Alive: timeout=2, max=100
   * Connection: Keep-Alive
   * ```
   *
   * > [!NOTE]
   * > Both [200 OK](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200) and [204 No Content](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204) are [permitted status codes](https://fetch.spec.whatwg.org/#ref-for-ok-status), but some browsers incorrectly believe `204 No Content` applies to the resource and do not send a subsequent request to fetch it.
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [HTTP request methods](/en-US/docs/Web/HTTP/Reference/Methods)
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [HTTP headers](/en-US/docs/Web/HTTP/Reference/Headers)
   * - [Allow](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Allow) header
   * - [CORS](/en-US/docs/Web/HTTP/Guides/CORS)
   */
  OPTIONS = 'OPTIONS',

  /**
   * The **`PATCH`** HTTP method applies partial modifications to a resource.
   *
   * `PATCH` is somewhat analogous to the "update" concept found in [CRUD](https://developer.mozilla.org/en-US/docs/Glossary/CRUD) (in general, HTTP is different than [CRUD](https://developer.mozilla.org/en-US/docs/Glossary/CRUD), and the two should not be confused).
   *
   * In comparison with [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/PUT), a `PATCH` serves as a set of instructions for modifying a resource, whereas `PUT` represents a complete replacement of the resource.
   * A `PUT` request is always [idempotent](https://developer.mozilla.org/en-US/docs/Glossary/idempotent) (repeating the same request multiple times results in the resource remaining in the same state), whereas a `PATCH` request may not always be idempotent.
   * For instance, if a resource includes an auto-incrementing counter, a `PUT` request will overwrite the counter (since it replaces the entire resource), but a `PATCH` request may not.
   *
   * Like [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/POST), a `PATCH` request can potentially have side effects on other resources.
   *
   * A server can advertise support for `PATCH` by adding it to the list in the [Allow](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Allow) or [Access-Control-Allow-Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Methods) (for [CORS](/en-US/docs/Web/HTTP/Guides/CORS)) response headers.
   * Another implicit indication that `PATCH` is supported is the [Accept-Patch](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Patch) header (usually after an [OPTIONS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/OPTIONS) request on a resource), which lists the media-types the server is able to understand in a `PATCH` request for a resource.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * PATCH <request-target>["?"<query>] HTTP/1.1
   * ```
   *
   * - `<request-target>`
   *   - : Identifies the target resource of the request when combined with the information provided in the [Host](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Host) header.
   *     This is an absolute path (e.g., `/path/to/file.html`) in requests to an origin server, and an absolute URL in requests to proxies (e.g., `http://www.example.com/path/to/file.html`).
   * - `<query>`
   *   - : An optional query component preceded by a question-mark `?`.
   *     Often used to carry identifying information in the form of `key=value` pairs.
   *
   * ## Examples
   *
   * ### Successfully modifying a resource
   *
   * Assume there is a resource on the server representing a user with a numeric ID of `123` in the following format:
   *
   * ```json
   * {
   *   "firstName": "Example",
   *   "LastName": "User",
   *   "userId": 123,
   *   "signupDate": "2024-09-09T21:48:58Z",
   *   "status": "active",
   *   "registeredDevice": {
   *     "id": 1,
   *     "name": "personal",
   *     "manufacturer": {
   *       "name": "Hardware corp"
   *     }
   *   }
   * }
   * ```
   *
   * Instead of sending a JSON object to fully overwrite a resource, a `PATCH` modifies only specific parts of the resource.
   * This request updates the `status` field:
   *
   * ```http
   * PATCH /users/123 HTTP/1.1
   * Host: example.com
   * Content-Type: application/json
   * Content-Length: 27
   * Authorization: Bearer ABC123
   *
   * {
   *   "status": "suspended"
   * }
   * ```
   *
   * The interpretation and authentication of the `PATCH` request depend on the implementation.
   * Success can be indicated by any of the [successful response status codes](/en-US/docs/Web/HTTP/Reference/Status#successful_responses).
   * In this example, a [204 No Content](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204) is used as there's no need to transmit a body with additional context about the operation.
   * An [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) is provided so the caller can perform a [conditional request](/en-US/docs/Web/HTTP/Guides/Conditional_requests) in future:
   *
   * ```http
   * HTTP/1.1 204 No Content
   * Content-Location: /users/123
   * ETag: "e0023aa4f"
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * The browser doesn't use the `PATCH` method for user-initiated actions, so "browser compatibility" doesn't apply.
   * Developers can set this request method using [`fetch()`](/en-US/docs/Web/API/Window/fetch).
   *
   * ## See also
   *
   * - [HTTP request methods](/en-US/docs/Web/HTTP/Reference/Methods)
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [HTTP headers](/en-US/docs/Web/HTTP/Reference/Headers)
   * - [204](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204)
   * - [Allow](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Allow), [Access-Control-Allow-Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Methods) headers
   * - [Accept-Patch](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Patch) – specifies the patch document formats accepted by the server
   * - [JSON Patch Generator](https://jsoning.com/jsonpatch/)
   */
  PATCH = 'PATCH',

  /**
   * The **`POST`** HTTP method sends data to the server. The type of the body of the request is indicated by the [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) header.
   *
   * The difference between [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/PUT) and `POST` is that `PUT` is [idempotent](https://developer.mozilla.org/en-US/docs/Glossary/idempotent): calling it once is no different from calling it several times successively (there are no _side_ effects).
   * Successive identical `POST` requests may have additional effects, such as creating the same order several times.
   *
   * [HTML forms](/en-US/docs/Learn_web_development/Extensions/Forms) typically send data using `POST` and this usually results in a change on the server.
   * For HTML forms the format/encoding of the body content is determined by the [`enctype`](/en-US/docs/Web/HTML/Reference/Elements/form#enctype) attribute of the [form](https://developer.mozilla.org/en-US/docs/HTMLElement/form) element or the [`formenctype`](/en-US/docs/Web/HTML/Reference/Elements/input#formenctype) attribute of the [input") }} or _or_
   *   - : An optional query component preceded by a question-mark `?`.
   *     Often used to carry identifying information in the form of `key=value` pairs.
   *
   * ## Examples
   *
   * ### URL-encoded form submission
   *
   * A form using `application/x-www-form-urlencoded` content encoding (the default) sends a request where the body contains the form data in `key=value` pairs, with each pair separated by an `&` symbol, as shown below:
   *
   * ```http
   * POST /test HTTP/1.1
   * Host: example.com
   * Content-Type: application/x-www-form-urlencoded
   * Content-Length: 27
   *
   * field1=value1&field2=value2
   * ```
   *
   * ### Multipart form submission
   *
   * The `multipart/form-data` encoding is used when a form includes files or a lot of data.
   * This request body delineates each part of the form using a boundary string.
   * An example of a request in this format:
   *
   * ```http
   * POST /test HTTP/1.1
   * Host: example.com
   * Content-Type: multipart/form-data;boundary="delimiter12345"
   *
   * --delimiter12345
   * Content-Disposition: form-data; name="field1"
   *
   * value1
   * --delimiter12345
   * Content-Disposition: form-data; name="field2"; filename="example.txt"
   *
   * value2
   * --delimiter12345--
   * ```
   *
   * The [Content-Disposition](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition) header indicates how the form data should be processed, specifying the field `name` and `filename`, if appropriate.
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [HTTP request methods](/en-US/docs/Web/HTTP/Reference/Methods)
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [HTTP headers](/en-US/docs/Web/HTTP/Reference/Headers)
   * - [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) header
   * - [Content-Disposition](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition) header
   * - [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) method
   */
  POST = 'POST',

  /**
   * The **`PUT`** HTTP method creates a new resource or replaces a representation of the target resource with the request [content](https://developer.mozilla.org/en-US/docs/Glossary/HTTP_Content).
   *
   * The difference between `PUT` and [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/POST) is that `PUT` is [idempotent](https://developer.mozilla.org/en-US/docs/Glossary/idempotent): calling it once is no different from calling it several times successively (there are no _side_ effects).
   *
   *
   * ```
   *
   * If the target resource **does not** have a current representation and the `PUT` request successfully creates one, then the origin server must send a [201 Created](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201) response:
   *
   * ```http
   * HTTP/1.1 201 Created
   * Content-Location: /new.html
   * ```
   *
   * If the target resource **does** have a current representation and that representation is successfully modified with the state in the request, the origin server must send either a [200 OK](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200) or a [204 No Content](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204) to indicate successful completion of the request:
   *
   * ```http
   * HTTP/1.1 204 No Content
   * Content-Location: /existing.html
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * The browser doesn't use the `PUT` method for user-initiated actions, so "browser compatibility" doesn't apply.
   * Developers can set this request method using [`fetch()`](/en-US/docs/Web/API/Window/fetch).
   *
   * ## See also
   *
   * - [HTTP request methods](/en-US/docs/Web/HTTP/Reference/Methods)
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [HTTP headers](/en-US/docs/Web/HTTP/Reference/Headers)
   * - [201 Created](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201), [204 No Content](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204) response statuses
   */
  PUT = 'PUT',

  /**
   * The **`TRACE`** HTTP method performs a message loop-back test along the path to the target resource.
   *
   * The final recipient of the request should reflect the message as received (excluding any fields that might include sensitive data) back to the client as the message body of a [200 OK](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200) response with a [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) of `message/http`.
   * The final recipient is either the origin server or the first server to receive a [Max-Forwards](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Max-Forwards) value of `0` in the request.
   *
   * The client must not send [content](https://developer.mozilla.org/en-US/docs/Glossary/HTTP_Content) in the request, or generate headers that might include sensitive data such as user credentials or cookies.
   * Not all servers implement the `TRACE` method, and some server owners have historically disallowed the use of the `TRACE` method due to security concerns.
   * In such cases, a [405 Method Not Allowed](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405) [client error response](/en-US/docs/Web/HTTP/Reference/Status#client_error_responses) will be sent.
   *
   *
   *
   * ## Syntax
   *
   * ```http
   * TRACE <request-target>["?"<query>] HTTP/1.1
   * ```
   *
   * - `<request-target>`
   *   - : Identifies the target resource of the request when combined with the information provided in the [Host](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Host) header.
   *     This is an absolute path (e.g., `/path/to/file.html`) in requests to an origin server, and an absolute URL in requests to proxies (e.g., `http://www.example.com/path/to/file.html`).
   * - `<query>`
   *   - : An optional query component preceded by a question-mark `?`.
   *     Often used to carry identifying information in the form of `key=value` pairs.
   *
   * ## Examples
   *
   * ### Successful TRACE request
   *
   * A `TRACE` request can be performed using `curl`:
   *
   * ```bash
   * curl -v -X TRACE example.com
   * ```
   *
   * This produces the following HTTP request:
   *
   * ```http
   * TRACE / HTTP/1.1
   * Host: example.com
   * User-Agent: curl/8.7.1
   * Accept: * /*
   * ```
   *
   * A [200 OK](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200) response with the request headers contained in response body is sent back to the client:
   *
   * ```http
   * HTTP/1.1 200 OK
   * Content-Length: 123
   * Date: Wed, 04 Sep 2024 11:50:24 GMT
   * Server: Apache/2.4.59 (Unix)
   * Content-Type: message/http
   *
   * TRACE / HTTP/1.1
   * Host: example.com
   * User-Agent: curl/8.7.1
   * Accept: * /*
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * The browser doesn't use the `TRACE` method for user-initiated actions, so "browser compatibility" doesn't apply.
   *
   * ## See also
   *
   * - [HTTP request methods](/en-US/docs/Web/HTTP/Reference/Methods)
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [HTTP headers](/en-US/docs/Web/HTTP/Reference/Headers)
   * - [Cross-Site Tracing (XST)](https://owasp.org/www-community/attacks/Cross_Site_Tracing)
   */
  TRACE = 'TRACE',
}
