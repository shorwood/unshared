import { expect, it } from 'vitest'
import { vol } from 'memfs'
import { getPackageJsonPath } from './getPackageJsonPath'

it('should get the package.json path', async() => {
  const json = {
    '/home/user/project/package.json': '',
    '/package.json': '',
  }
  vol.fromJSON(json)
  const result = await getPackageJsonPath('/home/user/project')
  expect(result).toStrictEqual('/home/user/project/package.json')
})
