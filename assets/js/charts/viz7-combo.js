/**
 * VIZ 7 — Combo Chart: Customer Care Calls vs Rating
 * Library: Chart.js (mixed type)
 */

const ComboChart = {
  chart: null,
  ctx: null,
  splitByStatus: true,

  init() {
    this.ctx = document.getElementById('chart-combo').getContext('2d');
    this.render();
    document.addEventListener('filterChange', () => this.render());

    document.getElementById('viz7-toggle-split')?.addEventListener('click', (e) => {
      this.splitByStatus = !this.splitByStatus;
      e.target.classList.toggle('active', this.splitByStatus);
      e.target.textContent = this.splitByStatus ? 'Pisah Berdasarkan Status' : 'Gabung';
      this.render();
    });

    document.getElementById('viz7-mode-filter')?.addEventListener('change', () => this.render());
    document.getElementById('viz7-warehouse-filter')?.addEventListener('change', () => this.render());
  },

  render() {
    // Apply local filters
    const modeFilter = document.getElementById('viz7-mode-filter')?.value || 'All';
    const warehouseFilter = document.getElementById('viz7-warehouse-filter')?.value || 'All';
    
    let data = DataManager.filteredData;
    if (modeFilter !== 'All') data = data.filter(r => r.Mode_of_Shipment === modeFilter);
    if (warehouseFilter !== 'All') data = data.filter(r => r.Warehouse_block === warehouseFilter);

    const comboData = DataManager.getComboData(data);
    const labels = comboData.map(d => `★ ${d.rating}`);

    if (this.chart) this.chart.destroy();

    const datasets = [];
    
    if (this.splitByStatus) {
      datasets.push({
        type: 'bar',
        label: 'Tepat Waktu',
        data: comboData.map(d => d.onTime),
        backgroundColor: 'rgba(34, 197, 94, 0.75)',
        borderColor: '#22c55e',
        borderWidth: 1.5,
        borderRadius: 6,
        borderSkipped: false,
        stack: 'stack',
        order: 2,
        barPercentage: 0.65
      });
      datasets.push({
        type: 'bar',
        label: 'Terlambat',
        data: comboData.map(d => d.late),
        backgroundColor: 'rgba(239, 68, 68, 0.75)',
        borderColor: '#ef4444',
        borderWidth: 1.5,
        borderRadius: 6,
        borderSkipped: false,
        stack: 'stack',
        order: 2,
        barPercentage: 0.65
      });
    } else {
      datasets.push({
        type: 'bar',
        label: 'Total Jumlah',
        data: comboData.map(d => d.total),
        backgroundColor: 'rgba(99, 179, 237, 0.55)',
        borderColor: '#63b3ed',
        borderWidth: 1.5,
        borderRadius: 6,
        borderSkipped: false,
        order: 2,
        barPercentage: 0.65
      });
    }

    // Line — avg CS calls
    datasets.push({
      type: 'line',
      label: 'Rata-rata Panggilan CS',
      data: comboData.map(d => d.avgCsCalls),
      borderColor: '#f97316',
      backgroundColor: 'rgba(249, 115, 22, 0.08)',
      borderWidth: 3,
      pointBackgroundColor: '#f97316',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 7,
      pointHoverRadius: 10,
      fill: false,
      tension: 0.35,
      yAxisID: 'y1',
      order: 1
    });

    this.chart = new Chart(this.ctx, {
      type: 'bar',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 600,
          easing: 'easeOutCubic'
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: '#a1a1aa',
              font: { size: 13, weight: '600' }
            }
          },
          y: {
            beginAtZero: true,
            position: 'left',
            grid: {
              color: 'rgba(39, 39, 42, 0.7)',
              drawBorder: false
            },
            ticks: {
              color: '#a1a1aa',
              callback: (val) => val.toLocaleString()
            },
            title: {
              display: true,
              text: 'Jumlah',
              color: '#a1a1aa',
              font: { size: 11 }
            }
          },
          y1: {
            beginAtZero: true,
            position: 'right',
            grid: { display: false },
            ticks: {
              color: '#f97316',
              font: { size: 11 }
            },
            title: {
              display: true,
              text: 'Rata-rata Panggilan CS',
              color: '#f97316',
              font: { size: 11 }
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              usePointStyle: true,
              pointStyleWidth: 10,
              padding: 16,
              color: '#e4e4e7',
              font: { size: 12, weight: '500' }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(24, 24, 27, 0.95)',
            borderColor: 'rgba(63, 63, 70, 0.8)',
            borderWidth: 1,
            titleColor: '#a1a1aa',
            bodyColor: '#e4e4e7',
            callbacks: {
              label: (ctx) => {
                if (ctx.dataset.yAxisID === 'y1') {
                  return ` Rata-rata Panggilan CS: ${ctx.raw.toFixed(2)}`;
                }
                return ` ${ctx.dataset.label}: ${parseInt(ctx.raw).toLocaleString()}`;
              }
            }
          }
        }
      }
    });
  }
};
