import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { cwd } from 'node:process'
import { dump as toYAML, load as fromYAML } from 'js-yaml'
import { OpenAI } from 'openai'

interface Options {
  languageFrom: string
  languageTo: string
  sourceUrls: string[]
  directives: string[]
}

interface Source {
  url: string
  content: string
}

interface TranslateOptions {
  type: 'example' | 'source' | 'test'
  languageFrom: string
  languageTo: string
  sourcePath: string
  sourceContent: string
  directives: string[]
  sources: Source[]
}

interface TranslateResult {
  sourcePath: string
  translatedPath: string
  translatedContent: string
}

async function loadSources(urls: string[]): Promise<Source[]> {
  const sources: Source[] = []

  for (const url of urls) {
    const content = await fetch(url).then(response => response.text())
    sources.push({ url, content })
  }

  return sources
}

async function translateRound(options: TranslateOptions): Promise<TranslateResult> {
  const {
    languageFrom,
    languageTo,
    directives,
    sources,
    sourcePath,
  } = options

  console.log(`Translating ${sourcePath} from ${languageFrom} to ${languageTo}`)

  const ai = new OpenAI({ apiKey: process.env.OPENAI_APIKEY })
  const completion = await ai.chat.completions.create({
    model: 'gpt-3.5-turbo-16k-0613',
    max_tokens: 3000,
    stream: true,
    messages: [
      {
        role: 'system',
        content: toYAML({
          role: 'Code language translator',
          languageFrom,
          languageTo,
          directives,
          sources,
          returnType: [
            'interface TranslateResult {',
            '  sourcePath: string',
            '  translatedPath: string',
            '  translatedContent: string',
            '}',
          ].join('\n'),
        }),
      },
      {
        role: 'user',
        content: toYAML(<TranslateOptions>{
          type: 'example',
          languageFrom: 'c',
          languageTo: 'typescript',
          sourcePath: 'https://raw.githubusercontent.com/acme/example/master/src/isOdd.c',
          sourceContent: 'int isOdd(int n) {\n  return n % 2 == 1;\n}\n',
        }),
      },
      {
        role: 'assistant',
        content: toYAML(<TranslateResult>{
          sourcePath: 'https://raw.githubusercontent.com/acme/example/master/src/isOdd.c',
          translatedPath: 'src/isOdd.c',
          translatedContent: 'export function isOdd(n: number): boolean {\n  return n % 2 == 1;\n}\n',
        }),
      },
      {
        role: 'user',
        content: toYAML(options),
      },
    ],
  })

  const stream = completion
  const tokens: string[] = []

  for await (const chunks of stream) {
    const completion = chunks.choices[0].delta.content
    if (!completion) continue
    tokens.push(completion)
    process.stdout.write(completion)
  }

  const yaml = tokens.join('')
  return fromYAML(yaml) as TranslateResult
}

async function translateProject(options: Options): Promise<TranslateResult[]> {
  const sources = await loadSources(options.sourceUrls)
  const results: TranslateResult[] = []

  for (const source of sources) {
    const translateOptions: TranslateOptions = {
      type: 'source',
      languageFrom: options.languageFrom,
      languageTo: options.languageTo,
      sourcePath: source.url,
      sourceContent: source.content,
      directives: options.directives,
      sources,
    }

    const result = await translateRound(translateOptions)
    results.push(result)

    const outPath = resolve(cwd(), 'out', result.translatedPath)
    const outDirectory = dirname(outPath)
    if (!result.translatedContent) throw new Error(`No content for ${result.translatedPath}`)
    await mkdir(outDirectory, { recursive: true })
    await writeFile(outPath, result.translatedContent)
  }

  return results
}

async function main() {
  const result = await translateProject({
    languageFrom: 'python',
    languageTo: 'typescript:esnext',
    sourceUrls: [
      // 'https://raw.githubusercontent.com/joshtemple/lkml/master/tests/__init__.py',
      // 'https://raw.githubusercontent.com/joshtemple/lkml/master/tests/test_cli.py',
      // 'https://raw.githubusercontent.com/joshtemple/lkml/master/tests/test_functional.py',
      // 'https://raw.githubusercontent.com/joshtemple/lkml/master/tests/test_lexer.py',
      // 'https://raw.githubusercontent.com/joshtemple/lkml/master/tests/test_parser.py',
      // 'https://raw.githubusercontent.com/joshtemple/lkml/master/tests/test_simple.py',
      // 'https://raw.githubusercontent.com/joshtemple/lkml/master/tests/test_tree.py',

      // 'https://raw.githubusercontent.com/joshtemple/lkml/master/lkml/__init__.py',
      // 'https://raw.githubusercontent.com/joshtemple/lkml/master/lkml/__main__.py',
      // 'https://raw.githubusercontent.com/joshtemple/lkml/master/lkml/keys.py',
      // 'https://raw.githubusercontent.com/joshtemple/lkml/master/lkml/lexer.py',
      'https://raw.githubusercontent.com/joshtemple/lkml/master/lkml/parser.py',
      // 'https://raw.githubusercontent.com/joshtemple/lkml/master/lkml/py.typed',
      // 'https://raw.githubusercontent.com/joshtemple/lkml/master/lkml/simple.py',
      // 'https://raw.githubusercontent.com/joshtemple/lkml/master/lkml/tokens.py',
      // 'https://raw.githubusercontent.com/joshtemple/lkml/master/lkml/tree.py',
      // 'https://raw.githubusercontent.com/joshtemple/lkml/master/lkml/utils.py',
      // 'https://raw.githubusercontent.com/joshtemple/lkml/master/lkml/visitors.py',
    ],
    directives: [
      'Return stricly as valid YAML',
      'Do not use directives in the output',
      'Keep the same result structure as the example',
      'Dont forget to add | before long YAML strings',
      'Do not encapsulate code in markdown code blocks',
      'Do not use any external libraries',
      'Only use `node:<name>` modules',
      'Keep comments as JSDoc comments',
      'Convert snake case to camel case',
      'Destructure named imports',
      'Use "vitest" as test runner',
    ],
  })

  console.log(result)
}

await main()
