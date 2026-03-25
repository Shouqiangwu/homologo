# GSR — EU通用安全法规 子路由器

> EU 2019/2144 General Safety Regulation

---

## 领域概述

EU通用安全法规（GSR/GSR2）是欧盟汽车市场准入最核心、最复杂的法规领域。EU 2019/2144作为框架法规，规定了所有新车必须配备的安全系统清单和实施时间表（Annex II）。具体技术要求由一系列委托法规（Delegated Regulations）和UNECE法规（UN Regulations）定义。对中国车企而言，GSR是进入EU市场的第一道硬性门槛，涉及ADAS系统、网络安全、软件更新等多个技术领域。

## 适用车辆类别

- **M1/N1**：全部要求适用（AEB含行人/骑行者、ELKS、ISA、DDAW、ADDW、EDR、扩大头部碰撞保护区等）
- **M2/M3/N2/N3**：部分要求适用（ISA、DDAW、ADDW、EDR适用；AEB按R131而非R152；ELKS不适用，用LDWS替代）
- **O类（挂车）**：仅适用轮胎、灯光、反光标识等被动安全要求
- **L类**：不适用GSR（EU 2019/2144），走EU 168/2013框架

## 核心法规文件清单

### 框架法规
| 编号 | 标题 | EUR-Lex |
|------|------|---------|
| EU 2019/2144 | 通用安全法规（框架，最新合并版2026-01-07） | [链接](https://eur-lex.europa.eu/eli/reg/2019/2144/oj/eng) |

### 委托法规（Delegated Regulations）
| 编号 | 主题 | 适用类别 | 新车型日期 | 所有新车日期 |
|------|------|----------|-----------|-------------|
| EU 2021/1958 | ISA 智能限速辅助 | 全部M/N | 2022-07-06 | 2024-07-07 |
| EU 2021/1341 | DDAW 驾驶员困倦/注意力警告 | 全部M/N | 2022-07-06 | 2024-07-07 |
| EU 2023/2590 | ADDW 高级驾驶员分心警告 | 全部M/N | 2024-07-07 | 2026-07-07 |
| EU 2022/545 | EDR 事件数据记录器（M1/N1） | M1/N1 | 2022-07-06 | 2024-07-07 |
| C(2024)5214 | EDR 事件数据记录器（M2/M3/N2/N3） | M2/M3/N2/N3 | 2026-01-07 | 2029-01-07 |
| EU 2021/1243 | 酒精锁预留接口 | 全部M/N | 2022-07-06 | 2024-07-07 |

### 引用的UNECE法规
| 编号 | 主题 | 适用类别 |
|------|------|----------|
| R152 | AEB 自动紧急制动（M1/N1） | M1/N1 |
| R131 | AEB 自动紧急制动（M2/M3/N2/N3） | M2/M3/N2/N3 |
| R130 | ELKS 紧急车道保持系统 | M1/N1 |
| R155 | 网络安全管理系统（CSMS） | 全部M/N |
| R156 | 软件更新管理系统（SUMS） | 全部M/N |
| R157 | ALKS 自动车道保持系统（L3自动驾驶） | M1/N1（选装） |
| R167 | 驾驶员直接视野 | M1/N1 |
| R169 | EDR 事件数据记录器（UNECE技术规范） | M2/M3/N2/N3 |

## 子决策树

```
用户查询 →
│
├─ AEB相关？
│  ├─ M1/N1 → 加载 references/aeb-requirements.md
│  └─ M2/M3/N2/N3 → 提示：适用R131而非R152，本文件未覆盖
│
├─ ISA相关？ → 加载 references/isa-requirements.md
│
├─ ELKS相关？ → 加载 references/elks-requirements.md
│
├─ DDAW/ADDW相关？ → 加载 references/ddaw-addw.md
│
├─ EDR相关？ → 加载 references/edr-requirements.md
│
├─ 网络安全/软件更新相关？ → 加载 references/cybersecurity-sums.md
│  └─ 同时标注：与 gdpr/ 领域有交叉
│
├─ 行人/骑行者保护相关？ → 加载 references/vulnerable-road-users.md
│
├─ 酒精锁相关？ → 加载 references/alcohol-interlock.md
│
├─ 时间线查询？ → 加载 references/framework-overview.md（含Annex II完整时间表）
│
├─ Gap Analysis（全面检查）？ → 加载 gap-analysis-template.md + 全部references文件
│
└─ 框架概述/适用性查询？ → 加载 references/framework-overview.md
```

## 关键时间节点速查

| 阶段 | 新车型日期 | 所有新车日期 | 涉及要求 |
|------|-----------|-------------|----------|
| Phase 1 | 2022-07-06 | 2024-07-07 | ISA、AEB(C2C)、DDAW、ELKS、EDR(M1/N1)、酒精锁预留、R155/R156 |
| Phase 2 | 2024-07-07 | 2026-07-07 | ADDW、AEB扩展(行人/骑行者)、扩大头部碰撞保护区 |
| Phase 3 | 2026-01-07 | 2029-01-07 | EDR(M2/M3/N2/N3) |

## 交叉引用

- **→ gdpr/**：R155网络安全中的数据保护要求；EDR数据的隐私要求（不得记录VIN后4位）；ISA/DDAW/ADDW采集的驾驶行为数据
- **→ isc/**：ADAS系统（AEB/ISA/ELKS）的在用性能退化监控；R156软件更新后的ISC重新评估
- **→ battery/**：BEV/PHEV车辆的再生制动与AEB的协调（R152中有相关条款）
