import { useEffect, useId, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useStylix } from '../lib/state'

export const cx = (...c) => c.filter(Boolean).join(' ')

/* ---------------------------------- Panel --------------------------------- */

export function Panel({ children, className, pad = true, glow = false, as: Tag = 'div' }) {
  return (
    <Tag
      className={cx(
        'relative rounded-2xl border border-line bg-surface/80 backdrop-blur-xl hairline',
        glow && 'glow-brand',
        pad && 'p-5',
        className,
      )}
    >
      <div className="relative">{children}</div>
    </Tag>
  )
}

export function Section({ children, className }) {
  return <div className={cx('space-y-6', className)}>{children}</div>
}

export function SectionTitle({ icon: Icon, title, desc, right }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="grid h-9 w-9 place-items-center rounded-xl border border-line bg-raised text-brand">
            <Icon className="h-4.5 w-4.5" strokeWidth={1.8} />
          </div>
        )}
        <div>
          <h2 className="text-[15px] font-semibold tracking-tight text-snow">{title}</h2>
          {desc && <p className="text-xs text-mist">{desc}</p>}
        </div>
      </div>
      {right}
    </div>
  )
}

/* --------------------------------- Button --------------------------------- */

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  className,
  disabled,
  block,
}) {
  const { app } = useStylix()
  const touch = app.touch
  const base =
    'inline-flex select-none items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 outline-none cursor-pointer active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none'
  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-11 px-4 text-[13px]',
    lg: 'h-12 px-5 text-sm',
  }
  const variants = {
    primary:
      'bg-brand text-white shadow-[0_8px_28px_-10px_rgba(29,63,223,0.8)] hover:bg-[#2349ef] hover:glow-brand-strong border border-brand/50',
    soft: 'bg-brand/12 text-[#a9baff] border border-brand/25 hover:bg-brand/20 hover:glow-brand-strong',
    ghost: 'text-mist border border-transparent hover:text-snow hover:bg-white/5',
    outline: 'text-snow border border-line bg-raised/60 hover:border-brand/50 hover:bg-brand/10',
    danger: 'bg-bad/12 text-[#ff9b9b] border border-bad/25 hover:bg-bad/20',
  }
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={disabled ? undefined : onClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && !disabled && onClick && onClick()}
      className={cx(base, sizes[size], touch && 'h-14', variants[variant], block && 'w-full', className)}
    >
      {Icon && <Icon className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} strokeWidth={1.9} />}
      {children}
    </div>
  )
}

export function IconButton({ icon: Icon, onClick, label, className, tone = 'ghost', size = 'md' }) {
  const tones = {
    ghost: 'text-mist hover:text-snow hover:bg-white/5 border-transparent',
    danger: 'text-mist hover:text-bad hover:bg-bad/10 border-transparent',
    soft: 'text-[#a9baff] bg-brand/12 border-brand/25 hover:bg-brand/20',
    brand: 'text-white bg-brand border-brand/40 hover:glow-brand-strong',
  }
  const pad = size === 'sm' ? 'h-7 w-7' : 'h-9 w-9'
  return (
    <div
      role="button"
      aria-label={label}
      title={label}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick && onClick()}
      className={cx(
        'grid cursor-pointer place-items-center rounded-lg border transition-all duration-200 active:scale-95 outline-none',
        pad,
        tones[tone],
        className,
      )}
    >
      <Icon className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} strokeWidth={1.9} />
    </div>
  )
}

/* ----------------------------------- Chip ---------------------------------- */

export function Chip({ children, tone = 'default', icon: Icon, className, onClick, active }) {
  const tones = {
    default: 'bg-white/4 border-line text-mist',
    brand: 'bg-brand/12 border-brand/30 text-[#a9baff]',
    good: 'bg-good/10 border-good/25 text-[#5ee8b8]',
    warn: 'bg-warn/10 border-warn/30 text-[#ffd489]',
    bad: 'bg-bad/10 border-bad/30 text-[#ff9b9b]',
    violet: 'bg-violet-500/10 border-violet-500/30 text-violet-300',
  }
  const Tag = onClick ? 'div' : 'span'
  return (
    <Tag
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => onClick && (e.key === 'Enter' || e.key === ' ') && onClick()}
      className={cx(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wide whitespace-nowrap',
        tones[tone],
        onClick && 'cursor-pointer transition-transform hover:-translate-y-px active:scale-95',
        active && 'glow-brand-strong bg-brand/20 border-brand/50 text-snow',
        className,
      )}
    >
      {Icon && <Icon className="h-3 w-3" strokeWidth={2.2} />}
      {children}
    </Tag>
  )
}

export function Badge({ n, dot = false, tone = 'brand', className }) {
  return (
    <span
      className={cx(
        'inline-flex items-center justify-center rounded-full text-[10px] font-bold leading-none',
        tone === 'brand' ? 'bg-brand/90 text-white' : tone === 'good' && 'bg-good text-ink',
        n ? 'h-5 min-w-5 px-1.5' : 'h-2 w-2',
        className,
      )}
    >
      {dot ? '' : n}
    </span>
  )
}

export function StatusDot({ tone = 'good', pulse = true, className }) {
  return (
    <span className={cx('relative inline-flex h-2 w-2', className)}>
      {pulse && (
        <span
          className={cx(
            'absolute inline-flex h-full w-full animate-ping rounded-full opacity-60',
            tone === 'good' ? 'bg-good' : tone === 'warn' ? 'bg-warn' : 'bg-brand',
          )}
        />
      )}
      <span
        className={cx(
          'relative inline-flex h-2 w-2 rounded-full',
          tone === 'good' ? 'bg-good' : tone === 'warn' ? 'bg-warn' : tone === 'bad' ? 'bg-bad' : 'bg-brand',
        )}
      />
    </span>
  )
}

/* ---------------------------------- Switch --------------------------------- */

export function Switch({ on, onChange, disabled, size = 'md', label }) {
  const w = size === 'sm' ? 'h-5 w-9' : 'h-6 w-11'
  const knob = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4.5 w-4.5'
  return (
    <div className="flex items-center gap-2.5">
      <div
        role="switch"
        aria-checked={on}
        tabIndex={0}
        onClick={disabled ? undefined : () => onChange(!on)}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && !disabled && onChange(!on)}
        className={cx(
          'relative inline-flex shrink-0 cursor-pointer items-center rounded-full border transition-all duration-300 outline-none',
          w,
          on
            ? 'border-brand/60 bg-brand glow-brand-strong'
            : 'border-line bg-ink/80 hover:border-brand/40',
          disabled && 'opacity-40 pointer-events-none',
        )}
      >
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 32 }}
          className={cx(
            'rounded-full bg-white shadow-md',
            knob,
            on ? 'ml-auto mr-0.5' : 'ml-0.5',
          )}
        />
      </div>
      {label && <span className="text-[13px] text-mist">{label}</span>}
    </div>
  )
}

/* --------------------------------- Segmented -------------------------------- */

export function Segmented({ options, value, onChange, size = 'md', className, bare = false }) {
  const uid = useId()
  return (
    <div
      className={cx(
        'inline-flex items-center gap-1 p-1',
        bare ? '' : 'rounded-xl border border-line bg-ink/70',
        className,
      )}
    >
      {options.map((o) => {
        const Icon = o.icon
        const active = o.value === value
        return (
          <div
            key={o.value}
            role="tab"
            aria-selected={active}
            tabIndex={0}
            onClick={() => onChange(o.value)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onChange(o.value)}
            className={cx(
              'relative flex cursor-pointer items-center gap-1.5 rounded-[10px] font-medium whitespace-nowrap outline-none transition-colors',
              size === 'sm' ? 'px-2.5 h-8 text-xs' : 'px-3.5 h-9 text-[13px]',
              active ? 'text-snow' : 'text-mist hover:text-snow/80',
            )}
          >
            {active && (
              <motion.div
                layoutId={uid}
                className="absolute inset-0 rounded-[10px] border border-line bg-raised hairline shadow-[0_4px_16px_-6px_rgba(0,0,0,0.7)]"
                transition={{ type: 'spring', stiffness: 500, damping: 36 }}
              />
            )}
            {Icon && <Icon className="relative z-10 h-3.5 w-3.5" strokeWidth={2} />}
            <span className="relative z-10">{o.label}</span>
          </div>
        )
      })}
    </div>
  )
}

/* ---------------------------------- Select ---------------------------------- */

export function Select({ value, options, onChange, className, icon: Icon, align = 'left' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false)
    window.addEventListener('pointerdown', onDown)
    return () => window.removeEventListener('pointerdown', onDown)
  }, [open])

  const sel = options.find((o) => o.value === value)
  return (
    <div ref={ref} className={cx('relative', className)}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => e.key === 'Enter' && setOpen((o) => !o)}
        className="relative flex h-[42px] cursor-pointer items-center gap-2 rounded-xl border border-line-strong bg-input px-3 text-[13px] text-snow outline-none transition-colors hover:border-brand/40 focus:border-brand/60"
      >
        {Icon && <Icon className="h-4 w-4 text-mist" strokeWidth={1.8} />}
        <span className="flex-1 truncate">{sel?.label ?? 'Select…'}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-4 w-4 text-mist" />
        </motion.div>
      </div>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -4, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.16 }}
          className={cx(
            'absolute z-40 mt-1.5 min-w-full overflow-hidden rounded-xl border border-line bg-raised/95 p-1 shadow-2xl backdrop-blur-xl',
            align === 'right' ? 'right-0' : 'left-0',
          )}
        >
          {options.map((o) => {
            const Icon2 = o.icon
            return (
              <div
                key={o.value}
                role="option"
                aria-selected={o.value === value}
                onClick={() => {
                  onChange(o.value)
                  setOpen(false)
                }}
                className={cx(
                  'flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition-colors',
                  o.value === value ? 'bg-brand/15 text-snow' : 'text-mist hover:bg-white/5 hover:text-snow',
                )}
              >
                {Icon2 && <Icon2 className="h-3.5 w-3.5" strokeWidth={1.9} />}
                {o.label}
              </div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}

/* ---------------------------------- Slider ---------------------------------- */

export function Slider({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  className,
  ticks,
  format,
  disabled,
}) {
  const ref = useRef(null)
  const pct = ((value - min) / (max - min)) * 100

  const setFromX = useCallback(
    (clientX) => {
      const r = ref.current.getBoundingClientRect()
      const raw = ((clientX - r.left) / r.width) * (max - min) + min
      const snapped = Math.round(raw / step) * step
      onChange(Math.min(max, Math.max(min, snapped)))
    },
    [min, max, step, onChange],
  )

  return (
    <div
      ref={ref}
      className={cx('relative h-6 cursor-pointer select-none touch-none outline-none', disabled && 'opacity-40 pointer-events-none', className)}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId)
        setFromX(e.clientX)
      }}
      onPointerMove={(e) => {
        if (e.buttons === 1) setFromX(e.clientX)
      }}
    >
      <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-ink/90 ring-1 ring-line">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brand to-[#5e7cff] shadow-[0_0_12px_rgba(29,63,223,0.6)]"
          style={{ width: `${pct}%` }}
        />
      </div>
      {ticks &&
        ticks.map((t) => (
          <div
            key={t}
            className="absolute top-1/2 h-1 w-px -translate-y-1/2 bg-white/20"
            style={{ left: `${t}%` }}
          />
        ))}
      <div
        className="absolute top-1/2 h-4.5 w-4.5 -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${pct}%` }}
      >
        <motion.div
          whileTap={{ scale: 1.2 }}
          className="h-4.5 w-4.5 rounded-full border border-brand bg-white shadow-[0_0_0_4px_rgba(29,63,223,0.25),0_4px_14px_rgba(29,63,223,0.7)]"
        />
      </div>
      {format && (
        <div
          className="pointer-events-none absolute -top-1 hidden -translate-x-1/2 rounded-md border border-brand/40 bg-ink px-2 py-0.5 text-[11px] font-semibold text-snow shadow-xl"
          style={{ left: `${pct}%` }}
        >
          {format(value)}
        </div>
      )}
    </div>
  )
}

/* -------------------------------- Text field -------------------------------- */

export function TextField({
  value,
  onChange,
  onEnter,
  placeholder,
  icon: Icon,
  className,
  size = 'md',
  multiline = false,
  mono = false,
}) {
  const ref = useRef(null)
  useEffect(() => {
    if (ref.current && ref.current.innerText !== value && document.activeElement !== ref.current) {
      ref.current.innerText = value
    }
  }, [value])

  const shape =
    'outline-none resize-none w-full bg-transparent text-snow placeholder:opacity-0 caret-brand'
  return (
    <div
      className={cx(
        'group flex items-start gap-2.5 rounded-xl border border-line-strong bg-input px-3 transition-all focus-within:border-brand/60 focus-within:shadow-[0_0_0_3px_rgba(29,63,223,0.14)]',
        size === 'sm' ? 'min-h-9 py-1.5' : 'min-h-[42px] py-2',
        className,
      )}
    >
      {Icon && <Icon className={cx('mt-1 h-4 w-4 shrink-0 text-mist', size === 'sm' && 'mt-0.5')} strokeWidth={1.8} />}
      <div
        ref={ref}
        role="textbox"
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        data-ph={placeholder}
        onInput={() => ref.current && onChange(ref.current.innerText)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !multiline && onEnter) {
            e.preventDefault()
            onEnter()
          }
          if (e.key === 'Escape') e.currentTarget.blur()
        }}
        className={cx(
          'flex-1 whitespace-pre-wrap break-words empty:before:text-mist/80 empty:before:content-[attr(data-ph)]',
          shape,
          size === 'sm' ? 'text-[13px] leading-snug' : 'text-sm leading-snug',
          mono && 'font-mono text-[13px]',
        )}
      />
    </div>
  )
}

/* --------------------------------- Progress --------------------------------- */

export function Progress({ value, tone = 'brand', className, trackClassName }) {
  return (
    <div className={cx('h-1.5 w-full overflow-hidden rounded-full bg-ink/80 ring-1 ring-line', trackClassName, className)}>
      <motion.div
        initial={false}
        animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        transition={{ type: 'spring', stiffness: 120, damping: 24 }}
        className={cx(
          'h-full rounded-full',
          tone === 'brand' && 'bg-gradient-to-r from-brand to-[#5e7cff]',
          tone === 'good' && 'bg-good',
          tone === 'warn' && 'bg-warn',
          tone === 'bad' && 'bg-bad',
        )}
      />
    </div>
  )
}

/* ---------------------------------- Utility --------------------------------- */

export function Kbd({ children }) {
  return (
    <span className="rounded border border-line bg-raised px-1.5 py-0.5 font-mono text-[10px] text-mist">
      {children}
    </span>
  )
}

export function Divider({ className }) {
  return <div className={cx('h-px w-full bg-line', className)} />
}

export function EmptyState({ icon: Icon, title, desc, children }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line py-10 text-center">
      {Icon && (
        <div className="mb-1 grid h-12 w-12 place-items-center rounded-2xl border border-line bg-raised text-mist">
          <Icon className="h-5 w-5" strokeWidth={1.6} />
        </div>
      )}
      <p className="text-sm font-medium text-snow">{title}</p>
      {desc && <p className="max-w-xs text-xs text-mist">{desc}</p>}
      {children}
    </div>
  )
}