/* eslint-disable unicorn/prefer-module */
module.exports = {
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:eslint-comments/recommended',
    'plugin:jsonc/recommended-with-jsonc',
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
    'antfu',
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
    /**
     * Impose a consistent ordering for `require()`/`import` statements. Removing the
     * task of ordering imports and requires and avoid unnecessary merge conflicts
     * when working on the same file with multiple people.
     *
     * @see https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/first.md
     * @see https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md
     */
    'import/first': 'error',
    'import/order': ['error', {
      'newlines-between': 'never',
      'alphabetize': {
        order: 'asc',
        orderImportKind: 'asc',
        caseInsensitive: true,
      },
    }],

    'import/no-mutable-exports': 'error',
    'import/no-unresolved': 'off',
    'import/no-absolute-path': 'off',
    'import/no-useless-path-segments': 'error',

    /**
     * Auto-fix import deduplication. The TypeScript compiler already detects and removes
     * duplicate imports, but this rule can be used to fix the issue automatically in the editor.
     *
     * @see https://github.com/antfu/eslint-plugin-antfu/blob/main/src/rules/import-dedupe.md
     */
    'antfu/import-dedupe': 'error',

    /**
     * Enforce top-level function to be declared using function instead of arrow function. This
     * rule helps when you want to add additional overload signatures to a function without
     * having to transform the arrow function into a function declaration manually.
     *
     * On top of that, it mitigates the risk of accidentally using the `this` instance from
     * an outer scope.
     *
     * @see https://github.com/antfu/eslint-plugin-antfu/blob/main/src/rules/top-level-function.md
     */
    'antfu/top-level-function': 'error',

    /**
     * Enforce consistent line breaks inside braces of object/array/named imports/exports and
     * function parameters. Reduces the cognitive load of reasoning about code style.
     *
     * @see https://github.com/antfu/eslint-plugin-antfu/blob/main/src/rules/consistent-list-newline.md
     */
    'antfu/consistent-list-newline': 'error',

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
    // 'jsdoc/check-alignment': 'error',

    /**
     * Enforce a new-line between the JSDoc summary and tags. Aims to improve
     * readability by separating the summary and tags.
     *
     * @see https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/tag-lines.md#readme
     */
    'jsdoc/tag-lines': ['error', 'any', { startLines: 1 }],

    /**
     * Checks for multi-line-style comments which fail to meet the criteria of a jsdoc block,
     * namely that it should begin with two and only two asterisks.
     *
     * @see https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/no-bad-blocks.md#readme
     */
    'jsdoc/no-bad-blocks': 'error',

    /**
     * It is common practice to prefix a hyphen to parameters in JSDoc. But this
     * is sometimes forgotten and has no real purpose. This rule aims to enforce
     * that no hyphen is used.
     *
     * @see https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/require-hyphen-before-param-description#readme
     */
    'jsdoc/require-hyphen-before-param-description': ['error', 'never'],

    /**
     * Devs sometimes write JSDoc descriptions that add no additional information just to fill
     * out the doc. Those "uninformative" docs comments take up space without being helpful.
     * This rule requires all docs comments contain at least one word not already in the code.
     *
     * @see https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/informative-docs.md#readme
     */
    'jsdoc/informative-docs': 'error',

    /**
     * Normalize the indentation in the JSdoc comment to improve readability.
     *
     * @see https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/check-indentation.md#readme
     */
    'jsdoc/check-indentation': 'error',
  },
}
