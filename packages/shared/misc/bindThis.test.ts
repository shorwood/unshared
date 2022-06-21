import { expect, it } from 'vitest'
import { bindThis } from './bindThis'

it('should bind "this" to the "greet" function', () => {
  const greet = (person: Person) => `Hello, I am ${person.name}`

  class Person {
    name: string
    constructor(name: string) { this.name = name }
    greet = bindThis(greet)
  }

  expect(new Person('Joe').greet()).toBe('Hello, I am Joe')
})
