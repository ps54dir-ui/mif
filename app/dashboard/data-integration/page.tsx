'use client'

export const dynamic = 'force-dynamic'

import { IntegratedDataDashboard } from '@/components/dashboard'
import { useSearchParams } from 'next/navigation'

export default function DataIntegrationPage() {
  const searchParams = useSearchParams()
  const brandName = searchParams.get('brand_name') || '브랜드'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 헤더 */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {brandName} 통합 데이터 대시보드
          </h1>
          <p className="text-gray-600">
            GA4, 네이버 스마트스토어, 네이버 데이터 센터, 네이버 비즈어드바이저, 쿠팡 데이터를 통합하여 분석합니다.
          </p>
        </div>

        {/* 통합 데이터 대시보드 */}
        <IntegratedDataDashboard brandId={brandName} />
      </div>
    </div>
  )
}
