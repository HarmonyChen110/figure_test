import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np

# --- 1. 全局风格设置 (Nature Style) ---
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['font.sans-serif'] = ['Arial', 'DejaVu Sans']
plt.rcParams['font.size'] = 10
plt.rcParams['axes.linewidth'] = 1
plt.rcParams['lines.linewidth'] = 1.5

# 颜色定义 (更高级的配色)
COLOR_A = '#E63946' # 红色系 (Aging)
COLOR_B = '#457B9D' # 蓝色系 (Nano)
COLOR_C = '#2A9D8F' # 绿色系 (Mixture)
BG_COLOR = '#F1FAEE' # 极淡的背景色

def create_fake_spectrum(type='noisy'):
    x = np.linspace(0, 10, 100)
    if type == 'aged':
        # 模拟老化光谱：基线漂移 + 宽峰
        y = 0.5 * np.exp(-(x-3)**2/0.5) + 0.3 * np.exp(-(x-7)**2/1.0) + 0.1 * np.random.normal(0, 0.2, len(x))
    elif type == 'weak':
        # 微弱信号：几乎是噪声
        y = 0.05 * np.exp(-(x-5)**2/0.1) + 0.02 * np.random.normal(0, 0.5, len(x))
    elif type == 'amplified':
        # 增强信号：清晰锐利
        y = 0.9 * np.exp(-(x-5)**2/0.2)
    elif type == 'mixture':
        # 混合信号
        y = 0.6 * np.exp(-(x-4)**2/0.3) + 0.4 * np.exp(-(x-4.5)**2/0.4) + 0.1*np.sin(x*2)
    return x, y

def draw_panel_box(ax, title, color):
    # 绘制外框 (Panel 背景)
    rect = patches.FancyBboxPatch((0, 0), 1, 1, boxstyle="round,pad=0.05", 
                                  linewidth=1.5, edgecolor=color, facecolor='none',
                                  transform=ax.transAxes, zorder=0)
    ax.add_patch(rect)
    ax.text(0.05, 0.9, title, transform=ax.transAxes, 
            fontsize=12, fontweight='bold', color=color)
    ax.axis('off')

# --- 主绘图逻辑 ---
fig = plt.figure(figsize=(10, 8))
# 创建3行1列的网格
gs = fig.add_gridspec(3, 1, height_ratios=[1, 1, 1], hspace=0.3)

# =======================
# Panel A: The Aging Pipeline
# =======================
ax1 = fig.add_subplot(gs[0])
draw_panel_box(ax1, "Panel A: The Aging Pipeline", COLOR_A)

# 1. Input: Raw Spectrum (使用 inset_axes 嵌入子图)
ins1 = ax1.inset_axes([0.05, 0.25, 0.2, 0.4]) # [x, y, width, height]
x, y = create_fake_spectrum('aged')
ins1.plot(x, y, color=COLOR_A)
ins1.axis('off')
ax1.text(0.15, 0.15, "Raw Aged Spectrum", ha='center', transform=ax1.transAxes)

# 箭头
ax1.annotate('', xy=(0.35, 0.45), xytext=(0.25, 0.45),
             arrowprops=dict(facecolor='black', shrink=0.05, width=1))

# 2. Process: CNN Box (简单的矩形代替复杂立方体)
rect_cnn = patches.Rectangle((0.38, 0.3), 0.1, 0.3, linewidth=1, edgecolor='black', facecolor='#ddd')
ax1.add_patch(rect_cnn)
ax1.text(0.43, 0.45, "CNN\nModel", ha='center', va='center', fontsize=9)
ax1.text(0.43, 0.2, "Feature Extraction", ha='center', fontsize=8, style='italic')

# 箭头
ax1.annotate('', xy=(0.6, 0.45), xytext=(0.5, 0.45),
             arrowprops=dict(facecolor='black', shrink=0.05, width=1))

# 3. Output: Index
ax1.text(0.7, 0.45, "Carbonyl Index\n(C=O) ≈ 0.85", ha='center', va='center', 
         bbox=dict(boxstyle="circle,pad=0.5", fc="white", ec="black"))

# =======================
# Panel B: Nano-Enhancement
# =======================
ax2 = fig.add_subplot(gs[1])
draw_panel_box(ax2, "Panel B: Nano-Enhancement Pipeline", COLOR_B)

# 1. Input: Weak Signal
ins2 = ax2.inset_axes([0.05, 0.25, 0.2, 0.4])
x, y = create_fake_spectrum('weak')
ins2.plot(x, y, color='gray', alpha=0.7)
ins2.set_ylim(0, 1) # 固定比例
ins2.axis('off')
ax2.text(0.15, 0.15, "Weak Signal (<SNR 2)", ha='center', transform=ax2.transAxes)

# 箭头
ax2.annotate('', xy=(0.35, 0.45), xytext=(0.25, 0.45), arrowprops=dict(facecolor='black', width=1))

# 2. Process: AI Filter (梯形)
polygon = patches.Polygon([[0.4, 0.6], [0.48, 0.6], [0.46, 0.3], [0.42, 0.3]], 
                          closed=True, edgecolor='black', facecolor='#ddd')
ax2.add_patch(polygon)
ax2.text(0.44, 0.2, "Denoising\nAutoencoder", ha='center', fontsize=8, style='italic')

# 箭头
ax2.annotate('', xy=(0.6, 0.45), xytext=(0.5, 0.45), arrowprops=dict(facecolor='black', width=1))

# 3. Output: Amplified
ins3 = ax2.inset_axes([0.65, 0.25, 0.2, 0.4])
x, y = create_fake_spectrum('amplified')
ins3.plot(x, y, color=COLOR_B)
ins3.set_ylim(0, 1)
ins3.axis('off')
ax2.text(0.75, 0.15, "Recovered Signature", ha='center', transform=ax2.transAxes)

# =======================
# Panel C: Mixture Unmixing
# =======================
ax3 = fig.add_subplot(gs[2])
draw_panel_box(ax3, "Panel C: Mixture Unmixing Pipeline", COLOR_C)

# 1. Input: Mixture
ins4 = ax3.inset_axes([0.05, 0.25, 0.2, 0.4])
x, y = create_fake_spectrum('mixture')
ins4.plot(x, y, color='purple')
ins4.axis('off')
ax3.text(0.15, 0.15, "Mixed Contaminants", ha='center', transform=ax3.transAxes)

# 箭头
ax3.annotate('', xy=(0.35, 0.45), xytext=(0.25, 0.45), arrowprops=dict(facecolor='black', width=1))

# 2. Process: Separation Triangle
triangle = patches.RegularPolygon((0.44, 0.45), numVertices=3, radius=0.1, orientation=0,
                                  edgecolor='black', facecolor='#ddd')
ax3.add_patch(triangle)
ax3.text(0.44, 0.25, "Blind Source\nSeparation", ha='center', fontsize=8, style='italic')

# 分叉箭头
ax3.annotate('', xy=(0.6, 0.55), xytext=(0.5, 0.45), arrowprops=dict(facecolor='black', width=0.5, headwidth=5))
ax3.annotate('', xy=(0.6, 0.35), xytext=(0.5, 0.45), arrowprops=dict(facecolor='black', width=0.5, headwidth=5))

# 3. Output: Separated Signals
ins5 = ax3.inset_axes([0.65, 0.5, 0.15, 0.3]) # Top signal
ins5.plot(x, np.exp(-(x-4)**2/0.3), color=COLOR_C) # Component 1
ins5.axis('off')
ax3.text(0.85, 0.65, "Component 1\n(Microplastic)", va='center', fontsize=8, transform=ax3.transAxes)

ins6 = ax3.inset_axes([0.65, 0.1, 0.15, 0.3]) # Bottom signal
ins6.plot(x, np.exp(-(x-4.5)**2/0.4), color='brown') # Component 2
ins6.axis('off')
ax3.text(0.85, 0.25, "Component 2\n(Bio-matter)", va='center', fontsize=8, transform=ax3.transAxes)

plt.tight_layout()
plt.savefig('figure4_nature.svg', format='svg')
print("Figure 4 generated as figure4_nature.svg")
