import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { BarberLoader } from '../components/LoaderBarber'
import config from '../config.json'

export default function Services() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to main page with services section
    const timer = setTimeout(() => {
      router.push('/#services')
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <>
      <Head>
        <title>إعادة توجيه - {config.site.name}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <BarberLoader type="scissor" size="lg" />
          <h1 className="text-2xl font-bold text-secondary-900 mt-6 mb-2">
            جاري التوجيه لصفحة الخدمات...
          </h1>
          <p className="text-secondary-600">
            يتم توجيهك إلى قسم الخدمات في الصفحة الرئيسية
          </p>
        </div>
      </div>
    </>
  )
} 