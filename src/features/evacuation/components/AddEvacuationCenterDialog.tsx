import { useState, type FormEvent } from 'react'
import 'leaflet/dist/leaflet.css'
import { CircleMarker, MapContainer, TileLayer, Tooltip, useMapEvents } from 'react-leaflet'
import { MapPin, Plus, X } from 'lucide-react'
import type { EvacuationCenter, MapPosition } from '../data/evacuationCenters'

function MapLocationPicker({ onPick }: { onPick: (position: MapPosition) => void }) {
  useMapEvents({ click: (event) => onPick([event.latlng.lat, event.latlng.lng]) })
  return null
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-400">{label}</span><span className="field-control">{children}</span></label>
}

export function AddEvacuationCenterDialog({ onClose, onSave }: { onClose: () => void; onSave: (center: EvacuationCenter) => void }) {
  const [name, setName] = useState('')
  const [barangay, setBarangay] = useState('Pitogo')
  const [capacity, setCapacity] = useState('100')
  const [location, setLocation] = useState<MapPosition>([10.1222, 124.5569])
  const markerLabel = name.trim() || 'New evacuation center'
  const saveCenter = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); onSave({ name: name.trim(), barangay, capacity: Number(capacity), current: 0, status: 'Operational', contact: 'Contact to be assigned', position: location }) }

  return <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/80 p-4 backdrop-blur-sm"><section aria-modal="true" aria-labelledby="add-center-title" className="w-full max-w-3xl overflow-hidden rounded-2xl border border-white/12 bg-[#0b1120] shadow-2xl shadow-black/70" role="dialog"><div className="flex items-start justify-between gap-4 border-b border-white/8 px-5 py-4"><div><h2 className="font-display text-lg font-semibold text-white" id="add-center-title">Add evacuation center</h2><p className="mt-1 text-xs text-slate-500">Enter the center details, then click the map to set its location.</p></div><button aria-label="Close add evacuation center" className="grid size-8 place-items-center rounded-lg text-slate-400 transition hover:bg-white/8 hover:text-white" onClick={onClose} type="button"><X className="size-4" /></button></div><form onSubmit={saveCenter}><div className="grid gap-5 p-5 lg:grid-cols-[280px_minmax(0,1fr)]"><div className="space-y-4"><Field label="Center name"><input autoFocus onChange={(event) => setName(event.target.value)} placeholder="e.g. Barangay Hall" required value={name} /></Field><Field label="Barangay"><select onChange={(event) => setBarangay(event.target.value)} value={barangay}><option>Pitogo</option><option>Lapinig</option><option>Baud</option><option>San Vicente</option><option>Aguining</option><option>Tugas</option></select></Field><Field label="Capacity"><input min="1" onChange={(event) => setCapacity(event.target.value)} required type="number" value={capacity} /></Field><div className="rounded-xl border border-indigo-400/15 bg-indigo-500/[0.07] p-3"><p className="flex items-center gap-2 text-xs font-semibold text-indigo-100"><MapPin className="size-4 text-indigo-300" /> Map location selected</p><p className="mt-1.5 font-mono text-[10px] text-indigo-200/70">{location[0].toFixed(5)}, {location[1].toFixed(5)}</p></div></div><div><div className="mb-2 flex items-center justify-between gap-3"><span className="text-xs font-semibold text-slate-300">Place marker</span><span className="text-[10px] text-slate-500">Click anywhere on the CPG map</span></div><div className="h-72 overflow-hidden rounded-xl border border-white/10"><MapContainer attributionControl={false} center={[10.109, 124.562]} className="islasafe-map h-full w-full" maxBounds={[[10.055, 124.495], [10.145, 124.625]]} maxBoundsViscosity={1} minZoom={13} scrollWheelZoom={false} zoom={13} zoomControl={false}><TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /><MapLocationPicker onPick={setLocation} /><CircleMarker center={location} pathOptions={{ color: '#ffffff', fillColor: '#22c55e', fillOpacity: 1, weight: 2 }} radius={9}><Tooltip direction="top" offset={[0, -8]} opacity={1} permanent>{markerLabel}</Tooltip></CircleMarker></MapContainer></div></div></div><div className="flex flex-col-reverse gap-2 border-t border-white/8 px-5 py-4 sm:flex-row sm:justify-end"><button className="action-button" onClick={onClose} type="button">Cancel</button><button className="action-button-primary" type="submit"><Plus className="size-3.5" /> Add center and marker</button></div></form></section></div>
}
