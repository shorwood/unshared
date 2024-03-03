module.exports = {
  extends: [
    'plugin:unicorn/recommended',
  ],
  plugins: [
    'unicorn',
  ],
  rules: {
    /**
     * Improve regexes by making them shorter, consistent, and safer. This rule
     * aims to improve readability and consistency of regexes while also
     * mitigating regex denial of service attacks by disallowing potentially
     * catastrophic backtracking.
     *
     * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/better-regex.md
     */
    'unicorn/better-regex': 'error',

    /**
     * Enforce the catch clause parameter name to be named `error`. This rule
     * aims to enforce a consistent parameter name in catch clauses. The name
     * `error` is the most commonly used name for the parameter that is passed
     * to the catch clause.
     *
     * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/catch-error-name.md
     */
    'unicorn/catch-error-name': ['error', {
      name: 'error',
    }],

    'unicorn/error-message': 'error',
    'unicorn/escape-case': 'error',
    'unicorn/no-array-instanceof': 'error',
    'unicorn/no-new-buffer': 'error',
    'unicorn/no-unsafe-regex': 'error',
    'unicorn/number-literal-case': 'error',
    'unicorn/prefer-switch': 'off',
    'unicorn/prefer-exponentiation-operator': 'error',
    'unicorn/prefer-includes': 'error',
    'unicorn/prefer-starts-ends-with': 'error',
    'unicorn/prefer-text-content': 'error',
    'unicorn/prefer-type-error': 'error',
    'unicorn/throw-new-error': 'error',

    /**
     * Enforces a convention of grouping digits using numeric separators.
     * Long numbers can become really hard to read, so cutting it into groups
     * of digits, separated with a _, is important to keep your code clear.
     *
     * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/numeric-separators-style.md
     */
    'unicorn/numeric-separators-style': ['error', {
      onlyIfContainsSeparator: true,
    }],

    'unicorn/no-array-callback-reference': 'off',
    'unicorn/prefer-code-point': 'off',
    'unicorn/prefer-module': 'off',
    'unicorn/no-array-for-each': 'off',

    /**
     * Enforce the use of camelCase or PascalCase when naming folders, files and
     * variables. This rule aims to enforce a consistent naming convention for
     * filenames, directory names, and variable names.
     *
     * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/filename-case.md
     */
    'unicorn/filename-case': ['error', {
      cases: {
        camelCase: true,
        pascalCase: true,
      },
    }],

    'unicorn/consistent-function-scoping': 'off',
    'unicorn/prevent-abbreviations': ['error', {
      allowList: {
        x: true,
        y: true,
        i: true,
        j: true,
        dir: true,
        props: true,
        args: true,
        fn: true,
        ref: true,
      },
    }],
  },
}
