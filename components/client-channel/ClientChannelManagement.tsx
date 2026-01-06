'use client'

import React, { useState, useEffect } from 'react'
import {
  getClientChannels,
  addOrUpdateChannel,
  updateChannelData,
  deleteChannel,
  getProvidedTypeLabel,
  type ClientChannelData
} from '@/lib/api/clientChannelData'
import { getChannelLabel as getChannelLabelFromDataCollection } from '@/lib/api/dataCollection'

interface ClientChannelManagementProps {
  clientId: string
}

// 지원하는 모든 채널 타입
const ALL_CHANNELS = [
  'GA4',
  'INSTAGRAM',
  'YOUTUBE',
  'FACEBOOK',
  'TWITTER',
  'TIKTOK',
  'THREADS',
  'NAVER_SMARTSTORE',
  'COUPANG',
  'NAVER_DATACENTER',
  'NAVER_BIZADVISOR',
  'NAVER_PLACE',
  'NAVER_CAFE',
  'OWN_STORE',
  'HOMEPAGE'
]

export default function ClientChannelManagement({ clientId }: ClientChannelManagementProps) {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [channels, setChannels] = useState<ClientChannelData[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingChannel, setEditingChannel] = useState<ClientChannelData | null>(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    channel_type: '',
    provided_type: 'NONE' as ClientChannelData['provided_type'],
    provided_data: {} as Record<string, any>,
    is_active: true,
    notes: ''
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setMounted(true)
    }
  }, [])

  useEffect(() => {
    if (mounted && clientId) {
      loadChannels()
    }
  }, [mounted, clientId])

  const loadChannels = async () => {
    try {
      setLoading(true)
      const data = await getClientChannels(clientId)
      setChannels(data)
    } catch (error) {
      console.error('채널 데이터 로드 실패:', error)
      alert('채널 데이터를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddChannel = () => {
    setFormData({
      channel_type: '',
      provided_type: 'NONE',
      provided_data: {},
      is_active: true,
      notes: ''
    })
    setEditingChannel(null)
    setShowAddModal(true)
  }

  const handleEditChannel = (channel: ClientChannelData) => {
    setFormData({
      channel_type: channel.channel_type,
      provided_type: channel.provided_type,
      provided_data: channel.provided_data || {},
      is_active: channel.is_active,
      notes: channel.notes || ''
    })
    setEditingChannel(channel)
    setShowAddModal(true)
  }

  const handleSaveChannel = async () => {
    try {
      setSaving(true)

      // provided_data 구성
      let providedData: Record<string, any> = {}
      
      if (formData.provided_type === 'API_KEY') {
        // API 키 관련 필드들
        if (formData.provided_data.api_key) providedData.api_key = formData.provided_data.api_key
        if (formData.provided_data.access_token) providedData.access_token = formData.provided_data.access_token
        if (formData.provided_data.property_id) providedData.property_id = formData.provided_data.property_id
        if (formData.provided_data.channel_id) providedData.channel_id = formData.provided_data.channel_id
        if (formData.provided_data.place_id) providedData.place_id = formData.provided_data.place_id
        if (formData.provided_data.cafe_id) providedData.cafe_id = formData.provided_data.cafe_id
        if (formData.provided_data.store_id) providedData.store_id = formData.provided_data.store_id
        if (formData.provided_data.seller_id) providedData.seller_id = formData.provided_data.seller_id
      } else if (formData.provided_type === 'CHANNEL_NAME') {
        // 채널명 관련 필드들
        if (formData.provided_data.channel_name) providedData.channel_name = formData.provided_data.channel_name
        if (formData.provided_data.account_name) providedData.account_name = formData.provided_data.account_name
        if (formData.provided_data.page_name) providedData.page_name = formData.provided_data.page_name
        if (formData.provided_data.place_name) providedData.place_name = formData.provided_data.place_name
        if (formData.provided_data.cafe_name) providedData.cafe_name = formData.provided_data.cafe_name
      } else if (formData.provided_type === 'CHANNEL_URL') {
        // URL 관련 필드들
        if (formData.provided_data.channel_url) providedData.channel_url = formData.provided_data.channel_url
        if (formData.provided_data.place_url) providedData.place_url = formData.provided_data.place_url
        if (formData.provided_data.cafe_url) providedData.cafe_url = formData.provided_data.cafe_url
        if (formData.provided_data.store_url) providedData.store_url = formData.provided_data.store_url
        if (formData.provided_data.url) providedData.url = formData.provided_data.url
      }

      if (editingChannel) {
        // 업데이트
        await updateChannelData(clientId, formData.channel_type, {
          provided_type: formData.provided_type,
          provided_data: providedData,
          is_active: formData.is_active,
          notes: formData.notes
        })
      } else {
        // 신규 추가
        await addOrUpdateChannel(clientId, {
          client_id: clientId,
          channel_type: formData.channel_type,
          provided_type: formData.provided_type,
          provided_data: providedData,
          is_active: formData.is_active,
          collection_status: 'None',
          notes: formData.notes
        })
      }

      setShowAddModal(false)
      await loadChannels()
      alert('채널 데이터가 저장되었습니다.')
    } catch (error) {
      console.error('채널 데이터 저장 실패:', error)
      alert('채널 데이터 저장에 실패했습니다: ' + (error as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteChannel = async (channelType: string) => {
    if (!confirm('이 채널을 삭제하시겠습니까?')) {
      return
    }

    try {
      await deleteChannel(clientId, channelType)
      await loadChannels()
      alert('채널이 삭제되었습니다.')
    } catch (error) {
      console.error('채널 삭제 실패:', error)
      alert('채널 삭제에 실패했습니다: ' + (error as Error).message)
    }
  }

  const getProvidedTypeBadge = (providedType: string) => {
    const styles: Record<string, string> = {
      'API_KEY': 'bg-green-100 text-green-800',
      'CHANNEL_NAME': 'bg-blue-100 text-blue-800',
      'CHANNEL_URL': 'bg-purple-100 text-purple-800',
      'MANUAL': 'bg-yellow-100 text-yellow-800',
      'NONE': 'bg-gray-100 text-gray-800'
    }
    return styles[providedType] || styles['NONE']
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

  // 등록된 채널과 등록되지 않은 채널 분리
  const registeredChannels = channels.filter(c => c.is_active)
  const registeredChannelTypes = new Set(registeredChannels.map(c => c.channel_type))
  const unregisteredChannels = ALL_CHANNELS.filter(c => !registeredChannelTypes.has(c))

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">운영 채널 및 데이터 제공 현황</h2>
        <button
          onClick={handleAddChannel}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + 채널 추가
        </button>
      </div>

      {/* 등록된 채널 목록 */}
      {registeredChannels.length > 0 ? (
        <div className="space-y-4 mb-6">
          {registeredChannels.map((channel) => (
            <div
              key={channel.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {getChannelLabelFromDataCollection(channel.channel_type)}
                    </h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getProvidedTypeBadge(channel.provided_type)}`}>
                      {getProvidedTypeLabel(channel.provided_type)}
                    </span>
                    {channel.is_active ? (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                        운영 중
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        비활성
                      </span>
                    )}
                  </div>

                  {/* 제공된 데이터 표시 */}
                  {channel.provided_data && Object.keys(channel.provided_data).length > 0 && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">제공된 정보:</div>
                      <div className="text-sm text-gray-900 space-y-1">
                        {Object.entries(channel.provided_data).map(([key, value]) => (
                          <div key={key}>
                            <span className="font-medium">{key}:</span> {String(value)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {channel.notes && (
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">메모:</span> {channel.notes}
                    </div>
                  )}
                </div>

                <div className="ml-4 flex gap-2">
                  <button
                    onClick={() => handleEditChannel(channel)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDeleteChannel(channel.channel_type)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 mb-6">
          등록된 채널이 없습니다. + 채널 추가 버튼을 클릭하여 채널을 추가하세요.
        </div>
      )}

      {/* 채널 추가/수정 모달 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto z-[10000]" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingChannel ? '채널 수정' : '채널 추가'}
              </h2>
            </div>

            <div className="p-6 space-y-4">
              {/* 채널 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  운영 채널 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.channel_type}
                  onChange={(e) => setFormData({ ...formData, channel_type: e.target.value })}
                  disabled={!!editingChannel}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">채널 선택</option>
                  {(editingChannel ? [editingChannel.channel_type] : unregisteredChannels).map((channel) => (
                    <option key={channel} value={channel}>
                      {getChannelLabelFromDataCollection(channel)}
                    </option>
                  ))}
                </select>
              </div>

              {/* 제공 타입 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제공 항목 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.provided_type}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    provided_type: e.target.value as ClientChannelData['provided_type'],
                    provided_data: {}
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="NONE">미제공</option>
                  <option value="API_KEY">API 키 제공</option>
                  <option value="CHANNEL_NAME">채널명 제공</option>
                  <option value="CHANNEL_URL">URL 제공</option>
                  <option value="MANUAL">수동 입력</option>
                </select>
              </div>

              {/* 제공된 데이터 입력 필드 */}
              {formData.provided_type === 'API_KEY' && (
                <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm font-medium text-blue-900 mb-2">API 키 정보</div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">API Key</label>
                    <input
                      type="text"
                      value={formData.provided_data?.api_key || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        provided_data: { ...formData.provided_data, api_key: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="API 키를 입력하세요"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Access Token (선택)</label>
                    <input
                      type="text"
                      value={formData.provided_data?.access_token || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        provided_data: { ...formData.provided_data, access_token: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Access Token (필요한 경우)"
                    />
                  </div>
                  {(formData.channel_type === 'GA4' || formData.channel_type === 'YOUTUBE') && (
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        {formData.channel_type === 'GA4' ? 'Property ID' : 'Channel ID'}
                      </label>
                      <input
                        type="text"
                        value={formData.provided_data?.[formData.channel_type === 'GA4' ? 'property_id' : 'channel_id'] || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          provided_data: { 
                            ...formData.provided_data, 
                            [formData.channel_type === 'GA4' ? 'property_id' : 'channel_id']: e.target.value 
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder={formData.channel_type === 'GA4' ? 'Property ID' : 'Channel ID'}
                      />
                    </div>
                  )}
                </div>
              )}

              {formData.provided_type === 'CHANNEL_NAME' && (
                <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm font-medium text-blue-900 mb-2">채널명 정보</div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">채널명</label>
                    <input
                      type="text"
                      value={formData.provided_data?.channel_name || formData.provided_data?.account_name || formData.provided_data?.page_name || formData.provided_data?.place_name || formData.provided_data?.cafe_name || ''}
                      onChange={(e) => {
                        const key = formData.channel_type.includes('PLACE') ? 'place_name' :
                                   formData.channel_type.includes('CAFE') ? 'cafe_name' :
                                   formData.channel_type.includes('FACEBOOK') ? 'page_name' :
                                   formData.channel_type.includes('TWITTER') || formData.channel_type.includes('TIKTOK') || formData.channel_type.includes('THREADS') ? 'account_name' :
                                   'channel_name'
                        setFormData({
                          ...formData,
                          provided_data: { ...formData.provided_data, [key]: e.target.value }
                        })
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="채널명을 입력하세요 (예: nike_korea)"
                    />
                  </div>
                </div>
              )}

              {formData.provided_type === 'CHANNEL_URL' && (
                <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm font-medium text-blue-900 mb-2">URL 정보</div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">채널 URL</label>
                    <input
                      type="url"
                      value={formData.provided_data?.channel_url || formData.provided_data?.place_url || formData.provided_data?.cafe_url || formData.provided_data?.store_url || formData.provided_data?.url || ''}
                      onChange={(e) => {
                        const key = formData.channel_type.includes('PLACE') ? 'place_url' :
                                   formData.channel_type.includes('CAFE') ? 'cafe_url' :
                                   formData.channel_type.includes('OWN_STORE') ? 'store_url' :
                                   formData.channel_type.includes('HOMEPAGE') ? 'url' :
                                   'channel_url'
                        setFormData({
                          ...formData,
                          provided_data: { ...formData.provided_data, [key]: e.target.value }
                        })
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="https://instagram.com/nike 또는 https://place.naver.com/..."
                    />
                  </div>
                </div>
              )}

              {/* 운영 상태 */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">현재 운영 중</span>
                </label>
              </div>

              {/* 메모 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  rows={3}
                  placeholder="추가 메모를 입력하세요"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSaveChannel}
                disabled={saving || !formData.channel_type}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
