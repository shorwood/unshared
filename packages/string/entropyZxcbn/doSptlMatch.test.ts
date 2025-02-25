import { doSptlMatch } from './doSptlMatch'

interface Keyboard {
  Keys: string
  Shifts: string
  NumKeys: number
  NumNear: number
  NumShift: number
  NumBlank: number
}

interface SpatialMatchInfo {
  Keyb: number
  Turns: number
  Shifts: number
}

const MIN_SPATIAL_LEN = 3

describe('doSptlMatch', () => {
  it('should match a simple pattern', () => {
    const passwd = '12345'
    const maxLength = 5
    const keyb: Keyboard = {
      Keys: '1234567890',
      Shifts: '',
      NumKeys: 10,
      NumNear: 1,
      NumShift: 0,
      NumBlank: 0,
    }
    const extra: SpatialMatchInfo = { Keyb: 0, Turns: 0, Shifts: 0 }

    const result = doSptlMatch(passwd, maxLength, keyb, extra)

    expect(result).toBe(5)
    expect(extra.Turns).toBe(0)
    expect(extra.Shifts).toBe(0)
  })
})
