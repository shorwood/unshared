import { randomBytes } from 'node:crypto'
import { bench } from 'vitest'
import { cardinality } from './cardinality'
import { cardinality as cardinalityCC } from './cardinality.bindings'

const randomStringLarge = randomBytes(1000000).toString('base64')
const randomStringSmall = randomBytes(100).toString('base64')
const randomStringTiny = randomBytes(10).toString('base64')

describe('cardinality', () => {
  describe('large string', () => {
    bench('native', () => { cardinality(randomStringLarge) })
    bench('bindings', () => { cardinalityCC(randomStringLarge) })
  })

  describe('small string', () => {
    bench('native', () => { cardinality(randomStringSmall) })
    bench('bindings', () => { cardinalityCC(randomStringSmall) })
  })

  describe('tiny string', () => {
    bench('native', () => { cardinality(randomStringTiny) })
    bench('bindings', () => { cardinalityCC(randomStringTiny) })
  })

  describe('empty string', () => {
    bench('native', () => { cardinality('') })
    bench('bindings', () => { cardinalityCC('') })
  })
})
