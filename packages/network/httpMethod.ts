export enum HttpMethod {
  /**
   * The **HTTP `CONNECT` method** starts two-way communications
   * with the requested resource. It can be used to open a tunnel.
   *
   * For example, the `CONNECT` method can be used to access websites that use
   * [SSL](https://developer.mozilla.org/en-US/docs/Glossary/SSL) ([HTTPS](https://developer.mozilla.org/en-US/docs/Glossary/HTTPS)). The client asks an HTTP [Proxy server](https://developer.mozilla.org/en-US/docs/Glossary/Proxy___server) to tunnel the [TCP](/en-US/docs/Glossary/TCP) connection to
   * the desired destination. The server then proceeds to make the connection on behalf of
   * the client. Once the connection has been established by the server, the
   * [Proxy server](https://developer.mozilla.org/en-US/docs/Glossary/Proxy_server) continues to proxy the TCP stream to and
   * from the client.
   *
   * `CONNECT` is a hop-by-hop method.
   */
  CONNECT = 'CONNECT',
  /**
   * The **HTTP `DELETE` request method** deletes the specified
   * resource.
   */
  DELETE = 'DELETE',
  /**
   * The **HTTP `GET` method** requests a representation of the specified resource. Requests using `GET` should only be used to request data (they shouldn't include data).
   *
   * > **Note:** Sending body/payload in a `GET` request may cause some existing implementations to reject the request — while not prohibited by the specification, the semantics are undefined. It is better to just avoid sending payloads in `GET` requests.
   */
  GET = 'GET',
  /**
   * The **HTTP `HEAD` method** requests the [headers](/en-US/docs/Web/HTTP/Headers) that would be returned if the `HEAD` request's URL was instead requested with the HTTP [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) method. For example, if a URL might produce a large download, a `HEAD` request could read its [Content-Length](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Length) header to check the filesize without actually downloading the file.
   *
   * > **Warning:** A response to a `HEAD` method _should not_ have a body. If it has one anyway, that body **must be** ignored: any [representation headers](https://developer.mozilla.org/en-US/docs/glossary/Representation_header) that might describe the erroneous body are instead assumed to describe the response which a similar `GET` request would have received.
   *
   * If the response to a `HEAD` request shows that a cached URL response is now outdated, the cached copy is invalidated even if no `GET` request was made.
   */
  HEAD = 'HEAD',
  /**
   * The **HTTP `OPTIONS` method** requests permitted communication options for a given URL or server. A client can specify a URL with this method, or an asterisk (`*`) to refer to the entire server.
   */
  OPTIONS = 'OPTIONS',
  /**
   * The **HTTP `PATCH` request method** applies partial modifications to a resource.
   *
   * `PATCH` is somewhat analogous to the "update" concept found in [CRUD](https://developer.mozilla.org/en-US/docs/Glossary/CRUD) (in general, HTTP is different than [CRUD](https://developer.mozilla.org/en-US/docs/Glossary/CRUD), and the two should not be confused).
   *
   * A `PATCH` request is considered a set of instructions on how to modify a resource. Contrast this with [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/PUT); which is a complete representation of a resource.
   *
   * A `PATCH` is not necessarily idempotent, although it can be. Contrast this with [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/PUT); which is always idempotent. The word "idempotent" means that any number of repeated, identical requests will leave the resource in the same state. For example if an auto-incrementing counter field is an integral part of the resource, then a [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/PUT) will naturally overwrite it (since it overwrites everything), but not necessarily so for `PATCH`.
   *
   * `PATCH` (like [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/POST)) _may_ have side-effects on other resources.
   *
   * To find out whether a server supports `PATCH`, a server can advertise its support by adding it to the list in the [Allow](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Allow) or [Access-Control-Allow-Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Methods) (for [CORS](/en-US/docs/Web/HTTP/CORS)) response headers.
   *
   * Another (implicit) indication that `PATCH` is allowed, is the presence of the [Accept-Patch](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Patch) header, which specifies the patch document formats accepted by the server.
   */
  PATCH = 'PATCH',
  /**
   * The **HTTP `POST` method** sends data to the server. The type of the body of the request is indicated by the [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) header.
   *
   * The difference between [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/PUT) and `POST` is that `PUT` is idempotent: calling it once or several times successively has the same effect (that is no _side_ effect), where successive identical `POST` may have additional effects, like passing an order several times.
   *
   * A `POST` request is typically sent via an [HTML form](/en-US/docs/Learn/Forms) and results in a change on the server. In this case, the content type is selected by putting the adequate string in the [form](https://developer.mozilla.org/en-US/docs/htmlattrxref/enctype) attribute of the [form](https://developer.mozilla.org/en-US/docs/HTMLElement/form) element or the [input](https://developer.mozilla.org/en-US/docs/htmlattrxref/formenctype) attribute of the [input") }} or _or_{{HTMLElement("button) elements:
   *
   * - `application/x-www-form-urlencoded`: the keys and values are encoded in key-value tuples separated by `'&'`, with a `'='` between the key and the value. Non-alphanumeric characters in both keys and values are [percent encoded](https://developer.mozilla.org/en-US/docs/glossary/percent-encoding): this is the reason why this type is not suitable to use with binary data (use `multipart/form-data` instead)
   * - `multipart/form-data`: each value is sent as a block of data ("body part"), with a user agent-defined delimiter ("boundary") separating each part. The keys are given in the `Content-Disposition` header of each part.
   * - `text/plain`
   *
   * When the `POST` request is sent via a method other than an HTML form — like via an [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/domxref/XMLHttpRequest) — the body can take any type. As described in the HTTP 1.1 specification, `POST` is designed to allow a uniform method to cover the following functions:
   *
   * - Annotation of existing resources
   * - Posting a message to a bulletin board, newsgroup, mailing list, or similar group of articles;
   * - Adding a new user through a signup modal;
   * - Providing a block of data, such as the result of submitting a form, to a data-handling process;
   * - Extending a database through an append operation.
   */
  POST = 'POST',
  /**
   * The **HTTP `PUT` request method** creates a new resource or replaces a representation of the target resource with the request payload.
   *
   * The difference between `PUT` and [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/POST) is that `PUT` is idempotent: calling it once or several times successively has the same effect (that is no _side_ effect), whereas successive identical [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/POST) requests may have additional effects, akin to placing an order several times.
   */
  PUT = 'PUT',
  /**
   * The **HTTP `TRACE` method** performs a message loop-back test along the path to the target resource, providing a useful debugging mechanism.
   *
   * The final recipient of the request should reflect the message received, excluding some fields described below, back to the client as the message body of a [200](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200) (`OK`) response with a [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) of `message/http`. The final recipient is either the origin server or the first server to receive a [Max-Forwards](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Max-Forwards) value of 0 in the request.
   */
  TRACE = 'TRACE',
}
