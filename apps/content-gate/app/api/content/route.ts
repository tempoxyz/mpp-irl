import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

const SOUL_DOCUMENT_PATH = join(
  process.cwd(),
  'content',
  'claude-soul.md',
)

export const dynamic = 'force-static'

export async function GET() {
  const markdown = await readFile(SOUL_DOCUMENT_PATH, 'utf8')

  return new Response(markdown, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  })
}
