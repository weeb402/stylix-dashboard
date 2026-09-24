import { createContext, useContext, useMemo, useState } from 'react'
import { SLIDES, TICKER_PRESETS, FEEDS, CLOUD_ASSETS, STYLES, OWNER_VIEWS } from './data'

const Ctx = createContext(null)

export function StylixProvider({ children }) {
  const [app, setApp] = useState(() => ({
    view: 'dashboard',
    sidebarOpen: true,
    activeMode: 'videogrid',
    role: 'owner',
    orientation: 'portrait',
    touch: false,
    business: {
      storeName: 'dewanji smart home',
      editing: false,
      logo: null,
    },
    ticker: {
      enabled: true,
      text: TICKER_PRESETS[0],
      speed: 1.2,
      fontSize: 'md',
      textColor: '#f8fafc',
      bg: '#0a1120',
    },
    slides: SLIDES,
    transition: { duration: 1.2, style: 'crossfade', fit: 'cover', loop: true },
    feeds: FEEDS,
    gridLayout: 'stack',
    namaste: {
      mode: 'default',
      customFile: null,
      showIntro: true,
      introMs: 6000,
    },
    vaultTab: 'all',
    catalog: { tab: 'garments', items: { garments: STYLES.garments, hair: STYLES.hair, jewel: STYLES.jewel } },
    credits: { master: 71, standee: 49, auto: true },
    cloud: CLOUD_ASSETS,
    cloudQuery: '',
    openModals: {},
    previewSlide: null,
  }))

  const actions = useMemo(() => {
    const patch = (key, patchOrFn) =>
      setApp((s) => ({ ...s, [key]: typeof patchOrFn === 'function' ? patchOrFn(s[key], s) : { ...s[key], ...patchOrFn } }))

    const set = (patch) => setApp((s) => ({ ...s, ...patch }))

    const reorderSlides = (next) => setApp((s) => ({ ...s, slides: next }))

    const moveSlide = (id, dir) =>
      setApp((s) => {
        const i = s.slides.findIndex((x) => x.id === id)
        const j = i + dir
        if (i < 0 || j < 0 || j >= s.slides.length) return s
        const next = [...s.slides]
        ;[next[i], next[j]] = [next[j], next[i]]
        return { ...s, slides: next }
      })

    const deleteSlide = (id) =>
      setApp((s) => ({ ...s, slides: s.slides.filter((x) => x.id !== id) }))

    const setSlideDur = (id, dur) =>
      setApp((s) => ({
        ...s,
        slides: s.slides.map((x) => (x.id === id ? { ...x, dur } : x)),
      }))

    const addSlides = (items) =>
      setApp((s) => ({ ...s, slides: [...s.slides, ...items] }))

    const addCloudItem = (item) => setApp((s) => ({ ...s, cloud: [item, ...s.cloud] }))

    const toggleCatalog = (cat, id) =>
      setApp((s) => ({
        ...s,
        catalog: {
          ...s.catalog,
          items: {
            ...s.catalog.items,
            [cat]: s.catalog.items[cat].map((x) => (x.id === id ? { ...x, active: !x.active } : x)),
          },
        },
      }))

    const addStyle = (cat, item) =>
      setApp((s) => ({
        ...s,
        catalog: {
          ...s.catalog,
          items: { ...s.catalog.items, [cat]: [item, ...s.catalog.items[cat]] },
        },
      }))

    const deleteStyle = (cat, id) =>
      setApp((s) => ({
        ...s,
        catalog: {
          ...s.catalog,
          items: { ...s.catalog.items, [cat]: s.catalog.items[cat].filter((x) => x.id !== id) },
        },
      }))

    const setView = (v) => setApp((s) => {
      if (s.role === 'owner' && !OWNER_VIEWS.some((x) => x.id === v)) v = 'dashboard'
      return { ...s, view: v }
    })

    const setRole = (role) =>
      setApp((s) => {
        if (role === 'owner' && s.view && SUPER_ONLY[s.view]) return { ...s, role, view: 'dashboard' }
        return { ...s, role }
      })

    const setOrientation = (orientation) => setApp((s) => ({ ...s, orientation }))

    const setTouch = (touch) => setApp((s) => ({ ...s, touch }))

    const toggleSidebar = () => setApp((s) => ({ ...s, sidebarOpen: !s.sidebarOpen }))

    return {
      set,
      patch,
      reorderSlides,
      moveSlide,
      deleteSlide,
      setSlideDur,
      addSlides,
      addCloudItem,
      toggleCatalog,
      addStyle,
      deleteStyle,
      setView,
      setRole,
      setOrientation,
      setTouch,
      toggleSidebar,
    }
  }, [])

  return <Ctx.Provider value={{ app, actions }}>{children}</Ctx.Provider>
}

const SUPER_ONLY = { fleet: 1, globalcredits: 1, firmware: 1, syndicate: 1 }

export function useStylix() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useStylix must be used inside <StylixProvider>')
  return ctx
}