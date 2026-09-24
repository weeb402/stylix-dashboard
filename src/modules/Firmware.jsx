import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Cpu, CalendarClock, CheckCheck, Rocket, RefreshCw, Server, Layers, TimerReset } from 'lucide-react'
import { FW_RELEASES, FW_ROLLOUTS } from '../lib/data'
import { useToast } from '../components/overlays'
import { Panel, Section, SectionTitle, Chip, Button, StatusDot, Progress, Divider, cx } from '../components/ui'

const WINDOWS = ['Tomorrow · 02:00 – 04:00', 'Sunday · 02:00 – 06:00', 'Tonight · 23:30']

export default function Firmware() {
  const toast = useToast()
  const [rollouts, setRollouts] = useState(FW_ROLLOUTS)
  const [ver, setVer] = useState('v4.2.2-rc')
  const [window, setWindow] = useState(WINDOWS[1])
  const [phased, setPhased] = useState(true)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return
    const t = setInterval(() => {
      setRollouts((rs) =>
        rs.map((r) => (r.status === 'running' && r.done < r.target ? { ...r, done: Math.min(r.target, r.done + 1) } : r)),
      )
    }, 700)
    return () => clearInterval(t)
  }, [running])

  const schedule = () => {
    setRollouts((rs) => [
      { id: `fw${Date.now()}`, name: `${ver} update`, target: 4, done: 0, status: 'scheduled', window, note: phased ? 'Install gradually · 25% per night' : 'All screens at once' },
      ...rs,
    ])
    setRunning(true)
    toast(`Software update planned for ${window}`, 'brand')
  }

  const upgrades = rollouts.some((r) => r.status === 'running' && r.done < r.target)

  return (
    <Section>
      <Panel glow className="overflow-hidden">
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-good/10 blur-3xl" />
        <SectionTitle icon={Cpu} title="Software Updates" desc="Install new versions on your screens without bothering guests during the day" right={<Chip tone="good" icon={CheckCheck}>3 channels monitored</Chip>} />

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {/* Release cards */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-mist">Available versions</p>
            <div className="mt-3 space-y-2.5">
              {FW_RELEASES.map((f) => (
                <div key={f.name} className={cx('rounded-xl border p-3.5 transition-colors', ver === f.name ? 'border-brand/50 bg-brand/10' : 'border-line bg-ink/50')}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="grid h-8 w-8 place-items-center rounded-lg bg-raised text-brand">
                        <Server className="h-4 w-4" strokeWidth={1.9} />
                      </div>
                      <div>
                        <p className="font-mono text-[13px] font-bold text-snow">{f.name}</p>
                        <p className="text-[10px] text-mist">{f.notes}</p>
                      </div>
                    </div>
                    <Chip tone={f.channel === 'Stable' ? 'good' : f.channel === 'Release Candidate' ? 'brand' : 'violet'}>{f.channel}</Chip>
                  </div>
                  <div className="mt-2.5 flex items-center gap-3 text-[10px] text-mist/80">
                    <span>{f.size}</span>
                    <span>· published {f.published}</span>
                    <span className="ml-auto">
                      <Button variant="ghost" size="sm" icon={Rocket} onClick={() => { setVer(f.name); toast(`Picked ${f.name}`, 'brand') }}>
                        Choose
                      </Button>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scheduler */}
          <div>
            <div className="rounded-2xl border border-line bg-ink/50 p-5">
              <p className="text-[12px] font-semibold uppercase tracking-wider text-mist">Plan an update</p>

              <p className="mt-4 text-[11px] text-mist">Version</p>
              <div className="mt-1.5 flex gap-2">
                {FW_RELEASES.map((f) => (
                  <button
                    key={f.name}
                    onClick={() => setVer(f.name)}
                    className={cx(
                      'cursor-pointer rounded-lg border px-3 py-1.5 font-mono text-[12px] transition-all',
                      ver === f.name ? 'border-brand/50 bg-brand/15 text-snow' : 'border-line bg-raised text-mist hover:text-snow',
                    )}
                  >
                    {f.name}
                  </button>
                ))}
              </div>

              <p className="mt-4 text-[11px] text-mist">When to install</p>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {WINDOWS.map((w) => (
                  <button
                    key={w}
                    onClick={() => setWindow(w)}
                    className={cx(
                      'cursor-pointer rounded-lg border px-3 py-1.5 text-[11px] transition-all',
                      window === w ? 'border-brand/50 bg-brand/15 text-snow' : 'border-line bg-raised text-mist hover:text-snow',
                    )}
                  >
                    {w}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl border border-line bg-input px-4 py-3">
                <span className="flex items-center gap-2 text-[12px] text-snow">
                  <TimerReset className="h-4 w-4 text-brand" />
                  Install gradually
                </span>
                <div
                  role="switch"
                  aria-checked={phased}
                  tabIndex={0}
                  onClick={() => setPhased((p) => !p)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setPhased((p) => !p)}
                  className={cx('relative h-6 w-11 cursor-pointer rounded-full border transition-colors', phased ? 'border-brand/60 bg-brand' : 'border-line bg-ink/80')}
                >
                  <motion.div layout transition={{ type: 'spring', stiffness: 500, damping: 32 }} className={cx('h-4.5 w-4.5 rounded-full bg-white', phased ? 'ml-auto mr-0.5' : 'ml-0.5')} />
                </div>
              </div>
              <p className="mt-2 text-[10px] text-mist/80">Updates 25% of the fleet each night — we can pull back anytime, and guests are never disturbed.</p>

              <Button block className="mt-4" icon={CalendarClock} onClick={schedule}>Plan the update</Button>
            </div>
          </div>
        </div>

        <Divider className="my-6" />

        {/* Rollout list */}
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-mist">Planned updates</p>
        <div className="mt-3 space-y-2.5">
          {rollouts.map((r) => (
            <motion.div key={r.id} layout className="flex flex-wrap items-center gap-4 rounded-xl border border-line bg-ink/50 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-mono text-[13px] font-semibold text-snow">{r.name}</p>
                  <Chip tone={r.status === 'completed' ? 'good' : r.status === 'running' ? 'brand' : 'default'}>
                    {r.status === 'completed' ? 'DONE' : r.status === 'running' ? 'RUNNING' : 'SCHEDULED'}
                  </Chip>
                </div>
                <p className="mt-1 text-[11px] text-mist">{r.note} · window {r.window}</p>
              </div>
              <div className="w-40">
                <div className="flex items-center justify-between text-[10px] text-mist">
                  <span>{r.done}/{r.target} kiosks</span>
                  <span className="font-mono">{Math.round((r.done / Math.max(1, r.target)) * 100)}%</span>
                </div>
                <Progress value={(r.done / Math.max(1, r.target)) * 100} tone={r.status === 'completed' ? 'good' : r.status === 'running' ? 'brand' : 'warn'} className="mt-1" />
              </div>
              <div className="flex items-center gap-2 text-[10px] text-mist/70">
                {r.status === 'running' ? <RefreshCw className="h-3.5 w-3.5 animate-spin text-brand" /> : <StatusDot tone={r.status === 'completed' ? 'good' : 'warn'} pulse={r.status === 'running'} />}
                {r.status === 'completed' ? 'Fleet verified' : r.status === 'running' ? 'In progress' : 'Awaiting window'}
              </div>
            </motion.div>
          ))}
        </div>
        {upgrades && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-brand/30 bg-brand/8 px-4 py-2.5 text-[11px] text-mist">
            <Layers className="h-3.5 w-3.5 text-brand" />
            Live update in progress — screens that are offline will update next time they're available.
          </div>
        )}
      </Panel>
    </Section>
  )
}