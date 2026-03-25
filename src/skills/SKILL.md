# EU汽车市场准入合规检查 — 顶层路由器

> 本文件是AI合规助手的顶层决策树路由器。根据车型参数和查询类型，决定加载哪些法规领域的skill files。

---

## 适用范围

本工具覆盖欧盟汽车市场准入涉及的9个法规领域，面向中国车企（OEM）进入EU市场的合规需求。

---

## 决策树：5步路由

### 第1步：确定车辆类别

根据EU 2018/858 Art.4定义的车辆类别，确定适用的法规范围。

| 类别 | 定义 | 典型车型 |
|------|------|----------|
| **M1** | 载客≤8座（不含驾驶员） | 乘用车、SUV |
| **M2** | 载客>8座，最大质量≤5,000kg | 小型客车 |
| **M3** | 载客>8座，最大质量>5,000kg | 大巴 |
| **N1** | 载货，最大质量≤3,500kg | 轻型货车、皮卡 |
| **N2** | 载货，3,500kg<最大质量≤12,000kg | 中型货车 |
| **N3** | 载货，最大质量>12,000kg | 重型卡车 |
| **O** | 挂车/半挂车（O1-O4按质量分） | 各类挂车 |
| **L** | 两轮/三轮/四轮机动车（L1e-L7e） | 电动摩托、电动自行车 |

**→ 路由影响：**
- M1/N1：GSR全部ADAS要求适用（AEB含行人/骑行者、ELKS、扩大头部碰撞保护区）
- M2/M3/N2/N3：GSR部分ADAS要求适用（ISA、DDAW、ADDW、EDR适用；AEB行人检测阶段性要求不同）
- O类：仅适用部分GSR要求（轮胎、灯光、反光标识等），不涉及ADAS
- L类：不适用GSR（EU 2019/2144），适用EU 168/2013单独框架；电池法规中归入LMT电池类别（≤25kg）或EV电池类别（>25kg）
- 所有M/N类：ISA、DDAW、ADDW、EDR、酒精锁预留、网络安全（R155）、软件更新（R156）均适用

### 第2步：确定动力类型

| 动力类型 | 影响的法规领域 |
|----------|----------------|
| **BEV**（纯电动） | ✅ Battery Regulation完全适用 · ✅ CO2计为0g/km · ❌ F-GAS热泵系统仍可能涉及 · ✅ REACH/ELV/IDIS适用 |
| **PHEV**（插电混动） | ✅ Battery Regulation适用 · ⚠️ CO2按WLTP Utility Factor折算 · ✅ F-GAS适用（ICE+空调系统） · ✅ REACH/ELV/IDIS适用 |
| **ICE**（纯内燃机） | ❌ Battery Regulation不适用（12V SLI电池仅适用基础要求） · ✅ CO2完全适用 · ✅ F-GAS适用 · ✅ REACH/ELV/IDIS适用 |
| **FCEV**（燃料电池） | ⚠️ Battery Regulation适用于辅助电池 · ✅ CO2计为0g/km · ⚠️ F-GAS可能涉及 · ✅ REACH/ELV/IDIS适用 · ⚠️ 额外适用UNECE R134（氢系统安全） |

**→ 路由影响：**
- BEV/PHEV → 加载 `battery/` skill files
- BEV/PHEV/FCEV → CO2领域中作为ZEV/LEV处理，关注super-credits和pooling策略
- ICE/PHEV → 加载 `f-gas/` skill files（制冷剂要求）
- BEV如使用热泵空调 → 仍需检查 `f-gas/` 中的制冷剂GWP要求
- 所有类型 → `gsr/`、`gdpr/`、`reach/`、`elv/`、`isc/`、`idis/` 均适用

### 第3步：确定认证路径

| 认证路径 | 说明 | 当前支持状态 |
|----------|------|-------------|
| **EU WVTA** | 欧盟全车型式认证（Whole Vehicle Type Approval），依据EU 2018/858，一次认证在所有EU/EEA成员国有效 | ✅ 当前版本支持 |
| **单国认证** | 个别成员国的国家型式认证（National Type Approval），仅在该国有效 | ⏳ 后续扩展 |

**→ 路由影响：**
- EU WVTA：所有9个法规领域的标准流程，无national deviations
- 单国认证：demo阶段不支持，如用户选择此路径，提示"当前版本仅支持EU WVTA路径"

### 第4步：确定查询类型

| 查询类型 | 说明 | 加载的模板 |
|----------|------|-----------|
| **Gap Analysis** | 上传车型技术文档，逐项比对法规要求，输出Pass/Fail/Insufficient Info报告 | `{domain}/gap-analysis-template.md` + 相关 `references/` 文件 |
| **文档检查** | 检查特定技术文档是否满足型式认证申请的文档要求 | `{domain}/references/` 中的文档要求类文件 |
| **测试要求** | 查询特定法规项目需要做哪些测试、测试标准是什么、在哪里做 | `{domain}/references/` 中的测试标准类文件 |
| **时间线查询** | 查询特定法规要求的实施时间表（新车型日期 vs 所有新车日期） | `{domain}/references/` 中的时间线类文件 |

### 第5步：确定具体法规领域

根据前4步的结果，加载对应领域的skill files。

| 领域代码 | 领域名称 | 核心法规 | 深度 | 何时加载 |
|----------|----------|----------|------|----------|
| `gsr` | 通用安全法规 | EU 2019/2144 | 深层 | 所有M/N/O类车辆 |
| `battery` | 电池法规 | EU 2023/1542 | 深层 | BEV/PHEV/FCEV车辆 |
| `gdpr` | 车联网数据合规 | EU 2016/679 (GDPR) | 深层 | 所有联网车辆（含摄像头/雷达/V2X的车辆） |
| `co2` | CO2排放报告 | EU 2019/631 | 浅层 | 所有M1/N1类车辆 |
| `reach` | 化学品合规 | EU 1907/2006 (REACH) | 浅层 | 所有车辆 |
| `elv` | 报废车辆 | EU 2000/53/EC + 新提案 | 浅层 | 所有M1/N1类车辆 |
| `f-gas` | 含氟温室气体 | EU 2024/573 + MAC Directive | 浅层 | 配备空调系统的车辆（ICE/PHEV必查；BEV热泵系统需检查） |
| `isc` | 在用车符合性 | EU 2018/1832 等 | 浅层 | 所有已获型式认证的车辆 |
| `idis` | 拆解信息系统 | IDIS数据库规范 | 浅层 | 所有M1/N1类车辆 |

---

## 路由示例

### 示例1：比亚迪BEV SUV（M1类）申请EU WVTA，做全面gap analysis

```
第1步：M1 → GSR全部ADAS要求适用
第2步：BEV → Battery Regulation完全适用，CO2=0，F-GAS检查热泵
第3步：EU WVTA → 标准流程
第4步：Gap Analysis → 加载gap-analysis-template.md
第5步：加载以下领域 →
  ✅ gsr/（完整）
  ✅ battery/（完整）
  ✅ gdpr/（完整，含摄像头/雷达数据合规）
  ✅ co2/（作为ZEV，主要关注pooling和super-credits）
  ✅ reach/（化学品合规）
  ✅ elv/（报废车辆回收率，与battery交叉）
  ⚠️ f-gas/（仅当使用热泵空调时）
  ✅ idis/（拆解信息）
  ⏸ isc/（型式认证后才需要，当前阶段提示即可）
```

### 示例2：蔚来PHEV轿车（M1类）查询AEB测试要求

```
第1步：M1 → GSR全部ADAS要求适用
第2步：PHEV → 不影响AEB测试要求
第3步：EU WVTA → 标准流程
第4步：测试要求 → 加载references中的测试标准文件
第5步：加载 gsr/references/aeb-*.md →
  ✅ gsr/references/aeb-requirements.md（R152技术要求和数值阈值）
  ✅ gsr/references/aeb-test-procedures.md（测试场景和通过标准）
```

### 示例3：小鹏BEV（M1类）查询电池护照时间线

```
第1步：M1 → 不影响Battery Regulation适用性
第2步：BEV → Battery Regulation完全适用
第3步：EU WVTA → 标准流程
第4步：时间线查询 → 加载时间线相关文件
第5步：加载 battery/references/timeline-*.md →
  ✅ battery/references/battery-passport.md（电池护照要求和时间表）
  ✅ battery/references/timeline-overview.md（所有要求的实施时间汇总）
```

---

## 文件结构总览

```
eu-automotive-compliance/
├── SKILL.md                          ← 本文件（顶层路由器）
│
├── gsr/                              【深层交付】
│   ├── SKILL.md                      ← GSR子路由器
│   ├── gap-analysis-template.md      ← Gap Analysis输出模板
│   ├── demo-case.md                  ← 演示案例（模拟BEV SUV）
│   └── references/
│       ├── framework-overview.md     ← EU 2019/2144框架概述+Annex II时间表
│       ├── isa-requirements.md       ← ISA智能限速辅助（EU 2021/1958）
│       ├── aeb-requirements.md       ← AEB自动紧急制动（UNECE R152）
│       ├── elks-requirements.md      ← ELKS紧急车道保持（UNECE R130）
│       ├── ddaw-addw.md              ← DDAW驾驶员困倦警告 + ADDW注意力监测
│       ├── edr-requirements.md       ← EDR事件数据记录器（EU 2022/545）
│       ├── cybersecurity-sums.md     ← 网络安全R155 + 软件更新R156
│       ├── vulnerable-road-users.md  ← 行人/骑行者保护（扩大头部碰撞保护区）
│       └── alcohol-interlock.md      ← 酒精锁预留接口（EU 2021/1243）
│
├── battery/                          【深层交付】
│   ├── SKILL.md                      ← Battery子路由器
│   ├── gap-analysis-template.md
│   ├── demo-case.md
│   └── references/
│       ├── battery-categories.md     ← 电池分类定义（EV/LMT/SLI/Industrial/Portable）
│       ├── carbon-footprint.md       ← 碳足迹声明和限值
│       ├── battery-passport.md       ← 电池护照要求
│       ├── recycled-content.md       ← 回收材料含量要求
│       ├── due-diligence.md          ← 供应链尽职调查
│       ├── labelling-marking.md      ← 标签和标识要求
│       ├── performance-durability.md ← 性能和耐久性要求
│       └── timeline-overview.md      ← 实施时间表汇总
│
├── gdpr/                             【深层交付】
│   ├── SKILL.md                      ← GDPR车联网子路由器
│   ├── gap-analysis-template.md
│   ├── demo-case.md
│   └── references/
│       ├── legal-basis-vehicle.md    ← 车辆数据采集的合法性基础
│       ├── data-categories.md        ← 车辆数据类型分类和处理要求
│       ├── data-subject-rights.md    ← 车辆场景下的数据主体权利
│       ├── cross-border-transfer.md  ← 中国↔欧盟跨境数据传输
│       └── cybersecurity-overlap.md  ← 与R155网络安全的交叉
│
├── co2/                              【浅层交付】
│   ├── SKILL.md
│   ├── gap-analysis-template.md
│   └── references/
│       ├── fleet-targets.md          ← 车队CO2目标和罚款机制
│       ├── reporting-monitoring.md   ← 年度监控和报告流程
│       └── pooling-credits.md        ← Pooling策略和super-credits
│
├── reach/                            【浅层交付】
│   ├── SKILL.md
│   ├── gap-analysis-template.md
│   └── references/
│       ├── svhc-automotive.md        ← 汽车常见SVHC清单和申报要求
│       ├── imds-cdx-scip.md          ← 材料申报系统和SCIP数据库
│       └── exemptions.md             ← 豁免条款（含ELV Annex II）
│
├── elv/                              【浅层交付】
│   ├── SKILL.md
│   ├── gap-analysis-template.md
│   └── references/
│       ├── hazardous-substances.md   ← 有害物质限制和Annex II豁免
│       ├── recyclability-targets.md  ← 可回收率/可利用率目标
│       └── new-elv-proposal.md       ← 新ELV法规提案（EU 2023/0284）
│
├── f-gas/                            【浅层交付】
│   ├── SKILL.md
│   ├── gap-analysis-template.md
│   └── references/
│       ├── mac-refrigerant.md        ← 车用空调制冷剂要求
│       └── gwp-limits.md             ← GWP限制和合规制冷剂清单
│
├── isc/                              【浅层交付】
│   ├── SKILL.md
│   ├── gap-analysis-template.md
│   └── references/
│       ├── emission-isc.md           ← 排放在用车符合性测试
│       └── adas-monitoring.md        ← ADAS系统在用性能监控
│
└── idis/                             【浅层交付】
    ├── SKILL.md
    ├── gap-analysis-template.md
    └── references/
        ├── dismantling-info.md       ← 拆解信息提交要求
        └── recyclability-calculation.md ← 可回收率计算（ISO 22628）
```

**文件总计：约50个文件**
- 顶层路由器：1个
- 深层领域（GSR/Battery/GDPR）：3×(SKILL.md + gap-analysis + demo-case + references) ≈ 27个文件
- 浅层领域（CO2/REACH/ELV/F-GAS/ISC/IDIS）：6×(SKILL.md + gap-analysis + references) ≈ 22个文件

---

## 跨领域交叉引用矩阵

以下矩阵标注9个法规领域之间的主要交叉关系，在每个领域的reference files中需明确引用：

| 交叉关系 | 涉及的具体条款/话题 |
|----------|---------------------|
| **GSR ↔ GDPR** | R155网络安全（数据保护是CSMS的一部分）；EDR数据的隐私要求；ISA/DDAW/ADDW采集的驾驶行为数据 |
| **GSR ↔ ISC** | ADAS系统（AEB/ISA/ELKS）的在用性能退化监控；软件更新（R156）后的ISC重新评估 |
| **Battery ↔ ELV** | 电池回收纳入ELV回收率计算；新ELV提案要求电池可拆卸性；电池中有害物质同时受REACH限制 |
| **Battery ↔ REACH** | 电池中的有害物质（铅、镉等）同时受Battery Reg Art.6和REACH Annex XVII限制 |
| **REACH ↔ ELV** | ELV Annex II有害物质豁免清单与REACH SVHC清单的对照关系；SCIP数据库通报 |
| **CO2 ↔ Battery** | BEV/PHEV的CO2计算方法（WLTP electric range、Utility Factor）与电池性能直接相关 |
| **GDPR ↔ Battery** | 电池护照中的数据保护要求；电池使用历史数据的数据主体权利 |
| **F-GAS ↔ ELV** | 空调制冷剂在报废阶段的回收处理要求 |
| **ELV ↔ IDIS** | IDIS数据库是ELV指令要求的拆解信息提供方式 |
| **ISC ↔ CO2** | 在用车的实际排放与型式认证排放的一致性监控 |

---

## 使用说明

1. 接收到用户查询后，按5步决策树依次判断
2. 根据路由结果，加载对应领域的 `SKILL.md`（子路由器）
3. 子路由器进一步决定加载哪些 `references/` 文件
4. 如果是Gap Analysis查询，同时加载 `gap-analysis-template.md` 作为输出格式模板
5. 注意检查交叉引用矩阵，在报告中标注相关领域的交叉要求

## 跨语言引用格式

gap analysis输出中涉及法规条款与车企技术文档的对照时，统一使用以下格式：

```
法规要求：[法规编号 条款号] — [英文原文要求摘要]
→ 车企文档：《[文档名称]》第X.X节 — "[保留原文语言，通常为中文]"
→ 差距：[具体差距描述]
→ 改进建议：[具体改进措施]
```
