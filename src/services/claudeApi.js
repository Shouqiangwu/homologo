import { assembleSystemPrompt } from './skillLoader'

const API_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-4-20250514'
const MAX_TOKENS = 8192

/**
 * Call Claude API to perform gap analysis for a given domain and vehicle params.
 * Supports streaming for real-time progress updates.
 *
 * @param {Object} options
 * @param {string} options.domain - Regulatory domain id (e.g. 'gsr')
 * @param {Object} options.vehicleParams - Vehicle technical parameters JSON
 * @param {function} [options.onStream] - Callback for streaming text chunks
 * @param {AbortSignal} [options.signal] - AbortController signal for cancellation
 * @returns {Promise<Object>} Parsed gap analysis result
 */
export async function runGapAnalysis({ domain, vehicleParams, onStream, signal }) {
  const apiKey = import.meta.env.VITE_CLAUDE_API_KEY
  if (!apiKey || apiKey === 'your-api-key-here') {
    throw new Error('API_KEY_NOT_SET')
  }

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

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify(body),
    signal,
  })

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '')
    throw new Error(`API_ERROR_${response.status}: ${errorBody}`)
  }

  // Process SSE stream
  const fullText = await readStream(response.body, onStream)

  // Parse the JSON result from the accumulated text
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

      // Process complete SSE events from buffer
      const lines = buffer.split('\n')
      buffer = lines.pop() || '' // Keep incomplete last line in buffer

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
          // Skip malformed JSON events
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
 * Handles markdown code fences and whitespace.
 */
function parseAnalysisResult(text) {
  // Strip markdown code fences if present
  let cleaned = text.trim()
  cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim()

  try {
    return JSON.parse(cleaned)
  } catch (e) {
    // Try to find JSON object in the text
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0])
      } catch {
        // Fall through to error
      }
    }
    throw new Error(`JSON_PARSE_ERROR: ${e.message}\n\nRaw text (first 500 chars):\n${text.slice(0, 500)}`)
  }
}

/**
 * Check if the API key is configured.
 */
export function isApiKeyConfigured() {
  const key = import.meta.env.VITE_CLAUDE_API_KEY
  return key && key !== 'your-api-key-here'
}
