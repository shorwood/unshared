import { expect, it } from 'vitest'
import { vol } from 'memfs'
import { getTsConfigPath } from './getTsConfigPath'

it('should get the tsconfig.json path', async() => {
  const json = {
    '/home/user/project/tsconfig.json': '',
    '/tsconfig.json': '',
  }
  vol.fromJSON(json)
  const result = await getTsConfigPath('/home/user/project')
  expect(result).toStrictEqual('/home/user/project/tsconfig.json')
})
