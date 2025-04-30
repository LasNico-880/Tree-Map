const width = 960;
    const height = 600;

    const svg = d3.select('#treemap');
    const tooltip = d3.select('#tooltip');

    const DATA_URL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json';

    d3.json(DATA_URL).then(data => {
      const root = d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);

      d3.treemap()
        .size([width, height])
        .padding(1)
        (root);

      const categories = [...new Set(root.leaves().map(d => d.data.category))];
      const color = d3.scaleOrdinal()
        .domain(categories)
        .range(d3.schemeCategory10);

      const tileGroup = svg.selectAll("g")
        .data(root.leaves())
        .enter()
        .append("g")
        .attr("transform", d => `translate(${d.x0},${d.y0})`);

      tileGroup.append("rect")
        .attr("class", "tile")
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .attr("fill", d => color(d.data.category))
        .attr("data-name", d => d.data.name)
        .attr("data-category", d => d.data.category)
        .attr("data-value", d => d.data.value)
        .on("mouseover", (event, d) => {
          tooltip
            .style("opacity", 1)
            .html(`Nombre: ${d.data.name}<br>Categoría: ${d.data.category}<br>Valor: ${d.data.value}`)
            .attr("data-value", d.data.value)
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY + 10 + "px");
        })
        .on("mouseout", () => {
          tooltip.style("opacity", 0);
        });

      tileGroup.append("text")
        .selectAll("tspan")
        .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
        .enter()
        .append("tspan")
        .attr("x", 4)
        .attr("y", (d, i) => 13 + i * 10)
        .text(d => d)
        .attr("font-size", "10px")
        .attr("fill", "black");

      // Leyenda (puntos 8 y 9)
      const legend = d3.select("#legend");

      categories.forEach((category, index) => {
        const legendItem = legend.append("svg")
          .attr("width", 60)
          .attr("height", 30)
          .style("display", "inline-block");

        legendItem.append("rect")
          .attr("class", "legend-item")
          .attr("width", 20)
          .attr("height", 20)
          .attr("fill", color(category));

        legendItem.append("text")
          .attr("x", 30)
          .attr("y", 15)
          .text(category)
          .style("font-size", "12px")
          .attr("alignment-baseline", "middle");
      });
    });
