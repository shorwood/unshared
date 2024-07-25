import { argv } from 'node:process'
import { parseCliArguments } from '@unshared/process'
import { publish } from './publish'
import { commit } from './commit'
import { build } from './build'

function cli() {
  const { parameters: [command, ...parameters], options } = parseCliArguments(argv)

  if (command === 'build') return build({ ...options, packageNames: parameters })

  if (command === 'publish') return publish({ ...options, packageNames: parameters })

  // --- Commit the input to the OpenAI API.
  if (command === 'commit') {
    const apiKey = process.env.OPENAI_API_KEY
    const input = parameters.join(' ')
    if (!apiKey) throw new Error('Missing OpenAI API key.')
    return commit(input, apiKey)
  }

  throw new Error(`Unknown command: ${command}`)
}

void cli()
