declare module 'eslint-plugin-*' {
  import type { ESLint } from 'eslint'
  const plugin: ESLint.Plugin
  export default plugin
}

// import 'eslint'
// declare module 'eslint' {
//   export namespace Linter {
//     export interface FlatConfig {
//       name?: string
//     }
//   }
// }
