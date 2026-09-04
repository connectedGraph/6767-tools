# 在线工具集 · 工具拓展交付清单与变更日志 (Changelog)

> **拓展执行时间**: 2026-08-31  
> **执行模式**: 5 个子智能体 (Subagents) 高并发并行研发 + 主智能体全站路由与导航统一同步  
> **交付成果**: **第二期 21 款全新深度离线工具**（全站工具总数由 164 款跃升至 **189 款**，全量页面突破 **200 个**）

---

## 交付总览表

| 序号 | 类别 | 工具名称 | 对应页面文件 | Clean-URL 路由 | 拓展完成时间 |
|:---:|:---|:---|:---|:---|:---:|
| 01 | 程序员工具 | **JSON 格式化与高能工具箱** | `pages/json-formatter.html` | `/json-formatter` | 2026-08-31 |
| 02 | 程序员工具 | **JWT 解码与调试器** | `pages/jwt-debugger.html` | `/jwt-debugger` | 2026-08-31 |
| 03 | 程序员工具 | **正则表达式测试器** | `pages/regex-tester.html` | `/regex-tester` | 2026-08-31 |
| 04 | 程序员工具 | **Cron 表达式生成与预测器** | `pages/cron-generator.html` | `/cron-generator` | 2026-08-31 |
| 05 | 办公助手 | **文本多行去重与多维排序器** | `pages/text-dedup-sort.html` | `/text-dedup-sort` | 2026-08-31 |
| 06 | 办公助手 | **中英文排版规范美化器** | `pages/text-autospace.html` | `/text-autospace` | 2026-08-31 |
| 07 | 办公助手 | **在线表格转换器** | `pages/table-converter.html` | `/table-converter` | 2026-08-31 |
| 08 | 办公助手 | **人民币大写金额转换器** | `pages/rmb-capital-converter.html` | `/rmb-capital-converter` | 2026-08-31 |
| 09 | 办公助手 | **综合字数与阅读时长统计** | `pages/word-counter.html` | `/word-counter` | 2026-08-31 |
| 10 | 生成工具 | **UUID / ULID / NanoID 批量生成器** | `pages/uuid-generator.html` | `/uuid-generator` | 2026-08-31 |
| 11 | 生成工具 | **CSS 渐变色生成器 (Gradient Studio)** | `pages/css-gradient-generator.html` | `/css-gradient-generator` | 2026-08-31 |
| 12 | 生成工具 | **CSS 盒子阴影生成器 (Box Shadow Studio)** | `pages/css-shadow-generator.html` | `/css-shadow-generator` | 2026-08-31 |
| 13 | 图像处理 | **图片调色板提取器** | `pages/color-palette-extractor.html` | `/color-palette-extractor` | 2026-08-31 |
| 14 | 图像处理 | **多图无损拼接与长图生成器** | `pages/image-stitcher.html` | `/image-stitcher` | 2026-08-31 |
| 15 | 图像处理 | **图片马赛克与局部隐私遮挡** | `pages/image-mosaic-blur.html` | `/image-mosaic-blur` | 2026-08-31 |
| 16 | 生活实用 | **2026最新个税与五险一金计算器** | `pages/salary-tax-calculator.html` | `/salary-tax-calculator` | 2026-08-31 |
| 17 | 生活实用 | **房贷提前还款与省息对比器** | `pages/mortgage-advanced-calculator.html` | `/mortgage-advanced-calculator` | 2026-08-31 |
| 18 | 生活实用 | **日期间隔与重要日子倒计时** | `pages/date-calculator.html` | `/date-calculator` | 2026-08-31 |
| 19 | 学习与科学 | **化学元素周期表交互系统 (118元素)** | `pages/periodic-table.html` | `/periodic-table` | 2026-08-31 |
| 20 | 学习与科学 | **数据存储单位与进阶换算器** | `pages/data-unit-converter.html` | `/data-unit-converter` | 2026-08-31 |
| 21 | 学习与科学 | **科学高级计算器** | `pages/scientific-calculator.html` | `/scientific-calculator` | 2026-08-31 |
| 22 | 健康管理 | **科学每日饮水量计算器与喝水时间表** | `pages/water-intake-calculator.html` | `/water-intake-calculator` | 2026-08-31 |
| 23 | 健康管理 | **90分钟睡眠周期与最佳起床时间计算器** | `pages/sleep-cycle-calculator.html` | `/sleep-cycle-calculator` | 2026-08-31 |
| 24 | 健康管理 | **常用食物热量与营养成分速查表** | `pages/food-calories-lookup.html` | `/food-calories-lookup` | 2026-08-31 |
| 25 | 脑力与益智 | **经典扫雷游戏 (Minesweeper)** | `pages/minesweeper.html` | `/minesweeper` | 2026-08-31 |
| 26 | 娱乐趣味 | **今天吃什么 / 帮我做决定** | `pages/decision-maker.html` | `/decision-maker` | 2026-08-31 |
| 27 | 娱乐趣味 | **手持全屏弹幕 / LED 滚动屏幕** | `pages/led-banner.html` | `/led-banner` | 2026-08-31 |
| 28 | 脑力与益智 | **在线数独游戏 (存量挂载)** | `pages/sudoku.html` | `/sudoku` | 2026-08-31 |
| 29 | 脑力与益智 | **熄灯解谜游戏 (存量挂载)** | `pages/lights-out.html` | `/lights-out` | 2026-08-31 |
| 30 | 办公助手 | **颜文字表情大全 (存量挂载)** | `pages/emoticon.html` | `/emoticon` | 2026-08-31 |
| 31 | 办公助手 | **简历模板中心 (存量挂载)** | `pages/resume-template.html` | `/resume-template` | 2026-08-31 |

---

## 详细工具特性与技术实现清单

### 一、程序员工具 (4 款全新)

#### 1. JSON 格式化与高能工具箱 (`/json-formatter`)
- **文件路径**: [pages/json-formatter.html](file:///C:/Users/18086/Desktop/在线工具集-部署源码/pages/json-formatter.html)
- **核心功能**:
  - 2/4/Tab 缩进美化、一键 Compact 压缩、递归键名 A-Z 排序、Unicode 汉字互转、单行字符串转义/去转义。
  - 精准捕获 SyntaxError 错误行号与列号，提供【一键自动修复】（修复单引号、尾随逗号、未加引号键名及注释）。
  - 递归折叠树状视图，支持 JSONPath 提取（`$.items[*].id` 等）、类型彩色 Badge。
  - 自动推导生成 **TypeScript Interface**、带有 PascalCase 与 `json:"..."` 的 **Go Struct** 及 **JSON Schema (Draft-07)**。

#### 2. JWT 解码与调试器 (`/jwt-debugger`)
- **文件路径**: [pages/jwt-debugger.html](file:///C:/Users/18086/Desktop/在线工具集-部署源码/pages/jwt-debugger.html)
- **核心功能**:
  - Header (粉红)、Payload (浅紫)、Signature (青蓝) 三段高亮解构与 Base64URL 纯前端解码。
  - `exp` 有效期智能判断（本地时间与 UTC、过期倒计时）、`iat`/`nbf`/`iss`/`sub` 结构化解析。
  - 基于 CryptoJS 支持 `HS256`/`HS384`/`HS512` 签名离线校验。
  - 内置 JWT 快速构建签发器与常用测试用例。

#### 3. 正则表达式测试器 (`/regex-tester`)
- **文件路径**: [pages/regex-tester.html](file:///C:/Users/18086/Desktop/在线工具集-部署源码/pages/regex-tester.html)
- **核心功能**:
  - 实时响应式正则测试、多色匹配项高亮渲染、起止索引标注。
  - 编号捕获组与命名捕获组独立提取，修饰符 `g/i/m/s/u` 自由切换。
  - 内置 20+ 款常用正则表达式库（手机号、邮箱、IP、身份证、URL、社会信用代码、JWT 等），一键载入测试用例。
  - 支持正则替换实时预览与正则元字符速查手册。

#### 4. Cron 表达式生成与预测器 (`/cron-generator`)
- **文件路径**: [pages/cron-generator.html](file:///C:/Users/18086/Desktop/在线工具集-部署源码/pages/cron-generator.html)
- **核心功能**:
  - 支持 5 段式（Linux Crontab）、6 段式（Quartz/Spring）与 7 段式（含年份）标准模式切换。
  - 秒、分、时、日、月、周、年 7 字段可视化配置与双向同步反向解析。
  - 纯前端 JavaScript 预测引擎精准推算未来 10 次的触发时间点与倒计时。
  - 中文自然语言语义实时解说与常用预设模版。

---

### 二、办公助手与文字工具 (5 款全新 + 2 款存量挂载)

#### 5. 文本多行去重与多维排序器 (`/text-dedup-sort`)
- **文件路径**: [pages/text-dedup-sort.html](file:///C:/Users/18086/Desktop/在线工具集-部署源码/pages/text-dedup-sort.html)
- **核心功能**:
  - 去除重复行保留唯一项、反向提取重复行、过滤空白行与去除首尾空格。
  - 基于 `Intl.Collator` 算法支持汉语拼音升降序、字符长度升降序、自然数值排序与乱序。
  - 前后对比看板：实时展示原行数、去重后行数、削减比率 % 与字符数变化。

#### 6. 中英文排版规范美化器 (`/text-autospace`)
- **文件路径**: [pages/text-autospace.html](file:///C:/Users/18086/Desktop/在线工具集-部署源码/pages/text-autospace.html)
- **核心功能**:
  - 严格遵循《中文文案排版指北》：自动在中英文/数字间插入半角空格、数字与单位规范空格。
  - 中文语境半角标点转全角，全角英数转半角，消除多余空格，规范弯引号/直角引号（`「 」`）。
  - 严格保护 Markdown 代码块（` ``` `）、行内代码（` ` `）及 HTML 链接。

#### 7. 在线表格转换器 (`/table-converter`)
- **文件路径**: [pages/table-converter.html](file:///C:/Users/18086/Desktop/在线工具集-部署源码/pages/table-converter.html)
- **核心功能**:
  - 粘贴 Excel/CSV/TSV，一键转换为 Markdown 表格、HTML 表格、JSON 数组对象、ASCII 纯文本表格、SQL Insert 语句。
  - 支持列字段自定义勾选、对齐方式、列别名与列顺序调整。

#### 8. 人民币大写金额转换器 (`/rmb-capital-converter`)
- **文件路径**: [pages/rmb-capital-converter.html](file:///C:/Users/18086/Desktop/在线工具集-部署源码/pages/rmb-capital-converter.html)
- **核心功能**:
  - 数字金额严格转换为中文大写（支持角分厘毫与大额防溢出）。
  - 提供 13 档银行支票凭证格子拆分对照视图，支持中文大写反向解析为阿拉伯数字。

#### 9. 综合字数与阅读时长统计器 (`/word-counter`)
- **文件路径**: [pages/word-counter.html](file:///C:/Users/18086/Desktop/在线工具集-部署源码/pages/word-counter.html)
- **核心功能**:
  - 统计中文字数、英文字词数、数字数、标点数、行数、段落数、句子数与 UTF-8/GBK 字节大小。
  - 测算朗读演说时长（220字/分）、大众默读时长（400字/分）与快速扫读时长；自动提取 Top 10 高频词。

---

### 三、生成与 CSS 设计工具 (3 款全新)

#### 10. UUID / ULID / NanoID 批量生成器 (`/uuid-generator`)
- **文件路径**: [pages/uuid-generator.html](file:///C:/Users/18086/Desktop/在线工具集-部署源码/pages/uuid-generator.html)
- **核心功能**:
  - 支持批量生成 UUID v4、UUID v7（时间有序）、ULID、NanoID、自定义 Token（1~1000个）。
  - 大小写、连字符、引号包裹与换行/逗号/JSON/SQL 导出，内置 ULID/UUID v7 时间戳解析器。

#### 11. CSS 渐变色生成器 (`/css-gradient-generator`)
- **文件路径**: [pages/css-gradient-generator.html](file:///C:/Users/18086/Desktop/在线工具集-部署源码/pages/css-gradient-generator.html)
- **核心功能**:
  - 线性渐变 (Linear)、径向渐变 (Radial)、锥形渐变 (Conic) 与重复渐变。
  - 交互式色标时间轴拖拽控制，支持文字镂空、盒子阴影与全屏预览，一键导出 CSS 与 1200x630 PNG。

#### 12. CSS 盒子阴影生成器 (`/css-shadow-generator`)
- **文件路径**: [pages/css-shadow-generator.html](file:///C:/Users/18086/Desktop/在线工具集-部署源码/pages/css-shadow-generator.html)
- **核心功能**:
  - 1~6 层多图层阴影叠加，2D 光源罗盘拖拽控制器。
  - 悬浮升起动画模拟与 12+ 经典预设（新拟态、霓虹发光、弥散软阴影等）。

---

### 四、图像与色彩工具 (3 款全新)

#### 13. 图片调色板提取器 (`/color-palette-extractor`)
- **文件路径**: [pages/color-palette-extractor.html](file:///C:/Users/18086/Desktop/在线工具集-部署源码/pages/color-palette-extractor.html)
- **核心功能**:
  - 本地离线解析图片，自动提取主色调与前 10 种主导色彩调色板（HEX/RGB/HSL 色值一键复制）。
  - 一键合成并导出调色板精美卡片。

#### 14. 多图无损拼接与长图生成器 (`/image-stitcher`)
- **文件路径**: [pages/image-stitcher.html](file:///C:/Users/18086/Desktop/在线工具集-部署源码/pages/image-stitcher.html)
- **核心功能**:
  - 多图拖拽排序与旋转，支持纵向长图、横向拼接、2~5 列九宫格网格。
  - 自定义内边距、外边距、圆角与背景色，Canvas 高清渲染导出 PNG/JPEG/WebP。

#### 15. 图片马赛克与局部隐私遮挡 (`/image-mosaic-blur`)
- **文件路径**: [pages/image-mosaic-blur.html](file:///C:/Users/18086/Desktop/在线工具集-部署源码/pages/image-mosaic-blur.html)
- **核心功能**:
  - 像素马赛克、高斯模糊、黑块遮挡、白块遮挡、红框高亮与橡皮擦。
  - 支持手绘与矩形框选双模式，完整 Undo/Redo 历史栈。

---

### 五、生活与财经计算工具 (3 款全新)

#### 16. 2026最新个税与五险一金计算器 (`/salary-tax-calculator`)
- **文件路径**: [pages/salary-tax-calculator.html](file:///C:/Users/18086/Desktop/在线工具集-部署源码/pages/salary-tax-calculator.html)
- **核心功能**:
  - 预设一二线各大城市社保公积金基数与比例，涵盖 6 大专项附加扣除最新标准。
  - 7 级超额累进税率全年 12 个月累计预扣预缴明细走势表与税后实发/五险一金环形图。

#### 17. 房贷提前还款与省息对比器 (`/mortgage-advanced-calculator`)
- **文件路径**: [pages/mortgage-advanced-calculator.html](file:///C:/Users/18086/Desktop/在线工具集-部署源码/pages/mortgage-advanced-calculator.html)
- **核心功能**:
  - 商贷/公积金/组合贷、等额本息与等额本金对比。
  - 提前还款双方案测算：方案 A（月供减少期限不变）vs 方案 B（月供不变缩短年限），全周期还款明细 CSV 导出。

#### 18. 日期间隔与重要日子倒计时 (`/date-calculator`)
- **文件路径**: [pages/date-calculator.html](file:///C:/Users/18086/Desktop/在线工具集-部署源码/pages/date-calculator.html)
- **核心功能**:
  - 相差总天数、周数、自然工作日（排除周末）计算。
  - 前后推算 N 天/工作日；内置高考/考研/节假日及自定义纪念日倒计时卡片（本地持久化）。

---

### 六、学习与科学工具 (3 款全新)

#### 19. 化学元素周期表交互系统 (`/periodic-table`)
- **文件路径**: [pages/periodic-table.html](file:///C:/Users/18086/Desktop/在线工具集-部署源码/pages/periodic-table.html)
- **核心功能**:
  - 完整 118 个元素响应式周期表、分类高亮与温度模拟（-273℃~6000℃）相态变化。
  - 元素档案弹窗：中文拼音读音语音朗读、相对原子质量、电子排布、熔沸点、密度与用途。

#### 20. 数据存储单位与进阶换算器 (`/data-unit-converter`)
- **文件路径**: [pages/data-unit-converter.html](file:///C:/Users/18086/Desktop/在线工具集-部署源码/pages/data-unit-converter.html)
- **核心功能**:
  - Bit 至 EiB 14 种存储单位 1000 进制 vs 1024 进制精准换算。
  - 硬盘/U盘容量缩水原理折算、宽带下载耗时估算、压强/功率/速度进阶换算。

#### 21. 科学高级计算器 (`/scientific-calculator`)
- **文件路径**: [pages/scientific-calculator.html](file:///C:/Users/18086/Desktop/在线工具集-部署源码/pages/scientific-calculator.html)
- **核心功能**:
  - 三角函数、反三角、双曲、对数、阶乘、模运算、物理数学常数、LED 双行屏、历史记录回填与全键盘快捷键。

---

### 七、健康管理工具 (3 款全新)

#### 22. 科学每日饮水量计算器与喝水时间表 (`/water-intake-calculator`)
- **文件路径**: [pages/water-intake-calculator.html](file:///C:/Users/18086/Desktop/在线工具集-部署源码/pages/water-intake-calculator.html)
- **核心功能**:
  - 基于体重、运动强度、气温与出汗的多变量科学补水模型。
  - 黄金 8 杯水分时段打卡时间表（本地记录打卡状态）与水合状态自测色卡。

#### 23. 90分钟睡眠周期与最佳起床时间计算器 (`/sleep-cycle-calculator`)
- **文件路径**: [pages/sleep-cycle-calculator.html](file:///C:/Users/18086/Desktop/在线工具集-部署源码/pages/sleep-cycle-calculator.html)
- **核心功能**:
  - 双向黄金周期推导（现在睡 vs 目标起床时间），防深睡眠惊醒评级。
  - 20 分钟高效 Power Nap 与 SVG 睡眠阶段波形可视化。

#### 24. 常用食物热量与营养成分速查表 (`/food-calories-lookup`)
- **文件路径**: [pages/food-calories-lookup.html](file:///C:/Users/18086/Desktop/在线工具集-部署源码/pages/food-calories-lookup.html)
- **核心功能**:
  - 160+ 款常见食物营养字典，提供每 100g 热量、碳水、蛋白质、脂肪、膳食纤维与 GI 升糖指数。
  - “今日饮食搭配计算器”互动篮子测算总热量与供能比。

---

### 八、益智与娱乐趣味 (3 款全新 + 2 款存量挂载)

#### 25. 经典扫雷游戏 (`/minesweeper`)
- **文件路径**: [pages/minesweeper.html](file:///C:/Users/18086/Desktop/在线工具集-部署源码/pages/minesweeper.html)
- **核心功能**:
  - 初级 (9x9)、中级 (16x16)、高级 (30x16) 与自定义雷区。
  - 首次点击安全保障、双击快速展开 (Chord)、Web Audio 离线合成音效与本地英雄榜。

#### 26. 今天吃什么 / 帮我做决定 (`/decision-maker`)
- **文件路径**: [pages/decision-maker.html](file:///C:/Users/18086/Desktop/在线工具集-部署源码/pages/decision-maker.html)
- **核心功能**:
  - 霓虹幸运大转盘、美食盲盒抽选机、3D 掷骰子、3D 抛硬币、摇签抽签。
  - 自定义选项权重管理与历史记录。

#### 27. 手持全屏弹幕 / LED 滚动屏幕 (`/led-banner`)
- **文件路径**: [pages/led-banner.html](file:///C:/Users/18086/Desktop/在线工具集-部署源码/pages/led-banner.html)
- **核心功能**:
  - 全屏沉浸式防熄屏手持弹幕，5 种走字方向与 20px~400px 字号调节。
  - 彩虹流光、点阵晶格、霓虹辉光与多种频闪特效。

---

## 质量与规范保障

1. **时间戳标记**: 所有新增页面的 HTML 头部均明确标注 `<!-- Tool Created: 2026-08-31 | Extension by Antigravity Agent -->`，页面卡片右下方均统一标注 `拓展时间: 2026-08-31`。
2. **离线运行保障**: 全部工具均采用纯前端实现（Vue 3 + Element Plus + Web API + Canvas + 本地离线数据/算法），零外部网络请求。
3. **视觉统一**: 全站严格沿用深色终端风格（Dark Terminal UI），统一搭载标准 `tool-topbar` 面包屑与快捷返回首页入口。
4. **全站导航与搜索同步**: 首页 `index.html`、全局搜索 `Search.html` 以及各分类导航页均已同步挂载，支持一键点击与关键字实时搜索直达。
