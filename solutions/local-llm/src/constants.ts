export const MODEL_ID =
  process.env.OLLAMA_MODEL || 'smollm2:135m-instruct-q2_K'

export const OLLAMA_BASE_URL =
  process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434'

export const PORT = Number(process.env.PORT || 3003)

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'local'

export const OPENAI_BASE_URL =
  process.env.OPENAI_BASE_URL || `http://localhost:${PORT}/v1`

export const DEFAULT_CHAT_PROMPT =
  'Explain machine payments in one sentence.'

export const DEFAULT_RESPONSES_PROMPT =
  'Write one sentence about local AI.'
