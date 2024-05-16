/* eslint-disable unicorn/prevent-abbreviations */

import { isDevelopment, isNode } from '@hsjm/shared'
import Milsymbol, { SymbolOptions } from 'milsymbol'
import { isReactive, nextTick, ref, unref, watch } from 'vue-demi'
import { MaybeRef } from '../utils'

/**
 * Resolve the SVG for a given sidc with `milsymbol`.
 *
 * @param sidc SIDH of the icon. (Example: `SFG-UCI----D` )
 * @param options Customisation options.
 * @returns The SVG as a `Ref<string>`
 */
export function useMilsymbol(sidc: MaybeRef<string>, options: SymbolOptions = {}) {
  // --- Initalize state.
  const svg = ref<string>()

  // --- Declare function to get the svg.
  const update = async() => {
    const unrefSidc = unref(sidc).padEnd(12, '-')
    svg.value = new Milsymbol.Symbol(unrefSidc, options).asSVG()
  }

  // --- Update on server init if not SSR & on prop changes.
  const toWatch = [sidc, options].filter(isReactive)
  if (toWatch.length > 0) watch(toWatch, update)
  if (isNode() || isDevelopment()) nextTick().then(update)

  // --- Return SVG ref.
  return { svg, update }
}
