const App = {
    currentChart: 'table2',
    isEditMode: false,
    selectedElement: null,

    init: function () {
        this.bindEvents();
        this.renderCurrentChart();
        updateCSSVariables(); // Init colors
    },

    bindEvents: function () {
        // Tab Switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.chart-panel').forEach(p => p.classList.remove('active'));

                e.target.classList.add('active');
                const chartId = e.target.dataset.chart;
                document.getElementById(`${chartId}-container`).classList.add('active');

                this.currentChart = chartId;
                this.renderCurrentChart();
            });
        });

        // Global Controls
        document.getElementById('toggleLabels').addEventListener('click', () => {
            const texts = document.querySelectorAll('text');
            texts.forEach(t => {
                t.style.display = t.style.display === 'none' ? 'block' : 'none';
            });
        });

        document.getElementById('editMode').addEventListener('click', (e) => {
            this.isEditMode = !this.isEditMode;
            e.target.classList.toggle('active');
            const panel = document.getElementById('editPanel');
            if (this.isEditMode) {
                panel.classList.remove('hidden');
                e.target.style.backgroundColor = '#e0e0e0';
            } else {
                panel.classList.add('hidden');
                e.target.style.backgroundColor = '';
                this.deselectElement();
            }
            this.renderCurrentChart(); // Re-render to attach/detach listeners
        });

        document.getElementById('colorScheme').addEventListener('change', (e) => {
            if (e.target.value === 'custom') {
                document.getElementById('customColorPanel').classList.remove('hidden');
            } else {
                setColorScheme(e.target.value);
                document.getElementById('customColorPanel').classList.add('hidden');
                this.renderCurrentChart();
            }
        });

        // Export Buttons
        document.querySelectorAll('.export-png').forEach(btn => {
            btn.addEventListener('click', () => this.exportPNG());
        });

        document.querySelectorAll('.export-svg').forEach(btn => {
            btn.addEventListener('click', () => this.exportSVG());
        });

        // Zoom Buttons
        document.querySelectorAll('.zoom-btn').forEach(btn => {
            btn.addEventListener('click', () => this.openFullscreen());
        });

        // Modal Controls
        document.querySelector('.close-modal').addEventListener('click', () => {
            document.getElementById('fullscreenModal').style.display = 'none';
        });

        // Edit Panel Controls
        document.getElementById('closeEditPanel').addEventListener('click', () => {
            this.isEditMode = false;
            document.getElementById('editMode').click();
        });

        document.getElementById('applyTextChange').addEventListener('click', () => {
            if (this.selectedElement && this.selectedElement.tagName === 'text') {
                d3.select(this.selectedElement).text(document.getElementById('editText').value);
            }
        });

        document.getElementById('applyColorChange').addEventListener('click', () => {
            if (this.selectedElement) {
                d3.select(this.selectedElement).attr('fill', document.getElementById('editColor').value);
            }
        });

        document.getElementById('deleteElement').addEventListener('click', () => {
            if (this.selectedElement) {
                d3.select(this.selectedElement).remove();
                this.deselectElement();
            }
        });

        // Custom Color Panel
        document.getElementById('closeColorPanel').addEventListener('click', () => {
            document.getElementById('customColorPanel').classList.add('hidden');
        });

        document.getElementById('applyCustomColors').addEventListener('click', () => {
            const colors = {
                red: document.getElementById('customRed').value,
                blue: document.getElementById('customBlue').value,
                green: document.getElementById('customGreen').value,
                darkBlue: document.getElementById('customDarkBlue').value
            };
            setCustomColors(colors);
            this.renderCurrentChart();
        });

        // CSV Import
        document.getElementById('importCSV').addEventListener('click', () => {
            document.getElementById('csvFileInput').click();
        });

        document.getElementById('csvFileInput').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const csvData = d3.csvParse(event.target.result);
                    console.log("Imported Data:", csvData);
                    alert("CSV Imported! Check console for data structure. (Integration logic to be implemented based on specific CSV format)");
                    // Here you would map csvData to Table2.data or Figure3.data
                };
                reader.readAsText(file);
            }
        });

        // Real Data Extraction
        document.getElementById('loadRealData').addEventListener('click', async () => {
            if (typeof DataLoader === 'undefined') {
                alert("Data Loader module not loaded!");
                return;
            }

            const result = await DataLoader.extractData();
            if (result) {
                this.handleRealData(result);
            }
        });
    },

    handleRealData: function (result) {
        // 1. Update Table 2
        if (result.table2 && result.table2.length > 0) {
            Table2.data = result.table2;
            // Switch to Table 2 tab
            document.querySelector('.tab-btn[data-chart="table2"]').click();
            // Re-render
            Table2.render('#table2-chart');
        }

        // 2. Handle Figure 3 (Missing)
        if (!result.figure3) {
            const fig3Container = document.getElementById('figure3-chart');
            fig3Container.innerHTML = `
                <div style="padding: 20px; text-align: center; color: #666;">
                    <h3>⚠️ 数据缺失 (Data Missing)</h3>
                    <p>JSON 源文件中未包含用于绘制雨云图的原始分布数据 (Raw Distribution Data)。</p>
                    <p>Figure 3 无法基于定性文献综述生成。</p>
                </div>
            `;
        }

        // 3. Show Report
        this.showMissingReport(result.report);
    },

    showMissingReport: function (report) {
        // Create a simple modal or alert to show the report
        let reportText = "数据提取与缺失字段报告 (Data Extraction Report):\n\n";

        // Summary
        const totalItems = report.length;
        const fig3Missing = report.find(r => r.id === "FIGURE_3_DATASET");

        reportText += `总计处理条目: ${Table2.data.length}\n`;
        if (fig3Missing) {
            reportText += `[CRITICAL] Figure 3 数据完全缺失: ${fig3Missing.missing.join(", ")}\n\n`;
        }

        reportText += "详细缺失字段 (前5条示例):\n";
        report.slice(0, 5).forEach(r => {
            if (r.id !== "FIGURE_3_DATASET") {
                reportText += `- ID: ${r.id}\n  Source: ${r.source.substring(0, 30)}...\n  Missing: ${r.missing.join(", ")}\n`;
            }
        });

        if (report.length > 5) {
            reportText += `\n... 以及其他 ${report.length - 6} 条记录。`;
        }

        alert(reportText);
        console.log("Full Missing Data Report:", report);
    },

    renderCurrentChart: function () {
        const containerId = `#${this.currentChart}-chart`;
        if (this.currentChart === 'table2') {
            Table2.render(containerId);
        } else if (this.currentChart === 'figure3') {
            Figure3.render(containerId);
        } else if (this.currentChart === 'figure4') {
            Figure4.render(containerId);
        }
    },

    selectElement: function (element) {
        this.deselectElement();
        this.selectedElement = element;
        d3.select(element).classed('selected', true);

        const tagName = element.tagName;
        document.getElementById('selectedElement').innerText = tagName;

        if (tagName === 'text') {
            document.getElementById('editText').value = d3.select(element).text();
            document.getElementById('editText').disabled = false;
        } else {
            document.getElementById('editText').value = "";
            document.getElementById('editText').disabled = true;
        }
    },

    deselectElement: function () {
        if (this.selectedElement) {
            d3.select(this.selectedElement).classed('selected', false);
            this.selectedElement = null;
            document.getElementById('selectedElement').innerText = "未选择任何元素";
            document.getElementById('editText').value = "";
        }
    },

    exportPNG: function () {
        const svg = document.querySelector(`#${this.currentChart}-chart svg`);
        const serializer = new XMLSerializer();
        const source = serializer.serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const img = new Image();
        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source);

        img.onload = () => {
            canvas.width = svg.getBoundingClientRect().width * 2; // High res
            canvas.height = svg.getBoundingClientRect().height * 2;
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(function (blob) {
                saveAs(blob, "chart.png");
            });
        };
    },

    exportSVG: function () {
        const svg = document.querySelector(`#${this.currentChart}-chart svg`);
        const serializer = new XMLSerializer();
        let source = serializer.serializeToString(svg);

        // Add namespaces
        if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
            source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        if (!source.match(/^<svg[^>]+xmlns:xlink="http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
            source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
        }

        const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
        saveAs(blob, "chart.svg");
    },

    openFullscreen: function () {
        const modal = document.getElementById('fullscreenModal');
        const modalContainer = document.getElementById('modal-chart-container');
        const title = document.getElementById('modal-title');

        modal.style.display = 'block';
        title.innerText = document.querySelector('.chart-panel.active h2').innerText;

        // Clone current chart to modal
        modalContainer.innerHTML = "";
        const chartId = `#${this.currentChart}-chart`;
        if (this.currentChart === 'table2') Table2.render('#modal-chart-container');
        if (this.currentChart === 'figure3') Figure3.render('#modal-chart-container');
        if (this.currentChart === 'figure4') Figure4.render('#modal-chart-container');
    }
};

// Initialize App
window.app = App;
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
