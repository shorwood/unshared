export enum HttpStatusCode {

  /**
   * The HTTP **`100 Continue`** [informational response](/en-US/docs/Web/HTTP/Status#informational_responses) status code indicates that the initial part of a request has been received and has not yet been rejected by the server.
   * The client should continue with a request or discard the 100 response if the request is already finished.
   *
   * When a request has an [Expect: 100-continue](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Expect) header, the 100 Continue response indicates that the server is ready or capable of receiving the request content.
   * Waiting for a 100 Continue response can be helpful if a client anticipates that an error is likely, for example, when sending state-changing operations without previously verified authentication credentials.
   */
  CONTINUE = 100,

  /**
   * The HTTP **`101 Switching Protocols`** [informational response](/en-US/docs/Web/HTTP/Status#informational_responses) status code indicates the protocol that a server has switched to.
   * The protocol is specified in the [Upgrade](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Upgrade) request header received from a client.
   *
   * The server includes an [Upgrade](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Upgrade) header in this response to indicate the protocol it has agreed to switch to.
   * The process is described in detail in the [Protocol upgrade mechanism](/en-US/docs/Web/HTTP/Protocol_upgrade_mechanism) guide.
   */
  SWITCHING_PROTOCOLS = 101,

  /**
   * The HTTP **`102 Processing`** [informational response](/en-US/docs/Web/HTTP/Status#informational_responses) status code indicates to client that a full request has been received and the server is working on it.
   * This status code is only sent if the server expects the request to take significant time.
   *
   * > [!NOTE]
   * > Regular web servers do not return this response.
   * > This status code was first introduced in Web Distributed Authoring and Versioning ([WebDAV](https://developer.mozilla.org/en-US/docs/Glossary/WebDAV)) [2518](https://developer.mozilla.org/en-US/docs/RFC/2518), but it was removed from WebDAV in [4918](https://developer.mozilla.org/en-US/docs/RFC/4918).
   */
  PROCESSING = 102,

  /**
   * The HTTP **`103 Early Hints`** [informational response](/en-US/docs/Web/HTTP/Status#informational_responses) may be sent by a server while it is still preparing a response, with hints about the sites and resources that the server expects the final response will link to.
   * This allows a browser to [preconnect](/en-US/docs/Web/HTML/Attributes/rel/preconnect) to sites or start [preloading](/en-US/docs/Web/HTML/Attributes/rel/preload) resources even before the server has prepared and sent a final response.
   * Preloaded resources indicated by early hints are fetched by the client as soon as the hints are received.
   *
   * The early hint response is primarily intended for use with the [Link](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Link) header, which indicates the resources to be loaded.
   * It may also contain a [`Content-Security-Policy`](/en-US/docs/Web/HTTP/CSP) header that is enforced while processing the early hint.
   *
   * A server might send multiple `103` responses, for example, following a redirect.
   * Browsers only process the first early hints response, and this response must be discarded if the request results in a cross-origin redirect.
   *
   * > [!NOTE]
   * > For compatibility and security reasons, it is recommended to [only send HTTP `103 Early Hints` responses over HTTP/2 or later](https://www.rfc-editor.org/rfc/rfc8297#section-3) unless the client is known to handle informational responses correctly.
   * >
   * > Most browsers limit support to HTTP/2 or later for this reason. See [browser compatibility](#browser_compatibility) below.
   * > Despite this, the examples below use HTTP/1.1-style notation as per usual convention.
   */
  EARLY_HINTS = 103,

  /**
   * The HTTP **`200 OK`** [successful response](/en-US/docs/Web/HTTP/Status#successful_responses) status code indicates that a request has succeeded.
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
   */
  OK = 200,

  /**
   * The HTTP **`201 Created`** [successful response](/en-US/docs/Web/HTTP/Status#successful_responses) status code indicates that the HTTP request has led to the creation of a resource.
   * This status code is commonly sent as the result of a [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/POST) request.
   *
   * The new resource, or a description and link to the new resource, is created before the response is returned.
   * The newly-created items are returned in the body of the message, located at either the **URL of the initial request** or the URL in the value of the [Location](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Location) header in the response.
   */
  CREATED = 201,

  /**
   * The HTTP **`202 Accepted`** [successful response](/en-US/docs/Web/HTTP/Status#successful_responses) status code indicates that a request has been accepted for processing, but processing has not been completed or may not have started.
   * The actual processing of the request is not guaranteed; a task or action may fail or be disallowed when a server tries to process it.
   *
   * A `202` response is non-committal, meaning there is no way to later send an asynchronous HTTP response to indicate the outcome of the processing.
   * This response code is typically used when the request is handled by another process or server, or when requests are processed in batches.
   */
  ACCEPTED = 202,

  /**
   * The HTTP **`203 Non-Authoritative Information`** [successful response](/en-US/docs/Web/HTTP/Status#successful_responses) status code indicates that the request was successful, but a _transforming [proxy](https://developer.mozilla.org/en-US/docs/Glossary/Proxy_server)_ has modified the headers or enclosed content from the origin server's [200](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200) (`OK`) response.
   *
   * The purpose of this status code is to allow transforming proxies to notify clients when changes have been applied to successful responses, since this may impact decisions regarding the content later.
   * Transformations to messages can mean modifications of headers to indicate that a resource is from a mirror or a backup, but may also mean modifying content in a way that are presumed to be desirable to the client.
   * These modifications might include malware filtering, format transcoding, privacy filtering, or other hints to the client about future requests.
   *
   * The `203` response is similar to the [`214`](/en-US/docs/Web/HTTP/Headers/Warning#warning_codes) `Transformation Applied` value of the deprecated [Warning](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Warning) header, which may be applicable to responses with any status code.
   */
  NON_AUTHORITATIVE_INFORMATION = 203,

  /**
   * The HTTP **`204 No Content`** [successful response](/en-US/docs/Web/HTTP/Status#successful_responses) status code indicates that a request has succeeded, but the client doesn't need to navigate away from its current page.
   * A `204` response is cacheable by default, and an [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) header is included in such cases.
   *
   * A `204 No Content` in response to these request methods has the following meaning and results:
   *
   * - [DELETE](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/DELETE): The action was successful, and no further information needs to be supplied.
   * - [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/PUT): The action was successful, and the [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) value contains the entity tag for the new representation of that target resource.
   *
   * A `204` response can be used when implementing "save and continue editing" functionality for applications like wiki sites.
   * In this case, a [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/PUT) request could be used to save the page contents, and a `204 No Content` response indicates to the browser that the editor should not be replaced by other content.
   */
  NO_CONTENT = 204,

  /**
   * The HTTP **`205 Reset Content`** [successful response](/en-US/docs/Web/HTTP/Status#successful_responses) status code indicates that the request has been successfully processed and the client should reset the document view.
   *
   * This response is intended to support use cases where the user receives content that supports data entry, submits user-edited data in a request, and the content needs to be reset for the next entry.
   * The instruction to "reset content" can mean clearing the contents of a form, resetting a canvas state, or refreshing a UI; the implementation depends on the client.
   *
   * > [!NOTE]
   * > In web applications that use the `205` status, it's assumed that the client handles resetting content after a `205` response.
   * > This is typically done via JavaScript, as resetting content such as forms after a `205` response is not handled natively by browsers.
   *
   * There must be no content in the response body, and this can be indicated using [Content-Length: 0](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Length) header or [Transfer-Encoding: chunked](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Transfer-Encoding) header with an empty chunk.
   */
  RESET_CONTENT = 205,

  /**
   * The HTTP **`206 Partial Content`** [successful response](/en-US/docs/Web/HTTP/Status#successful_responses) status code is sent in response to a [range request](/en-US/docs/Web/HTTP/Range_requests).
   * The response body contains the requested ranges of data as specified in the [Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Range) header of the request.
   *
   * The format of the response depends on the number of ranges requested.
   * If a single range is requested, the [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) of the entire response is set to the type of the document, and a [Content-Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Range) is provided.
   * If several ranges are requested, the [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) is set to `multipart/byteranges`, and each fragment covers one range, with its own [Content-Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Range) and [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) headers describing it.
   */
  PARTIAL_CONTENT = 206,

  /**
   * The HTTP **`207 Multi-Status`** [successful response](/en-US/docs/Web/HTTP/Status#successful_responses) status code indicates a mixture of responses.
   * This response is used exclusively in the context of Web Distributed Authoring and Versioning ([WebDAV](https://developer.mozilla.org/en-US/docs/Glossary/WebDAV)).
   *
   * The response body is a `text/xml` or `application/xml` HTTP entity with a `multistatus` root element that lists individual response codes.
   *
   * > [!NOTE]
   * > Browsers accessing web pages will never encounter this status code.
   * > The ability to return a _collection of resources_ is part of the [WebDAV](https://developer.mozilla.org/en-US/docs/Glossary/WebDAV) protocol and is only encountered by web applications that access a WebDAV server.
   */
  MULTI_STATUS = 207,

  /**
   * The HTTP **`208 Already Reported`** [successful response](/en-US/docs/Web/HTTP/Status#successful_responses) status code is used in a [207 Multi-Status](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/207) response to save space and avoid conflicts.
   * This response is used exclusively in the context of Web Distributed Authoring and Versioning ([WebDAV](https://developer.mozilla.org/en-US/docs/Glossary/WebDAV)).
   *
   * If the same resource is requested several times (for example, as part of a collection) with different paths, only the first one is reported with [200](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200).
   * Responses for all other bindings will report with this `208` status code, so no conflicts are created and the response stays shorter.
   *
   * > [!NOTE]
   * > The ability to _bind_ a resource to several paths is an extension to the [WebDAV](https://developer.mozilla.org/en-US/docs/Glossary/WebDAV) protocol (it may be received by web applications accessing a WebDAV server).
   * > Browsers accessing web pages will never encounter this status code.
   */
  ALREADY_REPORTED = 208,

  /**
   * The HTTP **`226 IM Used`** [successful response](/en-US/docs/Web/HTTP/Status#successful_responses) status code indicates that the server is returning a [delta](https://developer.mozilla.org/en-US/docs/Glossary/delta) in response to a [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) request.
   * It is used in the context of _HTTP delta encodings_.
   *
   * IM stands for _instance manipulation_, which refers to the algorithm generating a _delta_.
   * In delta encoding, a client sends a [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) request with two headers: `A-IM:`, which indicates a preference for a differencing algorithm, and [If-None-Match](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-None-Match), which specifies the version of a resource it has.
   * The server responds with deltas relative to a given base document, rather than the document in full.
   * This response uses the `226` status code, an `IM:` header that describes the differencing algorithm used, and may include a `Delta-Base:` header with the [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) matching the base document associated to the delta.
   *
   * > [!WARNING]
   * > Poor support for HTTP delta encodings means there are few implementations.
   * > Instead, most systems rely solely on [compression methods](/en-US/docs/Web/HTTP/Compression) to reduce bandwidth, although a combination of compression and delta encodings is possible.
   * >
   * > Even if the client and server support delta encodings, proxies or caches may not, and the complexity of adding HTTP delta encodings to a system may outweigh the benefits.
   */
  IM_USED = 226,

  /**
   * The HTTP **`300 Multiple Choices`** [redirection response](/en-US/docs/Web/HTTP/Status#redirection_messages) status code indicates that the request has more than one possible response.
   * The user-agent or the user should choose one of them.
   *
   * > [!NOTE]
   * > In [agent-driven content negotiation](/en-US/docs/Web/HTTP/Content_negotiation#agent-driven_negotiation), a client and server collaboratively decide the best variant of a given resource when the server has multiple variants.
   * > Most clients lack a method for automatically choosing from responses, and the additional round-trips slow down client-server interaction.
   * > [Server-driven content negotiation](/en-US/docs/Web/HTTP/Content_negotiation#server-driven_content_negotiation) is far more common, where a server chooses the most appropriate resource for the client based on the request headers ([Accept-Language](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language), [Accept](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept), etc.).
   *
   * The server should include content in the response that contains a list of resource metadata and URIs from which the user or user agent can choose.
   * The format of the content is implementation-specific, but should be easily parsed by the user agent (such as HTML or JSON).
   *
   * If the server has a preferred choice that the client should request, it can include it in a [Location](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Location) header.
   */
  MULTIPLE_CHOICES = 300,

  /**
   * The HTTP **`301 Moved Permanently`** [redirection response](/en-US/docs/Web/HTTP/Status#redirection_messages) status code indicates that the requested resource has been permanently moved to the URL in the [Location](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Location) header.
   *
   * A browser receiving this status will automatically request the resource at the URL in the `Location` header, redirecting the user to the new page.
   * Search engines receiving this response will attribute links to the original URL to the redirected resource, passing the [SEO](https://developer.mozilla.org/en-US/docs/Glossary/SEO) ranking to the new URL.
   *
   * > [!NOTE]
   * > In the [Fetch Standard](https://fetch.spec.whatwg.org/#http-redirect-fetch), when a user agent receives a `301` in response to a [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/POST) request, it uses the [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) method in the subsequent redirection request, as permitted by the HTTP [specification](#specifications).
   * > To avoid user agents modifying the request, use [308 Permanent Redirect](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/308) instead, as altering the method after a `308` response is prohibited.
   */
  MOVED_PERMANENTLY = 301,

  /**
   * The HTTP **`302 Found`** [redirection response](/en-US/docs/Web/HTTP/Status#redirection_messages) status code indicates that the requested resource has been temporarily moved to the URL in the [Location](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Location) header.
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
   */
  FOUND = 302,

  /**
   * The HTTP **`303 See Other`** [redirection response](/en-US/docs/Web/HTTP/Status#redirection_messages) status code indicates that the browser should redirect to the URL in the [Location](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Location) header instead of rendering the requested resource.
   *
   * This response code is often sent back as a result of [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/PUT) or [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/POST) methods so the client may retrieve a confirmation, or view a representation of a real-world object (see [HTTP range-14](https://en.wikipedia.org/wiki/HTTPRange-14)).
   * The method to retrieve the redirected resource is always [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET).
   */
  SEE_OTHER = 303,

  /**
   * The HTTP **`304 Not Modified`** [redirection response](/en-US/docs/Web/HTTP/Status#redirection_messages) status code indicates that there is no need to retransmit the requested resources.
   *
   * This response code is sent when the request is a [conditional](/en-US/docs/Web/HTTP/Conditional_requests) [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) or [HEAD](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/HEAD) request with an [If-None-Match](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-None-Match) or an [If-Modified-Since](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Modified-Since) header and the condition evaluates to 'false'.
   * It confirms that the resource cached by the client is still valid and that the server would have sent a [200 OK](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200) response with the resource if the condition evaluated to 'true'.
   * See [HTTP caching](/en-US/docs/Web/HTTP/Caching) for more information.
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
   */
  NOT_MODIFIED = 304,

  /**
   * The HTTP **`307 Temporary Redirect`** [redirection response](/en-US/docs/Web/HTTP/Status#redirection_messages) status code indicates that the resource requested has been temporarily moved to the URL in the [Location](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Location) header.
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
   */
  TEMPORARY_REDIRECT = 307,

  /**
   * The HTTP **`308 Permanent Redirect`** [redirection response](/en-US/docs/Web/HTTP/Status#redirection_messages) status code indicates that the requested resource has been permanently moved to the URL given by the [Location](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Location) header.
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
   * > See [Perform a resumable download](https://developers.google.com/drive/api/guides/manage-uploads) on the Google Drive documentation for more information.
   */
  PERMANENT_REDIRECT = 308,

  /**
   * The HTTP **`400 Bad Request`** [client error response](/en-US/docs/Web/HTTP/Status#client_error_responses) status code indicates that the server would not process the request due to something the server considered to be a client error.
   * The reason for a `400` response is typically due to malformed request syntax, invalid request message framing, or deceptive request routing.
   *
   * Clients that receive a `400` response should expect that repeating the request without modification will fail with the same error.
   */
  BAD_REQUEST = 400,

  /**
   * The HTTP **`401 Unauthorized`** [client error response](/en-US/docs/Web/HTTP/Status#client_error_responses) status code indicates that a request was not successful because it lacks valid authentication credentials for the requested resource.
   * This status code is sent with an HTTP [WWW-Authenticate](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/WWW-Authenticate) response header that contains information on the [authentication scheme](/en-US/docs/Web/HTTP/Authentication#authentication_schemes) the server expects the client to include to make the request successfully.
   *
   * A `401 Unauthorized` is similar to the [403 Forbidden](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403) response, except that a 403 is returned when a request contains valid credentials, but the client does not have permissions to perform a certain action.
   */
  UNAUTHORIZED = 401,

  /**
   * The HTTP **`402 Payment Required`** [client error response](/en-US/docs/Web/HTTP/Status#client_error_responses) status code is a **nonstandard** response status code reserved for future use.
   *
   * This status code was created to enable digital cash or (micro) payment systems and would indicate that requested content is not available until the client makes a payment.
   * No standard use convention exists and different systems use it in different contexts.
   */
  PAYMENT_REQUIRED = 402,

  /**
   * The HTTP **`403 Forbidden`** [client error response](/en-US/docs/Web/HTTP/Status#client_error_responses) status code indicates that the server understood the request but refused to process it.
   * This status is similar to [401](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401), except that for **`403 Forbidden`** responses, authenticating or re-authenticating makes no difference.
   * The request failure is tied to application logic, such as insufficient permissions to a resource or action.
   *
   * Clients that receive a `403` response should expect that repeating the request without modification will fail with the same error.
   * Server owners may decide to send a [404](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404) response instead of a 403 if acknowledging the existence of a resource to clients with insufficient privileges is not desired.
   */
  FORBIDDEN = 403,

  /**
   * The HTTP **`404 Not Found`** [client error response](/en-US/docs/Web/HTTP/Status#client_error_responses) status code indicates that the server cannot find the requested resource.
   * Links that lead to a 404 page are often called broken or dead links and can be subject to [link rot](https://en.wikipedia.org/wiki/Link_rot).
   *
   * A 404 status code only indicates that the resource is missing without indicating if this is temporary or permanent.
   * If a resource is permanently removed, servers should send the [410 Gone](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/410) status instead.
   *
   * 404 errors on a website can lead to a poor user experience for your visitors, so the number of broken links (internal and external) should be minimized to prevent frustration for readers.
   * Common causes of 404 responses are mistyped URLs or pages that are moved or deleted without redirection.
   * For more information, see the [Redirections in HTTP](/en-US/docs/Web/HTTP/Redirections) guide.
   */
  NOT_FOUND = 404,

  /**
   * The HTTP **`405 Method Not Allowed`** [client error response](/en-US/docs/Web/HTTP/Status#client_error_responses) status code indicates that the server knows the request method, but the target resource doesn't support this method.
   * The server **must** generate an [Allow](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Allow) header in a 405 response with a list of methods that the target resource currently supports.
   *
   * Improper server-side permissions set on files or directories may cause a 405 response when the request would otherwise be expected to succeed.
   */
  METHOD_NOT_ALLOWED = 405,

  /**
   * The HTTP **`406 Not Acceptable`** [client error response](/en-US/docs/Web/HTTP/Status#client_error_responses) status code indicates that the server could not produce a response matching the list of acceptable values defined in the request's [proactive content negotiation](/en-US/docs/Web/HTTP/Content_negotiation#server-driven_content_negotiation) headers and that the server was unwilling to supply a default representation.
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
   */
  NOT_ACCEPTABLE = 406,

  /**
   * The HTTP **`407 Proxy Authentication Required`** [client error response](/en-US/docs/Web/HTTP/Status#client_error_responses) status code indicates that the request did not succeed because it lacks valid authentication credentials for the [proxy server](https://developer.mozilla.org/en-US/docs/Glossary/proxy_server) that sits between the client and the server with access to the requested resource.
   *
   * This response is sent with a [Proxy-Authenticate](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Proxy-Authenticate) header that contains information on how to correctly authenticate requests.
   * The client may repeat the request with a new or replaced [Proxy-Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Proxy-Authorization) header field.
   */
  PROXY_AUTHENTICATION_REQUIRED = 407,

  /**
   * The HTTP **`408 Request Timeout`** [client error response](/en-US/docs/Web/HTTP/Status#client_error_responses) status code indicates that the server would like to shut down this unused connection.
   * A `408` is sent on an idle connection by some servers, _even without any previous request by the client_.
   *
   * A server should send the [Connection: close](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Connection) header field in the response, since `408` implies that the server has decided to close the connection rather than continue waiting.
   *
   * This response is used much more since some browsers, like Chrome and Firefox, use HTTP pre-connection mechanisms to speed up surfing.
   *
   * > [!NOTE]
   * > Some servers will shut down a connection without sending this message.
   */
  REQUEST_TIMEOUT = 408,

  /**
   * The HTTP **`409 Conflict`** [client error response](/en-US/docs/Web/HTTP/Status#client_error_responses) status code indicates a request conflict with the current state of the target resource.
   *
   * In [WebDAV](https://developer.mozilla.org/en-US/docs/glossary/WebDAV) remote web authoring, 409 conflict responses are errors sent to the client so that a user might be able to resolve a conflict and resubmit the request.
   * For example, conflicts occur if a request to create collection `/a/b/c/d/` is made, and `/a/b/c/` does not exist, the request must fail with a 409.
   * Additionally, you may get a 409 response when uploading a file that is older than the existing one on the server, resulting in a version control conflict.
   *
   * In other systems, 409 responses may be used for implementation-specific purposes, such as to indicate that the server has received multiple requests to update the same resource.
   */
  CONFLICT = 409,

  /**
   * The HTTP **`410 Gone`** [client error response](/en-US/docs/Web/HTTP/Status#client_error_responses) status code indicates that the target resource is no longer available at the origin server and that this condition is likely to be permanent.
   * A 410 response is cacheable by default.
   *
   * Clients should not repeat requests for resources that return a 410 response, and website owners should remove or replace links that return this code.
   * If server owners don't know whether this condition is temporary or permanent, a  status code should be used instead.
   */
  GONE = 410,

  /**
   * The HTTP **`411 Length Required`** [client error response](/en-US/docs/Web/HTTP/Status#client_error_responses) status code indicates that the server refused to accept the request without a defined [Content-Length](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Length) header.
   *
   * > [!NOTE]
   * > When sending data in a series of chunks, the `Content-Length` header is omitted, and at the beginning of each chunk, the length of the current chunk needs to be included in hexadecimal format.
   * > See [Transfer-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Transfer-Encoding) for more details.
   */
  LENGTH_REQUIRED = 411,

  /**
   * The HTTP **`412 Precondition Failed`** [client error response](/en-US/docs/Web/HTTP/Status#client_error_responses) status code indicates that access to the target resource was denied.
   * This happens with [conditional requests](/en-US/docs/Web/HTTP/Conditional_requests) on methods other than [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) or [HEAD](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/HEAD) when the condition defined by the [If-Unmodified-Since](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Unmodified-Since) or [If-Match](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Match) headers is not fulfilled.
   * In that case, the request (usually an upload or a modification of a resource) cannot be made and this error response is sent back.
   */
  PRECONDITION_FAILED = 412,

  /**
   * The HTTP **`413 Content Too Large`** [client error response](/en-US/docs/Web/HTTP/Status#client_error_responses) status code indicates that the request entity was larger than limits defined by server.
   * The server might close the connection or return a [Retry-After](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After) header field.
   *
   * Prior to [9110](https://developer.mozilla.org/en-US/docs/rfc/9110) the response phrase for the status was **`Payload Too Large`**.
   * This message is still widely used.
   */
  CONTENT_TOO_LARGE = 413,

  /**
   * The HTTP **`414 URI Too Long`** [client error response](/en-US/docs/Web/HTTP/Status#client_error_responses) status code indicates that a URI requested by the client was longer than the server is willing to interpret.
   *
   * There are a few rare conditions when this error might occur:
   *
   * - a client has improperly converted a [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/POST) request to a [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Method/GET) request with long query information,
   * - a client has descended into a loop of redirection (for example, a redirected URI prefix that points to a suffix of itself), or
   * - the server is under attack by a client attempting to exploit potential security holes.
   *
   * Some systems implement `414 URI Too Long` as `414 Request-URI Too Large`.
   */
  URI_TOO_LONG = 414,

  /**
   * The HTTP **`415 Unsupported Media Type`** [client error response](/en-US/docs/Web/HTTP/Status#client_error_responses) status code indicates that the server refused to accept the request because the message [content](https://developer.mozilla.org/en-US/docs/Glossary/HTTP_Content) format is not supported.
   *
   * The format problem might be due to the request's indicated [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) or [Content-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding), or as a result of processing the request message content.
   * Some servers may be strict about the expected `Content-Type` of requests.
   * For example, sending `UTF8` instead of `UTF-8` to specify the [UTF-8](https://developer.mozilla.org/en-US/docs/glossary/UTF-8) charset may cause the server to consider the media type invalid.
   */
  UNSUPPORTED_MEDIA_TYPE = 415,

  /**
   * The HTTP **`416 Range Not Satisfiable`** [client error response](/en-US/docs/Web/HTTP/Status#client_error_responses) status code indicates that a server could not serve the requested ranges.
   * The most likely reason for this response is that the document doesn't contain such [ranges](/en-US/docs/Web/HTTP/Range_requests), or that the [Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Range) header value, though syntactically correct, doesn't make sense.
   *
   * The `416` response message should contain a [Content-Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Range) indicating an unsatisfied range (that is a `'*'`) followed by a `'/'` and the current length of the resource, e.g., `Content-Range: bytes * /12777`
   *
   * When encountering this error, browsers typically either abort the operation (for example, a download will be considered non-resumable) or request the whole document again without ranges.
   */
  RANGE_NOT_SATISFIABLE = 416,

  /**
   * The HTTP **`417 Expectation Failed`** [client error response](/en-US/docs/Web/HTTP/Status#client_error_responses) status code indicates that the expectation given in the request's [Expect](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Expect) header could not be met.
   * After receiving a 417 response, a client should repeat the request without an `Expect` request header, including the file in the request body without waiting for a [100](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/100) response.
   * See the [Expect](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Expect) header documentation for more details.
   */
  EXPECTATION_FAILED = 417,

  /**
   * The HTTP **`418 I'm a teapot`** status response code indicates that the server refuses to brew coffee because it is, permanently, a teapot.
   * A combined coffee/tea pot that is temporarily out of coffee should instead return [503](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/503).
   * This error is a reference to Hyper Text Coffee Pot Control Protocol defined in April Fools' jokes in 1998 and 2014.
   *
   * Some websites use this response for requests they do not wish to handle, such as automated queries.
   */
  I_M_A_TEAPOT = 418,

  /**
   * The HTTP **`421 Misdirected Request`** [client error response](/en-US/docs/Web/HTTP/Status#client_error_responses) status code indicates that the request was directed to a server that is not able to produce a response.
   * This can be sent by a server that is not configured to produce responses for the combination of [scheme](/en-US/docs/Web/URI/Schemes) and [authority](/en-US/docs/Web/URI/Authority) that are included in the request URI.
   *
   * Clients may retry the request over a different connection.
   */
  MISDIRECTED_REQUEST = 421,

  /**
   * The HTTP **`422 Unprocessable Content`** [client error response](/en-US/docs/Web/HTTP/Status#client_error_responses) status code indicates that the server understood the content type of the request content, and the syntax of the request content was correct, but it was unable to process the contained instructions.
   *
   * Clients that receive a `422` response should expect that repeating the request without modification will fail with the same error.
   */
  UNPROCESSABLE_CONTENT = 422,

  /**
   * The HTTP **`423 Locked`** [client error response](/en-US/docs/Web/HTTP/Status#client_error_responses) status code indicates that a resource is _locked_, meaning it can't be accessed.
   * Its response body should contain information in [WebDAV](https://developer.mozilla.org/en-US/docs/glossary/WebDAV)'s XML format.
   *
   * > [!NOTE]
   * > The ability to _lock_ a resource to prevent conflicts is specific to some [WebDAV](https://developer.mozilla.org/en-US/docs/Glossary/WebDAV) servers.
   * > Browsers accessing web pages will never encounter this status code; in the erroneous cases it happens, they will handle it as a generic  status code.
   */
  LOCKED = 423,

  /**
   * The HTTP **`424 Failed Dependency`** [client error response](/en-US/docs/Web/HTTP/Status#client_error_responses) status code indicates that the method could not be performed on the resource because the requested action depended on another action, and that action failed.
   *
   * Regular web servers typically do not return this status code, but some protocols like [WebDAV](https://developer.mozilla.org/en-US/docs/Glossary/WebDAV) can return it.
   * For example, in [WebDAV](https://developer.mozilla.org/en-US/docs/Glossary/WebDAV), if a `PROPPATCH` request was issued, and one command fails then automatically every other command will also fail with `424 Failed Dependency`.
   */
  FAILED_DEPENDENCY = 424,

  /**
   * The HTTP **`425 Too Early`** [client error response](/en-US/docs/Web/HTTP/Status#client_error_responses) status code indicates that the server was unwilling to risk processing a request that might be replayed to avoid potential replay attacks.
   *
   * If a client has interacted with a server recently, early data (also known as zero round-trip time [(0-RTT) data](/en-US/docs/Web/Security/Transport_Layer_Security#tls_1.3)) allows the client to send data to a server in the first round trip of a connection, without waiting for the TLS [handshake](/en-US/docs/Glossary/TCP_handshake) to complete.
   * A client that sends a request in early data does not need to include the `Early-Data` header.
   * See [Early-Data](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Early-Data) for more information.
   */
  TOO_EARLY = 425,

  /**
   * The HTTP **`426 Upgrade Required`** [client error response](/en-US/docs/Web/HTTP/Status#client_error_responses) status code indicates that the server refused to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol.
   *
   * The server sends an [Upgrade](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Upgrade) header with this response to indicate the required protocol(s).
   */
  UPGRADE_REQUIRED = 426,

  /**
   * The HTTP **`428 Precondition Required`** [client error response](/en-US/docs/Web/HTTP/Status#client_error_responses) status code indicates that the server requires the request to be [conditional](/en-US/docs/Web/HTTP/Conditional_requests).
   *
   * Typically, a 428 response means that a required precondition header such as [If-Match](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Match) **is missing**.
   * When a precondition header does **not match** the server-side state, the response should be [412 Precondition Failed](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/412).
   */
  PRECONDITION_REQUIRED = 428,

  /**
   * The HTTP **`429 Too Many Requests`** [client error response](/en-US/docs/Web/HTTP/Status#client_error_responses) status code indicates the client has sent too many requests in a given amount of time.
   * This mechanism of asking the client to slow down the rate of requests is commonly called "[rate limiting](https://developer.mozilla.org/en-US/docs/glossary/rate_limit)".
   *
   * A [Retry-After](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After) header may be included to this response to indicate how long a client should wait before making the request again.
   *
   * Implementations of rate limiting vary; restrictions may be server-wide or per resource.
   * Typically, rate-limiting restrictions are based on a client's IP but can be specific to users or authorized applications if requests are authenticated or contain a [cookie](https://developer.mozilla.org/en-US/docs/Glossary/cookie).
   */
  TOO_MANY_REQUESTS = 429,

  /**
   * The HTTP **`431 Request Header Fields Too Large`** [client error response](/en-US/docs/Web/HTTP/Status#client_error_responses) status code indicates that the server refuses to process the request because the request's [HTTP headers](/en-US/docs/Web/HTTP/Headers) are too long.
   * The request may be resubmitted after reducing the size of the request headers.
   *
   * 431 can be used when the total size of request headers is too large or when a single header field is too large.
   * To help clients running into this error, indicate which of the two is the problem in the response body and, ideally, say which headers are too large.
   * This lets people attempt to fix the problem, such as by clearing cookies.
   *
   * Servers will often produce this status if:
   *
   * - The [Referer](https://developer.mozilla.org/en-US/docs/httpheader/Referer) URL is too long
   * - There are too many [Cookies](/en-US/docs/Web/HTTP/Cookies) sent in the request
   */
  REQUEST_HEADER_FIELDS_TOO_LARGE = 431,

  /**
   * The HTTP **`451 Unavailable For Legal Reasons`** [client error response](/en-US/docs/Web/HTTP/Status#client_error_responses) status code indicates that the user requested a resource that is not available due to legal reasons, such as a web page for which a legal action has been issued.
   */
  UNAVAILABLE_FOR_LEGAL_REASONS = 451,

  /**
   * The HTTP **`500 Internal Server Error`** [server error response](/en-US/docs/Web/HTTP/Status#server_error_responses) status code indicates that the server encountered an unexpected condition that prevented it from fulfilling the request.
   * This error is a generic "catch-all" response to server issues, indicating that the server cannot find a more appropriate [5XX error](/en-US/docs/Web/HTTP/Status#server_error_responses) to respond with.
   *
   * If you're a visitor seeing `500` errors on a web page, these issues require investigation by server owners or administrators.
   * There are many possible causes of `500` errors, including: improper server configuration, out-of-memory (OOM) issues, unhandled exceptions, improper file permissions, or other complex factors.
   * Server administrators may proactively log occurrences of server error responses, like the `500` status code, with details about the initiating requests to improve the stability of a service in the future.
   */
  INTERNAL_SERVER_ERROR = 500,

  /**
   * The HTTP **`501 Not Implemented`** [server error response](/en-US/docs/Web/HTTP/Status#server_error_responses) status code means that the server does not support the functionality required to fulfill the request.
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
   */
  NOT_IMPLEMENTED = 501,

  /**
   * The HTTP **`502 Bad Gateway`** [server error response](/en-US/docs/Web/HTTP/Status#server_error_responses) status code indicates that a server was acting as a gateway or [proxy](https://developer.mozilla.org/en-US/docs/Glossary/Proxy_server) and that it received an invalid response from the upstream server.
   *
   * This response is similar to a [500 Internal Server Error](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500) response in the sense that it is a generic "catch-call" for server errors.
   * The difference is that it is specific to the point in the request chain that the error has occurred.
   * If the origin server sends a valid HTTP error response to the gateway, the response should be passed on to the client instead of a `502` to make the failure reason transparent.
   * If the proxy or gateway did not receive any HTTP response from the origin, it instead sends a [504 Gateway Timeout](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/504) to the client.
   *
   * There are many causes of `502` errors, and fixing such problems probably requires investigation by server owners or administrators.
   * Exceptions are client networking errors, particularly if the service works for other visitors, and if clients use VPNs or other custom networking setups.
   * In such cases, clients should check network settings, firewall setup, proxy settings, DNS configuration, etc.
   */
  BAD_GATEWAY = 502,

  /**
   * The HTTP **`503 Service Unavailable`** [server error response](/en-US/docs/Web/HTTP/Status#server_error_responses) status code indicates that the server is not ready to handle the request.
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
   */
  SERVICE_UNAVAILABLE = 503,

  /**
   * The HTTP **`504 Gateway Timeout`** [server error response](/en-US/docs/Web/HTTP/Status#server_error_responses) status code indicates that the server, while acting as a gateway or [proxy](https://developer.mozilla.org/en-US/docs/Glossary/Proxy_server), did not get a response in time from the upstream server in order to complete the request.
   * This is similar to a [502 Bad Gateway](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/502), except that in a `504` status, the proxy or gateway did not receive any HTTP response from the origin within a certain time.
   *
   * There are many causes of `504` errors, and fixing such problems likely requires investigation and debugging by server administrators, or the site may work again at a later time.
   * Exceptions are client networking errors, particularly if the service works for other visitors, and if clients use VPNs or other custom networking setups.
   * In such cases, clients should check network settings, firewall setup, proxy settings, DNS configuration, etc.
   */
  GATEWAY_TIMEOUT = 504,

  /**
   * The HTTP **`505 HTTP Version Not Supported`** [server error response](/en-US/docs/Web/HTTP/Status#server_error_responses) status code indicates that the HTTP version used in the request is not supported by the server.
   *
   * It's common to see this error when a request line is improperly formed such as `GET /path to resource HTTP/1.1` or with `\n` terminating the request line instead of `\r\n`.
   * For example, intermediaries such as load balancers may not handle request lines of a forwarded request as illustrated in the example below.
   */
  HTTP_VERSION_NOT_SUPPORTED = 505,

  /**
   * The HTTP **`506 Variant Also Negotiates`** [server error response](/en-US/docs/Web/HTTP/Status#server_error_responses) status code is returned during content negotiation when there is recursive loop in the process of selecting a resource.
   *
   * [Agent-driven content negotiation](/en-US/docs/Web/HTTP/Content_negotiation#agent-driven_negotiation) enables a client and server to collaboratively decide the best variant of a given resource when the server has multiple variants.
   * A server sends a `506` status code due to server misconfiguration that results in circular references when creating responses.
   *
   * Lack of standardization of how clients automatically choose from responses, and the additional round-trips that slow down client-server interaction mean this mechanism is rarely used.
   * [Server-driven content negotiation](/en-US/docs/Web/HTTP/Content_negotiation#server-driven_content_negotiation) is far more common, where a server directly chooses the most appropriate resource for the client based on the request headers ([Accept-Language](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language), [Accept](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept), etc.).
   */
  VARIANT_ALSO_NEGOTIATES = 506,

  /**
   * The HTTP **`507 Insufficient Storage`** [server error response](/en-US/docs/Web/HTTP/Status#server_error_responses) status code indicates that an action could not be performed because the server does not have enough available storage to successfully complete the request.
   *
   * This status code was first used in the context of Web Distributed Authoring and Versioning ([WebDAV](https://developer.mozilla.org/en-US/docs/Glossary/WebDAV)), but has propagated into other use cases to describe situations where server resources are exhausted.
   * Common causes of this error can be from server directories running out of available space, not enough available RAM for an operation, or internal limits reached (such as application-specific memory limits, for example).
   * The request causing this error does not necessarily need to include content, as it may be a request that would create a resource on the server if it was successful.
   *
   * This issue is considered temporary, as opposed to a [413 Content Too Large](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/413), which indicates that the client request is too large for the server to process regardless of server resource constraints.
   */
  INSUFFICIENT_STORAGE = 507,

  /**
   * The HTTP **`508 Loop Detected`** [server error response](/en-US/docs/Web/HTTP/Status#server_error_responses) status code indicates that the entire operation failed because it encountered an infinite loop while processing a request with `Depth: infinity`.
   *
   * The status may be given in the context of the Web Distributed Authoring and Versioning ([WebDAV](https://developer.mozilla.org/en-US/docs/Glossary/WebDAV)).
   * It was introduced as a fallback for cases where WebDAV clients do not support [208 Already Reported](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/208) responses (when requests do not explicitly include a `DAV` header).
   */
  LOOP_DETECTED = 508,

  /**
   * The HTTP **`510 Not Extended`** [server error response](/en-US/docs/Web/HTTP/Status#server_error_responses) status code is sent when the client request declares an HTTP Extension ([2774](https://developer.mozilla.org/en-US/docs/RFC/2774)) that should be used to process the request, but the extension is not supported.
   */
  NOT_EXTENDED = 510,

  /**
   * The HTTP **`511 Network Authentication Required`** [server error response](/en-US/docs/Web/HTTP/Status#server_error_responses) status code indicates that the client needs to authenticate to gain network access.
   * This status is not generated by origin servers, but by intercepting [proxies](https://developer.mozilla.org/en-US/docs/Glossary/Proxy_server) that control access to a network.
   *
   * Network operators sometimes require some authentication, acceptance of terms, or other user interaction before granting access (for example in an internet café or at an airport).
   * They often identify clients who have not done so using their Media Access Control (MAC) addresses.
   */
  NETWORK_AUTHENTICATION_REQUIRED = 511,
}
