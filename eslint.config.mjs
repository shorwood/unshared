import unshared from '@unshared/eslint-config'

export default unshared({
  tsConfigPath: [
    './tsconfig.json',
    './examples/nuxt/tsconfig.json',
  ],
})
