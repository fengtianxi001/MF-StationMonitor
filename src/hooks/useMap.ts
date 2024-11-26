import * as L from 'leaflet'
import { onMounted, ref, shallowRef } from 'vue'
import { instantiateVueComponent } from '@/plugins/utils'
import { forEach } from 'lodash'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster'

export function useMap() {
  const configs: any = {
    map: {
      zoom: 11,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false,
    },
    center: [39.54, 116.23],
    url: import.meta.env.VITE_MAP_SRC,
  }
  const container = ref<HTMLElement | null>(null)
  const map = shallowRef<L.Map | null>(null)
  const tileLayer = L.tileLayer(configs.url)
  // @ts-ignore
  const bounds = L.latLngBounds()
  // @ts-ignore
  const markers = L.markerClusterGroup({
    // spiderfyOnMaxZoom: false,
    showCoverageOnHover: false,
    // zoomToBoundsOnClick: false
  })

  const boostrap = () => {
    container.value?.classList.add('map-container')
    map.value = L.map(container.value as HTMLElement, configs.map)
    map.value.setView(configs.center)
    map.value.addLayer(tileLayer)
    map.value.addLayer(markers)
  }

  const addMarkers = (params: any) => {
    forEach(
      params,
      ({ coordinate, component, props = {}, size = [40, 40] }) => {
        bounds.extend(coordinate)
        const el: any = instantiateVueComponent(component, props)
        const icon = L.divIcon({
          html: el.nodeName === '#text' ? el.nextElementSibling : el,
          iconSize: size,
          iconAnchor: [size[0] / 2, size[1] / 2],
        })
        const marker = L.marker(L.latLng(coordinate), { icon })
        markers?.addLayer(marker)
      }
    )
    map.value?.flyToBounds(bounds, {
      duration: 1.5,
      easeLinearity: 0.25,
    })
  }

  const resetViewer = () => {
    map.value?.fitBounds(bounds)
  }

  onMounted(() => {
    boostrap()
  })

  return {
    container,
    map,
    tileLayer,
    addMarkers,
    resetViewer,
  }
}
