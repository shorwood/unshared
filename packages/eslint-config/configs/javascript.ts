import javascriptPlugin from '@eslint/js'
import { Linter } from 'eslint'

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

        /**
         * Allow `void` operator. It's useful to discard the result of an expression, especially
         * when calling asynchronous functions that return a promise.
         *
         * @see https://eslint.org/docs/rules/no-void
         */
        'no-void': 'off',

        /**
         * Enforce a consistent linebreak style. Reduces merge conflicts and makes the code
         * more consistent between different iterations of the same file.
         *
         * @see https://eslint.org/docs/rules/linebreak-style
         */
        'no-multiple-empty-lines': ['error', {
          max: 1,
          maxBOF: 0,
          maxEOF: 1,
        }],

        'array-bracket-spacing': ['error', 'never'],
        'array-callback-return': 'error',
        'arrow-body-style': ['error', 'as-needed'],
        'arrow-parens': ['error', 'as-needed', { requireForBlockBody: true }],
        'block-scoped-var': 'error',
        'block-spacing': ['error', 'always'],
        'brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
        'camelcase': 'off',
        'comma-dangle': ['error', 'always-multiline'],
        'comma-spacing': ['error', { after: true, before: false }],
        'comma-style': ['error', 'last'],
        'complexity': ['off', 11],
        'consistent-return': 'off',
        'curly': ['error', 'multi-or-nest', 'consistent'],
        'eol-last': 'error',
        'eqeqeq': ['error', 'smart'],
        'func-call-spacing': ['off', 'never'],
        'generator-star-spacing': 'off',
        'indent': ['error', 2, { SwitchCase: 1, VariableDeclarator: 1, outerIIFEBody: 1 }],
        'key-spacing': ['error', { afterColon: true, beforeColon: false }],
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
        'object-curly-spacing': ['error', 'always'],
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
        'semi': ['error', 'never'],
        'space-before-function-paren': ['error', 'never'],
        'spaced-comment': ['error', 'always', {
          block: {
            balanced: true,
            exceptions: ['*'],
            markers: ['!'],
          },
          line: {
            exceptions: ['/', '#'],
            markers: ['/'],
          },
        }],

        'template-curly-spacing': 'error',
        'vars-on-top': 'error',
      },
    },
  ]
}
