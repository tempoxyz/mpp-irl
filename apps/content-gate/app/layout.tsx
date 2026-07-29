export const metadata = {
  title: 'Content Gate Demo',
  description: 'Pay-per-view content gating with mppx',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
