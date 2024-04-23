// module.exports = {
//   extends: [
//     'plugin:markdown/recommended',
//   ],
//   overrides: [
//     {
//       files: ['**/*.md'],
//       rules: {
//         '@typescript-eslint/no-redeclare': 'off',
//         '@typescript-eslint/no-unused-vars': 'off',
//         '@typescript-eslint/no-use-before-define': 'off',
//         '@typescript-eslint/no-var-requires': 'off',
//         'import/no-unresolved': 'off',
//         'no-alert': 'off',
//         'no-console': 'off',
//         'no-restricted-imports': 'off',
//         'no-undef': 'off',
//         'no-unused-expressions': 'off',
//         'no-unused-vars': 'off',
//       },
//     },
//   ],
// }

import { Linter } from 'eslint'
import markdownPlugin from 'eslint-plugin-markdown'

export function markdown(): Linter.FlatConfig[] {
  return [
    {
      plugins: {
        markdown: markdownPlugin,
      },
      files: [
        '**/*.md',
      ],
      rules: {
        '@typescript-eslint/no-redeclare': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        'import/no-unresolved': 'off',
        'no-alert': 'off',
        'no-console': 'off',
        'no-restricted-imports': 'off',
        'no-undef': 'off',
        'no-unused-expressions': 'off',
        'no-unused-vars': 'off',
      },
    },
  ]
}
