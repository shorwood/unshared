import { Linter } from 'eslint'
import { MaybeArray } from '@unshared/types'
import { vue } from './vue'
import { vitest } from './vitest'
import { unicorn } from './unicorn'
import { typescript } from './typescript'
import { sonarjs } from './sonarjs'
import { node } from './node'
import { jsonTsconfig } from './jsonTsconfig'
import { jsonPackage } from './jsonPackage'
import { configJson } from './json'
import { jsdoc } from './jsdoc'
import { eslintComments } from './eslintComments'
import { antfu } from './antfu'

export interface ESLintConfigOptions {
  tsConfigPath?: MaybeArray<string>
  rules?: Linter.RulesRecord
}

export function all(options: ESLintConfigOptions = {}) {
  return [
    ...antfu(options),
    ...eslintComments(options),
    ...jsdoc(options),
    ...configJson(options),
    ...jsonPackage(),
    ...jsonTsconfig(),
    ...node(options),
    ...sonarjs(options),
    ...typescript(options),
    ...unicorn(options),
    ...vitest(options),
    ...vue(options),
    {
      ignores: [
        '**/dist',
        '**/bin',
        '**/node_modules',
        '**/.nuxt',
        '**/output',
        '**/coverage',
        '**/public',
        '**/__wip__',
        '**/__snapshots__',
        '**/LICENSE*',
        '**/CHANGELOG*',
        'packages-lock.json',
        'pnpm-lock.yaml',
        'yarn.lock',
      ],
    },
  ]
}
