import OpenAI from 'openai'

import {
  DEFAULT_CHAT_PROMPT,
  MODEL_ID,
  OPENAI_API_KEY,
  OPENAI_BASE_URL,
} from '../constants.js'

const client = new OpenAI({
  apiKey: OPENAI_API_KEY,
  baseURL: OPENAI_BASE_URL,
})

const prompt =
  process.argv.slice(2).filter((argument) => argument !== '--').join(' ') ||
  DEFAULT_CHAT_PROMPT

const stream = await client.chat.completions.create({
  model: MODEL_ID,
  messages: [{ role: 'user', content: prompt }],
  stream: true,
})

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || '')
}
process.stdout.write('\n')
