import { memoize } from '@hsjm/shared'
import { IconifyIconCustomisations } from '@iconify/utils'
import { isReactive, isRef, ref, unref, watch } from 'vue-demi'
import { MaybeRef as MaybeReference, fetchIcon } from '../utils'

/** Fetch an icon data from cache or remote */
const fetchIconMemoized = memoize(fetchIcon)

/**
 * Resolve the SVG for a given icon with `@iconify`.
 *
 * @param icon Name of the icon. (Example: `mdi:user` )
 * @param options Customisation options.
 * @returns The composable object containing the SVG.
 */
export function useIconify(icon: MaybeReference<string>, options: IconifyIconCustomisations = {}) {
  // --- Initalize state.
  const svg = ref<string>()

  // --- Declare function to get the svg.
  const update = () => fetchIconMemoized(unref(icon), options)
    .then(svgResult => svg.value = svgResult)

  // --- Update on prop changes.
  const toWatch = [icon, options].filter(x => isReactive(x) || isRef(x))
  if (toWatch.length > 0) watch(toWatch, update)

  // --- Return SVG ref.
  return { svg, update }
}
