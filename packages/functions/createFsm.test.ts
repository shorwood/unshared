import { createFsm, FSM } from './createFsm'

describe('createFsm', () => {
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
})
