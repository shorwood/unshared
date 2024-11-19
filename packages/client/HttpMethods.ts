export enum HttpMethod {

  /**
   * The **`CONNECT`** HTTP method requests that a [proxy](https://developer.mozilla.org/en-US/docs/Glossary/Proxy_server) establish a HTTP tunnel to a destination server, and if successful, blindly forward data in both directions until the tunnel is closed.
   *
   * The request target is unique to this method in that it consists of only the host and port number of the tunnel destination, separated by a colon (see [Syntax](#syntax) for details).
   * Any [2XX successful response status code](/en-US/docs/Web/HTTP/Status#successful_responses) means that the proxy will switch to 'tunnel mode' and any data in the success response body is from the server identified by the request target.
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
   */
  CONNECT = 'CONNECT',

  /**
   * The **`DELETE`** HTTP method asks the server to delete a specified resource.
   *
   * The `DELETE` method has no defined semantics for the message body, so this should be empty.
   */
  DELETE = 'DELETE',

  /**
   * The **`GET`** HTTP method requests a representation of the specified resource.
   * Requests using `GET` should only be used to request data and shouldn't contain a body.
   *
   * > [!NOTE]
   * > The semantics of sending a message body in `GET` requests are undefined.
   * > Some servers may reject the request with a [4XX client error](/en-US/docs/Web/HTTP/Status#client_error_responses) response.
   */
  GET = 'GET',

  /**
   * The **`HEAD`** HTTP method requests the metadata of a resource in the form of [headers](/en-US/docs/Web/HTTP/Headers) that the server would have sent if the [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) method was used instead.
   * This method can be used in cases where a URL might produce a large download, for example, a `HEAD` request can read the [Content-Length](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Length) header to check the file size before downloading the file with a `GET`.
   *
   * If the response to a `HEAD` request shows that a cached URL response is now outdated, the cached copy is invalidated even if no `GET` request was made.
   *
   * > [!WARNING]
   * > If a response to a `HEAD` request has a body, the response body must be ignored.
   * > Any [representation headers](https://developer.mozilla.org/en-US/docs/glossary/Representation_header) that describe the erroneous body are assumed to describe the response body that a `GET` request would have received.
   */
  HEAD = 'HEAD',

  /**
   * The **`OPTIONS`** HTTP method requests permitted communication options for a given URL or server.
   * This can be used to test the allowed HTTP methods for a request, or to determine whether a request would succeed when making a CORS preflighted request.
   * A client can specify a URL with this method, or an asterisk (`*`) to refer to the entire server.
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
   * A server can advertise support for `PATCH` by adding it to the list in the [Allow](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Allow) or [Access-Control-Allow-Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Methods) (for [CORS](/en-US/docs/Web/HTTP/CORS)) response headers.
   * Another implicit indication that `PATCH` is supported is the [Accept-Patch](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Patch) header (usually after an [OPTIONS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/OPTIONS) request on a resource), which lists the media-types the server is able to understand in a `PATCH` request for a resource.
   */
  PATCH = 'PATCH',

  /**
   * The **`POST`** HTTP method sends data to the server. The type of the body of the request is indicated by the [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) header.
   *
   * The difference between [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/PUT) and `POST` is that `PUT` is [idempotent](https://developer.mozilla.org/en-US/docs/Glossary/idempotent): calling it once is no different from calling it several times successively (there are no _side_ effects).
   * Successive identical `POST` requests may have additional effects, such as creating the same order several times.
   *
   * [HTML forms](/en-US/docs/Learn/Forms) typically send data using `POST` and this usually results in a change on the server.
   * For HTML forms the format/encoding of the body content is determined by the [`enctype`](/en-US/docs/Web/HTML/Element/form#enctype) attribute of the [form](https://developer.mozilla.org/en-US/docs/HTMLElement/form) element or the [`formenctype`](/en-US/docs/Web/HTML/Element/input#formenctype) attribute of the [input") }} or _or_{{HTMLElement("button) elements.
   * The encoding may be one of the following:
   *
   * - `application/x-www-form-urlencoded`: the keys and values are encoded in key-value tuples separated by an ampersand (`&`), with an equals symbol (`=`) between the key and the value (e.g., `first-name=Frida&last-name=Kahlo`).
   * Non-alphanumeric characters in both keys and values are [percent-encoded](https://developer.mozilla.org/en-US/docs/Glossary/Percent-encoding): this is the reason why this type is not suitable to use with binary data and you should use `multipart/form-data` for this purpose instead.
   * - `multipart/form-data`: each value is sent as a block of data ("body part"), with a user agent-defined delimiter (for example, `boundary="delimiter12345"`) separating each part.
   * The keys are described in the [Content-Disposition](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition) header of each part or block of data.
   * - `text/plain`
   *
   * When the `POST` request is sent following a [fetch()](https://developer.mozilla.org/en-US/docs/domxref/Window/fetch) call, or for any other reason than an HTML form, the body can be any type.
   * As described in the HTTP 1.1 specification, `POST` is designed to allow a uniform method to cover the following functions:
   *
   * - Annotation of existing resources
   * - Posting a message to a bulletin board, newsgroup, mailing list, or similar group of articles
   * - Adding a new user through a signup form
   * - Providing a block of data, such as the result of submitting a form, to a data-handling process
   * - Extending a database through an append operation
   */
  POST = 'POST',

  /**
   * The **`PUT`** HTTP method creates a new resource or replaces a representation of the target resource with the request [content](https://developer.mozilla.org/en-US/docs/Glossary/HTTP_Content).
   *
   * The difference between `PUT` and [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/POST) is that `PUT` is [idempotent](https://developer.mozilla.org/en-US/docs/Glossary/idempotent): calling it once is no different from calling it several times successively (there are no _side_ effects).
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
   * In such cases, a [405 Method Not Allowed](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405) [client error response](/en-US/docs/Web/HTTP/Status#client_error_responses) will be sent.
   */
  TRACE = 'TRACE',
}
