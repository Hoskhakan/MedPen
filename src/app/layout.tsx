import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MEDPEN — Medical Academic Writing & Research Support',
  description:
    'MEDPEN provides specialized academic and statistical support for medical researchers, postgraduate students, and healthcare professionals. Services include thesis preparation, research protocols, statistical analysis, manuscript editing, and publication support.',
  keywords: [
    'medical thesis writing',
    'research protocol',
    'statistical analysis SPSS',
    'medical manuscript editing',
    'academic writing Egypt',
    'medical research support',
    'publication support',
    'literature review',
    'MEDPEN',
  ],
  openGraph: {
    title: 'MEDPEN — Medical Academic Writing & Research Support',
    description:
      'Specialized support for medical theses, research protocols, statistical analysis, and publication-ready academic documents.',
    type: 'website',
    locale: 'en_US',
    siteName: 'MEDPEN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MEDPEN — Medical Academic Writing & Research Support',
    description:
      'Specialized support for medical theses, research protocols, statistical analysis, and publication-ready academic documents.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
