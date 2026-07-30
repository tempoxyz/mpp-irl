import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'local',
  baseURL: process.env.OPENAI_BASE_URL || 'http://localhost:3003/v1',
})

const response = await client.responses.create({
  model: process.env.OLLAMA_MODEL || 'smollm2:135m-instruct-q2_K',
  input: process.argv.slice(2).join(' ') || 'Write one sentence about local AI.',
})

console.log(response.output_text)
