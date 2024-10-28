import { parseEnvironments } from './parseEnvironments'

describe('parseEnvironments', () => {
  beforeEach(() => {
    vi.stubEnv('APP_NAME', 'My App')
    vi.stubEnv('APP_VERSION', '1.0.0')
    vi.stubEnv('APP_DATABASE_TYPE', 'sqlite')
    vi.stubEnv('APP_DATABASE_URL', 'sqlite://localhost')
    vi.stubEnv('APP_PORT', '3000')
    vi.stubEnv('APP_IS_ACTIVE', 'true')
    vi.stubEnv('OTHER_NAME', 'Other App')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  test('should return all environment variables that start with the prefix', () => {
    const result = parseEnvironments('APP')
    expect(result).toStrictEqual({
      name: 'My App',
      version: '1.0.0',
      databaseType: 'sqlite',
      databaseUrl: 'sqlite://localhost',
      port: 3000,
      isActive: true,
    })
    expectTypeOf(result).toEqualTypeOf<Record<string, boolean | number | string>>()
  })

  test('should return and parse all environment variables that start with the prefix', () => {
    const result = parseEnvironments('APP', (name, value) => {
      if (name === 'isActive') return value === 'true' ? 'active' : 'inactive'
      if (name === 'name') return value.toUpperCase()
      return value
    })
    expect(result).toStrictEqual({
      name: 'MY APP',
      version: '1.0.0',
      databaseType: 'sqlite',
      databaseUrl: 'sqlite://localhost',
      port: '3000',
      isActive: 'active',
    })
    expectTypeOf(result).toEqualTypeOf<Record<string, string>>()
  })
})
