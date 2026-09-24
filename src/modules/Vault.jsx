import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Download, QrCode, Send, Clock3, Timer, Shirt, Scissors, Sparkle, Camera, UserRound } from 'lucide-react'
import { GENERATIONS } from '../lib/data'
import { useStylix } from '../lib/state'
import { useToast } from '../components/overlays'
import { Modal } from '../components/overlays'
import { Panel, Section, Chip, Button, Segmented, StatusDot, Divider } from '../components/ui'
import { Portrait, CountRing, CountdownFrac, remainLabel, QRSheet } from '../components/visuals'

const CATS = [
  { value: 'all', label: 'All', Icon: Camera },
  { value: 'cloth', label: 'AI Cloth', Icon: Shirt },
  { value: 'haircut', label: 'AI Haircut', Icon: Scissors },
  { value: 'makeup', label: 'AI Makeup', Icon: Sparkle },
]

const CAT_LABEL = { cloth: 'AI Cloth', haircut: 'AI Haircut', makeup: 'AI Makeup' }

export default function Vault() {
  const { app, actions } = useStylix()
  const toast = useToast()
  const tab = app.vaultTab
  const items = GENERATIONS.filter((g) => tab === 'all' || g.cat === tab)
  const [qr, setQr] = useState(null)

  const stats = app.vaultTab === 'all' ? '17 photos · rolling 24 hours' : `${items.length} photos · ${CAT_LABEL[tab]}`

  return (
    <Section>
      <Panel className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl border border-brand/25 bg-brand/10 text-[#a9baff]">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-snow">AI Try-On Vault</p>
              <p className="text-[11px] text-mist">{stats} · kept for 24 hours, then removed</p>
            </div>
          </div>
          <div className="overflow-x-auto no-scrollbar">
            <Segmented options={CATS} value={tab} onChange={(v) => { actions.set({ vaultTab: v }); toast(`${CAT_LABEL[v] || 'All'} photos`, 'brand') }} />
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((g, i) => (
          <motion.div key={g.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <VaultCard g={g} onQR={() => setQr(g)} />
          </motion.div>
        ))}
      </div>

      <QRModal gen={qr} onClose={() => setQr(null)} toast={toast} />
    </Section>
  )
}

function VaultCard({ g, onQR }) {
  const toast = useToast()
  const { frac, remain } = CountdownFrac(g.at)
  const needs = new Date(g.at).toLocaleString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
  const dayLabel = new Date(g.at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onQR}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onQR()}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-line bg-surface/80 backdrop-blur-xl transition-all outline-none hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-[0_18px_50px_-24px_rgba(29,63,223,0.55)] hairline"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Portrait grad={g.grad} pose={g.at % 4} className="absolute inset-0 h-full w-full">
          <div className="absolute inset-x-0 top-3 flex items-start justify-between px-3">
            <div className="flex flex-col gap-1.5">
              <Chip tone="brand" icon={Shirt}>
                {CAT_LABEL[g.cat]}
              </Chip>
              <Chip tone="violet" icon={UserRound}>
                {g.gender}
              </Chip>
            </div>
            <CountRing frac={frac} size={44} stroke={3.5}>
              <span className="text-[8px] font-bold leading-none" style={{ color: frac > 0.5 ? '#5ee8b8' : frac > 0.22 ? '#ffd489' : '#ff9b9b' }}>
                {remainLabel(remain)}
              </span>
            </CountRing>
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 pt-10">
            <p className="text-[13px] font-semibold text-white">{g.title}</p>
            <p className="mt-0.5 truncate text-[10px] italic text-white/60">“{g.prompt}”</p>
          </div>
        </Portrait>
      </div>
      <div className="space-y-3 p-3">
        <div className="flex items-center justify-between text-[10px] text-mist">
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-3 w-3" /> {dayLabel} · {needs}
          </span>
          <span className="inline-flex items-center gap-1 font-semibold" style={{ color: frac > 0.5 ? '#5ee8b8' : frac > 0.22 ? '#ffd489' : '#ff9b9b' }}>
            <Timer className="h-3 w-3" /> {Math.round(frac * 24 * 60)} min left
          </span>
        </div>
        <Divider />
        <div className="flex gap-2" onPointerDown={(e) => e.stopPropagation()}>
          <Button icon={Download} className="flex-1" size="sm" onClick={() => toast(`Downloading ${g.title} · 4K PNG`, 'brand')}>
            Download
          </Button>
          <Button variant="soft" icon={QrCode} className="flex-1" size="sm" onClick={onQR}>
            Send to customer
          </Button>
        </div>
      </div>
    </div>
  )
}

function QRModal({ gen, onClose, toast }) {
  const { remain, frac } = CountdownFrac(gen?.at ?? 0)
  return (
    <Modal
      open={!!gen}
      onClose={onClose}
      title="Send This Photo to a Customer"
      subtitle={gen?.title}
      width="max-w-sm"
      footer={
        <div className="flex gap-2">
          <Button variant="ghost" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" icon={Send} className="flex-1" onClick={() => { toast('Link sent to the customer', 'good'); onClose() }}>
            Send now
          </Button>
        </div>
      }
    >
      {gen && (
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-2xl border border-line bg-white p-3">
            <QRSheet seed={`stylix-${gen.id}`} size={168} />
          </div>
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between rounded-xl border border-line bg-ink/50 px-3 py-2 text-[11px]">
              <span className="text-mist">Link</span>
              <span className="font-mono text-[#a9baff]">stylix.live/x/{gen.id}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-line bg-ink/50 px-3 py-2 text-[11px]">
              <span className="text-mist">Channel</span>
              <span className="flex items-center gap-1.5 font-semibold text-snow"><StatusDot tone="good" /> A2 · WhatsApp</span>
            </div>
            <p className="text-center text-[10px] text-mist">
              Expires with the 24h window · {remainLabel(remain)} · {Math.round(frac * 100)}% time left
            </p>
          </div>
        </div>
      )}
    </Modal>
  )
}