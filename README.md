# E-Commerce Shipment Analytics Dashboard 📦✨

Sebuah dashboard analitik interaktif bertema *Dark Luxury* yang dirancang untuk memvisualisasikan dan menganalisis data pengiriman e-commerce. Proyek ini dikembangkan sebagai pemenuhan Tugas Akhir / Ujian Akhir Semester (UAS) Praktikum Visualisasi Data.

## Kelompok 9 - Kelas A

Proyek ini dikembangkan oleh 4 orang anggota:

1. **Keiveen Aldiandra** (2408107010085)
2. **M Abid Rahmatillahh Z** (2408107010090)
3. **T Farid Haqi** (2408107010091)
4. **Muhammad Sulthan Shadiq** (2408107010104)

## Fitur Utama

Dashboard ini menampilkan 7 visualisasi data interaktif menggunakan library **ApexCharts**, dengan desain antarmuka modern, *glassmorphism*, dan animasi yang mulus.

1. **Revenue by Shipment Mode (Donut Chart)** - Analisis proporsi pendapatan berdasarkan mode pengiriman (Flight, Ship, Road).
2. **Ratings by Product Category (Grouped Bar Chart)** - Perbandingan rata-rata rating pelanggan untuk setiap kategori produk dan gender.
3. **Warehouse Block vs Mode of Shipment (Heatmap)** - Distribusi jumlah pengiriman berdasarkan blok gudang dan metode pengiriman.
4. **Cost vs Discount (Scatter Plot)** - Korelasi antara harga produk dan diskon yang diberikan, dengan informasi tambahan berat barang.
5. **Customer Rating Distribution (Histogram)** - Distribusi frekuensi rating yang diberikan oleh pelanggan (skala 1-5).
6. **Performance Metrics (Radar Chart)** - Analisis metrik kinerja (Ketepatan waktu, Kepentingan barang, Rating, dll).
7. **Volume vs Revenue Trend (Combo Chart)** - Tren kombinasi antara volume pengiriman (Bar Chart) dan total pendapatan (Line Chart) per kategori produk.

## Teknologi yang Digunakan

- **HTML5** - Struktur utama halaman web.
- **Vanilla CSS (CSS3)** - Styling dengan tema *Dark Luxury* (warna amber/emas), *CSS Variables*, Flexbox/Grid, dan *Micro-animations*.
- **Vanilla JavaScript (ES6)** - Logika utama, manipulasi DOM, dan pengelolaan data statis.
- **[Chart.js](https://www.chartjs.org/) & [D3.js](https://d3js.org/)** - Library visualisasi data yang interaktif dan responsif, sesuai dengan ketentuan yang membolehkan penggunaan D3.js.
- **[Phosphor Icons](https://phosphoricons.com/)** - Ikon SVG premium yang terintegrasi pada antarmuka.

## Struktur Direktori

```text
A_UAS_PrakVisDat_Klp9/
├── index.html                 # Halaman utama dashboard
├── README.md                  # Dokumentasi proyek ini
├── Laporan_Progres_Mingguan_UAS_kel9.pdf # Laporan progres mingguan
├── assets/
│   ├── css/
│   │   ├── style.css          # File CSS utama
│   │   ├── tokens.css         # Variabel warna & tema (Design System)
│   │   ├── components.css     # Styling komponen spesifik (card, layout)
│   │   └── animations.css     # Animasi transisi & keyframes
│   └── js/
│       ├── main.js            # Inisialisasi utama dan logika dashboard
│       ├── data.js            # Dataset statis untuk visualisasi
│       └── charts/            # Konfigurasi individu untuk setiap chart
│           ├── viz1-donut.js
│           ├── viz2-grouped-bar.js
│           ├── viz3-heatmap.js
│           ├── viz4-scatter.js
│           ├── viz5-histogram.js
│           ├── viz6-radar.js
│           └── viz7-combo.js
```

## Cara Menjalankan (Setup)

Karena proyek ini menggunakan HTML, CSS, dan JS murni (tanpa framework/bundler khusus), Anda dapat menjalankannya dengan sangat mudah:

1. **Clone/Download** repository/folder ini ke komputer lokal Anda.
2. Buka folder `A_UAS_PrakVisDat_Klp9`.
3. Anda dapat langsung membuka file `index.html` menggunakan browser pilihan Anda (Google Chrome, Mozilla Firefox, dll).
   * **Atau (Sangat Direkomendasikan):** Gunakan ekstensi **Live Server** di VS Code agar *hot-reload* aktif saat ada perubahan file, serta menghindari isu CORS jika di kemudian hari menggunakan fetch API.
     - Klik kanan pada `index.html` -> Pilih *"Open with Live Server"*.
4. Dashboard akan terbuka di `http://127.0.0.1:5500`.

## Tema & Desain (Dark Luxury)

Proyek ini tidak menggunakan Tailwind CSS atau framework CSS lainnya, melainkan mengandalkan arsitektur *Vanilla CSS* yang rapi. Kami menerapkan:
- **Root Variables (`tokens.css`)**: Mengatur palet warna dominan (Hitam, Abu-abu gelap, dan aksen *Amber/Gold*).
- **Glassmorphism Effect**: Penggunaan `backdrop-filter: blur()` dipadukan dengan border transparan dan shadow halus untuk panel/kartu.
- **Responsive Design**: Menggunakan CSS Grid & Flexbox untuk memastikan tampilan menyesuaikan dari layar laptop hingga monitor ultrawide.

---