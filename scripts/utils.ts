
import { copyFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { sync as glob } from 'fast-glob'
import consola from 'consola'
import { jsonImport } from '../packages/shared'

const ROOT_PATH = join(__dirname, '..')

export const generateIndex = (cwd: string) => {
  const content = glob('./*.(t|j)s', { cwd, onlyFiles: true, ignore: ['index.*'] })
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
  const sourcePackage = jsonImport<any>(join(cwd.replace('dist/', 'packages/'), 'package.json'))
  const distPackage = {
    ...sourcePackage,
    version: rootPackage.version,
    author: rootPackage.author,
    license: rootPackage.license,
    repository: {
      ...rootPackage.repository,
      directory: cwd.replace('/dist', '/packages'),
    },
    bugs: rootPackage.bugs,
    main: './index.js',
    module: './index.mjs',
    types: './index.d.ts',
    exports: {
      '.': {
        require: './index.js',
        import: './index.mjs',
        types: './index.d.ts',
      },
    },
  }

  writeFileSync(join(cwd, 'package.json'), JSON.stringify(distPackage, undefined, 2))
}
