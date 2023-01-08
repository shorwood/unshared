import { expect, it } from 'vitest'
import { bindThis } from './bindThis'

it('should bind "this" to the first parameter of the "greet" function', () => {
  const greet = (person: Person) => `Hello, I am ${person.name}`

  class Person {
    name: string
    constructor(name: string) { this.name = name }
    greet = bindThis(greet)
  }

  const result = new Person('Joe').greet()
  expect(result).toEqual('Hello, I am Joe')
})
