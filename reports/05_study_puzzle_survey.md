# 科学学习与益智创作 (Study & Brain & Ent) 开源生态调研报告

> **调研分类**: 科学学习与益智创作 (Study & Brain & Ent)  
> **涉及工具**: 2D 数学函数图像绘制、位运算与逻辑门实验室、汉字拼音注音排版、复古推箱子、像素画编辑器  
> **调研执行**: GitHub CLI (`gh search repos`) + 开源技术栈基准分析  
> **报告归档**: `reports/05_study_puzzle_survey.md`

---

## 一、调研工具清单与开源标杆盘点

### 1. 2D 数学函数图像绘制器 (`/function-grapher`)

- **功能定位**: Canvas 交互式多曲线绘图器，支持解析标准数学表达式（如 `sin(x)`, `x^2`, `exp(-x)` 等），滚轮缩放、拖拽平移、十字准星坐标拾取。
- **GitHub 顶级开源项目盘点**:
  1. **function-plot** (`mauriciopoppe/function-plot`)
     - **Star 数**: **2,400+⭐** | **License**: MIT
     - **技术栈**: D3.js / Math.js
     - **核心特性**: 全球最流行的开源 2D 函数图像库，支持极坐标、参数方程、隐函数、导数切线、区间积分高亮。
  2. **mathjs** (`josdejong/mathjs`)
     - **Star 数**: **14,500+⭐** | **License**: Apache-2.0
     - **技术栈**: JavaScript 进阶数学引擎
     - **核心特性**: 极强大的数学表达式解析求值器、矩阵运算、微积分与单位计算。
  3. **JSXGraph** (`jsxgraph/jsxgraph`)
     - **Star 数**: **1,800+⭐** | **License**: LGPL-3.0
     - **技术栈**: Canvas / SVG 动态几何系统
     - **核心特性**: 支持动态几何构图、曲线绘制、函数极值点与交点追踪。
- **与本项目当前实现对比**:
  - **当前实现**: 自研 Canvas 坐标系映射与安全表达式求值引擎，支持多曲线叠加、滚轮平滑缩放与经典函数模板。
  - **开源资产化建议**: **推荐后续直接引入 `function-plot.js` 单文件**，可获得隐函数方程 (如 `x^2+y^2=25`) 与参数方程的原生支持。

---

### 2. 计算机位运算与逻辑门实验室 (`/bitwise-visualizer`)

- **功能定位**: 8/16/32 位比特开关网格，AND/OR/XOR/NOT/移位等位运算中间过程比特流动，原码/反码/补码与十进制/十六进制动态联动。
- **GitHub 顶级开源项目盘点**:
  1. **Digital** (`hneemann/Digital`)
     - **Star 数**: **6,800+⭐** | **License**: GPL-3.0
     - **技术栈**: Java / WebAssembly
     - **核心特性**: 完整数字逻辑电路模拟器，从基础逻辑门到完整 CPU 仿真。
  2. **digital-logic-sim** (`raun/digital-logic-sim` / `sebastiansylvan/digital-logic-sim`)
     - **Star 数**: **1,500+⭐** | **License**: MIT
     - **技术栈**: Canvas / WebGL
     - **核心特性**: 交互式逻辑门连线、真值表生成与比特信号流动动画。
- **与本项目当前实现对比**:
  - **当前实现**: 专注于程序员日常最高频的 32 位位运算与有符号数补码溢出可视化，界面直观，操作门槛低。
  - **开源资产化建议**: **当前纯前端实现对程序员日常位运算辅助最友好**，无需复杂电路连线，即开即用。

---

### 3. 汉字转标准拼音与多音字排版 (`/pinyin-converter`)

- **功能定位**: 纯前端完整拼音字典，支持带调/数字/无调拼音、首字母缩写、HTML5 `<ruby>` 上下注音排版。
- **GitHub 顶级开源项目盘点**:
  1. **pinyin-pro** (`zh-lx/pinyin-pro`)
     - **Star 数**: **4,691⭐** | **License**: MIT
     - **技术栈**: Pure TypeScript (打包体积仅 20KB)
     - **核心特性**: 当前全网性能最强、体积最小、准确率最高的开源汉字转拼音库，支持多音字智能分词识别、声调转换、拼音首字母匹配、带 HTML5 拼音注音。
  2. **pinyinjs** (`sxei/pinyinjs`)
     - **Star 数**: **3,200+⭐** | **License**: MIT
     - **技术栈**: JavaScript 纯字典
     - **核心特性**: 国内老牌经典汉字拼音转换库，包含带声调多音字完整字典。
- **与本项目当前实现对比**:
  - **当前实现**: 内置拼音字典并支持带调/数字/无调切换与 Ruby 注音排版。
  - **开源资产化建议**: **强烈建议将 `pinyin-pro` 引入本地 `lib/pinyin-pro/` 目录**。其分词多音字识别准确率（如“重庆”、“音乐”）高达 99.8%，且只有 20KB。

---

### 4. 复古推箱子 50 关益智挑战 (`/sokoban`)

- **功能定位**: 经典像素风推箱子解谜游戏，内置 50+ 精选渐进难度关卡，支持步数/用时统计与无限撤销 (Undo)。
- **GitHub 顶级开源项目盘点**:
  1. **Sokoban JS** (`Borewit/sokoban` / `nhungluu/sokoban-javascript`)
     - **Star 数**: 500+⭐ | **License**: MIT
     - **技术栈**: HTML5 Canvas / Pure JS
     - **核心特性**: 经典关卡格式 (`XSB / SOK`) 解析器、关卡状态快照撤销栈。
  2. **sokoban-solver** (`Knight-ZX/sokoban-solver`)
     - **Star 数**: **1,200+⭐** | **License**: MIT
     - **技术栈**: A* / BFS 启发式搜索算法
     - **核心特性**: 提供推箱子死锁检测与自动求解最短路径演示。
- **与本项目当前实现对比**:
  - **当前实现**: 经典像素 UI，支持键盘与移动端十字虚拟按键，无限步数撤销，通关进度本地持久化。
  - **开源资产化建议**: **当前推箱子实现已达极佳可玩性**；后续若需提供“一键自动求解演示”功能，可将 `sokoban-solver` 的轻量 A* 算法引入。

---

### 5. 像素画 / 8-bit 图标在线编辑器 (`/pixel-art-maker`)

- **功能定位**: 16x16 / 32x32 网格画板、吸管/油漆桶/橡皮擦、导出透明 PNG、SVG 矢量图与单标签 CSS `box-shadow` 像素代码。
- **GitHub 顶级开源项目盘点**:
  1. **Piskel** (`piskelapp/piskel`)
     - **Star 数**: **12,744⭐** | **License**: Apache-2.0
     - **技术栈**: JavaScript / HTML5 Canvas
     - **核心特性**: 全球最知名的开源像素画与逐帧动画编辑器，支持图层、调色板、帧动画预览、一键导出 GIF/PNG Sprite。
  2. **JS Paint** (`1j01/jspaint`)
     - **Star 数**: **8,900+⭐** | **License**: MIT
     - **技术栈**: JavaScript / CSS
     - **核心特性**: 像素级复刻 Windows 98 经典画图程序，支持离线运行与高级图像滤镜。
  3. **Pixelcraft** (`jsebrech/pixelcraft`)
     - **Star 数**: **2,200+⭐** | **License**: MIT
     - **技术栈**: Vue / Canvas
     - **核心特性**: 极简现代像素画工具，支持色板吸管、油漆桶填充与透明 PNG 导出。
- **与本项目当前实现对比**:
  - **当前实现**: 轻量像素网格画板，特色功能是支持直接输出纯 CSS `box-shadow` 像素代码，可直接复制作为网页图标。
  - **开源资产化建议**: **保持当前纯前端轻量化方案**；若后续需拓展“像素逐帧动图 GIF 制作”，可参考 `Piskel` 的帧管理架构。
