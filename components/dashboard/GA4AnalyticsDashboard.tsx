/**
 * GA4 분석 대시보드 컴포넌트
 * GA4 데이터와 심리 분석을 통합하여 표시
 */

'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { fetchGA4RealTimeData, syncGA4WithPsychology, type GA4RealTimeData } from '@/lib/ga4/ga4Api'
import { TrendingUp, Users, MousePointerClick, DollarSign } from 'lucide-react'

interface GA4AnalyticsDashboardProps {
  brandId?: string
  psychologicalStimulus?: number // SNS 영상의 심리적 자극 수치 (0-100)
  videoViews?: number
}

export function GA4AnalyticsDashboard({ 
  brandId,
  psychologicalStimulus = 75,
  videoViews = 100000
}: GA4AnalyticsDashboardProps) {
  const [ga4Data, setGA4Data] = useState<GA4RealTimeData | null>(null)
  const [syncResult, setSyncResult] = useState<{
    correlation: number
    insight: string
    recommendation: string
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadGA4Data() {
      try {
        setLoading(true)
        const data = await fetchGA4RealTimeData()
        setGA4Data(data)
        
        // 심리 분석과 동기화
        const sync = syncGA4WithPsychology(data, psychologicalStimulus, videoViews)
        setSyncResult(sync)
      } catch (error) {
        console.error('GA4 데이터 로딩 오류:', error)
      } finally {
        setLoading(false)
      }
    }

    loadGA4Data()
  }, [psychologicalStimulus, videoViews])

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">GA4 데이터를 불러오는 중...</div>
        </div>
      </div>
    )
  }

  if (!ga4Data) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="text-gray-500">GA4 데이터를 불러올 수 없습니다.</div>
      </div>
    )
  }

  // 획득 데이터 차트
  const acquisitionChartData = ga4Data.acquisition.map(a => ({
    날짜: new Date(a.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
    사용자: a.users,
    신규사용자: a.newUsers,
    세션: a.sessions
  }))

  // 참여도 데이터 차트
  const engagementChartData = ga4Data.engagement.map(e => ({
    날짜: new Date(e.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
    세션시간: Math.round(e.sessionDuration / 60), // 분으로 변환
    페이지수: e.pagesPerSession.toFixed(1),
    이탈률: e.bounceRate.toFixed(1),
    참여율: e.engagementRate.toFixed(1)
  }))

  // 전환 데이터 차트
  const conversionChartData = ga4Data.conversion.map(c => ({
    날짜: new Date(c.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
    전환수: c.conversions,
    전환율: c.conversionRate.toFixed(2),
    매출: Math.round(c.revenue / 10000) / 100, // 억원 단위
    구매수: c.ecommercePurchases
  }))

  // 평균값 계산
  const avgUsers = Math.round(ga4Data.acquisition.reduce((sum, a) => sum + a.users, 0) / ga4Data.acquisition.length)
  const avgEngagementRate = ga4Data.engagement.reduce((sum, e) => sum + e.engagementRate, 0) / ga4Data.engagement.length
  const avgConversionRate = ga4Data.conversion.reduce((sum, c) => sum + c.conversionRate, 0) / ga4Data.conversion.length
  const totalRevenue = ga4Data.conversion.reduce((sum, c) => sum + c.revenue, 0)

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-4">
        <h2 className="text-2xl font-bold text-white">GA4 실시간 분석</h2>
        <p className="text-green-100 text-sm mt-1">
          마지막 업데이트: {new Date(ga4Data.lastUpdated).toLocaleString('ko-KR')}
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* 핵심 지표 요약 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div className="text-sm text-blue-600 font-medium">평균 사용자</div>
            </div>
            <div className="text-2xl font-bold text-blue-900">{avgUsers.toLocaleString()}</div>
            <div className="text-xs text-blue-600 mt-1">명/일</div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <MousePointerClick className="w-5 h-5 text-purple-600" />
              <div className="text-sm text-purple-600 font-medium">평균 참여율</div>
            </div>
            <div className="text-2xl font-bold text-purple-900">{avgEngagementRate.toFixed(1)}%</div>
            <div className="text-xs text-purple-600 mt-1">평균 참여율</div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <div className="text-sm text-green-600 font-medium">평균 전환율</div>
            </div>
            <div className="text-2xl font-bold text-green-900">{avgConversionRate.toFixed(2)}%</div>
            <div className="text-xs text-green-600 mt-1">평균 전환율</div>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-orange-600" />
              <div className="text-sm text-orange-600 font-medium">총 매출</div>
            </div>
            <div className="text-2xl font-bold text-orange-900">
              {(totalRevenue / 100000000).toFixed(1)}억
            </div>
            <div className="text-xs text-orange-600 mt-1">원 (7일 기준)</div>
          </div>
        </div>

        {/* 심리 분석 동기화 결과 */}
        {syncResult && (
          <div className={`rounded-lg p-4 border ${
            syncResult.correlation > 0.7 
              ? 'bg-green-50 border-green-200' 
              : syncResult.correlation > 0.4 
              ? 'bg-yellow-50 border-yellow-200'
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">
                  심리 분석 동기화 결과
                </h3>
                <p className="text-sm text-gray-700 mb-2">{syncResult.insight}</p>
                <p className="text-sm text-gray-600">
                  <strong>상관관계:</strong> {(syncResult.correlation * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>추천:</strong> {syncResult.recommendation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 획득 데이터 차트 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">사용자 획득 추이</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={acquisitionChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="날짜" 
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="사용자" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="사용자"
              />
              <Line 
                type="monotone" 
                dataKey="신규사용자" 
                stroke="#10b981" 
                strokeWidth={2}
                name="신규 사용자"
              />
              <Line 
                type="monotone" 
                dataKey="세션" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                name="세션"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 참여도 데이터 차트 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">참여도 지표</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={engagementChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="날짜" 
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
              />
              <Legend />
              <Bar dataKey="참여율" fill="#8b5cf6" name="참여율 (%)" />
              <Bar dataKey="이탈률" fill="#ef4444" name="이탈률 (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 전환 데이터 차트 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">전환 및 매출 추이</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={conversionChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="날짜" 
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <YAxis yAxisId="left" tick={{ fill: '#6b7280', fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: '#6b7280', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="전환수" 
                stroke="#10b981" 
                strokeWidth={2}
                name="전환수"
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="전환율" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="전환율 (%)"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="매출" 
                stroke="#f59e0b" 
                strokeWidth={2}
                name="매출 (억원)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
