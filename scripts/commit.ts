#!/usr/bin/env node

import 'dotenv/config'
import { execFileSync, spawn } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { createInterface } from 'node:readline/promises'
import { Readable } from 'node:stream'
import { load as parseYaml } from 'js-yaml'

const OPENAI_APIKEY = process.env.OPENAI_APIKEY

interface Prompt {
  role: 'assistant' | 'system' | 'user'
  content: string
}

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'
const OPENAI_MODEL = 'gpt-4'

const LOCALAI_URL = 'http://localhost:8080/v1/chat/completions'
const LOCALAI_MODEL = 'ggml-gpt4all-j.bin'

const USE_LOCALAI = false

/**
 * Generate a commit message for the currently staged changes.
 *
 * @returns The commit message for the currently staged changes.
 * @example commit()
 */
export async function commit() {
  const promptPath = new URL('commitPrompt.yaml', import.meta.url)
  const promptYaml = await readFile(promptPath, 'utf8')
  const prompt = parseYaml(promptYaml) as Record<string, unknown>
  const promptMessages = prompt.messages as Prompt[]
  const input = process.argv.slice(2).join(' ')

  const diff = execFileSync('git', ['diff', '--cached', '--staged'], { encoding: 'utf8' }).slice(0, 7000)
  const diffStat = execFileSync('git', ['diff', '--stat', '--cached', '--staged'], { encoding: 'utf8' }).slice(0, 7000)
  const lastCommits = execFileSync('git', ['log', '-2', '--pretty=%B'], { encoding: 'utf8' })
  const branchName = execFileSync('git', ['branch', '--show-current'], { encoding: 'utf8' })

  promptMessages.push(
    { role: 'user', content: `[LAST_COMMITS]\n${lastCommits}\n\n` },
    { role: 'user', content: `[STAGED_STATS]\n${diffStat}\n\n` },
    { role: 'user', content: `[BRANCH_NAME]\n${branchName}\n\n` },
    { role: 'user', content: `[DIFF}]\n${diff}` },
    { role: 'user', content: `[INPUT]\n${input}` },
  )

  const url = USE_LOCALAI ? LOCALAI_URL : OPENAI_URL
  const model = USE_LOCALAI ? LOCALAI_MODEL : OPENAI_MODEL

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_APIKEY}`,
    },
    body: JSON.stringify({
      model,
      messages: promptMessages,
      max_tokens: 256,
      stream: true,
    }),
  })

  // --- Handle status code.
  if (!response.ok || !response.body) {
    console.error(response.statusText)
    process.exit(1)
  }

  // --- Handle errors.
  // @ts-expect-error: types are compatible.
  const stream = Readable.fromWeb(response.body)
  stream.on('error', (error) => {
    console.error(error)
    process.exit(1)
  })

  // --- Write the response token by token.
  const completionTokens: string[] = []
  for await (const chunks of stream) {
    const results = chunks.toString('utf8').split('\n')
    for (const result of results) {
      try {
        const responseJson = result.slice(6)
        const response = JSON.parse(responseJson)
        const completion = response.choices[0].delta.content
        completionTokens.push(completion)
        process.stdout.write(completion)
      }
      catch {
        /** Ignore. */
      }
    }
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
