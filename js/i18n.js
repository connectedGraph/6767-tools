/**
 * 在线工具集 - 全局全栈国际化 (i18n) 核心库
 * 支持：简体中文 (zh)、English (en)、繁體中文 (zh-TW)
 * 具备：Element-Plus 多语言联动、DOM 智能自动翻译、全站 189 款工具字典内嵌、顶栏与首页独立多语言切换组件
 */
(function (global) {
  'use strict';

  // 1. 全局内嵌工具与分类字典
  var I18N_DATA = {
  "categories": {
    "brain": {
      "zh": "脑力训练",
      "en": "Brain Training",
      "zh-TW": "腦力訓練"
    },
    "office": {
      "zh": "办公助手",
      "en": "Office Assistant",
      "zh-TW": "辦公助手"
    },
    "image": {
      "zh": "图像",
      "en": "Image Tools",
      "zh-TW": "圖像"
    },
    "audio-and-video": {
      "zh": "音视频",
      "en": "Audio & Video",
      "zh-TW": "音視頻"
    },
    "generate": {
      "zh": "生成",
      "en": "Generators",
      "zh-TW": "生成"
    },
    "code": {
      "zh": "程序员",
      "en": "Developer Tools",
      "zh-TW": "程序員"
    },
    "study": {
      "zh": "学习",
      "en": "Learning & Math",
      "zh-TW": "學習"
    },
    "life": {
      "zh": "生活",
      "en": "Daily Life",
      "zh-TW": "生活"
    },
    "ent": {
      "zh": "娱乐",
      "en": "Entertainment",
      "zh-TW": "娛樂"
    },
    "health": {
      "zh": "健康",
      "en": "Health & Fitness",
      "zh-TW": "健康"
    }
  },
  "subcategories": {
    "记忆力": {
      "zh": "记忆力",
      "en": "Memory",
      "zh-TW": "記憶力"
    },
    "注意力": {
      "zh": "注意力",
      "en": "Attention",
      "zh-TW": "注意力"
    },
    "推演": {
      "zh": "推演",
      "en": "Logic & Deduction",
      "zh-TW": "推演"
    },
    "反应": {
      "zh": "反应",
      "en": "Reaction",
      "zh-TW": "反應"
    },
    "感知": {
      "zh": "感知",
      "en": "Perception",
      "zh-TW": "感知"
    },
    "空间": {
      "zh": "空间",
      "en": "Spatial",
      "zh-TW": "空間"
    }
  },
  "tools": {
    "2048": {
      "name": {
        "zh": "2048",
        "en": "2048 Game",
        "zh-TW": "2048"
      },
      "desc": {
        "zh": "滑动合并相同数字，体验 2 的幂次方增长乐趣。",
        "en": "Slide and merge matching number tiles to reach 2048 and beyond.",
        "zh-TW": "滑動合併相同數字，體驗 2 的冪次方增長樂趣。"
      }
    },
    "number-sequence-memory": {
      "name": {
        "zh": "数字顺序记忆训练",
        "en": "Number Sequence Memory",
        "zh-TW": "數字順序記憶訓練"
      },
      "desc": {
        "zh": "短期记忆力训练游戏，按数字顺序点击方块，挑战记忆极限。",
        "en": "Short-term memory training game. Click blocks in numerical order to test your brain limit.",
        "zh-TW": "短期記憶力訓練遊戲，按數字順序點擊方塊，挑戰記憶極限。"
      }
    },
    "sequence-memory": {
      "name": {
        "zh": "顺序记忆训练",
        "en": "Sequence Memory Test",
        "zh-TW": "順序記憶訓練"
      },
      "desc": {
        "zh": "记住按键点亮的顺序并依序复现，提升短期工作记忆。",
        "en": "Remember the sequence of flashing squares and repeat it to boost working memory.",
        "zh-TW": "記住按鍵點亮的順序並依序復現，提升短期工作記憶。"
      }
    },
    "n-back": {
      "name": {
        "zh": "N-Back 记忆力训练游戏",
        "en": "N-Back Working Memory Game",
        "zh-TW": "N-Back 記憶力訓練遊戲"
      },
      "desc": {
        "zh": "科学验证的大脑训练游戏，提升工作记忆与流体智力。",
        "en": "Scientifically validated brain training game to enhance working memory and fluid intelligence.",
        "zh-TW": "科學驗證的大腦訓練遊戲，提升工作記憶與流體智力。"
      }
    },
    "color-block-imprint": {
      "name": {
        "zh": "色块印记",
        "en": "Color Block Memory",
        "zh-TW": "色塊印記"
      },
      "desc": {
        "zh": "短时间内记忆矩阵色块位置并点击还原，训练视觉瞬间记忆。",
        "en": "Memorize color tile positions in the matrix and reproduce them to train visual memory.",
        "zh-TW": "短時間內記憶矩陣色塊位置並點擊還原，訓練視覺瞬間記憶。"
      }
    },
    "shult-grid": {
      "name": {
        "zh": "舒尔特方格训练",
        "en": "Schulte Grid Training",
        "zh-TW": "舒爾特方格訓練"
      },
      "desc": {
        "zh": "经典舒尔特方格注意力与快速视觉检索训练。",
        "en": "Classic Schulte Grid training for attention focus and visual search speed.",
        "zh-TW": "經典舒爾特方格注意力與快速視覺檢索訓練。"
      }
    },
    "find-different-word": {
      "name": {
        "zh": "找不同的字",
        "en": "Find Different Character",
        "zh-TW": "找不同的字"
      },
      "desc": {
        "zh": "在字符方阵中快速找出细微不同的异类字，锻炼视觉分辨与专注力。",
        "en": "Spot the outlier character in a matrix of similar symbols to train visual discrimination.",
        "zh-TW": "在字元方陣中快速找出細微不同的異類字，鍛鍊視覺分辨與專注力。"
      }
    },
    "stroop-effect": {
      "name": {
        "zh": "斯特鲁普效应",
        "en": "Stroop Effect Test",
        "zh-TW": "斯特魯普效應"
      },
      "desc": {
        "zh": "心理学经典字色冲突抑制控制测试，评估认知灵活性。",
        "en": "Classic psychology test measuring cognitive flexibility and selective attention inhibition.",
        "zh-TW": "心理學經典字色衝突抑制控制測試，評估認知靈活性。"
      }
    },
    "coordinate-drift": {
      "name": {
        "zh": "坐标迷航",
        "en": "Coordinate Drift",
        "zh-TW": "座標迷航"
      },
      "desc": {
        "zh": "空间坐标移动心算与方向感知挑战训练。",
        "en": "Mental spatial coordinate calculation and directional tracking challenge.",
        "zh-TW": "空間座標移動心算與方向感知挑戰訓練。"
      }
    },
    "visual-tracking-training": {
      "name": {
        "zh": "视觉追踪训练",
        "en": "Visual Tracking Training",
        "zh-TW": "視覺追蹤訓練"
      },
      "desc": {
        "zh": "多目标动态轨迹视觉追踪，提升动态视知觉与反应速度。",
        "en": "Multiple object dynamic trajectory tracking to improve visual alertness and tracking.",
        "zh-TW": "多目標動態軌跡視覺追蹤，提升動態視知覺與反應速度。"
      }
    },
    "sokoban": {
      "name": {
        "zh": "复古推箱子 50 关益智挑战",
        "en": "Classic Sokoban (50 Levels)",
        "zh-TW": "復古推箱子 50 關益智挑戰"
      },
      "desc": {
        "zh": "经典复古推箱子益智游戏，包含 50 关精心设计的逻辑推理关卡。",
        "en": "Classic Sokoban puzzle game with 50 carefully crafted brain-teaser levels.",
        "zh-TW": "經典復古推箱子益智遊戲，包含 50 關精心設計的邏輯推理關卡。"
      }
    },
    "minesweeper": {
      "name": {
        "zh": "经典扫雷游戏",
        "en": "Classic Minesweeper",
        "zh-TW": "經典踩地雷遊戲"
      },
      "desc": {
        "zh": "纯前端复刻经典扫雷游戏，支持初中高级与自定义雷区。",
        "en": "Classic Minesweeper puzzle game with Beginner, Intermediate, Expert and Custom modes.",
        "zh-TW": "純前端復刻經典踩地雷遊戲，支援初中高級與自訂雷區。"
      }
    },
    "sudoku": {
      "name": {
        "zh": "在线数独游戏",
        "en": "Online Sudoku Game",
        "zh-TW": "線上數獨遊戲"
      },
      "desc": {
        "zh": "经典 9x9 逻辑推理益智数独，支持多种难度与笔记提示。",
        "en": "Classic 9x9 logic reasoning puzzle with multiple difficulty levels and pencil notes.",
        "zh-TW": "經典 9x9 邏輯推理益智數獨，支援多種難度與筆記提示。"
      }
    },
    "lights-out": {
      "name": {
        "zh": "熄灯解谜游戏",
        "en": "Lights Out Puzzle",
        "zh-TW": "熄燈解謎遊戲"
      },
      "desc": {
        "zh": "益智关灯解谜游戏，通过状态翻转熄灭全部灯光。",
        "en": "Puzzle game where toggling adjacent tiles helps you turn off all lights.",
        "zh-TW": "益智關燈解謎遊戲，透過狀態翻轉熄滅全部燈光。"
      }
    },
    "digital-huarong-road": {
      "name": {
        "zh": "数字华容道",
        "en": "Number Klotski (Sliding Puzzle)",
        "zh-TW": "數字華容道"
      },
      "desc": {
        "zh": "用最少步数将滑块按数字顺序排列整齐的经典益智游戏。",
        "en": "Classic sliding puzzle to rearrange numbered tiles in order with minimum moves.",
        "zh-TW": "用最少步數將滑塊按數字順序排列整齊的經典益智遊戲。"
      }
    },
    "bottle-color-matching": {
      "name": {
        "zh": "上下瓶色匹配",
        "en": "Bottle Color Match",
        "zh-TW": "上下瓶色匹配"
      },
      "desc": {
        "zh": "观察力与逻辑推理训练，完成上下排瓶子颜色对齐。",
        "en": "Observation and deduction puzzle to match color sequences between bottle rows.",
        "zh-TW": "觀察力與邏輯推理訓練，完成上下排瓶子顏色對齊。"
      }
    },
    "react-speed-test": {
      "name": {
        "zh": "反应速度测试",
        "en": "Reaction Time Test",
        "zh-TW": "反應速度測試"
      },
      "desc": {
        "zh": "精确测量毫秒级反应时间，评估大脑反应敏捷度。",
        "en": "Measure reaction time in milliseconds when the color turns green.",
        "zh-TW": "精確測量毫秒級反應時間，評估大腦反應敏捷度。"
      }
    },
    "click-speed-test": {
      "name": {
        "zh": "点击速度测试",
        "en": "CPS Click Speed Test",
        "zh-TW": "點擊速度測試"
      },
      "desc": {
        "zh": "测试鼠标 CPS 点击速度，评估手速与爆发力。",
        "en": "Test your CPS (clicks per second) speed and mouse agility.",
        "zh-TW": "測試滑鼠 CPS 點擊速度，評估手速與爆發力。"
      }
    },
    "right-click-test": {
      "name": {
        "zh": "右键点击速度测试",
        "en": "Right Click Speed Test",
        "zh-TW": "右鍵點擊速度測試"
      },
      "desc": {
        "zh": "在线右键点击频率与手速测试工具。",
        "en": "Test your mouse right-click frequency and speed.",
        "zh-TW": "線上右鍵點擊頻率與手速測試工具。"
      }
    },
    "spacebar-counter": {
      "name": {
        "zh": "空格键计数器",
        "en": "Spacebar Speed Counter",
        "zh-TW": "空格鍵計數器"
      },
      "desc": {
        "zh": "按空格键测手速，统计规定时间内空格敲击次数。",
        "en": "Count how many times you can press the spacebar within a set time limit.",
        "zh-TW": "按空格鍵測手速，統計規定時間內空格敲擊次數。"
      }
    },
    "dynamic-visual-acuity-test": {
      "name": {
        "zh": "动态视力测试",
        "en": "Dynamic Visual Acuity Test",
        "zh-TW": "動態視力測試"
      },
      "desc": {
        "zh": "测试对高速移动物体的视觉捕捉与分辨能力。",
        "en": "Test visual capture and acuity for rapidly moving objects.",
        "zh-TW": "測試對高速移動物體的視覺捕捉與分辨能力。"
      }
    },
    "jing-tai-se-cha": {
      "name": {
        "zh": "静态色差感知",
        "en": "Static Color Vision Test",
        "zh-TW": "靜態色差感知"
      },
      "desc": {
        "zh": "测试对微小色差色彩块的分辨敏感度。",
        "en": "Test color vision sensitivity by identifying subtle shade differences.",
        "zh-TW": "測試對微小色差色彩塊的分辨敏感度。"
      }
    },
    "dong-tai-se-cha": {
      "name": {
        "zh": "动态色差感知",
        "en": "Dynamic Color Vision Test",
        "zh-TW": "動態色差感知"
      },
      "desc": {
        "zh": "在动态变化的色块中寻找差异，评估色彩敏锐度。",
        "en": "Detect color variations among dynamically changing tiles.",
        "zh-TW": "在動態變化的色塊中尋找差異，評估色彩敏銳度。"
      }
    },
    "time-perception-training": {
      "name": {
        "zh": "时间感知训练",
        "en": "Time Perception Training",
        "zh-TW": "時間感知訓練"
      },
      "desc": {
        "zh": "不看时钟估算时间流逝，培养大脑精准时间感。",
        "en": "Estimate time intervals without a clock to calibrate temporal perception.",
        "zh-TW": "不看時鐘估算時間流逝，培養大腦精準時間感。"
      }
    },
    "symmetry-blocks": {
      "name": {
        "zh": "对称方块",
        "en": "Symmetry Blocks Puzzle",
        "zh-TW": "對稱方塊"
      },
      "desc": {
        "zh": "空间几何对称图形还原与空间想象力训练。",
        "en": "Spatial symmetry pattern reproduction and spatial visualization training.",
        "zh-TW": "空間幾何對稱圖形還原與空間想像力訓練。"
      }
    },
    "text-dedup-sort": {
      "name": {
        "zh": "文本去重与多维排序器",
        "en": "Text Deduplication & Sorting",
        "zh-TW": "文本去重與多維排序器"
      },
      "desc": {
        "zh": "行文本去重、拼音/自然数/长度多维排序及格式清理。",
        "en": "Text line deduplication, multi-dimensional sorting, and whitespace cleaning.",
        "zh-TW": "行文本去重、拼音/自然數/長度多維排序及格式清理。"
      }
    },
    "text-autospace": {
      "name": {
        "zh": "中英文排版规范美化器",
        "en": "CJK Spacing & Typography Formatter",
        "zh-TW": "中英文排版規範美化器"
      },
      "desc": {
        "zh": "自动在中文字符与英文、数字、符号之间插入标准空格。",
        "en": "Automatically insert correct spaces between Chinese characters, English words, and numbers.",
        "zh-TW": "自動在中文字元與英文、數字、符號之間插入標準空格。"
      }
    },
    "table-converter": {
      "name": {
        "zh": "在线表格转换器",
        "en": "Online Table Format Converter",
        "zh-TW": "線上表格轉換器"
      },
      "desc": {
        "zh": "Markdown、CSV、JSON、HTML 表格多格式双向互转。",
        "en": "Convert tables between Markdown, CSV, JSON, and HTML formats seamlessly.",
        "zh-TW": "Markdown、CSV、JSON、HTML 表格多格式雙向互轉。"
      }
    },
    "rmb-capital-converter": {
      "name": {
        "zh": "人民币大写金额转换器",
        "en": "RMB Capital Amount Converter",
        "zh-TW": "人民幣大寫金額轉換器"
      },
      "desc": {
        "zh": "阿拉伯数字金额一键转换为财务规范中文大写金额。",
        "en": "Convert numeric currency amounts into formal Chinese financial uppercase words.",
        "zh-TW": "阿拉伯數字金額一鍵轉換為財務規範中文大寫金額。"
      }
    },
    "word-counter": {
      "name": {
        "zh": "综合字数与阅读时长统计",
        "en": "Word Counter & Reading Time Calculator",
        "zh-TW": "綜合字數與閱讀時長統計"
      },
      "desc": {
        "zh": "统计中英文字数、字符数、标点符号、段落与预估阅读时长。",
        "en": "Count words, characters, punctuation, paragraphs and estimate reading/speaking time.",
        "zh-TW": "統計中英文字數、字元數、標點符號、段落與預估閱讀時長。"
      }
    },
    "resume-maker": {
      "name": {
        "zh": "现代简历制作与排版器",
        "en": "Modern Professional Resume Builder",
        "zh-TW": "現代專業履歷製作與排版器"
      },
      "desc": {
        "zh": "所见即所得 A4 简历编辑器，多套精英风格主题排版，支持导入导出与一键生成 PDF/PNG。",
        "en": "WYSIWYG A4 resume editor with premium themes, JSON data drive, and one-click PDF/PNG export.",
        "zh-TW": "所見即所得 A4 履歷編輯器，多套精英風格主題排版，支援匯入匯出與一鍵生成 PDF/PNG。"
      }
    },
    "resume-template": {
      "name": {
        "zh": "简历模板中心",
        "en": "Resume Template Gallery",
        "zh-TW": "履歷範本中心"
      },
      "desc": {
        "zh": "精选简历模板库，涵盖各行业岗位与设计风格。",
        "en": "Curated collection of professional resume templates for various industries.",
        "zh-TW": "精選履歷範本庫，涵蓋各行業職位與設計風格。"
      }
    },
    "paper-size": {
      "name": {
        "zh": "A4纸张尺寸，各种纸张尺寸查询",
        "en": "Paper Size Reference Chart",
        "zh-TW": "A4紙張尺寸，各種紙張尺寸查詢"
      },
      "desc": {
        "zh": "全系列 ISO 216 国际标准纸张尺寸及分辨率速查。",
        "en": "Standard ISO paper sizes (A0-A10, B, C) dimensions and pixel resolutions.",
        "zh-TW": "全系列 ISO 216 國際標準紙張尺寸及解析度速查。"
      }
    },
    "convert-case": {
      "name": {
        "zh": "转换大小写",
        "en": "Case Converter",
        "zh-TW": "轉換大小寫"
      },
      "desc": {
        "zh": "大写、小写、首字母大写、驼峰等多种文本大小写转换。",
        "en": "Convert text case: UPPERCASE, lowercase, Title Case, camelCase, snake_case, and more.",
        "zh-TW": "大寫、小寫、首字大寫、駝峰等字元大小寫轉換。"
      }
    },
    "title-case-converter": {
      "name": {
        "zh": "标题大小写转换器",
        "en": "Title Case Converter",
        "zh-TW": "標題大小寫轉換器"
      },
      "desc": {
        "zh": "遵循英文语法规范的英文标题大小写转换器。",
        "en": "Format English headlines and titles according to standard style guides.",
        "zh-TW": "遵循英文語法規範的英文標題大小寫轉換器。"
      }
    },
    "sentence-case-converter": {
      "name": {
        "zh": "句子大小写转换器",
        "en": "Sentence Case Converter",
        "zh-TW": "句子大小寫轉換器"
      },
      "desc": {
        "zh": "将文本转换为首字母大写的规范句子格式。",
        "en": "Capitalize the first letter of each sentence automatically.",
        "zh-TW": "將文字轉換為首字母大寫的規範句子格式。"
      }
    },
    "bold-text-generator": {
      "name": {
        "zh": "粗体文本生成器",
        "en": "Bold Text Generator",
        "zh-TW": "粗體文字生成器"
      },
      "desc": {
        "zh": "生成适用于社交媒体和聊天软件的 Unicode 粗体特殊字符。",
        "en": "Generate Unicode bold fonts for social media posts, bios, and messages.",
        "zh-TW": "生成適用於社交媒體和聊天軟體的 Unicode 粗體特殊字元。"
      }
    },
    "italic-text-generator": {
      "name": {
        "zh": "斜体文本生成器",
        "en": "Italic Text Generator",
        "zh-TW": "斜體文字生成器"
      },
      "desc": {
        "zh": "生成适用于社交平台的 Unicode 斜体艺术字。",
        "en": "Generate Unicode italic styles for social media and text styling.",
        "zh-TW": "生成適用於社群平台的 Unicode 斜體藝術字。"
      }
    },
    "strikethrough-text-generator": {
      "name": {
        "zh": "删除线文本生成器",
        "en": "Strikethrough Text Generator",
        "zh-TW": "刪除線文字生成器"
      },
      "desc": {
        "zh": "生成带删除线横线的特殊 Unicode 文本。",
        "en": "Create crossed-out strikethrough text with Unicode overlay characters.",
        "zh-TW": "生成帶刪除線橫線的特殊 Unicode 文字。"
      }
    },
    "underline-text": {
      "name": {
        "zh": "下划线文本生成器",
        "en": "Underline Text Generator",
        "zh-TW": "底線文字生成器"
      },
      "desc": {
        "zh": "生成带有下划线样式的特殊 Unicode 文本。",
        "en": "Generate underlined text styles for social profiles and messaging.",
        "zh-TW": "生成帶有底線樣式的特殊 Unicode 文字。"
      }
    },
    "upside-down-text-generator": {
      "name": {
        "zh": "颠倒文本生成器",
        "en": "Upside Down Text Generator",
        "zh-TW": "顛倒文字生成器"
      },
      "desc": {
        "zh": "将文字上下颠倒反转生成趣味倒置文本。",
        "en": "Flip text upside down and backwards with fun inverted characters.",
        "zh-TW": "將文字上下顛倒反轉生成趣味倒置文字。"
      }
    },
    "mirror-text-generator": {
      "name": {
        "zh": "镜像文本生成器",
        "en": "Mirror Text Generator",
        "zh-TW": "鏡像文字生成器"
      },
      "desc": {
        "zh": "生成如同镜子中反射的水平镜像反向文字。",
        "en": "Transform text into horizontal mirrored reflection format.",
        "zh-TW": "生成如同鏡子中反射的水平鏡像反向文字。"
      }
    },
    "reverse-text-generator": {
      "name": {
        "zh": "反向文本生成器",
        "en": "Reverse Text Generator",
        "zh-TW": "反向文字生成器"
      },
      "desc": {
        "zh": "将文本按字符或单词倒序反向排列。",
        "en": "Reverse text by characters, words, or lines instantly.",
        "zh-TW": "將文字按字元或單字倒序反向排列。"
      }
    },
    "replace-text": {
      "name": {
        "zh": "文本替换工具",
        "en": "Text Find & Replace",
        "zh-TW": "文字取代工具"
      },
      "desc": {
        "zh": "在线批量文本查找与替换，支持区分大小写与高亮预览。",
        "en": "Batch find and replace text with live highlight and case matching.",
        "zh-TW": "線上批次文字尋找與取代，支援區分大小寫與醒目提示預覽。"
      }
    },
    "symbols": {
      "name": {
        "zh": "符号大全",
        "en": "Special Symbols Directory",
        "zh-TW": "符號大全"
      },
      "desc": {
        "zh": "特殊符号、箭头、标点、数学与技术符号一键复制大全。",
        "en": "Extensive directory of special characters, arrows, currency, and math symbols.",
        "zh-TW": "特殊符號、箭頭、標點、數學與技術符號一鍵複製大全。"
      }
    },
    "emoji": {
      "name": {
        "zh": "emoji表情大全",
        "en": "Emoji Directory & Copy",
        "zh-TW": "Emoji 表情大全"
      },
      "desc": {
        "zh": "全品类 Emoji 表情符号分类速查与一键复制。",
        "en": "Browse and copy all emoji categories, smileys, symbols, and flags.",
        "zh-TW": "全品類 Emoji 表情符號分類速查與一鍵複製。"
      }
    },
    "emoticon": {
      "name": {
        "zh": "颜文字表情大全",
        "en": "Kaomoji & Emoticon Collection",
        "zh-TW": "顏文字表情大全"
      },
      "desc": {
        "zh": "精选日系颜文字与字符表情大全，点击即复制。",
        "en": "Collection of Japanese kaomoji and cute text emoticons ready to copy.",
        "zh-TW": "精選日系顏文字與字元表情大全，點擊即複製。"
      }
    },
    "color-palette-extractor": {
      "name": {
        "zh": "图片调色板提取器",
        "en": "Image Color Palette Extractor",
        "zh-TW": "圖片調色盤擷取器"
      },
      "desc": {
        "zh": "智能提取图片中的主色调与完整配色方案。",
        "en": "Extract dominant colors and harmonious color palettes from any image.",
        "zh-TW": "智慧擷取圖片中的主色調與完整配色方案。"
      }
    },
    "image-stitcher": {
      "name": {
        "zh": "多图无损拼接与长图生成器",
        "en": "Image Stitcher & Long Image Maker",
        "zh-TW": "多圖無損拼接與長圖生成器"
      },
      "desc": {
        "zh": "支持横向、纵向、网格多图拼接与长截图生成。",
        "en": "Stitch multiple images horizontally, vertically, or in grid layouts without loss.",
        "zh-TW": "支援橫向、縱向、網格多圖拼接與長截圖生成。"
      }
    },
    "image-mosaic-blur": {
      "name": {
        "zh": "图片马赛克与局部隐私遮挡",
        "en": "Image Mosaic & Blur Tool",
        "zh-TW": "圖片馬賽克與局部隱私遮擋"
      },
      "desc": {
        "zh": "图片局部马赛克打码、高斯模糊与隐私涂抹遮挡。",
        "en": "Apply pixelated mosaic, Gaussian blur, and privacy masks to images.",
        "zh-TW": "圖片局部馬賽克打碼、高斯模糊與隱私塗抹遮擋。"
      }
    },
    "convert-image": {
      "name": {
        "zh": "图像格式转换器",
        "en": "Image Format Converter",
        "zh-TW": "圖像格式轉換器"
      },
      "desc": {
        "zh": "PNG、JPG、WEBP、GIF、SVG、BMP 图像格式互转。",
        "en": "Convert image formats between PNG, JPG, WEBP, GIF, SVG, and BMP.",
        "zh-TW": "PNG、JPG、WEBP、GIF、SVG、BMP 圖像格式互轉。"
      }
    },
    "compress-image": {
      "name": {
        "zh": "压缩图像",
        "en": "Compress Image",
        "zh-TW": "壓縮圖像"
      },
      "desc": {
        "zh": "纯本地高压缩比无损/有损图像压缩，保护数据隐私。",
        "en": "Client-side image compression with adjustable quality and zero privacy leaks.",
        "zh-TW": "純本機高壓縮比無損/有損圖像壓縮，保護資料隱私。"
      }
    },
    "resize-image": {
      "name": {
        "zh": "调整图像大小",
        "en": "Resize Image",
        "zh-TW": "調整圖像大小"
      },
      "desc": {
        "zh": "按像素或百分比缩放图片尺寸，支持等比例缩放。",
        "en": "Resize image dimensions by pixels or percentage with aspect ratio lock.",
        "zh-TW": "按像素或百分比縮放圖片尺寸，支援等比例縮放。"
      }
    },
    "adjust-image-aspect-ratio": {
      "name": {
        "zh": "调整图像宽高比例",
        "en": "Adjust Image Aspect Ratio",
        "zh-TW": "調整圖像長寬比例"
      },
      "desc": {
        "zh": "调整图片至指定比例，支持背景留白或模糊填充。",
        "en": "Fit images into standard aspect ratios with blur, color fill, or margins.",
        "zh-TW": "調整圖片至指定比例，支援背景留白或模糊填充。"
      }
    },
    "watermark-image": {
      "name": {
        "zh": "批量给图片加水印",
        "en": "Batch Image Watermark",
        "zh-TW": "批次圖片加浮水印"
      },
      "desc": {
        "zh": "批量添加文字或图片水印，可调整透明度与旋转角度。",
        "en": "Add custom text or image watermarks to multiple photos in batch.",
        "zh-TW": "批次新增文字或圖片浮水印，可調整透明度與旋轉角度。"
      }
    },
    "rotate-image": {
      "name": {
        "zh": "批量旋转图像",
        "en": "Batch Rotate Image",
        "zh-TW": "批次旋轉圖像"
      },
      "desc": {
        "zh": "批量对图像进行 90度/180度/270度 旋转与水平垂直翻转。",
        "en": "Batch rotate images by 90/180/270 degrees and flip horizontally/vertically.",
        "zh-TW": "批次對圖像進行 90度/180度/270度 旋轉與水平垂直翻轉。"
      }
    },
    "ico-generator": {
      "name": {
        "zh": "在线生成透明ICO图标",
        "en": "ICO Favicon Generator",
        "zh-TW": "線上生成透明ICO圖示"
      },
      "desc": {
        "zh": "将普通图片转换为支持多尺寸的透明 ICO 网站图标。",
        "en": "Convert images into multi-resolution transparent ICO favicons.",
        "zh-TW": "將普通圖片轉換為支援多尺寸的透明 ICO 網站圖示。"
      }
    },
    "round-image": {
      "name": {
        "zh": "在线生成透明圆角图片",
        "en": "Rounded Image Generator",
        "zh-TW": "線上生成透明圓角圖片"
      },
      "desc": {
        "zh": "快速将图片裁切为指定圆角半径或圆形透明头像。",
        "en": "Crop photos into rounded corners or circular avatars with transparent background.",
        "zh-TW": "快速將圖片裁切為指定圓角半徑或圓形透明頭像。"
      }
    },
    "create-gif": {
      "name": {
        "zh": "制作gif图片，编辑gif图片",
        "en": "GIF Maker & Editor",
        "zh-TW": "製作GIF圖片，編輯GIF圖片"
      },
      "desc": {
        "zh": "多张图片合成动图 GIF，支持调整帧率与尺寸。",
        "en": "Combine multiple images into animated GIF with custom delay and dimensions.",
        "zh-TW": "多張圖片合成動圖 GIF，支援調整幀率與尺寸。"
      }
    },
    "video-to-gif": {
      "name": {
        "zh": "视频转gif图片，视频转动图",
        "en": "Video to GIF Converter",
        "zh-TW": "影片轉GIF圖片，影片轉動圖"
      },
      "desc": {
        "zh": "截取视频片段转换为高质量 GIF 动图。",
        "en": "Clip and convert video segments into lightweight animated GIFs.",
        "zh-TW": "截取影片片段轉換為高品質 GIF 動圖。"
      }
    },
    "decompose-gif": {
      "name": {
        "zh": "分解gif图片",
        "en": "GIF Frame Splitter",
        "zh-TW": "分解GIF圖片"
      },
      "desc": {
        "zh": "将 GIF 动画逐帧拆解为单张静态图片并打包下载。",
        "en": "Split animated GIFs into individual static frames and download in batch.",
        "zh-TW": "將 GIF 動畫逐幀拆解為單張靜態圖片並打包下載。"
      }
    },
    "crop-image": {
      "name": {
        "zh": "裁剪、编辑图像",
        "en": "Crop & Edit Image",
        "zh-TW": "裁切、編輯圖像"
      },
      "desc": {
        "zh": "在线可视自由拖拽裁剪图片尺寸与选区。",
        "en": "Interactive visual tool to crop, trim, and adjust images accurately.",
        "zh-TW": "線上可視自由拖曳裁切圖片尺寸與選區。"
      }
    },
    "generate-grid-image": {
      "name": {
        "zh": "生成宫格图像，分割图片",
        "en": "Grid Image Splitter (9-Grid)",
        "zh-TW": "生成九宮格圖像，分割圖片"
      },
      "desc": {
        "zh": "将一张图片分割为九宫格、四宫格等社交媒体拼图切片。",
        "en": "Slice a photo into 9-grid or 4-grid tile sets for social media posts.",
        "zh-TW": "將一張圖片分割為九宮格、四宮格等社群媒體拼圖切片。"
      }
    },
    "image-processing-assistant-app": {
      "name": {
        "zh": "图像处理助手桌面应用程序",
        "en": "Image Processing Assistant App",
        "zh-TW": "圖像處理助手桌面應用程式"
      },
      "desc": {
        "zh": "高效本地图像批量处理与增强桌面应用。",
        "en": "Desktop application for high-performance batch image enhancement and processing.",
        "zh-TW": "高效本機圖像批次處理與增強桌面應用程式。"
      }
    },
    "image-compressor-app": {
      "name": {
        "zh": "图像压缩器桌面应用程序",
        "en": "Image Compressor App",
        "zh-TW": "圖像壓縮器桌面應用程式"
      },
      "desc": {
        "zh": "多线程极速批量图像压缩桌面客户端。",
        "en": "Multi-threaded desktop client for fast batch image compression.",
        "zh-TW": "多執行緒極速批次圖像壓縮桌面客戶端。"
      }
    },
    "white-noise-player": {
      "name": {
        "zh": "白噪音与专注助眠多轨混音器",
        "en": "Ambient White Noise & Sleep Mixer",
        "zh-TW": "白噪音與專注助眠多軌混音器"
      },
      "desc": {
        "zh": "雨声、森林、篝火等自然白噪音多轨独立调音与专注混音。",
        "en": "Multi-track ambient sound generator (rain, forest, fire) for focus and relaxation.",
        "zh-TW": "雨聲、森林、營火等自然白噪音多軌獨立調音與專注混音。"
      }
    },
    "screen-recorder": {
      "name": {
        "zh": "免插件屏幕与窗口录制工具",
        "en": "Web Screen & Window Recorder",
        "zh-TW": "免外掛螢幕與視窗錄製工具"
      },
      "desc": {
        "zh": "纯浏览器录制屏幕、窗口或标签页，支持音频混音与 WebM/MP4 导出。",
        "en": "Record full screen, application windows, or browser tabs directly without plugins.",
        "zh-TW": "純瀏覽器錄製螢幕、視窗或分頁，支援音訊混音與 WebM/MP4 匯出。"
      }
    },
    "voice-recorder": {
      "name": {
        "zh": "在线波形录音机与音频剪辑",
        "en": "Voice Recorder & Audio Trimmer",
        "zh-TW": "線上波形錄音機與音訊剪輯"
      },
      "desc": {
        "zh": "实时可视化波形麦克风录音、剪切、试听与音频导出。",
        "en": "Microphone voice recorder with real-time waveform visualizer and audio trimming.",
        "zh-TW": "即時視覺化波形麥克風錄音、剪切、試聽與音訊匯出。"
      }
    },
    "metronome-tuner": {
      "name": {
        "zh": "极简电子节拍器与乐器调音器",
        "en": "Digital Metronome & Instrument Tuner",
        "zh-TW": "極簡電子節拍器與樂器調音器"
      },
      "desc": {
        "zh": "高精度节拍器 BPM 调节与实时乐器音高频率探测调音。",
        "en": "High-precision BPM metronome and real-time musical instrument pitch tuner.",
        "zh-TW": "高精度節拍器 BPM 調節與即時樂器音高頻率探測調音。"
      }
    },
    "video-processing-assistant-app": {
      "name": {
        "zh": "视频处理助手桌面应用程序",
        "en": "Video Processing Assistant App",
        "zh-TW": "影片處理助手桌面應用程式"
      },
      "desc": {
        "zh": "全能视频多媒体批量处理桌面工具。",
        "en": "All-in-one desktop utility for batch video manipulation and conversion.",
        "zh-TW": "全能影片多媒體批次處理桌面工具。"
      }
    },
    "video-cut-merge-app": {
      "name": {
        "zh": "视频剪切合并桌面应用程序",
        "en": "Video Cut & Merge App",
        "zh-TW": "影片剪輯合併桌面應用程式"
      },
      "desc": {
        "zh": "无损快速剪切合并长短视频的桌面客户端。",
        "en": "Fast lossless video trimming, splitting, and merging desktop application.",
        "zh-TW": "無損快速剪切合併長短影片的桌面客戶端。"
      }
    },
    "video-compressor-app": {
      "name": {
        "zh": "视频压缩器桌面应用程序",
        "en": "Video Compressor App",
        "zh-TW": "影片壓縮器桌面應用程式"
      },
      "desc": {
        "zh": "智能维持画质的高压缩率视频体积缩减应用。",
        "en": "Smart video file size reducer while maintaining high visual quality.",
        "zh-TW": "智慧維持畫質的高壓縮率影片體積縮減應用程式。"
      }
    },
    "video-format-converter-app": {
      "name": {
        "zh": "视频格式转换器桌面应用程序",
        "en": "Video Format Converter App",
        "zh-TW": "影片格式轉換器桌面應用程式"
      },
      "desc": {
        "zh": "支持主流音视频编码与容器格式互转的桌面应用。",
        "en": "Convert between popular video codecs and containers seamlessly.",
        "zh-TW": "支援主流音影片編碼與容器格式互轉的桌面應用程式。"
      }
    },
    "audio-processing-assistant-app": {
      "name": {
        "zh": "音频处理助手桌面应用程序",
        "en": "Audio Processing Assistant App",
        "zh-TW": "音訊處理助手桌面應用程式"
      },
      "desc": {
        "zh": "音频批量降噪、增益与通道处理桌面应用。",
        "en": "Desktop tool for batch audio enhancement, noise reduction, and channel mixing.",
        "zh-TW": "音訊批次降噪、增益與聲道處理桌面應用程式。"
      }
    },
    "audio-cut-merge-app": {
      "name": {
        "zh": "音频剪切合并桌面应用程序",
        "en": "Audio Cut & Merge App",
        "zh-TW": "音訊剪輯合併桌面應用程式"
      },
      "desc": {
        "zh": "毫秒级音频波形剪裁与多音轨合并应用。",
        "en": "Precise waveform-based audio cutting and multi-track audio merging tool.",
        "zh-TW": "毫秒級音訊波形剪裁與多音軌合併應用程式。"
      }
    },
    "audio-compressor-app": {
      "name": {
        "zh": "音频压缩器桌面应用程序",
        "en": "Audio Compressor App",
        "zh-TW": "音訊壓縮器桌面應用程式"
      },
      "desc": {
        "zh": "调节比特率与声道快速缩减音频文件体积。",
        "en": "Compress audio files by adjusting bitrate and sample frequency.",
        "zh-TW": "調節位元速率與聲道快速縮減音訊檔案體積。"
      }
    },
    "audio-format-convertor-app": {
      "name": {
        "zh": "音频格式转换器桌面应用程序",
        "en": "Audio Format Converter App",
        "zh-TW": "音訊格式轉換器桌面應用程式"
      },
      "desc": {
        "zh": "MP3/WAV/FLAC/AAC/OGG 多音频格式互转工具。",
        "en": "Convert audio files between MP3, WAV, FLAC, AAC, OGG, and M4A.",
        "zh-TW": "MP3/WAV/FLAC/AAC/OGG 多音訊格式互轉工具。"
      }
    },
    "mock-data-generator": {
      "name": {
        "zh": "测试模拟数据 (Mock Data) 批量生成器",
        "en": "Mock Data Generator",
        "zh-TW": "測試模擬資料 (Mock Data) 批次生成器"
      },
      "desc": {
        "zh": "自定义字段规则批量生成 JSON/CSV/SQL 假数据。",
        "en": "Generate realistic mock data in JSON, CSV, or SQL formats with custom schema.",
        "zh-TW": "自訂欄位規則批次生成 JSON/CSV/SQL 假資料。"
      }
    },
    "wifi-qrcode": {
      "name": {
        "zh": "WiFi 扫码直连二维码生成器",
        "en": "WiFi Quick Connect QR Code Generator",
        "zh-TW": "WiFi 掃碼直連二維碼生成器"
      },
      "desc": {
        "zh": "生成扫描即连 WiFi 的专属二维码，免输长密码。",
        "en": "Create a QR code that allows guests to connect to your WiFi by scanning.",
        "zh-TW": "生成掃描即連 WiFi 的專屬二維碼，免輸長密碼。"
      }
    },
    "contrast-checker": {
      "name": {
        "zh": "无障碍色彩对比度检测器 (WCAG)",
        "en": "Color Contrast Checker (WCAG)",
        "zh-TW": "無障礙色彩對比度檢測器 (WCAG)"
      },
      "desc": {
        "zh": "实时计算前景色与背景色的对比度，检测 WCAG AA/AAA 合规性。",
        "en": "Calculate contrast ratio between foreground and background for WCAG AA/AAA compliance.",
        "zh-TW": "即時計算前景色與背景色的對比度，檢測 WCAG AA/AAA 合規性。"
      }
    },
    "css-glassmorphism": {
      "name": {
        "zh": "CSS 玻璃拟态与毛玻璃生成器",
        "en": "CSS Glassmorphism Generator",
        "zh-TW": "CSS 玻璃擬態與毛玻璃生成器"
      },
      "desc": {
        "zh": "可视化调节毛玻璃模糊度、透明度与边框并生成 CSS。",
        "en": "Visual tool to design and copy modern glassmorphism frosted glass CSS effects.",
        "zh-TW": "視覺化調節毛玻璃模糊度、透明度與邊框並生成 CSS。"
      }
    },
    "ascii-art-generator": {
      "name": {
        "zh": "ASCII 艺术字与字符 Logo 生成器",
        "en": "ASCII Art & Text Logo Generator",
        "zh-TW": "ASCII 藝術字與字元 Logo 生成器"
      },
      "desc": {
        "zh": "内置 50+ 款经典终端 FIGlet 字体，将文字转为炫酷 ASCII 艺术字。",
        "en": "Convert text into ASCII art banners and terminal logos with 50+ FIGlet fonts.",
        "zh-TW": "內建 50+ 款經典終端機 FIGlet 字型，將文字轉為炫酷 ASCII 藝術字。"
      }
    },
    "uuid-generator": {
      "name": {
        "zh": "UUID / ULID / NanoID 批量生成器",
        "en": "UUID / ULID / NanoID Generator",
        "zh-TW": "UUID / ULID / NanoID 批次生成器"
      },
      "desc": {
        "zh": "批量生成 v4/v7 UUID、ULID 时间有序标识符与 NanoID。",
        "en": "Batch generate standard v4/v7 UUIDs, time-ordered ULIDs, and lightweight NanoIDs.",
        "zh-TW": "批次生成 v4/v7 UUID、ULID 時間有序識別碼與 NanoID。"
      }
    },
    "css-gradient-generator": {
      "name": {
        "zh": "CSS 渐变色生成器",
        "en": "CSS Gradient Studio",
        "zh-TW": "CSS 漸層色生成器"
      },
      "desc": {
        "zh": "可视化线性、径向与锥形渐变设计，一键复制 CSS 与 Tailwind。",
        "en": "Design linear, radial, and conic gradients visually and export CSS/Tailwind code.",
        "zh-TW": "視覺化線性、放射狀與錐形漸層設計，一鍵複製 CSS 與 Tailwind。"
      }
    },
    "css-shadow-generator": {
      "name": {
        "zh": "CSS 盒子阴影生成器",
        "en": "CSS Box Shadow Studio",
        "zh-TW": "CSS 盒子陰影生成器"
      },
      "desc": {
        "zh": "可视化调节多层阴影、内阴影与扩散半径并导出 CSS。",
        "en": "Create complex multi-layered box shadows with visual controls and copy CSS.",
        "zh-TW": "視覺化調節多層陰影、內陰影與擴散半徑並匯出 CSS。"
      }
    },
    "bar-code": {
      "name": {
        "zh": "条形码生成器",
        "en": "Barcode Generator",
        "zh-TW": "條碼生成器"
      },
      "desc": {
        "zh": "支持 Code128、EAN-13、UPC 等多种格式条形码在线生成与下载。",
        "en": "Generate standard barcodes (Code128, EAN-13, UPC, Code39) and export as PNG/SVG.",
        "zh-TW": "支援 Code128、EAN-13、UPC 等多種格式條碼線上生成與下載。"
      }
    },
    "qrcode": {
      "name": {
        "zh": "二维码生成器",
        "en": "QR Code Generator",
        "zh-TW": "二維碼生成器"
      },
      "desc": {
        "zh": "在线生成高容错率二维码，支持自定义颜色、中心 Logo 与高清导出。",
        "en": "Generate custom QR codes with color styling, embedded logo, and high error correction.",
        "zh-TW": "線上生成高容錯率二維碼，支援自訂顏色、中心 Logo 與高畫質匯出。"
      }
    },
    "serial-number": {
      "name": {
        "zh": "序列号生成器",
        "en": "Serial / Order Number Generator",
        "zh-TW": "序號生成器"
      },
      "desc": {
        "zh": "批量生成自定义前缀、日期格式与随机字符的业务流水号。",
        "en": "Generate custom sequential batch numbers, order serials, and unique keys.",
        "zh-TW": "批次生成自訂前綴、日期格式與隨機字元的業務流水號。"
      }
    },
    "random-number": {
      "name": {
        "zh": "随机数生成器",
        "en": "Random Number Generator",
        "zh-TW": "隨機數生成器"
      },
      "desc": {
        "zh": "在指定区间内生成不重复或允许重复的真随机数字序列。",
        "en": "Generate random numbers within custom ranges with sorting and unique options.",
        "zh-TW": "在指定區間內生成不重複或允許重複的真隨機數字序列。"
      }
    },
    "random-password": {
      "name": {
        "zh": "在线随机密码生成器",
        "en": "Random Password Generator",
        "zh-TW": "線上隨機密碼生成器"
      },
      "desc": {
        "zh": "高强度安全随机密码生成器，支持自定义长度、字符集与易读规则。",
        "en": "Create strong, cryptographically secure random passwords and passphrases.",
        "zh-TW": "高強度安全隨機密碼生成器，支援自訂長度、字元集與易讀規則。"
      }
    },
    "subnet-calculator": {
      "name": {
        "zh": "IP 子网掩码与 CIDR 计算器",
        "en": "IP Subnet & CIDR Calculator",
        "zh-TW": "IP 子網路遮罩與 CIDR 計算器"
      },
      "desc": {
        "zh": "快速计算可用 IP 范围、网络地址、广播地址与子网掩码。",
        "en": "Calculate IP subnet mask, network address, broadcast address, and host range.",
        "zh-TW": "快速計算可用 IP 範圍、網路位址、廣播位址與子網路遮罩。"
      }
    },
    "data-format-converter": {
      "name": {
        "zh": "多格式配置文件双向转换器",
        "en": "Data Format Converter (JSON/YAML/XML/TOML)",
        "zh-TW": "多格式設定檔雙向轉換器"
      },
      "desc": {
        "zh": "JSON、YAML、XML、TOML 配置文件双向互转与语法高亮。",
        "en": "Convert between JSON, YAML, XML, and TOML data formats with syntax checking.",
        "zh-TW": "JSON、YAML、XML、TOML 設定檔雙向互轉與語法醒目提示。"
      }
    },
    "http-status-codes": {
      "name": {
        "zh": "HTTP 状态码速查与排错全书",
        "en": "HTTP Status Codes Reference & Guide",
        "zh-TW": "HTTP 狀態碼速查與排錯手冊"
      },
      "desc": {
        "zh": "1xx 到 5xx 全品类 HTTP/HTTPS 状态码规范释义与排错排查指南。",
        "en": "Complete HTTP response status codes reference with troubleshooting tips.",
        "zh-TW": "1xx 到 5xx 全品類 HTTP/HTTPS 狀態碼規範釋義與排錯排查指南。"
      }
    },
    "websocket-tester": {
      "name": {
        "zh": "WebSocket / SSE 在线调试客户端",
        "en": "WebSocket & SSE Debugger",
        "zh-TW": "WebSocket / SSE 線上偵錯客戶端"
      },
      "desc": {
        "zh": "实时连接、发送数据与心跳保活的在线 WebSocket / SSE 调试工具。",
        "en": "Interactive online client to test WebSocket connections, messages, and Server-Sent Events.",
        "zh-TW": "即時連線、發送資料與心跳保活的線上 WebSocket / SSE 偵錯工具。"
      }
    },
    "curl-converter": {
      "name": {
        "zh": "cURL 转换多语言代码工具",
        "en": "cURL Code Generator",
        "zh-TW": "cURL 轉換多語言程式碼工具"
      },
      "desc": {
        "zh": "将 cURL 命令快速解析为 Python、JS、Go、PHP、Java 等语言请求代码。",
        "en": "Convert cURL commands into Python, JavaScript, Go, PHP, Java, and other languages.",
        "zh-TW": "將 cURL 命令快速解析為 Python、JS、Go、PHP、Java 等語言請求程式碼。"
      }
    },
    "sql-formatter": {
      "name": {
        "zh": "SQL 格式化与美化器",
        "en": "SQL Formatter & Beautifier",
        "zh-TW": "SQL 格式化與美化器"
      },
      "desc": {
        "zh": "美化或压缩 SQL 语句，支持 MySQL、PostgreSQL、Oracle、SQLite 多种方言。",
        "en": "Format and beautify SQL queries supporting MySQL, PostgreSQL, Oracle, SQLite dialects.",
        "zh-TW": "美化或壓縮 SQL 陳述式，支援 MySQL、PostgreSQL、Oracle、SQLite 多種方言。"
      }
    },
    "json-formatter": {
      "name": {
        "zh": "JSON 格式化与高能工具箱",
        "en": "JSON Formatter & Studio",
        "zh-TW": "JSON 格式化與深度工具箱"
      },
      "desc": {
        "zh": "JSON 语法校验、美化压缩、树状视图、JSONPath 查询与 TS/Go 类型生成。",
        "en": "JSON formatter, validator, tree viewer, JSONPath filter, and TypeScript type generator.",
        "zh-TW": "JSON 語法校驗、美化壓縮、樹狀檢視、JSONPath 查詢與 TS/Go 類型生成。"
      }
    },
    "jwt-debugger": {
      "name": {
        "zh": "JWT 解码与调试器",
        "en": "JWT Debugger & Decoder",
        "zh-TW": "JWT 解碼與偵錯工具"
      },
      "desc": {
        "zh": "在线解析 JSON Web Token 头部、载荷与签名验证。",
        "en": "Decode, inspect, and verify JSON Web Tokens (JWT) claims and signatures.",
        "zh-TW": "線上解析 JSON Web Token 標頭、酬載與簽章驗證。"
      }
    },
    "regex-tester": {
      "name": {
        "zh": "正则表达式测试器",
        "en": "Regex Tester & Cheat Sheet",
        "zh-TW": "正規表達式測試器"
      },
      "desc": {
        "zh": "实时正则匹配、捕获组分析、语法高亮与常用正则模板库。",
        "en": "Live regular expression tester with capture group breakdown and common patterns.",
        "zh-TW": "即時正規表達式比對、擷取群組分析、語法醒目提示與常用範本庫。"
      }
    },
    "cron-generator": {
      "name": {
        "zh": "Cron 表达式生成与预测器",
        "en": "Cron Expression Generator & Parser",
        "zh-TW": "Cron 表達式生成與預測器"
      },
      "desc": {
        "zh": "可视化配置 Cron 表达式，反向语法解析并预测未来执行时间。",
        "en": "Visual Cron schedule builder with natural explanation and next run time preview.",
        "zh-TW": "視覺化設定 Cron 表達式，反向語法解析並預測未來執行時間。"
      }
    },
    "port-scan": {
      "name": {
        "zh": "端口扫描",
        "en": "Port Scanner",
        "zh-TW": "連接埠掃描"
      },
      "desc": {
        "zh": "常用网络端口开放状态与服务连通性检测工具。",
        "en": "Check network port accessibility and common service connectivity.",
        "zh-TW": "常用網路連接埠開放狀態與服務連通性檢測工具。"
      }
    },
    "js-obfuscator": {
      "name": {
        "zh": "JavaScript混淆加密",
        "en": "JavaScript Obfuscator & Protector",
        "zh-TW": "JavaScript 混淆加密"
      },
      "desc": {
        "zh": "变量重命名、控制流扁平化与代码保护混淆器。",
        "en": "Protect JavaScript code with variable mangling, string encoding, and control flow flattening.",
        "zh-TW": "變數重新命名、控制流扁平化與程式碼保護混淆器。"
      }
    },
    "markdown": {
      "name": {
        "zh": "Markdown在线编辑器，Markdown转Word/Html/Pdf",
        "en": "Markdown Online Editor & Converter",
        "zh-TW": "Markdown 線上編輯器，Markdown轉Word/HTML/PDF"
      },
      "desc": {
        "zh": "所见即所得 Markdown 编辑与渲染，支持导出 HTML/PDF/Word。",
        "en": "Online Markdown editor with live preview, math equations, and PDF/HTML export.",
        "zh-TW": "所見即所得 Markdown 編輯與渲染，支援匯出 HTML/PDF/Word。"
      }
    },
    "timestamp": {
      "name": {
        "zh": "时间戳转换",
        "en": "Unix Timestamp Converter",
        "zh-TW": "時間戳轉換"
      },
      "desc": {
        "zh": "Unix 时间戳与标准北京/UTC 日期时间双向快速转换。",
        "en": "Convert between Unix timestamps (seconds/milliseconds) and human-readable dates.",
        "zh-TW": "Unix 時間戳與標準 UTC/當地日期時間雙向快速轉換。"
      }
    },
    "base-converter": {
      "name": {
        "zh": "进制转换",
        "en": "Number Base Converter",
        "zh-TW": "進制轉換"
      },
      "desc": {
        "zh": "二进制、八进制、十进制、十六进制等任意进制数值互转。",
        "en": "Convert numbers between Binary, Octal, Decimal, Hexadecimal, and Base-36.",
        "zh-TW": "二進位、八進位、十進位、十六進位等任意進制數值互轉。"
      }
    },
    "md5-encrypt": {
      "name": {
        "zh": "MD5加密",
        "en": "MD5 Hash Generator",
        "zh-TW": "MD5 加密"
      },
      "desc": {
        "zh": "快速计算文本或字符串的 16位/32位 MD5 散列值。",
        "en": "Generate 16-bit and 32-bit MD5 hash strings with uppercase/lowercase option.",
        "zh-TW": "快速計算文字或字串的 16位/32位 MD5 雜湊值。"
      }
    },
    "aes-encrypt": {
      "name": {
        "zh": "AES加密/解密",
        "en": "AES Encrypt / Decrypt",
        "zh-TW": "AES 加密/解密"
      },
      "desc": {
        "zh": "支持 CBC、CFB、CTR、OFB、ECB 模式的对称加密与解密。",
        "en": "AES symmetric encryption and decryption with CBC, CFB, CTR, OFB, and ECB modes.",
        "zh-TW": "支援 CBC、CFB、CTR、OFB、ECB 模式的對稱加密與解密。"
      }
    },
    "des-encrypt": {
      "name": {
        "zh": "DES加密/解密",
        "en": "DES Encrypt / Decrypt",
        "zh-TW": "DES 加密/解密"
      },
      "desc": {
        "zh": "经典 DES / 3DES 对称算法在线加密与解密。",
        "en": "DES / Triple DES algorithm online encryption and decryption tool.",
        "zh-TW": "經典 DES / 3DES 對稱演算法線上加密與解密。"
      }
    },
    "sha-encrypt": {
      "name": {
        "zh": "SHA加密",
        "en": "SHA Hash Generator",
        "zh-TW": "SHA 加密"
      },
      "desc": {
        "zh": "SHA-1、SHA-224、SHA-256、SHA-384、SHA-512 散列哈希生成。",
        "en": "Generate SHA-1, SHA-256, SHA-384, and SHA-512 cryptographic hashes.",
        "zh-TW": "SHA-1、SHA-224、SHA-256、SHA-384、SHA-512 雜湊生成。"
      }
    },
    "ripemd160-encrypt": {
      "name": {
        "zh": "RIPEMD160哈希加密",
        "en": "RIPEMD-160 Hash Generator",
        "zh-TW": "RIPEMD160 雜湊加密"
      },
      "desc": {
        "zh": "计算字符串的 RIPEMD-160 消息摘要哈希值。",
        "en": "Calculate RIPEMD-160 cryptographic hash for text inputs.",
        "zh-TW": "計算字串的 RIPEMD-160 訊息摘要雜湊值。"
      }
    },
    "hmac-encrypt": {
      "name": {
        "zh": "HMAC哈希加密",
        "en": "HMAC Signature Generator",
        "zh-TW": "HMAC 雜湊加密"
      },
      "desc": {
        "zh": "基于密钥的 HMAC-MD5 / SHA1 / SHA256 消息认证码生成。",
        "en": "Keyed-hash message authentication code (HMAC-MD5, HMAC-SHA256) calculator.",
        "zh-TW": "基於密鑰的 HMAC-MD5 / SHA1 / SHA256 訊息鑑別碼生成。"
      }
    },
    "rabbit-encrypt": {
      "name": {
        "zh": "Rabbit加密/解密",
        "en": "Rabbit Encrypt / Decrypt",
        "zh-TW": "Rabbit 加密/解密"
      },
      "desc": {
        "zh": "Rabbit 高速流密码在线加解密工具。",
        "en": "Fast stream cipher Rabbit encryption and decryption online tool.",
        "zh-TW": "Rabbit 高速流密碼線上加解密工具。"
      }
    },
    "rc4-encrypt": {
      "name": {
        "zh": "RC4加密/解密",
        "en": "RC4 Encrypt / Decrypt",
        "zh-TW": "RC4 加密/解密"
      },
      "desc": {
        "zh": "经典 RC4 流加密算法在线加解密。",
        "en": "Stream cipher RC4 online encryption and decryption utility.",
        "zh-TW": "經典 RC4 流加密演算法線上加解密。"
      }
    },
    "image-to-base64": {
      "name": {
        "zh": "图片转base64",
        "en": "Image to Base64 Converter",
        "zh-TW": "圖片轉 Base64"
      },
      "desc": {
        "zh": "将本地图片转换为 Base64 DataURI 编码并一键复制 HTML/CSS 代码。",
        "en": "Convert image files to Base64 Data URI strings for web embedding.",
        "zh-TW": "將本機圖片轉換為 Base64 DataURI 編碼並一鍵複製 HTML/CSS 程式碼。"
      }
    },
    "base64-encoder-decoder": {
      "name": {
        "zh": "base64编码解码",
        "en": "Base64 Encoder / Decoder",
        "zh-TW": "Base64 編碼/解碼"
      },
      "desc": {
        "zh": "支持 UTF-8 字符集的文本与 Base64 双向编码与解码。",
        "en": "Encode and decode plain text or binary data to/from Base64 representation.",
        "zh-TW": "支援 UTF-8 字元集的文字與 Base64 雙向編碼與解碼。"
      }
    },
    "url-encoder-decoder": {
      "name": {
        "zh": "URL编码解码",
        "en": "URL Encoder / Decoder",
        "zh-TW": "URL 編碼/解碼"
      },
      "desc": {
        "zh": "URL 网址百分比编码 (encodeURIComponent) 与解码还原。",
        "en": "Encode and decode URLs using standard percent-encoding formats.",
        "zh-TW": "URL 網址百分比編碼 (encodeURIComponent) 與解碼還原。"
      }
    },
    "text-to-ascll-converter": {
      "name": {
        "zh": "文本与ASCLL转换器",
        "en": "Text to ASCII Code Converter",
        "zh-TW": "文字與 ASCII 轉換器"
      },
      "desc": {
        "zh": "普通文本与 ASCII 十进制、十六进制、二进制码值互转。",
        "en": "Convert characters to ASCII decimal, hexadecimal, and binary values.",
        "zh-TW": "普通文字與 ASCII 十進位、十六進位、二進位碼值互轉。"
      }
    },
    "unicode-encoder-decoder": {
      "name": {
        "zh": "Unicode编码器/解码器",
        "en": "Unicode Encoder / Decoder",
        "zh-TW": "Unicode 編碼器/解碼器"
      },
      "desc": {
        "zh": "中文文本与 \\uXXXX Unicode 字符编码互转。",
        "en": "Convert text to and from Unicode escape sequences (\\uXXXX).",
        "zh-TW": "中文文字與 \\uXXXX Unicode 字元編碼互轉。"
      }
    },
    "compare-text": {
      "name": {
        "zh": "文本（代码）对比工具",
        "en": "Text & Code Diff Checker",
        "zh-TW": "文字（程式碼）比對工具"
      },
      "desc": {
        "zh": "双栏对比两段文本或代码差异，高亮增删改细节。",
        "en": "Side-by-side text and code difference viewer with inline change highlighting.",
        "zh-TW": "雙欄比對兩段文字或程式碼差異，醒目提示增刪改細節。"
      }
    },
    "format-html": {
      "name": {
        "zh": "html格式化、压缩",
        "en": "HTML Formatter & Minifier",
        "zh-TW": "HTML 格式化、壓縮"
      },
      "desc": {
        "zh": "HTML 源码缩进美化排版与去除多余空白极限压缩。",
        "en": "Format, indent, or minify HTML source code with custom options.",
        "zh-TW": "HTML 原始碼縮排美化排版與去除多餘空白極限壓縮。"
      }
    },
    "format-css": {
      "name": {
        "zh": "css格式化、压缩",
        "en": "CSS Formatter & Minifier",
        "zh-TW": "CSS 格式化、壓縮"
      },
      "desc": {
        "zh": "CSS 样式代码美化整理与压缩体积优化。",
        "en": "Beautify messy CSS stylesheets or minify them for production performance.",
        "zh-TW": "CSS 樣式程式碼美化整理與壓縮體積最佳化。"
      }
    },
    "format-js": {
      "name": {
        "zh": "js格式化、压缩",
        "en": "JavaScript Formatter & Minifier",
        "zh-TW": "JS 格式化、壓縮"
      },
      "desc": {
        "zh": "JavaScript 脚本代码美化排版与精简压缩。",
        "en": "Format and beautify JavaScript code or remove whitespace for minification.",
        "zh-TW": "JavaScript 指令碼程式碼美化排版與精簡壓縮。"
      }
    },
    "function-grapher": {
      "name": {
        "zh": "2D 数学函数图像绘制器",
        "en": "2D Math Function Grapher",
        "zh-TW": "2D 數學函數圖形繪製器"
      },
      "desc": {
        "zh": "支持多函数曲线绘制、导数、积分切线与缩放拖拽探索。",
        "en": "Plot 2D mathematical functions, curves, derivatives, and explore intersections.",
        "zh-TW": "支援多函數曲線繪製、導數、積分切線與縮放拖曳探索。"
      }
    },
    "bitwise-visualizer": {
      "name": {
        "zh": "计算机位运算与逻辑门实验室",
        "en": "Bitwise Operations & Logic Gate Lab",
        "zh-TW": "計算機位元運算與邏輯閘實驗室"
      },
      "desc": {
        "zh": "AND、OR、XOR、NOT、移位等二进制位运算动态可视化。",
        "en": "Interactive binary bitwise calculator and visual logic gate explorer.",
        "zh-TW": "AND、OR、XOR、NOT、移位等二進位位元運算動態視覺化。"
      }
    },
    "pinyin-converter": {
      "name": {
        "zh": "汉字转标准拼音与多音字排版",
        "en": "Chinese Hanzi to Pinyin Converter",
        "zh-TW": "中文字轉標準拼音與注音排版"
      },
      "desc": {
        "zh": "中文汉字注音、标准音标声调标注与 HTML5 ruby 注音排版。",
        "en": "Convert Chinese Hanzi into Pinyin with tone marks and Ruby phonetic typography.",
        "zh-TW": "中文漢字注音、標準音標聲調標註與 HTML5 ruby 注音排版。"
      }
    },
    "periodic-table": {
      "name": {
        "zh": "化学元素周期表交互系统",
        "en": "Interactive Periodic Table of Elements",
        "zh-TW": "化學元素週期表互動系統"
      },
      "desc": {
        "zh": "118 个化学元素物化性质、电子排布与温度相变交互速查。",
        "en": "Interactive periodic table exploring element properties, electron shells, and history.",
        "zh-TW": "118 個化學元素物化性質、電子排布與溫度相變互動速查。"
      }
    },
    "data-unit-converter": {
      "name": {
        "zh": "数据存储单位与进阶换算器",
        "en": "Data Storage & Physics Unit Converter",
        "zh-TW": "資料儲存單位與進階換算器"
      },
      "desc": {
        "zh": "Bit/Byte/KB/MB/GB 1000与1024进制换算及下载耗时预估。",
        "en": "Convert between digital storage units (KB, KiB, MB, GB) and estimate transfer time.",
        "zh-TW": "Bit/Byte/KB/MB/GB 1000與1024進制換算及下載耗時預估。"
      }
    },
    "scientific-calculator": {
      "name": {
        "zh": "科学高级计算器",
        "en": "Scientific Advanced Calculator",
        "zh-TW": "科學進階計算機"
      },
      "desc": {
        "zh": "三角函数、对数、指数、阶乘与高精度多步科学计算器。",
        "en": "Advanced scientific calculator with trigonometry, logarithms, powers, and memory.",
        "zh-TW": "三角函數、對數、指數、階乘與高精度多步科學計算機。"
      }
    },
    "length-converter": {
      "name": {
        "zh": "长度单位转换器",
        "en": "Length Unit Converter",
        "zh-TW": "長度單位轉換器"
      },
      "desc": {
        "zh": "米、千米、厘米、英寸、英尺、英里等多度量衡长度换算。",
        "en": "Convert between metric and imperial length units (meter, foot, inch, mile, km).",
        "zh-TW": "公尺、公里、公分、英吋、英呎、英里等多度量衡長度換算。"
      }
    },
    "area-converter": {
      "name": {
        "zh": "面积单位转换器",
        "en": "Area Unit Converter",
        "zh-TW": "面積單位轉換器"
      },
      "desc": {
        "zh": "平方米、平方公里、公顷、市亩、英亩等面积单位换算。",
        "en": "Convert between square meters, hectares, acres, square feet, and square miles.",
        "zh-TW": "平方公尺、平方公里、公頃、市畝、英畝等面積單位換算。"
      }
    },
    "volume-converter": {
      "name": {
        "zh": "体积单位转换器",
        "en": "Volume Unit Converter",
        "zh-TW": "體積單位轉換器"
      },
      "desc": {
        "zh": "升、毫升、立方米、加仑、盎司等体积容积单位互转。",
        "en": "Convert volume units: liters, milliliters, cubic meters, gallons, ounces, pints.",
        "zh-TW": "公升、毫升、立方公尺、加侖、盎司等體積容積單位互轉。"
      }
    },
    "weight-converter": {
      "name": {
        "zh": "重量转换器",
        "en": "Weight & Mass Converter",
        "zh-TW": "重量轉換器"
      },
      "desc": {
        "zh": "千克、克、吨、斤、磅、盎司等质量重量单位换算。",
        "en": "Convert mass and weight between kilograms, grams, pounds, ounces, and tons.",
        "zh-TW": "公斤、公克、公噸、台斤、磅、盎司等質量重量單位換算。"
      }
    },
    "temperature-converter": {
      "name": {
        "zh": "温度转换器",
        "en": "Temperature Converter",
        "zh-TW": "溫度轉換器"
      },
      "desc": {
        "zh": "摄氏度 (°C)、华氏度 (°F) 与开尔文 (K) 温度快速互转。",
        "en": "Convert temperatures between Celsius (°C), Fahrenheit (°F), and Kelvin (K).",
        "zh-TW": "攝氏度 (°C)、華氏度 (°F) 與開氏度 (K) 溫度快速互轉。"
      }
    },
    "proportion-calculator": {
      "name": {
        "zh": "比例计算器",
        "en": "Proportion & Ratio Calculator",
        "zh-TW": "比例計算機"
      },
      "desc": {
        "zh": "求解 A:B = C:D 比例方程与缩放比率换算。",
        "en": "Calculate proportions, scale factors, and solve A:B = C:X equations.",
        "zh-TW": "求解 A:B = C:D 比例方程式與縮放比率換算。"
      }
    },
    "perimeter-calculator": {
      "name": {
        "zh": "周长计算器",
        "en": "Perimeter Calculator",
        "zh-TW": "周長計算機"
      },
      "desc": {
        "zh": "圆形、矩形、三角形、多边形等几何平面图形周长计算。",
        "en": "Calculate perimeters of circles, rectangles, triangles, and regular polygons.",
        "zh-TW": "圓形、矩形、三角形、多邊形等幾何平面圖形周長計算。"
      }
    },
    "area-calculator": {
      "name": {
        "zh": "面积计算器",
        "en": "Area Calculator (Geometric)",
        "zh-TW": "面積計算機"
      },
      "desc": {
        "zh": "三角形、长方形、圆形、椭圆、梯形等平面几何面积计算。",
        "en": "Calculate surface areas of 2D shapes like triangles, trapezoids, circles, ellipses.",
        "zh-TW": "三角形、長方形、圓形、橢圓、梯形等平面幾何面積計算。"
      }
    },
    "surface-area-calculator": {
      "name": {
        "zh": "表面积计算器",
        "en": "Surface Area Calculator (3D)",
        "zh-TW": "表面積計算機"
      },
      "desc": {
        "zh": "球体、圆柱体、圆锥体、正方体等三维立体表面积计算。",
        "en": "Calculate total surface areas of 3D solids (sphere, cylinder, cone, cube).",
        "zh-TW": "球體、圓柱體、圓錐體、正方體等三維立體表面積計算。"
      }
    },
    "volume-calculator": {
      "name": {
        "zh": "体积计算器",
        "en": "Volume Calculator (3D Shapes)",
        "zh-TW": "體積計算機"
      },
      "desc": {
        "zh": "立体几何球体、圆柱、圆锥、棱台体积精准计算。",
        "en": "Calculate volumes of geometric 3D shapes (cubes, prisms, cylinders, spheres).",
        "zh-TW": "立體幾何球體、圓柱、圓錐、稜台體積精準計算。"
      }
    },
    "pi-query": {
      "name": {
        "zh": "圆周率查询",
        "en": "Pi (π) Digits Query",
        "zh-TW": "圓周率查詢"
      },
      "desc": {
        "zh": "圆周率 π 百万位数字检索与位置查询。",
        "en": "Search and inspect millions of digits of Pi (π) with position locator.",
        "zh-TW": "圓周率 π 百萬位數字檢索與位置查詢。"
      }
    },
    "compound-interest-calculator": {
      "name": {
        "zh": "复利定投与理财收益计算器",
        "en": "Compound Interest & Investment Calculator",
        "zh-TW": "複利定存與理財收益計算機"
      },
      "desc": {
        "zh": "计算定期定额投资复利增长曲线与长期理财预期回报。",
        "en": "Calculate compound interest growth, regular contributions, and investment returns.",
        "zh-TW": "計算定期定額投資複利增長曲線與長期理財預期回報。"
      }
    },
    "car-loan-calculator": {
      "name": {
        "zh": "全款与车贷落地费用精算器",
        "en": "Car Loan & Purchase Cost Calculator",
        "zh-TW": "全款與車貸落地費用精算機"
      },
      "desc": {
        "zh": "购车购置税、保险、上牌费及贷款利息落地全包总费用精算。",
        "en": "Calculate total on-the-road car purchase costs including taxes, insurance, and loan interest.",
        "zh-TW": "購車購置稅、保險、掛牌費及貸款利息落地全包總費用精算。"
      }
    },
    "world-clock-planner": {
      "name": {
        "zh": "世界时钟与跨时区会议规划器",
        "en": "World Clock & Timezone Meeting Planner",
        "zh-TW": "世界時鐘與跨時區會議規劃器"
      },
      "desc": {
        "zh": "全球各主要城市时钟、时区重叠时间与跨国会议时间规划。",
        "en": "World time zones viewer and meeting planner across global overlapping work hours.",
        "zh-TW": "全球各主要城市時鐘、時區重疊時間與跨國會議時間規劃。"
      }
    },
    "garbage-classification": {
      "name": {
        "zh": "生活垃圾分类离线速查字典",
        "en": "Waste & Recycling Classification Guide",
        "zh-TW": "生活垃圾分類離線速查字典"
      },
      "desc": {
        "zh": "快速查询生活垃圾归属分类（可回收物、厨余垃圾、有害垃圾、其他垃圾）。",
        "en": "Quick searchable guide for recycling, compostable, hazardous, and residual waste.",
        "zh-TW": "快速查詢生活垃圾歸屬分類（可回收物、廚餘垃圾、有害垃圾、其他垃圾）。"
      }
    },
    "kinship-calculator": {
      "name": {
        "zh": "中国亲戚关系称谓换算器",
        "en": "Chinese Kinship Title Calculator",
        "zh-TW": "親戚關係稱謂換算器"
      },
      "desc": {
        "zh": "输入亲戚血缘关系链快速换算正确的亲属称谓。",
        "en": "Calculate complex traditional Chinese kinship appellations and family tree titles.",
        "zh-TW": "輸入親戚血緣關係鏈快速換算正確的親屬稱謂。"
      }
    },
    "salary-tax-calculator": {
      "name": {
        "zh": "2026最新个税与五险一金计算器",
        "en": "Salary Tax & Social Security Calculator",
        "zh-TW": "個人所得稅與薪資計算機"
      },
      "desc": {
        "zh": "税前薪资、专项附加扣除、五险一金与税后实发工资精算。",
        "en": "Calculate take-home pay, income tax brackets, and social insurance deductions.",
        "zh-TW": "稅前薪資、專項附加扣除、五險一金與稅後實發工資精算。"
      }
    },
    "mortgage-advanced-calculator": {
      "name": {
        "zh": "房贷提前还款与省息对比器",
        "en": "Mortgage Prepayment & Savings Calculator",
        "zh-TW": "房貸提前還款與省息比對機"
      },
      "desc": {
        "zh": "房贷等额本息/等额本金提前还款省息金额与年限缩短对比。",
        "en": "Compare mortgage prepayment options: shorten term vs lower monthly payment.",
        "zh-TW": "房貸等額本息/等額本金提前還款省息金額與年限縮短對比。"
      }
    },
    "date-calculator": {
      "name": {
        "zh": "日期间隔与重要日子倒计时",
        "en": "Date Interval & Event Countdown",
        "zh-TW": "日期間隔與重要節日倒數計時"
      },
      "desc": {
        "zh": "计算两个日期之间的天数、工作日及未来重大节日倒计时。",
        "en": "Calculate days between two dates, add/subtract days, and track event countdowns.",
        "zh-TW": "計算兩個日期之間的天數、工作日及未來重大節日倒數計時。"
      }
    },
    "age": {
      "name": {
        "zh": "年龄计算器",
        "en": "Age & Zodiac Calculator",
        "zh-TW": "年齡與星座計算機"
      },
      "desc": {
        "zh": "输入出生日期计算精准周岁、虚岁、生肖、星座与生存天数。",
        "en": "Calculate exact age in years, months, days, plus astrological zodiac and birth facts.",
        "zh-TW": "輸入出生日期計算精準足歲、虛歲、生肖、星座與生存天數。"
      }
    },
    "retirement-time-query": {
      "name": {
        "zh": "退休年龄查询",
        "en": "Statutory Retirement Age Query",
        "zh-TW": "退休年齡查詢"
      },
      "desc": {
        "zh": "最新法定延迟退休年龄与退休年月测算工具。",
        "en": "Calculate statutory retirement age and target retirement date.",
        "zh-TW": "最新法定延遲退休年齡與退休年月測算工具。"
      }
    },
    "capital": {
      "name": {
        "zh": "世界各国首都",
        "en": "World Capitals Directory",
        "zh-TW": "世界各國首都"
      },
      "desc": {
        "zh": "世界近 200 个国家和地区的首都、所属大洲与国家简介速查。",
        "en": "Searchable directory of world countries, sovereign states, and their capitals.",
        "zh-TW": "世界近 200 個國家和地區的首都、所屬大洲與國家簡介速查。"
      }
    },
    "flag": {
      "name": {
        "zh": "世界各国国旗和区旗图案",
        "en": "World Flags & Regional Banners",
        "zh-TW": "世界各國國旗與區旗圖案"
      },
      "desc": {
        "zh": "高清世界各国国旗、地区区旗图案与寓意释义。",
        "en": "High-quality collection of national flags, regional banners, and descriptions.",
        "zh-TW": "高畫質世界各國國旗、地區區旗圖案與寓意釋義。"
      }
    },
    "loan-calculator": {
      "name": {
        "zh": "贷款计算器",
        "en": "General Loan & Amortization Calculator",
        "zh-TW": "貸款計算機"
      },
      "desc": {
        "zh": "等额本息与等额本金还款计划、总利息与月供明细计算。",
        "en": "Calculate monthly loan payments, total interest, and full amortization schedule.",
        "zh-TW": "等額本息與等額本金還款計畫、總利息與月供明細計算。"
      }
    },
    "bra-size": {
      "name": {
        "zh": "文胸尺码查询",
        "en": "Bra Size Converter & Guide",
        "zh-TW": "胸罩尺碼查詢"
      },
      "desc": {
        "zh": "测量上下胸围快速查询罩杯尺码与国际对照表。",
        "en": "Calculate cup size and convert bra sizing across international systems.",
        "zh-TW": "測量上下胸圍快速查詢罩杯尺碼與國際對照表。"
      }
    },
    "underwear-size": {
      "name": {
        "zh": "内裤尺码查询",
        "en": "Underwear Size Guide",
        "zh-TW": "內褲尺碼查詢"
      },
      "desc": {
        "zh": "按腰围、臀围查询男女士内裤尺码推荐。",
        "en": "Find recommended underwear sizes by waist and hip measurements.",
        "zh-TW": "按腰圍、臀圍查詢男女性內褲尺碼推薦。"
      }
    },
    "woman-clothing-size": {
      "name": {
        "zh": "女装尺码查询",
        "en": "Women's Clothing Size Chart",
        "zh-TW": "女裝尺碼查詢"
      },
      "desc": {
        "zh": "女士上衣、外套与裤装国际标准尺码换算表。",
        "en": "International sizing conversion chart for women's apparel (US, UK, EU, CN).",
        "zh-TW": "女裝上衣、外套與褲裝國際標準尺碼換算表。"
      }
    },
    "woman-shirt-size": {
      "name": {
        "zh": "女士衬衫尺码查询",
        "en": "Women's Shirt Size Chart",
        "zh-TW": "女士襯衫尺碼查詢"
      },
      "desc": {
        "zh": "按领围、胸围与肩宽查询女士衬衫尺码。",
        "en": "Find fitting sizes for women's button-down shirts and blouses.",
        "zh-TW": "按領圍、胸圍與肩寬查詢女士襯衫尺碼。"
      }
    },
    "dress-size": {
      "name": {
        "zh": "连衣裙尺码查询",
        "en": "Dress Size Chart",
        "zh-TW": "洋裝尺碼查詢"
      },
      "desc": {
        "zh": "根据胸围、腰围、臀围匹配合适连衣裙尺码。",
        "en": "Determine the right dress size based on bust, waist, and hip parameters.",
        "zh-TW": "根據胸圍、腰圍、臀圍匹配合適洋裝尺碼。"
      }
    },
    "child-clothe-size": {
      "name": {
        "zh": "小孩服装尺码查询",
        "en": "Kids & Baby Clothing Size Chart",
        "zh-TW": "童裝尺碼查詢"
      },
      "desc": {
        "zh": "按年龄与身高快速查询婴幼儿及儿童服装尺码。",
        "en": "Reference sizing chart for babies, toddlers, and children by height and age.",
        "zh-TW": "按年齡與身高快速查詢嬰幼兒及兒童服裝尺碼。"
      }
    },
    "man-clothing-size": {
      "name": {
        "zh": "男士服装尺码查询",
        "en": "Men's Clothing Size Chart",
        "zh-TW": "男士服裝尺碼查詢"
      },
      "desc": {
        "zh": "男士夹克、西装、T恤与上衣国际尺码换算对照。",
        "en": "International standard conversion chart for men's jackets, shirts, and suits.",
        "zh-TW": "男士夾克、西裝、T恤與上衣國際尺碼換算對照。"
      }
    },
    "man-pant-size": {
      "name": {
        "zh": "男士裤子尺码查询",
        "en": "Men's Pants & Jeans Size Chart",
        "zh-TW": "男士褲子尺碼查詢"
      },
      "desc": {
        "zh": "按腰围、裤长查询男士休闲裤与牛仔裤尺码。",
        "en": "Find men's jeans and trouser sizes based on waist and inseam measurements.",
        "zh-TW": "按腰圍、褲長查詢男士休閒褲與牛仔褲尺碼。"
      }
    },
    "pixel-art-maker": {
      "name": {
        "zh": "像素画 / 8-bit 图标在线编辑器",
        "en": "Pixel Art & 8-Bit Sprite Maker",
        "zh-TW": "像素畫 / 8-bit 圖示線上編輯器"
      },
      "desc": {
        "zh": "在线网格像素画绘制、图层调色与 PNG/GIF 动图导出。",
        "en": "Create retro pixel art and 8-bit game sprites with canvas layers and export options.",
        "zh-TW": "線上網格像素畫繪製、圖層調色與 PNG/GIF 動圖匯出。"
      }
    },
    "decision-maker": {
      "name": {
        "zh": "今天吃什么 / 帮我做决定",
        "en": "What to Eat / Decision Maker",
        "zh-TW": "今天吃什麼 / 幫我做決定"
      },
      "desc": {
        "zh": "治愈选择困难症，自定义选项一键随机抽取决策。",
        "en": "Random choice picker to help you decide meals, activities, and options effortlessly.",
        "zh-TW": "治癒選擇困難症，自訂選項一鍵隨機抽取決策。"
      }
    },
    "led-banner": {
      "name": {
        "zh": "手持全屏弹幕 / LED 滚动屏幕",
        "en": "Handheld LED Marquee Banner",
        "zh-TW": "手持全螢幕彈幕 / LED 滾動跑馬燈"
      },
      "desc": {
        "zh": "演唱会与聚会打 call 手机全屏滚动发光 LED 跑马灯字幕。",
        "en": "Fullscreen flashing LED scrolling banner text for concerts, parties, and pick-ups.",
        "zh-TW": "演唱會與聚會應援打 call 手機全螢幕滾動發光 LED 跑馬燈字幕。"
      }
    },
    "morse-code-translator": {
      "name": {
        "zh": "摩斯密码翻译器，摩斯密码音频播放器",
        "en": "Morse Code Translator & Player",
        "zh-TW": "摩斯密碼翻譯器，摩斯密碼音訊播放器"
      },
      "desc": {
        "zh": "文本与摩斯电码双向转换，支持蜂鸣器音频发声播放与复制。",
        "en": "Translate between text and Morse code with audio tone playback and visual signals.",
        "zh-TW": "文字與摩斯密碼雙向轉換，支援蜂鳴器音訊發聲播放與複製。"
      }
    },
    "lucky-wheel": {
      "name": {
        "zh": "幸运大转盘抽奖",
        "en": "Lucky Wheel & Spinner",
        "zh-TW": "幸運大轉盤抽獎"
      },
      "desc": {
        "zh": "支持自定义奖项、概率与音效的趣味在线转盘抽奖。",
        "en": "Customizable spinning prize wheel with sound effects and probability settings.",
        "zh-TW": "支援自訂獎項、機率與音效的趣味線上轉盤抽獎。"
      }
    },
    "lottery": {
      "name": {
        "zh": "在线抽奖工具",
        "en": "Random Name Picker & Raffle",
        "zh-TW": "線上抽獎工具"
      },
      "desc": {
        "zh": "支持批量名单录入、不重复抽取与中奖弹幕的聚会抽奖工具。",
        "en": "Raffle drawing and random name selector tool for events and giveaways.",
        "zh-TW": "支援批次名單錄入、不重複抽取與中獎彈幕的聚會抽獎工具。"
      }
    },
    "worth": {
      "name": {
        "zh": "身价计算器",
        "en": "Net Worth & Lifestyle Estimator",
        "zh-TW": "身價計算機"
      },
      "desc": {
        "zh": "趣味评估个人综合能力、生活方式与身价指数。",
        "en": "Fun calculator estimating potential net worth based on career and lifestyle attributes.",
        "zh-TW": "趣味評估個人綜合能力、生活方式與身價指數。"
      }
    },
    "death-time": {
      "name": {
        "zh": "死亡时间计算器",
        "en": "Lifespan & Life Clock Estimator",
        "zh-TW": "壽命與生命倒數計算機"
      },
      "desc": {
        "zh": "基于生活作息与健康习惯评估预期寿命与珍惜时间沙漏。",
        "en": "Life expectancy clock encouraging healthy habits and mindfulness of time.",
        "zh-TW": "基於生活作息與健康習慣評估預期壽命與珍惜時間沙漏。"
      }
    },
    "lucky-number": {
      "name": {
        "zh": "幸运数字计算器",
        "en": "Lucky Number Calculator",
        "zh-TW": "幸運數字計算機"
      },
      "desc": {
        "zh": "根据生日、姓名与生肖测算专属幸运数字。",
        "en": "Discover your personal lucky numbers based on numerology and birth dates.",
        "zh-TW": "根據生日、姓名與生肖測算專屬幸運數字。"
      }
    },
    "lucky-color": {
      "name": {
        "zh": "星座幸运色",
        "en": "Zodiac Lucky Color Query",
        "zh-TW": "星座幸運色"
      },
      "desc": {
        "zh": "查询十二星座今日、本周与年度专属开运幸运色。",
        "en": "Look up astrological lucky colors and palette alignments for each zodiac sign.",
        "zh-TW": "查詢十二星座今日、本週與年度專屬開運幸運色。"
      }
    },
    "hash-avatar": {
      "name": {
        "zh": "哈希头像生成器",
        "en": "Hash Identicon & Avatar Generator",
        "zh-TW": "雜湊頭像生成器"
      },
      "desc": {
        "zh": "根据任意文字哈希散列生成独一无二的像素 Identicon 头像。",
        "en": "Generate unique, reproducible geometric identicon avatars from any text string.",
        "zh-TW": "根據任意文字雜湊散列生成獨一無二的像素 Identicon 頭像。"
      }
    },
    "water-intake-calculator": {
      "name": {
        "zh": "科学每日饮水量计算器",
        "en": "Daily Water Intake Calculator",
        "zh-TW": "科學每日飲水量計算機"
      },
      "desc": {
        "zh": "根据体重、运动量与环境温度计算每日健康补水目标与时间表。",
        "en": "Calculate daily recommended water intake and hydration schedule based on weight and activity.",
        "zh-TW": "根據體重、運動量與環境溫度計算每日健康補水目標與時間表。"
      }
    },
    "sleep-cycle-calculator": {
      "name": {
        "zh": "90分钟睡眠周期与起床时间计算器",
        "en": "90-Min Sleep Cycle & Bedtime Calculator",
        "zh-TW": "90分鐘睡眠週期與起床時間計算機"
      },
      "desc": {
        "zh": "基于人体 90 分钟快速眼动睡眠周期推荐最佳入睡与起床时间。",
        "en": "Calculate optimal sleep and wake-up times based on natural 90-minute REM cycles.",
        "zh-TW": "基於人體 90 分鐘快速動眼睡眠週期推薦最佳入睡與起床時間。"
      }
    },
    "food-calories-lookup": {
      "name": {
        "zh": "常用食物热量与营养成分速查表",
        "en": "Food Calories & Nutrition Database",
        "zh-TW": "常用食物熱量與營養成分速查表"
      },
      "desc": {
        "zh": "离线速查常见谷物、肉禽、蔬菜、水果的卡路里与三大营养素。",
        "en": "Searchable offline nutritional database for food calories, protein, fat, and carbs.",
        "zh-TW": "離線速查常見穀物、肉禽、蔬菜、水果的卡路里與三大營養素。"
      }
    },
    "bmi": {
      "name": {
        "zh": "BMI指数计算",
        "en": "BMI Body Mass Index Calculator",
        "zh-TW": "BMI 身體質量指數計算"
      },
      "desc": {
        "zh": "计算身体质量指数 BMI，判断体重体型标准健康区间。",
        "en": "Calculate Body Mass Index (BMI) and determine healthy weight categories.",
        "zh-TW": "計算身體質量指數 BMI，判斷體重體型標準健康區間。"
      }
    },
    "bmr": {
      "name": {
        "zh": "基础代谢率(BMR)计算器",
        "en": "BMR Basal Metabolic Rate Calculator",
        "zh-TW": "基礎代謝率 (BMR) 計算機"
      },
      "desc": {
        "zh": "使用 Mifflin-St Jeor 公式测算基础代谢率与每日总能量消耗 TDEE。",
        "en": "Estimate Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE).",
        "zh-TW": "使用 Mifflin-St Jeor 公式測算基礎代謝率與每日總能量消耗 TDEE。"
      }
    },
    "bfr": {
      "name": {
        "zh": "体脂率（BFR）计算器",
        "en": "Body Fat Percentage (BFR) Calculator",
        "zh-TW": "體脂率 (BFR) 計算機"
      },
      "desc": {
        "zh": "根据身高、体重与腰臀围估算身体体脂百分比。",
        "en": "Estimate body fat percentage using standard anthropometric formulas.",
        "zh-TW": "根據身高、體重與腰臀圍估算身體體脂百分比。"
      }
    },
    "weight": {
      "name": {
        "zh": "标准体重计算器",
        "en": "Ideal Body Weight (IBW) Calculator",
        "zh-TW": "標準體重計算機"
      },
      "desc": {
        "zh": "结合性别与身高计算健康理想标准体重范围。",
        "en": "Calculate ideal body weight ranges for men and women based on height.",
        "zh-TW": "結合性別與身高計算健康理想標準體重範圍。"
      }
    },
    "burn-fat-heart-rate": {
      "name": {
        "zh": "燃脂心率计算器",
        "en": "Fat Burning Heart Rate Zone Calculator",
        "zh-TW": "燃脂心率計算機"
      },
      "desc": {
        "zh": "测算有氧燃脂最佳心率区间与最大心率储备。",
        "en": "Determine your optimal fat-burning and aerobic target heart rate zones.",
        "zh-TW": "測算有氧燃脂最佳心率區間與最大心率儲備。"
      }
    },
    "physical-fitness-test": {
      "name": {
        "zh": "体质综合测试",
        "en": "Physical Fitness Comprehensive Assessment",
        "zh-TW": "體質綜合評估測試"
      },
      "desc": {
        "zh": "综合评估心肺耐力、肌肉力量与柔韧性健康指数。",
        "en": "Comprehensive health score assessment covering endurance, strength, and BMI.",
        "zh-TW": "綜合評估心肺耐力、肌肉力量與柔軟度健康指數。"
      }
    },
    "protein-intake": {
      "name": {
        "zh": "蛋白质摄入量计算器",
        "en": "Daily Protein Intake Calculator",
        "zh-TW": "蛋白質攝取量計算機"
      },
      "desc": {
        "zh": "根据体重与增肌/减脂运动强度计算每日推荐蛋白质摄入克数。",
        "en": "Calculate daily protein requirements for muscle gain, fat loss, or maintenance.",
        "zh-TW": "根據體重與增肌/減脂運動強度計算每日推薦蛋白質攝取克數。"
      }
    },
    "energy-convert": {
      "name": {
        "zh": "焦耳卡路里换算器",
        "en": "Joule to Calorie Energy Converter",
        "zh-TW": "焦耳與卡路里能量轉換器"
      },
      "desc": {
        "zh": "千焦 (kJ) 与千卡/大卡 (kcal) 能量热量单位精准互转。",
        "en": "Convert energy units between Joules (J), Kilojoules (kJ), and Calories (kcal).",
        "zh-TW": "千焦 (kJ) 與千卡/大卡 (kcal) 能量熱量單位精準互轉。"
      }
    },
    "running-calorie": {
      "name": {
        "zh": "跑步卡路里消耗计算器",
        "en": "Running Calories Burned Calculator",
        "zh-TW": "跑步卡路里消耗計算機"
      },
      "desc": {
        "zh": "输入配速、时间与体重精确估算跑步运动消耗的热量。",
        "en": "Calculate calories burned during running based on pace, duration, and body weight.",
        "zh-TW": "輸入配速、時間與體重精確估算跑步運動消耗的熱量。"
      }
    },
    "best-figure": {
      "name": {
        "zh": "女性最佳身材计算器",
        "en": "Ideal Body Proportions Calculator",
        "zh-TW": "女性黃金身材比例計算機"
      },
      "desc": {
        "zh": "依据人体黄金分割比例测算胸围、腰围、臀围与大腿围黄金尺寸。",
        "en": "Calculate aesthetic body proportions based on golden ratio formulas.",
        "zh-TW": "依據人體黃金分割比例測算胸圍、腰圍、臀圍與大腿圍黃金尺寸。"
      }
    },
    "female-safe-period": {
      "name": {
        "zh": "女性安全期计算器",
        "en": "Ovulation & Menstrual Cycle Calculator",
        "zh-TW": "女性生理期與排卵期計算機"
      },
      "desc": {
        "zh": "在线推算月经期、排卵期与安全期时间日历。",
        "en": "Track menstrual cycle phases, estimated ovulation day, and fertile windows.",
        "zh-TW": "線上推算月經期、排卵期與安全期時間日曆。"
      }
    },
    "child-height": {
      "name": {
        "zh": "孩子身高预测",
        "en": "Child Adult Height Predictor",
        "zh-TW": "兒童成年身高預測計算機"
      },
      "desc": {
        "zh": "依据父母身高遗传学公式与环境因素测算孩子成年未来身高。",
        "en": "Predict a child future adult height using mid-parental genetic formulas.",
        "zh-TW": "依據父母身高遺傳學公式與環境因素測算孩子成年未來身高。"
      }
    },
    "bood-type": {
      "name": {
        "zh": "血型遗传规律和血型性格",
        "en": "Blood Type Inheritance & Personality Guide",
        "zh-TW": "血型遺傳規律與血型性格"
      },
      "desc": {
        "zh": "根据父母血型推算子女血型概率及血型性格特征分析。",
        "en": "Calculate offspring blood type possibilities from parents and explore personality traits.",
        "zh-TW": "根據父母血型推算子女血型機率及血型性格特徵分析。"
      }
    },
    "color-blindness-test": {
      "name": {
        "zh": "色盲色弱检测",
        "en": "Color Blindness & Deficiency Test (Ishihara)",
        "zh-TW": "色盲色弱檢測"
      },
      "desc": {
        "zh": "基于经典假同色石原图谱检测红绿色盲、色弱与全色盲。",
        "en": "Online color vision test using Ishihara plates to screen for red-green color deficiency.",
        "zh-TW": "基於經典假同色石原圖譜檢測紅綠色盲、色弱與全色盲。"
      }
    },
    "vegetable-oil": {
      "name": {
        "zh": "植物油脂肪含量查询",
        "en": "Vegetable Oil & Fatty Acid Database",
        "zh-TW": "植物油脂肪含量查詢"
      },
      "desc": {
        "zh": "橄榄油、花生油、菜籽油等食用油脂肪酸与烟点数据速查。",
        "en": "Nutritional comparison of vegetable oils, fatty acid profiles, and smoke points.",
        "zh-TW": "橄欖油、花生油、菜籽油等食用油脂肪酸與發煙點資料速查。"
      }
    },
    "Account": {
      "name": {
        "zh": "登录",
        "en": "Sign In",
        "zh-TW": "登入"
      },
      "desc": {
        "zh": "用户账户登录与身份认证。",
        "en": "User sign in and account authentication.",
        "zh-TW": "使用者帳戶登入與身分認證。"
      }
    },
    "signin": {
      "name": {
        "zh": "登录",
        "en": "Sign In",
        "zh-TW": "登入"
      },
      "desc": {
        "zh": "用户账户登录与身份认证。",
        "en": "User sign in and account authentication.",
        "zh-TW": "使用者帳戶登入與身分認證。"
      }
    },
    "Feedback": {
      "name": {
        "zh": "意见反馈",
        "en": "Feedback & Suggestions",
        "zh-TW": "意見反饋"
      },
      "desc": {
        "zh": "提交工具建议与问题反馈。",
        "en": "Submit suggestions, tool requests, and issue reports.",
        "zh-TW": "提交工具建議與問題反饋。"
      }
    },
    "Search": {
      "name": {
        "zh": "搜索",
        "en": "Search Tools",
        "zh-TW": "搜尋工具"
      },
      "desc": {
        "zh": "快速搜索全站工具与功能。",
        "en": "Search across all online tools and utilities.",
        "zh-TW": "快速搜尋全站工具與功能。"
      }
    },
    "audio-and-video": {
      "name": {
        "zh": "音视频",
        "en": "Audio & Video",
        "zh-TW": "音視頻"
      },
      "desc": {
        "zh": "音视频分类下的全部在线工具",
        "en": "All online tools in Audio & Video category",
        "zh-TW": "音視頻分類下的全部線上工具"
      }
    },
    "brain": {
      "name": {
        "zh": "脑力训练",
        "en": "Brain Training",
        "zh-TW": "腦力訓練"
      },
      "desc": {
        "zh": "脑力训练分类下的全部在线工具",
        "en": "All online tools in Brain Training category",
        "zh-TW": "腦力訓練分類下的全部線上工具"
      }
    },
    "code": {
      "name": {
        "zh": "程序员",
        "en": "Developer Tools",
        "zh-TW": "程序員"
      },
      "desc": {
        "zh": "程序员分类下的全部在线工具",
        "en": "All online tools in Developer Tools category",
        "zh-TW": "程序員分類下的全部線上工具"
      }
    },
    "ent": {
      "name": {
        "zh": "娱乐",
        "en": "Entertainment",
        "zh-TW": "娛樂"
      },
      "desc": {
        "zh": "娱乐分类下的全部在线工具",
        "en": "All online tools in Entertainment category",
        "zh-TW": "娛樂分類下的全部線上工具"
      }
    },
    "generate": {
      "name": {
        "zh": "生成",
        "en": "Generators",
        "zh-TW": "生成"
      },
      "desc": {
        "zh": "生成分类下的全部在线工具",
        "en": "All online tools in Generators category",
        "zh-TW": "生成分類下的全部線上工具"
      }
    },
    "health": {
      "name": {
        "zh": "健康",
        "en": "Health & Fitness",
        "zh-TW": "健康"
      },
      "desc": {
        "zh": "健康分类下的全部在线工具",
        "en": "All online tools in Health & Fitness category",
        "zh-TW": "健康分類下的全部線上工具"
      }
    },
    "image": {
      "name": {
        "zh": "图像",
        "en": "Image Tools",
        "zh-TW": "圖像"
      },
      "desc": {
        "zh": "图像分类下的全部在线工具",
        "en": "All online tools in Image Tools category",
        "zh-TW": "圖像分類下的全部線上工具"
      }
    },
    "life": {
      "name": {
        "zh": "生活",
        "en": "Daily Life",
        "zh-TW": "生活"
      },
      "desc": {
        "zh": "生活分类下的全部在线工具",
        "en": "All online tools in Daily Life category",
        "zh-TW": "生活分類下的全部線上工具"
      }
    },
    "office": {
      "name": {
        "zh": "办公助手",
        "en": "Office Assistant",
        "zh-TW": "辦公助手"
      },
      "desc": {
        "zh": "办公助手分类下的全部在线工具",
        "en": "All online tools in Office Assistant category",
        "zh-TW": "辦公助手分類下的全部線上工具"
      }
    },
    "study": {
      "name": {
        "zh": "学习",
        "en": "Learning & Math",
        "zh-TW": "學習"
      },
      "desc": {
        "zh": "学习分类下的全部在线工具",
        "en": "All online tools in Learning & Math category",
        "zh-TW": "學習分類下的全部線上工具"
      }
    }
  }
};

  // 2. UI 界面通用词条字典
  var UI_DICT = {
    // 头部与导航
    home: { zh: '首页', en: 'Home', 'zh-TW': '首頁' },
    search: { zh: '搜索', en: 'Search', 'zh-TW': '搜尋' },
    searchPlaceholder: { zh: '搜索工具、分类、关键词 (如: json, base64, 密码, 脑力)...', en: 'Search tools, categories, keywords (e.g. JSON, Base64, Password)...', 'zh-TW': '搜尋工具、分類、關鍵字 (如: json, base64, 密碼, 腦力)...' },
    searchBtn: { zh: '搜索', en: 'Search', 'zh-TW': '搜尋' },
    searchResults: { zh: '搜索结果', en: 'Search Results', 'zh-TW': '搜尋結果' },
    searchResultsCount: { zh: '共找到 {n} 个相关工具', en: 'Found {n} matching tools', 'zh-TW': '共找到 {n} 個相關工具' },
    searchNoResult: { zh: '没有找到匹配的工具，换个关键词试试吧', en: 'No matching tools found. Try another keyword.', 'zh-TW': '沒有找到符合的工具，換個關鍵字試試吧' },
    searchCatPlaceholder: { zh: '搜索本分类工具...', en: 'Search tools in this category...', 'zh-TW': '搜尋本分類工具...' },
    searchEmptyHint: { zh: '无匹配工具', en: 'No matching tools', 'zh-TW': '無符合工具' },
    useToolNow: { zh: '立即使用', en: 'Open Tool', 'zh-TW': '立即使用' },
    backToHome: { zh: '← 首页', en: '← Home', 'zh-TW': '← 首頁' },
    allCategories: { zh: '全部分类', en: 'All Categories', 'zh-TW': '全部分類' },
    allCategoryTag: { zh: '全部', en: 'All', 'zh-TW': '全部' },
    toolCount: { zh: '款工具', en: ' Tools', 'zh-TW': '款工具' },
    themeLight: { zh: '浅色模式', en: 'Light Mode', 'zh-TW': '淺色模式' },
    themeDark: { zh: '深色模式', en: 'Dark Mode', 'zh-TW': '深色模式' },
    langSelect: { zh: '切换语言', en: 'Language', 'zh-TW': '切換語言' },
    feedback: { zh: '意见反馈', en: 'Feedback', 'zh-TW': '意見反饋' },
    account: { zh: '登录', en: 'Sign In', 'zh-TW': '登入' },
    logout: { zh: '退出登录', en: 'Sign Out', 'zh-TW': '登出' },
    profile: { zh: '个人中心', en: 'Profile', 'zh-TW': '個人中心' },
    notice: { zh: '公告', en: 'Notice', 'zh-TW': '公告' },
    heroTitle: { zh: '在线工具集', en: 'Online Tools Hub', 'zh-TW': '線上工具集' },
    heroSubtitle: { zh: '汇聚 189+ 款高效纯前端本地与极客实用工具', en: 'Curated 189+ high-performance client-side & geek utility tools', 'zh-TW': '匯聚 189+ 款高效純前端本機與極客實用工具' },
    noticeMarquee: { zh: '本站为本地自托管副本 · 全部工具本地运行，零外部请求', en: 'Self-hosted toolkit · All tools run client-side with zero external requests', 'zh-TW': '本站為本機自託管副本 · 全部工具本機運作，零外部請求' },
    noticeCta: { zh: '浏览工具', en: 'Explore Tools', 'zh-TW': '瀏覽工具' },
    
    // 统计面板
    visitsToday: { zh: '今日', en: 'Today', 'zh-TW': '今日' },
    visitsTotal: { zh: '总计', en: 'Total', 'zh-TW': '總計' },
    visitsOnline: { zh: '在线', en: 'Online', 'zh-TW': '線上' },
    visitsLocation: { zh: '位置', en: 'Location', 'zh-TW': '位置' },
    visitsIp: { zh: 'IP', en: 'IP', 'zh-TW': 'IP' },

    // 操作按钮
    copy: { zh: '复制', en: 'Copy', 'zh-TW': '複製' },
    copied: { zh: '已复制', en: 'Copied', 'zh-TW': '已複製' },
    copySuccess: { zh: '复制成功！', en: 'Copied to clipboard!', 'zh-TW': '複製成功！' },
    copyFailed: { zh: '复制失败，请手动复制', en: 'Copy failed, please copy manually', 'zh-TW': '複製失敗，請手動複製' },
    clear: { zh: '清空', en: 'Clear', 'zh-TW': '清空' },
    reset: { zh: '重置', en: 'Reset', 'zh-TW': '重置' },
    calculate: { zh: '计算', en: 'Calculate', 'zh-TW': '計算' },
    submit: { zh: '提交', en: 'Submit', 'zh-TW': '提交' },
    confirm: { zh: '确定', en: 'Confirm', 'zh-TW': '確定' },
    cancel: { zh: '取消', en: 'Cancel', 'zh-TW': '取消' },
    close: { zh: '关闭', en: 'Close', 'zh-TW': '關閉' },
    download: { zh: '下载', en: 'Download', 'zh-TW': '下載' },
    export: { zh: '导出', en: 'Export', 'zh-TW': '匯出' },
    import: { zh: '导入', en: 'Import', 'zh-TW': '匯入' },
    format: { zh: '格式化', en: 'Format', 'zh-TW': '格式化' },
    compress: { zh: '压缩', en: 'Compress', 'zh-TW': '壓縮' },
    encrypt: { zh: '加密', en: 'Encrypt', 'zh-TW': '加密' },
    decrypt: { zh: '解密', en: 'Decrypt', 'zh-TW': '解密' },
    encode: { zh: '编码', en: 'Encode', 'zh-TW': '編碼' },
    decode: { zh: '解码', en: 'Decode', 'zh-TW': '解碼' },
    convert: { zh: '转换', en: 'Convert', 'zh-TW': '轉換' },
    generate: { zh: '生成', en: 'Generate', 'zh-TW': '生成' },
    start: { zh: '开始', en: 'Start', 'zh-TW': '開始' },
    pause: { zh: '暂停', en: 'Pause', 'zh-TW': '暫停' },
    resume: { zh: '继续', en: 'Resume', 'zh-TW': '繼續' },
    retry: { zh: '重试', en: 'Retry', 'zh-TW': '重試' },
    history: { zh: '历史记录', en: 'History', 'zh-TW': '歷史記錄' },
    leaderboard: { zh: '排行榜', en: 'Leaderboard', 'zh-TW': '排行榜' },
    comment: { zh: '评论区', en: 'Comments', 'zh-TW': '評論區' },
    inputPlaceholder: { zh: '请输入内容...', en: 'Please enter content...', 'zh-TW': '請輸入內容...' },
    outputPlaceholder: { zh: '处理结果将在此显示...', en: 'Results will be shown here...', 'zh-TW': '處理結果將在此顯示...' },
    noData: { zh: '暂无数据', en: 'No data', 'zh-TW': '暫無資料' },
    loading: { zh: '加载中...', en: 'Loading...', 'zh-TW': '載入中...' },
    success: { zh: '操作成功', en: 'Success', 'zh-TW': '操作成功' },
    error: { zh: '操作失败', en: 'Failed', 'zh-TW': '操作失敗' },
    
    // 弹窗与组件
    commentCount: { zh: '条评论', en: ' Comments', 'zh-TW': '則評論' },
    commentPlaceholder: { zh: '写下你的评论或建议 (Ctrl+Enter 发送)...', en: 'Write a comment or suggestion (Ctrl+Enter to send)...', 'zh-TW': '寫下您的評論或建議 (Ctrl+Enter 發送)...' },
    sendComment: { zh: '发表评论', en: 'Post Comment', 'zh-TW': '發布評論' },
    anonymousUser: { zh: '匿名用户', en: 'Anonymous User', 'zh-TW': '匿名用戶' },
    captchaTitle: { zh: '安全验证', en: 'Security Verification', 'zh-TW': '安全驗證' },
    captchaHint: { zh: '拖动滑块完成拼图验证', en: 'Drag the slider to complete the puzzle', 'zh-TW': '拖曳滑塊完成拼圖驗證' },
    captchaSuccess: { zh: '验证通过！', en: 'Verified!', 'zh-TW': '驗證通過！' },
    captchaFail: { zh: '验证失败，请重试', en: 'Verification failed, please try again', 'zh-TW': '驗證失敗，請重試' },
    phbTitle: { zh: '用时排行榜', en: 'Leaderboard', 'zh-TW': '排行榜' },
    historyTitle: { zh: '历史记录', en: 'History Records', 'zh-TW': '歷史記錄' },
    clearHistory: { zh: '清空历史', en: 'Clear History', 'zh-TW': '清空歷史' },
    noHistory: { zh: '暂无历史记录', en: 'No history records', 'zh-TW': '暫無歷史記錄' },
    deleteConfirm: { zh: '确定要删除此条记录吗？', en: 'Are you sure you want to delete this record?', 'zh-TW': '確定要刪除此條記錄嗎？' },

    // 页面与页脚
    disclaimer: { zh: '免责声明：本站所有在线工具均在浏览器本地运算，保护您的数据隐私安全。', en: 'Disclaimer: All online tools process data locally in your browser to safeguard your data privacy.', 'zh-TW': '免責聲明：本站所有線上工具均在瀏覽器本機運算，保護您的資料隱私安全。' },
    friendLinks: { zh: '友情链接', en: 'Friendly Links', 'zh-TW': '友情連結' },
    slogan: { zh: '好用的在线工具集，提高您的工作与学习效率', en: 'Online Utilities & Productivity Hub for Work and Study', 'zh-TW': '好用的線上工具集，提高您的工作與學習效率' },
    copyright: { zh: '版权所有 © 在线工具集', en: 'Copyright © Online Tools Hub', 'zh-TW': '版權所有 © 線上工具集' }
  };

  // 3. 语言包元数据
  var LANG_CONFIG = [
    { code: 'zh', name: '简体中文', short: '中文', label: '简体中文', icon: '🇨🇳' },
    { code: 'en', name: 'English', short: 'EN', label: 'English', icon: '🇺🇸' },
    { code: 'zh-TW', name: '繁體中文', short: '繁體', label: '繁體中文', icon: '🇭🇰' }
  ];

  var GLOBE_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>';
  var CHEVRON_SVG = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lang-chevron"><polyline points="6 9 12 15 18 9"/></svg>';

  // 4. 获取当前语言
  function normalizeLang(lang) {
    if (!lang) return 'zh';
    lang = String(lang).toLowerCase().trim();
    if (lang === 'en' || lang.indexOf('en-') === 0) return 'en';
    if (lang === 'zh-tw' || lang === 'zh-hk' || lang === 'zh-mo' || lang === 'zhtw' || lang === 'tw' || lang === 'hk') return 'zh-TW';
    if (lang === 'zh' || lang === 'zh-cn' || lang === 'zhcn' || lang.indexOf('zh') === 0) return 'zh';
    return 'zh';
  }

  function detectLang() {
    try {
      var searchParams = new URLSearchParams(window.location.search);
      var queryLang = searchParams.get('lang');
      if (queryLang) return normalizeLang(queryLang);
    } catch (e) {}

    try {
      var saved = localStorage.getItem('6767_lang') || localStorage.getItem('lang');
      if (saved) return normalizeLang(saved);
    } catch (e) {}

    try {
      var m = document.cookie.match(/(?:^|;s*)(?:6767_lang|lang)=([^;]+)/);
      if (m && m[1]) return normalizeLang(decodeURIComponent(m[1]));
    } catch (e) {}

    try {
      var navLang = navigator.language || navigator.userLanguage;
      if (navLang) {
        var n = normalizeLang(navLang);
        if (n === 'zh-TW' || n === 'en') return n;
      }
    } catch (e) {}

    return 'zh';
  }

  var currentLang = detectLang();

  // 5. 语言切换与持久化
  function setLang(newLang, autoReload) {
    newLang = normalizeLang(newLang);
    currentLang = newLang;

    try {
      localStorage.setItem('6767_lang', newLang);
      localStorage.setItem('lang', newLang);
      document.cookie = '6767_lang=' + encodeURIComponent(newLang) + '; path=/; max-age=31536000; SameSite=Lax';
      document.cookie = 'lang=' + encodeURIComponent(newLang) + '; path=/; max-age=31536000; SameSite=Lax';
    } catch (e) {}

    try {
      document.documentElement.lang = newLang === 'zh-TW' ? 'zh-TW' : (newLang === 'en' ? 'en' : 'zh-CN');
    } catch (e) {}

    syncElementPlusLocale(newLang);

    if (global.toolData && Array.isArray(global.toolData)) {
      translateRawToolData(global.toolData, newLang);
    }

    localizeDom(document, newLang);
    updateSwitcherState(newLang);

    try {
      window.dispatchEvent(new CustomEvent('langchange', { detail: { lang: newLang } }));
    } catch (e) {}

    if (autoReload) {
      window.location.reload();
    }
  }

  function getLang() {
    return currentLang;
  }

  // 6. Element-Plus Locale 同步
  function syncElementPlusLocale(lang) {
    lang = lang || currentLang;
    try {
      if (global.ElementPlus) {
        if (lang === 'en' && global.ElementPlusLocaleEn) {
          global.ElementPlusLocale = global.ElementPlusLocaleEn;
        } else if (lang === 'zh-TW' && global.ElementPlusLocaleZhTw) {
          global.ElementPlusLocale = global.ElementPlusLocaleZhTw;
        } else if (global.ElementPlusLocaleZhCn) {
          global.ElementPlusLocale = global.ElementPlusLocaleZhCn;
        }
      }
    } catch (e) {}
  }

  // 7. 翻译词条获取函数 t(key, fallback, lang)
  function t(key, fallback, lang) {
    lang = lang || currentLang;
    if (!key) return fallback || '';
    
    if (UI_DICT[key]) {
      return UI_DICT[key][lang] || UI_DICT[key].zh || fallback || key;
    }

    if (I18N_DATA.categories && I18N_DATA.categories[key]) {
      return I18N_DATA.categories[key][lang] || I18N_DATA.categories[key].zh || fallback || key;
    }

    if (I18N_DATA.subcategories && I18N_DATA.subcategories[key]) {
      return I18N_DATA.subcategories[key][lang] || I18N_DATA.subcategories[key].zh || fallback || key;
    }

    if (I18N_DATA.tools && I18N_DATA.tools[key]) {
      var item = I18N_DATA.tools[key];
      if (typeof item.name === 'object') {
        return item.name[lang] || item.name.zh || fallback || key;
      }
    }

    return fallback !== undefined ? fallback : key;
  }

  // 8. 获取分类翻译
  function getCategoryName(categoryKey, lang) {
    lang = lang || currentLang;
    if (I18N_DATA.categories && I18N_DATA.categories[categoryKey]) {
      return I18N_DATA.categories[categoryKey][lang] || I18N_DATA.categories[categoryKey].zh || categoryKey;
    }
    for (var k in I18N_DATA.categories) {
      var c = I18N_DATA.categories[k];
      if (c.zh === categoryKey || c.en === categoryKey || c['zh-TW'] === categoryKey) {
        return c[lang] || c.zh || categoryKey;
      }
    }
    return categoryKey;
  }

  // 9. 获取子分类翻译
  function getSubcategoryName(subcatKey, lang) {
    lang = lang || currentLang;
    if (I18N_DATA.subcategories && I18N_DATA.subcategories[subcatKey]) {
      return I18N_DATA.subcategories[subcatKey][lang] || I18N_DATA.subcategories[subcatKey].zh || subcatKey;
    }
    for (var sk in I18N_DATA.subcategories) {
      var s = I18N_DATA.subcategories[sk];
      if (s.zh === subcatKey || s.en === subcatKey || s['zh-TW'] === subcatKey) {
        return s[lang] || s.zh || subcatKey;
      }
    }
    return subcatKey;
  }

  // 10. 获取工具名称与描述
  function getToolName(code, fallback, lang) {
    lang = lang || currentLang;
    if (I18N_DATA.tools && I18N_DATA.tools[code] && I18N_DATA.tools[code].name) {
      return I18N_DATA.tools[code].name[lang] || I18N_DATA.tools[code].name.zh || fallback || code;
    }
    return fallback || code;
  }

  function getToolDesc(code, fallback, lang) {
    lang = lang || currentLang;
    if (I18N_DATA.tools && I18N_DATA.tools[code] && I18N_DATA.tools[code].desc) {
      return I18N_DATA.tools[code].desc[lang] || I18N_DATA.tools[code].desc.zh || fallback || '';
    }
    return fallback || '';
  }

  // 11. 批量翻译工具数据数组
  function translateRawToolData(data, lang) {
    lang = lang || currentLang;
    if (!Array.isArray(data)) return data;
    for (var i = 0; i < data.length; i++) {
      var cat = data[i];
      if (cat.key && I18N_DATA.categories[cat.key]) {
        cat.desc = I18N_DATA.categories[cat.key][lang] || cat.desc;
      }
      if (cat.toolList) {
        for (var j = 0; j < cat.toolList.length; j++) {
          var tObj = cat.toolList[j];
          var code = tObj.toolCode || tObj.url || '';
          if (code && I18N_DATA.tools[code]) {
            tObj.toolName = (I18N_DATA.tools[code].name && I18N_DATA.tools[code].name[lang]) || tObj.toolName;
            tObj.desc = (I18N_DATA.tools[code].desc && I18N_DATA.tools[code].desc[lang]) || tObj.desc;
          }
        }
      }
      if (cat.children) {
        for (var k = 0; k < cat.children.length; k++) {
          var sub = cat.children[k];
          if (sub.key && I18N_DATA.subcategories[sub.key]) {
            sub.desc = I18N_DATA.subcategories[sub.key][lang] || sub.desc;
          }
          if (sub.toolList) {
            for (var l = 0; l < sub.toolList.length; l++) {
              var stObj = sub.toolList[l];
              var scode = stObj.toolCode || stObj.url || '';
              if (scode && I18N_DATA.tools[scode]) {
                stObj.toolName = (I18N_DATA.tools[scode].name && I18N_DATA.tools[scode].name[lang]) || stObj.toolName;
                stObj.desc = (I18N_DATA.tools[scode].desc && I18N_DATA.tools[scode].desc[lang]) || stObj.desc;
              }
            }
          }
        }
      }
    }
    return data;
  }

  function translateToolData(list, lang) {
    lang = lang || currentLang;
    if (!Array.isArray(list)) return list;
    return translateRawToolData(JSON.parse(JSON.stringify(list)), lang);
  }

  // 12. 静态与动态 DOM 本地化扫描
  function localizeDom(root, lang) {
    root = root || document;
    lang = lang || currentLang;

    var i18nElements = root.querySelectorAll('[data-i18n]');
    for (var i = 0; i < i18nElements.length; i++) {
      var el = i18nElements[i];
      var key = el.getAttribute('data-i18n');
      var val = t(key, null, lang);
      if (val) el.textContent = val;
    }

    var phElements = root.querySelectorAll('[data-i18n-placeholder]');
    for (var j = 0; j < phElements.length; j++) {
      var phEl = phElements[j];
      var phKey = phEl.getAttribute('data-i18n-placeholder');
      var phVal = t(phKey, null, lang);
      if (phVal) phEl.setAttribute('placeholder', phVal);
    }

    var homeSearch = root.querySelector('#homeSearchInput, .home-search-input');
    if (homeSearch) {
      homeSearch.setAttribute('placeholder', t('searchPlaceholder', null, lang));
    }
    var homeSearchBtn = root.querySelector('#homeSearchBtn, .search-btn');
    if (homeSearchBtn && !homeSearchBtn.querySelector('svg')) {
      homeSearchBtn.textContent = t('searchBtn', null, lang);
    }
    var catSearchInput = root.querySelector('.cat-search-input');
    if (catSearchInput) {
      catSearchInput.setAttribute('placeholder', t('searchCatPlaceholder', null, lang));
    }

    var topbarHome = root.querySelector('.tool-topbar-home, a[href="./"].tool-topbar-home, a[href="index.html"].tool-topbar-home');
    if (topbarHome) {
      topbarHome.textContent = t('backToHome', '← 首页', lang);
    }
    var topbarLogoText = root.querySelector('.tool-topbar-logo span');
    if (topbarLogoText) {
      topbarLogoText.textContent = t('heroTitle', '在线工具集', lang);
    }

    var noticeItems = root.querySelectorAll('.lead-notice-item');
    for (var ni = 0; ni < noticeItems.length; ni++) {
      noticeItems[ni].textContent = t('noticeMarquee', null, lang);
    }
    var noticeCta = root.querySelector('.lead-notice-cta');
    if (noticeCta) {
      noticeCta.textContent = t('noticeCta', '浏览工具', lang);
    }

    var pagePath = window.location.pathname;
    var pageMatch = pagePath.match(/([^/]+)(?:.html)?$/);
    var rawRoute = pageMatch ? pageMatch[1].replace('.html', '') : '';
    if (!rawRoute || rawRoute === 'index' || rawRoute === '') rawRoute = 'index';

    // 系统功能页面排除列表（不应作为单一工具详情页更新头部或篡改卡片）
    var isSpecialPage = /^(index|Search|search|Feedback|feedback|Account|account|signin|404)$/i.test(rawRoute);
    var isCategoryPage = I18N_DATA.categories && Boolean(I18N_DATA.categories[rawRoute]);

    if (!isSpecialPage && !isCategoryPage && I18N_DATA.tools && I18N_DATA.tools[rawRoute]) {
      var toolInfo = I18N_DATA.tools[rawRoute];
      var pageToolName = (toolInfo.name && toolInfo.name[lang]) || toolInfo.name.zh;
      var pageToolDesc = (toolInfo.desc && toolInfo.desc[lang]) || toolInfo.desc.zh;

      if (pageToolName) {
        var siteSuffix = lang === 'en' ? 'Online Tools Hub' : (lang === 'zh-TW' ? '線上工具集' : '在线工具集');
        document.title = pageToolName + ' - ' + siteSuffix;
      }

      if (pageToolDesc) {
        var metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', pageToolDesc);
      }

      var topbarName = root.querySelector('.tool-topbar-name, .tool-topbar-title');
      if (topbarName && pageToolName) {
        topbarName.textContent = pageToolName;
      }

      var cardTitle = root.querySelector('.tool-page-header h1, .tool-page-header .tool-title, .tool-head h1, .tool-head .title');
      if (cardTitle && pageToolName && !cardTitle.closest('.tool-card, .search-tool-card, .tool-item, .card-model')) {
        cardTitle.textContent = pageToolName;
      }
      var cardDesc = root.querySelector('.tool-page-header p, .tool-page-header .tool-description, .tool-head p, .tool-head .description');
      if (cardDesc && pageToolDesc && !cardDesc.closest('.tool-card, .search-tool-card, .tool-item, .card-model')) {
        cardDesc.textContent = pageToolDesc;
      }
    } else if (rawRoute !== 'index' && I18N_DATA.categories && I18N_DATA.categories[rawRoute]) {
      var catInfo = I18N_DATA.categories[rawRoute];
      var catName = catInfo[lang] || catInfo.zh;
      var siteSuffix2 = lang === 'en' ? 'Online Tools Hub' : (lang === 'zh-TW' ? '線上工具集' : '在线工具集');
      document.title = catName + ' - ' + siteSuffix2;

      var topbarCatTitle = root.querySelector('.tool-topbar-title');
      if (topbarCatTitle) topbarCatTitle.textContent = catName;

      var heroCatTitle = root.querySelector('.cat-title');
      if (heroCatTitle) heroCatTitle.textContent = catName;
    } else if (/^(Search|search)$/i.test(rawRoute)) {
      var searchTitle = t('searchResults', '搜索', lang);
      var searchSuffix = lang === 'en' ? 'Online Tools Hub' : (lang === 'zh-TW' ? '線上工具集' : '在线工具集');
      document.title = searchTitle + ' - ' + searchSuffix;
      var topbarSearchTitle = root.querySelector('.tool-topbar-title');
      if (topbarSearchTitle) topbarSearchTitle.textContent = searchTitle;
    }

    var navLinks = root.querySelectorAll('.cat-nav-link, .nav-sub a, .toc-link');
    for (var k = 0; k < navLinks.length; k++) {
      var link = navLinks[k];
      var href = link.getAttribute('href') || '';
      var catMatch = href.match(/([^/]+).html/);
      if (catMatch && I18N_DATA.categories[catMatch[1]]) {
        var cName = I18N_DATA.categories[catMatch[1]][lang];
        var countBadge = link.querySelector('.tool-count, .toc-badge');
        var countText = countBadge ? countBadge.textContent : '';
        if (cName) {
          if (countBadge) {
            link.innerHTML = cName + ' <span class="tool-count">' + countText + '</span>';
          } else {
            var icon = link.querySelector('i, svg');
            if (icon) {
              link.textContent = ' ' + cName;
              link.prepend(icon);
            } else {
              link.textContent = cName;
            }
          }
        }
      }
    }

    var buttons = root.querySelectorAll('button, .el-button, .btn');
    var btnWords = {
      '复制': 'copy', '一键复制': 'copy', 'Copy': 'copy', '複製': 'copy',
      '清空': 'clear', 'Clear': 'clear',
      '重置': 'reset', 'Reset': 'reset',
      '计算': 'calculate', 'Calculate': 'calculate', '計算': 'calculate',
      '加密': 'encrypt', 'Encrypt': 'encrypt',
      '解密': 'decrypt', 'Decrypt': 'decrypt',
      '格式化': 'format', 'Format': 'format',
      '压缩': 'compress', 'Compress': 'compress', '壓縮': 'compress',
      '生成': 'generate', 'Generate': 'generate',
      '转换': 'convert', 'Convert': 'convert', '轉換': 'convert',
      '下载': 'download', 'Download': 'download', '下載': 'download',
      '确定': 'confirm', 'Confirm': 'confirm', '確定': 'confirm',
      '取消': 'cancel', 'Cancel': 'cancel',
      '历史记录': 'history', 'History': 'history', '歷史記錄': 'history',
      '排行榜': 'leaderboard', 'Leaderboard': 'leaderboard',
      '发表评论': 'sendComment', 'Post Comment': 'sendComment', '發布評論': 'sendComment'
    };

    for (var b = 0; b < buttons.length; b++) {
      var btn = buttons[b];
      if (btn.children.length === 0 || (btn.children.length === 1 && btn.children[0].tagName === 'SPAN')) {
        var txt = btn.textContent.trim();
        if (btnWords[txt]) {
          var mappedKey = btnWords[txt];
          var translated = t(mappedKey, null, lang);
          if (translated) {
            if (btn.children.length === 1) {
              btn.children[0].textContent = translated;
            } else {
              btn.textContent = translated;
            }
          }
        }
      }
    }

    var toolChips = root.querySelectorAll('.tool-chip');
    for (var tc = 0; tc < toolChips.length; tc++) {
      var chip = toolChips[tc];
      var chref = chip.getAttribute('href') || '';
      var ccode = chref.replace(/^\.\//, '').replace(/\.html$/, '');
      if (ccode && I18N_DATA.tools[ccode]) {
        var spanEl = chip.querySelector('span');
        var locName = (I18N_DATA.tools[ccode].name && I18N_DATA.tools[ccode].name[lang]) || I18N_DATA.tools[ccode].name.zh;
        if (spanEl && locName) {
          spanEl.textContent = locName;
        }
      }
    }

    var secLabels = root.querySelectorAll('.sec-label');
    for (var sl = 0; sl < secLabels.length; sl++) {
      var secEl = secLabels[sl];
      var secParent = secEl.closest('section');
      if (secParent && secParent.id && I18N_DATA.categories[secParent.id]) {
        secEl.textContent = I18N_DATA.categories[secParent.id][lang] || I18N_DATA.categories[secParent.id].zh;
      }
    }
  }

  // 13. 构建与挂载多语言切换 UI 组件
  function updateSwitcherState(lang) {
    lang = lang || currentLang;
    var currentItem = LANG_CONFIG.find(function (item) { return item.code === lang; }) || LANG_CONFIG[0];
    
    var labels = document.querySelectorAll('.lang-toggle-label');
    for (var i = 0; i < labels.length; i++) {
      labels[i].textContent = currentItem.short;
    }

    var menuItems = document.querySelectorAll('.lang-menu-item');
    for (var k = 0; k < menuItems.length; k++) {
      var itemEl = menuItems[k];
      var itemLang = itemEl.getAttribute('data-lang');
      if (itemLang === lang) {
        itemEl.classList.add('is-active');
      } else {
        itemEl.classList.remove('is-active');
      }
    }
  }

  function createSwitcherElement(variant) {
    var wrap = document.createElement('div');
    wrap.className = 'lang-toggle-wrap ' + (variant || '');

    var currentItem = LANG_CONFIG.find(function (item) { return item.code === currentLang; }) || LANG_CONFIG[0];

    wrap.innerHTML = 
      '<button type="button" class="lang-toggle-btn" title="' + t('langSelect', '切换语言', currentLang) + '" aria-label="Language Selector" aria-haspopup="true">' +
        '<span class="lang-toggle-icon">' + GLOBE_SVG + '</span>' +
        '<span class="lang-toggle-label">' + currentItem.short + '</span>' +
        CHEVRON_SVG +
      '</button>' +
      '<div class="lang-dropdown-menu" role="menu">' +
        LANG_CONFIG.map(function (item) {
          var activeClass = item.code === currentLang ? ' is-active' : '';
          return '<button type="button" class="lang-menu-item' + activeClass + '" data-lang="' + item.code + '" role="menuitem">' +
            '<span class="lang-item-content"><span class="lang-flag">' + item.icon + '</span> ' + item.label + '</span>' +
            '<span class="lang-check">✓</span>' +
          '</button>';
        }).join('') +
      '</div>';

    var btn = wrap.querySelector('.lang-toggle-btn');
    var menu = wrap.querySelector('.lang-dropdown-menu');

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var openMenus = document.querySelectorAll('.lang-dropdown-menu.is-open');
      for (var m = 0; m < openMenus.length; m++) {
        if (openMenus[m] !== menu) openMenus[m].classList.remove('is-open');
      }
      menu.classList.toggle('is-open');
    });

    var items = menu.querySelectorAll('.lang-menu-item');
    for (var i = 0; i < items.length; i++) {
      items[i].addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var targetLang = this.getAttribute('data-lang');
        menu.classList.remove('is-open');
        setLang(targetLang, false);
      });
    }

    return wrap;
  }

  function mountLanguageSwitcher() {
    // 1. 如果已有顶栏 .tool-topbar（各类工具页、分类页、搜索页）
    var topbars = document.querySelectorAll('.tool-topbar');
    if (topbars.length > 0) {
      topbars.forEach(function (topbar) {
        if (topbar.querySelector('.lang-toggle-wrap')) return;
        var topbarSwitcher = createSwitcherElement('topbar-lang-toggle');
        var homeLink = topbar.querySelector('.tool-topbar-home');
        var topbarTheme = topbar.querySelector('.topbar-theme-toggle, .theme-toggle-btn');
        if (topbarTheme) {
          topbar.insertBefore(topbarSwitcher, topbarTheme);
        } else if (homeLink) {
          topbar.insertBefore(topbarSwitcher, homeLink);
        } else {
          topbar.appendChild(topbarSwitcher);
        }
      });
      return;
    }

    // 2. 如果没有 .tool-topbar（例如首页 index.html），挂载到 #siteTopActions
    var topActions = document.getElementById('siteTopActions');
    if (!topActions) {
      topActions = document.createElement('div');
      topActions.id = 'siteTopActions';
      topActions.className = 'site-top-actions';
      (document.body || document.documentElement).appendChild(topActions);
    }

    if (!topActions.querySelector('.lang-toggle-wrap')) {
      var homeSwitcher = createSwitcherElement('home-lang-toggle');
      var themeBtn = topActions.querySelector('.theme-toggle-btn');
      var visitsBadge = topActions.querySelector('#visitsBadge, .visits-badge');
      if (themeBtn) {
        topActions.insertBefore(homeSwitcher, themeBtn);
      } else if (visitsBadge) {
        topActions.insertBefore(homeSwitcher, visitsBadge);
      } else {
        topActions.insertBefore(homeSwitcher, topActions.firstChild);
      }
    }
  }

  // 14. 点击全局空白处关闭语言菜单
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.lang-toggle-wrap')) {
      var menus = document.querySelectorAll('.lang-dropdown-menu.is-open');
      for (var i = 0; i < menus.length; i++) {
        menus[i].classList.remove('is-open');
      }
    }
  });

  // 15. 初始化流程
  function init() {
    document.documentElement.lang = currentLang === 'zh-TW' ? 'zh-TW' : (currentLang === 'en' ? 'en' : 'zh-CN');
    syncElementPlusLocale(currentLang);

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        mountLanguageSwitcher();
        localizeDom(document, currentLang);
      });
    } else {
      mountLanguageSwitcher();
      localizeDom(document, currentLang);
    }
  }

  init();

  // 16. 暴露全局 API
  global.__i18n = {
    LANGS: ['zh', 'en', 'zh-TW'],
    LANG_CONFIG: LANG_CONFIG,
    DATA: I18N_DATA,
    UI_DICT: UI_DICT,
    getLang: getLang,
    setLang: setLang,
    t: t,
    getCategoryName: getCategoryName,
    getSubcategoryName: getSubcategoryName,
    getToolName: getToolName,
    getToolDesc: getToolDesc,
    translateToolData: translateToolData,
    localizeDom: localizeDom,
    mountSwitcher: mountLanguageSwitcher,
    syncElementPlusLocale: syncElementPlusLocale
  };

})(typeof window !== 'undefined' ? window : this);
