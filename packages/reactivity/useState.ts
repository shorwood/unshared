import { Reference, reference } from './reference'

/** The return type of `useState`. */
export type State<T> = [Reference<T>, (value: T) => void]

/**
 * Creates a reactive state with a setter. Similar to `useState` from React.
 *
 * @param value The initial value.
 * @returns A reactive state with a setter.
 * @example
 * const [state, setState] = useState(0)
 * setState(1)
 * state // 1
 */
export function useState<T>(value: T): State<T> {
  const valueReference = reference(value)
  return [
    valueReference,
    (value: T) => { valueReference.value = value },
  ]
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should create a reactive state', () => {
    const [state, setState] = useState(0)
    expect(state.value).toEqual(0)
    setState(1)
    expect(state.value).toEqual(1)
    expectTypeOf(state).toEqualTypeOf<Reference<number>>()
  })
}
