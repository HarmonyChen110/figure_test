# 图表解读与数据来源说明文档

## 1. 数据真实性声明 (Data Authenticity Statement)

**回答您的问题：目前的图表（Table 2 和 Figure 3）所展示的数据均为“模拟演示数据”，并非来自 `chapter_S2.json` 中的真实文献数据。**

*   **真实数据 (`chapter_S2.json`)**：包含的是文献的元数据（标题、作者、摘要）以及定性的“挑战模块”描述（如 "Complexity", "Cost"）。ID 编号为 `S2xxxx` 系列。
*   **图表数据 (当前展示)**：为了展示图表的交互功能（如热力图颜色映射、雨云图分布），代码中内置了结构化的模拟性能指标（如准确率、处理效率）。ID 编号为 `S3xxxx` 系列。

---

## 2. 图表解读 (Academic Interpretation)

以下是按照学术论文标准，对当前图表（假设数据为真实）进行的解读。

### Figure 1 (对应界面中的 Table 2): 光谱分析 AI 性能概览

**Figure 1 | Performance comparison of AI algorithms across different spectroscopic techniques for microplastic analysis.** 
The table summarizes the accuracy and efficiency of various machine learning models applied to FTIR, Raman, LIF, and NIR/Hyperspectral imaging data. **(a)** **Technique & Model**: Columns list the spectroscopic method and the specific AI architecture used (e.g., LeNet5, CNN, SVM). **(b)** **Target**: Indicates the classification goal, such as polymer type, particle size, or weathering state. **(c)** **Accuracy**: Horizontal bars visualize the classification accuracy (%), with color coding indicating performance tiers (Green > 99%, Blue > 95%, Orange < 95%). **(d)** **Efficiency**: Highlights computational speed improvements, with significant breakthroughs marked (e.g., "Hours → Mins").

**解读 (Interpretation):**
该表揭示了深度学习模型在微塑料光谱分析中的显著优势。
1.  **高准确率**: 绝大多数 AI 模型（特别是针对 FTIR 和 LIF 技术）实现了超过 95% 的分类准确率，其中针对混合样本（Mixed）的 PCA-SVM 模型甚至达到了 100% 的理论准确率。
2.  **效率突破**: 传统的 MLP 模型在处理尺寸（Size）分析时，将处理时间从“小时级”缩短至“分钟级”，显示了 AI 在高通量数据处理中的巨大潜力。
3.  **技术差异**: 相比之下，NIR/高光谱成像（NIR/Hyper）在分选（Sorting）任务上的准确率略低 (92.6%)，这可能与其较低的光谱分辨率有关，提示未来需针对该模态优化专用算法。

---

### Figure 3: 图像识别性能雨云图 (Raincloud Plot)

**Figure 3 | Distribution of recognition accuracy for microplastics across different imaging scales.** 
The raincloud plot combines a split-half violin plot (distribution density), a box plot (statistical summary), and a jittered scatter plot (raw data points) to visualize the performance of AI recognition models on data from Microscope, SEM (Scanning Electron Microscopy), and UAV (Unmanned Aerial Vehicle) sources. **(a)** **Microscope**: Represents baseline laboratory optical microscopy data. **(b)** **SEM**: Represents high-resolution electron microscopy data. **(c)** **UAV**: Represents field-scale aerial imaging data. The x-axis represents the recognition accuracy (%).

**解读 (Interpretation):**
该图展示了图像分辨率与识别准确率之间的正相关关系，同时也揭示了不同数据源的分布特征。
1.  **SEM 的优势**: 扫描电镜（SEM）组（中间橙色分布）展现了最高的平均准确率（中位数约为 92%）和最窄的分布范围，表明高分辨率纹理特征对于 AI 模型的稳定识别至关重要。
2.  **显微镜的基准表现**: 光学显微镜（Microscope）组（上方蓝色分布）表现出双峰分布特征，部分样本识别率极高，但也有部分样本表现不佳，这可能反映了光学显微镜在处理透明或微小颗粒时的局限性。
3.  **UAV 的挑战**: 无人机（UAV）组（下方绿色分布）的准确率整体偏低且分布离散度最大。这表明在复杂的野外环境背景下，受光照、分辨率和背景噪声的影响，微塑料的自动化识别仍面临巨大挑战，是未来算法优化的重点方向。

---

## 3. 建议 (Recommendations)

如果您希望将图表转换为展示 `chapter_S2.json` 中的真实数据，建议进行以下调整：

1.  **数据提取**: 编写 Python 脚本从 JSON 中提取统计信息。例如：
    *   统计不同年份（`publication_year`）的论文数量。
    *   统计不同“挑战类型”（`challenge_type`）出现的频率。
2.  **图表重构**:
    *   将 **Table 2** 改为“文献综述统计表”，列出每篇论文识别出的主要挑战。
    *   将 **Figure 3** 改为“挑战类型分布图”，展示“成本高”、“耗时长”、“缺乏标准”等问题在文献中出现的频率分布。
