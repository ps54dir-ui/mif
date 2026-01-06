'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, FileText, Users, Newspaper, Globe, AlertCircle, CheckCircle2, ShoppingBag, MoreHorizontal, Youtube, Instagram } from 'lucide-react'
import { AnalysisTypeBadge } from './AnalysisTypeBadge'

interface NaverSearchData {
  web: number
  blog: number
  cafearticle: number
  news: number
  shopping?: number  // 홈쇼핑
  other?: number     // 기타
  youtube?: number   // 유튜브
  sns?: number       // SNS (Instagram, Facebook 등)
  total_count: number
  status?: string
  analysis_type?: 'actual' | 'inference' | 'unavailable'
  analysis_type_label?: string
  analysis_type_description?: string
}

interface NaverSearchResultsProps {
  companyName: string
  collectionData?: NaverSearchData | null
}

interface ComprehensiveAnalysisData {
  analysis_period?: {
    start_date: string
    end_date: string
    total_items: number
    category_breakdown?: Record<string, number>
  }
  category_distribution?: Record<string, number>
  comprehensive_analysis?: {
    overall_insights?: string[]
    channel_performance?: {
      distribution?: Record<string, { count: number; percentage: number }>
      top_channel?: { name: string; count: number; percentage: number }
      coverage_score?: number
      active_channels?: number
      total_channels?: number
    }
    content_patterns?: {
      main_keywords?: Array<{ keyword: string; frequency: number; percentage: number }>
      title_trends?: { average_length: number; total_titles: number }
      description_quality?: { average_length: number; coverage: number; total_with_description: number }
    }
    recommendations?: string[]
  }
}

export function NaverSearchResults({ companyName, collectionData }: NaverSearchResultsProps) {
  const router = useRouter()
  const [searchData, setSearchData] = useState<NaverSearchData | null>(collectionData || null)
  const [loading, setLoading] = useState(!collectionData)
  const [comprehensiveAnalysis, setComprehensiveAnalysis] = useState<ComprehensiveAnalysisData | null>(null)
  const [loadingComprehensive, setLoadingComprehensive] = useState(false)

  useEffect(() => {
    console.log('[NaverSearchResults] 컴포넌트 마운트/업데이트:', { companyName, hasCollectionData: !!collectionData })
    
    if (collectionData) {
      setSearchData(collectionData)
      setLoading(false)
      return
    }

    // API에서 데이터 가져오기
    const fetchSearchData = async () => {
      try {
        console.log('[NaverSearchResults] 데이터 수집 시작:', companyName)
        const token = localStorage.getItem('access_token')
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        }
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }

        console.log('[NaverSearchResults] API 호출:', `${apiUrl}/api/mif/collect-data`)
        const response = await fetch(`${apiUrl}/api/mif/collect-data`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            company_name: companyName
          })
        })
        
        console.log('[NaverSearchResults] 응답 상태:', response.status, response.ok)

        if (response.ok) {
          const data = await response.json()
          console.log('[NaverSearchResults] API 응답:', data)
          
          const naverSearch = data.collected_data?.naver_search
          const channelStatus = data.channels?.naver_search
          const externalMentions = data.collected_data?.external_mentions
          const detectedChannels = data.collected_data?.detected_channels || {}
          
          console.log('[NaverSearchResults] detected_channels:', detectedChannels)
          console.log('[NaverSearchResults] youtube:', detectedChannels?.youtube)
          console.log('[NaverSearchResults] instagram:', detectedChannels?.instagram)
          console.log('[NaverSearchResults] facebook:', detectedChannels?.facebook)

          if (naverSearch || channelStatus) {
            // 홈쇼핑 및 기타 판매채널 개수 계산
            const salesChannels = externalMentions?.sales_channels || []
            let shoppingCount = 0
            let otherCount = 0
            
            salesChannels.forEach((channel: any) => {
              if (channel?.channel_type === 'homeshopping') {
                shoppingCount++
              } else if (channel?.channel_type === 'other_channels') {
                otherCount++
              }
            })

            // 유튜브, SNS 개수 계산
            const youtubeCount = detectedChannels?.youtube?.length || 0
            const instagramCount = detectedChannels?.instagram?.length || 0
            const facebookCount = detectedChannels?.facebook?.length || 0
            const snsCount = instagramCount + facebookCount
            
            console.log('[NaverSearchResults] 채널 개수:', { youtubeCount, instagramCount, facebookCount, snsCount })

            // 총 개수 재계산
            const baseCount = channelStatus?.count || naverSearch?.total_count || 0
            const totalCount = baseCount + shoppingCount + otherCount + youtubeCount + snsCount

            setSearchData({
              web: channelStatus?.details?.web || naverSearch?.web?.length || 0,
              blog: channelStatus?.details?.blog || naverSearch?.blog?.length || 0,
              cafearticle: channelStatus?.details?.cafearticle || naverSearch?.cafearticle?.length || 0,
              news: channelStatus?.details?.news || naverSearch?.news?.length || 0,
              shopping: shoppingCount,
              other: otherCount,
              youtube: youtubeCount,
              sns: snsCount,
              total_count: totalCount,
              status: channelStatus?.status || naverSearch?.status,
              analysis_type: channelStatus?.analysis_type,
              analysis_type_label: channelStatus?.analysis_type_label,
              analysis_type_description: channelStatus?.analysis_type_description
            })

            // 종합 분석 데이터 로드
            try {
              setLoadingComprehensive(true)
              const comprehensiveResponse = await fetch(`${apiUrl}/api/mif/analyze-naver-search-comprehensive`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                  company_name: companyName,
                  category: 'comprehensive'
                })
              })

              if (comprehensiveResponse.ok) {
                const comprehensiveResult = await comprehensiveResponse.json()
                setComprehensiveAnalysis(comprehensiveResult.analysis_result)
              }
            } catch (error) {
              console.error('종합 분석 데이터 로드 실패:', error)
            } finally {
              setLoadingComprehensive(false)
            }
          }
        }
      } catch (error) {
        console.error('네이버 검색 데이터 로드 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    if (companyName) {
      fetchSearchData()
    }
  }, [companyName, collectionData])

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">네이버 검색 데이터 로딩 중...</span>
        </div>
      </div>
    )
  }

  if (!searchData || searchData.total_count === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Search className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-bold text-gray-900">네이버 검색 결과</h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">네이버 검색 결과 데이터가 없습니다.</p>
            <p className="text-sm text-gray-500 mt-2">데이터 수집을 진행해주세요.</p>
          </div>
        </div>
      </div>
    )
  }

  const analysisType = searchData.analysis_type || (searchData.total_count > 0 ? 'inference' : 'unavailable')

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Search className="w-6 h-6 text-green-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">네이버 검색 결과</h2>
              <p className="text-sm text-gray-600 mt-0.5">최근 3개월 검색 기반 데이터</p>
            </div>
          </div>
          {analysisType && ['actual', 'inference', 'unavailable'].includes(analysisType) && (
            <AnalysisTypeBadge
              analysisType={analysisType}
              label={searchData.analysis_type_label}
              description={searchData.analysis_type_description}
              size="sm"
            />
          )}
        </div>
      </div>

      <div className="p-6">
        {/* 총 검색 결과 수 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">총 검색 결과</span>
            <span className="text-2xl font-bold text-green-600">
              {searchData.total_count.toLocaleString()}개
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all"
              style={{ width: `${Math.min((searchData.total_count / 1000) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* 검색 유형별 통계 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* 웹 검색 결과 */}
          <div 
            className="bg-blue-50 rounded-lg border-2 border-blue-200 p-4 cursor-pointer hover:bg-blue-100 transition-colors"
            onClick={() => router.push(`/dashboard/naver-search-detail?company=${encodeURIComponent(companyName)}&category=web`)}
          >
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-gray-700">웹</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {searchData.web.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 mt-1">검색 결과</div>
          </div>

          {/* 블로그 검색 결과 */}
          <div 
            className="bg-purple-50 rounded-lg border-2 border-purple-200 p-4 cursor-pointer hover:bg-purple-100 transition-colors"
            onClick={() => router.push(`/dashboard/naver-search-detail?company=${encodeURIComponent(companyName)}&category=blog`)}
          >
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-semibold text-gray-700">블로그 글</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {searchData.blog.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 mt-1">검색 결과</div>
          </div>

          {/* 카페 검색 결과 */}
          <div 
            className="bg-orange-50 rounded-lg border-2 border-orange-200 p-4 cursor-pointer hover:bg-orange-100 transition-colors"
            onClick={() => router.push(`/dashboard/naver-search-detail?company=${encodeURIComponent(companyName)}&category=cafe`)}
          >
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-semibold text-gray-700">카페 글</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {searchData.cafearticle.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 mt-1">검색 결과</div>
          </div>

          {/* 뉴스 검색 결과 */}
          <div 
            className="bg-red-50 rounded-lg border-2 border-red-200 p-4 cursor-pointer hover:bg-red-100 transition-colors"
            onClick={() => router.push(`/dashboard/naver-search-detail?company=${encodeURIComponent(companyName)}&category=news`)}
          >
            <div className="flex items-center gap-2 mb-2">
              <Newspaper className="w-5 h-5 text-red-600" />
              <span className="text-sm font-semibold text-gray-700">뉴스</span>
            </div>
            <div className="text-2xl font-bold text-red-600">
              {searchData.news.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 mt-1">검색 결과</div>
          </div>

          {/* 유튜브 검색 결과 */}
          <div 
            className="bg-red-600/10 rounded-lg border-2 border-red-600/30 p-4 cursor-pointer hover:bg-red-600/20 transition-colors"
            onClick={() => router.push(`/dashboard/naver-search-detail?company=${encodeURIComponent(companyName)}&category=youtube`)}
          >
            <div className="flex items-center gap-2 mb-2">
              <Youtube className="w-5 h-5 text-red-600" />
              <span className="text-sm font-semibold text-gray-700">유튜브</span>
            </div>
            <div className="text-2xl font-bold text-red-600">
              {(searchData.youtube || 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 mt-1">검색 결과</div>
          </div>

          {/* SNS 검색 결과 */}
          <div 
            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200 p-4 cursor-pointer hover:from-purple-100 hover:to-pink-100 transition-colors"
            onClick={() => router.push(`/dashboard/naver-search-detail?company=${encodeURIComponent(companyName)}&category=sns`)}
          >
            <div className="flex items-center gap-2 mb-2">
              <Instagram className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-semibold text-gray-700">SNS</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {(searchData.sns || 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 mt-1">검색 결과</div>
          </div>

          {/* 홈쇼핑 검색 결과 */}
          <div 
            className="bg-pink-50 rounded-lg border-2 border-pink-200 p-4 cursor-pointer hover:bg-pink-100 transition-colors"
            onClick={() => router.push(`/dashboard/naver-search-detail?company=${encodeURIComponent(companyName)}&category=shopping`)}
          >
            <div className="flex items-center gap-2 mb-2">
              <ShoppingBag className="w-5 h-5 text-pink-600" />
              <span className="text-sm font-semibold text-gray-700">홈쇼핑</span>
            </div>
            <div className="text-2xl font-bold text-pink-600">
              {(searchData.shopping || 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 mt-1">검색 결과</div>
          </div>

          {/* 기타 검색 결과 */}
          <div 
            className="bg-gray-50 rounded-lg border-2 border-gray-200 p-4 cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => router.push(`/dashboard/naver-search-detail?company=${encodeURIComponent(companyName)}&category=other`)}
          >
            <div className="flex items-center gap-2 mb-2">
              <MoreHorizontal className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-semibold text-gray-700">기타</span>
            </div>
            <div className="text-2xl font-bold text-gray-600">
              {(searchData.other || 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 mt-1">검색 결과</div>
          </div>
        </div>

        {/* 분석 타입 설명 */}
        {searchData.analysis_type_description && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">분석 정보</p>
                <p className="text-sm text-gray-600">{searchData.analysis_type_description}</p>
              </div>
            </div>
          </div>
        )}

        {/* 종합 진단 및 분석 */}
        <div className="mt-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl shadow-lg border-2 border-indigo-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Search className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">종합 진단 및 분석</h2>
          </div>

          {loadingComprehensive ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">종합 분석 중...</p>
            </div>
          ) : comprehensiveAnalysis ? (
            <div className="space-y-4">
              {/* 전체 인사이트 */}
              {comprehensiveAnalysis.comprehensive_analysis?.overall_insights && comprehensiveAnalysis.comprehensive_analysis.overall_insights.length > 0 && (
                <div className="bg-white rounded-lg border border-indigo-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">전체 인사이트</h3>
                  <ul className="space-y-2">
                    {comprehensiveAnalysis.comprehensive_analysis.overall_insights.map((insight, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-indigo-600 mt-1">•</span>
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 채널별 성과 */}
              {comprehensiveAnalysis.comprehensive_analysis?.channel_performance && (
                <div className="bg-white rounded-lg border border-indigo-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">채널별 성과</h3>
                  {comprehensiveAnalysis.comprehensive_analysis.channel_performance.top_channel && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-2">
                        최다 검색 결과: <span className="font-semibold text-indigo-600">{comprehensiveAnalysis.comprehensive_analysis.channel_performance.top_channel.name}</span> ({comprehensiveAnalysis.comprehensive_analysis.channel_performance.top_channel.count}개, {comprehensiveAnalysis.comprehensive_analysis.channel_performance.top_channel.percentage}%)
                      </p>
                    </div>
                  )}
                  {comprehensiveAnalysis.comprehensive_analysis.channel_performance.coverage_score !== undefined && (
                    <div className="mb-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">채널 커버리지</span>
                        <span className="text-sm font-semibold text-indigo-600">{comprehensiveAnalysis.comprehensive_analysis.channel_performance.coverage_score}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-500 h-2 rounded-full transition-all"
                          style={{ width: `${comprehensiveAnalysis.comprehensive_analysis.channel_performance.coverage_score}%` }}
                        ></div>
                      </div>
                      {comprehensiveAnalysis.comprehensive_analysis.channel_performance.active_channels !== undefined && (
                        <p className="text-xs text-gray-500 mt-1">
                          활성 채널: {comprehensiveAnalysis.comprehensive_analysis.channel_performance.active_channels}/{comprehensiveAnalysis.comprehensive_analysis.channel_performance.total_channels || 4}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* 추천 사항 */}
              {comprehensiveAnalysis.comprehensive_analysis?.recommendations && comprehensiveAnalysis.comprehensive_analysis.recommendations.length > 0 && (
                <div className="bg-white rounded-lg border border-indigo-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">추천 사항</h3>
                  <ul className="space-y-2">
                    {comprehensiveAnalysis.comprehensive_analysis.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-blue-600 mt-1">✓</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">종합 분석 데이터를 불러올 수 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}