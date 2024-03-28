import { divIcon as createDivIcon, marker as createMarker } from 'leaflet'
import { PropType, computed, defineComponent, h, render, watch } from 'vue-demi'
import { UseLeafletOptions, useLeaflet } from '../composables/useLeaflet'

export default defineComponent({
  name: 'Map',
  props: {
    options: { type: Object as PropType<UseLeafletOptions>, default: {} },
  },
  emits: [
    'update:lat',
    'update:lng',
    'update:zoom',
  ],

  setup: (props, { slots, emit }) => {
    // --- Compute markers from slots.
    const markers = computed(() => (slots.default
      ? slots.default()
        .flatMap(x => [x, ...x.children as any[]])
        .filter(x => Number.isFinite(+x.props?.lat) && Number.isFinite(+x.props?.lng))
        .map((vnode) => {
          const div = document.createElement('div')
          render(vnode, div)
          const { lat, lng } = vnode.props
          const icon = createDivIcon({
            html: div.children?.[0] as HTMLElement,
            className: 'w-0 h-0',
          })
          return createMarker([lat, lng], { icon })
        })
      : []),
    )

    // --- Initialize Leaflet.
    const { lat, lng, zoom } = useLeaflet('map', props.options, markers)

    // --- Watch view.
    watch([lat, lng, zoom], ([lat, lng, zoom]) => {
      emit('update:lat', lat)
      emit('update:lng', lng)
      emit('update:zoom', zoom)
    })

    // --- Render the VNode.
    return () => h('div', { id: 'map' }, slots)
  },
})
