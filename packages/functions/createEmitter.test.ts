import { createEmitter, Emitter } from './createEmitter'

describe('createEmitter', () => {
  describe('instance', () => {
    it('should create a new emitter instance', () => {
      const emitter = createEmitter()
      expect(emitter).toBeInstanceOf(Emitter)
    })
  })

  describe('on', () => {
    it('should add and trigger an event listener', () => {
      const emitter = createEmitter<{ 'test': [string] }>()
      const listener = vi.fn()
      emitter.on('test', listener)
      emitter.dispatch('test', 'data')
      expect(listener).toHaveBeenCalledWith('data')
    })

    it('should remove an event listener', () => {
      const emitter = createEmitter<{ 'test': [string] }>()
      const listener = vi.fn()
      const removeListener = emitter.on('test', listener)
      removeListener()
      emitter.dispatch('test', 'data')
      expect(listener).not.toHaveBeenCalled()
    })
  })

  describe('clear', () => {
    it('should clear all event listeners', () => {
      const emitter = createEmitter<{ 'test': [string] }>()
      const listener = vi.fn()
      emitter.on('test', listener)
      emitter.clear()
      emitter.dispatch('test', 'data')
      expect(listener).not.toHaveBeenCalled()
    })

    it('should dispose of all event listeners', () => {
      const emitter = createEmitter<{ 'test': [string] }>()
      const listener = vi.fn()
      emitter.on('test', listener)
      emitter[Symbol.dispose]()
      emitter.dispatch('test', 'data')
      expect(listener).not.toHaveBeenCalled()
    })
  })

  describe('once', () => {
    it('should add and trigger an event listener', () => {
      const emitter = createEmitter<{ 'test': [string] }>()
      const listener = vi.fn()
      emitter.once('test', listener)
      emitter.dispatch('test', 'data')
      expect(listener).toHaveBeenCalledWith('data')
    })

    it('should remove an event listener', () => {
      const emitter = createEmitter<{ 'test': [string] }>()
      const listener = vi.fn()
      emitter.once('test', listener)
      emitter.dispatch('test', 'data')
      emitter.dispatch('test', 'data')
      expect(listener).toHaveBeenCalledTimes(1)
    })
  })

  describe('edge cases', () => {
    it('should pass a reference to a ReadableStream', () => {
      const emitter = createEmitter<{ 'test': [ReadableStream] }>()
      const listener = vi.fn()
      emitter.on('test', listener)
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue('Hello, world!')
          controller.close()
        },
      })
      emitter.dispatch('test', stream)
      expect(listener).toHaveBeenCalledWith(stream)
    })

    it('should pass a ReadableStream that can be read', async() => {
      const emitter = createEmitter<{ 'test': [ReadableStream<string>] }>()
      const stream = new ReadableStream<string>({
        start(controller) {
          controller.enqueue('Hello, world!')
          controller.close()
        },
      })
      const promise = new Promise((resolve) => {
        emitter.on('test', async(stream) => {
          const reader = stream.getReader()
          const chunks = []
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            chunks.push(value)
          }
          resolve(chunks)
        })
      })
      emitter.dispatch('test', stream)
      await expect(promise).resolves.toEqual(['Hello, world!'])
    })
  })
})
