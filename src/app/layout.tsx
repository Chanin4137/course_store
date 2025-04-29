import './globals.css'
import type { Metadata } from 'next'
import { Toaster } from '@/components/ui/sonner'
import { Kanit } from 'next/font/google'

export const metadata: Metadata = {
  title: {
    default: 'Scheint | Course Store',
    template: '%s | Course Store'
  },
  description: 'Best Course Store'
}

interface RootLayoutProps {
  children: React.ReactNode
}

const kanit = Kanit({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang='en'>
      <body className={kanit.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
export default RootLayout