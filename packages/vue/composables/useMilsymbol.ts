/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable spaced-comment */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { isReactive, nextTick, ref, unref, watch } from 'vue-demi'
import { isDevelopment, isNode } from '@hsjm/shared'
import Milsymbol, { SymbolOptions } from 'milsymbol'
import { MaybeRef } from '../utils'

/**
 * Resolve the SVG for a given sidc with `milsymbol`.
 * @param sidc SIDH of the icon. (Example: `SFG-UCI----D` )
 * @param options Customisation options.
 * @returns The SVG as a `Ref<string>`
 */
export const useMilsymbol = /*@__PURE__*/ (sidc: MaybeRef<string>, options: SymbolOptions = {}) => {
  // --- Initalize state.
  const svg = ref<string>()

  // --- Declare function to get the svg.
  const update = async() => {
    const unrefSidc = unref(sidc)?.padEnd?.(12, '-')
    svg.value = new Milsymbol.Symbol(unrefSidc, options).asSVG()
  }

  // --- Update on server init if not SSR & on prop changes.
  const toWatch = [sidc, options].filter(isReactive)
  if (toWatch.length > 0) watch(toWatch, update)
  if (isNode() || isDevelopment()) nextTick().then(update)

  // --- Return SVG ref.
  return { svg, update }
}
