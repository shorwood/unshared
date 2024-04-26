import unsharedConfig from './packages/eslint-config/dist/index.js'

export default unsharedConfig({
  tsConfigPaths: [
    './tsconfig.json',
    './examples/nuxt/tsconfig.json',
  ],
})
