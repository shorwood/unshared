/* eslint-disable sonarjs/cognitive-complexity */
/**
 * Severity level of a Syslog message.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc5424#section-6.2.1
 */
export enum SyslogSeverity {
  /** System is unusable. */
  Emergency = 0,
  /** Action must be taken immediately. */
  Alert = 1,
  /** Critical conditions. */
  Critical = 2,
  /** Error conditions. */
  Error = 3,
  /** Warning conditions. */
  Warning = 4,
  /** Normal but significant condition. */
  Notice = 5,
  /** Informational messages. */
  Informational = 6,
  /** Debug-level messages. */
  Debug = 7,
}

/**
 * Facility of a Syslog message.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc5424#section-6.2.1
 */
export enum SyslogFacility {
  /** Kernel messages. */
  Kernel = 0,
  /** User-level messages. */
  User = 1,
  /** Mail system. */
  Mail = 2,
  /** System daemons. */
  Daemon = 3,
  /** Security/authorization messages. */
  AuthPriv = 4,
  /** Messages generated internally by syslogd. */
  Syslog = 5,
  /** Line printer subsystem. */
  Printer = 6,
  /** Network news subsystem. */
  News = 7,
  /** UUCP subsystem. */
  UUCP = 8,
  /** Clock daemon. */
  Clock = 9,
  /** Security/authorization messages. */
  Security = 10,
  /** FTP daemon. */
  FTP = 11,
  /** NTP subsystem. */
  NTP = 12,
  /** Log audit. */
  Audit = 13,
  /** Log alert. */
  Alert=14,
  /** Clock daemon. */
  Clock2= 15,
  /** Local use 0. */
  Local0 = 16,
  /** Local use 1. */
  Local1 = 17,
  /** Local use 2. */
  Local2 = 18,
  /** Local use 3. */
  Local3 = 19,
  /** Local use 4. */
  Local4 = 20,
  /** Local use 5. */
  Local5 = 21,
  /** Local use 6. */
  Local6 = 22,
  /** Local use 7. */
  Local7 = 23,
}

/**
 * A Syslog structured data element.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc5424#section-7
 */
export interface SyslogStructuredData {
  /**
   * The SD-ID "timeQuality" MAY be used by the originator to describe its
   * notion of system time. This SD-ID SHOULD be written if the
   * originator is not properly synchronized with a reliable external time
   *
   * correct. The main use of this structured data element is to provide
   * some information on the level of trust it has in the TIMESTAMP
   * described in Section 6.2.3. All parameters are OPTIONAL.
   *
   * @see https://datatracker.ietf.org/doc/html/rfc5424#section-7.1
   */
  timeQuality?: {
    /**
     * The "tzKnown" parameter indicates whether the originator knows its
     * time zone. If it does, the value "1" MUST be used. If the time zone
     * information is in doubt, the value "0" MUST be used. If the
     * originator knows its time zone but decides to emit time in UTC, the
     * value "1" MUST be used (because the time zone is known).
     *
     * @see https://datatracker.ietf.org/doc/html/rfc5424#section-7.1.1
     */
    tzKnown?: boolean
    /**
     * The "isSynced" parameter indicates whether the originator is
     * synchronized to a reliable external time source, e.g., via NTP. If
     * the originator is time synchronized, the value "1" MUST be used. If
     * not, the value "0" MUST be used.
     *
     * @see https://datatracker.ietf.org/doc/html/rfc5424#section-7.1.2
     */
    isSynced?: boolean
    /**
     * The "syncAccuracy" parameter indicates how accurate the originator
     * thinks its time synchronization is. It is an integer describing the
     * maximum number of microseconds that its clock may be off between
     * synchronization intervals.
     *
     * If the value "0" is used for "isSynced", this parameter MUST NOT be
     * specified. If the value "1" is used for "isSynced" but the
     * "syncAccuracy" parameter is absent, a collector or relay can assume
     * that the time information provided is accurate enough to be
     * considered correct. The "syncAccuracy" parameter MUST be written
     * only if the originator actually has knowledge of the reliability of
     * the external time source. In most cases, it will gain this in-depth
     * knowledge through operator configuration.
     *
     * @see https://datatracker.ietf.org/doc/html/rfc5424#section-7.1.3
     */
    syncAccuracy?: number
  }

  /**
   * The SD-ID "origin" MAY be used to indicate the origin of a syslog
   * message. The following parameters can be used. All parameters are
   * OPTIONAL.
   *
   * Specifying any of these parameters is primarily an aid to log
   * analyzers and similar applications.
   *
   * @see https://datatracker.ietf.org/doc/html/rfc5424#section-7.2
   */
  origin?: {
    /**
     * The `ip` parameter denotes an IP address that the originator knows it
     * had at the time of originating the message. It MUST contain the
     * textual representation of an IP address as outlined in
     * [Section 6.2.4](https://datatracker.ietf.org/doc/html/rfc5424#section-6.2.4).
     *
     * This parameter can be used to provide identifying information in
     * addition to what is present in the HOSTNAME field. It might be
     * especially useful if the host's IP address is included in the message
     * while the HOSTNAME field still contains the FQDN. It is also useful
     * for describing all IP addresses of a multihomed host.
     *
     * If an originator has multiple IP addresses, it MAY either list one of
     * its IP addresses in the `ip` parameter or it MAY include multiple
     * `ip` parameters in a single "origin" structured data element.
     *
     * @see https://datatracker.ietf.org/doc/html/rfc5424#section-7.2.1
     * @example "192.168.1.1"
     */
    ip?: string | string[]
    /**
     * The "enterpriseId" parameter MUST be a 'SMI Network Management
     * Private Enterprise Code', maintained by IANA, whose prefix is
     * iso.org.dod.internet.private.enterprise (1.3.6.1.4.1). The number
     * that follows MUST be unique and MUST be registered with IANA as per
     * RFC 2578. An enterprise is only authorized to assign
     * values within the iso.org.dod.internet.private.enterprise.<private
     * enterprise number> subtree assigned by IANA to that enterprise. The
     * enterpriseId MUST contain only a value from the
     * iso.org.dod.internet.private.enterprise.<private enterprise number>
     * subtree. In general, only the IANA-assigned private enterprise
     * number is needed (a single number). An enterprise might decide to
     * use sub-identifiers below its private enterprise number. If sub-
     * identifiers are used, they MUST be separated by periods and be
     * represented as decimal numbers. An example for that would be
     * "32473.1.2". Please note that the ID "32473.1.2" is just an example
     * and MUST NOT be used. The complete up-to-date list of Private
     * Enterprise Numbers (PEN) is maintained by IANA.
     *
     * By specifying a private enterprise number, the vendor allows more
     * specific processing of the message.
     *
     * @see https://datatracker.ietf.org/doc/html/rfc5424#section-7.2.2
     * @see https://www.iana.org/assignments/enterprise-numbers.txt
     * @example "12345"
     */
    enterpriseId?: number | string
    /**
     * The "software" parameter uniquely identifies the software that
     * generated the message. If it is used, "enterpriseId" SHOULD also be
     * specified, so that a specific vendor's software can be identified.
     * The "software" parameter is not the same as the APP-NAME header
     * field. It MUST always contain the name of the generating software,
     * whereas APP-NAME can contain anything else, including an operator-
     * configured value.
     *
     * The "software" parameter is a string. It MUST NOT be longer than 48
     * characters.
     *
     * @see https://datatracker.ietf.org/doc/html/rfc5424#section-7.2.3
     * @example "ACME Product"
     */
    software?: string
    /**
     * The "swVersion" parameter uniquely identifies the version of the
     * software that generated the message. If it is used, the "software"
     * and "enterpriseId" parameters SHOULD be provided, too.
     *
     * The "swVersion" parameter is a string. It MUST NOT be longer than 32
     * characters.
     *
     * @see https://datatracker.ietf.org/doc/html/rfc5424#section-7.2.4
     * @example "1.0.0"
     */
    swVersion?: string
  }

  /**
   * The SD-ID "meta" MAY be used to provide meta-information about the
   * message. The following parameters can be used. All parameters are
   * OPTIONAL. If the "meta" SD-ID is used, at least one parameter SHOULD
   * be specified.
   *
   * @see https://datatracker.ietf.org/doc/html/rfc5424#section-7.3
   */
  meta?: {
    /**
     * The "sequenceId" parameter tracks the sequence in which the
     * originator submits messages to the syslog transport for sending. It
     * is an integer that MUST be set to 1 when the syslog function is
     * started and MUST be increased with every message up to a maximum
     * value of 2147483647. If that value is reached, the next message MUST
     * be sent with a sequenceId of 1.
     *
     * @see https://datatracker.ietf.org/doc/html/rfc5424#section-7.3.1
     * @example 123456789
     */
    sequenceId?: number
    /**
     * The "sysUpTime" parameter MAY be used to include the SNMP "sysUpTime"
     * parameter in the message. Its syntax and semantics are as defined in
     * [RFC3418].
     *
     * As syslog does not support the SNMP "INTEGER" syntax directly, the
     * value MUST be represented as a decimal integer (no decimal point)
     * using only the characters "0", "1", "2", "3", "4", "5", "6", "7",
     * "8", and "9".
     *
     * Note that the semantics in RFC 3418 are "The time (in hundredths of a
     * second) since the network management portion of the system was last
     * re-initialized." This of course relates to the SNMP-related
     * management portion of the system, which MAY be different than the
     * syslog-related management portion of the system.
     */
    sysUpTime?: number
    /**
     * The "language" parameter MAY be specified by the originator to convey
     * information about the natural language used inside MSG. If it is
     * specified, it MUST contain a language identifier as defined in BCP 47
     * [RFC4646].
     */
    language?: string
  }
}

/**
 * An interface for the Syslog IETF message as defined in RFC 5424.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc5424
 */
export interface Syslog {
  /**
   * The Priority value is calculated by first multiplying the Facility
   * number by 8 and then adding the numerical value of the Severity.  For
   * example, a kernel message (Facility=0) with a Severity of Emergency
   * (Severity=0) would have a Priority value of 0.  Also, a "local use 4"
   * message (Facility=20) with a Severity of Notice (Severity=5) would
   * have a Priority value of 165.  In the PRI of a syslog message, these
   * values would be placed between the angle brackets as <0> and <165>
   * respectively.  The only time a value of "0" follows the "<" is for
   * the Priority value of "0".  Otherwise, leading "0"s MUST NOT be used.
   *
   * If not provided, the priority will be calculated from the facility and
   * severity properties. And if those are not provided, the priority will
   * be set to `0`.
   *
   * @see https://datatracker.ietf.org/doc/html/rfc5424#section-6.2.1
   * @default 0
   */
  priority?: number
  /**
   * The facility of the message.
   *
   * @see https://datatracker.ietf.org/doc/html/rfc5424#section-6.2.1
   */
  facility?: SyslogFacility
  /**
   * The severity of the message.
   *
   * @see https://datatracker.ietf.org/doc/html/rfc5424#section-6.2.1
   */
  severity?: SyslogSeverity
  /**
   * The VERSION field denotes the version of the syslog protocol
   * specification. The version number MUST be incremented for any new
   * syslog protocol specification that changes any part of the HEADER
   * format. Changes include the addition or removal of fields, or a
   * change of syntax or semantics of existing fields. This document uses
   * a VERSION value of "1". The VERSION values are IANA-assigned
   * (Section 9.1) via the Standards Action method as described in
   * [RFC5226].
   *
   * @see https://datatracker.ietf.org/doc/html/rfc5424#section-6.2.2
   * @default 1
   */
  version?: 1
  /**
   * The TIMESTAMP field is a formalized timestamp derived from [RFC3339].
   *
   * Whereas [RFC3339] makes allowances for multiple syntaxes, this
   * document imposes further restrictions.  The TIMESTAMP value MUST
   * follow these restrictions:
   *
   * - The "T" and "Z" characters in this syntax MUST be upper case.
   * - Usage of the "T" character is REQUIRED.
   * - Leap seconds MUST NOT be used.
   *
   * The originator SHOULD include TIME-SECFRAC if its clock accuracy and
   * performance permit. The "timeQuality" SD-ID described in Section 7.1
   * allows the originator to specify the accuracy and trustworthiness of
   * the timestamp.
   *
   * A syslog application MUST use the NILVALUE as TIMESTAMP if the syslog
   * application is incapable of obtaining system time.
   *
   * @see https://datatracker.ietf.org/doc/html/rfc5424#section-6.2.3
   * @default new Date()
   */
  timestamp?: string | Date
  /**
   * The HOSTNAME field identifies the machine that originally sent the
   * syslog message.
   *
   * The HOSTNAME field SHOULD contain the hostname and the domain name of
   * the originator in the format specified in STD 13 [RFC1034].  This
   * format is called a Fully Qualified Domain Name (FQDN) in this
   * document.
   *
   * In practice, not all syslog applications are able to provide an FQDN.
   * As such, other values MAY also be present in HOSTNAME.  This document
   * makes provisions for using other values in such situations.  A syslog
   * application SHOULD provide the most specific available value first.
   * The order of preference for the contents of the HOSTNAME field is as
   * follows:
   *
   * - 1. FQDN
   * - 2. Static IP address
   * - 3. hostname
   * - 4. Dynamic IP address
   * - 5. the NILVALUE
   *
   * If an IPv4 address is used, it MUST be in the format of the dotted
   * decimal notation as used in STD 13 [RFC1035]. If an IPv6 address is
   * used, a valid textual representation as described in [RFC4291],
   * Section 2.2, MUST be used.
   *
   * Syslog applications SHOULD consistently use the same value in the
   * HOSTNAME field for as long as possible.
   *
   * The NILVALUE SHOULD only be used when the syslog application has no
   * way to obtain its real hostname.  This situation is considered highly
   * unlikely.
   *
   * @see https://datatracker.ietf.org/doc/html/rfc5424#section-6.2.4
   * @default '-'
   */
  hostname?: string
  /**
   * The APP-NAME field SHOULD identify the device or application that
   * originated the message.  It is a string without further semantics.
   * It is intended for filtering messages on a relay or collector.
   *
   * The NILVALUE MAY be used when the syslog application has no idea of
   * its APP-NAME or cannot provide that information.  It may be that a
   * device is unable to provide that information either because of a
   * local policy decision, or because the information is not available,
   * or not applicable, on the device.
   *
   * @see https://datatracker.ietf.org/doc/html/rfc5424#section-6.2.5
   * @default '-'
   */
  applicationName?: string
  /**
   * `PROCID` is a value that is included in the message, having no
   * interoperable meaning, except that a change in the value indicates
   * there has been a discontinuity in syslog reporting.  The field does
   * not have any specific syntax or semantics; the value is
   * implementation-dependent and/or operator-assigned.  The NILVALUE MAY
   * be used when no value is provided.
   *
   * The `PROCID` field is often used to provide the process name or process
   * ID associated with a syslog system.  The NILVALUE might be used when
   * a process ID is not available.  On an embedded system without any
   * operating system process ID, `PROCID` might be a reboot ID.
   *
   * `PROCID` can enable log analyzers to detect discontinuities in syslog
   * reporting by detecting a change in the syslog process ID.  However,
   * `PROCID` is not a reliable identification of a restarted process since
   * the restarted syslog process might be assigned the same process ID as
   * the previous syslog process.
   *
   * `PROCID` can also be used to identify which messages belong to a group
   * of messages.  For example, an SMTP mail transfer agent might put its
   * SMTP transaction ID into `PROCID`, which would allow the collector or
   * relay to group messages based on the SMTP transaction.
   *
   * @see https://datatracker.ietf.org/doc/html/rfc5424#section-6.2.6
   * @default '-'
   */
  processId?: string | number
  /**
   * The MSGID SHOULD identify the type of message.  For example, a
   * firewall might use the MSGID "TCPIN" for incoming TCP traffic and the
   * MSGID "TCPOUT" for outgoing TCP traffic.  Messages with the same
   * MSGID should reflect events of the same semantics.  The MSGID itself
   * is a string without further semantics.  It is intended for filtering
   * messages on a relay or collector.
   *
   *  The NILVALUE SHOULD be used when the syslog application does not, or
   *  cannot, provide any value.
   *
   *  This field MAY be operator-assigned.
   *
   * @default '-'
   */
  messageId?: string
  /**
   * STRUCTURED-DATA provides a mechanism to express information in a well
   * defined, easily parseable and interpretable data format.  There are
   * multiple usage scenarios.  For example, it may express meta-
   * information about the syslog message or application-specific
   * information such as traffic counters or IP addresses.
   *
   * STRUCTURED-DATA can contain zero, one, or multiple structured data
   * elements, which are referred to as "SD-ELEMENT" in this document.
   *
   * In case of zero structured data elements, the STRUCTURED-DATA field
   * MUST contain the NILVALUE.
   *
   * The character set used in STRUCTURED-DATA MUST be seven-bit ASCII in
   * an eight-bit field as described in [RFC5234].  These are the ASCII
   * codes as defined in "USA Standard Code for Information Interchange"
   * [ANSI.X3-4.1968].  An exception is the PARAM-VALUE field (see
   * Section 6.3.3), in which UTF-8 encoding MUST be used.
   *
   * A collector MAY ignore malformed STRUCTURED-DATA elements.  A relay
   * MUST forward malformed STRUCTURED-DATA without any alteration.
   */
  structuredData?: SyslogStructuredData | Record<string, string>
  /**
   * The MSG part contains a free-form message that provides information
   * about the event.
   *
   * The character set used in MSG SHOULD be UNICODE, encoded using UTF-8
   * as specified in [RFC3629].  If the syslog application cannot encode
   * the MSG in Unicode, it MAY use any other encoding.
   *
   * The syslog application SHOULD avoid octet values below 32 (the
   * traditional US-ASCII control character range except DEL).  These
   * values are legal, but a syslog application MAY modify these
   * characters upon reception.  For example, it might change them into an
   * escape sequence (e.g., value 0 may be changed to "\0").  A syslog
   * application SHOULD NOT modify any other octet values.
   *
   * If a syslog application encodes MSG in UTF-8, the string MUST start
   * with the Unicode byte order mask (BOM), which for UTF-8 is ABNF
   * %xEF.BB.BF.  The syslog application MUST encode in the "shortest
   * form" and MAY use any valid UTF-8 sequence.
   */
  message: string
}

/**
 * Format a Syslog message from the given metadata. The resulting message
 * is formatted according to the [RFC 5424](https://datatracker.ietf.org/doc/html/rfc5424) specifications.
 *
 * @param log The metadata of the message.
 * @returns The formatted message as a string.
 * @example formatSyslog({ message: 'Hello, world!' }) // '<14>1 2021-09-01T00:00:00.000Z - - - - Hello, world!'
 */
export function formatSyslog(log: Syslog): string {
  // --- Destructure and default the metadata.
  const {
    severity = 0,
    facility = 0,
    priority = (facility * 8 + severity),
    version = 1,
    timestamp = new Date(),
    hostname = '-',
    applicationName = '-',
    processId = '-',
    messageId = '-',
    structuredData = {},
    message,
  } = log

  // --- Compute the HEADER part of the message.
  const pri = priority < 0 ? 0 : priority
  const timestampIso = timestamp instanceof Date ? timestamp.toISOString() : timestamp
  const header = `<${pri}>${version} ${timestampIso} ${hostname} ${applicationName} ${processId} ${messageId}`

  // --- Compute the STRUCTURED-DATA part of the message.
  const structuredDataParts: string[] = []
  for (const id in structuredData) {
    // @ts-expect-error: ignore
    const data = structuredData[id]
    const dataParts: string[] = []

    // --- Iterate over the data and format it.
    for (const name in data) {
      const value = data[name]
      const valueString = typeof value === 'boolean' ? (value ? '1' : '0') : String(value)
      const valueStringEscaped = valueString
        .replace(/\\/g, '\\\\')
        .replace(/]/g, '\\]')
        .replace(/"/g, '\\"')
        .replace('\\0', '\\\\0')
      const dataPart = `${name}="${valueStringEscaped}"`
      dataParts.push(dataPart)
    }

    if (dataParts.length === 0) continue
    const dataString = dataParts.join(' ')
    const structuredDataString = `[${id} ${dataString}]`
    structuredDataParts.push(structuredDataString)
  }

  // --- Format the structured data.
  const sd = structuredDataParts.length > 0
    ? structuredDataParts.join('')
    : '-'

  // --- Finally, compute the full message and return it.
  return `${header} ${sd} ${message}`
}
