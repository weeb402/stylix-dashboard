import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { RadioTower, Search, RotateCcw, Zap, MonitorUp, HardDrive, Gauge, MapPin, CheckCheck, Layers } from 'lucide-react'
import { FLEET } from '../lib/data'
import { useToast } from '../components/overlays'
import { Panel, Section, SectionTitle, Chip, Button, TextField, StatusDot, Progress, Divider, cx } from '../components/ui'

export default function Fleet() {
  const toast = useToast()
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('all')
  const [sel, setSel] = useState(() => new Set())
  const [booting, setBooting] = useState(() => new Set())

  const online = FLEET.filter((k) => k.online)
  const totalCredits = FLEET.reduce((a, k) => a + k.credits, 0)
  const avgPing = Math.round(online.reduce((a, k) => a + (k.ping || 0), 0) / Math.max(1, online.length))

  const list = useMemo(() => {
    const needle = q.toLowerCase()
    return FLEET.filter((k) => {
      const okQ = !needle || k.id.toLowerCase().includes(needle) || k.store.toLowerCase().includes(needle) || k.region.toLowerCase().includes(needle)
      const okF = filter === 'all' || (filter === 'online' && k.online) || (filter === 'offline' && !k.online)
      return okQ && okF
    })
  }, [q, filter])

  const toggle = (id) =>
    setSel((s) => {
      const n = new Set(s)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })

  const restart = (k) => {
    setBooting((s) => new Set(s).add(k.id))
    setTimeout(() => {
      setBooting((s) => {
        const n = new Set(s)
        n.delete(k.id)
        return n
      })
      toast(`${k.store} · ${k.id} rebooted · heartbeat restored`, 'good')
    }, 2200)
  }

  const restartSelected = () => {
    const n = sel.size
    if (!n) return toast('Select at least one kiosk to restart', 'warn')
    sel.forEach((id) => restart(FLEET.find((k) => k.id === id)))
    setSel(new Set())
    toast(`Restart dispatched to ${n} kiosks`, 'brand')
  }

  return (
    <Section>
      <Panel glow className="overflow-hidden">
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-brand/15 blur-3xl" />
        <SectionTitle icon={RadioTower} title="Fleet Heartbeat Monitor" desc="Live telemetry for every connected STYLIX kiosk" right={<Chip tone={online.length === FLEET.length ? 'good' : 'brand'}>{online.length}/{FLEET.length} online</Chip>} />

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi icon={RadioTower} label="Online kiosks" value={online.length} sub={`${FLEET.length - online.length} offline`} tone="good" />
          <Kpi icon={Gauge} label="Avg. heartbeat" value={`${avgPing}ms`} sub="fleet-wide ping" tone="brand" />
          <Kpi icon={HardDrive} label="Credits in fleet" value={totalCredits} sub="distributed balance" tone="good" />
          <Kpi icon={Layers} label="OS coverage" value="9/12" sub="on v4.2.1" tone="warn" />
        </div>

        <Divider className="my-6" />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { v: 'all', label: `All (${FLEET.length})` },
              { v: 'online', label: `Online (${online.length})` },
              { v: 'offline', label: `Offline (${FLEET.length - online.length})` },
            ].map((f) => (
              <button
                key={f.v}
                onClick={() => setFilter(f.v)}
                className={cx(
                  'cursor-pointer rounded-full border px-3 py-1.5 text-[11px] font-medium transition-all',
                  filter === f.v ? 'border-brand/50 bg-brand/15 text-snow glow-brand-strong' : 'border-line bg-raised text-mist hover:text-snow',
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-64">
              <TextField size="sm" value={q} onChange={setQ} placeholder="Search ID, store, region…" icon={Search} />
            </div>
            <Button variant="outline" size="sm" icon={RotateCcw} disabled={sel.size === 0} onClick={restartSelected}>
              Restart {sel.size > 0 ? `· ${sel.size}` : ''}
            </Button>
          </div>
        </div>

        <div className="mt-5 space-y-2.5">
          {list.map((k) => {
            const selected = sel.has(k.id)
            const isBooting = booting.has(k.id)
            return (
              <motion.div
                layout
                key={k.id}
                className={cx(
                  'flex flex-wrap items-center gap-3 rounded-2xl border p-3.5 transition-colors',
                  selected ? 'border-brand/50 bg-brand/10' : k.online ? 'border-line bg-ink/50 hover:border-brand/35' : 'border-line/70 bg-ink/30 opacity-70',
                )}
              >
                <div
                  role="checkbox"
                  aria-checked={selected}
                  tabIndex={0}
                  onClick={() => toggle(k.id)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggle(k.id)}
                  className="grid h-5 w-5 shrink-0 cursor-pointer place-items-center rounded-md border"
                >
                  {selected ? <CheckCheck className="h-3.5 w-3.5 text-white" /> : <span className="text-[8px] text-mist/60">K</span>}
                </div>

                <StatusDot tone={k.online ? 'good' : 'bad'} className="shrink-0" />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-mono text-[13px] font-semibold text-snow">{k.id}</p>
                    <Chip tone={k.online ? 'good' : 'bad'}>{k.online ? 'LIVE' : 'OFFLINE'}</Chip>
                  </div>
                  <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-mist">
                    <MapPin className="h-3 w-3 shrink-0" />
                    {k.store} · <span className="font-mono">{k.region}</span>
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[10px] text-mist/80">
                    <span className="rounded bg-raised px-1.5 py-px font-mono">{k.kiosk}</span>
                    <span className="rounded bg-raised px-1.5 py-px font-mono">{k.res}</span>
                    <span className="rounded bg-raised px-1.5 py-px">OS {k.os}</span>
                  </div>
                </div>

                <div className="hidden w-28 shrink-0 sm:block">
                  <div className="flex items-center justify-between text-[10px] text-mist">
                    <span>Storage</span>
                    <span className="font-mono">{k.storage}%</span>
                  </div>
                  <Progress value={k.storage} tone={k.storage > 85 ? 'warn' : 'brand'} className="mt-1" />
                </div>

                <div className="hidden w-24 shrink-0 md:block">
                  <p className="text-[10px] uppercase tracking-wider text-mist">Ping</p>
                  <p className="mt-0.5 font-mono text-[13px] font-semibold text-snow">{k.ping ? `${k.ping}ms` : '—'}</p>
                </div>

                <div className="hidden w-20 shrink-0 text-right md:block">
                  <p className="text-[10px] text-mist">Credits</p>
                  <p className={cx('mt-0.5 font-mono text-[13px] font-bold', k.credits < 15 ? 'text-bad' : 'text-snow')}>{k.credits}</p>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  <Button variant="outline" size="sm" icon={RotateCcw} disabled={isBooting || !k.online} onClick={() => restart(k)}>
                    {isBooting ? 'Rebooting…' : 'Restart'}
                  </Button>
                  <Button variant="soft" size="sm" icon={MonitorUp} onClick={() => toast(`Opened console for ${k.store}`, 'brand')}>
                    Console
                  </Button>
                  <Button variant="ghost" size="sm" icon={Zap} disabled={!k.online} onClick={() => toast(`Wake packet sent to ${k.id}`, 'good')}>
                    Wake
                  </Button>
                </div>
              </motion.div>
            )
          })}
          {list.length === 0 && (
            <div className="py-10 text-center text-[12px] text-mist">No kiosks match your filters.</div>
          )}
        </div>
      </Panel>
    </Section>
  )
}

function Kpi({ icon: Icon, label, value, sub, tone }) {
  return (
    <div className="rounded-2xl border border-line bg-ink/50 p-4">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-mist">{label}</p>
        <Icon className={cx('h-4 w-4', tone === 'good' ? 'text-good' : 'text-brand')} strokeWidth={1.9} />
      </div>
      <p className="mt-2 text-[24px] font-bold leading-none text-snow">{value}</p>
      <p className="mt-1.5 text-[10px] text-mist">{sub}</p>
    </div>
  )
}