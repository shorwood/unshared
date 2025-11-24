<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '../../utils/useTheme'

const { currentTheme } = useTheme()

/**
 * Generate CSS variables from theme colors.
 * 
 * Available CSS variables:
 * 
 * 1. Full paths:
 *    --color-{color}-{role}-{state}-{target}
 *    Example: --color-primary-interactive-hover-background
 * 
 * 2. Default state shortcuts:
 *    --color-{color}-{role}-{target}
 *    Example: --color-primary-interactive-background
 * 
 * 3. First role shortcuts:
 *    --color-{color}-{target}
 *    Example: --color-primary-background
 * 
 * 4. Base shortcuts:
 *    --color-background, --color-foreground, --color-border
 * 
 * Where:
 *   {color} = base | primary | accent | success | warning | error | info (dynamic from theme)
 *   {role} = muted | default | surface | emphasis | interactive (dynamic from theme)
 *   {state} = default | hover | active | focus | disabled (dynamic from theme)
 *   {target} = background | foreground | border | muted
 */
const cssVariables = computed(() => {
  if (!currentTheme.value) return {}

  const theme = currentTheme.value
  const vars: Record<string, string> = {}

  // Get dynamic keys from the theme
  const colorNames = Object.keys(theme.colors)
  
  // Generate all CSS variables: --color-{color}-{role}-{state}-{target}
  for (const colorName of colorNames) {
    const colorRoles = theme.colors[colorName]
    if (!colorRoles) continue
    
    const roleNames = Object.keys(colorRoles)
    
    for (const roleName of roleNames) {
      const roleStates = colorRoles[roleName]
      if (!roleStates) continue
      
      const stateNames = Object.keys(roleStates)
      
      for (const stateName of stateNames) {
        const targets = roleStates[stateName]
        if (!targets) continue
        
        // Generate variables for each target (background, foreground, border, muted)
        vars[`--color-${colorName}-${roleName}-${stateName}-background`] = targets.background.hex()
        vars[`--color-${colorName}-${roleName}-${stateName}-foreground`] = targets.foreground.hex()
        vars[`--color-${colorName}-${roleName}-${stateName}-border`] = targets.border.hex()
        vars[`--color-${colorName}-${roleName}-${stateName}-muted`] = targets.muted.hex()
      }
      
      // Add shortcuts for default state: --color-{color}-{role}-{target}
      const defaultState = roleStates['default']
      if (defaultState) {
        vars[`--color-${colorName}-${roleName}-background`] = defaultState.background.hex()
        vars[`--color-${colorName}-${roleName}-foreground`] = defaultState.foreground.hex()
        vars[`--color-${colorName}-${roleName}-border`] = defaultState.border.hex()
        vars[`--color-${colorName}-${roleName}-muted`] = defaultState.muted.hex()
      }
    }
    
    // Add shortcuts for first role: --color-{color}-{target}
    const firstRole = Object.values(colorRoles)[0]
    if (firstRole) {
      const defaultState = firstRole['default']
      if (defaultState) {
        vars[`--color-${colorName}-background`] = defaultState.background.hex()
        vars[`--color-${colorName}-foreground`] = defaultState.foreground.hex()
        vars[`--color-${colorName}-border`] = defaultState.border.hex()
        vars[`--color-${colorName}-muted`] = defaultState.muted.hex()
      }
    }
  }

  // Ultra-short aliases for base colors: --color-{target}
  const baseColor = theme.colors['base']
  if (baseColor) {
    const firstRole = Object.values(baseColor)[0]
    if (firstRole) {
      const defaultState = firstRole['default']
      if (defaultState) {
        vars['--color-background'] = defaultState.background.hex()
        vars['--color-foreground'] = defaultState.foreground.hex()
        vars['--color-border'] = defaultState.border.hex()
        vars['--color-muted'] = defaultState.muted.hex()
      }
    }
  }

  return vars
})
</script>

<template>
  <div :style="cssVariables" class="theme-wrapper">
    <slot />
  </div>
</template>

<style scoped>
.theme-wrapper {
  min-height: 100vh;
  background-color: var(--color-background);
  color: var(--color-foreground);
  transition: all 0.3s ease;
}
</style>
