import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import domainConfig from '@/data/domain-config.json'

const domains = Object.values(domainConfig)

// Domain selection grid with depth badges
export default function DomainSelector({ selectedDomain, onSelect }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>法规领域选择</CardTitle>
        <CardDescription>
          选择要检查的法规领域 · 9 个领域均已完成深度知识工程
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {domains.map((domain) => (
            <DomainCard
              key={domain.id}
              domain={domain}
              isSelected={selectedDomain === domain.id}
              onSelect={() => onSelect(domain.id)}
            />
          ))}
        </div>

        {/* Selected domain detail */}
        {selectedDomain && (
          <SelectedDomainDetail domain={domainConfig[selectedDomain]} />
        )}
      </CardContent>
    </Card>
  )
}

function DomainCard({ domain, isSelected, onSelect }) {
  const isDeep = domain.depth === 'deep'

  return (
    <button
      onClick={onSelect}
      className={`
        relative flex flex-col items-start gap-1.5 rounded-lg border p-3 text-left transition-all
        hover:border-primary/50 hover:bg-primary/5
        ${isSelected
          ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
          : 'border-border bg-card'
        }
      `}
    >
      <div className="flex w-full items-center justify-between gap-1">
        <span className="font-semibold text-sm text-foreground">{domain.name}</span>
        <Badge
          variant={isDeep ? 'default' : 'secondary'}
          className={`text-[10px] px-1.5 h-4 ${isDeep ? 'bg-pass text-white' : ''}`}
        >
          {isDeep ? 'Deep' : 'Fwk'}
        </Badge>
      </div>
      <span className="text-xs text-muted-foreground leading-tight">{domain.name_cn}</span>
    </button>
  )
}

function SelectedDomainDetail({ domain }) {
  if (!domain) return null

  return (
    <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-semibold text-foreground">{domain.name}</span>
        <span className="text-sm text-muted-foreground">— {domain.name_full}</span>
        <Badge variant="outline" className="text-[10px]">{domain.regulation}</Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-3">{domain.description_cn}</p>
      <div className="flex flex-wrap gap-1.5">
        {domain.checklist.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center rounded-md bg-background border border-border px-2 py-0.5 text-xs text-foreground"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
