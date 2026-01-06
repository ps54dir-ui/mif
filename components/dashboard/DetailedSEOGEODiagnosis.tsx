'use client'

import React from 'react'

interface EvaluationItem {
  name: string
  score: number
  maxScore: number
  status: 'excellent' | 'good' | 'needs_improvement' | 'poor'
  strengths: string[]
  improvements: string[]
  weaknesses: string[]
  recommendations: string[]
}

interface DetailedSEOGEODiagnosisProps {
  type: 'SEO' | 'GEO' | 'AEO'
  totalScore: number
  evaluations: EvaluationItem[]
}

export function DetailedSEOGEODiagnosis({ type, totalScore, evaluations }: DetailedSEOGEODiagnosisProps) {
  const getTypeLabel = (t: string) => {
    switch (t) {
      case 'SEO':
        return 'SEO 최적화 (Search Engine Optimization)'
      case 'GEO':
        return 'GEO 최적화 (Generative Engine Optimization)'
      case 'AEO':
        return 'AEO 최적화 (Answer Engine Optimization)'
      default:
        return t
    }
  }

  const getTypeColor = (t: string) => {
    switch (t) {
      case 'SEO':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-300',
          text: 'text-blue-700',
          score: 'text-blue-600',
          accent: 'bg-blue-100'
        }
      case 'GEO':
        return {
          bg: 'bg-purple-50',
          border: 'border-purple-300',
          text: 'text-purple-700',
          score: 'text-purple-600',
          accent: 'bg-purple-100'
        }
      case 'AEO':
        return {
          bg: 'bg-indigo-50',
          border: 'border-indigo-300',
          text: 'text-indigo-700',
          score: 'text-indigo-600',
          accent: 'bg-indigo-100'
        }
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-300',
          text: 'text-gray-700',
          score: 'text-gray-600',
          accent: 'bg-gray-100'
        }
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'excellent':
        return <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-700">우수</span>
      case 'good':
        return <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700">양호</span>
      case 'needs_improvement':
        return <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-700">개선 필요</span>
      case 'poor':
        return <span className="px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-700">부족</span>
      default:
        return null
    }
  }

  const getScorePercentage = (score: number, maxScore: number) => {
    return Math.round((score / maxScore) * 100)
  }

  const colors = getTypeColor(type)

  return (
    <div className={`rounded-xl border-2 ${colors.border} ${colors.bg} p-6 shadow-lg`}>
      {/* 헤더 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-2xl font-bold ${colors.text}`}>
            {getTypeLabel(type)} 상세 진단
          </h3>
          <div className="text-right">
            <div className={`text-4xl font-bold ${colors.score}`}>
              {totalScore}
              <span className="text-2xl text-gray-500">/100</span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {totalScore >= 80 ? '우수' : totalScore >= 60 ? '양호' : totalScore >= 40 ? '개선 필요' : '부족'}
            </div>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className={`${colors.score.replace('text-', 'bg-')} h-4 rounded-full transition-all duration-500`}
            style={{ width: `${totalScore}%` }}
          ></div>
        </div>
      </div>

      {/* 평가 항목별 상세 결과 */}
      <div className="space-y-6">
        {evaluations.map((evaluationItem, index) => {
          const percentage = getScorePercentage(evaluationItem.score, evaluationItem.maxScore)
          
          return (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
            >
              {/* 항목 헤더 */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {evaluationItem.name}
                  </h4>
                  <div className="flex items-center gap-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-gray-900">{evaluationItem.score}</span>
                      <span className="text-sm text-gray-500">/ {evaluationItem.maxScore}점</span>
                    </div>
                    <div className="flex-1 max-w-xs">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            percentage >= 80 ? 'bg-green-500' :
                            percentage >= 60 ? 'bg-blue-500' :
                            percentage >= 40 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    {getStatusBadge(evaluationItem.status)}
                  </div>
                </div>
              </div>

              {/* 상세 분석 */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
                {/* 잘한 점 */}
                {evaluationItem.strengths.length > 0 && (
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">✅</span>
                      <h5 className="font-semibold text-green-900">잘한 점</h5>
                    </div>
                    <ul className="space-y-2">
                      {evaluationItem.strengths.map((strength, idx) => (
                        <li key={idx} className="text-sm text-green-800 flex items-start">
                          <span className="mr-2">•</span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 개선이 필요한 점 */}
                {evaluationItem.improvements.length > 0 && (
                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">⚠️</span>
                      <h5 className="font-semibold text-yellow-900">개선 필요</h5>
                    </div>
                    <ul className="space-y-2">
                      {evaluationItem.improvements.map((improvement, idx) => (
                        <li key={idx} className="text-sm text-yellow-800 flex items-start">
                          <span className="mr-2">•</span>
                          <span>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 나쁜 점 / 부족한 점 */}
                {evaluationItem.weaknesses.length > 0 && (
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">❌</span>
                      <h5 className="font-semibold text-red-900">부족한 점</h5>
                    </div>
                    <ul className="space-y-2">
                      {evaluationItem.weaknesses.map((weakness, idx) => (
                        <li key={idx} className="text-sm text-red-800 flex items-start">
                          <span className="mr-2">•</span>
                          <span>{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* 권장사항 */}
              {evaluationItem.recommendations.length > 0 && (
                <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">💡</span>
                    <h5 className="font-semibold text-blue-900">구체적 권장사항</h5>
                  </div>
                  <ul className="space-y-2">
                    {evaluationItem.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm text-blue-800 flex items-start">
                        <span className="mr-2">{idx + 1}.</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
