/**
 * 数据存储单位与进阶度量衡换算器
 * 拓展时间: 2026-08-31
 * Author: Antigravity Agent
 */

const DATA_UNITS = [
  { key: 'b', name: '比特 (Bit)', symbol: 'b', base: '2', bytes: 1 / 8, type: 'bit', desc: '计算机最小数据位 (0 或 1)' },
  { key: 'B', name: '字节 (Byte)', symbol: 'B', base: '2', bytes: 1, type: 'byte', desc: '1 Byte = 8 bits，最基本寻址存储单位' },
  
  // 1000 进制 (SI 国际十进制标准)
  { key: 'KB', name: '千字节 (KB · 1000进制)', symbol: 'KB', base: '1000', bytes: 1e3, type: 'si', desc: '10³ 字节 (SI 国际十进制标准)' },
  { key: 'MB', name: '兆字节 (MB · 1000进制)', symbol: 'MB', base: '1000', bytes: 1e6, type: 'si', desc: '10⁶ 字节 (常用硬盘标称容量标准)' },
  { key: 'GB', name: '吉字节 (GB · 1000进制)', symbol: 'GB', base: '1000', bytes: 1e9, type: 'si', desc: '10⁹ 字节 (U盘/SSD/网络带宽常用标称)' },
  { key: 'TB', name: '太字节 (TB · 1000进制)', symbol: 'TB', base: '1000', bytes: 1e12, type: 'si', desc: '10¹² 字节 (海量存储设备常用标称)' },
  { key: 'PB', name: '拍字节 (PB · 1000进制)', symbol: 'PB', base: '1000', bytes: 1e15, type: 'si', desc: '10¹⁵ 字节 (大数据中心与云存储级别)' },
  { key: 'EB', name: '艾字节 (EB · 1000进制)', symbol: 'EB', base: '1000', bytes: 1e18, type: 'si', desc: '10¹⁸ 字节 (全球互联网数据规模级别)' },

  // 1024 进制 (IEC 二进制标准)
  { key: 'KiB', name: '千位二进制字节 (KiB · 1024进制)', symbol: 'KiB', base: '1024', bytes: 1024, type: 'iec', desc: '2¹⁰ 字节 = 1,024 B (Windows 系统底层统计标准)' },
  { key: 'MiB', name: '兆位二进制字节 (MiB · 1024进制)', symbol: 'MiB', base: '1024', bytes: 1048576, type: 'iec', desc: '2²⁰ 字节 = 1,048,576 B (内存 RAM/操作系统显示)' },
  { key: 'GiB', name: '吉位二进制字节 (GiB · 1024进制)', symbol: 'GiB', base: '1024', bytes: 1073741824, type: 'iec', desc: '2³⁰ 字节 = 1,073,741,824 B (操作系统实际识别容量)' },
  { key: 'TiB', name: '太位二进制字节 (TiB · 1024进制)', symbol: 'TiB', base: '1024', bytes: 1099511627776, type: 'iec', desc: '2⁴⁰ 字节 = 1,099,511,627,776 B' },
  { key: 'PiB', name: '拍位二进制字节 (PiB · 1024进制)', symbol: 'PiB', base: '1024', bytes: 1125899906842624, type: 'iec', desc: '2⁵⁰ 字节 = 1,125,899,906,842,624 B' },
  { key: 'EiB', name: '艾位二进制字节 (EiB · 1024进制)', symbol: 'EiB', base: '1024', bytes: 1152921504606846976, type: 'iec', desc: '2⁶⁰ 字节 = 1,152,921,504,606,846,976 B' }
];

const PRESSURE_UNITS = [
  { key: 'Pa', name: '帕斯卡 (Pa)', symbol: 'Pa', ratio: 1, desc: '国际标准压强单位 (1 N/m²)' },
  { key: 'hPa', name: '百帕 (hPa / mbar)', symbol: 'hPa', ratio: 100, desc: '气象学常用气压单位 (1 hPa = 100 Pa)' },
  { key: 'kPa', name: '千帕 (kPa)', symbol: 'kPa', ratio: 1000, desc: '工程常用压强单位 (1 kPa = 1000 Pa)' },
  { key: 'MPa', name: '兆帕 (MPa)', symbol: 'MPa', ratio: 1e6, desc: '高压容器/材料力学抗压强度常用单位' },
  { key: 'bar', name: '巴 (bar)', symbol: 'bar', ratio: 1e5, desc: '工业常用压强 (1 bar = 100,000 Pa ≈ 1标准大气压)' },
  { key: 'mbar', name: '毫巴 (mbar)', symbol: 'mbar', ratio: 100, desc: '真空技术与天气预报单位' },
  { key: 'psi', name: '磅力/平方英寸 (psi / lbf/in²)', symbol: 'psi', ratio: 6894.757293168, desc: '英美工程与汽车胎压常用 (1 bar ≈ 14.5038 psi)' },
  { key: 'atm', name: '标准大气压 (atm)', symbol: 'atm', ratio: 101325, desc: '海平面标准大气压 (1 atm = 101,325 Pa = 760 mmHg)' },
  { key: 'Torr', name: '毫米汞柱 / 托 (mmHg / Torr)', symbol: 'mmHg', ratio: 101325 / 760, desc: '医学血压测量与高真空度测量常用' },
  { key: 'mmH2O', name: '毫米水柱 (mmH₂O)', symbol: 'mmH₂O', ratio: 9.80665, desc: '暖通空调微差压与风道静压测量单位' },
  { key: 'kgf_cm2', name: '千克力/平方厘米 (kgf/cm² / at)', symbol: 'kgf/cm²', ratio: 98066.5, desc: '工程大气压，俗称“公斤压力”' }
];

const POWER_UNITS = [
  { key: 'W', name: '瓦特 (W)', symbol: 'W', ratio: 1, desc: '国际标准功率单位 (1 J/s)' },
  { key: 'mW', name: '毫瓦 (mW)', symbol: 'mW', ratio: 0.001, desc: '低功耗电子芯片与射频激光功率单位' },
  { key: 'kW', name: '千瓦 (kW)', symbol: 'kW', ratio: 1000, desc: '电机机械、家用电器与电动车功率常用' },
  { key: 'MW', name: '兆瓦 (MW)', symbol: 'MW', ratio: 1e6, desc: '大型发电机组、机车与重型工业功率' },
  { key: 'GW', name: '吉瓦 (GW)', symbol: 'GW', ratio: 1e9, desc: '国家级电网总负荷与三峡大坝水电站级别' },
  { key: 'hp_metric', name: '公制马力 (ps / cv)', symbol: 'ps', ratio: 735.49875, desc: '米制马力 (1 ps = 75 kgf·m/s ≈ 735.5 W)' },
  { key: 'hp_imperial', name: '英制马力 (hp)', symbol: 'hp', ratio: 745.69987158, desc: '英美内燃机马力 (1 hp = 550 ft·lbf/s ≈ 745.7 W)' },
  { key: 'kcal_s', name: '千卡/秒 (kcal/s)', symbol: 'kcal/s', ratio: 4184, desc: '热力学传热速率单位 (1 kcal/s = 4.184 kW)' },
  { key: 'kcal_h', name: '千卡/小时 (kcal/h)', symbol: 'kcal/h', ratio: 4184 / 3600, desc: '空调制冷制热量工业常用单位' },
  { key: 'BTU_h', name: '英热单位/小时 (BTU/h)', symbol: 'BTU/h', ratio: 0.29307107, desc: '北美暖通空调匹数制冷量计算基准' },
  { key: 'ft_lbf_s', name: '英尺·磅力/秒 (ft·lbf/s)', symbol: 'ft·lbf/s', ratio: 1.355817948, desc: '经典英制机械功率做功速率' }
];

const SPEED_UNITS = [
  { key: 'm_s', name: '米/秒 (m/s)', symbol: 'm/s', ratio: 1, desc: '国际标准速度单位 (SI基准)' },
  { key: 'km_h', name: '千米/小时 (km/h)', symbol: 'km/h', ratio: 1 / 3.6, desc: '汽车、公路与高铁交通最常用速度单位' },
  { key: 'km_s', name: '千米/秒 (km/s)', symbol: 'km/s', ratio: 1000, desc: '航天第一宇宙速度 (7.9 km/s) 等天体航天基准' },
  { key: 'mph', name: '英里/小时 (mph / mi/h)', symbol: 'mph', ratio: 0.44704, desc: '美英公路与汽车仪表限速常用' },
  { key: 'knot', name: '节 (knot / kn)', symbol: 'kn', ratio: 1852 / 3600, desc: '船舶航海与航空飞行标准航速 (1节 = 1海里/时 = 1.852 km/h)' },
  { key: 'ft_s', name: '英尺/秒 (ft/s)', symbol: 'ft/s', ratio: 0.3048, desc: '弹道学与英制流体力学常用速度' },
  { key: 'in_s', name: '英寸/秒 (in/s)', symbol: 'in/s', ratio: 0.0254, desc: '精密数控机床与微动步进速度' },
  { key: 'mach', name: '马赫 (Mach · 15℃海平面)', symbol: 'Ma', ratio: 340.3, desc: '声速倍数 (15℃干燥海平面音速约为 340.3 m/s = 1225 km/h)' },
  { key: 'c_percent', name: '光速百分比 (% c)', symbol: '% c', ratio: 2997924.58, desc: '狭义相对论粒子加速器粒子速度基准 (c = 299,792,458 m/s)' }
];

window.DATA_UNITS = DATA_UNITS;
window.PRESSURE_UNITS = PRESSURE_UNITS;
window.POWER_UNITS = POWER_UNITS;
window.SPEED_UNITS = SPEED_UNITS;
