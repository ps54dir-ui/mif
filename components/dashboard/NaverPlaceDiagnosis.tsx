'use client'

import React from 'react'

interface NaverPlaceMetrics {
  place_id: string
  total_score: number
  search_visibility_score: number // 발견성 (30점)
  attractiveness_score: number // 매력도 (40점)
  conversion_score: number // 전환력 (30점)
  total_impressions: number
  total_clicks: number
  ctr: number
  photo_review_count: number
  total_review_count: number
  photo_review_ratio: number
  reservation_count: number
  phone_click_count: number
  direction_click_count: number
  reply_rate: number // 리뷰 답글률
  average_rating: number
  keyword_rankings: {
    keyword: string
    rank: number
  }[]
  issues: {
    type: 'visual_trust' | 'keyword_optimization' | 'crm' | 'review_management'
    priority: 'HIGH' | 'MEDIUM' | 'LOW'
    message: string
  }[]
}

interface NaverPlaceDiagnosisProps {
  metrics: NaverPlaceMetrics
}

export function NaverPlaceDiagnosis({ metrics }: NaverPlaceDiagnosisProps) {
  const getScoreStatus = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 80) return { label: '우수', color: 'text-green-600', bg: 'bg-green-100' }
    if (percentage >= 60) return { label: '양호', color: 'text-blue-600', bg: 'bg-blue-100' }
    if (percentage >= 40) return { label: '보통', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    return { label: '부족', color: 'text-red-600', bg: 'bg-red-100' }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-700 border-red-300'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'LOW':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const searchVisibilityStatus = getScoreStatus(metrics.search_visibility_score, 30)
  const attractivenessStatus = getScoreStatus(metrics.attractiveness_score, 40)
  const conversionStatus = getScoreStatus(metrics.conversion_score, 30)
  const overallStatus = getScoreStatus(metrics.total_score, 100)

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">📍 네이버 플레이스 진단</h2>
            <p className="text-green-100 text-sm">발견성·매력도·전환력 종합 분석</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{metrics.total_score}</div>
            <div className="text-lg text-green-100">/100점</div>
            <div className={`text-sm font-medium mt-1 ${overallStatus.bg} ${overallStatus.color} px-2 py-1 rounded`}>
              {overallStatus.label}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 점수 개요 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 발견성 */}
          <div className="bg-green-50 rounded-lg border-2 border-green-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-green-900">발견성</h3>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${searchVisibilityStatus.bg} ${searchVisibilityStatus.color}`}>
                {searchVisibilityStatus.label}
              </span>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {metrics.search_visibility_score}
              <span className="text-lg text-gray-500">/30</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${(metrics.search_visibility_score / 30) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-600 mt-2">
              키워드 순위, 플레이스 광고 효율
            </div>
          </div>

          {/* 매력도 */}
          <div className="bg-blue-50 rounded-lg border-2 border-blue-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-blue-900">매력도</h3>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${attractivenessStatus.bg} ${attractivenessStatus.color}`}>
                {attractivenessStatus.label}
              </span>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {metrics.attractiveness_score}
              <span className="text-lg text-gray-500">/40</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${(metrics.attractiveness_score / 40) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-600 mt-2">
              CTR, 저장/공유, 사진 리뷰 비중
            </div>
          </div>

          {/* 전환력 */}
          <div className="bg-purple-50 rounded-lg border-2 border-purple-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-purple-900">전환력</h3>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${conversionStatus.bg} ${conversionStatus.color}`}>
                {conversionStatus.label}
              </span>
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {metrics.conversion_score}
              <span className="text-lg text-gray-500">/30</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full"
                style={{ width: `${(metrics.conversion_score / 30) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-600 mt-2">
              예약, 전화 걸기, 길 찾기
            </div>
          </div>
        </div>

        {/* 주요 지표 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-xs text-gray-600 mb-1">총 조회수</div>
            <div className="text-xl font-bold text-gray-900">{metrics.total_impressions.toLocaleString()}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-xs text-gray-600 mb-1">클릭수</div>
            <div className="text-xl font-bold text-gray-900">{metrics.total_clicks.toLocaleString()}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-xs text-gray-600 mb-1">CTR</div>
            <div className="text-xl font-bold text-gray-900">{metrics.ctr.toFixed(2)}%</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-xs text-gray-600 mb-1">평균 평점</div>
            <div className="text-xl font-bold text-gray-900">{metrics.average_rating.toFixed(1)}</div>
          </div>
        </div>

        {/* 리뷰 통계 */}
        <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3">리뷰 통계</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-gray-600 mb-1">전체 리뷰</div>
              <div className="text-lg font-bold text-gray-900">{metrics.total_review_count}개</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">사진 리뷰</div>
              <div className="text-lg font-bold text-gray-900">{metrics.photo_review_count}개</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">사진 비중</div>
              <div className="text-lg font-bold text-gray-900">{metrics.photo_review_ratio.toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">답글률</div>
              <div className="text-lg font-bold text-gray-900">{metrics.reply_rate.toFixed(1)}%</div>
            </div>
          </div>
        </div>

        {/* 키워드 순위 */}
        {metrics.keyword_rankings.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">키워드 순위</h3>
            <div className="space-y-2">
              {metrics.keyword_rankings.slice(0, 5).map((kw, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{kw.keyword}</span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    kw.rank <= 3 ? 'bg-green-100 text-green-700' :
                    kw.rank <= 10 ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {kw.rank}위
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 주요 이슈 및 개선사항 */}
        {metrics.issues.length > 0 && (
          <div className="bg-red-50 rounded-lg border border-red-200 p-4">
            <h3 className="font-semibold text-red-900 mb-3">⚠️ 주요 이슈 및 개선사항</h3>
            <div className="space-y-3">
              {metrics.issues.map((issue, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border ${getPriorityColor(issue.priority)}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm">{issue.message}</span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(issue.priority)}`}>
                      {issue.priority}
                    </span>
                  </div>
                  <div className="text-xs text-gray-700 mt-1">
                    {issue.type === 'visual_trust' && '• 업체 사진 10장 이상 추가, 최신 리뷰에 사진 포함 권장'}
                    {issue.type === 'keyword_optimization' && '• 브랜드명 외 확장 키워드 공략 필요'}
                    {issue.type === 'crm' && '• 리뷰 답글률 80% 이상 목표, 48시간 내 응답 권장'}
                    {issue.type === 'review_management' && '• 부정 리뷰 적극 대응, 긍정 리뷰 감사 인사'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
