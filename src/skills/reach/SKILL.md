# REACH — 化学品合规 子路由器

> EU 1907/2006 (REACH)

---

## 领域概述

REACH法规要求在EU市场销售的所有产品（含汽车零部件）中使用的化学物质必须注册、评估和获得授权。汽车是复杂的多材料产品，涉及数千种化学物质。对中国车企，核心挑战是SVHC（高关注物质）的识别、申报和供应链沟通，以及SCIP数据库的通报义务。

## 适用范围

- **适用类别：** 所有车辆（全部M/N/O/L类）
- **适用对象：** 向EU市场投放物品（articles）的进口商/制造商
- **车辆视为"物品"（article）**，非化学物质本身

## 核心法规文件

| 编号 | 标题 |
|------|------|
| EU 1907/2006 | REACH法规 |
| ECHA SVHC Candidate List | 高关注物质候选清单（持续更新，截至2025年约240种） |
| EU 2018/1881 | REACH修订——纳米材料要求 |

## 子决策树

```
用户查询 →
├─ SVHC识别和申报义务？ → 加载 references/svhc-automotive.md
├─ IMDS/CDX/SCIP数据库？ → 加载 references/imds-cdx-scip.md
├─ Annex XVII限制物质（邻苯/PAHs/PFAS等）？ → 加载 references/annex-xvii-restrictions.md
├─ Annex XIV授权物质（Cr(VI)电镀等）？ → 加载 references/authorization-process.md
├─ ELV Annex II豁免清单？ → 加载 references/exemptions.md
└─ Gap Analysis？ → 加载 gap-analysis-template.md + 全部references
```

## 交叉引用

- **→ elv/**：ELV Annex II有害物质豁免清单与REACH SVHC的交叉
- **→ battery/**：电池中有害物质同时受REACH和Battery Reg限制
