/* eslint-disable sonarjs/cognitive-complexity */
import { MaybePromise } from '@unshared/types'
import { awaitable, Awaitable } from './awaitable'
import { createResolvable } from './createResolvable'

/**
 * The identifier of a state in a finite state machine.
 *
 * @template S The allowed states of the machine.
 */
export type FSMState<S extends string = string> = S | true | undefined | void

/**
 * A map of states and their transitions. The keys of the map are the names of
 * the states and the values are the transition functions.
 *
 * Each transition function is called with the last state of the machine and
 * returns the next state of the machine. If the transition function returns
 * `undefined` the machine stays in the same state.
 */
export type FSMTransitions<D = unknown, S extends string = string> = Record<S, FSMTransition<D, S>>

/**
 * A transition function for a finite state machine.
 *
 * @template S The allowed states of the machine.
 * @template From The state that the machine is transitioning from.
 * @template To The state that the machine is transitioning to.
 */
export type FSMTransition<D = unknown, S extends string = string> = (context: FSMContext<D, S>) => MaybePromise<FSMState<S>>

export interface FSMContext<D = unknown, S extends string = string> {
  /**
   * The persistent data of this machine. This data is shared between all
   * transitions and can be mutated to store data between transitions.
   *
   * @example fsm({ ..., increment: (ctx) => ctx.data++ }).data = 10
   */
  data?: D
  /**
   * The current state of this machine. The state is determined by the last
   * transition that was called and is the name of the transition function.
   *
   * @example fsm({ initial: () => { ... } }).state = 'initial'
   */
  state?: FSMState<S>
  /**
   * The previous state of this machine. The previous state is the state that
   * the machine was in before the last transition was called.
   */
  lastState?: FSMState<S>
}

/**
 * A finite state machine that returns the context of the machine and can be
 * awaited to get the context of the final state.
 *
 * @template S The allowed states of the machine.
 * @template D The type of the data of the machine.
 * @example FSM<'initial' | 'final', number> = (initialData: number) => Awaitable<FSMContext<'initial' | 'final', number>, number>
 */
export interface FSM<D = unknown, S extends string = string> {
  (): Awaitable<FSMContext<D, S>>
  (initialData?: D): Awaitable<FSMContext<D, S>>
  (initialData?: D, initialState?: S): Awaitable<FSMContext<D, S>>
}

/**
 * Create a [finite state machine](https://en.wikipedia.org/wiki/Finite-state_machine)
 * that returns the context of the machine and can be awaited to get the context
 * of the final state.
 *
 * Each state is assigned to a transition function that is called when the
 * machine enters that state. The transition function is called the context of
 * the machine and it's return value is either the next state of the machine or
 * `true` to finalize the machine.
 *
 * @param states A map of states and their transitions.
 * @param initialData The initial data of the machine.
 * @returns The machine.
 * @example
 * const startRombaLogic = createFsm({
 *   init: () => 'scan',
 *   scan: () => 'moveToDust',
 *   moveToDust: () => 'vacuum',
 *   vacuum: () => 'scan',
 * })
 * const result = await startRombaLogic()
 */
// TODO: Extend return type to make it lazily awaitable and synchroneously return the context.
export function createFsm<D = unknown, S extends string = string>(states: FSMTransitions<D, S>, initialData?: D): FSM<D, S> {
  const context: FSMContext<D, S> = { data: initialData }
  const resolvable = createResolvable<typeof context>()

  // --- Run the machine.
  const run = async(initialData?: D, initialState?: S) => {
    context.data = initialData ?? context.data
    context.state = initialState ?? context.state ?? Object.keys(states)[0] as S

    // --- Run the machine until it is idle or finalized.
    while (typeof context.state === 'string') {
      const transition = states[context.state]
      if (transition === undefined) throw new Error(`FSM state '${context.state}' does not exist.`)

      // --- Call the transition function and await the result.
      const result = await transition(context) as FSMState<S>
      context.lastState = context.state
      context.state = result

      // --- Finalize if `true`, idle if `undefined`, or set the next state.
      if (result === true) { resolvable.resolve(context); return }
    }
  }

  // --- Trap the `state` property and run the machine when it changes.
  const contextProxy = new Proxy(context, {
    set(target, key, value) {
      if (key === 'state' && target.state !== value) run()
      Reflect.set(target, key, value)
      return true
    },
  })

  // --- Create the machine function.
  const fsm = (initialData?: D, initialState?: S) => {
    // eslint-disable-next-line no-void
    void run(initialData, initialState)
    return awaitable(contextProxy, resolvable.promise)
  }

  // --- Return the machine.
  return fsm as FSM<D, S>
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should create a finite state machine', async() => {
    const transition = vi.fn() as () => void
    const fsm = createFsm({ transition })
    const result = fsm()
    const resultFinal = await fsm()
    expect(result).toEqual({ data: undefined, state: 'transition', lastState: undefined })
    expect(resultFinal).toEqual({ data: undefined, state: true, lastState: 'transition' })
    expect(transition).toHaveBeenCalledWith({ data: undefined, state: 'transition', lastState: undefined })
  })

  it('should mutate the data of the machine', async() => {
    const fsm = createFsm({ init: (context) => { context.data = 10 } })
    const result = await fsm()
    expect(result).toEqual({ data: 10, state: undefined, lastState: 'init' })
  })

  it('should create a finite state machine with initial data', async() => {
    const fsm = createFsm({ init: (context) => { context.data! += 10 } }, 5)
    const result = await fsm()
    expect(result).toEqual({ data: 15, state: undefined, lastState: 'init' })
  })

  it('should start the machine with initial data', async() => {
    const fsm = createFsm<number>({ init: (context) => { context.data! += 10 } })
    const result = await fsm(5)
    expect(result).toEqual({ data: 15, state: undefined, lastState: 'init' })
  })
}
