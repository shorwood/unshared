import { MaybePromise } from '@unshared/types'

/**
 * A map of states and their transitions. The keys of the map are the names of
 * the states and the values are the transition functions.
 *
 * Each transition function is called with the last state of the machine and
 * returns the next state of the machine. If the transition function returns
 * `undefined` the machine stays in the same state.
 *
 * @template T The data of the machine.
 * @template K The allowed states of the machine.
 */
export type FSMTransitions<T, K extends string> = {
  [P in K]: (data: T) => MaybePromise<string | void | undefined>
}

/**
 * Create an highly observeable [finite state machine](https://en.wikipedia.org/wiki/Finite-state_machine)
 * that returns the context of the machine and can be awaited to get the context
 * of the final state.
 *
 * Each state is assigned to a transition function that is called when the
 * machine enters that state. The transition function is called the context of
 * the machine and it's return value is either the next state of the machine or
 * `true` to finalize the machine.
 *
 * @param initialData The initial data of the machine.
 * @param transitions A map of states and their transitions.
 * @returns The machine.
 * @example
 * // Create a finite state machine.
 * const rombaFSM = new FSM({
 *     battery: 100,
 *     position: { x: 0, y: 0 },
 *   }, {
 *   init: async(context) => {
 *     context.battery -= 10
 *     return 'move'
 *   },
 *   move: async(context) => {
 *     context.position.x += 1
 *     context.position.y += 1
 *     return context.battery > 0 ? 'move' : undefined
 *   },
 * })
 *
 * // Run the machine.
 * const result = await rombaFSM.run('init') // => { battery: 0, position: { x: 10, y: 10 } }
 */
export class FSM<T extends object, K extends string> extends EventTarget {

  /**
   * The data of the machine. It can be mutated by the transition functions.
   *
   * @example { foo: 'bar' }
   */
  public data: T

  /**
   * The current state of the machine. It is `undefined` when the machine is
   * idle and holds the name of the current state when the machine is running.
   *
   * @example 'init'
   */
  public state: K | void | undefined

  constructor(initialData: T, private transitions: FSMTransitions<T, K>) {
    super()
    this.data = initialData
  }

  /**
   * Start the machine given a state and data. If no data is provided, the
   * initial data of the machine is used.
   *
   * @param state The state to start the machine in.
   * @param data The data to start the machine with.
   * @returns A promise that resolves to the context once the machine is idle.
   * @example
   * // Create a finite state machine.
   * const FSM = createFsm({ isOdd: false }, {
   *   init: async(context) => {
   *     context.isOdd = context.data % 2 === 1
   *     return undefined
   *   },
   * })
   */
  async run(state: K, data?: T) {
    this.data = data ?? this.data
    this.state = state ?? this.state

    // --- Dispatch the `running` event.
    const eventRunning = new Event('start')
    this.dispatchEvent(eventRunning)

    // --- Run the machine until it is idle or finalized.
    while (typeof this.state === 'string') {
      const transition = this.transitions[this.state]
      if (transition === undefined) throw new Error(`FSM state '${state}' does not exist.`)

      // --- Dispatch the `stateChange` event.
      const event = new Event('transition')
      this.dispatchEvent(event)

      // --- Call the transition function and await the result.
      const result = await transition(this.data) as K | undefined
      this.state = result
    }

    // --- Dispatch the `idle` event.
    const eventIdle = new Event('idle')
    this.dispatchEvent(eventIdle)
  }
}

/**
 * Create an highly observeable [finite state machine](https://en.wikipedia.org/wiki/Finite-state_machine)
 * that returns the context of the machine and can be awaited to get the context
 * of the final state.
 *
 * Each state is assigned to a transition function that is called when the
 * machine enters that state. The transition function is called the context of
 * the machine and it's return value is either the next state of the machine or
 * `true` to finalize the machine.
 *
 * @param initialData The initial data of the machine.
 * @param transitions A map of states and their transitions.
 * @returns The machine.
 * @example
 * // Create a finite state machine.
 * const rombaFSM = createFsm({
 *     battery: 100,
 *     position: { x: 0, y: 0 },
 *   }, {
 *   init: async(context) => {
 *     context.battery -= 10
 *     return 'move'
 *   },
 *   move: async(context) => {
 *     context.position.x += 1
 *     context.position.y += 1
 *     return context.battery > 0 ? 'move' : undefined
 *   },
 * })
 *
 * // Run the machine.
 * const result = await rombaFSM.run('init') // => { battery: 0, position: { x: 10, y: 10 } }
 */
export function createFsm<T extends object, K extends string>(initialData: T, transitions: FSMTransitions<T, K>): FSM<T, K> {
  return new FSM<T, K>(initialData, transitions)
}

/* v8 ignore next */
if (import.meta.vitest) {
  describe('state', () => {
    it('should create a finite state machine instance', () => {
      const fsm = createFsm({ foo: 'bar' }, { init: () => {} })
      expect(fsm).toBeInstanceOf(FSM)
    })

    it('should expose the data of the machine', () => {
      const fsm = createFsm({ foo: 'bar' }, { init: () => {} })
      expect(fsm.data).toStrictEqual({ foo: 'bar' })
    })

    it('should be initialized with the state set to `undefined`', () => {
      const fsm = createFsm({ foo: 'bar' }, { init: () => {} })
      expect(fsm.state).toBeUndefined()
    })
  })

  describe('transition', () => {
    it('should run a finite state machine and resolve when the machine is idle', async() => {
      const fsm = createFsm({ foo: 'bar' }, { init: () => {} })
      const result = fsm.run('init')
      await expect(result).resolves.toBeUndefined()
    })

    it('should call the given transition function with the initial data', async() => {
      const init = vi.fn() as () => void
      const fsm = createFsm({ foo: 'bar' }, { init })
      await fsm.run('init')
      expect(init).toHaveBeenCalledWith({ foo: 'bar' })
    })

    it('should call the given transition function with the given data', async() => {
      const init = vi.fn() as () => void
      const fsm = createFsm({ foo: 'bar' }, { init })
      await fsm.run('init', { foo: 'baz' })
      expect(init).toHaveBeenCalledWith({ foo: 'baz' })
    })

    it('should mutate the data of the machine', async() => {
      const fsm = createFsm({ count: 0 }, { init: (context) => { context.count += 10 } })
      await fsm.run('init')
      expect(fsm.data).toStrictEqual({ count: 10 })
    })

    it('should call the next transition function when a state is returned', async() => {
      const init = vi.fn(() => 'next') as () => string
      const next = vi.fn() as () => void
      const fsm = createFsm({ foo: 'bar' }, { init, next })
      await fsm.run('init')
      expect(next).toHaveBeenCalledWith({ foo: 'bar' })
    })
  })

  describe('events', () => {
    it('should dispatch a `running` event when the machine is running', async() => {
      const fsm = createFsm({ foo: 'bar' }, { init: () => {} })
      const callback = vi.fn()
      fsm.addEventListener('start', callback)
      await fsm.run('init')
      expect(callback).toHaveBeenCalledOnce()
    })

    it('should dispatch a `transition` event when the machine is running', async() => {
      const fsm = createFsm({ foo: 'bar' }, { init: () => {} })
      const callback = vi.fn()
      fsm.addEventListener('transition', callback)
      await fsm.run('init')
      expect(callback).toHaveBeenCalledOnce()
    })

    it('should dispatch a `idle` event when the machine is idle', async() => {
      const fsm = createFsm({ foo: 'bar' }, { init: () => {} })
      const callback = vi.fn()
      fsm.addEventListener('idle', callback)
      await fsm.run('init')
      expect(callback).toHaveBeenCalledOnce()
    })
  })
}
