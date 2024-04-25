import markdownPlugin from 'eslint-plugin-markdown'
import { Linter } from 'eslint'

export function markdown(): Linter.FlatConfig[] {
  return [
    {
      files: [
        '**/*.md',
      ],
      plugins: {
        markdown: markdownPlugin,
      },
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
