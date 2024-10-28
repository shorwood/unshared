import { createSemver, Semver } from './createSemver'

describe('createSemver', () => {
  const semverString = '1.2.3-alpha4+build5'
  const semverObject = { build: 'build5', major: 1, minor: 2, patch: 3, prerelease: 'alpha4' }

  test('should create a Semver instance with default values', () => {
    const version = createSemver()
    const expected = new Semver({ build: undefined, major: 0, minor: 0, patch: 0, prerelease: undefined })
    expect(version).toStrictEqual(expected)
  })

  test('should create a Semver instance from the given object', () => {
    const version = createSemver(semverObject)
    expect(version).toMatchObject(semverObject)
  })

  test('should create a Semver instance from parsing the given string', () => {
    const version = createSemver(semverString)
    expect(version).toMatchObject(semverObject)
  })

  test('should throw an error when parsing an invalid semver string', () => {
    const shouldThrow = () => createSemver('invalid')
    expect(shouldThrow).toThrow('Invalid semver version: invalid')
  })

  test('should bump the major component', () => {
    const version = createSemver(semverString).bump('major')
    expect(version).toMatchObject({ build: undefined, major: 2, minor: 0, patch: 0, prerelease: undefined })
  })

  test('should bump the minor component', () => {
    const version = createSemver(semverString).bump('minor')
    expect(version).toMatchObject({ build: undefined, major: 1, minor: 3, patch: 0, prerelease: undefined })
  })

  test('should bump the patch component', () => {
    const version = createSemver(semverString).bump('patch')
    expect(version).toMatchObject({ build: undefined, major: 1, minor: 2, patch: 4, prerelease: undefined })
  })

  test('should set a component to the given value', () => {
    const version = createSemver(semverString).bump('prerelease', 'beta')
    expect(version).toMatchObject({ build: 'build5', major: 1, minor: 2, patch: 3, prerelease: 'alpha4' })
  })

  test('should stringify the semver', () => {
    const version = createSemver(semverString).toString()
    expect(version).toStrictEqual(semverString)
  })

  test.each([

    // --- Operator ">="
    ['1.0.0', '>=1.0.0', true],
    ['1.0.1', '>=1.0.0', true],
    ['1.1.0', '>=1.0.0', true],
    ['2.0.0', '>=1.0.0', true],
    ['0.9.9', '>=1.0.0', false],
    ['0.0.0', '>=1.0.0', false],

    // --- Operator ">"
    ['1.0.0', '>1.0.0', false],
    ['1.0.1', '>1.0.0', true],
    ['1.1.0', '>1.0.0', true],
    ['2.0.0', '>1.0.0', true],
    ['0.9.9', '>1.0.0', false],
    ['0.0.0', '>1.0.0', false],

    // --- Operator "<="
    ['1.0.0', '<=1.0.0', true],
    ['1.0.1', '<=1.0.0', false],
    ['1.1.0', '<=1.0.0', false],
    ['2.0.0', '<=1.0.0', false],
    ['0.9.9', '<=1.0.0', true],
    ['0.0.0', '<=1.0.0', true],

    // --- Operator "<"
    ['1.0.0', '<1.0.0', false],
    ['1.0.1', '<1.0.0', false],
    ['1.1.0', '<1.0.0', false],
    ['2.0.0', '<1.0.0', false],
    ['0.9.9', '<1.0.0', true],
    ['0.0.0', '<1.0.0', true],

    // --- Operator "="
    ['1.0.0', '=1.0.0', true],
    ['1.0.1', '=1.0.0', false],
    ['1.1.0', '=1.0.0', false],
    ['2.0.0', '=1.0.0', false],
    ['0.9.9', '=1.0.0', false],
    ['0.0.0', '=1.0.0', false],

    // --- Operator "^"
    ['1.0.0', '^1.0.0', true],
    ['1.0.1', '^1.0.0', true],
    ['1.1.0', '^1.0.0', true],
    ['2.0.0', '^1.0.0', false],
    ['0.9.9', '^1.0.0', false],
    ['0.0.0', '^1.0.0', false],

    // --- Operator "~"
    ['1.0.0', '~1.0.0', true],
    ['1.0.1', '~1.0.0', true],
    ['1.1.0', '~1.0.0', false],
    ['2.0.0', '~1.0.0', false],
    ['0.9.9', '~1.0.0', false],
    ['0.0.0', '~1.0.0', false],

  ])('should check if %s satisfies %s and return %s', (version: string, range: string, expected: boolean) => {
    const result = createSemver(version).satisfies(range)
    expect(result).toStrictEqual(expected)
  })
})
