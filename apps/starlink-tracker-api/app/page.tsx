export default function Home() {
  return (
    <main
      style={{ maxWidth: 720, margin: '4rem auto', fontFamily: 'system-ui' }}
    >
      <h1>Starlink Tracker API</h1>
      <p>
        Find Starlink satellites currently above an observer, then turn the
        endpoint into a paid data API.
      </p>
      <h2>Endpoint</h2>
      <p>
        <code>GET /api/starlink</code>
      </p>
      <h2>Parameters</h2>
      <ul>
        <li><strong>lat</strong> — observer latitude</li>
        <li><strong>lng</strong> — observer longitude</li>
        <li><strong>alt</strong> — altitude in meters; defaults to 0</li>
        <li><strong>radius</strong> — search radius from 0–90°; defaults to 90</li>
      </ul>
      <h2>Try it</h2>
      <pre
        style={{
          background: '#f4f4f4',
          padding: '1rem',
          borderRadius: 8,
          whiteSpace: 'pre-wrap',
        }}
      >
        {`curl "http://localhost:3002/api/starlink?lat=41.702&lng=-76.014&alt=0&radius=90"`}
      </pre>
    </main>
  )
}
