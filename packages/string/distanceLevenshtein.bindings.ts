import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const bindings = require('./build/Release/distanceLevenshtein.node') as { DistanceLevenshtein: typeof import('./distanceLevenshtein').distanceLevenshtein }
export const distanceLevenshtein = bindings.DistanceLevenshtein
