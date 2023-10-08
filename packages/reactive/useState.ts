import { reference } from './reference'

/** The return type of `useState`. */
export type State<T = unknown> = [
  getState: () => T,
  setState: (value: T) => void,
]

/**
 * Creates a reactive state with a setter. Similar to `useState` from React.
 *
 * @returns A reactive state with a setter.
 * @example
 * const [getState, setState] = useState()
 * setState(1)
 * getState() // 1
 */
export function useState<T>(): State<T | undefined>
/**
 * Creates a reactive state with a setter. Similar to `useState` from React.
 *
 * @param value The initial value.
 * @returns A reactive state with a setter.
 * @example
 * const [getState, setState] = useState(0)
 * setState(1)
 * getState() // 1
 */
export function useState<T>(value?: T): State<T>
export function useState<T>(value?: T): State<T> {
  const valueReference = reference(value)
  return [
    () => valueReference.value as T,
    (value: T) => { valueReference.value = value },
  ]
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should create a state and get its value', () => {
    const [getState] = useState(0)
    const result = getState()
    expect(result).toEqual(0)
    expectTypeOf(result).toEqualTypeOf<number>()
  })

  it('should create a state and set its value', () => {
    const [getState, setState] = useState(0)
    setState(1)
    const result = getState()
    expect(result).toEqual(1)
    expectTypeOf(result).toEqualTypeOf<number>()
  })

  it('should allow generic types to be passed', () => {
    const [getState, setState] = useState<number>()
    setState(1)
    const result = getState()
    expect(result).toEqual(1)
    expectTypeOf(result).toEqualTypeOf<number | undefined>()
  })
}
