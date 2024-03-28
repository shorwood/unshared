export const FACTOR_BASE10_SHORT_BIG = {
  da: 1e+1,
  h: 1e+2,
  k: 1e+3,
  M: 1e+6,
  G: 1e+9,
  T: 1e+12,
  P: 1e+15,
  E: 1e+18,
  Z: 1e+21,
  Y: 1e+24,
  R: 1e+27,
  Q: 1e+30,
} as const

export const FACTOR_BASE10_SHORT_SMALL = {
  d: 1e-1,
  c: 1e-2,
  m: 1e-3,
  u: 1e-6,
  n: 1e-9,
  p: 1e-12,
  f: 1e-15,
  a: 1e-18,
  z: 1e-21,
  y: 1e-24,
  r: 1e-27,
  q: 1e-30,
} as const

export const FACTOR_BASE10_LONG_BIG = {
  deca: 1e+1,
  hecto: 1e+2,
  kilo: 1e+3,
  mega: 1e+6,
  giga: 1e+9,
  tera: 1e+12,
  peta: 1e+15,
  exa: 1e+18,
  zetta: 1e+21,
  yotta: 1e+24,
  ron: 1e+27,
  quin: 1e+30,
} as const

export const FACTOR_BASE10_LONG_SMALL = {
  deci: 1e-1,
  centi: 1e-2,
  milli: 1e-3,
  micro: 1e-6,
  nano: 1e-9,
  pico: 1e-12,
  femto: 1e-15,
  atto: 1e-18,
  zepto: 1e-21,
  yocto: 1e-24,
  rondo: 1e-27,
  quinto: 1e-30,
} as const

export const FACTOR_BASE2_SHORT = {
  k: 2 ** 10,
  M: 2 ** 20,
  G: 2 ** 30,
  T: 2 ** 40,
  P: 2 ** 50,
  E: 2 ** 60,
  Z: 2 ** 70,
  Y: 2 ** 80,
  R: 2 ** 90,
  Q: 2 ** 100,
} as const

export const FACTOR_BASE2_LONG = {
  kibi: 2 ** 10,
  mebi: 2 ** 20,
  gibi: 2 ** 30,
  tebi: 2 ** 40,
  pebi: 2 ** 50,
  exbi: 2 ** 60,
  zebi: 2 ** 70,
  yobi: 2 ** 80,
  ribi: 2 ** 90,
  quibi: 2 ** 100,
} as const

export const FACTOR_DURATION_SHORT = {
  s: 1,
  sec: 1,
  min: 60,
  h: 60 * 60,
  d: 60 * 60 * 24,
  w: 60 * 60 * 24 * 7,
  m: 60 * 60 * 24 * 30,
  y: 60 * 60 * 24 * 365,
} as const

export const FACTOR_DURATION_LONG = {
  second: 1,
  minute: 60,
  hour: 60 * 60,
  day: 60 * 60 * 24,
  week: 60 * 60 * 24 * 7,
  month: 60 * 60 * 24 * 30,
  year: 60 * 60 * 24 * 365,
  fortnight: 60 * 60 * 24 * 14,
  olympiad: 60 * 60 * 24 * 365 * 4,
  decade: 60 * 60 * 24 * 365 * 10,
  century: 60 * 60 * 24 * 365 * 100,
  millennium: 60 * 60 * 24 * 365 * 1000,
} as const

export const FACTOR_BASE10_SHORT = { ...FACTOR_BASE10_SHORT_BIG, ...FACTOR_BASE10_SHORT_SMALL }
export const FACTOR_BASE10_LONG = { ...FACTOR_BASE10_LONG_BIG, ...FACTOR_BASE10_LONG_SMALL }
export const FACTOR_BASE10_SMALL = { ...FACTOR_BASE10_SHORT_SMALL, ...FACTOR_BASE10_LONG_SMALL }
export const FACTOR_BASE10_BIG = { ...FACTOR_BASE10_SHORT_BIG, ...FACTOR_BASE10_LONG_BIG }
export const FACTOR_BASE10 = { ...FACTOR_BASE10_SHORT, ...FACTOR_BASE10_LONG }
export const FACTOR_BASE2 = { ...FACTOR_BASE2_SHORT, ...FACTOR_BASE2_LONG }
