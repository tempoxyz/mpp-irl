export const metadata = {
  title: 'Content Gate Demo',
  description: 'Workshop starter for paid content with MPP',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
