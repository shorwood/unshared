import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const bindings = require('./build/Release/distanceJaroWinkler.node') as { DistanceJaroWinkler: typeof import('./distanceJaroWinkler').distanceJaroWinkler }
export const distanceJaroWinkler = bindings.DistanceJaroWinkler
