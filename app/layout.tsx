import type { Metadata } from 'next'
import { Space_Grotesk, Inter } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Asamblea Las Torres — ALT | Quilicura',
  description:
    'Organización Social, Cultural y Medio Ambiental de Quilicura. Reforestación con especies nativas, regeneración de suelo y recuperación de espacios urbanos usando el método Miyawaki.',
  keywords: 'Asamblea Las Torres, ALT, Quilicura, reforestación, método Miyawaki, especies nativas, organización vecinal, medioambiente',
  openGraph: {
    title: 'Asamblea Las Torres — ALT',
    description: 'Territorio. Raíz. Comunidad. Organización autogestiva de Quilicura.',
    locale: 'es_CL',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="bg-black text-off-white font-body antialiased">
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
