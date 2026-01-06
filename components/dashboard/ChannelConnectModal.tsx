/**
 * 채널 연결 모달
 * 자동 검색 실패 시 URL 또는 채널명을 수동으로 입력하여 채널 연결
 */

'use client'

import { useState } from 'react'
import { X, Link as LinkIcon, User, Search, AlertCircle, CheckCircle2 } from 'lucide-react'

interface ChannelConnectModalProps {
  isOpen: boolean
  onClose: () => void
  channelType: string
  brandId: string
  onConnect: (channelType: string, channelUrl: string, channelName?: string) => Promise<void>
}

export function ChannelConnectModal({
  isOpen,
  onClose,
  channelType,
  brandId,
  onConnect
}: ChannelConnectModalProps) {
  const [inputMethod, setInputMethod] = useState<'url' | 'name'>('url')
  const [channelUrl, setChannelUrl] = useState('')
  const [channelName, setChannelName] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      'FACEBOOK': '페이스북',
      'BLOG': '블로그'
    }
    return labels[type] || type
  }

  const getInputPlaceholder = (type: string, method: 'url' | 'name') => {
    if (method === 'url') {
      const placeholders: Record<string, string> = {
        'YOUTUBE': 'https://www.youtube.com/@username',
        'INSTAGRAM': 'https://www.instagram.com/username',
        'TWITTER': 'https://twitter.com/username',
        'THREADS': 'https://www.threads.net/@username',
        'TIKTOK': 'https://www.tiktok.com/@username',
        'FACEBOOK': 'https://www.facebook.com/username',
        'CUSTOM_WEBSITE': 'https://www.example.com',
        'BLOG': 'https://blog.example.com',
        'NAVER': 'https://blog.naver.com/username',
        'CAFE24': 'https://store.example.com',
        'SHOPIFY': 'https://store.myshopify.com'
      }
      return placeholders[type] || 'https://example.com'
    } else {
      const placeholders: Record<string, string> = {
        'YOUTUBE': '채널명 또는 @username',
        'INSTAGRAM': '사용자명 (@ 제외)',
        'TWITTER': '사용자명 (@ 제외)',
        'THREADS': '사용자명 (@ 제외)',
        'TIKTOK': '사용자명 (@ 제외)',
        'FACEBOOK': '페이지명 또는 사용자명',
        'NAVER': '블로그 ID'
      }
      return placeholders[type] || '채널명 또는 사용자명'
    }
  }

  const getInputGuide = (type: string, method: 'url' | 'name') => {
    if (method === 'url') {
      return '전체 URL을 입력해주세요 (예: https://www.instagram.com/nike)'
    } else {
      const guides: Record<string, string> = {
        'YOUTUBE': '채널명 또는 @username 형식으로 입력 (예: @nike 또는 Nike)',
        'INSTAGRAM': '사용자명만 입력해주세요 (예: nike, @는 제외)',
        'TWITTER': '사용자명만 입력해주세요 (예: nike, @는 제외)',
        'THREADS': '사용자명만 입력해주세요 (예: nike, @는 제외)',
        'TIKTOK': '사용자명만 입력해주세요 (예: nike, @는 제외)',
        'FACEBOOK': '페이지명 또는 사용자명 입력',
        'NAVER': '네이버 블로그 ID 입력'
      }
      return guides[type] || '채널명 또는 사용자명을 입력해주세요'
    }
  }

  const validateUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url)
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
    } catch {
      return false
    }
  }

  const normalizeUrl = (type: string, input: string, method: 'url' | 'name'): string => {
    if (method === 'url') {
      return input.trim()
    } else {
      // 채널명을 URL로 변환
      const normalized = input.trim().replace(/^@/, '')
      const urlMap: Record<string, (name: string) => string> = {
        'YOUTUBE': (name) => `https://www.youtube.com/@${normalized}`,
        'INSTAGRAM': (name) => `https://www.instagram.com/${normalized}`,
        'TWITTER': (name) => `https://twitter.com/${normalized}`,
        'THREADS': (name) => `https://www.threads.net/@${normalized}`,
        'TIKTOK': (name) => `https://www.tiktok.com/@${normalized}`,
        'FACEBOOK': (name) => `https://www.facebook.com/${normalized}`,
        'NAVER': (name) => `https://blog.naver.com/${normalized}`
      }
      const urlBuilder = urlMap[type]
      return urlBuilder ? urlBuilder(normalized) : `https://${normalized}`
    }
  }

  const handleConnect = async () => {
    setError(null)

    // 입력 검증
    if (inputMethod === 'url') {
      if (!channelUrl.trim()) {
        setError('URL을 입력해주세요.')
        return
      }
      if (!validateUrl(channelUrl)) {
        setError('올바른 URL 형식이 아닙니다. (http:// 또는 https://로 시작해야 합니다)')
        return
      }
    } else {
      if (!channelName.trim()) {
        setError('채널명 또는 사용자명을 입력해주세요.')
        return
      }
    }

    try {
      setIsConnecting(true)
      const finalUrl = inputMethod === 'url' 
        ? channelUrl 
        : normalizeUrl(channelType, channelName, 'name')
      
      await onConnect(channelType, finalUrl, inputMethod === 'name' ? channelName : undefined)
      
      // 성공 시 모달 닫기
      handleClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : '채널 연결에 실패했습니다.')
    } finally {
      setIsConnecting(false)
    }
  }

  const handleClose = () => {
    setChannelUrl('')
    setChannelName('')
    setError(null)
    setInputMethod('url')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">채널 수동 연결</h2>
            <p className="text-sm text-gray-600 mt-1">
              {getChannelLabel(channelType)} 채널을 수동으로 연결합니다
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* 입력 방법 선택 */}
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              입력 방법 선택
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setInputMethod('url')}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  inputMethod === 'url'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <LinkIcon className={`w-6 h-6 mb-2 ${inputMethod === 'url' ? 'text-blue-600' : 'text-gray-400'}`} />
                <div className="font-semibold text-gray-900">URL 입력</div>
                <div className="text-xs text-gray-600 mt-1">전체 URL 주소 입력</div>
              </button>
              <button
                onClick={() => setInputMethod('name')}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  inputMethod === 'name'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <User className={`w-6 h-6 mb-2 ${inputMethod === 'name' ? 'text-blue-600' : 'text-gray-400'}`} />
                <div className="font-semibold text-gray-900">채널명 입력</div>
                <div className="text-xs text-gray-600 mt-1">사용자명 또는 채널명</div>
              </button>
            </div>
          </div>

          {/* 입력 필드 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {inputMethod === 'url' ? '채널 URL' : '채널명 / 사용자명'}
            </label>
            {inputMethod === 'url' ? (
              <input
                type="url"
                value={channelUrl}
                onChange={(e) => setChannelUrl(e.target.value)}
                placeholder={getInputPlaceholder(channelType, 'url')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isConnecting}
              />
            ) : (
              <input
                type="text"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                placeholder={getInputPlaceholder(channelType, 'name')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isConnecting}
              />
            )}
            <p className="mt-2 text-xs text-gray-500 flex items-start gap-1">
              <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span>{getInputGuide(channelType, inputMethod)}</span>
            </p>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold text-red-900">오류</div>
                <div className="text-sm text-red-800 mt-1">{error}</div>
              </div>
            </div>
          )}

          {/* 버튼 */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              disabled={isConnecting}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              취소
            </button>
            <button
              onClick={handleConnect}
              disabled={isConnecting || (inputMethod === 'url' ? !channelUrl.trim() : !channelName.trim())}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isConnecting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>연결 중...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>연결하기</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
