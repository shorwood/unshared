/**
  * Check if the string matches regex
  * @param {string} value The value to check
  * @param {RegExp | string} regex The regex to match
  * @returns {boolean} `true` if string matches regex, `false` otherwise
  */
export const isStringMatching = (value: string, regex: RegExp): boolean => regex.test(value)

/**
 * Check if string matches emojis.
 * @param {string} value The value to check
 * @returns {boolean} `true` if string matches regex, `false` otherwise
 *
 * @example Matched strings:
 * - `\u00A9`
 * - `\u00AE`
 * - `\u2000`
 * - `\u3300`
 * - `\uD83C\uD000`
 * - `\uD83C\uDFFF`
 * - `\uD83D\uD000`
 * - `\uD83D\uDFFF`
 * - `\uD83E\uD000`
 * - `\uD83E\uDFFF`
 *
 * @see https://en.wikipedia.org/wiki/Emoji
 */
export const isStringEmoji = (value: string): boolean => /(\u00A9|\u00AE|[\u2000-\u3300]|\uD83C[\uD000-\uDFFF]|\uD83D[\uD000-\uDFFF]|\uD83E[\uD000-\uDFFF])/.test(value)

/**
 * Check if string matches slug.
 * @param {string} value The value to check
 * @returns {boolean} `true` if string matches regex, `false` otherwise
 *
 * @example Matched strings:
 * - `foo`
 * - `foo-bar`
 * - `foo-bar-baz`
 * - `5`
 * - `5-5`
 * - `5-5-5`
 *
 * @see https://help.ghost.org/hc/en-us/articles/224410728-What-is-a-slug-
 */
export const isStringSlug = (value: string): boolean => /^[\da-z-]+$/.test(value)

/**
  * Check if string matches email.
  * @param {string} value The value to check
  * @returns {boolean} `true` if string matches regex, `false` otherwise
  *
  * @example Matched strings:
  * - `foo@bar.com`
  * - `foo.bar@baz.com`
  * - `foo+bar@baz.com`
  * - `foo@bar.co.uk`
  * - `foo@bar.io`
  * - `foo@bar.museum`
  * - `foo@baz.com`
  * - `foo@baz.com.co`
  * - `foo@baz.net`
  * - `foo@baz.org`
  *
  * @see http://emailregex.com/
  */
export const isStringEmail = (value: string): boolean => /^(([^\s"(),.:;<>@[\\\]]+(\.[^\s"(),.:;<>@[\\\]]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([\da-z\-]+\.)+[a-z]{2,}))$/i.test(value)

/**
  * Check if string matches URL.
  * @param {string} value The value to check
  * @returns {boolean} `true` if string matches regex, `false` otherwise
  *
  * @example Matched strings:
  * - `http://foo.com`
  * - `https://foo.com`
  * - `http://foo.com:80`
  * - `http://foo.com/bar`
  * - `http://foo.com/bar?baz=qux`
  * - `http://foo.com/bar?baz=qux#quux`
  *
  * @see https://urlregex.com/
  */
export const isStringUrl = (value: string): boolean => /((([a-z]{3,9}:(?:\/\/)?)(?:[\w$&+,:;=\-]+@)?[\d.a-z\-]+|(?:www\.|[\w$&+,:;=\-]+@)[\d.a-z\-]+)((?:\/[\w%+./~\-]*)?\??[\w%&+.;=@\-]*#?[\w!./\\]*)?)/i.test(value)

/**
  * Check if string matches MAC address.
  * @param {string} value The value to check
  * @returns {boolean} `true` if string matches regex, `false` otherwise
  *
  * @example Matched strings:
  * - `01:02:03:04:05:06`
  * - `01:AB:CD:EF:AB:CD`
  * - `AB:CD:EF:AB:CD:EF`
  *
  * @see https://www.thegeekstuff.com/2012/06/regular-expression-mac-address/
  */
export const isStringMac = (value: string): boolean => /^[\da-f]{2}(:[\da-f]{2}){5}$/i.test(value)

/**
  * Check if string matches UUID.
  * @param {string} value The value to check
  * @returns {boolean} `true` if string matches regex, `false` otherwise
  *
  * @example Matched strings:
  * - `123e4567-e89b-12d3-a456-426655440002`
  * - `12345678-1234-5678-1234-567812345678`
  * - `12345678-1234-5678-1234-567812345678`
  *
  * @see https://www.ietf.org/rfc/rfc4122.txt
  */
export const isStringUuid = (value: string): boolean => /^(?:[\da-f]{8}-[\da-f]{4}-[1-5][\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}|0{8}-(?:0{4}-){3}0{12})$/i.test(value)

/**
  * Check if string matches IPv4.
  * @param {string} value The value to check
  * @returns {boolean} `true` if string matches regex, `false` otherwise
  *
  * @example Matched strings:
  * - `1.1.1.1`
  * - `255.255.255.255`
  * - `192.168.0.1`
  *
  * @see https://en.wikipedia.org/wiki/IPv4
  */
export const isStringIpv4 = (value: string): boolean => /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d{1,2})\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d{1,2})$/.test(value)

/**
 * Check if string matches IPv6 addresses.
 * @param {string} value The value to check
 * @returns {boolean} `true` if string matches regex, `false` otherwise
 *
 * @example Matched strings:
 * - `::`
 * - `::1`
 * - `1::`
 * - `fe80::ae21:afff:feea:8e4a`
 * - `2001:0db8:85a3:0000:0000:8a2e:0370:7334`
 *
 * @see https://en.wikipedia.org/wiki/IPv6
 */
export const isStringIpv6 = (value: string): boolean => /^(([\da-f]{1,4}:){7}[\da-f]{1,4}|([\da-f]{1,4}:){1,7}:|([\da-f]{1,4}:){1,6}:[\da-f]{1,4}|([\da-f]{1,4}:){1,5}(:[\da-f]{1,4}){1,2}|([\da-f]{1,4}:){1,4}(:[\da-f]{1,4}){1,3}|([\da-f]{1,4}:){1,3}(:[\da-f]{1,4}){1,4}|([\da-f]{1,4}:){1,2}(:[\da-f]{1,4}){1,5}|[\da-f]{1,4}:((:[\da-f]{1,4}){1,6})|:((:[\da-f]{1,4}){1,7}|:)|fe80:(:[\da-f]{0,4}){0,4}%[\da-z]+|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}\d){0,1}\d)\.){3}(25[0-5]|(2[0-4]|1{0,1}\d){0,1}\d)|([\da-f]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}\d){0,1}\d)\.){3}(25[0-5]|(2[0-4]|1{0,1}\d){0,1}\d))$/i.test(value)

/**
  * Check if string matches port numbers.
  * @param {string} value The value to check
  * @returns {boolean} `true` if string matches regex, `false` otherwise
  *
  * @example Matched strings:
  * - `0`
  * - `80`
  * - `443`
  * - `3000`
  * - `8080`
  * - `65535`
  *
  * @see https://en.wikipedia.org/wiki/Port_(computer_networking)
  */
export const isStringPort = (value: string): boolean => /^((6553[0-5])|(655[0-2]\d)|(65[0-4]\d{2})|(6[0-4]\d{3})|([1-5]\d{4})|([0-5]{0,5})|(\d{1,4}))$/.test(value)

/**
  * Check if string matches JSON Web Token.
  * @param {string} value The value to check
  * @returns {boolean} `true` if string matches regex, `false` otherwise
  *
  * @example Matched strings:
  * - `eyJhbGciOiJIUz.eyJzdWIiOiIxMjM0NTY3O.SflKxwRJSM6POk6yJV_adQssw5c`
  *
  * @see https://jwt.io/
  */
export const isStringJwt = (value: string): boolean => /^[\w=-]+\.[\w=-]+\.?[\w+./=-]*$/.test(value)

/**
  * Check if string matches Semantic Versioning.
  * @param {string} value The value to check
  * @returns {boolean} `true` if string matches regex, `false` otherwise
  *
  * @example Matched strings:
  * - `0.0.4`
  * - `1.2.3`
  * - `10.20.30`
  * - `1.1.2-alpha.1`
  * - `1.2.3-beta.2`
  * - `1.0.0-rc.3`
  * - `1.2.3-alpha.1.2.3-beta.2.3.4-rc.3.2.1`
  *
  * @see https://semver.org/
  */
export const isStringSemver = (value: string): boolean => /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-z-][\da-z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-z-][\da-z-]*))*))?(?:\+([\da-z-]+(?:\.[\da-z-]+)*))?$/i.test(value)

/**
  * Check if string matches latitude and longitude.
  * @param {string} value The value to check
  * @returns {boolean} `true` if string matches regex, `false` otherwise
  *
  * @example Matched strings:
  * - `0.0,0.0`
  * - `0.0,0.0,0.0`
  * - `-90.0,-180.0`
  * - `-90.0,-180.0,0.0`
  * - `90.0,180.0`
  * - `90.0,180.0,0.0`
  *
  * @see https://en.wikipedia.org/wiki/Geographic_coordinate_system
  */
export const isStringLatLong = (value: string): boolean => /^((-?|\+?)?\d+(\.\d+)?),\s*((-?|\+?)?\d+(\.\d+)?)$/.test(value)

/**
  * Check if string matches ISO 8601.
  * @param {string} value The value to check
  * @returns {boolean} `true` if string matches regex, `false` otherwise
  *
  * @example Matched strings:
  * - `1994-11-05T13:15:30Z`
  * - `1994-11-05T08:15:30-05:00`
  *
  * @see https://en.wikipedia.org/wiki/ISO_8601
  */
export const isStringDateTimeIso8601 = (value: string): boolean => /^(?![+-]?\d{4,5}-?(?:\d{2}|w\d{2})t)(?:|(\d{4}|[+-]\d{5})-?(?:|(0\d|1[0-2])(?:|-?([0-2]\d|3[01]))|([0-2]\d{2}|3[0-5]\d|36[0-6])|w([0-4]\d|5[0-3])(?:|-?([1-7])))(?:(?!\d)|t(?=\d)))(?:|([01]\d|2[0-4])(?:|:?([0-5]\d)(?:|:?([0-5]\d)(?:|\.(\d{3})))(?:|z|([+-](?:[01]\d|2[0-4]))(?:|:?([0-5]\d)))))$/i.test(value)

/**
  * Check if string matches Firestore id.
  * @param {string} value The value to check
  * @returns {boolean} `true` if string matches regex, `false` otherwise
  *
  * @example Matched strings:
  * - `aBcDeFgHiJkLmNoPqRsTuVwXyZ`
  * - `AbCdEfGhIjKlMnOpQrStUvWxYz`
  * - `1234567890`
  * - `ABCDEFGHIJKLMNOPQRSTUVWXYZ`
  * - `abcdefghijklmnopqrstuvwxyz`
  * - `-_.~`
  *
  * @see https://firebase.google.com/docs/firestore/reference/rest/Shared.Types/DocumentReference#resource-path-syntax
  */
export const isStringFirestoreId = (value: string): boolean => /^(?!\.\.?$)(?!.*__.*__)([^/]{1,1500})$/.test(value)

/**
  * Check if string matches Discord username.
  * @param {string} value The value to check
  * @returns {boolean} `true` if string matches regex, `false` otherwise
  *
  * @example Matched strings:
  * - `foo`
  * - `foo#1234`
  * - `foo-bar`
  * - `foo_bar`
  * - `foo-bar_baz`
  * - `foo.bar`
  * - `foo-bar.baz`
  * - `foo_bar.baz`
  * - `foo-bar_baz.qux`
  * - `FooBar`
  * - `fooBar`
  * - `FOOBAR`
  *
  * @see https://discordapp.com/developers/docs/reference#usernames-and-nicknames
  */
export const isStringDiscordUsername = (value: string): boolean => /^.{3,32}#\d{4}$/.test(value)

/**
  * Check if string matches Bitcoin address.
  * @param {string} value The value to check
  * @returns {boolean} `true` if string matches regex, `false` otherwise
  *
  * @example Matched strings:
  * - `14B8F894a0A39F395F04c5336E5D7A1C97D790F4`
  * - `3E7T3uTtV3a5DDxr3E3UqCtR3E3E3E3E3E`
  * - `bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq`
  * - `bc1qc7slrfxkknqcq2jevvvkdgvrt8080852dfjewde450xdlk4ugp7szw5tk9`
  *
  * @see https://en.bitcoin.it/wiki/Address
  */
export const isStringBitcoinAddress = (value: string): boolean => /^(bc1|[13])[\dA-HJ-NP-Za-z]{25,39}$/.test(value)
