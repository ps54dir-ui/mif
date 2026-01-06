'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ReportPreIssueAnalysis } from '@/components/dashboard/ReportPreIssueAnalysis'
import { ExecutiveSummary } from '@/components/dashboard/ExecutiveSummary'
import { ICETodoList } from '@/components/dashboard/ICETodoList'
import { ArrowLeft, TrendingUp, FileText } from 'lucide-react'
import Link from 'next/link'
import type { DashboardData } from '../../shared/types/dashboard'

// Mock 데이터
const MOCK_DATA: DashboardData = {
  overallScore: 88,
  fourAxes: {
    inflow: 95,
    persuasion: 89,
    trust: 85,
    circulation: 82
  },
  seoGeoAeoReports: [
    { type: 'SEO' as const, score: 92, issues: [] },
    { type: 'GEO' as const, score: 88, issues: [] },
    { type: 'AEO' as const, score: 85, issues: [] }
  ],
  seoReport: { score: 92, insights: [] },
  geoReport: { score: 88, insights: [] },
  aeoReport: { score: 85, insights: [] },
  icePriorities: [
    {
      id: '1',
      strategyName: 'SEO 최적화 전략',
      impact: 9,
      confidence: 8,
      ease: 7,
      finalScore: 8.0,
      description: '검색 엔진 최적화를 통한 유입 증대'
    }
  ],
  diagnosisHistory: [],
  onlineChannelDiagnostics: {},
  channelDiagnostics: {}
}

export default function ComprehensiveOpinionPage() {
  const searchParams = useSearchParams()
  const companyName = searchParams.get('brand_name') || '삼성생명'
  const [dashboardData, setDashboardData] = useState<DashboardData>(MOCK_DATA)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [companyName])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                  종합의견 (분석 및 전략수립)
                </h1>
                <p className="text-sm text-gray-500 mt-1">{companyName} 종합 평가 및 전략 제안</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* 리포트 발행 전 분석 (종합평가, SWOT, 전략수립) */}
          <ReportPreIssueAnalysis
            companyName={companyName}
            currentScore={dashboardData.overallScore}
          />

          {/* AI 실행 요약 */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">AI 실행 요약</h2>
            <ExecutiveSummary
              brandId={companyName}
            />
          </div>

          {/* 우선순위 전략 */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">우선순위 전략 (ICE Score)</h2>
            <ICETodoList priorities={dashboardData.icePriorities} />
          </div>
        </div>
      </div>
    </div>
  )
}
