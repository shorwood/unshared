import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

export const buildReadme = (cwd: string) => {
  const packageJsonPath = join(cwd, 'package.json')
  const packageJsonUtf8 = readFileSync(packageJsonPath, 'utf8')
  const packageJson = JSON.parse(packageJsonUtf8)
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

  const readmePath = join(cwd, 'README.md')
  writeFileSync(readmePath, readme)
}
