import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const bindings = require('./build/Release/entropyShannon.node') as { entropyShannon: (input: string) => number }
export const entropyShannon = bindings.entropyShannon
