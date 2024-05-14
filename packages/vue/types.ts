/* eslint-disable unicorn/prevent-abbreviations */
import { Ref } from 'vue'

/**
 * A type that represents a value that may be wrapped in a `Ref` object.
 *
 * @template T The type of the value.
 * @example MaybeRef<number> // Ref<number> | number
 */
export type MaybeRef<T = any> = Ref<T> | T
