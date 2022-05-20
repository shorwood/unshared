/**
 * Matches valid lowercase slug
 *
 * Example of matched strings:
 * - `this-is-a-slug`
 * - `another-slug`
 * - `yet-another-slug`
 *
 * @see https://en.wikipedia.org/wiki/Slug_(publishing)
 */
export const slug = /^[a-z-]+$/

/**
 * Matches email address.
 *
 * Example of matched strings:
 * - `ekinnerk0@joomla.org`
 * - `ldust1@cocolog-nifty.com`
 * - `rsummerly2@vkontakte.ru`
 * - `abloy3@msn.com`
 * - `edibden4@linkedin.com`
 *
 * @see https://en.wikipedia.org/wiki/Email_address
 */
export const email = /^(([^\s"(),.:;<>@[\\\]]+(\.[^\s"(),.:;<>@[\\\]]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([\da-z\-]+\.)+[a-z]{2,}))$/i

/**
 * Matches URL.
 *
 * Example of matched strings:
 * - `https://www.google.com`
 * - `http://www.google.com`
 * - `www.google.com`
 * - `google.com`
 * - `https://www.google.com/search?q=test&oq=test`
 *
 * @see https://en.wikipedia.org/wiki/Uniform_Resource_Locator
 */

export const url = /((([a-z]{3,9}:(?:\/\/)?)(?:[\w$&+,:;=\-]+@)?[\d.a-z\-]+|(?:www\.|[\w$&+,:;=\-]+@)[\d.a-z\-]+)((?:\/[\w%+./~\-]*)?\??[\w%&+.;=@\-]*#?[\w!./\\]*)?)/i

/**
 * Matches MAC addresses
 *
 * Example of matched strings:
 * - `01:23:45:67:89:ab`
 * - `fe:dc:ba:98:76:54`
 *
 * @see https://www.wikipedia.org/en/MAC_address
 */
export const mac = /^[\da-f]{2}(:[\da-f]{2}){5}$/i

/**
 * Matches UUID.
 *
 * Example of matched strings:
 * - `123e4567-e89b-12d3-a456-426614174000`
 * - `d1b1e4fc-8fb4-11e5-acff-60030891757e`
 * - `0-4008-8fb4-11e5-acff-60030891757e`
 *
 * @see https://en.wikipedia.org/wiki/Universally_unique_identifier
 */
export const uuid = /^(?:[\da-f]{8}-[\da-f]{4}-[1-5][\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}|0{8}-(?:0{4}-){3}0{12})$/i

/**
 * Matches IP v4 addresses
 *
 * Example of matched strings:
 * - `21.24.225.156`
 * - `42.12.22.24`
 * - `93.64.18.13`
 * - `10.0.0.1`
 *
 * @see https://en.wikipedia.org/wiki/IPv4
 */
export const ipv4 = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d{1,2})\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d{1,2})$/

/**
 * Matches IP v6 addresses
 *
 * Example of matched strings:
 * - `4ffe:1::a`
 * - `fe80::`
 * - `::`
 * - `::1`
 * - `::ffff:0:0`
 * - `::ffff:255.255.255.255`
 * - `2001:db8:0:0:0:0:2:1`
 * - `64:ff9b::`
 *
 * @see https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry.xhtml
 */
export const ipv6 = /^(([\da-f]{1,4}:){7}[\da-f]{1,4}|([\da-f]{1,4}:){1,7}:|([\da-f]{1,4}:){1,6}:[\da-f]{1,4}|([\da-f]{1,4}:){1,5}(:[\da-f]{1,4}){1,2}|([\da-f]{1,4}:){1,4}(:[\da-f]{1,4}){1,3}|([\da-f]{1,4}:){1,3}(:[\da-f]{1,4}){1,4}|([\da-f]{1,4}:){1,2}(:[\da-f]{1,4}){1,5}|[\da-f]{1,4}:((:[\da-f]{1,4}){1,6})|:((:[\da-f]{1,4}){1,7}|:)|fe80:(:[\da-f]{0,4}){0,4}%[\da-z]+|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}\d){0,1}\d)\.){3}(25[0-5]|(2[0-4]|1{0,1}\d){0,1}\d)|([\da-f]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}\d){0,1}\d)\.){3}(25[0-5]|(2[0-4]|1{0,1}\d){0,1}\d))$/i

/**
 * Matches port number.
 *
 * Example of matched strings:
 * - `0`
 * - `22`
 * - `80`
 * - `443`
 * - `3306`
 * - `65535`
 *
 * @see https://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers
 */
export const port = /^((6553[0-5])|(655[0-2]\d)|(65[0-4]\d{2})|(6[0-4]\d{3})|([1-5]\d{4})|([0-5]{0,5})|(\d{1,4}))$/

/**
 * Matches encoded JSON Web Token
 *
 * Example of matched strings:
 * - `eyJhbGciOiJIUsInR5cCI6IkpXVCJ9.eyJzdwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSM_adQssw5c`
 * - `iOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODlIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJ`
 *
 * @see https://jwt.io/
 */
export const jwt = /^[\w=-]+\.[\w=-]+\.?[\w+./=-]*$/

/**
 * Matches a valid semantic versioning version.
 *
 * Example of matched strings:
 * - `3.14.0`
 * - `42.6.0`
 * - `2.7.1`
 * - `1.0.0-alpha+001`
 * - `1.0.0+20130313144700`
 *
 * @see https://semver.org/
 */
export const semver = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-z-][\da-z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-z-][\da-z-]*))*))?(?:\+([\da-z-]+(?:\.[\da-z-]+)*))?$/i

/**
 * Matches comma separeted latitude and longitude values.
 *
 * Example of matched strings:
 * - `37.3855, -122.0881`
 * - `48.8584, 2.2945`
 * - `40.7128, 74.0060`
 * - `-26.2041, 28.0473`
 * - `-33.9249, 18.4241`
 *
 * @see https://en.wikipedia.org/wiki/Geographic_coordinate_system
 */
export const latLong = /^((-?|\+?)?\d+(\.\d+)?),\s*((-?|\+?)?\d+(\.\d+)?)$/

/**
 * Matches a valid date and time in the ISO-8601 format, excludes durations.
 *
 * Examples of matched strings:
 * - `2011-11-30T11:45:26Z`
 * - `2011-12-31T23:59:60Z`
 * - `2011-12-31T15:59:59.9-05:00`
 * - `2011W05`
 * - `2011-W05`
 * - `2011W05-5`
 * - `2011-W05-5`
 *
 * @see https://en.wikipedia.org/wiki/ISO_8601
 */
export const dateTimeIso8601 = /^(?![+-]?\d{4,5}-?(?:\d{2}|w\d{2})t)(?:|(\d{4}|[+-]\d{5})-?(?:|(0\d|1[0-2])(?:|-?([0-2]\d|3[01]))|([0-2]\d{2}|3[0-5]\d|36[0-6])|w([0-4]\d|5[0-3])(?:|-?([1-7])))(?:(?!\d)|t(?=\d)))(?:|([01]\d|2[0-4])(?:|:?([0-5]\d)(?:|:?([0-5]\d)(?:|\.(\d{3})))(?:|z|([+-](?:[01]\d|2[0-4]))(?:|:?([0-5]\d)))))$/i
