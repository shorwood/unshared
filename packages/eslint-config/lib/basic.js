/* eslint-disable unicorn/prefer-module */
module.exports = {
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  extends: [
    'standard',
    'plugin:import/recommended',
    'plugin:eslint-comments/recommended',
    "plugin:jsonc/recommended-with-jsonc",
    'plugin:yml/standard',
    'plugin:markdown/recommended',
    'plugin:unicorn/recommended',
    'plugin:jsdoc/recommended',
    'plugin:sonarjs/recommended',
  ],
  ignorePatterns: [
    '*.min.*',
    'CHANGELOG.md',
    'dist',
    'bin',
    'node_modules',
    '.nuxt',
    'LICENSE*',
    'output',
    'coverage',
    'public',
    'temp',
    'packages-lock.json',
    'pnpm-lock.yaml',
    'yarn.lock',
    '__snapshots__',
    '!.vitepress',
    '!.vscode',
  ],
  plugins: [
    'html',
    'jsdoc',
    'unicorn',
    'sonarjs',
  ],
  settings: {
    'import/resolver': {
      node: { extensions: ['.js', '.mjs', '.ts', '.d.ts'] },
    },
  },
  overrides: [
    {
      files: ['*.json', '*.json5'],
      parser: 'jsonc-eslint-parser',
      rules: {
        'quotes': ['error', 'double'],
        'quote-props': ['error', 'always'],
        'comma-dangle': ['error', 'never'],
      },
    },
    {
      files: ['*.yaml', '*.yml'],
      parser: 'yaml-eslint-parser',
      rules: {
        'spaced-comment': 'off',
      },
    },
    {
      files: ['package.json'],
      parser: 'jsonc-eslint-parser',
      rules: {
        'jsonc/sort-keys': [
          'error',
          {
            pathPattern: '^$',
            order: [
              'name',
              'type',
              'version',
              'license',
              'private',
              'sideEffects',
              
              // --- Publishing
              'description',
              'author',
              'keywords',
              'bugs',
              'funding',
              'homepage',
              'repository',

              // --- Distribution
              'bin',
              'main',
              'module',
              'types',
              'typings',
              'browser',
              'exports',
              'files',

              // --- Package Manager
              'packageManager',
              'pnpm',

              // --- Scripts
              'scripts',

              // --- Dependencies
              'peerDependencies',
              'peerDependenciesMeta',
              'optionalDependencies',
              'dependencies',
              'devDependencies',
              'bundledDependencies',
              'bundleDependencies',

              // --- Config
              'tsup',
              'husky',
              'lint-staged',
              'eslintConfig',
            ],
          },
          {
            pathPattern: '^(?:dev|peer|optional|bundled)?[Dd]ependencies$',
            order: { type: 'asc' },
          },
        ],
      },
    },
    {
      files: ['*.d.ts'],
      rules: {
        'import/no-duplicates': 'off',
      },
    },
    {
      files: ['*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      files: ['scripts/**/*.*', 'cli.*'],
      rules: {
        'no-console': 'off',
      },
    },
    {
      files: ['*.test.ts', '*.test.js', '*.spec.ts', '*.spec.js'],
      rules: {
        'no-unused-expressions': 'off',
      },
    },
    {
      // Code blocks in markdown file
      files: ['**/*.md/*.*'],
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
  ],
  rules: {
    // import
    'import/order': ['error', {
      alphabetize: { order: 'asc' },
    }],
    'import/first': 'error',
    'import/no-mutable-exports': 'error',
    'import/no-unresolved': 'off',
    'import/no-absolute-path': 'off',
    'import/no-useless-path-segments': 'error',

    // EsLint: Common
    'semi': ['error', 'never'],
    'curly': ['error', 'multi-or-nest', 'consistent'],
    'quotes': ['error', 'single'],
    'quote-props': ['error', 'consistent-as-needed'],
    'no-unused-vars': 'warn',
    'no-param-reassign': 'off',
    'array-bracket-spacing': ['error', 'never'],
    'brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
    'block-spacing': ['error', 'always'],
    'camelcase': 'off',
    'comma-spacing': ['error', { before: false, after: true }],
    'comma-style': ['error', 'last'],
    'comma-dangle': ['error', 'always-multiline'],
    'no-constant-condition': 'error',
    'no-debugger': 'error',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-cond-assign': ['error', 'always'],
    'func-call-spacing': ['off', 'never'],
    'key-spacing': ['error', { beforeColon: false, afterColon: true }],
    'indent': ['error', 2, { SwitchCase: 1, VariableDeclarator: 1, outerIIFEBody: 1 }],
    'no-restricted-syntax': ['error', 'DebuggerStatement', 'LabeledStatement', 'WithStatement'],
    'object-curly-spacing': ['error', 'always'],
    'no-return-await': 'off',
    'space-before-function-paren': ['error', 'never'],

    // es6
    'no-var': 'error',
    'prefer-const': ['error', { destructuring: 'any', ignoreReadBeforeAssign: true }],
    'prefer-arrow-callback': ['error', { allowNamedFunctions: false, allowUnboundThis: true }],
    'object-shorthand': ['error', 'always', { ignoreConstructors: false, avoidQuotes: true }],
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'error',
    'template-curly-spacing': 'error',
    'no-confusing-arrow': 'error',
    'arrow-body-style': ['error', 'as-needed'],
    'arrow-parens': ['error', 'as-needed', { requireForBlockBody: true }],
    'generator-star-spacing': 'off',
    'spaced-comment': ['error', 'always', {
      line: {
        markers: ['/'],
        exceptions: ['/', '#'],
      },
      block: {
        markers: ['!'],
        exceptions: ['*'],
        balanced: true,
      },
    }],

    // EsLint: best-practice
    'eol-last': 'error',
    'array-callback-return': 'error',
    'block-scoped-var': 'error',
    'consistent-return': 'off',
    'complexity': ['off', 11],
    'eqeqeq': ['error', 'smart'],
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-alert': 'error',
    'no-case-declarations': 'error',
    'no-multi-spaces': 'error',
    'no-trailing-spaces': 'error',
    'no-multi-str': 'error',
    'no-with': 'error',
    'no-void': 'error',
    'no-useless-escape': 'off',
    'vars-on-top': 'error',
    'require-await': 'off',
    'no-return-assign': 'off',
    'one-var-declaration-per-line': 'error',
    'operator-linebreak': ['error', 'before'],
    'sort-imports': [
      'error',
      {
        ignoreCase: false,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        allowSeparatedGroups: false,
      },
    ],

    // --- Unicorn: https://github.com/sindresorhus/eslint-plugin-unicorn
    'unicorn/better-regex': 'error',
    'unicorn/error-message': 'error',
    'unicorn/escape-case': 'error',
    'unicorn/no-array-instanceof': 'error',
    'unicorn/no-new-buffer': 'error',
    'unicorn/no-unsafe-regex': 'error',
    'unicorn/number-literal-case': 'error',
    'unicorn/prefer-exponentiation-operator': 'error',
    'unicorn/prefer-includes': 'error',
    'unicorn/prefer-starts-ends-with': 'error',
    'unicorn/prefer-text-content': 'error',
    'unicorn/prefer-type-error': 'error',
    'unicorn/throw-new-error': 'error',
    'unicorn/numeric-separators-style': 'off',
    'unicorn/no-array-callback-reference': 'off',
    'unicorn/prefer-code-point': 'off',
    'unicorn/prefer-module': 'off',
    'unicorn/no-array-for-each': 'off',
    'unicorn/filename-case': ['error', { cases: { camelCase: true, pascalCase: true } }],
    'unicorn/consistent-function-scoping': 'off',
    'unicorn/prevent-abbreviations': ['error', {
      allowList: {
        props: true,
        args: true,
        fn: true,
      },
    }],

    'no-use-before-define': ['error', { functions: false, classes: false, variables: true }],
    'eslint-comments/disable-enable-pair': 'off',
    'import/no-named-as-default-member': 'off',
    'n/no-callback-literal': 'off',

    // yml
    'yml/quotes': ['error', { prefer: 'single', avoidEscape: false }],
    'yml/no-empty-document': 'off',

    // --- JSDOC
    'jsdoc/require-jsdoc': 'off',
    'jsdoc/check-alignment': 'error',
  },
}
