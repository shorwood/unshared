export type LoggerColor =
  | [r: number, g: number, b: number]

export type LoggerSpacing =
  | [top: number, right: number, bottom: number, left: number]
  | [top: number, vertical: number, bottom: number]
  | [vertical: number, horizontal: number]
  | number
  | { top: number; right: number; bottom: number; left: number }
  | { top: number; vertical: number; bottom: number }
  | { vertical: number; horizontal: number }

export interface LoggerTextStyle {

  /** Colorize the text. */
  textColor?: LoggerColor

  /** Colorize the background. */
  backgroundColor?: LoggerColor

  /** Wrap the text with an hyperlink. */
  href?: string | URL

  /** Make the text blink. */
  isBlinking?: boolean

  /** Stylize the text as bold. */
  isBold?: boolean

  /** Stylize the text as dim. */
  isMuted?: boolean

  /** Hide the text. */
  isHidden?: boolean

  /** Invert the text. */
  isInverted?: boolean

  /** Stylize the text as italic. */
  isItalic?: boolean

  /** Stylize the text as strikethrough. */
  isStrikedthrough?: boolean

  /** Stylize the text as underline. */
  isUnderlined?: boolean
}

/**
 * Stylize a text with a given style.
 *
 * @param text The text to stylize.
 * @param style The style to apply.
 * @returns The stylized text.
 * @example createText('Hello', { bold: true, color: [1, 2, 3] }) // => "\u001B[1m\u001B[38;2;1;2;3mHello\u001B[39m\u001B[22m"
 */
export function createText(text: string, style: LoggerTextStyle = {}): string {
  if (style.backgroundColor) {
    const [r, g, b] = style.backgroundColor
    text = `\u001B[48;2;${r};${g};${b}m${text}\u001B[49m`
  }

  if (style.textColor) {
    const [r, g, b] = style.textColor
    text = `\u001B[38;2;${r};${g};${b}m${text}\u001B[39m`
  }

  if (style.href) {
    const href = style.href instanceof URL ? style.href.href : style.href
    text = `\u001B]8;;${href}\u0007${text}\u001B]8;;\u0007`
  }

  if (style.isBlinking) text = `\u001B[5m${text}\u001B[25m`
  if (style.isBold) text = `\u001B[1m${text}\u001B[22m`
  if (style.isMuted) text = `\u001B[2m${text}\u001B[22m`
  if (style.isHidden) text = `\u001B[8m${text}\u001B[28m`
  if (style.isInverted) text = `\u001B[7m${text}\u001B[27m`
  if (style.isItalic) text = `\u001B[3m${text}\u001B[23m`
  if (style.isStrikedthrough) text = `\u001B[9m${text}\u001B[29m`
  if (style.isUnderlined) text = `\u001B[4m${text}\u001B[24m`

  return text
}
