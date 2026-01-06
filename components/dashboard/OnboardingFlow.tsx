'use client'

import { useState } from 'react'
import { Search } from './icons'

interface OnboardingFlowProps {
  onComplete: (brandId: string) => void
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [brandName, setBrandName] = useState('')
  const [isDiscovering, setIsDiscovering] = useState(false)
  const [discoveredChannels, setDiscoveredChannels] = useState<any[]>([])
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleDiscover = async () => {
    if (!brandName.trim()) {
      alert('브랜드명을 입력해주세요.')
      return
    }

    try {
      setIsDiscovering(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/api/discovery/channels`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ brand_name: brandName }),
      })

      if (!response.ok) throw new Error('채널 탐색 실패')

      const data = await response.json()
      setDiscoveredChannels(data.discovery_result.discovered_channels || [])
      setShowConfirmation(true)
    } catch (error) {
      console.error('채널 탐색 오류:', error)
      alert('채널 탐색에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsDiscovering(false)
    }
  }

  const handleConfirmConnection = async () => {
    try {
      // 발견된 채널 연결 확인
      // 실제로는 사용자가 선택한 채널만 연결
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      
      // 첫 번째 발견 결과에서 brand_id 가져오기
      const discoverResponse = await fetch(`${apiUrl}/api/discovery/channels`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ brand_name: brandName }),
      })
      
      const discoverData = await discoverResponse.json()
      const brandId = discoverData.brand?.id

      if (brandId) {
        onComplete(brandId)
      }
    } catch (error) {
      console.error('연결 확인 오류:', error)
    }
  }

  if (showConfirmation && discoveredChannels.length > 0) {
    return (
      <div className="bg-white rounded-lg border-2 border-blue-200 p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          발견된 채널 ({discoveredChannels.length}개)
        </h3>
        <div className="space-y-2 mb-4">
          {discoveredChannels.map((channel, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <span className="font-medium text-gray-900">{channel.channel_type}</span>
                {channel.channel_url && (
                  <div className="text-sm text-gray-600 mt-1">{channel.channel_url}</div>
                )}
              </div>
              <div className="text-sm text-gray-500">
                신뢰도: {(channel.confidence * 100).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleConfirmConnection}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            연결하시겠습니까?
          </button>
          <button
            onClick={() => {
              setShowConfirmation(false)
              setDiscoveredChannels([])
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
          >
            취소
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border-2 border-blue-200 p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        브랜드 채널 자동 탐색
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        브랜드명을 입력하면 구글, 네이버, 유튜브, 인스타그램, X, 쓰레드, 틱톡에서
        관련 채널을 자동으로 찾아드립니다.
      </p>
      <div className="flex gap-3">
        <input
          type="text"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          placeholder="브랜드명을 입력하세요"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleDiscover()
            }
          }}
        />
        <button
          onClick={handleDiscover}
          disabled={isDiscovering || !brandName.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isDiscovering ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>탐색 중...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>탐색</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
