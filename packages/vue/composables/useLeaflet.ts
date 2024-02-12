/* eslint-disable unicorn/no-array-method-this-argument */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { isReactive, ref, unref, watch } from 'vue-demi'
import { MaybeRef, createUnrefFn } from '@vueuse/core'
import { Map, MapOptions, Marker, TileLayerOptions } from 'leaflet'
import { requireSafe } from '@hsjm/shared'
// import 'leaflet/dist/leaflet.css'

export type LeafletTileLayerOptions = TileLayerOptions & { urlTemplate: string }

export interface UseLeafletOptions extends MapOptions {
  tileLayers: LeafletTileLayerOptions[] | LeafletTileLayerOptions
  initialLat?: number
  initialLng?: number
  initialZoom?: number
}

export const useLeaflet = (element: string | HTMLElement, options: MaybeRef<UseLeafletOptions>, markers: MaybeRef<Marker[]> = []) => {
  // --- Destructure and defaults options
  const {
    tileLayers = [],
    initialLat = 0,
    initialLng = 0,
    initialZoom = 8,
  } = unref(options)

  // --- Initialize variables.
  const lat = ref(initialLat)
  const lng = ref(initialLng)
  const zoom = ref(initialZoom)
  const map = ref<Map | undefined>()

  // --- Import dependencies.
  const L = requireSafe<typeof import('leaflet')>('leaflet')
  if (!L) throw new Error('Leaflet dependency not found')

  // --- Initialize map.
  const updateMap = (options: UseLeafletOptions) => {
    map.value = L.map(element, options).setView([lat.value, lng.value], zoom.value)

    // --- Sync map view with ref values.
    map.value.on('move', () => {
      const center = (<Map>map.value).getCenter()
      lat.value = center.lat
      lng.value = center.lng
      zoom.value = (<Map>map.value).getZoom()
    })

    // --- Add layer(s)
    for (const tileLayer of Array.isArray(tileLayers) ? tileLayers : [tileLayers])
      L.tileLayer(tileLayer.urlTemplate, tileLayer).addTo(map.value)
  }

  const updateMarkers = (markers?: Marker[], oldMarkers?: Marker[]) => {
    if (!map.value) return

    // --- Flush markers.
    if (oldMarkers !== undefined) {
      for (const oldMarker of oldMarkers)
        oldMarker.removeFrom(map.value)
    }

    // --- Add markers.
    if (markers !== undefined) {
      for (const marker of markers)
        marker.addTo(map.value)
    }
  }

  // --- Sync map & markers.
  if (isReactive(options)) watch(options, createUnrefFn(updateMap), { immediate: true, deep: true })
  if (isReactive(markers)) watch(markers, createUnrefFn(updateMarkers), { deep: true })

  // --- Sync ref values with map view.
  watch([lat, lng, zoom], ([lat, lng, zoom]) => {
    if (map.value) map.value.setView([lat, lng], zoom)
  })

  return { lat, lng, zoom, map }
}
