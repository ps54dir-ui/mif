'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, XCircle, Clock, Plus } from 'lucide-react'
import { ChannelConnectModal } from './ChannelConnectModal'

interface Channel {
  id: string
  channel_type: string
  channel_url: string | null
  connection_status: 'PENDING' | 'CONNECTED' | 'FAILED' | 'DISCONNECTED'
  auto_discovered: boolean
}

interface ChannelConnectionStatusProps {
  brandId: string
  onChannelConnect?: (channelType: string) => void
}

export function ChannelConnectionStatus({ brandId, onChannelConnect }: ChannelConnectionStatusProps) {
  const [channels, setChannels] = useState<Channel[]>([])
  const [loading, setLoading] = useState(true)
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [selectedChannelType, setSelectedChannelType] = useState<string>('')

  useEffect(() => {
    fetchChannelStatus()
  }, [brandId])

  const fetchChannelStatus = async () => {
    try {
      // Mock 데이터 사용
      if (typeof window === 'undefined') {
        return
      }
      const urlParams = new URLSearchParams(window.location.search)
      const brandName = urlParams.get('brand_name') || '삼성생명'
      
      const { getMockBrandData } = await import('@/lib/api/mockData')
      const mockData = getMockBrandData(brandName) || getMockBrandData('삼성생명')
      
      if (mockData) {
        setChannels((mockData as any).channelConnections as Channel[])
      } else {
        setChannels([])
      }
    } catch (error) {
      console.error('채널 상태 조회 실패:', error)
      // 에러가 발생해도 Mock 데이터 사용
      const { getMockBrandData } = await import('@/lib/api/mockData')
      const mockData = getMockBrandData('삼성생명')
      setChannels((mockData?.channelConnections || []) as Channel[])
    } finally {
      setLoading(false)
    }
  }

  const getChannelLabel = (type: string) => {
    const labels: Record<string, string> = {
      'GOOGLE': '구글',
      'NAVER': '네이버',
      'YOUTUBE': '유튜브',
      'INSTAGRAM': '인스타그램',
      'TWITTER': 'X (트위터)',
      'THREADS': '쓰레드',
      'TIKTOK': '틱톡',
      'CAFE24': '카페24',
      'SHOPIFY': '쇼피파이',
      'CUSTOM_WEBSITE': '자사 웹사이트',
      'BLOG': '블로그'
    }
    return labels[type] || type
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONNECTED':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-600" />
      case 'FAILED':
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <XCircle className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'CONNECTED':
        return '연결됨'
      case 'PENDING':
        return '대기 중'
      case 'FAILED':
        return '연결 실패'
      default:
        return '연결 안 됨'
    }
  }

  if (loading) {
    return <div className="text-center py-4">로딩 중...</div>
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">채널 연결 현황</h2>
      
      {channels.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          연결된 채널이 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {channels.map((channel) => (
            <div
              key={channel.id}
              className={`p-4 rounded-lg border-2 ${
                channel.connection_status === 'CONNECTED'
                  ? 'bg-green-50 border-green-200'
                  : channel.connection_status === 'PENDING'
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(channel.connection_status)}
                  <span className="font-semibold text-gray-900">
                    {getChannelLabel(channel.channel_type)}
                  </span>
                </div>
                {channel.auto_discovered && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    자동 탐색
                  </span>
                )}
              </div>
              
              <div className="text-sm text-gray-600 mb-2">
                상태: {getStatusLabel(channel.connection_status)}
              </div>
              
              {channel.channel_url && (
                <a
                  href={channel.channel_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline"
                >
                  {channel.channel_url}
                </a>
              )}
              
              {channel.connection_status !== 'CONNECTED' && (
                <button
                  onClick={() => {
                    setSelectedChannelType(channel.channel_type)
                    setShowConnectModal(true)
                  }}
                  className="mt-2 w-full text-xs px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  수동 연결
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 채널 추가 버튼 (연결되지 않은 채널이 있을 때) */}
      {channels.length > 0 && channels.some(c => c.connection_status !== 'CONNECTED') && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={() => {
              // 사용 가능한 채널 타입 목록 표시 (간단히 유튜브로 시작)
              setSelectedChannelType('YOUTUBE')
              setShowConnectModal(true)
            }}
            className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>새 채널 추가하기</span>
          </button>
        </div>
      )}

      {/* 채널 연결 모달 */}
      <ChannelConnectModal
        isOpen={showConnectModal}
        onClose={() => {
          setShowConnectModal(false)
          setSelectedChannelType('')
        }}
        channelType={selectedChannelType}
        brandId={brandId}
        onConnect={async (channelType, channelUrl, channelName) => {
          // 실제 API 호출 (현재는 Mock)
          try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
            const response = await fetch(`${apiUrl}/api/channels/connect`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                brand_id: brandId,
                channel_type: channelType,
                channel_url: channelUrl,
                channel_name: channelName
              }),
            })

            if (!response.ok) {
              throw new Error('채널 연결에 실패했습니다.')
            }

            // 성공 시 채널 목록 새로고침
            await fetchChannelStatus()
            onChannelConnect?.(channelType)
          } catch (error) {
            // API 호출 실패 시 Mock 데이터로 업데이트
            const newChannel: Channel = {
              id: `channel-${Date.now()}`,
              channel_type: channelType,
              channel_url: channelUrl,
              connection_status: 'CONNECTED',
              auto_discovered: false
            }
            setChannels([...channels, newChannel])
            onChannelConnect?.(channelType)
          }
        }}
      />
    </div>
  )
}
