import { antfu } from './antfu'
import { eslintComments } from './eslintComments'
import { javascript } from './javascript'
import { jsdoc } from './jsdoc'
import { configJson } from './json'
import { jsonPackage } from './jsonPackage'
import { jsonTsconfig } from './jsonTsconfig'
import { markdown } from './markdown'
import { node } from './node'
import { typescript } from './typescript'
import { unicorn } from './unicorn'
import { vitest } from './vitest'
import { vue } from './vue'

export function all() {
  return [
    ...antfu(),
    ...eslintComments(),
    ...javascript(),
    ...jsdoc(),
    ...configJson(),
    ...jsonPackage(),
    ...jsonTsconfig(),
    ...markdown(),
    ...node(),
    // ...promise(),
    ...typescript(),
    ...unicorn(),
    ...vitest(),
    ...vue(),
    {
      ignores: [
        '**/dist',
        '**/bin',
        '**/node_modules',
        '**/.nuxt',
        '**/output',
        '**/coverage',
        '**/public',
        '**/__snapshots__',
        '**/LICENSE*',
        '**/CHANGELOG*',
        'packages-lock.json',
        'pnpm-lock.yaml',
        'yarn.lock',
      ],
    },
    // env: {
    //   browser: true,
    //   es6: true,
    //   node: true,
    // },
  ]
}

