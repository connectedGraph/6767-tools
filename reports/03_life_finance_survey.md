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
