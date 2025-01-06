import React from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { Inter } from 'next/font/google'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import { headers } from 'next/headers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ChatGenius',
  description: 'Real-time chat application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if the current path is a public route (sign-in or sign-up)
  const headersList = headers()
  const pathname = headersList.get('x-pathname') || '/'
  const isPublicRoute = ['/sign-in', '/sign-up'].includes(pathname)

  return (
    <html lang="en" className="h-full">
      <ClerkProvider>
        <body className={`${inter.className} h-full bg-purple-900`}>
          {isPublicRoute ? (
            // Public routes - show only the content
            <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black">
              {children}
            </div>
          ) : (
            // Protected routes - show the full layout
            <div className="flex h-screen">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 overflow-auto">
                  {children}
                </main>
              </div>
            </div>
          )}
        </body>
      </ClerkProvider>
    </html>
  )
}