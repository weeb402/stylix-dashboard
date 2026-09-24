import { Hand, Play, Film, Timer, CalendarClock, Repeat, Sparkles, Upload } from 'lucide-react'
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
  EmptyState,
} from '../components/ui'
import { KioskTwin, Art } from '../components/visuals'
import { Dropzone } from '../components/media'

const MODES = [
  { value: 'default', label: 'Default STYLIX Attract Loop' },
  { value: 'custom', label: 'Custom Store Video' },
]

export default function Namaste() {
  const { app, actions } = useStylix()
  const toast = useToast()
  const n = app.namaste

  return (
    <Section>
      <div className="grid grid-cols-12 gap-5">
        {/* Standee preview */}
        <div className="col-span-12 lg:col-span-6">
          <Panel pad={false} glow className="h-full">
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <div className="flex items-center gap-2">
                <Chip tone="brand" icon={Hand}>
                  ATTRACT LOOP
                </Chip>
                <p className="text-[13px] font-semibold text-snow">3D Standee Preview</p>
              </div>
              {n.customFile && <Chip tone="good" icon={Film}>{n.customFile.name}</Chip>}
            </div>
            <div className="flex items-center justify-center p-8">
              <KioskTwin mode="namaste" tilt className="w-[300px]" />
            </div>
            <div className="grid grid-cols-3 gap-px overflow-hidden rounded-b-2xl border border-line bg-line">
              {[
                { v: '1,214', l: 'Loops today', i: Repeat },
                { v: '8.4 hrs', l: 'Time on screen', i: CalendarClock },
                { v: '06s', l: 'Intro hold', i: Timer },
              ].map((s) => (
                <div key={s.l} className="flex flex-col items-center gap-1 bg-surface px-2 py-4 text-center">
                  <s.i className="h-3.5 w-3.5 text-mist" />
                  <span className="text-[15px] font-bold text-snow">{s.v}</span>
                  <span className="text-[10px] text-mist">{s.l}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Controls */}
        <div className="col-span-12 space-y-5 lg:col-span-6">
          <Panel>
            <SectionTitle icon={Play} title="Attract Loop Source" desc="What guests see while the standee is idle" />
            <div className="mt-4">
              <Segmented options={MODES} value={n.mode} onChange={(v) => { actions.patch('namaste', { mode: v }); toast(v === 'default' ? 'Default STYLIX attract loop active' : 'Custom store video mode — drop a file below', 'brand') }} className="w-full [&>*]:flex-1" />
            </div>

            <div className="mt-5">
              {renderAttractSource(n, actions, toast)}
            </div>
          </Panel>

          <Panel>
            <SectionTitle icon={Timer} title="Namaste Intro Behaviour" desc="Greeting before the attract loop" />
            <div className="mt-4 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-medium text-snow">Play Namaste intro</p>
                  <p className="text-[11px] text-mist">Shows a greeting card on approach</p>
                </div>
                <Switch on={n.showIntro} onChange={(v) => { actions.patch('namaste', { showIntro: v }); toast(`Namaste intro ${v ? 'enabled' : 'disabled'}`, 'brand') }} />
              </div>
              <div className={cx(!n.showIntro && 'pointer-events-none opacity-40')}>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[12px] font-medium text-snow">Intro hold duration</p>
                  <span className="font-mono text-[11px] text-[#a9baff]">{(n.introMs / 1000).toFixed(0)}s</span>
                </div>
                <Slider
                  min={3}
                  max={15}
                  step={1}
                  value={n.introMs / 1000}
                  onChange={(v) => actions.patch('namaste', { introMs: v * 1000 })}
                  format={(v) => `${v}s`}
                />
              </div>
              <Button variant="soft" block icon={Repeat} onClick={() => toast('Attract loop schedule saved', 'good')}>
                Save attract schedule
              </Button>
            </div>
          </Panel>
        </div>
      </div>
    </Section>
  )
}

function renderAttractSource(n, actions, toast) {
  if (n.mode === 'custom') {
    if (n.customFile) {
      return (
        <SelectedFile
          n={n}
          onClear={() => { actions.patch('namaste', { customFile: null }); toast('Custom video removed', 'warn') }}
          onPlay={() => toast('Playing store video on standee', 'brand')}
          onReplace={(f) => { actions.patch('namaste', { customFile: f }); toast('Attract video replaced', 'good') }}
        />
      )
    }
    return (
      <Dropzone
        label="Drop your store video here"
        sub="Vertical 9:16 recommended · auto-optimised for the standee"
        formats={['MP4', 'WEBM', '≤ 150MB']}
        onFile={(f) => { actions.patch('namaste', { customFile: f }); toast('Custom store video bound to attract loop', 'good') }}
      />
    )
  }
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-line bg-ink/50 p-4">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-emerald-400/25 bg-good/10 text-good">
        <Sparkles className="h-4.5 w-4.5" />
      </div>
      <div>
        <p className="text-[13px] font-semibold text-snow">Built-in STYLIX Namaste loop</p>
        <p className="mt-0.5 text-[11px] leading-snug text-mist">
          Signature attract: Namaste greeting → brand wordmark → AI try-on CTA. Zero uploads required.
        </p>
        <div className="mt-2">
          <Chip tone="brand" icon={Upload}>Ships with every standee</Chip>
        </div>
      </div>
    </div>
  )
}

function SelectedFile({ n, onClear, onPlay, onReplace }) {
  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-2xl border border-line">
        <Art grad={n.customFile?.grad || 'sky'} grain={false} className="flex h-56 items-center justify-center">
          <div className="h-14 w-14 rounded-full border border-white/25 bg-black/45 backdrop-blur-sm">
            <div className="grid h-full w-full animate-pulse-soft place-items-center">
              <Play className="ml-0.5 h-6 w-6 text-white" />
            </div>
          </div>
        </Art>
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent p-3">
          <div className="min-w-0">
            <p className="truncate font-mono text-[12px] text-white">{n.customFile?.name}</p>
            <p className="text-[10px] text-white/70">{n.customFile?.size} · 9:16 · 30fps · H.264</p>
          </div>
          <div className="flex gap-2">
            <Button variant="primary" size="sm" icon={Play} onClick={onPlay}>
              Play
            </Button>
            <Button variant="ghost" size="sm" onClick={onClear}>
              Remove
            </Button>
          </div>
        </div>
      </div>
      <EmptyState icon={Film} title="Replace video" desc="Swap the custom attract file any time — up to 150MB.">
        <Dropzone compact label="Drop a replacement" sub="" formats={['MP4', 'WebM']} onFile={onReplace} />
      </EmptyState>
    </div>
  )
}