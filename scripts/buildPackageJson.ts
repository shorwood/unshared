import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { sync as glob } from 'fast-glob'

export const ROOT_PATH = join(__dirname, '..')

export const buildPackageJson = async(cwd: string) => {
  const rootPackagePath = join(ROOT_PATH, 'package.json')
  const rootPackageUtf8 = readFileSync(rootPackagePath, 'utf8')
  const rootPackage = JSON.parse(rootPackageUtf8)

  const sourcePackagePath = join(cwd, 'package.json')
  const sourcePackageUtf8 = readFileSync(sourcePackagePath, 'utf8')
  const sourcePackage = JSON.parse(sourcePackageUtf8)

  const customIndexes = glob(['./index.js', './*/index.js'], { cwd: join(cwd, 'dist'), onlyFiles: true })

  const distributionPackage = {
    ...sourcePackage,
    version: rootPackage.version,
    author: rootPackage.author,
    license: rootPackage.license,
    repository: {
      ...rootPackage.repository,
      directory: cwd.replace('dist/', 'packages/'),
    },
    bugs: rootPackage.bugs,
    files: [
      'dist',
      'README.md',
      'LICENCE',
    ],
    main: './dist/index.cjs',
    module: './dist/index.js',
    types: './dist/index.d.ts',
    exports: {
      ...Object.fromEntries(customIndexes.map((fileName) => {
        const moduleName = fileName
          .replace('./index.js', '')
          .replace(/^(\w+)\/index.js$/, '/$1')

        const key = `.${moduleName}`
        const value = {
          require: `./dist${moduleName}/index.cjs`,
          import: `./dist${moduleName}/index.js`,
          types: `./dist${moduleName}/index.d.ts`,
        }
        return [key, value]
      })),
      './package.json': './package.json',
    },
  }

  writeFileSync(
    join(cwd, 'package.json'),
    `${JSON.stringify(distributionPackage, undefined, 2)}\n`,
  )
}
