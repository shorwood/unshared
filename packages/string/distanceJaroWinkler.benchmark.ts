import { randomBytes } from 'node:crypto'
import { bench } from 'vitest'
import { distanceJaroWinkler as distanceJaroWinklerJS } from './distanceJaroWinkler'
import { distanceJaroWinkler as distanceJaroWinklerCC } from './distanceJaroWinkler.bindings'

const randomStringLargeA = randomBytes(1000).toString('base64')
const randomStringLargeB = randomBytes(1000).toString('base64')
const randomStringSmallA = randomBytes(100).toString('base64')
const randomStringSmallB = randomBytes(100).toString('base64')
const randomStringTinyA = randomBytes(10).toString('base64')
const randomStringTinyB = randomBytes(10).toString('base64')

describe('distanceJaroWinkler', () => {
  describe('large strings', () => {
    bench('native', () => { distanceJaroWinklerJS(randomStringLargeA, randomStringLargeB) })
    bench('bindings', () => { distanceJaroWinklerCC(randomStringLargeA, randomStringLargeB) })
  })

  describe('small strings', () => {
    bench('native', () => { distanceJaroWinklerJS(randomStringSmallA, randomStringSmallB) })
    bench('bindings', () => { distanceJaroWinklerCC(randomStringSmallA, randomStringSmallB) })
  })

  describe('tiny strings', () => {
    bench('native', () => { distanceJaroWinklerJS(randomStringTinyA, randomStringTinyB) })
    bench('bindings', () => { distanceJaroWinklerCC(randomStringTinyA, randomStringTinyB) })
  })

  describe('one empty string', () => {
    bench('native', () => { distanceJaroWinklerJS('', randomStringTinyB) })
    bench('bindings', () => { distanceJaroWinklerCC('', randomStringTinyB) })
  })
})
