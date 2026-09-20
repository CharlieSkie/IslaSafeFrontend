import { useState } from 'react'
import { HeartPulse, Siren } from 'lucide-react'
import './components/ui/table.css'
import { DashboardPage } from './features/dashboard/pages/DashboardPage'
import { Sidebar, type PageName } from './components/layout/Sidebar'
import { Topbar } from './components/layout/Topbar'
import { AuthPage } from './features/auth/pages/AuthPage'
import { HazardMapPage } from './features/hazard-map/pages/HazardMapPage'
import { initialSosRequests, type SosStatus } from './features/sos/data/sosRequests'
import { SosManagementPage } from './features/sos/pages/SosManagementPage'
import { EvacuationCentersPage } from './features/evacuation/pages/EvacuationCentersPage'
import { IncidentMonitoringPage } from './features/incidents/pages/IncidentMonitoringPage'
import { WeatherStationPage } from './features/weather/pages/WeatherStationPage'
import { AdvisoriesPage } from './features/advisories/pages/AdvisoriesPage'
import { ResidentsPage } from './features/residents/pages/ResidentsPage'
import { ReportsPage } from './features/reports/pages/ReportsPage'
import { SettingsPage } from './features/settings/pages/SettingsPage'

function App() {
  const [activePage, setActivePage] = useState<PageName>('Dashboard')
  const [menuOpen, setMenuOpen] = useState(false)
  const [sosAlarmActive, setSosAlarmActive] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isMapOnlyView, setIsMapOnlyView] = useState(false)
  const [sosRequests, setSosRequests] = useState(initialSosRequests)
  const [selectedSosRequestId, setSelectedSosRequestId] = useState<string | null>(null)

  const navigate = (page: PageName) => {
    setActivePage(page)
    setIsMapOnlyView(false)

    if (page !== 'SOS Management') {
      setSelectedSosRequestId(null)
    }

    if (page === 'SOS Management') {
      setSosAlarmActive(false)
    }
  }

  const openSosRequest = (id: string) => {
    navigate('SOS Management')
    setSelectedSosRequestId(id)
  }

  const updateSosStatus = (id: string, status: SosStatus) => {
    setSosRequests((current) => current.map((request) => request.id === id ? { ...request, status } : request))
  }

  const simulateIncomingSos = () => {
    setSosRequests((current) => [{
      id: `SOS-2024-${String(526 + current.length).padStart(4, '0')}`,
      name: 'New resident request',
      contact: '0917-XXX-0000',
      location: 'Purok 6, Pitogo',
      coordinates: [10.121, 124.558],
      type: 'Emergency assistance',
      category: 'Medical',
      priority: 'High',
      description: 'A newly received request is awaiting dispatch review.',
      period: 'today',
      received: 'Just now',
      status: 'Pending',
      color: 'bg-rose-500/15 text-rose-300',
      icon: HeartPulse,
    }, ...current])
    setSosAlarmActive(true)
  }

  const renderContent = () => {
    if (activePage === 'Dashboard') {
      return <DashboardPage onOpenMap={() => { setActivePage('Hazard Map'); setIsMapOnlyView(true) }} onOpenSosRequest={openSosRequest} sosRequests={sosRequests} />
    }

    if (activePage === 'Hazard Map') {
      return <HazardMapPage onMapOnlyChange={setIsMapOnlyView} />
    }

    const pages = {
      'SOS Management': <SosManagementPage onClearSelectedRequest={() => setSelectedSosRequestId(null)} onIncomingSos={simulateIncomingSos} onUpdateStatus={updateSosStatus} requests={sosRequests} selectedRequestId={selectedSosRequestId} />,
      'Evacuation Centers': <EvacuationCentersPage />,
      'Incident Monitoring': <IncidentMonitoringPage />,
      'MDRRMO Link / AWS': <WeatherStationPage />,
      Advisories: <AdvisoriesPage />,
      Residents: <ResidentsPage />,
      'Reports & Analytics': <ReportsPage />,
      Settings: <SettingsPage />,
    }

    return pages[activePage]
  }

  if (!isAuthenticated) {
    return <AuthPage onAuthenticate={() => setIsAuthenticated(true)} />
  }

  if (isMapOnlyView) {
    return <HazardMapPage mapOnly onMapOnlyChange={setIsMapOnlyView} />
  }

  return (
    <div className="relative flex min-h-screen overflow-x-clip bg-[#050810] text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden bg-[radial-gradient(ellipse_80%_60%_at_0%_0%,rgba(67,56,202,0.18),transparent_55%),radial-gradient(ellipse_65%_50%_at_100%_10%,rgba(14,116,144,0.12),transparent_56%),linear-gradient(180deg,#050810,#080d1a_45%,#050810)]" />
      <div className="pointer-events-none fixed inset-0 -z-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-size-[44px_44px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black,transparent)]" />
      <Sidebar activePage={activePage} isOpen={menuOpen} onClose={() => setMenuOpen(false)} onNavigate={navigate} />
      <main className="relative z-10 min-w-0 flex-1 pb-12">
        <Topbar onOpenMenu={() => setMenuOpen(true)} page={activePage} />
        <div className="p-4 sm:p-6 lg:p-8">{renderContent()}</div>
      </main>
      <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-white/8 bg-[#050810]/90 px-4 py-3 text-center text-[11px] text-slate-500 backdrop-blur-xl lg:left-[264px]">Developed by <span className="font-semibold text-slate-300">Four Sisters and a Wedding</span></footer>
      {sosAlarmActive && <div aria-live="assertive" className="pointer-events-none fixed inset-0 z-50 sos-alert-flash"><div className="absolute bottom-5 left-1/2 flex w-[min(92vw,440px)] -translate-x-1/2 items-center gap-3 rounded-xl border border-rose-300/50 bg-rose-950/95 px-4 py-3 text-rose-50 shadow-2xl shadow-rose-950/70"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-rose-500 text-white"><Siren className="size-5" /></span><span><strong className="block text-xs">Incoming SOS alert</strong><span className="mt-0.5 block text-[10px] text-rose-100/75">Select SOS Management in the sidebar to acknowledge.</span></span></div></div>}
    </div>
  )
}

export default App
