export interface RGBA {
  r: number
  g: number
  b: number
  a: number
}
export interface RGB {
  r: number
  g: number
  b: number
  a?: number
}

export interface HSL {
  h: number
  s: number
  l: number
  a?: number
}

export interface HSLA {
  h: number
  s: number
  l: number
  a: number
}

export type ColorIntegerFormat = 'rgb' | 'rgba' | 'argb'
