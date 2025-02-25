/* eslint-disable n/no-sync */
import type { Log } from './createLogger'
import type { BoxOptions } from './utils/createBox'
import { readFileSync } from 'node:fs'
import { sep } from 'node:path'
import { BORDER_STYLES, COLOR_PALETTE_NORD } from './utils/constants'
import { createBox } from './utils/createBox'
import { createText } from './utils/createText'
import { setSpacing } from './utils/setSpacing'

/** A template string to replace node references in stack traces with a link to the source code. */
const NODE_VERSION = process.versions.node
const NODE_SOURCE_URL = `https://github.com/nodejs/node/blob/v${NODE_VERSION}/lib/$1.js#L$2`
const NODE_SOURCE_URL_LINK = createText('node:$1:$2:$3', { href: NODE_SOURCE_URL })
const NODE_SOURCE_URL_RE = /node:([^:]+):(\d+):(\d+)/g

/** Common styling parameters for the stack trace. */
const STACK_STYLE: BoxOptions = {
  padding: 0,
  width: 110,
  borderStyle: 'round',
  borderColor: COLOR_PALETTE_NORD.nord13,
  overflow: 'hidden',
}

/**
 * Format a stack trace in a human-readable and colorful format. This function
 * will trim the unneeded information from the stack trace and will convert
 * absolute paths to relative paths making them clickable VS Code.
 *
 * @param log The log message.
 * @returns The formatted stack trace.
 */
export function formatStack(log: Log): string {
  if (!log.stack) return ''
  const workdir = process.cwd()

  // --- Compute the first absolute path that is in the current working directory.
  const snippetIndex = log.stack.indexOf(workdir)
  const snippetStack = log.stack.slice(snippetIndex, log.stack.indexOf('\n', snippetIndex)).replace(/\)$/, '')
  const snippetStackParts = snippetStack.split(':')
  const snippetPath = snippetStackParts.slice(0, -2).join(':')
  const snippetLine = Number.parseInt(snippetStackParts.at(-2))
  const snippetColumn = Number.parseInt(snippetStackParts.at(-1))

  // --- Extract the error message from the stack trace.
  const errorMessage = log.stack.split('\n').shift()

  // --- Prepare the box borders.
  const borders = BORDER_STYLES[STACK_STYLE.borderStyle!].map(x => createText(x, { textColor: STACK_STYLE.borderColor }))
  const horizontal = borders[0]
  const vertical = borders[1]
  const left = borders[6]
  const right = borders[7]

  // --- Load a snippet of the source code.
  const source = readFileSync(snippetPath, 'utf8')
    .split('\n')
    .slice(snippetLine - 5, snippetLine + 4)
    .map((line, index) => {

      // --- Add line numbers.
      const codeLine = createText((index + snippetLine - 4).toString(), { isMuted: true })
      // codeLine = color(codeLine, COLOR_PALETTE_NORD.nord14)
      line = `${codeLine} ${vertical} ${line}`

      // --- Highlight the line with the error message.
      if (index !== 4) return line
      let message = `${' '.repeat(6)}⮎  ${errorMessage}`
      message = createText(message, {
        textColor: COLOR_PALETTE_NORD.nord11,
        isBold: true,
        isItalic: true,
      })
      message = ' '.repeat(snippetColumn - 1) + message
      return `${line}\n${message}`
    })
    .join('\n')
    .trim()
    .replaceAll('\t', '  ')

  // --- Prettiy the stack trace.
  const pathTemplate = createText('$1', { isBold: true, textColor: COLOR_PALETTE_NORD.nord14 })
  const stack = log.stack
    .trim()
    .split('\n')
    .map(line => line.trim())
    .join('\n')
    .replaceAll('file://', '')
    .replaceAll(workdir + sep, '')
    .replaceAll(/\((.+)\)/g, `(${pathTemplate})`)
    .replaceAll(/^\s*(at)/gm, createText('$1', { isMuted: true }))
    .replaceAll(/^[^\n]+\n/g, '')
    .replaceAll(NODE_SOURCE_URL_RE, NODE_SOURCE_URL_LINK)

  const ttyWidth = process.stdout.columns || 80
  const width = Math.min(STACK_STYLE.width!, ttyWidth - 2)

  // --- Create the box.
  const box = [
    createBox(source, STACK_STYLE).split('\n').slice(0, -1).join('\n'),
    `${left}${horizontal.repeat(width)}${right}`,
    createBox(stack, STACK_STYLE).split('\n').slice(1).join('\n'),
  ].join('\n')

  return setSpacing(box, [1, 2])
}
