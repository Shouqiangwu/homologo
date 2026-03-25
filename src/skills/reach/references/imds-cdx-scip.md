# 材料申报系统和SCIP数据库

> IMDS/CDX + REACH Art.9 SCIP

---

## 三个关键系统

| 系统 | 全称 | 用途 | 强制性 |
|------|------|------|--------|
| **IMDS** | International Material Data System | 汽车供应链材料数据申报（行业标准） | 行业要求（非法规强制，但OEM普遍要求） |
| **CDX** | Compliance Data Exchange | BOMcheck等合规数据交换平台 | 行业要求 |
| **SCIP** | Substances of Concern In articles as such or in complex objects (Products) | ECHA管理的SVHC通报数据库 | **法规强制**（REACH + Waste Framework Directive Art.9） |

## SCIP数据库通报

- **义务人：** EU市场上投放含SVHC>0.1%(w/w)物品的供应商（含进口商）
- **强制日期：** 2021年1月5日起
- **通报内容：** 物品标识、SVHC名称/浓度/位置、安全使用信息
- **通报方式：** 通过ECHA在线系统提交
- **更新义务：** SVHC候选清单更新后需重新评估

## 合规检查清单

- [ ] 供应链是否在IMDS中完成了材料数据录入？
- [ ] 含SVHC>0.1%的物品是否在SCIP数据库中通报？
- [ ] 通报信息是否包含物品标识、SVHC详情和安全使用信息？
- [ ] 是否建立了SVHC候选清单更新监控机制？

## 交叉引用

- **→ svhc-automotive.md**：哪些SVHC需要通报
- **→ elv/**：ELV有害物质限制与REACH的关系
