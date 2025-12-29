import type { MaybeArray } from '@unshared/types'
import { toArray } from '@unshared/collection/toArray'

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
      tags?: MaybeArray<string>

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
      tags?: MaybeArray<string>

      /**
       * Condition to check before marking dirty.
       * If returns false, dirty state is not triggered.
       */
      condition?: (context: Context) => boolean
    }
  }
}

/**
 * A base class that provides dirty state tracking for class instances.
 * Extend this class and use `@DirtyProperty()` and `@DirtyTrigger()` decorators
 * to automatically track changes with optional tags.
 *
 * @example
 * // Using @DirtyProperty for automatic property tracking
 * class Document extends Dirty {
 *   \@DirtyProperty() title = ''
 *   \@DirtyProperty({ tags: 'content' }) body = ''
 * }
 *
 * const doc = new Document()
 * doc.title = 'Hello'
 * doc.isDirty() // true
 * doc.clearDirty()
 * doc.isDirty() // false
 *
 * @example
 * // Using @DirtyTrigger for method-based tracking
 * class Canvas extends Dirty {
 *   shapes: Shape[] = []
 *
 *   \@DirtyTrigger({ tags: 'shapes' })
 *   addShape(shape: Shape) {
 *     this.shapes.push(shape)
 *   }
 *
 *   \@DirtyTrigger({ tags: 'shapes' })
 *   removeShape(index: number) {
 *     this.shapes.splice(index, 1)
 *   }
 * }
 *
 * const canvas = new Canvas()
 * canvas.addShape(new Circle())
 * canvas.isDirty('shapes') // true
 *
 * @example
 * // Combining property and method tracking with tags
 * class Form extends Dirty {
 *   \@DirtyProperty({ tags: 'profile' }) name = ''
 *   \@DirtyProperty({ tags: 'credentials' }) password = ''
 *
 *   \@DirtyTrigger({ tags: 'submission' })
 *   submit() { ... }
 * }
 *
 * const form = new Form()
 * form.name = 'Alice'
 * form.isDirty('profile') // true
 * form.isDirty('credentials') // false
 * form.clearDirty('profile')
 * form.isDirty() // false
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
  clearDirty(...tags: string[]): void {
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
export function DirtyProperty<This extends Dirty, Value>(options: Dirty.Property.Options<Value> = {}) {
  const { condition, equals = Object.is, tags } = options

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
          this.markDirty(...toArray(tags))

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
 * // With condition based on arguments
 * class Editor extends Dirty {
 *   \@DirtyTrigger({
 *     tags: 'content',
 *     condition: ({ parameters }) => parameters[0] !== 'auto-save'
 *   })
 *   save(source: 'manual' | 'auto-save') {
 *     // Only marks dirty if source !== 'auto-save'
 *   }
 * }
 *
 * @example
 * // With tags for selective reset
 * class Form extends Dirty {
 *   \@DirtyTrigger({ tags: 'validation' })
 *   validate() {}
 *
 *   \@DirtyTrigger({ tags: 'submission' })
 *   submit() {}
 * }
 */
export function DirtyTrigger<This extends Dirty, Arguments extends unknown[], Return>(
  options: Dirty.Trigger.Options = {},
) {
  const { condition, tags } = options

  return function(
    originalMethod: (this: This, ...args: Arguments) => Return,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Arguments) => Return>,
  ): (this: This, ...args: Arguments) => Return {

    // --- Ensure decorator is applied to a method.
    if (context.kind !== 'method')
      throw new TypeError('@DirtyTrigger can only be applied to methods.')

    return function(this: This, ...parameters: Arguments): Return {
      const isEnabled = condition ? condition({ instance: this, parameters }) : true
      if (isEnabled) this.markDirty(...toArray(tags))
      return originalMethod.apply(this, parameters)
    }
  }
}
