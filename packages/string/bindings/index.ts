import type * as unsharedString from '@unshared/string'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const bindings = require('./build/Release/bindings.node') as { Cardinality: typeof unsharedString.cardinality }
const cardinality = bindings.Cardinality

export { cardinality }

declare module './index' {
  export interface Bindings {
    Cardinality: typeof cardinality
  }
}
