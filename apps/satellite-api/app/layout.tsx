export const metadata = {
  title: 'Satellite Positions API',
  description: 'Workshop starter for a paid satellite tracking API',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
