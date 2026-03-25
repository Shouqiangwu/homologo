// Load all skill markdown files at build time via Vite's import.meta.glob
const skillFiles = import.meta.glob('/src/skills/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

/**
 * Assemble system prompt for a given regulatory domain.
 * Loads: top-level router + domain router + gap analysis template + all reference files + output format instruction.
 * @param {string} domain - Domain identifier (e.g. 'gsr', 'battery', 'gdpr')
 * @returns {string} Assembled system prompt
 */
export function assembleSystemPrompt(domain) {
  const parts = []

  // 1. Top-level router (always included)
  const topRouter = skillFiles['/src/skills/SKILL.md']
  if (topRouter) parts.push(topRouter)

  // 2. Domain sub-router
  const domainRouter = skillFiles[`/src/skills/${domain}/SKILL.md`]
  if (domainRouter) parts.push(domainRouter)

  // 3. Gap analysis template
  const template = skillFiles[`/src/skills/${domain}/gap-analysis-template.md`]
  if (template) parts.push(template)

  // 4. All reference files for this domain
  const refs = Object.entries(skillFiles)
    .filter(([path]) => path.startsWith(`/src/skills/${domain}/references/`))
    .map(([, content]) => content)
  parts.push(...refs)

  // 5. Output format instruction
  parts.push(OUTPUT_FORMAT_INSTRUCTION)

  return parts.join('\n\n---\n\n')
}

/**
 * Get metadata about loaded skill files for debugging/display.
 * @param {string} domain - Domain identifier
 * @returns {{ total: number, files: string[] }}
 */
export function getSkillFileInfo(domain) {
  const prefix = `/src/skills/${domain}/`
  const files = Object.keys(skillFiles).filter(
    (path) => path.startsWith(prefix) || path === '/src/skills/SKILL.md'
  )
  return { total: files.length, files }
}

const OUTPUT_FORMAT_INSTRUCTION = `
## Output Format

You MUST respond in valid JSON with the following structure. Do NOT wrap in markdown code fences.

{
  "metadata": {
    "vehicle": "vehicle name",
    "domain": "domain name",
    "generated_at": "ISO date",
    "analysis_version": "regulation version"
  },
  "summary": {
    "total": <number>,
    "pass": <number>,
    "fail": <number>,
    "needs_evidence": <number>
  },
  "results": {
    "pass": [
      {
        "id": "unique id like GSR-A01",
        "item": "检查项名称（中文）",
        "item_en": "Check item name (English)",
        "regulation": "EU regulation reference",
        "requirement": "法规要求（中文）",
        "actual": "实际情况（中文）",
        "basis": "判定依据（中文）"
      }
    ],
    "fail": [
      {
        "id": "unique id",
        "item": "检查项名称（中文）",
        "item_en": "Check item name (English)",
        "regulation": "EU regulation reference",
        "requirement": "法规要求（中文）",
        "actual": "实际情况（中文）",
        "gap": "差距描述（中文）",
        "recommendation": "改进建议（中文）",
        "priority": "HIGH|MEDIUM|LOW",
        "blocking": true|false
      }
    ],
    "needs_evidence": [
      {
        "id": "unique id",
        "item": "检查项名称（中文）",
        "item_en": "Check item name (English)",
        "regulation": "EU regulation reference",
        "evidence_needed": "所需证据（中文）",
        "current_status": "当前状态（中文）",
        "gap_note": "风险提示（中文）",
        "how_to_obtain": "获取方式（中文）",
        "priority": "HIGH|MEDIUM|LOW"
      }
    ]
  },
  "cross_references": [
    {
      "from_domain": "source domain",
      "from_item": "source item description",
      "to_domain": "target domain",
      "to_item": "target item description",
      "issue": "交叉引用说明（中文）"
    }
  ]
}

Use Chinese (中文) for all descriptive fields.
Regulation references remain in original form (e.g., "EU 2019/2144 Art.3(2)").
`
