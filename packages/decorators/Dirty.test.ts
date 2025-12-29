import { Dirty, DirtyProperty, DirtyTrigger } from './Dirty'

describe('Dirty', () => {
  describe('base class', () => {
    test('should initialize with isDirty as false', () => {
      class MyClass extends Dirty {}
      const instance = new MyClass()
      expect(instance.isDirty()).toBe(false)
    })

    test('should mark as dirty when markDirty is called', () => {
      class MyClass extends Dirty {}
      const instance = new MyClass()
      instance.markDirty()
      expect(instance.isDirty()).toBe(true)
    })

    test('should mark as dirty with tags', () => {
      class MyClass extends Dirty {}
      const instance = new MyClass()
      instance.markDirty('tag1', 'tag2')
      expect(instance.isDirty()).toBe(true)
      expect(instance.isDirty('tag1')).toBe(true)
      expect(instance.isDirty('tag2')).toBe(true)
      expect(instance.isDirty('tag3')).toBe(false)
    })

    test('should clear all dirty state when clearDirty is called without arguments', () => {
      class MyClass extends Dirty {}
      const instance = new MyClass()
      instance.markDirty('tag1', 'tag2')
      instance.clearDirty()
      expect(instance.isDirty()).toBe(false)
      expect(instance.isDirty('tag1')).toBe(false)
      expect(instance.isDirty('tag2')).toBe(false)
    })

    test('should clear specific tags when clearDirty is called with arguments', () => {
      class MyClass extends Dirty {}
      const instance = new MyClass()
      instance.markDirty('tag1', 'tag2', 'tag3')
      instance.clearDirty('tag1')
      expect(instance.isDirty()).toBe(true)
      expect(instance.isDirty('tag1')).toBe(false)
      expect(instance.isDirty('tag2')).toBe(true)
      expect(instance.isDirty('tag3')).toBe(true)
    })

    test('should set isDirty to false when all tags are cleared', () => {
      class MyClass extends Dirty {}
      const instance = new MyClass()
      instance.markDirty('tag1', 'tag2')
      instance.clearDirty('tag1', 'tag2')
      expect(instance.isDirty()).toBe(false)
    })
  })

  describe('DirtyProperty', () => {
    test('should mark as dirty when property value changes', () => {
      class MyClass extends Dirty {
        @DirtyProperty() accessor title = ''
      }
      const instance = new MyClass()
      expect(instance.isDirty()).toBe(false)
      instance.title = 'Hello'
      expect(instance.isDirty()).toBe(true)
    })

    test('should not mark as dirty when property value is the same', () => {
      class MyClass extends Dirty {
        @DirtyProperty() accessor title = 'Hello'
      }
      const instance = new MyClass()
      instance.clearDirty()
      instance.title = 'Hello'
      expect(instance.isDirty()).toBe(false)
    })

    test('should mark as dirty with specified tags', () => {
      class MyClass extends Dirty {
        @DirtyProperty({ tags: 'content' }) accessor title = ''
      }
      const instance = new MyClass()
      instance.title = 'Hello'
      expect(instance.isDirty('content')).toBe(true)
      expect(instance.isDirty('other')).toBe(false)
    })

    test('should mark as dirty with multiple tags', () => {
      class MyClass extends Dirty {
        @DirtyProperty({ tags: ['tag1', 'tag2'] }) accessor title = ''
      }
      const instance = new MyClass()
      instance.title = 'Hello'
      expect(instance.isDirty('tag1')).toBe(true)
      expect(instance.isDirty('tag2')).toBe(true)
    })

    test('should use custom equals function', () => {
      class MyClass extends Dirty {
        @DirtyProperty({ equals: (a: string, b: string) => a?.toLowerCase() === b?.toLowerCase() })
        accessor title = 'hello'
      }
      const instance = new MyClass()
      instance.clearDirty()
      instance.title = 'HELLO'
      expect(instance.isDirty()).toBe(false)
      instance.title = 'World'
      expect(instance.isDirty()).toBe(true)
    })

    test('should respect condition function', () => {
      class MyClass extends Dirty {
        isLocked = false
        @DirtyProperty({ condition: ({ instance }) => !(instance as MyClass).isLocked })
        accessor title = ''
      }
      const instance = new MyClass()
      instance.isLocked = true
      instance.title = 'Hello'
      expect(instance.isDirty()).toBe(false)
      instance.isLocked = false
      instance.title = 'World'
      expect(instance.isDirty()).toBe(true)
    })

    test('should pass old and new values to condition', () => {
      const conditionFunction = vi.fn(() => true)
      class MyClass extends Dirty {
        @DirtyProperty({ condition: conditionFunction })
        accessor title = 'initial'
      }
      const instance = new MyClass()
      instance.title = 'updated'
      expect(conditionFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          oldValue: 'initial',
          newValue: 'updated',
          instance,
        }),
      )
    })

    test('should preserve property value', () => {
      class MyClass extends Dirty {
        @DirtyProperty() accessor title = 'initial'
      }
      const instance = new MyClass()
      expect(instance.title).toBe('initial')
      instance.title = 'updated'
      expect(instance.title).toBe('updated')
    })

    test('should work with multiple properties', () => {
      class MyClass extends Dirty {
        @DirtyProperty({ tags: 'name' }) accessor firstName = ''
        @DirtyProperty({ tags: 'name' }) accessor lastName = ''
        @DirtyProperty({ tags: 'email' }) accessor email = ''
      }
      const instance = new MyClass()
      instance.firstName = 'John'
      expect(instance.isDirty('name')).toBe(true)
      expect(instance.isDirty('email')).toBe(false)
      instance.clearDirty('name')
      expect(instance.isDirty()).toBe(false)
      instance.email = 'john@example.com'
      expect(instance.isDirty('email')).toBe(true)
    })
  })

  describe('DirtyTrigger', () => {
    test('should mark as dirty when method is called', () => {
      class MyClass extends Dirty {
        value = 0
        @DirtyTrigger() increment() { this.value++ }
      }
      const instance = new MyClass()
      expect(instance.isDirty()).toBe(false)
      instance.increment()
      expect(instance.isDirty()).toBe(true)
      expect(instance.value).toBe(1)
    })

    test('should mark as dirty with specified tags', () => {
      class MyClass extends Dirty {
        @DirtyTrigger({ tags: 'action' }) doSomething() {}
      }
      const instance = new MyClass()
      instance.doSomething()
      expect(instance.isDirty('action')).toBe(true)
      expect(instance.isDirty('other')).toBe(false)
    })

    test('should mark as dirty with multiple tags', () => {
      class MyClass extends Dirty {
        @DirtyTrigger({ tags: ['tag1', 'tag2'] }) doSomething() {}
      }
      const instance = new MyClass()
      instance.doSomething()
      expect(instance.isDirty('tag1')).toBe(true)
      expect(instance.isDirty('tag2')).toBe(true)
    })

    test('should respect condition function', () => {
      class MyClass extends Dirty {
        @DirtyTrigger({ condition: ({ parameters }) => parameters[0] !== 'skip' })
        doSomething(mode: string) { return mode }
      }
      const instance = new MyClass()
      instance.doSomething('skip')
      expect(instance.isDirty()).toBe(false)
      instance.doSomething('execute')
      expect(instance.isDirty()).toBe(true)
    })

    test('should pass parameters to condition', () => {
      const conditionFunction = vi.fn(() => true)
      class MyClass extends Dirty {
        @DirtyTrigger({ condition: conditionFunction })
        doSomething(a: number, b: string) { return `${a}-${b}` }
      }
      const instance = new MyClass()
      instance.doSomething(42, 'hello')
      expect(conditionFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          instance,
          parameters: [42, 'hello'],
        }),
      )
    })

    test('should preserve method return value', () => {
      class MyClass extends Dirty {
        @DirtyTrigger() calculate(a: number, b: number) { return a + b }
      }
      const instance = new MyClass()
      const result = instance.calculate(2, 3)
      expect(result).toBe(5)
    })

    test('should preserve method context', () => {
      class MyClass extends Dirty {
        value = 42
        @DirtyTrigger() getValue() { return this.value }
      }
      const instance = new MyClass()
      expect(instance.getValue()).toBe(42)
    })
  })

  describe('combined usage', () => {
    test('should track both property and method changes', () => {
      class Form extends Dirty {
        @DirtyProperty({ tags: 'input' }) accessor username = ''
        @DirtyTrigger({ tags: 'submit' }) submit() {}
      }
      const form = new Form()
      expect(form.isDirty()).toBe(false)

      form.username = 'alice'
      expect(form.isDirty('input')).toBe(true)
      expect(form.isDirty('submit')).toBe(false)

      form.submit()
      expect(form.isDirty('submit')).toBe(true)

      form.clearDirty('input')
      expect(form.isDirty('input')).toBe(false)
      expect(form.isDirty('submit')).toBe(true)
      expect(form.isDirty()).toBe(true)

      form.clearDirty()
      expect(form.isDirty()).toBe(false)
    })

    test('should work with different instances independently', () => {
      class MyClass extends Dirty {
        @DirtyProperty() accessor value = ''
      }
      const instance1 = new MyClass()
      const instance2 = new MyClass()

      instance1.value = 'hello'
      expect(instance1.isDirty()).toBe(true)
      expect(instance2.isDirty()).toBe(false)
    })
  })
})
