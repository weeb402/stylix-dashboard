export const VIEWS = [
  { id: 'dashboard', label: 'Dashboard & Twin', sub: 'Live kiosk command center' },
  { id: 'playlist', label: 'Slideshow Studio', sub: 'Playlist builder & transition inspector' },
  { id: 'videogrid', label: 'Video Grid Player', sub: 'Dual-feed broadcast layout' },
  { id: 'ticker', label: 'Live Ticker Bar', sub: 'Broadcast marquee composer' },
  { id: 'cloud', label: 'Media Cloud', sub: 'Asset library & uploads' },
  { id: 'namaste', label: 'Namaste Intro Screen', sub: 'Attract loop & standee' },
  { id: 'vault', label: 'AI Try-On Captures', sub: 'Last 24 hours · AI fashion renders' },
  { id: 'credits', label: 'Credit Allocator', sub: 'Hardware quota rebalancer' },
  { id: 'catalog', label: 'AI Fashion & Beauty Catalog', sub: 'Style studio · standee sync' },
  { id: 'fleet', label: 'Fleet Overview', sub: 'Heartbeat monitor · every kiosk, every store', scope: 'super' },
  { id: 'globalcredits', label: 'Global Credit Pool', sub: 'Cross-store balance distributor', scope: 'super' },
  { id: 'firmware', label: 'Firmware Scheduler', sub: 'STYLIX OS rollout windows', scope: 'super' },
  { id: 'syndicate', label: 'Master Syndication', sub: 'Push campaigns to 10+ kiosks', scope: 'super' },
]

export const OWNER_VIEWS = VIEWS.filter((v) => v.scope !== 'super')
export const SUPER_VIEWS = VIEWS.filter((v) => v.scope === 'super')

export const GRADS = {
  royal: ['#0b1440', '#1d3fdf', '#04060f'],
  violet: ['#231047', '#7c3aed', '#0c0616'],
  emerald: ['#062a21', '#10b981', '#030807'],
  rose: ['#3a0f17', '#ef4444', '#0c0406'],
  sky: ['#0a2342', '#38bdf8', '#040a12'],
  fuchsia: ['#34104a', '#d946ef', '#0d0512'],
  amber: ['#33200a', '#f59e0b', '#120a02'],
  slate: ['#101828', '#94a3b8', '#05070c'],
  sapphire: ['#10204d', '#5e7cff', '#060a18'],
  gold: ['#2c1c06', '#eab308', '#0d0701'],
}

export const gradientFor = (name) => {
  const [a, b, c] = GRADS[name] || GRADS.royal
  return `radial-gradient(130% 90% at 50% 0%, ${a} 0%, transparent 62%), radial-gradient(110% 90% at 85% 100%, ${b}55 0%, transparent 55%), linear-gradient(165deg, ${b} 0%, ${c} 100%)`
}

export const SLIDES = [
  { id: 's01', name: '01_Kurta_Essentials.jpg', size: '2.8 MB', dur: 6, grad: 'royal', kind: 'image', tag: 'Campaign' },
  { id: 's02', name: '02_Bridal_Saree.jpg', size: '4.1 MB', dur: 8, grad: 'violet', kind: 'image', tag: 'Bridal' },
  { id: 's03', name: '03_Summer_Loungewear.jpg', size: '3.2 MB', dur: 6, grad: 'emerald', kind: 'image', tag: 'Lifestyle' },
  { id: 's04', name: '04_Men_Blazer.jpg', size: '2.4 MB', dur: 6, grad: 'sky', kind: 'image', tag: 'Menswear' },
  { id: 's05', name: '05_Festive_Anarkali.mp4', size: '12.6 MB', dur: 10, grad: 'fuchsia', kind: 'video', tag: 'Video' },
  { id: 's06', name: '06_Accessory_Grid.jpg', size: '3.7 MB', dur: 6, grad: 'amber', kind: 'image', tag: 'Accessories' },
  { id: 's07', name: '07_Lehenga_Looks.jpg', size: '4.9 MB', dur: 8, grad: 'rose', kind: 'image', tag: 'Bridal' },
  { id: 's08', name: '08_Kidswear.jpg', size: '2.1 MB', dur: 6, grad: 'sapphire', kind: 'image', tag: 'Kids' },
  { id: 's09', name: '09_Turban_and_Wear.mp4', size: '15.2 MB', dur: 12, grad: 'gold', kind: 'video', tag: 'Video' },
  { id: 's10', name: '10_Offer_Banner.png', size: '1.6 MB', dur: 5, grad: 'slate', kind: 'image', tag: 'Offer' },
  { id: 's11', name: '11_Salon_Styles.jpg', size: '3.0 MB', dur: 6, grad: 'fuchsia', kind: 'image', tag: 'Beauty' },
  { id: 's12', name: '12_Footwear_Line.jpg', size: '3.5 MB', dur: 6, grad: 'emerald', kind: 'image', tag: 'Footwear' },
  { id: 's13', name: '13_New_Arrivals.mp4', size: '11.3 MB', dur: 9, grad: 'violet', kind: 'video', tag: 'Video' },
  { id: 's14', name: '14_Store_Hours.png', size: '0.9 MB', dur: 5, grad: 'slate', kind: 'image', tag: 'Info' },
]

export const TICKER_PRESETS = [
  '✨ Try On Our New Summer Collection — Step in Front of Camera',
  '🎉 Flat 20% Off at Billing Counter',
  '📍 Scan the QR · Get Your AI Look for Free',
  '🤍 Wedding Edit — Banarasi · Velvet · Kundan',
  '👟 New Footwear Line Is Live Today',
]

export const FONT_SIZES = [
  { value: 'sm', label: 'S' },
  { value: 'md', label: 'M' },
  { value: 'lg', label: 'L' },
  { value: 'xl', label: 'XL' },
]

export const SWATCHES = [
  '#f8fafc',
  '#ffe9c7',
  '#ffc8ce',
  '#d3f3ff',
  '#cff5e6',
  '#1d3fdf',
  '#7c3aed',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#94a3b8',
  '#111827',
]

const MIN = 60 * 1000
const HOUR = 60 * MIN

export const GENERATIONS = [
  { id: 'g01', cat: 'cloth', title: 'Nette Anarkali — Ivory', gender: 'Women', at: Date.now() - 18 * MIN, cost: 1.4, grad: 'violet', prompt: 'Preserve the net flare and soft pleats' },
  { id: 'g02', cat: 'haircut', title: 'Pompadour + Skin Fade', gender: 'Men', at: Date.now() - 1.4 * HOUR, cost: 1.1, grad: 'sky', prompt: 'Clean fade, arching pomp with volume' },
  { id: 'g03', cat: 'makeup', title: 'Bridal Glam — Gold Eye', gender: 'Women', at: Date.now() - 3.1 * HOUR, cost: 1.3, grad: 'gold', prompt: 'Warm gold lid, soft contour finish' },
  { id: 'g04', cat: 'cloth', title: 'Banarasi Sherwani', gender: 'Men', at: Date.now() - 5 * HOUR, cost: 1.4, grad: 'royal', prompt: 'Keep the slim sherwani silhouette' },
  { id: 'g05', cat: 'haircut', title: 'Wavy Volume Layers', gender: 'Women', at: Date.now() - 6.7 * HOUR, cost: 1.0, grad: 'fuchsia', prompt: 'Loose beach waves, face-framing layers' },
  { id: 'g06', cat: 'makeup', title: 'Smoky Evening Eye', gender: 'Women', at: Date.now() - 8.2 * HOUR, cost: 1.2, grad: 'slate', prompt: 'Smudged charcoal smoke, skin-true base' },
  { id: 'g07', cat: 'cloth', title: 'Velvet Off-Shoulder Lehenga', gender: 'Women', at: Date.now() - 10.5 * HOUR, cost: 1.5, grad: 'rose', prompt: 'Preserve twirl volume in the skirt' },
  { id: 'g08', cat: 'haircut', title: 'Classic Full Beard Shape', gender: 'Men', at: Date.now() - 13 * HOUR, cost: 1.0, grad: 'amber', prompt: 'Defined cheek-line, squared jaw beard' },
  { id: 'g09', cat: 'makeup', title: 'Kundan-Choker Statement', gender: 'Women', at: Date.now() - 15.6 * HOUR, cost: 1.5, grad: 'emerald', prompt: 'Keep the choker resting on collar bone' },
  { id: 'g10', cat: 'cloth', title: 'Linen Co-ord — Sand Tone', gender: 'Unisex', at: Date.now() - 18 * HOUR, cost: 1.2, grad: 'emerald', prompt: 'Soft drape, relaxed tailored fit' },
  { id: 'g11', cat: 'haircut', title: 'Modern Mullet Crop', gender: 'Men', at: Date.now() - 20.4 * HOUR, cost: 1.1, grad: 'sky', prompt: 'Texture top, defined back length' },
  { id: 'g12', cat: 'makeup', title: 'Minimal Gold Pendant Set', gender: 'Unisex', at: Date.now() - 22.8 * HOUR, cost: 1.3, grad: 'gold', prompt: 'Sleek pendant, no extra layering' },
]

export const STYLES = {
  garments: [
    { id: 'c01', name: 'Royal Banarasi Kurta', gender: 'Men', prompt: 'Preserve slim kurta silhouette', active: true, grad: 'royal' },
    { id: 'c02', name: 'Velvet Off-Shoulder Lehenga', gender: 'Women', prompt: 'Keep twirl volume in the skirt', active: true, grad: 'rose' },
    { id: 'c03', name: 'Linen Co-ord Set', gender: 'Unisex', prompt: 'Soft drape, relaxed fit', active: false, grad: 'emerald' },
    { id: 'c04', name: 'Embroidered Anarkali', gender: 'Women', prompt: 'Retain floor-length flare, choli fit', active: true, grad: 'violet' },
    { id: 'c05', name: 'Kashmiri Pashmina Wrap', gender: 'Unisex', prompt: 'Natural drape over shoulder', active: false, grad: 'slate' },
    { id: 'c06', name: 'Slim-Fit Safari Jacket', gender: 'Men', prompt: 'Clean tailored lines, no bulk', active: true, grad: 'sky' },
  ],
  hair: [
    { id: 'h01', name: 'Sharp Pompadour + Taper', gender: 'Men', prompt: 'Clean taper, arched volume top', active: true, grad: 'sky' },
    { id: 'h02', name: 'Wavy Volume Layers', gender: 'Women', prompt: 'Face-framing layers, soft wave', active: true, grad: 'fuchsia' },
    { id: 'h03', name: 'Classic Full Beard Shape', gender: 'Men', prompt: 'Squared beard, defined cheek line', active: true, grad: 'amber' },
    { id: 'h04', name: 'Modern Mullet Crop', gender: 'Men', prompt: 'Texture crown, tapered back', active: false, grad: 'slate' },
    { id: 'h05', name: 'Bridal Buns & Braid', gender: 'Women', prompt: 'Ornamented braid crown, elegant', active: true, grad: 'gold' },
  ],
  jewel: [
    { id: 'j01', name: 'Bridal Glam Makeup', gender: 'Women', prompt: 'Gold eye, soft matte base', active: true, grad: 'gold' },
    { id: 'j02', name: 'Kundan Choker Set', gender: 'Women', prompt: 'Statement choker, clean neckline', active: true, grad: 'emerald' },
    { id: 'j03', name: 'Smoky Evening Eye', gender: 'Women', prompt: 'Charcoal smoke, skin-true base', active: false, grad: 'slate' },
    { id: 'j04', name: 'Minimal Gold Pendant', gender: 'Unisex', prompt: 'Sleek pendant, no layering', active: true, grad: 'rose' },
    { id: 'j05', name: 'Sun-Kissed Blush Edit', gender: 'Women', prompt: 'Fresh dewy finish, coral blush', active: true, grad: 'fuchsia' },
  ],
}

export const CLOUD_ASSETS = [
  { id: 'm01', name: 'Lifestyle_Loop_4K.mp4', kind: 'video', size: '248 MB', res: '2160p', at: 'Today · 09:12', grad: 'royal', status: 'ready' },
  { id: 'm02', name: 'Festive_Anarkali.webm', kind: 'video', size: '86 MB', res: '1080p', at: 'Today · 09:14', grad: 'violet', status: 'ready' },
  { id: 'm03', name: 'Offers_Pricing_Spring.png', kind: 'image', size: '2.1 MB', res: '2048×2560', at: 'Today · 09:20', grad: 'amber', status: 'ready' },
  { id: 'm04', name: 'Bridal_Saree_Campaign.jpg', kind: 'image', size: '4.8 MB', res: '2048×2560', at: 'Yesterday · 18:40', grad: 'rose', status: 'ready' },
  { id: 'm05', name: 'Store_Hours_v3.png', kind: 'image', size: '0.7 MB', res: '1080×1920', at: 'Yesterday · 19:02', grad: 'slate', status: 'ready' },
  { id: 'm06', name: 'Namaste_Attract_Loop.mp4', kind: 'video', size: '148 MB', res: '2160p', at: 'Yesterday · 11:05', grad: 'emerald', status: 'processing' },
  { id: 'm07', name: 'Menswear_Blazer_Edit.jpg', kind: 'image', size: '3.3 MB', res: '2048×2560', at: '2 days ago', grad: 'sky', status: 'ready' },
]

export const FEEDS = [
  { id: 'f1', name: 'Lifestyle Loop', source: 'm01', visible: true, volume: 72, caption: 'Step in · See your digital twin', grad: 'royal' },
  { id: 'f2', name: 'Offers & Pricing', source: 'm03', visible: true, volume: 54, caption: 'Flat 20% off at billing counter', grad: 'amber' },
]

export const ACTIVITY = [
  { icon: 'sparkles', text: 'AI rendered 4 new try-on photos', time: '2m ago', tone: 'good' },
  { icon: 'play', text: 'Video Grid started on Guest Standee TV', time: '11m ago', tone: 'brand' },
  { icon: 'upload', text: 'Festive_Anarkali.webm synced to Media Cloud', time: '24m ago', tone: 'mist' },
  { icon: 'trend', text: '3 credits earned from QR check-ins', time: '41m ago', tone: 'warn' },
  { icon: 'alert', text: 'Slideshow slot 06 duration overridden to 6s', time: '1h ago', tone: 'mist' },
  { icon: 'tv', text: 'Standee balance rebalanced +10 credits', time: '2h ago', tone: 'brand' },
]

export const NOTIFICATIONS = [
  { title: 'Low standee credits', body: '14 generations left · rebalance from cloud wallet', tone: 'warn', time: '8m ago' },
  { title: 'Firmware update ready', body: 'STYLIX OS v4.2.1 available for Guest Standee', tone: 'brand', time: '1h ago' },
  { title: 'New QR share', body: 'Customer #2914 opened your AI look link', tone: 'good', time: '3h ago' },
]

export const fmtBytes = (mb) => `${mb} MB`
export const fmtClock = (d) =>
  d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })

/* ------------------------------ Super Admin data ----------------------------- */

export const FLEET = [
  { id: '43C105B2', store: 'dewanji smart home · Indore', kiosk: 'Guest Standee', region: 'IN-IND', online: true, ping: 12, res: '1080×1920', storage: 71, os: 'v4.2.1', credits: 49, uptime: '12d 4h', lastSeen: 'Now', mode: 'videogrid' },
  { id: '2F9A10C7', store: 'Radiance Fashion · Bhopal', kiosk: 'Lookbook TV', region: 'IN-BHO', online: true, ping: 18, res: '1920×1080', storage: 58, os: 'v4.2.1', credits: 76, uptime: '9d 2h', lastSeen: 'Now', mode: 'slideshow' },
  { id: '71DE33A1', store: 'Rajwada Couture · Ujjain', kiosk: 'Bridal Booth', region: 'IN-UJJ', online: true, ping: 24, res: '1080×1920', storage: 82, os: 'v4.2.0', credits: 31, uptime: '21d 0h', lastSeen: 'Now', mode: 'namaste' },
  { id: 'B4C7E905', store: 'Trendline Studio · Dewas', kiosk: 'Guest Standee', region: 'IN-DEW', online: false, ping: null, res: '1080×1920', storage: 64, os: 'v4.2.1', credits: 44, uptime: '—', lastSeen: '3h ago', mode: 'namaste' },
  { id: '80A2D11F', store: 'Urban Vastra · Neemuch', kiosk: 'Mall Kiosk A', region: 'IN-NEM', online: true, ping: 31, res: '1080×1920', storage: 90, os: 'v4.1.9', credits: 12, uptime: '30d 0h', lastSeen: 'Now', mode: 'videogrid' },
  { id: '5C3B8890', store: 'Silk & Minimal · Ujjain', kiosk: 'Wall Display', region: 'IN-UJJ', online: true, ping: 9, res: '1920×1080', storage: 47, os: 'v4.2.1', credits: 88, uptime: '6d 0h', lastSeen: 'Now', mode: 'slideshow' },
  { id: 'E91D72A8', store: 'Banaras Threads · Harda', kiosk: 'Guest Standee', region: 'IN-HAR', online: true, ping: 40, res: '1080×1920', storage: 55, os: 'v4.2.0', credits: 27, uptime: '17d 0h', lastSeen: 'Now', mode: 'videogrid' },
  { id: '06F4B312', store: 'Ayaram & Co. · Indore', kiosk: 'Fitting Booth', region: 'IN-IND', online: false, ping: null, res: '1080×1920', storage: 39, os: 'v4.2.1', credits: 61, uptime: '—', lastSeen: '1d ago', mode: 'namaste' },
  { id: '3DA8E0F5', store: 'Vastra Udyog · Ratlam', kiosk: 'Guest Standee', region: 'IN-RAT', online: true, ping: 50, res: '1080×1920', storage: 66, os: 'v4.2.1', credits: 19, uptime: '8d 0h', lastSeen: 'Now', mode: 'videogrid' },
  { id: '77C1F90B', store: 'Royal Weaves · Khargone', kiosk: 'Checkout TV', region: 'IN-KHA', online: true, ping: 22, res: '1920×1080', storage: 73, os: 'v4.2.1', credits: 54, uptime: '11d 0h', lastSeen: 'Now', mode: 'slideshow' },
  { id: '9B57E206', store: 'Meghdoot Fashions · Dewas', kiosk: 'Guest Standee', region: 'IN-DEW', online: false, ping: null, res: '1080×1920', storage: 81, os: 'v4.1.9', credits: 8, uptime: '—', lastSeen: '5h ago', mode: 'slideshow' },
  { id: '14A8C0E3', store: 'Nirmal Textiles · Mhow', kiosk: 'Display Standee', region: 'IN-MHO', online: true, ping: 16, res: '1080×1920', storage: 62, os: 'v4.2.1', credits: 47, uptime: '4d 0h', lastSeen: 'Now', mode: 'namaste' },
]

export const FW_RELEASES = [
  { name: 'v4.2.1', channel: 'Stable', notes: 'Stability · QR share latency fix · ticker caching', size: '186 MB', published: '12 Sep' },
  { name: 'v4.2.2-rc', channel: 'Release Candidate', notes: 'New slideshow fit engine · wake-on-LAN', size: '194 MB', published: '18 Sep' },
  { name: 'v4.3.0-beta', channel: 'Beta', notes: 'Offline queue · AI credit pooling preview', size: '201 MB', published: '22 Sep' },
]

export const FW_ROLLOUTS = [
  { id: 'fw01', name: 'v4.2.1 · stable', target: 12, done: 12, status: 'completed', window: '04:00 – 06:00', note: 'Full fleet on 4.2.1' },
  { id: 'fw02', name: 'v4.2.2-rc · pilot', target: 3, done: 1, status: 'running', window: '02:00 – 05:00', note: 'Pilot stores opted in' },
  { id: 'fw03', name: 'v4.3.0-beta · lab', target: 1, done: 0, status: 'scheduled', window: 'Sun 02:00', note: 'Lab kiosk 77C1F90B' },
]

export const POOL_DISTRIBUTORS = [
  { id: '43C105B2', store: 'dewanji smart home', balance: 49 },
  { id: '2F9A10C7', store: 'Radiance Fashion', balance: 76 },
  { id: '71DE33A1', store: 'Rajwada Couture', balance: 31 },
  { id: 'B4C7E905', store: 'Trendline Studio', balance: 44 },
  { id: '80A2D11F', store: 'Urban Vastra', balance: 12 },
  { id: '5C3B8890', store: 'Silk & Minimal', balance: 88 },
  { id: 'E91D72A8', store: 'Banaras Threads', balance: 27 },
  { id: '06F4B312', store: 'Ayaram & Co.', balance: 61 },
  { id: '3DA8E0F5', store: 'Vastra Udyog', balance: 19 },
]

export const CAMPAIGNS = [
  { id: 'c01', name: 'Spring Edit Launch', kind: 'Slideshow pack', slides: 8, grad: 'emerald', pushable: true },
  { id: 'c02', name: 'Bridal Week Marquee', kind: 'Ticker preset', slides: 4, grad: 'rose', pushable: true },
  { id: 'c03', name: 'Holistic Namaste Attract', kind: 'Intro screen', slides: 1, grad: 'violet', pushable: true },
  { id: 'c04', name: 'Video Grid Feeds v2', kind: 'Broadcast layout', slides: 2, grad: 'sky', pushable: true },
  { id: 'c05', name: 'Mega Offer Countdown', kind: 'Slideshow pack', slides: 6, grad: 'amber', pushable: true },
]

export const SYNDICATIONS = [
  { id: 'sy01', campaign: 'Spring Edit Launch', targets: 12, done: 12, status: 'completed', at: 'Today · 08:12', duration: '2m 05s' },
  { id: 'sy02', campaign: 'Bridal Week Marquee', targets: 4, done: 4, status: 'completed', at: 'Yesterday · 19:31', duration: '1m 02s' },
  { id: 'sy03', campaign: 'Mega Offer Countdown', targets: 125, done: 62, status: 'running', at: 'Today · 10:45', duration: 'ongoing' },
]