import type { Log } from './createLogger'
import type { LoggerColor } from './utils/createText'
import { LogLevel } from './createLogger'
import { formatStack } from './formatPrettyStack'
import { COLOR_PALETTE_NORD } from './utils/constants'
import { createText } from './utils/createText'

export interface LogPretty extends Log {

  /**
   * A tag to use for the log message. This is usually used to identify
   * the level of the log message. If not provided, the level will be used
   * to construct the tag.
   *
   * @example "INFO"
   */
  tag?: string

  /**
   * An RGB color to use for the background of the log message tag.
   * If not provided, the background color will be based on the log level.
   *
   * @example [0, 0, 0]
   */
  tagColor?: LoggerColor

  /**
   * A prefix character to use for the log message tag. This is usually
   * an emoji or a Nerd Font icon character.
   */
  tagIcon?: string

  /**
   * The maximum length of the scope to display in the log message.
   * If the scope is longer than this length, it will be trimmed.
   */
  scopeMaxLength?: number
}

/** Map of log levels to pretty colors. */
const LEVEL_TO_COLOR: Record<LogLevel, LoggerColor> = Object.freeze({
  [LogLevel.Debug]: COLOR_PALETTE_NORD.nord8,
  [LogLevel.Info]: COLOR_PALETTE_NORD.nord7,
  [LogLevel.Warn]: COLOR_PALETTE_NORD.nord13,
  [LogLevel.Error]: COLOR_PALETTE_NORD.nord11,
  [LogLevel.Fatal]: COLOR_PALETTE_NORD.nord11,
  [LogLevel.Audit]: COLOR_PALETTE_NORD.nord9,
})

/** Map of log levels to [Nerd Font](https://www.nerdfonts.com/) icons. */
const LEVEL_TO_ICON: Record<LogLevel, string> = Object.freeze({
  [LogLevel.Debug]: '',
  [LogLevel.Info]: '',
  [LogLevel.Warn]: '',
  [LogLevel.Error]: '',
  [LogLevel.Fatal]: '',
  [LogLevel.Audit]: '',
})

/**
 * Format a log entry in a human-readable and colorful format.
 *
 * @param entry The log entry.
 * @returns The formatted log entry.
 * @example formatPretty(entry) // DEBUG auth User logged in
 */
export function formatPretty(entry: LogPretty): string {
  const {
    level = LogLevel.Info,
    message = '',
    stack = '',
    scope = '',
    scopeMaxLength = 24,
    tag = level.toUpperCase().slice(0, 4),
    tagColor = LEVEL_TO_COLOR[level],
    tagIcon = LEVEL_TO_ICON[level],
  } = entry

  // --- Format level.
  const levelFormatted = createText(` ${tagIcon} ${tag} `, {
    backgroundColor: tagColor,
  })

  // --- Format scope. (optional)
  let scopeFormatted = ` ${scope} `.padEnd(scopeMaxLength, ' ')
  scopeFormatted = createText(scopeFormatted, { isMuted: true, isItalic: true })

  // --- Join all parts of the log entry and add the stack trace if present.
  let finalMessage = `${levelFormatted} ${scopeFormatted} ${message}`
  if (stack) finalMessage += `\n${formatStack(entry)}`
  return finalMessage
}
