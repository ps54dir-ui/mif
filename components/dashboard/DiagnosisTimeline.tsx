'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'

interface DiagnosisHistory {
  date: string
  overallScore: number
  version: number
}

interface DiagnosisTimelineProps {
  history: DiagnosisHistory[]
}

export function DiagnosisTimeline({ history }: DiagnosisTimelineProps) {
  const chartData = history.map(item => ({
    date: format(new Date(item.date), 'MM/dd'),
    fullDate: item.date,
    점수: item.overallScore,
    버전: `v${item.version}`
  }))

  // 개선율 계산 (성장 곡선)
  const getImprovementRate = () => {
    if (history.length < 2) return null
    
    // 최신 진단과 이전 진단 비교
    const latest = history[0].overallScore
    const previous = history[history.length - 1].overallScore
    const improvement = latest - previous
    const rate = previous > 0 ? ((improvement / previous) * 100).toFixed(1) : '0.0'
    
    return { improvement, rate }
  }
  
  // 성장 추세 분석
  const getGrowthTrend = () => {
    if (history.length < 3) return null
    
    const scores = history.map(h => h.overallScore)
    const recentScores = scores.slice(0, 3)
    const olderScores = scores.slice(-3)
    
    const recentAvg = recentScores.reduce((a, b) => a + b, 0) / recentScores.length
    const olderAvg = olderScores.reduce((a, b) => a + b, 0) / olderScores.length
    
    const trend = recentAvg > olderAvg ? '상승' : recentAvg < olderAvg ? '하락' : '유지'
    return { trend, recentAvg, olderAvg }
  }

  const improvement = getImprovementRate()

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">반복 진단 타임라인</h2>
        {improvement && (
          <div className="text-right">
            <div className="text-sm text-gray-600">이전 대비 변화</div>
            <div className={`text-lg font-bold ${improvement.improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {improvement.improvement >= 0 ? '+' : ''}{improvement.improvement}점 ({improvement.rate}%)
            </div>
          </div>
        )}
      </div>

      {history.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#6b7280', fontSize: 12 }}
                stroke="#9ca3af"
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                stroke="#9ca3af"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px 12px'
                }}
                formatter={(value: number) => [`${value}점`, '종합 점수']}
                labelFormatter={(label) => `날짜: ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="점수"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 5 }}
                activeDot={{ r: 7 }}
                name="종합 점수"
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-4 text-sm text-gray-600">
            <div className="flex items-center justify-between">
              <span>
                마케팅 플라이휠이{' '}
                {improvement && improvement.improvement > 0 ? (
                  <span className="text-green-600 font-semibold">가속화</span>
                ) : improvement && improvement.improvement < 0 ? (
                  <span className="text-red-600 font-semibold">감소</span>
                ) : (
                  <span className="text-gray-600">정체</span>
                )}
                되고 있습니다
                {getGrowthTrend() && (
                  <span className="ml-2">
                    ({getGrowthTrend()?.trend} 추세)
                  </span>
                )}
              </span>
              <span className="text-blue-600 font-medium">
                총 {history.length}회 진단
              </span>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-[300px] text-gray-500">
          진단 이력이 없습니다.
        </div>
      )}
    </div>
  )
}
