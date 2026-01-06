'use client'

import { ICETodoList } from '@/components/dashboard/ICETodoList'
import { PriorityAlert } from '@/components/dashboard/PriorityAlert'
import { WeeklyChecklist } from '@/components/dashboard/WeeklyChecklist'
import { ExecutiveSummary } from '@/components/dashboard/ExecutiveSummary'
import { PDFExportButton } from '@/components/dashboard/PDFExportButton'
import { AEOStrategyConsulting } from '@/components/dashboard/AEOStrategyConsulting'
import { ReviewBasedStrategy } from '@/components/dashboard/ReviewBasedStrategy'
import {
  MarketCompetitiveAnalysis,
  CustomerPsychologyAnalysis,
  ChannelDetailedStrategy,
  ExecutionPlan,
  KPIDashboard,
  RiskManagementComponent,
  StrategicRoadmapComponent,
  InvestmentROI
} from '@/components/consulting'
import {
  nikeMarketAnalysis,
  nikeCustomerAnalysis,
  nikeChannelStrategy,
  nikeExecutionPlan,
  nikeKPIs,
  nikeRiskManagement,
  nikeRoadmap,
  nikeInvestmentROI
} from '@/data/consultingMockData'
import { useDashboardData } from '../shared/useDashboardData'

export default function StrategyPage() {
  const { dashboardData, loading, companyName } = useDashboardData()

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

  const topPriority = dashboardData.icePriorities[0]
  const executionGuide = {
    todos: [
      {
        task: '전략 실행 계획 수립',
        description: topPriority?.description || '우선순위 전략 실행을 위한 상세 계획 수립',
        priority: 'HIGH' as const,
        estimated_time: '2-3시간',
        owner: '마케팅 팀'
      },
      {
        task: '실행 가이드 검토',
        description: '전문가 피드백의 실행 가이드를 검토하고 담당자 배정',
        priority: 'HIGH' as const,
        estimated_time: '1시간',
        owner: '프로젝트 매니저'
      },
      {
        task: '진행 상황 모니터링',
        description: '실행 진행 상황을 정기적으로 모니터링하고 조정',
        priority: 'MEDIUM' as const,
        estimated_time: '지속적',
        owner: '마케팅 팀'
      }
    ]
  }

  return (
    <div id="dashboard-container" className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* 헤더 섹션 */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 rounded-2xl shadow-2xl p-8 text-white">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold mb-1">{companyName} 전략 수립 제안</h1>
                  <p className="text-purple-100 text-sm lg:text-base">ICE Score 기반 우선순위 전략 및 실행 가이드</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <PDFExportButton reportId={topPriority?.id || 'default'} />
            </div>
          </div>
        </div>

        {/* 경영진 요약 */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <ExecutiveSummary brandId={companyName} />
        </div>

        {/* 최우선 실행 과제 알림 */}
        {topPriority && (
          <PriorityAlert topPriority={topPriority} executionGuide={executionGuide} />
        )}

        {/* ICE Score 우선순위 전략 */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <ICETodoList priorities={dashboardData.icePriorities} />
        </div>

        {/* 포괄적 AEO 최적화 컨설팅 */}
        {dashboardData.seoGeoAeoReports && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <AEOStrategyConsulting
              currentAEOScore={
                dashboardData.seoGeoAeoReports.find(r => r.type === 'AEO')?.score || 0
              }
              diagnosisData={{
                hasStructuredData: true, // TODO: 실제 진단 데이터에서 가져오기
                faqCount: 5, // TODO: 실제 진단 데이터에서 가져오기
                statisticsCount: 3, // TODO: 실제 진단 데이터에서 가져오기
                citationCount: 2, // TODO: 실제 진단 데이터에서 가져오기
                hasVideoContent: false, // TODO: 실제 진단 데이터에서 가져오기
                hasTableContent: true // TODO: 실제 진단 데이터에서 가져오기
              }}
            />
          </div>
        )}

        {/* 시장 & 경쟁 분석 */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <MarketCompetitiveAnalysis
            analysis={nikeMarketAnalysis}
            brandName={companyName}
          />
        </div>

        {/* 고객 심리 & 행동 분석 */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <CustomerPsychologyAnalysis
            analysis={nikeCustomerAnalysis}
            brandName={companyName}
          />
        </div>

        {/* 채널별 상세 전략 */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <ChannelDetailedStrategy
            strategy={nikeChannelStrategy}
            brandName={companyName}
          />
        </div>

        {/* 주간/월간 실행 계획 */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <ExecutionPlan
            plan={nikeExecutionPlan}
            brandName={companyName}
          />
        </div>

        {/* KPI & 성공 지표 대시보드 */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <KPIDashboard
            kpis={nikeKPIs}
            brandName={companyName}
          />
        </div>

        {/* 리스크 관리 & 대응 계획 */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <RiskManagementComponent
            risks={nikeRiskManagement}
            brandName={companyName}
          />
        </div>

        {/* 3-6개월 전략 로드맵 */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <StrategicRoadmapComponent
            roadmap={nikeRoadmap}
            brandName={companyName}
          />
        </div>

        {/* 투자 분석 & ROI */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <InvestmentROI
            analysis={nikeInvestmentROI}
            brandName={companyName}
          />
        </div>

        {/* 리뷰 기반 마케팅 & 개선 전략 */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <ReviewBasedStrategy
            reviews={[
              // TODO: 실제 리뷰 데이터를 API에서 가져오기
              {
                id: '1',
                text: '정말 만족스러운 제품입니다. 품질도 좋고 서비스도 훌륭해요!',
                rating: 5,
                author: '홍길동',
                platform: 'naver_place',
                date: new Date().toISOString(),
                sentiment: 'positive'
              },
              {
                id: '2',
                text: '배송이 너무 느려서 실망했어요. 제품은 괜찮은데...',
                rating: 2,
                author: '김철수',
                platform: 'google',
                date: new Date().toISOString(),
                sentiment: 'negative'
              }
            ]}
            brandName={companyName}
          />
        </div>

        {/* 주간 업무 체크리스트 */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <WeeklyChecklist brandId={companyName} />
        </div>
      </div>
    </div>
  )
}
