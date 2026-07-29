export default function Home() {
  return (
    <main style={{ maxWidth: 600, margin: '4rem auto', fontFamily: 'system-ui' }}>
      <h1>Content Gate Demo</h1>
      <p>
        This app gates access to premium HTML content behind a one-time mppx payment.
      </p>
      <p>
        Hit <code>GET /api/content</code> with a paid request to receive the gated content.
      </p>
      <h2>Setup</h2>
      <pre style={{ background: '#f4f4f4', padding: '1rem', borderRadius: 8, whiteSpace: 'pre-wrap' }}>
{`# Create a testnet account (one-time)
npx mppx account create

# View your account address
npx mppx account view`}
      </pre>
      <h2>Try it</h2>
      <pre style={{ background: '#f4f4f4', padding: '1rem', borderRadius: 8 }}>
{`npx mppx http://localhost:3001/api/content --network testnet -iv`}
      </pre>
    </main>
  )
}
