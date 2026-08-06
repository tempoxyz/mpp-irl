import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

const OPUS_4_5_SOUL_DOCUMENT_PATH = join(
  process.cwd(),
  'content',
  'claude-opus-4.5-soul.md',
)

export async function GET() {
  const markdown = await readFile(OPUS_4_5_SOUL_DOCUMENT_PATH, 'utf8')

  return new Response(markdown, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  })
}
