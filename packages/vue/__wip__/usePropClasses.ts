/* eslint-disable unicorn/prevent-abbreviations */
import { toUnique } from '@unshared/collection/toUnique'
import { ComputedRef, computed } from 'vue-demi'

/**
 * Computes a list of CSS classes to apply on a component based on a set of props. This
 * works great with the `useCssModule` composable and allows you to conditionnaly apply
 * CSS classes without having to write a lot of logic in the template.
 *
 * @param props Object used to conditionnaly apply the CSS classes.
 * @param targets Whitelist of CSS classes. Can be an array of classes or the CSS Module object.
 * @returns An array of CSS classes to apply on the root of the component.
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { useCssModule } from 'vue-demi'
 *   import { usePropClasses } from '@unshared/vue'
 *
 *   const props = defineProps<{
 *    size?: 'small' | 'large'
 *    vertical?: boolean
 *   }>()
 *
 *   const $style = useCssModule()
 *   const classes = usePropClasses(props, $style)
 * </script>
 *
 * <template>
 *   <div :class="classes"> ... </div>
 * </template>
 *
 * <style module>
 *   .small { ... }
 *   .large { ... }
 *   .vertical { ... }
 * </style>
 * ```
 */
export function usePropClasses<T = string>(props: Record<string, unknown>, targets = [] as Record<string, T> | T[]): ComputedRef<T[]> {
  return computed(() => {
    // --- Initialize the returned array.
    const classes: T[] = []

    // --- Filter-in CSS classes from an array.
    if (Array.isArray(targets)) {
      for (const target of targets) {
        const value = props[(target as any)]
        const className = value === true ? target : value
        classes.push(className)
      }
    }

    // --- Filter-in CSS classes from the CSS Module object.
    else {
      for (const propertyName in props) {
        const value = props[propertyName]
        const className = value === true ? targets[propertyName] : targets[value]
        classes.push(className)
      }
    }

    // --- Filter-out non-string and duplicate classes.
    const classesString = classes.filter(x => typeof x === 'string')
    return toUnique(classesString)
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  const classMap = { small: 'is-small', large: 'is-large', vertical: 'is-vertical' }
  const classList = ['small', 'large', 'vertical']

  it('computes the classes to apply from a CSS module', () => {
    const props = { size: 'small', vertical: true }
    const classes = usePropClasses(props, classMap)
    expect(classes.value).toEqual(['is-small', 'is-vertical'])
  })

  it('computes the classes to apply from a class list', () => {
    const props = { size: 'small', vertical: true }
    const classes = usePropClasses(props, classList)
    expect(classes.value).toEqual(['vertical'])
  })

  it('computes to an empty array from a CSS Module', () => {
    const props = { size: undefined, vertical: false }
    const classes = usePropClasses(props, classMap)
    expect(classes.value).toEqual([])
  })
}
