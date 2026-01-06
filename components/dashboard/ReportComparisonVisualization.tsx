/**
 * 리포트 비교 시각화
 * 날짜별 리포트 비교 데이터 시각화
 */

'use client'

import { useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { TrendingUp, TrendingDown, Calendar, FileText } from 'lucide-react'

interface ReportComparisonVisualizationProps {
  reports: Array<{
    id: string
    version: number
    issuedAt: Date
    overallScore: number
    reportType: 'initial' | 'consulting_effect' | 'comparison'
    title: string
  }>
  onSelectReport?: (reportId: string) => void
}

export function ReportComparisonVisualization({ 
  reports, 
  onSelectReport 
}: ReportComparisonVisualizationProps) {
  const [selectedReportIds, setSelectedReportIds] = useState<string[]>([])

  // 리포트를 날짜순으로 정렬
  const sortedReports = [...reports].sort((a, b) => 
    a.issuedAt.getTime() - b.issuedAt.getTime()
  )

  // 타임라인 차트 데이터
  const timelineData = sortedReports.map(report => ({
    date: report.issuedAt.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
    fullDate: report.issuedAt.toLocaleDateString('ko-KR'),
    점수: report.overallScore,
    버전: `v${report.version}`,
    reportId: report.id
  }))

  // 비교 차트 데이터 (2개 리포트 선택 시)
  const comparisonData = selectedReportIds.length === 2
    ? (() => {
        const report1 = reports.find(r => r.id === selectedReportIds[0])
        const report2 = reports.find(r => r.id === selectedReportIds[1])
        if (!report1 || !report2) return null

        return {
          report1: {
            date: report1.issuedAt.toLocaleDateString('ko-KR'),
            score: report1.overallScore,
            version: report1.version,
            title: report1.title
          },
          report2: {
            date: report2.issuedAt.toLocaleDateString('ko-KR'),
            score: report2.overallScore,
            version: report2.version,
            title: report2.title
          },
          change: report2.overallScore - report1.overallScore,
          changeRate: ((report2.overallScore - report1.overallScore) / report1.overallScore * 100).toFixed(1)
        }
      })()
    : null

  const handleReportSelect = (reportId: string) => {
    setSelectedReportIds(prev => {
      if (prev.includes(reportId)) {
        return prev.filter(id => id !== reportId)
      } else if (prev.length < 2) {
        return [...prev, reportId]
      } else {
        return [prev[1], reportId] // 가장 최근 선택 유지
      }
    })
    onSelectReport?.(reportId)
  }

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'initial':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'consulting_effect':
        return 'bg-purple-100 text-purple-700 border-purple-300'
      case 'comparison':
        return 'bg-orange-100 text-orange-700 border-orange-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getReportTypeLabel = (type: string) => {
    switch (type) {
      case 'initial':
        return '초회 진단'
      case 'consulting_effect':
        return '컨설팅 효과'
      case 'comparison':
        return '비교 리포트'
      default:
        return '리포트'
    }
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">리포트 비교 시각화</h3>
          <p className="text-gray-600 text-sm mt-1">
            발행된 리포트들을 날짜별로 비교하여 변화 추이를 확인하세요
          </p>
        </div>
        {selectedReportIds.length === 2 && comparisonData && (
          <div className="text-right">
            <div className="text-sm text-gray-600">변화율</div>
            <div className={`text-2xl font-bold ${
              comparisonData.change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {comparisonData.change >= 0 ? '+' : ''}{comparisonData.change}점
              <span className="text-lg"> ({comparisonData.changeRate}%)</span>
            </div>
          </div>
        )}
      </div>

      {/* 타임라인 차트 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="font-semibold text-gray-900 mb-4">점수 추이</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timelineData}>
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
      </div>

      {/* 리포트 선택 및 비교 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 리포트 목록 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">리포트 선택 (최대 2개)</h4>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {sortedReports.map((report) => {
              const isSelected = selectedReportIds.includes(report.id)
              return (
                <button
                  key={report.id}
                  onClick={() => handleReportSelect(report.id)}
                  className={`w-full text-left p-4 border-2 rounded-lg transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                        v{report.version}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold border ${getReportTypeColor(report.reportType)}`}>
                        {getReportTypeLabel(report.reportType)}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">
                        {report.overallScore}점
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    {report.title}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>{report.issuedAt.toLocaleDateString('ko-KR')}</span>
                    <span className="mx-1">•</span>
                    <span>{report.issuedAt.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* 비교 결과 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">비교 결과</h4>
          {comparisonData ? (
            <div className="space-y-4">
              {/* 비교 바 차트 */}
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={[
                  {
                    name: comparisonData.report1.date,
                    점수: comparisonData.report1.score,
                    리포트: '리포트 1'
                  },
                  {
                    name: comparisonData.report2.date,
                    점수: comparisonData.report2.score,
                    리포트: '리포트 2'
                  }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
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
                  />
                  <Legend />
                  <Bar dataKey="점수" fill="#3b82f6">
                    {[comparisonData.report1.score, comparisonData.report2.score].map((score, index) => (
                      <Cell 
                        key={index} 
                        fill={index === 0 ? '#3b82f6' : comparisonData.change >= 0 ? '#10b981' : '#ef4444'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* 상세 비교 정보 */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-sm text-gray-600">리포트 1</div>
                    <div className="font-semibold text-gray-900">{comparisonData.report1.title}</div>
                    <div className="text-xs text-gray-500 mt-1">v{comparisonData.report1.version}</div>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {comparisonData.report1.score}점
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  {comparisonData.change >= 0 ? (
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  ) : (
                    <TrendingDown className="w-6 h-6 text-red-600" />
                  )}
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <div className="text-sm text-gray-600">리포트 2</div>
                    <div className="font-semibold text-gray-900">{comparisonData.report2.title}</div>
                    <div className="text-xs text-gray-500 mt-1">v{comparisonData.report2.version}</div>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {comparisonData.report2.score}점
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${
                  comparisonData.change >= 0 ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'
                }`}>
                  <div className="text-sm font-semibold text-gray-700 mb-1">변화</div>
                  <div className={`text-xl font-bold ${
                    comparisonData.change >= 0 ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {comparisonData.change >= 0 ? '+' : ''}{comparisonData.change}점 
                    <span className="text-lg">({comparisonData.changeRate}%)</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[300px] text-gray-500">
              <div className="text-center">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>비교할 리포트 2개를 선택하세요</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
