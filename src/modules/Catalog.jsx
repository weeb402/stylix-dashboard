import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Shirt, Scissors, Sparkle, Wand2, UserRound, Pencil, Trash2, MonitorUp } from 'lucide-react'
import { useStylix } from '../lib/state'
import { useToast } from '../components/overlays'
import { Drawer } from '../components/overlays'
import {
  Panel,
  Section,
  Chip,
  Button,
  Switch,
  Segmented,
  TextField,
  Slider,
  Divider,
  cx,
} from '../components/ui'
import { Portrait, Art } from '../components/visuals'
import { Dropzone } from '../components/media'

const TABS = [
  { value: 'garments', label: 'Garments', Icon: Shirt },
  { value: 'hair', label: 'Hair & Beard', Icon: Scissors },
  { value: 'jewel', label: 'Jewelry & Makeup', Icon: Sparkle },
]

const GRAD_CYCLE = ['royal', 'violet', 'rose', 'emerald', 'sky', 'gold', 'fuchsia', 'amber']

export default function Catalog() {
  const { app, actions } = useStylix()
  const toast = useToast()
  const cat = app.catalog.tab
  const items = app.catalog.items[cat]
  const [create, setCreate] = useState(false)

  const activeCount = items.filter((i) => i.active).length

  return (
    <Section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Panel className="!p-3">
          <Segmented options={TABS} value={cat} onChange={(v) => { actions.patch('catalog', { tab: v }); toast(`${TABS.find((t) => t.value === v).label} studio opened`, 'brand') }} />
        </Panel>
        <div className="flex items-center gap-3">
          <Chip tone="good" icon={MonitorUp}>
            {activeCount} active on standee
          </Chip>
          <Button icon={Plus} onClick={() => setCreate(true)}>
            Create New AI Style
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <StyleCard s={s} cat={cat} />
          </motion.div>
        ))}
      </div>

      <CreateDrawer open={create} onClose={() => setCreate(false)} />
    </Section>
  )
}

function StyleCard({ s, cat }) {
  const { actions } = useStylix()
  const toast = useToast()
  const catKey = { garments: 'garment', hair: 'hair', jewel: 'jewel' }[cat]

  return (
    <div className={cx('group overflow-hidden rounded-2xl border transition-all', s.active ? 'border-brand/40 glow-brand' : 'border-line')}>
      <div className="relative aspect-[3/4] overflow-hidden">
        <Portrait grad={s.grad} pose={s.grad.length % 3} className="absolute inset-0 h-full w-full">
          <div className="absolute inset-x-0 top-3 flex items-center justify-between px-3">
            <Chip tone="violet" icon={UserRound}>
              {s.gender}
            </Chip>
            <Chip tone={s.active ? 'good' : 'default'} icon={MonitorUp}>
              {s.active ? 'On standee' : 'Paused'}
            </Chip>
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent p-3 pt-8">
            <p className="text-[13px] font-semibold text-white">{s.name}</p>
            <p className="mt-0.5 text-[10px] italic text-white/65">“{s.prompt}”</p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-white/40">
              {catKey} · SKU-{s.id.toUpperCase()}
            </p>
          </div>
        </Portrait>
      </div>
      <div className="flex items-center justify-between border-t border-line p-2.5">
        <div>
          <p className="mb-1 text-[11px] text-mist">Active on Standee</p>
          <Switch size="sm" on={s.active} onChange={(v) => { actions.toggleCatalog(cat, s.id); toast(`${s.name} ${v ? 'activated on standee' : 'paused on standee'}`, v ? 'good' : 'brand') }} />
        </div>
        <div className="flex gap-1" onPointerDown={(e) => e.stopPropagation()}>
          <Chip icon={Pencil} onClick={() => toast(`Editing ${s.name} — style studio`, 'brand')}>
            Edit
          </Chip>
          <Chip tone="bad" icon={Trash2} onClick={() => { actions.deleteStyle(cat, s.id); toast(`${s.name} removed from catalog`, 'bad') }}>
            Delete
          </Chip>
        </div>
      </div>
    </div>
  )
}

function CreateDrawer({ open, onClose }) {
  const { app, actions } = useStylix()
  const toast = useToast()
  const cat = app.catalog.tab
  const [name, setName] = useState('')
  const [gender, setGender] = useState('Women')
  const [prompt, setPrompt] = useState('')
  const [refImg, setRefImg] = useState(null)
  const [samples, setSamples] = useState(4)
  const [busy, setBusy] = useState(false)
  const genSeq = useRef(200)

  const generate = () => {
    setBusy(true)
    setTimeout(() => {
      const seq = ++genSeq.current
      actions.addStyle(cat, {
        id: `new${seq}`,
        name: name || 'Untitled AI Style',
        gender,
        prompt: prompt || 'Keep the silhouette clean and premium',
        active: true,
        grad: GRAD_CYCLE[seq % GRAD_CYCLE.length],
      })
      setBusy(false)
      toast(`${name || 'Untitled AI Style'} generated & activated on standee`, 'good')
      onClose()
      setName('')
      setPrompt('')
    }, 1400)
  }

  const whichCat = { garments: 'Garments', hair: 'Hair & Beard', jewel: 'Jewelry & Makeup' }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Create New AI Style"
      subtitle={`New prompt · ${whichCat[cat]} catalog`}
      width="max-w-lg"
      footer={
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" icon={Wand2} className="flex-1" onClick={generate} disabled={busy}>
            {busy ? 'Generating…' : `Generate · ${samples} samples`}
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        <div>
          <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-mist">Style name</p>
          <TextField value={name} onChange={setName} placeholder="e.g. Banarasi Blazer Fusion" icon={Pencil} />
        </div>
        <div>
          <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-mist">Gender tag</p>
          <Segmented
            options={[
              { value: 'Men', label: 'Men' },
              { value: 'Women', label: 'Women' },
              { value: 'Unisex', label: 'Unisex' },
            ]}
            value={gender}
            onChange={setGender}
          />
        </div>
        <div>
          <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-mist">Style prompt</p>
          <TextField multiline value={prompt} onChange={setPrompt} placeholder="Describe the fit, silhouette and finish…" icon={Wand2} />
        </div>
        <div>
          <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-mist">Reference preview</p>
          {refImg ? (
            <div className="relative flex items-center gap-3 rounded-xl border border-line bg-ink/50 p-2">
              <Art grad={refImg.grad} grain={false} className="h-14 w-11 shrink-0 overflow-hidden rounded-lg" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-mono text-[12px] text-snow">{refImg.name}</p>
                <p className="text-[10px] text-mist">{refImg.size} · pose reference</p>
              </div>
              <Chip tone="bad" onClick={() => { setRefImg(null); toast('Reference preview cleared', 'warn') }}>
                Remove
              </Chip>
            </div>
          ) : (
            <Dropzone compact label="Upload a reference look" sub="Portrait photo preferred · defines the pose" formats={['JPG', 'PNG']} onFile={(f) => { setRefImg(f); toast('Reference loaded into generator', 'brand') }} />
          )}
        </div>
        <Divider />
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[12px] font-medium text-snow">Sample variations</p>
            <span className="font-mono text-[11px] text-[#a9baff]">×{samples}</span>
          </div>
          <Slider min={2} max={8} step={1} value={samples} onChange={setSamples} format={(v) => `${v} renders`} />
        </div>
        {busy && (
          <div className="flex items-center gap-2 rounded-xl border border-brand/40 bg-brand/10 px-4 py-3 text-[12px] text-[#a9baff]">
            <motion.span className="h-3 w-3 rounded-full border-2 border-brand/30 border-t-[#a9baff]" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }} />
            Rendering {samples} samples on the standee engine…
          </div>
        )}
      </div>
    </Drawer>
  )
}