import { expect, it } from 'vitest'
import { isStringBitcoinAddress, isStringDateTimeIso8601, isStringDiscordUsername, isStringEmail, isStringEmoji, isStringFirestoreId, isStringIpv4, isStringIpv6, isStringJwt, isStringLatLong, isStringMac, isStringMatching, isStringPort, isStringSemver, isStringSlug, isStringUrl, isStringUuid } from './isStringMatching'

it('checks if value matches the specified regex', () => {
  expect(isStringMatching('Hello World!', /hello/)).toBeFalsy()
  expect(isStringMatching('Hello World!', /hello/i)).toBeTruthy()
})

it('should return true for emojis', () => {
  expect(isStringEmoji('\u00A9')).toBe(true)
  expect(isStringEmoji('\u00AE')).toBe(true)
  expect(isStringEmoji('\u2000')).toBe(true)
  expect(isStringEmoji('\u3300')).toBe(true)
  expect(isStringEmoji('\uD83C\uD000')).toBe(true)
  expect(isStringEmoji('\uD83C\uDFFF')).toBe(true)
  expect(isStringEmoji('\uD83D\uD000')).toBe(true)
  expect(isStringEmoji('\uD83D\uDFFF')).toBe(true)
  expect(isStringEmoji('\uD83E\uD000')).toBe(true)
  expect(isStringEmoji('\uD83E\uDFFF')).toBe(true)
  expect(isStringEmoji('A')).toBe(false)
  expect(isStringEmoji('*')).toBe(false)
  expect(isStringEmoji('\n')).toBe(false)
  expect(isStringEmoji('\r')).toBe(false)
  expect(isStringEmoji('\t')).toBe(false)
  expect(isStringEmoji(' ')).toBe(false)
  expect(isStringEmoji('\uD83C')).toBe(false)
  expect(isStringEmoji('\uD83D')).toBe(false)
  expect(isStringEmoji('\uD83E')).toBe(false)
})

it('checks if string matches a slug', () => {
  expect(isStringSlug('foo')).toBeTruthy()
  expect(isStringSlug('foo-bar')).toBeTruthy()
  expect(isStringSlug('foo-bar-baz')).toBeTruthy()
  expect(isStringSlug('5')).toBeTruthy()
  expect(isStringSlug('5-5')).toBeTruthy()
  expect(isStringSlug('5-5-5')).toBeTruthy()
  expect(isStringSlug('foo.bar')).toBeFalsy()
  expect(isStringSlug('foo@bar')).toBeFalsy()
})

it('checks if string matches an email', () => {
  expect(isStringEmail('foo@bar.com')).toBeTruthy()
  expect(isStringEmail('foo.bar@baz.com')).toBeTruthy()
  expect(isStringEmail('foo+bar@baz.com')).toBeTruthy()
  expect(isStringEmail('foo@bar.co.uk')).toBeTruthy()
  expect(isStringEmail('foo@bar.io')).toBeTruthy()
  expect(isStringEmail('foo@bar.museum')).toBeTruthy()
  expect(isStringEmail('foo@baz')).toBeFalsy()
  expect(isStringEmail('foo@baz.com')).toBeTruthy()
  expect(isStringEmail('foo@baz.com.co')).toBeTruthy()
  expect(isStringEmail('foo@baz.net')).toBeTruthy()
  expect(isStringEmail('foo@baz.org')).toBeTruthy()
  expect(isStringEmail('foobar')).toBeFalsy()
  expect(isStringEmail('foo@')).toBeFalsy()
  expect(isStringEmail('@bar')).toBeFalsy()
  expect(isStringEmail('foo.bar')).toBeFalsy()
  expect(isStringEmail('.foo.bar')).toBeFalsy()
  expect(isStringEmail('foo+bar')).toBeFalsy()
  expect(isStringEmail('foo@+bar')).toBeFalsy()
  expect(isStringEmail('foo@bar+')).toBeFalsy()
})

it('should return true if string is a URL', () => {
  expect(isStringUrl('http://foo.com')).toBeTruthy()
  expect(isStringUrl('https://foo.com')).toBeTruthy()
  expect(isStringUrl('http://foo.com:80')).toBeTruthy()
  expect(isStringUrl('http://foo.com/bar')).toBeTruthy()
  expect(isStringUrl('http://foo.com/bar?baz=qux')).toBeTruthy()
  expect(isStringUrl('http://foo.com/bar?baz=qux#quux')).toBeTruthy()
  expect(isStringUrl('foo')).toBeFalsy()
  expect(isStringUrl('Bar')).toBeFalsy()
  expect(isStringUrl('http://')).toBeFalsy()
  expect(isStringUrl('http://foo')).toBeTruthy()
  expect(isStringUrl('https://foo')).toBeTruthy()
  expect(isStringUrl('http://foo:80')).toBeTruthy()
  expect(isStringUrl('http://foo.com:8')).toBeTruthy()
  expect(isStringUrl('ftp://foo.com')).toBeTruthy()
  expect(isStringUrl('http:foo.com')).toBeTruthy()
  expect(isStringUrl('http:/foo.com')).toBeFalsy()
  expect(isStringUrl('http:///foo.com')).toBeFalsy()
  expect(isStringUrl('http://?foo.com')).toBeFalsy()
  expect(isStringUrl('http://#foo.com')).toBeFalsy()
  expect(isStringUrl('http://foo.com?')).toBeTruthy()
  expect(isStringUrl('http://foo.com#')).toBeTruthy()
  expect(isStringUrl('http://foo.com/?')).toBeTruthy()
  expect(isStringUrl('http://foo.com/#')).toBeTruthy()
  expect(isStringUrl('http://foo.com?#')).toBeTruthy()
  expect(isStringUrl('http://foo.com??')).toBeTruthy()
  expect(isStringUrl('http://foo.com##')).toBeTruthy()
})

it('should return true for valid MAC addresses', () => {
  expect(isStringMac('01:02:03:04:05:06')).toBeTruthy()
  expect(isStringMac('01:AB:CD:EF:AB:CD')).toBeTruthy()
  expect(isStringMac('AB:CD:EF:AB:CD:EF')).toBeTruthy()
  expect(isStringMac('01:ab:cd:ef:ab:cd')).toBeTruthy()
  expect(isStringMac('ab:cd:ef:ab:cd:ef')).toBeTruthy()
  expect(isStringMac('01:02:03:04:05:6')).toBeFalsy()
  expect(isStringMac('01:02:03:04:05')).toBeFalsy()
  expect(isStringMac('01:02:03:04:05:00:00')).toBeFalsy()
  expect(isStringMac('01-02-03-04-05-06')).toBeFalsy()
  expect(isStringMac('1:2:3:4:5:6')).toBeFalsy()
  expect(isStringMac('01.02.03.04.05.06')).toBeFalsy()
  expect(isStringMac('0102.0304.0506')).toBeFalsy()
  expect(isStringMac('G:H:I:J:K:L')).toBeFalsy()
})

it('should return true for valid UUID', () => {
  expect(isStringUuid('123e4567-e89b-12d3-a456-426655440002')).toBeTruthy()
  expect(isStringUuid('12345678-1234-5678-1234-567812345678')).toBeFalsy()
  expect(isStringUuid('12345')).toBeFalsy()
  expect(isStringUuid('12345678-1234-5678-1234-567812345678')).toBeFalsy()
  expect(isStringUuid('abcdefgh-ijkl-mnop-qrst-uvwxyzabcdef')).toBeFalsy()
})

it('should return true if string is valid IPv4', () => {
  expect(isStringIpv4('1.1.1.1')).toBeTruthy()
  expect(isStringIpv4('255.255.255.255')).toBeTruthy()
  expect(isStringIpv4('192.168.0.1')).toBeTruthy()
  expect(isStringIpv4('1234.1.1.1')).toBeFalsy()
  expect(isStringIpv4('999.255.255.255')).toBeFalsy()
  expect(isStringIpv4('0.0.0.0')).toBeTruthy()
  expect(isStringIpv4('255.255.255.256')).toBeFalsy()
  expect(isStringIpv4('255.255.255')).toBeFalsy()
  expect(isStringIpv4('255.255')).toBeFalsy()
  expect(isStringIpv4('255')).toBeFalsy()
  expect(isStringIpv4('0.0.0.0.0')).toBeFalsy()
  expect(isStringIpv4('1.2.3.4.5')).toBeFalsy()
})

it('should match IPv6 addresses', () => {
  expect(isStringIpv6('::')).toBeTruthy()
  expect(isStringIpv6('::1')).toBeTruthy()
  expect(isStringIpv6('1::')).toBeTruthy()
  expect(isStringIpv6('fe80::ae21:afff:feea:8e4a')).toBeTruthy()
  expect(isStringIpv6('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBeTruthy()
  expect(isStringIpv6('0.0.0.0')).toBeFalsy()
  expect(isStringIpv6('255.255.255.255')).toBeFalsy()
  expect(isStringIpv6('foo')).toBeFalsy()
})

it('should check if a string matches port numbers', () => {
  expect(isStringPort('0')).toBeTruthy()
  expect(isStringPort('80')).toBeTruthy()
  expect(isStringPort('443')).toBeTruthy()
  expect(isStringPort('3000')).toBeTruthy()
  expect(isStringPort('8080')).toBeTruthy()
  expect(isStringPort('65535')).toBeTruthy()
  expect(isStringPort('-1')).toBeFalsy()
  expect(isStringPort('65536')).toBeFalsy()
  expect(isStringPort('1.2.3.4')).toBeFalsy()
  expect(isStringPort('foo')).toBeFalsy()
  expect(isStringPort('8080/tcp')).toBeFalsy()
})

it('should return true when string matches Semantic Versioning', () => {
  expect(isStringSemver('0.0.4')).toBeTruthy()
  expect(isStringSemver('1.2.3')).toBeTruthy()
  expect(isStringSemver('10.20.30')).toBeTruthy()
  expect(isStringSemver('1.1.2-alpha.1')).toBeTruthy()
  expect(isStringSemver('1.2.3-beta.2')).toBeTruthy()
  expect(isStringSemver('1.0.0-rc.3')).toBeTruthy()
  expect(isStringSemver('1.2.3-alpha.1.2.3-beta.2.3.4-rc.3.2.1')).toBeTruthy()
  expect(isStringSemver('0.0.4-alpha')).toBeTruthy()
  expect(isStringSemver('aloha')).toBeFalsy()
})

it('should match correct latitude longitude strings', () => {
  expect(isStringLatLong('0.0,0.0')).toBe(true)
  expect(isStringLatLong('0.0,0.0,0.0')).toBe(false)
  expect(isStringLatLong('-90.0,-180.0')).toBe(true)
  expect(isStringLatLong('-90.0,-180.0,0.0')).toBe(false)
  expect(isStringLatLong('90.0,180.0')).toBe(true)
  expect(isStringLatLong('90.0,180.0,0.0')).toBe(false)
  expect(isStringLatLong('a')).toBe(false)
  expect(isStringLatLong('abc')).toBe(false)
  expect(isStringLatLong('1234')).toBe(false)
})

it('should return true if string matches ISO 8601', () => {
  expect(isStringDateTimeIso8601('1994-11-05T13:15:30Z')).toEqual(true)
  expect(isStringDateTimeIso8601('1994-11-05T08:15:30-05:00')).toEqual(true)
  expect(isStringDateTimeIso8601('1994-11-05T08:15:30+05:00')).toEqual(true)
  expect(isStringDateTimeIso8601('1994-11-05T08:15:30.45')).toEqual(false)
  expect(isStringDateTimeIso8601('1994-11-05T08:15:30.45+05:00')).toEqual(false)
  expect(isStringDateTimeIso8601('1994-11-05')).toEqual(true)
  expect(isStringDateTimeIso8601('19941105T131530Z')).toEqual(true)
  expect(isStringDateTimeIso8601('19941105T131530.45')).toEqual(false)
  expect(isStringDateTimeIso8601('19941105T131530.45+0500')).toEqual(false)
  expect(isStringDateTimeIso8601('1994-W48-5')).toEqual(true)
  expect(isStringDateTimeIso8601('1994W485')).toEqual(true)
  expect(isStringDateTimeIso8601('1994-135')).toEqual(true)
  expect(isStringDateTimeIso8601('19941350')).toEqual(false)
  expect(isStringDateTimeIso8601('1994-W15-5T13:15:30Z')).toEqual(true)
  expect(isStringDateTimeIso8601('1994W155T131530Z')).toEqual(true)
  expect(isStringDateTimeIso8601('1994-W15-5')).toEqual(true)
  expect(isStringDateTimeIso8601('1994W155')).toEqual(true)
  expect(isStringDateTimeIso8601('1994-05')).toEqual(true)
  expect(isStringDateTimeIso8601('199405')).toEqual(true)
  expect(isStringDateTimeIso8601('1994-05-05T08:15:30-05:00')).toEqual(true)
  expect(isStringDateTimeIso8601('19940505T131530Z')).toEqual(true)
  expect(isStringDateTimeIso8601('1994-05-05')).toEqual(true)
  expect(isStringDateTimeIso8601('19940505')).toEqual(true)
  expect(isStringDateTimeIso8601('1994137T131530Z')).toEqual(false)
  expect(isStringDateTimeIso8601('1994137')).toEqual(true)
  expect(isStringDateTimeIso8601('1994-11-05T13:15:30')).toEqual(true)
  expect(isStringDateTimeIso8601('1994-11-05 08:15:30-05:00')).toEqual(false)
  expect(isStringDateTimeIso8601('1994-11-05T081530+05:00')).toEqual(true)
  expect(isStringDateTimeIso8601('1994-11-05T08:15:30+05')).toEqual(true)
  expect(isStringDateTimeIso8601('1994-11-05T08:15:30.045+05:00')).toEqual(true)
  expect(isStringDateTimeIso8601('1994-11-05-')).toEqual(false)
  expect(isStringDateTimeIso8601('19941105T131530+05:00')).toEqual(true)
  expect(isStringDateTimeIso8601('19941105T131530.45+05')).toEqual(false)
  expect(isStringDateTimeIso8601('19941105T131530.045+0500')).toEqual(true)
  expect(isStringDateTimeIso8601('1994-W48')).toEqual(true)
  expect(isStringDateTimeIso8601('1994W48')).toEqual(true)
  expect(isStringDateTimeIso8601('1994W48-5')).toEqual(true)
  expect(isStringDateTimeIso8601('1994W485-')).toEqual(false)
  expect(isStringDateTimeIso8601('1994-135T')).toEqual(false)
  expect(isStringDateTimeIso8601('1994135T')).toEqual(false)
  expect(isStringDateTimeIso8601('19941350T')).toEqual(false)
  expect(isStringDateTimeIso8601('1994-W15')).toEqual(true)
  expect(isStringDateTimeIso8601('1994W15')).toEqual(true)
  expect(isStringDateTimeIso8601('1994W15-5T13:15:30Z')).toEqual(true)
  expect(isStringDateTimeIso8601('1994W15-5T131530Z')).toEqual(true)
  expect(isStringDateTimeIso8601('1994W155T131530Z-')).toEqual(false)
  expect(isStringDateTimeIso8601('1994W155-')).toEqual(false)
  expect(isStringDateTimeIso8601('1994-05-')).toEqual(false)
  expect(isStringDateTimeIso8601('199405-')).toEqual(false)
  expect(isStringDateTimeIso8601('19940505T08:15:30-05:00')).toEqual(true)
  expect(isStringDateTimeIso8601('19940505T081530-05:00')).toEqual(true)
  expect(isStringDateTimeIso8601('19940505081530-05:00')).toEqual(false)
  expect(isStringDateTimeIso8601('19940505T081530Z-05:00')).toEqual(false)
  expect(isStringDateTimeIso8601('19940505-')).toEqual(false)
  expect(isStringDateTimeIso8601('1994137T131530+05:00')).toEqual(false)
  expect(isStringDateTimeIso8601('19941370T131530Z')).toEqual(false)
  expect(isStringDateTimeIso8601('19941370T131530Z-')).toEqual(false)
  expect(isStringDateTimeIso8601('19941370-')).toEqual(false)
})

it('should match Firestore ids', () => {
  expect(isStringFirestoreId('aBcDeFgHiJkLmNoPqRsTuVwXyZ')).toBeTruthy()
  expect(isStringFirestoreId('AbCdEfGhIjKlMnOpQrStUvWxYz')).toBeTruthy()
  expect(isStringFirestoreId('1234567890')).toBeTruthy()
  expect(isStringFirestoreId('ABCDEFGHIJKLMNOPQRSTUVWXYZ')).toBeTruthy()
  expect(isStringFirestoreId('abcdefghijklmnopqrstuvwxyz')).toBeTruthy()
  expect(isStringFirestoreId('-_.~')).toBeTruthy()
  expect(isStringFirestoreId('.aBcDeFgHiJkLmNoPqRsTuVwXyZ')).toBeTruthy()
  expect(isStringFirestoreId('AbCdEfGhIjKlMnOpQrStUvWxYz.')).toBeTruthy()
  expect(isStringFirestoreId('..')).toBeFalsy()
  expect(isStringFirestoreId('__AbCdEfGhIjKlMnOpQrStUvWxYz__')).toBeFalsy()
  expect(isStringFirestoreId('AbCdEfGhIjKlMnOpQrStUvWxYz/foo')).toBeFalsy()
  expect(isStringFirestoreId('AbCdEfGhIjKlMnOpQrStUvWxYz/')).toBeFalsy()
})

it('should match Discord usernames', () => {
  expect(isStringDiscordUsername('foo')).toBeFalsy()
  expect(isStringDiscordUsername('foo#1234')).toBeTruthy()
})

it('should match Bitcoin addresses', () => {
  expect(isStringBitcoinAddress('14B8F894a0A39F395F04c5336E5D7A1C97D790F4')).toBeTruthy()
  expect(isStringBitcoinAddress('3E7T3uTtV3a5DDxr3E3UqCtR3E3E3E3E3E')).toBeTruthy()
  expect(isStringBitcoinAddress('bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq')).toBeTruthy()
  expect(isStringBitcoinAddress('bc1qc7slrfxkknqcq2jevvvkdgvrt8080852dfjewde450xdlk4ugp7szw5tk9')).toBeFalsy()
  expect(isStringBitcoinAddress('14B8F894a0A39F395F04c5336E5D7A1C97D790F4.')).toBeFalsy()
  expect(isStringBitcoinAddress('3E7T3uTtV3a5DDxr3E3UqCtR3E3E3E3E3E.')).toBeFalsy()
  expect(isStringBitcoinAddress('3E7T3uTtV3a5DDxr3E3UqCtR3E3E3E3E3E/')).toBeFalsy()
  expect(isStringBitcoinAddress('bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq/')).toBeFalsy()
  expect(isStringBitcoinAddress('bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq/foo')).toBeFalsy()
})

it('should return true when string matches JSON Web Token', () => {
  expect(isStringJwt('eyJhbGciOiJIUz.eyJzdWIiOiIxMjM0NTY3O.SflKxwRJSM6POk6yJV_adQssw5c')).toBeTruthy()
  expect(isStringJwt('not a JSON Web Token')).toEqual(false)
})
