/**
 * FILTERS.JS — Global filter state management (reactive)
 * Single source of truth for all filters.
 * Broadcasts CustomEvent('filterChange') on any change.
 */

const FilterManager = {
  state: {
    mode: 'All',
    warehouse: 'All',
    importance: 'All',
    status: 'All',
    weightMin: 0,
    weightMax: 10000
  },

  init(data) {
    const weights = data.map(r => r.Weight_in_gms);
    this.state.weightMin = Math.min(...weights);
    this.state.weightMax = Math.max(...weights);

    this.bindEvents();
    this.updateCounter();
  },

  bindEvents() {
    // Mode pills
    document.querySelectorAll('[data-filter="mode"]').forEach(pill => {
      pill.addEventListener('click', () => {
        this.state.mode = pill.dataset.value;
        this.setActivePill('mode', pill.dataset.value);
        this.broadcast();
      });
    });

    // Warehouse pills
    document.querySelectorAll('[data-filter="warehouse"]').forEach(pill => {
      pill.addEventListener('click', () => {
        this.state.warehouse = pill.dataset.value;
        this.setActivePill('warehouse', pill.dataset.value);
        this.broadcast();
      });
    });

    // Importance pills
    document.querySelectorAll('[data-filter="importance"]').forEach(pill => {
      pill.addEventListener('click', () => {
        this.state.importance = pill.dataset.value;
        this.setActivePill('importance', pill.dataset.value);
        this.broadcast();
      });
    });

    // Status pills
    document.querySelectorAll('[data-filter="status"]').forEach(pill => {
      pill.addEventListener('click', () => {
        this.state.status = pill.dataset.value;
        this.setActivePill('status', pill.dataset.value);
        this.broadcast();
      });
    });

    // Weight range slider
    const weightSlider = document.getElementById('weight-range');
    const weightLabel = document.getElementById('weight-range-label');
    if (weightSlider) {
      weightSlider.addEventListener('input', (e) => {
        this.state.weightMax = +e.target.value;
        weightLabel.textContent = `${this.state.weightMin} — ${this.state.weightMax} g`;
        this.broadcast();
      });
    }

    // Reset button
    const resetBtn = document.getElementById('filter-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.reset());
    }
  },

  setActivePill(filterName, value) {
    document.querySelectorAll(`[data-filter="${filterName}"]`).forEach(pill => {
      pill.classList.toggle('active', pill.dataset.value === value);
    });
  },

  reset() {
    const weights = DataManager.rawData.map(r => r.Weight_in_gms);
    this.state = {
      mode: 'All',
      warehouse: 'All',
      importance: 'All',
      status: 'All',
      weightMin: Math.min(...weights),
      weightMax: Math.max(...weights)
    };

    // Reset all pill buttons
    ['mode', 'warehouse', 'importance', 'status'].forEach(f => {
      this.setActivePill(f, 'All');
    });

    // Reset slider
    const weightSlider = document.getElementById('weight-range');
    const weightLabel = document.getElementById('weight-range-label');
    if (weightSlider) {
      weightSlider.value = this.state.weightMax;
      weightLabel.textContent = `${this.state.weightMin} — ${this.state.weightMax} g`;
    }

    this.broadcast();
  },

  broadcast() {
    DataManager.applyFilters(this.state);
    this.updateCounter();
    document.dispatchEvent(new CustomEvent('filterChange', { detail: this.state }));
  },

  updateCounter() {
    const counter = document.getElementById('filter-counter');
    if (counter) {
      const filtered = DataManager.filteredData.length;
      const total = DataManager.rawData.length;
      counter.innerHTML = `Menampilkan <strong>${filtered.toLocaleString()}</strong> / ${total.toLocaleString()} data`;
    }
  },

  // Allow external code to set filters (e.g., click on chart)
  setFilter(key, value) {
    if (this.state.hasOwnProperty(key)) {
      this.state[key] = value;
      this.setActivePill(key, value);
      this.broadcast();
    }
  }
};
