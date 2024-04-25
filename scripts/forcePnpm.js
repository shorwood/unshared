import { env, exit, stderr } from 'node:process'

// --- Check if pnpm is being used.
const agent = env.npm_config_user_agent || 'npm'
if (agent.startsWith('pnpm')) exit(0)

// --- If not, throw an error.
/* eslint-disable vitest/require-hook */
stderr.write('\nPlease use pnpm to manage dependencies in this repository.\n  $ npm i pnpm -g\n')
exit(1)
