import { RGB } from '../types'

export interface BorderOptions {
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
}

export const BORDER_STYLES = {
  'ascii': ['-', '|', '+', '+', '+', '+', '+', '+', '+', '+', '+'],
  'square': ['─', '│', '┌', '┐', '└', '┘', '├', '┤', '┬', '┴', '┼'],
  'square-bold': ['━', '┃', '┏', '┓', '┗', '┛', '┣', '┫', '┳', '┻', '╋'],
  'square-pipe': ['═', '║', '╔', '╗', '╚', '╝', '╠', '╣', '╦', '╩', '╬'],
  'square-pipe-vertical': ['─', '║', '╓', '╖', '╙', '╜', '╟', '╢', '╥', '╨', '╫'],
  'square-pipe-horizontal': ['═', '│', '╒', '╕', '╘', '╛', '╞', '╡', '╤', '╧', '╪'],
  'round': ['─', '│', '╭', '╮', '╰', '╯', '├', '┤', '┬', '┴', '┼'],
  'full': ['█', '█', '█', '█', '█', '█', '█', '█', '█', '█', '█'],
  'x': ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
  'dot': ['·', '·', '·', '·', '·', '·', '·', '·', '·', '·', '·'],
  'hash': ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
  'hidden': [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  'none': ['', '', '', '', '', '', '', '', '', '', ''],
}

export const COLOR_PALETTE_NORD: Record<string, RGB> = {
  nord0: [46, 52, 64],
  nord1: [59, 66, 82],
  nord2: [67, 76, 94],
  nord3: [76, 86, 106],
  nord4: [216, 222, 233],
  nord5: [229, 233, 240],
  nord6: [236, 239, 244],
  nord7: [143, 188, 187],
  nord8: [136, 192, 208],
  nord9: [129, 161, 193],
  nord10: [94, 129, 172],
  nord11: [191, 97, 106],
  nord12: [208, 135, 112],
  nord13: [235, 203, 139],
  nord14: [163, 190, 140],
  nord15: [180, 142, 173],
}
