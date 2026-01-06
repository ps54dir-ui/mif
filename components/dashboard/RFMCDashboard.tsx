'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts'
import { Users, TrendingUp, DollarSign, ShoppingCart } from 'lucide-react'

interface RFMCSegment {
  segment_name: string
  segment_description: string
  customer_count: number
  total_revenue: number
  avg_revenue_per_customer: number
  percentage_of_total: number
  recommended_actions: string[]
}

interface RFMCAnalysis {
  analysis: {
    analysis_date: string
    total_customers: number
    total_transactions: number
    total_revenue: number
    segment_distribution: Record<string, { count: number; percentage: number }>
  }
  segments: RFMCSegment[]
  top_customers: Array<{
    customer_id: string
    rfmc_code: string
    rfmc_score: number
    segment: string
    recency_score: number
    frequency_score: number
    monetary_score: number
    category_score: number
    monetary_value: number
  }>
}

interface RFMCDashboardProps {
  brandId: string
  analysisDate?: string
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B']

const SEGMENT_COLORS: Record<string, string> = {
  'CHAMPIONS': '#10B981',
  'LOYAL_CUSTOMERS': '#3B82F6',
  'POTENTIAL_LOYALISTS': '#F59E0B',
  'NEW_CUSTOMERS': '#8B5CF6',
  'PROMISING': '#EC4899',
  'NEED_ATTENTION': '#F97316',
  'ABOUT_TO_SLEEP': '#EF4444',
  'AT_RISK': '#DC2626',
  'CANNOT_LOSE_THEM': '#B91C1C',
  'HIBERNATING': '#991B1B',
  'LOST': '#7F1D1D'
}

export function RFMCDashboard({ brandId, analysisDate }: RFMCDashboardProps) {
  const [analysis, setAnalysis] = useState<RFMCAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRFMCAnalysis()
  }, [brandId, analysisDate])

  const fetchRFMCAnalysis = async () => {
    try {
      setLoading(true)
      const dateParam = analysisDate ? `?analysis_date=${analysisDate}` : ''
      const response = await fetch(`http://localhost:8000/api/rfmc/analysis/${brandId}${dateParam}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('RFMC 분석 결과가 없습니다. 먼저 분석을 실행해주세요.')
          setLoading(false)
          return
        }
        throw new Error('분석 결과를 불러올 수 없습니다.')
      }
      
      const data = await response.json()
      setAnalysis(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleCalculateRFMC = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:8000/api/rfmc/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand_id: brandId,
          analysis_date: analysisDate,
          analysis_period_days: 365
        })
      })
      
      if (!response.ok) {
        throw new Error('RFMC 분석 실행에 실패했습니다.')
      }
      
      // 분석 완료 후 결과 다시 불러오기
      await fetchRFMCAnalysis()
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error && !analysis) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleCalculateRFMC}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            RFMC 분석 실행
          </button>
        </div>
      </div>
    )
  }

  if (!analysis) {
    return null
  }

  const { analysis: analysisData, segments } = analysis

  // 세그먼트 분포 차트 데이터
  const segmentDistributionData = segments.map(seg => ({
    name: seg.segment_name,
    value: seg.customer_count,
    revenue: seg.total_revenue,
    percentage: seg.percentage_of_total
  }))

  // 세그먼트별 매출 차트 데이터
  const revenueBySegmentData = segments
    .sort((a, b) => b.total_revenue - a.total_revenue)
    .map(seg => ({
      name: seg.segment_name,
      revenue: seg.total_revenue,
      customers: seg.customer_count,
      avgRevenue: seg.avg_revenue_per_customer
    }))

  // 상위 세그먼트 (고객 수 기준)
  const topSegments = segments
    .sort((a, b) => b.customer_count - a.customer_count)
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">전체 고객</p>
              <p className="text-2xl font-bold text-gray-900">{analysisData.total_customers.toLocaleString()}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">총 거래</p>
              <p className="text-2xl font-bold text-gray-900">{analysisData.total_transactions.toLocaleString()}</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">총 매출</p>
              <p className="text-2xl font-bold text-gray-900">
                ₩{Math.round(analysisData.total_revenue).toLocaleString()}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">세그먼트 수</p>
              <p className="text-2xl font-bold text-gray-900">{segments.length}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* 세그먼트 분포 차트 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">세그먼트별 고객 분포</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={segmentDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {segmentDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={SEGMENT_COLORS[entry.name] || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">세그먼트별 매출</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueBySegmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip formatter={(value: number) => `₩${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="revenue" fill="#3B82F6" name="총 매출" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 세그먼트 상세 정보 */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">세그먼트 상세 분석</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {topSegments.map((segment) => (
              <div
                key={segment.segment_name}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{segment.segment_name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{segment.segment_description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{segment.customer_count.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">고객 ({segment.percentage_of_total.toFixed(1)}%)</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-600">총 매출</p>
                    <p className="text-lg font-semibold text-gray-900">
                      ₩{Math.round(segment.total_revenue).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">고객당 평균 매출</p>
                    <p className="text-lg font-semibold text-gray-900">
                      ₩{Math.round(segment.avg_revenue_per_customer).toLocaleString()}
                    </p>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <p className="text-sm text-gray-600">권장 액션</p>
                    <ul className="text-sm text-gray-700 mt-1">
                      {segment.recommended_actions.slice(0, 2).map((action, idx) => (
                        <li key={idx}>• {action}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 분석 실행 버튼 */}
      <div className="flex justify-end">
        <button
          onClick={handleCalculateRFMC}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          RFMC 분석 다시 실행
        </button>
      </div>
    </div>
  )
}
