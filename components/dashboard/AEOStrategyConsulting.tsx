'use client'

import React, { useState } from 'react'
import { generateComprehensiveAEOStrategies, type ComprehensiveAEOStrategyReport } from '@/lib/workflow/comprehensiveAEOStrategy'

interface AEOStrategyConsultingProps {
  currentAEOScore: number
  diagnosisData?: {
    hasStructuredData?: boolean
    faqCount?: number
    statisticsCount?: number
    citationCount?: number
    hasVideoContent?: boolean
    hasTableContent?: boolean
  }
}

export function AEOStrategyConsulting({ currentAEOScore, diagnosisData = {} }: AEOStrategyConsultingProps) {
  const [expandedStrategy, setExpandedStrategy] = useState<string | null>(null)

  const strategyReport: ComprehensiveAEOStrategyReport = generateComprehensiveAEOStrategies(
    currentAEOScore,
    diagnosisData.hasStructuredData ?? false,
    diagnosisData.faqCount ?? 0,
    diagnosisData.statisticsCount ?? 0,
    diagnosisData.citationCount ?? 0,
    diagnosisData.hasVideoContent ?? false,
    diagnosisData.hasTableContent ?? false
  )

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'LOW':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return 'text-green-600'
      case 'MEDIUM':
        return 'text-yellow-600'
      case 'HARD':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'structured_data':
        return '🔗'
      case 'content_structure':
        return '📝'
      case 'expert_content':
        return '👨‍💼'
      case 'user_engagement':
        return '👥'
      case 'multimedia':
        return '🎥'
      case 'metadata':
        return '🏷️'
      default:
        return '📌'
    }
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      structured_data: '구조화된 데이터',
      content_structure: '콘텐츠 구조',
      expert_content: '전문가 콘텐츠',
      user_engagement: '사용자 참여',
      multimedia: '멀티미디어',
      metadata: '메타데이터'
    }
    return labels[category] || category
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">🎯 포괄적 AEO 최적화 컨설팅</h2>
            <p className="text-indigo-100 text-sm">블로그를 넘어선 모든 AEO 최적화 전략</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{strategyReport.overallScore}점</div>
            <div className="text-sm text-indigo-100">현재 AEO 점수</div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 개요 */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-2">📊 전략 개요</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-gray-600">총 전략 수</div>
              <div className="text-2xl font-bold text-indigo-600">{strategyReport.strategies.length}개</div>
            </div>
            <div>
              <div className="text-gray-600">예상 소요 시간</div>
              <div className="text-lg font-semibold text-purple-600">{strategyReport.timeline}</div>
            </div>
            <div>
              <div className="text-gray-600">예상 효과</div>
              <div className="text-sm text-gray-700">{strategyReport.expectedImpact}</div>
            </div>
          </div>
        </div>

        {/* 추천 실행 순서 */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3">📍 추천 실행 순서</h3>
          <div className="flex flex-wrap gap-2">
            {strategyReport.recommendedOrder.map((strategyId, index) => {
              const strategy = strategyReport.strategies.find(s => s.id === strategyId)
              if (!strategy) return null
              
              return (
                <div
                  key={strategyId}
                  className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-300"
                >
                  <span className="text-lg font-bold text-indigo-600">#{index + 1}</span>
                  <span className="text-sm font-medium text-gray-700">{strategy.title}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* 전략 상세 */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">전략 상세</h3>
          
          {strategyReport.strategies.map((strategy, index) => (
            <div
              key={strategy.id}
              className="border-2 rounded-lg overflow-hidden"
            >
              {/* 전략 헤더 */}
              <div
                className={`p-4 cursor-pointer ${expandedStrategy === strategy.id ? 'bg-indigo-50' : 'bg-white'}`}
                onClick={() => setExpandedStrategy(expandedStrategy === strategy.id ? null : strategy.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{getCategoryIcon(strategy.category)}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-bold text-gray-900">{strategy.title}</h4>
                          <span className={`px-2 py-1 rounded text-xs font-semibold border ${getPriorityColor(strategy.priority)}`}>
                            {strategy.priority}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-600">{getCategoryLabel(strategy.category)}</span>
                          <span className={`text-xs font-medium ${getDifficultyColor(strategy.difficulty)}`}>
                            난이도: {strategy.difficulty}
                          </span>
                          <span className="text-xs text-gray-600">소요 시간: {strategy.estimatedTime}</span>
                          <span className="text-xs text-gray-600">영향도: {strategy.impact}/10</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 ml-11">{strategy.description}</p>
                  </div>
                  <div className="ml-4">
                    <span className="text-gray-400 text-xl">
                      {expandedStrategy === strategy.id ? '▼' : '▶'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 전략 상세 내용 */}
              {expandedStrategy === strategy.id && (
                <div className="border-t border-gray-200 p-6 bg-gradient-to-br from-gray-50 to-white space-y-6">
                  {/* 실행 액션 아이템 */}
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-3">🎯 실행 액션 아이템</h5>
                    <div className="space-y-4">
                      {strategy.actionItems.map((item, itemIndex) => (
                        <div key={itemIndex} className="bg-white rounded-lg border border-gray-200 p-4">
                          <div className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
                              {itemIndex + 1}
                            </span>
                            <div className="flex-1">
                              <h6 className="font-semibold text-gray-900 mb-1">{item.action}</h6>
                              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                              
                              {/* 예시 */}
                              {item.examples.length > 0 && (
                                <div className="mb-2">
                                  <div className="text-xs font-medium text-gray-500 mb-1">예시:</div>
                                  <ul className="list-disc list-inside space-y-1">
                                    {item.examples.map((example, exIndex) => (
                                      <li key={exIndex} className="text-xs text-gray-700">{example}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {/* 예상 효과 */}
                              <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
                                <div className="text-xs font-medium text-green-800">
                                  💡 예상 효과: {item.expectedImpact}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 콘텐츠 타입 */}
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">📄 관련 콘텐츠 타입</h5>
                    <div className="flex flex-wrap gap-2">
                      {strategy.contentTypes.map((type, typeIndex) => (
                        <span
                          key={typeIndex}
                          className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 성공 지표 */}
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">📊 성공 지표</h5>
                    <div className="flex flex-wrap gap-2">
                      {strategy.successMetrics.map((metric, metricIndex) => (
                        <span
                          key={metricIndex}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                        >
                          {metric}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 추가 권장사항 */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-2">💡 추가 권장사항</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>각 전략은 순차적으로 실행하되, 병렬 진행 가능한 항목은 동시에 추진하세요.</span>
            </li>
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>성공 지표를 정기적으로 모니터링하고, 결과에 따라 전략을 조정하세요.</span>
            </li>
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>구조화된 데이터는 검색 콘솔에서 리치 결과 테스트를 통해 검증하세요.</span>
            </li>
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>FAQ 콘텐츠는 실제 고객 문의 데이터를 기반으로 작성하세요.</span>
            </li>
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>통계 데이터는 신뢰할 수 있는 소스에서 인용하고 출처를 명확히 표시하세요.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
