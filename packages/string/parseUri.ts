/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/no-duplicate-string */

export interface UriComponents {
  /** The protocol (e.g. `http`) */
  protocol?: string
  /** The authority (e.g. `user:pass@www.example.com:443`) */
  authority?: string
  /** The origin (e.g. `http://www.example.com`) */
  origin?: string
  /** The userinfo (e.g. `user:pass`) */
  userinfo?: string
  /** The username (e.g. `user`) */
  username?: string
  /** The password (e.g. `pass`) */
  password?: string
  /** The host (e.g. `www.example.com:433`) */
  host?: string
  /** The host name (e.g. `www.example.com`) */
  hostName?: string
  /** The host port (e.g. `443`) */
  hostPort?: string
  /** The host port as a number (e.g. `433`) */
  hostPortNumber?: number
  /** The host IP (e.g. `127.0.0.1`) */
  hostIp?: string
  /** The host IP as an IPv4 address (e.g. `127.0.0.1`) */
  hostIpv4?: string
  /** The host IP as an IPv6 address (e.g. `::1`) */
  hostIpv6?: string
  /** The domain name (e.g. `example`) */
  domain?: string
  /** The root domain (e.g. `example.com`) */
  domainRoot?: string
  /** The subdomain (e.g. `www`) */
  domainSub?: string
  /** The top level domain (e.g. `com`) */
  domainTop?: string
  /** Domain name with the top level domain (e.g. `www.example.com`) */
  domainFull?: string
  /** The path (e.g. `/path/to/file.html`) */
  path?: string
  /** The path name (e.g. `file.html`) */
  pathName?: string
  /** The path extension (e.g. `html`) */
  pathExtension?: string
  /** The path directory (e.g. `/path/to`) */
  pathDirectory?: string
  /** The search query (e.g. `?q=search`) */
  query?: string
  /** The hash (e.g. `#hash`) */
  hash?: string
}

/**
 * A list of known top level domains. This is used to extract the domain, subdomain
 * and top level domain from a URI. This list is not exhaustive and may be missing
 * some TLDs. If you find a missing TLD, please submit a pull request.
 *
 * @see https://github.com/medialize/URI.js/blob/gh-pages/src/SecondLevelDomains.js#L34
 */
const TOP_LEVEL_DOMAINS = new Set<string>([
  'ac com gov mil net org',
  'ae ac co gov mil name net org pro sch',
  'af com edu gov net org',
  'al com edu gov mil net org',
  'ao co ed gv it og pb',
  'ar com edu gob gov int mil net org tur',
  'at ac co gv or',
  'au asn com csiro edu gov id net org',
  'ba co com edu gov mil net org rs unbi unmo unsa untz unze',
  'bb biz co com edu gov info net org store tv',
  'bh biz cc com edu gov info net org',
  'bn com edu gov net org',
  'bo com edu gob gov int mil net org tv',
  'br adm adv agr am arq art ato b bio blog bmd cim cng cnt com coop ecn edu eng esp etc eti far flog fm fnd fot fst g12 ggf gov imb ind inf jor jus lel mat med mil mus net nom not ntr odo org ppg pro psc psi qsl rec slg srv tmp trd tur tv vet vlog wiki zlg',
  'bs com edu gov net org',
  'bz du et om ov rg',
  'ca ab bc mb nb nf nl ns nt nu on pe qc sk yk',
  'ck biz co edu gen gov info net org',
  'cn ac ah bj com cq edu fj gd gov gs gx gz ha hb he hi hl hn jl js jx ln mil net nm nx org qh sc sd sh sn sx tj tw xj xz yn zj',
  'co com edu gov mil net nom org',
  'cr ac c co ed fi go or sa',
  'cy ac biz com ekloges gov ltd name net org parliament press pro tm',
  'do art com edu gob gov mil net org sld web',
  'dz art asso com edu gov net org pol',
  'ec com edu fin gov info med mil net org pro',
  'eg com edu eun gov mil name net org sci',
  'er com edu gov ind mil net org rochest w',
  'es com edu gob nom org',
  'et biz com edu gov info name net org',
  'fj ac biz com info mil name net org pro',
  'fk ac co gov net nom org',
  'fr asso com f gouv nom prd presse tm',
  'gg co net org',
  'gh com edu gov mil org',
  'gn ac com gov net org',
  'gr com edu gov mil net org',
  'gt com edu gob ind mil net org',
  'gu com edu gov net org',
  'hk com edu gov idv net org',
  'hu 2000 agrar bolt casino city co erotica erotika film forum games hotel info ingatlan jogasz konyvelo lakas media news org priv reklam sex shop sport suli szex tm tozsde utazas video',
  'id ac co go mil net or sch web',
  'il ac co gov idf k12 muni net org',
  'in ac co edu ernet firm gen gov i ind mil net nic org res',
  'iq com edu gov i mil net org',
  'ir ac co dnssec gov i id net org sch',
  'it edu gov',
  'je co net org',
  'jo com edu gov mil name net org sch',
  'jp ac ad co ed go gr lg ne or',
  'ke ac co go info me mobi ne or sc',
  'kh com edu gov mil net org per',
  'ki biz com de edu gov info mob net org tel',
  'km asso com coop edu gouv k medecin mil nom notaires pharmaciens presse tm veterinaire',
  'kn edu gov net org',
  'kr ac busan chungbuk chungnam co daegu daejeon es gangwon go gwangju gyeongbuk gyeonggi gyeongnam hs incheon jeju jeonbuk jeonnam k kg mil ms ne or pe re sc seoul ulsan',
  'kw com edu gov net org',
  'ky com edu gov net org',
  'kz com edu gov mil net org',
  'lb com edu gov net org',
  'lk assn com edu gov grp hotel int ltd net ngo org sch soc web',
  'lr com edu gov net org',
  'lv asn com conf edu gov id mil net org',
  'ly com edu gov id med net org plc sch',
  'ma ac co gov m net org press',
  'mc asso tm',
  'me ac co edu gov its net org priv',
  'mg com edu gov mil nom org prd tm',
  'mk com edu gov inf name net org pro',
  'ml com edu gov net org presse',
  'mn edu gov org',
  'mo com edu gov net org',
  'mt com edu gov net org',
  'mv aero biz com coop edu gov info int mil museum name net org pro',
  'mw ac co com coop edu gov int museum net org',
  'mx com edu gob net org',
  'my com edu gov mil name net org sch',
  'nf arts com firm info net other per rec store web',
  'ng biz com edu gov mil mobi name net org sch',
  'ni ac co com edu gob mil net nom org',
  'np com edu gov mil net org',
  'nr biz com edu gov info net org',
  'om ac biz co com edu gov med mil museum net org pro sch',
  'pe com edu gob mil net nom org sld',
  'ph com edu gov i mil net ngo org',
  'pk biz com edu fam gob gok gon gop gos gov net org web',
  'pl art bialystok biz com edu gda gdansk gorzow gov info katowice krakow lodz lublin mil net ngo olsztyn org poznan pwr radom slupsk szczecin torun warszawa waw wroc wroclaw zgora',
  'pr ac biz com edu est gov info isla name net org pro prof',
  'ps com edu gov net org plo sec',
  'pw belau co ed go ne or',
  'ro arts com firm info nom nt org rec store tm www',
  'rs ac co edu gov in org',
  'sb com edu gov net org',
  'sc com edu gov net org',
  'sh co com edu gov net nom org',
  'sl com edu gov net org',
  'st co com consulado edu embaixada gov mil net org princhostIpe saotome store',
  'sv com edu gob org red',
  'sz ac co org',
  'tr av bbs bel biz com dr edu gen gov info k12 name net org pol tel tsk tv web',
  'tt aero biz cat co com coop edu gov info int jobs mil mobi museum name net org pro tel travel',
  'tw club com ebiz edu game gov idv mil net org',
  'mu ac co com gov net or org',
  'mz ac co edu gov org',
  'na co com',
  'nz ac co cri geek gen govt health iwi maori mil net org parliament school',
  'pa abo ac com edu gob ing med net nom org sld',
  'pt com edu gov int net nome org publ',
  'py com edu gov mil net org',
  'qa com edu gov mil net org',
  're asso com nom',
  'ru ac adygeya altai amur arkhangelsk astrakhan bashkiria belgorod bir bryansk buryatia cbg chel chelyabinsk chita chukotka chuvashia com dagestan e-burg edu gov grozny int irkutsk ivanovo izhevsk jar joshkar-ola kalmykia kaluga kamchatka karelia kazan kchr kemerovo khabarovsk khakassia khv kirov koenig komi kostroma kranoyarsk kuban kurgan kursk lhostIpetsk magadan mari mari-el marine mil mordovia mosreg msk murmansk nalchik net nnov nov novosibirsk nsk omsk orenburg org oryol penza perm pp pskov ptz rnd ryazan sakhalin samara saratov simbirsk smolensk spb stavropol stv surgut tambov tatarstan tom tomsk tsaritsyn tsk tula tuva tver tyumen udm udmurtia ulan-ude vladikavkaz vladimir vladivostok volgograd vologda voronezh vrn vyatka yakutia yamal yekaterinburg yuzhno-sakhalinsk',
  'rw ac co com edu gouv gov int mil net',
  'sa com edu gov med net org pub sch',
  'sd com edu gov info med net org tv',
  'se a ac b bd c d e f g h i k l m n o org p parti pp press r s t tm u w x y z',
  'sg com edu gov idn net org per',
  'sn art com edu gouv org perso univ',
  'sy com edu gov mil net news org',
  'th ac co go in mi net or',
  'tj ac biz co com edu go gov info int mil name net nic org test web',
  'tn agrinet com defense edunet ens fin gov ind info intl mincom nat net org perso rnrt rns rnu tourism',
  'tz ac co go ne or',
  'ua biz cherkassy chernigov chernovtsy ck cn co com crimea cv dn dnepropetrovsk donetsk dp edu gov if in ivano-frankivsk kh kharkov kherson khmelnitskiy kiev kirovograd km kr ks kv lg lugansk lutsk lviv me mk net nikolaev od odessa org pl poltava pp rovno rv sebastopol sumy te ternopil uzhgorod vinnica vn zaporizhzhe zhitomir zp zt',
  'ug ac co go ne or org sc',
  'uk ac bl british-library co cym gov govt icnet jet lea ltd me mil mod national-library-scotland nel net nhs nic nls org orgn parliament plc police sch scot soc',
  'us dni fed isa kids nsn',
  'uy com edu gub mil net org',
  've co com edu gob info mil net org web',
  'vi co com k12 net org',
  'vn ac biz com edu gov health info int name net org pro',
  'ye co com gov ltd me net org plc',
  'yu ac co edu gov org',
  'za ac agric alt bourse city co cybernet db edu gov grondar iaccess imt inca landesign law mil net ngo nis nom olivetti org pix school tm web',
  'zm ac co com edu gov net org sch',
  'com ar br cn de eu gb gr hu jpn kr no qc ru sa se uk us uy za',
  'net gb jp se uk',
  'org ae',
  'de com',
].flatMap((x) => {
  const [tld, ...slds] = x.split(' ')
  return slds.map(sld => [sld, tld].join('.'))
}))

/** Regular expression to extract the main components of a URI. */
// TODO: Improve unsafe regular expressions.
// eslint-disable-next-line unicorn/no-unsafe-regex, unicorn/better-regex
const URI_REGEXP = /^(?:(?<protocol>.+?):\/\/)?(?<authority>[^#\/?]+)?(?<path>[^#?]*)?(?<query>\?[^#]*)?(?<hash>#\w+)?$/

/** Regular expression to extract the userinfo and host from the authority. */
// eslint-disable-next-line unicorn/no-unsafe-regex
const URI_AUTHORITY_REGEXP = /^(?:(?<userinfo>.*?)@)?(?<host>.*)$/

/** Regular expression to extract the path components from the path. */
// eslint-disable-next-line unicorn/no-unsafe-regex
const URI_PATH_REGEXP = /^(?:(?<pathDirectory>.+)\/)?(?<pathName>[^.]+(?:\.(?<pathExtension>.*))?)$/

/** Regular expression that matches any IPv6 address. */
// eslint-disable-next-line unicorn/no-unsafe-regex
const IPV6_REGEXP = /([\d:a-f]+:+)+[\da-f]+/

/**
 * Check if a string is a valid IPv4 address.
 *
 * @param maybeIpv4 The string to check.
 * @returns `true` if the string is a valid IPv4 address, otherwise `false`.
 */
function isStringIPv4(maybeIpv4: string): boolean {
  const parts = maybeIpv4.split('.')
  if (parts.length !== 4) return false
  return parts.every(x => Number.parseInt(x) >= 0 && Number.parseInt(x) <= 255)
}

/**
 * Check if a string is a valid IPv6 address.
 *
 * @param maybeIpv6 The string to check.
 * @returns `true` if the string is a valid IPv6 address, otherwise `false`.
 */
function isStringIPv6(maybeIpv6: string): boolean {
  // eslint-disable-next-line unicorn/no-unsafe-regex
  return IPV6_REGEXP.test(maybeIpv6)
}

/**
 * Parse and extract the components from a URI string. Such as the protocol,
 * authority, host, domain, path, query, hash, etc.. The subdomain, domain and
 * top level domain are matched against a list of known TLDs so the subdomain
 * and domain can correctly be extracted. The URI can also be an IPv4 or IPv6
 * address, in which case the host will be parsed as such and the domain will
 * be undefined.
 *
 * @param uri The URI to extract components from.
 * @returns The extracted components from the URI string.
 * @example
 * const uri = 'https://www.example.com/path/to/file.html?q=search#hash'
 * const uriObject = parseUri(uri)
 *
 * uri.protocol // => 'https'
 * uri.authority // => 'www.example.com'
 * uri.origin // => 'https://www.example.com'
 * uri.userinfo // => undefined
 * uri.username // => undefined
 * uri.password // => undefined
 * uri.host // => 'www.example.com'
 * uri.hostName // => 'www.example.com'
 * uri.hostPort // => undefined
 * uri.hostPortNumber // => undefined
 * uri.hostIp // => undefined
 * uri.hostIpv4 // => undefined
 * uri.hostIpv6 // => undefined
 * uri.domain // => 'example'
 * uri.domainRoot // => 'example.com'
 * uri.domainSub // => 'www'
 * uri.domainTop // => 'com'
 * uri.domainFull // => 'www.example.com'
 * uri.path // => '/path/to/file.html'
 * uri.pathName // => 'file.html'
 * uri.pathExtension // => 'html'
 * uri.pathDirectory // => '/path/to'
 * uri.query // => '?q=search'
 * uri.hash // => '#hash'
 */
// TODO: Improve unsafe regular expressions.
export function parseUri(uri: string): UriComponents {
  // --- Extract components
  const [, protocol, authority, path, query, hash] = uri.match(URI_REGEXP) || []
  const [, userinfo, host] = authority?.match(URI_AUTHORITY_REGEXP) || []
  const [username, password] = userinfo?.split(':') || []
  const [, pathDirectory, pathName, pathExtension] = path?.match(URI_PATH_REGEXP) || []

  // --- Extract hostname and port or Ipv6
  // eslint-disable-next-line unicorn/no-unsafe-regex
  const [, hostName, maybeIpv6, hostPort] = host?.match(/^(?<hostName>[\w.-]+?|(?:\[(?<ipv6>.+)]))(?::(?<port>\d{1,5}))?$/) || []
  const hostPortNumber = hostPort ? Number.parseInt(hostPort) || undefined : undefined

  // --- Extract domain parts or IP.
  let domainTop: string | undefined
  let domainSub: string | undefined
  let domain: string | undefined
  let hostIpv4: string | undefined
  let hostIpv6: string | undefined
  let hostIp: string | undefined

  // --- Try parsing domain or IP from hostname
  if (hostName) {
    const hostNameParts = hostName.split('.')
    const maybeTld = hostNameParts?.slice(-2).join('.')

    // --- Extract IPv60
    if (isStringIPv6(hostName)) {
      hostIp = maybeIpv6
      hostIpv6 = maybeIpv6
    }

    // --- Extract IPv4.
    else if (isStringIPv4(hostName)) {
      hostIp = hostName
      hostIpv4 = hostName
    }

    // --- If exactly one part, then it's the domain.
    // eslint-disable-next-line no-empty
    else if (hostNameParts.length === 1) {}

    // --- If two parts, then it's the domain and tld.
    else if (hostNameParts.length === 2) {
      domain = hostNameParts?.[0]
      domainTop = hostNameParts?.[1]
    }

    // --- If end matches a known TLD, then it's `subdomain.domain.sld.tld`
    else if (TOP_LEVEL_DOMAINS.has(maybeTld)) {
      domainTop = maybeTld
      domainSub = hostNameParts.slice(0, -3).join('.')
      domain = hostNameParts.slice(-3, -2).join('.')
    }

    // --- Otherwise, it's `subdomain.domain.tld`
    else {
      domainTop = hostNameParts.pop() || undefined
      domain = hostNameParts.pop() || undefined
      domainSub = hostNameParts.join('.') || undefined
    }
  }

  // --- Build composite components
  const origin = [protocol, hostName].filter(Boolean).join('://') || undefined
  const domainRoot = [domain, domainTop].filter(Boolean).join('.') || undefined
  const domainFull = [domainSub, domain, domainTop].filter(Boolean).join('.') || undefined

  // --- Return all components
  return {
    protocol,
    authority,
    origin,
    userinfo,
    username,
    password,
    host,
    hostName,
    hostPort,
    hostPortNumber,
    hostIp,
    hostIpv4,
    hostIpv6,
    domain,
    domainRoot,
    domainSub,
    domainTop,
    domainFull,
    path,
    pathName,
    pathExtension,
    pathDirectory,
    query,
    hash,
  }
}

/** c8 ignore next */
if (import.meta.vitest) {
  it.each([

    ['https://user:pass@eu3.www.example.co.uk:443/path/to/file.html?query=string#hash', {
      protocol: 'https',
      authority: 'user:pass@eu3.www.example.co.uk:443',
      origin: 'https://eu3.www.example.co.uk',
      userinfo: 'user:pass',
      username: 'user',
      password: 'pass',
      host: 'eu3.www.example.co.uk:443',
      hostName: 'eu3.www.example.co.uk',
      hostPort: '443',
      hostPortNumber: 443,
      domain: 'example',
      domainRoot: 'example.co.uk',
      domainSub: 'eu3.www',
      domainTop: 'co.uk',
      domainFull: 'eu3.www.example.co.uk',
      path: '/path/to/file.html',
      pathName: 'file.html',
      pathExtension: 'html',
      pathDirectory: '/path/to',
      query: '?query=string',
      hash: '#hash',
    }],

    ['www.example.com', {
      authority: 'www.example.com',
      origin: 'www.example.com',
      host: 'www.example.com',
      hostName: 'www.example.com',
      domain: 'example',
      domainRoot: 'example.com',
      domainSub: 'www',
      domainTop: 'com',
      domainFull: 'www.example.com',
    }],

    ['user@localhost:22', {
      authority: 'user@localhost:22',
      origin: 'localhost',
      userinfo: 'user',
      username: 'user',
      host: 'localhost:22',
      hostName: 'localhost',
      hostPort: '22',
      hostPortNumber: 22,
    }],

    ['ssh://user:password@127.0.0.1:8080', {
      protocol: 'ssh',
      authority: 'user:password@127.0.0.1:8080',
      origin: 'ssh://127.0.0.1',
      userinfo: 'user:password',
      username: 'user',
      password: 'password',
      host: '127.0.0.1:8080',
      hostName: '127.0.0.1',
      hostPort: '8080',
      hostPortNumber: 8080,
      hostIp: '127.0.0.1',
      hostIpv4: '127.0.0.1',
    }],

    ['::1', {
      authority: '::1',
      host: '::1',
    }],

    ['https://[::1]:8080?q=1#hash', {
      protocol: 'https',
      authority: '[::1]:8080',
      origin: 'https://[::1]',
      host: '[::1]:8080',
      hostName: '[::1]',
      hostPort: '8080',
      hostPortNumber: 8080,
      hostIpv6: '::1',
      query: '?q=1',
      hash: '#hash',
    }],

    ['//', {
      path: '//',
      pathName: '//',
    }],

    ['//:', {
      path: '//:',
      pathName: ':',
      pathDirectory: '/',
    }],

    ['//@', {
      path: '//@',
      pathName: '@',
      pathDirectory: '/',
    }],

    ['http://', {
      protocol: 'http',
      origin: 'http',
    }],

    ['-', {
      authority: '-',
      origin: '-',
      host: '-',
      hostName: '-',
    }],

  ])('should extract the components of "%s"', (url, expected: any) => {
    const result = parseUri(url)
    for (const [key, value] of Object.entries(expected))
      expect(result).toHaveProperty(key, value)
  })
}
