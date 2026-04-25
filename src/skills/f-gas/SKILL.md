# F-GAS — 含氟温室气体法规 子路由器

> EU 2024/573 + MAC Directive 2006/40/EC

---

## 领域概述

车用空调系统使用的制冷剂受F-GAS法规和MAC指令双重约束。核心要求是GWP（全球变暖潜能值）限制：M1/N1类车辆的空调制冷剂GWP必须≤150。传统制冷剂R-134a(GWP=1430)已被禁止用于新车型，必须使用R-1234yf(GWP=4)或CO2(R-744, GWP=1)等低GWP替代品。

## 适用范围

- **适用类别：** 配备空调系统的所有车辆
- **ICE/PHEV：** 完全适用
- **BEV：** 如使用热泵空调系统，仍需检查制冷剂GWP

## 核心法规文件

| 编号 | 标题 |
|------|------|
| EU 2024/573 | 含氟温室气体法规（新版F-GAS） |
| 2006/40/EC | 车用空调系统指令（MAC Directive） |

## 子决策树

```
用户查询 →
├─ MAC Directive型式认证/标签？ → 加载 references/mac-refrigerant.md
├─ GWP限制和制冷剂清单？ → 加载 references/gwp-limits.md
├─ 泄漏率测试（ECE R82）？ → 加载 references/leakage-testing.md
├─ 制冷剂回收/ELV处置/维修？ → 加载 references/refrigerant-recovery.md
├─ R-1234yf/R-744/R-290安全性对比？ → 加载 references/alternative-safety.md
└─ Gap Analysis？ → 加载 gap-analysis-template.md + 全部references
```

## 交叉引用

- **→ elv/**：制冷剂在报废阶段的回收处理
