import { OpenAI } from 'openai'
// eslint-disable-next-line n/no-unsupported-features/node-builtins
import { createInterface } from 'node:readline/promises'
import { readFile } from 'node:fs/promises'
import { existsSync, readFileSync } from 'node:fs'
import { execFileSync, spawn } from 'node:child_process'
import { load as parseYaml } from 'js-yaml'
import 'dotenv/config'

interface Prompt {
  content: string
  role: 'assistant' | 'system' | 'user'
}

/**
 * Generate a commit message for the currently staged changes.
 *
 * @returns The commit message for the currently staged changes.
 * @example commit()
 */
export async function commit() {
  const promptPath = new URL('commitPrompt.yaml', import.meta.url)
  const promptYaml = await readFile(promptPath, 'utf8')
  const promptSystem = parseYaml(promptYaml) as Record<string, unknown>
  const input = process.argv.slice(2).join(' ')

  const diff = execFileSync('git', ['diff', '--cached', '--staged'], { encoding: 'utf8' })
  const diffPaths = execFileSync('git', ['diff', '--name-only', '--cached', '--staged'], { encoding: 'utf8' })
  const diffStat = execFileSync('git', ['diff', '--stat', '--cached', '--staged'], { encoding: 'utf8' })
  const lastCommits = execFileSync('git', ['log', '-2', '--pretty=%B'], { encoding: 'utf8' })
  const branchName = execFileSync('git', ['branch', '--show-current'], { encoding: 'utf8' })
  const fileContents = diffPaths.split('\n').filter(Boolean).filter(existsSync).map(path => readFileSync(path, 'utf8'))

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const response = await openai.chat.completions.create({
    max_tokens: 1024,
    messages: [
      ...promptSystem.messages as Prompt[],
      { content: `[LAST_COMMITS]\n${lastCommits}\n\n`, role: 'user' },
      { content: `[BRANCH_NAME]\n${branchName}\n\n`, role: 'user' },
      { content: `[DIFF_STAGED_STATS]\n${diffStat}\n\n`, role: 'user' },
      { content: `[FILE_CONTENTS]\n${fileContents.join('\n')}\n\n`, role: 'user' },
      { content: `[DIFF}]\n${diff}`, role: 'user' },
      { content: `[INPUT]\n${input}`, role: 'user' },
    ],
    model: 'gpt-4-turbo-2024-04-09',
    stream: true,
    temperature: 0.7,
  })

  // --- Write the response token by token.
  const completionTokens: string[] = []
  for await (const chunks of response) {
    const completion = chunks.choices[0].delta.content
    if (!completion) continue
    completionTokens.push(completion)
    process.stdout.write(completion)
  }

  process.stdout.write([
    '\n',
    '-'.repeat(80),
    '\nDo you want to use this commit message? [Y/n]: ',
  ].join('\n'))

  // --- Prompt if the use wants to use the generated commit message. (using `readline`)
  const result = await new Promise<boolean>((resolve) => {
    const readline = createInterface({
      input: process.stdin,
      prompt: 'Use this commit message? [Y/n] ',
    })

    readline.on('line', (line) => {
      readline.close()
      resolve(/^y(es)?$/i.test(line))
    })
  })

  // --- If `yes`, commit the staged changes with the generated commit message.
  if (result) {
    const completion = `${completionTokens.join('').trim()}\n`
    const git = spawn('git', ['commit', '-m', completion], { stdio: 'inherit' })
    await new Promise(resolve => git.on('exit', resolve))
  }

  console.log('Done.')
}

await commit()
