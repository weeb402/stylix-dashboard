import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Captions, Zap, Megaphone, History, ClipboardPaste } from 'lucide-react'
import { TICKER_PRESETS, SWATCHES, FONT_SIZES } from '../lib/data'
import { useStylix } from '../lib/state'
import { useToast } from '../components/overlays'
import {
  Panel,
  Section,
  SectionTitle,
  cx,
  Chip,
  Button,
  Switch,
  Segmented,
  Slider,
  TextField,
  Divider,
  StatusDot,
} from '../components/ui'
import { TickerBar, KioskTwin } from '../components/visuals'

export default function Ticker() {
  const { app, actions } = useStylix()
  const toast = useToast()
  const t = app.ticker
  const [history, setHistory] = useState([{ text: TICKER_PRESETS[0], at: 'Broadcast #12 · 10:14 AM' }])
  const [pending, setPending] = useState('')

  const broadcast = () => {
    const txt = pending || t.text
    setHistory((h) => [{ text: txt, at: `Broadcast #${h.length + 12} · just now` }, ...h])
    actions.patch('ticker', { text: txt })
    setPending('')
    toast('Your message is now on screen', 'good')
  }

  return (
    <Section>
      <div className="grid grid-cols-12 gap-5">
        {/* WYSIWYG */}
        <div className="col-span-12 lg:col-span-7">
          <Panel glow>
            <SectionTitle
              icon={Captions}
              title="Live Ticker Simulator"
              desc="See exactly what will show on your screen"
              right={<Chip tone={t.enabled ? 'good' : 'bad'}>{t.enabled ? 'On air' : 'Paused'}</Chip>}
            />
            <div className="mt-4 flex flex-col items-center gap-5">
              <KioskTwin className="w-[250px]" />
              <div className="w-full overflow-hidden rounded-2xl border border-line bg-ink/80">
                <TickerBar cfg={t} className="h-10" />
                <div className="mt-2" />
              </div>
            </div>

            <Divider className="my-5" />
            <Controls />
          </Panel>
        </div>

        {/* Presets & history */}
        <div className="col-span-12 space-y-5 lg:col-span-5">
          <Panel>
            <SectionTitle icon={ClipboardPaste} title="Ready-Made Messages" desc="Tap one to add it to your ticker" />
            <div className="mt-3 flex flex-wrap gap-2">
              {TICKER_PRESETS.map((p) => (
                <Chip
                  key={p}
                  tone={t.text === p ? 'brand' : 'default'}
                  onClick={() => {
                    actions.patch('ticker', { text: p })
                    toast('Message added to your ticker', 'brand')
                  }}
                >
                  {p}
                </Chip>
              ))}
            </div>
            <div className="mt-4">
              <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-mist">Your own message</p>
              <TextField
                value={pending}
                onChange={setPending}
                placeholder="Type your message here…"
                icon={Megaphone}
              />
              <Button variant="primary" icon={Zap} block className="mt-3" onClick={broadcast}>
                Show on screen
              </Button>
            </div>
          </Panel>

          <Panel className="flex h-full flex-col">
            <SectionTitle icon={History} title="Broadcast History" desc="Messages you have sent before" />
            <div className="mt-3 space-y-2">
              <AnimatePresence initial={false}>
                {history.map((h, i) => (
                  <motion.div
                    key={`${h.text}-${i}`}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="flex items-start gap-2.5 rounded-xl border border-line bg-ink/50 p-3"
                  >
                    <StatusDot tone={i === 0 ? 'good' : 'mist'} pulse={i === 0} className="mt-1" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] text-snow">{h.text}</p>
                      <p className="mt-0.5 font-mono text-[10px] text-mist">{h.at}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </Panel>
        </div>
      </div>
    </Section>
  )
}

function Controls() {
  const { app, actions } = useStylix()
  const toast = useToast()
  const t = app.ticker

  const set = (patch, msg) => {
    actions.patch('ticker', patch)
    if (msg) toast(msg, 'brand')
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-xl border border-line bg-ink/40 px-3 py-2.5">
          <div>
            <p className="text-[13px] font-medium text-snow">Broadcast bar</p>
            <p className="text-[11px] text-mist">Show on all screens</p>
          </div>
          <Switch on={t.enabled} onChange={(v) => set({ enabled: v }, `Ticker ${v ? 'switched on' : 'switched off'}`)} />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[12px] font-medium text-snow">Speed</p>
            <span className="font-mono text-[11px] text-[#a9baff]">{t.speed.toFixed(1)}×</span>
          </div>
          <Slider
            min={0.5}
            max={3}
            step={0.1}
            value={t.speed}
            onChange={(v) => set({ speed: v })}
            format={(v) => `${v.toFixed(1)}×`}
          />
        </div>

        <div>
          <p className="mb-2 text-[12px] font-medium text-snow">Font size</p>
          <Segmented options={FONT_SIZES} value={t.fontSize} onChange={(v) => set({ fontSize: v }, `Text size changed to ${v.toUpperCase()}`)} />
        </div>
      </div>

      <div className="space-y-4">
        <ColorField
          label="Text colour"
          value={t.textColor}
          onChange={(v) => set({ textColor: v })}
        />
        <ColorField
          label="Background colour"
          value={t.bg}
          onChange={(v) => set({ bg: v })}
        />
        <div className="rounded-xl border border-line bg-ink/40 p-3">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-mist">Contrast preview</p>
          <div className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: t.bg }}>
            <span className="text-[12px] font-bold" style={{ color: t.textColor }}>STYLIX</span>
            <span className="font-mono text-[9px]" style={{ color: t.textColor }}>
              {(t.textColor === t.bg ? 'low' : '#F8FAFC' === t.textColor ? 'high' : 'AA').toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ColorField({ label, value, onChange }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[12px] font-medium text-snow">{label}</p>
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-md border border-white/20" style={{ background: value }} />
          <TextField size="sm" mono value={value} onChange={onChange} className="!min-h-8 w-20 !px-2" />
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {SWATCHES.map((c) => (
          <div
            key={c}
            role="button"
            tabIndex={0}
            onClick={() => onChange(c)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onChange(c)}
            className={cx(
              'h-6 w-6 cursor-pointer rounded-lg border transition-transform hover:scale-110',
              value === c ? 'border-white ring-2 ring-brand/60' : 'border-white/15',
            )}
            style={{ background: c }}
          />
        ))}
      </div>
    </div>
  )
}