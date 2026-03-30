import { Button } from '@/components/ui/button'

// Top navigation bar with logo, project name, about and developer info
export default function Header({ onAboutClick }) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <img src="/xiaomilogo.png" alt="Xiaomi" className="h-7" />
          <div className="h-6 w-px bg-border" />
          <div>
            <h1 className="text-lg font-bold leading-tight text-foreground tracking-tight">
              HomoloGo
            </h1>
            <p className="text-[11px] leading-none text-muted-foreground">
              EU 汽车法规合规检查
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={onAboutClick}>
            关于项目
          </Button>
          <div className="h-4 w-px bg-border" />
          <span className="text-xs text-muted-foreground px-2">
            Shouqiang Wu
          </span>
        </div>
      </div>
    </header>
  )
}
