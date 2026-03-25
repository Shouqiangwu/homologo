import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Cross-domain issue summary
export default function CrossReferences({ references }) {
  if (!references || references.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          跨领域问题汇总
          <Badge variant="outline" className="text-xs">{references.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {references.map((ref, index) => (
            <div key={index} className="flex items-start gap-3 rounded-lg border border-border p-3">
              {/* Arrow indicator */}
              <div className="flex shrink-0 items-center gap-1.5 pt-0.5">
                <Badge variant="secondary" className="text-[10px] h-5">
                  {ref.from_domain}
                </Badge>
                <svg className="h-3 w-3 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <Badge variant="secondary" className="text-[10px] h-5">
                  {ref.to_domain}
                </Badge>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-sm flex-wrap">
                  <span className="text-foreground font-medium">{ref.from_item}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{ref.issue}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
