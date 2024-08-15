import type { Linter } from 'eslint'
import type { ESLintConfigOptions } from './all'
import { mergeProcessors } from 'eslint-merge-processors'
import vuePlugin from 'eslint-plugin-vue'
import vueProcessorBlocks from 'eslint-processor-vue-blocks'
import tslint from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'
import { typescript } from './typescript'

export function vue(options: ESLintConfigOptions): Linter.FlatConfig[] {
  const TYPESCRIPT_CONFIG = typescript(options).at(1)!
  return [
    ...vuePlugin.configs?.['flat/base'] as Linter.FlatConfig[],
    {
      plugins: {
        vue: vuePlugin,
        ...TYPESCRIPT_CONFIG.plugins,
      },
      languageOptions: {
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
        parser: vueParser,
        parserOptions: {
          parser: tslint.parser,
          extraFileExtensions: ['.vue'],
          ...TYPESCRIPT_CONFIG.languageOptions!.parserOptions,
        },
      },
      processor: mergeProcessors([
        // @ts-expect-error: ignore
        vuePlugin.processors['.vue'],
        vueProcessorBlocks(),
      ]),
      files: [
        '**/*.vue',
      ],
      rules: {
        ...TYPESCRIPT_CONFIG.rules as Linter.RulesRecord,
        // @ts-expect-error: ignore
        ...vuePlugin.configs['flat/recommended'].rules as Linter.RulesRecord,
        // @ts-expect-error: ignore
        ...vuePlugin.configs['flat/strongly-recommended'].rules as Linter.RulesRecord,
        // @ts-expect-error: ignore
        ...vuePlugin.configs['flat/essential'].rules as Linter.RulesRecord,

        /**
         * Disable some TypeScript rules that may conflict with the Vue SFC parser.
         */
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-misused-promises': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',

        /**
         * Enforces consistent usage of type imports. This rule will enforce the use
         * of `type` imports to make it easier for the Vue SFC compiler to analyze
         * the code and infer the dependency graph correctly.
         *
         * @see https://typescript-eslint.io/rules/consistent-type-imports
         * @see https://vuejs.github.io/vetur/guide/FAQ.html#why-does-vetur-show-cannot-find-module-xxx
         */
        // '@typescript-eslint/consistent-type-imports': ['error', {
        //   disallowTypeAnnotations: false,
        //   fixStyle: 'inline-type-imports',
        //   prefer: 'type-imports',
        // }],

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
         * @see https://eslint.vuejs.org/rules/vue/component-api-style.html
         */
        'vue/prefer-define-options': 'error',
        'vue/component-api-style': ['error', ['script-setup']],

        /**
         * Enforce the component name casing to be PascalCase. This rules helps identify
         * and distinguish between components and HTML elements. It also helps to avoid
         * conflicts with existing and future HTML elements.
         *
         * @see https://eslint.vuejs.org/rules/component-name-in-template-casing.html
         */
        'vue/component-name-in-template-casing': ['error', 'PascalCase', {
          ignores: [String.raw`/\./`],
          registeredComponentsOnly: false,
        }],

        /**
         * Enforce consistent spacing between HTML comments and their content.
         *
         * @see https://eslint.vuejs.org/rules/html-comment-content-spacing.html
         * @see https://eslint.vuejs.org/rules/html-comment-content-newline.html
         */
        'vue/html-comment-content-spacing': ['error', 'always'],
        'vue/html-comment-content-newline': ['error', {
          multiline: 'always',
          singleline: 'never',
        }],

        /**
         * Enforce consistent spacing between HTML / Component tags. This makes it
         * easier to read and understand the structure of the component.
         *
         * @see https://eslint.vuejs.org/rules/block-spacing.html
         * @see https://eslint.vuejs.org/rules/padding-line-between-blocks.html
         * @see https://eslint.vuejs.org/rules/padding-line-between-tags.html
         */
        'vue/block-spacing': ['error', 'always'],
        'vue/padding-line-between-blocks': ['error', 'always'],
        'vue/padding-line-between-tags': ['error', [
          { blankLine: 'consistent', next: '*', prev: '*' },
          { blankLine: 'always', next: '*', prev: 'comment' },
        ]],

        'vue/html-comment-indent': ['error', 2],
        'vue/multiline-html-element-content-newline': ['error', {
          allowEmptyLines: true,
          ignores: [],
          ignoreWhenEmpty: true,
        }],

        /**
         * Enforce consistent spacing and newlines in the template. This rule helps
         * to maintain consistency and readability by enforcing a predictable
         *
         * @see https://eslint.vuejs.org/rules/html-indent.html
         * @see https://eslint.vuejs.org/rules/max-attributes-per-line.html
         * @see https://eslint.vuejs.org/rules/html-closing-bracket-newline.html
         */
        'vue/html-indent': ['error', 2, {
          alignAttributesVertically: true,
          attribute: 1,
          baseIndent: 1,
          closeBracket: 0,
          ignores: [],
        }],

        // 'vue/func-call-spacing': ['off', 'never'],
        'vue/key-spacing': ['error', { afterColon: true, beforeColon: false }],
        'vue/keyword-spacing': ['error', { after: true, before: true }],
        'vue/max-attributes-per-line': ['error', {
          multiline: { max: 1 },
          singleline: { max: 5 },
        }],

        /**
         * Allow single-word component names. This rule is disabled because we use
         * pascal-casing to distinguish between components and HTML elements.
         *
         * @see https://eslint.vuejs.org/rules/multi-word-component-names.html
         */
        'vue/multi-word-component-names': 'off',
        'vue/no-reserved-component-names': 'off',

        /**
         * Reports the destructuring or member expression of props passed to setup
         * causing the value to lose reactivity. This rule helps to avoid common
         * pitfalls when using the Composition API.
         *
         * @see https://eslint.vuejs.org/rules/no-setup-props-reactivity-loss.html
         */
        'vue/no-setup-props-reactivity-loss': 'error',

        /**
         * Disallow v-if in v-for. This rule helps to avoid common pitfalls when
         * using v-if and v-for together in the same element.
         *
         * @see https://eslint.vuejs.org/rules/no-use-v-if-with-v-for.html
         */
        'vue/no-use-v-if-with-v-for': 'error',

        /**
         * Enforce the declaration of emits in the setup function and warn on unused
         * emits declarations. This rule helps reduce the risk stale code.
         *
         * @see https://eslint.vuejs.org/rules/require-explicit-emits.html
         * @see https://eslint.vuejs.org/rules/no-unused-emit-declarations.html
         */
        'vue/require-explicit-emits': 'error',

        /**
         * Enforce the `@` shorthand over `v-on:` and only allow inline callbacks.
         * This rule helps to maintain consistency and readability by enforcing a
         * predictable order of the event handlers in the component.
         *
         * @see https://eslint.vuejs.org/rules/v-on-style.html
         * @see https://eslint.vuejs.org/rules/v-on-handler-style.html
         */
        'vue/v-on-style': ['error', 'shorthand'],
        'vue/v-on-handler-style': ['error', 'inline-function'],

        /**
         * Sort the vue attributes in a consistent order. This rule helps to maintain
         * consistency and readability by enforcing a predictable order of the
         * attributes in the component.
         *
         * @see https://eslint.vuejs.org/rules/attributes-order.html
         */
        'vue/attributes-order': ['error', {
          order: [
            'DEFINITION',
            'LIST_RENDERING',
            'CONDITIONALS',
            'RENDER_MODIFIERS',
            'GLOBAL',
            ['UNIQUE', 'SLOT'],
            'TWO_WAY_BINDING',
            'OTHER_DIRECTIVES',
            'OTHER_ATTR',
            'EVENTS',
            'CONTENT',
          ],
          alphabetical: false,
        }],

        /**
         * Enforce consistent spacing around attribute assignments. This ensures that
         * the code is easier to read and maintain.
         *
         * @see https://eslint.vuejs.org/rules/no-spaces-around-equal-signs-in-attribute.html
         */
        'vue/no-spaces-around-equal-signs-in-attribute': 'error',
        'vue/no-multi-spaces': 'error',

        /**
         * Enforce the use of the `ts` lang attribute in the script block. This rule
         * explicitly dissallows the use of the `js` lang attribute in the script.
         */
        'vue/block-lang': ['error', {
          script: { lang: 'ts' },
        }],

        'vue/return-in-computed-property': 'off',
        'vue/no-sparse-arrays': 'error',
        'vue/no-unused-emit-declarations': 'error',
        'vue/no-use-v-else-with-v-for': 'error',
        'vue/no-useless-v-bind': 'error',
        'vue/no-v-html': 'off',
        'vue/no-v-text-v-html-on-component': 'error',
        'vue/object-curly-newline': ['error', { consistent: true, multiline: true }],
        'vue/object-curly-spacing': ['error', 'always'],
        'vue/object-shorthand': [
          'error',
          'always',
          {
            avoidQuotes: true,
            ignoreConstructors: false,
          },
        ],
        'vue/operator-linebreak': ['error', 'before'],
        'vue/prefer-import-from-vue': 'off',
        'vue/prefer-separate-static-class': 'error',
        'vue/prefer-template': 'error',
        'vue/quote-props': ['error', 'consistent-as-needed'],
        'vue/require-default-prop': 'off',
        // reactivity transform
        'vue/block-tag-newline': ['error', {
          multiline: 'always',
          singleline: 'always',
        }],
        // extensions
        'vue/array-bracket-spacing': ['error', 'never'],
        'vue/arrow-spacing': ['error', { after: true, before: true }],
        'vue/brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
        'vue/comma-dangle': ['error', 'always-multiline'],
        'vue/comma-spacing': ['error', { after: true, before: false }],
        'vue/comma-style': ['error', 'last'],
        'vue/component-options-name-casing': ['error', 'PascalCase'],
        'vue/custom-event-name-casing': ['error', 'camelCase'],
        'vue/define-macros-order': ['error', {
          order: ['defineProps', 'defineEmits'],
        }],
        'vue/dot-location': ['error', 'property'],
        'vue/dot-notation': ['error', { allowKeywords: true }],
        'vue/eqeqeq': ['error', 'smart'],
        'vue/first-attribute-linebreak': ['error', {
          multiline: 'below',
          singleline: 'beside',
        }],
        'vue/html-closing-bracket-newline': ['error', {
          multiline: 'never',
          selfClosingTag: {
            multiline: 'always',
            singleline: 'never',
          },
          singleline: 'never',
        }],
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
        'vue/no-restricted-v-bind': ['error', '/^v-/'],
        'vue/require-prop-types': 'off',
        'vue/space-in-parens': ['error', 'never'],
        'vue/space-infix-ops': 'error',
        'vue/space-unary-ops': ['error', { nonwords: false, words: true }],
        'vue/template-curly-spacing': 'error',

        /** User-defined rules */
        ...options.rules,
      },
    },
  ]
}
