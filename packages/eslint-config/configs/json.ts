// module.exports = {
//   extends: [
//     'plugin:jsonc/recommended-with-jsonc',
//   ],
//   overrides: [
//     {
//       files: [
//         '*.json',
//         '*.json5',
//       ],
//       parser: 'jsonc-eslint-parser',
//       rules: {
//         'comma-dangle': ['error', 'never'],
//         'quote-props': ['error', 'always'],
//         'quotes': ['error', 'double'],
//       },
//     },

//     // --- Package.json
//     {
//       files: [
//         '**/package.json',
//       ],

//       parser: 'jsonc-eslint-parser',
//       rules: {
//         'jsonc/sort-keys': [
//           'error',
//           {
//             order: [
//               'name',
//               'type',
//               'version',
//               'license',
//               'private',
//               'sideEffects',

//               // --- Publishing
//               'description',
//               'author',
//               'keywords',
//               'bugs',
//               'funding',
//               'homepage',
//               'repository',

//               // --- Distribution
//               'bin',
//               'main',
//               'module',
//               'types',
//               'typings',
//               'browser',
//               'exports',
//               'files',

//               // --- Package Manager
//               'packageManager',
//               'pnpm',

//               // --- Scripts
//               'scripts',

//               // --- Dependencies
//               'peerDependencies',
//               'peerDependenciesMeta',
//               'optionalDependencies',
//               'dependencies',
//               'devDependencies',
//               'bundledDependencies',
//               'bundleDependencies',

//               // --- Config
//               'tsup',
//               'husky',
//               'lint-staged',
//               'eslintConfig',
//             ],
//             pathPattern: '^$',
//           },
//           {
//             order: { type: 'asc' },
//             pathPattern: '^(?:dev|peer|optional|bundled)?[Dd]ependencies$',
//           },
//         ],
//       },
//     },

//     // --- TSConfig.json
//     {
//       files: [
//         '**/tsconfig.json',
//         '**/tsconfig.*.json',
//       ],
//       parser: 'jsonc-eslint-parser',
//       rules: {
//         'jsonc/sort-keys': [
//           'error',
//           {
//             order: [
//               'extends',
//               'compilerOptions',
//               'references',
//               'files',
//               'include',
//               'exclude',
//             ],
//             pathPattern: '^$',
//           },
//           {
//             order: [
//               // --- Project Structure
//               'incremental',
//               'composite',
//               'tsBuildInfoFile',
//               'disableSourceOfProjectReferenceRedirect',
//               'disableSolutionSearching',
//               'disableReferencedProjectLoad',

//               // --- Language and Environment
//               'target',
//               'jsx',
//               'jsxFactory',
//               'jsxFragmentFactory',
//               'jsxImportSource',
//               'lib',
//               'moduleDetection',
//               'noLib',
//               'reactNamespace',
//               'useDefineForClassFields',
//               'emitDecoratorMetadata',
//               'experimentalDecorators',

//               // --- Module Resolution
//               'baseUrl',
//               'rootDir',
//               'rootDirs',
//               'customConditions',
//               'module',
//               'moduleResolution',
//               'moduleSuffixes',
//               'noResolve',
//               'paths',
//               'resolveJsonModule',
//               'resolvePackageJsonExports',
//               'resolvePackageJsonImports',
//               'typeRoots',
//               'types',
//               'allowArbitraryExtensions',
//               'allowImportingTsExtensions',
//               'allowUmdGlobalAccess',

//               // --- JavaScript Support
//               'allowJs',
//               'checkJs',
//               'maxNodeModuleJsDepth',

//               // --- Type Checking
//               'strict',
//               'strictBindCallApply',
//               'strictFunctionTypes',
//               'strictNullChecks',
//               'strictPropertyInitialization',
//               'allowUnreachableCode',
//               'allowUnusedLabels',
//               'alwaysStrict',
//               'exactOptionalPropertyTypes',
//               'noFallthroughCasesInSwitch',
//               'noImplicitAny',
//               'noImplicitOverride',
//               'noImplicitReturns',
//               'noImplicitThis',
//               'noPropertyAccessFromIndexSignature',
//               'noUncheckedIndexedAccess',
//               'noUnusedLocals',
//               'noUnusedParameters',
//               'useUnknownInCatchVariables',

//               // --- Emitting
//               'declaration',
//               'declarationDir',
//               'declarationMap',
//               'downlevelIteration',
//               'emitBOM',
//               'emitDeclarationOnly',
//               'importHelpers',
//               'importsNotUsedAsValues',
//               'inlineSourceMap',
//               'inlineSources',
//               'mapRoot',
//               'newLine',
//               'noEmit',
//               'noEmitHelpers',
//               'noEmitOnError',
//               'outDir',
//               'outFile',
//               'preserveConstEnums',
//               'preserveValueImports',
//               'removeComments',
//               'sourceMap',
//               'sourceRoot',
//               'stripInternal',

//               // --- Interop Constraints
//               'allowSyntheticDefaultImports',
//               'esModuleInterop',
//               'forceConsistentCasingInFileNames',
//               'isolatedModules',
//               'preserveSymlinks',
//               'verbatimModuleSyntax',

//               // --- Completeness
//               'skipDefaultLibCheck',
//               'skipLibCheck',
//             ],
//             pathPattern: '^compilerOptions$',
//           },
//           {
//             order: { type: 'asc' },
//             pathPattern: '^compilerOptions\\.paths$',
//           },
//         ],
//         'jsonc/sort-array-values': [
//           'error',
//           {
//             order: { type: 'asc' },
//             pathPattern: '^(includes|excludes)$',
//           },
//         ],
//       },
//     },
//   ],
// }

import { Linter } from 'eslint'
import jsonc from 'eslint-plugin-jsonc'

/**
 * @returns The configuration for JSON files.
 * @see https://ota-meshi.github.io/eslint-plugin-jsonc/
 */
export function configJson(): Linter.FlatConfig[] {
  return [
    ...jsonc.configs['flat/recommended-with-json'],
    {
      files: [
        '**/*.json',
        '**/*.json5',
      ],
      rules: {
        /**
         * Automatically apply jsonc rules similar to your configured ESLint core rules to JSON.
         *
         * @see https://ota-meshi.github.io/eslint-plugin-jsonc/rules/auto.html
         */
        'jsonc/auto': 'error',
      },
    },
  ]
}
