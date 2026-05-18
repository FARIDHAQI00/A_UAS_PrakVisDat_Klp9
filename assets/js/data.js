/**
 * DATA.JS — Load & parse CSV, all data transformations
 * Uses d3.csv to load Train_preprocessed.csv
 */

const DataManager = {
  rawData: [],
  filteredData: [],

  async load() {
    try {
      const data = await d3.csv('data/Train_preprocessed.csv', d3.autoType);
      
      this.rawData = data.map(row => ({
        ID: row.ID,
        Warehouse_block: (row.Warehouse_block || '').toString().trim(),
        Mode_of_Shipment: (row.Mode_of_Shipment || '').toString().trim(),
        Customer_care_calls: +row.Customer_care_calls || 0,
        Customer_rating: +row.Customer_rating || 0,
        Cost_of_the_Product: +row.Cost_of_the_Product || 0,
        Prior_purchases: +row.Prior_purchases || 0,
        Product_importance: (row.Product_importance || '').toString().trim().toLowerCase(),
        Gender: (row.Gender || '').toString().trim(),
        Discount_offered: +row.Discount_offered || 0,
        Weight_in_gms: +row.Weight_in_gms || 0,
        Delivery_Status: (row.Delivery_Status || '').toString().trim(),
        Weight_Category: (row.Weight_Category || '').toString().trim(),
        Discount_Category: (row.Discount_Category || '').toString().trim()
      })).filter(row => row.ID != null && row.Delivery_Status !== '');

      this.filteredData = [...this.rawData];
      console.log(`✅ Loaded ${this.rawData.length} rows`);
      return this.rawData;
    } catch (err) {
      console.error('❌ CSV parse error:', err);
      throw err;
    }
  },

  applyFilters(filterState) {
    this.filteredData = this.rawData.filter(row => {
      if (filterState.mode !== 'All' && row.Mode_of_Shipment !== filterState.mode) return false;
      if (filterState.warehouse !== 'All' && row.Warehouse_block !== filterState.warehouse) return false;
      if (filterState.importance !== 'All' && row.Product_importance !== filterState.importance.toLowerCase()) return false;
      if (filterState.status !== 'All' && row.Delivery_Status !== filterState.status) return false;
      if (row.Weight_in_gms < filterState.weightMin || row.Weight_in_gms > filterState.weightMax) return false;
      return true;
    });
    return this.filteredData;
  },

  // Aggregation helpers
  getDeliveryStatusCounts(data) {
    const d = data || this.filteredData;
    const onTime = d.filter(r => r.Delivery_Status === 'On Time').length;
    const late = d.filter(r => r.Delivery_Status === 'Late').length;
    return { onTime, late, total: d.length };
  },

  getModeStatusCounts(data) {
    const d = data || this.filteredData;
    const modes = ['Ship', 'Flight', 'Road'];
    return modes.map(mode => {
      const modeData = d.filter(r => r.Mode_of_Shipment === mode);
      return {
        mode,
        onTime: modeData.filter(r => r.Delivery_Status === 'On Time').length,
        late: modeData.filter(r => r.Delivery_Status === 'Late').length,
        total: modeData.length
      };
    });
  },

  getWarehouseModeHeatmap(data) {
    const d = data || this.filteredData;
    const warehouses = ['A', 'B', 'C', 'D', 'F'];
    const modes = ['Ship', 'Flight', 'Road'];
    const result = [];
    warehouses.forEach(w => {
      modes.forEach(m => {
        const subset = d.filter(r => r.Warehouse_block === w && r.Mode_of_Shipment === m);
        const late = subset.filter(r => r.Delivery_Status === 'Late').length;
        result.push({
          warehouse: w,
          mode: m,
          total: subset.length,
          late,
          lateRate: subset.length > 0 ? (late / subset.length * 100) : 0
        });
      });
    });
    return result;
  },

  getScatterData(data) {
    const d = data || this.filteredData;
    return d.map(r => ({
      id: r.ID,
      cost: r.Cost_of_the_Product,
      discount: r.Discount_offered,
      status: r.Delivery_Status,
      mode: r.Mode_of_Shipment,
      warehouse: r.Warehouse_block,
      weight: r.Weight_in_gms
    }));
  },

  getWeightDistribution(data, bins = 20) {
    const d = data || this.filteredData;
    const weights = d.map(r => r.Weight_in_gms);
    const min = Math.min(...weights);
    const max = Math.max(...weights);
    const binWidth = (max - min) / bins;
    
    const histogram = [];
    for (let i = 0; i < bins; i++) {
      const low = min + i * binWidth;
      const high = low + binWidth;
      const binData = d.filter(r => r.Weight_in_gms >= low && (i === bins - 1 ? r.Weight_in_gms <= high : r.Weight_in_gms < high));
      histogram.push({
        low: Math.round(low),
        high: Math.round(high),
        label: `${Math.round(low)}-${Math.round(high)}`,
        onTime: binData.filter(r => r.Delivery_Status === 'On Time').length,
        late: binData.filter(r => r.Delivery_Status === 'Late').length,
        total: binData.length
      });
    }
    return histogram;
  },

  getRadarData(data) {
    const d = data || this.filteredData;
    const onTime = d.filter(r => r.Delivery_Status === 'On Time');
    const late = d.filter(r => r.Delivery_Status === 'Late');

    const avg = (arr, key) => arr.length > 0 ? arr.reduce((s, r) => s + r[key], 0) / arr.length : 0;

    const dims = ['Customer_rating', 'Customer_care_calls', 'Prior_purchases', 'Cost_of_the_Product', 'Discount_offered'];
    const labels = ['Avg Rating', 'Avg CS Calls', 'Avg Prior Purchases', 'Avg Product Cost', 'Avg Discount'];

    // Compute raw values
    const onTimeRaw = dims.map(dim => avg(onTime, dim));
    const lateRaw = dims.map(dim => avg(late, dim));

    // Normalize to 0-1
    const allVals = [...onTimeRaw, ...lateRaw];
    const maxPerDim = dims.map((_, i) => Math.max(onTimeRaw[i], lateRaw[i]) || 1);
    
    return {
      labels,
      onTime: onTimeRaw.map((v, i) => v / maxPerDim[i]),
      late: lateRaw.map((v, i) => v / maxPerDim[i]),
      onTimeRaw,
      lateRaw
    };
  },

  getComboData(data) {
    const d = data || this.filteredData;
    const ratings = [1, 2, 3, 4, 5];
    return ratings.map(r => {
      const ratingData = d.filter(row => row.Customer_rating === r);
      const onTime = ratingData.filter(row => row.Delivery_Status === 'On Time');
      const late = ratingData.filter(row => row.Delivery_Status === 'Late');
      const avgCalls = ratingData.length > 0 ? 
        ratingData.reduce((s, row) => s + row.Customer_care_calls, 0) / ratingData.length : 0;
      return {
        rating: r,
        onTime: onTime.length,
        late: late.length,
        total: ratingData.length,
        avgCsCalls: Math.round(avgCalls * 100) / 100
      };
    });
  },

  getKPIs(data) {
    const d = data || this.filteredData;
    const total = d.length;
    const onTime = d.filter(r => r.Delivery_Status === 'On Time').length;
    const late = d.filter(r => r.Delivery_Status === 'Late').length;
    const avgRating = d.length > 0 ? 
      (d.reduce((s, r) => s + r.Customer_rating, 0) / d.length) : 0;
    return {
      total,
      onTime,
      late,
      onTimeRate: total > 0 ? (onTime / total * 100) : 0,
      avgRating: Math.round(avgRating * 100) / 100
    };
  }
};
