/**
 * 진단 비교 대시보드 컴포넌트
 * 초회 진단 vs 재진단 상세 비교
 * 채널별, 메트릭별 변화율 및 개선 영역 분석
 */

'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react'

interface DiagnosisComparisonData {
  currentScore: number
  previousScore: number
  improvementRate: number
  overallScoreChange: number
  channelScoreChanges: Record<string, number>
  metricChanges: {
    reach: number
    engagement: number
    conversion: number
    roi: number
    cac: number
  }
  improvementAreas: string[]
  declinedAreas: string[]
  currentVersion: number
  previousVersion: number
  diagnosisDate: string
  previousDate: string
}

interface DiagnosisComparisonDashboardProps {
  reportId: string
  currentDiagnosisId: string
  previousDiagnosisId: string
}

export function DiagnosisComparisonDashboard({
  reportId,
  currentDiagnosisId,
  previousDiagnosisId
}: DiagnosisComparisonDashboardProps) {
  const [comparisonData, setComparisonData] = useState<DiagnosisComparisonData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchComparisonData() {
      try {
        setLoading(true)
        // API 호출
        const response = await fetch(
          `/api/diagnosis/comparison?current=${currentDiagnosisId}&previous=${previousDiagnosisId}`
        )
        
        if (!response.ok) {
          throw new Error('진단 비교 데이터를 불러오는데 실패했습니다.')
        }
        
        const data = await response.json()
        
        // 데이터 구조 변환
        const comparison: DiagnosisComparisonData = {
          currentScore: data.current_score || 0,
          previousScore: data.previous_score || 0,
          improvementRate: data.improvement_rate || 0,
          overallScoreChange: data.comparison_metrics?.overall_score_change || 0,
          channelScoreChanges: data.comparison_metrics?.channel_score_changes || {},
          metricChanges: data.comparison_metrics?.metric_changes || {
            reach: 0,
            engagement: 0,
            conversion: 0,
            roi: 0,
            cac: 0
          },
          improvementAreas: data.comparison_metrics?.improvement_areas || [],
          declinedAreas: data.comparison_metrics?.declined_areas || [],
          currentVersion: 0,
          previousVersion: 0,
          diagnosisDate: new Date().toISOString(),
          previousDate: new Date().toISOString()
        }
        
        setComparisonData(comparison)
      } catch (err) {
        console.error('진단 비교 데이터 로딩 오류:', err)
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    if (currentDiagnosisId && previousDiagnosisId) {
      fetchComparisonData()
    }
  }, [currentDiagnosisId, previousDiagnosisId])

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">진단 비교 데이터를 불러오는 중...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-red-200 p-8">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      </div>
    )
  }

  if (!comparisonData) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="text-gray-500">비교할 진단 데이터가 없습니다.</div>
      </div>
    )
  }

  // 채널별 변화 차트 데이터 준비
  const channelChartData = Object.entries(comparisonData.channelScoreChanges).map(([channel, change]) => ({
    channel: channel.replace('_', ' ').toUpperCase(),
    변화: change,
    이전: comparisonData.previousScore,
    현재: comparisonData.currentScore
  }))

  // 메트릭 변화 차트 데이터 준비
  const metricChartData = [
    { name: '도달률', 변화: comparisonData.metricChanges.reach },
    { name: '참여도', 변화: comparisonData.metricChanges.engagement },
    { name: '전환율', 변화: comparisonData.metricChanges.conversion },
    { name: 'ROI', 변화: comparisonData.metricChanges.roi },
    { name: 'CAC', 변화: comparisonData.metricChanges.cac }
  ]

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <h2 className="text-2xl font-bold text-white">진단 비교 리포트</h2>
        <p className="text-blue-100 text-sm mt-1">
          초회 진단 vs 재진단 상세 비교 분석
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* 전체 점수 변화 요약 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="text-sm text-blue-600 font-medium mb-1">이전 점수</div>
            <div className="text-3xl font-bold text-blue-900">{comparisonData.previousScore}</div>
            <div className="text-xs text-blue-600 mt-1">점</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="text-sm text-purple-600 font-medium mb-1">현재 점수</div>
            <div className="text-3xl font-bold text-purple-900">{comparisonData.currentScore}</div>
            <div className="text-xs text-purple-600 mt-1">점</div>
          </div>
          
          <div className={`bg-gradient-to-br ${comparisonData.overallScoreChange >= 0 ? 'from-green-50 to-green-100 border-green-200' : 'from-red-50 to-red-100 border-red-200'} rounded-lg p-4 border`}>
            <div className={`text-sm ${comparisonData.overallScoreChange >= 0 ? 'text-green-600' : 'text-red-600'} font-medium mb-1`}>
              변화
            </div>
            <div className={`text-3xl font-bold ${comparisonData.overallScoreChange >= 0 ? 'text-green-900' : 'text-red-900'}`}>
              {comparisonData.overallScoreChange >= 0 ? '+' : ''}{comparisonData.overallScoreChange}
            </div>
            <div className={`text-xs ${comparisonData.overallScoreChange >= 0 ? 'text-green-600' : 'text-red-600'} mt-1`}>점</div>
          </div>
          
          <div className={`bg-gradient-to-br ${comparisonData.improvementRate >= 0 ? 'from-emerald-50 to-emerald-100 border-emerald-200' : 'from-orange-50 to-orange-100 border-orange-200'} rounded-lg p-4 border`}>
            <div className={`text-sm ${comparisonData.improvementRate >= 0 ? 'text-emerald-600' : 'text-orange-600'} font-medium mb-1`}>
              개선율
            </div>
            <div className={`text-3xl font-bold ${comparisonData.improvementRate >= 0 ? 'text-emerald-900' : 'text-orange-900'}`}>
              {comparisonData.improvementRate >= 0 ? '+' : ''}{comparisonData.improvementRate.toFixed(1)}%
            </div>
            <div className={`text-xs ${comparisonData.improvementRate >= 0 ? 'text-emerald-600' : 'text-orange-600'} mt-1`}>
              {comparisonData.improvementRate >= 0 ? '향상' : '하락'}
            </div>
          </div>
        </div>

        {/* 채널별 점수 변화 */}
        {channelChartData.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">채널별 점수 변화</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={channelChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="channel" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`${value >= 0 ? '+' : ''}${value}점`, '변화']}
                />
                <Legend />
                <Bar dataKey="변화" name="점수 변화">
                  {channelChartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.변화 >= 0 ? '#10b981' : '#ef4444'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* 메트릭 변화 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">핵심 메트릭 변화</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metricChartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 12 }} />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [`${value >= 0 ? '+' : ''}${value.toFixed(2)}`, '변화']}
              />
              <Legend />
              <Bar dataKey="변화" name="메트릭 변화">
                {metricChartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.변화 >= 0 ? '#3b82f6' : '#f59e0b'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 개선/하락 영역 분석 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 개선 영역 */}
          {comparisonData.improvementAreas.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-green-900">개선된 영역</h3>
              </div>
              <ul className="space-y-2">
                {comparisonData.improvementAreas.map((area, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-green-800">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 하락 영역 */}
          {comparisonData.declinedAreas.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingDown className="w-5 h-5 text-red-600" />
                <h3 className="text-lg font-semibold text-red-900">주의 필요 영역</h3>
              </div>
              <ul className="space-y-2">
                {comparisonData.declinedAreas.map((area, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-red-800">
                    <span className="text-red-600 mt-1">⚠</span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 요약 인사이트 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">종합 인사이트</h3>
          <p className="text-sm text-blue-800">
            {comparisonData.improvementRate > 0 ? (
              <>
                전체 점수가 <strong className="text-green-700">{comparisonData.improvementRate.toFixed(1)}%</strong> 개선되었습니다. 
                {comparisonData.improvementAreas.length > 0 && (
                  <> 특히 <strong>{comparisonData.improvementAreas.join(', ')}</strong> 영역에서 두드러진 성과를 보였습니다.</>
                )}
                {comparisonData.declinedAreas.length > 0 && (
                  <> 다만 <strong>{comparisonData.declinedAreas.join(', ')}</strong> 영역에 대해서는 추가 개선이 필요합니다.</>
                )}
              </>
            ) : (
              <>
                전체 점수가 <strong className="text-red-700">{Math.abs(comparisonData.improvementRate).toFixed(1)}%</strong> 하락했습니다. 
                {comparisonData.declinedAreas.length > 0 && (
                  <> <strong>{comparisonData.declinedAreas.join(', ')}</strong> 영역에 대한 즉각적인 개선 조치가 필요합니다.</>
                )}
                {comparisonData.improvementAreas.length > 0 && (
                  <> 다만 <strong>{comparisonData.improvementAreas.join(', ')}</strong> 영역은 유지 또는 개선되었습니다.</>
                )}
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
