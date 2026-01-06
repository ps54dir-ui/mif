'use client'

import React from 'react'

interface HomepageMetrics {
  url: string
  overall_score: number
  first_impression_score: number // 첫인상 점수 (30점)
  navigation_score: number // 네비게이션 점수 (25점)
  content_quality_score: number // 콘텐츠 품질 점수 (25점)
  cta_effectiveness_score: number // CTA 효과성 점수 (20점)
  
  // 첫인상 지표
  loading_time: number // 로딩 시간 (초)
  hero_section_quality: 'excellent' | 'good' | 'needs_improvement' | 'poor'
  visual_hierarchy: 'excellent' | 'good' | 'needs_improvement' | 'poor'
  
  // 네비게이션 지표
  menu_clarity: 'excellent' | 'good' | 'needs_improvement' | 'poor'
  mobile_menu_quality: 'excellent' | 'good' | 'needs_improvement' | 'poor'
  search_functionality: boolean
  
  // 콘텐츠 품질 지표
  value_proposition_clarity: 'excellent' | 'good' | 'needs_improvement' | 'poor'
  trust_signals_count: number
  social_proof_count: number
  
  // CTA 효과성
  primary_cta_visibility: 'excellent' | 'good' | 'needs_improvement' | 'poor'
  cta_count: number
  cta_placement_quality: 'excellent' | 'good' | 'needs_improvement' | 'poor'
  
  issues: {
    category: 'first_impression' | 'navigation' | 'content' | 'cta'
    priority: 'HIGH' | 'MEDIUM' | 'LOW'
    message: string
    recommendation: string
  }[]
}

interface HomepageAnalysisProps {
  metrics: HomepageMetrics
}

export function HomepageAnalysis({ metrics }: HomepageAnalysisProps) {
  const getScoreStatus = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 80) return { label: '우수', color: 'text-green-600', bg: 'bg-green-100' }
    if (percentage >= 60) return { label: '양호', color: 'text-blue-600', bg: 'bg-blue-100' }
    if (percentage >= 40) return { label: '보통', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    return { label: '부족', color: 'text-red-600', bg: 'bg-red-100' }
  }

  const getQualityBadge = (quality: string) => {
    const qualityMap: Record<string, { label: string; color: string; bg: string }> = {
      excellent: { label: '우수', color: 'text-green-700', bg: 'bg-green-100' },
      good: { label: '양호', color: 'text-blue-700', bg: 'bg-blue-100' },
      needs_improvement: { label: '개선 필요', color: 'text-yellow-700', bg: 'bg-yellow-100' },
      poor: { label: '부족', color: 'text-red-700', bg: 'bg-red-100' }
    }
    const q = qualityMap[quality] || qualityMap.needs_improvement
    return <span className={`px-2 py-1 rounded text-xs font-semibold ${q.bg} ${q.color}`}>{q.label}</span>
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

  const firstImpressionStatus = getScoreStatus(metrics.first_impression_score, 30)
  const navigationStatus = getScoreStatus(metrics.navigation_score, 25)
  const contentStatus = getScoreStatus(metrics.content_quality_score, 25)
  const ctaStatus = getScoreStatus(metrics.cta_effectiveness_score, 20)
  const overallStatus = getScoreStatus(metrics.overall_score, 100)

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">🏠 홈페이지 분석</h2>
            <p className="text-indigo-100 text-sm">첫인상·네비게이션·콘텐츠·CTA 종합 분석</p>
            <p className="text-indigo-200 text-xs mt-1">{metrics.url}</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{metrics.overall_score}</div>
            <div className="text-lg text-indigo-100">/100점</div>
            <div className={`text-sm font-medium mt-1 ${overallStatus.bg} ${overallStatus.color} px-2 py-1 rounded`}>
              {overallStatus.label}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 점수 개요 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 첫인상 */}
          <div className="bg-purple-50 rounded-lg border-2 border-purple-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-purple-900">첫인상</h3>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${firstImpressionStatus.bg} ${firstImpressionStatus.color}`}>
                {firstImpressionStatus.label}
              </span>
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {metrics.first_impression_score}
              <span className="text-lg text-gray-500">/30</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full"
                style={{ width: `${(metrics.first_impression_score / 30) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-600 mt-2">
              로딩 속도, 히어로 섹션, 시각적 계층
            </div>
          </div>

          {/* 네비게이션 */}
          <div className="bg-blue-50 rounded-lg border-2 border-blue-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-blue-900">네비게이션</h3>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${navigationStatus.bg} ${navigationStatus.color}`}>
                {navigationStatus.label}
              </span>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {metrics.navigation_score}
              <span className="text-lg text-gray-500">/25</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${(metrics.navigation_score / 25) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-600 mt-2">
              메뉴 명확성, 모바일 메뉴, 검색 기능
            </div>
          </div>

          {/* 콘텐츠 품질 */}
          <div className="bg-green-50 rounded-lg border-2 border-green-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-green-900">콘텐츠 품질</h3>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${contentStatus.bg} ${contentStatus.color}`}>
                {contentStatus.label}
              </span>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {metrics.content_quality_score}
              <span className="text-lg text-gray-500">/25</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${(metrics.content_quality_score / 25) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-600 mt-2">
              가치 제안, 신뢰 신호, 사회적 증거
            </div>
          </div>

          {/* CTA 효과성 */}
          <div className="bg-orange-50 rounded-lg border-2 border-orange-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-orange-900">CTA 효과성</h3>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${ctaStatus.bg} ${ctaStatus.color}`}>
                {ctaStatus.label}
              </span>
            </div>
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {metrics.cta_effectiveness_score}
              <span className="text-lg text-gray-500">/20</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full"
                style={{ width: `${(metrics.cta_effectiveness_score / 20) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-600 mt-2">
              CTA 가시성, 배치, 개수
            </div>
          </div>
        </div>

        {/* 상세 지표 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 첫인상 상세 */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">첫인상 지표</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">로딩 시간</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">{metrics.loading_time.toFixed(2)}초</span>
                  {metrics.loading_time <= 2 ? (
                    <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-700">우수</span>
                  ) : metrics.loading_time <= 3 ? (
                    <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-700">양호</span>
                  ) : (
                    <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-700">느림</span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">히어로 섹션 품질</span>
                {getQualityBadge(metrics.hero_section_quality)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">시각적 계층</span>
                {getQualityBadge(metrics.visual_hierarchy)}
              </div>
            </div>
          </div>

          {/* 네비게이션 상세 */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">네비게이션 지표</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">메뉴 명확성</span>
                {getQualityBadge(metrics.menu_clarity)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">모바일 메뉴 품질</span>
                {getQualityBadge(metrics.mobile_menu_quality)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">검색 기능</span>
                {metrics.search_functionality ? (
                  <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-700">있음</span>
                ) : (
                  <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-700">없음</span>
                )}
              </div>
            </div>
          </div>

          {/* 콘텐츠 품질 상세 */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">콘텐츠 품질 지표</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">가치 제안 명확성</span>
                {getQualityBadge(metrics.value_proposition_clarity)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">신뢰 신호</span>
                <span className="text-sm font-semibold text-gray-900">{metrics.trust_signals_count}개</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">사회적 증거</span>
                <span className="text-sm font-semibold text-gray-900">{metrics.social_proof_count}개</span>
              </div>
            </div>
          </div>

          {/* CTA 효과성 상세 */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">CTA 효과성 지표</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">주요 CTA 가시성</span>
                {getQualityBadge(metrics.primary_cta_visibility)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">CTA 개수</span>
                <span className="text-sm font-semibold text-gray-900">{metrics.cta_count}개</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">CTA 배치 품질</span>
                {getQualityBadge(metrics.cta_placement_quality)}
              </div>
            </div>
          </div>
        </div>

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
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm">{issue.message}</span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(issue.priority)}`}>
                      {issue.priority}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 mt-1">
                    💡 <span className="font-medium">권장사항:</span> {issue.recommendation}
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
