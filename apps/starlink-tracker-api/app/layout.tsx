export const metadata = {
  title: 'Starlink Tracker API',
  description: 'Find Starlink satellites above an observer using N2YO',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
