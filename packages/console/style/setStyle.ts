import { RGB } from '../types'
import { setBackground } from './setBackground'
import { setBlink } from './setBlink'
import { setBold } from './setBold'
import { setColor } from './setColor'
import { setDim } from './setDim'
import { setHidden } from './setHidden'
import { setInvert } from './setInvert'
import { setItalic } from './setItalic'
import { setLink } from './setLink'
import { setStrike } from './setStrike'
import { setUnderline } from './setUnderline'

export interface Style {
  /** Colorize the background. */
  background?: RGB
  /** Make the text blink. */
  blink?: boolean
  /** Stylize the text as bold. */
  bold?: boolean
  /** Colorize the text. */
  color?: RGB
  /** Stylize the text as dim. */
  dim?: boolean
  /** Hide the text. */
  hidden?: boolean
  /** Invert the text. */
  invert?: boolean
  /** Stylize the text as italic. */
  italic?: boolean
  /** Wrap the text with an hyperlink. */
  link?: string | URL
  /** Stylize the text as strikethrough. */
  strike?: boolean
  /** Stylize the text as underline. */
  underline?: boolean
}

/**
 * Stylize a text with a given style.
 *
 * @param text The text to stylize.
 * @param style The style to apply.
 * @returns The stylized text.
 * @example setStyle('Hello', { bold: true, color: [1, 2, 3] }) // => "\u001B[1m\u001B[38;2;1;2;3mHello\u001B[39m\u001B[22m"
 */
export function setStyle(text: string, style: Style): string {
  if (style.background) text = setBackground(text, style.background)
  if (style.blink) text = setBlink(text)
  if (style.bold) text = setBold(text)
  if (style.color) text = setColor(text, style.color)
  if (style.dim) text = setDim(text)
  if (style.hidden) text = setHidden(text)
  if (style.invert) text = setInvert(text)
  if (style.italic) text = setItalic(text)
  if (style.link) text = setLink(text, style.link)
  if (style.strike) text = setStrike(text)
  if (style.underline) text = setUnderline(text)
  return text
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should stylize a text', () => {
    const result = setStyle('Hello', {
      bold: true,
      blink: true,
      color: [1, 2, 3],
      background: [4, 5, 6],
      dim: true,
      hidden: true,
      invert: true,
      italic: true,
      link: 'https://example.com',
      strike: true,
      underline: true,
    })
    const expected = [
      '\u001B[1m',
      '\u001B[5m',
      '\u001B[38;2;1;2;3m',
      '\u001B[48;2;4;5;6m',
      '\u001B[2m',
      '\u001B[8m',
      '\u001B[7m',
      '\u001B[3m',
      '\u001B[9m',
      '\u001B[4m',
      '\u001B[22m',
      '\u001B[28m',
      'Hello',
      '\u001B[29m',
      '\u001B[24m',
      '\u001B[27m',
      '\u001B[39m',
      '\u001B[49m',
      '\u001B[22m',
      '\u001B[25m',
    ].join('')

    expect(result).toEqual(expected)
  })
}
