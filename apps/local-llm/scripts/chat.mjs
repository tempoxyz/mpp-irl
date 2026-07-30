import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'local',
  baseURL: process.env.OPENAI_BASE_URL || 'http://localhost:3003/v1',
})
const prompt = process.argv.slice(2).filter((argument) => argument !== '--').join(' ')

const stream = await client.chat.completions.create({
  model: process.env.OLLAMA_MODEL || 'smollm2:135m-instruct-q2_K',
  messages: [
    {
      role: 'user',
      content: prompt || 'Explain machine payments in one sentence.',
    },
  ],
  stream: true,
})

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || '')
}
process.stdout.write('\n')
