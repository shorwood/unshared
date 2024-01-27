/**
 * A speedy LookML parser and serializer implemented in pure Python.
 */

import { createReadStream, createWriteStream } from 'node:fs'
import { createInterface } from 'node:readline'
import { parse as parseArguments } from 'yargs'
import { Lexer } from './lexer'
import { Parser } from './parser'
import { NodeDocument } from './parserNodes'
import { DictParser, DictVisitor } from './simple'

/**
 * Parse LookML into a parse tree.
 *
 * @param text The LookML string to be parsed.
 * @returns A document node, the root of the parse tree.
 */
export function parse(text: string): NodeDocument {
  const lexer = new Lexer(text)
  const tokens = lexer.scan()
  const parser = new Parser(tokens)
  const tree: NodeDocument = parser.parse()
  return tree
}

/**
 * Parse LookML into a JavaScript object.
 *
 * @param stream File path or string containing LookML to be parsed.
 * @throws TypeError If stream is neither a string nor a file path.
 * @returns JavaScript object representation of the LookML.
 */
export function load(stream: NodeJS.ReadableStream | string): object {
  let text = ''

  if (stream instanceof NodeJS.ReadableStream) {
    const fileStream = stream
    const rl = createInterface({ input: fileStream, terminal: false })
    rl.on('line', (line) => {
      text += `${line}\n`
    })
    rl.on('close', () => {
      fileStream.destroy()
    })
  }
  else if (typeof stream === 'string') {
    text = stream
  }
  else {
    throw new TypeError('Input stream must be a file path or string.')
  }

  const tree: NodeDocument = parse(text)
  const visitor = new DictVisitor()
  const treeAsObject: object = visitor.visit(tree)
  return treeAsObject
}

/**
 * Serialize a JavaScript object into LookML.
 *
 * @param obj The JavaScript object to be serialized to LookML.
 * @param object
 * @param filePath An optional file path to save the LookML string to.
 * @returns A LookML string if no file path is passed.
 */
export function dump(object: object, filePath?: string): string | null {
  const parser = new DictParser()
  const tree: NodeDocument = parser.parse(object)

  if (filePath) {
    const fileStream = createWriteStream(filePath)
    fileStream.write(tree.toString())
    fileStream.close()
    return undefined
  }
  else {
    return tree.toString()
  }
}
