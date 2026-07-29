export default function Home() {
  return (
    <main style={{ maxWidth: 600, margin: '4rem auto', fontFamily: 'system-ui' }}>
      <h1>Satellite Positions API</h1>
      <p>
        Pay-per-request satellite position tracking, powered by n2yo.com and gated with mppx.
      </p>
      <h2>Endpoint</h2>
      <pre style={{ background: '#f4f4f4', padding: '1rem', borderRadius: 8 }}>
{`GET /api/positions?id={norad_id}&lat={lat}&lng={lng}&alt={alt}&seconds={seconds}`}
      </pre>
      <h3>Parameters</h3>
      <ul>
        <li><strong>id</strong> — NORAD satellite ID (e.g. 25544 for ISS)</li>
        <li><strong>lat</strong> — Observer latitude in decimal degrees</li>
        <li><strong>lng</strong> — Observer longitude in decimal degrees</li>
        <li><strong>alt</strong> — Observer altitude in meters (default: 0)</li>
        <li><strong>seconds</strong> — Future positions to return, max 300 (default: 10)</li>
      </ul>
      <h2>Setup</h2>
      <pre style={{ background: '#f4f4f4', padding: '1rem', borderRadius: 8, whiteSpace: 'pre-wrap' }}>
{`# Create a testnet account (one-time)
npx mppx account create

# View your account address
npx mppx account view`}
      </pre>
      <h2>Try it</h2>
      <pre style={{ background: '#f4f4f4', padding: '1rem', borderRadius: 8, whiteSpace: 'pre-wrap' }}>
{`npx mppx "http://localhost:3002/api/positions?id=25544&lat=41.702&lng=-76.014&alt=0&seconds=10" --network testnet -iv`}
      </pre>
    </main>
  )
}
