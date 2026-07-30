import { proxyOpenAiRequest } from '@/lib/openai-proxy'

export function GET(request: Request) {
  return proxyOpenAiRequest(request, 'models')
}
