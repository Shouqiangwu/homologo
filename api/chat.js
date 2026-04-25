// Vercel Serverless Function — proxy to Claude API
// API key lives in Vercel Environment Variables, never in code or browser

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'
const ALLOWED_MODEL = 'claude-sonnet-4-6'
const MAX_TOKENS_LIMIT = 16384

export default async function handler(req, res) {
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '仅支持 POST 请求' })
  }

  // Read API key from environment variable (set in Vercel Dashboard)
  const apiKey = process.env.CLAUDE_API_KEY
  if (!apiKey) {
    // Generic message — never reveal variable names or server internals
    return res.status(503).json({ error: '服务暂时不可用，请稍后重试' })
  }

  // Validate request body
  const { model, max_tokens, system, messages, stream } = req.body || {}

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: '请求格式错误：缺少 messages' })
  }

  // Enforce model and token limits — prevent abuse
  const safeBody = {
    model: ALLOWED_MODEL,
    max_tokens: Math.min(max_tokens || 8192, MAX_TOKENS_LIMIT),
    stream: true,
    messages,
  }

  // Only pass system prompt if provided
  if (system) {
    safeBody.system = system
  }

  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(safeBody),
    })

    // Claude API error — return friendly message, not raw error body
    if (!response.ok) {
      const status = response.status
      if (status === 401) return res.status(502).json({ error: '服务配置错误，请联系管理员' })
      if (status === 429) return res.status(429).json({ error: 'API 请求频率超限，请稍后重试' })
      if (status === 529 || status === 503) return res.status(503).json({ error: 'Claude 服务暂时不可用，请稍后重试' })
      return res.status(502).json({ error: `AI 服务返回错误 (${status})，请稍后重试` })
    }

    // Stream SSE response back to browser
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache, no-store')
    res.setHeader('X-Content-Type-Options', 'nosniff')

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      res.write(decoder.decode(value, { stream: true }))
    }

    res.end()
  } catch (err) {
    // Network error or unexpected failure — never expose err.message to client
    if (!res.headersSent) {
      return res.status(500).json({ error: '服务内部错误，请稍后重试' })
    }
    res.end()
  }
}
