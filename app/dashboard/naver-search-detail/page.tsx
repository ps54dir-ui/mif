'use client'

export const dynamic = 'force-dynamic'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Loader2, FileText, Users, Newspaper, Globe, Youtube, Instagram, ShoppingBag, MoreHorizontal } from 'lucide-react'
import { AnalysisTypeBadge } from '@/components/dashboard/AnalysisTypeBadge'

interface SearchItem {
  title: string
  description: string
  link: string
  pub_date?: string
  [key: string]: any
}

interface ChannelItem {
  url: string
  title?: string
  account?: string
  channel_id?: string
  channel_name?: string
  page_id?: string
  page_name?: string
  [key: string]: any
}

// HTML 태그 제거 함수
const cleanHtml = (text: string | undefined): string => {
  if (!text) return ''
  // HTML 태그 제거
  return text
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/<b>/g, '')
    .replace(/<\/b>/g, '')
    .trim()
}

export default function NaverSearchDetailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const companyName = searchParams.get('company') || ''
  const category = searchParams.get('category') || ''

  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<SearchItem[] | ChannelItem[]>([])
  const [analysisData, setAnalysisData] = useState<any>(null)
  const [categoryLabel, setCategoryLabel] = useState('')

  useEffect(() => {
    if (companyName && category) {
      loadData()
      setCategoryLabel(getCategoryLabel(category))
    }
  }, [companyName, category])

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      web: '웹',
      blog: '블로그 글',
      cafe: '카페 글',
      news: '뉴스',
      youtube: '유튜브',
      sns: 'SNS',
      shopping: '홈쇼핑',
      other: '기타'
    }
    return labels[cat] || cat
  }

  const loadData = async () => {
    try {
      setLoading(true)
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

      if (response.ok) {
        const data = await response.json()
        const naverSearch = data.collected_data?.naver_search
        const detectedChannels = data.collected_data?.detected_channels || {}
        const externalMentions = data.collected_data?.external_mentions || {}

        let categoryItems: any[] = []

        switch (category) {
          case 'web':
            categoryItems = naverSearch?.web || []
            break
          case 'blog':
            categoryItems = naverSearch?.blog || []
            break
          case 'cafe':
            categoryItems = naverSearch?.cafearticle || []
            break
          case 'news':
            categoryItems = naverSearch?.news || []
            break
          case 'youtube':
            categoryItems = detectedChannels?.youtube || []
            break
          case 'sns':
            categoryItems = [
              ...(detectedChannels?.instagram || []),
              ...(detectedChannels?.facebook || [])
            ]
            break
          case 'shopping':
            categoryItems = (externalMentions?.sales_channels || []).filter(
              (ch: any) => ch?.channel_type === 'homeshopping'
            )
            break
          case 'other':
            categoryItems = (externalMentions?.sales_channels || []).filter(
              (ch: any) => ch?.channel_type === 'other_channels'
            )
            break
        }

        setItems(categoryItems)

        // 패턴 분석 데이터 로드 (일반 분석 모델)
        try {
          const analysisResponse = await fetch(`${apiUrl}/api/mif/analyze-naver-search`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              company_name: companyName,
              category: category === 'cafe' ? 'cafe' : category
            })
          })

          if (analysisResponse.ok) {
            const analysisResult = await analysisResponse.json()
            setAnalysisData(analysisResult.analysis_result)
          }
        } catch (error) {
          console.error('분석 데이터 로드 실패:', error)
        }
      }
    } catch (error) {
      console.error('데이터 로드 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryIcon = () => {
    switch (category) {
      case 'web':
        return <Globe className="w-6 h-6 text-blue-600" />
      case 'blog':
        return <FileText className="w-6 h-6 text-purple-600" />
      case 'cafe':
        return <Users className="w-6 h-6 text-orange-600" />
      case 'news':
        return <Newspaper className="w-6 h-6 text-red-600" />
      case 'youtube':
        return <Youtube className="w-6 h-6 text-red-600" />
      case 'sns':
        return <Instagram className="w-6 h-6 text-purple-600" />
      case 'shopping':
        return <ShoppingBag className="w-6 h-6 text-pink-600" />
      case 'other':
        return <MoreHorizontal className="w-6 h-6 text-gray-600" />
      default:
        return <FileText className="w-6 h-6 text-gray-600" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>돌아가기</span>
          </button>
          <div className="flex items-center gap-3">
            {getCategoryIcon()}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {categoryLabel} 검색 결과
              </h1>
              <p className="text-gray-600 mt-1">{companyName}</p>
            </div>
          </div>
        </div>

        {/* 수집된 내용 */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            수집된 내용 ({items.length}개)
          </h2>
          <div className="space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">수집된 데이터가 없습니다.</p>
              </div>
            ) : (
              items.map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {cleanHtml((item as SearchItem).title || (item as ChannelItem).title) || '제목 없음'}
                      </h3>
                      {(item as SearchItem).description && (
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {cleanHtml((item as SearchItem).description)}
                        </p>
                      )}
                      {(item as ChannelItem).account && (
                        <p className="text-gray-600 text-sm mb-2">
                          계정: @{(item as ChannelItem).account}
                        </p>
                      )}
                      {(item as ChannelItem).channel_name && (
                        <p className="text-gray-600 text-sm mb-2">
                          채널: {(item as ChannelItem).channel_name}
                        </p>
                      )}
                      {(item as SearchItem).pub_date && (
                        <p className="text-xs text-gray-500">
                          발행일: {(item as SearchItem).pub_date}
                        </p>
                      )}
                    </div>
                    {(item as SearchItem).link || (item as ChannelItem).url ? (
                      <a
                        href={(item as SearchItem).link || (item as ChannelItem).url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium whitespace-nowrap"
                      >
                        링크 보기 →
                      </a>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 진단 및 분석 결과 */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            진단 및 분석 결과
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            최근 3개월 검색 결과 기반 패턴 분석 (대표 샘플링)
          </p>
          
          {analysisData ? (
            <div className="space-y-6">
              {/* 분석 기간 */}
              <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-2">분석 기간</h3>
                <p className="text-sm text-gray-600">
                  {analysisData.analysis_period?.start_date && analysisData.analysis_period?.end_date ? (
                    <>
                      {new Date(analysisData.analysis_period.start_date).toLocaleDateString('ko-KR')} ~{' '}
                      {new Date(analysisData.analysis_period.end_date).toLocaleDateString('ko-KR')}
                    </>
                  ) : (
                    '최근 3개월'
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  전체 {analysisData.analysis_period?.total_items || 0}개 중{' '}
                  {analysisData.analysis_period?.sampled_count || 0}개 샘플링 분석
                </p>
              </div>

              {/* 패턴 분석 결과 */}
              {analysisData.pattern_analysis && (
                <div className="space-y-4">
                  {/* 콘텐츠 주제 */}
                  {analysisData.pattern_analysis.content_themes && analysisData.pattern_analysis.content_themes.length > 0 && (
                    <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">주요 콘텐츠 주제</h3>
                      <div className="flex flex-wrap gap-2">
                        {analysisData.pattern_analysis.content_themes.map((theme: any, idx: number) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                          >
                            {cleanHtml(theme.keyword)} ({theme.percentage}%)
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 메시지 명확성 */}
                  {analysisData.pattern_analysis.message_clarity && (
                    <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">메시지 명확성</h3>
                      <div className="flex items-center gap-4">
                        <div className="text-3xl font-bold text-green-600">
                          {analysisData.pattern_analysis.message_clarity.score}점
                        </div>
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div
                              className={`h-2 rounded-full ${
                                analysisData.pattern_analysis.message_clarity.score >= 70 ? 'bg-green-500' :
                                analysisData.pattern_analysis.message_clarity.score >= 50 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${analysisData.pattern_analysis.message_clarity.score}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-600">
                            {analysisData.pattern_analysis.message_clarity.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 전략적 인사이트 */}
                  {analysisData.pattern_analysis.strategic_insights && analysisData.pattern_analysis.strategic_insights.length > 0 && (
                    <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">전략적 인사이트</h3>
                      <ul className="space-y-2">
                        {analysisData.pattern_analysis.strategic_insights.map((insight: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="text-yellow-600 mt-1">•</span>
                            <span>{cleanHtml(insight)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {!analysisData.pattern_analysis && (
                <div className="text-center py-8">
                  <p className="text-gray-500">분석 결과가 없습니다.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                진단 및 분석 결과를 불러오는 중...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}