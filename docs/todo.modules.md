# Modules

### Detecting modules

```ts
interface DependencyCheckOptions {
  /**
   * The root directory to check.
   *
   * @default process.cwd()
   */
  rootDirectory?: string
  /**
   * Path of the package.json file.
   */
  packageJsonPath?: string
  /**
   * The file extensions to check.
   *
   * @default [".ts", ".tsx", ".js", ".jsx"]
   */
  extensions?: string[]
  /**
   * The file names to ignore.
   *
   * @default ["node_modules"]
   */
  includes?: string[]
  /**
   * The file names to ignore.
   *
   * @default ["node_modules"]
   */
  excludes?: string[]
}

interface DependencyCheckResult {
  /**
   * The name of the module.
   */
  name: string
  /**
   * The files that import the module.
   */
  paths: string[]
  /**
   * Status of the module.
   */
  status: 'missing' | 'unused' | 'used'
}

/**
 * Check for the dependency requirements of a directory or workspace by
 * checking for the imports of the source files in the directory.
 *
 * @param options The options to use.
 * @returns The results of the check.
 * @example
 * const directory = path.resolve(__dirname, "..");
 * const options = { extensions: [".ts", ".tsx", ".js", ".jsx"] };
 * const results = await dependencyCheck(directory, options); // [{ name: "fs-extra", paths: ["src/index.ts"], status: "used" }]
 */
function dependencyCheck(options?: DependencyCheckOptions): Promise<DependencyCheckResult[]>
```

### Detecting package managers

```ts
/**
 * Check if the directory is a Yarn workspace.
 *
 * @param directory The directory to check.
 * @returns Whether the directory is a Yarn workspace.
 * @example
 * const directory = path.resolve(__dirname, "..");
 * const isYarnWorkspace = await isYarnWorkspace(directory); // true
 */
function isWorkspaceYarn(directory: string): Promise<boolean>
function isWorkspaceYarnPnp(directory: string): Promise<boolean>
function isWorkspacePnpm(directory: string): Promise<boolean>
function isWorkspaceNpm(directory: string): Promise<boolean>
function getPackageManager(directory: string): Promise<'npm' | 'pnpm' | 'yarn-pnp' | 'yarn' | undefined>
```

### Adding dependencies

```ts
interface AddDependencyOptions {
  /**
   * The root directory to check.
   *
   * @default process.cwd()
   */
  rootDirectory?: string
  /**
   * Path of the package.json file.
   */
  packageJsonPath?: string
  /**
   * Whether to add the dependency as a dev dependency.
   *
   * @default 'production'
   */
  type?: 'production' | 'development' | 'peer' | 'optional' | 'bundled' | 'workspace'
  /**
   * Package manager to use.
   */
  packageManager?: 'npm' | 'pnpm' | 'yarn-pnp' | 'yarn'
}

/**
 * Add a dependency to the package.json.
 *
 * @param name The name of the dependency.
 * @param options The options to use.
 * @returns A promise that resolves when the dependency is added.
 * @example
 * const directory = path.resolve(__dirname, "..");
 * const options = { type: "development" };
 * await addDependency("fs-extra", options); // package.json is updated
 */
function dependencyAdd(name: string, options?: AddDependencyOptions): Promise<void>
```
