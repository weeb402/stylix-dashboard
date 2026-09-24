import { createContext, useCallback, useContext, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Info, X, TriangleAlert, XCircle } from 'lucide-react'
import { cx } from './ui'

/* ---------------------------------- Toast ---------------------------------- */

const ToastCtx = createContext(() => {})

function BtnLike({ onClick, children, className }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick && onClick()}
      className={cx('cursor-pointer outline-none', className)}
    >
      {children}
    </div>
  )
}

let toastSeq = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const push = useCallback((msg, tone = 'brand', meta) => {
    const id = ++toastSeq
    setToasts((t) => [...t, { id, msg, tone, meta }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3600)
  }, [])

  return (
    <ToastCtx.Provider value={push}>
      {children}
      {createPortal(
        <div className="pointer-events-none fixed right-5 top-5 z-[90] flex w-80 flex-col gap-2">
          <AnimatePresence>
            {toasts.map((t) => (
              <Toast key={t.id} {...t} onClose={() => setToasts((ts) => ts.filter((x) => x.id !== t.id))} />
            ))}
          </AnimatePresence>
        </div>,
        document.body,
      )}
    </ToastCtx.Provider>
  )
}

function Toast({ msg, tone, onClose }) {
  const tones = {
    brand: { Icon: Info, cls: 'border-brand/40 text-[#a9baff] bg-[#0f1830]' },
    good: { Icon: CheckCircle2, cls: 'border-good/40 text-good bg-[#0b2119]' },
    warn: { Icon: TriangleAlert, cls: 'border-warn/40 text-warn bg-[#251b09]' },
    bad: { Icon: XCircle, cls: 'border-bad/40 text-bad bg-[#26100f]' },
  }
  const { Icon, cls } = tones[tone] || tones.brand
  return (
    <motion.div
      initial={{ opacity: 0, x: 30, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 30, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={cx(
        'pointer-events-auto flex items-center gap-3 rounded-xl border p-3 shadow-2xl backdrop-blur-xl hairline',
        cls,
      )}
    >
      <Icon className="h-4.5 w-4.5 shrink-0" strokeWidth={2} />
      <p className="flex-1 text-[13px] font-medium text-snow">{msg}</p>
      <BtnLike onClick={onClose} className="text-snow/50 hover:text-snow">
        <X className="h-4 w-4" />
      </BtnLike>
    </motion.div>
  )
}

export function useToast() {
  return useContext(ToastCtx)
}

/* ---------------------------------- Modal ----------------------------------- */

export function Modal({ open, onClose, title, subtitle, children, width = 'max-w-lg', footer }) {
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
            className={cx(
              'relative w-full overflow-hidden rounded-2xl border border-line bg-surface/95 shadow-2xl backdrop-blur-xl hairline',
              width,
            )}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-brand/10 to-transparent" />
            <div className="relative flex items-center justify-between gap-4 border-b border-line px-5 py-4">
              <div>
                <h3 className="text-[15px] font-semibold tracking-tight text-snow">{title}</h3>
                {subtitle && <p className="text-xs text-mist">{subtitle}</p>}
              </div>
              <BtnLike onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-raised text-mist transition-colors hover:text-snow">
                <X className="h-4 w-4" />
              </BtnLike>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-5">{children}</div>
            {footer && <div className="border-t border-line px-5 py-3.5">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

/* ---------------------------------- Drawer ---------------------------------- */

export function Drawer({ open, onClose, title, subtitle, children, width = 'max-w-md', footer }) {
  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ x: '104%' }}
            animate={{ x: 0 }}
            exit={{ x: '104%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className={cx(
              'fixed inset-y-0 right-0 z-[80] flex w-full flex-col border-l border-line bg-surface/95 shadow-2xl backdrop-blur-xl',
              width,
            )}
          >
            <div className="relative flex items-center justify-between gap-4 border-b border-line px-5 py-4">
              <div>
                <h3 className="text-[15px] font-semibold tracking-tight text-snow">{title}</h3>
                {subtitle && <p className="text-xs text-mist">{subtitle}</p>}
              </div>
              <BtnLike onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-raised text-mist transition-colors hover:text-snow">
                <X className="h-4 w-4" />
              </BtnLike>
            </div>
            <div className="flex-1 overflow-y-auto p-5">{children}</div>
            {footer && <div className="border-t border-line px-5 py-3.5">{footer}</div>}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  )
}