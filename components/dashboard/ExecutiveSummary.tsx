'use client'

import { useState, useEffect } from 'react'

// SVG 아이콘 (icons 파일 의존성 제거)
const AlertCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
)

interface ExecutiveSummaryProps {
  brandId?: string
}

export function ExecutiveSummary({ brandId }: ExecutiveSummaryProps) {
  const [summary, setSummary] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    try {
      fetchExecutiveSummary()
    } catch (err) {
      console.error('ExecutiveSummary 초기화 오류:', err)
      setError(true)
      setLoading(false)
    }
  }, [])

  const fetchExecutiveSummary = async () => {
    try {
      setError(false)
      // Mock 데이터 사용 (항상 나이키 데이터)
      const { getMockBrandData } = await import('@/lib/api/mockData')
      const mockData = getMockBrandData(brandId || '삼성생명')
      
      if (mockData && mockData.executiveSummary) {
        setSummary(mockData.executiveSummary)
      } else {
        // 기본 요약 (에러 방지)
        setSummary('현재 가장 시급한 문제는 커뮤니티의 신뢰 지수입니다. (특정 커뮤니티 내 브랜드 위조품 이슈로 인한 신뢰 지수 모니터링 필요) 이를 해결하면 매출이 12.5% 상승할 것으로 예측됩니다.')
      }
    } catch (error) {
      console.error('Executive Summary 오류:', error)
      setError(true)
      // 에러 발생 시에도 기본 요약 표시
      setSummary('현재 가장 시급한 문제는 커뮤니티의 신뢰 지수입니다. (특정 커뮤니티 내 브랜드 위조품 이슈로 인한 신뢰 지수 모니터링 필요) 이를 해결하면 매출이 12.5% 상승할 것으로 예측됩니다.')
    } finally {
      setLoading(false)
    }
  }

  // 에러가 발생해도 텍스트로 표시
  if (error || !summary) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-6 mb-6 shadow-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h2 className="text-lg font-bold text-blue-900 mb-2">
              🤖 AI Executive Summary
            </h2>
            <p className="text-base text-gray-800 leading-relaxed">
              현재 가장 시급한 문제는 커뮤니티의 신뢰 지수입니다. (특정 커뮤니티 내 브랜드 위조품 이슈로 인한 신뢰 지수 모니터링 필요) 이를 해결하면 매출이 12.5% 상승할 것으로 예측됩니다.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span className="text-blue-700">AI 요약 생성 중...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-6 mb-6 shadow-lg">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h2 className="text-lg font-bold text-blue-900 mb-2">
            🤖 AI Executive Summary
          </h2>
          <p className="text-base text-gray-800 leading-relaxed">
            {summary}
          </p>
        </div>
      </div>
    </div>
  )
}
