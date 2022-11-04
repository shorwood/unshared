import { trim } from './trim'

it('removes whitespace from both sides of a string', () => {
  const result = trim(' foo bar ')
  const expected = 'foo bar'
  expect(result).toEqual(expected)
})
