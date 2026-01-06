'use client'

import React from 'react'

interface MarketProtectionData {
  overallHealth: number
  competitorThreats: Array<{
    competitor: string
    threatType: string
    severity: 'LOW' | 'MEDIUM' | 'HIGH'
    description: string
    detectedAt: string
  }>
  platformMonitoring: Array<{
    platform: string
    fraudDetected: number
    status: 'NORMAL' | 'WARNING' | 'ALERT'
    lastCheck: string
  }>
  reviewAttacks: Array<{
    platform: string
    suspiciousReviews: number
    attackPattern: string
    recommendation: string
  }>
  marketHealth: {
    score: number
    trend: 'IMPROVING' | 'STABLE' | 'DEGRADING'
    issues: string[]
  }
  evidenceCollected: number
}

interface MarketProtectionDashboardProps {
  marketProtectionData?: MarketProtectionData
}

// Mock 데이터
const MOCK_MARKET_PROTECTION_DATA: MarketProtectionData = {
  overallHealth: 82,
  competitorThreats: [
    {
      competitor: '경쟁사 A',
      threatType: '리뷰 조작 의심',
      severity: 'MEDIUM',
      description: '일정 패턴의 부정 리뷰 감지',
      detectedAt: '2024-01-15'
    },
    {
      competitor: '경쟁사 B',
      threatType: '키워드 스쿼팅',
      severity: 'LOW',
      description: '유사 브랜드명 도메인 등록',
      detectedAt: '2024-01-10'
    }
  ],
  platformMonitoring: [
    {
      platform: '네이버',
      fraudDetected: 2,
      status: 'NORMAL',
      lastCheck: '2024-01-20'
    },
    {
      platform: '쿠팡',
      fraudDetected: 0,
      status: 'NORMAL',
      lastCheck: '2024-01-20'
    },
    {
      platform: '인스타그램',
      fraudDetected: 5,
      status: 'WARNING',
      lastCheck: '2024-01-20'
    }
  ],
  reviewAttacks: [
    {
      platform: '네이버',
      suspiciousReviews: 3,
      attackPattern: '집중 공격 패턴',
      recommendation: '리뷰 신고 및 증거 수집 필요'
    },
    {
      platform: '인스타그램',
      suspiciousReviews: 8,
      attackPattern: '봇 계정 의심',
      recommendation: '플랫폼에 신고 및 대응 전략 수립'
    }
  ],
  marketHealth: {
    score: 82,
    trend: 'STABLE',
    issues: [
      '인스타그램 플랫폼에서 봇 계정 의심 활동 증가',
      '경쟁사 리뷰 조작 의심 사례 감지'
    ]
  },
  evidenceCollected: 15
}

export function MarketProtectionDashboard({ marketProtectionData = MOCK_MARKET_PROTECTION_DATA }: MarketProtectionDashboardProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'LOW':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'HIGH':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NORMAL':
        return 'text-green-600 bg-green-50'
      case 'WARNING':
        return 'text-yellow-600 bg-yellow-50'
      case 'ALERT':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'IMPROVING':
        return '📈'
      case 'STABLE':
        return '➡️'
      case 'DEGRADING':
        return '📉'
      default:
        return '➡️'
    }
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">시장 보호 시스템</h2>
          <p className="text-gray-600 mt-1">경쟁사 부정행위 감지 및 시장 건전성 모니터링</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600 mb-1">시장 건전성 점수</div>
          <div className="text-4xl font-bold text-purple-600">{marketProtectionData.overallHealth}<span className="text-2xl text-gray-500">/100</span></div>
          <div className="mt-2 px-3 py-1 rounded-full text-sm font-semibold inline-block bg-purple-50 text-purple-600">
            {getTrendIcon(marketProtectionData.marketHealth.trend)} {marketProtectionData.marketHealth.trend === 'IMPROVING' ? '개선 중' : marketProtectionData.marketHealth.trend === 'STABLE' ? '안정' : '악화'}
          </div>
        </div>
      </div>

      {/* 경쟁사 위협 감지 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">경쟁사 부정행위 감지</h3>
        {marketProtectionData.competitorThreats.length > 0 ? (
          <div className="space-y-3">
            {marketProtectionData.competitorThreats.map((threat, index) => (
              <div key={index} className={`border-2 rounded-lg p-4 ${getSeverityColor(threat.severity)}`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-semibold">{threat.competitor}</div>
                    <div className="text-sm opacity-80">{threat.threatType}</div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/50">
                    {threat.severity === 'LOW' ? '낮음' : threat.severity === 'MEDIUM' ? '중간' : '높음'}
                  </span>
                </div>
                <div className="text-sm mb-1">{threat.description}</div>
                <div className="text-xs opacity-70">감지일: {threat.detectedAt}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">감지된 위협이 없습니다.</div>
        )}
      </div>

      {/* 플랫폼 감시 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">플랫폼 감시 현황</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {marketProtectionData.platformMonitoring.map((platform, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{platform.platform}</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(platform.status)}`}>
                  {platform.status === 'NORMAL' ? '정상' : platform.status === 'WARNING' ? '주의' : '경고'}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{platform.fraudDetected}건</div>
              <div className="text-xs text-gray-600">부정행위 감지</div>
              <div className="text-xs text-gray-500 mt-2">최종 확인: {platform.lastCheck}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 악플/공격 감지 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">악플/공격 감지</h3>
        <div className="space-y-4">
          {marketProtectionData.reviewAttacks.map((attack, index) => (
            <div key={index} className="border border-orange-200 bg-orange-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-orange-900">{attack.platform}</h4>
                <span className="text-sm font-bold text-orange-600">{attack.suspiciousReviews}건 의심</span>
              </div>
              <div className="text-sm text-orange-800 mb-2">공격 패턴: {attack.attackPattern}</div>
              <div className="text-sm text-orange-700 bg-white/50 rounded p-2">권장 조치: {attack.recommendation}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 증거 수집 현황 */}
      <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-1">증거 수집 현황</h3>
            <p className="text-blue-700 text-sm">부정행위 신고를 위한 증거가 수집되었습니다</p>
          </div>
          <div className="text-4xl font-bold text-blue-600">{marketProtectionData.evidenceCollected}건</div>
        </div>
      </div>
    </div>
  )
}
