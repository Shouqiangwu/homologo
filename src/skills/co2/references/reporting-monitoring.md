# 年度监控和报告流程（注册与EEA数据）

> EU 2021/392 实施法规 + EU 2019/631 Art.7

---

## 整体报告流程时间线

```
日历年 N
 │
 ├─ 全年：成员国接收新车注册 → 自动收集WLTP CO2数据
 │
日历年 N+1
 ├─ 02-28前：成员国向EEA（欧洲环境署）提交上一年数据
 ├─ 03-04月：EEA汇总发布初步数据（Provisional Data）
 ├─ 04-06月：制造商核查自身数据，可提交修正请求
 ├─ 07-10月：EEA发布最终数据（Final Data）
 ├─ 10-12月：欧委会计算各制造商超标情况
日历年 N+2
 └─ 次年：发布正式excess emission premium通知，缴纳罚款
```

## 制造商需完成的前置注册

### OEM在EU Registry注册

| 项目 | 要求 | 时限 |
|------|------|------|
| 制造商注册（Manufacturer ID） | 向欧委会提交OEM基本信息、EU法人实体 | 首次EU销售前 |
| Designated Representative | 若OEM总部在EU外，需指定EU代表 | 首次EU销售前 |
| Pool申请（如适用） | 向欧委会提交pool协议 | 日历年N开始前 |
| 小批量豁免申请 | 1,000-300,000辆车企可申请 | 每年4月前提交次年申请 |

### 中国车企首次进入EU的实操

| 步骤 | 具体操作 |
|------|---------|
| 1. 指定EU代表 | 通常选择德/荷/比的合规服务公司 |
| 2. 注册制造商ID | 通过EU CIRCABC系统或DG CLIMA联系 |
| 3. 确定是否加入pool | 评估车队CO2与目标差距 |
| 4. 建立数据报告流程 | 与EU代表签约由其代为提交VIN级数据 |

## VIN级数据上报要素

每辆新注册车在EU Registry中的数据条目（EU 2021/392 Annex II完整列表）：

### 车辆标识
| 字段 | 说明 |
|------|------|
| VIN | 17位车辆识别号 |
| Type/Variant/Version | 型式认证 Type/Variant/Version |
| Type approval number | 型式认证编号 |
| Make | 品牌 |
| Commercial name | 商业名称 |
| Category | M1/N1 |

### CO2和技术参数
| 字段 | 说明 |
|------|------|
| CO2 emissions WLTP | WLTP测试值（g/km） |
| Fuel mode CO2 (PHEV only) | PHEV纯燃油模式CO2 |
| Mass in running order | 整备质量（kg） |
| Test mass | 测试质量（kg） |
| WLTP test mass | WLTP测试质量 |
| Wheel base | 轴距（mm） |
| Track width front/rear | 前/后轮距（mm） |
| Footprint | 足印面积（m²） |

### 燃料和驱动
| 字段 | 说明 |
|------|------|
| Fuel type | 代码（petrol=1, diesel=2, LPG=3, NG=4, electric=11, hydrogen=12, hybrid=13等） |
| Fuel mode | Mono/Bi/Flex |
| Engine capacity | 排量（cm³） |
| Engine power | 最大功率（kW） |
| Electric energy consumption | 电耗（Wh/km） |
| EAER | 纯电续航（km） |
| Innovative technology | Eco-innovation技术代码和减排量 |

### OBFCM数据（2021起）
| 字段 | 说明 |
|------|------|
| Real world fuel/electricity consumption | 实际油耗/电耗 |
| Real world CO2 | 计算后的实际CO2 |

## 数据质量要求

| 问题 | 后果 |
|------|------|
| VIN重复 | EEA退回数据 |
| CO2与Type approval不匹配 | 触发调查 |
| 缺失PHEV电续航 | 按纯ICE计算CO2（对OEM不利） |
| OBFCM数据缺失 | 2027起可能强制罚款 |

## 核查期流程（制造商可主动纠正）

### 初步数据发布后（通常4月）

OEM可在欧委会指定的30天核查期内提交：
- 数据错误更正
- 缺失数据补充
- 归属调整（某车是否应归本OEM）

### 最终数据发布后（通常10月）

原则上不再接受大规模修改，仅处理系统性错误。

## 年度报告之外的其他义务

### 技术报告（Technical Annex）

每年3月底，OEM需向欧委会提交：
- 车队CO2趋势分析
- ZLEV占比
- 未来3年产品规划（可选但被强烈建议）

### 内部质量管理

- WLTP测试记录至少保存10年
- VIN级数据至少保存6年
- OBFCM数据至少保存5年

## 合规检查清单

- [ ] 是否在EU注册了制造商ID？
- [ ] 是否指定了EU法人代表（OEM总部在EU外时）？
- [ ] 是否建立了VIN级CO2数据的生成、校验、上报流程？
- [ ] 所有新车VIN是否完整报告？
- [ ] 数据是否按EU 2021/392 Annex II完整字段填写？
- [ ] 是否利用核查期（Provisional Data阶段）检查并纠正数据错误？
- [ ] OBFCM数据是否随车辆上报？
- [ ] Eco-innovation技术是否申报了减排积分？
- [ ] 测试记录保存是否≥10年？

## 常见不合规情况

1. **首次出口EU未注册制造商ID**：国内OEM直接通过经销商销售，未走正式注册流程，新车上牌遇阻。
2. **VIN重复或格式错误**：中国OEM的VIN生成逻辑与EU要求有差异，导致EEA退回。
3. **PHEV数据报成纯ICE**：未报告EAER和电耗，CO2被按ICE燃油模式计算。
4. **未利用核查期**：初步数据发布后未审核就接受，到最终数据发布才发现错误，被动罚款。
5. **OBFCM上报缺失**：2021年后新车未配置OBFCM或数据链路未建立。
6. **小批量豁免申请延误**：1,000-10,000辆车企未按4月截止日前提交次年豁免申请。

## 交叉引用

- **→ fleet-targets.md**：VIN级CO2累加为车队平均
- **→ penalties-risk.md**：数据错误可能导致错误罚款
- **→ isc/references/emission-isc.md**：OBFCM是ISC排放监控的数据源
- **→ wltp-co2-calculation.md**：MCO2数据的生成
