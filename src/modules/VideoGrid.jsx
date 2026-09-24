import { useState } from 'react'
import { LayoutGrid, Play, Maximize2, Volume2, Captions, MonitorPlay, Layers2, Eye, EyeOff } from 'lucide-react'
import { useStylix } from '../lib/state'
import { useToast } from '../components/overlays'
import { Modal } from '../components/overlays'
import {
  Panel,
  Section,
  SectionTitle,
  Chip,
  Button,
  Switch,
  Segmented,
  Slider,
  Select,
  TextField,
  Divider,
  StatusDot,
} from '../components/ui'
import { KioskTwin, Art, LiveClock } from '../components/visuals'

export default function VideoGrid() {
  const { app, actions } = useStylix()
  const toast = useToast()
  const [full, setFull] = useState(false)

  const layout = app.gridLayout
  const setFeed = (id, patch) =>
    actions.set((s) => ({ ...s, feeds: s.feeds.map((f) => (f.id === id ? { ...f, ...patch } : f)) }))

  const sourceOptions = app.cloud.map((a) => ({ value: a.id, label: `${a.name} · ${a.res}` }))
  const visible = app.feeds.filter((f) => f.visible)

  return (
    <Section>
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-5">
          <Panel pad={false} glow className="h-full">
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <div className="flex items-center gap-2">
                <StatusDot tone="good" />
                <p className="text-[13px] font-semibold text-snow">Grid Preview</p>
              </div>
              <Chip tone="brand" icon={LayoutGrid}>
                {visible.length} active feeds
              </Chip>
            </div>
            <div className="flex flex-col items-center gap-4 p-6">
              <KioskTwin className="w-[280px]" />
              <div className="flex w-full flex-col gap-3">
                <div className="flex items-center justify-between text-[11px] text-mist">
                  <span className="inline-flex items-center gap-1.5"><LiveClock /></span>
                  <span className="font-mono">layout · {layout === 'stack' ? '2×1 columns' : '1×2 rows'}</span>
                </div>
                <Segmented
                  options={[
                    { value: 'stack', label: 'Side-by-side' },
                    { value: 'split', label: 'Stacked' },
                  ]}
                  value={layout}
                  onChange={(v) => { actions.set({ gridLayout: v }); toast(`Grid layout · ${v === 'stack' ? 'side-by-side' : 'stacked'}`, 'brand') }}
                  className="w-full [&>*]:flex-1"
                />
                <Button variant="primary" icon={Maximize2} onClick={() => setFull(true)}>
                  Fullscreen preview
                </Button>
              </div>
            </div>
          </Panel>
        </div>

        <div className="col-span-12 space-y-5 lg:col-span-7">
          <Panel>
            <SectionTitle icon={Layers2} title="Feed Sources" desc="Map sources, captions and audio for each tile" />
            <div className="mt-4 space-y-4">
              {app.feeds.map((f, i) => (
                <div key={f.id} className="rounded-2xl border border-line bg-ink/50 p-4">
                  <div className="flex items-start gap-3">
                    <Art grad={f.grad} grain={false} className="h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                      <div className="absolute inset-0 grid place-items-center">
                        <span className="text-[9px] font-bold text-white/85">0{i + 1}</span>
                      </div>
                    </Art>
                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-semibold text-snow">{f.name}</p>
                          <p className="text-[10px] text-mist">Tile {i + 1} · {f.visible ? 'broadcasting' : 'hidden'}</p>
                        </div>
                        <Chip tone={f.visible ? 'good' : 'default'} icon={f.visible ? Eye : EyeOff}>
                          {f.visible ? 'On' : 'Off'}
                        </Chip>
                        <Switch size="sm" on={f.visible} onChange={(v) => { setFeed(f.id, { visible: v }); toast(`Feed ${i + 1} ${v ? 'shown' : 'hidden'} on standee`, v ? 'good' : 'warn') }} />
                      </div>
                      <Select value={f.source} options={sourceOptions} onChange={(v) => { setFeed(f.id, { source: v }); toast('Feed source rebound', 'brand') }} />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-mist">Caption overlay</p>
                          <TextField size="sm" value={f.caption} onChange={(v) => setFeed(f.id, { caption: v })} onEnter={() => toast('Caption pushed to feed', 'good')} icon={Captions} />
                        </div>
                        <div>
                          <div className="mb-1 flex items-center justify-between">
                            <p className="text-[11px] font-medium uppercase tracking-wider text-mist">Volume</p>
                            <span className="font-mono text-[11px] text-[#a9baff]">{f.volume}%</span>
                          </div>
                          <Slider min={0} max={100} step={1} value={f.volume} onChange={(v) => setFeed(f.id, { volume: v })} format={(v) => `${v}%`} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <SectionTitle icon={MonitorPlay} title="Playback Controls" desc="Broadcast session for Guest Standee" right={<Chip tone="good" icon={Play}>Session live · 11:04:12</Chip>} />
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                { label: 'Pause all', icon: Play, act: () => toast('All feeds paused', 'warn') },
                { label: 'Swap feeds', icon: Layers2, act: () => toast('Feed priority swapped', 'good') },
                { label: 'Re-sync A/V', icon: Volume2, act: () => toast('A/V buffers re-synced', 'brand') },
              ].map((b) => (
                <Button key={b.label} variant="outline" icon={b.icon} onClick={b.act}>
                  {b.label}
                </Button>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      <Modal open={full} onClose={() => setFull(false)} title="Fullscreen Kiosk Preview" subtitle="9:16 · what the standee renders right now" width="max-w-3xl">
        <div className="flex justify-center">
          <KioskTwin className="w-[360px]" />
        </div>
        <Divider className="my-4" />
        <div className="grid grid-cols-3 gap-3 text-center">
          {visible.map((f, i) => (
            <div key={f.id} className="rounded-xl border border-line bg-ink/50 p-3">
              <p className="text-[11px] font-semibold text-snow">FEED 0{i + 1}</p>
              <p className="mt-0.5 truncate text-[10px] text-mist">{f.name}</p>
              <p className="mt-1 font-mono text-[10px] text-[#a9baff]">{f.volume}% vol</p>
            </div>
          ))}
          {visible.length === 0 && <p className="col-span-3 text-[11px] text-mist">All feeds hidden — enable a tile above.</p>}
        </div>
      </Modal>
    </Section>
  )
}