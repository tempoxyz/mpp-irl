import OpenAI from 'openai'
import { resolveAccount } from 'mppx/cli'
import { createChannelStore, tempo } from 'mppx/client'

const baseURL = process.env.OPENAI_BASE_URL || 'http://localhost:3003/v1'
const accountName = process.env.MPPX_ACCOUNT || 'buyer'
const account = await resolveAccount(accountName)
const channelStore = createChannelStore()
const session = tempo.session.manager({
  account,
  channelStore,
  maxDeposit: '0.1',
})

const client = new OpenAI({
  apiKey: 'mpp',
  baseURL,
  fetch: session.fetch,
})

const prompt = process.argv.slice(2).filter((argument) => argument !== '--').join(' ')
const prompts = prompt
  ? [prompt]
  : [
      'Explain MPP in one sentence.',
      'Explain why payment sessions are useful in one sentence.',
    ]

for (const prompt of prompts) {
  process.stdout.write(`\n> ${prompt}\n`)
  const stream = await client.chat.completions.create({
    model: process.env.OLLAMA_MODEL || 'smollm2:135m-instruct-q2_K',
    messages: [{ role: 'user', content: prompt }],
    stream: true,
  })

  for await (const chunk of stream) {
    process.stdout.write(chunk.choices[0]?.delta?.content || '')
  }
  process.stdout.write('\n')
  console.error(`[mppx] channel=${session.channelId} cumulative=${session.cumulative}`)
}

if (!prompt) {
  process.stdout.write('\n> Test the Responses API in one sentence.\n')
  const response = await client.responses.create({
    model: process.env.OLLAMA_MODEL || 'smollm2:135m-instruct-q2_K',
    input: 'Test the Responses API in one sentence.',
  })
  console.log(response.output_text)
  console.error(`[mppx] channel=${session.channelId} cumulative=${session.cumulative}`)
}

const closeReceipt = await session.close()
console.error(`[mppx] closed channel tx=${closeReceipt?.txHash || 'none'}`)
