'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Calendar, BarChart3, TrendingUp, X } from 'lucide-react'
import Link from 'next/link'

interface DiagnosisHistory {
  id: string
  date: string
  overallScore: number
  fourAxes: {
    inflow: number
    persuasion: number
    trust: number
    circulation: number
  }
  seoScore: number
  geoScore: number
  aeoScore: number
  version: number
}

// Mock 데이터 - 실제로는 API에서 가져옴
const MOCK_HISTORY: DiagnosisHistory[] = [
  {
    id: '1',
    date: new Date().toISOString(),
    overallScore: 88,
    fourAxes: { inflow: 95, persuasion: 89, trust: 85, circulation: 82 },
    seoScore: 92,
    geoScore: 88,
    aeoScore: 85,
    version: 3
  },
  {
    id: '2',
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    overallScore: 85,
    fourAxes: { inflow: 92, persuasion: 86, trust: 83, circulation: 79 },
    seoScore: 89,
    geoScore: 85,
    aeoScore: 82,
    version: 2
  },
  {
    id: '3',
    date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    overallScore: 82,
    fourAxes: { inflow: 88, persuasion: 83, trust: 80, circulation: 76 },
    seoScore: 86,
    geoScore: 82,
    aeoScore: 79,
    version: 1
  }
]

export default function CompanyGrowthComparisonPage() {
  const searchParams = useSearchParams()
  const companyName = searchParams.get('brand_name') || '삼성생명'
  const [history, setHistory] = useState<DiagnosisHistory[]>(MOCK_HISTORY)
  const [selectedDates, setSelectedDates] = useState<string[]>([])
  const [selectedDateRange, setSelectedDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 실제로는 API에서 히스토리 데이터를 가져옴
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [companyName])

  const handleDateSelect = (dateId: string) => {
    if (selectedDates.includes(dateId)) {
      setSelectedDates(selectedDates.filter(id => id !== dateId))
    } else {
      if (selectedDates.length < 10) {
        setSelectedDates([...selectedDates, dateId])
      } else {
        alert('최대 10개까지만 선택할 수 있습니다.')
      }
    }
  }

  const handleDateRangeSelect = () => {
    if (!selectedDateRange.start || !selectedDateRange.end) {
      alert('시작일과 종료일을 모두 선택해주세요.')
      return
    }
    // 날짜 범위로 히스토리 필터링
    const filtered = history.filter(h => {
      const date = new Date(h.date)
      const start = new Date(selectedDateRange.start)
      const end = new Date(selectedDateRange.end)
      return date >= start && date <= end
    })
    // 선택된 날짜들 추가 (최대 10개)
    const newSelected = filtered.slice(0, 10 - selectedDates.length).map(h => h.id)
    setSelectedDates([...selectedDates, ...newSelected])
  }

  const selectedHistory = history.filter(h => selectedDates.includes(h.id))

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
                  <Calendar className="w-6 h-6 text-green-600" />
                  기업성장비교
                </h1>
                <p className="text-sm text-gray-500 mt-1">{companyName} 날짜별 진단 비교 분석</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* 날짜 선택 섹션 */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              날짜 선택
            </h2>
            
            {/* 날짜 범위 선택 */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">날짜 범위로 선택</h3>
              <div className="flex gap-4 items-end">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">시작일</label>
                  <input
                    type="date"
                    value={selectedDateRange.start}
                    onChange={(e) => setSelectedDateRange({ ...selectedDateRange, start: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">종료일</label>
                  <input
                    type="date"
                    value={selectedDateRange.end}
                    onChange={(e) => setSelectedDateRange({ ...selectedDateRange, end: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={handleDateRangeSelect}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  범위 선택
                </button>
              </div>
            </div>

            {/* 진단 히스토리 리스트 */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                진단 히스토리 (최대 10개 선택)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {history.map((item) => {
                  const isSelected = selectedDates.includes(item.id)
                  const date = new Date(item.date)
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleDateSelect(item.id)}
                      className={`p-4 border-2 rounded-lg transition-all text-left ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          {date.toLocaleDateString('ko-KR')}
                        </span>
                        {isSelected && (
                          <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {item.overallScore}점
                      </div>
                      <div className="text-xs text-gray-500">
                        v{item.version} • {date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 선택된 날짜 표시 */}
            {selectedDates.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-blue-900">
                    선택된 날짜: {selectedDates.length}개
                  </span>
                  <button
                    onClick={() => setSelectedDates([])}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    모두 해제
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedDates.map((dateId) => {
                    const item = history.find(h => h.id === dateId)
                    if (!item) return null
                    return (
                      <div
                        key={dateId}
                        className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-blue-300"
                      >
                        <span className="text-xs text-gray-700">
                          {new Date(item.date).toLocaleDateString('ko-KR')}
                        </span>
                        <button
                          onClick={() => handleDateSelect(dateId)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 비교 시각화 */}
          {selectedHistory.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                비교 시각화
              </h2>

              {/* 종합 점수 비교 */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">종합 점수 추이</h3>
                <div className="h-64 flex items-end justify-center gap-4">
                  {selectedHistory.map((item, index) => {
                    const maxScore = Math.max(...selectedHistory.map(h => h.overallScore))
                    const height = (item.overallScore / maxScore) * 100
                    return (
                      <div key={item.id} className="flex flex-col items-center gap-2">
                        <div
                          className="w-12 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all hover:from-blue-700 hover:to-blue-500"
                          style={{ height: `${height}%` }}
                        >
                          <div className="text-white text-xs font-bold text-center mt-1">
                            {item.overallScore}
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 text-center">
                          {new Date(item.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 4대 축 비교 */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">4대 축 비교</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {['inflow', 'persuasion', 'trust', 'circulation'].map((axis) => {
                    const axisLabels: Record<string, string> = {
                      inflow: '유입',
                      persuasion: '설득',
                      trust: '신뢰',
                      circulation: '순환'
                    }
                    return (
                      <div key={axis} className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">
                          {axisLabels[axis]}
                        </h4>
                        <div className="space-y-2">
                          {selectedHistory.map((item) => (
                            <div key={item.id} className="flex items-center justify-between">
                              <span className="text-xs text-gray-600">
                                {new Date(item.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                              </span>
                              <span className="text-sm font-bold text-gray-900">
                                {item.fourAxes[axis as keyof typeof item.fourAxes]}점
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* SEO/GEO/AEO 점수 비교 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">SEO/GEO/AEO 점수 비교</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { key: 'seoScore', label: 'SEO' },
                    { key: 'geoScore', label: 'GEO' },
                    { key: 'aeoScore', label: 'AEO' }
                  ].map(({ key, label }) => (
                    <div key={key} className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">{label}</h4>
                      <div className="space-y-2">
                        {selectedHistory.map((item) => (
                          <div key={item.id} className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">
                              {new Date(item.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                            </span>
                            <span className="text-sm font-bold text-gray-900">
                              {item[key as keyof DiagnosisHistory] as number}점
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 선택 안내 */}
          {selectedHistory.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <p className="text-yellow-800">
                위에서 비교할 날짜를 선택하세요. (최대 10개)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
