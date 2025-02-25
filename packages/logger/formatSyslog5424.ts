/* eslint-disable sonarjs/no-nested-conditional */
import type { Log } from './createLogger'
import { LogLevel } from './createLogger'
import { Syslog5424 } from './utils/typeSyslog5424'

/**
 * An interface for the Syslog IETF message as defined in
 * [RFC 5424](https://datatracker.ietf.org/doc/html/rfc5424)
 */
export interface LogSyslog5424 extends Syslog5424.Log, Log {}

/** A map of the levels to their corresponding Syslog severity. */
export const LEVEL_TO_SEVERITY: Record<LogLevel, Syslog5424.Severity> = {
  [LogLevel.Debug]: Syslog5424.Severity.Debug,
  [LogLevel.Info]: Syslog5424.Severity.Informational,
  [LogLevel.Warn]: Syslog5424.Severity.Warning,
  [LogLevel.Error]: Syslog5424.Severity.Error,
  [LogLevel.Fatal]: Syslog5424.Severity.Emergency,
  [LogLevel.Audit]: Syslog5424.Severity.Informational,
}

/** A map of the levels to their corresponding Syslog facility. */
export const LEVEL_TO_FACILITY: Record<LogLevel, Syslog5424.Facility> = {
  [LogLevel.Debug]: Syslog5424.Facility.User,
  [LogLevel.Info]: Syslog5424.Facility.User,
  [LogLevel.Warn]: Syslog5424.Facility.User,
  [LogLevel.Error]: Syslog5424.Facility.User,
  [LogLevel.Fatal]: Syslog5424.Facility.User,
  [LogLevel.Audit]: Syslog5424.Facility.Audit,
}

/**
 * Format a Syslog message from the given metadata. The resulting message
 * is formatted according to the [RFC 5424](https://datatracker.ietf.org/doc/html/rfc5424) specifications.
 *
 * @param log The full message data to format.
 * @returns The string representation of the message in Syslog format.
 * @example formatSyslog5424({ message: 'Hello, world!' }) // '<14>1 - - - - - - Hello, world!'
 */
export function formatSyslog5424(log: LogSyslog5424): string {
  const {
    message = '',
    messageId = '-',
    level = LogLevel.Info,
    severity = LEVEL_TO_SEVERITY[level],
    facility = LEVEL_TO_FACILITY[level],
    priority = (facility * 8 + severity),
    version = 1,
    timestamp = '-',
    hostname = '-',
    applicationName = '-',
    processId = '-',
    structuredData = {},
  } = log

  // --- Compute the HEADER part of the message.
  const pri = Math.max(priority, 0)
  const header = `<${pri}>${version} ${timestamp} ${hostname} ${applicationName} ${processId} ${messageId}`

  // --- Compute the STRUCTURED-DATA part of the message.
  const structuredDataParts: string[] = []
  for (const id in structuredData) {
    const data = structuredData[id]
    const dataParts: string[] = []

    // --- Format and escape the values according to RFC 5424 specifications.
    for (const name in data) {
      const value = data[name]
      const valueString = typeof value === 'boolean' ? (value ? '1' : '0') : String(value)
      const valueStringEscaped = valueString
        .replaceAll('\\', String.raw`\\`)
        .replaceAll(']', String.raw`\]`)
        .replaceAll('"', String.raw`\"`)
        .replace(String.raw`\0`, String.raw`\\0`)
      const dataPart = `${name}="${valueStringEscaped}"`
      dataParts.push(dataPart)
    }

    // --- If there is no data, skip this SD-ID.
    if (dataParts.length === 0) continue
    const dataString = dataParts.join(' ')

    // --- Compute the SD-ID according to RFC 54254 specifications.
    const isReserved = ['timeQuality', 'origin', 'meta'].includes(id)
    const structuredDataString = isReserved
      ? `[${id} ${dataString}]`
      : `[${id}@${structuredData.origin?.enterpriseId ?? 0} ${dataString}]`

    structuredDataParts.push(structuredDataString)
  }

  // --- Format the structured data.
  const sd = structuredDataParts.length > 0
    ? structuredDataParts.join('')
    : '-'

  // --- Finally, compute the full message and return it.
  return `${header} ${sd} ${message}`
}
