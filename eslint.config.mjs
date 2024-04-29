import unsharedConfig from './packages/eslint-config/dist/index.js'

export default unsharedConfig({
  tsConfigPath: [
    './tsconfig.json',
    './examples/nuxt/tsconfig.json',
  ],
})
