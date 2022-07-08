import { isStringIpv4, isStringIpv6 } from '../predicate'

/** List of second level domains.
 * Taken from `medialize/URI.js`
 * @see https://github.com/medialize/URI.js/blob/gh-pages/src/SecondLevelDomains.js#L34
 */
const tld = new Set<string>([
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
 * Extract components from a URL
 * @param {string} uri The URL to extract components from
 * @returns {object} An object with the following properties:
 * - `protocol`: The protocol (e.g. `http`)
 * - `authority`: The authority (e.g. `user:pass@www.example.com:443`)
 * - `origin`: The origin (e.g. `http://www.example.com`)

 * - `userinfo`: The userinfo (e.g. `user:pass`)
 * - `username`: The username (e.g. `user`)
 * - `password`: The password (e.g. `pass`)
 *
 * - `host`: The host (e.g. `www.example.com:433`)
 * - `hostName`: The host name (e.g. `www.example.com`)
 * - `hostPort`: The host port (e.g. `443`)
 * - `hostPortNumber`: The host port as a number (e.g. `433`)
 * - `hostIp`: The host IP (e.g. `127.0.0.1`)
 * - `hostIpv4`: The host IP as an IPv4 address (e.g. `127.0.0.1`)
 * - `hostIpv6`: The host IP as an IPv6 address (e.g. `::1`)
 *
 * - `domain`: The domain name (e.g. `example`)
 * - `domainRoot`: The root domain (e.g. `example.com`)
 * - `domainSub`: The subdomain (e.g. `www`)
 * - `domainTop`: The top level domain (e.g. `com`)
 *
 * - `path`: The path (e.g. `/path/to/file.html`)
 * - `pathName`: The path name (e.g. `file.html`)
 * - `pathExtension`: The path extension (e.g. `html`)
 * - `pathDirectory`: The path directory (e.g. `/path/to`)
 *
 * - `query`: The search query (e.g. `?q=search`)
 * - `hash`: The hash (e.g. `#hash`)
 *
 * - `uri`: The URI
 * - `url`: The URL
 * - `urn`: The URN
 *
 * @see https://imgur.com/a/59kk6st
 * @see https://developer.mozilla.org/en-US/docs/Web/API/URL
 */
export const parseUri = (uri: string): UriComponents => {
  // --- Extract components
  const [, protocol, authority, path, query, hash] = uri.match(/^(?:(?<protocol>.+?):\/\/)?(?<authority>[^#/?]+)?(?<path>[^#?]*)?(?<query>\?[^#]*)?(?<hash>#\w+)?$/) || []

  // --- Extract userinfo and host
  const [, userinfo, host] = authority?.match(/^(?:(?<userinfo>.*?)@)?(?<host>.*)$/) || []

  // --- Extract username and password
  const [username, password] = userinfo?.split(':') || []

  // --- Extract path components
  const [, pathDirectory, pathName, pathExtension] = path?.match(/^(?:(?<pathDirectory>.+)\/)?(?<pathName>[^.]+(?:\.(?<pathExtension>.*))?)$/) || []

  // --- Extract hostname and port or Ipv6
  const [, hostName, maybeIpv6, hostPort] = host?.match(/^(?<hostName>[\w.-]+?|(?:\[(?<ipv6>.+)]))(?::(?<port>\d{1,5}))?$/) || []
  const hostPortNumber = hostPort ? Number.parseInt(hostPort) || undefined : undefined

  // --- Extract domain parts or IP.
  let domainTop: string | undefined
  let domainSub: string | undefined
  let domain: string | undefined
  let hostIpv4: string | undefined
  let hostIpv6: string | undefined
  let hostIp: string | undefined

  // --- If hostname is an IPv6 address, set hostIpv6 and hostIp
  if (isStringIpv6(maybeIpv6)) {
    hostIpv6 = maybeIpv6
  }

  // --- Try parsing domain or IP.
  else if (hostName) {
    // --- Get parts of host name.
    const hostNameParts = hostName.split('.')
    const maybeTld = hostNameParts?.slice(-2).join('.')

    // --- If hostname is an IPv4 address, set hostIpv4 and hostIp
    if (isStringIpv4(hostName)) {
      hostIpv4 = hostName
      hostIp = hostName
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
    else if (tld.has(maybeTld)) {
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

  const origin = [protocol, hostName].filter(Boolean).join('://') || undefined
  const domainRoot = [domain, domainTop].filter(Boolean).join('.') || undefined
  const domainFull = [domainSub, domain, domainTop].filter(Boolean).join('.') || undefined

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
