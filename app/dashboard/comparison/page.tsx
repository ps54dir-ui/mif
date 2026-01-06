'use client'

import { useState } from 'react'
import { DiagnosisComparisonDashboard } from '@/components/dashboard/DiagnosisComparisonDashboard'
import { DiagnosisTimeline } from '@/components/dashboard/DiagnosisTimeline'
import { PDFExportButton } from '@/components/dashboard/PDFExportButton'
import { useDashboardData } from '../shared/useDashboardData'
import { Calendar, TrendingUp, BarChart3 } from 'lucide-react'

export default function ComparisonPage() {
  const { dashboardData, loading, companyName } = useDashboardData()
  const [selectedHistoryIndex, setSelectedHistoryIndex] = useState<number | null>(null)

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

  // 비교할 진단 데이터 준비
  const history = dashboardData.diagnosisHistory
  const currentDiagnosisId = 'current-diagnosis-id'
  const previousDiagnosisId = selectedHistoryIndex !== null && selectedHistoryIndex < history.length - 1
    ? `diagnosis-${history[selectedHistoryIndex + 1].version}`
    : history.length >= 2 ? `diagnosis-${history[history.length - 1].version}` : null

  return (
    <div id="dashboard-container" className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* 헤더 섹션 */}
        <div className="bg-gradient-to-r from-green-600 via-teal-600 to-green-800 rounded-2xl shadow-2xl p-8 text-white">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold mb-1">{companyName} 데이터 비교 대시보드</h1>
                  <p className="text-green-100 text-sm lg:text-base">진단 일자별 데이터 비교 및 트렌드 분석</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <PDFExportButton reportId="comparison-report" />
            </div>
          </div>
        </div>

        {/* 진단 히스토리 타임라인 (선택 가능) */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">진단 일자 선택</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              비교하고 싶은 진단 일자를 선택하세요. 선택하지 않으면 기본적으로 처음 진단 일자부터 현재까지의 전체 흐름이 표시됩니다.
            </p>
          </div>
          <div className="p-6">
            <DiagnosisTimeline history={history} />
            
            {/* 히스토리 선택 버튼 */}
            {history.length > 1 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">비교할 진단 선택:</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedHistoryIndex(null)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedHistoryIndex === null
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    전체 기간 (기본)
                  </button>
                  {history.slice(1).map((item, index) => {
                    const actualIndex = history.length - 1 - index
                    return (
                      <button
                        key={item.version}
                        onClick={() => setSelectedHistoryIndex(actualIndex)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedHistoryIndex === actualIndex
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        v{item.version} ({new Date(item.date).toLocaleDateString('ko-KR')})
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 데이터 비교 대시보드 */}
        {history.length >= 2 && typeof window !== 'undefined' && previousDiagnosisId ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">진단 비교 결과</h2>
              </div>
              {selectedHistoryIndex !== null && (
                <p className="text-sm text-gray-600 mt-2">
                  현재 진단 (v{history[0].version}) vs 선택한 진단 (v{history[selectedHistoryIndex + 1]?.version || history[history.length - 1].version}) 비교
                </p>
              )}
            </div>
            <div className="p-6">
              <DiagnosisComparisonDashboard
                reportId={`${companyName}-report-1`}
                currentDiagnosisId={currentDiagnosisId}
                previousDiagnosisId={previousDiagnosisId}
              />
            </div>
          </div>
        ) : history.length >= 2 ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">전체 기간 트렌드 분석</h2>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                처음 진단 일자부터 현재까지의 전체 흐름을 시각화합니다.
              </p>
            </div>
            <div className="p-6">
              <DiagnosisComparisonDashboard
                reportId={`${companyName}-report-1`}
                currentDiagnosisId={currentDiagnosisId}
                previousDiagnosisId={previousDiagnosisId || `diagnosis-${history[history.length - 1].version}`}
              />
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <p className="text-yellow-800">
              비교할 수 있는 진단 데이터가 부족합니다. 최소 2개 이상의 진단 이력이 필요합니다.
            </p>
          </div>
        )}

        {/* 전체 기간 종합 분석 */}
        {history.length >= 2 && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">전체 기간 종합 분석</h2>
              <p className="text-sm text-gray-600 mt-2">
                {new Date(history[history.length - 1].date).toLocaleDateString('ko-KR')}부터 현재까지의 전체 변화 추이
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-sm text-blue-600 font-medium mb-1">초기 진단 점수</div>
                    <div className="text-3xl font-bold text-blue-900">
                      {history[history.length - 1].overallScore}
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                      v{history[history.length - 1].version}
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-sm text-green-600 font-medium mb-1">현재 진단 점수</div>
                    <div className="text-3xl font-bold text-green-900">
                      {history[0].overallScore}
                    </div>
                    <div className="text-xs text-green-600 mt-1">
                      v{history[0].version}
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="text-sm text-purple-600 font-medium mb-1">전체 개선율</div>
                    <div className="text-3xl font-bold text-purple-900">
                      +{history[0].overallScore - history[history.length - 1].overallScore}
                    </div>
                    <div className="text-xs text-purple-600 mt-1">
                      {((history[0].overallScore - history[history.length - 1].overallScore) / history[history.length - 1].overallScore * 100).toFixed(1)}% 향상
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
