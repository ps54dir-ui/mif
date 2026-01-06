/**
 * 3층 통합 마케팅 OS 대시보드
 * Layer 1 (비즈니스) + Layer 2 (컴플라이언스) + Layer 3 (시장 보호) 통합 뷰
 */

'use client'

import { useState } from 'react'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts'

interface IntegratedMarketingOSDashboardProps {
  companyName?: string
  businessHealthScore?: number
  complianceHealthScore?: number
  marketSafetyScore?: number
}

export function IntegratedMarketingOSDashboard({
  companyName = '삼성생명',
  businessHealthScore = 88,
  complianceHealthScore = 92,
  marketSafetyScore = 82
}: IntegratedMarketingOSDashboardProps) {
  // Mock 데이터
  const [data] = useState({
    businessHealth: {
      score: businessHealthScore,
      trend: 'up' as const,
      keyMetrics: {
        pageQuality: 95,
        trafficQuality: 90,
        reviewSatisfaction: 85,
        growthRate: 12.5
      }
    },
    complianceHealth: {
      score: complianceHealthScore,
      rating: 'AA' as const,
      riskLevel: 'low' as const,
      violations: 0,
      warnings: 2,
      lastCheck: new Date()
    },
    marketSafety: {
      score: marketSafetyScore,
      threatsDetected: 2,
      competitorsMonitored: 3,
      platformHealth: 'healthy' as const,
      yourProtectionLevel: 'excellent' as const
    },
    realTimeAlerts: [
      {
        type: 'warning' as const,
        message: '인스타그램 플랫폼에서 봇 계정 의심 활동 증가',
        action: '플랫폼 모니터링 강화',
        priority: 7
      },
      {
        type: 'opportunity' as const,
        message: '틱톡 설득 지수 개선 기회 발견',
        action: '콘텐츠 전략 재구성 검토',
        priority: 8
      }
    ],
    actionItems: [
      {
        priority: 'high' as const,
        area: 'business' as const,
        action: '틱톡 설득 지수 개선 - 콘텐츠 전략 재구성',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        owner: '마케팅 팀'
      },
      {
        priority: 'medium' as const,
        area: 'compliance' as const,
        action: 'CCPA 개인정보 처리 동의서 보완',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        owner: '법무 팀'
      },
      {
        priority: 'high' as const,
        area: 'market' as const,
        action: '경쟁사 A 부정행위 증거 수집 완료',
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        owner: '시장 보호 팀'
      }
    ]
  })

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return '📈'
      case 'down':
        return '📉'
      default:
        return '➡️'
    }
  }

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'AAA':
        return 'bg-green-500'
      case 'AA':
        return 'bg-blue-500'
      case 'A':
        return 'bg-yellow-500'
      case 'B':
        return 'bg-orange-500'
      case 'C':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'none':
        return 'text-green-600 bg-green-50'
      case 'low':
        return 'text-blue-600 bg-blue-50'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50'
      case 'high':
        return 'text-orange-600 bg-orange-50'
      case 'critical':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'bg-red-100 border-red-300 text-red-800'
      case 'warning':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800'
      case 'opportunity':
        return 'bg-green-100 border-green-300 text-green-800'
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  // 레이더 차트 데이터
  const radarData = [
    { category: '비즈니스 건강도', score: data.businessHealth.score },
    { category: '컴플라이언스', score: data.complianceHealth.score },
    { category: '시장 안전도', score: data.marketSafety.score }
  ]

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">3층 통합 마케팅 OS 대시보드</h2>
          <p className="text-gray-600 mt-1">{companyName} 종합 건강도 분석</p>
        </div>
      </div>

      {/* 3개 건강도 점수 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 비즈니스 건강도 */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-6 text-white shadow-lg">
          <div className="text-sm opacity-90 mb-2">Layer 1: 비즈니스 건강도</div>
          <div className="text-4xl font-bold mb-2">
            {data.businessHealth.score}
            <span className="text-2xl opacity-80">/100</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span>{getTrendIcon(data.businessHealth.trend)}</span>
            <span>{data.businessHealth.trend === 'up' ? '상승' : data.businessHealth.trend === 'down' ? '하락' : '유지'}</span>
          </div>
          <div className="mt-4 space-y-2 text-xs">
            <div>페이지 품질: {data.businessHealth.keyMetrics.pageQuality}점</div>
            <div>트래픽 품질: {data.businessHealth.keyMetrics.trafficQuality}점</div>
            <div>리뷰 만족도: {data.businessHealth.keyMetrics.reviewSatisfaction}점</div>
            <div>성장률: {data.businessHealth.keyMetrics.growthRate}%</div>
          </div>
        </div>

        {/* 컴플라이언스 건강도 */}
        <div className={`bg-gradient-to-br ${getRatingColor(data.complianceHealth.rating)} rounded-xl p-6 text-white shadow-lg`}>
          <div className="text-sm opacity-90 mb-2">Layer 2: 컴플라이언스 건강도</div>
          <div className="text-4xl font-bold mb-2">
            {data.complianceHealth.score}
            <span className="text-2xl opacity-80">/100</span>
          </div>
          <div className="text-lg font-semibold mb-2">{data.complianceHealth.rating}</div>
          <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/20 ${getRiskColor(data.complianceHealth.riskLevel)}`}>
            위험도: {data.complianceHealth.riskLevel === 'low' ? '낮음' :
                    data.complianceHealth.riskLevel === 'medium' ? '중간' :
                    data.complianceHealth.riskLevel === 'high' ? '높음' : '없음'}
          </div>
          <div className="mt-4 space-y-1 text-xs">
            <div>위반: {data.complianceHealth.violations}건</div>
            <div>경고: {data.complianceHealth.warnings}건</div>
            <div>최종 확인: {data.complianceHealth.lastCheck.toLocaleDateString('ko-KR')}</div>
          </div>
        </div>

        {/* 시장 안전도 */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl p-6 text-white shadow-lg">
          <div className="text-sm opacity-90 mb-2">Layer 3: 시장 안전도</div>
          <div className="text-4xl font-bold mb-2">
            {data.marketSafety.score}
            <span className="text-2xl opacity-80">/100</span>
          </div>
          <div className="text-sm mb-2">
            플랫폼 건강: {data.marketSafety.platformHealth === 'healthy' ? '✅ 양호' :
                        data.marketSafety.platformHealth === 'warning' ? '⚠️ 주의' : '❌ 위험'}
          </div>
          <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/20`}>
            보호 수준: {data.marketSafety.yourProtectionLevel === 'excellent' ? '우수' :
                       data.marketSafety.yourProtectionLevel === 'good' ? '양호' :
                       data.marketSafety.yourProtectionLevel === 'fair' ? '보통' : '낮음'}
          </div>
          <div className="mt-4 space-y-1 text-xs">
            <div>위협 감지: {data.marketSafety.threatsDetected}건</div>
            <div>감시 경쟁사: {data.marketSafety.competitorsMonitored}개</div>
          </div>
        </div>
      </div>

      {/* 레이더 차트 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">3층 비교 분석</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="category" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
            <Radar
              name="건강도"
              dataKey="score"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* 실시간 알림 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">실시간 알림</h3>
        <div className="space-y-3">
          {data.realTimeAlerts.map((alert, index) => (
            <div key={index} className={`border-2 rounded-lg p-4 ${getAlertColor(alert.type)}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-semibold mb-1">{alert.message}</div>
                  <div className="text-sm opacity-80">권장 조치: {alert.action}</div>
                </div>
                <div className="text-xs opacity-70">우선순위: {alert.priority}/10</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 액션 아이템 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">우선순위 액션 아이템</h3>
        <div className="space-y-3">
          {data.actionItems.map((item, index) => (
            <div key={index} className={`border-2 rounded-lg p-4 ${getPriorityColor(item.priority)}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="font-semibold mb-1">{item.action}</div>
                  <div className="text-sm opacity-80">
                    영역: {item.area === 'business' ? '비즈니스' :
                          item.area === 'compliance' ? '컴플라이언스' : '시장 보호'}
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-xs opacity-70 mb-1">담당자</div>
                  <div className="font-semibold text-sm">{item.owner}</div>
                  <div className="text-xs opacity-70 mt-1">
                    마감: {item.deadline.toLocaleDateString('ko-KR')}
                  </div>
                </div>
              </div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(item.priority)}`}>
                {item.priority === 'high' ? '높음' :
                 item.priority === 'medium' ? '중간' : '낮음'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
