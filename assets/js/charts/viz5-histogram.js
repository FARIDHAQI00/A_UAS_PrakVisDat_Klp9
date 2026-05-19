/**
 * VIZ 5 — Histogram: Weight Distribution
 * Library: D3.js
 */

const HistogramChart = {
  svg: null,
  tooltip: null,
  binCount: 20,
  showOnTime: true,
  showLate: true,

  init() {
    this.tooltip = d3.select('#tooltip-histogram');
    this.render();
    document.addEventListener('filterChange', () => this.render());

    document.getElementById('viz5-bins')?.addEventListener('input', (e) => {
      this.binCount = +e.target.value;
      document.getElementById('viz5-bins-label').textContent = `Bin: ${this.binCount}`;
      this.render();
    });

    document.getElementById('viz5-toggle-ontime')?.addEventListener('click', (e) => {
      this.showOnTime = !this.showOnTime;
      e.target.classList.toggle('active', this.showOnTime);
      this.render();
    });

    document.getElementById('viz5-toggle-late')?.addEventListener('click', (e) => {
      this.showLate = !this.showLate;
      e.target.classList.toggle('active', this.showLate);
      this.render();
    });
  },

  render() {
    const container = document.getElementById('chart-histogram');
    container.innerHTML = '';

    const histData = DataManager.getWeightDistribution(null, this.binCount);
    
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const width = container.clientWidth - margin.left - margin.right;
    const height = 380 - margin.top - margin.bottom;

    const svg = d3.select(container)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr('class', 'd3-chart')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(histData.map(d => d.label))
      .range([0, width])
      .padding(0.15);

    const maxVal = d3.max(histData, d => {
      if (this.showOnTime && this.showLate) return d.total;
      if (this.showOnTime) return d.onTime;
      if (this.showLate) return d.late;
      return 0;
    });

    const y = d3.scaleLinear().domain([0, maxVal * 1.1]).range([height, 0]).nice();

    // Grid
    svg.append('g')
      .call(d3.axisLeft(y).ticks(6))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').clone()
        .attr('x2', width)
        .attr('stroke', 'rgba(39,39,42,0.5)')
        .attr('stroke-dasharray', '3,3'));

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).tickValues(histData.filter((_, i) => i % Math.ceil(this.binCount / 10) === 0).map(d => d.label)))
      .call(g => g.select('.domain').remove())
      .selectAll('text')
      .attr('transform', 'rotate(-35)')
      .attr('text-anchor', 'end')
      .style('font-size', '9px');

    // Axis labels
    svg.append('text')
      .attr('class', 'axis-label')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2).attr('y', height + 45)
      .text('Berat (gram)');

    svg.append('text')
      .attr('class', 'axis-label')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('y', -45).attr('x', -height / 2)
      .text('Jumlah');

    // Bars — On Time
    if (this.showOnTime) {
      svg.selectAll('.bar-ontime')
        .data(histData)
        .enter()
        .append('rect')
        .attr('class', 'bar-ontime')
        .attr('x', d => x(d.label))
        .attr('y', height)
        .attr('width', this.showLate ? x.bandwidth() / 2 : x.bandwidth())
        .attr('height', 0)
        .attr('fill', '#22c55e')
        .attr('rx', 3)
        .style('opacity', 0.85)
        .on('mouseover', (event, d) => this.showTooltip(event, d))
        .on('mousemove', (event) => this.moveTooltip(event))
        .on('mouseout', () => this.hideTooltip())
        .transition()
        .duration(600)
        .delay((d, i) => i * 25)
        .attr('y', d => y(d.onTime))
        .attr('height', d => height - y(d.onTime));
    }

    // Bars — Late
    if (this.showLate) {
      svg.selectAll('.bar-late')
        .data(histData)
        .enter()
        .append('rect')
        .attr('class', 'bar-late')
        .attr('x', d => this.showOnTime ? x(d.label) + x.bandwidth() / 2 : x(d.label))
        .attr('y', height)
        .attr('width', this.showOnTime ? x.bandwidth() / 2 : x.bandwidth())
        .attr('height', 0)
        .attr('fill', '#ef4444')
        .attr('rx', 3)
        .style('opacity', 0.85)
        .on('mouseover', (event, d) => this.showTooltip(event, d))
        .on('mousemove', (event) => this.moveTooltip(event))
        .on('mouseout', () => this.hideTooltip())
        .transition()
        .duration(600)
        .delay((d, i) => i * 25)
        .attr('y', d => y(d.late))
        .attr('height', d => height - y(d.late));
    }

    // Mean reference lines
    const filteredData = DataManager.filteredData;
    const onTimeWeights = filteredData.filter(r => r.Delivery_Status === 'On Time').map(r => r.Weight_in_gms);
    const lateWeights = filteredData.filter(r => r.Delivery_Status === 'Late').map(r => r.Weight_in_gms);

    if (this.showOnTime && onTimeWeights.length > 0) {
      const avgOnTime = d3.mean(onTimeWeights);
      // Find the closest bin
      const binIdx = Math.min(Math.floor((avgOnTime - histData[0].low) / (histData[0].high - histData[0].low)), histData.length - 1);
      const xPos = binIdx >= 0 && binIdx < histData.length ? x(histData[Math.max(0, binIdx)].label) + x.bandwidth() / 2 : 0;
      
      svg.append('line')
        .attr('x1', xPos).attr('x2', xPos)
        .attr('y1', 0).attr('y2', height)
        .attr('stroke', '#22c55e').attr('stroke-dasharray', '6,4').attr('stroke-width', 1.5)
        .style('opacity', 0.7);
      
      svg.append('text')
        .attr('x', xPos + 4).attr('y', 12)
        .style('fill', '#22c55e').style('font-size', '9px').style('font-weight', '600')
        .text(`Rata-rata: ${Math.round(avgOnTime)}g`);
    }

    if (this.showLate && lateWeights.length > 0) {
      const avgLate = d3.mean(lateWeights);
      const binIdx = Math.min(Math.floor((avgLate - histData[0].low) / (histData[0].high - histData[0].low)), histData.length - 1);
      const xPos = binIdx >= 0 && binIdx < histData.length ? x(histData[Math.max(0, binIdx)].label) + x.bandwidth() / 2 : 0;
      
      svg.append('line')
        .attr('x1', xPos).attr('x2', xPos)
        .attr('y1', 0).attr('y2', height)
        .attr('stroke', '#ef4444').attr('stroke-dasharray', '6,4').attr('stroke-width', 1.5)
        .style('opacity', 0.7);
      
      svg.append('text')
        .attr('x', xPos + 4).attr('y', 25)
        .style('fill', '#ef4444').style('font-size', '9px').style('font-weight', '600')
        .text(`Rata-rata: ${Math.round(avgLate)}g`);
    }
  },

  showTooltip(event, d) {
    const latePct = d.total > 0 ? (d.late / d.total * 100).toFixed(1) : 0;
    this.tooltip
      .classed('visible', true)
      .html(`
        <div class="tooltip-title">Berat: ${d.label} g</div>
        <div class="tooltip-row"><span class="tooltip-label">Total</span><span class="tooltip-value">${d.total.toLocaleString()}</span></div>
        <div class="tooltip-row"><span class="tooltip-label">Tepat Waktu</span><span class="tooltip-value" style="color:#22c55e">${d.onTime.toLocaleString()}</span></div>
        <div class="tooltip-row"><span class="tooltip-label">Terlambat</span><span class="tooltip-value" style="color:#ef4444">${d.late.toLocaleString()}</span></div>
        <div class="tooltip-row"><span class="tooltip-label">Tk Keterlambatan</span><span class="tooltip-value">${latePct}%</span></div>
      `)
      .style('left', (event.pageX + 12) + 'px')
      .style('top', (event.pageY - 40) + 'px');
  },

  moveTooltip(event) {
    this.tooltip
      .style('left', (event.pageX + 12) + 'px')
      .style('top', (event.pageY - 40) + 'px');
  },

  hideTooltip() {
    this.tooltip.classed('visible', false);
  }
};
