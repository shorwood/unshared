import { writeFileSync } from 'node:fs'
import { relative, resolve } from 'node:path'
import { sync as glob } from 'fast-glob'
import consola from 'consola'
import { loadJson } from './utils'

// --- Compute paths.
const root = resolve(__dirname, '../')
const distPath = resolve(root, 'dist')

glob('./*/package.json', {
  cwd: distPath,
  onlyFiles: true,
  absolute: true,
})

  .map(packageJsonPath => ({
    packageJsonPath,
    readmePath: packageJsonPath.replace('package.json', 'README.md'),
    readmePathRelative: relative(root, packageJsonPath.replace('package.json', 'README.md')),
    packageJson: loadJson(packageJsonPath),
  }))

  .map(x => ({
    ...x,
    readme: `# ${x.packageJson.name}

[![NPM version](https://img.shields.io/npm/v/${x.packageJson.name}?color=a1b858)](https://www.npmjs.com/package/${x.packageJson.name})

> This is an extension of [${x.packageJson.name.split('/')[0]}](https://github.com/hsjm-io/hsjm), ${x.packageJson.description}

## Install

<pre class='language-bash'>
npm i <b>${x.packageJson.name}</b>
</pre>

Learn more about [${x.packageJson.name.split('/').pop()} usage](https://docs.hsjm.io/guide/${x.packageJson.name.split('/').pop()}).

## License

[MIT License](https://github.com/hsjm-io/hsjm/blob/master/LICENSE) © 2022 ${x.packageJson.author}
`,
  }))

  .forEach((x) => {
    consola.success(`Generated README file "${x.readmePathRelative}"`)
    writeFileSync(x.readmePath, x.readme)
  })
