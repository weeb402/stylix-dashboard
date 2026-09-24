import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Film, Image as ImageIcon, Radio } from 'lucide-react'
import { cx } from './ui'
import { gradientFor, fmtClock } from '../lib/data'
import { useStylix } from '../lib/state'
import { useNow } from '../lib/hooks'

/* ----------------------------------- Art ------------------------------------ */

export function Art({ grad = 'royal', className, children, grain = true, dim = 0 }) {
  return (
    <div className={cx('relative overflow-hidden', className)} style={{ background: gradientFor(grad) }}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_118%,rgba(255,255,255,0.14),transparent_60%)]" />
      {dim > 0 && (
        <div className="pointer-events-none absolute inset-0" style={{ background: `rgba(2,4,10,${dim})` }} />
      )}
      {grain && <div className="grain pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-overlay" />}
      <div className="relative h-full w-full">{children}</div>
    </div>
  )
}

/* --------------------------------- Portrait -------------------------------- */

export function Portrait({ grad = 'royal', pose = 0, className, flip = false, children }) {
  return (
    <Art grad={grad} className={className}>
      <svg
        viewBox="0 0 100 106"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        style={flip ? { transform: 'scaleX(-1)' } : undefined}
      >
        <defs>
          <linearGradient id={`rim-${grad}-${pose}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="rgba(255,255,255,0.34)" />
            <stop offset="1" stopColor="rgba(255,255,255,0.05)" />
          </linearGradient>
        </defs>
        <g transform={`translate(0 ${pose % 2 === 0 ? 0 : 3})`}>
          <g fill="rgba(3,6,15,0.55)" stroke="rgba(255,255,255,0.14)" strokeWidth="0.6">
            <ellipse cx="50" cy="28" rx="12.5" ry="15" />
            <path d="M16 106 C18 74 32 60 50 60 C68 60 82 74 84 106 Z" />
          </g>
          <ellipse cx="42" cy="22" rx="4" ry="5" fill="url(#rim)" opacity="0.8" />
        </g>
      </svg>
      {children}
    </Art>
  )
}

/* --------------------------------- CountRing -------------------------------- */

export function CountRing({ frac, size = 34, stroke = 3, className, children }) {
  const v = Math.max(0, Math.min(1, frac))
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const tone = v > 0.5 ? '#10b981' : v > 0.22 ? '#f59e0b' : '#ef4444'
  return (
    <div className={cx('relative grid place-items-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={tone}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          animate={{ strokeDashoffset: c * (1 - v) }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  )
}

export function CountdownFrac({ atMs, windowMs = 24 * 60 * 60 * 1000 }) {
  const now = useNow(30000)
  const elapsed = now.getTime() - atMs
  const remain = Math.max(0, windowMs - elapsed)
  const frac = remain / windowMs
  return { frac, remain }
}

export function remainLabel(ms) {
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  return `${h}h ${String(m).padStart(2, '0')}m`
}

/* --------------------------------- Sparkline -------------------------------- */

export function Sparkline({ seed = 7, points = 12, className, tone = '#5e7cff' }) {
  const rand = mulberry32(seed)
  const vals = Array.from({ length: points }, () => 0.35 + rand() * 0.6)
  const w = 120
  const h = 36
  const pts = vals.map((v, i) => [(i / (points - 1)) * w, h - v * h])
  const path = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area = `${path} L${w},${h} L0,${h} Z`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} preserveAspectRatio="none">
      <path d={area} fill={`${tone}18`} />
      <path d={path} fill="none" stroke={tone} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2.6" fill={tone} />
    </svg>
  )
}

function mulberry32(a) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/* --------------------------------- QR sheet --------------------------------- */

export function QRSheet({ seed = 'stylix-customer-2914', size = 168, className }) {
  const rand = mulberry32(...seed.split('').reduce((a, c) => a + c.charCodeAt(0), 7))
  const n = 21
  const cells = []
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const inFinder =
        (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7)
      if (inFinder || rand() < 0.46) cells.push([x, y])
    }
  }
  const sc = size / (n + 2)
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={cx('bg-white', className)}>
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={(x + 1) * sc} y={(y + 1) * sc} width={sc * 0.95} height={sc * 0.95} rx={sc * 0.18} fill="#0b0f1a" />
      ))}
    </svg>
  )
}

/* ---------------------------------- Ticker ---------------------------------- */

export function TickerBar({ cfg, className, mini = false }) {
  const dur = (mini ? 11 : 18) / Math.max(0.4, cfg.speed ?? 1)
  const sz = { sm: 'text-[9px]', md: 'text-[11px]', lg: 'text-[13px]', xl: 'text-[16px]' }[cfg.fontSize] || 'text-[11px]'
  const pad = mini ? 'px-3 py-1 max-w-[16ch] truncate rounded' : 'px-5 py-0.5'
  return (
    <div
      className={cx('relative overflow-hidden', mini && 'rounded-lg', className)}
      style={{ background: cfg.bg, borderColor: 'rgba(255,255,255,0.07)' }}
    >
      {!mini && (
        <div className="absolute inset-y-0 left-0 z-10 flex items-center gap-1.5 bg-gradient-to-r from-[inherit] to-transparent pl-3 pr-8">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute h-full w-full animate-ping rounded-full bg-white/80" />
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
          </span>
          <span className="text-[9px] font-bold tracking-[0.18em] text-white/90" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
            TICKER
          </span>
        </div>
      )}
      <div className="flex h-full items-center overflow-hidden whitespace-nowrap pl-10">
        <div
          className="flex animate-ticker max-w-none"
          style={{ '--ticker-duration': `${dur.toFixed(2)}s` }}
        >
          {[0, 1].map((i) => (
            <span key={i} className={cx('shrink-0 font-semibold tracking-wide', sz, pad)} style={{ color: cfg.textColor, textShadow: '0 1px 2px rgba(0,0,0,0.55)' }}>
              {cfg.text}
              <span className="px-6 inline-block -translate-y-0.5">◆</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* --------------------------------- Twin core -------------------------------- */

export function KioskTwin({ mode, className, showStand = true, tilt = false, chrome = true }) {
  const { app } = useStylix()
  const m = mode || app.activeMode
  const landscape = app.orientation === 'landscape'

  const label = {
    slideshow: 'SLIDESHOW',
    videogrid: 'VIDEO GRID',
    namaste: 'ATTRACT',
  }[m]

  const frame = (
    <div className="relative rounded-[30px] border border-line/80 bg-gradient-to-b from-[#141c2c] to-[#07090e] p-2 shadow-[0_44px_90px_-40px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.08)]">
      <div className={cx('relative overflow-hidden rounded-[22px] bg-ink', landscape ? 'aspect-[16/9]' : 'aspect-[9/16]')}>
        <Screen mode={m} />
        {app.ticker.enabled && m !== 'namaste' && (
          <div className="absolute inset-x-0 bottom-0 z-20">
            <TickerBar cfg={app.ticker} className="h-7" />
          </div>
        )}
        <div
          className="pointer-events-none absolute inset-0 z-30 rounded-[22px]"
          style={{ background: 'linear-gradient(115deg, rgba(255,255,255,0.12) 0%, transparent 26%, transparent 74%, rgba(29,63,223,0.10) 100%)' }}
        />
        {chrome && (
          <div className="absolute inset-x-0 top-2 z-30 flex items-center justify-center">
            <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/55 px-2.5 py-1 backdrop-blur-md">
              <Radio className="h-2.5 w-2.5 animate-pulse-soft text-good" />
              <span className="text-[8px] font-bold tracking-[0.22em] text-white/85">{label}</span>
              <span className="h-1 w-1 rounded-full bg-white/30" />
              <span className="text-[8px] font-medium tracking-wider text-white/55">43C105B2</span>
            </div>
          </div>
        )}
      </div>
      <TwinStand visible={showStand && !landscape} />
    </div>
  )

  if (!tilt) return <div className={cx('relative', className)}>{frame}</div>
  return (
    <motion.div
      initial={false}
      whileHover={{ rotateY: 5, rotateX: -3, scale: 1.01 }}
      whileTap={{ rotateY: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 22 }}
      style={{ transformStyle: 'preserve-3d' }}
      className={cx('relative', className)}
    >
      <div
        className="pointer-events-none absolute -inset-6 -z-10 rounded-full opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(50% 50% at 50% 30%, rgba(29,63,223,0.5), transparent 70%)' }}
      />
      {frame}
    </motion.div>
  )
}

function TwinStand({ visible }) {
  if (!visible) return null
  return (
    <div className="flex flex-col items-center">
      <div className="h-5 w-11 rounded-b-md bg-gradient-to-b from-[#202a40] to-[#0d1119] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]" />
      <div className="h-2 w-20 rounded-full bg-gradient-to-b from-[#243047] to-[#0a0d14] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]" />
    </div>
  )
}

/* ---------------------------------- Screen ---------------------------------- */

function Screen({ mode }) {
  switch (mode) {
    case 'slideshow':
      return <SlideScreen />
    case 'namaste':
      return <NamasteScreen />
    case 'videogrid':
    default:
      return <GridScreen />
  }
}

function SlideScreen() {
  const { app } = useStylix()
  const slides = app.slides
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((k) => (k + 1) % Math.max(1, slides.length)), 4200)
    return () => clearInterval(t)
  }, [slides.length])
  if (!slides.length) return <div className="absolute inset-0 grid place-items-center bg-ink text-[10px] text-mist">Playlist empty</div>
  const s = slides[i % slides.length]
  const fit = app.transition.fit
  const anim = app.transition.style
  return (
    <div className="absolute inset-0">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={s.id}
          initial={anim === 'crossfade' ? { opacity: 0 } : anim === 'slide' ? { y: 30, opacity: 0 } : { x: 40, opacity: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: Math.min(1.4, Math.max(0.25, app.transition.duration)) }}
          className="absolute inset-0"
        >
          <Art grad={s.grad} className="h-full w-full" grain={false}>
            <motion.span
              className="absolute left-0 right-0 top-0 bottom-0"
              animate={{ scale: [1, 1.18, 1], x: [0, -8, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className={fit === 'cover' ? 'h-full w-full bg-center' : 'h-full w-full'} />
            </motion.span>
            <SlideCaption label={s.name} kind={s.kind} />
          </Art>
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1">
        {slides.slice(0, 12).map((sl, k) => (
          <span key={sl.id} className={cx('h-1 rounded-full transition-all', k === i ? 'w-5 bg-white/90' : 'w-1 bg-white/30')} />
        ))}
      </div>
    </div>
  )
}

function SlideCaption({ label, kind }) {
  return (
    <div className="absolute inset-x-0 top-3 z-10 flex justify-between px-3">
      <span className="truncate rounded-md bg-black/55 px-2 py-1 text-[8px] font-medium tracking-wide text-white/85 backdrop-blur-sm">
        {label}
      </span>
      <span className="grid h-5 w-5 place-items-center rounded-md bg-black/55 text-white/70 backdrop-blur-sm">
        {kind === 'video' ? <Film className="h-2.5 w-2.5" /> : <ImageIcon className="h-2.5 w-2.5" />}
      </span>
    </div>
  )
}

function GridScreen() {
  const { app } = useStylix()
  const feeds = app.feeds.filter((f) => f.visible)
  const layout = app.gridLayout
  return (
    <div className={cx('absolute inset-0 gap-1 p-1', layout === 'stack' ? 'flex' : 'grid grid-rows-2')}>
      {feeds.length === 0 && (
        <div className="grid w-full place-items-center rounded-xl border border-dashed border-line text-[9px] text-mist">
          All feeds hidden
        </div>
      )}
      {feeds.map((f, i) => (
        <FeedTile key={f.id} feed={f} i={i} />
      ))}
    </div>
  )
}

function FeedTile({ feed, i }) {
  const pause = i % 2 === 1
  return (
    <div className="relative flex-1 overflow-hidden rounded-xl border border-white/10">
      <Art grad={feed.grad} grain={false} className="absolute inset-0" dim={pause ? 0.25 : 0}>
        <div className="absolute inset-0 grid place-items-center">
          <div
            className={cx(
              'grid h-8 w-8 place-items-center rounded-full border border-white/25 bg-black/45 backdrop-blur-sm',
              !pause && 'animate-pulse-soft',
            )}
          >
            {pause ? <Pause className="h-3 w-3 text-white/80" /> : <Play className="ml-0.5 h-3 w-3 text-white" />}
          </div>
        </div>
      </Art>
      <div className="absolute left-1.5 top-1.5 z-10 max-w-[85%]">
        <span className="truncate rounded bg-black/55 px-1.5 py-0.5 text-[7px] font-bold tracking-wider text-white/85 backdrop-blur-sm">
          FEED {String(i + 1).padStart(2, '0')} · {feed.name.toUpperCase()}
        </span>
      </div>
      {feed.caption && (
        <div className="absolute inset-x-0 bottom-1.5 z-10 flex justify-center px-2">
          <span className="rounded bg-black/60 px-2 py-0.5 text-[8px] font-medium text-white/90 backdrop-blur-sm">
            {feed.caption}
          </span>
        </div>
      )}
      {!pause && <Equalizer className="absolute bottom-2 right-2 z-10" />}
      <div className="pointer-events-none absolute inset-0 animate-scan bg-gradient-to-b from-transparent via-white/[0.04] to-transparent" />
    </div>
  )
}

function Equalizer({ className }) {
  const heights = [0.5, 0.85, 0.4, 0.95, 0.65, 0.8]
  return (
    <div className={cx('flex h-3.5 items-end gap-[2px]', className)}>
      {heights.map((h, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-sm bg-white/85"
          animate={{ height: [`${h * 100}%`, `${(h * 0.35 + 0.08) * 100}%`, `${h * 100}%`] }}
          transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.13, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

function NamasteScreen() {
  const { app } = useStylix()
  const custom = app.namaste.mode === 'custom' && app.namaste.customFile
  return (
    <div className="absolute inset-0">
      <Art grad="emerald" className="h-full w-full" grain={false}>
        <motion.div
          className="absolute inset-0 grid place-items-center"
          animate={{ opacity: [1, 0.92, 1] }}
          transition={{ duration: 3.2, repeat: Infinity }}
        >
          <div className="flex flex-col items-center gap-2 px-4 text-center">
            <div className="relative">
              <div className="absolute inset-[-18px] animate-pulse-soft rounded-full border border-white/20" />
              <div className="grid h-14 w-14 place-items-center rounded-full border border-white/25 bg-black/35 backdrop-blur-md">
                <Hands className="h-6 w-6 text-white/90" />
              </div>
            </div>
            <p className="mt-2 text-[20px] font-extrabold tracking-[0.34em] text-white drop-shadow-lg">STYLIX</p>
            <p className="text-[8px] font-semibold uppercase tracking-[0.3em] text-white/70">Namaste · Step In &amp; See Your Twin</p>
          </div>
        </motion.div>
      </Art>
      {custom && (
        <div className="absolute inset-x-0 bottom-2 z-10 flex justify-center px-3">
          <span className="max-w-full truncate rounded bg-black/60 px-2 py-1 text-[8px] font-medium text-white/90 backdrop-blur-sm">
            ▶ {custom.name}
          </span>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 animate-scan bg-gradient-to-b from-transparent via-white/[0.05] to-transparent" />
    </div>
  )
}

function Hands({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 2.6c-1 0-2 .4-2.8 1.1L3.6 9.3c-1.2 1.2-1.2 3.1 0 4.2l6.2 6.2c1.1 1.1 3 1.1 4.1 0l6.2-6.2c1.2-1.1 1.2-3 0-4.2l-6.2-6.2A4 4 0 0 0 12 2.6Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="M12 7.5 16.5 12 12 16.5 7.5 12 12 7.5Z" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

export function LiveClock({ className }) {
  const now = useNow(1000)
  return <span className={className}>{fmtClock(now)}</span>
}