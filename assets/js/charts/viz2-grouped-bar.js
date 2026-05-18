/**
 * VIZ 2 — Grouped Bar Chart: Moda Pengiriman vs Status
 * Library: Chart.js
 */

const GroupedBarChart = {
  chart: null,
  ctx: null,
  viewMode: 'count', // 'count' or 'percentage'

  init() {
    this.ctx = document.getElementById('chart-grouped-bar').getContext('2d');
    this.render();
    document.addEventListener('filterChange', () => this.render());

    // Toggle buttons
    document.getElementById('viz2-count-btn')?.addEventListener('click', () => {
      this.viewMode = 'count';
      document.getElementById('viz2-count-btn').classList.add('active');
      document.getElementById('viz2-pct-btn').classList.remove('active');
      this.render();
    });
    document.getElementById('viz2-pct-btn')?.addEventListener('click', () => {
      this.viewMode = 'percentage';
      document.getElementById('viz2-pct-btn').classList.add('active');
      document.getElementById('viz2-count-btn').classList.remove('active');
      this.render();
    });

    // Sort dropdown
    document.getElementById('viz2-sort')?.addEventListener('change', () => this.render());
  },

  render() {
    let modeData = DataManager.getModeStatusCounts();

    // Sort
    const sortBy = document.getElementById('viz2-sort')?.value || 'name';
    if (sortBy === 'late-count') modeData.sort((a, b) => b.late - a.late);
    else if (sortBy === 'late-rate') modeData.sort((a, b) => (b.late / b.total) - (a.late / a.total));
    else modeData.sort((a, b) => a.mode.localeCompare(b.mode));

    const labels = modeData.map(d => d.mode);
    let onTimeVals, lateVals;

    if (this.viewMode === 'percentage') {
      onTimeVals = modeData.map(d => d.total > 0 ? (d.onTime / d.total * 100).toFixed(1) : 0);
      lateVals = modeData.map(d => d.total > 0 ? (d.late / d.total * 100).toFixed(1) : 0);
    } else {
      onTimeVals = modeData.map(d => d.onTime);
      lateVals = modeData.map(d => d.late);
    }

    if (this.chart) this.chart.destroy();

    this.chart = new Chart(this.ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'On Time',
            data: onTimeVals,
            backgroundColor: '#22c55e',
            borderRadius: 6,
            borderSkipped: false,
            barPercentage: 0.7,
            categoryPercentage: 0.6
          },
          {
            label: 'Late',
            data: lateVals,
            backgroundColor: '#ef4444',
            borderRadius: 6,
            borderSkipped: false,
            barPercentage: 0.7,
            categoryPercentage: 0.6
          }
        ]
      },
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
            grid: {
              color: 'rgba(39, 39, 42, 0.7)',
              drawBorder: false
            },
            ticks: {
              callback: (val) => this.viewMode === 'percentage' ? val + '%' : val.toLocaleString()
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
                const mode = labels[ctx.dataIndex];
                const md = modeData[ctx.dataIndex];
                if (this.viewMode === 'percentage') {
                  return ` ${ctx.dataset.label}: ${ctx.raw}%`;
                }
                const pct = md.total > 0 ? ((ctx.raw / md.total) * 100).toFixed(1) : 0;
                return ` ${ctx.dataset.label}: ${parseInt(ctx.raw).toLocaleString()} (${pct}%)`;
              }
            }
          }
        },
        onClick: (e, elements) => {
          if (elements.length > 0) {
            const idx = elements[0].datasetIndex;
            const status = idx === 0 ? 'On Time' : 'Late';
            FilterManager.setFilter('status', status);
          }
        }
      }
    });
  }
};
