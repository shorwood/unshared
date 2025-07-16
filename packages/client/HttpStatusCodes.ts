export enum HttpStatusCode {

  /**
   * The HTTP **`100 Continue`** [informational response](/en-US/docs/Web/HTTP/Reference/Status#informational_responses) status code indicates that the initial part of a request has been received and has not yet been rejected by the server.
   * The client should continue with a request or discard the 100 response if the request is already finished.
   *
   * When a request has an [Expect: 100-continue](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Expect) header, the 100 Continue response indicates that the server is ready or capable of receiving the request content.
   * Waiting for a 100 Continue response can be helpful if a client anticipates that an error is likely, for example, when sending state-changing operations without previously verified authentication credentials.
   *
   * ## Status
   *
   * ```http
   * 100 Continue
   * ```
   *
   * ## Examples
   *
   * ### PUT request with 100 Continue
   *
   * The following [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/PUT) request sends information to a server about a file upload.
   * The client is indicating that it will proceed with the content if it receives a 100 response to avoid sending data over the network that could result in an error like [405](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405), [401](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401), or [403](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403).
   * At first, the client sends headers only, including an [Expect: 100-continue](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Expect) header:
   *
   * ```http
   * PUT /videos HTTP/1.1
   * Host: uploads.example.com
   * Content-Type: video/h264
   * Content-Length: 123456789
   * Expect: 100-continue
   * ```
   *
   * The server indicates that the request can proceed:
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
   * - [Expect](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Expect)
   * -
   */
  CONTINUE = 100,

  /**
   * The HTTP **`101 Switching Protocols`** [informational response](/en-US/docs/Web/HTTP/Reference/Status#informational_responses) status code indicates the protocol that a server has switched to.
   * The protocol is specified in the [Upgrade](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Upgrade) request header received from a client.
   *
   * The server includes an [Upgrade](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Upgrade) header in this response to indicate the protocol it has agreed to switch to.
   * The process is described in detail in the [Protocol upgrade mechanism](/en-US/docs/Web/HTTP/Guides/Protocol_upgrade_mechanism) guide.
   *
   * ## Status
   *
   * ```http
   * 101 Switching Protocols
   * ```
   *
   * ## Examples
   *
   * ### Switching protocols to WebSockets
   *
   * The following example shows how switching protocols might be used with [WebSockets](/en-US/docs/Web/API/WebSockets_API).
   * A client sends a [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) HTTP request with an [Upgrade](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Upgrade) header which must also be listed in the [Connection](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Connection) header.
   * The server agrees to switch protocols, returning a 101 response meaning the connection has switched from HTTP to WebSocket.
   * At this point, the client and server can now start exchanging WebSocket data.
   * Information about how to set `Sec-WebSocket-*` headers for handshake negotiation can be found in [WebSocket-specific headers](/en-US/docs/Web/HTTP/Guides/Protocol_upgrade_mechanism#websocket-specific_headers).
   *
   * ```http
   * GET /notifications HTTP/1.1
   * Host: example.com
   * Upgrade: websocket
   * Connection: Upgrade
   * ```
   *
   * ```http
   * HTTP/1.1 101 Switching Protocols
   * Upgrade: websocket
   * Connection: Upgrade
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [Protocol upgrade mechanism](/en-US/docs/Web/HTTP/Guides/Protocol_upgrade_mechanism)
   * - [WebSockets](/en-US/docs/Web/API/WebSockets_API)
   * - [Upgrade](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Upgrade)
   * - [426 Upgrade Required](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/426)
   */
  SWITCHING_PROTOCOLS = 101,

  /**
   * The HTTP **`102 Processing`** [informational response](/en-US/docs/Web/HTTP/Reference/Status#informational_responses) status code indicates to client that a full request has been received and the server is working on it.
   * This status code is only sent if the server expects the request to take significant time.
   *
   * > [!NOTE]
   * > Regular web servers do not return this response.
   * > This status code was first introduced in Web Distributed Authoring and Versioning ([WebDAV](https://developer.mozilla.org/en-US/docs/Glossary/WebDAV)) [2518](https://developer.mozilla.org/en-US/docs/RFC/2518), but it was removed from WebDAV in [4918](https://developer.mozilla.org/en-US/docs/RFC/4918).
   *
   * ## Status
   *
   * ```http
   * 102 Processing
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * This feature is deprecated and browsers will ignore this response status code.
   *
   * ## See also
   *
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [100](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/100)
   * - [rfc4918 '102 Processing' removal notes](https://www.rfc-editor.org/rfc/rfc4918#section-21.4)
   */
  PROCESSING = 102,

  /**
   * The HTTP **`103 Early Hints`** [informational response](/en-US/docs/Web/HTTP/Reference/Status#informational_responses) may be sent by a server while it is still preparing a response, with hints about the sites and resources that the server expects the final response will link to.
   * This allows a browser to [preconnect](/en-US/docs/Web/HTML/Reference/Attributes/rel/preconnect) to sites or start [preloading](/en-US/docs/Web/HTML/Reference/Attributes/rel/preload) resources even before the server has prepared and sent a final response.
   * Preloaded resources indicated by early hints are fetched by the client as soon as the hints are received.
   *
   * The early hint response is primarily intended for use with the [Link](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Link) header, which indicates the resources to be loaded.
   * It may also contain a [`Content-Security-Policy`](/en-US/docs/Web/HTTP/Guides/CSP) header that is enforced while processing the early hint.
   *
   * A server might send multiple `103` responses, for example, following a redirect.
   * Browsers only process the first early hints response, and this response must be discarded if the request results in a cross-origin redirect.
   *
   * > [!NOTE]
   * > For compatibility and security reasons, it is recommended to [only send HTTP `103 Early Hints` responses over HTTP/2 or later](https://www.rfc-editor.org/rfc/rfc8297#section-3) unless the client is known to handle informational responses correctly.
   * >
   * > Most browsers limit support to HTTP/2 or later for this reason. See [browser compatibility](#browser_compatibility) below.
   * > Despite this, the examples below use HTTP/1.1-style notation as per usual convention.
   *
   * ## Syntax
   *
   * ```http
   * 103 Early Hints
   * ```
   *
   * ## Examples
   *
   * ### Preconnect example
   *
   * The following `103` early hint response shows an early hint response where the server indicates that the client might want to preconnect to a particular origin (`https://cdn.example.com`).
   * Just like the HTML [`rel=preconnect`](/en-US/docs/Web/HTML/Reference/Attributes/rel/preconnect) attribute, this is a hint that the page is likely to need resources from the target resource's origin, and that the browser may improve the user experience by preemptively initiating a connection to that origin.
   *
   * ```http
   * 103 Early Hint
   * Link: ; rel=preload; as=style
   * ```
   *
   * The early response restricts preloading to the same origin as the request.
   * The stylesheet will be preloaded if the origin matches.
   *
   * The final response might set the CSP to `none`, as shown below.
   * The stylesheet has already been preloaded, but will not be used when rendering the page.
   *
   * ```http
   * 200 OK
   * Content-Security-Policy: style-src: none;
   * Content-Type: text/html
   *
   * <!doctype html>
   * ...
   * <link rel="stylesheet" rel="preload" href="style.css" />
   * ...
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Link](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Link)
   * - [Cross-Origin Resource Sharing (CORS)](/en-US/docs/Web/HTTP/Guides/CORS)
   * - [Content Security Policy (CSP)](/en-US/docs/Web/HTTP/Guides/CSP)
   * - [`rel="preconnect"`](/en-US/docs/Web/HTML/Reference/Attributes/rel/preconnect) ([link](https://developer.mozilla.org/en-US/docs/htmlelement/link) attribute)
   * - [`rel="preload"`](/en-US/docs/Web/HTML/Reference/Attributes/rel/preload) ([link](https://developer.mozilla.org/en-US/docs/htmlelement/link) attribute)
   * - [`fetchpriority`](/en-US/docs/Web/HTML/Reference/Elements/link#fetchpriority) ([link](https://developer.mozilla.org/en-US/docs/htmlelement/link) attribute)
   * - [Early Hints update: How Cloudflare, Google, and Shopify are working together to build a faster Internet for everyone](https://blog.cloudflare.com/early-hints-performance/) from the Cloudflare blog
   */
  EARLY_HINTS = 103,

  /**
   * The HTTP **`200 OK`** [successful response](/en-US/docs/Web/HTTP/Reference/Status#successful_responses) status code indicates that a request has succeeded.
   * A `200 OK` response is cacheable by default.
   *
   * A `200 OK` response has a different meaning and format depending on the HTTP request method.
   * Here's how they vary for different methods:
   *
   * - [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET): A resource was retrieved by the server and included in the response body.
   * - [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/POST): An action succeeded; the response has a message body describing the result.
   * - [HEAD](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/HEAD): Identical to `GET`, except there is no message body.
   * - [TRACE](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/TRACE): The response has a message body containing the request as received by the server.
   *
   * Although possible, successful [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/PUT) or [DELETE](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/DELETE) requests often do not result in a `200 OK` response.
   * It is more common to see [201 Created](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201) if the resource is uploaded or created for the first time, or [204 No Content](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204) upon successful deletion of a resource.
   *
   * ## Status
   *
   * ```http
   * 200 OK
   * ```
   *
   * ## Examples
   *
   * ### Receiving a `200 OK` for a `GET` request
   *
   * In this example, a successful `GET` request to `https://example.com` returns a `200 OK` response.
   * The response includes representation headers and a message body with the HTML content:
   *
   * ```http
   * HTTP/1.1 200 OK
   * Accept-Ranges: bytes
   * Age: 294510
   * Cache-Control: max-age=604800
   * Content-Type: text/html; charset=UTF-8
   * Date: Fri, 21 Jun 2024 14:18:33 GMT
   * Etag: "3147526947"
   * Expires: Fri, 28 Jun 2024 14:18:33 GMT
   * Last-Modified: Thu, 17 Oct 2019 07:18:26 GMT
   * Server: ECAcc (nyd/D10E)
   * X-Cache: HIT
   * Content-Length: 1256
   *
   * <!doctype html>
   * <!-- HTML content follows here -->
   * ```
   *
   * ### Receiving a `200 OK` for a `POST` request in form submission
   *
   * Assuming a form exists to send data to an endpoint for managing subscriptions at `http://example.com/subscribe`.
   * A `POST` request to subscribe a user may look like the following:
   *
   * ```http
   * POST /subscribe HTTP/1.1
   * Host: example.com
   * Content-Type: application/x-www-form-urlencoded
   * Content-Length: 50
   *
   * name=Brian%20Smith&email=brian.smith%40example.com
   * ```
   *
   * In this example, a response with a `200 OK` status could look like this:
   *
   * ```http
   * HTTP/1.1 200 OK
   * Content-Type: application/json
   *
   * {
   *   "message": "User subscription pending. A confirmation email has been sent.",
   *   "subscription": {
   *     "name": "Brian Smith",
   *     "email": "brian.smith@example.com",
   *     "id": 123,
   *     "feed": "default"
   *   }
   * }
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [HTTP request methods](/en-US/docs/Web/HTTP/Reference/Methods)
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - Glossary: [Idempotent](https://developer.mozilla.org/en-US/docs/Glossary/Idempotent)
   */
  OK = 200,

  /**
   * The HTTP **`201 Created`** [successful response](/en-US/docs/Web/HTTP/Reference/Status#successful_responses) status code indicates that the HTTP request has led to the creation of a resource.
   * This status code is commonly sent as the result of a [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/POST) request.
   *
   * The new resource, or a description and link to the new resource, is created before the response is returned.
   * The newly-created items are returned in the body of the message, located at either the **URL of the initial request** or the URL in the value of the [Location](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Location) header in the response.
   *
   * ## Status
   *
   * ```http
   * 201 Created
   * ```
   *
   * ## Examples
   *
   * ### Receiving a response indicating user creation
   *
   * Let's assume there's a REST API for managing users with an endpoint at `http://example.com/users`. In this example, we send a `POST` request with the following body to create a user:
   *
   * ```http
   * POST /users HTTP/1.1
   * Host: example.com
   * Content-Type: application/json
   *
   * {
   *   "firstName": "Brian",
   *   "lastName": "Smith",
   *   "email": "brian.smith@example.com"
   * }
   * ```
   *
   * After successful user creation, the `201 Created` response will look like this:
   *
   * ```http
   * HTTP/1.1 201 Created
   * Content-Type: application/json
   * Location: http://example.com/users/123
   *
   * {
   *   "message": "New user created",
   *   "user": {
   *     "id": 123,
   *     "firstName": "Brian",
   *     "lastName": "Smith",
   *     "email": "brian.smith@example.com"
   *   }
   * }
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [HTTP request methods](/en-US/docs/Web/HTTP/Reference/Methods)
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   */
  CREATED = 201,

  /**
   * The HTTP **`202 Accepted`** [successful response](/en-US/docs/Web/HTTP/Reference/Status#successful_responses) status code indicates that a request has been accepted for processing, but processing has not been completed or may not have started.
   * The actual processing of the request is not guaranteed; a task or action may fail or be disallowed when a server tries to process it.
   *
   * A `202` response is non-committal, meaning there is no way to later send an asynchronous HTTP response to indicate the outcome of the processing.
   * This response code is typically used when the request is handled by another process or server, or when requests are processed in batches.
   *
   * ## Status
   *
   * ```http
   * 202 Accepted
   * ```
   *
   * ## Examples
   *
   * ### Begin automated task
   *
   * In the following example, we want to kick off an automation process to email dog owners about a pickup task:
   *
   * ```http
   * POST /tasks HTTP/1.1
   * Host: example.com
   * Content-Type: application/json
   *
   * {
   *   "task": "emailDogOwners",
   *   "template": "pickup"
   * }
   * ```
   *
   * The response indicates that the request to start a task was accepted for processing.
   * A URL is sent in the response body so the client can track changes to the status of the task:
   *
   * ```http
   * HTTP/1.1 202 Accepted
   * Date: Wed, 26 Jun 2024 12:00:00 GMT
   * Server: Apache/2.4.1 (Unix)
   * Content-Type: application/json
   *
   * {
   *   "message": "Request accepted. Starting to process task.",
   *   "taskId": "123",
   *   "monitorUrl": "http://example.com/tasks/123/status"
   * }
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [Accept](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept)
   * - [HTTP request methods](/en-US/docs/Web/HTTP/Reference/Methods)
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   */
  ACCEPTED = 202,

  /**
   * The HTTP **`203 Non-Authoritative Information`** [successful response](/en-US/docs/Web/HTTP/Reference/Status#successful_responses) status code indicates that the request was successful, but a _transforming [proxy](https://developer.mozilla.org/en-US/docs/Glossary/Proxy_server)_ has modified the headers or enclosed content from the origin server's [200](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200) (`OK`) response.
   *
   * The purpose of this status code is to allow transforming proxies to notify clients when changes have been applied to successful responses, since this may impact decisions regarding the content later.
   * Transformations to messages can mean modifications of headers to indicate that a resource is from a mirror or a backup, but may also mean modifying content in a way that are presumed to be desirable to the client.
   * These modifications might include malware filtering, format transcoding, privacy filtering, or other hints to the client about future requests.
   *
   * The `203` response is similar to the [`214`](/en-US/docs/Web/HTTP/Reference/Headers/Warning#warning_codes) `Transformation Applied` value of the deprecated [Warning](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Warning) header, which may be applicable to responses with any status code.
   *
   * ## Status
   *
   * ```http
   * 203 Non-Authoritative Information
   * ```
   *
   * ## Examples
   *
   * ### Receiving a filtered message response
   *
   * In this example, a user sends a `GET` request for content with ID `123` to `example.com`.
   *
   * ```http
   * GET /comments/123 HTTP/1.1
   * Host: example.com
   * ```
   *
   * A proxy has altered the message based on malware filtering rules for known unsafe attachments.
   * The response content has been modified, replacing the `attachment_url` value to a link with information about the filtering in place:
   *
   * ```http
   * HTTP/1.1 203 Non-Authoritative Information
   * Date: Wed, 26 Jun 2024 12:00:00 GMT
   * Server: Apache/2.4.1 (Unix)
   * Content-Type: application/json
   * Content-Length: 123
   *
   * {
   *   "comment": "Check out my bio!",
   *   "attachment_url": "https://example.com/attachment-unavailable-faq"
   * }
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [200](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200)
   * - [Proxy server](https://developer.mozilla.org/en-US/docs/Glossary/Proxy_server)
   * - [Warning](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Warning)
   * - [HTTP request methods](/en-US/docs/Web/HTTP/Reference/Methods)
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   */
  NON_AUTHORITATIVE_INFORMATION = 203,

  /**
   * The HTTP **`204 No Content`** [successful response](/en-US/docs/Web/HTTP/Reference/Status#successful_responses) status code indicates that a request has succeeded, but the client doesn't need to navigate away from its current page.
   * A `204` response is cacheable by default, and an [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) header is included in such cases.
   *
   * A `204 No Content` in response to these request methods has the following meaning and results:
   *
   * - [DELETE](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/DELETE): The action was successful, and no further information needs to be supplied.
   * - [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/PUT): The action was successful, and the [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) value contains the entity tag for the new representation of that target resource.
   *
   * A `204` response can be used when implementing "save and continue editing" functionality for applications like wiki sites.
   * In this case, a [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/PUT) request could be used to save the page contents, and a `204 No Content` response indicates to the browser that the editor should not be replaced by other content.
   *
   * Note that the response must not include any content or the [Content-Length](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Length) header (browsers may reject responses that include content).
   *
   * ## Status
   *
   * ```http
   * 204 No Content
   * ```
   *
   * ## Examples
   *
   * ### Receiving a response after deleting an image
   *
   * In this example, the client sends a request to delete an image using the `DELETE` method.
   * The request includes an [Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization) header with a token to authenticate the request:
   *
   * ```http
   * DELETE /image/123 HTTP/1.1
   * Host: example.com
   * Authorization: Bearer 1234abcd
   * ```
   *
   * After successfully deleting the image, the server responds with a `204` response with no body, indicating no further information needs to be sent to the client.
   *
   * ```http
   * HTTP/1.1 204 No Content
   * Date: Wed, 26 Jun 2024 12:00:00 GMT
   * Server: Apache/2.4.1 (Unix)
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [HTTP request methods](/en-US/docs/Web/HTTP/Reference/Methods)
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   */
  NO_CONTENT = 204,

  /**
   * The HTTP **`205 Reset Content`** [successful response](/en-US/docs/Web/HTTP/Reference/Status#successful_responses) status code indicates that the request has been successfully processed and the client should reset the document view.
   *
   * This response is intended to support use cases where the user receives content that supports data entry, submits user-edited data in a request, and the content needs to be reset for the next entry.
   * The instruction to "reset content" can mean clearing the contents of a form, resetting a canvas state, or refreshing a UI; the implementation depends on the client.
   *
   * > [!NOTE]
   * > In web applications that use the `205` status, it's assumed that the client handles resetting content after a `205` response.
   * > This is typically done via JavaScript, as resetting content such as forms after a `205` response is not handled natively by browsers.
   *
   * Note that the response must not include any content or the [Content-Length](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Length) header (browsers may reject responses that include content).
   * The empty response may also be indicated using the [Transfer-Encoding: chunked](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Transfer-Encoding) header with an empty chunk.
   *
   * ## Status
   *
   * ```http
   * 205 Reset Content
   * ```
   *
   * ## Examples
   *
   * ### Resetting a form after receiving a `205 Reset Content`
   *
   * The client in this example sends a `POST` request to submit a form with the comment `Hello!`:
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
   * After successfully processing the form submission, the server responds with the following `205` response, indicating that the client should reset the form.
   *
   * ```http
   * HTTP/1.1 205 Reset Content
   * Content-Type: text/html; charset=utf-8
   * Content-Length: 0
   * Date: Wed, 26 Jun 2024 12:00:00 GMT
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * -  No Content
   * - [HTTP request methods](/en-US/docs/Web/HTTP/Reference/Methods)
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   */
  RESET_CONTENT = 205,

  /**
   * The HTTP **`206 Partial Content`** [successful response](/en-US/docs/Web/HTTP/Reference/Status#successful_responses) status code is sent in response to a [range request](/en-US/docs/Web/HTTP/Guides/Range_requests).
   * The response body contains the requested ranges of data as specified in the [Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Range) header of the request.
   *
   * The format of the response depends on the number of ranges requested.
   * If a single range is requested, the [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) of the entire response is set to the type of the document, and a [Content-Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Range) is provided.
   * If several ranges are requested, the [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) is set to `multipart/byteranges`, and each fragment covers one range, with its own [Content-Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Range) and [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) headers describing it.
   *
   * ## Status
   *
   * ```http
   * 206 Partial Content
   * ```
   *
   * ## Examples
   *
   * ### Receiving a `206` response for a single requested range
   *
   * The following is a sample `206` response when a single range of `21010-` (bytes 21010 to the end of file) of an image file is requested.
   * The response contains [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) of `image/gif` and the [Content-Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Range) is provided:
   *
   * ```http
   * GET /z4d4kWk.gif HTTP/1.1
   * Host: images.example.com
   * Range: bytes=21010-
   * ```
   *
   * ```http
   * HTTP/1.1 206 Partial Content
   * Date: Wed, 15 Nov 2015 06:25:24 GMT
   * Last-Modified: Wed, 15 Nov 2015 04:58:08 GMT
   * Content-Range: bytes 21010-47021/47022
   * Content-Length: 26012
   * Content-Type: image/gif
   * ETag: "abc123"
   * Accept-Ranges: bytes
   *
   * # 26012 bytes of partial image data…
   * ```
   *
   * ### Receiving a `206` response for multiple requested ranges
   *
   * Following is a sample `206` response when two ranges of a PDF file are requested.
   * The response contains the `multipart/byteranges` [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) with a separate [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) (`application/pdf`) and [Content-Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Range) for each range.
   *
   * ```http
   * GET /price-list.pdf HTTP/1.1
   * Host: example.com
   * Range: bytes=234-639,4590-7999
   * ```
   *
   * ```http
   * HTTP/1.1 206 Partial Content
   * Date: Wed, 15 Nov 2015 06:25:24 GMT
   * Last-Modified: Wed, 15 Nov 2015 04:58:08 GMT
   * Content-Length: 1741
   * Content-Type: multipart/byteranges; boundary=String_separator
   * ETag: "abc123"
   * Accept-Ranges: bytes
   *
   * --String_separator
   * Content-Type: application/pdf
   * Content-Range: bytes 234-639/8000
   *
   * # content of first range (406 bytes)
   * --String_separator
   * Content-Type: application/pdf
   * Content-Range: bytes 4590-7999/8000
   *
   * # content of second range (3410 bytes)
   * --String_separator--
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [If-Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Range)
   * - [Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Range)
   * - [Content-Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Range)
   * - [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type)
   * - [HTTP request methods](/en-US/docs/Web/HTTP/Reference/Methods)
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   */
  PARTIAL_CONTENT = 206,

  /**
   * The HTTP **`207 Multi-Status`** [successful response](/en-US/docs/Web/HTTP/Reference/Status#successful_responses) status code indicates a mixture of responses.
   * This response is used exclusively in the context of Web Distributed Authoring and Versioning ([WebDAV](https://developer.mozilla.org/en-US/docs/Glossary/WebDAV)).
   *
   * The response body is a `text/xml` or `application/xml` HTTP entity with a `multistatus` root element that lists individual response codes.
   *
   * > [!NOTE]
   * > Browsers accessing web pages will never encounter this status code.
   * > The ability to return a _collection of resources_ is part of the [WebDAV](https://developer.mozilla.org/en-US/docs/Glossary/WebDAV) protocol and is only encountered by web applications that access a WebDAV server.
   *
   * ## Status
   *
   * ```http
   * 207 Multi-Status
   * ```
   *
   * ## Examples
   *
   * ### Receiving a `207` response in a WebDAV context
   *
   * The following response is an example `207` response that a [WebDAV](https://developer.mozilla.org/en-US/docs/Glossary/WebDAV) server sends to a client.
   * There is a `multistatus` root element with details of the individual collections:
   *
   * ```http
   * HTTP/1.1 207 Multi-Status
   * Content-Type: application/xml; charset="utf-8"
   * Content-Length: 1241
   *
   *
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [204](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204)
   * - [403](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403)
   * - [HTTP request methods](/en-US/docs/Web/HTTP/Reference/Methods)
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   */
  MULTI_STATUS = 207,

  /**
   * The HTTP **`208 Already Reported`** [successful response](/en-US/docs/Web/HTTP/Reference/Status#successful_responses) status code is used in a [207 Multi-Status](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/207) response to save space and avoid conflicts.
   * This response is used exclusively in the context of Web Distributed Authoring and Versioning ([WebDAV](https://developer.mozilla.org/en-US/docs/Glossary/WebDAV)).
   *
   * If the same resource is requested several times (for example, as part of a collection) with different paths, only the first one is reported with [200](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200).
   * Responses for all other bindings will report with this `208` status code, so no conflicts are created and the response stays shorter.
   *
   * > [!NOTE]
   * > The ability to _bind_ a resource to several paths is an extension to the [WebDAV](https://developer.mozilla.org/en-US/docs/Glossary/WebDAV) protocol (it may be received by web applications accessing a WebDAV server).
   * > Browsers accessing web pages will never encounter this status code.
   *
   * ## Status
   *
   * ```http
   * 208 Already Reported
   * ```
   *
   * ## Examples
   *
   * ### Receiving a `208` in a `207 Multi-Status` response
   *
   * The following is a sample `207 Multi-Status` response from a WebDAV server, which includes a `208` response.
   * Notice the `208` in the last `
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [200](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200)
   * - [508 Loop Detected](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/508)
   * - [HTTP request methods](/en-US/docs/Web/HTTP/Reference/Methods)
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   */
  ALREADY_REPORTED = 208,

  /**
   * The HTTP **`226 IM Used`** [successful response](/en-US/docs/Web/HTTP/Reference/Status#successful_responses) status code indicates that the server is returning a [delta](https://developer.mozilla.org/en-US/docs/Glossary/delta) in response to a [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) request.
   * It is used in the context of _HTTP delta encodings_.
   *
   * IM stands for _instance manipulation_, which refers to the algorithm generating a _delta_.
   * In delta encoding, a client sends a [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) request with two headers: `A-IM:`, which indicates a preference for a differencing algorithm, and [If-None-Match](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-None-Match), which specifies the version of a resource it has.
   * The server responds with deltas relative to a given base document, rather than the document in full.
   * This response uses the `226` status code, an `IM:` header that describes the differencing algorithm used, and may include a `Delta-Base:` header with the [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) matching the base document associated to the delta.
   *
   * > [!WARNING]
   * > Poor support for HTTP delta encodings means there are few implementations.
   * > Instead, most systems rely solely on [compression methods](/en-US/docs/Web/HTTP/Guides/Compression) to reduce bandwidth, although a combination of compression and delta encodings is possible.
   * >
   * > Even if the client and server support delta encodings, proxies or caches may not, and the complexity of adding HTTP delta encodings to a system may outweigh the benefits.
   *
   * ## Status
   *
   * ```http
   * 226 IM Used
   * ```
   *
   * ## Examples
   *
   * ### Receiving a `208` with the `vcdiff` delta algorithm
   *
   * In the following `GET` request, a client requests a resource and has a cached version with the ETag `abcd123`.
   * The `A-IM:` header indicates a preference for `vcdiff` and `diffe` delta algorithms:
   *
   * ```http
   * GET /resource.txt HTTP/1.1
   * Host: example.com
   * A-IM: vcdiff, diffe
   * If-None-Match: "abcd123"
   * ```
   *
   * Assuming the server supports delta encodings, it responds with the diff since the version with the ETag `abcd123`.
   * The `IM` header indicates that the `vcdiff` algorithm is used, and the `Delta-Base:` header indicates that the diff is based on a resource with ETag `abcd123`.
   *
   * ```http
   * HTTP/1.1 226 IM Used
   * ETag: "5678a23"
   * IM: vcdiff
   * Content-Type: text/plain
   * Content-Length: 123
   * Delta-Base: abcd123
   *
   * ...
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [200](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200)
   * - [HTTP request methods](/en-US/docs/Web/HTTP/Reference/Methods)
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [Syndication feed deltas help reduce subscription bandwidth costs](https://www.ctrl.blog/entry/feed-delta-updates.html) (2017)
   */
  IM_USED = 226,

  /**
   * The HTTP **`300 Multiple Choices`** [redirection response](/en-US/docs/Web/HTTP/Reference/Status#redirection_messages) status code indicates that the request has more than one possible response.
   * The user-agent or the user should choose one of them.
   *
   * > [!NOTE]
   * > In [agent-driven content negotiation](/en-US/docs/Web/HTTP/Guides/Content_negotiation#agent-driven_negotiation), a client and server collaboratively decide the best variant of a given resource when the server has multiple variants.
   * > Most clients lack a method for automatically choosing from responses, and the additional round-trips slow down client-server interaction.
   * > [Server-driven content negotiation](/en-US/docs/Web/HTTP/Guides/Content_negotiation#server-driven_content_negotiation) is far more common, where a server chooses the most appropriate resource for the client based on the request headers ([Accept-Language](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language), [Accept](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept), etc.).
   *
   * The server should include content in the response that contains a list of resource metadata and URIs from which the user or user agent can choose.
   * The format of the content is implementation-specific, but should be easily parsed by the user agent (such as HTML or JSON).
   *
   * If the server has a preferred choice that the client should request, it can include it in a [Location](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Location) header.
   *
   * ## Status
   *
   * ```http
   * 300 Multiple Choices
   * ```
   *
   * ## Examples
   *
   * ### 300 response with list of resources
   *
   * The following example demonstrates a Transparent Content Negotiation request-response exchange.
   * An Apache server offers multiple variants of a resource defined in a [type map](https://httpd.apache.org/docs/trunk/mod/mod_negotiation.html#typemaps); `index.html.en` for a resource in English, and `index.html.fr` for a French version:
   *
   * ```http
   * URI: index.html.en
   * Content-Language: en
   *
   * URI: index.html.fr
   * Content-Language: fr
   * ```
   *
   * A `Negotiate: trans` request header indicates that the client wants to use TCN to choose a resource.
   * Poor browser support for this mechanism means a user agent such as curl must be used instead:
   *
   * ```bash
   *  curl -v -H "Negotiate: trans" http://localhost/index
   * ```
   *
   * This produces the following request:
   *
   * ```http
   * GET /index HTTP/1.1
   * Host: localhost
   * User-Agent: curl/8.7.1
   * Accept: * /*
   * Negotiate: trans
   * ```
   *
   * We receive a `300` response with details of different representations of the requested resource:
   *
   * ```http
   * HTTP/1.1 300 Multiple Choices
   * Date: Fri, 30 Aug 2024 09:21:48 GMT
   * Server: Apache/2.4.59 (Unix)
   * Alternates: {"index.html.en" 1 {type text/html} {language en} {length 48}}, {"index.html.fr" 1 {type text/html} {language fr} {length 45}}
   * Vary: negotiate,accept-language
   * TCN: list
   * Content-Length: 419
   * Content-Type: text/html; charset=iso-8859-1
   *
   *
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [Redirections in HTTP](/en-US/docs/Web/HTTP/Guides/Redirections)
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [301 Moved Permanently](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/301)
   * - [302 Found](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/302) temporary redirect
   * - [308 Permanent Redirect](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/308)
   * - [506 Variant Also Negotiates](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/506)
   * - [Apache Server Negotiation Algorithm](https://httpd.apache.org/docs/current/en/content-negotiation.html#algorithm)
   * - [Transparent Content Negotiation in HTTP](https://developer.mozilla.org/en-US/docs/RFC/2295)
   */
  MULTIPLE_CHOICES = 300,

  /**
   * The HTTP **`301 Moved Permanently`** [redirection response](/en-US/docs/Web/HTTP/Reference/Status#redirection_messages) status code indicates that the requested resource has been permanently moved to the URL in the [Location](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Location) header.
   *
   * A browser receiving this status will automatically request the resource at the URL in the `Location` header, redirecting the user to the new page.
   * Search engines receiving this response will attribute links to the original URL to the redirected resource, passing the [SEO](https://developer.mozilla.org/en-US/docs/Glossary/SEO) ranking to the new URL.
   *
   * > [!NOTE]
   * > In the [Fetch Standard](https://fetch.spec.whatwg.org/#http-redirect-fetch), when a user agent receives a `301` in response to a [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/POST) request, it uses the [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) method in the subsequent redirection request, as permitted by the HTTP [specification](#specifications).
   * > To avoid user agents modifying the request, use [308 Permanent Redirect](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/308) instead, as altering the method after a `308` response is prohibited.
   *
   * ## Status
   *
   * ```http
   * 301 Moved Permanently
   * ```
   *
   * ## Examples
   *
   * ### 301 response to a moved resource
   *
   * The following [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) request is made to a resource with a `301` redirection in place.
   *
   * ```http
   * GET /en-US/docs/AJAX HTTP/2
   * Host: developer.mozilla.org
   * User-Agent: curl/8.6.0
   * Accept: * /*
   * ```
   *
   * The response includes the `301` status along with the [Location](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Location) header that indicates the URL where the resource has moved.
   *
   * ```http
   * HTTP/2 301
   * cache-control: max-age=2592000,public
   * location: /en-US/docs/Learn_web_development/Core/Scripting/Network_requests
   * content-type: text/plain; charset=utf-8
   * date: Fri, 19 Jul 2024 12:57:17 GMT
   * content-length: 97
   *
   * Moved Permanently. Redirecting to /en-US/docs/Learn_web_development/Core/Scripting/Network_requests
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [Redirections in HTTP](/en-US/docs/Web/HTTP/Guides/Redirections)
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [308 Permanent Redirect](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/308) equivalent to `301`, but the request method is not modified
   * - [302 Found](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/302) temporary redirect
   */
  MOVED_PERMANENTLY = 301,

  /**
   * The HTTP **`302 Found`** [redirection response](/en-US/docs/Web/HTTP/Reference/Status#redirection_messages) status code indicates that the requested resource has been temporarily moved to the URL in the [Location](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Location) header.
   *
   * A browser receiving this status will automatically request the resource at the URL in the `Location` header, redirecting the user to the new page.
   * Search engines receiving this response will not attribute links to the original URL to the new resource, meaning no [SEO](https://developer.mozilla.org/en-US/docs/Glossary/SEO) value is transferred to the new URL.
   *
   * > [!NOTE]
   * > In the [Fetch Standard](https://fetch.spec.whatwg.org/#http-redirect-fetch), when a user agent receives a `302` in response to a [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/POST) request, it uses the [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) method in the subsequent redirection request, as permitted by the HTTP [specification](#specifications).
   * > To avoid user agents modifying the request, use [307 Temporary Redirect](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/307) instead, as altering the method after a `307` response is prohibited.
   * >
   * > In cases where you want any request method to be changed to [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET), use [303 See Other](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/303).
   * > This is useful when you want to give a response to a [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/PUT) method that is not the uploaded resource but a confirmation message such as: "you successfully uploaded XYZ".
   *
   * ## Status
   *
   * ```http
   * 302 Found
   * ```
   *
   * ## Examples
   *
   * ### 302 response with new URL
   *
   * ```http
   * GET /profile HTTP/1.1
   * Host: www.example.com
   * ```
   *
   * ```http
   * HTTP/1.1 302 Found
   * Location: https://www.example.com/new-profile-url
   * Content-Type: text/html; charset=UTF-8
   * Content-Length: 0
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [Redirections in HTTP](/en-US/docs/Web/HTTP/Guides/Redirections)
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [307 Temporary Redirect](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/307), equivalent to `302` but the request method is not modified
   * - [303 See Other](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/303), a temporary redirect that changes the method to [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET)
   * - [301 Moved Permanently](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/301), a permanent redirect.
   */
  FOUND = 302,

  /**
   * The HTTP **`303 See Other`** [redirection response](/en-US/docs/Web/HTTP/Reference/Status#redirection_messages) status code indicates that the browser should redirect to the URL in the [Location](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Location) header instead of rendering the requested resource.
   *
   * This response code is often sent back as a result of [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/PUT) or [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/POST) methods so the client may retrieve a confirmation, or view a representation of a real-world object (see [HTTP range-14](https://en.wikipedia.org/wiki/HTTPRange-14)).
   * The method to retrieve the redirected resource is always [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET).
   *
   * ## Status
   *
   * ```http
   * 303 See Other
   * ```
   *
   * ## Examples
   *
   * ### 303 response on form submission
   *
   * The client in this example sends a [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/POST) request to submit a form to a generic subscription.
   *
   * ```http
   * POST /subscribe HTTP/1.1
   * Host: example.com
   * Content-Type: application/x-www-form-urlencoded
   * Content-Length: 50
   *
   * name=Brian%20Smith&email=brian.smith%40example.com
   * ```
   *
   * The server may send back a response with a `303` status and a confirmation page in the [Location](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Location) header, so the user is redirected there after receiving the response.
   *
   * ```http
   * HTTP/1.1 303 See Other
   * Location: https://www.example.com/confirmation/event/123
   * Content-Type: text/html; charset=UTF-8
   * Content-Length: 0
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [Redirections in HTTP](/en-US/docs/Web/HTTP/Guides/Redirections)
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [302 Found](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/302), a temporary redirect
   * - [307 Temporary Redirect](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/307), a temporary redirect where the request method is not modified
   */
  SEE_OTHER = 303,

  /**
   * The HTTP **`304 Not Modified`** [redirection response](/en-US/docs/Web/HTTP/Reference/Status#redirection_messages) status code indicates that there is no need to retransmit the requested resources.
   *
   * This response code is sent when the request is a [conditional](/en-US/docs/Web/HTTP/Guides/Conditional_requests) [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) or [HEAD](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/HEAD) request with an [If-None-Match](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-None-Match) or an [If-Modified-Since](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Modified-Since) header and the condition evaluates to 'false'.
   * It confirms that the resource cached by the client is still valid and that the server would have sent a [200 OK](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200) response with the resource if the condition evaluated to 'true'.
   * See [HTTP caching](/en-US/docs/Web/HTTP/Guides/Caching) for more information.
   *
   * The response must not contain a body and must include the headers that would have been sent in an equivalent [200](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200) response, such as:
   *
   * - [Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)
   * - [Content-Location](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Location)
   * - [Date](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Date)
   * - [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag)
   * - [Expires](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Expires)
   * - [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary)
   *
   * > [!NOTE]
   * > Many [developer tools' network panels](https://firefox-source-docs.mozilla.org/devtools-user/network_monitor/index.html) of browsers create extraneous requests leading to `304` responses, so that access to the local cache is visible to developers.
   *
   * ## Status
   *
   * ```http
   * 304 Not Modified
   * ```
   *
   * ## Examples
   *
   * ### 304 response to conditional requests
   *
   * The examples below show [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) requests made using [curl](https://curl.se/) with conditional request headers.
   * The `--http1.1` flag is used to force the HTTP/1.1 protocol for readability.
   *
   * The first request uses an `If-Modified-Since` condition with a future date of 21st November 2050.
   * This must evaluate to `false`, because the resource can't have been updated after a time that hasn't happened yet:
   *
   * ```bash
   * curl --http1.1 -I --header 'If-Modified-Since: Tue, 21 Nov 2050 08:00:00 GMT' \
   *  https://developer.mozilla.org/en-US/
   * ```
   *
   * This will result in the following HTTP request:
   *
   * ```http
   * GET /en-US/ HTTP/1.1
   * Host: developer.mozilla.org
   * User-Agent: curl/8.7.1
   * Accept: * /*
   * If-Modified-Since: Tue, 21 Nov 2050 08:00:00 GMT
   * ```
   *
   * The response would be [200 OK](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200) with the current version of the resource if the resource had been updated after the timestamp in the [If-Modified-Since](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Modified-Since) header.
   * Instead, we get a `304` response that includes [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag), [Age](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Age) and [Expires](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Expires) headers, telling us our cached version of the resource is still current:
   *
   * ```http
   * HTTP/1.1 304 Not Modified
   * Date: Wed, 28 Aug 2024 09:52:35 GMT
   * Expires: Wed, 28 Aug 2024 10:01:53 GMT
   * Age: 3279
   * ETag: "b20a0973b226eeea30362acb81f9e0b3"
   * Cache-Control: public, max-age=3600
   * Vary: Accept-Encoding
   * X-cache: hit
   * Alt-Svc: clear
   * ```
   *
   * Now run another `curl` command using the `etag` value from the previous response with the [If-None-Match](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-None-Match) condition (since this `etag` is the current version of the resource on the server we expect to receive a `304 Not Modified` response):
   *
   * ```bash
   * curl --http1.1 -I --header 'If-None-Match: "b20a0973b226eeea30362acb81f9e0b3"' \
   *  https://developer.mozilla.org/en-US/
   * ```
   *
   * This will result in the following HTTP request:
   *
   * ```http
   * GET /en-US/ HTTP/1.1
   * Host: developer.mozilla.org
   * User-Agent: curl/8.7.1
   * Accept: * /*
   * If-None-Match: "b20a0973b226eeea30362acb81f9e0b3"
   * ```
   *
   * Because the `etag` value matches at the time of the request, the entity tag fails the condition, and a `304` response is returned:
   *
   * ```http
   * HTTP/1.1 304 Not Modified
   * Date: Wed, 28 Aug 2024 10:36:35 GMT
   * Expires: Wed, 28 Aug 2024 11:02:17 GMT
   * Age: 662
   * ETag: "b20a0973b226eeea30362acb81f9e0b3"
   * Cache-Control: public, max-age=3600
   * Vary: Accept-Encoding
   * X-cache: hit
   * Alt-Svc: clear
   * ```
   *
   * ## Specifications
   *
   * ## Compatibility notes
   *
   * Browser behavior differs if this response erroneously includes a body on persistent connections.
   * See [204 No Content](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204) for more details.
   *
   * ## See also
   *
   * - [Redirections in HTTP](/en-US/docs/Web/HTTP/Guides/Redirections)
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [HTTP conditional requests](/en-US/docs/Web/HTTP/Guides/Conditional_requests)
   * - [If-Modified-Since](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Modified-Since)
   * - [If-None-Match](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-None-Match)
   */
  NOT_MODIFIED = 304,

  /**
   * The HTTP **`307 Temporary Redirect`** [redirection response](/en-US/docs/Web/HTTP/Reference/Status#redirection_messages) status code indicates that the resource requested has been temporarily moved to the URL in the [Location](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Location) header.
   *
   * A browser receiving this status will automatically request the resource at the URL in the `Location` header, redirecting the user to the new page.
   * Search engines receiving this response will not attribute links to the original URL to the new resource, meaning no [SEO](https://developer.mozilla.org/en-US/docs/Glossary/SEO) value is transferred to the new URL.
   *
   * The method and the body of the original request are reused to perform the redirected request.
   * In the cases where you want the request method to be changed to [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET), use [303 See Other](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/303) instead.
   * This is useful when you want to give an answer to a successful [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/PUT) request that is not the uploaded resource, but a status monitor or confirmation message like "You have successfully uploaded XYZ".
   *
   * The difference between `307` and [302](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/302) is that `307` guarantees that the client **will not change** the request method and body when the redirected request is made.
   * With `302`, older clients incorrectly changed the method to [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET).
   * `307` and `302` responses are identical when the request method is [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET).
   *
   * ## Status
   *
   * ```http
   * 307 Temporary Redirect
   * ```
   *
   * ## Examples
   *
   * ### 307 response to a moved resource
   *
   * The following [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) request to is made to a resource that has a `307` redirection in place.
   * The [Location](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Location) header provides the URL of the redirected resource.
   *
   * ```http
   * GET /en-US/docs/AJAX HTTP/2
   * Host: developer.mozilla.org
   * User-Agent: curl/8.6.0
   * Accept: * /*
   * ```
   *
   * ```http
   * HTTP/2 307
   * location: /en-US/docs/Learn_web_development/Core/Scripting/Network_requests
   * content-type: text/plain; charset=utf-8
   * date: Fri, 19 Jul 2024 12:57:17 GMT
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [Redirections in HTTP](/en-US/docs/Web/HTTP/Guides/Redirections)
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [302 Found](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/302), the equivalent to `307`, but may modify non-[GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) methods
   * - [303 See Other](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/303), temporary redirect that modifies the request method to [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET)
   * - [301 Moved Permanently](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/301), a permanent redirect
   */
  TEMPORARY_REDIRECT = 307,

  /**
   * The HTTP **`308 Permanent Redirect`** [redirection response](/en-US/docs/Web/HTTP/Reference/Status#redirection_messages) status code indicates that the requested resource has been permanently moved to the URL given by the [Location](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Location) header.
   *
   * A browser receiving this status will automatically request the resource at the URL in the `Location` header, redirecting the user to the new page.
   * Search engines receiving this response will attribute links to the original URL to the redirected resource, passing the [SEO](https://developer.mozilla.org/en-US/docs/Glossary/SEO) ranking to the new URL.
   *
   * The request method and the body **will not be modified** by the client in the redirected request.
   * A [301 Moved Permanently](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/301) requires the request method and the body to remain unchanged when redirection is performed, but this is incorrectly handled by older clients to use the [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) method instead.
   *
   * > [!NOTE]
   * > Some Web applications may use the `308 Permanent Redirect` in a non-standard way and for different purposes.
   * > For example, Google Drive uses a `308 Resume Incomplete` response to indicate to the client when an unfinished upload has stalled.
   * > See [Perform a resumable download](https://developers.google.com/workspace/drive/api/guides/manage-uploads) on the Google Drive documentation for more information.
   *
   * ## Status
   *
   * ```http
   * 308 Permanent Redirect
   * ```
   *
   * ## Examples
   *
   * ### 308 response to a moved resource
   *
   * ```http
   * GET /featured HTTP/1.1
   * Host: www.example.org
   * ```
   *
   * ```http
   * HTTP/1.1 308 Permanent Redirect
   * Location: http://www.example.com/featured
   * Content-Length: 0
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [Redirections in HTTP](/en-US/docs/Web/HTTP/Guides/Redirections)
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [301 Moved Permanently](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/301), the equivalent of this status code that may modify the request method when it is not a [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET)
   * - [302 Found](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/302), a temporary redirect
   */
  PERMANENT_REDIRECT = 308,

  /**
   * The HTTP **`400 Bad Request`** [client error response](/en-US/docs/Web/HTTP/Reference/Status#client_error_responses) status code indicates that the server would not process the request due to something the server considered to be a client error.
   * The reason for a `400` response is typically due to malformed request syntax, invalid request message framing, or deceptive request routing.
   *
   * Clients that receive a `400` response should expect that repeating the request without modification will fail with the same error.
   *
   * ## Status
   *
   * ```http
   * 400 Bad Request
   * ```
   *
   * ## Examples
   *
   * ### Malformed request syntax
   *
   * Assuming a [REST](https://developer.mozilla.org/en-US/docs/Glossary/REST) API exists with an endpoint to manage users at `http://example.com/users` and a `POST` request with the following body attempts to create a user, but uses invalid JSON with unescaped line breaks:
   *
   * ```http
   * POST /users HTTP/1.1
   * Host: example.com
   * Content-Type: application/json
   * Content-Length: 38
   *
   * {
   *   "email": "b@example.com
   * ",
   *   "username": "b.smith"
   * }
   * ```
   *
   * If the [content](https://developer.mozilla.org/en-US/docs/Glossary/HTTP_Content) is in a valid format, we would expect a [201 Created](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201) response or another success message, but instead the server responds with a `400` and the response body includes a `message` field with some context so the client can retry the action with a properly-formed request:
   *
   * ```http
   * HTTP/1.1 400 Bad Request
   * Content-Type: application/json
   * Content-Length: 71
   *
   * {
   *   "error": "Bad request",
   *   "message": "Request body could not be read properly.",
   * }
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [HTTP Status Code Definitions](https://httpwg.org/specs/rfc9110.html#status.400)
   */
  BAD_REQUEST = 400,

  /**
   * The HTTP **`401 Unauthorized`** [client error response](/en-US/docs/Web/HTTP/Reference/Status#client_error_responses) status code indicates that a request was not successful because it lacks valid authentication credentials for the requested resource.
   * This status code is sent with an HTTP [WWW-Authenticate](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/WWW-Authenticate) response header that contains information on the [authentication scheme](/en-US/docs/Web/HTTP/Guides/Authentication#authentication_schemes) the server expects the client to include to make the request successfully.
   *
   * A `401 Unauthorized` is similar to the [403 Forbidden](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403) response, except that a 403 is returned when a request contains valid credentials, but the client does not have permissions to perform a certain action.
   *
   * ## Status
   *
   * ```http
   * 401 Unauthorized
   * ```
   *
   * ## Examples
   *
   * ### Unauthorized request to a protected API
   *
   * The following GET request is made to a URL `www.example.com/admin` that expects credentials in an [Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization) header:
   *
   * ```http
   * GET /admin HTTP/1.1
   * Host: example.com
   * ```
   *
   * The server responds with a 401 message and a [WWW-Authenticate](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/WWW-Authenticate) header indicating that the request must be authenticated and that `Bearer` auth (an access token) is the permitted [authentication scheme](/en-US/docs/Web/HTTP/Guides/Authentication#authentication_schemes):
   *
   * ```http
   * HTTP/1.1 401 Unauthorized
   * Date: Tue, 02 Jul 2024 12:18:47 GMT
   * WWW-Authenticate: Bearer
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [HTTP authentication](/en-US/docs/Web/HTTP/Guides/Authentication)
   * - [Challenge](https://developer.mozilla.org/en-US/docs/Glossary/Challenge)
   * - [WWW-Authenticate](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/WWW-Authenticate)
   * - [Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization)
   * - [Proxy-Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Proxy-Authorization)
   * - [Proxy-Authenticate](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Proxy-Authenticate)
   * - [403](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403), [407](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/407)
   */
  UNAUTHORIZED = 401,

  /**
   * The HTTP **`402 Payment Required`** [client error response](/en-US/docs/Web/HTTP/Reference/Status#client_error_responses) status code is a **nonstandard** response status code reserved for future use.
   *
   * This status code was created to enable digital cash or (micro) payment systems and would indicate that requested content is not available until the client makes a payment.
   * No standard use convention exists and different systems use it in different contexts.
   *
   * ## Status
   *
   * ```http
   * 402 Payment Required
   * ```
   *
   * ## Examples
   *
   * ### Payment API failure
   *
   * Some payment APIs use the 402 response as a generic catch-all for failed payment requests.
   * The following example tries to make a call to a payment API using a POST request to initiate a transaction:
   *
   * ```http
   * POST /merchant/transfers/payment HTTP/1.1
   * Host: payments.example.com
   * Content-Type: application/json
   * Content-Length: 402
   *
   * {
   *   "payment_transfer": {
   *     "reference": "PAYMENT123456",
   *     "amount": "1337",
   *     "currency": "EUR",
   *     "sender_account_uri": "pan:5299920000000149;exp=2020-08;cvc=123",
   *     "sender": {
   *       "first_name": "Amelia",
   *       "middle_name": "Rosenburg",
   *       "email": "test123@sender.example.com"
   *     },
   *     "recipient": {
   *       "first_name": "Tyrone",
   *       "middle_name": "Johnston",
   *       "email": "test123@example.com",
   *       "merchant_id": "123"
   *     },
   *     "authentication_value": "ucaf:jJJLtQa+Iws8AREAEbjsA1MAAAA",
   *   }
   * }
   * ```
   *
   * The server responds to the request with a 402 if there is a problem with the transaction, in this case, the card is expired:
   *
   * ```http
   * HTTP/1.1 402 Payment Required
   * Date: Tue, 02 Jul 2024 12:56:49 GMT
   * Content-Type: application/json
   * Content-Length: 175
   *
   * {
   *   "error": {
   *     "code": "expired_card",
   *     "doc_url": "https://example.com/error-codes#expired-card",
   *     "message": "The card has expired. Verify expiration or use a different card.",
   *   }
   * }
   * ```
   *
   * ## Specifications
   *
   * ## Compatibility notes
   *
   * This status code is _reserved_ but not defined.
   * Actual implementations vary in the format and contents of the response.
   * No browser supports a 402, and an error will be displayed as a generic `4xx` status code.
   *
   * ## See also
   *
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [HTTP authentication](/en-US/docs/Web/HTTP/Guides/Authentication)
   */
  PAYMENT_REQUIRED = 402,

  /**
   * The HTTP **`403 Forbidden`** [client error response](/en-US/docs/Web/HTTP/Reference/Status#client_error_responses) status code indicates that the server understood the request but refused to process it.
   * This status is similar to [401](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401), except that for **`403 Forbidden`** responses, authenticating or re-authenticating makes no difference.
   * The request failure is tied to application logic, such as insufficient permissions to a resource or action.
   *
   * Clients that receive a `403` response should expect that repeating the request without modification will fail with the same error.
   * Server owners may decide to send a [404](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404) response instead of a 403 if acknowledging the existence of a resource to clients with insufficient privileges is not desired.
   *
   * ## Status
   *
   * ```http
   * 403 Forbidden
   * ```
   *
   * ## Examples
   *
   * ### Request failed due to insufficient permissions
   *
   * The following example request is made to an API for user management.
   * The request contains an [Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization) header using `Bearer` [authentication scheme](/en-US/docs/Web/HTTP/Guides/Authentication#authentication_schemes) containing an access token:
   *
   * ```http
   * DELETE /users/123 HTTP/1.1
   * Host: example.com
   * Authorization: Bearer abcd123
   * ```
   *
   * The server has authenticated the request, but the action fails due to insufficient rights and the response body contains a reason for the failure:
   *
   * ```http
   * HTTP/1.1 403 Forbidden
   * Date: Tue, 02 Jul 2024 12:56:49 GMT
   * Content-Type: application/json
   * Content-Length: 88
   *
   * {
   *   "error": "InsufficientPermissions",
   *   "message": "Deleting users requires the 'admin' role."
   * }
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [401](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401)
   * - [HTTP Status Code Definitions](https://httpwg.org/specs/rfc9110.html#status.403)
   */
  FORBIDDEN = 403,

  /**
   * The HTTP **`404 Not Found`** [client error response](/en-US/docs/Web/HTTP/Reference/Status#client_error_responses) status code indicates that the server cannot find the requested resource.
   * Links that lead to a 404 page are often called broken or dead links and can be subject to [link rot](https://en.wikipedia.org/wiki/Link_rot).
   *
   * A 404 status code only indicates that the resource is missing without indicating if this is temporary or permanent.
   * If a resource is permanently removed, servers should send the [410 Gone](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/410) status instead.
   *
   * 404 errors on a website can lead to a poor user experience for your visitors, so the number of broken links (internal and external) should be minimized to prevent frustration for readers.
   * Common causes of 404 responses are mistyped URLs or pages that are moved or deleted without redirection.
   * For more information, see the [Redirections in HTTP](/en-US/docs/Web/HTTP/Guides/Redirections) guide.
   *
   * ## Status
   *
   * ```http
   * 404 Not Found
   * ```
   *
   * ## Examples
   *
   * ### Page not found
   *
   * Fetching a non-existent page may look like the following request:
   *
   * ```http
   * GET /my-deleted-blog-post HTTP/1.1
   * Host: example.com
   * ```
   *
   * The server returns a response similar to this:
   *
   * ```http
   * HTTP/1.1 404 Not Found
   * Age: 249970
   * Cache-Control: max-age=604800
   * Content-Type: text/html; charset=UTF-8
   * Date: Fri, 28 Jun 2024 11:40:58 GMT
   * Expires: Fri, 05 Jul 2024 11:40:58 GMT
   * Last-Modified: Tue, 25 Jun 2024 14:14:48 GMT
   * Server: ECAcc (nyd/D13E)
   * Vary: Accept-Encoding
   * X-Cache: 404-HIT
   * Content-Length: 1256
   *
   *
   *     ...
   * ```
   *
   * ### Custom error page in Apache
   *
   * For the Apache server, you can specify a path to a custom 404 page in a `.htaccess` file.
   * The example below uses `notfound.html` as a page to show visitors on 404s, although a common approach is to name the file `404.html` or `404.php` (depending on the server-side technology) at the top-level of the server:
   *
   * ```apacheconf
   * ErrorDocument 404 /notfound.html
   * ```
   *
   * > [!NOTE]
   * > Custom 404 page design is a good thing in moderation.
   * > Feel free to make your 404 page humorous and human, but don't confuse your visitors as to why they are seeing something unexpected.
   * >
   * > For an example of a custom 404 page, see the [KonMari 404 page](https://konmari.com/404).
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [410](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/410)
   * - [Wikipedia: HTTP 404](https://en.wikipedia.org/wiki/HTTP_404)
   */
  NOT_FOUND = 404,

  /**
   * The HTTP **`405 Method Not Allowed`** [client error response](/en-US/docs/Web/HTTP/Reference/Status#client_error_responses) status code indicates that the server knows the request method, but the target resource doesn't support this method.
   * The server **must** generate an [Allow](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Allow) header in a 405 response with a list of methods that the target resource currently supports.
   *
   * Improper server-side permissions set on files or directories may cause a 405 response when the request would otherwise be expected to succeed.
   *
   * ## Status
   *
   * ```http
   * 405 Method Not Allowed
   * ```
   *
   * ## Examples
   *
   * ### TRACE method not allowed
   *
   * Server owners often disallow the use of the `TRACE` method due to security concerns.
   * The following example shows a typical response where a server doesn't allow the use of `TRACE`:
   *
   * ```http
   * TRACE / HTTP/1.1
   * Host: example.com
   * ```
   *
   * ```http
   * HTTP/1.1 405 Method Not Allowed
   * Content-Length: 0
   * Date: Fri, 28 Jun 2024 14:30:31 GMT
   * Server: ECLF (nyd/D179)
   * Allow: GET, POST, HEAD
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [Allow](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Allow)
   * - [501 Not Implemented](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/501), [510 Not Extended](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/510)
   * - [HTTP Status Code Definitions](https://httpwg.org/specs/rfc9110.html#status.405)
   * - [How to Fix 405 Method Not Allowed](https://kinsta.com/blog/405-method-not-allowed-error/)
   * - [Troubleshooting HTTP 405](https://learn.microsoft.com/en-us/aspnet/web-api/overview/testing-and-debugging/troubleshooting-http-405-errors-after-publishing-web-api-applications)
   */
  METHOD_NOT_ALLOWED = 405,

  /**
   * The HTTP **`406 Not Acceptable`** [client error response](/en-US/docs/Web/HTTP/Reference/Status#client_error_responses) status code indicates that the server could not produce a response matching the list of acceptable values defined in the request's [proactive content negotiation](/en-US/docs/Web/HTTP/Guides/Content_negotiation#server-driven_content_negotiation) headers and that the server was unwilling to supply a default representation.
   *
   * Proactive content negotiation headers include:
   *
   * - [Accept](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept)
   * - [Accept-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding)
   * - [Accept-Language](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language)
   *
   * A server may return responses that differ from the request's accept headers.
   * In such cases, a [200](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200) response with a default resource that doesn't match the client's list of acceptable content negotiation values may be preferable to sending a 406 response.
   *
   * If a server returns a 406, the body of the message should contain the list of available representations for the resource, allowing the user to choose, although no standard way for this is defined.
   *
   * ## Status
   *
   * ```http
   * 406 Not Acceptable
   * ```
   *
   * ## Examples
   *
   * ### Content type not available
   *
   * The following request assumes that `www.example.com/docs/doc1` supports sending a document back as `application/rtf`:
   *
   * ```http
   * GET /docs/doc1 HTTP/1.1
   * Host: example.com
   * Accept: application/rtf;
   * ```
   *
   * In this example, the server implementation does not fallback to a default content type like `text/html` or `application/json`, but returns a 406 instead:
   *
   * ```http
   * HTTP/1.1 406 Not Acceptable
   * Date: Wed, 26 Jun 2024 12:00:00 GMT
   * Server: Apache/2.4.1 (Unix)
   * Content-Type: application/json
   *
   * {
   *   "code": "UnsupportedType",
   *   "message": "Only 'text/html' or 'application/json' content types supported.",
   * }
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [Accept](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept)
   * - [Accept-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding)
   * - [Accept-Language](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language)
   * - HTTP [content negotiation](/en-US/docs/Web/HTTP/Guides/Content_negotiation)
   */
  NOT_ACCEPTABLE = 406,

  /**
   * The HTTP **`407 Proxy Authentication Required`** [client error response](/en-US/docs/Web/HTTP/Reference/Status#client_error_responses) status code indicates that the request did not succeed because it lacks valid authentication credentials for the [proxy server](https://developer.mozilla.org/en-US/docs/Glossary/proxy_server) that sits between the client and the server with access to the requested resource.
   *
   * This response is sent with a [Proxy-Authenticate](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Proxy-Authenticate) header that contains information on how to correctly authenticate requests.
   * The client may repeat the request with a new or replaced [Proxy-Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Proxy-Authorization) header field.
   *
   * ## Status
   *
   * ```http
   * 407 Proxy Authentication Required
   * ```
   *
   * ## Examples
   *
   * ### Proxy auth
   *
   * A GET request is made to `example.com/admin`:
   *
   * ```http
   * GET /admin HTTP/1.1
   * Host: example.com
   * ```
   *
   * Along the way, an intermediary lets the client know that clients must be authenticated and provides information about the authentication scheme:
   *
   * ```http
   * HTTP/1.1 407 Proxy Authentication Required
   * Date: Wed, 21 Oct 2015 07:28:00 GMT
   * Proxy-Authenticate: Basic realm="Access to internal site"
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [HTTP authentication](/en-US/docs/Web/HTTP/Guides/Authentication)
   * - [WWW-Authenticate](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/WWW-Authenticate)
   * - [Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization)
   * - [Proxy-Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Proxy-Authorization)
   * - [Proxy-Authenticate](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Proxy-Authenticate)
   * - [401](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401), [403](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403)
   */
  PROXY_AUTHENTICATION_REQUIRED = 407,

  /**
   * The HTTP **`408 Request Timeout`** [client error response](/en-US/docs/Web/HTTP/Reference/Status#client_error_responses) status code indicates that the server would like to shut down this unused connection.
   * A `408` is sent on an idle connection by some servers, _even without any previous request by the client_.
   *
   * A server should send the [Connection: close](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Connection) header field in the response, since `408` implies that the server has decided to close the connection rather than continue waiting.
   *
   * This response is used much more since some browsers, like Chrome and Firefox, use HTTP pre-connection mechanisms to speed up surfing.
   *
   * > [!NOTE]
   * > Some servers will shut down a connection without sending this message.
   *
   * ## Status
   *
   * ```http
   * 408 Request Timeout
   * ```
   *
   * ## Examples
   *
   * ### Timeout in form submission
   *
   * The following example shows what a client may send when an [`
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [Connection](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Connection)
   * - [X-DNS-Prefetch-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control)
   */
  REQUEST_TIMEOUT = 408,

  /**
   * The HTTP **`409 Conflict`** [client error response](/en-US/docs/Web/HTTP/Reference/Status#client_error_responses) status code indicates a request conflict with the current state of the target resource.
   *
   * In [WebDAV](https://developer.mozilla.org/en-US/docs/glossary/WebDAV) remote web authoring, 409 conflict responses are errors sent to the client so that a user might be able to resolve a conflict and resubmit the request.
   * For example, conflicts occur if a request to create collection `/a/b/c/d/` is made, and `/a/b/c/` does not exist, the request must fail with a 409.
   * Additionally, you may get a 409 response when uploading a file that is older than the existing one on the server, resulting in a version control conflict.
   *
   * In other systems, 409 responses may be used for implementation-specific purposes, such as to indicate that the server has received multiple requests to update the same resource.
   *
   * ## Status
   *
   * ```http
   * 409 Conflict
   * ```
   *
   * ## Examples
   *
   * ### Concurrent tasks disallowed
   *
   * In the following example, we want to kick off an automation process that performs a common task in the system:
   *
   * ```http
   * POST /tasks HTTP/1.1
   * Host: example.com
   * Content-Type: application/json
   *
   * {
   *   "task": "emailDogOwners",
   *   "template": "pickup"
   * }
   * ```
   *
   * In this implementation, the server disallows two concurrent jobs from running and returns a 409, providing the client an opportunity to check if they meant to perform the action or run a different task:
   *
   * ```http
   * HTTP/1.1 409 Conflict
   * Date: Wed, 26 Jun 2024 12:00:00 GMT
   * Server: Apache/2.4.1 (Unix)
   * Content-Type: application/json
   *
   * {
   *   "code": "AutomationConflict",
   *   "task": "emailDogOwners",
   *   "message": "Task locked. Cannot start a new automation since job is already running.",
   *   "runningTaskId": "123"
   * }
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/PUT)
   */
  CONFLICT = 409,

  /**
   * The HTTP **`410 Gone`** [client error response](/en-US/docs/Web/HTTP/Reference/Status#client_error_responses) status code indicates that the target resource is no longer available at the origin server and that this condition is likely to be permanent.
   * A 410 response is cacheable by default.
   *
   * Clients should not repeat requests for resources that return a 410 response, and website owners should remove or replace links that return this code.
   * If server owners don't know whether this condition is temporary or permanent, a  status code should be used instead.
   *
   * ## Status
   *
   * ```http
   * 410 Gone
   * ```
   *
   * ## Examples
   *
   * ### Requesting an outdated resource
   *
   * The following `GET` request is for a page with promotional content that is no longer valid:
   *
   * ```http
   * GET /promotions/summer-2023 HTTP/1.1
   * Host: example.com
   * ```
   *
   * ```http
   * HTTP/1.1 410 Gone
   * Content-Type: text/html
   * Content-Length: 212
   *
   *
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * -
   * - [410 gone](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#410)
   */
  GONE = 410,

  /**
   * The HTTP **`411 Length Required`** [client error response](/en-US/docs/Web/HTTP/Reference/Status#client_error_responses) status code indicates that the server refused to accept the request without a defined [Content-Length](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Length) header.
   *
   * > [!NOTE]
   * > When sending data in a series of chunks, the `Content-Length` header is omitted, and at the beginning of each chunk, the length of the current chunk needs to be included in hexadecimal format.
   * > See [Transfer-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Transfer-Encoding) for more details.
   *
   * ## Status
   *
   * ```http
   * 411 Length Required
   * ```
   *
   * ## Examples
   *
   * ### Chunked POST request
   *
   * The following request is sent chunked, which is the default method of sending data in some cases, such as when [writing to streams](https://nodejs.org/api/http.html#requestwritechunk-encoding-callback):
   *
   * ```http
   * POST /translate/de HTTP/1.1
   * Host: api.example.com
   * Content-Type: application/json
   * Transfer-encoding: chunked
   *
   * 2C
   * {"text": "Hurry up, Ayşe is hungry!"}
   * 0
   * ```
   *
   * In this case, the server is expecting a request in one part with a [Content-Length](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Length) header and returns a 411 response:
   *
   * ```http
   * HTTP/1.1 411 Length Required
   * Content-Type: application/json
   * Content-Length: 110
   *
   * {
   *   "message": "Requests must have a content length header.",
   *   "documentation": "http://api/example.com/docs/errors",
   * }
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [Content-Length](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Length)
   * - [Transfer-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Transfer-Encoding)
   */
  LENGTH_REQUIRED = 411,

  /**
   * The HTTP **`412 Precondition Failed`** [client error response](/en-US/docs/Web/HTTP/Reference/Status#client_error_responses) status code indicates that access to the target resource was denied.
   * This happens with [conditional requests](/en-US/docs/Web/HTTP/Guides/Conditional_requests) on methods other than [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) or [HEAD](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/HEAD) when the condition defined by the [If-Unmodified-Since](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Unmodified-Since) or [If-Match](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Match) headers is not fulfilled.
   * In that case, the request (usually an upload or a modification of a resource) cannot be made and this error response is sent back.
   *
   * ## Status
   *
   * ```http
   * 412 Precondition Failed
   * ```
   *
   * ## Examples
   *
   * ### Precondition failed
   *
   * ```http
   * ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
   * ETag: W/"0815"
   * ```
   *
   * ### Avoiding mid-air collisions
   *
   * With the help of the `ETag` and the [If-Match](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Match) headers, you can prevent conflicts or mid-air collisions.
   * For example, when editing some wiki pages, content is hashed and put into an `ETag` in successful responses:
   *
   * ```http
   * ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
   * ```
   *
   * When saving changes to a wiki page (posting data), the [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/POST) request will contain the [If-Match](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Match) header containing the `ETag` values that the client stored from the last edit to check freshness of the resource on the server:
   *
   * ```http
   * If-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"
   * ```
   *
   * If the hashes don't match, the document has been edited in-between and a `412 Precondition Failed` error is thrown.
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [Conditional requests](/en-US/docs/Web/HTTP/Guides/Conditional_requests)
   * - [304](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/304)
   * - [If-Unmodified-Since](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Unmodified-Since), [If-Match](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Match)
   * - [428](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/428)
   */
  PRECONDITION_FAILED = 412,

  /**
   * The HTTP **`413 Content Too Large`** [client error response](/en-US/docs/Web/HTTP/Reference/Status#client_error_responses) status code indicates that the request entity was larger than limits defined by server.
   * The server might close the connection or return a [Retry-After](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After) header field.
   *
   * Prior to [9110](https://developer.mozilla.org/en-US/docs/rfc/9110) the response phrase for the status was **`Payload Too Large`**.
   * This message is still widely used.
   *
   * ## Status
   *
   * ```http
   * 413 Content Too Large
   * ```
   *
   * ## Examples
   *
   * ### File upload limit exceeded
   *
   * The following example shows what the client may send when an [`<input type="file">`](/en-US/docs/Web/HTML/Reference/Elements/input/file) element includes an image on form submission with `method="post"`:
   *
   * ```http
   * POST /upload HTTP/1.1
   * Host: example.com
   * Content-Type: multipart/form-data; boundary=----Boundary1234
   * Content-Length: 4012345
   *
   * ------Boundary1234
   * Content-Disposition: form-data; name="file"; filename="myImage.jpg"
   * Content-Type: image/jpeg
   *
   * \xFF\xD8\xFF\xE0\x00...(binary data)
   * ------Boundary1234--
   * ```
   *
   * The server may reject the upload if there is a restriction on the maximum size of files it will process, and the response body includes a `message` with some context:
   *
   * ```http
   * HTTP/1.1 413 Content Too Large
   * Content-Type: application/json
   * Content-Length: 97
   *
   * {
   *   "error": "Upload failed",
   *   "message": "Maximum allowed upload size is 4MB",
   * }
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [Connection](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Connection)
   * - [Retry-After](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After)
   */
  CONTENT_TOO_LARGE = 413,

  /**
   * The HTTP **`414 URI Too Long`** [client error response](/en-US/docs/Web/HTTP/Reference/Status#client_error_responses) status code indicates that a URI requested by the client was longer than the server is willing to interpret.
   *
   * There are a few rare conditions when this error might occur:
   *
   * - a client has improperly converted a [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/POST) request to a [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) request with long query information,
   * - a client has descended into a loop of redirection (for example, a redirected URI prefix that points to a suffix of itself), or
   * - the server is under attack by a client attempting to exploit potential security holes.
   *
   * Some systems implement `414 URI Too Long` as `414 Request-URI Too Large`.
   *
   * ## Status
   *
   * ```http
   * 414 URI Too Long
   * ```
   *
   * ## Examples
   *
   * ### Form submission using GET
   *
   * In the following example, an HTML [`
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [URI](https://developer.mozilla.org/en-US/docs/Glossary/URI)
   */
  URI_TOO_LONG = 414,

  /**
   * The HTTP **`415 Unsupported Media Type`** [client error response](/en-US/docs/Web/HTTP/Reference/Status#client_error_responses) status code indicates that the server refused to accept the request because the message [content](https://developer.mozilla.org/en-US/docs/Glossary/HTTP_Content) format is not supported.
   *
   * The format problem might be due to the request's indicated [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) or [Content-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding), or as a result of processing the request message content.
   * Some servers may be strict about the expected `Content-Type` of requests.
   * For example, sending `UTF8` instead of `UTF-8` to specify the [UTF-8](https://developer.mozilla.org/en-US/docs/glossary/UTF-8) charset may cause the server to consider the media type invalid.
   *
   * ## Status
   *
   * ```http
   * 415 Unsupported Media Type
   * ```
   *
   * ## Examples
   *
   * ### Missing content type
   *
   * In the following example, the [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) header is missing entirely:
   *
   * ```http
   * POST /comments HTTP/1.1
   * Host: example.com
   * Content-Length: 23
   *
   * {
   *   "user": "belgin",
   *   "comment": "LGTM!"
   * }
   * ```
   *
   * If the server implementation expects at least a MIME type `Content-Type: application/json;` for the request at that endpoint, it may send the following response:
   *
   * ```http
   * HTTP/1.1 415 Unsupported Media Type
   * Date: Fri, 28 Jun 2024 12:00:00 GMT
   * Server: Apache/2.4.41 (Ubuntu)
   * Accept-Post: application/json; charset=UTF-8
   * Content-Length: 0
   * ```
   *
   * ### Invalid content type
   *
   * In the following example, the [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) header is incorrectly set to URL-encoded form data when the [content](https://developer.mozilla.org/en-US/docs/Glossary/HTTP_Content) is in the request body instead:
   *
   * ```http
   * POST /comments HTTP/1.1
   * Host: example.com
   * Content-Length: 23
   * Content-Type: application/x-www-form-urlencoded
   *
   * {
   *   "user": "belgin",
   *   "comment": "LGTM!"
   * }
   * ```
   *
   * In this case, the server responds with a 415, with the required content type for the request in the [Accept-Post](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Post) header:
   *
   * ```http
   * HTTP/1.1 415 Unsupported Media Type
   * Date: Fri, 28 Jun 2024 12:00:00 GMT
   * Server: Apache/2.4.41 (Ubuntu)
   * Accept-Post: application/json; charset=UTF-8
   * Content-Length: 0
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type)
   * - [Content-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding)
   * - [Accept-Post](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Post)
   */
  UNSUPPORTED_MEDIA_TYPE = 415,

  /**
   * The HTTP **`416 Range Not Satisfiable`** [client error response](/en-US/docs/Web/HTTP/Reference/Status#client_error_responses) status code indicates that a server could not serve the requested ranges.
   * The most likely reason for this response is that the document doesn't contain such [ranges](/en-US/docs/Web/HTTP/Guides/Range_requests), or that the [Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Range) header value, though syntactically correct, doesn't make sense.
   *
   * The `416` response message should contain a [Content-Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Range) indicating an unsatisfied range (that is a `'*'`) followed by a `'/'` and the current length of the resource, e.g., `Content-Range: bytes * /12777`
   *
   * When encountering this error, browsers typically either abort the operation (for example, a download will be considered non-resumable) or request the whole document again without ranges.
   *
   * ## Status
   *
   * ```http
   * 416 Range Not Satisfiable
   * ```
   *
   * ## Examples
   *
   * ### Malformed range request
   *
   * The following request asks for a range of 1000-1999 bytes from a text file.
   * The first position unit (1000) is larger than the actual resource on the server (800 bytes):
   *
   * ```http
   * GET /files/prose.txt HTTP/1.1
   * Host: example.com
   * Range: bytes=1000-1999
   * ```
   *
   * The server supports range requests and sends back the current length of the selected representation in the [Content-Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Range) header:
   *
   * ```http
   * HTTP/1.1 416 Range Not Satisfiable
   * Date: Fri, 28 Jun 2024 11:40:58 GMT
   * Content-Range: bytes * /800
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [206 Partial Content](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/206)
   * - [HTTP range requests](/en-US/docs/Web/HTTP/Guides/Range_requests)
   * - [Content-Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Range)
   * - [Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Range)
   */
  RANGE_NOT_SATISFIABLE = 416,

  /**
   * The HTTP **`417 Expectation Failed`** [client error response](/en-US/docs/Web/HTTP/Reference/Status#client_error_responses) status code indicates that the expectation given in the request's [Expect](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Expect) header could not be met.
   * After receiving a 417 response, a client should repeat the request without an `Expect` request header, including the file in the request body without waiting for a [100](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/100) response.
   * See the [Expect](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Expect) header documentation for more details.
   *
   * ## Status
   *
   * ```http
   * 417 Expectation Failed
   * ```
   *
   * ## Examples
   *
   * ### Expectations unsupported
   *
   * The following PUT request sends information about an intended file upload to a server.
   * The client uses an `Expect: 100-continue` header and no request body to avoid sending data over the network that may result in an error such as [405](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405), [401](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401), or [403](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403) response:
   *
   * ```http
   * PUT /videos HTTP/1.1
   * Host: uploads.example.com
   * Content-Type: video/h264
   * Content-Length: 1234567890987
   * Expect: 100-continue
   * ```
   *
   * In this example server implementation, expectations are not supported and the presence of an `Expect` header with any value results in 417 responses:
   *
   * ```http
   * HTTP/1.1 417 Expectation Failed
   * Date: Fri, 28 Jun 2024 11:40:58 GMT
   * ```
   *
   * The client responds by making a request without expectations and with the [content](https://developer.mozilla.org/en-US/docs/Glossary/HTTP_Content) in the request body:
   *
   * ```http
   * PUT /videos HTTP/1.1
   * Host: uploads.example.com
   * Content-Type: video/h264
   * Content-Length: 1234567890987
   *
   * […]
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [100 Continue](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/100)
   * - [Expect](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Expect)
   */
  EXPECTATION_FAILED = 417,

  /**
   * The HTTP **`418 I'm a teapot`** status response code indicates that the server refuses to brew coffee because it is, permanently, a teapot.
   * A combined coffee/tea pot that is temporarily out of coffee should instead return [503](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/503).
   * This error is a reference to Hyper Text Coffee Pot Control Protocol defined in April Fools' jokes in 1998 and 2014.
   *
   * Some websites use this response for requests they do not wish to handle, such as automated queries.
   *
   * ## Status
   *
   * ```http
   * 418 I'm a teapot
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [Wikipedia: Hyper Text Coffee Pot Control Protocol](https://en.wikipedia.org/wiki/Hyper_Text_Coffee_Pot_Control_Protocol)
   */
  I_M_A_TEAPOT = 418,

  /**
   * The HTTP **`421 Misdirected Request`** [client error response](/en-US/docs/Web/HTTP/Reference/Status#client_error_responses) status code indicates that the request was directed to a server that is not able to produce a response.
   * This can be sent by a server that is not configured to produce responses for the combination of [scheme](/en-US/docs/Web/URI/Reference/Schemes) and [authority](/en-US/docs/Web/URI/Reference/Authority) that are included in the request URI.
   *
   * Clients may retry the request over a different connection.
   *
   * ## Status
   *
   * ```http
   * 421 Misdirected Request
   * ```
   *
   * ## Examples
   *
   * ### Apache SNI error
   *
   * Given the following request:
   *
   * ```http
   * GET / HTTP/1.1
   * Host: abc.example.com
   * ```
   *
   * In cases such as a wildcard certificate (`*.example.com`) and a connection is reused for multiple domains (`abc.example.com`, `def.example.com`), the server may respond with a 421:
   *
   * ```http
   * HTTP/1.1 421 Misdirected Request
   * Date: Wed, 26 Jun 2024 12:00:00 GMT
   * Server: Apache/2.4.1 (Unix)
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [Multiple hosts and misdirected requests](https://httpd.apache.org/docs/2.4/mod/mod_http2.html#misdirected) Apache Server documentation
   * - [TLS 1.3](/en-US/docs/Web/Security/Transport_Layer_Security#tls_1.3)
   * - [Server Name Indication (SNI)](https://en.wikipedia.org/wiki/Server_Name_Indication)
   * - [Transport Layer Security (TLS) configuration](/en-US/docs/Web/Security/Practical_implementation_guides/TLS)
   */
  MISDIRECTED_REQUEST = 421,

  /**
   * The HTTP **`422 Unprocessable Content`** [client error response](/en-US/docs/Web/HTTP/Reference/Status#client_error_responses) status code indicates that the server understood the content type of the request content, and the syntax of the request content was correct, but it was unable to process the contained instructions.
   *
   * Clients that receive a `422` response should expect that repeating the request without modification will fail with the same error.
   *
   * ## Status
   *
   * ```http
   * 422 Unprocessable Content
   * ```
   *
   * ## Examples
   *
   * ### SHA validation failure
   *
   * The following example makes a request to update file contents ([based on GitHub's API](https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#create-or-update-file-contents)).
   * The `content` field is [Base64](https://developer.mozilla.org/en-US/docs/glossary/Base64) encoded and uses `\n` line feeds every 60 characters, with one terminating the string:
   *
   * ```http
   * PUT /repos/mdn/content/contents/README.md HTTP/1.1
   * Host: api.example.com
   * Accept: application/vnd.github+json
   * Authorization: Bearer abcd123
   * Content-Type: application/json
   * Content-Length: 165
   *
   * {
   *   "message": "My commit",
   *   "content": "WW9zaGkgd2FzIHRoZXJlLCBzbyB3ZXJlIEF5c2UsIGFuZCBCZWxnaW4uIEl0\nIHdhcyBncmVhdCE=\n",
   *   "sha": "80e73970fdee49dbdbac27c1f565d1eb1975d519"
   * }
   * ```
   *
   * In this implementation, the server expects strictly [4648](https://developer.mozilla.org/en-US/docs/rfc/4648)-compliant Base64 encoded content (using [strict encoding methods](https://ruby-doc.org/3.3.2/stdlibs/base64/Base64.html#method-i-strict_encode64)).
   * A `422` Unprocessable Content response is returned and the `message` field provides context about the validation error:
   *
   * ```http
   * HTTP/1.1 422 Unprocessable Content
   * Date: Fri, 28 Jun 2024 12:00:00 GMT
   * Content-Type: application/json; charset=utf-8
   * Content-Length: 187
   *
   * {
   *   "message": "content is not valid Base64",
   *   "documentation_url": "https://docs.example.com/en/rest/repos/contents"
   * }
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   */
  UNPROCESSABLE_CONTENT = 422,

  /**
   * The HTTP **`423 Locked`** [client error response](/en-US/docs/Web/HTTP/Reference/Status#client_error_responses) status code indicates that a resource is _locked_, meaning it can't be accessed.
   * Its response body should contain information in [WebDAV](https://developer.mozilla.org/en-US/docs/glossary/WebDAV)'s XML format.
   *
   * > [!NOTE]
   * > The ability to _lock_ a resource to prevent conflicts is specific to some [WebDAV](https://developer.mozilla.org/en-US/docs/Glossary/WebDAV) servers.
   * > Browsers accessing web pages will never encounter this status code; in the erroneous cases it happens, they will handle it as a generic  status code.
   *
   * ## Status
   *
   * ```http
   * 423 Locked
   * ```
   *
   * ## Examples
   *
   * ### WebDAV 423 Locked response
   *
   * ```http
   * HTTP/1.1 423 Locked
   * Content-Type: application/xml; charset="utf-8"
   * Content-Length: xxxx
   *
   *
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   */
  LOCKED = 423,

  /**
   * The HTTP **`424 Failed Dependency`** [client error response](/en-US/docs/Web/HTTP/Reference/Status#client_error_responses) status code indicates that the method could not be performed on the resource because the requested action depended on another action, and that action failed.
   *
   * Regular web servers typically do not return this status code, but some protocols like [WebDAV](https://developer.mozilla.org/en-US/docs/Glossary/WebDAV) can return it.
   * For example, in [WebDAV](https://developer.mozilla.org/en-US/docs/Glossary/WebDAV), if a `PROPPATCH` request was issued, and one command fails then automatically every other command will also fail with `424 Failed Dependency`.
   *
   * ## Status
   *
   * ```http
   * 424 Failed Dependency
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [403](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403) (Forbidden)
   * - [501 Not Implemented](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/501), [510 Not Extended](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/510)
   */
  FAILED_DEPENDENCY = 424,

  /**
   * The HTTP **`425 Too Early`** [client error response](/en-US/docs/Web/HTTP/Reference/Status#client_error_responses) status code indicates that the server was unwilling to risk processing a request that might be replayed to avoid potential replay attacks.
   *
   * If a client has interacted with a server recently, early data (also known as zero round-trip time [(0-RTT) data](/en-US/docs/Web/Security/Transport_Layer_Security#tls_1.3)) allows the client to send data to a server in the first round trip of a connection, without waiting for the TLS [handshake](/en-US/docs/Glossary/TCP_handshake) to complete.
   * A client that sends a request in early data does not need to include the `Early-Data` header.
   * See [Early-Data](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Early-Data) for more information.
   *
   * ## Status
   *
   * ```http
   * 425 Too Early
   * ```
   *
   * ## Specifications
   *
   * ## Browser compatibility
   *
   * ## See also
   *
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [TLS 1.3](/en-US/docs/Web/Security/Transport_Layer_Security#tls_1.3)
   * - [Early-Data](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Early-Data)
   */
  TOO_EARLY = 425,

  /**
   * The HTTP **`426 Upgrade Required`** [client error response](/en-US/docs/Web/HTTP/Reference/Status#client_error_responses) status code indicates that the server refused to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol.
   *
   * The server sends an [Upgrade](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Upgrade) header with this response to indicate the required protocol(s).
   *
   * ## Status
   *
   * ```http
   * 426 Upgrade Required
   * ```
   *
   * ## Examples
   *
   * ### Upgrade required from HTTP/1.1
   *
   * Given a GET request to a system:
   *
   * ```http
   * GET /resources HTTP/1.1
   * Host: example.com
   * ```
   *
   * The origin server expects that requests must be made in [HTTP/3](/en-US/docs/Glossary/HTTP_3):
   *
   * ```http
   * HTTP/1.1 426 Upgrade Required
   * Upgrade: HTTP/3.0
   * Connection: Upgrade
   * Content-Length: 53
   * Content-Type: text/plain
   *
   * This service requires use of the HTTP/3.0 protocol.
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [Upgrade](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Upgrade)
   * - [101 Switching Protocols](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/101)
   */
  UPGRADE_REQUIRED = 426,

  /**
   * The HTTP **`428 Precondition Required`** [client error response](/en-US/docs/Web/HTTP/Reference/Status#client_error_responses) status code indicates that the server requires the request to be [conditional](/en-US/docs/Web/HTTP/Guides/Conditional_requests).
   *
   * Typically, a 428 response means that a required precondition header such as [If-Match](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Match) **is missing**.
   * When a precondition header does **not match** the server-side state, the response should be [412 Precondition Failed](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/412).
   *
   * ## Status
   *
   * ```http
   * 428 Precondition Required
   * ```
   *
   * ## Examples
   *
   * ### Missing precondition in request
   *
   * A client has fetched a resource `my-document` from the server, updated it locally, and then tries to send the updated document back to the server:
   *
   * ```http
   * PUT /docs/my-document HTTP/1.1
   * Host: example.com
   * Content-Type: application/json
   *
   * {
   *   […]
   * ```
   *
   * The server implementation requires that all [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/PUT) requests for the specific path or type of documents must be conditional and sends a 428 response:
   *
   * ```http
   * HTTP/1.1 428 Precondition Required
   * Date: Wed, 26 Jun 2024 12:00:00 GMT
   * Server: Apache/2.4.1 (Unix)
   * Content-Type: application/json
   *
   * {
   *   "code": "MissingPrecondition",
   *   "message": "Updating documents requires a precondition header.",
   * }
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [HTTP conditional requests](/en-US/docs/Web/HTTP/Guides/Conditional_requests)
   * - Conditional headers: [If-Match](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Match), [If-None-Match](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-None-Match), [If-Modified-Since](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Modified-Since), [If-Unmodified-Since](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Unmodified-Since), [If-Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Range)
   * -
   */
  PRECONDITION_REQUIRED = 428,

  /**
   * The HTTP **`429 Too Many Requests`** [client error response](/en-US/docs/Web/HTTP/Reference/Status#client_error_responses) status code indicates the client has sent too many requests in a given amount of time.
   * This mechanism of asking the client to slow down the rate of requests is commonly called "[rate limiting](https://developer.mozilla.org/en-US/docs/glossary/rate_limit)".
   *
   * A [Retry-After](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After) header may be included to this response to indicate how long a client should wait before making the request again.
   *
   * Implementations of rate limiting vary; restrictions may be server-wide or per resource.
   * Typically, rate-limiting restrictions are based on a client's IP but can be specific to users or authorized applications if requests are authenticated or contain a [cookie](https://developer.mozilla.org/en-US/docs/Glossary/cookie).
   *
   * ## Status
   *
   * ```http
   * 429 Too Many Requests
   * ```
   *
   * ## Examples
   *
   * ### Response containing Retry-After header
   *
   * The following request is being sent repeatedly in a loop by a client that is misconfigured:
   *
   * ```http
   * GET /reports/mdn HTTP/1.1
   * Host: example.com
   * ```
   *
   * In this example, server-wide rate limiting is active when a client exceeds a set threshold of requests per minute.
   * A 429 response is returned with a [Retry-After](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After) header that indicates that requests will be allowed for this client again in 60 minutes:
   *
   * ```http
   * HTTP/1.1 429 Too Many Requests
   * Content-Type: text/html
   * Retry-After: 3600
   *
   *
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [Retry-After](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After)
   * - Python solution: [How to avoid HTTP error 429 python](https://stackoverflow.com/questions/22786068/how-to-avoid-http-error-429-too-many-requests-python)
   */
  TOO_MANY_REQUESTS = 429,

  /**
   * The HTTP **`431 Request Header Fields Too Large`** [client error response](/en-US/docs/Web/HTTP/Reference/Status#client_error_responses) status code indicates that the server refuses to process the request because the request's [HTTP headers](/en-US/docs/Web/HTTP/Reference/Headers) are too long.
   * The request may be resubmitted after reducing the size of the request headers.
   *
   * 431 can be used when the total size of request headers is too large or when a single header field is too large.
   * To help clients running into this error, indicate which of the two is the problem in the response body and, ideally, say which headers are too large.
   * This lets people attempt to fix the problem, such as by clearing cookies.
   *
   * Servers will often produce this status if:
   *
   * - The [Referer](https://developer.mozilla.org/en-US/docs/httpheader/Referer) URL is too long
   * - There are too many [Cookies](/en-US/docs/Web/HTTP/Guides/Cookies) sent in the request
   *
   * ## Status
   *
   * ```http
   * 431 Request Header Fields Too Large
   * ```
   *
   * ## Examples
   *
   * ### Header field too large
   *
   * In the following example, the [Cookie](https://developer.mozilla.org/en-US/docs/httpheader/Cookie) header is too large in the request:
   *
   * ```http
   * GET /doc HTTP/1.1
   * Host: example.com
   * Cookie: cookie1=value1; cookie2=value2; cookie3=[…]
   * ```
   *
   * The server responds with an message indicating which header was problematic:
   *
   * ```http
   * HTTP/1.1 431 Request Header Fields Too Large
   * Content-Type: text/html
   *
   *
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [414 URI Too Long](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/414)
   * - [Request header](https://developer.mozilla.org/en-US/docs/Glossary/Request_header)
   */
  REQUEST_HEADER_FIELDS_TOO_LARGE = 431,

  /**
   * The HTTP **`451 Unavailable For Legal Reasons`** [client error response](/en-US/docs/Web/HTTP/Reference/Status#client_error_responses) status code indicates that the user requested a resource that is not available due to legal reasons, such as a web page for which a legal action has been issued.
   *
   * ## Status
   *
   * ```http
   * 451 Unavailable For Legal Reasons
   * ```
   *
   * ## Examples
   *
   * ### Response with Link header
   *
   * This example response is taken from the IETF RFC (see below) and contains a reference to [Monty Python's Life of Brian](https://en.wikipedia.org/wiki/Monty_Python's_Life_of_Brian).
   *
   * > [!NOTE]
   * > The [Link](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Link) header might also contain a `rel="blocked-by"` relation identifying the entity implementing the blockage, not any other entity mandating it.
   *
   * Any attempt to identify the entity ultimately responsible for the resource being unavailable belongs in the response body, not in the `rel="blocked-by"` link. This includes the name of the person or organization that made a legal demand resulting in the content's removal.
   *
   * ```http
   * HTTP/1.1 451 Unavailable For Legal Reasons
   * Link:
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [Wikipedia: HTTP 451](https://en.wikipedia.org/wiki/HTTP_451)
   * - [Wikipedia: Fahrenheit 451](https://en.wikipedia.org/wiki/Fahrenheit_451) (which gave this status code its number)
   */
  UNAVAILABLE_FOR_LEGAL_REASONS = 451,

  /**
   * The HTTP **`500 Internal Server Error`** [server error response](/en-US/docs/Web/HTTP/Reference/Status#server_error_responses) status code indicates that the server encountered an unexpected condition that prevented it from fulfilling the request.
   * This error is a generic "catch-all" response to server issues, indicating that the server cannot find a more appropriate [5XX error](/en-US/docs/Web/HTTP/Reference/Status#server_error_responses) to respond with.
   *
   * If you're a visitor seeing `500` errors on a web page, these issues require investigation by server owners or administrators.
   * There are many possible causes of `500` errors, including: improper server configuration, out-of-memory (OOM) issues, unhandled exceptions, improper file permissions, or other complex factors.
   * Server administrators may proactively log occurrences of server error responses, like the `500` status code, with details about the initiating requests to improve the stability of a service in the future.
   *
   * ## Status
   *
   * ```http
   * 500 Internal Server Error
   * ```
   *
   * ## Examples
   *
   * ### 500 server error response
   *
   * The following request tries to fetch a webpage, but receives a 500 response in return.
   * The response body contains a page describing the server state with a link to a support page for visitors.
   * An identifier is contained in the response body for illustration of a method that may help server administrators narrow down the root cause of the problem:
   *
   * ```http
   * GET /highlights HTTP/1.1
   * Host: example.com
   * User-Agent: curl/8.6.0
   * Accept: * /*
   * ```
   *
   * ```http
   * HTTP/1.1 500 Internal Server Error
   * Content-Type: text/html;
   * Content-Length: 123
   *
   *
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   */
  INTERNAL_SERVER_ERROR = 500,

  /**
   * The HTTP **`501 Not Implemented`** [server error response](/en-US/docs/Web/HTTP/Reference/Status#server_error_responses) status code means that the server does not support the functionality required to fulfill the request.
   *
   * A response with this status may also include a [Retry-After](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After) header, telling the client that they can retry the request after the specified time has elapsed.
   * A `501` response is cacheable by default unless caching headers instruct otherwise.
   *
   * `501` is the appropriate response when the server does not recognize the request method and is incapable of supporting it for any resource.
   * Servers are required to support [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) and [HEAD](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/HEAD), and therefore must not return `501` in response to requests with these methods.
   * If the server does recognize the method, but intentionally does not allow it, the appropriate response is [405 Method Not Allowed](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405).
   *
   * If you have visited a web page and you are seeing `501` errors, these issues require investigation and fixing by server owners or administrators.
   * You can clear your browser cache for the domain, disable proxies if you are using one, or try again later to see if it works as expected.
   *
   * A `501` response can occur if proxies cannot not handle request methods used in the context of HTTP Extension Framework ([2774](https://developer.mozilla.org/en-US/docs/RFC/2774)) applications.
   * This status can also occur in Web Distributed Authoring and Versioning ([WebDAV](https://developer.mozilla.org/en-US/docs/Glossary/WebDAV)) when a request method (`SEARCH`, `PROPFIND`) does not have a URL handler configured to process it.
   *
   * ## Status
   *
   * ```http
   * 501 Not Implemented
   * ```
   *
   * ## Examples
   *
   * ### Extension method not supported
   *
   * In the following HTTP Extension Framework example, a client sends a request with a mandatory extension specified in the `C-MAN` header.
   * The [Connection](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Connection) header specifies that these extensions are to be handled on a [hop-by-hop](/en-US/docs/Web/HTTP/Reference/Headers#hop-by-hop_headers) basis.
   * A proxy refuses to forward the `M-GET` method, and sends a `501` error in response:
   *
   * ```http
   * M-GET /document HTTP/1.1
   * Host: example.com
   * C-Man: "http://www.example.org/"
   * Connection: C-Man
   * ```
   *
   * ```http
   * HTTP/1.1 501 Not Implemented
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [510 Not Extended](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/510)
   * - [HTTP 501 errors](https://learn.microsoft.com/en-us/aspnet/web-api/overview/testing-and-debugging/troubleshooting-http-405-errors-after-publishing-web-api-applications) in Microsoft ASP.NET documentation
   */
  NOT_IMPLEMENTED = 501,

  /**
   * The HTTP **`502 Bad Gateway`** [server error response](/en-US/docs/Web/HTTP/Reference/Status#server_error_responses) status code indicates that a server was acting as a gateway or [proxy](https://developer.mozilla.org/en-US/docs/Glossary/Proxy_server) and that it received an invalid response from the upstream server.
   *
   * This response is similar to a [500 Internal Server Error](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500) response in the sense that it is a generic "catch-call" for server errors.
   * The difference is that it is specific to the point in the request chain that the error has occurred.
   * If the origin server sends a valid HTTP error response to the gateway, the response should be passed on to the client instead of a `502` to make the failure reason transparent.
   * If the proxy or gateway did not receive any HTTP response from the origin, it instead sends a [504 Gateway Timeout](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/504) to the client.
   *
   * There are many causes of `502` errors, and fixing such problems probably requires investigation by server owners or administrators.
   * Exceptions are client networking errors, particularly if the service works for other visitors, and if clients use VPNs or other custom networking setups.
   * In such cases, clients should check network settings, firewall setup, proxy settings, DNS configuration, etc.
   *
   * ## Status
   *
   * ```http
   * 502 Bad Gateway
   * ```
   *
   * ## Examples
   *
   * ### 502 gateway error response
   *
   * The following request tries to fetch a webpage, but receives a `502` response in return.
   * The response body contains a page describing the server state with a link to a support page for visitors.
   *
   * ```http
   * GET /highlights HTTP/1.1
   * Host: example.com
   * User-Agent: curl/8.6.0
   * Accept: * /*
   * ```
   *
   * ```http
   * HTTP/1.1 502 Bad Gateway
   * Content-Type: text/html;
   * Content-Length: 123
   *
   *
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [504 Gateway Timeout](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/504)
   */
  BAD_GATEWAY = 502,

  /**
   * The HTTP **`503 Service Unavailable`** [server error response](/en-US/docs/Web/HTTP/Reference/Status#server_error_responses) status code indicates that the server is not ready to handle the request.
   *
   * Common causes are that a server is down for maintenance or overloaded.
   * During maintenance, server administrators may temporarily route all traffic to a `503` page, or this may happen automatically during software updates.
   * In overload cases, some server-side applications will reject requests with a `503` status when resource thresholds like memory, CPU, or connection pool limits are met.
   * Dropping incoming requests creates backpressure that prevents the server's compute resources from being exhausted, avoiding more severe failures.
   * If requests from specific clients are being restricted due to [rate limiting](https://developer.mozilla.org/en-US/docs/Glossary/Rate_limit), the appropriate response is [429 Too Many Requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429).
   *
   * This response should be used for temporary conditions and the [Retry-After](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After) HTTP header should contain the estimated time for the recovery of the service, if possible.
   *
   * A user-friendly page explaining the problem should be sent along with this response.
   *
   * > [!NOTE]
   * > Caching-related headers sent with this response require special attention; a `503` indicates a temporary issue and responses shouldn't usually be cached as clients may receive outdated error pages after a fix has been deployed.
   *
   * ## Status
   *
   * ```http
   * 503 Service Unavailable
   * ```
   *
   * ## Examples
   *
   * ### 503 server error response
   *
   * The following request tries to fetch a webpage, but receives a `503` response.
   * The response body contains a page describing the server state with a link to a support page for visitors.
   * An identifier is contained in the response body for illustration of a method that may help server administrators narrow down the root cause of the problem:
   *
   * ```http
   * GET /highlights HTTP/1.1
   * Host: example.com
   * User-Agent: curl/8.6.0
   * Accept: * /*
   * ```
   *
   * ```http
   * HTTP/1.1 503 Service Unavailable
   * Content-Type: text/html;
   * Content-Length: 123
   *
   *
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [Retry-After](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After)
   */
  SERVICE_UNAVAILABLE = 503,

  /**
   * The HTTP **`504 Gateway Timeout`** [server error response](/en-US/docs/Web/HTTP/Reference/Status#server_error_responses) status code indicates that the server, while acting as a gateway or [proxy](https://developer.mozilla.org/en-US/docs/Glossary/Proxy_server), did not get a response in time from the upstream server in order to complete the request.
   * This is similar to a [502 Bad Gateway](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/502), except that in a `504` status, the proxy or gateway did not receive any HTTP response from the origin within a certain time.
   *
   * There are many causes of `504` errors, and fixing such problems likely requires investigation and debugging by server administrators, or the site may work again at a later time.
   * Exceptions are client networking errors, particularly if the service works for other visitors, and if clients use VPNs or other custom networking setups.
   * In such cases, clients should check network settings, firewall setup, proxy settings, DNS configuration, etc.
   *
   * ## Status
   *
   * ```http
   * 504 Gateway Timeout
   * ```
   *
   * ## Examples
   *
   * ### 504 gateway timeout response
   *
   * The following request tries to fetch a webpage, but receives a `504` response in return.
   * The response body contains a page describing the server state with a link to a support page for visitors.
   *
   * ```http
   * GET /highlights HTTP/1.1
   * Host: example.com
   * User-Agent: curl/8.6.0
   * Accept: * /*
   * ```
   *
   * ```http
   * HTTP/1.1 504 Gateway Timeout
   * Content-Type: text/html;
   * Content-Length: 123
   *
   *
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [502 Bad Gateway](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/502)
   */
  GATEWAY_TIMEOUT = 504,

  /**
   * The HTTP **`505 HTTP Version Not Supported`** [server error response](/en-US/docs/Web/HTTP/Reference/Status#server_error_responses) status code indicates that the HTTP version used in the request is not supported by the server.
   *
   * It's common to see this error when a request line is improperly formed such as `GET /path to resource HTTP/1.1` or with `\n` terminating the request line instead of `\r\n`.
   * For example, intermediaries such as load balancers may not handle request lines of a forwarded request as illustrated in the example below.
   *
   * ## Status
   *
   * ```http
   * 505 HTTP Version Not Supported
   * ```
   *
   * ## Examples
   *
   * ### A 505 due to malformed request-line
   *
   * In the following example, a client requests `example.com/dog%20trainers`, but due to incorrect load balancer configuration, the [percent encoding](https://developer.mozilla.org/en-US/docs/Glossary/Percent-encoding) in the URL is not handled properly.
   * In this case, the origin server sees `trainers` instead of the HTTP version, and a `505` response is returned instead.
   * A request identifier is contained in the response body for illustration of a way that may help server administrators narrow down the root cause of the problem:
   *
   * ```http
   * GET /dog trainers HTTP/1.1
   * Host: example.com
   * ```
   *
   * ```http
   * HTTP/1.1 505 HTTP Version Not Supported
   * Content-Type: text/html;
   * Content-Length: 123
   *
   *
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [Upgrade](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Upgrade) header
   */
  HTTP_VERSION_NOT_SUPPORTED = 505,

  /**
   * The HTTP **`506 Variant Also Negotiates`** [server error response](/en-US/docs/Web/HTTP/Reference/Status#server_error_responses) status code is returned during content negotiation when there is recursive loop in the process of selecting a resource.
   *
   * [Agent-driven content negotiation](/en-US/docs/Web/HTTP/Guides/Content_negotiation#agent-driven_negotiation) enables a client and server to collaboratively decide the best variant of a given resource when the server has multiple variants.
   * A server sends a `506` status code due to server misconfiguration that results in circular references when creating responses.
   *
   * Lack of standardization of how clients automatically choose from responses, and the additional round-trips that slow down client-server interaction mean this mechanism is rarely used.
   * [Server-driven content negotiation](/en-US/docs/Web/HTTP/Guides/Content_negotiation#server-driven_content_negotiation) is far more common, where a server directly chooses the most appropriate resource for the client based on the request headers ([Accept-Language](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language), [Accept](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept), etc.).
   *
   * ## Status
   *
   * ```http
   * 506 Variant Also Negotiates
   * ```
   *
   * ## Examples
   *
   * ### Resource with variants
   *
   * In the following example, a client requests a page in the `fr` locale using the [Accept-Language](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language) header.
   * This can be performed using curl:
   *
   * ```bash
   * curl  -H "Negotiate: trans" -H "Accept-Language: fr;" http://example.com/index
   * ```
   *
   * This produces the following request:
   *
   * ```http
   * GET /index HTTP/1.1
   * Host: example.com
   * User-Agent: curl/8.7.1
   * Accept: * /*
   * Negotiate: trans
   * Accept-Language: fr
   * ```
   *
   * Due to server misconfiguration, the variant response for `fr` points to a [type map](https://httpd.apache.org/docs/trunk/mod/mod_negotiation.html#typemaps) which itself causes transparent negotiation to be performed.
   * The server may detect this condition by the presence of a `TCN` header in a choice response before it is sent:
   *
   * ```http
   * HTTP/1.1 506 Variant Also Negotiates
   * Date: Mon, 22 Jul 2024 10:00:00 GMT
   * Server: Apache/2.4.41 (Unix)
   * Content-Type: text/html; charset=UTF-8
   * Content-Length: 233
   * TCN: list
   * Vary: negotiate,accept-language
   * Alternates: {"index.html.en" 1 {type text/html} {language en} {length 48}}, {"another-map.html.fr.map" 1 {type text/html} {language fr} {length 45}}}}
   *
   *
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [300 Multiple Choices](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/300)
   * - [2295](https://developer.mozilla.org/en-US/docs/RFC/2295)
   * - [Content negotiation](/en-US/docs/Web/HTTP/Guides/Content_negotiation)
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [Content Negotiation](https://httpd.apache.org/docs/2.4/content-negotiation.html) in Apache HTTP Server documentation
   * - [Apache httpd `mod_negotiation.c` source](https://github.com/apache/httpd/blob/6a2433cb3fbc30c8a55f450a046e4b0f69e73143/modules/mappers/mod_negotiation.c#L2687-L2691) showing conditions that trigger `HTTP_VARIANT_ALSO_VARIES` response.
   */
  VARIANT_ALSO_NEGOTIATES = 506,

  /**
   * The HTTP **`507 Insufficient Storage`** [server error response](/en-US/docs/Web/HTTP/Reference/Status#server_error_responses) status code indicates that an action could not be performed because the server does not have enough available storage to successfully complete the request.
   *
   * This status code was first used in the context of Web Distributed Authoring and Versioning ([WebDAV](https://developer.mozilla.org/en-US/docs/Glossary/WebDAV)), but has propagated into other use cases to describe situations where server resources are exhausted.
   * Common causes of this error can be from server directories running out of available space, not enough available RAM for an operation, or internal limits reached (such as application-specific memory limits, for example).
   * The request causing this error does not necessarily need to include content, as it may be a request that would create a resource on the server if it was successful.
   *
   * This issue is considered temporary, as opposed to a [413 Content Too Large](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/413), which indicates that the client request is too large for the server to process regardless of server resource constraints.
   *
   * ## Status
   *
   * ```http
   * 507 Insufficient Storage
   * ```
   *
   * ## Examples
   *
   * ### 507 response indicating storage issues
   *
   * The following request attempts to upload a file to a server which has insufficient storage available.
   * The server responds with a `507` to indicate that its resources are exhausted:
   *
   * ```http
   * POST /upload HTTP/1.1
   * Host: example.com
   * Content-Type: image/jpeg
   * Content-Length: 123456
   *
   * [JPG file data]
   * ```
   *
   * ```http
   * HTTP/1.1 507 Insufficient Storage
   * Date: Mon, 22 Jul 2024 10:00:00 GMT
   * Server: Apache/2.4.41 (Unix)
   * Content-Type: text/html; charset=UTF-8
   * Content-Length: 230
   *
   *
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [413 Content Too Large](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/413)
   */
  INSUFFICIENT_STORAGE = 507,

  /**
   * The HTTP **`508 Loop Detected`** [server error response](/en-US/docs/Web/HTTP/Reference/Status#server_error_responses) status code indicates that the entire operation failed because it encountered an infinite loop while processing a request with `Depth: infinity`.
   *
   * The status may be given in the context of the Web Distributed Authoring and Versioning ([WebDAV](https://developer.mozilla.org/en-US/docs/Glossary/WebDAV)).
   * It was introduced as a fallback for cases where WebDAV clients do not support [208 Already Reported](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/208) responses (when requests do not explicitly include a `DAV` header).
   *
   * ## Status
   *
   * ```http
   * 508 Loop Detected
   * ```
   *
   * ## Examples
   *
   * ### Infinite loop in WebDAV search
   *
   * ```http
   * PROPFIND /Coll/ HTTP/1.1
   * Host: example.com
   * Depth: infinity
   * Content-Type: application/xml; charset="utf-8"
   * Content-Length: 125
   *
   *
   * ```
   *
   * ```http
   * HTTP/1.1 508 Loop Detected
   * Content-Type: application/json; charset=utf-8
   * Server: Microsoft-IIS/8.0
   * Date: Wed, 15 May 2013 02:38:57 GMT
   * Content-Length: 72
   *
   * {
   *   "Message": "Please check the resources for cyclic references and try again."
   * }
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [208 Already Reported](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/208)
   */
  LOOP_DETECTED = 508,

  /**
   * The HTTP **`510 Not Extended`** [server error response](/en-US/docs/Web/HTTP/Reference/Status#server_error_responses) status code is sent when the client request declares an HTTP Extension ([2774](https://developer.mozilla.org/en-US/docs/RFC/2774)) that should be used to process the request, but the extension is not supported.
   *
   * ## Status
   *
   * ```http
   * 510 Not Extended
   * ```
   *
   * ## Examples
   *
   * ### Extension not supported
   *
   * In the following example, a client sends a request with a mandatory extension specified in the `C-MAN` header.
   * The [Connection](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Connection) header specifies that these extensions are to be handled on a [hop-by-hop](/en-US/docs/Web/HTTP/Reference/Headers#hop-by-hop_headers) basis.
   * A [proxy](https://developer.mozilla.org/en-US/docs/Glossary/Proxy_server) forwards the extended request, but the [Connection](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Connection) header is stripped out in transit.
   * Because the origin server doesn't receive any information about the `M-GET` method, it sends a `510` in response:
   *
   * ```http
   * M-GET /document HTTP/1.1
   * Host: example.com
   * C-Man: "http://www.example.org/"
   * Connection: C-Man
   * ```
   *
   * ```http
   * HTTP/1.1 510 Not Extended
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   */
  NOT_EXTENDED = 510,

  /**
   * The HTTP **`511 Network Authentication Required`** [server error response](/en-US/docs/Web/HTTP/Reference/Status#server_error_responses) status code indicates that the client needs to authenticate to gain network access.
   * This status is not generated by origin servers, but by intercepting [proxies](https://developer.mozilla.org/en-US/docs/Glossary/Proxy_server) that control access to a network.
   *
   * Network operators sometimes require some authentication, acceptance of terms, or other user interaction before granting access (for example in an internet café or at an airport).
   * They often identify clients who have not done so using their Media Access Control (MAC) addresses.
   *
   * ## Status
   *
   * ```http
   * 511 Network Authentication Required
   * ```
   *
   * ## Examples
   *
   * ### 511 response for a GET request
   *
   * In the following example, a client tries to access a resource on a network.
   * The request is not authenticated, and a proxy sends a `511` status code to prompt the visitor to log in.
   * The `511` ensures that non-browser clients will not interpret the response as being from the origin server.
   * Browsers are redirected automatically via the [meta](https://developer.mozilla.org/en-US/docs/HTMLelement/meta) tag after 10 seconds, or by clicking the link in the response body:
   *
   * ```http
   * GET /document HTTP/1.1
   * Host: example.com
   * ```
   *
   * ```http
   * HTTP/1.1 511 Network Authentication Required
   * Content-Type: text/html
   *
   *
   * ```
   *
   * ## Specifications
   *
   * ## See also
   *
   * - [HTTP response status codes](/en-US/docs/Web/HTTP/Reference/Status)
   * - [Proxy server](https://developer.mozilla.org/en-US/docs/Glossary/Proxy_server)
   */
  NETWORK_AUTHENTICATION_REQUIRED = 511,
}
