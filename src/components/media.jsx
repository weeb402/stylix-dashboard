import { useRef, useState } from 'react'
import { CloudUpload, FileVideo, FileImage, CheckCircle2 } from 'lucide-react'
import { cx } from './ui'
import { useToast } from './overlays'

const SIM_FILES = [
  { name: 'STYLIX_Brand_Mark.png', size: '0.4 MB', kind: 'image', grad: 'royal' },
  { name: 'store_video_spring_2026.mp4', size: '46 MB', kind: 'video', grad: 'sky' },
  { name: 'lookbook_page_01.png', size: '3.1 MB', kind: 'image', grad: 'violet' },
  { name: 'namaste_custom_brand_reel.mp4', size: '138 MB', kind: 'video', grad: 'emerald' },
]

export function Dropzone({ onFile, label, sub, formats, className, compact = false }) {
  const [over, setOver] = useState(false)
  const [pulse, setPulse] = useState(false)
  const seq = useRef(0)
  const toast = useToast()

  const fire = (e) => {
    e?.preventDefault()
    e?.stopPropagation()
    const f = SIM_FILES[seq.current++ % SIM_FILES.length]
    toast(`Asset prepared · ${f.name}`, 'good')
    setPulse(true)
    setTimeout(() => setPulse(false), 1400)
    onFile(f)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={fire}
      onDragOver={(e) => {
        e.preventDefault()
        setOver(true)
      }}
      onDragLeave={() => setOver(false)}
      onDrop={fire}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && fire()}
      className={cx(
        'group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed outline-none transition-all duration-200',
        over
          ? 'border-brand/70 bg-brand/12 shadow-[0_0_0_4px_rgba(29,63,223,0.18)]'
          : pulse
            ? 'border-good/60 bg-good/8'
            : 'border-line bg-ink/50 hover:border-brand/50 hover:bg-brand/6',
        compact ? 'p-4' : 'p-7',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100" style={{ background: 'radial-gradient(60% 80% at 50% 0%, rgba(29,63,223,0.14), transparent 70%)' }} />
      <div className={cx('relative flex flex-col items-center text-center', compact ? 'gap-1.5' : 'gap-3')}>
        <div
          className={cx(
            'grid shrink-0 place-items-center rounded-2xl border bg-surface transition-all',
            compact ? 'h-9 w-9 rounded-xl' : 'h-12 w-12',
            pulse ? 'border-good/40 text-good' : 'border-brand/30 text-[#a9baff]',
          )}
        >
          {pulse ? <CheckCircle2 className={compact ? 'h-4 w-4' : 'h-5 w-5'} strokeWidth={2} /> : <CloudUpload className={compact ? 'h-4 w-4' : 'h-5 w-5'} strokeWidth={1.8} />}
        </div>
        <div>
          <p className={cx('font-semibold text-snow', compact ? 'text-[12px]' : 'text-sm')}>{label}</p>
          {sub && !compact && <p className="mt-0.5 text-[11px] text-mist">{sub}</p>}
        </div>
        {formats && (
          <div className={cx('flex flex-wrap items-center justify-center gap-1.5', compact && 'mt-0.5')}>
            {formats.map((f) => (
              <span key={f} className="inline-flex items-center gap-1 rounded-md border border-line bg-ink/70 px-1.5 py-0.5 font-mono text-[9px] text-mist">
                {f.includes('MP4') || f.includes('WebM') ? <FileVideo className="h-2.5 w-2.5" /> : <FileImage className="h-2.5 w-2.5" />}
                {f}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}