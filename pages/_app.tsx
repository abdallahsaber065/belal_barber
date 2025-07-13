import type { AppProps } from 'next/app'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { PageLoader } from '../components/LoaderBarber'
import config from '../config.json'
import '../styles/globals.css'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content={config.site.description} />
        <meta name="keywords" content={config.site.keywords} />
        <meta name="author" content={config.site.name} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={config.site.name} />
        <meta property="og:description" content={config.site.description} />
        <meta property="og:site_name" content={config.site.name} />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={config.site.name} />
        <meta property="twitter:description" content={config.site.description} />
        
        {/* Arabic language support */}
        <meta httpEquiv="Content-Language" content="ar" />
        <meta name="language" content="Arabic" />
        
        {/* Preload fonts */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900&display=swap"
          as="style"
        />
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          as="style"
        />
      </Head>

      <SessionProvider session={session}>
        <div className="min-h-screen flex flex-col">
          <PageLoader isLoading={isLoading} />
          
          <Header />
          
          <main className="flex-1">
            <Component {...pageProps} />
          </main>
          
          <Footer />
          
          {/* Toast notifications */}
          <Toaster
            position="top-center"
            reverseOrder={false}
            gutter={8}
            containerClassName=""
            containerStyle={{
              top: 80,
              right: 20,
              bottom: 20,
              left: 20,
            }}
            toastOptions={{
              // Define default options
              className: '',
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '14px',
                borderRadius: '8px',
                padding: '12px 16px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              },
              // Default options for specific types
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#FFFFFF',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#FFFFFF',
                },
              },
              loading: {
                duration: Infinity,
              },
            }}
          />
        </div>
      </SessionProvider>
    </>
  )
} 