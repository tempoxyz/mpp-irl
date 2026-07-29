import crypto from 'crypto'
import { Mppx, tempo } from 'mppx/nextjs'

const mppx = Mppx.create({
  secretKey: process.env.MPP_SECRET_KEY || crypto.randomBytes(32).toString('base64'),
  methods: [tempo.charge({
    testnet: true,
    currency: '0x20c0000000000000000000000000000000000000',
    recipient: process.env.RECIPIENT_ADDRESS as `0x${string}`,
  })],
})

const GATED_HTML = `
<!DOCTYPE html>
<html>
<head><title>Premium Content</title></head>
<body style="max-width:600px;margin:2rem auto;font-family:system-ui">
  <h1>🔓 You unlocked premium content!</h1>
  <p>This is gated HTML that was only accessible after a verified mppx payment.</p>
  <p>You could gate articles, reports, research papers, or any content behind this paywall.</p>
  <footer><small>Powered by mppx one-time payments</small></footer>
</body>
</html>
`.trim()

export const GET =
  mppx.charge({ amount: '0.01', description: 'Access premium content' })
  (async () => {
    return new Response(GATED_HTML, {
      headers: { 'Content-Type': 'text/html' },
    })
  })
