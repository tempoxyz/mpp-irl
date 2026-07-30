import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'local',
  baseURL: process.env.OPENAI_BASE_URL || 'http://localhost:3003/v1',
})

const stream = await client.chat.completions.create({
  model: process.env.OLLAMA_MODEL || 'smollm2:135m-instruct-q2_K',
  messages: [
    {
      role: 'user',
      content: process.argv.slice(2).join(' ') || 'Explain machine payments in one sentence.',
    },
  ],
  stream: true,
})

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || '')
}
process.stdout.write('\n')
