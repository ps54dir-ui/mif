'use client'

import React, { useState, useEffect } from 'react'
import {
  getAllOnboardingStatuses,
  updateChannelStatus,
  getOnboardingSummary,
  type OnboardingStatus,
  type UpdateChannelRequest
} from '@/lib/api/onboarding'

interface ChannelConfig {
  key: string
  label: string
  required: boolean
  icon: string
}

const CHANNELS: ChannelConfig[] = [
  { key: 'ga4', label: 'GA4 권한', required: true, icon: '📊' },
  // 키는 유지하고 라벨만 변경하여 백엔드 스키마와의 호환성 보장
  { key: 'sns', label: 'Meta (Facebook/Instagram)', required: true, icon: '📱' },
  { key: 'naver_smartstore', label: '네이버 스마트스토어', required: false, icon: '🛒' },
  // 기존 필드를 그대로 사용: 라벨만 새로운 용어로 교체
  { key: 'naver_datacenter', label: '네이버 서치어드바이저', required: false, icon: '🔍' },
  { key: 'naver_bizadvisor', label: '네이버 통합 광고주센터', required: false, icon: '📈' },
  { key: 'coupang', label: '쿠팡 키', required: false, icon: '📦' },
  { key: 'email', label: '이메일 데이터', required: false, icon: '📧' },
  { key: 'homepage', label: '홈페이지 URL', required: false, icon: '🌐' }
]

export default function OnboardingDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [onboardingStatuses, setOnboardingStatuses] = useState<OnboardingStatus[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [statuses, summaryData] = await Promise.all([
        getAllOnboardingStatuses(),
        getOnboardingSummary()
      ])
      setOnboardingStatuses(statuses)
      setSummary(summaryData)
    } catch (error) {
      console.error('데이터 로드 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChannelToggle = async (
    brandId: string,
    channel: string,
    currentValue: boolean
  ) => {
    try {
      setUpdating(`${brandId}-${channel}`)
      
      const request: UpdateChannelRequest = {
        brand_id: brandId,
        channel: channel as any,
        received: !currentValue
      }
      
      await updateChannelStatus(request)
      
      // 상태 업데이트
      setOnboardingStatuses(prev =>
        prev.map(status =>
          status.brand_id === brandId
            ? {
                ...status,
                [`${channel}_received`]: !currentValue
              }
            : status
        )
      )
      
      // 요약 통계 다시 로드
      const summaryData = await getOnboardingSummary()
      setSummary(summaryData)
    } catch (error) {
      console.error('채널 상태 업데이트 실패:', error)
      alert('업데이트 실패: ' + (error as Error).message)
    } finally {
      setUpdating(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      'COMPLETED': 'bg-green-100 text-green-800',
      'IN_PROGRESS': 'bg-blue-100 text-blue-800',
      'NOT_STARTED': 'bg-gray-100 text-gray-800',
      'ON_HOLD': 'bg-yellow-100 text-yellow-800'
    }
    return styles[status as keyof typeof styles] || styles['NOT_STARTED']
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      'COMPLETED': '완료',
      'IN_PROGRESS': '진행 중',
      'NOT_STARTED': '미시작',
      'ON_HOLD': '보류'
    }
    return labels[status as keyof typeof labels] || status
  }

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
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 text-white mb-6">
          <h1 className="text-3xl font-bold mb-2">📋 온보딩 대시보드</h1>
          <p className="text-blue-100">고객사별 데이터 수령 상태 관리</p>
        </div>

        {/* 요약 통계 */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-sm text-gray-600 mb-1">전체 고객사</div>
              <div className="text-2xl font-bold text-gray-900">{summary.total_clients}</div>
            </div>
            <div className="bg-green-50 rounded-lg border border-green-200 p-4">
              <div className="text-sm text-gray-600 mb-1">완료</div>
              <div className="text-2xl font-bold text-green-600">{summary.completed}</div>
            </div>
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
              <div className="text-sm text-gray-600 mb-1">진행 중</div>
              <div className="text-2xl font-bold text-blue-600">{summary.in_progress}</div>
            </div>
            <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
              <div className="text-sm text-gray-600 mb-1">필수 데이터 완료</div>
              <div className="text-2xl font-bold text-yellow-600">{summary.required_data_complete}</div>
            </div>
            <div className="bg-red-50 rounded-lg border border-red-200 p-4">
              <div className="text-sm text-gray-600 mb-1">필수 데이터 미완료</div>
              <div className="text-2xl font-bold text-red-600">{summary.required_data_incomplete}</div>
            </div>
          </div>
        )}

        {/* 고객사 목록 */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">고객사별 데이터 수령 현황</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    고객사
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    진행률
                  </th>
                  {CHANNELS.map(channel => (
                    <th
                      key={channel.key}
                      className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div className="flex flex-col items-center">
                        <span>{channel.icon}</span>
                        <span className="mt-1">{channel.label}</span>
                        {channel.required && (
                          <span className="text-red-500 text-xs mt-1">필수</span>
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    담당자
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {onboardingStatuses.length === 0 ? (
                  <tr>
                    <td colSpan={CHANNELS.length + 4} className="px-6 py-8 text-center text-gray-500">
                      온보딩 데이터가 없습니다.
                    </td>
                  </tr>
                ) : (
                  onboardingStatuses.map((status) => (
                    <tr key={status.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {status.company_name || '미지정'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {status.brand_id.substring(0, 8)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                            status.onboarding_status
                          )}`}
                        >
                          {getStatusLabel(status.onboarding_status)}
                        </span>
                        {!status.required_data_complete && (
                          <div className="mt-1 text-xs text-red-600">⚠️ 필수 데이터 부족</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${status.onboarding_progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {status.onboarding_progress}%
                          </span>
                        </div>
                      </td>
                      {CHANNELS.map(channel => {
                        const channelKey = `${channel.key}_received` as keyof OnboardingStatus
                        const isReceived = status[channelKey] as boolean
                        const isUpdating = updating === `${status.brand_id}-${channel.key}`
                        
                        return (
                          <td key={channel.key} className="px-4 py-4 whitespace-nowrap text-center">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isReceived}
                                onChange={() => handleChannelToggle(status.brand_id, channel.key, isReceived)}
                                disabled={isUpdating}
                                className="sr-only peer"
                              />
                              <div
                                className={`w-11 h-6 rounded-full peer transition-colors ${
                                  isReceived
                                    ? 'bg-green-500'
                                    : 'bg-gray-300'
                                } peer-checked:bg-green-500 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 ${
                                  isUpdating ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                              >
                                <div
                                  className={`mt-0.5 ml-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                                    isReceived ? 'translate-x-5' : ''
                                  }`}
                                ></div>
                              </div>
                              {isUpdating && (
                                <div className="ml-2">
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                </div>
                              )}
                            </label>
                          </td>
                        )
                      })}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {status.assigned_to || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 안내 */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-2xl">ℹ️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">안내</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>필수 데이터(GA4, SNS)가 수령되지 않은 고객사는 리포트 생성 시 경고가 표시됩니다.</li>
                  <li>채널별 수령 여부를 체크하면 자동으로 데이터 수집이 시작됩니다.</li>
                  <li>진행률은 수령된 채널 수를 기준으로 자동 계산됩니다.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
