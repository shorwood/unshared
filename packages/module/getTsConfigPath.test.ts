import { expect, it } from 'vitest'
import { vol } from 'memfs'
import { getTsConfigPath } from './getTsConfigPath'

it('should get the tsconfig.json path', async() => {
  vol.fromJSON({
    '/home/user/project/tsconfig.json': '',
    '/tsconfig.json': '',
  })
  const result = await getTsConfigPath('/home/user/project')
  expect(result).toStrictEqual('/home/user/project/tsconfig.json')
})
