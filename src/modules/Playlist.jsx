import { useRef, useState } from 'react'
import { AnimatePresence, Reorder, motion } from 'framer-motion'
import {
  GripVertical,
  ChevronUp,
  ChevronDown,
  Eye,
  Trash2,
  Film,
  Image as ImageIcon,
  Plus,
  SlidersHorizontal,
  Play,
  Repeat,
  Clock3,
} from 'lucide-react'
import { useStylix } from '../lib/state'
import { useToast } from '../components/overlays'
import { Modal } from '../components/overlays'
import {
  Panel,
  Section,
  SectionTitle,
  Chip,
  Button,
  IconButton,
  Switch,
  Segmented,
  Slider,
  TextField,
  Divider,
  EmptyState,
} from '../components/ui'
import { Art, KioskTwin } from '../components/visuals'
import { Dropzone } from '../components/media'

export default function Playlist() {
  const { app, actions } = useStylix()
  const toast = useToast()
  const tr = app.transition
  const [preview, setPreview] = useState(null)
  const [addOpen, setAddOpen] = useState(false)
  const [editDur, setEditDur] = useState(null)
  const seq = useRef(100)

  const fits = [
    { value: 'cover', label: 'Cover' },
    { value: 'contain', label: 'Contain' },
  ]
  const anims = [
    { value: 'crossfade', label: 'Crossfade' },
    { value: 'pan', label: 'Pan' },
    { value: 'slide', label: 'Slide' },
  ]

  const fromCloud = (asset) => {
    actions.addSlides([
      {
        id: `s${++seq.current}`,
        name: asset.name,
        size: asset.size,
        dur: asset.kind === 'video' ? 9 : 6,
        grad: asset.grad,
        kind: asset.kind === 'video' ? 'video' : 'image',
        tag: 'From Cloud',
      },
    ])
    toast(`Added ${asset.name} to playlist`, 'good')
  }

  return (
    <Section>
      <div className="grid grid-cols-12 gap-5">
        {/* Playlist builder */}
        <div className="col-span-12 lg:col-span-7">
          <Panel>
            <SectionTitle
              icon={SlidersHorizontal}
              title="Playlist Builder"
              desc="Drag to reorder · every change shows on the screen preview to the right"
              right={
                <Button variant="soft" icon={Plus} size="sm" onClick={() => setAddOpen(true)}>
                  Add Assets
                </Button>
              }
            />
            <div className="mt-4">
              {app.slides.length === 0 ? (
                <EmptyState icon={ImageIcon} title="Playlist is empty" desc="Add assets from Media Cloud or drop them in.">
                  <Button variant="primary" size="sm" icon={Plus} onClick={() => setAddOpen(true)}>
                    Add assets
                  </Button>
                </EmptyState>
              ) : (
                <Reorder.Group axis="y" values={app.slides} onReorder={actions.reorderSlides} className="space-y-2">
                  <AnimatePresence initial={false}>
                    {app.slides.map((s, i) => (
                      <Reorder.Item
                        key={s.id}
                        value={s}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.18 }}
                        onDragEnd={() => toast('New order is saved', 'good')}
                        className="group relative touch-none"
                      >
                        <div className="flex items-center gap-3 rounded-2xl border border-line bg-ink/60 p-2.5 transition-colors hover:border-brand/40 hairline">
                          <div className="flex cursor-grab flex-col items-center gap-0.5 px-1 text-mist active:cursor-grabbing">
                            <GripVertical className="h-4 w-4" />
                            <motion.span layout className="font-mono text-[9px] text-mist/70">
                              {String(i + 1).padStart(2, '0')}
                            </motion.span>
                          </div>
                          <Art grad={s.grad} grain={false} className="relative h-12 w-9 shrink-0 overflow-hidden rounded-lg">
                            <div className="absolute inset-0 grid place-items-center">
                              {s.kind === 'video' ? <Film className="h-3.5 w-3.5 text-white/80" /> : <ImageIcon className="h-3.5 w-3.5 text-white/70" />}
                            </div>
                          </Art>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-mono text-[12px] text-snow">{s.name}</p>
                            <div className="mt-0.5 flex items-center gap-2 text-[10px] text-mist">
                              <span>{s.size}</span>
                              <span className="h-0.5 w-0.5 rounded-full bg-line" />
                              <Chip tone={s.kind === 'video' ? 'violet' : 'default'} className="!px-1.5 !py-0 !text-[9px]">
                                {s.kind === 'video' ? 'VIDEO' : 'IMAGE'}
                              </Chip>
                              <span className="h-0.5 w-0.5 rounded-full bg-line" />
                              <span className="text-mist/70">{s.tag}</span>
                            </div>
                          </div>

                          {/* Duration chip (editable) */}
                          {editDur === s.id ? (
                            <div className="w-16">
                              <TextField
                                size="sm"
                                mono
                                value={String(s.dur)}
                                onEnter={() => {
                                  actions.setSlideDur(s.id, Math.max(2, Math.min(60, Number(s.dur) || 6)))
                                  setEditDur(null)
                                  toast(`Duration set to ${s.dur}s`, 'brand')
                                }}
                                onChange={(v) => actions.setSlideDur(s.id, v)}
                                className="!px-2 !min-h-8"
                                placeholder="sec"
                              />
                            </div>
                          ) : (
                            <Chip
                              icon={Clock3}
                              tone="brand"
                              onClick={() => {
                                setEditDur(s.id)
                                toast('Time per slide — seconds', 'brand')
                              }}
                            >
                              {s.dur}s
                            </Chip>
                          )}

                          <div className="flex items-center gap-0.5" onPointerDown={(e) => e.stopPropagation()}>
                            <IconButton size="sm" icon={ChevronUp} label="Move up" onClick={() => { actions.moveSlide(s.id, -1); toast(`Moved ${s.name} up`, 'good') }} />
                            <IconButton size="sm" icon={ChevronDown} label="Move down" onClick={() => { actions.moveSlide(s.id, 1); toast(`Moved ${s.name} down`, 'good') }} />
                            <IconButton size="sm" icon={Eye} label="Preview" tone="soft" onClick={() => { setPreview(s); toast(`Previewing ${s.name}`, 'brand') }} />
                            <IconButton size="sm" icon={Trash2} label="Delete" tone="danger" onClick={() => { actions.deleteSlide(s.id); toast(`${s.name} removed`, 'warn') }} />
                          </div>
                        </div>
                      </Reorder.Item>
                    ))}
                  </AnimatePresence>
                </Reorder.Group>
              )}
              <div className="mt-3 flex items-center justify-between rounded-xl border border-line bg-ink/40 px-3 py-2 text-[11px] text-mist">
                <span>{app.slides.length} assets · auto-loop {tr.loop ? 'ON' : 'OFF'}</span>
                <Chip tone="good" icon={Play}>
                  {tr.style} · {tr.duration}s transitions
                </Chip>
              </div>
            </div>
          </Panel>
        </div>

        {/* Inspector */}
        <div className="col-span-12 lg:col-span-5">
          <div className="space-y-5">
            <Panel glow>
              <SectionTitle icon={KioskTwinIcon} title="Live Preview" desc="See your changes take effect instantly" />
              <div className="mt-4 flex justify-center">
                <KioskTwin className="w-[230px]" showStand={false} />
              </div>
            </Panel>
            <Panel>
              <SectionTitle icon={SlidersHorizontal} title="How Slides Change" desc="Set the time and the style between slides" />
              <div className="mt-4 space-y-5">
                <Field label="Time between slides" value={`${tr.duration.toFixed(1)}s`}>
                  <Slider
                    min={0.5}
                    max={4}
                    step={0.1}
                    value={tr.duration}
                    onChange={(v) => actions.patch('transition', { duration: v })}
                    format={(v) => `${v.toFixed(1)}s`}
                  />
                  <div className="mt-1 flex justify-between font-mono text-[9px] text-mist/60">
                    <span>0.5s</span>
                    <span>2.25s</span>
                    <span>4.0s</span>
                  </div>
                </Field>
                <Field label="Change style">
                  <Segmented options={anims} value={tr.style} onChange={(v) => actions.patch('transition', { style: v })} className="w-full [&>*]:flex-1" />
                </Field>
                <Field label="Picture fit">
                  <Segmented options={fits} value={tr.fit} onChange={(v) => actions.patch('transition', { fit: v })} />
                </Field>
                <Divider />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-medium text-snow">Keep repeating</p>
                    <p className="text-[11px] text-mist">Replay again and again while the screen is on</p>
                  </div>
                  <Switch size="md" on={tr.loop} onChange={(v) => { actions.patch('transition', { loop: v }); toast(`Auto-loop ${v ? 'switched on' : 'switched off'}`, 'brand') }} />
                </div>
                <Button
                  variant="soft"
                  block
                  icon={Repeat}
                  onClick={() => toast('Settings saved for all 14 slides', 'good')}
                >
                  Save settings
                </Button>
              </div>
            </Panel>
          </div>
        </div>
      </div>

      {/* Preview modal */}
      <Modal
        open={!!preview}
        onClose={() => setPreview(null)}
        title="Slide Preview"
        subtitle={preview?.name}
        width="max-w-md"
        footer={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setPreview(null)}>
              Close
            </Button>
            <Button variant="primary" icon={Play} onClick={() => toast('Preview is now playing', 'good')}>
              Preview
            </Button>
          </div>
        }
      >
        {preview && (
          <div className="space-y-3">
            <div className="flex justify-center">
              <Art grad={preview.grad} grain={false} className="h-[420px] w-full rounded-xl">
                <div className="absolute inset-0 grid place-items-center">
                  {preview.kind === 'video' ? <Play className="h-10 w-10 text-white/80" /> : <ImageIcon className="h-10 w-10 text-white/70" />}
                </div>
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-3">
                  <span className="rounded bg-black/60 px-2 py-1 font-mono text-[10px] text-white/90">{preview.name}</span>
                  <span className="rounded bg-black/60 px-2 py-1 text-[10px] text-white/90">{preview.dur}s · {tr.fit}</span>
                </div>
              </Art>
            </div>
            <p className="text-center text-[11px] text-mist">Rendered with {tr.style} transition · {tr.duration.toFixed(1)}s</p>
          </div>
        )}
      </Modal>

      {/* Add assets modal */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add Items"
        subtitle="Pull from Media Cloud or drop new media"
        width="max-w-2xl"
      >
        <div className="space-y-4">
          <Dropzone
            compact
            label="Drop new media into the playlist"
            sub="MP4 · WebM · JPG · PNG — we fit it to your screen automatically"
            formats={['MP4', 'WebM', 'PNG']}
            onFile={(f) => {
                actions.addSlides([{ ...f, id: `s${++seq.current}`, dur: f.kind === 'video' ? 9 : 6, tag: 'New' }])
                toast(`Added ${f.name} to playlist`, 'good')
              }}
          />
          <div>
            <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-mist">From Media Cloud</p>
            <div className="space-y-1.5">
              {app.cloud.map((a) => (
                <div key={a.id} className="flex items-center gap-3 rounded-xl border border-line bg-ink/50 p-2 transition-colors hover:border-brand/40">
                  <Art grad={a.grad} grain={false} className="h-9 w-9 shrink-0 overflow-hidden rounded-lg">
                    <div className="absolute inset-0 grid place-items-center">
                      {a.kind === 'video' ? <Film className="h-3 w-3 text-white/80" /> : <ImageIcon className="h-3 w-3 text-white/70" />}
                    </div>
                  </Art>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-mono text-[12px] text-snow">{a.name}</p>
                    <p className="text-[10px] text-mist">{a.size} · {a.res}</p>
                  </div>
                  <IconButton size="sm" icon={Plus} label="Add to playlist" tone="soft" onClick={() => fromCloud(a)} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </Section>
  )
}

function KioskTwinIcon({ className }) {
  return <MonitorMini className={className} />
}

function MonitorMini({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="4" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="1.7" />
      <path d="M7 8h7M7 11h4" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

function Field({ label, value, children }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[12px] font-medium text-snow">{label}</p>
        {value && <span className="font-mono text-[11px] text-[#a9baff]">{value}</span>}
      </div>
      {children}
    </div>
  )
}