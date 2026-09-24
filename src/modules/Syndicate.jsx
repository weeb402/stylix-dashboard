import { useMemo, useState } from 'react'
import { Network, Send, Rocket, CalendarClock, CheckCircle2, Share2, Layers, Globe2, CheckCheck } from 'lucide-react'
import { CAMPAIGNS, SYNDICATIONS, FLEET } from '../lib/data'
import { useToast } from '../components/overlays'
import { Panel, Section, SectionTitle, Chip, Button, Progress, Divider, cx, StatusDot } from '../components/ui'
import { Art } from '../components/visuals'

const WINDOWS = ['Now · immediate', 'Tonight · 23:30', 'Sunday · offline window']

export default function Syndicate() {
  const toast = useToast()
  const [camp, setCamp] = useState('c01')
  const [win, setWin] = useState(WINDOWS[0])
  const [selected, setSelected] = useState(() => new Set(FLEET.filter((k) => k.online).map((k) => k.id)))
  const [history, setHistory] = useState(SYNDICATIONS)
  const [pushing, setPushing] = useState(false)
  const [pushPct, setPushPct] = useState({})

  const active = CAMPAIGNS.find((c) => c.id === camp)
  const targets = FLEET.filter((k) => selected.has(k.id))
  const allOn = selected.size >= FLEET.length

  const toggleAll = () =>
    setSelected((s) => {
      if (s.size >= FLEET.length) return new Set()
      return new Set(FLEET.map((k) => k.id))
    })

  const push = () => {
    if (!targets.length) return toast('Choose at least one target kiosk', 'warn')
    setPushing(true)
    setPushPct(Object.fromEntries(targets.map((k) => [k.id, 0])))
    targets.forEach((k, i) => {
      setTimeout(() => {
        setPushPct((p) => ({ ...p, [k.id]: 100 }))
        if (i === targets.length - 1) {
          setPushing(false)
          setHistory((h) => [
            { id: `sy${Date.now()}`, campaign: active.name, targets: targets.length, done: targets.length, status: 'completed', at: 'Just now', duration: `${Math.floor((targets.length * 3) / 60)}m ${(targets.length * 3) % 60}s` },
            ...h,
          ])
          toast(`Pushed "${active.name}" to ${targets.length} kiosks`, 'good')
        }
      }, 400 + i * 220)
    })
  }

  const est = useMemo(() => targets.reduce((a, k) => (a += (k.storage / 100) * 60), 0), [targets])

  return (
    <Section>
      <Panel glow className="overflow-hidden">
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl" />
        <SectionTitle icon={Network} title="Master Syndication" desc="One campaign, pushed live to every store in the fleet" right={<Chip tone="brand" icon={Share2}>CDN · edge sync 8s</Chip>} />

        <div className="mt-6 grid gap-5 lg:grid-cols-5">
          {/* Campaign gallery */}
          <div className="lg:col-span-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-mist">Campaign pack</p>
            <div className="mt-3 space-y-2.5">
              {CAMPAIGNS.map((c) => (
                <div
                  key={c.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setCamp(c.id)}
                  onKeyDown={(e) => e.key === 'Enter' && setCamp(c.id)}
                  className={cx(
                    'flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors',
                    camp === c.id ? 'border-brand/50 bg-brand/10' : 'border-line bg-ink/50 hover:border-brand/30',
                  )}
                >
                  <Art grad={c.grad} grain={false} className="h-12 w-10 shrink-0 overflow-hidden rounded-lg">
                    <div className="absolute inset-0 grid place-items-center">
                      <Layers className="h-4 w-4 text-white/85" />
                    </div>
                  </Art>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-snow">{c.name}</p>
                    <p className="text-[10px] text-mist">{c.kind} · {c.slides} slides</p>
                  </div>
                  {camp === c.id && <CheckCheck className="h-4 w-4 shrink-0 text-brand" />}
                </div>
              ))}
            </div>
          </div>

          {/* Target fleet */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-line bg-ink/50 p-5">
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-semibold uppercase tracking-wider text-mist">Target kiosks</p>
                <div className="flex items-center gap-2">
                  <Chip tone={allOn ? 'brand' : 'default'}>{selected.size}/{FLEET.length} selected</Chip>
                  <Button variant="ghost" size="sm" icon={Globe2} onClick={toggleAll}>
                    {allOn ? 'Deselect all' : 'Select all'}
                  </Button>
                </div>
              </div>

              <div className="mt-3 max-h-56 space-y-2 overflow-y-auto pr-1">
                {FLEET.map((k) => {
                  const on = selected.has(k.id)
                  return (
                    <div
                      key={k.id}
                      role="checkbox"
                      aria-checked={on}
                      tabIndex={0}
                      onClick={() => setSelected((s) => { const n = new Set(s); if (n.has(k.id)) n.delete(k.id); else n.add(k.id); return n })}
                      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelected((s) => { const n = new Set(s); if (n.has(k.id)) n.delete(k.id); else n.add(k.id); return n })}
                      className={cx(
                        'flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 transition-colors',
                        on ? 'border-brand/40 bg-brand/10' : 'border-line/70 bg-ink/40 opacity-70 hover:opacity-100',
                        !k.online && !on && 'opacity-40',
                      )}
                    >
                      <div className={cx('grid h-4 w-4 shrink-0 place-items-center rounded border', on ? 'border-brand bg-brand' : 'border-line')}>
                        {on && <CheckCheck className="h-3 w-3 text-white" />}
                      </div>
                      <span className="w-20 shrink-0 font-mono text-[11px] text-snow">{k.id}</span>
                      <span className="min-w-0 flex-1 truncate text-[11px] text-mist">{k.store}</span>
                      <StatusDot tone={k.online ? 'good' : 'bad'} pulse={k.online} />
                    </div>
                  )
                })}
              </div>

              <Divider className="my-4" />

              <div className="flex flex-wrap items-center gap-3">
                <Chip icon={CalendarClock} tone="brand">{win}</Chip>
                <div className="flex flex-wrap gap-1.5">
                  {WINDOWS.map((w) => (
                    <button
                      key={w}
                      onClick={() => setWin(w)}
                      className={cx(
                        'cursor-pointer rounded-lg border px-2.5 py-1 text-[10px] transition-all',
                        win === w ? 'border-brand/50 bg-brand/15 text-snow' : 'border-line bg-raised text-mist hover:text-snow',
                      )}
                    >
                      {w}
                    </button>
                  ))}
                </div>
                <div className="ml-auto flex items-center gap-2 text-[11px] text-mist">
                  Est. delivery <span className="font-mono font-bold text-snow">{Math.round(est)}s</span>
                </div>
              </div>

              <Button block className="mt-4" icon={Rocket} disabled={pushing || targets.length === 0} onClick={push}>
                {pushing ? `Syncing ${targets.length} kiosks…` : targets.length ? `Push to ${targets.length} kiosks` : 'Push campaign'}
              </Button>

              {pushing && (
                <div className="mt-4 space-y-1.5">
                  {FLEET.filter((k) => pushPct[k.id] !== undefined).map((k) => (
                    <div key={k.id} className="flex items-center gap-2 text-[10px] text-mist">
                      <Send className="h-3 w-3 text-brand" />
                      <span className="w-20 truncate font-mono text-snow">{k.id}</span>
                      <Progress value={pushPct[k.id] ?? 0} className="flex-1" tone="good" />
                      <span className="w-8 text-right font-mono">{pushPct[k.id]}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <Divider className="my-6" />

        {/* History */}
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-mist">Syndication history</p>
        <div className="mt-3 space-y-2">
          {history.slice(0, 4).map((h) => (
            <div key={h.id} className="flex flex-wrap items-center gap-4 rounded-xl border border-line bg-ink/50 p-3.5">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand/12 text-brand">
                <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-snow">{h.campaign}</p>
                <p className="text-[10px] text-mist">{h.at} · {h.duration}</p>
              </div>
              <Chip tone="good">{h.done}/{h.targets} kiosks</Chip>
              <Chip tone={h.status === 'completed' ? 'brand' : 'warn'}>{h.status.toUpperCase()}</Chip>
            </div>
          ))}
        </div>
      </Panel>
    </Section>
  )
}