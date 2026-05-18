/**
 * VIZ 4 — Scatter Plot: Cost of Product vs Discount Offered
 * Library: D3.js
 */

const ScatterChart = {
  svg: null,
  tooltip: null,
  showOnTime: true,
  showLate: true,
  pointOpacity: 0.6,

  init() {
    this.tooltip = d3.select('#tooltip-scatter');
    this.render();
    document.addEventListener('filterChange', () => this.render());

    document.getElementById('viz4-toggle-ontime')?.addEventListener('click', (e) => {
      this.showOnTime = !this.showOnTime;
      e.target.classList.toggle('active', this.showOnTime);
      this.render();
    });

    document.getElementById('viz4-toggle-late')?.addEventListener('click', (e) => {
      this.showLate = !this.showLate;
      e.target.classList.toggle('active', this.showLate);
      this.render();
    });

    document.getElementById('viz4-opacity')?.addEventListener('input', (e) => {
      this.pointOpacity = +e.target.value / 100;
      this.render();
    });
  },

  render() {
    const container = document.getElementById('chart-scatter');
    container.innerHTML = '';

    let data = DataManager.getScatterData();
    if (!this.showOnTime) data = data.filter(d => d.status !== 'On Time');
    if (!this.showLate) data = data.filter(d => d.status !== 'Late');

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

    const x = d3.scaleLinear()
      .domain(d3.extent(DataManager.rawData, d => d.Cost_of_the_Product))
      .range([0, width]).nice();
    const y = d3.scaleLinear()
      .domain(d3.extent(DataManager.rawData, d => d.Discount_offered))
      .range([height, 0]).nice();

    // Grid lines
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(8))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').attr('stroke', '#27272a'));

    svg.append('g')
      .call(d3.axisLeft(y).ticks(8))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').clone()
        .attr('x2', width)
        .attr('stroke', 'rgba(39,39,42,0.5)')
        .attr('stroke-dasharray', '3,3'));

    // Axis labels
    svg.append('text')
      .attr('class', 'axis-label')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2).attr('y', height + 40)
      .text('Cost of Product ($)');

    svg.append('text')
      .attr('class', 'axis-label')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('y', -45).attr('x', -height / 2)
      .text('Discount Offered (%)');

    // Median lines
    const allCosts = DataManager.filteredData.map(d => d.Cost_of_the_Product);
    const allDiscounts = DataManager.filteredData.map(d => d.Discount_offered);
    const medianCost = d3.median(allCosts);
    const medianDiscount = d3.median(allDiscounts);

    svg.append('line')
      .attr('x1', x(medianCost)).attr('x2', x(medianCost))
      .attr('y1', 0).attr('y2', height)
      .attr('stroke', '#3a3a40').attr('stroke-dasharray', '6,4').attr('stroke-width', 1);

    svg.append('line')
      .attr('x1', 0).attr('x2', width)
      .attr('y1', y(medianDiscount)).attr('y2', y(medianDiscount))
      .attr('stroke', '#3a3a40').attr('stroke-dasharray', '6,4').attr('stroke-width', 1);

    // Quadrant labels
    svg.append('text')
      .attr('x', x(medianCost) + 5).attr('y', 12)
      .style('fill', '#52525b').style('font-size', '9px')
      .text(`Median Cost: $${Math.round(medianCost)}`);

    svg.append('text')
      .attr('x', 5).attr('y', y(medianDiscount) - 5)
      .style('fill', '#52525b').style('font-size', '9px')
      .text(`Median Discount: ${Math.round(medianDiscount)}%`);

    // Points — sample if too many for performance
    const plotData = data.length > 3000 ? data.filter((_, i) => i % Math.ceil(data.length / 3000) === 0) : data;

    // Brush
    const brush = d3.brush()
      .extent([[0, 0], [width, height]])
      .on('end', (event) => {
        if (!event.selection) {
          svg.selectAll('.dot').style('opacity', this.pointOpacity);
          return;
        }
        const [[x0, y0], [x1, y1]] = event.selection;
        svg.selectAll('.dot')
          .style('opacity', d => {
            const cx = x(d.cost), cy = y(d.discount);
            return cx >= x0 && cx <= x1 && cy >= y0 && cy <= y1 ? 0.9 : 0.1;
          });
        
        const selected = plotData.filter(d => {
          const cx = x(d.cost), cy = y(d.discount);
          return cx >= x0 && cx <= x1 && cy >= y0 && cy <= y1;
        });
        
        const countLabel = document.getElementById('viz4-selection-count');
        if (countLabel) countLabel.textContent = `Selected: ${selected.length}`;
      });

    svg.append('g').attr('class', 'brush').call(brush);

    // Draw dots
    svg.selectAll('.dot')
      .data(plotData)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => x(d.cost))
      .attr('cy', d => y(d.discount))
      .attr('r', 3.5)
      .attr('fill', d => d.status === 'On Time' ? '#22c55e' : '#ef4444')
      .style('opacity', 0)
      .on('mouseover', (event, d) => {
        d3.select(event.target).attr('r', 7).style('opacity', 1);
        this.tooltip
          .classed('visible', true)
          .html(`
            <div class="tooltip-title">Product #${d.id}</div>
            <div class="tooltip-row"><span class="tooltip-label">Cost</span><span class="tooltip-value">$${d.cost}</span></div>
            <div class="tooltip-row"><span class="tooltip-label">Discount</span><span class="tooltip-value">${d.discount}%</span></div>
            <div class="tooltip-row"><span class="tooltip-label">Status</span><span class="tooltip-value" style="color:${d.status === 'On Time' ? '#22c55e' : '#ef4444'}">${d.status}</span></div>
            <div class="tooltip-row"><span class="tooltip-label">Mode</span><span class="tooltip-value">${d.mode}</span></div>
            <div class="tooltip-row"><span class="tooltip-label">Warehouse</span><span class="tooltip-value">${d.warehouse}</span></div>
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
        d3.select(event.target).attr('r', 3.5).style('opacity', this.pointOpacity);
        this.tooltip.classed('visible', false);
      })
      .transition()
      .duration(600)
      .delay((d, i) => Math.min(i * 0.5, 500))
      .style('opacity', this.pointOpacity);
  }
};
