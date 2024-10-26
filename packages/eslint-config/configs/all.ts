import type { MaybeArray } from '@unshared/types'
import type { Linter } from 'eslint'
import { antfu } from './antfu'
import { eslintComments } from './eslintComments'
import { jsdoc } from './jsdoc'
import { configJson } from './json'
import { jsonPackage } from './jsonPackage'
import { jsonTsconfig } from './jsonTsconfig'
import { node } from './node'
import { sonarjs } from './sonarjs'
import { typescript } from './typescript'
import { unicorn } from './unicorn'
import { vitest } from './vitest'
import { vue } from './vue'
import { yml } from './yml'

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
    ...yml(),
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
