import type { Linter } from 'eslint'

export function jsonPackage(): Linter.FlatConfig[] {
  return [
    {
      files: [
        '**/package.json',
      ],
      rules: {
        'jsonc/sort-keys': [
          'error',
          {
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
            pathPattern: '^$',
          },
          {
            order: { type: 'asc' },
            pathPattern: '^(?:dev|peer|optional|bundled)?[Dd]ependencies$',
          },
        ],
      },
    },
  ]
}
