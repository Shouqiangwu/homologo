# CO2 — CO2排放报告 子路由器

> EU 2019/631（修订：EU 2023/851）

---

## 领域概述

EU 2019/631设定了乘用车和轻型商用车的车队平均CO2排放目标，逐步收紧直至2035年零排放。对中国车企而言，纯BEV车企（如蔚来、小鹏）计为0g/km，在CO2合规方面天然有优势；但PHEV和ICE车企面临严格的车队排放限制。超标罚款极为严厉（€95/g/km × 注册量），pooling策略是中国小品牌进入EU市场的关键工具。

## 适用范围

- **适用类别：** M1（乘用车）、N1（轻型商用车）
- **适用对象：** 在EU注册新车的制造商（含进口商）
- **BEV/FCEV：** CO2=0g/km，可为车队平均做贡献或参与pooling
- **不适用：** M2/M3/N2/N3（重型车有单独法规EU 2019/1242）

## 核心法规文件

| 编号 | 标题 |
|------|------|
| EU 2019/631 | CO2排放性能标准（乘用车和轻商） |
| EU 2023/851 | 修订版（加强2030和2035目标） |
| EU 2021/392 | 监控和报告实施法规 |

## 子决策树

```
用户查询 →
├─ 车辆WLTP CO2值/PHEV UF/BEV电耗？ → 加载 references/wltp-co2-calculation.md
├─ 车队CO2目标和机制？ → 加载 references/fleet-targets.md
├─ Pooling/ZLEV credits？ → 加载 references/pooling-credits.md
├─ 超标罚款计算/对冲策略？ → 加载 references/penalties-risk.md
├─ 年度监控报告/VIN级数据上报？ → 加载 references/reporting-monitoring.md
└─ Gap Analysis？ → 加载 gap-analysis-template.md + 全部references
```

## 交叉引用

- **→ battery/**：BEV/PHEV电续航里程直接影响CO2计算
- **→ isc/**：在用车实际排放与型式认证排放的一致性
