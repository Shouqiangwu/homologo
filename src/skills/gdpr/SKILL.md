# GDPR — 车联网数据合规 子路由器

> EU 2016/679 (GDPR) + EDPB Guidelines 01/2020 on Connected Vehicles

---

## 领域概述

GDPR不是汽车法规，但智能网联汽车（connected vehicles）大量采集和处理个人数据，使其成为中国车企进入EU市场必须解决的合规领域。EDPB（欧洲数据保护委员会）2021年发布的Guidelines 01/2020专门针对车联网场景给出了GDPR适用指导。对中国车企而言，核心挑战有三：(1) 车辆数据采集的合法性基础（同意为主，合同和合法利益为辅）；(2) DMS/摄像头等采集的生物识别数据属于GDPR Art.9特殊类别数据；(3) 中国↔EU跨境数据传输无充分性认定，需依赖SCCs等替代机制。

## 适用条件

- **所有联网车辆**：配备T-BOX、OTA、远程诊断等功能的车辆
- **所有配备摄像头/雷达的车辆**：ADAS传感器采集的环境数据可能包含个人数据
- **所有配备DMS的车辆**：驾驶员监测摄像头采集生物识别数据
- **所有提供车联网服务的车辆**：导航、语音助手、远程控制等
- **特别关注**：数据传输回中国（跨境传输）的场景

## 核心法规文件

| 编号 | 标题 | 链接 |
|------|------|------|
| EU 2016/679 | 通用数据保护条例（GDPR） | [EUR-Lex](https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng) |
| EDPB Guidelines 01/2020 | 车联网场景下的个人数据处理指南（v2.0, 2021年3月） | [EDPB](https://www.edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-012020-processing-personal-data-context_en) |
| EU 2002/58/EC | ePrivacy指令（Art.5(3)适用于车辆终端设备） | [EUR-Lex](https://eur-lex.europa.eu/eli/dir/2002/58/oj/eng) |
| UNECE R155 | 网络安全（CSMS中的数据保护要求） | 见 gsr/references/cybersecurity-sums.md |

## 子决策树

```
用户查询 →
│
├─ 数据采集的合法性基础？ → 加载 references/legal-basis-vehicle.md
│
├─ 车辆采集了哪些个人数据？ → 加载 references/data-categories.md
│
├─ 数据主体权利如何在车辆中实现？ → 加载 references/data-subject-rights.md
│
├─ 数据传输回中国合规吗？ → 加载 references/cross-border-transfer.md
│
├─ 与R155网络安全的关系？ → 加载 references/cybersecurity-overlap.md
│
├─ Gap Analysis（全面检查）？ → 加载 gap-analysis-template.md + 全部references文件
│
└─ DPIA（数据保护影响评估）需要吗？ → 加载 references/legal-basis-vehicle.md（含DPIA触发条件）
```

## 交叉引用

- **→ gsr/references/cybersecurity-sums.md**：R155 CSMS中包含数据保护要求
- **→ gsr/references/ddaw-addw.md**：DMS数据属于GDPR Art.9特殊类别数据
- **→ gsr/references/edr-requirements.md**：EDR数据匿名化要求与GDPR关系
- **→ gsr/references/isa-requirements.md**：ISA数据记录限制的GDPR背景
- **→ battery/references/battery-passport.md**：电池护照中所有权数据的GDPR要求
