# IDIS — 国际拆解信息系统 子路由器

> IDIS数据库 + ELV Directive 2000/53/EC Art.8

---

## 领域概述

IDIS是汽车行业建立的国际拆解信息数据库（International Dismantling Information System），车辆制造商通过IDIS平台向报废处理企业提供拆解指导信息。ELV指令Art.8要求OEM在新车型上市6个月内提供拆解信息。IDIS不是法规本身，而是行业认可的满足ELV拆解信息要求的标准方式。

## 适用范围

- **适用类别：** M1、N1
- **适用对象：** 车辆制造商（OEM）
- **时间要求：** 新车型上市6个月内提供

## 核心要求

| 编号 | 标题 |
|------|------|
| ELV Dir. Art.8 | OEM必须提供拆解信息 |
| IDIS平台 | www.idis2.com — 行业标准数据平台 |
| ISO 22628 | 可回收率/可利用率计算方法 |

## 子决策树

```
用户查询 →
├─ IDIS平台注册/订阅？ → 加载 references/idis-platform-registration.md
├─ 拆解信息提交内容？ → 加载 references/dismantling-info.md
├─ BEV电池拆解专项？ → 加载 references/bev-battery-dismantling.md
├─ 材料成分文档(ISO 1043/11469)？ → 加载 references/material-composition-docs.md
├─ ISO 22628可回收率计算？ → 加载 references/recyclability-calculation.md
└─ Gap Analysis？ → 加载 gap-analysis-template.md + 全部references
```

## 交叉引用

- **→ elv/**：IDIS是ELV指令拆解信息要求的实现方式
- **→ battery/**：EV电池拆解信息需纳入IDIS
