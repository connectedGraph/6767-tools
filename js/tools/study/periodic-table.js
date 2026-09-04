/**
 * 化学元素周期表 (Periodic Table of Elements)
 * 拓展时间: 2026-08-31
 * Author: Antigravity Agent
 */

const ELEMENTS_DATA = [
  {
    z: 1, symbol: 'H', name: '氢', pinyin: 'qīng', pinyinTone: '第一声 (阴平)', enName: 'Hydrogen', mass: '1.008',
    category: 'reactive-nonmetal', categoryName: '非金属', period: 1, group: 1, block: 's', state: 'gas', stateName: '气态',
    electron: '1s¹', shells: [1], melting: -259.16, boiling: -252.87, density: '0.08988 g/L', electronegativity: 2.20,
    oxidation: '+1, -1', discoverer: '亨利·卡文迪许 (Henry Cavendish)', year: '1766',
    origin: '源自希腊语「hydro」(水) 和「genes」(生成)，意为“水的生成者”。',
    uses: '宇宙中最丰富的元素。用于清洁能源氢能、火箭推进剂、氨肥工业合成、加氢精制及金属冶炼还原剂。'
  },
  {
    z: 2, symbol: 'He', name: '氦', pinyin: 'hài', pinyinTone: '第四声 (去声)', enName: 'Helium', mass: '4.0026',
    category: 'noble-gas', categoryName: '稀有气体', period: 1, group: 18, block: 's', state: 'gas', stateName: '气态',
    electron: '1s²', shells: [2], melting: -272.2, boiling: -268.93, density: '0.1786 g/L', electronegativity: null,
    oxidation: '0', discoverer: '皮埃尔·让森 / 诺曼·洛克耶 (Pierre Janssen / Norman Lockyer)', year: '1868',
    origin: '源自希腊太阳神赫利俄斯「Helios」，最早在太阳光谱中被发现。',
    uses: '极低温超导磁体冷却剂(如MRI核磁共振)、飞艇与高空气球安全填充气体、深海潜水呼吸混合气、半导体保护气。'
  },
  {
    z: 3, symbol: 'Li', name: '锂', pinyin: 'lǐ', pinyinTone: '第三声 (上声)', enName: 'Lithium', mass: '6.94',
    category: 'alkali-metal', categoryName: '碱金属', period: 2, group: 1, block: 's', state: 'solid', stateName: '固态',
    electron: '[He] 2s¹', shells: [2, 1], melting: 180.54, boiling: 1342, density: '0.534 g/cm³', electronegativity: 0.98,
    oxidation: '+1', discoverer: '约翰·奥古斯特·阿尔费德森 (Johan August Arfwedson)', year: '1817',
    origin: '源自希腊语「lithos」(石头)，因为最初在矿石中发现。',
    uses: '最轻的金属。核心应用于锂离子动力电池(电动车/数码产品)、航空轻质锂铝合金、特种润滑脂及情绪精神类药物(碳酸锂)。'
  },
  {
    z: 4, symbol: 'Be', name: '铍', pinyin: 'pí', pinyinTone: '第二声 (阳平)', enName: 'Beryllium', mass: '9.0122',
    category: 'alkaline-earth', categoryName: '碱土金属', period: 2, group: 2, block: 's', state: 'solid', stateName: '固态',
    electron: '[He] 2s²', shells: [2, 2], melting: 1287, boiling: 2470, density: '1.85 g/cm³', electronegativity: 1.57,
    oxidation: '+2', discoverer: '路易-尼古拉·沃克兰 (Louis-Nicolas Vauquelin)', year: '1798',
    origin: '源自绿柱石「Beryl」，早期因甜味曾被称为 Glucinium。',
    uses: '高强度轻质金属。用于詹姆斯·韦伯空间望远镜主镜片底座、航天结构件、铍铜高弹防爆工具、X射线管透射窗口及核反应堆中子反射层。'
  },
  {
    z: 5, symbol: 'B', name: '硼', pinyin: 'péng', pinyinTone: '第二声 (阳平)', enName: 'Boron', mass: '10.81',
    category: 'metalloid', categoryName: '类金属', period: 2, group: 13, block: 'p', state: 'solid', stateName: '固态',
    electron: '[He] 2s² 2p¹', shells: [2, 3], melting: 2076, boiling: 3927, density: '2.34 g/cm³', electronegativity: 2.04,
    oxidation: '+3', discoverer: '约瑟夫·路易·盖-吕萨克 / 路易·雅克·泰纳尔', year: '1808',
    origin: '源自阿拉伯语「Buraq」或波斯语「Burah」，即硼砂。',
    uses: '耐热硼硅玻璃(如高品质厨具与烧杯)、半导体P型掺杂剂、高硬度碳化硼装甲防弹衣、洗涤漂白剂及农业微量元素肥料。'
  },
  {
    z: 6, symbol: 'C', name: '碳', pinyin: 'tàn', pinyinTone: '第四声 (去声)', enName: 'Carbon', mass: '12.011',
    category: 'reactive-nonmetal', categoryName: '非金属', period: 2, group: 14, block: 'p', state: 'solid', stateName: '固态',
    electron: '[He] 2s² 2p²', shells: [2, 4], melting: 3550, boiling: 4027, density: '2.267 g/cm³ (石墨)', electronegativity: 2.55,
    oxidation: '+4, +2, -4', discoverer: '古代已知 (安托万·拉瓦锡正式确立为元素)', year: '古代 / 1789',
    origin: '源自拉丁语「Carbo」(木炭)。',
    uses: '有机生命的基础基石。存在石墨、金刚石、石墨烯、碳纳米管、富勒烯等同素异形体；广泛用于碳纤维复合材料、电极、钢铁冶炼及药物合成。'
  },
  {
    z: 7, symbol: 'N', name: '氮', pinyin: 'dàn', pinyinTone: '第四声 (去声)', enName: 'Nitrogen', mass: '14.007',
    category: 'reactive-nonmetal', categoryName: '非金属', period: 2, group: 15, block: 'p', state: 'gas', stateName: '气态',
    electron: '[He] 2s² 2p³', shells: [2, 5], melting: -210.00, boiling: -195.79, density: '1.2506 g/L', electronegativity: 3.04,
    oxidation: '+5, +4, +3, +2, +1, -3', discoverer: '丹尼尔·卢瑟福 (Daniel Rutherford)', year: '1772',
    origin: '源自希腊语「nitron」(硝石) 和「genes」(形成)。',
    uses: '占大气体积约78%。用于合成氨工业肥料、液氮超低温冷冻保存、食品药品惰性保护充气包装、炸药制造及半导体环境保护。'
  },
  {
    z: 8, symbol: 'O', name: '氧', pinyin: 'yǎng', pinyinTone: '第三声 (上声)', enName: 'Oxygen', mass: '15.999',
    category: 'reactive-nonmetal', categoryName: '非金属', period: 2, group: 16, block: 'p', state: 'gas', stateName: '气态',
    electron: '[He] 2s² 2p⁴', shells: [2, 6], melting: -218.79, boiling: -182.96, density: '1.429 g/L', electronegativity: 3.44,
    oxidation: '-2, -1', discoverer: '卡尔·威廉·舍勒 / 约瑟夫·普利斯特里', year: '1774',
    origin: '源自希腊语「oxys」(酸) 和「genes」(形成)，原意为“成酸的元素”。',
    uses: '地壳与生物圈含量最高的元素之一。支持呼吸与燃烧；广泛用于医疗急救供氧、高炉炼钢富氧吹炼、火箭液氧推进剂及臭氧消毒。'
  },
  {
    z: 9, symbol: 'F', name: '氟', pinyin: 'fú', pinyinTone: '第二声 (阳平)', enName: 'Fluorine', mass: '18.998',
    category: 'reactive-nonmetal', categoryName: '非金属', period: 2, group: 17, block: 'p', state: 'gas', stateName: '气态',
    electron: '[He] 2s² 2p⁵', shells: [2, 7], melting: -219.67, boiling: -188.11, density: '1.696 g/L', electronegativity: 3.98,
    oxidation: '-1', discoverer: '亨利·莫瓦桑 (Henri Moissan)', year: '1886',
    origin: '源自拉丁语「fluere」(流动)，因其矿物萤石被用作熔剂。',
    uses: '电负性最强、化学性质最活泼的非金属。用于特氟龙不粘涂层(PTFE)、含氟牙膏防蛀、冷媒空调制冷剂、锂电电解液(LiPF6)及半导体刻蚀(NF3)。'
  },
  {
    z: 10, symbol: 'Ne', name: '氖', pinyin: 'nǎi', pinyinTone: '第三声 (上声)', enName: 'Neon', mass: '20.180',
    category: 'noble-gas', categoryName: '稀有气体', period: 2, group: 18, block: 'p', state: 'gas', stateName: '气态',
    electron: '[He] 2s² 2p⁶', shells: [2, 8], melting: -248.59, boiling: -246.05, density: '0.9002 g/L', electronegativity: null,
    oxidation: '0', discoverer: '威廉·拉姆齐 / 莫里斯·特拉弗斯', year: '1898',
    origin: '源自希腊语「neos」(新的)。',
    uses: '放电时发出鲜艳橙红色光芒。广泛用于霓虹广告灯牌、高压验电笔指示灯、氦氖激光器、深海呼吸混合气及低温制冷工质。'
  },
  {
    z: 11, symbol: 'Na', name: '钠', pinyin: 'nà', pinyinTone: '第四声 (去声)', enName: 'Sodium', mass: '22.990',
    category: 'alkali-metal', categoryName: '碱金属', period: 3, group: 1, block: 's', state: 'solid', stateName: '固态',
    electron: '[Ne] 3s¹', shells: [2, 8, 1], melting: 97.79, boiling: 883, density: '0.968 g/cm³', electronegativity: 0.93,
    oxidation: '+1', discoverer: '汉弗里·戴维 (Humphry Davy)', year: '1807',
    origin: '源自新拉丁语「natrium」(苏打矿)，符号源于德语 Natrium。',
    uses: '柔软且极活泼的金属。食用盐(氯化钠)主要成分；人体神经信号传导必需电解质；用于钠硫/钠离子新型电池、高压黄光钠灯及快中子核反应堆液态冷却剂。'
  },
  {
    z: 12, symbol: 'Mg', name: '镁', pinyin: 'měi', pinyinTone: '第三声 (上声)', enName: 'Magnesium', mass: '24.305',
    category: 'alkaline-earth', categoryName: '碱土金属', period: 3, group: 2, block: 's', state: 'solid', stateName: '固态',
    electron: '[Ne] 3s²', shells: [2, 8, 2], melting: 650, boiling: 1090, density: '1.738 g/cm³', electronegativity: 1.31,
    oxidation: '+2', discoverer: '约瑟夫·布莱克 (Joseph Black)', year: '1755',
    origin: '源自希腊色萨利的一个地区「Magnesia」(马格尼西亚)。',
    uses: '极轻结构金属。用于航空航天及笔记本镁铝合金外壳、叶绿素核心金属离子、信号弹与闪光粉、抗酸胃药及钛/锆冶炼还原剂。'
  },
  {
    z: 13, symbol: 'Al', name: '铝', pinyin: 'lǚ', pinyinTone: '第三声 (上声)', enName: 'Aluminium', mass: '26.982',
    category: 'post-transition', categoryName: '贫金属', period: 3, group: 13, block: 'p', state: 'solid', stateName: '固态',
    electron: '[Ne] 3s² 3p¹', shells: [2, 8, 3], melting: 660.32, boiling: 2470, density: '2.70 g/cm³', electronegativity: 1.61,
    oxidation: '+3', discoverer: '汉斯·克里斯蒂安·奥斯特 (Hans Christian Ørsted)', year: '1825',
    origin: '源自拉丁语「alumen」(明矾)。',
    uses: '地壳中含量最丰富的金属元素。质量轻且导电导热好，广泛用于飞机汽车结构件、高压电缆、建筑门窗幕墙、易拉罐及食品包装铝箔。'
  },
  {
    z: 14, symbol: 'Si', name: '硅', pinyin: 'guī', pinyinTone: '第一声 (阴平)', enName: 'Silicon', mass: '28.085',
    category: 'metalloid', categoryName: '类金属', period: 3, group: 14, block: 'p', state: 'solid', stateName: '固态',
    electron: '[Ne] 3s² 3p²', shells: [2, 8, 4], melting: 1414, boiling: 3265, density: '2.329 g/cm³', electronegativity: 1.90,
    oxidation: '+4, -4', discoverer: '永斯·雅各布·贝尔塞柳斯 (Jöns Jacob Berzelius)', year: '1824',
    origin: '源自拉丁语「silex」(燧石/硅石)。',
    uses: '现代半导体与信息时代的基石。用于微处理器CPU芯片、光伏太阳能电池板、有机硅密封胶/硅胶制品、水泥陶瓷玻璃及特种硅钢。'
  },
  {
    z: 15, symbol: 'P', name: '磷', pinyin: 'lín', pinyinTone: '第二声 (阳平)', enName: 'Phosphorus', mass: '30.974',
    category: 'reactive-nonmetal', categoryName: '非金属', period: 3, group: 15, block: 'p', state: 'solid', stateName: '固态',
    electron: '[Ne] 3s² 3p³', shells: [2, 8, 5], melting: 44.15, boiling: 280.5, density: '1.823 g/cm³ (白磷)', electronegativity: 2.19,
    oxidation: '+5, +3, -3', discoverer: '亨尼格·布兰德 (Hennig Brand)', year: '1669',
    origin: '源自希腊语「phosphoros」(发光物/启明星)，白磷在空气中会缓慢氧化发光。',
    uses: '生命DNA骨架与ATP能量载体核心。工业用于磷酸盐化肥、安全火柴(红磷)、磷酸铁锂动力电池(LFP)、阻燃剂及农药制造。'
  },
  {
    z: 16, symbol: 'S', name: '硫', pinyin: 'liú', pinyinTone: '第二声 (阳平)', enName: 'Sulfur', mass: '32.06',
    category: 'reactive-nonmetal', categoryName: '非金属', period: 3, group: 16, block: 'p', state: 'solid', stateName: '固态',
    electron: '[Ne] 3s² 3p⁴', shells: [2, 8, 6], melting: 115.21, boiling: 444.72, density: '2.07 g/cm³', electronegativity: 2.58,
    oxidation: '+6, +4, +2, -2', discoverer: '古代已知 (安托万·拉瓦锡正式列入元素表)', year: '古代 / 1777',
    origin: '源自梵语「sulvere」或拉丁语「sulphur」(硫磺)。',
    uses: '黄色结晶固体。用于工业硫酸制造(工业之母)、橡胶硫化强化、黑火药配方、含硫氨基酸蛋白质结构维持、皮肤药膏及杀菌剂。'
  },
  {
    z: 17, symbol: 'Cl', name: '氯', pinyin: 'lǜ', pinyinTone: '第四声 (去声)', enName: 'Chlorine', mass: '35.45',
    category: 'reactive-nonmetal', categoryName: '非金属', period: 3, group: 17, block: 'p', state: 'gas', stateName: '气态',
    electron: '[Ne] 3s² 3p⁵', shells: [2, 8, 7], melting: -101.5, boiling: -34.04, density: '3.214 g/L', electronegativity: 3.16,
    oxidation: '+7, +5, +3, +1, -1', discoverer: '卡尔·威廉·舍勒 (Carl Wilhelm Scheele)', year: '1774',
    origin: '源自希腊语「chloros」(黄绿色)。',
    uses: '黄绿色有刺激性气体。广泛用于自来水与游泳池消毒杀菌、聚氯乙烯塑料(PVC)、次氯酸钠84消毒液、农药医药中间体及盐酸生产。'
  },
  {
    z: 18, symbol: 'Ar', name: '氩', pinyin: 'yà', pinyinTone: '第四声 (去声)', enName: 'Argon', mass: '39.95',
    category: 'noble-gas', categoryName: '稀有气体', period: 3, group: 18, block: 'p', state: 'gas', stateName: '气态',
    electron: '[Ne] 3s² 3p⁶', shells: [2, 8, 8], melting: -189.34, boiling: -185.85, density: '1.784 g/L', electronegativity: null,
    oxidation: '0', discoverer: '瑞利勋爵 / 威廉·拉姆齐 (Lord Rayleigh / William Ramsay)', year: '1894',
    origin: '源自希腊语「argos」(懒惰/不活泼)，因其极不活泼的化学惰性。',
    uses: '大气中第三大组分(~0.93%)。用于氩弧焊金属焊接保护气、白炽灯泡/中空隔音玻璃填充气、半导体单晶硅拉晶保护及蓝光激光。'
  },
  {
    z: 19, symbol: 'K', name: '钾', pinyin: 'jiǎ', pinyinTone: '第三声 (上声)', enName: 'Potassium', mass: '39.098',
    category: 'alkali-metal', categoryName: '碱金属', period: 4, group: 1, block: 's', state: 'solid', stateName: '固态',
    electron: '[Ar] 4s¹', shells: [2, 8, 8, 1], melting: 63.38, boiling: 759, density: '0.862 g/cm³', electronegativity: 0.82,
    oxidation: '+1', discoverer: '汉弗里·戴维 (Humphry Davy)', year: '1807',
    origin: '源自英语「potash」(草木灰碱)，符号 K 源于德语 Kalium。',
    uses: '极其活泼的轻金属。农业三要素之一钾肥主要成分；维持人体细胞膜电位、心脏跳动及神经传导；超氧化钾(KO2)用作潜艇与航天生氧剂。'
  },
  {
    z: 20, symbol: 'Ca', name: '钙', pinyin: 'gài', pinyinTone: '第四声 (去声)', enName: 'Calcium', mass: '40.078',
    category: 'alkaline-earth', categoryName: '碱土金属', period: 4, group: 2, block: 's', state: 'solid', stateName: '固态',
    electron: '[Ar] 4s²', shells: [2, 8, 8, 2], melting: 842, boiling: 1484, density: '1.54 g/cm³', electronegativity: 1.00,
    oxidation: '+2', discoverer: '汉弗里·戴维 (Humphry Davy)', year: '1808',
    origin: '源自拉丁语「calx」(石灰)。',
    uses: '人体骨骼与牙齿的主要硬质成分(羟基磷灰石)；水泥、混凝土、石膏、石灰石建筑基石；特种合金脱氧脱硫净化剂。'
  },
  {
    z: 21, symbol: 'Sc', name: '钪', pinyin: 'kàng', pinyinTone: '第四声 (去声)', enName: 'Scandium', mass: '44.956',
    category: 'transition-metal', categoryName: '过渡金属', period: 4, group: 3, block: 'd', state: 'solid', stateName: '固态',
    electron: '[Ar] 3d¹ 4s²', shells: [2, 8, 9, 2], melting: 1541, boiling: 2836, density: '2.985 g/cm³', electronegativity: 1.36,
    oxidation: '+3', discoverer: '拉尔斯·弗雷德里克·尼尔森 (Lars Fredrik Nilson)', year: '1879',
    origin: '源自北欧斯堪的纳维亚半岛「Scandinavia」。',
    uses: '稀土轻金属。用于高强度铝钪合金(战斗机蒙皮/高端自行车架/棒球棒)、金属卤化物高显色度高压钠灯及固体氧化物燃料电池(SOFC)。'
  },
  {
    z: 22, symbol: 'Ti', name: '钛', pinyin: 'tài', pinyinTone: '第四声 (去声)', enName: 'Titanium', mass: '47.867',
    category: 'transition-metal', categoryName: '过渡金属', period: 4, group: 4, block: 'd', state: 'solid', stateName: '固态',
    electron: '[Ar] 3d² 4s²', shells: [2, 8, 10, 2], melting: 1668, boiling: 3287, density: '4.506 g/cm³', electronegativity: 1.54,
    oxidation: '+4, +3, +2', discoverer: '威廉·格雷戈尔 (William Gregor)', year: '1791',
    origin: '源自希腊神话中的泰坦神族「Titans」，象征超凡坚固。',
    uses: '高强比、极耐腐蚀且具优异生物亲和性。广泛用于航空航天喷气发动机机身、医疗人工关节骨骼支架、深海潜水器及二氧化钛(钛白粉)顶级白色颜料。'
  },
  {
    z: 23, symbol: 'V', name: '钒', pinyin: 'fán', pinyinTone: '第二声 (阳平)', enName: 'Vanadium', mass: '50.942',
    category: 'transition-metal', categoryName: '过渡金属', period: 4, group: 5, block: 'd', state: 'solid', stateName: '固态',
    electron: '[Ar] 3d³ 4s²', shells: [2, 8, 11, 2], melting: 1910, boiling: 3407, density: '6.11 g/cm³', electronegativity: 1.63,
    oxidation: '+5, +4, +3, +2', discoverer: '安德烈斯·曼努埃尔·德尔里奥 / 尼尔斯·加布里埃尔·塞夫斯特伦', year: '1801 / 1830',
    origin: '源自北欧美丽女神凡娜迪丝「Vanadis」，因其化合物溶液色彩斑斓。',
    uses: '“现代工业味精”。钒钢合金用于高强结构钢、铁路重轨、航空弹簧与扳手工具；全钒液流电池是大型长时储能电站前沿方案；五氧化二钒用作化工催化剂。'
  },
  {
    z: 24, symbol: 'Cr', name: '铬', pinyin: 'gè', pinyinTone: '第四声 (去声)', enName: 'Chromium', mass: '51.996',
    category: 'transition-metal', categoryName: '过渡金属', period: 4, group: 6, block: 'd', state: 'solid', stateName: '固态',
    electron: '[Ar] 3d⁵ 4s¹', shells: [2, 8, 13, 1], melting: 1907, boiling: 2671, density: '7.19 g/cm³', electronegativity: 1.66,
    oxidation: '+6, +3, +2', discoverer: '路易-尼古拉·沃克兰 (Louis-Nicolas Vauquelin)', year: '1797',
    origin: '源自希腊语「chroma」(颜色)，因为其化合物颜色极其丰富多彩。',
    uses: '硬度最高的金属。不锈钢核心合金成分(防锈钝化膜)、汽车表面硬质防锈电镀铬层、红宝石致色离子(Cr³⁺)及皮革鞣制。'
  },
  {
    z: 25, symbol: 'Mn', name: '锰', pinyin: 'měng', pinyinTone: '第三声 (上声)', enName: 'Manganese', mass: '54.938',
    category: 'transition-metal', categoryName: '过渡金属', period: 4, group: 7, block: 'd', state: 'solid', stateName: '固态',
    electron: '[Ar] 3d⁵ 4s²', shells: [2, 8, 13, 2], melting: 1246, boiling: 2061, density: '7.21 g/cm³', electronegativity: 1.55,
    oxidation: '+7, +4, +3, +2', discoverer: '约翰·戈特利布·甘恩 (Johan Gottlieb Gahn)', year: '1774',
    origin: '源自意大利语「magnesia」，原指软锰矿。',
    uses: '钢铁工业脱氧脱硫剂及耐磨高锰钢(铁轨/碎石机机齿)；干电池二氧化锰正极；三元锂电池(NCM/LMFP)重要原料及植物光合作用水裂解催化核心。'
  },
  {
    z: 26, symbol: 'Fe', name: '铁', pinyin: 'tiě', pinyinTone: '第三声 (上声)', enName: 'Iron', mass: '55.845',
    category: 'transition-metal', categoryName: '过渡金属', period: 4, group: 8, block: 'd', state: 'solid', stateName: '固态',
    electron: '[Ar] 3d⁶ 4s²', shells: [2, 8, 14, 2], melting: 1538, boiling: 2862, density: '7.874 g/cm³', electronegativity: 1.83,
    oxidation: '+3, +2', discoverer: '古代已知 (人类文明支柱金属)', year: '古代 (约公元前4000年)',
    origin: '源自古英语「iren」，符号 Fe 源于拉丁语 Ferrum。',
    uses: '全球年产量与使用量最大的金属(占95%以上)。现代建筑、桥梁、机械工具基础；人体血红蛋白输氧核心中心原子；强磁性材料制造。'
  },
  {
    z: 27, symbol: 'Co', name: '钴', pinyin: 'gǔ', pinyinTone: '第三声 (上声)', enName: 'Cobalt', mass: '58.933',
    category: 'transition-metal', categoryName: '过渡金属', period: 4, group: 9, block: 'd', state: 'solid', stateName: '固态',
    electron: '[Ar] 3d⁷ 4s²', shells: [2, 8, 15, 2], melting: 1495, boiling: 2927, density: '8.90 g/cm³', electronegativity: 1.88,
    oxidation: '+3, +2', discoverer: '乔治·勃兰特 (Georg Brandt)', year: '1735',
    origin: '源自德语地精「kobold」，早期矿工认为被恶魔调换了矿石。',
    uses: '三元锂电池高能三元正极核心材料；耐高温航空航天超合金；铝镍钴高强永磁体；钴蓝陶瓷顶级颜料及维生素B12核心微量元素。'
  },
  {
    z: 28, symbol: 'Ni', name: '镍', pinyin: 'niè', pinyinTone: '第四声 (去声)', enName: 'Nickel', mass: '58.693',
    category: 'transition-metal', categoryName: '过渡金属', period: 4, group: 10, block: 'd', state: 'solid', stateName: '固态',
    electron: '[Ar] 3d⁸ 4s²', shells: [2, 8, 16, 2], melting: 1455, boiling: 2913, density: '8.908 g/cm³', electronegativity: 1.91,
    oxidation: '+2, +3', discoverer: '阿克塞尔·弗雷德里克·克朗斯泰特', year: '1751',
    origin: '源自德语「Kupfernickel」(老尼克铜/假铜矿)。',
    uses: '银白色耐腐蚀金属。主要用于奥氏体不锈钢(如304/316)、动力电池高镍正极(NCA/NCM811)、硬币铸造、电镀保护层及形状记忆合金(镍钛合金)。'
  },
  {
    z: 29, symbol: 'Cu', name: '铜', pinyin: 'tóng', pinyinTone: '第二声 (阳平)', enName: 'Copper', mass: '63.546',
    category: 'transition-metal', categoryName: '过渡金属', period: 4, group: 11, block: 'd', state: 'solid', stateName: '固态',
    electron: '[Ar] 3d¹⁰ 4s¹', shells: [2, 8, 18, 1], melting: 1084.62, boiling: 2562, density: '8.96 g/cm³', electronegativity: 1.90,
    oxidation: '+2, +1', discoverer: '古代已知 (人类最早广泛使用金属之一)', year: '古代 (约公元前8000年)',
    origin: '源自拉丁语「cuprum」(塞浦路斯岛之金)。',
    uses: '仅次于银的优异电导率与热导率。用于电线电缆、电机绕组、集成电路铜互连线、青铜与黄铜合金器皿、散热铜管及杀菌抗菌材料。'
  },
  {
    z: 30, symbol: 'Zn', name: '锌', pinyin: 'xīn', pinyinTone: '第一声 (阴平)', enName: 'Zinc', mass: '65.38',
    category: 'transition-metal', categoryName: '过渡金属', period: 4, group: 12, block: 'd', state: 'solid', stateName: '固态',
    electron: '[Ar] 3d¹⁰ 4s²', shells: [2, 8, 18, 2], melting: 419.53, boiling: 907, density: '7.14 g/cm³', electronegativity: 1.65,
    oxidation: '+2', discoverer: '古代印度/中国已知 (安德烈亚斯·马格拉夫正式命名)', year: '古代 / 1746',
    origin: '源自德语「Zinke」(尖齿/尖叉)。',
    uses: '钢铁表面热镀锌防腐(消耗量50%以上)；制造黄铜合金；压铸汽车零部件；氧化锌防晒霜与橡胶促进剂；人体免疫与酶催化“生命之花”。'
  },
  {
    z: 31, symbol: 'Ga', name: '镓', pinyin: 'jiā', pinyinTone: '第一声 (阴平)', enName: 'Gallium', mass: '69.723',
    category: 'post-transition', categoryName: '贫金属', period: 4, group: 13, block: 'p', state: 'solid', stateName: '固态',
    electron: '[Ar] 3d¹⁰ 4s² 4p¹', shells: [2, 8, 18, 3], melting: 29.76, boiling: 2204, density: '5.91 g/cm³', electronegativity: 1.81,
    oxidation: '+3', discoverer: '保罗·埃米尔·勒科克·德布瓦博德兰', year: '1875',
    origin: '源自法国拉丁名「Gallia」(高卢)。门捷列夫曾精准预言其为“类铝”。',
    uses: '熔点接近室温(手中即可熔化成银白液体)。用于第二代/第三代半导体(砷化镓GaAs、氮化镓GaN快充芯片、蓝光LED)、液态金属散热器及高温温度计。'
  },
  {
    z: 32, symbol: 'Ge', name: '锗', pinyin: 'zhě', pinyinTone: '第三声 (上声)', enName: 'Germanium', mass: '72.630',
    category: 'metalloid', categoryName: '类金属', period: 4, group: 14, block: 'p', state: 'solid', stateName: '固态',
    electron: '[Ar] 3d¹⁰ 4s² 4p²', shells: [2, 8, 18, 4], melting: 938.25, boiling: 2833, density: '5.323 g/cm³', electronegativity: 2.01,
    oxidation: '+4, +2', discoverer: '克莱门斯·温克勒 (Clemens Winkler)', year: '1886',
    origin: '源自德国拉丁名「Germania」。门捷列夫曾精准预言其为“类硅”。',
    uses: '制造出世界上第一个晶体管。现代广泛用于红外夜视光学透镜、光纤通信掺杂剂、高效率多结空间太阳能电池及高纯锗γ射线探测器。'
  },
  {
    z: 33, symbol: 'As', name: '砷', pinyin: 'shēn', pinyinTone: '第一声 (阴平)', enName: 'Arsenic', mass: '74.922',
    category: 'metalloid', categoryName: '类金属', period: 4, group: 15, block: 'p', state: 'solid', stateName: '固态',
    electron: '[Ar] 3d¹⁰ 4s² 4p³', shells: [2, 8, 18, 5], melting: 817, boiling: 614, density: '5.776 g/cm³', electronegativity: 2.18,
    oxidation: '+5, +3, -3', discoverer: '阿尔伯特·马格努斯 (Albertus Magnus)', year: '1250',
    origin: '源自希腊语「arsenikon」(雌黄矿石)。',
    uses: '三氧化二砷俗称砒霜(用于治疗急性早幼粒细胞白血病特效药)；半导体工业生产砷化镓(GaAs)射频芯片及发光二极管。'
  },
  {
    z: 34, symbol: 'Se', name: '硒', pinyin: 'xī', pinyinTone: '第一声 (阴平)', enName: 'Selenium', mass: '78.971',
    category: 'reactive-nonmetal', categoryName: '非金属', period: 4, group: 16, block: 'p', state: 'solid', stateName: '固态',
    electron: '[Ar] 3d¹⁰ 4s² 4p⁴', shells: [2, 8, 18, 6], melting: 221, boiling: 685, density: '4.819 g/cm³', electronegativity: 2.55,
    oxidation: '+6, +4, -2', discoverer: '永斯·雅各布·贝尔塞柳斯 (Jöns Jacob Berzelius)', year: '1817',
    origin: '源自希腊月亮女神塞勒涅「Selene」，对应碲(大地)。',
    uses: '优异的光电导性。早期静电复印机硒鼓感光层；玻璃脱色与红宝石色玻璃着色；人体谷胱甘肽过氧化物酶核心抗氧化微量元素及富硒保健品。'
  },
  {
    z: 35, symbol: 'Br', name: '溴', pinyin: 'xiù', pinyinTone: '第四声 (去声)', enName: 'Bromine', mass: '79.904',
    category: 'reactive-nonmetal', categoryName: '非金属', period: 4, group: 17, block: 'p', state: 'liquid', stateName: '液态',
    electron: '[Ar] 3d¹⁰ 4s² 4p⁵', shells: [2, 8, 18, 7], melting: -7.2, boiling: 58.8, density: '3.1028 g/cm³', electronegativity: 2.96,
    oxidation: '+5, +3, +1, -1', discoverer: '安托万·热罗姆·巴拉尔 (Antoine Jérôme Balard)', year: '1826',
    origin: '源自希腊语「bromos」(恶臭)，常温下释放浓烈红褐色刺鼻蒸汽。',
    uses: '常温下唯一的液态非金属单质。用于阻燃剂(BFR)、溴化物医药镇静剂、传统黑白胶卷感光溴化银(AgBr)及深井钻井重泥浆。'
  },
  {
    z: 36, symbol: 'Kr', name: '氪', pinyin: 'kè', pinyinTone: '第四声 (去声)', enName: 'Krypton', mass: '83.798',
    category: 'noble-gas', categoryName: '稀有气体', period: 4, group: 18, block: 'p', state: 'gas', stateName: '气态',
    electron: '[Ar] 3d¹⁰ 4s² 4p⁶', shells: [2, 8, 18, 8], melting: -157.36, boiling: -153.22, density: '3.749 g/L', electronegativity: 3.00,
    oxidation: '+2, 0', discoverer: '威廉·拉姆齐 / 莫里斯·特拉弗斯', year: '1898',
    origin: '源自希腊语「kryptos」(隐藏的)。',
    uses: '放电产生明亮白光。用于机场跑道高穿透力闪光信标灯、高亮度白炽灯、氟化氪(KrF)准分子光刻激光器及中空高效隔热玻璃充气。'
  },
  {
    z: 37, symbol: 'Rb', name: '铷', pinyin: 'rú', pinyinTone: '第二声 (阳平)', enName: 'Rubidium', mass: '85.468',
    category: 'alkali-metal', categoryName: '碱金属', period: 5, group: 1, block: 's', state: 'solid', stateName: '固态',
    electron: '[Kr] 5s¹', shells: [2, 8, 18, 8, 1], melting: 39.31, boiling: 688, density: '1.532 g/cm³', electronegativity: 0.82,
    oxidation: '+1', discoverer: '罗伯特·本生 / 古斯塔夫·基尔霍夫', year: '1861',
    origin: '源自拉丁语「rubidus」(深深红)，因光谱中明亮的深红双线。',
    uses: '高精度小型化铷原子钟(北斗导航卫星与通信基站守时核心)、光电管、玻色-爱因斯坦凝聚(BEC)超冷原子实验及特种玻璃。'
  },
  {
    z: 38, symbol: 'Sr', name: '锶', pinyin: 'sī', pinyinTone: '第一声 (阴平)', enName: 'Strontium', mass: '87.62',
    category: 'alkaline-earth', categoryName: '碱土金属', period: 5, group: 2, block: 's', state: 'solid', stateName: '固态',
    electron: '[Kr] 5s²', shells: [2, 8, 18, 8, 2], melting: 777, boiling: 1382, density: '2.64 g/cm³', electronegativity: 0.95,
    oxidation: '+2', discoverer: '阿代尔·克劳福德 (Adair Crawford)', year: '1790',
    origin: '源自苏格兰村庄斯特朗蒂安「Strontian」。',
    uses: '燃烧时发出极其鲜艳的深红色光芒，用于节日红色烟花与军用照明弹；锶铁氧体永磁铁；锶光钟(下一代超高精度原子钟)及骨质疏松治疗药物(雷奈酸锶)。'
  },
  {
    z: 39, symbol: 'Y', name: '钇', pinyin: 'yǐ', pinyinTone: '第三声 (上声)', enName: 'Yttrium', mass: '88.906',
    category: 'transition-metal', categoryName: '过渡金属', period: 5, group: 3, block: 'd', state: 'solid', stateName: '固态',
    electron: '[Kr] 4d¹ 5s²', shells: [2, 8, 18, 9, 2], melting: 1526, boiling: 3345, density: '4.472 g/cm³', electronegativity: 1.22,
    oxidation: '+3', discoverer: '约翰·加多林 (Johan Gadolin)', year: '1794',
    origin: '源自瑞典斯德哥尔摩附近伊特比村「Ytterby」，该村贡献了4个元素名称。',
    uses: '钇铝石榴石(Nd:YAG)工业/医疗固体激光晶体、钇钡铜氧(YBCO)高温超导体、氧化钇增韧氧化锆陶瓷(防摔陶瓷手机盖板/人工义齿)及CRT红色荧光粉。'
  },
  {
    z: 40, symbol: 'Zr', name: '锆', pinyin: 'gào', pinyinTone: '第四声 (去声)', enName: 'Zirconium', mass: '91.224',
    category: 'transition-metal', categoryName: '过渡金属', period: 5, group: 4, block: 'd', state: 'solid', stateName: '固态',
    electron: '[Kr] 4d² 5s²', shells: [2, 8, 18, 10, 2], melting: 1855, boiling: 4409, density: '6.52 g/cm³', electronegativity: 1.33,
    oxidation: '+4', discoverer: '马丁·海因里希·克拉普罗特', year: '1789',
    origin: '源自波斯语「zargun」(金黄色石)，即锆石。',
    uses: '热中子吸收截面极小且耐腐蚀，为核动力潜艇与核电站核燃料棒锆合金包壳核心材料；人工合成立方氧化锆(仿真钻石)及航天隔热热障涂层。'
  },
  {
    z: 41, symbol: 'Nb', name: '铌', pinyin: 'ní', pinyinTone: '第二声 (阳平)', enName: 'Niobium', mass: '92.906',
    category: 'transition-metal', categoryName: '过渡金属', period: 5, group: 5, block: 'd', state: 'solid', stateName: '固态',
    electron: '[Kr] 4d⁴ 5s¹', shells: [2, 8, 18, 12, 1], melting: 2477, boiling: 4744, density: '8.57 g/cm³', electronegativity: 1.6,
    oxidation: '+5, +3', discoverer: '查尔斯·哈切特 (Charles Hatchett)', year: '1801',
    origin: '源自希腊神话坦塔罗斯之女尼俄伯「Niobe」，与钽(Ta)性质极接近。',
    uses: '微合金化高强度低合金钢(输油输气管线钢/汽车车身轻量化)；铌钛(NbTi)与铌三锡(Nb3Sn)超导磁体(MRI及大型强子对撞机LHC)；火箭发动机喷管。'
  },
  {
    z: 42, symbol: 'Mo', name: '钼', pinyin: 'mù', pinyinTone: '第四声 (去声)', enName: 'Molybdenum', mass: '95.95',
    category: 'transition-metal', categoryName: '过渡金属', period: 5, group: 6, block: 'd', state: 'solid', stateName: '固态',
    electron: '[Kr] 4d⁵ 5s¹', shells: [2, 8, 18, 13, 1], melting: 2623, boiling: 4639, density: '10.28 g/cm³', electronegativity: 2.16,
    oxidation: '+6, +4', discoverer: '卡尔·威廉·舍勒 (Carl Wilhelm Scheele)', year: '1778',
    origin: '源自希腊语「molybdos」(铅)，早期辉钼矿常与方铅矿混淆。',
    uses: '超高熔点难熔金属。钼钢合金用于装甲、炮膛内衬、高温真空炉发热体；二硫化钼(MoS2)工业固体极压润滑剂；生物固氮酶核心催化辅因子。'
  },
  {
    z: 43, symbol: 'Tc', name: '锝', pinyin: 'dé', pinyinTone: '第二声 (阳平)', enName: 'Technetium', mass: '[97]',
    category: 'transition-metal', categoryName: '过渡金属', period: 5, group: 7, block: 'd', state: 'solid', stateName: '固态',
    electron: '[Kr] 4d⁵ 5s²', shells: [2, 8, 18, 13, 2], melting: 2157, boiling: 4265, density: '11 g/cm³', electronegativity: 1.9,
    oxidation: '+7, +4', discoverer: '埃米利奥·塞格雷 / 卡洛·佩列尔', year: '1937',
    origin: '源自希腊语「technetos」(人工制造)，人类历史上第一个人工制造出的化学元素。',
    uses: '放射性同位素锝-99m(Tc-99m)是核医学中使用最广泛的SPECT伽马显像放射性示踪剂(骨扫描/心肌灌注显像，年诊断数千万例)。'
  },
  {
    z: 44, symbol: 'Ru', name: '钌', pinyin: 'liǎo', pinyinTone: '第三声 (上声)', enName: 'Ruthenium', mass: '101.07',
    category: 'transition-metal', categoryName: '过渡金属', period: 5, group: 8, block: 'd', state: 'solid', stateName: '固态',
    electron: '[Kr] 4d⁷ 5s¹', shells: [2, 8, 18, 15, 1], melting: 2334, boiling: 4150, density: '12.45 g/cm³', electronegativity: 2.2,
    oxidation: '+8, +4, +3', discoverer: '卡尔·恩斯特·克劳斯 (Karl Ernst Claus)', year: '1844',
    origin: '源自俄罗斯的拉丁名「Ruthenia」。',
    uses: '贵金属铂族成员。用于计算机机械硬盘垂直磁记录(PMR/SMR)薄膜底层；格拉布(Grubbs)烯烃复分解催化剂；耐磨电接触点及氯碱工业DSA阳极涂层。'
  },
  {
    z: 45, symbol: 'Rh', name: '铑', pinyin: 'lǎo', pinyinTone: '第三声 (上声)', enName: 'Rhodium', mass: '102.91',
    category: 'transition-metal', categoryName: '过渡金属', period: 5, group: 9, block: 'd', state: 'solid', stateName: '固态',
    electron: '[Kr] 4d⁸ 5s¹', shells: [2, 8, 18, 16, 1], melting: 1964, boiling: 3695, density: '12.41 g/cm³', electronegativity: 2.28,
    oxidation: '+3', discoverer: '威廉·海德·沃拉斯顿 (William Hyde Wollaston)', year: '1804',
    origin: '源自希腊语「rhodon」(玫瑰)，因其氯化物水溶液呈美丽的玫瑰红色。',
    uses: '极其昂贵的贵金属。汽车三元催化转换器核心(高效催化还原有害氮氧化物NOx)；高档珠宝白金首饰电镀铑防磨增亮层；玻璃纤维漏板合金。'
  },
  {
    z: 46, symbol: 'Pd', name: '钯', pinyin: 'bǎ', pinyinTone: '第三声 (上声)', enName: 'Palladium', mass: '106.42',
    category: 'transition-metal', categoryName: '过渡金属', period: 5, group: 10, block: 'd', state: 'solid', stateName: '固态',
    electron: '[Kr] 4d¹⁰', shells: [2, 8, 18, 18], melting: 1554.9, boiling: 2963, density: '12.023 g/cm³', electronegativity: 2.20,
    oxidation: '+2, +4', discoverer: '威廉·海德·沃拉斯顿 (William Hyde Wollaston)', year: '1802',
    origin: '源自当年新发现的智神星「Pallas」(以希腊智慧女神命名)。',
    uses: '室温下能吸收自身体积900倍的氢气(用于氢气超纯分离与储氢)；有机交叉偶联反应(诺贝尔奖Suzuki/Heck反应)顶级催化剂；多层陶瓷电容器(MLCC)电极。'
  },
  {
    z: 47, symbol: 'Ag', name: '银', pinyin: 'yín', pinyinTone: '第二声 (阳平)', enName: 'Silver', mass: '107.87',
    category: 'transition-metal', categoryName: '过渡金属', period: 5, group: 11, block: 'd', state: 'solid', stateName: '固态',
    electron: '[Kr] 4d¹⁰ 5s¹', shells: [2, 8, 18, 18, 1], melting: 961.78, boiling: 2162, density: '10.49 g/cm³', electronegativity: 1.93,
    oxidation: '+1', discoverer: '古代已知 (人类古老贵金属与货币)', year: '古代 (约公元前5000年)',
    origin: '源自古英语「seolfor」，符号 Ag 源于拉丁语 Argentum(闪亮)。',
    uses: '所有金属中电导率与热导率最高。光伏太阳能电池正面导电银浆；高可靠性电子焊料与触点；首饰与银器；高反光镜面及银离子长效抗菌剂。'
  },
  {
    z: 48, symbol: 'Cd', name: '镉', pinyin: 'gé', pinyinTone: '第二声 (阳平)', enName: 'Cadmium', mass: '112.41',
    category: 'transition-metal', categoryName: '过渡金属', period: 5, group: 12, block: 'd', state: 'solid', stateName: '固态',
    electron: '[Kr] 4d¹⁰ 5s²', shells: [2, 8, 18, 18, 2], melting: 321.07, boiling: 767, density: '8.65 g/cm³', electronegativity: 1.69,
    oxidation: '+2', discoverer: '卡尔·塞缪尔·莱贝雷希特·赫尔曼 / 弗里德里希·施特罗迈尔', year: '1817',
    origin: '源自希腊神话卡德摩斯「Cadmus」，即炉甘石矿。',
    uses: '镍镉充电电池；碲化镉(CdTe)薄膜太阳能电池；量子点显示屏(CdSe)；核反应堆中子吸收控制棒；镉黄/镉红耐候颜料(具生物毒性需受控处理)。'
  },
  {
    z: 49, symbol: 'In', name: '铟', pinyin: 'yīn', pinyinTone: '第一声 (阴平)', enName: 'Indium', mass: '114.82',
    category: 'post-transition', categoryName: '贫金属', period: 5, group: 13, block: 'p', state: 'solid', stateName: '固态',
    electron: '[Kr] 4d¹⁰ 5s² 5p¹', shells: [2, 8, 18, 18, 3], melting: 156.60, boiling: 2072, density: '7.31 g/cm³', electronegativity: 1.78,
    oxidation: '+3', discoverer: '费迪南德·赖希 / 希罗尼穆斯·特奥多尔·里希特', year: '1863',
    origin: '源自其光谱中明亮的靛蓝色「Indigo」谱线。',
    uses: '极其柔软的银白金属。氧化铟锡(ITO)是液晶显示屏、OLED及手机触摸屏不可或缺的透明导电薄膜；低温焊料及半导体磷化铟(InP)光模块芯片。'
  },
  {
    z: 50, symbol: 'Sn', name: '锡', pinyin: 'xī', pinyinTone: '第一声 (阴平)', enName: 'Tin', mass: '118.71',
    category: 'post-transition', categoryName: '贫金属', period: 5, group: 14, block: 'p', state: 'solid', stateName: '固态',
    electron: '[Kr] 4d¹⁰ 5s² 5p²', shells: [2, 8, 18, 18, 4], melting: 231.93, boiling: 2602, density: '7.287 g/cm³ (白锡)', electronegativity: 1.96,
    oxidation: '+4, +2', discoverer: '古代已知 (青铜时代核心支柱)', year: '古代 (约公元前3500年)',
    origin: '源自日耳曼语，符号 Sn 源于拉丁语 Stannum。',
    uses: '电子工业命脉——无铅焊锡丝/焊锡膏(连接芯片与PCB板)；马口铁食品罐头镀锡防锈层；浮法平板玻璃生产锡槽液面；青铜合金。'
  },
  {
    z: 51, symbol: 'Sb', name: '锑', pinyin: 'tī', pinyinTone: '第一声 (阴平)', enName: 'Antimony', mass: '121.76',
    category: 'metalloid', categoryName: '类金属', period: 5, group: 15, block: 'p', state: 'solid', stateName: '固态',
    electron: '[Kr] 4d¹⁰ 5s² 5p³', shells: [2, 8, 18, 18, 5], melting: 630.63, boiling: 1587, density: '6.697 g/cm³', electronegativity: 2.05,
    oxidation: '+5, +3, -3', discoverer: '古代已知 (巴西尔·瓦伦丁系统记载)', year: '古代 / 1604',
    origin: '源自希腊语「anti-monos」(不单独存在)，符号 Sb 源于拉丁语 Stibium(辉锑矿)。',
    uses: '冷胀热缩的特异金属。铅酸蓄电池合金硬化剂；印刷合金字模(冷凝边缘清晰)；三氧化二锑高效塑料阻燃协同剂；相变存储器(PCM)及红外探测器。'
  },
  {
    z: 52, symbol: 'Te', name: '碲', pinyin: 'dì', pinyinTone: '第四声 (去声)', enName: 'Tellurium', mass: '127.60',
    category: 'metalloid', categoryName: '类金属', period: 5, group: 16, block: 'p', state: 'solid', stateName: '固态',
    electron: '[Kr] 4d¹⁰ 5s² 5p⁴', shells: [2, 8, 18, 18, 6], melting: 449.51, boiling: 988, density: '6.24 g/cm³', electronegativity: 2.1,
    oxidation: '+6, +4, -2', discoverer: '弗朗茨-约瑟夫·米勒·冯·赖兴施泰因', year: '1782',
    origin: '源自拉丁语「tellus」(大地女神)。',
    uses: '碲化镉(CdTe)大面积薄膜太阳能光伏组件；碲化铋(Bi2Te3)热电半导体制冷片(温差发电与CPU精密温控)；可重写光盘DVD-RW记录层相变材料。'
  },
  {
    z: 53, symbol: 'I', name: '碘', pinyin: 'diǎn', pinyinTone: '第三声 (上声)', enName: 'Iodine', mass: '126.90',
    category: 'reactive-nonmetal', categoryName: '非金属', period: 5, group: 17, block: 'p', state: 'solid', stateName: '固态',
    electron: '[Kr] 4d¹⁰ 5s² 5p⁵', shells: [2, 8, 18, 18, 7], melting: 113.7, boiling: 184.3, density: '4.933 g/cm³', electronegativity: 2.66,
    oxidation: '+7, +5, +1, -1', discoverer: '贝尔纳·库尔图瓦 (Bernard Courtois)', year: '1811',
    origin: '源自希腊语「ioeides」(紫罗兰色)，升华时产生华丽的深紫色蒸汽。',
    uses: '碘酒/碘伏医用消毒杀菌；加碘食盐防止地方性甲状腺肿；CT医学造影剂；人工降雨碘化银(AgI)催化成核剂及偏光太阳镜滤光片。'
  },
  {
    z: 54, symbol: 'Xe', name: '氙', pinyin: 'xiān', pinyinTone: '第一声 (阴平)', enName: 'Xenon', mass: '131.29',
    category: 'noble-gas', categoryName: '稀有气体', period: 5, group: 18, block: 'p', state: 'gas', stateName: '气态',
    electron: '[Kr] 4d¹⁰ 5s² 5p⁶', shells: [2, 8, 18, 18, 8], melting: -111.7, boiling: -108.12, density: '5.894 g/L', electronegativity: 2.6,
    oxidation: '+8, +6, +4, +2, 0', discoverer: '威廉·拉姆齐 / 莫里斯·特拉弗斯', year: '1898',
    origin: '源自希腊语「xenos」(陌生人/外来者)。',
    uses: '航天卫星霍尔电推进离子发动机工质气体；汽车氙气大灯与电影放映机超高压短弧氙灯；医学麻醉剂及暗物质探测液氙探测器(PandaX)。'
  },
  {
    z: 55, symbol: 'Cs', name: '铯', pinyin: 'sè', pinyinTone: '第四声 (去声)', enName: 'Caesium', mass: '132.91',
    category: 'alkali-metal', categoryName: '碱金属', period: 6, group: 1, block: 's', state: 'solid', stateName: '固态',
    electron: '[Xe] 6s¹', shells: [2, 8, 18, 18, 8, 1], melting: 28.44, boiling: 671, density: '1.93 g/cm³', electronegativity: 0.79,
    oxidation: '+1', discoverer: '罗伯特·本生 / 古斯塔夫·基尔霍夫', year: '1860',
    origin: '源自拉丁语「caesius」(天蓝色)，因其光谱中亮天蓝谱线。',
    uses: '国际单位制“秒”的法定基准(铯-133原子能级跃迁周期定义：9,192,631,770次)；铯原子钟实现数千万年不差一秒；光电倍增管及石油钻井高密度甲酸铯流体。'
  },
  {
    z: 56, symbol: 'Ba', name: '钡', pinyin: 'bèi', pinyinTone: '第四声 (去声)', enName: 'Barium', mass: '137.33',
    category: 'alkaline-earth', categoryName: '碱土金属', period: 6, group: 2, block: 's', state: 'solid', stateName: '固态',
    electron: '[Xe] 6s²', shells: [2, 8, 18, 18, 8, 2], melting: 727, boiling: 1897, density: '3.51 g/cm³', electronegativity: 0.89,
    oxidation: '+2', discoverer: '卡尔·威廉·舍勒 (Carl Wilhelm Scheele)', year: '1772',
    origin: '源自希腊语「barys」(沉重)，重晶石比重很大。',
    uses: '硫酸钡(不溶于水和胃酸，无毒)用作消化道X射线/CT检查“钡餐”造影剂；石油钻井重晶石加重泥浆；绿色节日烟花着色剂及电子管吸气剂。'
  },
  {
    z: 57, symbol: 'La', name: '镧', pinyin: 'lán', pinyinTone: '第二声 (阳平)', enName: 'Lanthanum', mass: '138.91',
    category: 'lanthanide', categoryName: '镧系金属', period: 6, group: 3, block: 'f', state: 'solid', stateName: '固态',
    electron: '[Xe] 5d¹ 6s²', shells: [2, 8, 18, 18, 9, 2], melting: 920, boiling: 3464, density: '6.162 g/cm³', electronegativity: 1.10,
    oxidation: '+3', discoverer: '卡尔·古斯塔夫·莫桑德 (Carl Gustaf Mosander)', year: '1839',
    origin: '源自希腊语「lanthanein」(隐蔽/潜伏)，镧系元素的开端。',
    uses: '高端单反相机高折射率低色散光学玻璃镜头；混动汽车镍氢电池储氢合金(LaNi5)；石油催化裂化分子筛催化剂及碳弧照明电极。'
  },
  {
    z: 58, symbol: 'Ce', name: '铈', pinyin: 'shì', pinyinTone: '第四声 (去声)', enName: 'Cerium', mass: '140.12',
    category: 'lanthanide', categoryName: '镧系金属', period: 6, group: 3, block: 'f', state: 'solid', stateName: '固态',
    electron: '[Xe] 4f¹ 5d¹ 6s²', shells: [2, 8, 18, 19, 9, 2], melting: 798, boiling: 3443, density: '6.77 g/cm³', electronegativity: 1.12,
    oxidation: '+4, +3', discoverer: '马丁·海因里希·克拉普罗特 / 永斯·雅各布·贝尔塞柳斯', year: '1803',
    origin: '源自谷神星「Ceres」(以罗马农业女神命名)。',
    uses: '地壳中储量最高的稀土元素。氧化铈(CeO2)用于液晶玻璃与硅片超精密抛光粉；汽车尾气催化剂储氧组分；打火机打火石(铈铁合金)及自清洁烤箱内胆。'
  },
  {
    z: 59, symbol: 'Pr', name: '镨', pinyin: 'pǔ', pinyinTone: '第三声 (上声)', enName: 'Praseodymium', mass: '140.91',
    category: 'lanthanide', categoryName: '镧系金属', period: 6, group: 3, block: 'f', state: 'solid', stateName: '固态',
    electron: '[Xe] 4f³ 6s²', shells: [2, 8, 18, 21, 8, 2], melting: 931, boiling: 3520, density: '6.77 g/cm³', electronegativity: 1.13,
    oxidation: '+3, +4', discoverer: '卡尔·奥尔·冯·韦尔斯巴赫', year: '1885',
    origin: '源自希腊语「prasios」(韭绿) 和「didymos」(孪生子)。',
    uses: '与钕配比用于高性能钕铁硼永磁铁；镨钕合金是电焊工护目镜关键黄色滤光玻璃组分；陶瓷镨黄釉料及光纤放大器(PDFA)。'
  },
  {
    z: 60, symbol: 'Nd', name: '钕', pinyin: 'nǚ', pinyinTone: '第三声 (上声)', enName: 'Neodymium', mass: '144.24',
    category: 'lanthanide', categoryName: '镧系金属', period: 6, group: 3, block: 'f', state: 'solid', stateName: '固态',
    electron: '[Xe] 4f⁴ 6s²', shells: [2, 8, 18, 22, 8, 2], melting: 1021, boiling: 3074, density: '7.01 g/cm³', electronegativity: 1.14,
    oxidation: '+3', discoverer: '卡尔·奥尔·冯·韦尔斯巴赫', year: '1885',
    origin: '源自希腊语「neos」(新) 和「didymos」(孪生子)。',
    uses: '“永磁之王”钕铁硼(Nd2Fe14B)核心成分，广泛用于风力发电机、新能源汽车驱动电机、手机微型扬声器与振动马达；Nd:YAG激光器及紫红色工艺玻璃。'
  },
  {
    z: 61, symbol: 'Pm', name: '钷', pinyin: 'pǒ', pinyinTone: '第三声 (上声)', enName: 'Promethium', mass: '[145]',
    category: 'lanthanide', categoryName: '镧系金属', period: 6, group: 3, block: 'f', state: 'solid', stateName: '固态',
    electron: '[Xe] 4f⁵ 6s²', shells: [2, 8, 18, 23, 8, 2], melting: 1042, boiling: 3000, density: '7.26 g/cm³', electronegativity: 1.13,
    oxidation: '+3', discoverer: '雅各布·马林斯基 / 劳伦斯·格兰德宁', year: '1945',
    origin: '源自希腊神话盗取天火造福人类的普罗米修斯「Prometheus」。',
    uses: '天然界极其罕见的放射性镧系元素。用于航天深空探测器同位素微型核电池、长寿命仪表发光涂料荧光粉及厚度连续测量仪。'
  },
  {
    z: 62, symbol: 'Sm', name: '钐', pinyin: 'shān', pinyinTone: '第一声 (阴平)', enName: 'Samarium', mass: '150.36',
    category: 'lanthanide', categoryName: '镧系金属', period: 6, group: 3, block: 'f', state: 'solid', stateName: '固态',
    electron: '[Xe] 4f⁶ 6s²', shells: [2, 8, 18, 24, 8, 2], melting: 1072, boiling: 1794, density: '7.52 g/cm³', electronegativity: 1.17,
    oxidation: '+3, +2', discoverer: '保罗·埃米尔·勒科克·德布瓦博德兰', year: '1879',
    origin: '源自俄罗斯矿物学家萨马尔斯基(Samarsky)命名的铌钇矿。',
    uses: '钐钴(SmCo)耐高温永磁体(居里温度极高，用于航空航天雷达与导弹伺服电机)；核反应堆中子吸收控制棒及抗癌放射性药物钐-153。'
  },
  {
    z: 63, symbol: 'Eu', name: '铕', pinyin: 'yǒu', pinyinTone: '第三声 (上声)', enName: 'Europium', mass: '151.96',
    category: 'lanthanide', categoryName: '镧系金属', period: 6, group: 3, block: 'f', state: 'solid', stateName: '固态',
    electron: '[Xe] 4f⁷ 6s²', shells: [2, 8, 18, 25, 8, 2], melting: 822, boiling: 1529, density: '5.244 g/cm³', electronegativity: 1.2,
    oxidation: '+3, +2', discoverer: '欧仁-安纳托尔·德马塞 (Eugène-Anatole Demarçay)', year: '1901',
    origin: '源自欧洲「Europe」。',
    uses: '发光性能最优异的稀土元素。荧光防伪油墨(欧元与人民币纸币防伪红蓝荧光图样)；LED显示屏红色(Eu³⁺)与蓝色(Eu²⁺)发光荧光粉；量子存储材料。'
  },
  {
    z: 64, symbol: 'Gd', name: '钆', pinyin: 'gá', pinyinTone: '第二声 (阳平)', enName: 'Gadolinium', mass: '157.25',
    category: 'lanthanide', categoryName: '镧系金属', period: 6, group: 3, block: 'f', state: 'solid', stateName: '固态',
    electron: '[Xe] 4f⁷ 5d¹ 6s²', shells: [2, 8, 18, 25, 9, 2], melting: 1313, boiling: 3273, density: '7.90 g/cm³', electronegativity: 1.20,
    oxidation: '+3', discoverer: '让·夏尔·加利萨·德马里尼亚克', year: '1880',
    origin: '纪念稀土化学先驱芬兰化学家约翰·加多林「Johan Gadolin」。',
    uses: '具有7个未配对电子，磁矩极高。临床MRI核磁共振显像钆造影剂(Gd-DTPA)；磁制冷室温材料；核反应堆高热中子吸收屏蔽材料。'
  },
  {
    z: 65, symbol: 'Tb', name: '铽', pinyin: 'tè', pinyinTone: '第四声 (去声)', enName: 'Terbium', mass: '158.93',
    category: 'lanthanide', categoryName: '镧系金属', period: 6, group: 3, block: 'f', state: 'solid', stateName: '固态',
    electron: '[Xe] 4f⁹ 6s²', shells: [2, 8, 18, 27, 8, 2], melting: 1356, boiling: 3230, density: '8.23 g/cm³', electronegativity: 1.2,
    oxidation: '+3, +4', discoverer: '卡尔·古斯塔夫·莫桑德 (Carl Gustaf Mosander)', year: '1843',
    origin: '源自瑞典伊特比村「Ytterby」。',
    uses: '三基色荧光灯与高色域显示器核心绿色荧光粉(Tb³⁺)；太芬诺(Terfenol-D)超磁致伸缩材料(声呐水下声波换能器/微位移精密致动器)。'
  },
  {
    z: 66, symbol: 'Dy', name: '镝', pinyin: 'dī', pinyinTone: '第一声 (阴平)', enName: 'Dysprosium', mass: '162.50',
    category: 'lanthanide', categoryName: '镧系金属', period: 6, group: 3, block: 'f', state: 'solid', stateName: '固态',
    electron: '[Xe] 4f¹⁰ 6s²', shells: [2, 8, 18, 28, 8, 2], melting: 1412, boiling: 2567, density: '8.540 g/cm³', electronegativity: 1.22,
    oxidation: '+3', discoverer: '保罗·埃米尔·勒科克·德布瓦博德兰', year: '1886',
    origin: '源自希腊语「dysprositos」(难以接近/难获取)。',
    uses: '提高钕铁硼磁铁耐高温性能的关键重稀土添加剂(使电动车驱动电机在180℃以上不退磁)；金属卤素灯高亮度添加剂；核控制棒材料。'
  },
  {
    z: 67, symbol: 'Ho', name: '钬', pinyin: 'huǒ', pinyinTone: '第三声 (上声)', enName: 'Holmium', mass: '164.93',
    category: 'lanthanide', categoryName: '镧系金属', period: 6, group: 3, block: 'f', state: 'solid', stateName: '固态',
    electron: '[Xe] 4f¹¹ 6s²', shells: [2, 8, 18, 29, 8, 2], melting: 1474, boiling: 2700, density: '8.79 g/cm³', electronegativity: 1.23,
    oxidation: '+3', discoverer: '佩尔·特奥多尔·克勒夫 (Per Teodor Cleve)', year: '1879',
    origin: '源自瑞典首都斯德哥尔摩的拉丁名「Holmia」。',
    uses: '所有自然元素中磁矩最高。超导强磁体导磁极头聚焦磁力线；钇铁石榴石钬激光器(Ho:YAG，波长2.1μm微创碎石与前列腺手术利器)。'
  },
  {
    z: 68, symbol: 'Er', name: '铒', pinyin: 'ěr', pinyinTone: '第三声 (上声)', enName: 'Erbium', mass: '167.26',
    category: 'lanthanide', categoryName: '镧系金属', period: 6, group: 3, block: 'f', state: 'solid', stateName: '固态',
    electron: '[Xe] 4f¹² 6s²', shells: [2, 8, 18, 30, 8, 2], melting: 1529, boiling: 2868, density: '9.066 g/cm³', electronegativity: 1.24,
    oxidation: '+3', discoverer: '卡尔·古斯塔夫·莫桑德 (Carl Gustaf Mosander)', year: '1843',
    origin: '源自瑞典伊特比村「Ytterby」。',
    uses: '现代光纤互联网长途通信中继核心——掺铒光纤放大器(EDFA，在1550nm光通信极低损耗窗口直接光放大)；铒激光(Er:YAG)皮肤医美磨皮与牙科手术。'
  },
  {
    z: 69, symbol: 'Tm', name: '铥', pinyin: 'diū', pinyinTone: '第一声 (阴平)', enName: 'Thulium', mass: '168.93',
    category: 'lanthanide', categoryName: '镧系金属', period: 6, group: 3, block: 'f', state: 'solid', stateName: '固态',
    electron: '[Xe] 4f¹³ 6s²', shells: [2, 8, 18, 31, 8, 2], melting: 1545, boiling: 1950, density: '9.32 g/cm³', electronegativity: 1.25,
    oxidation: '+3, +2', discoverer: '佩尔·特奥多尔·克勒夫 (Per Teodor Cleve)', year: '1879',
    origin: '源自希腊罗马神话中北方神秘之地「Thule」(斯堪的纳维亚)。',
    uses: '地壳中最稀少的稀土元素之一。同位素铥-170便携式野外X射线工业探伤源与放射治疗；铥激光器(Tm:YAG/掺铥光纤激光)手术刀；欧元钞票蓝色防伪荧光。'
  },
  {
    z: 70, symbol: 'Yb', name: '镱', pinyin: 'yì', pinyinTone: '第四声 (去声)', enName: 'Ytterbium', mass: '173.05',
    category: 'lanthanide', categoryName: '镧系金属', period: 6, group: 3, block: 'f', state: 'solid', stateName: '固态',
    electron: '[Xe] 4f¹⁴ 6s²', shells: [2, 8, 18, 32, 8, 2], melting: 824, boiling: 1196, density: '6.90 g/cm³', electronegativity: 1.1,
    oxidation: '+3, +2', discoverer: '让·夏尔·加利萨·德马里尼亚克', year: '1878',
    origin: '源自瑞典伊特比村「Ytterby」。',
    uses: '高功率掺镱光纤工业激光器(用于万瓦级金属激光切割焊接)；镱原子光晶格钟(百亿年误差小于1秒)；地震监测应力变阻传感器。'
  },
  {
    z: 71, symbol: 'Lu', name: '镥', pinyin: 'lǔ', pinyinTone: '第三声 (上声)', enName: 'Lutetium', mass: '174.97',
    category: 'lanthanide', categoryName: '镧系金属', period: 6, group: 3, block: 'd', state: 'solid', stateName: '固态',
    electron: '[Xe] 4f¹⁴ 5d¹ 6s²', shells: [2, 8, 18, 32, 9, 2], melting: 1663, boiling: 3402, density: '9.841 g/cm³', electronegativity: 1.27,
    oxidation: '+3', discoverer: '乔治·于尔班 / 卡尔·奥尔·冯·韦尔斯巴赫', year: '1907',
    origin: '源自法国巴黎的古罗马旧称「Lutetia」(卢泰西亚)。',
    uses: '镧系最后一个也是最硬最密的元素。硅酸钇镥(LYSO)顶级闪烁晶体用于正电子发射计算机断层显像(PET-CT扫描仪)；放射性同位素镥-177靶向肿瘤核素治疗。'
  },
  {
    z: 72, symbol: 'Hf', name: '铪', pinyin: 'hā', pinyinTone: '第一声 (阴平)', enName: 'Hafnium', mass: '178.49',
    category: 'transition-metal', categoryName: '过渡金属', period: 6, group: 4, block: 'd', state: 'solid', stateName: '固态',
    electron: '[Xe] 4f¹⁴ 5d² 6s²', shells: [2, 8, 18, 32, 10, 2], melting: 2233, boiling: 4603, density: '13.31 g/cm³', electronegativity: 1.3,
    oxidation: '+4', discoverer: '德克·科斯特 / 乔治·德海韦西', year: '1923',
    origin: '源自丹麦哥本哈根拉丁名「Hafnia」。玻尔原子结构理论成功预言其化学性质。',
    uses: '核潜艇核反应堆中子吸收控制棒(寿命极长)；现代CPU先进制程高k栅介质(基于二氧化铪HfO2薄膜消除漏电)；等离子切割电极尖端。'
  },
  {
    z: 73, symbol: 'Ta', name: '钽', pinyin: 'tǎn', pinyinTone: '第三声 (上声)', enName: 'Tantalum', mass: '180.95',
    category: 'transition-metal', categoryName: '过渡金属', period: 6, group: 5, block: 'd', state: 'solid', stateName: '固态',
    electron: '[Xe] 4f¹⁴ 5d³ 6s²', shells: [2, 8, 18, 32, 11, 2], melting: 3017, boiling: 5458, density: '16.69 g/cm³', electronegativity: 1.5,
    oxidation: '+5', discoverer: '安德斯·古斯塔夫·埃克贝里 (Anders Gustaf Ekeberg)', year: '1802',
    origin: '源自希腊神话遭受酷刑却无法饮水的坦塔罗斯「Tantalus」，因其在强酸中极难溶解。',
    uses: '微型高容量钽电解电容器(智能手机主板、军工航天高稳定电路)；极耐王水腐蚀的化工反应器内衬；外科骨科植入人体骨钉与钽网骨修复。'
  },
  {
    z: 74, symbol: 'W', name: '钨', pinyin: 'wū', pinyinTone: '第一声 (阴平)', enName: 'Tungsten', mass: '183.84',
    category: 'transition-metal', categoryName: '过渡金属', period: 6, group: 6, block: 'd', state: 'solid', stateName: '固态',
    electron: '[Xe] 4f¹⁴ 5d⁴ 6s²', shells: [2, 8, 18, 32, 12, 2], melting: 3422, boiling: 5930, density: '19.25 g/cm³', electronegativity: 2.36,
    oxidation: '+6, +4', discoverer: '胡安·何塞·德尔卢亚尔 / 福斯托·德尔卢亚尔兄弟', year: '1783',
    origin: '源自瑞典语「tung sten」(重石)，符号 W 源于德语 Wolfram(黑钨矿)。',
    uses: '所有纯金属中熔点最高(3422℃)。碳化钨(硬质合金)用于切削刀具钻头与穿甲弹弹芯；传统白炽灯钨丝；可控核聚变托卡马克内壁耐高温偏滤器材料。'
  },
  {
    z: 75, symbol: 'Re', name: '铼', pinyin: 'lái', pinyinTone: '第二声 (阳平)', enName: 'Rhenium', mass: '186.21',
    category: 'transition-metal', categoryName: '过渡金属', period: 6, group: 7, block: 'd', state: 'solid', stateName: '固态',
    electron: '[Xe] 4f¹⁴ 5d⁵ 6s²', shells: [2, 8, 18, 32, 13, 2], melting: 3186, boiling: 5596, density: '21.02 g/cm³', electronegativity: 1.9,
    oxidation: '+7, +4', discoverer: '瓦尔特·诺达克 / 伊达·诺达克 / 奥托·贝格', year: '1925',
    origin: '源自德国莱茵河拉丁名「Rhenus」，为最后被发现的天然稳定元素。',
    uses: '极其珍贵战略稀缺金属。航空喷气发动机单晶高温合金涡轮叶片关键添加剂(抗高温蠕变)；无铅高辛烷值汽油铂铼重整催化剂及热电偶。'
  },
  {
    z: 76, symbol: 'Os', name: '锇', pinyin: 'é', pinyinTone: '第二声 (阳平)', enName: 'Osmium', mass: '190.23',
    category: 'transition-metal', categoryName: '过渡金属', period: 6, group: 8, block: 'd', state: 'solid', stateName: '固态',
    electron: '[Xe] 4f¹⁴ 5d⁶ 6s²', shells: [2, 8, 18, 32, 14, 2], melting: 3033, boiling: 5012, density: '22.59 g/cm³', electronegativity: 2.2,
    oxidation: '+8, +4', discoverer: '史密森·特南特 (Smithson Tennant)', year: '1803',
    origin: '源自希腊语「osme」(气味)，因四氧化锇具有刺激性挥发气味。',
    uses: '天然界密度最大的元素(22.59 g/cm³)。高硬度耐磨锇铱合金用于高级金笔笔尖、精密仪器枢轴轴承；四氧化锇(OsO4)生物电镜样品脂质染色固定剂。'
  },
  {
    z: 77, symbol: 'Ir', name: '铱', pinyin: 'yī', pinyinTone: '第一声 (阴平)', enName: 'Iridium', mass: '192.22',
    category: 'transition-metal', categoryName: '过渡金属', period: 6, group: 9, block: 'd', state: 'solid', stateName: '固态',
    electron: '[Xe] 4f¹⁴ 5d⁷ 6s²', shells: [2, 8, 18, 32, 15, 2], melting: 2446, boiling: 4428, density: '22.56 g/cm³', electronegativity: 2.20,
    oxidation: '+4, +3', discoverer: '史密森·特南特 (Smithson Tennant)', year: '1803',
    origin: '源自希腊彩虹女神伊里斯「Iris」，因其盐类具有彩虹般绚烂色彩。',
    uses: '最耐腐蚀的金属之一。白金米原器(90%铂+10%铱合金)；飞机长寿命高性能铱金火花塞；人工单晶硅拉晶高熔点坩埚及恐龙灭绝小行星撞击层地质标志物。'
  },
  {
    z: 78, symbol: 'Pt', name: '铂', pinyin: 'bó', pinyinTone: '第二声 (阳平)', enName: 'Platinum', mass: '195.08',
    category: 'transition-metal', categoryName: '过渡金属', period: 6, group: 10, block: 'd', state: 'solid', stateName: '固态',
    electron: '[Xe] 4f¹⁴ 5d⁹ 6s¹', shells: [2, 8, 18, 32, 17, 1], melting: 1768.3, boiling: 3825, density: '21.45 g/cm³', electronegativity: 2.28,
    oxidation: '+4, +2', discoverer: '安东尼奥·德乌略亚 (Antonio de Ulloa)', year: '1735',
    origin: '源自西班牙语「platina」(小银/劣银)。俗称白金。',
    uses: '氢燃料电池质子交换膜(PEM)催化剂；抗癌化疗药物顺铂(Cisplatin)；高端珠宝首饰；标准铂电阻温度计(PRT)及化工厂耐酸坩埚。'
  },
  {
    z: 79, symbol: 'Au', name: '金', pinyin: 'jīn', pinyinTone: '第一声 (阴平)', enName: 'Gold', mass: '196.97',
    category: 'transition-metal', categoryName: '过渡金属', period: 6, group: 11, block: 'd', state: 'solid', stateName: '固态',
    electron: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹', shells: [2, 8, 18, 32, 18, 1], melting: 1064.18, boiling: 2970, density: '19.30 g/cm³', electronegativity: 2.54,
    oxidation: '+3, +1', discoverer: '古代已知 (人类永恒财富与璀璨象征)', year: '古代 (约公元前6000年)',
    origin: '源自古英语「geolo」(黄色)，符号 Au 源于拉丁语 Aurum(灿烂的黎明)。',
    uses: '极佳延展性与化学惰性。国际货币储备与珠宝首饰；芯片封装微米级高可靠键合金丝；航天宇航服头盔遮阳面罩反射红外镀金层；胶体金快速检测试纸。'
  },
  {
    z: 80, symbol: 'Hg', name: '汞', pinyin: 'gǒng', pinyinTone: '第三声 (上声)', enName: 'Mercury', mass: '200.59',
    category: 'transition-metal', categoryName: '过渡金属', period: 6, group: 12, block: 'd', state: 'liquid', stateName: '液态',
    electron: '[Xe] 4f¹⁴ 5d¹⁰ 6s²', shells: [2, 8, 18, 32, 18, 2], melting: -38.83, boiling: 356.73, density: '13.534 g/cm³', electronegativity: 2.00,
    oxidation: '+2, +1', discoverer: '古代已知 (中国/印度/埃及古代广泛炼丹与防腐)', year: '古代 (约公元前1500年)',
    origin: '源自罗马信使神墨丘利「Mercury」，俗称水银，符号 Hg 源于希腊语 Hydrargyrum(液态银)。',
    uses: '常温下唯一呈液态的金属。传统水银温度计、血压计、气压计；荧光日光灯管汞蒸气放电；汞齐补牙及氯碱工业汞阴极(需妥善环保处置防重金属污染)。'
  },
  {
    z: 81, symbol: 'Tl', name: '铊', pinyin: 'tā', pinyinTone: '第一声 (阴平)', enName: 'Thallium', mass: '204.38',
    category: 'post-transition', categoryName: '贫金属', period: 6, group: 13, block: 'p', state: 'solid', stateName: '固态',
    electron: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹', shells: [2, 8, 18, 32, 18, 3], melting: 304, boiling: 1473, density: '11.85 g/cm³', electronegativity: 1.62,
    oxidation: '+1, +3', discoverer: '威廉·克鲁克斯 (William Crookes)', year: '1861',
    origin: '源自希腊语「thallos」(绿芽)，因其光谱中明亮翠绿谱线。',
    uses: '铊盐剧毒。医学铊-201心肌灌注显像核医学诊断；红外光学溴化铊/碘化铊晶体(KRS-5夜视窗片)；超导材料及低温水银铊合金温度计(-58℃)。'
  },
  {
    z: 82, symbol: 'Pb', name: '铅', pinyin: 'qiān', pinyinTone: '第一声 (阴平)', enName: 'Lead', mass: '207.2',
    category: 'post-transition', categoryName: '贫金属', period: 6, group: 14, block: 'p', state: 'solid', stateName: '固态',
    electron: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²', shells: [2, 8, 18, 32, 18, 4], melting: 327.46, boiling: 1749, density: '11.34 g/cm³', electronegativity: 1.87,
    oxidation: '+2, +4', discoverer: '古代已知 (人类古老重金属)', year: '古代 (约公元前7000年)',
    origin: '源自古英语「lead」，符号 Pb 源于拉丁语 Plumbum(管道/铅锤)。',
    uses: '重金属元素中稳定同位素的终点。汽车铅酸蓄电池正负极；医院X射线及核辐射铅防护服/铅玻璃屏风；电缆护套及潜艇压舱配重。'
  },
  {
    z: 83, symbol: 'Bi', name: '铋', pinyin: 'bì', pinyinTone: '第四声 (去声)', enName: 'Bismuth', mass: '208.98',
    category: 'post-transition', categoryName: '贫金属', period: 6, group: 15, block: 'p', state: 'solid', stateName: '固态',
    electron: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³', shells: [2, 8, 18, 32, 18, 5], melting: 271.4, boiling: 1564, density: '9.78 g/cm³', electronegativity: 2.02,
    oxidation: '+3, +5', discoverer: '古代已知 (克洛德·弗朗索瓦·若弗鲁瓦确认为独立元素)', year: '古代 / 1753',
    origin: '源自德语「Wismut」(白色质量)。结晶氧化膜呈五彩斑斓梯田状。',
    uses: '最安全的重金属(几无毒性)。药用次水杨酸铋(幽门螺杆菌胃药必妥/得乐)；消防自动喷淋低熔点伍德合金易熔塞；绿色无铅环保弹药及化妆品珠光剂。'
  },
  {
    z: 84, symbol: 'Po', name: '钋', pinyin: 'pō', pinyinTone: '第一声 (阴平)', enName: 'Polonium', mass: '[209]',
    category: 'post-transition', categoryName: '贫金属', period: 6, group: 16, block: 'p', state: 'solid', stateName: '固态',
    electron: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴', shells: [2, 8, 18, 32, 18, 6], melting: 254, boiling: 962, density: '9.196 g/cm³', electronegativity: 2.0,
    oxidation: '+4, +2', discoverer: '居里夫妇 (Pierre & Marie Curie)', year: '1898',
    origin: '居里夫人为纪念祖国波兰「Poland」而命名。',
    uses: '极强阿尔法放射性。用于人造卫星热电放射性同位素热源(RTG)；铍钋便携式中子源；工业静电消除刷。'
  },
  {
    z: 85, symbol: 'At', name: '砹', pinyin: 'ài', pinyinTone: '第四声 (去声)', enName: 'Astatine', mass: '[210]',
    category: 'metalloid', categoryName: '类金属', period: 6, group: 17, block: 'p', state: 'solid', stateName: '固态',
    electron: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵', shells: [2, 8, 18, 32, 18, 7], melting: 302, boiling: 337, density: '6.4 g/cm³ (估)', electronegativity: 2.2,
    oxidation: '+1, +3, -1', discoverer: '戴尔·科森 / 肯尼斯·麦肯齐 / 埃米利奥·塞格雷', year: '1940',
    origin: '源自希腊语「astatos」(不稳定的)，地壳全量不足数克。',
    uses: '天然界最稀少的元素之一。放射性同位素砹-211(At-211)是靶向阿尔法核素治疗(TAT)微转移癌细胞的前沿肿瘤放射药剂。'
  },
  {
    z: 86, symbol: 'Rn', name: '氡', pinyin: 'dōng', pinyinTone: '第一声 (阴平)', enName: 'Radon', mass: '[222]',
    category: 'noble-gas', categoryName: '稀有气体', period: 6, group: 18, block: 'p', state: 'gas', stateName: '气态',
    electron: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶', shells: [2, 8, 18, 32, 18, 8], melting: -71, boiling: -61.7, density: '9.73 g/L', electronegativity: 2.2,
    oxidation: '0, +2', discoverer: '弗里德里希·恩斯特·多恩 (Friedrich Ernst Dorn)', year: '1900',
    origin: '源自放射性母体镭「Radium」。',
    uses: '放射性重气体。来自地质岩石中铀天然衰变；室内环境防氡辐射监测关键指标；水文地质断层与地震前兆地下水气体监测。'
  },
  {
    z: 87, symbol: 'Fr', name: '钫', pinyin: 'fāng', pinyinTone: '第一声 (阴平)', enName: 'Francium', mass: '[223]',
    category: 'alkali-metal', categoryName: '碱金属', period: 7, group: 1, block: 's', state: 'solid', stateName: '固态',
    electron: '[Rn] 7s¹', shells: [2, 8, 18, 32, 18, 8, 1], melting: 27, boiling: 677, density: '1.87 g/cm³ (估)', electronegativity: 0.7,
    oxidation: '+1', discoverer: '玛格丽特·佩赖 (Marguerite Perey)', year: '1939',
    origin: '居里夫人的学生佩赖为纪念法国「France」而命名。',
    uses: '最重且最不稳定的碱金属(半衰期仅22分钟)。用于激光磁光阱超冷中性原子俘获实验，研究弱电统一弱相互作用宇称不守恒。'
  },
  {
    z: 88, symbol: 'Ra', name: '镭', pinyin: 'léi', pinyinTone: '第二声 (阳平)', enName: 'Radium', mass: '[226]',
    category: 'alkaline-earth', categoryName: '碱土金属', period: 7, group: 2, block: 's', state: 'solid', stateName: '固态',
    electron: '[Rn] 7s²', shells: [2, 8, 18, 32, 18, 8, 2], melting: 700, boiling: 1737, density: '5.5 g/cm³', electronegativity: 0.9,
    oxidation: '+2', discoverer: '居里夫妇 (Pierre & Marie Curie)', year: '1898',
    origin: '源自拉丁语「radius」(光线/射线)，开启了人类放射性科学新纪元。',
    uses: '居里夫人从沥青铀矿中提炼出的著名放射性元素。早期用于居里疗法抗癌、夜光钟表(后淘汰)；氯化镭-223(Xofigo)靶向治疗前列腺癌骨转移。'
  },
  {
    z: 89, symbol: 'Ac', name: '锕', pinyin: 'ā', pinyinTone: '第一声 (阴平)', enName: 'Actinium', mass: '[227]',
    category: 'actinide', categoryName: '锕系金属', period: 7, group: 3, block: 'f', state: 'solid', stateName: '固态',
    electron: '[Rn] 6d¹ 7s²', shells: [2, 8, 18, 32, 18, 9, 2], melting: 1050, boiling: 3198, density: '10.07 g/cm³', electronegativity: 1.1,
    oxidation: '+3', discoverer: '安德烈-路易·德比埃尔纳 (André-Louis Debierne)', year: '1899',
    origin: '源自希腊语「aktinos」(光线)，锕系元素的始祖。',
    uses: '放射性同位素锕-225(Ac-225)是当今国际核医学界最炙手可热的“肿瘤导弹”靶向阿尔法疗法(TAT)核素。'
  },
  {
    z: 90, symbol: 'Th', name: '钍', pinyin: 'tǔ', pinyinTone: '第三声 (上声)', enName: 'Thorium', mass: '232.04',
    category: 'actinide', categoryName: '锕系金属', period: 7, group: 3, block: 'f', state: 'solid', stateName: '固态',
    electron: '[Rn] 6d² 7s²', shells: [2, 8, 18, 32, 18, 10, 2], melting: 1750, boiling: 4788, density: '11.72 g/cm³', electronegativity: 1.3,
    oxidation: '+4', discoverer: '永斯·雅各布·贝尔塞柳斯 (Jöns Jacob Berzelius)', year: '1829',
    origin: '源自北欧雷神索尔「Thor」。',
    uses: '储量远超铀的清洁第四代核电燃料(钍基熔盐堆TMSR)；传统高亮度汽灯纱罩网；高折射率光学玻璃及钨钍弧焊电极。'
  },
  {
    z: 91, symbol: 'Pa', name: '镤', pinyin: 'pú', pinyinTone: '第二声 (阳平)', enName: 'Protactinium', mass: '231.04',
    category: 'actinide', categoryName: '锕系金属', period: 7, group: 3, block: 'f', state: 'solid', stateName: '固态',
    electron: '[Rn] 5f² 6d¹ 7s²', shells: [2, 8, 18, 32, 20, 9, 2], melting: 1568, boiling: 4027, density: '15.37 g/cm³', electronegativity: 1.5,
    oxidation: '+5, +4', discoverer: '奥托·哈恩 / 莉泽·迈特纳 / 卡西米尔·法扬斯', year: '1913 / 1917',
    origin: '源自希腊语「protos」(第一/之前) 和 Actinium，意为“锕的前身”。',
    uses: '高放射性与高毒性超铀前体。用于海洋学深海沉积物铀-钍-镤同位素放射性测年与古海洋学年代标定研究。'
  },
  {
    z: 92, symbol: 'U', name: '铀', pinyin: 'yóu', pinyinTone: '第二声 (阳平)', enName: 'Uranium', mass: '238.03',
    category: 'actinide', categoryName: '锕系金属', period: 7, group: 3, block: 'f', state: 'solid', stateName: '固态',
    electron: '[Rn] 5f³ 6d¹ 7s²', shells: [2, 8, 18, 32, 21, 9, 2], melting: 1135, boiling: 4131, density: '19.1 g/cm³', electronegativity: 1.38,
    oxidation: '+6, +4', discoverer: '马丁·海因里希·克拉普罗特 (Martin Heinrich Klaproth)', year: '1789',
    origin: '源自当年新发现的天王星「Uranus」(希腊天空之神)。',
    uses: '现代核能核心基石。浓缩铀-235用于商业核反应堆裂变发电与核武器；贫化铀(DU)用于重型坦克装甲及穿甲弹；铀玻璃工艺品发荧光。'
  },
  {
    z: 93, symbol: 'Np', name: '镎', pinyin: 'ná', pinyinTone: '第二声 (阳平)', enName: 'Neptunium', mass: '[237]',
    category: 'actinide', categoryName: '锕系金属', period: 7, group: 3, block: 'f', state: 'solid', stateName: '固态',
    electron: '[Rn] 5f⁴ 6d¹ 7s²', shells: [2, 8, 18, 32, 22, 9, 2], melting: 644, boiling: 3902, density: '20.45 g/cm³', electronegativity: 1.36,
    oxidation: '+5, +4, +3, +6', discoverer: '埃德温·麦克米伦 / 菲利普·埃贝尔森', year: '1940',
    origin: '源自海王星「Neptune」(罗马海神)，因其在铀(天王星)之后。',
    uses: '第一个人工合成的超铀元素。在核反应堆中作为生产钚-238(深空航天同位素热电池)的前驱体材料；高能中子探测器。'
  },
  {
    z: 94, symbol: 'Pu', name: '钚', pinyin: 'bù', pinyinTone: '第四声 (去声)', enName: 'Plutonium', mass: '[244]',
    category: 'actinide', categoryName: '锕系金属', period: 7, group: 3, block: 'f', state: 'solid', stateName: '固态',
    electron: '[Rn] 5f⁶ 7s²', shells: [2, 8, 18, 32, 24, 8, 2], melting: 640, boiling: 3228, density: '19.86 g/cm³', electronegativity: 1.28,
    oxidation: '+4, +3, +5, +6', discoverer: '格伦·西博格 (Glenn T. Seaborg) 等', year: '1940',
    origin: '源自冥王星「Pluto」(罗马冥王)，继天王星、海王星后命名。',
    uses: '易裂变同位素钚-239用于核裂变武器与快中子增殖反应堆燃料；钚-238用于旅行者号、火星好奇号毅力号核动力放射性热电发生器(RTG)。'
  },
  {
    z: 95, symbol: 'Am', name: '镅', pinyin: 'méi', pinyinTone: '第二声 (阳平)', enName: 'Americium', mass: '[243]',
    category: 'actinide', categoryName: '锕系金属', period: 7, group: 3, block: 'f', state: 'solid', stateName: '固态',
    electron: '[Rn] 5f⁷ 7s²', shells: [2, 8, 18, 32, 25, 8, 2], melting: 1176, boiling: 2011, density: '12 g/cm³', electronegativity: 1.3,
    oxidation: '+3, +4', discoverer: '格伦·西博格 (Glenn T. Seaborg) 等', year: '1944',
    origin: '源自美洲「Americas」，对应镧系中的铕(欧洲)。',
    uses: '同位素镅-241广泛用于家庭离子型感烟火灾报警器电离室；工业射线测厚仪；中子测井仪器。'
  },
  {
    z: 96, symbol: 'Cm', name: '锔', pinyin: 'jú', pinyinTone: '第一声 (阴平)', enName: 'Curium', mass: '[247]',
    category: 'actinide', categoryName: '锕系金属', period: 7, group: 3, block: 'f', state: 'solid', stateName: '固态',
    electron: '[Rn] 5f⁷ 6d¹ 7s²', shells: [2, 8, 18, 32, 25, 9, 2], melting: 1345, boiling: 3110, density: '13.51 g/cm³', electronegativity: 1.3,
    oxidation: '+3, +4', discoverer: '格伦·西博格 (Glenn T. Seaborg) 等', year: '1944',
    origin: '纪念放射性先驱皮埃尔与玛丽·居里夫妇「Curie」。',
    uses: '强阿尔法放射性热源。火星车阿尔法粒子X射线光谱仪(APXS)搭载锔-244源就地分析火星岩石土壤化学元素组成。'
  },
  {
    z: 97, symbol: 'Bk', name: '锫', pinyin: 'péi', pinyinTone: '第二声 (阳平)', enName: 'Berkelium', mass: '[247]',
    category: 'actinide', categoryName: '锕系金属', period: 7, group: 3, block: 'f', state: 'solid', stateName: '固态',
    electron: '[Rn] 5f⁹ 7s²', shells: [2, 8, 18, 32, 27, 8, 2], melting: 986, boiling: 2627, density: '14.78 g/cm³', electronegativity: 1.3,
    oxidation: '+3, +4', discoverer: '格伦·西博格 (Glenn T. Seaborg) 等', year: '1949',
    origin: '源自美国加州大学伯克利分校所在地「Berkeley」。',
    uses: '超铀元素靶材料。锫-249靶用钙-48轰击人工合成了第117号新元素鿬(Ts)；重锕系基础核物理研究。'
  },
  {
    z: 98, symbol: 'Cf', name: '锎', pinyin: 'kāi', pinyinTone: '第一声 (阴平)', enName: 'Californium', mass: '[251]',
    category: 'actinide', categoryName: '锕系金属', period: 7, group: 3, block: 'f', state: 'solid', stateName: '固态',
    electron: '[Rn] 5f¹⁰ 7s²', shells: [2, 8, 18, 32, 28, 8, 2], melting: 900, boiling: 1470, density: '15.1 g/cm³', electronegativity: 1.3,
    oxidation: '+3', discoverer: '格伦·西博格 (Glenn T. Seaborg) 等', year: '1950',
    origin: '源自美国加利福尼亚州「California」。',
    uses: '世界上最昂贵的实用元素之一。强中子发射源锎-252用于核反应堆启动源、煤炭/水泥在线中子活化分析仪及宫颈癌中子微创治癌。'
  },
  {
    z: 99, symbol: 'Es', name: '锿', pinyin: 'āi', pinyinTone: '第一声 (阴平)', enName: 'Einsteinium', mass: '[252]',
    category: 'actinide', categoryName: '锕系金属', period: 7, group: 3, block: 'f', state: 'solid', stateName: '固态',
    electron: '[Rn] 5f¹¹ 7s²', shells: [2, 8, 18, 32, 29, 8, 2], melting: 860, boiling: 996, density: '8.84 g/cm³', electronegativity: 1.3,
    oxidation: '+3', discoverer: '阿伯特·吉奥索 (Albert Ghiorso) 等', year: '1952',
    origin: '纪念伟大物理学家阿尔伯特·爱因斯坦「Albert Einstein」，在第一颗常春藤麦克氢弹爆炸残骸中首次发现。',
    uses: '高能重离子核反应物理基础研究；曾用于合成钔(Md)元素。'
  },
  {
    z: 100, symbol: 'Fm', name: '镄', pinyin: 'fèi', pinyinTone: '第四声 (去声)', enName: 'Fermium', mass: '[257]',
    category: 'actinide', categoryName: '锕系金属', period: 7, group: 3, block: 'f', state: 'solid', stateName: '固态',
    electron: '[Rn] 5f¹² 7s²', shells: [2, 8, 18, 32, 30, 8, 2], melting: 1527, boiling: null, density: null, electronegativity: 1.3,
    oxidation: '+3', discoverer: '阿伯特·吉奥索 (Albert Ghiorso) 等', year: '1952',
    origin: '纪念中子物理学大师恩里科·费米「Enrico Fermi」，在氢弹爆炸碎片中被发现。',
    uses: '通过中子捕获所能合成的最重元素(更重元素无法通过连续中子俘获制备)；重核裂变机理前沿研究。'
  },
  {
    z: 101, symbol: 'Md', name: '钔', pinyin: 'mén', pinyinTone: '第二声 (阳平)', enName: 'Mendelevium', mass: '[258]',
    category: 'actinide', categoryName: '锕系金属', period: 7, group: 3, block: 'f', state: 'solid', stateName: '固态',
    electron: '[Rn] 5f¹³ 7s²', shells: [2, 8, 18, 32, 31, 8, 2], melting: 827, boiling: null, density: null, electronegativity: 1.3,
    oxidation: '+3, +2', discoverer: '阿伯特·吉奥索 / 格伦·西博格等', year: '1955',
    origin: '纪念化学元素周期律创立者德米特里·门捷列夫「Dmitri Mendeleev」。',
    uses: '人类历史上第一次实现“逐个原子”合成与鉴定的元素(当年仅合成17个原子)。用于重核化学配位性质研究。'
  },
  {
    z: 102, symbol: 'No', name: '锘', pinyin: 'nuò', pinyinTone: '第四声 (去声)', enName: 'Nobelium', mass: '[259]',
    category: 'actinide', categoryName: '锕系金属', period: 7, group: 3, block: 'f', state: 'solid', stateName: '固态',
    electron: '[Rn] 5f¹⁴ 7s²', shells: [2, 8, 18, 32, 32, 8, 2], melting: 827, boiling: null, density: null, electronegativity: 1.3,
    oxidation: '+2, +3', discoverer: '联合核子研究所(杜布纳) / 伯克利实验室', year: '1966',
    origin: '纪念炸药发明家、诺贝尔奖创立者阿尔弗雷德·诺贝尔「Alfred Nobel」。',
    uses: '由于相对论效应，其二价(+2)氧化态比三价更稳定；重离子物理机理实验。'
  },
  {
    z: 103, symbol: 'Lr', name: '铹', pinyin: 'láo', pinyinTone: '第二声 (阳平)', enName: 'Lawrencium', mass: '[266]',
    category: 'actinide', categoryName: '锕系金属', period: 7, group: 3, block: 'd', state: 'solid', stateName: '固态',
    electron: '[Rn] 5f¹⁴ 7s² 7p¹', shells: [2, 8, 18, 32, 32, 8, 3], melting: 1627, boiling: null, density: null, electronegativity: 1.3,
    oxidation: '+3', discoverer: '阿伯特·吉奥索等 (伯克利实验室)', year: '1961',
    origin: '纪念回旋加速器发明者欧内斯特·劳伦斯「Ernest Lawrence」。',
    uses: '锕系元素的末位元素。验证重离子相对论轨道收缩及第一电离能的理论物理测试。'
  },
  {
    z: 104, symbol: 'Rf', name: '𬬻 (钅卢)', pinyin: 'lú', pinyinTone: '第二声 (阳平)', enName: 'Rutherfordium', mass: '[267]',
    category: 'transition-metal', categoryName: '过渡金属', period: 7, group: 4, block: 'd', state: 'solid', stateName: '人工合成',
    electron: '[Rn] 5f¹⁴ 6d² 7s²', shells: [2, 8, 18, 32, 32, 10, 2], melting: 2100, boiling: 5500, density: '23 g/cm³ (估)', electronegativity: null,
    oxidation: '+4', discoverer: '杜布纳联合核所 / 伯克利实验室', year: '1969',
    origin: '纪念核物理之父欧内斯特·卢瑟福「Ernest Rutherford」。超锕系与第4周期过渡金属的开始。',
    uses: '人工超重核，纯科学研究，探索超重核稳定岛理论及相对论量子化学。'
  },
  {
    z: 105, symbol: 'Db', name: '𬭊 (钅杜)', pinyin: 'dù', pinyinTone: '第四声 (去声)', enName: 'Dubnium', mass: '[268]',
    category: 'transition-metal', categoryName: '过渡金属', period: 7, group: 5, block: 'd', state: 'solid', stateName: '人工合成',
    electron: '[Rn] 5f¹⁴ 6d³ 7s²', shells: [2, 8, 18, 32, 32, 11, 2], melting: null, boiling: null, density: '29 g/cm³ (估)', electronegativity: null,
    oxidation: '+5', discoverer: '杜布纳联合核所 / 伯克利实验室', year: '1970',
    origin: '源自俄罗斯著名核科学圣地杜布纳市「Dubna」。',
    uses: '人工超重放射性元素，用于研究第5副族超重同族元素化学相似性与相对论效应偏差。'
  },
  {
    z: 106, symbol: 'Sg', name: '𬭛 (钅喜)', pinyin: 'xǐ', pinyinTone: '第三声 (上声)', enName: 'Seaborgium', mass: '[269]',
    category: 'transition-metal', categoryName: '过渡金属', period: 7, group: 6, block: 'd', state: 'solid', stateName: '人工合成',
    electron: '[Rn] 5f¹⁴ 6d⁴ 7s²', shells: [2, 8, 18, 32, 32, 12, 2], melting: null, boiling: null, density: '35 g/cm³ (估)', electronegativity: null,
    oxidation: '+6', discoverer: '阿伯特·吉奥索 / 格伦·西博格等', year: '1974',
    origin: '历史上第一个以尚在人世的科学家格伦·西博格「Glenn T. Seaborg」命名的元素。',
    uses: '气相热色谱化学实验测定六羰基化合物Sg(CO)6的挥发性与络合化学。'
  },
  {
    z: 107, symbol: 'Bh', name: '𬭝 (钅波)', pinyin: 'bō', pinyinTone: '第一声 (阴平)', enName: 'Bohrium', mass: '[270]',
    category: 'transition-metal', categoryName: '过渡金属', period: 7, group: 7, block: 'd', state: 'solid', stateName: '人工合成',
    electron: '[Rn] 5f¹⁴ 6d⁵ 7s²', shells: [2, 8, 18, 32, 32, 13, 2], melting: null, boiling: null, density: '37 g/cm³ (估)', electronegativity: null,
    oxidation: '+7', discoverer: '德国重离子研究所 (GSI Helmholtzzentrum)', year: '1981',
    origin: '纪念量子力学奠基人尼尔斯·玻尔「Niels Bohr」。',
    uses: '气相化学实验成功合成了挥发性羟基氯化物BhO3Cl，证实其遵循周期律第7族规律。'
  },
  {
    z: 108, symbol: 'Hs', name: '𬭞 (钅黑)', pinyin: 'hēi', pinyinTone: '第一声 (阴平)', enName: 'Hassium', mass: '[277]',
    category: 'transition-metal', categoryName: '过渡金属', period: 7, group: 8, block: 'd', state: 'solid', stateName: '人工合成',
    electron: '[Rn] 5f¹⁴ 6d⁶ 7s²', shells: [2, 8, 18, 32, 32, 14, 2], melting: null, boiling: null, density: '41 g/cm³ (估)', electronegativity: null,
    oxidation: '+8', discoverer: '德国达姆施塔特重离子研究所 (GSI)', year: '1984',
    origin: '源自德国黑森州的拉丁名「Hassia」。',
    uses: '成功制备出易挥发的四氧化𬭞(HsO4)，证明其为同族锇(Os)的超重同系物。'
  },
  {
    z: 109, symbol: 'Mt', name: '鿏 (钅麦)', pinyin: 'mài', pinyinTone: '第四声 (去声)', enName: 'Meitnerium', mass: '[278]',
    category: 'transition-metal', categoryName: '过渡金属', period: 7, group: 9, block: 'd', state: 'solid', stateName: '人工合成',
    electron: '[Rn] 5f¹⁴ 6d⁷ 7s²', shells: [2, 8, 18, 32, 32, 15, 2], melting: null, boiling: null, density: '37 g/cm³ (估)', electronegativity: null,
    oxidation: '+9, +3 (预测)', discoverer: '德国重离子研究所 (GSI)', year: '1982',
    origin: '纪念核裂变发现者著名物理学家莉泽·迈特纳「Lise Meitner」。',
    uses: '冷核聚变反应合成，单原子衰变链鉴别，超重元素物理研究。'
  },
  {
    z: 110, symbol: 'Ds', name: '𫟼 (钅达)', pinyin: 'dá', pinyinTone: '第二声 (阳平)', enName: 'Darmstadtium', mass: '[281]',
    category: 'transition-metal', categoryName: '过渡金属', period: 7, group: 10, block: 'd', state: 'solid', stateName: '人工合成',
    electron: '[Rn] 5f¹⁴ 6d⁸ 7s²', shells: [2, 8, 18, 32, 32, 16, 2], melting: null, boiling: null, density: '35 g/cm³ (估)', electronegativity: null,
    oxidation: '+6, +4, +2 (预测)', discoverer: '德国达姆施塔特重离子研究所 (GSI)', year: '1994',
    origin: '纪念重离子研究所所在地德国科学之城达姆施塔特「Darmstadt」。',
    uses: '利用镍-62轰击铅-208靶人工合成，超重核衰变模式物理研究。'
  },
  {
    z: 111, symbol: 'Rg', name: '𫟲 (钅仑)', pinyin: 'lún', pinyinTone: '第二声 (阳平)', enName: 'Roentgenium', mass: '[282]',
    category: 'transition-metal', categoryName: '过渡金属', period: 7, group: 11, block: 'd', state: 'solid', stateName: '人工合成',
    electron: '[Rn] 5f¹⁴ 6d⁹ 7s²', shells: [2, 8, 18, 32, 32, 17, 2], melting: null, boiling: null, density: '28.7 g/cm³ (估)', electronegativity: null,
    oxidation: '+5, +3, -1 (预测)', discoverer: '德国重离子研究所 (GSI)', year: '1994',
    origin: '纪念X射线发现者威廉·康拉德·伦琴「Wilhelm Conrad Röntgen」。',
    uses: '铜族(金同系物)最重成员，强相对论轨道收缩效应理论检验。'
  },
  {
    z: 112, symbol: 'Cn', name: '鎶 (钅哥)', pinyin: 'gē', pinyinTone: '第一声 (阴平)', enName: 'Copernicium', mass: '[285]',
    category: 'transition-metal', categoryName: '过渡金属', period: 7, group: 12, block: 'd', state: 'liquid', stateName: '液态(预测)',
    electron: '[Rn] 5f¹⁴ 6d¹⁰ 7s²', shells: [2, 8, 18, 32, 32, 18, 2], melting: 10, boiling: 67, density: '14 g/cm³ (估)', electronegativity: null,
    oxidation: '+2, +4', discoverer: '德国重离子研究所 (GSI)', year: '1996',
    origin: '纪念天文学家日心说创立者尼古拉·哥白尼「Nicolaus Copernicus」。',
    uses: '强相对论效应导致其极易挥发，可能在室温下呈液体甚至表现出类稀有气体惰性行为。'
  },
  {
    z: 113, symbol: 'Nh', name: '鿭 (钅尔)', pinyin: 'nǐ', pinyinTone: '第三声 (上声)', enName: 'Nihonium', mass: '[286]',
    category: 'post-transition', categoryName: '贫金属', period: 7, group: 13, block: 'p', state: 'solid', stateName: '人工合成',
    electron: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p¹', shells: [2, 8, 18, 32, 32, 18, 3], melting: 430, boiling: 1130, density: '16 g/cm³ (估)', electronegativity: null,
    oxidation: '+1, +3', discoverer: '日本理化学研究所 (RIKEN，森田浩介团队)', year: '2004',
    origin: '源自日本的国名日文读音「Nihon」(日本)，首个由亚洲科学家发现并命名的化学元素。',
    uses: '利用锌-70束轰击铋-209靶合成，单原子链式衰变物理验证。'
  },
  {
    z: 114, symbol: 'Fl', name: '𫓧 (钅夫)', pinyin: 'fú', pinyinTone: '第一声 (阴平)', enName: 'Flerovium', mass: '[289]',
    category: 'post-transition', categoryName: '贫金属', period: 7, group: 14, block: 'p', state: 'solid', stateName: '人工合成',
    electron: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p²', shells: [2, 8, 18, 32, 32, 18, 4], melting: -73, boiling: 107, density: '9.9 g/cm³ (估)', electronegativity: null,
    oxidation: '+2, +4', discoverer: '杜布纳联合核研究所 / 劳伦斯利弗莫尔实验室', year: '1998',
    origin: '纪念弗廖罗夫核反应实验室创始人苏联核物理学家格奥尔基·弗廖罗夫「Georgy Flyorov」。',
    uses: '位于“超重核稳定岛”预言中心边缘，相对论惰性电子对效应研究。'
  },
  {
    z: 115, symbol: 'Mc', name: '镆 (钅莫)', pinyin: 'mò', pinyinTone: '第四声 (去声)', enName: 'Moscovium', mass: '[290]',
    category: 'post-transition', categoryName: '贫金属', period: 7, group: 15, block: 'p', state: 'solid', stateName: '人工合成',
    electron: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p³', shells: [2, 8, 18, 32, 32, 18, 5], melting: 400, boiling: 1100, density: '13.5 g/cm³ (估)', electronegativity: null,
    oxidation: '+1, +3', discoverer: '杜布纳联合核研究所 / 劳伦斯利弗莫尔 / 橡树岭国家实验室', year: '2003',
    origin: '源自俄罗斯莫斯科地区「Moscow Oblast」，杜布纳研究所所在地。',
    uses: '热核聚变钙-48轰击镅-243靶制备，超重核放射性衰变特性研究。'
  },
  {
    z: 116, symbol: 'Lv', name: '𫟷 (钅立)', pinyin: 'lì', pinyinTone: '第四声 (去声)', enName: 'Livermorium', mass: '[293]',
    category: 'post-transition', categoryName: '贫金属', period: 7, group: 16, block: 'p', state: 'solid', stateName: '人工合成',
    electron: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁴', shells: [2, 8, 18, 32, 32, 18, 6], melting: 435, boiling: 812, density: '12.9 g/cm³ (估)', electronegativity: null,
    oxidation: '+2, +4', discoverer: '杜布纳联合核研究所 / 劳伦斯利弗莫尔国家实验室', year: '2000',
    origin: '纪念美国劳伦斯利弗莫尔国家实验室所在地利弗莫尔市「Livermore」。',
    uses: '人工超重放射性元素，钋(Po)的超重同系物性质理论探索。'
  },
  {
    z: 117, symbol: 'Ts', name: '鿬 (石田)', pinyin: 'tián', pinyinTone: '第二声 (阳平)', enName: 'Tennessine', mass: '[294]',
    category: 'post-transition', categoryName: '贫金属', period: 7, group: 17, block: 'p', state: 'solid', stateName: '人工合成',
    electron: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁵', shells: [2, 8, 18, 32, 32, 18, 7], melting: 450, boiling: 610, density: '7.2 g/cm³ (估)', electronegativity: null,
    oxidation: '+1, +3, +5, -1', discoverer: '杜布纳联合核研究所 / 橡树岭国家实验室 / 田纳西大学', year: '2010',
    origin: '纪念对重元素合成作出巨大贡献的美国田纳西州「Tennessee」。',
    uses: '卤族中最重的人工超重元素，由于自旋-轨道耦合效应展现出金属金属性质。'
  },
  {
    z: 118, symbol: 'Og', name: '鿫 (气奥)', pinyin: 'ào', pinyinTone: '第四声 (去声)', enName: 'Oganesson', mass: '[294]',
    category: 'noble-gas', categoryName: '稀有气体', period: 7, group: 18, block: 'p', state: 'solid', stateName: '固态(预测)',
    electron: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶', shells: [2, 8, 18, 32, 32, 18, 8], melting: 52, boiling: 177, density: '5.0 g/cm³ (估)', electronegativity: null,
    oxidation: '+4, +2, 0', discoverer: '尤里·奥加涅相 (Yuri Oganessian) 领衔团队 (杜布纳/利弗莫尔)', year: '2002',
    origin: '纪念世存超重元素物理泰斗尤里·奥加涅相「Yuri Oganessian」，目前周期表原子序数最大的元素。',
    uses: '周期表第7周期终点。强相对论电子重构使得其电子云均匀化(托马斯-费米气体)，预测室温下为半导体固体而非气体。'
  }
];

const CATEGORIES = [
  { key: 'all', name: '全部元素', color: '#38bdf8' },
  { key: 'alkali-metal', name: '碱金属', color: '#f87171' },
  { key: 'alkaline-earth', name: '碱土金属', color: '#fb923c' },
  { key: 'transition-metal', name: '过渡金属', color: '#facc15' },
  { key: 'lanthanide', name: '镧系金属', color: '#e879f9' },
  { key: 'actinide', name: '锕系金属', color: '#c084fc' },
  { key: 'post-transition', name: '贫金属', color: '#38bdf8' },
  { key: 'metalloid', name: '类金属', color: '#2dd4bf' },
  { key: 'reactive-nonmetal', name: '非金属', color: '#4ade80' },
  { key: 'noble-gas', name: '稀有气体', color: '#818cf8' }
];

window.ELEMENTS_DATA = ELEMENTS_DATA;
window.PERIODIC_CATEGORIES = CATEGORIES;
