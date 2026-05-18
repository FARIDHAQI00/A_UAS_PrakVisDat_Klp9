/**
 * MAIN.JS — Initialize all charts, event orchestration, KPI animation
 */

// Chart.js Global Config — Warm Amber Dark Theme
Chart.defaults.color = '#a1a1aa';
Chart.defaults.borderColor = '#27272a';
Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";
Chart.defaults.font.size = 12;

Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.pointStyleWidth = 8;
Chart.defaults.plugins.legend.labels.padding = 16;

Chart.defaults.plugins.tooltip.backgroundColor = '#1a1a1f';
Chart.defaults.plugins.tooltip.borderColor = '#27272a';
Chart.defaults.plugins.tooltip.borderWidth = 1;
Chart.defaults.plugins.tooltip.padding = 12;
Chart.defaults.plugins.tooltip.titleColor = '#a1a1aa';
Chart.defaults.plugins.tooltip.bodyColor = '#fafaf9';
Chart.defaults.plugins.tooltip.titleFont = { size: 11, weight: '600' };
Chart.defaults.plugins.tooltip.bodyFont = { family: "'Space Mono', monospace", size: 13 };
Chart.defaults.plugins.tooltip.cornerRadius = 8;
Chart.defaults.plugins.tooltip.displayColors = true;
Chart.defaults.plugins.tooltip.boxPadding = 4;

// ── Animated count-up for KPI ──
// Stores active RAF IDs per element so we can cancel previous animation
const _kpiRafMap = new Map();

function animateValue(element, end, duration = 1800, isFloat = false, suffix = '') {
  // Parse current displayed value as the start (so transitions feel fluid)
  const rawText = element.textContent.replace(/[,%]/g, '').trim();
  const start = parseFloat(rawText) || 0;

  // Cancel any in-progress animation on this element
  if (_kpiRafMap.has(element)) {
    cancelAnimationFrame(_kpiRafMap.get(element));
  }

  const startTime = performance.now();

  const update = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // easeOutExpo — starts fast, glides to a stop
    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

    const current = start + (end - start) * eased;

    if (isFloat) {
      element.textContent = current.toFixed(2) + suffix;
    } else {
      element.textContent = Math.round(current).toLocaleString() + suffix;
    }

    if (progress < 1) {
      _kpiRafMap.set(element, requestAnimationFrame(update));
    } else {
      _kpiRafMap.delete(element);
    }
  };

  _kpiRafMap.set(element, requestAnimationFrame(update));
}

// Update KPI cards
function updateKPIs() {
  const kpis = DataManager.getKPIs();

  const totalEl  = document.getElementById('kpi-total');
  const onTimeEl = document.getElementById('kpi-ontime');
  const lateEl   = document.getElementById('kpi-late');
  const ratingEl = document.getElementById('kpi-rating');

  if (totalEl)  animateValue(totalEl,  kpis.total,      1800, false, '');
  if (onTimeEl) animateValue(onTimeEl, kpis.onTimeRate, 1800, true,  '%');
  if (lateEl)   animateValue(lateEl,   kpis.late,       1800, false, '');
  if (ratingEl) animateValue(ratingEl, kpis.avgRating,  1800, true,  '');
}

// Initialize everything
async function initDashboard() {
  const loadingEl = document.getElementById('loading-screen');
  
  try {
    // Load data
    await DataManager.load();
    
    // Init filters
    FilterManager.init(DataManager.rawData);

    // Set weight slider range
    const weights = DataManager.rawData.map(r => r.Weight_in_gms);
    const minW = Math.min(...weights);
    const maxW = Math.max(...weights);
    const weightSlider = document.getElementById('weight-range');
    const weightLabel = document.getElementById('weight-range-label');
    if (weightSlider) {
      weightSlider.min = minW;
      weightSlider.max = maxW;
      weightSlider.value = maxW;
    }
    if (weightLabel) {
      weightLabel.textContent = `${minW} — ${maxW} g`;
    }

    // Init KPIs
    updateKPIs();

    // Init all charts
    DonutChart.init();
    GroupedBarChart.init();
    HeatmapChart.init();
    ScatterChart.init();
    HistogramChart.init();
    RadarChart.init();
    ComboChart.init();

    // Listen for filter changes to update KPIs
    document.addEventListener('filterChange', () => {
      updateKPIs();
      // Smooth transition: briefly flash .updating on all chart bodies
      document.querySelectorAll('.chart-body').forEach(el => {
        el.classList.remove('updating');
        void el.offsetWidth; // force reflow to restart animation
        el.classList.add('updating');
        el.addEventListener('animationend', () => el.classList.remove('updating'), { once: true });
      });
    });

    // Hide loading screen
    if (loadingEl) {
      loadingEl.classList.add('hide');
      setTimeout(() => loadingEl.remove(), 600);
    }

    console.log('🚀 Dashboard initialized successfully!');
    
  } catch (error) {
    console.error('❌ Dashboard initialization failed:', error);
    if (loadingEl) {
      loadingEl.innerHTML = `
        <div style="text-align:center;color:var(--color-danger)">
          <div style="font-size:3rem;margin-bottom:1rem">⚠️</div>
          <div style="font-size:1.2rem;font-weight:600">Failed to load data</div>
          <div style="color:var(--text-secondary);margin-top:0.5rem;font-size:0.9rem">
            Please ensure you're running via HTTP server (not file://)
          </div>
          <div style="color:var(--text-muted);margin-top:0.5rem;font-size:0.8rem">
            ${error.message}
          </div>
        </div>
      `;
    }
  }
}

// Start
document.addEventListener('DOMContentLoaded', initDashboard);
