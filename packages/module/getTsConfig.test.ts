import { expect, it } from 'vitest'
import { vol } from 'memfs'
import { getTsConfig } from './getTsConfig'

it('should get the tsconfig.json', async() => {
  const tsConfig = { compilerOptions: { target: 'esnext' } }
  vol.fromJSON({
    '/home/user/project/tsconfig.json': JSON.stringify(tsConfig),
    '/tsconfig.json': '',
  })
  const result = await getTsConfig('/home/user/project')
  expect(result).toStrictEqual(tsConfig)
})
