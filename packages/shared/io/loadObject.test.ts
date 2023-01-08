import { expect, it } from 'vitest'
import { vol } from 'memfs'
import { loadObject } from './loadObject'

it('should load an object from a JSON file', async() => {
  const path = '/valid.json'
  const object = { foo: 'bar' }
  vol.fromJSON({ [path]: JSON.stringify(object) })
  const result = await loadObject(path)
  expect(result).toStrictEqual(object)
})

it('should throw an error if the JSON file is invalid', async() => {
  const path = '/invalid.json'
  vol.fromJSON({ [path]: 'invalid' })
  const shouldReject = () => loadObject(path)
  expect(shouldReject).rejects.toThrow()
})
