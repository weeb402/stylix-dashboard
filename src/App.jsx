import { motion, AnimatePresence } from 'framer-motion'
import { useStylix, StylixProvider } from './lib/state'
import { ToastProvider } from './components/overlays'
import { Sidebar } from './components/layout/Sidebar'
import { Topbar } from './components/layout/Topbar'
import Dashboard from './modules/Dashboard'
import Playlist from './modules/Playlist'
import VideoGrid from './modules/VideoGrid'
import Ticker from './modules/Ticker'
import Cloud from './modules/Cloud'
import Namaste from './modules/Namaste'
import Vault from './modules/Vault'
import Credits from './modules/Credits'
import Catalog from './modules/Catalog'
import Fleet from './modules/Fleet'
import GlobalCredits from './modules/GlobalCredits'
import Firmware from './modules/Firmware'
import Syndicate from './modules/Syndicate'

const ROUTES = {
  dashboard: Dashboard,
  playlist: Playlist,
  videogrid: VideoGrid,
  ticker: Ticker,
  cloud: Cloud,
  namaste: Namaste,
  vault: Vault,
  credits: Credits,
  catalog: Catalog,
  fleet: Fleet,
  globalcredits: GlobalCredits,
  firmware: Firmware,
  syndicate: Syndicate,
}

const SUPER_ONLY = { fleet: 1, globalcredits: 1, firmware: 1, syndicate: 1 }

function Shell() {
  const { app } = useStylix()
  const guarded = app.role === 'owner' && SUPER_ONLY[app.view]
  const View = ROUTES[guarded ? 'dashboard' : app.view] || Dashboard

  return (
    <div className="relative flex h-full overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-ink" />
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-brand/12 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#7c3aed]/10 blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(90%_60%_at_50%_-10%,rgba(29,63,223,0.08),transparent_60%)]" />
      </div>

      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="min-h-0 flex-1 overflow-y-auto p-5 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={app.view}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <View />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <StylixProvider>
        <Shell />
      </StylixProvider>
    </ToastProvider>
  )
}