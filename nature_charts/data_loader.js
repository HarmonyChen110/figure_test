/**
 * Data Loader & Extractor Module
 * 负责从 chapter_S2.json 提取真实数据，并分析缺失字段
 */
const DataLoader = {
    jsonPath: '../chapter_S2.json',

    // 核心提取函数
    extractData: async function () {
        try {
            const response = await fetch(this.jsonPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const rawData = await response.json();
            return this.processData(rawData);
        } catch (error) {
            console.error("Failed to load JSON:", error);
            alert("无法加载 chapter_S2.json。请确保通过服务器(localhost)访问，且文件路径正确。");
            return null;
        }
    },

    // 数据处理与缺失分析
    processData: function (rawData) {
        const table2Data = [];
        const missingReport = [];
        const figure3Data = null; // JSON中完全没有原始分布数据

        // 1. 处理 Table 2 数据 (尝试映射)
        rawData.forEach(item => {
            // 遍历每个文献中的挑战模块
            if (item.challenge_modules && item.challenge_modules.length > 0) {
                item.challenge_modules.forEach(module => {
                    const extractedRow = {
                        group: module.chapter_tags ? module.chapter_tags[0] : "Other",
                        technique: item.sop_metadata, // 使用 SOP ID
                        model: "N/A", // JSON中未记录 AI 模型
                        target: module.process_and_challenge.technique_or_method || "Unknown Method",
                        accuracy: module.confidence_score ? module.confidence_score.score : 0, // 使用置信度作为数值代理
                        efficiency: "-",
                        ref: item.bibliometric.paper_id ? item.bibliometric.paper_id.substring(0, 10) + "..." : "Ref",
                        highlightEff: false,
                        isRealData: true
                    };

                    // 尝试从挑战描述中提取效率相关信息
                    const challenges = module.process_and_challenge.identified_challenges || [];
                    const effChallenge = challenges.find(c =>
                        c.challenge_type.toLowerCase().includes("efficiency") ||
                        c.challenge_type.toLowerCase().includes("time") ||
                        c.description_of_challenge.toLowerCase().includes("time")
                    );

                    if (effChallenge) {
                        extractedRow.efficiency = "⚠️ " + effChallenge.challenge_type; // 标记为定性描述
                        extractedRow.highlightEff = true;
                    }

                    // 记录缺失字段
                    const missingFields = [];
                    if (!module.process_and_challenge.technique_or_method) missingFields.push("Technique/Method");
                    // 既然我们知道JSON是文献综述，肯定没有AI模型和定量准确率，这里专门标注
                    missingFields.push("Quantitative Accuracy (Using Confidence Score instead)");
                    missingFields.push("AI Model Architecture");
                    missingFields.push("Quantitative Efficiency Metric");

                    missingReport.push({
                        id: module.module_id,
                        source: item.bibliometric.title,
                        missing: missingFields
                    });

                    table2Data.push(extractedRow);
                });
            }
        });

        // 2. 分析 Figure 3 数据 (完全缺失)
        missingReport.push({
            id: "FIGURE_3_DATASET",
            source: "Global",
            missing: ["Raw Distribution Data Arrays (Required for Raincloud Plot)", "Statistical Groupings (Microscope/SEM/UAV)"]
        });

        return {
            table2: table2Data,
            figure3: figure3Data,
            report: missingReport
        };
    }
};
