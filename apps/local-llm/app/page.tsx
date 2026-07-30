const model = 'smollm2:135m-instruct-q2_K'

export default function Home() {
  return (
    <main style={{ maxWidth: 720, margin: '4rem auto', fontFamily: 'system-ui' }}>
      <h1>Local LLM API</h1>
      <p>
        This app exposes local Ollama inference through OpenAI-compatible endpoints.
        Your workshop goal: charge for completions with an MPP session.
      </p>
      <h2>Model</h2>
      <pre style={{ background: '#f4f4f4', padding: '1rem', borderRadius: 8 }}>
        {model}
      </pre>
      <h2>Endpoints</h2>
      <ul>
        <li><code>POST /v1/chat/completions</code></li>
        <li><code>POST /v1/responses</code></li>
        <li><code>GET /v1/models</code></li>
      </ul>
      <h2>Try it</h2>
      <pre style={{ background: '#f4f4f4', padding: '1rem', borderRadius: 8, whiteSpace: 'pre-wrap' }}>
{`OPENAI_BASE_URL=http://localhost:3003/v1 \\
  pnpm --filter local-llm chat`}
      </pre>
    </main>
  )
}
