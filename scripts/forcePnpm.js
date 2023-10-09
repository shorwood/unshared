#!/usr/bin/env node

// --- Check if pnpm is being used
const agent = process.env.npm_config_user_agent || 'npm'
if (agent.startsWith('pnpm')) process.exit(0)

// --- If not, throw an error
console.error('\nPlease use pnpm to manage dependencies in this repository.\n  $ npm i pnpm -g\n')
process.exit(1)
