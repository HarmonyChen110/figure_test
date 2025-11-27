const Figure4 = {
    render: function (containerId) {
        const container = d3.select(containerId);
        container.html("");

        const width = 1000;
        const height = 600;
        const panelHeight = 180;
        const gap = 20;

        const svg = container.append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("class", "chart-svg");

        // Define Panels
        const panels = [
            { id: "A", title: "Panel A: The Aging Pipeline", color: "#FFF5F5", stroke: getColor("red"), y: 0 },
            { id: "B", title: "Panel B: The Nano-Enhancement Pipeline", color: "#F0F8FF", stroke: getColor("blue"), y: panelHeight + gap },
            { id: "C", title: "Panel C: The Mixture Unmixing Pipeline", color: "#F0FFF0", stroke: getColor("green"), y: (panelHeight + gap) * 2 }
        ];

        panels.forEach(panel => {
            const g = svg.append("g").attr("transform", `translate(0, ${panel.y})`);

            // Container
            g.append("rect")
                .attr("x", 10)
                .attr("y", 10)
                .attr("width", width - 20)
                .attr("height", panelHeight)
                .attr("rx", 10)
                .attr("fill", panel.color)
                .attr("stroke", panel.stroke)
                .attr("stroke-width", 2);

            // Title
            g.append("text")
                .attr("x", 30)
                .attr("y", 40)
                .text(panel.title)
                .attr("font-weight", "bold")
                .attr("font-size", "16px")
                .attr("fill", getColor("darkBlue"));

            // Draw Pipeline Content based on ID
            if (panel.id === "A") this.drawPanelA(g, panelHeight);
            if (panel.id === "B") this.drawPanelB(g, panelHeight);
            if (panel.id === "C") this.drawPanelC(g, panelHeight);
        });

        if (window.app && window.app.isEditMode) {
            this.enableEditing(svg);
        }
    },

    drawPanelA: function (g, h) {
        const centerY = h / 2 + 10;

        // Input: Raw Aged Spectrum
        this.drawSpectrum(g, 100, centerY, "red", true);
        g.append("text").attr("x", 100).attr("y", centerY + 50).text("Raw Aged Spectrum").attr("text-anchor", "middle").attr("font-size", "12px");

        // Arrow
        this.drawArrow(g, 180, centerY, 280, centerY);

        // AI Core: CNN Cube
        g.append("rect").attr("x", 300).attr("y", centerY - 30).attr("width", 60).attr("height", 60).attr("fill", "#ddd").attr("stroke", "black");
        g.append("rect").attr("x", 310).attr("y", centerY - 40).attr("width", 60).attr("height", 60).attr("fill", "none").attr("stroke", "black");
        g.append("line").attr("x1", 300).attr("y1", centerY - 30).attr("x2", 310).attr("y2", centerY - 40).attr("stroke", "black");
        g.append("line").attr("x1", 360).attr("y1", centerY + 30).attr("x2", 370).attr("y2", centerY + 20).attr("stroke", "black");
        g.append("text").attr("x", 335).attr("y", centerY + 50).text("CNN Feature Extractor").attr("text-anchor", "middle").attr("font-size", "12px").attr("font-weight", "bold");
        g.append("text").attr("x", 335).attr("y", centerY + 65).text("Ref: S30076").attr("text-anchor", "middle").attr("font-size", "10px").attr("fill", "gray").attr("font-style", "italic");

        // Arrow
        this.drawArrow(g, 400, centerY, 500, centerY);

        // Output: Chemical Structure (Simplified)
        g.append("hexagon"); // Placeholder for structure
        g.append("circle").attr("cx", 550).attr("cy", centerY).attr("r", 20).attr("fill", "none").attr("stroke", "black").attr("stroke-width", 2);
        g.append("text").attr("x", 550).attr("y", centerY).text("C=O").attr("text-anchor", "middle").attr("dy", "5px");
        g.append("text").attr("x", 550).attr("y", centerY + 50).text("Carbonyl Index Quantified").attr("text-anchor", "middle").attr("font-size", "12px");

        // Ref Arrow
        g.append("text").attr("x", 450).attr("y", centerY - 10).text("Ref: S40158").attr("text-anchor", "middle").attr("font-size", "10px").attr("fill", "gray");
    },

    drawPanelB: function (g, h) {
        const centerY = h / 2 + 10;

        // Input: Weak Signal
        g.append("path")
            .attr("d", `M 80 ${centerY} q 10 2, 20 0 t 20 0`)
            .attr("stroke", "gray")
            .attr("fill", "none");
        g.append("text").attr("x", 100).attr("y", centerY + 50).text("Weak Signal (<100nm)").attr("text-anchor", "middle").attr("font-size", "12px");

        // Arrow
        this.drawArrow(g, 150, centerY, 250, centerY);

        // AI Core: Funnel + Neural Net
        // Funnel
        g.append("path").attr("d", `M 280 ${centerY - 30} L 320 ${centerY - 30} L 310 ${centerY + 30} L 290 ${centerY + 30} Z`).attr("fill", "#ddd").attr("stroke", "black");
        // Neural Net Grid
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                g.append("circle").attr("cx", 350 + i * 15).attr("cy", centerY - 15 + j * 15).attr("r", 3).attr("fill", getColor("blue"));
            }
        }
        g.append("text").attr("x", 330).attr("y", centerY + 50).text("Signal Enhancement AI").attr("text-anchor", "middle").attr("font-size", "12px").attr("font-weight", "bold");
        g.append("text").attr("x", 330).attr("y", centerY + 65).text("Ref: S30068").attr("text-anchor", "middle").attr("font-size", "10px").attr("fill", "gray").attr("font-style", "italic");

        // Glowing Arrow
        this.drawArrow(g, 420, centerY, 520, centerY, getColor("blue"));

        // Output: Amplified Signature
        this.drawSpectrum(g, 570, centerY, getColor("blue"), false, 2); // High amplitude
        g.append("text").attr("x", 570).attr("y", centerY + 50).text("Amplified Signature").attr("text-anchor", "middle").attr("font-size", "12px");
    },

    drawPanelC: function (g, h) {
        const centerY = h / 2 + 10;

        // Input: Mixed
        this.drawSpectrum(g, 100, centerY, "purple", true); // Messy
        g.append("text").attr("x", 100).attr("y", centerY + 50).text("Mixed Contaminants").attr("text-anchor", "middle").attr("font-size", "12px");

        // Arrow
        this.drawArrow(g, 180, centerY, 280, centerY);

        // AI Core: Prism
        g.append("path").attr("d", `M 300 ${centerY + 30} L 330 ${centerY - 30} L 360 ${centerY + 30} Z`).attr("fill", "none").attr("stroke", "black").attr("stroke-width", 2);
        g.append("text").attr("x", 330).attr("y", centerY + 50).text("Blind Source Separation").attr("text-anchor", "middle").attr("font-size", "12px").attr("font-weight", "bold");
        g.append("text").attr("x", 330).attr("y", centerY + 65).text("Ref: S30060").attr("text-anchor", "middle").attr("font-size", "10px").attr("fill", "gray").attr("font-style", "italic");

        // Split Arrows
        g.append("line").attr("x1", 380).attr("y1", centerY).attr("x2", 450).attr("y2", centerY - 30).attr("stroke", "black").attr("marker-end", "url(#arrow)");
        g.append("line").attr("x1", 380).attr("y1", centerY).attr("x2", 450).attr("y2", centerY + 30).attr("stroke", "black").attr("marker-end", "url(#arrow)");

        // Output: Separated
        this.drawSpectrum(g, 500, centerY - 30, getColor("green"), false);
        g.append("text").attr("x", 500).attr("y", centerY - 10).text("Pure MP Signal").attr("text-anchor", "middle").attr("font-size", "10px");

        this.drawSpectrum(g, 500, centerY + 30, "brown", false);
        g.append("text").attr("x", 500).attr("y", centerY + 50).text("Organic Matter").attr("text-anchor", "middle").attr("font-size", "10px");
    },

    drawSpectrum: function (g, x, y, color, noisy, scale = 1) {
        const points = [];
        for (let i = 0; i < 50; i++) {
            let val = Math.sin(i * 0.2) * 10 * scale;
            if (noisy) val += (Math.random() - 0.5) * 5;
            if (i > 20 && i < 30) val -= 20 * scale; // Peak
            points.push([x - 25 + i, y + val]);
        }
        const line = d3.line().curve(d3.curveBasis);
        g.append("path").attr("d", line(points)).attr("stroke", color).attr("fill", "none").attr("stroke-width", 1.5);
    },

    drawArrow: function (g, x1, y1, x2, y2, color = "black") {
        g.append("defs").append("marker")
            .attr("id", "arrow")
            .attr("viewBox", "0 0 10 10")
            .attr("refX", 5)
            .attr("refY", 5)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto-start-reverse")
            .append("path")
            .attr("d", "M 0 0 L 10 5 L 0 10 z")
            .attr("fill", color);

        g.append("line")
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", x2)
            .attr("y2", y2)
            .attr("stroke", color)
            .attr("stroke-width", 2)
            .attr("marker-end", "url(#arrow)");
    },

    enableEditing: function (svg) {
        svg.selectAll("text, path, rect, circle, line").classed("draggable", true)
            .on("click", function (event) {
                event.stopPropagation();
                window.app.selectElement(this);
            });
    }
};
