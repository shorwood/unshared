/* eslint-disable n/no-sync */
import { execFileSync, spawn } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { createInterface } from 'node:readline/promises'
import { OpenAI } from 'openai'
import { COMMIT_PROMPT } from './commitPrompt'

/**
 * Generate a commit message for the currently staged changes.
 *
 * @param input The input to use for the commit message.
 * @param apiKey The OpenAI API key to use for the completion.
 * @returns The commit message for the currently staged changes.
 * @example commit()
 */
export async function commit(input: string, apiKey: string) {
  const diff = execFileSync('/usr/bin/git', ['diff', '--cached', '--staged'], { encoding: 'utf8' })
  const diffPaths = execFileSync('/usr/bin/git', ['diff', '--name-only', '--cached', '--staged'], { encoding: 'utf8' })
  const diffStat = execFileSync('/usr/bin/git', ['diff', '--stat', '--cached', '--staged'], { encoding: 'utf8' })
  const lastCommits = execFileSync('/usr/bin/git', ['log', '-2', '--pretty=%B'], { encoding: 'utf8' })
  const branchName = execFileSync('/usr/bin/git', ['branch', '--show-current'], { encoding: 'utf8' })

  // --- Read the contents of the staged files.
  const fileContents = diffPaths
    .split('\n')
    .filter(Boolean)
    .filter(path => existsSync(path))
    .map(path => readFileSync(path, 'utf8'))

  const openai = new OpenAI({ apiKey })
  const response = await openai.chat.completions.create({
    max_tokens: 1024,
    messages: [
      ...COMMIT_PROMPT,
      { content: `[LAST_COMMITS]\n${lastCommits}\n\n`, role: 'user' },
      { content: `[BRANCH_NAME]\n${branchName}\n\n`, role: 'user' },
      { content: `[DIFF_STAGED_STATS]\n${diffStat}\n\n`, role: 'user' },
      { content: `[FILE_CONTENTS]\n${fileContents.join('\n')}\n\n`, role: 'user' },
      { content: `[DIFF}]\n${diff}`, role: 'user' },
      { content: `[INPUT]\n${input}`, role: 'user' },
    ],
    model: 'gpt-4-turbo',
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
    const git = spawn('/usr/bin/git', ['commit', '-m', completion], { stdio: 'inherit' })
    await new Promise(resolve => git.on('exit', resolve))
  }
}
