import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navigation from '@/components/navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mohit Gera - Cybersecurity Specialist',
  description: 'Portfolio of Mohit Gera, a Cybersecurity Specialist with expertise in automotive security, threat intelligence, and zero trust architecture.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-black text-white min-h-screen`}>
        <Navigation />
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  )
}
