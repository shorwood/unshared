import type { Syslog5424 } from './typeSyslog5424'

export namespace Journald {

  /**
   * The structured data for a journald message.
   *
   * @see https://www.freedesktop.org/software/systemd/man/latest/systemd.journal-fields.html
   */
  export interface Log {

    /**
     * The human-readable message string for this entry. This is supposed to
     * be the primary text shown to the user. It is usually not translated
     * (but might be in some cases), and is not supposed to be parsed for
     * metadata. In order to encode multiple lines in a single log entry,
     * separate them by newline characters (ASCII code 10), but encode them
     * as a single `MESSAGE=` field. Do not add multiple values of this field
     * type to the same entry (also see above), as consuming applications
     * generally do not expect this and are unlikely to show all values in
     * that case.
     *
     * @example "Hello, world!"
     * @see https://www.freedesktop.org/software/systemd/man/latest/systemd.journal-fields.html#MESSAGE=
     */
    message?: string

    /**
     * A 128-bit message identifier ID for recognizing certain message types,
     * if this is desirable. This should contain a 128-bit ID formatted as a
     * lower-case hexadecimal string, without any separating dashes or suchlike.
     * This is recommended to be a UUID-compatible ID, but this is not enforced,
     * and formatted differently. Developers can generate a new ID for this
     * purpose with **systemd-id128 new**.
     *
     * @example randomUUID()
     * @see https://www.freedesktop.org/software/systemd/man/latest/systemd.journal-fields.html#MESSAGE_ID=
     */
    messageId?: string

    /**
     * A priority value between 0 ("emerg") and 7 ("debug") formatted as a
     * decimal string. This field is compatible with syslog's priority concept.
     *
     * @example Syslog5424.Severity.Debug
     * @see https://www.freedesktop.org/software/systemd/man/latest/systemd.journal-fields.html#PRIORITY=
     */
    priority?: Syslog5424.Severity

    /**
     * The code file name where the log message originates from.
     *
     * @example "src/server.ts"
     * @see https://www.freedesktop.org/software/systemd/man/latest/systemd.journal-fields.html#CODE_FILE=
     */
    codeFile?: string

    /**
     * The code line number where the log message originates from.
     *
     * @example 42
     * @see https://www.freedesktop.org/software/systemd/man/latest/systemd.journal-fields.html#CODE_LINE=
     */
    codeLine?: number

    /**
     * The code function name where the log message originates from.
     *
     * @example "createServer"
     * @see https://www.freedesktop.org/software/systemd/man/latest/systemd.journal-fields.html#CODE_FUNC=
     */
    codeFunc?: string

    /**
     * The low-level Unix error number causing this entry, if any. Contains the
     * numeric value of [errno(3)](https://man7.org/linux/man-pages/man3/errno.3.html)
     * formatted as a decimal string.
     *
     * @example 2
     * @see https://www.freedesktop.org/software/systemd/man/latest/systemd.journal-fields.html#ERRNO=
     */
    errno?: number

    /**
     * A randomized, unique 128-bit ID identifying each runtime cycleof the unit.
     * This is different from `_SYSTEMD_INVOCATION_ID` in that it is only used for
     * messages coming from systemd code (e.g. logs from the system/user manager
     * or from forked processes performing systemd-related setup).
     *
     * @see https://www.freedesktop.org/software/systemd/man/latest/systemd.journal-fields.html#INVOCATION_ID=
     */
    invocationId?: string

    /**
     * A randomized, unique 128-bit ID identifying each runtime cycleof the unit.
     * This is different from `_SYSTEMD_INVOCATION_ID` in that it is only used for
     * messages coming from systemd code (e.g. logs from the system/user manager
     * or from forked processes performing systemd-related setup).
     *
     * @see https://www.freedesktop.org/software/systemd/man/latest/systemd.journal-fields.html#UNIT_INVOCATION_ID=
     */
    userInvocationId?: string

    syslogFacility?: Syslog5424.Facility
    syslogIdentifier?: string
    systlogPid?: number
    syslogTimestamp?: string
    syslogRaw?: string

    /**
     * A documentation URL with further information about the topic of the log message.
     * Tools such as journalctl will include a hyperlink to a URL specified this way
     * in their output. Should be an "http://", "https://", "file:/", "man:" or "info:" URL.
     *
     * @example "https://example.com/docs"
     * @see https://www.freedesktop.org/software/systemd/man/latest/systemd.journal-fields.html#DOCUMENTATION=
     */
    documentation?: string

    /**
     * The numeric thread ID (TID) the log message originates from.
     *
     * @default require('worker_threads').threadId
     * @see https://www.freedesktop.org/software/systemd/man/latest/systemd.journal-fields.html#TID=
     */
    tid?: number

    /**
     * The name of a unit. Used by the system and user managers when logging about
     * specific units.
     *
     * When `--unit=name` or `--user-unit=name` are used with [journalctl(1)](https://www.freedesktop.org/software/systemd/man/latest/journalctl.html#),
     * a match pattern that includes "UNIT=name.service" or "USER_UNIT=name.service" will be generated.
     *
     * @default process.env.SYSTEMD_ACTIVATION_UNIT
     * @see https://www.freedesktop.org/software/systemd/man/latest/systemd.journal-fields.html#UNIT=
     */
    unit?: string

    /**
     * The name of a unit. Used by the system and user managers when logging about
     * specific units.
     *
     * When `--unit=name` or `--user-unit=name` are used with [journalctl(1)](https://www.freedesktop.org/software/systemd/man/latest/journalctl.html#),
     * a match pattern that includes "UNIT=name.service" or "USER_UNIT=name.service" will be generated.
     *
     * @default process.env.USER_UNIT
     * @see https://www.freedesktop.org/software/systemd/man/latest/systemd.journal-fields.html#USER_UNIT=
     */
    userUnit?: string
  }
}
