import { assembleSystemPrompt } from './skillLoader'

// Production (Vercel): all requests go through /api/chat — API key stays on server
// Local dev: also goes through /api/chat if using `vercel dev`,
//            or direct call if VITE_CLAUDE_API_KEY is set in .env.local (dev convenience only)
const LOCAL_KEY = import.meta.env.VITE_CLAUDE_API_KEY
const USE_PROXY = !LOCAL_KEY || LOCAL_KEY === 'your-api-key-here'
const API_URL = USE_PROXY ? '/api/chat' : 'https://api.anthropic.com/v1/messages'

const MODEL = 'claude-sonnet-4-6'
const MAX_TOKENS = 16384

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
        content: `请对以下车型技术参数进行 ${domain.toUpperCase()} 领域的欧盟法规合规差距分析（Gap Analysis）。

要求：
- 每个类别（pass/fail/needs_evidence）最多列出 8 项最关键的
- 每项的描述字段尽量简洁（每字段不超过 80 字）
- 确保输出完整的 JSON，不要因内容过长导致截断

${userMessage}`,
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

  function processLines(lines) {
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

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })

      const lines = buffer.split('\n')
      buffer = lines.pop() || ''
      processLines(lines)
    }

    // Process any remaining data in buffer after stream ends
    if (buffer.trim()) {
      processLines(buffer.split('\n'))
    }
  } finally {
    reader.releaseLock()
  }

  return fullText
}

/**
 * Parse gap analysis JSON from Claude's response text.
 * Handles: markdown fences, leading/trailing text, and truncated JSON.
 */
function parseAnalysisResult(text) {
  let cleaned = text.trim()

  // Strip markdown code fences
  cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim()

  // Attempt 1: direct parse
  try {
    return JSON.parse(cleaned)
  } catch { /* continue */ }

  // Attempt 2: extract JSON object from surrounding text
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0])
    } catch { /* continue */ }
  }

  // Attempt 3: repair truncated JSON
  const jsonStart = cleaned.indexOf('{')
  if (jsonStart !== -1) {
    let partial = cleaned.slice(jsonStart)

    // Find the last cleanly closed object or array entry
    // by searching backward for the last complete }, or ]
    const lastCleanCut = Math.max(
      partial.lastIndexOf('},'),
      partial.lastIndexOf('}]'),
      partial.lastIndexOf('],'),
      partial.lastIndexOf('"]'),
      partial.lastIndexOf('"}'),
    )

    if (lastCleanCut > 0) {
      // Cut at the last clean boundary + 1 to keep the closing char
      partial = partial.slice(0, lastCleanCut + 1)
      // Remove trailing comma if present
      partial = partial.replace(/,\s*$/, '')
    }

    // Close all open brackets and braces
    const opens = (partial.match(/\[/g) || []).length - (partial.match(/\]/g) || []).length
    const braces = (partial.match(/\{/g) || []).length - (partial.match(/\}/g) || []).length
    partial += ']'.repeat(Math.max(0, opens))
    partial += '}'.repeat(Math.max(0, braces))

    try {
      return JSON.parse(partial)
    } catch { /* continue */ }
  }

  throw new Error(`JSON_PARSE_ERROR: Claude returned non-JSON response.\n\nFirst 500 chars:\n${text.slice(0, 500)}`)
}

/**
 * Check if live analysis is available.
 * In production (proxy mode): always true — key is on server side.
 * In local dev: true only if VITE_CLAUDE_API_KEY is set.
 */
export function isApiKeyConfigured() {
  return USE_PROXY || (LOCAL_KEY && LOCAL_KEY !== 'your-api-key-here')
}
