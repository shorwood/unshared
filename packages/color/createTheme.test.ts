/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Color } from './createColor'
import { createTheme } from './createTheme'

const expectedTargets = {
  background: expect.any(Color),
  foreground: expect.any(Color),
  muted: expect.any(Color),
  border: expect.any(Color),
}

const expectedStates = {
  default: expectedTargets,
  hover: expectedTargets,
  focus: expectedTargets,
  active: expectedTargets,
  disabled: expectedTargets,
}

const expectedRoles = {
  default: expectedStates,
  surface: expectedStates,
  emphasis: expectedStates,
  interactive: expectedStates,
}

describe('createTheme', () => {
  it('should create a theme with default roles and states', () => {
    const options = {
      colors: {
        primary: Color.fromHex('#ff0000'),
        secondary: Color.fromHex('#00ff00'),
      },
    }
    const result = createTheme(options)
    expect(result).toStrictEqual({
      isDark: false,
      options,
      colors: {
        primary: expectedRoles,
        secondary: expectedRoles,
      },
    })
  })
})
