/* eslint-disable sonarjs/no-os-command-from-path */
/* eslint-disable n/no-sync */
import { createAnthropic } from '@ai-sdk/anthropic'
import { streamText } from 'ai'
import { execFileSync, spawn } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { createInterface } from 'node:readline/promises'
import { COMMIT_PROMPT } from './commitPrompt'

/**
 * Generate a commit message for the currently staged changes.
 *
 * @param input The input to use for the commit message.
 * @param apiKey The Anthropic API key to use for generating the commit message.
 * @returns The commit message for the currently staged changes.
 * @example commit('chore: improved typing', 'sk-1234567890abcdef')
 */
export async function commit(input: string, apiKey: string) {
  const gitBin = 'git'
  const diff = execFileSync(gitBin, ['diff', '--staged'], { encoding: 'utf8' })
  const diffPaths = execFileSync(gitBin, ['diff', '--name-only', '--staged'], { encoding: 'utf8' })
  const diffStat = execFileSync(gitBin, ['diff', '--stat', '--staged'], { encoding: 'utf8' })
  const lastCommits = execFileSync(gitBin, ['log', '-2', '--pretty=%B'], { encoding: 'utf8' })
  const branchName = execFileSync(gitBin, ['branch', '--show-current'], { encoding: 'utf8' })

  // --- Read the contents of the staged files.
  const fileContents = diffPaths
    .split('\n')
    .filter(Boolean)
    .filter(path => existsSync(path))
    .map(path => readFileSync(path, 'utf8'))

  const anthropic = createAnthropic({ apiKey })
  const response = streamText({
    model: anthropic('claude-3-7-sonnet-latest'),
    messages: [
      ...COMMIT_PROMPT,
      { content: `[LAST_COMMITS]\n${lastCommits}\n\n`, role: 'user' },
      { content: `[BRANCH_NAME]\n${branchName}\n\n`, role: 'user' },
      { content: `[DIFF_STAGED_STATS]\n${diffStat}\n\n`, role: 'user' },
      { content: `[FILE_CONTENTS]\n${fileContents.join('\n')}\n\n`, role: 'user' },
      { content: `[DIFF}]\n${diff}`, role: 'user' },
      { content: `[INPUT]\n${input}`, role: 'user' },
    ],
  })

  // --- Write the response token by token.
  const completionTokens: string[] = []
  for await (const text of response.textStream) {
    if (!text) continue
    completionTokens.push(text)
    process.stdout.write(text)
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
    const git = spawn(gitBin, ['commit', '-m', completion], { stdio: 'inherit' })
    await new Promise(resolve => git.on('exit', resolve))
  }
}
