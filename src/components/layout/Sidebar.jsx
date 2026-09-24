import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Images,
  LayoutGrid,
  Captions,
  Cloud,
  Hand,
  Sparkles,
  Wallet,
  Shirt,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
  RadioTower,
  Coins,
  Cpu,
  Network,
} from 'lucide-react'
import { VIEWS, SUPER_VIEWS, FLEET } from '../../lib/data'
import { useStylix } from '../../lib/state'
import { useToast } from '../overlays'
import { cx, StatusDot } from '../ui'

export function Sidebar() {
  const { app, actions } = useStylix()
  const toast = useToast()
  const open = app.sidebarOpen
  const superRole = app.role === 'super'
  const storeViews = VIEWS.filter((v) => v.scope !== 'super')
  const counts = {
    playlist: app.slides.length,
    videogrid: app.feeds.filter((f) => f.visible).length,
    ticker: app.ticker.enabled ? 1 : 0,
    cloud: app.cloud.length,
    vault: 17,
    credits: app.credits.standee,
    fleet: FLEET.filter((f) => f.online).length,
    globalcredits: app.credits.master,
    firmware: 3,
    syndicate: 12,
  }
  const icons = {
    dashboard: LayoutDashboard,
    playlist: Images,
    videogrid: LayoutGrid,
    ticker: Captions,
    cloud: Cloud,
    namaste: Hand,
    vault: Sparkles,
    credits: Wallet,
    catalog: Shirt,
    fleet: RadioTower,
    globalcredits: Coins,
    firmware: Cpu,
    syndicate: Network,
  }

  const NavItem = ({ v }) => {
    const Icon = icons[v.id]
    const active = app.view === v.id
    const n = counts[v.id]
    return (
      <div
        key={v.id}
        role="link"
        tabIndex={0}
        title={open ? undefined : v.label}
        onClick={() => {
          actions.setView(v.id)
          toast(`${v.label} opened`, 'brand')
        }}
        onKeyDown={(e) => e.key === 'Enter' && actions.setView(v.id)}
        className={cx(
          'relative flex cursor-pointer items-center gap-3 rounded-xl px-3 outline-none transition-colors',
          open ? 'py-2.5' : 'h-11 justify-center',
          active ? 'text-snow' : 'text-mist hover:text-snow',
        )}
      >
        {active && (
          <motion.div
            layoutId="navpill"
            className="absolute inset-0 rounded-xl border border-brand/35 bg-brand/15 glow-brand"
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
          />
        )}
        <Icon className="relative z-10 h-[18px] w-[18px] shrink-0" strokeWidth={active ? 2.1 : 1.8} />
        {open && (
          <>
            <span className="relative z-10 flex-1 truncate text-[13px] font-medium">{v.label}</span>
            {n > 0 && (
              <span
                className={cx(
                  'relative z-10 rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none',
                  active ? 'bg-brand text-white' : 'bg-white/8 text-mist',
                )}
              >
                {n}
              </span>
            )}
          </>
        )}
      </div>
    )
  }

  return (
    <aside
      className={cx(
        'relative z-40 flex h-full shrink-0 flex-col border-r border-line bg-surface/70 backdrop-blur-xl transition-[width] duration-300 hairline',
        open ? 'w-[240px]' : 'w-[76px]',
      )}
    >
      {/* Brand */}
      <div className={cx('flex items-center gap-3 border-b border-line px-4', open ? 'h-16' : 'h-16 justify-center')}>
        <div className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#2e54f5] to-[#0d1a6b] shadow-[0_10px_30px_-8px_rgba(29,63,223,0.85)] ring-1 ring-white/20">
          <Sparkles className="h-5 w-5 text-white" strokeWidth={2.2} />
          <div className="absolute inset-0 rounded-xl bg-[radial-gradient(70%_60%_at_30%_20%,rgba(255,255,255,0.35),transparent_60%)]" />
        </div>
        {open && (
          <div className="min-w-0">
            <p className="text-[17px] font-extrabold leading-tight tracking-[0.22em] text-snow">
              STYLIX
            </p>
            <p className="text-[9px] font-semibold uppercase tracking-[0.26em] text-mist">Store Console</p>
          </div>
        )}
      </div>

      {/* Connected TV */}
      <div className={cx('border-b border-line p-3', !open && 'px-2')}>
        {open ? (
          <div className="flex items-center gap-2.5 rounded-xl border border-line bg-brand/8 p-3">
            <StatusDot tone="good" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold text-snow">Store Demo</p>
              <p className="font-mono text-[10px] text-mist">ID: 43C105B2</p>
            </div>
            <span className="rounded-md bg-good/15 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-good">
              LIVE
            </span>
          </div>
        ) : (
          <div className="grid place-items-center">
            <StatusDot tone="good" />
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {storeViews.map((v) => (
          <NavItem key={v.id} v={v} />
        ))}

        {superRole && (
          <>
            {open && (
              <div className="flex items-center gap-2 px-3 pb-1 pt-5">
                <span className="flex-1 text-[10px] font-bold uppercase tracking-[0.2em] text-mist/70">
                  Global Fleet
                </span>
                <span className="rounded-md bg-brand/15 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-[#a9baff]">
                  {FLEET.length} KIOSKS
                </span>
              </div>
            )}
            {SUPER_VIEWS.map((v) => (
              <NavItem key={v.id} v={v} />
            ))}
          </>
        )}
      </nav>

      {/* Footer */}
      <div className={cx('border-t border-line p-3', !open && 'px-2')}>
        <div
          className={cx(
            'flex items-center gap-2.5 rounded-xl border border-line bg-ink/60 p-3',
            !open && 'justify-center',
          )}
        >
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-good/12 text-good">
            <ShieldCheck className="h-4 w-4" strokeWidth={2} />
          </div>
          {open && (
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-snow">Token Authenticated</p>
              <p className="truncate font-mono text-[9px] text-mist">auth.stylix.local · v4.2.1</p>
            </div>
          )}
        </div>
        <div
          role="button"
          tabIndex={0}
          onClick={() => toast('Signed out (demo session ended)', 'warn')}
          className={cx(
            'mt-2 flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-[12px] font-medium text-mist transition-colors hover:bg-bad/10 hover:text-bad',
            !open && 'justify-center',
          )}
        >
          <LogOut className="h-4 w-4" />
          {open && 'Logout'}
        </div>
      </div>

      {/* Collapse */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => actions.toggleSidebar()}
        className="absolute -right-3 top-20 z-10 grid h-7 w-7 cursor-pointer place-items-center rounded-full border border-line bg-raised text-mist shadow-lg transition-colors hover:text-snow"
      >
        {open ? <PanelLeftClose className="h-3.5 w-3.5" /> : <PanelLeftOpen className="h-3.5 w-3.5" />}
      </div>
    </aside>
  )
}