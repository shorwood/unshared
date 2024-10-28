import { parseCliArguments } from '@unshared/process'
import { build } from './build'
import { commit } from './commit'
import { publish } from './publish'
import { release } from './release'

function cli() {
  const { parameters: [command, ...parameters], options } = parseCliArguments(process.argv)

  // --- Build the packages in the current working directory.
  if (command === 'build') {
    const packageNames = parameters.length > 0 ? parameters : undefined
    return build({ ...options, packageNames })
  }

  // --- Publish the packages to the NPM registry.
  if (command === 'publish') {
    const packageNames = parameters.length > 0 ? parameters : undefined
    return publish({ ...options, packageNames })
  }

  // --- Create a new release tag for the packages.
  if (command === 'release') {
    const packageNames = parameters.length > 0 ? parameters : undefined
    return release({ ...options, packageNames })
  }

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
