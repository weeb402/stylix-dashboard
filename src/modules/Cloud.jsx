import { useRef } from 'react'
import { Cloud as CloudIcon, HardDrive, Search, Film, Image as ImageIcon, Download, RadioTower, Send, CheckCircle2, Loader2 } from 'lucide-react'
import { useStylix } from '../lib/state'
import { useToast } from '../components/overlays'
import { Panel, Section, SectionTitle, Chip, TextField, Progress, IconButton } from '../components/ui'
import { Art } from '../components/visuals'
import { Dropzone } from '../components/media'



export default function MediaCloud() {
  const { app, actions } = useStylix()
  const toast = useToast()
  const q = (app.cloudQuery || '').toLowerCase()
  const items = app.cloud.filter((a) => a.name.toLowerCase().includes(q))
  const usedPct = 41
  const seq = useRef(100)

  const sendToSlideshow = (a) => {
    actions.addSlides([
      { id: `c${++seq.current}`, name: a.name, size: a.size, dur: a.kind === 'video' ? 9 : 6, grad: a.grad, kind: a.kind === 'video' ? 'video' : 'image', tag: 'Cloud' },
    ])
    toast(`Added ${a.name} to your slideshow`, 'good')
  }

  return (
    <Section>
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-4">
          <Panel className="h-full">
            <SectionTitle icon={HardDrive} title="Cloud Storage" desc="Your store screen and owner console share this space" />
            <div className="mt-4">
              <div className="flex items-end justify-between">
                <p className="text-[26px] font-bold leading-none text-snow">
                  1.7 <span className="text-[13px] font-medium text-mist">GB</span>
                </p>
                <p className="text-[11px] text-mist">of 4.0 GB used</p>
              </div>
              <Progress value={usedPct} tone="brand" className="mt-2" />
              <div className="mt-3 flex items-center justify-between text-[11px] text-mist">
                <span>42 assets</span>
                <span>{100 - usedPct}% free</span>
              </div>
            </div>
            <div className="my-4 h-px w-full bg-line" />
            <Dropzone
              compact
              label="Upload new media"
              sub="Automatically made ready for the tall screen"
              formats={['MP4', 'WebM', 'JPG', 'PNG']}
              onFile={(f) => {
                const nid = `m${++seq.current}`
                actions.addCloudItem({ id: nid, name: f.name, kind: f.kind, size: f.size, res: f.kind === 'video' ? '4K' : '2048x2560', at: 'Just now', grad: f.grad, status: 'ready' })
                toast(`${f.name} uploaded to Media Cloud`, 'good')
              }}
            />
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-line bg-ink/50 px-3 py-2 text-[10px] text-mist">
              <RadioTower className="h-3.5 w-3.5 text-good" />
              Connected to your store screen · syncs every 8 seconds
            </div>
          </Panel>
        </div>

        <div className="col-span-12 lg:col-span-8">
          <Panel>
            <SectionTitle
              icon={CloudIcon}
              title="Your Media"
              desc="Photos and videos ready to use on any screen"
              right={
                <div className="w-64">
                  <TextField size="sm" value={app.cloudQuery} onChange={(v) => actions.set({ cloudQuery: v })} placeholder="Search assets..." icon={Search} />
                </div>
              }
            />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {items.map((a) => (
                <div key={a.id} className="flex items-center gap-3 rounded-2xl border border-line bg-ink/50 p-2.5 transition-colors hover:border-brand/40">
                  <Art grad={a.grad} grain={false} className="h-14 w-16 shrink-0 overflow-hidden rounded-xl">
                    <div className="absolute inset-0 grid place-items-center">
                      {a.kind === 'video' ? <Film className="h-4 w-4 text-white/85" /> : <ImageIcon className="h-4 w-4 text-white/80" />}
                    </div>
                  </Art>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-mono text-[12px] text-snow">{a.name}</p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[10px] text-mist">
                      <span>{a.size}</span>
                      <span className="rounded bg-raised px-1 py-px font-mono">{a.res}</span>
                      <span>{a.at}</span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      {a.status === 'processing' ? (
                        <Chip tone="warn">
                          <Loader2 className="h-3 w-3 animate-spin" /> Processing
                        </Chip>
                      ) : (
                        <Chip tone="good" icon={CheckCircle2}>Ready</Chip>
                      )}
                      <Chip tone={a.kind === 'video' ? 'violet' : 'default'}>{a.kind === 'video' ? 'VIDEO' : 'IMAGE'}</Chip>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1" onPointerDown={(e) => e.stopPropagation()}>
                    <IconButton size="sm" icon={Send} label="Add to slideshow" tone="soft" onClick={() => sendToSlideshow(a)} />
                    <IconButton size="sm" icon={Download} label="Download" onClick={() => toast(`Downloading ${a.name}`, 'brand')} />
                  </div>
                </div>
              ))}
              {items.length === 0 && <p className="col-span-2 py-8 text-center text-[12px] text-mist">No assets match "{app.cloudQuery}".</p>}
            </div>
          </Panel>
        </div>
      </div>
    </Section>
  )
}