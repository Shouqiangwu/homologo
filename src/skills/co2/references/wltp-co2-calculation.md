# 车辆CO2排放值计算（WLTP）

> EU 2017/1151（WLTP实施法规） + EU 2023/443（PHEV UF修订）

---

## WLTP测试基础

WLTP（Worldwide harmonised Light vehicles Test Procedure）自2018-09-01起取代NEDC成为EU唯一认可的乘用车CO2/油耗测试规程。

| 参数 | WLTP | NEDC（历史对比） |
|------|------|-----------------|
| 测试循环总时长 | 1,800 s | 1,180 s |
| 总里程 | 23.25 km | 11.03 km |
| 最高车速 | 131.3 km/h | 120 km/h |
| 平均车速 | 46.5 km/h | 33.6 km/h |
| 静止时间占比 | 12.6% | 23.7% |
| 测试阶段 | Low/Medium/High/Extra-High | UDC + EUDC |

**WLTP vs NEDC换算：** WLTP CO2值通常比NEDC高15–25%（取决于车型和动力类型）。这意味着旧的NEDC 95 g/km目标相当于WLTP约115 g/km。

## 测试车辆配置 — WLTP特有复杂度

WLTP要求对**最差配置（High）**和**最优配置（Low）**分别测试，最终证书反映车型的**质量和滚动阻力范围**。

| 要素 | 影响 |
|------|------|
| 整备质量（TM） | 每增加100 kg，CO2增加约3–5 g/km |
| 滚动阻力（TR） | 每+1 N/kN，CO2增加约1.5 g/km |
| 空气动力阻力（CdA） | CdA每+0.05 m²，CO2增加约2–3 g/km |
| 选装件 | 天窗、大轮毂、全景顶等影响质量和风阻 |
| 轮胎规格 | 每套不同轮胎均需纳入测试矩阵 |

**关键：** WLTP不出一个固定CO2数，而是每辆具体配置车（VIN级别）都有对应的CO2值，称为**Monitoring CO2 (MCO2)**。

## PHEV特殊计算 — Utility Factor (UF)

PHEV的WLTP CO2 = CD模式（纯电）× UF + CS模式（燃油）× (1-UF)

### EU 2023/443修订后的UF调整（2025-01-01起生效）

| 阶段 | UF方法 | 影响 |
|------|--------|------|
| 2020-2024 | 基于OEM声明的电续航里程 | PHEV官方CO2偏低，实际偏高 |
| **2025起** | **基于OBFCM真实数据校准的UF** | 官方CO2提高约50-80% |
| 2027起 | 进一步收紧UF | PHEV合规难度加大 |

**示例：** 某PHEV车型2024年声明CO2=30 g/km（纯电续航80km），按2025新UF计算后CO2≈50-55 g/km。

### PHEV电续航最小值要求

| 适用时期 | EAER最小值 | 影响 |
|---------|-----------|------|
| 2024前 | 无强制下限 | 许多PHEV仅40-50km续航 |
| 2025-2026 | 建议≥80km（监管施压） | - |
| 2027起 | 可能强制≥100km | 短续航PHEV将被淘汰 |

## BEV/FCEV计算

| 车型 | WLTP CO2值 | 车队合规作用 |
|------|-----------|------------|
| BEV | **0 g/km**（tank-to-wheel） | 全量计入ZLEV积分 |
| FCEV | **0 g/km** | 全量计入ZLEV积分 |
| Range-Extender EV | 按PHEV规则计算 | 取决于UF |

**注意：** EU已开始讨论LCA（全生命周期）CO2核算，但2035年前WLTP仍采用tank-to-wheel方法。

## Monitoring数据报告 — VIN级别CO2

每辆在EU注册的新车需上报以下字段（EU 2021/392 Annex II）：

| 字段 | 说明 |
|------|------|
| VIN | 车辆识别号 |
| MCO2 | WLTP CO2值（g/km） |
| Mass in running order | 整备质量 |
| TM（Test Mass） | 测试质量 |
| Wheel base | 轴距 |
| Track width | 轮距（前/后） |
| Footprint | 足印面积 |
| Fuel type | 燃料类型代码 |
| EAER | 纯电续航里程（PHEV/BEV） |
| Electric energy consumption | 电耗（Wh/km） |

## 合规检查清单

- [ ] 车型WLTP CO2测试是否由EU认可的Technical Service执行？
- [ ] 测试覆盖Low和High配置是否完整？
- [ ] 每个VIN的MCO2是否准确计算并报告？
- [ ] PHEV车型是否按2025新UF方法重新计算？
- [ ] PHEV电续航里程（EAER）是否满足未来监管预期？
- [ ] 是否建立了VIN级CO2数据的内部校验流程？
- [ ] OBFCM数据是否与WLTP值存在显著偏离？

## 常见不合规情况

1. **中国GB/T测试结果直接挪用**：中国国内工况（CLTC）与WLTP差异大，CO2和能耗值不能互换使用。
2. **WLTP测试覆盖不全**：仅测High配置，未测Low配置，导致小质量车型的CO2被高估。
3. **PHEV UF按旧规则计算**：2025后未更新UF模型，导致虚报合规。
4. **选装件影响未申报**：客户选装大轮毂/全景天窗后CO2实际值超出型式认证范围。
5. **电耗数据缺失**：BEV未上报电能消耗，影响CO2 LCA未来合规准备。

## 交叉引用

- **→ fleet-targets.md**：单车MCO2累加为车队平均
- **→ reporting-monitoring.md**：MCO2数据的报告流程
- **→ isc/references/emission-isc.md**：OBFCM与WLTP的一致性监控
- **→ battery/references/performance-durability.md**：BEV电耗与续航一致性
