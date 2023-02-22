### Mock and stub

```ts
/**
 * Mock an import by replacing it with a fake module.
 *
 * @param module The module to mock.
 * @param fake The fake module.
 * @param options
 * @example
 * import * as memfs from "memfs";
 * const unmock = mock("fs", memfs);
 */
function mockModule(module: string, fake: unknown, options?: MockOptions): () => void
function mockGlobal(global: string, fake: unknown, options?: MockOptions): () => void
function unmockModule(module: string): void
function unmockGlobal(global: string): void
```
