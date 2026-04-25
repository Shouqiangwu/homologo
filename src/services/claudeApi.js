import { assembleSystemPrompt } from './skillLoader'

// Production (Vercel): all requests go through /api/chat — API key stays on server
// Local dev: also goes through /api/chat if using `vercel dev`,
//            or direct call if VITE_CLAUDE_API_KEY is set in .env.local (dev convenience only)
const LOCAL_KEY = import.meta.env.VITE_CLAUDE_API_KEY
const USE_PROXY = !LOCAL_KEY || LOCAL_KEY === 'your-api-key-here'
const API_URL = USE_PROXY ? '/api/chat' : 'https://api.anthropic.com/v1/messages'

const MODEL = 'claude-sonnet-4-20250514'
const MAX_TOKENS = 8192

/**
 * Run gap analysis for a given domain and vehicle params.
 * In production: request → /api/chat (serverless function) → Claude API
 * API key never touches the browser.
 */
export async function runGapAnalysis({ domain, vehicleParams, onStream, signal }) {
  const systemPrompt = assembleSystemPrompt(domain)
  const userMessage = JSON.stringify(vehicleParams, null, 2)

  const body = {
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: `请对以下车型技术参数进行 ${domain.toUpperCase()} 领域的欧盟法规合规差距分析（Gap Analysis）。\n\n${userMessage}`,
      },
    ],
    stream: true,
  }

  const headers = { 'Content-Type': 'application/json' }

  // Local dev direct call only — never used in production
  if (!USE_PROXY) {
    headers['x-api-key'] = LOCAL_KEY
    headers['anthropic-version'] = '2023-06-01'
    headers['anthropic-dangerous-direct-browser-access'] = 'true'
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    signal,
  })

  if (!response.ok) {
    // Try to read server error message
    let errorMsg
    try {
      const errJson = await response.json()
      errorMsg = errJson.error || `HTTP ${response.status}`
    } catch {
      errorMsg = `HTTP ${response.status}`
    }
    throw new Error(`API_ERROR_${response.status}: ${errorMsg}`)
  }

  const fullText = await readStream(response.body, onStream)
  return parseAnalysisResult(fullText)
}

/**
 * Read SSE stream and accumulate text content.
 */
async function readStream(body, onStream) {
  const reader = body.getReader()
  const decoder = new TextDecoder()
  let fullText = ''
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })

      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const data = line.slice(6).trim()

        if (data === '[DONE]') continue

        try {
          const event = JSON.parse(data)
          if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
            const text = event.delta.text
            fullText += text
            onStream?.(text, fullText)
          }
        } catch {
          // Skip malformed SSE events
        }
      }
    }
  } finally {
    reader.releaseLock()
  }

  return fullText
}

/**
 * Parse gap analysis JSON from Claude's response text.
 */
function parseAnalysisResult(text) {
  let cleaned = text.trim()
  cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim()

  try {
    return JSON.parse(cleaned)
  } catch (e) {
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0])
      } catch {
        // Fall through
      }
    }
    throw new Error(`JSON_PARSE_ERROR: ${e.message}\n\nRaw text (first 500 chars):\n${text.slice(0, 500)}`)
  }
}

/**
 * Check if live analysis is available.
 * In production (proxy mode): always true — key is on server side.
 * In local dev: true only if VITE_CLAUDE_API_KEY is set.
 */
export function isApiKeyConfigured() {
  return USE_PROXY || (LOCAL_KEY && LOCAL_KEY !== 'your-api-key-here')
}
