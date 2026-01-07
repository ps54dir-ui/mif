'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { OverallScoreCard } from '@/components/dashboard/OverallScoreCard'
import { RadarChartComponent } from '@/components/dashboard/RadarChartComponent'
import { SEOGEOReportCards } from '@/components/dashboard/SEOGEOReportCards'
import { ICETodoList } from '@/components/dashboard/ICETodoList'
import { DiagnosisTimeline } from '@/components/dashboard/DiagnosisTimeline'
import { ChannelConnectionStatus } from '@/components/dashboard/ChannelConnectionStatus'
import { OnlineChannelDiagnostics } from '@/components/dashboard/OnlineChannelDiagnostics'
import { ComplianceDashboard } from '@/components/dashboard/ComplianceDashboard'
import { MarketProtectionDashboard } from '@/components/dashboard/MarketProtectionDashboard'
import { DataCollectionSummary } from '@/components/dashboard/DataCollectionSummary'
import { ArrowLeft, FileText } from 'lucide-react'
import Link from 'next/link'
import type { DashboardData } from '@/shared/types/dashboard'

// Mock 데이터 (실제로는 API에서 가져옴)
const MOCK_DATA: DashboardData = {
  overallScore: 88,
  fourAxes: {
    inflow: 95,
    persuasion: 89,
    trust: 85,
    circulation: 82
  },
  seoReport: {
    score: 92,
    insights: ['검색 노출 최적화', '키워드 전략 우수']
  },
  seoGeoAeoReports: [
    { type: 'SEO' as const, score: 92, issues: [] },
    { type: 'GEO' as const, score: 88, issues: [] },
    { type: 'AEO' as const, score: 85, issues: [] }
  ],
  geoReport: {
    score: 88,
    insights: ['지역 검색 최적화', '지도 노출 양호']
  },
  aeoReport: {
    score: 85,
    insights: ['AI 권위 구축', '추천 시스템 활용']
  },
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
  onlineChannelDiagnostics: {
    youtube: {
      video_mentions_growth: 0,
      viral_index: 0
    },
    instagram: {
      engagement_index: 0,
      hashtag_spread_rank: ''
    }
  } as any,
  channelDiagnostics: {}
}

export default function DiagnosisResultsPage() {
  const searchParams = useSearchParams()
  const companyName = searchParams.get('brand_name') || '삼성생명'
  const [dashboardData, setDashboardData] = useState<DashboardData>(MOCK_DATA)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 실제로는 API에서 데이터를 가져옴
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
                  <FileText className="w-6 h-6 text-blue-600" />
                  전체 분석 자료 (진단결과)
                </h1>
                <p className="text-sm text-gray-500 mt-1">{companyName} 종합 진단 결과</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* 데이터 수집 요약 정보 (3개월 분석 기간) */}
          <DataCollectionSummary 
            analysisPeriod={{ months: 3 }}
          />
          
          {/* 종합 점수 */}
          <OverallScoreCard score={dashboardData.overallScore} />

          {/* 4대 축 분석 */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">4대 축 분석</h2>
            <RadarChartComponent data={dashboardData.fourAxes} />
          </div>

          {/* SEO/GEO/AEO 리포트 */}
          <SEOGEOReportCards
            reports={dashboardData.seoGeoAeoReports}
            showDetailed={true}
          />

          {/* ICE Score 우선순위 */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">ICE Score 우선순위</h2>
            <ICETodoList priorities={dashboardData.icePriorities} />
          </div>

          {/* 진단 타임라인 */}
          <DiagnosisTimeline history={dashboardData.diagnosisHistory} />

          {/* 채널 연결 현황 */}
          <ChannelConnectionStatus brandId={companyName} />

          {/* 온라인 채널 진단 */}
          {dashboardData.onlineChannelDiagnostics && (
            <OnlineChannelDiagnostics
              diagnostics={dashboardData.onlineChannelDiagnostics as any}
            />
          )}

          {/* 컴플라이언스 대시보드 */}
          <ComplianceDashboard />

          {/* 시장 보호 대시보드 */}
          <MarketProtectionDashboard />
        </div>
      </div>
    </div>
  )
}
