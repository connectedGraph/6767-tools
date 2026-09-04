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
