import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutGrid,
  Images,
  Sparkles,
  Wallet,
  PencilLine,
  Store,
  TrendingUp,
  Play,
  Upload,
  TriangleAlert,
  MonitorPlay,
  Check,
} from 'lucide-react'
import { ACTIVITY } from '../lib/data'
import { useStylix } from '../lib/state'
import { useToast } from '../components/overlays'
import { Panel, Section, SectionTitle, cx, Chip, Button, Segmented, TextField, Progress, StatusDot } from '../components/ui'
import { KioskTwin, Sparkline, LiveClock } from '../components/visuals'
import { Dropzone } from '../components/media'

const MODES = [
  { value: 'videogrid', label: 'Video Grid' },
  { value: 'slideshow', label: 'Slideshow' },
  { value: 'namaste', label: 'Attract Loop' },
]

const KPI_SETA = [
  { id: 'mode', label: 'Active Mode', value: 'Video Grid', sub: '2 Feeds', icon: LayoutGrid, seed: 11, delta: 'On screen now', tone: 'good' },
  { id: 'deck', label: 'Slide Deck', value: 14, sub: 'Assets', icon: Images, seed: 5, delta: 'All synced', tone: 'good' },
  { id: 'ai', label: 'Photos Made · 24h', value: 17, sub: 'AI try-ons', icon: Sparkles, seed: 9, delta: '+4 today', tone: 'brand' },
  { id: 'cred', label: 'Standee Credits', value: 49, sub: 'Of 120 total', icon: Wallet, seed: 3, delta: 'Refill when low', tone: 'warn' },
]

export default function Dashboard() {
  const { app, actions } = useStylix()
  const toast = useToast()
  const biz = app.business

  return (
    <Section>
      <div className="grid grid-cols-12 gap-5">
        {/* Live Twin */}
        <div className="col-span-12 md:col-span-12 xl:col-span-4">
          <Panel pad={false} glow className="h-full">
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <div className="flex items-center gap-2">
                <StatusDot tone="good" />
                <p className="text-[13px] font-semibold text-snow">Live Digital Twin</p>
              </div>
              <Chip tone="brand" icon={MonitorPlay}>
                Guest Standee
              </Chip>
            </div>
            <div className="flex flex-col items-center gap-4 p-6">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <KioskTwin className="w-[290px]" />
              </motion.div>
              <div className="flex w-full flex-col items-center gap-3">
                <p className="font-mono text-[10px] text-mist">
                  <LiveClock /> · rendering in real time
                </p>
                <Segmented
                  value={app.orientation}
                  onChange={(v) => {
                    actions.setOrientation(v)
                    toast(v === 'landscape' ? 'Landscape TV · 1920×1080' : 'Portrait screen · 1080×1920', 'brand')
                  }}
                  options={[
                    { value: 'portrait', label: 'Portrait 1080×1920' },
                    { value: 'landscape', label: 'Landscape 1920×1080' },
                  ]}
                />
                <Segmented options={MODES} value={app.activeMode} onChange={(v) => { actions.set({ activeMode: v }); toast(`Twin switched to ${MODES.find((m) => m.value === v).label} mode`, 'brand') }} />
              </div>
            </div>
          </Panel>
        </div>

        {/* Right rail */}
        <div className="col-span-12 space-y-5 xl:col-span-8">
          {/* KPIs */}
          <div className="grid grid-cols-2 gap-4">
            {KPI_SETA.map((k, i) => (
              <motion.div
                key={k.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Panel className="overflow-hidden p-4">
                  <div className="flex items-start justify-between">
                    <div className="grid h-9 w-9 place-items-center rounded-xl border border-brand/25 bg-brand/10 text-[#a9baff]">
                      <k.icon className="h-4 w-4" strokeWidth={1.8} />
                    </div>
                    <Chip tone={k.tone} dot />
                  </div>
                  <p className="mt-3 text-[11px] font-medium uppercase tracking-wider text-mist">{k.label}</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-[26px] font-bold leading-none tracking-tight text-snow">{k.value}</span>
                    <span className="text-[11px] text-mist/80">{k.sub}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <Chip tone={k.tone} className="!px-2 !py-0.5 text-[10px]">{k.delta}</Chip>
                    <Sparkline seed={k.seed} className="h-7 w-20" />
                  </div>
                </Panel>
              </motion.div>
            ))}
          </div>

          {/* Business identity + activity */}
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12 lg:col-span-7">
              <Panel>
                <SectionTitle icon={Store} title="Business Identity" desc="Shown on every store screen · small corner logo" />
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-mist">Store Name</p>
                    <div className="flex items-center gap-2">
                      <TextField
                        value={biz.storeName}
                        onChange={(v) => actions.patch('business', { storeName: v })}
                        onEnter={() => toast('Store name updated · dewanji smart home', 'good')}
                        icon={Store}
                        className="flex-1"
                      />
                      <Button variant="soft" icon={PencilLine} onClick={() => toast('Click the text and press Enter to save', 'brand')}>
                        Edit
                      </Button>
                    </div>
                  </div>
                  <DivLine />
                  <div>
                    <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-mist">Logo (Watermark)</p>
                    <Dropzone
                      compact
                      label={biz.logo ? biz.logo.name : 'Drop your logo here'}
                      sub="PNG with no background · shown small in the corner of every screen"
                      onFile={(f) => { actions.patch('business', { logo: f }); toast('Watermark logo applied to all screens', 'good') }}
                    />
                  </div>
                  <WatermarkPreview biz={biz} toast={toast} />
                </div>
              </Panel>
            </div>

            <div className="col-span-12 lg:col-span-5">
              <Panel className="flex h-full flex-col">
                <div className="mb-3 flex items-center justify-between">
                  <SectionTitle icon={MonitorPlay} title="Live Activity" desc="What your screen is showing right now" />
                </div>
                <div className="flex-1 space-y-1">
                  <AnimatePresence initial={false}>
                    {ACTIVITY.map((a, i) => (
                      <motion.div
                        key={`${a.text}`}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-3 rounded-xl px-2 py-2 hover:bg-white/[0.03]"
                      >
                        <div className={cx('mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg border', TONE[a.tone])}>
                          <ActivityIcon icon={a.icon} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[12px] leading-snug text-snow">{a.text}</p>
                          <p className="mt-0.5 text-[10px] text-mist/60">{a.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                <div className="mt-3 border-t border-line pt-3">
                  <div className="mb-1.5 flex items-center justify-between text-[11px]">
                    <span className="text-mist">Sync health · 5 screens</span>
                    <span className="font-semibold text-good">100%</span>
                  </div>
                  <Progress value={100} tone="good" />
                </div>
              </Panel>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

function ActivityIcon({ icon }) {
  const Ic = ICONS[icon]
  return Ic ? <Ic className="h-3.5 w-3.5" strokeWidth={2} /> : null
}

const TONE = {
  good: 'border-good/25 bg-good/10 text-good',
  brand: 'border-brand/30 bg-brand/10 text-[#a9baff]',
  warn: 'border-warn/30 bg-warn/10 text-warn',
  mist: 'border-line bg-raised text-mist',
}

const ICONS = {
  sparkles: Sparkles,
  play: Play,
  upload: Upload,
  trend: TrendingUp,
  alert: TriangleAlert,
  tv: MonitorPlay,
}

function DivLine() {
  return <div className="h-px w-full bg-line" />
}

function WatermarkPreview({ biz, toast }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-line bg-ink/60 p-3">
      <div className="relative h-24 w-[43px] shrink-0 overflow-hidden rounded-lg border border-white/10" style={{ background: 'linear-gradient(165deg,#16224d,#04060f)' }}>
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_30%,rgba(29,63,223,0.4),transparent_70%)]" />
        <span className="absolute inset-x-0 top-2 text-center text-[7px] font-bold tracking-[0.3em] text-white/90">STYLIX</span>
        {biz.logo ? (
          <span className="absolute bottom-1.5 right-1 rounded-sm bg-black/60 px-1 py-0.5 text-[6px] font-bold text-white/90">{biz.logo.name.split('.').slice(-1)[0].toUpperCase()}</span>
        ) : (
          <span className="absolute bottom-1.5 right-1 text-[7px] font-semibold text-white/50">{biz.storeName.slice(0, 12)}</span>
        )}
      </div>
      <div className="flex-1">
        <p className="text-[12px] font-medium text-snow">Where the logo shows</p>
        <p className="mt-0.5 text-[11px] leading-snug text-mist">
          {biz.logo ? 'Your logo shows in the bottom-right corner of every screen.' : 'Your store name shows bottom-right until you add a logo.'}
        </p>
        <Button
          variant="soft"
          size="sm"
          icon={Check}
          className="mt-2"
          onClick={() => toast('Identity pushed to 5 screens · dewanji smart home', 'good')}
        >
          Apply to all screens
        </Button>
      </div>
    </div>
  )
}