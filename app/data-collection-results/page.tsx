'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle2, XCircle, Loader2, ArrowRight, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface ChannelStatus {
  status: 'not_collected' | 'partial_collected' | 'fully_collected'
  method: 'search_based' | 'api_connected' | null
  count?: number
  note?: string
  analysis_type?: 'actual' | 'inference' | 'unavailable'
  analysis_type_label?: string
  analysis_type_description?: string
  details?: {
    web?: number
    blog?: number
    cafearticle?: number
    news?: number
  }
  detected_urls?: Array<{
    url: string
    title?: string
    blog_id?: string
    cafe_id?: string
    place_id?: string
    account?: string
    channel_id?: string
    page_id?: string
    [key: string]: any
  }>
}

interface DataCollectionResponse {
  collection_id: string
  company_name: string
  collected_data: {
    naver_search: {
      web: Array<any>
      blog: Array<any>
      cafearticle: Array<any>
      news: Array<any>
      status: string
      total_count: number
    }
    channels: any[]
    collection_method: string
    collection_status: string
  }
  channels: Record<string, ChannelStatus>
  collection_status: string
  collection_method: string
}

const CHANNEL_LABELS: Record<string, string> = {
  // 검색으로 취합한 데이터
  naver_search: '네이버 검색',
  // 전문 진단 콘텐츠 채널들
  youtube: 'YouTube',
  instagram: 'Instagram',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  threads: 'Threads',
  twitter: 'X (Twitter)',
  naver_smartstore: '네이버 스마트스토어',
  coupang: '쿠팡',
  daum_cafe: '다음카페',
  own_store: '자사몰',
  // 네이버 계열 채널들
  naver_place: '네이버 플레이스',
  naver_blog: '네이버 블로그',
  naver_cafe: '네이버 카페',
  naver_bizadvisor: '네이버 비즈어드바이저 (SEM 포함)',
  naver_datacenter: '네이버 데이터센터',
  // 홈페이지
  homepage: '홈페이지',
  // 기타
  ga4: 'Google Analytics 4'
}

const CHANNEL_DESCRIPTIONS: Record<string, string> = {
  naver_search: '검색으로 취합한 데이터 (전체 온라인 활동 진단에 사용)',
  youtube: 'YouTube 전문 진단',
  instagram: 'Instagram 전문 진단',
  facebook: 'Facebook 전문 진단',
  tiktok: 'TikTok 전문 진단',
  threads: 'Threads 전문 진단',
  twitter: 'X (Twitter) 전문 진단',
  naver_smartstore: '네이버 스마트스토어 전문 진단',
  coupang: '쿠팡 전문 진단',
  daum_cafe: '다음카페 전문 진단',
  own_store: '자사몰 전문 진단',
  naver_place: '네이버 플레이스 데이터',
  naver_blog: '네이버 블로그 데이터 (SEO/NEO/AEO/GEO 평가 적용)',
  naver_cafe: '네이버 카페 데이터',
  naver_bizadvisor: '네이버 비즈어드바이저 (SEM 포함)',
  naver_datacenter: '네이버 데이터센터 데이터',
  homepage: '회사 공식 홈페이지',
  ga4: 'Google Analytics 4 데이터'
}

export default function DataCollectionResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const companyName = searchParams.get('company_name') || ''
  const collectionId = searchParams.get('collection_id') || ''

  const [loading, setLoading] = useState(true)
  const [collectionData, setCollectionData] = useState<DataCollectionResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [startingDiagnosis, setStartingDiagnosis] = useState(false)

  useEffect(() => {
    if (!companyName) {
      setError('회사명이 필요합니다')
      setLoading(false)
      return
    }

    // 데이터 수집 API 호출
    const collectData = async () => {
      try {
        const token = localStorage.getItem('access_token')
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        }
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }

        const response = await fetch(`${apiUrl}/api/mif/collect-data`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            company_name: companyName
          })
        })

        if (!response.ok) {
          throw new Error('데이터 수집 실패')
        }

        const data = await response.json()
        setCollectionData(data)
      } catch (err: any) {
        console.error('데이터 수집 오류:', err)
        setError(err.message || '데이터 수집 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    // collectionId가 있으면 재수집하지 않음 (추후 구현)
    // 현재는 항상 수집
    collectData()
  }, [companyName, collectionId])

  const handleStartDiagnosis = async () => {
    if (!companyName || !collectionData) return

    setStartingDiagnosis(true)
    try {
      const { startDiagnosis } = await import('@/lib/api/diagnosticsApi')

      const diagnosisResult = await startDiagnosis({
        company_name: companyName,
        brand_name: companyName,
        channel_info: collectionData.collected_data
      })

      router.push(
        `/dashboard?brand_name=${encodeURIComponent(companyName)}&diagnosis_id=${diagnosisResult.diagnosis_id}&report_id=${diagnosisResult.report_id}`
      )
    } catch (error) {
      console.error('진단 시작 오류:', error)
      // 오류 발생 시에도 대시보드로 이동
      router.push(`/dashboard?brand_name=${encodeURIComponent(companyName)}`)
    } finally {
      setStartingDiagnosis(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 via-purple-900 to-blue-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-white mx-auto mb-4" />
          <p className="text-white text-lg">데이터 수집 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 via-purple-900 to-blue-800 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">오류 발생</h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <button
              onClick={() => router.push('/company-search')}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              검색 페이지로 돌아가기
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!collectionData) {
    return null
  }

  const channels = collectionData.channels
  // 새로운 구조: channels는 Record<string, ChannelStatus> 형태
  const hasAnyData = Object.values(channels).some((channelStatus: ChannelStatus) => {
    const status = channelStatus.status || 'not_collected'
    return status === 'partial_collected' || status === 'fully_collected'
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-purple-900 to-blue-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            데이터 수집 결과
          </h1>
          <p className="text-gray-300 text-lg">
            {companyName}
          </p>
        </div>

        {/* 채널별 수집 결과 */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-6">채널별 데이터 수집 현황</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {Object.entries(channels).map(([channelKey, channelStatus]) => {
              const label = CHANNEL_LABELS[channelKey] || channelKey
              const description = CHANNEL_DESCRIPTIONS[channelKey] || '데이터 수집 채널'
              
              // 채널 상태 정보 (새로운 구조)
              const status = (channelStatus as ChannelStatus).status || 'not_collected'
              const method = (channelStatus as ChannelStatus).method
              const count = (channelStatus as ChannelStatus).count || 0
              const note = (channelStatus as ChannelStatus).note
              const details = (channelStatus as ChannelStatus).details
              const detectedUrls = (channelStatus as ChannelStatus).detected_urls || []
              
              // 상태에 따른 표시 (부분 수집/완전 수집 모두 "수집"으로 표시)
              const hasData = status === 'partial_collected' || status === 'fully_collected'
              
              // 분석 타입 (없으면 기본값 설정: 데이터 있으면 추론분석, 없으면 분석불가)
              const analysisType = (channelStatus as ChannelStatus).analysis_type || (hasData ? 'inference' : 'unavailable')
              const analysisTypeLabel = (channelStatus as ChannelStatus).analysis_type_label || 
                (analysisType === 'actual' ? '실질분석 (RAG 기반)' :
                 analysisType === 'inference' ? '추론분석' :
                 '분석불가')
              const analysisTypeDescription = (channelStatus as ChannelStatus).analysis_type_description ||
                (analysisType === 'actual' ? '실제 수집 데이터와 AI가 직접 분석한 결과입니다.' :
                 analysisType === 'inference' ? '데이터가 부족하여 추론으로 분석한 결과입니다.' :
                 '분석에 필요한 데이터가 없어 분석할 수 없습니다.')
              const displayStatus = hasData ? '수집' : '미수집'
              
              // 채널별 구체적인 정보 추출 (naver_search 전용)
              let channelInfo = null
              if (channelKey === 'naver_search' && details) {
                const totalCount = count || 0
                const typeNames = []
                if (details.web && details.web > 0) typeNames.push(`웹 ${details.web}개`)
                if (details.blog && details.blog > 0) typeNames.push(`블로그 ${details.blog}개`)
                if (details.cafearticle && details.cafearticle > 0) typeNames.push(`카페 ${details.cafearticle}개`)
                if (details.news && details.news > 0) typeNames.push(`뉴스 ${details.news}개`)
                
                channelInfo = {
                  count: totalCount,
                  type: '검색 결과',
                  details: typeNames.length > 0 ? typeNames.join(', ') : '검색 결과 없음'
                }
              }
              
              // 채널별 아이콘/배지 색상
              const getChannelColor = (key: string) => {
                const colors: Record<string, { bg: string; border: string; text: string }> = {
                  // 검색으로 취합한 데이터
                  naver_search: { bg: 'bg-green-500/20', border: 'border-green-400/50', text: 'text-green-300' },
                  // 전문 진단 콘텐츠 채널들
                  youtube: { bg: 'bg-red-500/20', border: 'border-red-400/50', text: 'text-red-300' },
                  instagram: { bg: 'bg-gradient-to-br from-purple-500/20 to-pink-500/20', border: 'border-pink-400/50', text: 'text-pink-300' },
                  facebook: { bg: 'bg-blue-600/20', border: 'border-blue-500/50', text: 'text-blue-300' },
                  tiktok: { bg: 'bg-black/30', border: 'border-gray-500/50', text: 'text-gray-200' },
                  threads: { bg: 'bg-gray-700/30', border: 'border-gray-500/50', text: 'text-gray-200' },
                  twitter: { bg: 'bg-black/30', border: 'border-gray-600/50', text: 'text-gray-200' },
                  naver_smartstore: { bg: 'bg-green-500/20', border: 'border-green-400/50', text: 'text-green-300' },
                  coupang: { bg: 'bg-orange-500/20', border: 'border-orange-400/50', text: 'text-orange-300' },
                  daum_cafe: { bg: 'bg-blue-400/20', border: 'border-blue-300/50', text: 'text-blue-200' },
                  own_store: { bg: 'bg-indigo-500/20', border: 'border-indigo-400/50', text: 'text-indigo-300' },
                  // 네이버 계열 채널들
                  naver_place: { bg: 'bg-cyan-500/20', border: 'border-cyan-400/50', text: 'text-cyan-300' },
                  naver_blog: { bg: 'bg-green-500/20', border: 'border-green-400/50', text: 'text-green-300' },
                  naver_cafe: { bg: 'bg-lime-500/20', border: 'border-lime-400/50', text: 'text-lime-300' },
                  naver_bizadvisor: { bg: 'bg-teal-500/20', border: 'border-teal-400/50', text: 'text-teal-300' },
                  naver_datacenter: { bg: 'bg-emerald-500/20', border: 'border-emerald-400/50', text: 'text-emerald-300' },
                  // 기타
                  ga4: { bg: 'bg-orange-500/20', border: 'border-orange-400/50', text: 'text-orange-300' }
                }
                return colors[key] || { bg: 'bg-gray-500/20', border: 'border-gray-400/50', text: 'text-gray-300' }
              }
              
              const channelColor = getChannelColor(channelKey)
              
              return (
                <div
                  key={channelKey}
                  className={`p-5 rounded-xl border-2 transition-all ${
                    hasData
                      ? `${channelColor.bg} ${channelColor.border} hover:shadow-lg hover:scale-105`
                      : 'bg-gray-500/20 border-gray-400/50 hover:bg-gray-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className={`font-bold text-lg mb-1 ${hasData ? channelColor.text : 'text-white'}`}>
                        {label}
                      </h3>
                      <p className="text-xs text-gray-400 mb-2 leading-relaxed">
                        {description}
                      </p>
                    </div>
                    {hasData ? (
                      <CheckCircle2 className={`w-6 h-6 flex-shrink-0 ${channelColor.text}`} />
                    ) : (
                      <XCircle className="w-6 h-6 text-gray-400 flex-shrink-0" />
                    )}
                  </div>
                  
                  <div className="space-y-2 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">수집 상태</span>
                      <span className={`text-sm font-semibold ${
                        hasData ? channelColor.text : 'text-gray-400'
                      }`}>
                        {hasData ? '✓ 수집' : '✗ 미수집'}
                      </span>
                    </div>
                    
                    {/* 수집 방법 표시 */}
                    {method && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">수집 방법</span>
                        <span className="text-xs text-gray-400">
                          {method === 'search_based' && '검색 기반'}
                          {method === 'api_connected' && 'API 연동'}
                        </span>
                      </div>
                    )}
                    
                    {/* 분석 타입 표시 (항상 표시) */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">분석 타입</span>
                      <span className={`text-xs font-semibold ${
                        analysisType === 'actual' ? 'text-green-400' :
                        analysisType === 'inference' ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {analysisTypeLabel || 
                          (analysisType === 'actual' ? '실질분석' :
                           analysisType === 'inference' ? '추론분석' :
                           '분석불가')}
                      </span>
                    </div>
                    
                    {/* 분석 타입 설명 */}
                    {analysisTypeDescription && (
                      <p className="text-xs text-gray-500 mt-1 italic">
                        {analysisTypeDescription}
                      </p>
                    )}
                    
                    {/* 채널별 상세 정보 */}
                    {channelInfo && hasData && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">{channelInfo.type}</span>
                          <span className={`text-base font-bold ${channelColor.text}`}>
                            {channelInfo.count}개
                          </span>
                        </div>
                        {channelInfo.details && (
                          <p className="text-xs text-gray-500 mt-1">
                            {channelInfo.details}
                          </p>
                        )}
                      </>
                    )}
                    
                    {/* 수집된 채널 URL/채널명 표시 */}
                    {hasData && detectedUrls.length > 0 && (
                      <div className="pt-2 mt-2 border-t border-white/10">
                        <div className="text-xs text-gray-400 mb-1.5">수집된 주소/채널명:</div>
                        <div className="space-y-1.5">
                          {detectedUrls.slice(0, 3).map((item, idx) => {
                            // 채널명 또는 ID 추출
                            let displayText = item.url || ''
                            if (item.blog_id) {
                              displayText = `블로그 ID: ${item.blog_id}`
                            } else if (item.cafe_id && item.cafe_name) {
                              displayText = `${item.cafe_name} (카페 ID: ${item.cafe_id})`
                            } else if (item.cafe_id) {
                              displayText = `카페 ID: ${item.cafe_id}`
                            } else if (item.place_id) {
                              displayText = `플레이스 ID: ${item.place_id}`
                            } else if (item.account) {
                              displayText = `@${item.account}`
                            } else if (item.channel_id) {
                              displayText = `채널 ID: ${item.channel_id}`
                            } else if (item.page_id) {
                              displayText = `페이지 ID: ${item.page_id}`
                            } else if (item.title) {
                              displayText = item.title
                            }
                            
                            return (
                              <div key={idx} className="text-xs break-all">
                                {item.url ? (
                                  <a 
                                    href={item.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-300 hover:text-blue-200 underline"
                                  >
                                    {displayText || item.url}
                                  </a>
                                ) : (
                                  <span className="text-gray-300">{displayText}</span>
                                )}
                              </div>
                            )
                          })}
                          {detectedUrls.length > 3 && (
                            <div className="text-xs text-gray-500">
                              외 {detectedUrls.length - 3}개 더...
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* 미수집 시 안내 메시지 */}
                    {!hasData && note && (
                      <div className="pt-1">
                        <p className="text-xs text-gray-500 leading-relaxed">
                          {note}
                        </p>
                      </div>
                    )}
                    
                    {!hasData && !note && (
                      <div className="pt-1">
                        <p className="text-xs text-gray-500">
                          • API 연결 필요
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          • 채널 계정 정보 필요
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* 데이터 없음 안내 (설계 원칙: "데이터 없음" 표현 금지) */}
          {!hasAnyData && (
            <div className="mt-6 p-4 bg-yellow-500/20 border border-yellow-400/50 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-300 font-medium mb-1">
                    온라인 노출 부족 (검색 기반 추정 진단)
                  </p>
                  <p className="text-yellow-200 text-sm">
                    검색 기반 간접 분석을 통해 진단을 진행합니다. API 연동 시 더 정확한 분석이 가능합니다.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push('/company-search')}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
          >
            다시 검색
          </button>
          <button
            onClick={handleStartDiagnosis}
            disabled={startingDiagnosis}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {startingDiagnosis ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>진단 시작 중...</span>
              </>
            ) : (
              <>
                <span>진단 시작</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* 뒤로가기 */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            <span>홈으로 돌아가기</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
