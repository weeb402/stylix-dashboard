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
    toast(`Credits moved · screen now has ${next}`, 'good')
  }

  return (
    <Section>
      <Panel glow className="overflow-hidden">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-brand/15 blur-3xl" />
        <SectionTitle icon={Coins} title="Credit Allocator" desc="Move credits between your master pool and the store screen" right={<Chip tone="brand" icon={Gauge}>Total pool · {TOTAL} credits</Chip>} />

        {low && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex items-center gap-3 rounded-xl border border-warn/40 bg-warn/10 px-4 py-3">
            <TriangleAlert className="h-4.5 w-4.5 shrink-0 text-warn" />
            <p className="text-[12px] text-snow">
              Your store screen is low on credits — about <span className="font-semibold text-warn">{standeeRenders} try-ons</span> left. Move credits now so it keeps working.
            </p>
          </motion.div>
        )}

        <div className="mt-8">
          {/* Pole cards + slider */}
          <div className="flex items-start gap-5">
            <Pool
              side="master"
              icon={Cloud}
              label="Master Pool"
              credits={master}
              cost={MASTER_COST}
              renders={masterRenders}
              accent="from-[#5e7cff] to-[#1d3fdf]"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-3 py-1">
              <div className="flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-mist">
                <ArrowDownUp className="h-3.5 w-3.5" />
                Drag to move credits
              </div>
              <Slider
                min={0}
                max={TOTAL}
                step={1}
                value={standee}
                onChange={setStandee}
                format={(v) => `${v} to screen`}
              />
              <div className="flex justify-between font-mono text-[10px] text-mist/70">
                <span>0 to screen</span>
                <span>{Math.round((standee / TOTAL) * 100)}% to screen</span>
                <span>{TOTAL} to screen</span>
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
                {low ? 'Low credits — every photo sent to a customer costs 1.0 credit.' : 'Recalculates as you drag · some people take the photo and walk away.'}
              </div>
            </div>
            <Pool
              side="standee"
              icon={Wallet}
              label="Store Screen"
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
          <Calc title="Master pool uses" value={masterRenders} sub={`at ${MASTER_COST} credit / use`} tone="[#a9baff]" />
          <Calc title="Try-ons left on screen" value={standeeRenders} sub={`at ${STANDEE_COST} credit / use`} tone={low ? 'warn' : 'good'} />
          <Calc title="Est. happy sessions left" value={Math.floor(standeeRenders * 0.8)} sub="guessing 8 in 10 get shared" tone="good" />
        </div>

        {/* Quick actions */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-ink/50 p-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" icon={RefreshCw} onClick={() => { setStandee(TOTAL / 2); toast('Split evenly between both', 'good') }}>
              Even split 50 / 50
            </Button>
            <Button variant="soft" size="sm" icon={Zap} onClick={quick(10)}>
              +10 to screen
            </Button>
            <Button variant="ghost" size="sm" icon={Wallet} onClick={quick(-10)}>
              -10 to screen
            </Button>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-[12px] text-mist">Move credits automatically when low</span>
            <Switch on={app.credits.auto} onChange={(v) => { actions.patch('credits', { auto: v }); toast(`Auto top-up ${v ? 'on' : 'off'}`, 'brand') }} />
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
          ≈ {renders} uses
        </span>
        <span className="text-[9px] text-mist/70">{cost} cr / use</span>
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