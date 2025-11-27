const Figure3 = {
    data: {
        microscope: [85, 82, 88, 93, 73.6, 85, 80, 86, 84, 89, 78, 81, 87, 83, 85],
        sem: [97, 98, 96, 98.33, 97.5, 96.8, 97.2, 98.1, 96.5, 97.8, 97.1, 96.9, 97.4, 98.2, 97.6],
        uav: [95, 94, 96, 90, 99, 95.5, 94.8, 96.2, 93.5, 95.8, 94.2, 95.1, 96.5, 93.8, 95.3]
    },

    render: function (containerId) {
        const container = d3.select(containerId);
        container.html("");

        const margin = { top: 40, right: 30, bottom: 50, left: 60 };
        const width = 800 - margin.left - margin.right;
        const height = 600 - margin.top - margin.bottom;

        const svg = container.append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Scales
        const x = d3.scaleBand()
            .range([0, width])
            .domain(["Microscope", "SEM", "UAV"])
            .padding(0.05);

        const y = d3.scaleLinear()
            .domain([70, 100])
            .range([height, 0]);

        // Axes
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("font-size", "14px")
            .style("font-weight", "bold");

        svg.append("g")
            .call(d3.axisLeft(y))
            .style("font-size", "12px");

        // Y Axis Label
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Performance Metric (%)")
            .style("font-weight", "bold");

        // High-Precision Threshold Line
        svg.append("line")
            .attr("x1", 0)
            .attr("x2", width)
            .attr("y1", y(95))
            .attr("y2", y(95))
            .attr("stroke", "#666")
            .attr("stroke-dasharray", "4")
            .attr("stroke-width", 1);

        svg.append("text")
            .attr("x", width - 10)
            .attr("y", y(95) - 5)
            .attr("text-anchor", "end")
            .text("High-Precision Threshold")
            .style("font-size", "10px")
            .style("fill", "#666");

        // Draw Raincloud elements for each group
        const groups = [
            { name: "Microscope", data: this.data.microscope, color: getColor("red") },
            { name: "SEM", data: this.data.sem, color: getColor("blue") },
            { name: "UAV", data: this.data.uav, color: getColor("green") }
        ];

        groups.forEach(group => {
            const g = svg.append("g").attr("transform", `translate(${x(group.name)}, 0)`);
            const bandwidth = x.bandwidth();

            // 1. Cloud (Half-Violin) - Simplified using a path generator for demo
            // In a real D3 implementation, we'd calculate KDE. Here we approximate.
            const densityData = this.calculateDensity(group.data);
            const area = d3.area()
                .x0(0)
                .x1(d => d[1] * bandwidth * 0.8) // Scale width
                .y(d => y(d[0]))
                .curve(d3.curveCatmullRom);

            g.append("path")
                .datum(densityData)
                .attr("fill", group.color)
                .attr("fill-opacity", 0.6)
                .attr("stroke", "none")
                .attr("d", area)
                .attr("transform", `translate(0,0)`); // Left side

            // 2. Rain (Jittered Points)
            g.selectAll("circle")
                .data(group.data)
                .enter()
                .append("circle")
                .attr("cx", () => bandwidth * 0.6 + Math.random() * bandwidth * 0.2) // Right side
                .attr("cy", d => y(d))
                .attr("r", 3)
                .attr("fill", group.color)
                .attr("stroke", "white")
                .attr("stroke-width", 0.5);

            // 3. Box (Boxplot)
            const q1 = d3.quantile(group.data.sort(d3.ascending), 0.25);
            const median = d3.quantile(group.data, 0.5);
            const q3 = d3.quantile(group.data, 0.75);
            const min = d3.min(group.data);
            const max = d3.max(group.data);

            const boxWidth = bandwidth * 0.15;
            const boxCenter = bandwidth * 0.4;

            // Box body
            g.append("rect")
                .attr("x", boxCenter - boxWidth / 2)
                .attr("y", y(q3))
                .attr("width", boxWidth)
                .attr("height", y(q1) - y(q3))
                .attr("fill", "white")
                .attr("stroke", "black");

            // Median line
            g.append("line")
                .attr("x1", boxCenter - boxWidth / 2)
                .attr("x2", boxCenter + boxWidth / 2)
                .attr("y1", y(median))
                .attr("y2", y(median))
                .attr("stroke", "black")
                .attr("stroke-width", 2);

            // Whiskers
            g.append("line")
                .attr("x1", boxCenter)
                .attr("x2", boxCenter)
                .attr("y1", y(min))
                .attr("y2", y(q1))
                .attr("stroke", "black");

            g.append("line")
                .attr("x1", boxCenter)
                .attr("x2", boxCenter)
                .attr("y1", y(q3))
                .attr("y2", y(max))
                .attr("stroke", "black");
        });

        // Annotations
        this.addAnnotation(svg, x, y, "UAV", 99, "S30094 (YOLOv8)", -30, -20);
        this.addAnnotation(svg, x, y, "SEM", 98.33, "S30013 (U-Net)", 30, -10);

        if (window.app && window.app.isEditMode) {
            this.enableEditing(svg);
        }
    },

    calculateDensity: function (data) {
        // Simple mock density function for visualization
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min;
        const step = range / 20;
        const density = [];

        for (let val = min - step; val <= max + step; val += step) {
            let count = 0;
            data.forEach(d => {
                // Gaussian kernel
                const diff = (val - d) / (range / 5);
                count += Math.exp(-0.5 * diff * diff);
            });
            density.push([val, count]);
        }
        // Normalize
        const maxCount = Math.max(...density.map(d => d[1]));
        return density.map(d => [d[0], d[1] / maxCount]);
    },

    addAnnotation: function (svg, x, y, group, value, text, dx, dy) {
        const bandwidth = x.bandwidth();
        const cx = x(group) + bandwidth * 0.7; // Approx rain location
        const cy = y(value);

        svg.append("line")
            .attr("x1", cx)
            .attr("y1", cy)
            .attr("x2", cx + dx)
            .attr("y2", cy + dy)
            .attr("stroke", "black")
            .attr("stroke-width", 1);

        svg.append("text")
            .attr("x", cx + dx)
            .attr("y", cy + dy)
            .text(text)
            .attr("font-size", "11px")
            .attr("font-weight", "bold")
            .attr("dy", dy < 0 ? "-5px" : "15px")
            .attr("text-anchor", dx < 0 ? "end" : "start");
    },

    enableEditing: function (svg) {
        svg.selectAll("text, path, rect, circle").classed("draggable", true)
            .on("click", function (event) {
                event.stopPropagation();
                window.app.selectElement(this);
            });
    }
};
