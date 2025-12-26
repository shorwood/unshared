import type { DynamicRule } from '@unocss/core'
import type { Color } from '@unshared/color/createColor'
import type { ThemeOptions } from '../preset'

export function ruleTheme<Theme extends object>(options: ThemeOptions): DynamicRule<Theme> {
  return [
    /^theme-(?<specifier>.+)$/,
    (match) => {
      if (!match?.groups) return
      const { specifier } = match.groups
      if (!specifier) return

      // --- Traverse the entire theme structure: colors -> roles -> states -> targets
      if (!options.presets) return
      if (!(specifier in options.presets)) return
      const theme = options.presets[specifier]

      // --- Collect all CSS variables for the theme.
      const variables: Record<string, string> = {}
      for (const [colorName, roles] of Object.entries(theme.colors)) {
        for (const [roleName, states] of Object.entries(roles)) {
          for (const [stateName, stateTargets] of Object.entries(states)) {
            for (const [targetName, color] of Object.entries(stateTargets)) {
              const variableValue = (color as Color).toString('css-oklch').slice(6, -1)
              const variableName = `--theme-${colorName}-${roleName}-${stateName}-${targetName}`
              variables[variableName] = variableValue
            }
          }
        }
      }

      // --- Return all variables.
      return variables
    },
    {
      layer: 'utilities',
    },
  ]
}
