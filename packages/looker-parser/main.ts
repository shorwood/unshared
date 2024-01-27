import { readFile } from 'node:fs/promises'
import { Lexer } from './looker/lexer'
import { Parser } from './looker/parser'

const text = await readFile(process.argv[2], 'utf8')
const tokens = new Lexer(text).scan()
const ast = new Parser(tokens).parse()

console.log({
  tokens: tokens.map(token => token.toString()),
  ast,
})

console.log(ast.toString())
