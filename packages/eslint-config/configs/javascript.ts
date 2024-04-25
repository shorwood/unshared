import { Linter } from 'eslint'
import javascriptPlugin from '@eslint/js'

/**
 * ESLint configuration for JavaScript files.
 *
 * @returns The configuration for JavaScript files.
 */
export function javascript(): Linter.FlatConfig[] {
  return [
    {
      rules: {

        /**
         * Inherit all recommended rules from the `@eslint/js` plugin. This is the base
         * configuration for JavaScript files.
         */
        ...javascriptPlugin.configs.recommended.rules,

        'array-callback-return': 'error',
        'arrow-body-style': ['error', 'as-needed'],
        'arrow-parens': ['error', 'as-needed', { requireForBlockBody: true }],
        'block-scoped-var': 'error',

        'camelcase': 'off',
        'comma-style': ['error', 'last'],
        'complexity': ['off', 11],
        'consistent-return': 'off',
        'curly': ['error', 'multi-or-nest', 'consistent'],
        'eqeqeq': ['error', 'smart'],
        'n/no-callback-literal': 'off',
        'no-alert': 'error',
        'no-case-declarations': 'error',
        'no-cond-assign': ['error', 'always'],
        'no-confusing-arrow': 'error',
        'no-console': ['warn', { allow: ['warn', 'error'] }],
        'no-constant-condition': 'error',
        'no-debugger': 'error',
        'no-eval': 'error',
        'no-implied-eval': 'error',
        'no-multi-spaces': 'error',
        'no-multi-str': 'error',
        'no-param-reassign': 'off',
        'no-restricted-syntax': ['error', 'DebuggerStatement', 'LabeledStatement', 'WithStatement'],
        'no-return-assign': 'off',
        'no-return-await': 'off',
        'no-trailing-spaces': 'error',
        'no-unused-vars': 'warn',
        'no-use-before-define': ['error', { classes: false, functions: false, variables: true }],
        'no-useless-escape': 'off',
        'no-var': 'error',
        'no-with': 'error',
        'object-shorthand': ['error', 'always', { avoidQuotes: true, ignoreConstructors: false }],
        'one-var-declaration-per-line': 'error',
        'operator-linebreak': ['error', 'before'],
        'prefer-arrow-callback': ['error', { allowNamedFunctions: false, allowUnboundThis: true }],
        'prefer-const': ['error', { destructuring: 'any', ignoreReadBeforeAssign: true }],
        'prefer-rest-params': 'error',
        'prefer-spread': 'error',
        'prefer-template': 'error',
        'quote-props': ['error', 'consistent-as-needed'],
        'quotes': ['error', 'single'],
        'require-await': 'off',
        'space-before-function-paren': ['error', 'never'],
        'vars-on-top': 'error',
      },
    },
  ]
}
