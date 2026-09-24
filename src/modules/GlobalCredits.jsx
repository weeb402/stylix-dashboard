import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Coins, Landmark, Zap, ArrowDownUp, TriangleAlert, CheckCheck, Wallet, BadgeCheck } from 'lucide-react'
import { POOL_DISTRIBUTORS } from '../lib/data'
import { useToast } from '../components/overlays'
import { Panel, Section, SectionTitle, Chip, Button, Slider, Divider, Progress, cx, StatusDot } from '../components/ui'

const RESERVE = 40

export default function GlobalCredits() {
  const toast = useToast()
  const [amount, setAmount] = useState(25)
  const [sel, setSel] = useState(() => new Set())
  const [charging, setCharging] = useState(false)
  const [progress, setProgress] = useState({})
  const [balances, setBalances] = useState(() => Object.fromEntries(POOL_DISTRIBUTORS.map((p) => [p.id, p.balance])))

  const pool = useMemo(() => POOL_DISTRIBUTORS.reduce((a, p) => a + (balances[p.id] ?? p.balance), 0) + RESERVE, [balances])
  const low = POOL_DISTRIBUTORS.filter((p) => (balances[p.id] ?? p.balance) < 15)
  const maxPower = Math.max(...POOL_DISTRIBUTORS.map((p) => balances[p.id] ?? p.balance)) || 1

  const toggle = (id) =>
    setSel((s) => {
      const n = new Set(s)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })

  const charge = () => {
    const targets = POOL_DISTRIBUTORS.filter((p) => sel.has(p.id))
    if (!targets.length) return toast('Pick kiosks to top up first', 'warn')
    setCharging(true)
    setProgress(Object.fromEntries(targets.map((p) => [p.id, 0])))
    targets.forEach((p, i) => {
      setTimeout(() => {
        setProgress((pr) => ({ ...pr, [p.id]: 100 }))
        setBalances((b) => ({ ...b, [p.id]: (b[p.id] ?? p.balance) + amount }))
        if (i === targets.length - 1) {
          setCharging(false)
          setSel(new Set())
          toast(`${amount} credits added to ${targets.length} kiosks`, 'good')
        }
      }, 500 + i * 320)
    })
  }

  const selectLow = () => {
    setSel((s) => {
      const n = new Set(low.map((p) => p.id))
      return n.size ? n : s
    })
    if (low.length) toast(`Picked ${low.length} kiosks that are low`, 'brand')
  }

  return (
    <Section>
      <Panel glow className="overflow-hidden">
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#7c3aed]/15 blur-3xl" />
        <SectionTitle icon={Coins} title="Credit Pool" desc="Add credits to any screen across your stores" right={<Chip tone="brand" icon={Landmark}>Pool · {pool} credits</Chip>} />

        {low.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex items-center gap-3 rounded-xl border border-warn/40 bg-warn/10 px-4 py-3">
            <TriangleAlert className="h-4.5 w-4.5 shrink-0 text-warn" />
            <p className="text-[12px] text-snow">
              {low.length} kiosk{low.length > 1 ? 's' : ''} below 15 credits — <span className="font-semibold text-warn">{low.map((p) => p.id).join(', ')}</span> need a top-up.
            </p>
            <div className="ml-auto">
              <Button variant="outline" size="sm" icon={Zap} onClick={selectLow}>Pick low ones</Button>
            </div>
          </motion.div>
        )}

        <div className="mt-8 grid gap-5 lg:grid-cols-5">
          {/* Distributor */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-semibold uppercase tracking-wider text-mist">Balance per screen</p>
              <Chip icon={Wallet}>Reserve · {RESERVE}</Chip>
            </div>
            <div className="mt-3 space-y-2.5">
              {POOL_DISTRIBUTORS.map((p) => {
                const bal = balances[p.id] ?? p.balance
                const selected = sel.has(p.id)
                return (
                  <motion.div
                    layout
                    key={p.id}
                    className={cx(
                      'flex items-center gap-3 rounded-xl border px-3.5 py-3 transition-colors',
                      selected ? 'border-brand/50 bg-brand/10' : 'border-line bg-ink/50 hover:border-brand/30',
                    )}
                  >
                    <div
                      role="checkbox"
                      aria-checked={selected}
                      tabIndex={0}
                      onClick={() => toggle(p.id)}
                      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggle(p.id)}
                      className={cx('grid h-5 w-5 shrink-0 cursor-pointer place-items-center rounded-md border transition-colors', selected ? 'border-brand bg-brand' : 'border-line')}
                    >
                      {selected && <CheckCheck className="h-3.5 w-3.5 text-white" />}
                    </div>
                    <div className="w-24 shrink-0">
                      <p className="truncate font-mono text-[12px] font-semibold text-snow">{p.id}</p>
                      <p className="truncate text-[10px] text-mist">{p.store}</p>
                    </div>
                    <div className="min-w-0 flex-1">
                      <Progress value={(bal / maxPower) * 100} tone={bal < 15 ? 'bad' : bal < 30 ? 'warn' : 'good'} />
                    </div>
                    <div className="w-24 shrink-0 text-right">
                      <p className={cx('font-mono text-[15px] font-bold', bal < 15 ? 'text-bad' : 'text-snow')}>{bal}</p>
                      <p className="text-[9px] uppercase tracking-wider text-mist">credits</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Batch loader */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-line bg-ink/50 p-5">
              <p className="text-[12px] font-semibold uppercase tracking-wider text-mist">Pour credits in</p>
              <p className="mt-1 text-[11px] text-mist">Pick kiosks, set an amount, and push credits from the pool.</p>

              <div className="mt-4 rounded-xl border border-line-strong bg-input p-4">
                <div className="flex items-end justify-between">
                  <p className="text-[28px] font-bold leading-none text-snow">{amount}</p>
                  <p className="text-[11px] text-mist">credits / kiosk</p>
                </div>
                <Slider className="mt-4" min={5} max={100} step={5} value={amount} onChange={setAmount} format={(v) => `${v} credits`} ticks={[0, 50, 100]} />
              </div>

              <div className="mt-3 flex items-center gap-2 text-[11px] text-mist">
                <ArrowDownUp className="h-3.5 w-3.5" />
                Total cost: <span className="font-mono font-bold text-snow">{amount * Math.max(1, sel.size)}</span> credits for {sel.size || 0} kiosks
              </div>

              <Button block className="mt-4" icon={Zap} disabled={charging || sel.size === 0} onClick={charge}>
                {charging ? 'Adding…' : sel.size ? `Add to ${sel.size} selected` : 'Add credits'}
              </Button>

              {charging && (
                <div className="mt-4 space-y-2">
                  {POOL_DISTRIBUTORS.filter((p) => progress[p.id] !== undefined).map((p) => (
                    <div key={p.id} className="flex items-center gap-2 text-[10px] text-mist">
                      <span className="w-20 truncate font-mono text-snow">{p.id}</span>
                      <Progress value={progress[p.id] ?? 0} className="flex-1" tone="good" />
                      <span className="w-8 text-right font-mono">{progress[p.id]}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl border border-line bg-ink/50 px-4 py-3 text-[11px]">
              <span className="flex items-center gap-2 text-mist">
                <BadgeCheck className="h-4 w-4 text-brand" /> Auto top-up from credit card
              </span>
              <StatusDot tone="good" pulse={false} />
            </div>
          </div>
        </div>

        <Divider className="my-6" />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-[11px] text-mist/80">Every top-up is recorded within a second · stored in the audit log.</p>
          <Chip tone="good" icon={Coins}>Reserve {RESERVE} · 12 kiosks covered</Chip>
        </div>
      </Panel>
    </Section>
  )
}