import { useState, useCallback, useRef, useEffect } from 'react'
import './index.css'
import Header from '@/components/Header'
import VehicleSelector from '@/components/VehicleSelector'
import DomainSelector from '@/components/DomainSelector'
import AnalysisProgress from '@/components/AnalysisProgress'
import ReportView from '@/components/ReportView'
import CrossReferences from '@/components/CrossReferences'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import domainConfig from '@/data/domain-config.json'
import { runGapAnalysis, isApiKeyConfigured } from '@/services/claudeApi'

// Vehicle params imports
import starseaX7Params from '@/data/vehicle-params/starsea-x7.json'
import deepalSL05Params from '@/data/vehicle-params/deepal-sl05.json'
import farizonSupervanParams from '@/data/vehicle-params/farizon-supervan-e.json'

// All cached results — keyed by "vehicleId-domainId"
const cachedResultFiles = import.meta.glob('/src/data/cached-results/*.json', { eager: true, import: 'default' })

// Build lookup: { "starsea-x7/gsr": {...}, ... }
const cachedResults = {}
for (const [path, data] of Object.entries(cachedResultFiles)) {
  const filename = path.split('/').pop().replace('.json', '')
  cachedResults[filename] = data
}

// Vehicle registry
const VEHICLES = {
  'starsea-x7': { id: 'starsea-x7', params: starseaX7Params, cachePrefix: 'starsea-x7' },
  'deepal-sl05': { id: 'deepal-sl05', params: deepalSL05Params, cachePrefix: 'deepal-sl05' },
  'farizon-supervan-e': { id: 'farizon-supervan-e', params: farizonSupervanParams, cachePrefix: 'farizon-supervan-e' },
}

function App() {
  const [selectedVehicleId, setSelectedVehicleId] = useState('starsea-x7')
  const [vehicleParams, setVehicleParams] = useState(starseaX7Params)
  const [selectedDomain, setSelectedDomain] = useState(null)
  const [analysisState, setAnalysisState] = useState('idle')
  const [analysisMode, setAnalysisMode] = useState(null)
  const [progress, setProgress] = useState(null)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [streamText, setStreamText] = useState('')
  const [showAbout, setShowAbout] = useState(false)
  const [paramsModified, setParamsModified] = useState(false)
  const abortRef = useRef(null)
  const reportRef = useRef(null)

  useEffect(() => {
    if (analysisState === 'done' && results && reportRef.current) {
      setTimeout(() => {
        reportRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }, [analysisState, results])

  // Switch vehicle
  const handleVehicleSelect = useCallback((vehicleId) => {
    const vehicle = VEHICLES[vehicleId]
    if (!vehicle) return
    setSelectedVehicleId(vehicleId)
    setVehicleParams(vehicle.params)
    setParamsModified(false)
    setAnalysisState('idle')
    setResults(null)
    setProgress(null)
    setError(null)
  }, [])

  const handleParamsChange = useCallback((newParams) => {
    setVehicleParams(newParams)
    setParamsModified(true)
  }, [])

  const handleParamsReset = useCallback(() => {
    const vehicle = VEHICLES[selectedVehicleId]
    if (vehicle) setVehicleParams(vehicle.params)
    setParamsModified(false)
  }, [selectedVehicleId])

  // Get cached result for current vehicle + domain
  const getCachedResult = useCallback((domainId) => {
    const vehicle = VEHICLES[selectedVehicleId]
    if (!vehicle) return null
    const key = `${domainId}-${vehicle.cachePrefix}`
    return cachedResults[key] || null
  }, [selectedVehicleId])

  const shouldUseCache = useCallback((domainId) => {
    if (paramsModified) return false
    return !!getCachedResult(domainId)
  }, [paramsModified, getCachedResult])

  const runCachedAnalysis = useCallback(async (domainId) => {
    const domain = domainConfig[domainId]
    if (!domain) return

    setAnalysisMode('cached')
    setAnalysisState('running')
    setResults(null)
    setError(null)
    setStreamText('')
    setProgress({ current: 0, status: 'checking' })

    const checklist = domain.checklist
    for (let i = 0; i < checklist.length; i++) {
      setProgress({ current: i, status: 'checking' })
      await delay(300 + Math.random() * 200)
      setProgress({ current: i, status: 'done' })
      await delay(100)
    }

    setProgress({ current: checklist.length, status: 'done' })
    await delay(300)

    setResults(getCachedResult(domainId))
    setAnalysisState('done')
  }, [getCachedResult])

  const runLiveAnalysis = useCallback(async (domainId) => {
    const domain = domainConfig[domainId]
    if (!domain) return

    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setAnalysisMode('live')
    setAnalysisState('running')
    setResults(null)
    setError(null)
    setStreamText('')
    setProgress({ current: 0, status: 'checking' })

    const checklist = domain.checklist
    let progressIndex = 0
    const progressInterval = setInterval(() => {
      if (progressIndex < checklist.length - 1) {
        setProgress({ current: progressIndex, status: 'done' })
        progressIndex++
        setProgress({ current: progressIndex, status: 'checking' })
      }
    }, 3000)

    try {
      const result = await runGapAnalysis({
        domain: domainId,
        vehicleParams,
        onStream: (chunk, fullText) => { setStreamText(fullText) },
        signal: controller.signal,
      })

      clearInterval(progressInterval)
      setProgress({ current: checklist.length, status: 'done' })
      setResults(result)
      setAnalysisState('done')
    } catch (err) {
      clearInterval(progressInterval)
      if (err.name === 'AbortError') return
      console.error('Analysis error:', err)
      setError(formatError(err))
      setAnalysisState('error')
    }
  }, [vehicleParams])

  const handleStartAnalysis = useCallback(() => {
    if (!selectedDomain) return
    if (shouldUseCache(selectedDomain)) {
      runCachedAnalysis(selectedDomain)
    } else if (isApiKeyConfigured()) {
      runLiveAnalysis(selectedDomain)
    } else {
      const cached = getCachedResult(selectedDomain)
      if (cached) {
        runCachedAnalysis(selectedDomain)
      } else {
        setError('实时分析服务未就绪，请使用示例结果或稍后重试。')
        setAnalysisState('error')
      }
    }
  }, [selectedDomain, shouldUseCache, runCachedAnalysis, runLiveAnalysis, getCachedResult])

  const handleLiveAnalysis = useCallback(() => {
    if (!selectedDomain) return
    if (!isApiKeyConfigured()) {
      setError('实时分析服务未就绪，请稍后重试。')
      setAnalysisState('error')
      return
    }
    runLiveAnalysis(selectedDomain)
  }, [selectedDomain, runLiveAnalysis])

  const handleCancel = useCallback(() => {
    if (abortRef.current) { abortRef.current.abort(); abortRef.current = null }
    setAnalysisState('idle')
    setProgress(null)
  }, [])

  const currentDomain = selectedDomain ? domainConfig[selectedDomain] : null

  return (
    <div className="min-h-screen bg-background">
      <Header onAboutClick={() => setShowAbout(!showAbout)} />

      <main className="mx-auto max-w-4xl px-6 py-6 space-y-6">
        {showAbout && <AboutPanel onClose={() => setShowAbout(false)} />}

        <VehicleSelector
          vehicles={VEHICLES}
          selectedVehicleId={selectedVehicleId}
          onVehicleSelect={handleVehicleSelect}
          params={vehicleParams}
          onParamsChange={handleParamsChange}
          onParamsReset={handleParamsReset}
        />

        <DomainSelector
          selectedDomain={selectedDomain}
          onSelect={(id) => {
            setSelectedDomain(id)
            setAnalysisState('idle')
            setResults(null)
            setProgress(null)
            setError(null)
            setStreamText('')
          }}
        />

        {selectedDomain && (
          <div className="flex items-center gap-3 flex-wrap">
            <Button size="lg" onClick={handleStartAnalysis} disabled={analysisState === 'running'} className="px-6">
              {analysisState === 'running' ? '正在分析...' : '开始合规检查'}
            </Button>

            {analysisState === 'running' && analysisMode === 'live' && (
              <Button size="lg" variant="outline" onClick={handleCancel}>取消</Button>
            )}

            {analysisState === 'done' && (
              <Button size="lg" variant="outline" onClick={handleLiveAnalysis}>重新分析（实时）</Button>
            )}

            {analysisState === 'done' && analysisMode && (
              <Badge variant="outline" className="text-xs">
                {analysisMode === 'cached' ? '示例分析结果' : '实时分析结果'}
              </Badge>
            )}

            {paramsModified && analysisState !== 'running' && (
              <span className="text-xs text-warning">参数已修改，将使用实时分析</span>
            )}
          </div>
        )}

        {(analysisState === 'running' || analysisState === 'done') && currentDomain && (
          <AnalysisProgress checklist={currentDomain.checklist} progress={progress} isRunning={analysisState === 'running'} />
        )}

        {analysisState === 'running' && analysisMode === 'live' && streamText && (
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-xs text-muted-foreground mb-2">AI 实时输出预览：</p>
            <pre className="text-xs text-foreground whitespace-pre-wrap max-h-48 overflow-y-auto font-mono">{streamText.slice(-800)}</pre>
          </div>
        )}

        {analysisState === 'error' && error && (
          <div className="rounded-lg border border-fail/30 bg-fail-bg p-4 space-y-2">
            <p className="text-sm font-medium text-fail">分析失败</p>
            <p className="text-sm text-foreground">{error}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleStartAnalysis}>重试</Button>
              {getCachedResult(selectedDomain) && (
                <Button size="sm" variant="outline" onClick={() => runCachedAnalysis(selectedDomain)}>使用示例结果</Button>
              )}
            </div>
          </div>
        )}

        {analysisState === 'done' && results && (
          <div ref={reportRef} className="space-y-6">
            <ReportView results={results.results} domainName={`${currentDomain.name} ${currentDomain.name_cn}`} />
            <CrossReferences references={results.cross_references} />
          </div>
        )}
      </main>

      <footer className="mt-12 border-t border-border py-6">
        <div className="mx-auto max-w-4xl px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">HomoloGo — AI 辅助欧盟汽车法规合规检查工具</span>
          </div>
          <span className="text-xs text-muted-foreground">Developed by Shouqiang Wu</span>
        </div>
      </footer>
    </div>
  )
}

function AboutPanel({ onClose }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 space-y-3">
      <div className="flex items-start justify-between">
        <h2 className="text-lg font-semibold text-foreground">关于 HomoloGo</h2>
        <Button variant="ghost" size="icon-xs" onClick={onClose}>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>
      </div>
      <div className="text-sm text-muted-foreground space-y-2">
        <p>
          <strong className="text-foreground">HomoloGo</strong>（Homologation + Go）是一个 AI 辅助的欧盟汽车法规合规检查工具。
          AI 做第一轮法规匹配和 gap analysis，输出结构化报告，合规工程师在高起点上接手做最终判断。
        </p>
        <p>
          当前覆盖 <strong className="text-foreground">9 个法规领域</strong>，全部完成深度知识工程（59 个结构化 Skill 文件），
          采用 Skills-First 架构：法规拆成结构化参考文件 + 决策树路由器，每次查询只加载相关文件，确保分析准确性和一致性。
        </p>
        <p>
          支持 <strong className="text-foreground">3 个示例车型</strong>（M1 SUV、M1 轿车、N1 物流车），
          覆盖中国车企进入欧盟市场的典型合规场景。
        </p>
        <p className="text-xs text-muted-foreground/70 italic">
          注意：本项目处于早期原型阶段，法规内容仅供演示参考，不构成合规建议。
          生产环境需加入后端服务、用户认证、审计日志，并由持证合规工程师审核所有输出。
        </p>
        <div className="flex items-center gap-2 pt-2">
          <Badge variant={isApiKeyConfigured() ? 'default' : 'outline'} className="text-xs">
            API {isApiKeyConfigured() ? '已连接' : '未配置'}
          </Badge>
          {!isApiKeyConfigured() && (
            <span className="text-xs text-muted-foreground">实时分析服务未配置</span>
          )}
        </div>
      </div>
    </div>
  )
}

function formatError(err) {
  const msg = err.message || String(err)
  if (msg.includes('API_KEY_NOT_SET')) return '实时分析服务未就绪，请稍后重试。'
  if (msg.includes('API_ERROR_401')) return '服务配置错误，请联系管理员。'
  if (msg.includes('API_ERROR_429')) return 'API 请求频率超限，请稍后重试。'
  if (msg.includes('API_ERROR_529') || msg.includes('API_ERROR_503')) return 'Claude API 服务暂时不可用，请稍后重试。'
  if (msg.includes('JSON_PARSE_ERROR')) return `AI 返回格式异常。调试信息：${msg.slice(0, 1000)}`
  if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) return '网络连接失败。请检查网络连接后重试。'
  return `分析过程出错：${msg}`
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default App
