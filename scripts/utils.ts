
import { copyFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { sync as glob } from 'fast-glob'
import consola from 'consola'
import { jsonImport } from '../packages/shared'

const ROOT_PATH = join(__dirname, '..')

export const generateIndex = (cwd: string) => {
  const files = glob('./*.(t|j)s', { cwd, onlyFiles: true })

  // --- Abort if already exists.
  if (files.includes('index.ts')) return
  if (files.length === 0) return

  const content = files
    .map(x => x.replace(/\.[^./]+$/, ''))
    .sort()
    .map(file => `export * from './${file}'\n`)
    .join('')

  if (content.length > 0) {
    writeFileSync(join(cwd, 'index.ts'), content)
    consola.success(`Generated index file "${join(cwd, 'index.ts')}"`)
  }
}

export const generateReadme = (cwd: string) => {
  const packageJson = jsonImport<any>(join(cwd, 'package.json'))
  const readme = `# ${packageJson.name}

[![NPM version](https://img.shields.io/npm/v/${packageJson.name}?color=a1b858)](https://www.npmjs.com/package/${packageJson.name})

> This is an extension of [${packageJson.name.split('/')[0]}](https://github.com/hsjm-io/hsjm), ${packageJson.description}

## Install

<pre class='language-bash'>
npm i <b>${packageJson.name}</b>
</pre>

Learn more about [${packageJson.name.split('/').pop()} usage](https://docs.hsjm.io/guide/${packageJson.name.split('/').pop()}).

## License

[MIT License](https://github.com/hsjm-io/hsjm/blob/master/LICENSE) © 2022 ${packageJson.author}
  `

  if (readme)
    writeFileSync(join(cwd, 'README.md'), readme)
}

export const generateLicence = (cwd: string) => {
  const licencePath = glob('LI(C|S)ENCE(.md)?', {
    cwd: ROOT_PATH,
    onlyFiles: true,
    absolute: true,
    caseSensitiveMatch: false,
  })[0]
  if (licencePath)
    copyFileSync(licencePath, join(cwd, 'LICENCE'))
}

export const generatePackageJson = (cwd: string) => {
  const rootPackage = jsonImport<any>(join(ROOT_PATH, 'package.json'))
  const sourcePackage = jsonImport<any>(join(cwd, 'package.json'))
  const customIndexes = glob(['./index.js', './*/index.js'], { cwd: join(cwd, 'dist'), onlyFiles: true })

  const distPackage = {
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
    main: './dist/index.js',
    module: './dist/index.mjs',
    types: './dist/index.d.ts',
    exports: {
      ...Object.fromEntries(customIndexes.map((fileName) => {
        const moduleName = fileName
          .replace('./index.js', '.')
          .replace(/^(\w+)\/index.js$/, './$1')

        const key = `${moduleName}`
        const value = {
          require: `${moduleName}/dist/index.js`,
          import: `${moduleName}/dist/index.mjs`,
          types: `${moduleName}/dist/index.d.ts`,
        }
        return [key, value]
      })),
      './package.json': './package.json',
    },
  }

  writeFileSync(join(cwd, 'package.json'), JSON.stringify(distPackage, undefined, 2))
}
