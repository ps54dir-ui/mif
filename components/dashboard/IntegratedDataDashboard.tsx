'use client'

import React, { useState, useEffect } from 'react'
import {
  getIntegratedDashboardData,
  compareChannels,
  getCustomerJourney,
  getCustomerSegments,
  type DashboardData
} from '@/lib/api/integrations'

interface IntegratedDataDashboardProps {
  brandId?: string
  defaultStartDate?: string
  defaultEndDate?: string
}

export function IntegratedDataDashboard({
  brandId,
  defaultStartDate,
  defaultEndDate
}: IntegratedDataDashboardProps) {
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [startDate, setStartDate] = useState(
    defaultStartDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  )
  const [endDate, setEndDate] = useState(
    defaultEndDate || new Date().toISOString().split('T')[0]
  )
  const [activeTab, setActiveTab] = useState<'overview' | 'channels' | 'journey' | 'segments'>('overview')

  useEffect(() => {
    loadDashboardData()
  }, [startDate, endDate])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const data = await getIntegratedDashboardData({
        start_date: startDate,
        end_date: endDate
      })
      setDashboardData(data)
    } catch (error) {
      console.error('대시보드 데이터 로드 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">데이터 로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="p-8 text-center text-gray-600">
        데이터를 불러올 수 없습니다.
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">📊 통합 데이터 대시보드</h2>
            <p className="text-blue-100 text-sm">GA4, 네이버, 쿠팡 데이터 통합 분석</p>
          </div>
          <div className="flex gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm text-gray-900"
            />
            <span className="text-white self-center">~</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm text-gray-900"
            />
            <button
              onClick={loadDashboardData}
              className="px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50"
            >
              새로고침
            </button>
          </div>
        </div>

        {/* 탭 */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'overview' ? 'bg-white text-blue-600' : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            개요
          </button>
          <button
            onClick={() => setActiveTab('channels')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'channels' ? 'bg-white text-blue-600' : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            채널 비교
          </button>
          <button
            onClick={() => setActiveTab('journey')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'journey' ? 'bg-white text-blue-600' : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            고객 여정
          </button>
          <button
            onClick={() => setActiveTab('segments')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'segments' ? 'bg-white text-blue-600' : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            고객 세분화
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 개요 탭 */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 요약 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                <div className="text-sm text-gray-600 mb-1">총 세션</div>
                <div className="text-2xl font-bold text-blue-600">
                  {dashboardData.summary.total_sessions.toLocaleString()}
                </div>
              </div>
              <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                <div className="text-sm text-gray-600 mb-1">총 매출</div>
                <div className="text-2xl font-bold text-green-600">
                  {dashboardData.summary.total_revenue.toLocaleString()}원
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
                <div className="text-sm text-gray-600 mb-1">전환율</div>
                <div className="text-2xl font-bold text-purple-600">
                  {dashboardData.summary.overall_cvr}%
                </div>
              </div>
              <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
                <div className="text-sm text-gray-600 mb-1">평균 만족도</div>
                <div className="text-2xl font-bold text-yellow-600">
                  {dashboardData.summary.avg_satisfaction.toFixed(1)}
                </div>
              </div>
              <div className="bg-red-50 rounded-lg border border-red-200 p-4">
                <div className="text-sm text-gray-600 mb-1">반품률</div>
                <div className="text-2xl font-bold text-red-600">
                  {dashboardData.summary.return_rate}%
                </div>
              </div>
            </div>

            {/* 페이지 점수 */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 mb-4">상세페이지 점수</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(dashboardData.detailedPageScore)
                  .filter(([key]) => key !== 'overall_score')
                  .map(([key, value]) => (
                    <div key={key} className="bg-white rounded-lg border border-gray-200 p-3">
                      <div className="text-xs text-gray-600 mb-1">{key}</div>
                      <div className="text-xl font-bold text-gray-900">{value}</div>
                    </div>
                  ))}
              </div>
              <div className="mt-4 bg-white rounded-lg border border-gray-200 p-3">
                <div className="text-sm text-gray-600 mb-1">종합 점수</div>
                <div className="text-3xl font-bold text-blue-600">
                  {dashboardData.detailedPageScore.overall_score}/100
                </div>
              </div>
            </div>

            {/* CVR 예측 */}
            <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border border-green-200 p-4">
              <h3 className="font-bold text-green-900 mb-4">CVR 예측</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg border border-green-200 p-3">
                  <div className="text-sm text-gray-600 mb-1">현재 CVR</div>
                  <div className="text-2xl font-bold text-green-600">
                    {dashboardData.cvrPrediction.current_cvr}%
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-green-200 p-3">
                  <div className="text-sm text-gray-600 mb-1">예측 CVR</div>
                  <div className="text-2xl font-bold text-teal-600">
                    {dashboardData.cvrPrediction.projected_cvr}%
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-green-200 p-3">
                  <div className="text-sm text-gray-600 mb-1">신뢰도</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {dashboardData.cvrPrediction.confidence}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 채널 비교 탭 */}
        {activeTab === 'channels' && (
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900">채널별 성과 비교</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(dashboardData.channelComparison).map(([channel, metrics]) => (
                <div key={channel} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                  <h4 className="font-bold text-gray-900 mb-3">{channel.toUpperCase()}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">트래픽:</span>
                      <span className="font-bold">{metrics.traffic.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">전환율:</span>
                      <span className="font-bold">{metrics.cvr}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">평균 주문액:</span>
                      <span className="font-bold">{metrics.aov.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">매출:</span>
                      <span className="font-bold text-green-600">{metrics.revenue.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 고객 여정 탭 */}
        {activeTab === 'journey' && (
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900">고객 여정</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                <h4 className="font-bold text-blue-900 mb-2">인지</h4>
                <div className="text-sm text-gray-700">
                  <div>채널: {dashboardData.customerJourney.discovery.channel}</div>
                  <div>소스: {dashboardData.customerJourney.discovery.source}</div>
                </div>
              </div>
              <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
                <h4 className="font-bold text-yellow-900 mb-2">고려</h4>
                <div className="text-sm text-gray-700">
                  <div>검색: {dashboardData.customerJourney.consideration.searches}</div>
                  <div>페이지뷰: {dashboardData.customerJourney.consideration.pageviews}</div>
                  <div>체류시간: {dashboardData.customerJourney.consideration.time_spent}초</div>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                <h4 className="font-bold text-green-900 mb-2">구매</h4>
                <div className="text-sm text-gray-700">
                  <div>채널: {dashboardData.customerJourney.purchase.channel}</div>
                  <div>금액: {dashboardData.customerJourney.purchase.amount.toLocaleString()}원</div>
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
                <h4 className="font-bold text-purple-900 mb-2">구매 후</h4>
                <div className="text-sm text-gray-700">
                  <div>반품률: {dashboardData.customerJourney.post_purchase.return_rate}%</div>
                  <div>만족도: {dashboardData.customerJourney.post_purchase.satisfaction}</div>
                  <div>재구매: {dashboardData.customerJourney.post_purchase.repeat_purchase ? '예' : '아니오'}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 고객 세분화 탭 */}
        {activeTab === 'segments' && (
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900">고객 세분화</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(dashboardData.customerSegments).map(([key, segment]) => (
                <div key={key} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                  <h4 className="font-bold text-gray-900 mb-2">{segment.segment}</h4>
                  <div className="text-2xl font-bold text-blue-600 mb-2">{segment.count}명</div>
                  <div className="text-sm text-gray-600">
                    <div>평균 주문액: {segment.characteristics.avg_order_value?.toLocaleString()}원</div>
                    <div>구매 빈도: {segment.characteristics.purchase_frequency}</div>
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
