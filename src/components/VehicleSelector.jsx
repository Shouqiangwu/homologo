import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'

// Editable parameter definitions per domain
const EDITABLE_PARAMS = {
  gsr: {
    title: 'GSR — 关键ADAS参数',
    fields: [
      { label: 'AEB C2C 零接触速度 (km/h)', path: ['gsr', 'aeb', 'c2c_zero_contact_speed_kmh'], type: 'number' },
      { label: 'AEB C2C 60km/h残余速度 (km/h)', path: ['gsr', 'aeb', 'c2c_60kmh_residual_speed_kmh'], type: 'number' },
      { label: 'AEB C2B 骑行者检测', path: ['gsr', 'aeb', 'c2b_installed'], type: 'boolean' },
      { label: 'ISA 支持欧洲标志', path: ['gsr', 'isa', 'eu_sign_support'], type: 'boolean' },
      { label: 'ISA 地图供应商', path: ['gsr', 'isa', 'map_provider'], type: 'text' },
      { label: 'ADDW DMS数据上传云端', path: ['gsr', 'addw', 'data_upload_to_cloud'], type: 'boolean' },
      { label: 'EDR 碰撞前记录窗口 (秒)', path: ['gsr', 'edr', 'pre_crash_window_seconds'], type: 'number' },
      { label: 'CSMS证书已获取', path: ['gsr', 'cybersecurity', 'csms_certificate'], type: 'boolean' },
    ],
  },
  battery: {
    title: 'Battery — 关键电池参数',
    fields: [
      { label: '碳足迹 (kg CO₂e/kWh)', path: ['battery', 'carbon_footprint', 'value_kg_co2e_per_kwh'], type: 'number' },
      { label: '碳足迹方法学', path: ['battery', 'carbon_footprint', 'methodology'], type: 'text' },
      { label: '第三方验证', path: ['battery', 'carbon_footprint', 'third_party_verified'], type: 'boolean' },
      { label: 'CE标志', path: ['battery', 'labeling', 'ce_marking'], type: 'boolean' },
      { label: 'BMS 第三方只读接口', path: ['battery', 'bms', 'third_party_read_access'], type: 'boolean' },
    ],
  },
  gdpr: {
    title: 'GDPR — 关键数据合规参数',
    fields: [
      { label: '数据存储位置', path: ['gdpr', 'data_storage', 'location'], type: 'text' },
      { label: '已签署SCCs', path: ['gdpr', 'data_storage', 'sccs_signed'], type: 'boolean' },
      { label: 'EU数据中心', path: ['gdpr', 'data_storage', 'eu_data_center'], type: 'boolean' },
      { label: '分目的独立同意', path: ['gdpr', 'consent', 'separate_purposes'], type: 'boolean' },
    ],
  },
}

export default function VehicleSelector({ vehicles, selectedVehicleId, onVehicleSelect, params, onParamsChange, onParamsReset }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const vehicle = params.vehicle

  const updateParam = (path, value) => {
    const newParams = JSON.parse(JSON.stringify(params))
    let obj = newParams
    for (let i = 0; i < path.length - 1; i++) obj = obj[path[i]]
    obj[path[path.length - 1]] = value
    onParamsChange(newParams)
  }

  const getParam = (path) => {
    let obj = params
    for (const key of path) {
      if (obj == null) return undefined
      obj = obj[key]
    }
    return obj
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>车型选择</CardTitle>
        <CardDescription>选择待检查的车型，展开可编辑关键技术参数</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Vehicle selection tabs */}
        <div className="flex gap-2 flex-wrap">
          {Object.values(vehicles).map((v) => {
            const vp = v.params.vehicle
            const isSelected = v.id === selectedVehicleId
            return (
              <button
                key={v.id}
                onClick={() => onVehicleSelect(v.id)}
                className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-all flex-1 min-w-[200px]
                  ${isSelected ? 'border-primary bg-primary/5 ring-1 ring-primary/30' : 'border-border bg-card hover:border-primary/50 hover:bg-primary/5'}`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-bold text-sm
                  ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  {vp.name.split(' ').pop().slice(0, 3)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm text-foreground">{vp.name_cn}</span>
                    <Badge variant="outline" className="text-[10px] h-4">{vp.type}</Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">{vp.manufacturer}</span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Selected vehicle detail */}
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-semibold text-foreground">{vehicle.name_cn}</span>
            <span className="text-muted-foreground text-sm">{vehicle.name}</span>
            <Badge variant="outline">{vehicle.type}</Badge>
            <Badge variant="outline">{vehicle.category}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {vehicle.manufacturer} · {vehicle.production_year} · 目标市场 {vehicle.target_markets.join(', ')}
          </p>
          <p className="text-sm text-muted-foreground">
            最大总质量 {vehicle.max_mass_kg}kg · 最高车速 {vehicle.max_speed_kmh}km/h
          </p>
        </div>

        {/* Editable parameters */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
                <ChevronIcon open={isExpanded} />
                技术参数详情（可编辑）
              </Button>
            </CollapsibleTrigger>
            {isExpanded && (
              <Button variant="ghost" size="xs" onClick={onParamsReset} className="text-muted-foreground">重置为默认值</Button>
            )}
          </div>
          <CollapsibleContent>
            <div className="mt-3 space-y-5">
              {Object.entries(EDITABLE_PARAMS).map(([domainId, section]) => (
                <div key={domainId}>
                  <h4 className="text-sm font-medium text-foreground mb-2">{section.title}</h4>
                  <div className="rounded-md border border-border overflow-hidden">
                    <table className="w-full text-sm">
                      <tbody>
                        {section.fields.map((field) => (
                          <tr key={field.path.join('.')} className="border-b border-border last:border-0">
                            <td className="px-3 py-2 text-muted-foreground bg-muted/30 w-[55%] text-xs">{field.label}</td>
                            <td className="px-3 py-1.5 text-foreground text-xs">
                              <FieldInput field={field} value={getParam(field.path)} onChange={(val) => updateParam(field.path, val)} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Upload placeholder */}
        <div className="flex items-center gap-3 rounded-lg border border-dashed border-border p-3 text-muted-foreground">
          <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <div className="flex-1">
            <span className="text-sm">上传技术文档</span>
            <Badge variant="outline" className="ml-2 text-[10px]">Beta</Badge>
            <p className="text-xs text-muted-foreground/70 mt-0.5">此功能开发中，当前请使用示例车型或手动填写参数</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function FieldInput({ field, value, onChange }) {
  if (field.type === 'boolean') {
    return (
      <button onClick={() => onChange(!value)}
        className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium transition-colors ${value ? 'bg-pass/10 text-pass' : 'bg-fail/10 text-fail'}`}>
        <span className={`h-2 w-2 rounded-full ${value ? 'bg-pass' : 'bg-fail'}`} />
        {value ? '是' : '否'}
      </button>
    )
  }
  if (field.type === 'number') {
    return <input type="number" value={value ?? ''} onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
      className="w-24 rounded-md border border-border bg-background px-2 py-0.5 text-xs text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/30" />
  }
  if (field.type === 'select') {
    return <select value={value ?? ''} onChange={(e) => onChange(e.target.value)}
      className="rounded-md border border-border bg-background px-2 py-0.5 text-xs text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/30">
      {field.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  }
  return <input type="text" value={value ?? ''} onChange={(e) => onChange(e.target.value)}
    className="w-full rounded-md border border-border bg-background px-2 py-0.5 text-xs text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/30" />
}

function ChevronIcon({ open }) {
  return (
    <svg className={`h-4 w-4 transition-transform ${open ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}
