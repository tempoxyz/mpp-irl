const BLOG_URL = 'https://mpp.dev/blog/mppx-agent-runtimes.md'

export async function GET() {
  const res = await fetch(BLOG_URL)

  if (!res.ok) {
    return Response.json(
      { error: 'Failed to fetch blog content', status: res.status },
      { status: 502 },
    )
  }

  const markdown = await res.text()

  return new Response(markdown, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  })
}
