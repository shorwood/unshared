/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable dot-notation */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { ConstantDecl, FunctionDecl, InterfaceDecl, JSDocData, Loc, Module, Reference, Type, TypeDecl, TypescriptExtractor } from '@ts-docs/extractor'
import { sync as glob } from 'fast-glob'
import { capitalize, loadObject, map } from '../../../packages/shared/dist'
import { saveObject } from '../../../packages/shared'

const getTypeSignature = (type: Type) => {
  if (!type) return
  if (type.kind === 20) return 'any'
  if (type.kind === 13) return 'string'
  if (type.kind === 12) return 'number'
  if (type.kind === 29) return 'bigint'
  if (type.kind === 14) return 'boolean'

  if (type.kind === 0) {
    const { type: { name }, typeArguments } = type as Reference
    const typeArgumentsResolved = typeArguments?.map(getTypeSignature).join(', ')
    return typeArgumentsResolved
      ? `${name}<${typeArgumentsResolved}>`
      : name
  }
}

const getJsDocComment = (jsDocument: JSDocData[]) => jsDocument
  ?.map(x => x.comment)
  .reverse()
  .join('\n\n')
  .trim()
  || undefined

const getJsDocTagComment = (jsDocument: JSDocData[], tagName: string) => jsDocument
  ?.flatMap(x => x.tags.filter(x => x.name === tagName))
  .map(x => x.comment.trim())

const getSourceFile = (loc: Loc) => loc.sourceFile
  .replace('home/shorwood/workspaces/hsjm/', '')
  .replace('/undefined', '')

const getNodeDefinition = (node: any) => {
  // --- Extract function informations.
  if (node?.kind === 1) {
    const { name, jsDoc, loc, properties } = node as InterfaceDecl
    return {
      name,
      description: getJsDocComment(jsDoc),
      examples: getJsDocTagComment(jsDoc, 'example'),
      type: properties.flatMap(x => x.prop).filter(Boolean)
        .map(prop => ({ ...prop, type: getTypeSignature(prop?.type) })),
      source: undefined,
      sourceFile: loc.map(getSourceFile),
    }
  }

  // --- Extract function informations.
  if (node?.kind === 3) {
    const { name, signatures, jsDoc, loc } = node as FunctionDecl
    return {
      name,
      description: getJsDocComment(jsDoc),
      examples: getJsDocTagComment(jsDoc, 'example'),
      type: signatures.flat().map(x => getTypeSignature(x.returnType)),
      source: undefined,
      sourceFile: getSourceFile(loc),
    }
  }

  // --- Extract constants informations.
  if (node?.kind === 4) {
    const { name, jsDoc, loc, type, content } = node as ConstantDecl
    return {
      name,
      description: getJsDocComment(jsDoc),
      examples: getJsDocTagComment(jsDoc, 'example'),
      type: getTypeSignature(type),
      source: content,
      sourceFile: getSourceFile(loc),
    }
  }

  // --- Extract types informations.
  if (node?.kind === 5) {
    const { name, jsDoc, loc, value } = node as TypeDecl
    return {
      name,
      description: getJsDocComment(jsDoc),
      examples: getJsDocTagComment(jsDoc, 'example'),
      type: getTypeSignature(value),
      source: undefined,
      sourceFile: getSourceFile(loc),
    }
  }
}

const getDocumentation = (cwd: string) => {
  const entryPoints = glob(['./index.ts', './*/index.ts'], { cwd }).reverse()
  const packageJson = loadObject<any>(`${cwd}/package.json`)
  const parser = new TypescriptExtractor({ entryPoints, cwd })
  return parser
    .run()
    .flatMap((project) => {
      const modules: Module[] = []
      const fullPath = join(__dirname, cwd, project.baseDir ?? '')
      const readme = glob('./README.md', { caseSensitiveMatch: false, cwd: fullPath, absolute: true })
        .map(path => readFileSync(path).toString())
        .join('\n\n')
      project.forEachModule(module => modules.push(module))
      return modules.map(module => ({
        name: module.name,
        module: project.baseDir,
        description: packageJson.description,
        readme,
        fullPath,
        fullName: [module.name, project.baseDir].filter(Boolean).join('/'),
        displayName: [module.name, project.baseDir].filter(Boolean).map(capitalize).join('/'),
        functions: module.functions.map(getNodeDefinition),
        constants: module.constants.map(getNodeDefinition),
        types: module.types.map(getNodeDefinition),
        interfaces: module.interfaces.map(getNodeDefinition),
        exports: map(module.exports, x => x.exports).flat().flatMap(x => x.name),
        rawExports: map(module.exports, ({ exports }, name) => ({ name, exports: exports.map(x => x.name) })),
      }))
    })
    .filter(x => x.exports.length > 0)
}

// --- Generate and export metadata.
const paths = glob(join(__dirname, '../../../packages/*'), { onlyDirectories: true })
const metadata = paths.map(getDocumentation)
saveObject(join(__dirname, './metadata.json'), metadata)
