import { proxyOpenAiRequest } from '@/lib/openai-proxy'
import { paidCompletion } from '@/lib/payment'

export const POST = paidCompletion((request) =>
  proxyOpenAiRequest(request, 'responses'),
)
