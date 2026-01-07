'use client'

export const dynamic = 'force-dynamic'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // 기존 파라미터 유지 + 'brand name'을 'brand_name'으로 매핑
    const params = new URLSearchParams(searchParams.toString())
    const brandNameAlt = params.get('brand name')
    if (brandNameAlt && !params.get('brand_name')) {
      params.set('brand_name', brandNameAlt)
      params.delete('brand name')
    }
    const qs = params.toString()
    router.replace(`/dashboard/diagnosis${qs ? `?${qs}` : ''}`)
  }, [router, searchParams])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">리다이렉트 중...</p>
      </div>
    </div>
  )
}
