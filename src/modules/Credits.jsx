import { motion } from 'framer-motion'
import { Wallet, Cloud, Coins, RefreshCw, ArrowDownUp, Zap, Gauge, TriangleAlert, ShieldCheck } from 'lucide-react'
import { useStylix } from '../lib/state'
import { useToast } from '../components/overlays'
import { Panel, Section, SectionTitle, Chip, Button, Switch, Slider, Divider, StatusDot, cx } from '../components/ui'

const TOTAL = 120
const MASTER_COST = 0.6
const STANDEE_COST = 1.0

export default function Credits() {
  const { app, actions } = useStylix()
  const toast = useToast()
  const standee = app.credits.standee
  const master = TOTAL - standee
  const low = standee < 15

  const setStandee = (v) => actions.patch('credits', { standee: v })

  const masterRenders = Math.floor(master / MASTER_COST)
  const standeeRenders = Math.floor(standee / STANDEE_COST)

  const quick = (n) => () => {
    const next = Math.min(TOTAL, Math.max(0, standee + n))
    setStandee(next)
    toast(`Standee rebalanced · ${next} credits`, 'good')
  }

  return (
    <Section>
      <Panel glow className="overflow-hidden">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-brand/15 blur-3xl" />
        <SectionTitle icon={Coins} title="Hardware Quota Rebalancer" desc="Shift credits between the Master Cloud Wallet and the active Standee Kiosk" right={<Chip tone="brand" icon={Gauge}>Total pool · {TOTAL} credits</Chip>} />

        {low && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex items-center gap-3 rounded-xl border border-warn/40 bg-warn/10 px-4 py-3">
            <TriangleAlert className="h-4.5 w-4.5 shrink-0 text-warn" />
            <p className="text-[12px] text-snow">
              Standee balance is critical — <span className="font-semibold text-warn">{standeeRenders} generations</span> left. Rebalance now to avoid downtime.
            </p>
          </motion.div>
        )}

        <div className="mt-8">
          {/* Pole cards + slider */}
          <div className="flex items-start gap-5">
            <Pool
              side="master"
              icon={Cloud}
              label="Master Cloud Wallet"
              credits={master}
              cost={MASTER_COST}
              renders={masterRenders}
              accent="from-[#5e7cff] to-[#1d3fdf]"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-3 py-1">
              <div className="flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-mist">
                <ArrowDownUp className="h-3.5 w-3.5" />
                Drag to rebalance
              </div>
              <Slider
                min={0}
                max={TOTAL}
                step={1}
                value={standee}
                onChange={setStandee}
                format={(v) => `${v} standee`}
              />
              <div className="flex justify-between font-mono text-[10px] text-mist/70">
                <span>0 standee</span>
                <span>{Math.round((standee / TOTAL) * 100)}% to standee</span>
                <span>{TOTAL} standee</span>
              </div>
              {/* Split bar */}
              <div className="flex h-2.5 overflow-hidden rounded-full ring-1 ring-line">
                <div className="bg-gradient-to-r from-[#5e7cff] to-[#1d3fdf] transition-all duration-300" style={{ width: `${(master / TOTAL) * 100}%` }} />
                <div className="bg-gradient-to-r from-[#34d399] to-[#10b981] transition-all duration-300" style={{ width: `${((standee) / TOTAL) * 100}%` }} />
              </div>
              <div className="mt-2 flex items-center justify-between rounded-xl border border-good/25 bg-good/6 px-4 py-3">
                <span className="text-[12px] font-medium text-mist">Est. Try-On Sessions Remaining</span>
                <span className="font-mono text-[20px] font-bold leading-none text-good">
                  ≈ {Math.floor(standeeRenders * 0.8)}
                </span>
              </div>
              <div className="mt-1.5 text-[10px] text-mist/70">
                {low ? 'Low balance — every QR share now costs 1.0 credit.' : 'Recalculates live as you drag · 80% capture-rate assumption.'}
              </div>
            </div>
            <Pool
              side="standee"
              icon={Wallet}
              label="Standee Kiosk"
              credits={standee}
              cost={STANDEE_COST}
              renders={standeeRenders}
              accent="from-[#34d399] to-[#10b981]"
            />
          </div>
        </div>

        <Divider className="my-6" />

        {/* Calculations */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Calc title="Master pool renders" value={masterRenders} sub={`at ${MASTER_COST} credit / generation`} tone="[#a9baff]" />
          <Calc title="Standee renders left" value={standeeRenders} sub={`at ${STANDEE_COST} credit / generation`} tone={low ? 'warn' : 'good'} />
          <Calc title="Est. sessions remaining" value={Math.floor(standeeRenders * 0.8)} sub="assuming 80% capture rate today" tone="good" />
        </div>

        {/* Quick actions */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-ink/50 p-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" icon={RefreshCw} onClick={() => { setStandee(TOTAL / 2); toast('Balanced 50 / 50', 'good') }}>
              Rebalance 50 / 50
            </Button>
            <Button variant="soft" size="sm" icon={Zap} onClick={quick(10)}>
              +10 to standee
            </Button>
            <Button variant="ghost" size="sm" icon={Wallet} onClick={quick(-10)}>
              -10 to standee
            </Button>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-[12px] text-mist">Auto-rebalance when low</span>
            <Switch on={app.credits.auto} onChange={(v) => { actions.patch('credits', { auto: v }); toast(`Auto-rebalance ${v ? 'armed' : 'off'}`, 'brand') }} />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-[10px] text-mist/70">
          <ShieldCheck className="h-3.5 w-3.5 text-good" />
          Every manual shift is logged to the store ledger · credit prices are per STYLIX rate card v4.2.
        </div>
      </Panel>
    </Section>
  )
}

function Pool({ side, icon: Icon, label, credits, cost, renders, accent }) {
  return (
    <motion.div
      layout
      animate={{ scale: side === 'standee' ? [1, 1.02, 1] : 1 }}
      transition={{ duration: 0.5 }}
      className={cx(
        'w-36 shrink-0 rounded-2xl border p-4 text-center transition-colors',
        side === 'standee' ? 'border-good/35 bg-good/6' : 'border-brand/35 bg-brand/8',
      )}
    >
      <div className={cx('mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-lg', accent)}>
        <Icon className="h-5 w-5" strokeWidth={1.9} />
      </div>
      <p className="mt-3 text-[11px] font-medium uppercase tracking-wider text-mist">{label}</p>
      <p className="mt-1 text-[26px] font-bold leading-none text-snow">{credits}</p>
      <p className="mt-1 font-mono text-[10px] text-mist/80">credits</p>
      <div className="mt-2 flex flex-col items-center gap-1">
        <span className={cx('rounded-full px-2 py-0.5 text-[10px] font-semibold', side === 'standee' ? 'bg-good/15 text-good' : 'bg-brand/15 text-[#a9baff]')}>
          ≈ {renders} renders
        </span>
        <span className="text-[9px] text-mist/70">{cost} cr / gen</span>
      </div>
    </motion.div>
  )
}

function Calc({ title, value, sub, tone }) {
  return (
    <div className="rounded-2xl border border-line bg-ink/50 p-4">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-medium uppercase tracking-wider text-mist">{title}</p>
        <StatusDot tone={tone === 'warn' ? 'warn' : 'good'} pulse={tone === 'warn'} />
      </div>
      <p className="mt-2 text-[24px] font-bold leading-none text-snow">{value}</p>
      <p className="mt-1.5 text-[10px] text-mist">{sub}</p>
    </div>
  )
}