'use client'

import { useState } from 'react'
import { Search, ExternalLink, Globe, MapPin } from 'lucide-react'

interface OfficialChannelItem {
  channel_type: string
  channel_name?: string | null
  url: string
  region: string
  official_score: number
  title?: string | null
  description?: string | null
}

interface OfficialChannelsResponse {
  company_name: string
  total_count: number
  domestic_count: number
  global_count: number
  channels: OfficialChannelItem[]
  summary: Record<string, {
    domestic: number
    global: number
    total: number
  }>
  ai_response?: string | null
  prompt_used?: string | null
}

const CHANNEL_TYPE_LABELS: Record<string, string> = {
  homepage: '홈페이지',
  newsroom: '뉴스룸/블로그',
  youtube: '유튜브',
  instagram: '인스타그램',
  facebook: '페이스북',
  twitter: 'X(트위터)',
  tiktok: '틱톡',
  linkedin: '링크드인',
  smartstore: '자사 스마트스토어',
  coupang: '자사 쿠팡',
  developer_blog: '개발자/기술 블로그',
}

const REGION_LABELS: Record<string, string> = {
  domestic: '국내',
  global: '글로벌',
}

export default function OfficialChannelsPage() {
  const [companyName, setCompanyName] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<OfficialChannelsResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!companyName.trim()) {
      setError('회사명을 입력해주세요.')
      return
    }

    setLoading(true)
    setError(null)
    setData(null)

    try {
      // 프롬프트인지 직접 회사명인지 판단
      const isPrompt = companyName.trim().length > 20 || companyName.includes('정리') || companyName.includes('채널')
      
      const requestBody = isPrompt 
        ? { prompt: companyName.trim() }
        : { company_name: companyName.trim() }
      
      const response = await fetch('http://localhost:8000/api/mif/official-channels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || '공식 채널 조회에 실패했습니다.')
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : '공식 채널 조회 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const groupChannelsByType = (channels: OfficialChannelItem[]) => {
    const grouped: Record<string, { domestic: OfficialChannelItem[], global: OfficialChannelItem[] }> = {}
    
    channels.forEach(channel => {
      if (!grouped[channel.channel_type]) {
        grouped[channel.channel_type] = { domestic: [], global: [] }
      }
      if (channel.region === 'domestic') {
        grouped[channel.channel_type].domestic.push(channel)
      } else {
        grouped[channel.channel_type].global.push(channel)
      }
    })
    
    return grouped
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">공식 채널 정리</h1>
          <p className="text-gray-300">회사명을 입력하면 모든 공식 채널을 국내/글로벌 구분하여 정리해드립니다.</p>
        </div>

        {/* 검색 영역 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8 border border-white/20">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              회사명 또는 프롬프트 입력
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder='예: "삼성전자" 또는 "삼성전자와 관련된 모든 공식 채널을 정리해줘"'
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <p className="text-xs text-gray-400 mt-2">
              💡 AI가 프롬프트를 분석하여 회사명을 추출하고 공식 채널을 정리합니다.
            </p>
          </div>
          <button
            onClick={handleSearch}
            disabled={loading || !companyName.trim()}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            {loading ? 'AI 분석 중...' : 'AI로 공식 채널 정리'}
          </button>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-8 text-red-200">
            {error}
          </div>
        )}

        {/* 결과 영역 */}
        {data && (
          <div className="space-y-8">
            {/* AI 응답 영역 */}
            {data.ai_response && (
              <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-lg rounded-xl p-6 border border-blue-500/30">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <h3 className="text-lg font-semibold text-blue-300">AI 분석 결과</h3>
                </div>
                <div 
                  className="prose prose-invert max-w-none text-gray-200"
                  dangerouslySetInnerHTML={{ 
                    __html: data.ai_response
                      .replace(/\n/g, '<br />')
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/`(.*?)`/g, '<code class="bg-white/10 px-1 rounded">$1</code>')
                  }}
                />
                {data.prompt_used && (
                  <div className="mt-4 pt-4 border-t border-white/10 text-sm text-gray-400">
                    사용된 프롬프트: &quot;{data.prompt_used}&quot;
                  </div>
                )}
              </div>
            )}

            {/* 요약 정보 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">{data.company_name} 공식 채널</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">전체 채널</div>
                  <div className="text-3xl font-bold text-white">{data.total_count}개</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    국내 채널
                  </div>
                  <div className="text-3xl font-bold text-blue-400">{data.domestic_count}개</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    글로벌 채널
                  </div>
                  <div className="text-3xl font-bold text-green-400">{data.global_count}개</div>
                </div>
              </div>
            </div>

            {/* 채널 타입별 정리 */}
            {Object.entries(groupChannelsByType(data.channels)).map(([channelType, channels]) => (
              <div key={channelType} className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
                <div className="bg-white/5 px-6 py-4 border-b border-white/10">
                  <h3 className="text-xl font-bold text-white">
                    {CHANNEL_TYPE_LABELS[channelType] || channelType}
                  </h3>
                </div>
                
                <div className="p-6">
                  {/* 국내 채널 */}
                  {channels.domestic.length > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-4 h-4 text-blue-400" />
                        <h4 className="text-lg font-semibold text-blue-400">국내 ({channels.domestic.length}개)</h4>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-white/10">
                              <th className="text-left py-3 px-4 text-gray-300 font-medium">채널명/제목</th>
                              <th className="text-left py-3 px-4 text-gray-300 font-medium">URL</th>
                              <th className="text-center py-3 px-4 text-gray-300 font-medium">공식 점수</th>
                            </tr>
                          </thead>
                          <tbody>
                            {channels.domestic.map((channel, idx) => (
                              <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="py-3 px-4 text-white">
                                  {channel.channel_name || channel.title || '-'}
                                </td>
                                <td className="py-3 px-4">
                                  <a
                                    href={channel.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
                                  >
                                    <span className="truncate max-w-md">{channel.url}</span>
                                    <ExternalLink className="w-4 h-4 flex-shrink-0" />
                                  </a>
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">
                                    {channel.official_score}점
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* 글로벌 채널 */}
                  {channels.global.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Globe className="w-4 h-4 text-green-400" />
                        <h4 className="text-lg font-semibold text-green-400">글로벌 ({channels.global.length}개)</h4>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-white/10">
                              <th className="text-left py-3 px-4 text-gray-300 font-medium">채널명/제목</th>
                              <th className="text-left py-3 px-4 text-gray-300 font-medium">URL</th>
                              <th className="text-center py-3 px-4 text-gray-300 font-medium">공식 점수</th>
                            </tr>
                          </thead>
                          <tbody>
                            {channels.global.map((channel, idx) => (
                              <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="py-3 px-4 text-white">
                                  {channel.channel_name || channel.title || '-'}
                                </td>
                                <td className="py-3 px-4">
                                  <a
                                    href={channel.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-400 hover:text-green-300 flex items-center gap-2"
                                  >
                                    <span className="truncate max-w-md">{channel.url}</span>
                                    <ExternalLink className="w-4 h-4 flex-shrink-0" />
                                  </a>
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <span className="inline-block px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-medium">
                                    {channel.official_score}점
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* 채널이 없는 경우 */}
            {data.total_count === 0 && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 text-center">
                <p className="text-gray-300 text-lg">공식 채널을 찾을 수 없습니다.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
