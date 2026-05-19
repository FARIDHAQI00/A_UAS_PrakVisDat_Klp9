# 🎨 DESIGN.md — Visual Design System
> **E-Commerce Shipment Analytics Dashboard**
> Baca file ini sebelum menulis satu baris CSS atau HTML.

---

## 🧭 Design Philosophy

**Aesthetic Direction:** Dark Intelligence — Data Noir  
**Tagline:** "Data berat, tampilan ringan. Insight gelap, keputusan terang."

Inspirasi: Bloomberg Terminal tapi modern. Vercel Dashboard tapi lebih dramatis.  
Bukan corporate bland. Bukan neon cyberpunk. Tapi serius, elegan, dan informatif.

**3 Prinsip Utama:**
1. **Data First** — Setiap elemen visual mendukung data, bukan mengalihkan
2. **Progressive Disclosure** — Detail muncul saat dibutuhkan (hover, click)
3. **Consistent Motion** — Semua animasi punya durasi & easing yang sama

---

## 🎨 Color System

### Base Palette

```css
:root {
  /* === BACKGROUND LAYERS === */
  --bg-base:        #0a0e1a;   /* Background utama — paling gelap */
  --bg-surface:     #111827;   /* Card, panel */
  --bg-elevated:    #1a2235;   /* Dropdown, tooltip, modal */
  --bg-hover:       #1e2a40;   /* Hover state */
  --bg-border:      #2a3a52;   /* Garis pemisah, border */

  /* === TEXT === */
  --text-primary:   #f0f4ff;   /* Judul, angka penting */
  --text-secondary: #94a3b8;   /* Label, keterangan */
  --text-muted:     #475569;   /* Placeholder, disabled */
  --text-inverse:   #0a0e1a;   /* Teks di atas warna terang */

  /* === BRAND / ACCENT === */
  --accent-primary: #3b82f6;   /* Biru — elemen aktif, CTA, link */
  --accent-glow:    rgba(59, 130, 246, 0.15); /* Glow efek */

  /* === SEMANTIC (STATUS) === */
  --color-success:  #06d6a0;   /* On Time — hijau toska */
  --color-danger:   #e63946;   /* Late — merah dramatis */
  --color-warning:  #f59e0b;   /* Medium risk */
  --color-neutral:  #64748b;   /* Netral */

  /* === CHART COLORS === */
  --chart-1: #3b82f6;   /* Biru — seri utama */
  --chart-2: #06d6a0;   /* Toska — On Time */
  --chart-3: #e63946;   /* Merah — Late */
  --chart-4: #f59e0b;   /* Amber — highlight */
  --chart-5: #a78bfa;   /* Ungu — seri tambahan */
  --chart-6: #fb923c;   /* Oranye */
  --chart-7: #34d399;   /* Hijau muda */

  /* === WAREHOUSE COLORS (untuk heatmap) === */
  --warehouse-a: #3b82f6;
  --warehouse-b: #a78bfa;
  --warehouse-c: #06d6a0;
  --warehouse-d: #f59e0b;
  --warehouse-f: #e63946;
}
```

### Heatmap Color Scale

```css
/* Late rate: 0% → 50%+ */
--heat-0:  #0a0e1a;   /* 0%   — background */
--heat-1:  #1a2a4a;   /* 10%  */
--heat-2:  #1a3a6a;   /* 20%  */
--heat-3:  #8b3a4a;   /* 30%  */
--heat-4:  #c43b3b;   /* 40%  */
--heat-5:  #e63946;   /* 50%+ — merah penuh */
```

---

## 🔤 Typography

```css
:root {
  /* Font Families */
  --font-display:  'Plus Jakarta Sans', sans-serif;  /* Heading, card title */
  --font-body:     'Plus Jakarta Sans', sans-serif;  /* Body text, label */
  --font-mono:     'Space Mono', monospace;          /* Angka, kode, data */

  /* Font Sizes (Fluid Scale) */
  --text-xs:   0.75rem;    /* 12px — tooltip, badge */
  --text-sm:   0.875rem;   /* 14px — label, caption */
  --text-base: 1rem;       /* 16px — body */
  --text-lg:   1.125rem;   /* 18px — subheading */
  --text-xl:   1.25rem;    /* 20px — card title */
  --text-2xl:  1.5rem;     /* 24px — section heading */
  --text-3xl:  1.875rem;   /* 30px — page title */
  --text-4xl:  2.25rem;    /* 36px — hero number */
  --text-5xl:  3rem;       /* 48px — KPI besar */

  /* Font Weights */
  --weight-normal:    400;
  --weight-medium:    500;
  --weight-semibold:  600;
  --weight-bold:      700;
  --weight-extrabold: 800;

  /* Line Heights */
  --leading-tight:  1.25;
  --leading-normal: 1.5;
  --leading-loose:  1.75;

  /* Letter Spacing */
  --tracking-tight:  -0.025em;
  --tracking-normal:  0em;
  --tracking-wide:    0.05em;
  --tracking-widest:  0.15em;  /* Untuk label uppercase */
}
```

### Typography Usage Rules

| Element | Font | Size | Weight | Style |
|---------|------|------|--------|-------|
| Page Title | Plus Jakarta Sans | 3xl | 800 | tracking-tight |
| Section Heading | Plus Jakarta Sans | 2xl | 700 | - |
| Card Title | Plus Jakarta Sans | xl | 600 | - |
| Chart Label | Plus Jakarta Sans | sm | 500 | - |
| KPI Number | Space Mono | 5xl | 700 | tracking-tight |
| Sub-number | Space Mono | 2xl | 400 | - |
| Tooltip | Plus Jakarta Sans | xs | 400 | - |
| Badge/Tag | Plus Jakarta Sans | xs | 600 | tracking-widest, uppercase |
| Axis Tick | Space Mono | xs | 400 | - |

---

## 📐 Spacing & Layout

```css
:root {
  /* Spacing Scale */
  --space-1:  0.25rem;   /* 4px */
  --space-2:  0.5rem;    /* 8px */
  --space-3:  0.75rem;   /* 12px */
  --space-4:  1rem;      /* 16px */
  --space-5:  1.25rem;   /* 20px */
  --space-6:  1.5rem;    /* 24px */
  --space-8:  2rem;      /* 32px */
  --space-10: 2.5rem;    /* 40px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */

  /* Border Radius */
  --radius-sm:   4px;
  --radius-md:   8px;
  --radius-lg:   12px;
  --radius-xl:   16px;
  --radius-2xl:  24px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm:  0 1px 3px rgba(0,0,0,0.4);
  --shadow-md:  0 4px 16px rgba(0,0,0,0.5);
  --shadow-lg:  0 8px 32px rgba(0,0,0,0.6);
  --shadow-glow: 0 0 20px rgba(59,130,246,0.2);
  --shadow-card: 0 1px 0 rgba(255,255,255,0.05) inset,
                 0 4px 24px rgba(0,0,0,0.6);
}
```

### Grid Layout

```css
/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-6);
  padding: var(--space-8);
}

/* Chart sizing */
.chart-full    { grid-column: span 12; }  /* Full width */
.chart-half    { grid-column: span 6; }   /* 2 per row */
.chart-third   { grid-column: span 4; }   /* 3 per row */
.chart-quarter { grid-column: span 3; }   /* 4 per row */

/* Responsive breakpoints */
@media (max-width: 1200px) { .chart-half { grid-column: span 12; } }
@media (max-width: 768px)  { .chart-full { grid-column: span 12; } }
```

---

## 🧱 Component Specs

### Card (Chart Container)

```css
.chart-card {
  background: var(--bg-surface);
  border: 1px solid var(--bg-border);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-card);
  position: relative;
  overflow: hidden;
  transition: border-color 200ms ease;
}

.chart-card:hover {
  border-color: rgba(59, 130, 246, 0.3);
}

/* Top accent line */
.chart-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--accent-primary), transparent);
  opacity: 0;
  transition: opacity 300ms ease;
}

.chart-card:hover::before { opacity: 1; }

/* Card Header */
.chart-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-6);
}

.chart-card-title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--weight-semibold);
  color: var(--text-primary);
  line-height: var(--leading-tight);
}

.chart-card-subtitle {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-top: var(--space-1);
}
```

---

### KPI Stat Card

```css
/* Tampil di bagian atas dashboard */
.kpi-card {
  background: var(--bg-surface);
  border: 1px solid var(--bg-border);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.kpi-label {
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--text-muted);
}

.kpi-value {
  font-family: var(--font-mono);
  font-size: var(--text-5xl);
  font-weight: var(--weight-bold);
  color: var(--text-primary);
  line-height: 1;
}

.kpi-change {
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
}
.kpi-change.positive { color: var(--color-success); }
.kpi-change.negative { color: var(--color-danger); }
```

**4 KPI Cards yang ditampilkan:**
| Label | Value | Warna |
|-------|-------|-------|
| Total Shipments | 10,999 | text-primary |
| On Time Rate | 59.7% | color-success |
| Late Shipments | 4,436 | color-danger |
| Avg Customer Rating | 2.99 | color-warning |

---

### Tooltip

```css
.chart-tooltip {
  background: var(--bg-elevated);
  border: 1px solid var(--bg-border);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  box-shadow: var(--shadow-lg);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--text-primary);
  pointer-events: none;
  
  /* Arrow */
  position: relative;
}

.tooltip-title {
  font-weight: var(--weight-semibold);
  margin-bottom: var(--space-2);
  color: var(--text-secondary);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
}

.tooltip-row {
  display: flex;
  justify-content: space-between;
  gap: var(--space-6);
  margin-top: var(--space-1);
}

.tooltip-value {
  font-family: var(--font-mono);
  font-weight: var(--weight-bold);
  color: var(--text-primary);
}
```

---

### Filter Bar

```css
.filter-bar {
  background: var(--bg-surface);
  border: 1px solid var(--bg-border);
  border-radius: var(--radius-xl);
  padding: var(--space-4) var(--space-6);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  align-items: center;
  margin-bottom: var(--space-6);
  position: sticky;
  top: var(--space-4);
  z-index: 100;
  backdrop-filter: blur(8px);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.filter-label {
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  text-transform: uppercase;
  letter-spacing: var(--tracking-widest);
  color: var(--text-muted);
  white-space: nowrap;
}

/* Pill buttons */
.filter-pill {
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  border: 1px solid var(--bg-border);
  background: transparent;
  color: var(--text-secondary);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  cursor: pointer;
  transition: all 150ms ease;
}

.filter-pill:hover {
  border-color: var(--accent-primary);
  color: var(--text-primary);
}

.filter-pill.active {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
  color: white;
}

/* Data counter badge */
.filter-counter {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.filter-counter strong {
  color: var(--accent-primary);
}

/* Reset button */
.filter-reset {
  padding: var(--space-1) var(--space-4);
  border-radius: var(--radius-full);
  border: 1px solid var(--color-danger);
  background: transparent;
  color: var(--color-danger);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all 150ms ease;
}

.filter-reset:hover {
  background: var(--color-danger);
  color: white;
}
```

---

### Badge / Tag

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 2px var(--space-2);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  letter-spacing: var(--tracking-wide);
}

.badge-success { background: rgba(6, 214, 160, 0.15); color: var(--color-success); }
.badge-danger  { background: rgba(230, 57, 70, 0.15);  color: var(--color-danger); }
.badge-warning { background: rgba(245, 158, 11, 0.15); color: var(--color-warning); }
.badge-neutral { background: rgba(100, 116, 139, 0.15); color: var(--color-neutral); }
.badge-accent  { background: rgba(59, 130, 246, 0.15);  color: var(--accent-primary); }
```

---

## 🎬 Animation System

```css
/* === DURATION === */
--duration-fast:   150ms;
--duration-normal: 300ms;
--duration-slow:   600ms;
--duration-slower: 1000ms;

/* === EASING === */
--ease-in-out:  cubic-bezier(0.4, 0, 0.2, 1);
--ease-out:     cubic-bezier(0, 0, 0.2, 1);
--ease-in:      cubic-bezier(0.4, 0, 1, 1);
--ease-spring:  cubic-bezier(0.34, 1.56, 0.64, 1);  /* Untuk pop-in */
--ease-bounce:  cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Keyframes Library

```css
/* Fade + slide up (untuk card, tooltip) */
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Fade in (untuk overlay) */
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* Grow from bottom (untuk bar chart) */
@keyframes growUp {
  from { transform: scaleY(0); transform-origin: bottom; }
  to   { transform: scaleY(1); transform-origin: bottom; }
}

/* Number count up (untuk KPI) */
@keyframes countUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Pulse glow (untuk aktif state) */
@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0); }
  50%       { box-shadow: 0 0 0 6px rgba(59,130,246,0.2); }
}

/* Staggered reveal (untuk list items) */
.stagger-child:nth-child(1) { animation-delay: 0ms; }
.stagger-child:nth-child(2) { animation-delay: 80ms; }
.stagger-child:nth-child(3) { animation-delay: 160ms; }
.stagger-child:nth-child(4) { animation-delay: 240ms; }
.stagger-child:nth-child(5) { animation-delay: 320ms; }
```

### Animation Rules
- **Page Load:** Cards fade-slide-up dengan stagger 80ms antar card
- **Chart Draw:** Durasi 600ms, ease-out — tidak boleh bounce untuk data chart
- **Tooltip:** 150ms fade — harus cepat, tidak boleh lag
- **Filter Change:** 300ms re-render — smooth transition data
- **KPI Numbers:** Count-up animation 800ms dengan `requestAnimationFrame`
- **Hover State:** 150ms — harus instant terasa

---

## 🖥️ Page Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER                                                          │
│  📦 Shipment Analytics     [subtitle]          [Date: May 2026] │
├─────────────────────────────────────────────────────────────────┤
│  KPI ROW (4 cards, grid-cols-4)                                  │
│  [Total: 10,999]  [On Time: 59.7%]  [Late: 4,436]  [Avg★: 2.99]│
├─────────────────────────────────────────────────────────────────┤
│  FILTER BAR (sticky)                                             │
│  Mode | Warehouse | Importance | Status | Weight Range | Reset  │
├──────────────────────────┬──────────────────────────────────────┤
│  VIZ 1: Donut (col-4)   │  VIZ 2: Grouped Bar (col-8)         │
│  Delivery Status         │  Moda Pengiriman vs Status           │
├──────────────────────────┴──────────────────────────────────────┤
│  VIZ 3: Heatmap (col-12 full width)                             │
│  Warehouse Block × Mode of Shipment                             │
├──────────────────────────────────┬──────────────────────────────┤
│  VIZ 4: Scatter (col-6)          │  VIZ 5: Histogram (col-6)   │
│  Cost vs Discount                │  Weight Distribution         │
├──────────────────────────────────┴──────────────────────────────┤
│  VIZ 6: Radar (col-5)    │  VIZ 7: Combo Bar+Line (col-7)     │
│  Customer Profile         │  CS Calls vs Rating                │
├──────────────────────────┴──────────────────────────────────────┤
│  INSIGHT SECTION                                                 │
│  Ringkasan 3 insight utama dalam card                           │
├─────────────────────────────────────────────────────────────────┤
│  FOOTER                                                          │
│  Dataset: Kaggle | © 2026 | Nama & NIM                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Chart.js Global Config

```javascript
// Paste di main.js — berlaku untuk semua Chart.js chart
Chart.defaults.color = '#94a3b8';              // text-secondary
Chart.defaults.borderColor = '#2a3a52';        // bg-border
Chart.defaults.font.family = 'Plus Jakarta Sans';
Chart.defaults.font.size = 12;

// Plugin defaults
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.pointStyleWidth = 8;
Chart.defaults.plugins.legend.labels.padding = 16;

Chart.defaults.plugins.tooltip.backgroundColor = '#1a2235';
Chart.defaults.plugins.tooltip.borderColor = '#2a3a52';
Chart.defaults.plugins.tooltip.borderWidth = 1;
Chart.defaults.plugins.tooltip.padding = 12;
Chart.defaults.plugins.tooltip.titleColor = '#94a3b8';
Chart.defaults.plugins.tooltip.bodyColor = '#f0f4ff';
Chart.defaults.plugins.tooltip.titleFont = { size: 11, weight: '600' };
Chart.defaults.plugins.tooltip.bodyFont = { family: 'Space Mono', size: 13 };
Chart.defaults.plugins.tooltip.cornerRadius = 8;
Chart.defaults.plugins.tooltip.displayColors = true;
Chart.defaults.plugins.tooltip.boxPadding = 4;
```

---

## 📱 Responsive Breakpoints

```css
/* Breakpoints */
--bp-sm:  640px;   /* Mobile landscape */
--bp-md:  768px;   /* Tablet portrait */
--bp-lg:  1024px;  /* Tablet landscape / small laptop */
--bp-xl:  1280px;  /* Desktop */
--bp-2xl: 1536px;  /* Wide desktop */

/* Strategy:
   - Desktop first (dashboard dirancang untuk layar lebar)
   - Chart height: auto pada mobile, fixed pada desktop
   - Filter bar: collapse to accordion pada mobile
   - KPI cards: 2×2 grid pada tablet, 4×1 pada desktop
*/
```

---

## ✅ Design Checklist untuk AI Agent

Sebelum generate kode, pastikan:

- [ ] Gunakan CSS variables — JANGAN hardcode warna
- [ ] Semua font menggunakan variabel `--font-display`, `--font-mono`
- [ ] Semua spacing menggunakan variabel `--space-*`
- [ ] Animasi menggunakan variabel `--duration-*` dan `--ease-*`
- [ ] Tooltip konsisten style di semua chart (gunakan Chart.js global defaults)
- [ ] Setiap chart punya `chart-card` wrapper
- [ ] Filter bar bekerja dengan `CustomEvent('filterChange')`
- [ ] Tidak ada warna hardcode di luar tokens.css
- [ ] Tidak ada font Inter, Roboto, atau Arial
- [ ] Background selalu `--bg-base` atau `--bg-surface`

---

*File ini adalah single source of truth untuk design. Jangan deviasi tanpa alasan kuat.*
