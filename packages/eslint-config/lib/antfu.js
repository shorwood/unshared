module.exports = {
  plugins: [
    'antfu',
  ],
  rules: {
    /**
     * Enforce consistent line breaks inside braces of object/array/named imports/exports and
     * function parameters. Reduces the cognitive load of reasoning about code style.
     *
     * @see https://github.com/antfu/eslint-plugin-antfu/blob/main/src/rules/consistent-list-newline.md
     */
    'antfu/consistent-list-newline': 'error',

    /**
     * Auto-fix import duplication. The TypeScript compiler already detects and removes
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
  },
}
