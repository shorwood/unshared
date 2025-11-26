import type { ThemeOptions } from '../preset'

/**
 * Simplified resolution strategy:
 * Traverse color -> role -> state -> target using explicit specifier segments.
 * For each segment:
 * 1. Try the explicit key (if provided).
 * 2. If missing, retry with "default".
 * 3. If still missing, resolution fails and the function returns undefined.
 * At the target level, require the resolved value to be a Color instance (by constructor name check).
 *
 * @param specifier Dash-delimited specifier: color[-role[-state[-target]]].
 * @param options Theme resolution options.
 * @returns CSS variable string (e.g. `var(--theme-primary-default-default-default)`) or undefined if resolution fails.
 */
export function resolveThemeCssVariable(
  specifier?: string,
  options: ThemeOptions = {},
): string | undefined {
  const {
    presets,
    defaultColor = 'primary',
    defaultTarget = 'background',
  } = options

  if (!presets || specifier === undefined) return
  for (const preset of Object.values(presets)) {
    if (!preset.colors) continue
    const parts = specifier.split('-').filter(Boolean)

    // --- Iterate 4 times into the preset object and default the
    // --- traversal key to 'default' if the current key is not in the
    // --- current level
    let current: object = preset.colors
    const segments: string[] = []
    for (let i = 0; i < 4; i++) {
      const part = parts.shift()

      // --- This part corresponds to a specifier segment. Check if the part
      // --- corresponds to a key in the current level. If not, push it back for
      // --- later implicit defaulting.
      if (part && part in current) {
        current = current[part as keyof typeof current]
        segments.push(part)
        continue
      }
      else if (part) {
        parts.unshift(part)
      }

      // --- Implicitly fallback to 'default' for color, role, and state levels.
      // --- If at current level, use provided defaultTarget instead of 'default'.
      // --- If at target level, use provided defaultTarget instead of 'default'.
      // const nextKey = i < 3 ? 'default' : defaultTarget
      let defaultKey = 'default'
      if (i === 0) defaultKey = defaultColor
      else if (i === 3) defaultKey = defaultTarget
      if (defaultKey in current) {
        current = current[defaultKey as keyof typeof current] as object
        segments.push(defaultKey)
      }
    }

    // --- If at this point, we dont have 4 segments or there are still unconsumed parts, resolution failed.
    if (segments.length !== 4 || parts.length > 0) continue

    // --- Return CSS variable when all 4 structural segments are resolved (explicitly or via fallbacks)
    return `var(--theme-${segments.join('-')})`
  }
}
