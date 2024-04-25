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

export function all() {
  return [
    ...antfu(),
    ...eslintComments(),
    ...jsdoc(),
    ...configJson(),
    ...jsonPackage(),
    ...jsonTsconfig(),
    ...node(),
    ...sonarjs(),
    ...typescript(),
    ...unicorn(),
    ...vitest(),
    ...vue(),

    // ...promise(),
    // ...markdown(),
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

