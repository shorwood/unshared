import type { Assert } from './toAssert'
import { toCapitalized } from '@unshared/string'
import * as ASSERT from './assert/index'
import { toAssert } from './toAssert'

// --- Re-export all assert functions so they can be used directly.
export * from './assert/index'

/** Helper type to convert `assertFoo` to `foo` */
 type AssertName<K extends string> =
  K extends `assert${infer Rest}` ? Uncapitalize<Rest> : never

/** Type of the {@linkcode ASSERT} object, which contains all assert functions. */
export type Asserts = {
  [K in keyof typeof ASSERT as AssertName<K>]: Assert<(typeof ASSERT)[K]>
}

/** The `ASSERT` object contains all assert functions wrapped with additional methods for customizing errors. */
export const assert: Asserts = new Proxy(ASSERT, {
  get(target, property: string) {
    const key = `assert${toCapitalized(property)}` as keyof typeof ASSERT
    return toAssert(target[key])
  },
}) as unknown as Asserts
