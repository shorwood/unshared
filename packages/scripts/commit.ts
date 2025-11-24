/* eslint-disable sonarjs/no-os-command-from-path */
/* eslint-disable n/no-sync */
import type { ModelMessage } from 'ai'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import { streamText } from 'ai'
import { execFileSync, spawn } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { createInterface } from 'node:readline/promises'
import { COMMIT_PROMPT } from './commitPrompt'

export interface CommitOptions {
  apiKey: string
  modelId: string
  noDiff?: boolean
  noDiffPaths?: boolean
  noDiffStat?: boolean
  noLastCommits?: boolean
  noBranchName?: boolean
  noFileContents?: boolean
}

/**
 * Generate a commit message for the currently staged changes.
 *
 * @param input The input to use for the commit message.
 * @param options The options for the commit message generation.
 * @returns The commit message for the currently staged changes.
 * @example commit('chore: improved typing', 'sk-1234567890abcdef')
 */
export async function commit(input: string, options: CommitOptions): Promise<void> {
  const {
    apiKey,
    modelId = 'openai/gpt-4o-mini',
    noDiff,
    noDiffPaths,
    noDiffStat,
    noLastCommits,
    noBranchName,
    noFileContents,
  } = options

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

  const messages = [
    ...COMMIT_PROMPT,
    (!noLastCommits && { content: `[LAST_COMMITS]\n${lastCommits}\n\n`, role: 'user' }),
    (!noBranchName && { content: `[BRANCH_NAME]\n${branchName}\n\n`, role: 'user' }),
    (!noDiffStat && { content: `[DIFF_STAGED_STATS]\n${diffStat}\n\n`, role: 'user' }),
    (!noDiffPaths && { content: `[DIFF_PATHS]\n${diffPaths}\n\n`, role: 'user' }),
    (!noFileContents && { content: `[FILE_CONTENTS]\n${fileContents.join('\n')}\n\n`, role: 'user' }),
    (!noDiff && { content: `[DIFF]\n${diff}`, role: 'user' }),
    { content: `[INPUT]\n${input}`, role: 'user' },
  ].filter(Boolean) as ModelMessage[]

  const openai = createOpenAICompatible({
    name: 'github',
    apiKey,
    headers: {
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    baseURL: 'https://models.github.ai/inference',
  })
  const response = streamText({
    model: openai(modelId),
    messages,
    onError: (error) => {
      console.error(error.error)
    },
  })

  // --- Write the response token by token.
  const completionTokens: string[] = []
  for await (const text of response.textStream) {
    if (!text) continue
    completionTokens.push(text)
    process.stdout.write(text)
  }

  if (completionTokens.length === 0) {
    console.error('No commit message generated. Please try again with different input.')
    return
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
