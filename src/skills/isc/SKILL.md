# ISC — 在用车符合性 子路由器

> EU 2018/858 Art.52-54 + EU 2018/1832（排放ISC）

---

## 领域概述

ISC（In-Service Conformity）是型式认证后的持续合规监控机制，确保已上市车辆在实际使用中仍满足型式认证时的性能要求。包括排放ISC（尾气排放一致性）和ADAS ISC（安全系统性能退化监控）。对中国车企，ISC意味着获得型式认证不是终点——上市后仍需持续证明合规。

## 适用范围

- **适用类别：** 所有已获EU型式认证的M/N类车辆
- **触发时机：** 型式认证后，车辆在EU市场实际使用期间
- **适用对象：** OEM（承担ISC义务）、市场监督机构（执行监督）

## 核心法规文件

| 编号 | 标题 |
|------|------|
| EU 2018/858 | 型式认证框架法规（Art.52-54 市场监督和ISC） |
| EU 2018/1832 | 排放ISC实施法规（排放相关） |
| EU 2019/2144 | GSR（ADAS系统ISC监控要求） |

## 子决策树

```
用户查询 →
├─ 排放ISC？ → 加载 references/emission-isc.md
├─ ADAS系统在用监控？ → 加载 references/adas-monitoring.md
└─ Gap Analysis？ → 加载 gap-analysis-template.md
```

## 交叉引用

- **→ gsr/**：AEB/ISA/ELKS在用性能退化属于ISC监控
- **→ gsr/references/cybersecurity-sums.md**：R156 OTA更新后可能触发ISC重新评估
- **→ co2/**：实际排放vs型式认证排放的一致性
