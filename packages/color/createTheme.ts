import type { ColorContrastOptions } from './createColor'
import { clamp } from '@unshared/math/clamp'
import { Color } from './createColor'

export const DEFAULT_THEME_ROLES = {
  surface: (base: Color, isDark: boolean) => Color.fromOklch({
    ...base.lch(),
    l: (isDark ? 10 : 98),
    c: (isDark ? 8 : 5),
  }),
  default: (base: Color, isDark: boolean) => Color.fromOklch({
    ...base.lch(),
    l: (isDark ? 18 : 92),
    c: (isDark ? 15 : 12),
  }),
  emphasis: (base: Color, isDark: boolean) => Color.fromOklch({
    ...base.lch(),
    l: (isDark ? 30 : 80),
    c: (isDark ? 30 : 25),
  }),
  interactive: (base: Color, isDark: boolean) => Color.fromOklch({
    ...base.lch(),
    l: (isDark ? 50 : 60),
    c: (isDark ? 60 : 55),
  }),
} as const satisfies Record<string, (base: Color, isDark: boolean) => Color>

export const DEFAULT_THEME_STATES = {
  default: (base: Color) => base,
  hover: (base: Color, isDark: boolean) => Color.fromOklch({
    l: clamp(base.lch().l + (isDark ? 8 : -8), 0, 100),
    c: clamp(base.lch().c * 1.15, 0, 100),
    h: base.lch().h,
  }),
  focus: (base: Color, isDark: boolean) => Color.fromOklch({
    l: clamp(base.lch().l + (isDark ? 12 : -12), 0, 100),
    c: clamp(base.lch().c * 1.25, 0, 100),
    h: base.lch().h,
  }),
  active: (base: Color, isDark: boolean) => Color.fromOklch({
    l: clamp(base.lch().l + (isDark ? 18 : -18), 0, 100),
    c: clamp(base.lch().c * 1.35, 0, 100),
    h: base.lch().h,
  }),
  disabled: (base: Color, isDark: boolean) => Color.fromOklch({
    l: clamp(base.lch().l * (isDark ? 0.5 : 0.95), 10, 95),
    c: clamp(base.lch().c * 0.3, 0, 15),
    h: base.lch().h,
  }),
} as const satisfies Record<string, (base: Color, isDark: boolean) => Color>

export const DEFAULT_CONTRAST_OPTIONS: ColorContrastOptions = {
  targetRatio: 75, // APCA contrast ratio target for normal text
  targetChroma: 0.05, // Subtle tinting for text
  minimumChroma: 0.015, // Fallback for very low chroma
  maximumChroma: 0.15, // Cap to prevent overly vibrant text
  darknessThreshold: 0.3, // Threshold to consider background as dark
  lightnessWhenDark: 0.95, // Light text on dark backgrounds
  lightnessWhenLight: 0.2, // Dark text on light backgrounds
}

export const DEFAULT_THEME_TARGETS = {
  background: (base: Color) => base,
  foreground: (base: Color) => base.contrast(DEFAULT_CONTRAST_OPTIONS),
  border: (base: Color, isDark: boolean) => {
    const sign = isDark ? 1 : -1
    return Color.fromLch({
      l: clamp(base.lch().l + (sign * 15), 0, 100),
      c: base.lch().c * 0.8,
      h: base.lch().h,
    })
  },
  muted: (base: Color, isDark: boolean) =>
    Color.fromLch({
      l: clamp(base.lch().l + (isDark ? 35 : -35), 15, 90),
      c: base.lch().c * 0.25,
      h: base.lch().h,
    }),
} as const satisfies Record<string, (base: Color, isDark: boolean) => Color>

export namespace Theme {

  /**
   * Input options for generating a theme.
   */
  export interface Options<
    Colors extends string = string,
    Roles extends string = string,
    States extends string = string,
    Targets extends string = string,
  > {
    isDark?: boolean
    colors?: Record<Colors, Color>
    roles?: Record<Roles, (base: Color, isDark: boolean) => Color>
    states?: Record<States, (base: Color, isDark: boolean) => Color>
    targets?: Record<Targets, (base: Color, isDark: boolean) => Color>
  }

  /**
   * A specific color state with background, foreground, and border.
   * Everything needed to render a UI element.
   */
  export interface ColorTargetSet {
    background: Color
    foreground: Color
    border: Color
    muted: Color
  }

  /**
   * A color token with all necessary variations for UI implementation.
   * Contains the color itself plus interaction states and contrast colors.
   */
  export type ColorStateSet<States extends string = string> =
    Record<States, ColorTargetSet>

  /**
   * Color intensity scale from subtle backgrounds to vibrant accents.
   * Based on chroma (saturation) levels for clear visual hierarchy.
   */
  export type ColorRoleSet<
    Roles extends string = string,
    States extends string = string,
  > =
    Record<Roles, Theme.ColorStateSet<States>>
}

/**
 * Complete theme with light and dark modes.
 * Single entry point for all colors needed in a UI.
 */
export interface Theme<
  Colors extends string = string,
  Roles extends string = string,
  States extends string = string,
  Targets extends string = string,
> {
  isDark: boolean
  colors: Record<Colors, Theme.ColorRoleSet<Roles, States>>
  options: Theme.Options<Colors, Roles, States, Targets>
}

/**
 * Create a theme with color roles and states.
 *
 * @param options Configuration options for the theme.
 * @returns Generated theme object.
 */
export function createTheme<
  Colors extends string = string,
  Roles extends string = keyof typeof DEFAULT_THEME_ROLES,
  States extends string = keyof typeof DEFAULT_THEME_STATES,
  Targets extends string = keyof typeof DEFAULT_THEME_TARGETS,
>(options: Theme.Options<Colors, Roles, States, Targets> = {}): Theme<Colors, Roles, States, Targets> {
  const {
    colors = {},
    isDark = false,
    roles = DEFAULT_THEME_ROLES,
    states = DEFAULT_THEME_STATES,
    targets = DEFAULT_THEME_TARGETS,
  } = options

  // --- Create the theme colors by iterating through each color
  const colorEntries = Object.entries(colors).map(([colorName, baseColor]) => {
    const roleEntries = Object.entries(roles).map(([roleName, roleFunction]) => {
      const roleColor = roleFunction(baseColor as Color, isDark)
      const stateEntries = Object.entries(states).map(([stateName, stateFunction]) => {
        const stateColor = stateFunction(roleColor, isDark)
        const targetEntries = Object.entries(targets).map(([targetName, targetFunction]) => [targetName, targetFunction(stateColor, isDark)])
        return [stateName, Object.fromEntries(targetEntries) as Theme.ColorTargetSet]
      })
      return [roleName, Object.fromEntries(stateEntries) as Theme.ColorStateSet<States>]
    })
    return [colorName, Object.fromEntries(roleEntries) as Theme.ColorRoleSet<Roles, States>]
  })

  // --- Return the complete theme object
  return {
    isDark,
    options,
    colors: Object.fromEntries(colorEntries) as Record<Colors, Theme.ColorRoleSet<Roles, States>>,
  }
}
