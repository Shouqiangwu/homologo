# ELV — 报废车辆指令 子路由器

> EU Directive 2000/53/EC + 新提案EU 2023/0284

---

## 领域概述

ELV指令规定了报废车辆的处理、回收和再利用要求，包括有害物质限制和可回收率目标。现行指令（2000/53/EC）正在被新法规提案（2023/0284）取代，新提案将大幅加强要求，特别是在可回收设计、回收材料含量和生产者延伸责任（EPR）方面。

## 适用范围

- **适用类别：** M1、N1（现行指令）；新提案可能扩展至M2/M3/N2/N3
- **适用对象：** 车辆制造商（OEM）、进口商

## 核心法规文件

| 编号 | 标题 |
|------|------|
| EU 2000/53/EC | 报废车辆指令（现行） |
| EU 2023/0284(COD) | 新ELV法规提案（立法进行中） |

## 子决策树

```
用户查询 →
├─ 铅/汞/镉/六价铬限制？ → 加载 references/hazardous-substances.md
├─ 可回收率/可利用率(ISO 22628)？ → 加载 references/recyclability-targets.md
├─ 拆解信息手册（Art.8）？ → 加载 references/dismantling-manual-elv.md
├─ 新ELV法规提案整体？ → 加载 references/new-elv-proposal.md
├─ 回收材料含量（塑料/钢/铝）？ → 加载 references/recycled-content-requirements.md
└─ Gap Analysis？ → 加载 gap-analysis-template.md + 全部references
```

## 交叉引用

- **→ reach/**：有害物质限制交叉（ELV Annex II豁免 vs REACH SVHC）
- **→ battery/**：EV电池回收纳入ELV回收率
- **→ idis/**：IDIS是ELV拆解信息要求的实现方式
