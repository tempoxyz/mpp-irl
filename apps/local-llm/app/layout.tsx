export const metadata = {
  title: 'Local LLM API',
  description: 'OpenAI-compatible local inference workshop starter',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
