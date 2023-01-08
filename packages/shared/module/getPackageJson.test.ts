import { expect, it } from 'vitest'
import { vol } from 'memfs'
import { getPackageJson } from './getPackageJson'

it('should get the package.json', async() => {
  const packageJson = { name: 'project' }
  vol.fromJSON({
    '/home/user/project/package.json': JSON.stringify(packageJson),
    '/package.json': '',
  })
  const result = await getPackageJson('/home/user/project')
  expect(result).toStrictEqual(packageJson)
})
