import { COLOR_PALETTE_NORD } from '../components/constants'
import { setBackground, setDim, setItalic } from '../style'
import { Log, LogBase, LogLevel, RGB } from '../types'

export interface LogPretty extends LogBase {
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
  tagColor?: RGB
  /**
   * A prefix character to use for the log message tag. This is usually
   * an emoji or a Nerd Font icon character.
   */
  tagIcon?: string
}

/** Map of log levels to pretty colors. */
const LEVEL_TO_COLOR: Record<LogLevel, RGB> = {
  [LogLevel.Debug]: COLOR_PALETTE_NORD.nord8,
  [LogLevel.Info]: COLOR_PALETTE_NORD.nord7,
  [LogLevel.Warn]: COLOR_PALETTE_NORD.nord13,
  [LogLevel.Error]: COLOR_PALETTE_NORD.nord11,
  [LogLevel.Fatal]: COLOR_PALETTE_NORD.nord11,
  [LogLevel.Audit]: COLOR_PALETTE_NORD.nord9,
}

/** Map of log levels to [Nerd Font](https://www.nerdfonts.com/) icons. */
const LEVEL_TO_ICON: Record<LogLevel, string> = {
  [LogLevel.Debug]: '',
  [LogLevel.Info]: '',
  [LogLevel.Warn]: '',
  [LogLevel.Error]: '',
  [LogLevel.Fatal]: '',
  [LogLevel.Audit]: '',
}

/**
 * Format a log entry in a human-readable and colorful format.
 *
 * @param entry The log entry.
 * @returns The formatted log entry.
 * @example formatPretty(entry) // DEBUG auth User logged in
 */
export function formatPretty(entry: Log): string {
  const {
    level = LogLevel.Info,
    message = '',
    stack = '',
    scope = '',
    tag = level.toUpperCase().slice(0, 4),
    tagColor = LEVEL_TO_COLOR[level],
    tagIcon = LEVEL_TO_ICON[level],
  } = entry

  // --- Format level.
  let levelFormatted = ` ${tagIcon} ${tag} `
  levelFormatted = setBackground(levelFormatted, <RGB>tagColor)

  // --- Format scope. (optional)
  let scopeFormatted = ''
  scopeFormatted = ` ${scope} `
  scopeFormatted = scopeFormatted.padEnd(24, ' ')
  scopeFormatted = setDim(scopeFormatted)
  scopeFormatted = setItalic(scopeFormatted)

  // --- Join all parts of the log entry and add the stack trace if present.
  let finalMessage = `${levelFormatted} ${scopeFormatted} ${message}`
  if (stack) finalMessage += `\n${stack}`
  return finalMessage
}
