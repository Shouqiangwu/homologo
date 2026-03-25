# Battery — EU电池法规 子路由器

> EU 2023/1542 Regulation concerning batteries and waste batteries

---

## 领域概述

EU 2023/1542是全球首个覆盖电池全生命周期的综合性法规，从原材料采购到生产、使用、回收全链条设定强制性要求。对中国电动车企而言，这是继GSR之后第二大合规挑战，因为涉及供应链溯源、碳足迹计算、电池护照数据系统等全新要求。法规于2023年8月17日生效，各项要求分阶段实施至2036年。

## 适用条件

- **BEV车辆**：EV电池（为M/N/O类车辆牵引提供电力的电池）完全适用
- **PHEV车辆**：EV电池完全适用
- **FCEV车辆**：辅助电池适用（如有）
- **ICE车辆**：仅12V SLI电池适用基础要求（标签、有害物质限制）
- **L类电动车**：按重量分类 — ≤25kg为LMT电池，>25kg为EV电池

## 电池分类（Art.3 定义）

| 电池类别 | 定义 | 典型应用 |
|---------|------|---------|
| **EV电池** | 为M/N/O类混合动力或纯电动车辆牵引供电的电池；或为L类车辆牵引供电且重量>25kg的电池 | BEV/PHEV乘用车动力电池 |
| **LMT电池** | 密封、≤25kg、为L类车辆或电动自行车/滑板车等供电 | 电动自行车、电动滑板车电池 |
| **SLI电池** | 用于车辆启动、照明和点火（Starting, Lighting, Ignition） | 12V启动电池 |
| **工业电池** | 专为工业用途设计；或>5kg且不属于其他类别 | 储能系统、叉车电池 |
| **便携式电池** | 密封、≤5kg、非工业/非SLI/非LMT用途 | 手机、笔记本电池 |

## 核心法规文件

| 编号 | 标题 | EUR-Lex |
|------|------|---------|
| EU 2023/1542 | 电池和废旧电池法规（主体法规） | [链接](https://eur-lex.europa.eu/eli/reg/2023/1542/oj/eng) |
| EU 2025/1561 | 修正案——供应链尽职调查延期至2027年8月 | [链接](https://eur-lex.europa.eu/eli/reg/2025/1561/oj/eng) |
| 委托法规（碳足迹计算方法） | 碳足迹声明的计算规则 | 已发布/部分待定 |
| 委托法规（回收效率计算方法） | 回收效率和材料回收率的计算规则 | 2025年7月生效 |

## 子决策树

```
用户查询 →
│
├─ 碳足迹相关？ → 加载 references/carbon-footprint.md
│
├─ 电池护照相关？ → 加载 references/battery-passport.md
│
├─ 回收材料含量相关？ → 加载 references/recycled-content.md
│
├─ 供应链尽职调查相关？ → 加载 references/due-diligence.md
│
├─ 标签/标识相关？ → 加载 references/labelling-marking.md
│
├─ 性能/耐久性相关？ → 加载 references/performance-durability.md
│
├─ 电池分类判断？ → 加载 references/battery-categories.md
│
├─ 时间线查询？ → 加载 references/timeline-overview.md
│
├─ Gap Analysis（全面检查）？ → 加载 gap-analysis-template.md + 全部references文件
│
└─ 有害物质限制？ → 加载 references/battery-categories.md
    └─ 同时标注：与 reach/ 和 elv/ 领域有交叉
```

## 交叉引用

- **→ reach/**：电池中有害物质（铅、镉等）同时受REACH Annex XVII限制
- **→ elv/**：EV电池回收纳入ELV回收率计算；新ELV提案要求电池可拆卸性
- **→ gdpr/**：电池护照中的数据保护要求；电池使用历史数据的数据主体权利
- **→ co2/**：BEV/PHEV的CO2排放计算与电池性能（电续航里程、Utility Factor）直接相关
