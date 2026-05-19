/**
 * VIZ 3 — Heatmap: Warehouse Block × Mode of Shipment
 * Library: D3.js
 */

const HeatmapChart = {
  svg: null,
  tooltip: null,
  showValues: true,

  init() {
    this.tooltip = d3.select('#tooltip-heatmap');
    this.render();
    document.addEventListener('filterChange', () => this.render());

    document.getElementById('viz3-toggle-values')?.addEventListener('click', (e) => {
      this.showValues = !this.showValues;
      e.target.classList.toggle('active', this.showValues);
      this.render();
    });
  },

  render() {
    const container = document.getElementById('chart-heatmap');
    container.innerHTML = '';
    
    const data = DataManager.getWarehouseModeHeatmap();
    const warehouses = ['A', 'B', 'C', 'D', 'F'];
    const modes = ['Ship', 'Flight', 'Road'];

    const margin = { top: 50, right: 30, bottom: 50, left: 80 };
    const width = container.clientWidth - margin.left - margin.right;
    const height = 280 - margin.top - margin.bottom;

    const svg = d3.select(container)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr('class', 'd3-chart')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand().domain(modes).range([0, width]).padding(0.08);
    const y = d3.scaleBand().domain(warehouses).range([0, height]).padding(0.08);

    const maxRate = d3.max(data, d => d.lateRate) || 50;
    const colorScale = d3.scaleSequential()
      .domain([0, maxRate])
      .interpolator(d3.interpolateRgbBasis(['#131316', '#2a1a1a', '#4a2020', '#7a2828', '#b83232', '#ef4444']));

    const modeMap = { 'Ship': 'Kapal', 'Flight': 'Penerbangan', 'Road': 'Darat' };

    // X Axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d => modeMap[d] || d).tickSize(0))
      .select('.domain').remove();

    // Y Axis
    svg.append('g')
      .call(d3.axisLeft(y).tickSize(0))
      .select('.domain').remove();

    // Axis labels
    svg.selectAll('.tick text')
      .style('font-family', "'Space Mono', monospace")
      .style('font-size', '12px')
      .style('fill', '#a1a1aa');

    // Y axis label
    svg.append('text')
      .attr('class', 'axis-label')
      .attr('transform', 'rotate(-90)')
      .attr('y', -60)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .text('Blok Gudang');

    // Cells
    const cells = svg.selectAll('.heat-cell')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'heat-cell');

    cells.append('rect')
      .attr('x', d => x(d.mode))
      .attr('y', d => y(d.warehouse))
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .attr('rx', 6)
      .attr('fill', d => d.total > 0 ? colorScale(d.lateRate) : '#131316')
      .attr('stroke', '#27272a')
      .attr('stroke-width', 1)
      .style('cursor', 'pointer')
      .style('opacity', 0)
      .transition()
      .duration(600)
      .delay((d, i) => i * 50)
      .style('opacity', 1);

    // Value labels
    if (this.showValues) {
      cells.append('text')
        .attr('x', d => x(d.mode) + x.bandwidth() / 2)
        .attr('y', d => y(d.warehouse) + y.bandwidth() / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .style('font-family', "'Space Mono', monospace")
        .style('font-size', '13px')
        .style('font-weight', '700')
        .style('fill', d => d.lateRate > 25 ? '#fafaf9' : '#a1a1aa')
        .style('pointer-events', 'none')
        .text(d => d.total > 0 ? d.lateRate.toFixed(1) + '%' : '—')
        .style('opacity', 0)
        .transition()
        .duration(400)
        .delay((d, i) => i * 50 + 300)
        .style('opacity', 1);
    }

    // Hover events
    cells.selectAll('rect')
      .on('mouseover', (event, d) => {
        d3.select(event.target).attr('stroke', '#f59e0b').attr('stroke-width', 2);
        const modeID = modeMap[d.mode] || d.mode;
        this.tooltip
          .classed('visible', true)
          .html(`
            <div class="tooltip-title">Gudang ${d.warehouse} × ${modeID}</div>
            <div class="tooltip-row"><span class="tooltip-label">Total</span><span class="tooltip-value">${d.total.toLocaleString()}</span></div>
            <div class="tooltip-row"><span class="tooltip-label">Terlambat</span><span class="tooltip-value" style="color:#ef4444">${d.late.toLocaleString()}</span></div>
            <div class="tooltip-row"><span class="tooltip-label">Tk Keterlambatan</span><span class="tooltip-value">${d.lateRate.toFixed(1)}%</span></div>
          `)
          .style('left', (event.pageX + 12) + 'px')
          .style('top', (event.pageY - 40) + 'px');
      })
      .on('mousemove', (event) => {
        this.tooltip
          .style('left', (event.pageX + 12) + 'px')
          .style('top', (event.pageY - 40) + 'px');
      })
      .on('mouseout', (event) => {
        d3.select(event.target).attr('stroke', '#27272a').attr('stroke-width', 1);
        this.tooltip.classed('visible', false);
      })
      .on('click', (event, d) => {
        FilterManager.setFilter('warehouse', d.warehouse);
        FilterManager.setFilter('mode', d.mode);
      });

    // Color legend
    const legendWidth = 200;
    const legendHeight = 10;
    const legendG = svg.append('g')
      .attr('transform', `translate(${width - legendWidth},${-40})`);

    const legendScale = d3.scaleLinear().domain([0, maxRate]).range([0, legendWidth]);
    const legendAxis = d3.axisBottom(legendScale).ticks(5).tickFormat(d => d + '%');

    const defs = svg.append('defs');
    const linearGradient = defs.append('linearGradient').attr('id', 'heat-gradient');
    linearGradient.selectAll('stop')
      .data(d3.range(0, 1.01, 0.25))
      .enter().append('stop')
      .attr('offset', d => d * 100 + '%')
      .attr('stop-color', d => colorScale(d * maxRate));

    legendG.append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .attr('rx', 3)
      .style('fill', 'url(#heat-gradient)');

    legendG.append('g')
      .attr('transform', `translate(0,${legendHeight})`)
      .call(legendAxis)
      .select('.domain').remove();

    legendG.selectAll('.tick text')
      .style('font-size', '9px')
      .style('fill', '#52525b');

    legendG.selectAll('.tick line')
      .style('stroke', '#3a3a40');
  }
};
