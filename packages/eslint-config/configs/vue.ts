import { ESLint, Linter } from 'eslint'
import vuePlugin from 'eslint-plugin-vue'
import tslint from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'

// @ts-expect-error: `eslint-plugin-vue` has no types declaration.
const VUE_RECOMMENDED_RULES = vuePlugin.configs?.['flat/recommended'].rules as Linter.RulesRecord

export function vue(): Linter.FlatConfig[] {
  return [
    {
      plugins: {
        'vue': vuePlugin,
        '@typescript-eslint': tslint.plugin as ESLint.Plugin,
      },
      languageOptions: {
        parser: vueParser,
        parserOptions: {
          ecmaFeatures: { jsx: false },
          ecmaVersion: 'latest',
          sourceType: 'module',
          parser: tslint.parser,
        },
        globals: {
          computed: 'readonly',
          defineEmits: 'readonly',
          defineExpose: 'readonly',
          defineProps: 'readonly',
          onMounted: 'readonly',
          onUnmounted: 'readonly',
          reactive: 'readonly',
          ref: 'readonly',
          shallowReactive: 'readonly',
          shallowRef: 'readonly',
          toRef: 'readonly',
          toRefs: 'readonly',
          watch: 'readonly',
          watchEffect: 'readonly',
        },
      },
      files: [
        '**/*.vue',
      ],
      rules: {
        ...VUE_RECOMMENDED_RULES,

        /**
         * Enforces consistent usage of type imports. This rule will enforce the use
         * of `type` imports to make it easier for the Vue SFC compiler to analyze
         * the code and infer the dependency graph correctly.
         *
         * @see https://typescript-eslint.io/rules/consistent-type-imports
         * @see https://vuejs.github.io/vetur/guide/FAQ.html#why-does-vetur-show-cannot-find-module-xxx
         */
        '@typescript-eslint/consistent-type-imports': ['error', {
          disallowTypeAnnotations: false,
          fixStyle: 'inline-type-imports',
          prefer: 'type-imports',
        }],

        /**
         * Since we may use the auto-import feature of Nuxt / unplugin-autoimport,
         * we may have access to global variables that are not known to ESLint.
         *
         * @see https://eslint.org/docs/latest/rules/no-undef
         */
        'semi': 'off',
        'no-undef': 'off',

        /**
         * Enforce the component name casing to be PascalCase. This rules helps identify
         * and distinguish between components and HTML elements. It also helps to avoid
         * conflicts with existing and future HTML elements.
         *
         * @see https://eslint.vuejs.org/rules/component-name-in-template-casing.html
         */
        'vue/component-name-in-template-casing': ['error', 'PascalCase', {
          registeredComponentsOnly: false,
          ignores: ['/\\./'],
        }],

        /**
         * Allow single-word component names. This rule is disabled because we use
         * pascal-casing to distinguish between components and HTML elements.
         *
         * @see https://eslint.vuejs.org/rules/multi-word-component-names.html
         */
        'vue/multi-word-component-names': 'off',

        /**
         * Reports the destructuring or member expression of props passed to setup
         * causing the value to lose reactivity. This rule helps to avoid common
         * pitfalls when using the Composition API.
         *
         * @see https://eslint.vuejs.org/rules/no-setup-props-reactivity-loss.html
         */
        'vue/no-setup-props-reactivity-loss': 'error',

        /**
         * Enforce the order of the top-level properties in the component. This rule
         * helps to maintain consistency and readability by enforcing a predictable
         * order of the top-level properties in the component.
         *
         * @see https://eslint.vuejs.org/rules/ordered-component-elements.html
         */
        'vue/block-order': ['error', {
          order: [
            'docs',
            'script',
            'template',
            'style',
          ],
        }],

        /**
         * Enforce use of the Composition API and TypeScript. This rule forbids the
         * use of the Options API and JavaScript in Vue components for better
         * consistency and maintainability.
         *
         * @see https://eslint.vuejs.org/rules/vue/prefer-define-options.html
         */
        'vue/component-api-style': ['error', ['script-setup']],
        'vue/prefer-define-options': 'error',
        'vue/block-lang': ['error', { script: { lang: 'ts' } }],

        /**
         * Enforce consistent spacing and newlines in the template. This rule helps
         * to maintain consistency and readability by enforcing a predictable
         *
         * @see https://eslint.vuejs.org/rules/max-attributes-per-line.html
         * @see https://eslint.vuejs.org/rules/html-closing-bracket-newline.html
         */
        'vue/max-attributes-per-line': ['error', {
          singleline: { max: 3 },
          multiline: { max: 1 },
        }],
        'vue/html-closing-bracket-newline': ['error', {
          singleline: 'never',
          multiline: 'never',
        }],

        /**
         * Disallow v-if in v-for. This rule helps to avoid common pitfalls when
         * using v-if and v-for together in the same element.
         *
         * @see https://eslint.vuejs.org/rules/no-use-v-if-with-v-for.html
         */
        'vue/no-use-v-if-with-v-for': 'error',
        'vue/no-use-v-else-with-v-for': 'error',

        /**
         * Enforce consistent spacing between HTML / Component tags. This makes it
         * easier to read and understand the structure of the component.
         *
         * @see https://eslint.vuejs.org/rules/padding-line-between-tags.html
         * @see https://eslint.vuejs.org/rules/padding-line-between-blocks.html
         */
        'vue/padding-line-between-blocks': ['error', 'always'],
        'vue/padding-line-between-tags': ['error', [{
          blankLine: 'consistent',
          prev: '*',
          next: '*',
        }]],

        /**
         * Enforce the declaration of emits in the setup function and warn on unused
         * emits declarations. This rule helps reduce the risk stale code.
         *
         * @see https://eslint.vuejs.org/rules/require-explicit-emits.html
         * @see https://eslint.vuejs.org/rules/no-unused-emit-declarations.html
         */
        'vue/require-explicit-emits': 'error',
        'vue/no-unused-emit-declarations': 'error',

        /**
         * Enforce the `@` shorthand over `v-on:` and only allow inline callbacks.
         * This rule helps to maintain consistency and readability by enforcing a
         * predictable order of the event handlers in the component.
         *
         * @see https://eslint.vuejs.org/rules/v-on-style.html
         * @see https://eslint.vuejs.org/rules/v-on-handler-style.html
         */
        'vue/v-on-style': ['error', 'shorthand'],
        'vue/v-on-handler-style': ['error', 'inline'],

        'vue/object-curly-newline': ['error', { multiline: true, consistent: true }],
        'vue/object-curly-spacing': ['error', 'always'],
        'vue/no-v-html': 'off',
        'vue/require-prop-types': 'off',
        'vue/require-default-prop': 'off',
        'vue/prefer-import-from-vue': 'off',

        // reactivity transform
        'vue/block-tag-newline': ['error', {
          singleline: 'always',
          multiline: 'always',
        }],

        'vue/component-options-name-casing': ['error', 'PascalCase'],
        'vue/custom-event-name-casing': ['error', 'camelCase'],
        'vue/define-macros-order': ['error', {
          order: ['defineProps', 'defineEmits'],
        }],
        'vue/html-comment-content-spacing': ['error', 'always', {
          exceptions: ['-'],
        }],
        'vue/no-restricted-v-bind': ['error', '/^v-/'],
        'vue/no-useless-v-bind': 'error',
        'vue/no-v-text-v-html-on-component': 'error',
        'vue/prefer-separate-static-class': 'error',

        // extensions
        'vue/array-bracket-spacing': ['error', 'never'],
        'vue/arrow-spacing': ['error', { before: true, after: true }],
        'vue/block-spacing': ['error', 'always'],
        'vue/brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
        'vue/comma-dangle': ['error', 'always-multiline'],
        'vue/comma-spacing': ['error', { before: false, after: true }],
        'vue/comma-style': ['error', 'last'],
        'vue/dot-location': ['error', 'property'],
        'vue/dot-notation': ['error', { allowKeywords: true }],
        'vue/eqeqeq': ['error', 'smart'],
        // 'vue/func-call-spacing': ['off', 'never'],
        'vue/key-spacing': ['error', { beforeColon: false, afterColon: true }],
        'vue/keyword-spacing': ['error', { before: true, after: true }],
        'vue/no-constant-condition': 'warn',
        'vue/no-empty-pattern': 'error',
        'vue/no-extra-parens': ['error', 'functions'],
        'vue/no-irregular-whitespace': 'error',
        'vue/no-loss-of-precision': 'error',
        'vue/no-restricted-syntax': [
          'error',
          'DebuggerStatement',
          'LabeledStatement',
          'WithStatement',
        ],
        'vue/no-sparse-arrays': 'error',
        'vue/object-shorthand': [
          'error',
          'always',
          {
            ignoreConstructors: false,
            avoidQuotes: true,
          },
        ],
        'vue/operator-linebreak': ['error', 'before'],
        'vue/prefer-template': 'error',
        'vue/quote-props': ['error', 'consistent-as-needed'],
        'vue/space-in-parens': ['error', 'never'],
        'vue/space-infix-ops': 'error',
        'vue/space-unary-ops': ['error', { words: true, nonwords: false }],
        'vue/template-curly-spacing': 'error',
      },
    },
  ]
}
