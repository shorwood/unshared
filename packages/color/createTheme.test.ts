/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Color } from './createColor'
import { createTheme } from './createTheme'

describe('createTheme', () => {
  it('should create a theme with default roles and states', () => {
    const result = createTheme({ colors: { primary: Color.fromHex('#ff0000') } })
    expect(result).toMatchObject({
      colors: {
        primary: {
          default: {
            default: {
              background: expect.any(Color),
              foreground: expect.any(Color),
              muted: expect.any(Color),
              border: expect.any(Color),
            },
            hover: {
              background: expect.any(Color),
              foreground: expect.any(Color),
              muted: expect.any(Color),
              border: expect.any(Color),
            },
            focus: {
              background: expect.any(Color),
              foreground: expect.any(Color),
              muted: expect.any(Color),
              border: expect.any(Color),
            },
            active: {
              background: expect.any(Color),
              foreground: expect.any(Color),
              muted: expect.any(Color),
              border: expect.any(Color),
            },
            disabled: {
              background: expect.any(Color),
              foreground: expect.any(Color),
              muted: expect.any(Color),
              border: expect.any(Color),
            },
          },
          surface: {
            default: {
              background: expect.any(Color),
              foreground: expect.any(Color),
              muted: expect.any(Color),
              border: expect.any(Color),
            },
            hover: {
              background: expect.any(Color),
              foreground: expect.any(Color),
              muted: expect.any(Color),
              border: expect.any(Color),
            },
            focus: {
              background: expect.any(Color),
              foreground: expect.any(Color),
              muted: expect.any(Color),
              border: expect.any(Color),
            },
            active: {
              background: expect.any(Color),
              foreground: expect.any(Color),
              muted: expect.any(Color),
              border: expect.any(Color),
            },
            disabled: {
              background: expect.any(Color),
              foreground: expect.any(Color),
              muted: expect.any(Color),
              border: expect.any(Color),
            },
          },
          emphasis: {
            default: {
              background: expect.any(Color),
              foreground: expect.any(Color),
              muted: expect.any(Color),
              border: expect.any(Color),
            },
            hover: {
              background: expect.any(Color),
              foreground: expect.any(Color),
              muted: expect.any(Color),
              border: expect.any(Color),
            },
            focus: {
              background: expect.any(Color),
              foreground: expect.any(Color),
              muted: expect.any(Color),
              border: expect.any(Color),
            },
            active: {
              background: expect.any(Color),
              foreground: expect.any(Color),
              muted: expect.any(Color),
              border: expect.any(Color),
            },
            disabled: {
              background: expect.any(Color),
              foreground: expect.any(Color),
              muted: expect.any(Color),
              border: expect.any(Color),
            },
          },
          interactive: {
            default: {
              background: expect.any(Color),
              foreground: expect.any(Color),
              muted: expect.any(Color),
              border: expect.any(Color),
            },
            hover: {
              background: expect.any(Color),
              foreground: expect.any(Color),
              muted: expect.any(Color),
              border: expect.any(Color),
            },
            focus: {
              background: expect.any(Color),
              foreground: expect.any(Color),
              muted: expect.any(Color),
              border: expect.any(Color),
            },
            active: {
              background: expect.any(Color),
              foreground: expect.any(Color),
              muted: expect.any(Color),
              border: expect.any(Color),
            },
            disabled: {
              background: expect.any(Color),
              foreground: expect.any(Color),
              muted: expect.any(Color),
              border: expect.any(Color),
            },
          },
        },
      },
    })
  })
})
