import { proxyOpenAiRequest } from '@/lib/openai-proxy'

export function POST(request: Request) {
  return proxyOpenAiRequest(request, 'chat/completions')
}
