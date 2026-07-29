export const metadata = {
  title: 'Satellite Positions API',
  description: 'Paid satellite tracking API powered by mppx + n2yo',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
