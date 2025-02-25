import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const bindings = require('./build/Release/cardinality.node') as { Cardinality: typeof import('./cardinality').cardinality }
export const cardinality = bindings.Cardinality
