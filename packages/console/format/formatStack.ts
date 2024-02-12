import { readFileSync } from 'node:fs'
import { sep } from 'node:path'
import { cwd as getCwd } from 'node:process'
import { BORDER_STYLES, COLOR_PALETTE_NORD } from '../components/constants'
import { BoxOptions, createBox } from '../components/createBox'
import { setBold, setColor, setDim, setLink, setSpacing } from '../style'
import { Log } from '../types'

/** A template string to replace node references in stack traces with a link to the source code. */
const NODE_SOURCE_URL = `https://github.com/nodejs/node/blob/v${process.versions.node}/lib/$1.js#L$2`
const NODE_SOURCE_URL_LINK = setLink('node:$1:$2:$3', NODE_SOURCE_URL)
const NODE_SOURCE_URL_RE = /node:([^:]+):(\d+):(\d+)/g

/** Common styling parameters for the stack trace. */
const STACK_STYLE: BoxOptions = {
  padding: 1,
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
  const cwd = getCwd()

  // --- Compute the first absolute path that is in the current working directory.
  const snippetIndex = log.stack.indexOf(cwd)
  const snippetStack = log.stack.slice(snippetIndex, log.stack.indexOf('\n', snippetIndex)).replace(/\)$/, '')
  const snippetStackParts = snippetStack.split(':')
  const snippetPath = snippetStackParts.slice(0, -2).join(':')
  const snippetLine = Number.parseInt(snippetStackParts[snippetStackParts.length - 2])
  const snippetColumn = Number.parseInt(snippetStackParts[snippetStackParts.length - 1])

  // --- Extract the error message from the stack trace.
  const errorMessage = log.stack.split('\n').shift()

  // --- Prepare the box borders.
  const borders = BORDER_STYLES[STACK_STYLE.borderStyle!].map(x => setColor(x, STACK_STYLE.borderColor!))
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
      const codeLine = (index + snippetLine - 4).toString()
      // codeLine = color(codeLine, COLOR_PALETTE_NORD.nord14)
      line = `${setDim(codeLine)} ${vertical} ${line}`

      // --- Highlight the line with the error message.
      if (index !== 4) return line
      let message = `⮎ ${errorMessage}`
      message = `${' '.repeat(6)}${message}'}`
      message = setColor(message, COLOR_PALETTE_NORD.nord11)
      message = setBold(message)
      message = ' '.repeat(snippetColumn - 1) + message
      return `${line}\n${message}`
    })
    .join('\n')
    .trim()
    .replaceAll('\t', '  ')

  // --- Prettiy the stack trace.
  const pathTemplate = `(${setBold(setColor('$1', COLOR_PALETTE_NORD.nord14))})`
  const stack = log.stack
    .trim()
    .split('\n')
    .map(line => line.trim())
    .join('\n')
    .replaceAll('file://', '')
    .replaceAll(cwd + sep, '')
    .replaceAll(/\((.+)\)/g, pathTemplate)
    .replace(/^\s*(at)/gm, setDim('$1'))
    .replace(/^[^\n]+\n/g, '')
    .replace(NODE_SOURCE_URL_RE, NODE_SOURCE_URL_LINK)

  // --- Create the box.
  const box = [
    createBox(source, STACK_STYLE).split('\n').slice(0, -1).join('\n'),
    `${left}${horizontal.repeat(STACK_STYLE.width!)}${right}`,
    createBox(stack, STACK_STYLE).split('\n').slice(1).join('\n'),
  ].join('\n')

  return setSpacing(box, [1, 2])
}
