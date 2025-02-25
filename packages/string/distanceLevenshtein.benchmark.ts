import { randomBytes } from 'node:crypto'
import { bench } from 'vitest'
import { distanceLevenshtein as distanceLevenshteinJS } from './distanceLevenshtein'
import { distanceLevenshtein as distanceLevenshteinCC } from './distanceLevenshtein.bindings'

const randomStringLargeA = randomBytes(1000).toString('base64')
const randomStringLargeB = randomBytes(1000).toString('base64')
const randomStringSmallA = randomBytes(100).toString('base64')
const randomStringSmallB = randomBytes(100).toString('base64')
const randomStringTinyA = randomBytes(10).toString('base64')
const randomStringTinyB = randomBytes(10).toString('base64')

describe('distanceLevenshtein', () => {
  describe('large strings', () => {
    bench('native', () => { distanceLevenshteinJS(randomStringLargeA, randomStringLargeB) })
    bench('bindings', () => { distanceLevenshteinCC(randomStringLargeA, randomStringLargeA) })
  })

  describe('small strings', () => {
    bench('native', () => { distanceLevenshteinJS(randomStringSmallA, randomStringSmallB) })
    bench('bindings', () => { distanceLevenshteinCC(randomStringSmallA, randomStringSmallB) })
  })

  describe('tiny strings', () => {
    bench('native', () => { distanceLevenshteinJS(randomStringTinyA, randomStringTinyB) })
    bench('bindings', () => { distanceLevenshteinCC(randomStringTinyA, randomStringTinyB) })
  })

  describe('one empty string', () => {
    bench('native', () => { distanceLevenshteinJS('', randomStringTinyB) })
    bench('bindings', () => { distanceLevenshteinCC('', randomStringTinyB) })
  })
})
