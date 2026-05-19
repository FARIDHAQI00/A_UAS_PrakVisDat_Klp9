/**
 * VIZ 6 — Radar Chart: Customer Profile Comparison
 * Library: Chart.js
 */

const RadarChart = {
  chart: null,
  ctx: null,

  init() {
    this.ctx = document.getElementById('chart-radar').getContext('2d');
    this.render();
    document.addEventListener('filterChange', () => this.render());
  },

  render() {
    const radarData = DataManager.getRadarData();
    
    if (this.chart) this.chart.destroy();

    this.chart = new Chart(this.ctx, {
      type: 'radar',
      data: {
        labels: radarData.labels,
        datasets: [
          {
            label: 'Tepat Waktu',
            data: radarData.onTime,
            backgroundColor: 'rgba(34, 197, 94, 0.15)',
            borderColor: '#22c55e',
            borderWidth: 2,
            pointBackgroundColor: '#22c55e',
            pointBorderColor: '#22c55e',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#22c55e',
            pointRadius: 4,
            pointHoverRadius: 7
          },
          {
            label: 'Terlambat',
            data: radarData.late,
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            borderColor: '#ef4444',
            borderWidth: 2,
            pointBackgroundColor: '#ef4444',
            pointBorderColor: '#ef4444',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#ef4444',
            pointRadius: 4,
            pointHoverRadius: 7
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        animation: {
          duration: 800,
          easing: 'easeOutCubic'
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 1,
            ticks: {
              stepSize: 0.25,
              display: false
            },
            grid: {
              color: 'rgba(39, 39, 42, 0.6)',
              circular: true
            },
            angleLines: {
              color: 'rgba(39, 39, 42, 0.6)'
            },
            pointLabels: {
              color: '#a1a1aa',
              font: {
                family: "'Plus Jakarta Sans', sans-serif",
                size: 11,
                weight: '500'
              }
            }
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              pointStyleWidth: 10,
              padding: 20,
              font: { size: 12, weight: '500' }
            }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const dimIndex = ctx.dataIndex;
                const raw = ctx.datasetIndex === 0 ? radarData.onTimeRaw[dimIndex] : radarData.lateRaw[dimIndex];
                return ` ${ctx.dataset.label}: ${raw.toFixed(2)} (dinormalisasi: ${ctx.raw.toFixed(2)})`;
              }
            }
          }
        }
      }
    });

    // Update summary table
    this.updateTable(radarData);
  },

  updateTable(radarData) {
    const tbody = document.getElementById('radar-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = radarData.labels.map((label, i) => `
      <tr>
        <td style="color:var(--text-secondary);font-size:var(--text-sm)">${label}</td>
        <td style="font-family:var(--font-mono);color:var(--color-success);font-weight:600">${radarData.onTimeRaw[i].toFixed(2)}</td>
        <td style="font-family:var(--font-mono);color:var(--color-danger);font-weight:600">${radarData.lateRaw[i].toFixed(2)}</td>
        <td style="font-family:var(--font-mono);color:${radarData.lateRaw[i] > radarData.onTimeRaw[i] ? 'var(--color-danger)' : 'var(--color-success)'};font-weight:600">
          ${radarData.lateRaw[i] > radarData.onTimeRaw[i] ? '▲' : '▼'} ${Math.abs(radarData.lateRaw[i] - radarData.onTimeRaw[i]).toFixed(2)}
        </td>
      </tr>
    `).join('');
  }
};
