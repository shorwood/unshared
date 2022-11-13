import { expect, it } from 'vitest'
import { vol } from 'memfs'
import { getTsConfig } from './getTsConfig'

it('should get the tsconfig.json', async() => {
  const tsConfig = { compilerOptions: { target: 'esnext' } }
  const json = {
    '/home/user/project/tsconfig.json': JSON.stringify(tsConfig),
    '/tsconfig.json': '',
  }
  vol.fromJSON(json)
  const result = await getTsConfig('/home/user/project')
  expect(result).toStrictEqual(tsConfig)
})
