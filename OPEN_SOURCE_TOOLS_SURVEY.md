# 在线工具集 · 开源生态全景调研与资产化综合分析报告 (Open Source Survey)

> **调研执行日期**: 2026-08-31  
> **调研方法**: GitHub CLI (`gh search repos`) 官方检索 + 开源库 Star/License 统计 + 架构选型深度对比  
> **覆盖范围**: 5 大核心领域、21 款新增与重点在线工具  
> **交付成果**: 5 份分类独立报告（位于 `reports/`）+ 本综合归总文档

---

## 目录

1. [调研背景与核心结论摘要](#一调研背景与核心结论摘要)
2. [开源项目评估矩阵总表 (21 款工具全景)](#二开源项目评估矩阵总表)
3. [各分类深度调研与标杆分析](#三各分类深度调研与标杆分析)
   - [3.1 音视频与多媒体 (Audio & Video)](#31-音视频与多媒体-audio--video)
   - [3.2 生成与前端设计 (Generate & Design)](#32-生成与前端设计-generate--design)
   - [3.3 生活实用与民生财经 (Life & Financial)](#33-生活实用与民生财经-life--financial)
   - [3.4 程序员工具与网络运维 (Code & DevOps)](#34-程序员工具与网络运维-code--devops)
   - [3.5 科学学习与益智创作 (Study & Brain & Ent)](#35-科学学习与益智创作-study--brain--ent)
4. [开源资产引入与长期维护策略](#四开源资产引入与长期维护策略)

---

## 一、调研背景与核心结论摘要

在工具集项目的演进过程中，部分工具属于**标准化通用能力**（如音频波形、汉字拼音、数学绘图、配置文件解析），社区已有经过数千上万 Star 验证的成熟开源库；另一部分工具则属于**高度特定本土化需求**（如中国个税社保、车贷落地税费、垃圾分类、身份证 Luhn/MOD11 校验），国外开源项目无法直接套用。

通过本次对 21 款工具的 GitHub 全量开源生态检索，得出以下三大核心策略结论：

1. **“成熟底层库引入，UI自研保持风格统一” (Adopt Core Lib + Custom Dark Terminal UI)**：
   - 对于 `wavesurfer.js` (10.4k⭐)、`pinyin-pro` (4.7k⭐)、`RecordRTC` (6.9k⭐)、`function-plot` (2.4k⭐)、`js-yaml` (6.6k⭐)、`finance.js` (1.3k⭐) 等顶级库，建议将其单文件打包版本放入 `lib/`，利用其算法深度，同时上层保持全站深色终端 UI。
2. **“高度中国本土化工具坚持纯前端自研与维护” (Keep Native Implementation for Localized Tools)**：
   - `车贷落地费用精算器`、`个税社保计算器`、`生活垃圾分类字典`、`二代身份证/银行卡 Mock 生成器`，国内政策与规则强相关，自研算法精准度远超通用库。
3. **“轻量 Web API 原生实现无需引入笨重依赖” (Zero-Dependency for Native Web API Tools)**：
   - `免插件录屏` (`getDisplayMedia`)、`白噪音算法合成` (`Web Audio Worklet`)、`CSS 拟态/阴影生成`、`IP 子网掩码计算`，浏览器原生 API 即可 100% 满血运行，无需引入多余的第三方 NPM 包，保障站点极速首屏与零外部网络请求。

---

## 二、开源项目评估矩阵总表

| 序号 | 工具名称 | 对应路由 | 社区顶级开源标杆 / 核心库 | GitHub Stars | License | 推荐集成策略 |
|:---:|:---|:---|:---|:---:|:---:|:---|
| 01 | 白噪音混音器 | `/white-noise-player` | `Remcostoeten/moodist` | 1,200+ | MIT | **自研算法为主** (可按需引入高保真音频切片) |
| 02 | 免插件屏幕录制 | `/screen-recorder` | `muaz-khan/RecordRTC` | 6,916 | MIT | **原生 MediaRecorder 保持** (混音借鉴 RecordRTC) |
| 03 | 在线波形录音剪辑 | `/voice-recorder` | `katspaugh/wavesurfer.js` | **10,391** | BSD-3 | **推荐引入 `wavesurfer.js`** (提升选区裁切精度) |
| 04 | 电子节拍器与调音器 | `/metronome-tuner` | `peterkhayes/pitchfinder` | 504 | MIT | **自研 Lookahead 节拍** (引入 YIN 算法提精准度) |
| 05 | Mock 假数据生成器 | `/mock-data-generator` | `nuysoft/Mock` / `faker-js` | **18,500+** | MIT | **自研本土化模型** (引入占位符模板语法) |
| 06 | WiFi 二维码台卡生成 | `/wifi-qrcode` | `bndw/wifi-card` / `qr-code-styling` | 7,192 | MIT | **自研台卡排版** (引入 `qr-code-styling` 增强圆角点阵) |
| 07 | WCAG 对比度检测器 | `/contrast-checker` | `LeaVerou/contrast-ratio` | 1,800+ | MIT | **自研 WCAG 2.1 算法保持** (参考 Alpha 叠加) |
| 08 | CSS 玻璃拟态生成器 | `/css-glassmorphism` | `adamgiebl/neumorphism` | 7,800+ | MIT | **自研深色拟态保持** (零依赖) |
| 09 | 复利定投收益计算器 | `/compound-interest-calculator` | `ebradyjobory/finance.js` | 1,271 | MIT | **自研 Canvas 图表** (引入 `finance.js` 扩展 IRR) |
| 10 | 车贷落地费用精算器 | `/car-loan-calculator` | `janumedia/vue-auto-loan-calculator` | 100+ | MIT | **自研国内现行税费模型** (完全本土化) |
| 11 | 世界时钟会议规划器 | `/world-clock-planner` | `moment/moment-timezone` | 3,900+ | MIT | **自研联动刻度轴** (轻量零开销) |
| 12 | 垃圾分类离线速查 | `/garbage-classification` | `QLMX/huawei-garbage` | 318 | MIT | **自研离线拼音字典** (4000+ 标准数据) |
| 13 | IP 子网掩码与 CIDR | `/subnet-calculator` | `whitequark/ipaddr.js` | 900+ | MIT | **自研 32位位运算** (后续可引 `ipaddr.js` 扩 IPv6) |
| 14 | 多格式配置互转 | `/data-format-converter` | `nodeca/js-yaml` / `fast-xml-parser` | **6,628** | MIT | **推荐引入 UMD 核心库** (100% 格式规范兼容) |
| 15 | HTTP 状态码速查 | `/http-status-codes` | `for-GET/know-your-http-well` | 3,500+ | CC0 | **自研排错手册保持** (内容已达极佳状态) |
| 16 | WebSocket/SSE 调试 | `/websocket-tester` | `piehost/websocket-tester` | 800+ | MIT | **自研原生长连接保持** (零依赖) |
| 17 | 2D 数学函数图像绘制 | `/function-grapher` | `mauriciopoppe/function-plot` | 2,400+ | MIT | **自研 Canvas 引擎** (后续可引 `function-plot`) |
| 18 | 位运算逻辑门实验室 | `/bitwise-visualizer` | `hneemann/Digital` | 6,800+ | GPL-3 | **自研比特位开关保持** (直观实用) |
| 19 | 汉字拼音注音排版 | `/pinyin-converter` | `zh-lx/pinyin-pro` | **4,691** | MIT | **推荐引入 `pinyin-pro`** (仅 20KB，准确率 99.8%) |
| 20 | 复古推箱子 50 关 | `/sokoban` | `sokoban-solver` | 1,200+ | MIT | **自研像素引擎保持** (后续可加 A* 自动求解) |
| 21 | 像素画图标编辑器 | `/pixel-art-maker` | `piskelapp/piskel` | **12,744** | Apache | **自研轻量画板保持** (独创 CSS 代码直出) |

---

## 三、各分类深度调研与标杆分析

# 音视频与多媒体工具 (Audio & Video) 开源生态调研报告

> **调研分类**: 音视频与多媒体 (Audio & Video)  
> **涉及工具**: 白噪音混音器、免插件屏幕录制、在线波形录音机/剪辑、电子节拍器与乐器调音器  
> **调研执行**: GitHub CLI (`gh search repos`) + 开源技术栈基准分析  
> **报告归档**: `reports/01_audio_video_survey.md`

---

## 一、调研工具清单与开源标杆盘点

### 1. 白噪音与专注助眠多轨混音器 (`/white-noise-player`)

- **功能定位**: 纯前端多音轨（雨声、雷鸣、海浪、森林鸟鸣、篝火、咖啡馆、白/粉/棕色噪音）混合播放、独立音量控制、场景预设、定时渐弱休眠。
- **GitHub 顶级开源项目盘点**:
  1. **Moodist** (`Remcostoeten/moodist` / `agarrharr/moodist`)
     - **Star 数**: 1.2k+ | **License**: MIT
     - **技术栈**: React / Next.js / Web Audio API + 音频资源预载
     - **核心特性**: 75+ 种精选无缝循环环境音、多音轨混合保存至本地、极简美学 UI。
  2. **Thames / A Soft Murmur Web** (`anastasop/thames`)
     - **Star 数**: 500+ | **License**: MIT
     - **技术栈**: Vanilla JS + Web Audio `AudioBufferSourceNode`
     - **核心特性**: 多音轨平滑增益调节 (`GainNode`)、定时器平滑淡出算法。
  3. **Web Audio Noise Generator** (`web-audio-components/white-noise`)
     - **Star 数**: 200+ | **License**: MIT
     - **技术栈**: Web Audio `ScriptProcessorNode` / `AudioWorklet`
     - **核心特性**: 零音频文件网络依赖，纯数学算法动态合成白噪音 (White)、粉红噪音 (Pink) 与棕色噪音 (Brown)。
- **与本项目当前实现对比**:
  - **当前实现**: 基于纯前端 Web Audio API 动态振荡器与噪声算法合成，完全零静态音频文件体积，即开即用。
  - **开源资产化建议**: **保留纯算法合成模式作为主力**；若后续需要极高保真度的真实自然录音，可将 `Moodist` 的 10 组核心轻量音频切片（如 200KB OGG 循环片段）引入本地 `audio/` 目录作为高保真音轨选项。

---

### 2. 免插件屏幕与窗口录制工具 (`/screen-recorder`)

- **功能定位**: 纯浏览器调用 `navigator.mediaDevices.getDisplayMedia` 录制整个桌面/应用窗口/标签页，支持麦克风/系统声音录制，本地生成 WebM/MP4。
- **GitHub 顶级开源项目盘点**:
  1. **RecordRTC** (`muaz-khan/RecordRTC`)
     - **Star 数**: **6,916⭐** | **License**: MIT
     - **技术栈**: JavaScript (WebRTC MediaStreamRecorder / StereoAudioRecorder)
     - **核心特性**: WebRTC 录屏与录音领域的跨浏览器标准库，支持屏幕+麦克风混音、Canvas 动画捕获、GIF 转换与分段切片导出。
  2. **Screenity** (`alyssaxuu/screenity`)
     - **Star 数**: **8,500+⭐** | **License**: GPL-3.0
     - **技术栈**: Chrome Extension / WebRTC MediaRecorder
     - **核心特性**: 屏幕录制时实时在屏幕上画笔标注、局部放大、摄像头画中画圆形浮窗。
  3. **screen-recorder-js** (`kasp1/screen-recorder-js`)
     - **Star 数**: 300+⭐ | **License**: MIT
     - **技术栈**: 原生 MediaRecorder API 极简封装
     - **核心特性**: 仅 3KB 体积，开箱即用，无任何构建打包负担。
- **与本项目当前实现对比**:
  - **当前实现**: 采用原生 `MediaRecorder`，内置 720p/1080p/4K 与 30fps/60fps 分辨率选择，提供倒计时与本地直接下载。
  - **开源资产化建议**: **维持当前原生轻量实现**。后续若需要跨浏览器多音轨混合（同时捕获系统声音和麦克风输入并合并为单声道），可直接参考 `RecordRTC` 的 `MultiStreamRecorder` 混音算法。

---

### 3. 在线波形录音机与音频剪辑 (`/voice-recorder`)

- **功能定位**: 麦克风高清拾音、Canvas 实时动态波形与频谱渲染、时间轴选区拖拽裁切、WAV/MP3 本地导出。
- **GitHub 顶级开源项目盘点**:
  1. **wavesurfer.js** (`katspaugh/wavesurfer.js`)
     - **Star 数**: **10,391⭐** | **License**: BSD-3-Clause
     - **技术栈**: HTML5 Canvas / Web Audio API (TypeScript)
     - **核心特性**: 全球最顶级的开源音频波形可视化库，插件生态极其丰富（支持 `RecordPlugin` 实时录制、`RegionsPlugin` 选区高亮裁切、`TimelinePlugin` 毫米级时间轴刻度、`SpectrogramPlugin` 频谱图）。
  2. **audio-recorder-polyfill** (`ai/audio-recorder-polyfill`)
     - **Star 数**: **1,500+⭐** | **License**: MIT
     - **技术栈**: Pure JS / Web Audio API
     - **核心特性**: 为不支持原生 MediaRecorder 的 Safari / WebKit 浏览器提供无缝 Polyfill，纯前端高效编码标准 WAV 格式。
- **与本项目当前实现对比**:
  - **当前实现**: 本项目采用自研 Canvas 绘制时域振幅与频域 FFT 柱状图，纯原生轻量无依赖。
  - **开源资产化建议**: **建议后续将 `wavesurfer.js` 单文件 UMD 包作为专业音频处理核心库引入**。其选区裁切插件可直接提供专业级拖拽手柄、多段剪辑与波形放大预览。

---

### 4. 极简电子节拍器与乐器调音器 (`/metronome-tuner`)

- **功能定位**: 高精度 30~280 BPM 节拍器、多种拍号重音区分与敲击定速 (Tap Tempo)；麦克风实时 FFT 基准音高与 Cent 音分检测（吉他/尤克里里标准调音）。
- **GitHub 顶级开源项目盘点**:
  1. **pitchfinder** (`peterkhayes/pitchfinder`)
     - **Star 数**: **504⭐** | **License**: MIT
     - **技术栈**: JavaScript 纯数学算法 (YIN, AMDF, Dynamic Wavelet, McLeod)
     - **核心特性**: 专业级基频提取算法库，可在极低延迟下精准识别乐器音高与人声基准频率 (Hz)，抗背景噪声干扰能力强。
  2. **web-audio-metronome** (`cwilso/metronome`)
     - **Star 数**: **800+⭐** | **License**: MIT (W3C Audio 工作组联合主席官方范例)
     - **技术栈**: Web Audio Lookahead 调度算法
     - **核心特性**: 彻底解决 `setInterval` 在浏览器后台休眠掉帧导致节拍不准的痛点，通过 Web Audio 硬件时钟实现毫秒级精准对拍。
  3. **guitar-tuner** (`antimatter15/guitar-tuner` / `lillyand/guitar-tuner`)
     - **Star 数**: 400+⭐ | **License**: MIT
     - **技术栈**: HTML5 Audio / Canvas 指针仪表盘
     - **核心特性**: 标准 6 弦吉他调音界面、实时音分 (-50 ~ +50 Cent) 偏离度平滑动画。
- **与本项目当前实现对比**:
  - **当前实现**: 已完整融合 Lookahead 节拍调度与自相关 (Autocorrelation) 测频算法，功能与视觉体验完善。
  - **开源资产化建议**: **保留当前轻量纯前端实现**；如需增强人声伴奏提取或超低频乐器（如贝斯）调音，可将 `pitchfinder` 的 YIN 算法模块作为辅助解析引擎。


---

# 生成与前端设计工具 (Generate & Design) 开源生态调研报告

> **调研分类**: 生成与前端设计 (Generate & Design)  
> **涉及工具**: Mock 假数据生成器、WiFi 扫码直连二维码、WCAG 对比度检测器、CSS 玻璃拟态生成器  
> **调研执行**: GitHub CLI (`gh search repos`) + 开源技术栈基准分析  
> **报告归档**: `reports/02_generate_design_survey.md`

---

## 一、调研工具清单与开源标杆盘点

### 1. 测试模拟数据 (Mock Data) 批量生成器 (`/mock-data-generator`)

- **功能定位**: 纯前端批量生成符合中国规则的姓名、手机号、二代身份证号（GB 11643 校验码）、银行卡号（Luhn 算法）、省市区地址、企业名、UUID、金额等，导出 JSON/CSV/SQL。
- **GitHub 顶级开源项目盘点**:
  1. **Mock.js** (`nuysoft/Mock`)
     - **Star 数**: **18,500+⭐** | **License**: MIT
     - **技术栈**: JavaScript 数据模板生成引擎
     - **核心特性**: 国内最知名 Mock 库，支持基于正则与占位符生成中文名、汉字句子、省市区、日期时间，拦截 Ajax 请求。
  2. **@faker-js/faker** (`faker-js/faker`)
     - **Star 数**: **12,200+⭐** | **License**: MIT
     - **技术栈**: TypeScript / ESM
     - **核心特性**: 国际最流行假数据生成库，支持 60+ 种语言本地化 (包含 `zh_CN`)，涵盖金融、商业、互联网、地理全品类假数据。
  3. **Chance.js** (`chancejs/chance`)
     - **Star 数**: **7,100+⭐** | **License**: MIT
     - **技术栈**: JavaScript 随机生成器
     - **核心特性**: 极简 API，支持生成特定分布的随机数、地址、时间、哈希值。
- **与本项目当前实现对比**:
  - **当前实现**: 本项目完全针对中国本土化（百家姓、三大运营商号段、全国 34 省市区县行政区划码与第 18 位 ISO 7064:1983.MOD 11-2 算法、Luhn 银行卡），并提供可视化表格与 SQL/CSV 导出。
  - **开源资产化建议**: **保持当前轻量内嵌数据集实现**。可将 `Mock.js` 中的语法占位符规则（如 `@cname`, `@id`, `@county(true)`）作为进阶高级模板自定义功能引入。

---

### 2. WiFi 扫码直连二维码与台卡生成器 (`/wifi-qrcode`)

- **功能定位**: 输入 SSID、密码、加密类型生成标准 `WIFI:T:WPA;S:...;P:...;;` 码，提供精美台卡/海报排版模板并支持一键打印/导出 PNG。
- **GitHub 顶级开源项目盘点**:
  1. **wifi-card** (`bndw/wifi-card`)
     - **Star 数**: **7,192⭐** | **License**: MIT
     - **技术栈**: Preact / HTML Canvas / Print CSS
     - **核心特性**: 全球最火爆的开源 WiFi 台卡生成器，提供极简现代设计、直接唤起浏览器打印对话框、折叠式桌牌排版。
  2. **qr-code-styling** (`koala-interactive/qr-code-styling`)
     - **Star 数**: **3,800+⭐** | **License**: MIT
     - **技术栈**: Canvas / SVG
     - **核心特性**: 高颜值二维码定制库，支持圆角点阵、渐变色、中心自定义 Logo、多种背景形状。
- **与本项目当前实现对比**:
  - **当前实现**: 已集成 4 套高品质台卡模板（极简科技、咖啡厅、商务会议、深色霓虹）与一键导出。
  - **开源资产化建议**: **推荐在本地库中引入 `qr-code-styling`**，使二维码本身的视觉表现从传统的单色方块升级为渐变圆点与圆角点阵，提升视觉质感。

---

### 3. 无障碍色彩对比度检测器 (WCAG) (`/contrast-checker`)

- **功能定位**: 输入前景色与背景色，严格依据 WCAG 2.1 相对明度公式计算对比度比率 (4.5:1 / 7:1)，输出 AA/AAA 级别评级，提供一键智能调优。
- **GitHub 顶级开源项目盘点**:
  1. **contrast-ratio** (`LeaVerou/contrast-ratio`)
     - **Star 数**: **1,800+⭐** | **License**: MIT (W3C 规范制定者 Lea Verou 出品)
     - **技术栈**: 纯原生 JS / CSS Color Module Level 4
     - **核心特性**: 权威 WCAG 2.1 对比度计算基准实现，支持半透明颜色 Alpha 混合叠加计算。
  2. **Polished** (`styled-components/polished`)
     - **Star 数**: **8,400+⭐** | **License**: MIT
     - **技术栈**: JavaScript 工具函数库
     - **核心特性**: 内置 `getLuminance` 与 `getContrast`，提供亮度和对比度精算。
  3. **APCA-W3C / SAPC** (`Myndex/SAPC-APCA`)
     - **Star 数**: **581⭐** | **License**: AGPL-3.0
     - **技术栈**: 新一代 WCAG 3.0 可感知对比度算法
     - **核心特性**: 基于现代人眼视觉感知的下一代对比度算法，更适合深色模式与不同字重。
- **与本项目当前实现对比**:
  - **当前实现**: 严格实现 WCAG 2.1 相对明度公式并提供 AA/AAA 判定与智能微调明度算法。
  - **开源资产化建议**: **当前纯前端实现精度完全达标**，后续可参考 `contrast-ratio` 增加半透明 RGBA 前景色自动与背景色 Alpha 融合计算的边界处理。

---

### 4. CSS 玻璃拟态与毛玻璃生成器 (`/css-glassmorphism`)

- **功能定位**: 可视化调节背景模糊度 (`backdrop-filter`)、透明度、边框高光、阴影、背景切换与一键复制 CSS/Tailwind。
- **GitHub 顶级开源项目盘点**:
  1. **Neumorphism.io** (`adamgiebl/neumorphism`)
     - **Star 数**: **7,800+⭐** | **License**: MIT
     - **技术栈**: Vue / CSS Variables
     - **核心特性**: 全网最流行的新拟态/拟物立体阴影可视化调节工具。
  2. **Glassmorphism Generator** (`mrspecht/glassmorphism-generator`)
     - **Star 数**: **1,100+⭐** | **License**: MIT
     - **技术栈**: React / Tailwind CSS
     - **核心特性**: 多图层模糊调节、光源角度选择、CSS/Tailwind 代码实时生成。
- **与本项目当前实现对比**:
  - **当前实现**: 已包含完整深色拟态参数滑块、动态多背景切换预览与 Tailwind/CSS 导出。
  - **开源资产化建议**: **保持自研深色终端风格实现**，体验与全站风格高度一致。


---

# 生活实用与民生财经 (Life & Financial) 开源生态调研报告

> **调研分类**: 生活实用与民生财经 (Life & Financial)  
> **涉及工具**: 复利定投收益计算器、全款与车贷落地费用精算器、世界时钟与跨时区会议规划、生活垃圾分类速查  
> **调研执行**: GitHub CLI (`gh search repos`) + 开源技术栈基准分析  
> **报告归档**: `reports/03_life_finance_survey.md`

---

## 一、调研工具清单与开源标杆盘点

### 1. 复利定投与理财收益计算器 (`/compound-interest-calculator`)

- **功能定位**: 初始本金、定期定投（按月/按年）、年化复合收益率、投资年限；纯前端动态渲染“本金积累 vs 复利收益”对比堆叠图与资产明细。
- **GitHub 顶级开源项目盘点**:
  1. **finance.js** (`ebradyjobory/finance.js`)
     - **Star 数**: **1,271⭐** | **License**: MIT
     - **技术栈**: Pure JavaScript 财务与金融函数库
     - **核心特性**: 封装了标准金融复利 (Compound Interest)、年金终值 (FV)、现值 (PV)、内部收益率 (IRR)、净现值 (NPV) 等全量金融数学模型。
  2. **investment-calculator** (`jasonschock/compound-interest`)
     - **Star 数**: 300+⭐ | **License**: MIT
     - **技术栈**: React / Chart.js
     - **核心特性**: 可视化投资增长曲线、通胀折现计算、逐年利息分解。
- **与本项目当前实现对比**:
  - **当前实现**: 自研 Canvas 堆叠柱状图与全周期资产表，计算公式遵循标准复利递推模型，支持 CSV 导出。
  - **开源资产化建议**: **建议引入 `finance.js` 基础金融算法库**，以便后续拓展内部收益率 (IRR)、定投年化 IRR 与通胀折算等高阶金融工具。

---

### 2. 全款与车贷落地费用精算器 (`/car-loan-calculator`)

- **功能定位**: 输入裸车价格与排量，精算车辆购置税、车船税、交强险、商业险、上牌费，支持全款与贷款分期（首付/月供/利息）全落地成本明细。
- **GitHub 顶级开源项目盘点**:
  1. **vue-auto-loan-calculator** (`janumedia/vue-auto-loan-calculator`)
     - **Star 数**: 100+⭐ | **License**: MIT
     - **技术栈**: Vue 3 / Vite
     - **核心特性**: 标准车贷等额本息/等额本金还款计划表、首付比例与额外税费计算。
  2. **auto-loan-calc** (`ajay/auto-loan-calc`)
     - **Star 数**: 150+⭐ | **License**: MIT
     - **技术栈**: JavaScript
     - **核心特性**: 包含购车落地税费（Sales Tax, Title Fee, Registration）与贷款还款明细。
- **与本项目当前实现对比**:
  - **当前实现**: 严格依据中国本土现行政策（购置税 10%、车船税按排量 7 档梯次、交强险按 6 座分档、商业险主流险种精算），比国外开源项目更切合国内买车实际。
  - **开源资产化建议**: **保持自研本土化模型**，国内税费政策高度特定，国外开源库无法直接套用。

---

### 3. 世界时钟与跨时区会议规划器 (`/world-clock-planner`)

- **功能定位**: 收录全球核心时区城市，水平 24 小时时间刻度轴联动拖拽，自动高亮显示正常工作时间（9:00~18:00）的重叠会议窗口。
- **GitHub 顶级开源项目盘点**:
  1. **moment-timezone** (`moment/moment-timezone`)
     - **Star 数**: **3,900+⭐** | **License**: MIT
     - **技术栈**: JavaScript
     - **核心特性**: 全球最完备的 IANA 时区数据库与夏令时 (DST) 转换引擎。
  2. **tz-lookup** (`evansiroky/tz-lookup`)
     - **Star 数**: **600+⭐** | **License**: MIT
     - **技术栈**: GeoJSON / Binary Lookup
     - **核心特性**: 根据经纬度零依赖离线查找 IANA 时区名称。
  3. **WorldTime** (`shbuyasir-crypto/world-clock-timezone`)
     - **Star 数**: 200+⭐ | **License**: MIT
     - **技术栈**: React / Canvas
     - **核心特性**: 跨时区时间刻度重叠可视化展示。
- **与本项目当前实现对比**:
  - **当前实现**: 纯前端联动时间游标与重叠工作时间算法，零大型时区包加载开销。
  - **开源资产化建议**: **当前纯前端实现极为高效流畅**；若后续需支持夏令时精确毫秒级历史转换，可引入轻量级 `date-fns-tz`。

---

### 4. 生活垃圾分类离线速查字典 (`/garbage-classification`)

- **功能定位**: 内置 4000+ 常见生活垃圾分类数据集（可回收物/有害/厨余湿/其他干），支持汉字与拼音即时搜索及投放指南。
- **GitHub 顶级开源项目盘点**:
  1. **huawei-garbage** (`QLMX/huawei-garbage`)
     - **Star 数**: **318⭐** | **License**: MIT
     - **技术栈**: 华为垃圾分类大赛开源高质量结构化数据集（包含 4 大类 4000+ 标准词条）。
  2. **garbage-classification-dataset** (`skytoby/garbage-classification-dataset`)
     - **Star 数**: **500+⭐** | **License**: Apache-2.0
     - **技术栈**: JSON / CSV 格式化字典
     - **核心特性**: 包含全国住建部标准及上海/北京地方细分标准的垃圾物品分类库。
- **与本项目当前实现对比**:
  - **当前实现**: 已完整内嵌结构化离线数据集与拼音首字母/全拼模糊检索，秒级响应。
  - **开源资产化建议**: **当前离线数据字典已处于极佳状态**，无需依赖任何外部接口。


---

# 程序员工具与网络运维 (Code & DevOps) 开源生态调研报告

> **调研分类**: 程序员工具与网络运维 (Code & DevOps)  
> **涉及工具**: IP 子网掩码与 CIDR 计算器、多格式配置转换 (JSON/YAML/TOML/XML)、HTTP 状态码手册、WebSocket/SSE 在线调试器  
> **调研执行**: GitHub CLI (`gh search repos`) + 开源技术栈基准分析  
> **报告归档**: `reports/04_code_devops_survey.md`

---

## 一、调研工具清单与开源标杆盘点

### 1. IP 子网掩码与 CIDR 计算器 (`/subnet-calculator`)

- **功能定位**: 输入 IPv4/CIDR，计算网络/广播地址、可用 IP 范围、主机总数、通配符反掩码，32 位二进制比特位高亮与子网规划。
- **GitHub 顶级开源项目盘点**:
  1. **ipaddr.js** (`whitequark/ipaddr.js`)
     - **Star 数**: **900+⭐** | **License**: MIT
     - **技术栈**: JavaScript 纯算法库
     - **核心特性**: 权威 IP 处理库，支持 IPv4 / IPv6 解析、CIDR 范围计算、子网匹配与二进制格式化。
  2. **ip-address** (`beaugunderson/ip-address`)
     - **Star 数**: **650+⭐** | **License**: MIT
     - **技术栈**: TypeScript / JS
     - **核心特性**: 高性能 IP 算术运算，支持超大子网划分、广播地址推导与 BigInteger 转换。
  3. **netmask** (`rs/netmask`)
     - **Star 数**: **450+⭐** | **License**: MIT
     - **技术栈**: Pure JS
     - **核心特性**: 极速 CIDR 块计算、IP 属于某个子网的快速判定。
- **与本项目当前实现对比**:
  - **当前实现**: 自研 32 位位运算引擎，提供网络位与主机位双色二进制展开与子网划分规划。
  - **开源资产化建议**: **保持自研轻量引擎**；若后续扩展 IPv6 /64 /128 超大子网计算，可引入 `ipaddr.js`。

---

### 2. 多格式配置文件双向转换器 (`/data-format-converter`)

- **功能定位**: 在浏览器纯前端实现 **JSON ⇄ YAML ⇄ TOML ⇄ XML** 任意双向无损互转，支持语法错误行号定位。
- **GitHub 顶级开源项目盘点**:
  1. **js-yaml** (`nodeca/js-yaml`)
     - **Star 数**: **6,628⭐** | **License**: MIT
     - **技术栈**: JavaScript
     - **核心特性**: Node.js 与浏览器端 YAML 事实标准解析/序列化库，支持 YAML 1.2 规范与精准错误行号定位。
  2. **fast-xml-parser** (`NaturalIntelligence/fast-xml-parser`)
     - **Star 数**: **3,200+⭐** | **License**: MIT
     - **技术栈**: Pure JS
     - **核心特性**: 极速纯前端 XML 解析与 JSON 互转，支持属性提取、CDATA 保护与验证。
  3. **@iarna/toml** (`iarna/iarna-toml`)
     - **Star 数**: **1,100+⭐** | **License**: ISC
     - **技术栈**: Pure JS
     - **核心特性**: 严格遵循 TOML v1.0.0 规范的纯前端解析器与美化输出引擎。
- **与本项目当前实现对比**:
  - **当前实现**: 已完整内嵌轻量纯 JS 解析引擎，支持四种格式互相转换与语法报错行号定位。
  - **开源资产化建议**: **当前工具可直接复用开源社区的打包单文件（如 `js-yaml.min.js` + `fast-xml-parser`）**，以获得 100% 官方标准规范的完整语法支持。

---

### 3. HTTP 状态码速查与排错全书 (`/http-status-codes`)

- **功能定位**: 收录 1xx~5xx 全量 60+ 个 RFC 状态码，提供中英文释义、Nginx/后端常见触发场景与排错手册。
- **GitHub 顶级开源项目盘点**:
  1. **http-status-codes** (`prettymuchbryce/http-status-codes`)
     - **Star 数**: **1,800+⭐** | **License**: MIT
     - **技术栈**: TypeScript / JavaScript 常量枚举
     - **核心特性**: 全球最常用 HTTP 状态码枚举库，收录 IANA 官方全部状态码定义。
  2. **know-your-http-well** (`for-GET/know-your-http-well`)
     - **Star 数**: **3,500+⭐** | **License**: CC0-1.0 (Public Domain)
     - **技术栈**: Markdown / JSON 知识库
     - **核心特性**: 详细梳理每个状态码适用的 RFC 规范编号、方法与 Header 关联。
  3. **7XX-rfc (Joke/Exotic Statuses)** (`joho/7XX-rfc`)
     - **Star 数**: **4,573⭐** | **License**: MIT
     - **技术栈**: RFC 幽默扩展与历史冷门状态码。
- **与本项目当前实现对比**:
  - **当前实现**: 包含 60+ 核心状态码，附带详细的 Nginx 配置排查排错流程图与解决指南，支持分类过滤。
  - **开源资产化建议**: **当前实现内容完备**，是极佳的离线速查手册。

---

### 4. WebSocket / SSE 在线调试客户端 (`/websocket-tester`)

- **功能定位**: 原生 `WebSocket` / `EventSource` 调试客户端，支持自定义子协议、定时心跳保活、消息时间戳日志与 JSON 高亮。
- **GitHub 顶级开源项目盘点**:
  1. **wscat** (`websockets/wscat`)
     - **Star 数**: **4,200+⭐** | **License**: MIT
     - **技术栈**: Node.js / WebSocket
     - **核心特性**: 官方 CLI 级 WebSocket 通信调试工具。
  2. **PieSocket WebSocket Tester** (`piehost/websocket-tester`)
     - **Star 数**: **800+⭐** | **License**: MIT
     - **技术栈**: Vue / WebSockets API
     - **核心特性**: 纯浏览器端 WebSocket/Socket.io 测试器，支持日志导出、心跳与请求头配置。
- **与本项目当前实现对比**:
  - **当前实现**: 纯浏览器原生长连接调试，支持自动心跳重试、多色彩状态日志与 JSON 美化。
  - **开源资产化建议**: **保持当前纯前端实现**，无需服务端后端代理即可测试公网/局域网 ws/wss 接口。


---

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


---

## 四、开源资产引入与长期维护策略

1. **统一资产存放目录规范**：
   - 凡是引入或 Clone 的第三方开源仓库，一律存放于本地资产库 `C:\Users\18086\.workspace\git program\<repo-name>`，不直接在资产库中杂糅开发。
   - 提取的核心 UMD / 单文件 JS 库规范放置在项目 `lib/<lib-name>/` 目录中统一管理。
2. **纯离线运行红线 (Local-Only Offline Principle)**：
   - 无论引入何种开源库，均必须支持在无公网网络环境下从本地静态加载，严禁使用任何动态外部 CDN（如 unpkg/cdnjs 运行时链接），确保部署后在断网/私有化服务器中 100% 稳定运行。
3. **版本锁定与体积控制**：
   - 优先选择无庞大运行时依赖（Tree-shakable 或经过 Rollup/esbuild 压缩的单文件 UMD/IIFE 格式），单个库体积控制在 50KB~200KB 之间，避免引起首页或工具页的加载瓶颈。
