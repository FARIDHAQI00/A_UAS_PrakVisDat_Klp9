/**
 * VIZ 1 — Donut Chart: Delivery Status Overview
 * Library: Chart.js
 */

const DonutChart = {
  chart: null,
  ctx: null,

  init() {
    this.ctx = document.getElementById('chart-donut').getContext('2d');
    this.render();
    document.addEventListener('filterChange', () => this.render());
  },

  render() {
    const stats = DataManager.getDeliveryStatusCounts();
    
    if (this.chart) this.chart.destroy();

    // Center text plugin
    const centerTextPlugin = {
      id: 'centerText',
      afterDraw: (chart) => {
        const { ctx, chartArea: { top, bottom, left, right } } = chart;
        const centerX = (left + right) / 2;
        const centerY = (top + bottom) / 2;

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Total number
        ctx.font = `700 28px 'Space Mono', monospace`;
        ctx.fillStyle = '#fafaf9';
        ctx.fillText(stats.total.toLocaleString(), centerX, centerY - 10);

        // Label
        ctx.font = `600 11px 'Plus Jakarta Sans', sans-serif`;
        ctx.fillStyle = '#52525b';
        ctx.fillText('TOTAL PENGIRIMAN', centerX, centerY + 14);
        ctx.restore();
      }
    };

    this.chart = new Chart(this.ctx, {
      type: 'doughnut',
      data: {
        labels: ['Tepat Waktu', 'Terlambat'],
        datasets: [{
          data: [stats.onTime, stats.late],
          backgroundColor: [
            '#22c55e',
            '#ef4444'
          ],
          borderColor: 'transparent',
          borderWidth: 0,
          hoverOffset: 8,
          spacing: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '72%',
        animation: {
          animateRotate: true,
          duration: 800,
          easing: 'easeInOutQuart'
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
              pointStyleWidth: 10,
              font: { size: 13, weight: '500' }
            },
            onClick: (e, legendItem, legend) => {
              // Toggle visibility
              const index = legendItem.index;
              const meta = legend.chart.getDatasetMeta(0);
              meta.data[index].hidden = !meta.data[index].hidden;
              legend.chart.update();
            }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                const pct = ((ctx.raw / total) * 100).toFixed(1);
                return ` ${ctx.label}: ${ctx.raw.toLocaleString()} (${pct}%)`;
              }
            }
          }
        },
        onClick: (e, elements) => {
          if (elements.length > 0) {
            const idx = elements[0].index;
            const status = idx === 0 ? 'On Time' : 'Late';
            FilterManager.setFilter('status', status);
          }
        }
      },
      plugins: [centerTextPlugin]
    });
  }
};
