import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Wifi, CloudUpload, ChevronDown, UserRound, MonitorPlay, ShieldCheck, Touchpad } from 'lucide-react'
import { VIEWS, NOTIFICATIONS } from '../../lib/data'
import { useStylix } from '../../lib/state'
import { LiveClock } from '../visuals'
import { Chip, Segmented, StatusDot, cx } from '../ui'
import { useToast } from '../overlays'

export function Topbar() {
  const { app, actions } = useStylix()
  const toast = useToast()
  const view = VIEWS.find((v) => v.id === app.view)
  const [bell, setBell] = useState(false)
  const bellRef = useRef(null)

  useEffect(() => {
    if (!bell) return
    const onDown = (e) => bellRef.current && !bellRef.current.contains(e.target) && setBell(false)
    window.addEventListener('pointerdown', onDown)
    return () => window.removeEventListener('pointerdown', onDown)
  }, [bell])

  return (
    <header className="relative z-30 flex h-16 shrink-0 items-center gap-4 border-b border-line bg-surface/60 px-6 backdrop-blur-xl hairline">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h1 className="truncate text-[15px] font-semibold tracking-tight text-snow">{view?.label}</h1>
          <Chip tone="good" icon={MonitorPlay} className="hidden sm:inline-flex">
            Online
          </Chip>
        </div>
        <p className="truncate text-[11px] text-mist">{view?.sub}</p>
      </div>

      <div className="hidden items-center gap-2 md:flex">
        <Chip icon={Wifi} tone="default">
          WiFi · Guest-5G
        </Chip>
        <Chip icon={CloudUpload} tone="brand">
          Sync 8s
        </Chip>
      </div>

      {/* Role switcher */}
      <div className="hidden items-center gap-2 lg:flex">
        <Segmented
          bare
          className="rounded-xl border border-line bg-ink/70"
          size="sm"
          value={app.role}
          onChange={(r) => {
            actions.setRole(r)
            toast(r === 'super' ? 'Super Admin view · all stores' : 'Store Owner view · dewanji', 'brand')
          }}
          options={[
            { value: 'owner', label: 'Owner', icon: UserRound },
            { value: 'super', label: 'Super Admin', icon: ShieldCheck },
          ]}
        />
      </div>

      {/* Touch mode */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          actions.setTouch(!app.touch)
          toast(app.touch ? 'Desktop pointer mode' : 'Touch mode · 56px targets', 'brand')
        }}
        className={cx(
          'flex cursor-pointer items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-[11px] font-medium transition-colors',
          app.touch
            ? 'border-brand/50 bg-brand/15 text-[#a9baff] glow-brand-strong'
            : 'border-line bg-raised text-mist hover:text-snow',
        )}
      >
        <Touchpad className="h-3.5 w-3.5" strokeWidth={2} />
        {app.touch ? 'Touch' : 'Pointer'}
      </div>

      <span className="font-mono text-[12px] text-mist">
        <LiveClock />
      </span>

      {/* Bell */}
      <div ref={bellRef} className="relative">
        <div
          role="button"
          tabIndex={0}
          onClick={() => setBell((b) => !b)}
          className="relative grid h-9 w-9 cursor-pointer place-items-center rounded-xl border border-line bg-raised text-mist transition-colors hover:text-snow"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-bad ring-2 ring-ink" />
        </div>
        <AnimatePresence>
          {bell && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-11 z-50 w-80 overflow-hidden rounded-2xl border border-line bg-raised/95 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-center justify-between border-b border-line px-4 py-3">
                <p className="text-[13px] font-semibold text-snow">Notifications</p>
                <Chip tone="good">3 new</Chip>
              </div>
              <div className="divide-y divide-line/60">
                {NOTIFICATIONS.map((n) => (
                  <div key={n.title} className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.03]">
                    <StatusDot tone={n.tone} pulse={false} className="mt-1.5" />
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold text-snow">{n.title}</p>
                      <p className="mt-0.5 text-[11px] leading-snug text-mist">{n.body}</p>
                      <p className="mt-1 text-[10px] text-mist/70">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div
                role="button"
                tabIndex={0}
                onClick={() => toast('All notifications marked as read', 'good')}
                className="cursor-pointer border-t border-line px-4 py-2.5 text-center text-[12px] font-medium text-[#a9baff] hover:bg-brand/10"
              >
                Mark all as read
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Owner chip */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => toast(app.role === 'super' ? 'Super Admin verified · 12 stores' : 'Owner verified · dewanji', 'brand')}
        className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-line bg-raised py-1.5 pl-1.5 pr-3 transition-colors hover:border-brand/40"
      >
        <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-[#2e54f5] to-[#0d1a6b] text-white">
          {app.role === 'super' ? <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.2} /> : <UserRound className="h-3.5 w-3.5" strokeWidth={2.2} />}
        </div>
        <div className="hidden text-left sm:block">
          <p className="text-[11px] font-semibold leading-tight text-snow">dewanji</p>
          <p className="text-[9px] leading-tight text-mist">
            {app.role === 'super' ? 'Super Admin' : 'Store Owner'}
          </p>
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-mist" />
      </div>
    </header>
  )
}
