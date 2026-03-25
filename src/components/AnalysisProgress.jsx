import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

// Step-by-step progress indicator during analysis
export default function AnalysisProgress({ checklist, progress, isRunning }) {
  if (!checklist || checklist.length === 0) return null

  const allDone = progress && progress.current >= checklist.length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          分析进度
          {isRunning && <RunningDot />}
          {allDone && !isRunning && (
            <span className="text-xs font-normal text-pass">分析完成</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1.5">
          {checklist.map((item, index) => {
            const status = getItemStatus(index, progress)
            return (
              <div key={index} className="flex items-center gap-2.5 text-sm">
                <StatusIcon status={status} />
                <span className={
                  status === 'done' ? 'text-foreground' :
                  status === 'checking' ? 'text-primary font-medium' :
                  'text-muted-foreground'
                }>
                  {item}
                </span>
                {status === 'checking' && (
                  <span className="text-xs text-primary animate-pulse">正在检查...</span>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

function getItemStatus(index, progress) {
  if (!progress) return 'pending'
  if (index < progress.current) return 'done'
  if (index === progress.current) return progress.status || 'checking'
  return 'pending'
}

function StatusIcon({ status }) {
  if (status === 'done') {
    return (
      <svg className="h-4 w-4 text-pass shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    )
  }
  if (status === 'checking') {
    return (
      <div className="h-4 w-4 shrink-0 flex items-center justify-center">
        <div className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
      </div>
    )
  }
  // pending
  return (
    <div className="h-4 w-4 shrink-0 flex items-center justify-center">
      <div className="h-2 w-2 rounded-full border border-muted-foreground/40" />
    </div>
  )
}

function RunningDot() {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
    </span>
  )
}
