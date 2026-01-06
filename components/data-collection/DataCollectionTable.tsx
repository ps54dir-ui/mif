'use client'

import React, { useState, useEffect } from 'react'
import {
  getClientCollectionSummary,
  setClientCollectionConfig,
  getChannelLabel,
  getMethodTypeLabel,
  type ChannelCollectionSummary,
  type DataCollectionMethod,
  type ClientDataCollectionConfig
} from '@/lib/api/dataCollection'

interface DataCollectionTableProps {
  clientId: string
}

export default function DataCollectionTable({ clientId }: DataCollectionTableProps) {
  const [loading, setLoading] = useState(true)
  const [channels, setChannels] = useState<ChannelCollectionSummary[]>([])
  const [updating, setUpdating] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // 클라이언트 사이드에서만 마운트
    if (typeof window !== 'undefined') {
      setMounted(true)
    }
  }, [])

  useEffect(() => {
    if (mounted && clientId) {
      loadData()
    }
  }, [mounted, clientId])

  const loadData = async () => {
    if (typeof window === 'undefined') return
    
    try {
      setLoading(true)
      const data = await getClientCollectionSummary(clientId)
      setChannels(data || [])
    } catch (error) {
      console.error('데이터 수집 정보 로드 실패:', error)
      // 에러 발생 시 빈 배열로 설정하여 페이지가 계속 작동하도록 함
      setChannels([])
      // alert는 사용자 경험을 해치므로 제거
    } finally {
      setLoading(false)
    }
  }

  const handleMethodSelect = async (
    channelType: string,
    method: DataCollectionMethod,
    priority: number
  ) => {
    try {
      setUpdating(`${channelType}_${priority}`)
      
      const config: Omit<ClientDataCollectionConfig, 'id'> = {
        client_id: clientId,
        channel_type: channelType,
        method_id: method.id,
        method_type: method.method_type,
        priority: priority,
        collection_status: 'Pending',
        collection_config: {}
      }
      
      await setClientCollectionConfig(clientId, config)
      await loadData()
      alert('데이터 수집 방법이 설정되었습니다.')
    } catch (error) {
      console.error('데이터 수집 방법 설정 실패:', error)
      alert('데이터 수집 방법 설정에 실패했습니다: ' + (error as Error).message)
    } finally {
      setUpdating(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      'Completed': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Failed': 'bg-red-100 text-red-800',
      'None': 'bg-gray-100 text-gray-800'
    }
    return styles[status] || styles['None']
  }

  const getPriorityBadge = (priority: number) => {
    const colors = ['bg-red-100 text-red-800', 'bg-yellow-100 text-yellow-800', 'bg-blue-100 text-blue-800']
    return colors[priority - 1] || 'bg-gray-100 text-gray-800'
  }

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">데이터 수집 방법 관리</h2>
      
      <div className="space-y-6">
        {channels.map((channel) => {
          const selectedConfig = channel.selected_methods.find(
            sm => sm.config.priority === 1
          )?.config
          
          return (
            <div key={channel.channel_type} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {getChannelLabel(channel.channel_type)}
                </h3>
                {selectedConfig && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(selectedConfig.collection_status)}`}>
                    {selectedConfig.collection_status}
                  </span>
                )}
              </div>
              
              <div className="space-y-3">
                {channel.methods.map((method) => {
                  const isSelected = channel.selected_methods.some(
                    sm => sm.method.id === method.id && sm.config.priority === method.priority
                  )
                  const config = channel.selected_methods.find(
                    sm => sm.method.id === method.id && sm.config.priority === method.priority
                  )?.config
                  
                  return (
                    <div
                      key={`${method.id}_${method.priority}`}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityBadge(method.priority)}`}>
                              {method.priority}순위
                            </span>
                            <span className="font-semibold text-gray-900">
                              {method.method_name}
                            </span>
                            <span className="text-sm text-gray-600">
                              ({getMethodTypeLabel(method.method_type)})
                            </span>
                          </div>
                          {method.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {method.description}
                            </p>
                          )}
                          {config && (
                            <div className="mt-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(config.collection_status)}`}>
                                상태: {config.collection_status}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          {!isSelected ? (
                            <button
                              onClick={() => handleMethodSelect(channel.channel_type, method, method.priority)}
                              disabled={updating === `${channel.channel_type}_${method.priority}`}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {updating === `${channel.channel_type}_${method.priority}` ? (
                                <>
                                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                                  설정 중...
                                </>
                              ) : (
                                '선택'
                              )}
                            </button>
                          ) : (
                            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
                              ✓ 선택됨
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
      
      {channels.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          데이터 수집 방법이 없습니다.
        </div>
      )}
    </div>
  )
}
