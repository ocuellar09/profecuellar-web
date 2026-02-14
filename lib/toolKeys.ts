/**
 * Maps Supabase tool_key → localStorage key for each interactive course tool.
 */
export const TOOL_KEYS = {
  "ethics-simulator": "profecuellar:ethics-simulator:v1",
  "crefo-builder": "profecuellar:crefo-builder:v1",
  "bias-audit": "profecuellar:bias-audit:v1",
  "privacy-checklist": "profecuellar:privacy-checklist:v1",
  "iteration-notebook": "profecuellar:iteration-notebook:v1",
  "anchor-rubrics": "profecuellar:anchor-rubrics:v1",
  "portfolio-tracker": "profecuellar:portfolio-tracker:v1",
  "weekly-cases": "profecuellar:weekly-cases:v1",
  "module-quiz": "profecuellar:module-quiz:v1",
  "broken-prompts": "profecuellar:broken-prompts:v1",
} as const

export type ToolKey = keyof typeof TOOL_KEYS
