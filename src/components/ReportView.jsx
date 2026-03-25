import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'

// Main report view with three collapsible sections: Pass / Fail / Needs Evidence
export default function ReportView({ results, domainName }) {
  if (!results) return null

  const { pass = [], fail = [], needs_evidence = [] } = results

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gap Analysis 报告 — {domainName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary bar */}
        <SummaryBar pass={pass.length} fail={fail.length} needsEvidence={needs_evidence.length} />

        {/* Fail section — shown first since it's most important */}
        <ReportSection
          title="不合规项"
          count={fail.length}
          color="fail"
          icon="✕"
          defaultOpen={true}
        >
          {fail.map((item) => (
            <FailItem key={item.id} item={item} />
          ))}
        </ReportSection>

        {/* Needs Evidence section */}
        <ReportSection
          title="信息不足"
          count={needs_evidence.length}
          color="warning"
          icon="!"
          defaultOpen={true}
        >
          {needs_evidence.map((item) => (
            <NeedsEvidenceItem key={item.id} item={item} />
          ))}
        </ReportSection>

        {/* Pass section */}
        <ReportSection
          title="合规项"
          count={pass.length}
          color="pass"
          icon="✓"
          defaultOpen={false}
        >
          {pass.map((item) => (
            <PassItem key={item.id} item={item} />
          ))}
        </ReportSection>
      </CardContent>
    </Card>
  )
}

// Summary statistics bar with proportion indicator
function SummaryBar({ pass, fail, needsEvidence }) {
  const total = pass + fail + needsEvidence
  const failPct = total > 0 ? (fail / total) * 100 : 0
  const warnPct = total > 0 ? (needsEvidence / total) * 100 : 0
  const passPct = total > 0 ? (pass / total) * 100 : 0

  return (
    <div className="rounded-lg bg-muted/50 p-3 space-y-2.5">
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">共 {total} 项检查</span>
        <div className="flex items-center gap-3 ml-auto">
          <span className="flex items-center gap-1.5 text-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-fail" />
            <span className="text-fail font-medium">{fail}</span>
            <span className="text-muted-foreground">不合规</span>
          </span>
          <span className="flex items-center gap-1.5 text-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-warning" />
            <span className="text-warning font-medium">{needsEvidence}</span>
            <span className="text-muted-foreground">待补充</span>
          </span>
          <span className="flex items-center gap-1.5 text-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-pass" />
            <span className="text-pass font-medium">{pass}</span>
            <span className="text-muted-foreground">合规</span>
          </span>
        </div>
      </div>
      {/* Proportion bar */}
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
        {failPct > 0 && <div className="bg-fail transition-all duration-500" style={{ width: `${failPct}%` }} />}
        {warnPct > 0 && <div className="bg-warning transition-all duration-500" style={{ width: `${warnPct}%` }} />}
        {passPct > 0 && <div className="bg-pass transition-all duration-500" style={{ width: `${passPct}%` }} />}
      </div>
    </div>
  )
}

// Collapsible section wrapper
function ReportSection({ title, count, color, icon, defaultOpen, children }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const colorMap = {
    pass: { bg: 'bg-pass-bg', border: 'border-pass/20', text: 'text-pass', iconBg: 'bg-pass' },
    fail: { bg: 'bg-fail-bg', border: 'border-fail/20', text: 'text-fail', iconBg: 'bg-fail' },
    warning: { bg: 'bg-warning-bg', border: 'border-warning/20', text: 'text-warning', iconBg: 'bg-warning' },
  }
  const c = colorMap[color]

  if (count === 0) {
    return (
      <div className={`rounded-lg border ${c.border} ${c.bg} p-3`}>
        <div className="flex items-center gap-2">
          <span className={`flex h-5 w-5 items-center justify-center rounded-full ${c.iconBg} text-white text-xs font-bold`}>
            {icon}
          </span>
          <span className={`font-medium ${c.text}`}>{title}</span>
          <span className="text-sm text-muted-foreground">— 无</span>
        </div>
      </div>
    )
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className={`rounded-lg border ${c.border} ${c.bg}`}>
        <CollapsibleTrigger asChild>
          <button className="flex w-full items-center gap-2 p-3 text-left hover:opacity-80 transition-opacity">
            <span className={`flex h-5 w-5 items-center justify-center rounded-full ${c.iconBg} text-white text-xs font-bold`}>
              {icon}
            </span>
            <span className={`font-medium ${c.text}`}>{title}</span>
            <Badge variant="outline" className={`${c.text} border-current/30 text-xs`}>
              {count}
            </Badge>
            <ChevronIcon open={isOpen} className="ml-auto" />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="space-y-3 px-3 pb-3">
            {children}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}

// Individual fail item
function FailItem({ item }) {
  return (
    <div className="rounded-md border border-fail/10 bg-background p-3 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs text-muted-foreground">{item.id}</span>
            <span className="font-medium text-sm text-foreground">{item.item}</span>
          </div>
          <span className="text-xs text-muted-foreground">{item.regulation}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <PriorityBadge priority={item.priority} />
          {item.blocking && (
            <Badge variant="destructive" className="text-[10px] h-4">阻断认证</Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-1.5 text-sm">
        <div className="flex gap-2">
          <span className="text-muted-foreground shrink-0 w-[4.5rem]">法规要求</span>
          <span className="text-foreground">{item.requirement}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-muted-foreground shrink-0 w-[4.5rem]">实际情况</span>
          <span className="text-foreground">{item.actual}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-fail shrink-0 w-[4.5rem] font-medium">差距</span>
          <span className="text-fail">{item.gap}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-muted-foreground shrink-0 w-[4.5rem]">改进建议</span>
          <span className="text-foreground">{item.recommendation}</span>
        </div>
      </div>
    </div>
  )
}

// Individual needs-evidence item
function NeedsEvidenceItem({ item }) {
  return (
    <div className="rounded-md border border-warning/10 bg-background p-3 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs text-muted-foreground">{item.id}</span>
            <span className="font-medium text-sm text-foreground">{item.item}</span>
          </div>
          <span className="text-xs text-muted-foreground">{item.regulation}</span>
        </div>
        <PriorityBadge priority={item.priority} />
      </div>

      <div className="grid grid-cols-1 gap-1.5 text-sm">
        <div className="flex gap-2">
          <span className="text-muted-foreground shrink-0 w-[4.5rem]">所需证据</span>
          <span className="text-foreground">{item.evidence_needed}</span>
        </div>
        {item.current_status && (
          <div className="flex gap-2">
            <span className="text-muted-foreground shrink-0 w-[4.5rem]">当前状态</span>
            <span className="text-foreground">{item.current_status}</span>
          </div>
        )}
        {item.gap_note && (
          <div className="flex gap-2">
            <span className="text-warning shrink-0 w-[4.5rem] font-medium">风险提示</span>
            <span className="text-warning">{item.gap_note}</span>
          </div>
        )}
        <div className="flex gap-2">
          <span className="text-muted-foreground shrink-0 w-[4.5rem]">获取方式</span>
          <span className="text-foreground">{item.how_to_obtain}</span>
        </div>
      </div>
    </div>
  )
}

// Individual pass item
function PassItem({ item }) {
  return (
    <div className="rounded-md border border-pass/10 bg-background p-3">
      <div className="flex items-center gap-2 flex-wrap mb-1">
        <span className="font-mono text-xs text-muted-foreground">{item.id}</span>
        <span className="font-medium text-sm text-foreground">{item.item}</span>
        <span className="text-xs text-muted-foreground">· {item.regulation}</span>
      </div>
      <div className="text-sm text-muted-foreground">{item.basis}</div>
    </div>
  )
}

function PriorityBadge({ priority }) {
  const map = {
    HIGH: { className: 'bg-fail/10 text-fail border-fail/20', label: '高' },
    MEDIUM: { className: 'bg-warning/10 text-warning border-warning/20', label: '中' },
    LOW: { className: 'bg-muted text-muted-foreground border-border', label: '低' },
  }
  const p = map[priority] || map.MEDIUM
  return (
    <Badge variant="outline" className={`text-[10px] h-4 ${p.className}`}>
      {p.label}优先
    </Badge>
  )
}

function ChevronIcon({ open, className }) {
  return (
    <svg
      className={`h-4 w-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''} ${className}`}
      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}
