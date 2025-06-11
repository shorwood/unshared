declare module 'eslint-plugin-*' {
  import type { ESLint } from 'eslint'
  const plugin: ESLint.Plugin
  export default plugin
}
