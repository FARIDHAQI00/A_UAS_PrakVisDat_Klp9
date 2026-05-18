# 📦 E-Commerce Shipment Analytics — Interactive Dashboard
> **AI Agent Planning README** | UAS Praktikum Visualisasi Data 2025/2026

---

## 🗂️ Project Overview

| Field | Detail |
|-------|--------|
| **Nama Proyek** | E-Commerce Shipment Analytics Dashboard |
| **Dataset** | `Train_preprocessed.csv` — E-Commerce Shipping Dataset (Kaggle) |
| **Total Rows** | 10.999 baris |
| **Total Kolom** | 14 kolom |
| **Topik** | E-Commerce / Logistik / Supply Chain |
| **Deadline** | 20 Mei 2026 |
| **Tools** | HTML + CSS + JavaScript (D3.js / Chart.js / PapaParse) |

---

## 📊 Dataset Schema

```
Train_preprocessed.csv
│
├── ID                   → integer  | ID unik tiap produk
├── Warehouse_block      → string   | Blok gudang: A, B, C, D, F
├── Mode_of_Shipment     → string   | Ship, Flight, Road
├── Customer_care_calls  → integer  | Jumlah panggilan ke CS (2–7)
├── Customer_rating      → integer  | Rating pelanggan (1–5)
├── Cost_of_the_Product  → integer  | Harga produk
├── Prior_purchases      → integer  | Riwayat pembelian sebelumnya
├── Product_importance   → string   | low / medium / high
├── Gender               → string   | F / M
├── Discount_offered     → integer  | Diskon yang diberikan (1–65%)
├── Weight_in_gms        → integer  | Berat produk dalam gram
├── Delivery_Status      → string   | On Time / Late   ← TARGET UTAMA
├── Weight_Category      → string   | Very Light / Light / Medium / Heavy (engineered)
└── Discount_Category    → string   | Low / Medium / High / Very High (engineered)
```

---

## 🎯 Key Business Questions (Data Story Arc)

Dashboard menceritakan satu narasi analitik yang kohesif:

> **"Apa yang menyebabkan keterlambatan pengiriman, dan bagaimana pola distribusinya?"**

1. Berapa besar proporsi pengiriman terlambat vs tepat waktu?
2. Moda pengiriman mana yang paling sering terlambat?
3. Apakah diskon tinggi berhubungan dengan keterlambatan?
4. Gudang mana yang paling berisiko?
5. Bagaimana distribusi berat terhadap status pengiriman?
6. Bagaimana profil pelanggan yang terkena dampak?
7. Apakah rating pelanggan berkorelasi dengan jumlah komplain?

---

## 📁 Struktur File Project

```
project/
│
├── README.md                   ← File ini (baca pertama kali)
├── DESIGN.md                   ← Design system & visual spec lengkap
│
├── index.html                  ← Main dashboard (semua viz dalam satu halaman)
│
├── assets/
│   ├── css/
│   │   ├── tokens.css          ← Design tokens (warna, font, spacing, radius)
│   │   ├── components.css      ← Card, badge, tooltip, filter styles
│   │   └── animations.css      ← Keyframes & transitions library
│   │
│   └── js/
│       ├── data.js             ← Load & parse CSV, semua transformasi data
│       ├── filters.js          ← Global filter state management (reactive)
│       ├── charts/
│       │   ├── viz1-donut.js          → Delivery Status Overview
│       │   ├── viz2-grouped-bar.js    → Shipment Mode vs Status
│       │   ├── viz3-heatmap.js        → Warehouse × Mode Heatmap
│       │   ├── viz4-scatter.js        → Cost vs Discount Scatter
│       │   ├── viz5-histogram.js      → Weight Distribution
│       │   ├── viz6-radar.js          → Customer Profile Radar
│       │   └── viz7-combo.js          → CS Calls vs Rating Combo
│       └── main.js             ← Init semua chart, event orchestration
│
└── data/
    └── Train_preprocessed.csv  ← Dataset utama
```

---

## 🧩 Spesifikasi 7 Visualisasi Interaktif

### VIZ 1 — Donut Chart: Delivery Status Overview
```
Tipe     : Donut Chart dengan animated center counter
Data     : Delivery_Status (On Time: 6563 | Late: 4436)
Library  : Chart.js
Insight  : 59.7% tepat waktu, 40.3% terlambat — 1 dari 2.5 paket terlambat

Interaktivitas:
  ✅ Hover → tooltip (jumlah + persentase)
  ✅ Click segment → filter semua chart lain secara global
  ✅ Animated draw-in saat pertama load (easeInOutQuart)
  ✅ Center text dinamis: total + label status aktif
  ✅ Legend click → toggle visibility segment
```

---

### VIZ 2 — Grouped Bar Chart: Moda Pengiriman vs Status
```
Tipe     : Grouped Bar Chart (vertikal)
Data     : Mode_of_Shipment × Delivery_Status
           Ship: On Time 4452 | Late 3010
           Flight: On Time 1054 | Late 723
           Road: On Time 1057 | Late 703
Library  : Chart.js
Insight  : Ship dominan tapi late rate merata di semua moda (~40%)

Interaktivitas:
  ✅ Hover bar → tooltip (count + persentase dari mode)
  ✅ Toggle button: "Count" vs "Percentage" view
  ✅ Sort dropdown: by name / by late count / by late rate
  ✅ Bar animasi slide up dari bawah
  ✅ Click bar → filter chart lain
```

---

### VIZ 3 — Heatmap: Warehouse Block × Mode of Shipment
```
Tipe     : Heatmap (matrix 5×3 = 15 cells)
Data     : Warehouse_block (A,B,C,D,F) × Mode_of_Shipment × Late rate %
Library  : D3.js
Insight  : Blok F + Ship: volume tertinggi & late rate signifikan

Interaktivitas:
  ✅ Hover cell → tooltip (late count, total, late rate %)
  ✅ Color scale: #1a1a2e (rendah) → #e63946 (tinggi)
  ✅ Toggle: tampilkan nilai % di dalam cell
  ✅ Click cell → filter scatter & histogram
  ✅ Animated cell reveal saat load (staggered)
```

---

### VIZ 4 — Scatter Plot: Cost of Product vs Discount Offered
```
Tipe     : Scatter Plot dengan color + shape encoding
Data     : Cost_of_the_Product (x-axis) × Discount_offered (y-axis)
Color    : On Time = #06d6a0 (hijau), Late = #e63946 (merah)
Library  : D3.js
Insight  : Diskon >30% hampir selalu = Late. Produk murah + diskon tinggi = paling berisiko.

Interaktivitas:
  ✅ Hover point → tooltip (ID, cost, discount, status, mode, warehouse)
  ✅ Brush selection (d3.brush) → highlight & show selected count
  ✅ Zoom + pan (d3.zoom, scroll to zoom)
  ✅ Toggle On Time / Late visibility
  ✅ Opacity slider: atur transparansi titik (untuk daerah padat)
  ✅ Quadrant lines: garis median cost & median discount
```

---

### VIZ 5 — Histogram: Distribusi Berat Produk
```
Tipe     : Overlapping Histogram + density curve
Data     : Weight_in_gms (range 1001–7846), split by Delivery_Status
Library  : D3.js
Insight  : Berat 4000–6000g (Medium) paling dominan & paling sering terlambat

Interaktivitas:
  ✅ Hover bin → tooltip (range berat, count per status, total, late %)
  ✅ Bin slider: atur jumlah bin (10–50 bins, default 20)
  ✅ Toggle: On Time / Late / Both
  ✅ Animasi bars grow dari baseline saat load
  ✅ Vertical reference line: rata-rata berat per status
```

---

### VIZ 6 — Radar Chart: Customer Profile Comparison
```
Tipe     : Radar / Spider Chart (2 area overlay)
Data     : 5 dimensi dinormalisasi 0–1:
           - Avg Customer_rating
           - Avg Customer_care_calls  
           - Avg Prior_purchases
           - Avg Cost_of_the_Product
           - Avg Discount_offered
Group    : On Time (biru) vs Late (merah)
Library  : Chart.js
Insight  : Pelanggan Late: CS calls lebih tinggi, rating lebih rendah, diskon lebih tinggi

Interaktivitas:
  ✅ Hover axis label → tooltip nilai aktual (bukan normalized)
  ✅ Toggle per group dengan animasi fill
  ✅ Click axis → sort tabel ringkasan di bawah chart
  ✅ Animated fill sweep saat load
```

---

### VIZ 7 — Combo Chart: Customer Care Calls vs Rating
```
Tipe     : Bar Chart (distribusi rating) + Line overlay (avg CS calls)
Data     : Customer_rating (1–5) × count per status,
           Line: avg Customer_care_calls per rating level
Library  : Chart.js (mixed type)
Insight  : Rating 1 = avg 5.3 CS calls. Rating 5 = avg 2.8 CS calls. Keterlambatan → komplain lebih banyak.

Interaktivitas:
  ✅ Hover → tooltip dual (bar count + line value)
  ✅ Filter dropdown: by Mode_of_Shipment
  ✅ Filter dropdown: by Warehouse_block  
  ✅ Toggle: split by Delivery_Status (stacked) vs combined
  ✅ Animasi bar + line draw simultaneously
```

---

## 🔧 Global Filter System

Filter yang berlaku global (mempengaruhi semua chart sekaligus):

```
┌─────────────────────────────────────────────────────────────┐
│  🔍 FILTER DATA                              [RESET ALL]     │
│                                                              │
│  Mode of Shipment   [All ▼] [Ship] [Flight] [Road]          │
│  Warehouse Block    [All ▼] [A] [B] [C] [D] [F]             │
│  Product Importance [All ▼] [Low] [Medium] [High]           │
│  Delivery Status    [All ▼] [On Time] [Late]                 │
│  Weight (gms)       [====●============] 1001 — 7846         │
│                                                              │
│  Menampilkan  ████ 10.999 / 10.999 data                     │
└─────────────────────────────────────────────────────────────┘
```

Implementasi:
- `filterState` object di `filters.js` — single source of truth
- Event: `filterChange` → broadcast ke semua chart (CustomEvent)
- Badge: counter animasi update saat filter berubah
- Transition: chart re-render dengan 300ms ease transition

---

## 🧠 Insight Summary (untuk Laporan BAB III)

| # | Visualisasi | Insight Utama |
|---|-------------|---------------|
| 1 | Donut | 40.3% pengiriman terlambat — masalah serius yang perlu diatasi |
| 2 | Grouped Bar | Semua moda punya late rate ~40% — masalah sistemik, bukan moda spesifik |
| 3 | Heatmap | Blok F mendominasi volume (33%) — bottleneck operasional |
| 4 | Scatter | Diskon >30% → hampir pasti terlambat (overselling / overworked logistics) |
| 5 | Histogram | Produk 4–6kg paling dominan; berat ekstrem (<2kg, >6kg) jarang terlambat |
| 6 | Radar | Pelanggan terdampak late: CS calls +1.2x lebih banyak, rating turun 0.3 poin |
| 7 | Combo | Rating 1 → 5.3 CS calls rata-rata; setiap 1 poin turun rating = +0.6 CS calls |

---

## 📦 Dependencies (CDN — Tidak Perlu Install)

```html
<!-- Chart.js untuk Donut, Bar, Radar, Combo -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>

<!-- D3.js untuk Heatmap, Scatter, Histogram -->
<script src="https://d3js.org/d3.v7.min.js"></script>

<!-- PapaParse untuk baca CSV langsung di browser -->
<script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"></script>

<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
```

---

## 🚀 Cara Menjalankan

```bash
# WAJIB jalankan via HTTP server (fetch CSV perlu protocol HTTP)

# Opsi 1: VSCode Live Server
# Klik kanan index.html → "Open with Live Server"

# Opsi 2: Python
python -m http.server 8000
# Buka: http://localhost:8000

# Opsi 3: Node.js
npx serve .
```

> ⚠️ **Jangan** buka HTML langsung via double-click — CSV tidak akan terbaca.

---

## 📋 Checklist UAS Completion

### Visualisasi (30% bobot)
- [ ] VIZ 1: Donut Chart ✅
- [ ] VIZ 2: Grouped Bar Chart ✅
- [ ] VIZ 3: Heatmap ✅
- [ ] VIZ 4: Scatter Plot ✅
- [ ] VIZ 5: Histogram ✅
- [ ] VIZ 6: Radar Chart ✅
- [ ] VIZ 7: Combo Chart ✅

### Interaktivitas (20% bobot)
- [ ] Hover tooltip semua chart ✅
- [ ] Global filter system ✅
- [ ] Dropdown filter ✅
- [ ] Animasi load ✅
- [ ] Click-to-filter cross-chart ✅

### Preprocessing (20% bobot)
- [ ] Missing value dihapus ✅
- [ ] Duplikat dihapus ✅
- [ ] Feature engineering: Weight_Category ✅
- [ ] Feature engineering: Discount_Category ✅

### Insight (15% bobot)
- [ ] Insight per visualisasi ✅ (lihat tabel di atas)
- [ ] Narasi kohesif ✅

### Kreativitas Desain (10% bobot)
- [ ] Tema konsisten ✅ (dark modern, lihat DESIGN.md)
- [ ] Typography kuat ✅
- [ ] Color system ✅
- [ ] Animasi micro-interaction ✅

---

*Untuk spesifikasi visual detail: baca **DESIGN.md***
*Untuk implementasi kode: ikuti struktur folder di atas*
