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
      e.target.textContent = this.splitByStatus ? 'Split by Status' : 'Combined';
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
        label: 'On Time',
        data: comboData.map(d => d.onTime),
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
        borderColor: '#22c55e',
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
        stack: 'stack',
        order: 2,
        barPercentage: 0.6
      });
      datasets.push({
        type: 'bar',
        label: 'Late',
        data: comboData.map(d => d.late),
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: '#ef4444',
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
        stack: 'stack',
        order: 2,
        barPercentage: 0.6
      });
    } else {
      datasets.push({
        type: 'bar',
        label: 'Total Count',
        data: comboData.map(d => d.total),
        backgroundColor: 'rgba(245, 158, 11, 0.6)',
        borderColor: '#f59e0b',
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
        order: 2,
        barPercentage: 0.6
      });
    }

    // Line — avg CS calls
    datasets.push({
      type: 'line',
      label: 'Avg CS Calls',
      data: comboData.map(d => d.avgCsCalls),
      borderColor: '#f59e0b',
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      borderWidth: 3,
      pointBackgroundColor: '#f59e0b',
      pointBorderColor: '#f59e0b',
      pointRadius: 6,
      pointHoverRadius: 9,
      fill: true,
      tension: 0.4,
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
            title: {
              display: true,
              text: 'Count',
              color: '#94a3b8',
              font: { size: 11 }
            }
          },
          y1: {
            beginAtZero: true,
            position: 'right',
            grid: { display: false },
            title: {
              display: true,
              text: 'Avg CS Calls',
              color: '#f59e0b',
              font: { size: 11 }
            },
            ticks: {
              color: '#f59e0b'
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
              font: { size: 12, weight: '500' }
            }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                if (ctx.dataset.yAxisID === 'y1') {
                  return ` Avg CS Calls: ${ctx.raw.toFixed(2)}`;
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
