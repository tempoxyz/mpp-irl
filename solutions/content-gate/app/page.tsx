export default function Home() {
  return (
    <main style={{ maxWidth: 600, margin: '4rem auto', fontFamily: 'system-ui' }}>
      <h1>Content Gate Demo</h1>
      <p>
        This app serves premium HTML content. Your hackathon goal: gate it behind a one-time mppx payment.
      </p>
      <h2>Try it</h2>
      <pre style={{ background: '#f4f4f4', padding: '1rem', borderRadius: 8 }}>
{`curl http://localhost:3001/api/content`}
      </pre>
    </main>
  )
}
