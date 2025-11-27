const Table2 = {
    data: [
        { group: "FTIR", technique: "S30001", model: "LeNet5", target: "Polymer", accuracy: 96.93, efficiency: "-", ref: "S30001" },
        { group: "FTIR", technique: "S30050", model: "MLP", target: "Size", accuracy: 99.96, efficiency: "⚡ Hours → Mins", ref: "S30050", highlightEff: true },
        { group: "Raman", technique: "S30038", model: "Sparse AE", target: "Additives", accuracy: 99.1, efficiency: "-", ref: "S30038" },
        { group: "Raman", technique: "S30101", model: "CNN", target: "MP", accuracy: 97.77, efficiency: "⚡ 0.4s/particle", ref: "S30101", highlightEff: true },
        { group: "Raman", technique: "S30109", model: "ResNet+SE", target: "Low Quality", accuracy: 97.83, efficiency: "-", ref: "S30109" },
        { group: "LIF", technique: "S30112", model: "Cont-conv", target: "Weathered", accuracy: 99.5, efficiency: "-", ref: "S30112" },
        { group: "LIF", technique: "S30153", model: "PCA-SVM", target: "Mixed", accuracy: 100, efficiency: "-", ref: "S30153" },
        { group: "NIR/Hyper", technique: "S30007", model: "CNN", target: "Sorting", accuracy: 92.6, efficiency: "-", ref: "S30007" },
        { group: "NIR/Hyper", technique: "S30114", model: "SVM/RF", target: "Soil Matrix", accuracy: 99.9, efficiency: "-", ref: "S30114" }
    ],

    render: function (containerId) {
        const container = d3.select(containerId);
        container.html(""); // Clear previous content

        const width = 1000;
        const rowHeight = 50;
        const headerHeight = 60;
        const height = headerHeight + this.data.length * rowHeight;

        const svg = container.append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .attr("class", "chart-svg");

        // Define columns
        const cols = [
            { name: "Technique", x: 20, width: 150 },
            { name: "AI Algorithm", x: 170, width: 150 },
            { name: "Target", x: 320, width: 120 },
            { name: "Accuracy/R²", x: 440, width: 250 },
            { name: "Efficiency", x: 690, width: 200 },
            { name: "Ref ID", x: 890, width: 90 }
        ];

        // Draw Header
        const headerGroup = svg.append("g").attr("class", "header-group");

        headerGroup.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", width)
            .attr("height", headerHeight)
            .attr("fill", getColor("headerBg"));

        cols.forEach(col => {
            headerGroup.append("text")
                .attr("x", col.x)
                .attr("y", headerHeight / 2 + 5)
                .text(col.name)
                .attr("font-weight", "bold")
                .attr("fill", getColor("darkBlue"))
                .attr("font-size", "14px");
        });

        // Draw Rows
        const rows = svg.selectAll(".row")
            .data(this.data)
            .enter()
            .append("g")
            .attr("class", "row")
            .attr("transform", (d, i) => `translate(0, ${headerHeight + i * rowHeight})`);

        // Row Background & Separator
        rows.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", width)
            .attr("height", rowHeight)
            .attr("fill", "white")
            .attr("stroke-bottom", getColor("grid"));

        rows.append("line")
            .attr("x1", 0)
            .attr("y1", rowHeight)
            .attr("x2", width)
            .attr("y2", rowHeight)
            .attr("stroke", getColor("grid"))
            .attr("stroke-width", 1);

        // 1. Technique (Grouped)
        // Logic to draw group brackets would go here, simplified for now
        rows.append("text")
            .attr("x", cols[0].x)
            .attr("y", rowHeight / 2 + 5)
            .text(d => d.group + " | " + d.technique)
            .attr("font-weight", "bold")
            .attr("fill", getColor("text"))
            .attr("font-size", "13px");

        // 2. AI Algorithm
        rows.append("text")
            .attr("x", cols[1].x)
            .attr("y", rowHeight / 2 + 5)
            .text(d => d.model)
            .attr("fill", getColor("text"))
            .attr("font-size", "13px");

        // 3. Target
        rows.append("text")
            .attr("x", cols[2].x)
            .attr("y", rowHeight / 2 + 5)
            .text(d => d.target)
            .attr("fill", "#888")
            .attr("font-size", "12px");

        // 4. Accuracy Bar
        const barScale = d3.scaleLinear().domain([0, 100]).range([0, 180]);

        rows.each(function (d) {
            const g = d3.select(this);
            const barColor = d.accuracy > 99 ? getColor("green") : (d.accuracy >= 95 ? getColor("blue") : getColor("orange"));

            // Background bar
            g.append("rect")
                .attr("x", cols[3].x)
                .attr("y", rowHeight / 2 - 6)
                .attr("width", 180)
                .attr("height", 12)
                .attr("fill", "#eee")
                .attr("rx", 6);

            // Value bar
            g.append("rect")
                .attr("x", cols[3].x)
                .attr("y", rowHeight / 2 - 6)
                .attr("width", barScale(d.accuracy))
                .attr("height", 12)
                .attr("fill", barColor)
                .attr("rx", 6);

            // Text value
            g.append("text")
                .attr("x", cols[3].x + 190)
                .attr("y", rowHeight / 2 + 5)
                .text(d.accuracy + "%")
                .attr("font-weight", "bold")
                .attr("fill", "black")
                .attr("font-size", "12px");
        });

        // 5. Efficiency
        rows.append("text")
            .attr("x", cols[4].x)
            .attr("y", rowHeight / 2 + 5)
            .text(d => d.efficiency)
            .attr("fill", d => d.highlightEff ? getColor("red") : getColor("text"))
            .attr("font-weight", d => d.highlightEff ? "bold" : "normal")
            .attr("font-size", "13px");

        // 6. Ref ID
        rows.append("text")
            .attr("x", cols[5].x)
            .attr("y", rowHeight / 2 + 5)
            .text(d => d.ref)
            .attr("font-family", "Courier New, monospace")
            .attr("fill", "#666")
            .attr("font-size", "12px");

        // Add interactivity for editing
        if (window.app && window.app.isEditMode) {
            this.enableEditing(svg);
        }
    },

    enableEditing: function (svg) {
        svg.selectAll("text, rect").classed("draggable", true)
            .on("click", function (event) {
                event.stopPropagation();
                window.app.selectElement(this);
            });
    }
};
