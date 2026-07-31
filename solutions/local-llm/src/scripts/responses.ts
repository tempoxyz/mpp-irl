import OpenAI from 'openai'

import {
  DEFAULT_RESPONSES_PROMPT,
  MODEL_ID,
  OPENAI_API_KEY,
  OPENAI_BASE_URL,
} from '../constants.js'

const client = new OpenAI({
  apiKey: OPENAI_API_KEY,
  baseURL: OPENAI_BASE_URL,
})

const input =
  process.argv.slice(2).filter((argument) => argument !== '--').join(' ') ||
  DEFAULT_RESPONSES_PROMPT

const response = await client.responses.create({
  model: MODEL_ID,
  input,
})

console.log(response.output_text)
