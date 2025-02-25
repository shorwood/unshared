import type { Log } from './createLogger'
import type { Journald } from './utils'
import { LogLevel } from './createLogger'
import { LEVEL_TO_FACILITY, LEVEL_TO_SEVERITY } from './formatSyslog5424'

/**
 * An interface for the Syslog IETF message as defined in
 * [RFC 5424](https://datatracker.ietf.org/doc/html/rfc5424)
 */
export interface LogJournald extends Journald.Log, Log {}

/**
 * Format a Journald message from the given metadata.
 *
 * @param log The full message data to format.
 * @returns The string representation of the message in Journald format.
 * @example formatJournald({ message: 'Hello, world!' }) // 'MESSAGE=Hello, world!'
 */
export function formatJournald(log: LogJournald): string {
  const {
    level = LogLevel.Info,
    message,
    messageId,
    priority = LEVEL_TO_SEVERITY[level],
    codeFile,
    codeLine,
    codeFunc,
    errno,
    invocationId,
    userInvocationId,
    syslogFacility = LEVEL_TO_FACILITY[level],
    syslogIdentifier,
    systlogPid,
    syslogTimestamp,
    syslogRaw,
    documentation,
    tid,
    unit,
    userUnit,
  } = log

  const fields: Record<string, number | string | undefined> = {
    MESSAGE: message,
    MESSAGE_ID: messageId,
    PRIORITY: priority,
    CODE_FILE: codeFile,
    CODE_LINE: codeLine,
    CODE_FUNC: codeFunc,
    ERRNO: errno,
    INVOCATION_ID: invocationId,
    USER_INVOCATION_ID: userInvocationId,
    SYSLOG_FACILITY: syslogFacility,
    SYSLOG_IDENTIFIER: syslogIdentifier,
    SYSLOG_PID: systlogPid,
    SYSLOG_TIMESTAMP: syslogTimestamp,
    SYSLOG_RAW: syslogRaw,
    DOCUMENTATION: documentation,
    TID: tid,
    UNIT: unit,
    USER_UNIT: userUnit,
  }

  return Object.entries(fields)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n')
}
