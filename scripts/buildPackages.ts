import { readFileSync, writeFileSync } from 'node:fs'
import { relative, resolve } from 'node:path'
import { sync as glob } from 'fast-glob'
import consola from 'consola'
import { chain, defaultsDeep } from 'lodash'
import { extractDependencies, loadJson } from './utils'

// --- Compute paths.
const root = resolve(__dirname, '../')
const cwd = resolve(root, 'packages')

// --- Get root monorepo package content.
const rootPackage = loadJson(resolve(__dirname, '../package.json'))

// --- Get all folders under the target.
glob('./*/package.json', {
  cwd,
  onlyFiles: true,
  absolute: true,
})

  // --- Compute `index.ts` content.
  .map((packagePath) => {
    const sourceDirectoryAbsolute = packagePath.split('/').slice(0, -1).join('/')
    const sourceDirectory = sourceDirectoryAbsolute.split('/').slice(-2).join('/')
    const packageName = sourceDirectory.split('/')[1]
    const outPath = resolve(root, 'dist', packageName)
    const packagePathNew = resolve(outPath, 'package.json')
    const npmNamespace = rootPackage.name.split('/')[0]

    // --- Get all source files.
    const sources = glob('./index.(mjs|d.ts)', {
      cwd: outPath,
      onlyFiles: true,
      absolute: true,
    })
      .map(x => readFileSync(x).toString())
      .join('/n')

    // --- Extract all dependencies from the sources.
    const dependencies = chain(extractDependencies(sources))
      .filter((x) => {
        if (x.startsWith(npmNamespace)) return true
        if (rootPackage.dependencies[x]) return true
        consola.error(`Dependecy "${x}" is missing root package.`)
        return false
      })
      .mapKeys(x => x)
      .mapValues(x => (x.startsWith(npmNamespace)
        ? rootPackage.version
        : rootPackage.dependencies[x].replace(/^\^/, '')))
      .value()

    const sourcePackage = loadJson(packagePath)

    // --- Generate package.json
    return {
      srcDirectory: sourceDirectory,
      filePath: packagePathNew,
      filePathRelative: relative(root, packagePathNew),
      content: defaultsDeep(sourcePackage, {
        version: rootPackage.version,
        author: rootPackage.author,
        license: rootPackage.license,
        repository: {
          ...rootPackage.repository,
          directory: sourceDirectory,
        },
        bugs: rootPackage.bugs,
        main: './index.js',
        module: './index.mjs',
        types: './index.d.ts',
        // unpkg: './index.iife.min.js',
        // jsdelivr: './index.iife.min.js',
        exports: {
          '.': {
            require: './index.js',
            import: './index.mjs',
            types: './index.d.ts',
          },
        },
        dependencies,
      }),
    }
  })

  // --- Write files.
  .forEach((x) => {
    if (x.content.name) {
      consola.success(`Generated package file "${x.filePathRelative}"`)
      writeFileSync(x.filePath, JSON.stringify(x.content, undefined, 2))
    }
    else {
      consola.error(`Package "${x.srcDirectory}" is missing "name" attribute.`)
    }
  })
