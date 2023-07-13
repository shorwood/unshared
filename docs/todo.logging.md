# Stdin/Stdout Logging
z
### Logging

```ts
/**
 * Create a new logger instance.
 * @param name The name of the logger.
 * @param level The level of the logger.
 * @param options The options of the logger.
 */
export function createLogger(name: string, level?: LogLevel, options?: LoggerOptions): Logger;
export function log(message: string, ...args: any[]): void;
export function log[level: LogLevel](message: string, ...args: any[]): void;
export function logFormat(level: LogLevel, message: string, ...args: any[]): string;
```

### Wrappers

```ts
export function wrapProcessStdout(): void
export function wrapProcessStderr(): void
export function wrapProcessStdin(): void
```

### User input

```ts
export function prompt(question: string, options?: AskOptions): Promise<string>
export function promptSecret(question: string, options?: AskOptions): Promise<string>
export function promptConfirm(question: string, options?: AskOptions): Promise<boolean>
export function promptRadio<T extends string>(question: string, choices: Collection<T>, options?: AskOptions): Promise<T>
export function promptCheckbox<T extends string>(question: string, choices: Collection<T>, options?: AskOptions): Promise<T[]>
```

### Console styling

```ts
export function consoleBold(text: string): string
export function consoleDim(text: string): string
export function consoleItalic(text: string): string
export function consoleUnderline(text: string): string
export function consoleInverse(text: string): string
export function consoleHidden(text: string): string
export function consoleStrikethrough(text: string): string
export function consoleColor(text: string, color: Color): string
export function consoleLink(text: string, url: string): string
export function consoleBgColor(text: string, color: Color): string
export function consoleTag(text: string, tag: ConsoleTag): string
export function consoleStylize(text: string, style: ConsoleStyle): string
```

### Dynamic output

```ts
export function createSpinner(message: string, options?: SpinnerOptions): Spinner
export function createProgress(message: string, options?: ProgressOptions): Progress
export function createProgressBar(message: string, options?: ProgressBarOptions): ProgressBar
export function createTable(options?: TableOptions): Table
export function createWizard(options?: WizardOptions): Wizard
export function createPrompt(options?: PromptOptions): Prompt
```

### Utilities

```ts
export function isTTY(): boolean
export function getConsoleWidth(): number
export function getConsoleHeight(): number
export function getConsoleSize(): [number, number]
export function getConsoleColumns(): number
export function getConsoleRows(): number
export function getConsoleDimensions(): [number, number]
export function getConsoleColorDepth(): number
export function getConsoleStream(): NodeJS.WriteStream
export function getConsoleHistory(count?: number): string[]
```
