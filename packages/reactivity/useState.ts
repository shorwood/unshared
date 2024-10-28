import { reference } from './reference'

/** The return type of `useState`. */
export type ReactiveState<T = unknown> = [
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
export function useState<T>(): ReactiveState<T | undefined>

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
export function useState<T>(value?: T): ReactiveState<T>
export function useState<T>(value?: T): ReactiveState<T> {
  const valueReference = reference(value)
  return [
    () => valueReference.value as T,
    (value: T) => { valueReference.value = value },
  ]
}
