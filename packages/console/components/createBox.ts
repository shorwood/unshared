import { escapeAnsiSequences } from '@unshared/string/escapeAnsiSequences'
import { setColor } from '../style'
import { setSpacing } from '../style/setSpacing'
import { RGB } from '../types'
import { BORDER_STYLES } from './constants'

export interface BoxOptions {
  /**
   * The width of the box. If a line is longer than the width, it will be
   * wrapped to the next line. You can also set this to 0 to automatically
   * calculate the width based on the longest line and the terminal width.
   *
   * @default 0
   */
  width?: number
  /**
   * The height of the box.
   *
   * @default 0
   */
  height?: number
  /**
   * The minimum width of the box. If provided, the box will be at least this
   * wide, even if the content is shorter.
   *
   * @default 0
   */
  minWidth?: number
  /**
   * The minimum height of the box. If provided, the box will be at least this
   * tall, even if the content is shorter.
   *
   * @default 0
   */
  minHeight?: number
  /**
   * The maximum width of the box. If provided, the box will be at most this
   * wide, even if the content is longer. If the content is longer than the
   * maximum width, the text will be handled based on the `overflow` option.
   *
   * @default process.stdout.columns
   */
  maxWidth?: number
  /**
   * The maximum height of the box. If provided, the box will be at most this
   * tall, even if the content is longer. If the content is longer than the
   * maximum height, it will be truncated.
   *
   * @default Number.POSITIVE_INFINITY
   */
  maxHeight?: number
  /**
   * The padding to apply to the box. Can be a single number to apply to all
   * sides, or an array of numbers to apply to each side individually.
   */
  padding?: number | [w: number, h: number] | [top: number, right: number, bottom: number, left: number]
  /**
   * The margin to apply to the box. Can be a single number to apply to all
   * sides, or an array of numbers to apply to each side individually.
   * Margins are applied outside of the box border.
   */
  margin?: number | [w: number, h: number] | [top: number, right: number, bottom: number, left: number]
  /**
   * The color of the box border. If not provided, the border will be the same
   * color as the text.
   */
  borderColor?: RGB
  /**
   * The padding to apply to the box. Can be a single number to apply to all
   * sides, or an array of numbers to apply to each side individually.
   *
   * @default 0
   */
  borderStyle?: keyof typeof BORDER_STYLES
  /**
   * Defines how to handle text that overflows the maximum width of the box.
   * This parameter is similar to the `text-overflow` CSS property.
   *
   * @default 'wrap'
   */
  overflow?: 'wrap' | 'hidden' | 'ellipsis'
}

/**
 * Wrap a string in a box.
 *
 * @param text The string to wrap.
 * @param options The box options.
 * @returns The wrapped string.
 */
export function createBox(text: string, options: BoxOptions = {}): string {
  const {
    width = 0,
    height = 0,
    minWidth = 0,
    minHeight = 0,
    maxWidth = width ?? process.stdout.columns,
    maxHeight = height ?? Number.POSITIVE_INFINITY,
    margin = 0,
    padding = 0,
    borderColor,
    borderStyle: style = 'full',
    overflow = 'hidden',
  } = options

  // --- Prepare the box borders.
  let borders = BORDER_STYLES[style]
  if (borderColor) borders = borders.map(x => setColor(x, borderColor))
  const [horizontal, vertical, topLeft, topRight, bottomLeft, bottomRight] = borders

  // --- Apply the padding.
  text = setSpacing(text, padding)

  // --- Escape ANSI sequences and calculate the maximum line length.
  const linesEscaped = text.split('\n').map(escapeAnsiSequences)
  const maxLineLength = Math.max(...linesEscaped.map(line => line.length))

  // --- Auto-detect and clamp width.
  let boxWidth = width
  if (boxWidth <= 0) boxWidth = maxLineLength + 2
  if (boxWidth > maxWidth)
    text.split('\n').map(line => line.slice(0, maxWidth)).join('\n')

  // if (overflow === 'wrap') text = overflowWrap(text, maxWidth)
  // if (overflow === 'hidden') text = overflowHidden(text, maxWidth - 2)
  // if (overflow === 'ellipsis') text = overflowEllipsis(text, maxWidth)
  // boxWidth = maxWidth

  if (boxWidth < minWidth) {
    text = text.padEnd(minWidth, ' ')
    boxWidth = minWidth
  }

  // --- Auto-detect and clamp height.
  let boxHeight = height
  if (boxWidth <= 0) boxHeight = text.split('\n').length + 2
  if (maxHeight < boxHeight) text = text.split('\n').slice(0, boxHeight).join('\n')
  if (minHeight > boxHeight) text = text.padEnd(minHeight, '\n')

  // --- Calculate the length of each line.
  const lines = text.split('\n')
    .map((line) => {
      const escaped = escapeAnsiSequences(line)
      const length = boxWidth + line.length - escaped.length - 2
      return { line, length }
    })

  // --- Build the box™.
  const boxTop = topLeft + horizontal.repeat(boxWidth) + topRight
  const botBottom = bottomLeft + horizontal.repeat(boxWidth) + bottomRight
  const boxLines = lines.map(({ line, length }) => `${vertical} ${line.padEnd(length, ' ')} ${vertical}`)
  const box = [boxTop, ...boxLines, botBottom].join('\n')

  // --- Apply margins.
  return setSpacing(box, margin)
}
