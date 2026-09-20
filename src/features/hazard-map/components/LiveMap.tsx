import { useEffect, useState } from 'react'
import type { LatLngBoundsExpression, LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Circle, CircleMarker, MapContainer, Polyline, TileLayer, Tooltip, ZoomControl, useMap } from 'react-leaflet'
import { Crosshair, MapPinned, Minimize2, Satellite } from 'lucide-react'
import { mapLayers, urbanHazards, type MapLayerKey, type UrbanHazard } from '../data/mapLayers'

// President Carlos P. Garcia is centred on Lapinig Island, Bohol.
// These bounds keep the map focused on the municipality instead of the wider province.
const pitogo: LatLngExpression = [10.109, 124.562]
const cpgNavigationBounds: LatLngBoundsExpression = [[10.015, 124.455], [10.175, 124.665]]
const minimumMapZoom = 11
const cpgOverviewZoom = minimumMapZoom + 1
const barangayViews: Record<string, { center: LatLngExpression; zoom: number }> = {
  'All barangays': { center: pitogo, zoom: cpgOverviewZoom },
  Pitogo: { center: [10.1222, 124.5569], zoom: 16 },
  Lapinig: { center: [10.1278, 124.5419], zoom: 16 },
  Baud: { center: [10.103, 124.58], zoom: 16 },
  'San Vicente': { center: [10.116, 124.572], zoom: 16 },
}

const basemaps = {
  map: {
    attribution: '&copy; OpenStreetMap contributors',
    label: 'Map',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  },
  satellite: {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community',
    label: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  },
} as const

type BasemapKey = keyof typeof basemaps

const barangayLabels: Array<{ name: string; position: LatLngExpression }> = [
  { name: 'Butan', position: [10.133, 124.51] }, { name: 'Gaus', position: [10.134, 124.55] },
  { name: 'Lapinig', position: [10.127, 124.53] }, { name: 'Pitogo', position: [10.122, 124.54] },
  { name: 'Tugas', position: [10.136, 124.604] }, { name: 'Lipata', position: [10.13, 124.591] },
  { name: 'Saguise', position: [10.124, 124.573] }, { name: 'Bonbonon', position: [10.121, 124.558] },
  { name: 'Campamanog', position: [10.112, 124.521] }, { name: 'San Vicente', position: [10.11, 124.536] },
  { name: 'San Jose', position: [10.114, 124.546] }, { name: 'Tugnao', position: [10.113, 124.562] },
  { name: 'Bayog', position: [10.108, 124.574] }, { name: 'Santo Rosario', position: [10.113, 124.59] },
  { name: 'Kabangkalan', position: [10.105, 124.602] }, { name: 'Canmangao', position: [10.103, 124.551] },
  { name: 'Villa Milagrosa', position: [10.098, 124.537] }, { name: 'Aguining', position: [10.097, 124.586] },
  { name: 'Bogo', position: [10.08, 124.532] }, { name: 'Basiao', position: [10.072, 124.548] },
  { name: 'Popoo', position: [10.065, 124.54] }, { name: 'Baud', position: [10.062, 124.552] },
  { name: 'Tilmobo', position: [10.113, 124.614] },
]

function MapView({ barangay }: { barangay: string }) {
  const map = useMap()
  useEffect(() => {
    const view = barangayViews[barangay] ?? barangayViews['All barangays']
    map.stop()
    map.setView(view.center, view.zoom, { animate: false })
  }, [barangay, map])
  return null
}

function MapLegend({ activeLayers, hazard, hazardColor }: { activeLayers: MapLayerKey[]; hazard: UrbanHazard; hazardColor: string }) {
  const isVisible = (layer: MapLayerKey) => activeLayers.includes(layer)
  const items = [
    { label: `${hazard} exposure`, color: hazardColor, visible: isVisible('hazards') },
    { label: 'Evacuation center', color: '#22c55e', visible: isVisible('evacuation') },
    { label: 'Active SOS', color: '#f43f5e', visible: isVisible('sos') },
    { label: 'Safe route', color: '#818cf8', visible: isVisible('routes') },
  ].filter((item) => item.visible)

  if (items.length === 0) return null

  return (
    <div className="pointer-events-none absolute bottom-[76px] right-3 z-[500] w-44 rounded-xl border border-white/10 bg-slate-950/85 p-3 shadow-xl backdrop-blur-md">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Visible on map</p>
      <div className="space-y-1.5">{items.map((item) => <p className="flex items-center gap-2 text-[10px] text-slate-200" key={item.label}><span className="size-2.5 rounded-sm" style={{ backgroundColor: item.color }} />{item.label}</p>)}</div>
    </div>
  )
}

interface LiveMapProps {
  full?: boolean
  fullScreen?: boolean
  visibleLayers?: MapLayerKey[]
  barangay?: string
  urbanHazard?: UrbanHazard
  onFeatureSelect?: (feature: string) => void
  onMinimize?: () => void
}

export function LiveMap({ full = false, fullScreen = false, visibleLayers = [], barangay = 'All barangays', urbanHazard = 'Flooding', onFeatureSelect, onMinimize }: LiveMapProps) {
  const [basemap, setBasemap] = useState<BasemapKey>('map')
  const active = (layer: MapLayerKey) => visibleLayers.includes(layer)
  const choose = (feature: string) => () => onFeatureSelect?.(feature)
  const exposure = urbanHazards.find((hazard) => hazard.key === urbanHazard) ?? urbanHazards[0]
  const selectedBasemap = basemaps[basemap]
  return (
    <div className={`relative overflow-hidden bg-[#07101d] ${fullScreen ? 'h-screen' : `rounded-xl border border-white/10 ${full ? 'h-[600px] min-h-[460px]' : 'h-[370px]'}`}`}>
      <MapContainer center={pitogo} className="islasafe-map h-full w-full" fadeAnimation={false} markerZoomAnimation={false} maxBounds={cpgNavigationBounds} maxBoundsViscosity={0.25} maxZoom={19} minZoom={minimumMapZoom} scrollWheelZoom zoom={cpgOverviewZoom} zoomAnimation={false} zoomControl={false}>
        <MapView barangay={barangay} />
        <TileLayer attribution={selectedBasemap.attribution} key={basemap} maxZoom={19} url={selectedBasemap.url} />
        <ZoomControl position="bottomright" />

        {full && active('barangays') && barangayLabels.map((barangayLabel) => <CircleMarker center={barangayLabel.position} interactive={false} key={barangayLabel.name} pathOptions={{ opacity: 0, fillOpacity: 0 }} radius={1}><Tooltip className="barangay-label" direction="center" opacity={1} permanent>{barangayLabel.name}</Tooltip></CircleMarker>)}

        {active('hazards') && <>
          <Circle center={[10.1222, 124.5569]} eventHandlers={{ click: choose(`${urbanHazard} exposure · Pitogo`) }} pathOptions={{ color: exposure.color, fillColor: exposure.color, fillOpacity: 0.18, weight: 1.5 }} radius={680}><Tooltip>{urbanHazard} exposure · Pitogo</Tooltip></Circle>
          <Circle center={[10.1278, 124.5419]} eventHandlers={{ click: choose(`${urbanHazard} exposure · Lapinig`) }} pathOptions={{ color: exposure.color, fillColor: exposure.color, fillOpacity: 0.16, weight: 1.5 }} radius={420}><Tooltip>{urbanHazard} exposure · Lapinig</Tooltip></Circle>
          <Circle center={[10.103, 124.58]} eventHandlers={{ click: choose(`${urbanHazard} exposure · Aguining`) }} pathOptions={{ color: exposure.color, fillColor: exposure.color, fillOpacity: 0.16, weight: 1.5 }} radius={350}><Tooltip>{urbanHazard} exposure · Aguining</Tooltip></Circle>
        </>}
        {active('routes') && <Polyline eventHandlers={{ click: choose('Safe response route · Pitogo to Lapinig') }} pathOptions={{ color: '#818cf8', dashArray: '7 10', weight: 4, opacity: .8 }} positions={[[10.1222, 124.5569], [10.125, 124.55], [10.1278, 124.5419]]}><Tooltip>Safe response route</Tooltip></Polyline>}
        {active('evacuation') && <>
          <CircleMarker center={[10.1222, 124.5569]} eventHandlers={{ click: choose('Pitogo Central School · Operational') }} pathOptions={{ color: '#dbeafe', fillColor: '#22c55e', fillOpacity: 1, weight: 2 }} radius={8}><Tooltip direction="top">Pitogo Central School · operational</Tooltip></CircleMarker>
          <CircleMarker center={[10.116, 124.572]} eventHandlers={{ click: choose('San Vicente Elementary · Operational') }} pathOptions={{ color: '#dbeafe', fillColor: '#22c55e', fillOpacity: 1, weight: 2 }} radius={8}><Tooltip direction="top">San Vicente Elementary · operational</Tooltip></CircleMarker>
          <CircleMarker center={[10.103, 124.58]} eventHandlers={{ click: choose('Baud Barangay Hall · Near capacity') }} pathOptions={{ color: '#fef3c7', fillColor: '#f59e0b', fillOpacity: 1, weight: 2 }} radius={8}><Tooltip direction="top">Baud Barangay Hall · near capacity</Tooltip></CircleMarker>
        </>}
        {active('sos') && <>
          <CircleMarker center={[10.118, 124.561]} eventHandlers={{ click: choose('Active SOS · Purok 2, Pitogo') }} pathOptions={{ color: '#fff1f2', fillColor: '#f43f5e', fillOpacity: 1, weight: 2 }} radius={8}><Tooltip direction="top">Active SOS · Purok 2, Pitogo</Tooltip></CircleMarker>
          <CircleMarker center={[10.126, 124.545]} eventHandlers={{ click: choose('Active SOS · Lapinig coast') }} pathOptions={{ color: '#fff1f2', fillColor: '#f43f5e', fillOpacity: 1, weight: 2 }} radius={8}><Tooltip direction="top">Active SOS · Lapinig coast</Tooltip></CircleMarker>
        </>}
        {active('edits') && <CircleMarker center={[10.108, 124.578]} eventHandlers={{ click: choose('Blocked route · assessment needed') }} pathOptions={{ color: '#fef3c7', fillColor: '#f59e0b', fillOpacity: 1, weight: 2 }} radius={7}><Tooltip direction="top">Blocked route · assessment needed</Tooltip></CircleMarker>}
      </MapContainer>

      <div aria-label="Basemap" className="absolute left-3 top-3 z-[500] inline-flex overflow-hidden rounded-lg border border-white/15 bg-slate-950/90 p-1 shadow-xl backdrop-blur-md">
        {(Object.keys(basemaps) as BasemapKey[]).map((key) => <button aria-pressed={basemap === key} className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[10px] font-bold transition ${basemap === key ? 'bg-indigo-500 text-white shadow-sm' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`} key={key} onClick={() => setBasemap(key)} type="button">{key === 'satellite' && <Satellite className="size-3" />}{basemaps[key].label}</button>)}
      </div>
      {!full && visibleLayers.length > 0 && <div className="pointer-events-none absolute left-3 top-14 z-[500] rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2.5 shadow-xl backdrop-blur-md"><p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Map layers</p><div className="space-y-1 text-[10px] text-slate-300">{mapLayers.filter((layer) => active(layer.key)).map((layer) => <p className="flex items-center gap-2" key={layer.key}><span className="size-2 rounded-sm" style={{ backgroundColor: layer.color }} /> {layer.label}</p>)}</div></div>}
      {full && <MapLegend activeLayers={visibleLayers} hazard={urbanHazard} hazardColor={exposure.color} />}
      {fullScreen && onMinimize && <button className="absolute left-3 top-14 z-[500] inline-flex items-center gap-2 rounded-lg border border-white/15 bg-slate-950/90 px-3 py-2 text-xs font-semibold text-slate-100 shadow-xl backdrop-blur-md transition hover:bg-white/10" onClick={onMinimize} type="button"><Minimize2 className="size-3.5" /> Minimize</button>}
      <div className="pointer-events-none absolute right-3 top-3 z-[500] flex items-center gap-2 rounded-lg border border-emerald-400/20 bg-slate-950/80 px-2.5 py-2 font-mono text-[10px] text-emerald-300 shadow-xl backdrop-blur-md"><span className="relative size-2 rounded-full bg-emerald-400 before:absolute before:-inset-1 before:animate-ping before:rounded-full before:bg-emerald-400/60" />LIVE DATA</div>
      <div className="pointer-events-none absolute bottom-4 left-4 z-[500] flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2.5 text-xs text-slate-300 shadow-xl backdrop-blur-md">{full ? <MapPinned className="size-4 text-indigo-300" /> : <Crosshair className="size-4 text-indigo-300" />}{full ? 'CPG island · 23 barangays monitored' : 'CPG island overview'}</div>
    </div>
  )
}
