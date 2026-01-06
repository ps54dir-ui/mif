'use client'

import { useState, useEffect } from 'react'
import { ArrowUpDown, Search } from 'lucide-react'

interface RFMCCustomer {
  customer_id: string
  rfmc_code: string
  rfmc_score: number
  segment: string
  recency_days: number
  recency_score: number
  frequency_count: number
  frequency_score: number
  monetary_value: number
  monetary_score: number
  category_score: number
  preferred_category?: string
  preferred_channel?: string
  avg_transaction_value: number
  last_transaction_date: string
}

interface RFMCSegmentTableProps {
  brandId: string
  segmentName?: string
  analysisDate?: string
}

type SortField = 'rfmc_score' | 'monetary_value' | 'frequency_count' | 'recency_days'
type SortDirection = 'asc' | 'desc'

export function RFMCSegmentTable({ brandId, segmentName, analysisDate }: RFMCSegmentTableProps) {
  const [customers, setCustomers] = useState<RFMCCustomer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<SortField>('rfmc_score')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  useEffect(() => {
    fetchCustomers()
  }, [brandId, segmentName, analysisDate])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const dateParam = analysisDate ? `&analysis_date=${analysisDate}` : ''
      const response = await fetch(
        `http://localhost:8000/api/rfmc/segments/${brandId}?limit=1000${dateParam}`
      )
      
      if (!response.ok) {
        throw new Error('고객 데이터를 불러올 수 없습니다.')
      }
      
      const data = await response.json()
      
      // 세그먼트별로 필터링
      let allCustomers: RFMCCustomer[] = []
      if (segmentName) {
        const segment = data.segments.find((s: any) => s.segment_name === segmentName)
        allCustomers = segment?.customers || []
      } else {
        // 모든 세그먼트의 고객 합치기
        data.segments.forEach((segment: any) => {
          allCustomers = allCustomers.concat(segment.customers || [])
        })
      }
      
      setCustomers(allCustomers)
    } catch (err) {
      console.error('고객 데이터 로딩 오류:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const sortedCustomers = [...customers].sort((a, b) => {
    let aValue: number
    let bValue: number
    
    switch (sortField) {
      case 'rfmc_score':
        aValue = a.rfmc_score
        bValue = b.rfmc_score
        break
      case 'monetary_value':
        aValue = a.monetary_value
        bValue = b.monetary_value
        break
      case 'frequency_count':
        aValue = a.frequency_count
        bValue = b.frequency_count
        break
      case 'recency_days':
        aValue = a.recency_days
        bValue = b.recency_days
        break
      default:
        return 0
    }
    
    if (sortDirection === 'asc') {
      return aValue - bValue
    } else {
      return bValue - aValue
    }
  })

  const filteredCustomers = sortedCustomers.filter(customer =>
    customer.customer_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.rfmc_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.segment.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-blue-600"
    >
      {children}
      <ArrowUpDown className="h-4 w-4" />
    </button>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {segmentName ? `${segmentName} 고객 목록` : '전체 고객 목록'}
          </h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="고객 ID, RFMC 코드, 세그먼트 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="rfmc_score">RFMC 코드</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                고객 ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                세그먼트
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="rfmc_score">RFMC 점수</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                R점수
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                F점수
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                M점수
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                C점수
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="monetary_value">총 구매액</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="frequency_count">거래 횟수</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="recency_days">최근성 (일)</SortButton>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCustomers.slice(0, 100).map((customer) => (
              <tr key={customer.customer_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-mono font-semibold text-gray-900">
                    {customer.rfmc_code}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{customer.customer_id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {customer.segment}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">
                    {customer.rfmc_score.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{customer.recency_score}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{customer.frequency_score}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{customer.monetary_score}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{customer.category_score}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    ₩{Math.round(customer.monetary_value).toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{customer.frequency_count}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{customer.recency_days}일</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          고객 데이터가 없습니다.
        </div>
      )}

      {filteredCustomers.length > 100 && (
        <div className="p-4 border-t border-gray-200 text-sm text-gray-600 text-center">
          상위 100개 고객만 표시됩니다. (전체: {filteredCustomers.length}명)
        </div>
      )}
    </div>
  )
}
