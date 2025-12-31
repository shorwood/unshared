/* eslint-disable jsdoc/require-param */
/* eslint-disable jsdoc/check-param-names */
/** Symbol used to store the dirty state in the instance. */
export const DIRTY_STATE = Symbol('dirtyState')

export namespace Dirty {
  export interface State {

    /** Whether the instance is dirty. */
    isDirty: boolean

    /** Set of dirty tags. */
    tags: Set<string>
  }

  export namespace Property {
    export interface Context<T> {

      /** Previous value. */
      oldValue?: T

      /** New value. */
      newValue?: T

      /** Instance of the class. */
      instance: object
    }

    export interface Options<T = unknown> {

      /**
       * Tag(s) for categorizing this change.
       * Enables selective dirty checking and reset.
       */
      tags?: string[]

      /**
       * Custom comparison function for property changes.
       * If returns true, values are considered equal (no dirty trigger).
       *
       * @default Object.is
       */
      equals?: (oldValue: T, newValue: T) => boolean

      /**
       * Condition to check before marking dirty.
       * If returns false, dirty state is not triggered.
       */
      condition?: (context: Context<T>) => boolean
    }

    export type Decorator<This extends Dirty, T> = (
      target: ClassAccessorDecoratorTarget<This, T>,
      context: ClassAccessorDecoratorContext<This, T>,
    ) => ClassAccessorDecoratorResult<This, T>
  }

  export namespace Trigger {
    export interface Context {

      /** Instance of the class. */
      instance: object

      /** Method parameters. */
      parameters: unknown[]
    }

    export interface Options {

      /**
       * Tag(s) for categorizing this change.
       * Enables selective dirty checking and reset.
       */
      tags?: string[]

      /**
       * Condition to check before marking dirty.
       * If returns false, dirty state is not triggered.
       */
      condition?: (context: Context) => boolean
    }

    export type Decorator<This extends Dirty, Arguments extends unknown[], Return> = (
      originalMethod: (this: This, ...args: Arguments) => Return,
      context: ClassMethodDecoratorContext<This, (this: This, ...args: Arguments) => Return>,
    ) => (this: This, ...args: Arguments) => Return
  }
}

/**
 * A base class that provides dirty state tracking for class instances.
 * Extend this class and use `@DirtyProperty()` and `@DirtyTrigger()` decorators
 * to automatically track changes with optional tags.
 *
 * @example
 * ```ts
 * // Using \@DirtyProperty for automatic property tracking
 * class Document extends Dirty {
 *   \@DirtyProperty() title = ''
 *   \@DirtyProperty({ tags: 'content' }) body = ''
 *   \@DirtyTrigger() submit() { ... }
 * }
 *
 * const doc = new Document()
 * doc.title = 'Hello'
 * doc.isDirty() // true
 * doc.markClean()
 * doc.isDirty() // false
 * ```
 */
export abstract class Dirty {

  /** Internal dirty state storage. */
  readonly [DIRTY_STATE]: Dirty.State = {
    isDirty: false,
    tags: new Set<string>(),
  }

  /**
   * Whether the instance has any dirty properties or methods.
   *
   * @param tag Optional tag to check.
   * @returns Whether the instance is dirty.
   */
  isDirty(tag?: string): boolean {
    const state = this[DIRTY_STATE]
    return typeof tag === 'string'
      ? state.tags.has(tag)
      : state.isDirty
  }

  /**
   * Mark the instance as dirty with optional tags.
   *
   * @param tags Optional tags to associate with this dirty state.
   */
  markDirty(...tags: string[]): void {
    const state = this[DIRTY_STATE]
    state.isDirty = true
    for (const tag of tags) state.tags.add(tag)
  }

  /**
   * Reset dirty state. If tags are provided, only reset those tags.
   * If no tags are provided, reset all dirty state.
   *
   * @param tags Optional tags to reset. If empty, resets all.
   */
  markClean(...tags: string[]): void {
    const state = this[DIRTY_STATE]
    if (tags.length === 0) {
      state.isDirty = false
      state.tags.clear()
    }
    else {
      for (const tag of tags) state.tags.delete(tag)
      if (state.tags.size === 0) state.isDirty = false
    }
  }
}

/**
 * Decorate a property to trigger dirty state when its value changes.
 * Must be used on an `accessor` property within a class extending `Dirty`.
 *
 * @param options The options for this property.
 * @returns The accessor decorator.
 * @example
 * // Basic property tracking
 * class Document extends Dirty {
 *   \@DirtyProperty() accessor title = ''
 *   \@DirtyProperty({ tags: 'content' }) accessor body = ''
 * }
 *
 * @example
 * // With custom equality check for objects
 * class Config extends Dirty {
 *   \@DirtyProperty({
 *     equals: (a, b) => JSON.stringify(a) === JSON.stringify(b)
 *   })
 *   accessor options: Record<string, unknown> = {}
 * }
 *
 * @example
 * // Conditional tracking
 * class Editor extends Dirty {
 *   isLocked = false
 *
 *   \@DirtyProperty({
 *     condition: ({ instance }) => !(instance as Editor).isLocked
 *   })
 *   accessor content = ''
 * }
 */
export function DirtyProperty<This extends Dirty, Value>(...tags: string[]): Dirty.Property.Decorator<This, Value>
export function DirtyProperty<This extends Dirty, Value>(options?: Dirty.Property.Options<Value>): Dirty.Property.Decorator<This, Value>
export function DirtyProperty<This extends Dirty, Value>(options?: Dirty.Property.Options<Value> | string, ...tags: string[]): Dirty.Property.Decorator<This, Value> {

  // --- Normalize parameters.
  let condition: ((context: Dirty.Property.Context<Value>) => boolean) | undefined
  let equals: (oldValue: Value, newValue: Value) => boolean = Object.is
  if (typeof options === 'string') { tags = [options, ...tags] }
  else if (options) {
    condition = options.condition
    if (options.equals) equals = options.equals
    if (options.tags) tags = [...options.tags, ...tags]
  }

  return function(
    target: ClassAccessorDecoratorTarget<This, Value>,
    context: ClassAccessorDecoratorContext<This, Value>,
  ): ClassAccessorDecoratorResult<This, Value> {

    // --- Ensure decorator is applied to an accessor.
    if (context.kind !== 'accessor')
      throw new TypeError('@DirtyProperty can only be applied to accessor properties.')

    // --- Track initialization per instance using a WeakSet.
    const initialized = new WeakSet<This>()

    return {
      get(this: This): Value {
        return target.get.call(this)
      },

      set(this: This, newValue: Value): void {
        const oldValue = target.get.call(this)
        const isInitialized = initialized.has(this)
        const isEqual = equals(oldValue, newValue)
        const isEnabled = condition ? condition({ instance: this, oldValue, newValue }) : true

        // --- Only mark dirty after initialization and if value changed.
        if (isInitialized && !isEqual && isEnabled)
          this.markDirty(...tags)

        target.set.call(this, newValue)
      },

      init(this: This, value: Value): Value {
        initialized.add(this)
        return value
      },
    }
  }
}

/**
 * Decorate a method to trigger dirty state when called.
 * Must be used within a class extending `Dirty`.
 *
 * @param options The options for this trigger.
 * @param tags The tags to associate with this trigger.
 * @returns The method decorator.
 * @example
 * // Basic method triggering
 * class Canvas extends Dirty {
 *   shapes: Shape[] = []
 *
 *   \@DirtyTrigger()
 *   addShape(shape: Shape) {
 *     this.shapes.push(shape)
 *   }
 * }
 *
 * @example
 * // With tags using simple signature
 * class Form extends Dirty {
 *   \@DirtyTrigger('validation')
 *   validate() {}
 *
 *   \@DirtyTrigger('submission', 'content')
 *   submit() {}
 * }
 *
 * @example
 * // With condition based on arguments
 * class Editor extends Dirty {
 *   \@DirtyTrigger({
 *     tags: ['content'],
 *     condition: ({ parameters }) => parameters[0] !== 'auto-save'
 *   })
 *   save(source: 'manual' | 'auto-save') {
 *     // Only marks dirty if source !== 'auto-save'
 *   }
 * }
 */
export function DirtyTrigger<This extends Dirty, Arguments extends unknown[], Return>(...tags: string[]): Dirty.Trigger.Decorator<This, Arguments, Return>
export function DirtyTrigger<This extends Dirty, Arguments extends unknown[], Return>(options?: Dirty.Trigger.Options): Dirty.Trigger.Decorator<This, Arguments, Return>
export function DirtyTrigger<This extends Dirty, Arguments extends unknown[], Return>(options?: Dirty.Trigger.Options | string, ...tags: string[]): Dirty.Trigger.Decorator<This, Arguments, Return> {

  // --- Normalize parameters.
  let condition: ((context: Dirty.Trigger.Context) => boolean) | undefined
  if (typeof options === 'string') { tags = [options, ...tags] }
  else if (options) {
    condition = options.condition
    if (options.tags) tags = [...options.tags, ...tags]
  }

  return function(
    originalMethod: (this: This, ...args: Arguments) => Return,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Arguments) => Return>,
  ): (this: This, ...args: Arguments) => Return {

    // --- Ensure decorator is applied to a method.
    if (context.kind !== 'method')
      throw new TypeError('@DirtyTrigger can only be applied to methods.')

    return function(this: This, ...parameters: Arguments): Return {
      const isEnabled = condition ? condition({ instance: this, parameters }) : true
      if (isEnabled) this.markDirty(...tags)
      return originalMethod.apply(this, parameters)
    }
  }
}
