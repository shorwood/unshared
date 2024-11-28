/**
 * Weird hack to collect keys of an object while preserving the original object structure.
 * Each object will have a `$key` property that contains the keys of the object.
 * If the parent object already has a `$key` property, the keys will be appended to it.
 *
 * @template T The object to collect keys from.
 * @example
 *
 * // Collect keys of the values of an object.
 * type Object = { a: { b: { c: string } } }
 * type Collected = CollectKey<Object> // { a: { $key: ['a'], b: { c: string } } }
 *
 * // Collect keys of the values of an object with an existing $key property.
 * type Object = { $key: ['root'], a: { b: { c: string } } }
 * type Collected = CollectKey<Object> // { $key: ['root'], a: { $key: ['root', 'a'], b: { c: string } } }
 */
export type CollectKey<T> =
  T extends object
    ? { [K in Exclude<keyof T & string, '$key'>]:
      T[K] extends object
        ? T extends { $key: infer P extends string[] }
          ? T[K] & { $key: [...P, K] }
          : T[K] & { $key: [K] }
        : T[K]
    }
    : T
