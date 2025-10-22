import unshared from '@unshared/eslint-config'

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...unshared(),
  {
    ignores: [
      'examples/nuxt/**',
    ],
  },
]
