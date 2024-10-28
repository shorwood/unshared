import { template } from './template'

describe('template', () => {
  test('should template a string with default options', () => {
    const result = template('Hello {{name}}', { name: 'World' })
    expect(result).toBe('Hello World')
  })

  test('should template a string with nested data', () => {
    const data = { name: { first: 'John', last: 'Doe' } }
    const result = template('Hello {{name.first}} {{name.last}}', data)
    expect(result).toBe('Hello John Doe')
  })

  test('should template a string with custom delimiters', () => {
    const result = template('Hello <%name%>', { name: 'World' }, {
      delimiterEnd: '%>',
      delimiterStart: '<%',
    })
    expect(result).toBe('Hello World')
  })

  test('should template a string with a custom transform', () => {
    const result = template('Hello {{name}}', { name: 'World' }, {
      transform: value => (value as string).toUpperCase(),
    })
    expect(result).toBe('Hello WORLD')
  })

  test('should template a value and transform it into a string by default', () => {
    const result = template('Hello {{name}}', { name: { toString: () => 'World' } })
    expect(result).toBe('Hello World')
  })
})
