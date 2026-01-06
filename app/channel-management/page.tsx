'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft, Upload, X, CheckCircle2, Link as LinkIcon, FileText } from 'lucide-react'
import Link from 'next/link'

interface Channel {
  id: string
  name: string
  url?: string
  type: string
}

export default function ChannelManagementPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const companyName = searchParams.get('brand_name') || ''
  const [channels, setChannels] = useState<Channel[]>([])
  const [channelInput, setChannelInput] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // URL 파라미터에서 채널 정보 가져오기
    const channelParam = searchParams.get('channel')
    if (channelParam) {
      setChannelInput(decodeURIComponent(channelParam))
    }

    // 저장된 채널 정보 로드 (실제로는 API에서 가져옴)
    const savedChannels = localStorage.getItem(`channels_${companyName}`)
    if (savedChannels) {
      setChannels(JSON.parse(savedChannels))
    }
  }, [companyName, searchParams])

  const handleAddChannel = () => {
    if (!channelInput.trim()) return

    const newChannel: Channel = {
      id: Date.now().toString(),
      name: channelInput.trim(),
      url: channelInput.trim().startsWith('http') ? channelInput.trim() : undefined,
      type: 'custom'
    }

    setChannels([...channels, newChannel])
    setChannelInput('')
    
    // 저장 (실제로는 API 호출)
    localStorage.setItem(`channels_${companyName}`, JSON.stringify([...channels, newChannel]))
  }

  const handleRemoveChannel = (id: string) => {
    const updated = channels.filter(c => c.id !== id)
    setChannels(updated)
    localStorage.setItem(`channels_${companyName}`, JSON.stringify(updated))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel')) {
      setUploadedFile(file)
      // 엑셀 파일 파싱 로직 (실제로는 xlsx 라이브러리 사용)
      const reader = new FileReader()
      reader.onload = (e) => {
        // 엑셀 파싱 로직 구현 필요
        console.log('엑셀 파일 내용:', e.target?.result)
      }
      reader.readAsText(file)
    } else {
      alert('엑셀 파일(.xlsx, .xls)만 업로드 가능합니다.')
    }
  }

  const handleSaveAndContinue = () => {
    // 채널 정보 저장 후 대시보드로 이동
    router.push(`/dashboard?brand_name=${encodeURIComponent(companyName)}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <LinkIcon className="w-6 h-6 text-blue-600" />
                  채널 정보 입력
                </h1>
                <p className="text-sm text-gray-500 mt-1">{companyName} 채널 관리</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* 안내 메시지 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              채널명 또는 URL 또는 엑셀 업로드 해주시기 바랍니다.
            </p>
          </div>

          {/* 채널 입력 */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">채널 추가</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  채널명 또는 URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={channelInput}
                    onChange={(e) => setChannelInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddChannel()
                      }
                    }}
                    placeholder="예: @nike, https://instagram.com/nike"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={handleAddChannel}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    추가
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  여러 채널은 쉼표(,)로 구분하여 입력하거나 엑셀 파일로 업로드하세요
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  엑셀 파일 업로드
                </label>
                <label className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <Upload className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700">엑셀/CSV 파일 선택</span>
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                {uploadedFile && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{uploadedFile.name}</span>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  권장 컬럼: company_name, homepage_url, ga4_property_id, meta_business_id, meta_ad_account_id, naver_ads_customer_id, naver_search_advisor_site, naver_smartstore_store_id, naver_place_id
                </p>
              </div>
            </div>
          </div>

          {/* 추가된 채널 목록 */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              추가된 채널 ({channels.length}개)
            </h2>
            
            {channels.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <LinkIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>추가된 채널이 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {channels.map((channel) => (
                  <div
                    key={channel.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <LinkIcon className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-medium text-gray-900">{channel.name}</div>
                        {channel.url && (
                          <div className="text-xs text-gray-500">{channel.url}</div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveChannel(channel.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 저장 및 계속 버튼 */}
          <div className="flex justify-end gap-4">
            <Link
              href="/"
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              취소
            </Link>
            <button
              onClick={handleSaveAndContinue}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              저장하고 진단 시작
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
