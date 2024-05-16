import { tryOnMounted } from '@vueuse/shared'
import { SymbolOptions } from 'milsymbol'
import { PropType, computed, defineComponent, h, mergeProps } from 'vue-demi'
import { exposeToDevtool } from '../utils'
import { useMilsymbol } from './useMilsymbol'

// TODO: Improve tree shaking.

export default defineComponent({
  name: 'Milsymbol',
  props: {
    as: { type: String as PropType<keyof HTMLElementTagNameMap>, default: 'span' },
    sidc: { type: String, required: true },
    options: { type: Object as PropType<SymbolOptions>, default: {} },
    prerender: { type: Boolean, default: true },
  },
  setup: (props, { attrs }) => {
    // --- Generate and expose the symbol's SVG.
    const sidc = computed(() => props.sidc)
    const { svg, update } = useMilsymbol(sidc, props.options)

    // --- Expose to Vue Devtools for debugging.
    exposeToDevtool({ svg })

    // --- Render the VNode.
    const functionalComponent = () => h(props.as, mergeProps(attrs, {
      'role': 'img',
      'aria-labelledby': sidc.value,
      'aria-hidden': 'true',
      'innerHTML': svg.value,
    }))

    // --- If prerendering, await the icon's SVG.
    // --- Otherwise return the functional component directly.
    if (props.prerender) update()
    else tryOnMounted(update)

    // --- Return the functional component.
    return functionalComponent
  },
})
