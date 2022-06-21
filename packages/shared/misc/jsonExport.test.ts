import { expect, it } from 'vitest'
import { jsonExport } from './jsonExport'
import { jsonImport } from './jsonImport'

it.todo('should export the object to a JSON file', () => {
  const object = { foo: 'bar' }
  jsonExport('./test.json', object)
  expect(jsonImport('./test.json')).toEqual(object)
})
