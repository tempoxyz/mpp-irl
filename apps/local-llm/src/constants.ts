export const MODEL_ID =
  process.env.OLLAMA_MODEL || 'smollm2:135m-instruct-q2_K'

export const OLLAMA_BASE_URL =
  process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434'

export const PORT = Number(process.env.PORT || 3003)
