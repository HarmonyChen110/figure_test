const Figure4 = {
    render: function (containerId) {
        const container = d3.select(containerId);
        container.html("");

        // Load the Python-generated SVG if available, or render D3 version
        // For now, we will render the D3 version but updated to match the Python style

        const width = 1000;
        const height = 800; // Increased height for better spacing
        const panelHeight = 250;
        const gap = 30;

        const svg = container.append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("class", "chart-svg");

        // Colors from Python script
        const COLOR_A = '#E63946'; // Red
        const COLOR_B = '#457B9D'; // Blue
        const COLOR_C = '#2A9D8F'; // Green
        const BG_COLOR = '#F1FAEE';

        // Define Panels
        const panels = [
            { id: "A", title: "Panel A: The Aging Pipeline", color: BG_COLOR, stroke: COLOR_A, y: 0 },
            { id: "B", title: "Panel B: Nano-Enhancement Pipeline", color: BG_COLOR, stroke: COLOR_B, y: panelHeight + gap },
            { id: "C", title: "Panel C: Mixture Unmixing Pipeline", color: BG_COLOR, stroke: COLOR_C, y: (panelHeight + gap) * 2 }
        ];

        panels.forEach(panel => {
            const g = svg.append("g").attr("transform", `translate(0, ${panel.y})`);

            // Panel Box (FancyBboxPatch style)
            g.append("rect")
                .attr("x", 10)
                .attr("y", 10)
                .attr("width", width - 20)
                .attr("height", panelHeight)
                .attr("rx", 15) // Rounder corners
                .attr("fill", "none") // Transparent face
                .attr("stroke", panel.stroke)
                .attr("stroke-width", 2);

            // Title
            g.append("text")
                .attr("x", 30)
                .attr("y", 40)
                .text(panel.title)
                .attr("font-weight", "bold")
                .attr("font-size", "18px")
                .attr("font-family", "Arial, sans-serif")
                .attr("fill", panel.stroke);

            // Draw Pipeline Content based on ID
            if (panel.id === "A") this.drawPanelA(g, panelHeight, COLOR_A);
            if (panel.id === "B") this.drawPanelB(g, panelHeight, COLOR_B);
            if (panel.id === "C") this.drawPanelC(g, panelHeight, COLOR_C);
        });

        if (window.app && window.app.isEditMode) {
            this.enableEditing(svg);
        }
    },

    // Helper to generate mathematical waveforms (matching Python logic)
    generateWaveform: function (type) {
        const points = [];
        const numPoints = 100;
        const scaleX = 2; // Scale to fit in box

        for (let i = 0; i < numPoints; i++) {
            const x = i / 10; // 0 to 10
            let y = 0;

            if (type === 'aged') {
                // 0.5 * np.exp(-(x-3)**2/0.5) + 0.3 * np.exp(-(x-7)**2/1.0) + noise
                y = 0.5 * Math.exp(-Math.pow(x - 3, 2) / 0.5) +
                    0.3 * Math.exp(-Math.pow(x - 7, 2) / 1.0) +
                    0.05 * (Math.random() - 0.5);
            } else if (type === 'weak') {
                // 0.05 * np.exp(-(x-5)**2/0.1) + noise
                y = 0.05 * Math.exp(-Math.pow(x - 5, 2) / 0.1) +
                    0.05 * (Math.random() - 0.5);
            } else if (type === 'amplified') {
                // 0.9 * np.exp(-(x-5)**2/0.2)
                y = 0.9 * Math.exp(-Math.pow(x - 5, 2) / 0.2);
            } else if (type === 'mixture') {
                // 0.6 * np.exp(-(x-4)**2/0.3) + 0.4 * np.exp(-(x-4.5)**2/0.4) + sine
                y = 0.6 * Math.exp(-Math.pow(x - 4, 2) / 0.3) +
                    0.4 * Math.exp(-Math.pow(x - 4.5, 2) / 0.4) +
                    0.1 * Math.sin(x * 2);
            } else if (type === 'comp1') {
                y = 0.6 * Math.exp(-Math.pow(x - 4, 2) / 0.3);
            } else if (type === 'comp2') {
                y = 0.4 * Math.exp(-Math.pow(x - 4.5, 2) / 0.4);
            }

            points.push({ x: x, y: y });
        }
        return points;
    },

    drawWaveformPlot: function (g, x, y, w, h, type, color, label) {
        const data = this.generateWaveform(type);

        // Scales
        const xScale = d3.scaleLinear().domain([0, 10]).range([0, w]);
        const yScale = d3.scaleLinear().domain([0, 1]).range([h, 0]);

        const line = d3.line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y))
            .curve(d3.curveBasis); // Smooth curve

        const plotG = g.append("g").attr("transform", `translate(${x}, ${y})`);

        // Axes (minimal)
        plotG.append("line").attr("x1", 0).attr("y1", h).attr("x2", w).attr("y2", h).attr("stroke", "black").attr("stroke-width", 1);
        plotG.append("line").attr("x1", 0).attr("y1", 0).attr("x2", 0).attr("y2", h).attr("stroke", "black").attr("stroke-width", 1);

        // Line
        plotG.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("stroke-width", 2)
            .attr("d", line);

        // Label
        if (label) {
            g.append("text")
                .attr("x", x + w / 2)
                .attr("y", y + h + 20)
                .text(label)
                .attr("text-anchor", "middle")
                .attr("font-size", "12px")
                .attr("font-family", "Arial");
        }
    },

    drawPanelA: function (g, h, color) {
        const centerY = h / 2;

        // 1. Input: Raw Aged Spectrum
        this.drawWaveformPlot(g, 50, centerY - 40, 150, 80, 'aged', color, "Raw Aged Spectrum");

        // Arrow
        this.drawArrow(g, 220, centerY, 300, centerY);

        // 2. Process: CNN Box
        g.append("rect").attr("x", 320).attr("y", centerY - 40).attr("width", 100).attr("height", 80).attr("fill", "#ddd").attr("stroke", "black");
        g.append("text").attr("x", 370).attr("y", centerY).text("CNN Model").attr("text-anchor", "middle").attr("font-weight", "bold").attr("font-size", "14px");
        g.append("text").attr("x", 370).attr("y", centerY + 20).text("Feature Extraction").attr("text-anchor", "middle").attr("font-size", "10px").attr("font-style", "italic");

        // Arrow
        this.drawArrow(g, 440, centerY, 520, centerY);

        // 3. Output: Index
        g.append("circle").attr("cx", 580).attr("cy", centerY).attr("r", 40).attr("fill", "white").attr("stroke", "black");
        g.append("text").attr("x", 580).attr("y", centerY - 5).text("Carbonyl Index").attr("text-anchor", "middle").attr("font-size", "10px");
        g.append("text").attr("x", 580).attr("y", centerY + 15).text("(C=O) ≈ 0.85").attr("text-anchor", "middle").attr("font-weight", "bold");
    },

    drawPanelB: function (g, h, color) {
        const centerY = h / 2;

        // 1. Input: Weak Signal
        this.drawWaveformPlot(g, 50, centerY - 40, 150, 80, 'weak', 'gray', "Weak Signal (<SNR 2)");

        // Arrow
        this.drawArrow(g, 220, centerY, 300, centerY);

        // 2. Process: Denoising Autoencoder (Trapezoid)
        const trapPoints = [
            { x: 320, y: centerY - 40 }, { x: 420, y: centerY - 40 }, // Top
            { x: 400, y: centerY + 40 }, { x: 340, y: centerY + 40 }  // Bottom
        ];
        const line = d3.line().x(d => d.x).y(d => d.y);
        g.append("path").attr("d", line(trapPoints) + "Z").attr("fill", "#ddd").attr("stroke", "black");
        g.append("text").attr("x", 370).attr("y", centerY + 5).text("Denoising").attr("text-anchor", "middle").attr("font-size", "12px");
        g.append("text").attr("x", 370).attr("y", centerY + 20).text("Autoencoder").attr("text-anchor", "middle").attr("font-size", "12px");

        // Arrow
        this.drawArrow(g, 440, centerY, 520, centerY);

        // 3. Output: Amplified
        this.drawWaveformPlot(g, 540, centerY - 40, 150, 80, 'amplified', color, "Recovered Signature");
    },

    drawPanelC: function (g, h, color) {
        const centerY = h / 2;

        // 1. Input: Mixture
        this.drawWaveformPlot(g, 50, centerY - 40, 150, 80, 'mixture', 'purple', "Mixed Contaminants");

        // Arrow
        this.drawArrow(g, 220, centerY, 300, centerY);

        // 2. Process: Separation Triangle
        const triPoints = [
            { x: 320, y: centerY + 40 }, { x: 370, y: centerY - 40 }, { x: 420, y: centerY + 40 }
        ];
        const line = d3.line().x(d => d.x).y(d => d.y);
        g.append("path").attr("d", line(triPoints) + "Z").attr("fill", "#ddd").attr("stroke", "black");
        g.append("text").attr("x", 370).attr("y", centerY + 20).text("Blind Source").attr("text-anchor", "middle").attr("font-size", "10px");
        g.append("text").attr("x", 370).attr("y", centerY + 35).text("Separation").attr("text-anchor", "middle").attr("font-size", "10px");

        // Split Arrows
        this.drawArrow(g, 430, centerY, 500, centerY - 50);
        this.drawArrow(g, 430, centerY, 500, centerY + 50);

        // 3. Output: Separated
        this.drawWaveformPlot(g, 520, centerY - 90, 120, 60, 'comp1', color, "Component 1 (MP)");
        this.drawWaveformPlot(g, 520, centerY + 10, 120, 60, 'comp2', 'brown', "Component 2 (Bio)");
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
            .attr("stroke-width", 1.5)
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

