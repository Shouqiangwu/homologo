# Pooling策略和ZLEV Credits

> EU 2019/631 Art.6 + Annex I Point 6.3

---

## Pooling（排放额度共享）

### 机制

不同制造商可组成**pool**（联合体），共同计算车队平均CO2排放：
- pool内所有制造商的注册车辆合并计算平均排放
- BEV/FCEV制造商（0g/km）加入pool可大幅拉低pool平均值
- pool内不合规的责任由pool成员共同承担

### 对中国车企的战略价值

| 场景 | 策略 |
|------|------|
| 纯BEV品牌（蔚来/小鹏等） | **出售**pooling额度给EU传统车企，获取收入（类似Tesla的做法） |
| 有ICE/PHEV的品牌（比亚迪等） | 利用自身BEV车型拉低车队平均，或加入其他pool |
| 新进入EU的小品牌 | 加入现有pool避免因注册量小导致的统计波动性罚款 |

### Pooling申请

- 制造商需在日历年前向欧委会申请组成pool
- pool内需有一个联系实体负责合规报告
- pool成员共同对超标罚款承担连带责任

## ZLEV Credits（零/低排放车辆积分）

### 2025-2029机制

| 参数 | 数值 |
|------|------|
| ZLEV定义 | CO2排放<50 g/km的车辆（BEV、FCEV、部分PHEV） |
| ZLEV基准 | 车队中ZLEV占比15%（2025-2029） |
| 超额奖励 | ZLEV占比每超过基准1个百分点 → CO2目标放宽1%，最大5% |
| 未达基准 | 不额外惩罚，但失去放宽机会 |

### 2030起

- ZLEV基准取消（因为目标本身已极为严格）
- 新引入：小型电动车"super credits"（EU本土生产的小型平价BEV可获额外计数权重）

## 合规检查清单

- [ ] 是否评估了pooling策略的必要性？
- [ ] 如为纯BEV品牌，是否考虑出售pooling额度？
- [ ] 如有ICE/PHEV车型，是否计算了车队平均CO2？
- [ ] ZLEV占比是否达到15%基准？
- [ ] 是否在日历年前完成pool申请？

## 交叉引用

- **→ fleet-targets.md**：pooling直接影响制造商特定目标的合规
- **→ battery/**：BEV电续航里程影响PHEV的Utility Factor和CO2值
