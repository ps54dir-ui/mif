'use client'

import { OverallScoreCard } from '@/components/dashboard/OverallScoreCard'
import { RadarChartComponent } from '@/components/dashboard/RadarChartComponent'
import { SEOGEOReportCards } from '@/components/dashboard/SEOGEOReportCards'
import { ChannelDiagnosticsCard } from '@/components/dashboard/ChannelDiagnosticsCard'
import { OnlineChannelDiagnostics } from '@/components/dashboard/OnlineChannelDiagnostics'
import { ChannelAsymmetryAnalysis } from '@/components/dashboard/ChannelAsymmetryAnalysis'
import { DigitalShareCard } from '@/components/dashboard/DigitalShareCard'
import { ChannelConnectionStatus } from '@/components/dashboard/ChannelConnectionStatus'
import { GA4AnalyticsDashboard } from '@/components/dashboard/GA4AnalyticsDashboard'
import PageOverlayVisualization from '@/components/ga4/PageOverlayVisualization'
import { generatePageOverlayData } from '@/lib/ga4/pageOverlay'
import MetaAdsDashboard from '@/components/meta/MetaAdsDashboard'
import AIAuthorityDashboard from '@/components/aeo/AIAuthorityDashboard'
import { PDFExportButton } from '@/components/dashboard/PDFExportButton'
import { NaverPlaceDiagnosis } from '@/components/dashboard/NaverPlaceDiagnosis'
import { HomepageAnalysis } from '@/components/dashboard/HomepageAnalysis'
import { ReviewManagementEvaluation } from '@/components/dashboard/ReviewManagementEvaluation'
import { IntegratedDataDashboard } from '@/components/dashboard/IntegratedDataDashboard'
import { DataCollectionSummary } from '@/components/dashboard/DataCollectionSummary'
import { NaverSearchResults } from '@/components/dashboard/NaverSearchResults'
import { useDashboardData } from '../shared/useDashboardData'

// 회사명을 기반으로 홈페이지 URL 생성 헬퍼 함수
function getCompanyHomepageUrl(companyName: string): string {
  if (!companyName) return 'https://example.com'
  
  // 알려진 회사명 매핑
  const knownUrls: Record<string, string> = {
    '나이키': 'https://nike.com',
    'nike': 'https://nike.com',
    '삼성': 'https://samsung.com',
    '삼성전자': 'https://samsung.com',
    'samsung': 'https://samsung.com',
    '애플': 'https://apple.com',
    'apple': 'https://apple.com',
    '구글': 'https://google.com',
    'google': 'https://google.com',
    'LG': 'https://lg.com',
    'lg': 'https://lg.com',
    '현대': 'https://hyundai.com',
    'hyundai': 'https://hyundai.com',
  }
  
  // 정확한 매칭 확인
  const normalizedName = companyName.toLowerCase().trim()
  if (knownUrls[normalizedName] || knownUrls[companyName]) {
    return knownUrls[normalizedName] || knownUrls[companyName]
  }
  
  // 부분 매칭 (예: "삼성전자" → "삼성" 매칭)
  for (const [key, url] of Object.entries(knownUrls)) {
    if (normalizedName.includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedName)) {
      return url
    }
  }
  
  // 매칭되지 않으면 회사명 기반으로 추정 (영문인 경우)
  if (/^[a-zA-Z0-9\s]+$/.test(companyName)) {
    const domain = companyName.toLowerCase().replace(/\s+/g, '')
    return `https://${domain}.com`
  }
  
  // 기본값
  return 'https://example.com'
}

export default function DiagnosisPage() {
  const { dashboardData, loading, companyName } = useDashboardData()
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null

  // 채널/카테고리 anchor로 스크롤
  useEffect(() => {
    if (!searchParams) return
    const key = searchParams.get('channel') || searchParams.get('category')
    if (!key) return
    const el = document.getElementById(`section-${key}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])
  const homepageUrl = getCompanyHomepageUrl(companyName)

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
    <div id="dashboard-container" className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* 헤더 섹션 */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl shadow-2xl p-8 text-white">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold mb-1">{companyName} 진단 및 분석</h1>
                  <p className="text-blue-100 text-sm lg:text-base">각 분야별 상세 진단 결과</p>
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-4">
                <div>
                  <div className="text-sm text-blue-100 mb-1">종합 점수</div>
                  <div className="text-5xl lg:text-6xl font-bold">
                    {dashboardData.overallScore}
                    <span className="text-3xl lg:text-4xl text-blue-200">/100</span>
                  </div>
                </div>
                <div className="text-blue-100 text-sm lg:text-base pt-2">
                  <div>진단 일자: {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  <div>버전: v{dashboardData.diagnosisHistory[0]?.version || 3}</div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <PDFExportButton reportId={dashboardData.icePriorities[0]?.id || 'default'} />
            </div>
          </div>
        </div>

        {/* ========== 각 분야별 진단 섹션 ========== */}
        
        {/* 데이터 수집 요약 정보 (3개월 분석 기간) */}
        <DataCollectionSummary 
          analysisPeriod={{ months: 3 }}
        />
        
        {/* 네이버 검색 결과 */}
        <NaverSearchResults companyName={companyName} />
        
        {/* SEO/GEO/AEO 리포트 - 종합 진단 */}
        <div id="section-seo-geo-aeo" className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden p-6">
          <SEOGEOReportCards reports={dashboardData.seoGeoAeoReports} showDetailed={true} />
        </div>

        {/* 채널 분석 섹션 - 2열 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 채널 진단 */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {dashboardData.channelDiagnostics && (
              <ChannelDiagnosticsCard diagnostics={dashboardData.channelDiagnostics as any} />
            )}
          </div>

          {/* 온라인 채널 진단 */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {dashboardData.onlineChannelDiagnostics && (
              <OnlineChannelDiagnostics diagnostics={dashboardData.onlineChannelDiagnostics} />
            )}
          </div>
        </div>

        {/* 채널 간 비대칭 분석 */}
        {dashboardData.channelAsymmetry && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <ChannelAsymmetryAnalysis asymmetry={dashboardData.channelAsymmetry} />
          </div>
        )}

        {/* 종합 디지털 점유율 */}
        {dashboardData.digitalShare && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <DigitalShareCard digitalShare={dashboardData.digitalShare} />
          </div>
        )}

        {/* 채널 연결 현황 */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <ChannelConnectionStatus
            brandId={companyName}
            onChannelConnect={() => {}}
          />
        </div>

        {/* GA4 실시간 분석 */}
        <div id="section-ga4" className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <GA4AnalyticsDashboard brandId={companyName} psychologicalStimulus={75} videoViews={100000} />
        </div>

        {/* 상세페이지 이탈률 분석 */}
        {typeof window !== 'undefined' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <PageOverlayVisualization 
              overlayData={generatePageOverlayData('https://nike.com/product', 65)} 
            />
          </div>
        )}

        {/* 메타 광고 분석 */}
        {typeof window !== 'undefined' && (
          <div id="section-meta" className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <MetaAdsDashboard
              metaPerformance={{
                campaigns: [],
                totalImpressions: 1250000,
                totalClicks: 45000,
                totalSpend: 850000,
                totalConversions: 1250,
                averageCTR: 3.6,
                averageCPC: 18.9,
                averageROAS: 4.2,
                lastUpdated: new Date().toISOString()
              }}
              ga4Matches={[{
                campaignId: 'campaign_1',
                campaignName: `${companyName} 캠페인`,
                metaClicks: 45000,
                ga4Sessions: 32000,
                matchRate: 71.1,
                ga4Conversions: 1250,
                conversionRate: 3.9,
                attributionGap: 0
              }]}
              psychologyDiagnoses={[{
                creativeId: 'creative_1',
                creativeName: `${companyName} 프로모션`,
                headline: '새로운 도전을 시작하세요',
                description: `${companyName}와 함께`,
                psychology: {
                  type: 'dopamine' as const,
                  dopamineScore: 85,
                  cortisolScore: 45,
                  overallScore: 65,
                  keywords: ['기대감', '보상', '성취'],
                  tone: '긍정적이고 기대감을 자극하는 톤'
                },
                pagePsychologyMatch: {
                  matchScore: 78,
                  isAligned: true,
                  recommendation: '도파민 자극이 높아 관심 단계에서 효과적'
                }
              }]}
              optimizationReport={{
                strategies: [],
                overallInsight: 'CTR-CVR 갭이 2.1%로 적정 수준입니다',
                keyFindings: {
                  highCTRLowConversion: false,
                  psychologyMismatch: false,
                  attributionGap: false
                }
              }}
            />
          </div>
        )}

        {/* 홈페이지 분석 */}
        {typeof window !== 'undefined' && (
          <div id="section-homepage" className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <HomepageAnalysis
              metrics={{
                url: homepageUrl,
                overall_score: 78,
                first_impression_score: 24,
                navigation_score: 20,
                content_quality_score: 20,
                cta_effectiveness_score: 14,
                loading_time: 2.3,
                hero_section_quality: 'good',
                visual_hierarchy: 'good',
                menu_clarity: 'excellent',
                mobile_menu_quality: 'good',
                search_functionality: true,
                value_proposition_clarity: 'good',
                trust_signals_count: 8,
                social_proof_count: 12,
                primary_cta_visibility: 'needs_improvement',
                cta_count: 5,
                cta_placement_quality: 'good',
                issues: [
                  {
                    category: 'cta',
                    priority: 'MEDIUM',
                    message: '주요 CTA 가시성이 개선이 필요합니다',
                    recommendation: '히어로 섹션에 주요 CTA 버튼을 더 눈에 띄게 배치하고, 색상 대비를 높이세요'
                  },
                  {
                    category: 'first_impression',
                    priority: 'LOW',
                    message: '로딩 시간이 2.3초로 개선 여지가 있습니다',
                    recommendation: '이미지 최적화 및 코드 스플리팅을 통해 로딩 시간을 2초 이내로 단축하세요'
                  }
                ]
              }}
            />
          </div>
        )}

        {/* 네이버 플레이스 진단 */}
        {typeof window !== 'undefined' && (
          <div id="section-naver_place" className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <NaverPlaceDiagnosis
              metrics={{
                place_id: '1234567890',
                total_score: 75,
                search_visibility_score: 22,
                attractiveness_score: 28,
                conversion_score: 25,
                total_impressions: 15230,
                total_clicks: 850,
                ctr: 5.58,
                photo_review_count: 245,
                total_review_count: 380,
                photo_review_ratio: 64.5,
                reservation_count: 45,
                phone_click_count: 120,
                direction_click_count: 180,
                reply_rate: 65.2,
                average_rating: 4.3,
                keyword_rankings: [
                  { keyword: '나이키 매장', rank: 2 },
                  { keyword: '운동화 추천', rank: 5 },
                  { keyword: '스포츠 용품', rank: 8 }
                ],
                issues: [
                  {
                    type: 'crm',
                    priority: 'HIGH',
                    message: '리뷰 답글률이 65.2%로 목표치(80%) 미달'
                  },
                  {
                    type: 'visual_trust',
                    priority: 'MEDIUM',
                    message: '사진 리뷰 비중 개선 필요 (현재 64.5%)'
                  }
                ]
              }}
            />
          </div>
        )}

        {/* AI 권위 진단 (AEO) */}
        {typeof window !== 'undefined' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden p-6">
            <AIAuthorityDashboard
              authorityIndex={{
                overallScore: 82,
                averageRecommendationScore: 78,
                totalMentions: 5080,
                positiveSentimentRatio: 85,
                trustFactors: {
                  expertise: 70,
                  authority: 75,
                  trustworthiness: 73,
                  popularity: 68
                },
                evaluations: [
                  {
                    engine: 'chatgpt',
                    brandMention: 1250,
                    recommendationScore: 85,
                    sentiment: 'positive',
                    keyPhrases: ['프리미엄 브랜드', '혁신적인 기술', '글로벌 리더'],
                    context: 'ChatGPT는 브랜드를 매우 긍정적으로 평가하고 있습니다.'
                  },
                  {
                    engine: 'claude',
                    brandMention: 980,
                    recommendationScore: 82,
                    sentiment: 'positive',
                    keyPhrases: ['기술적 우수성', '디자인 혁신', '고객 만족도'],
                    context: 'Claude는 기술적 우수성을 강조하며 긍정적으로 평가합니다.'
                  },
                  {
                    engine: 'gemini',
                    brandMention: 1100,
                    recommendationScore: 88,
                    sentiment: 'positive',
                    keyPhrases: ['혁신 리더', '시장 선도', '고성능 제품'],
                    context: 'Gemini는 혁신 리더로 평가합니다.'
                  },
                  {
                    engine: 'perplexity',
                    brandMention: 750,
                    recommendationScore: 80,
                    sentiment: 'positive',
                    keyPhrases: ['시장 점유율', '브랜드 가치', '디지털 혁신'],
                    context: 'Perplexity는 높은 시장 점유율을 언급합니다.'
                  },
                  {
                    engine: 'copilot',
                    brandMention: 650,
                    recommendationScore: 78,
                    sentiment: 'positive',
                    keyPhrases: ['프리미엄 브랜드', '혁신 기술', '디지털 플랫폼'],
                    context: 'Copilot은 프리미엄 브랜드 포지셔닝을 강조합니다.'
                  }
                ],
                insights: [
                  'AI 검색 엔진들이 브랜드를 매우 긍정적으로 평가하고 있습니다.',
                  '대부분의 AI 엔진에서 긍정적 감정으로 언급되고 있습니다.',
                  '전문성과 권위가 높게 평가되고 있습니다.'
                ],
                recommendations: [
                  'AI 엔진에서 더 자주 언급되도록 구조화된 데이터(JSON-LD)를 강화하세요.',
                  'FAQ 섹션을 강화하여 AI가 직접 답변할 수 있는 구조로 개선하세요.',
                  '브랜드의 전문성과 혁신성을 강조하는 콘텐츠를 지속적으로 발행하세요.'
                ]
              }}
            />
          </div>
        )}

        {/* 리뷰 관리 및 평가 */}
        {typeof window !== 'undefined' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <ReviewManagementEvaluation
              metrics={{
                total_reviews: 380,
                average_rating: 4.3,
                response_rate: 65.2,
                average_response_time_hours: 28.5,
                sentiment_distribution: {
                  positive: 245,
                  neutral: 85,
                  negative: 50
                },
                recent_reviews: [
                  {
                    id: '1',
                    platform: 'naver_place',
                    author: '김**',
                    rating: 5,
                    content: '정말 만족스러운 구매였습니다. 품질도 좋고 배송도 빨라요!',
                    date: '2024-01-15',
                    has_photo: true,
                    sentiment: 'positive',
                    response_status: 'responded',
                    response_time_hours: 12,
                    keywords: ['품질', '배송', '만족']
                  },
                  {
                    id: '2',
                    platform: 'google',
                    author: '이**',
                    rating: 3,
                    content: '보통입니다. 가격 대비 그럭저럭 괜찮아요.',
                    date: '2024-01-14',
                    has_photo: false,
                    sentiment: 'neutral',
                    response_status: 'pending',
                    response_time_hours: 36,
                    keywords: ['가격', '보통']
                  },
                  {
                    id: '3',
                    platform: 'naver_place',
                    author: '박**',
                    rating: 2,
                    content: '배송이 너무 늦었고 상품 상태도 좋지 않았습니다.',
                    date: '2024-01-13',
                    has_photo: true,
                    sentiment: 'negative',
                    response_status: 'responded',
                    response_time_hours: 8,
                    keywords: ['배송', '상품 상태']
                  }
                ],
                top_keywords: [
                  { keyword: '품질', count: 120, sentiment: 'positive' },
                  { keyword: '배송', count: 95, sentiment: 'neutral' },
                  { keyword: '가격', count: 78, sentiment: 'neutral' },
                  { keyword: '서비스', count: 65, sentiment: 'positive' },
                  { keyword: '상품 상태', count: 45, sentiment: 'negative' }
                ],
                issues: [
                  {
                    type: 'low_response_rate',
                    priority: 'HIGH',
                    message: '리뷰 답글률이 65.2%로 목표치(80%)에 미달합니다',
                    recommendation: '모든 리뷰에 48시간 이내 답글을 달아 고객 관리(CRM)를 강화하세요'
                  },
                  {
                    type: 'slow_response',
                    priority: 'MEDIUM',
                    message: '평균 응답 시간이 28.5시간으로 개선 여지가 있습니다',
                    recommendation: '부정 리뷰는 24시간 이내, 긍정 리뷰는 48시간 이내 응답을 목표로 하세요'
                  },
                  {
                    type: 'negative_reviews',
                    priority: 'HIGH',
                    message: '부정 리뷰가 50개(13.2%)로 높은 편입니다',
                    recommendation: '부정 리뷰에 적극적으로 대응하고, 개선 조치를 취한 내용을 공유하세요'
                  }
                ]
              }}
            />
          </div>
        )}

        {/* ========== 종합 진단 및 분석 (하단) ========== */}
        <div className="border-t-4 border-blue-600 pt-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">📈 종합 진단 및 분석</h2>
            <p className="text-gray-600">모든 분야의 진단 결과를 종합하여 상대적·균형적으로 분석한 결과입니다.</p>
          </div>

          {/* 핵심 지표 섹션 - 4대 축 분석 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <OverallScoreCard score={dashboardData.overallScore} />
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <RadarChartComponent data={dashboardData.fourAxes} />
            </div>
          </div>

          {/* 통합 데이터 대시보드 */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <IntegratedDataDashboard brandId={companyName} />
          </div>
        </div>
      </div>
    </div>
  )
}
