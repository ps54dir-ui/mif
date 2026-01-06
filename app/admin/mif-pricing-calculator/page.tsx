'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAdmin, isAuthenticated } from '@/lib/auth/auth'

// MIF 분석 카테고리
const analysisCategories = [
  { id: 'search', label: '검색 데이터 분석' },
  { id: 'youtube', label: '유튜브 분석' },
  { id: 'sns', label: 'SNS 분석' },
  { id: 'blog', label: '블로그 분석' },
  { id: 'community', label: '카페/커뮤니티 분석' },
  { id: 'commerce', label: '자사몰/스토어/쿠팡 분석' },
  { id: 'homepage', label: '홈페이지 분석' },
  { id: 'reviews', label: '리뷰/평판 분석' },
  { id: 'place', label: '네이버 플레이스 분석' },
  { id: 'ads_policy', label: '광고·정책·리스크 분석' },
  { id: 'strategy', label: '전략 수립' },
  { id: 'report', label: '리포트/컴플라이언스' },
  { id: 'market_protect', label: '시장 보호 진단' }
]

// 토큰 기준 테이블
const TOKEN_TABLE: Record<string, number> = {
  search: 1500,
  youtube_long: 600,
  youtube_short: 300,
  sns_post: 250,
  blog_post: 800,
  community_post: 500,
  product_page: 700,
  homepage_page: 600,
  reviews_bundle: 1200,
  place: 1000,
  ads_policy: 1000,
  strategy: 2000,
  report: 1000,
  market_protect: 800
}

// 분석 깊이 계수
const LEVEL_MULTIPLIER: Record<string, number> = {
  lite: 0.7,
  standard: 1.0,
  premium: 1.5
}

// 비용 계산 설정
const AI_COST_PER_1K = 1000 // 내부 설정값 (원)
const SAFETY_FACTOR = 1.7
const MAX_MONTHLY_TOKENS = 1000000 // 월 토큰 상한

interface ContentInputs {
  youtube: {
    longform: number
    shortform: number
  }
  blog: {
    official: number
    experience: number
    general: number
  }
  sns: {
    instagram: number
    facebook: number
    tiktok: number
    threads: number
  }
  commerce: {
    ownMall: number
    smartstore: number
    coupang: number
  }
  homepage: {
    pages: number
  }
}

export default function MIFPricingCalculatorPage() {
  const router = useRouter()
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())
  const [contentInputs, setContentInputs] = useState<ContentInputs>({
    youtube: { longform: 0, shortform: 0 },
    blog: { official: 0, experience: 0, general: 0 },
    sns: { instagram: 0, facebook: 0, tiktok: 0, threads: 0 },
    commerce: { ownMall: 0, smartstore: 0, coupang: 0 },
    homepage: { pages: 0 }
  })
  const [analysisLevel, setAnalysisLevel] = useState<'lite' | 'standard' | 'premium'>('standard')
  const [monthlyRuns, setMonthlyRuns] = useState<1 | 2 | 4 | 8>(1)
  const [isMounted, setIsMounted] = useState(false)

  // 관리자 권한 체크
  useEffect(() => {
    if (typeof window === 'undefined') return
    setIsMounted(true)

    if (!isAuthenticated()) {
      router.push('/login')
      return
    }

    if (!isAdmin()) {
      alert('관리자 권한이 필요합니다.')
      router.push('/dashboard')
      return
    }
  }, [router])

  // 카테고리 선택 토글
  const toggleCategory = (categoryId: string) => {
    const newSelected = new Set(selectedCategories)
    if (newSelected.has(categoryId)) {
      newSelected.delete(categoryId)
    } else {
      newSelected.add(categoryId)
    }
    setSelectedCategories(newSelected)
  }

  // 콘텐츠 수 입력 핸들러
  const updateContentInput = (
    category: keyof ContentInputs,
    subKey: string,
    value: number
  ) => {
    setContentInputs(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subKey]: Math.max(0, value)
      }
    }))
  }

  // 토큰 계산
  const calculateTotalTokens = () => {
    let tokens = 0

    // 카테고리 기본 토큰
    selectedCategories.forEach(cat => {
      if (TOKEN_TABLE[cat]) {
        tokens += TOKEN_TABLE[cat]
      }
    })

    // 유튜브 (체크된 경우만)
    if (selectedCategories.has('youtube')) {
      tokens += contentInputs.youtube.longform * TOKEN_TABLE.youtube_long
      tokens += contentInputs.youtube.shortform * TOKEN_TABLE.youtube_short
    }

    // 블로그 (체크된 경우만)
    if (selectedCategories.has('blog')) {
      const totalBlogPosts =
        contentInputs.blog.official +
        contentInputs.blog.experience +
        contentInputs.blog.general
      tokens += totalBlogPosts * TOKEN_TABLE.blog_post
    }

    // 커뮤니티 (체크된 경우만)
    if (selectedCategories.has('community')) {
      // 커뮤니티는 별도 입력이 없으므로 카테고리 기본 토큰만 사용
      // 필요시 추가 입력 필드 구현 가능
    }

    // SNS (체크된 경우만)
    if (selectedCategories.has('sns')) {
      const totalSnsPosts =
        contentInputs.sns.instagram +
        contentInputs.sns.facebook +
        contentInputs.sns.tiktok +
        contentInputs.sns.threads
      tokens += totalSnsPosts * TOKEN_TABLE.sns_post
    }

    // 커머스 (체크된 경우만)
    if (selectedCategories.has('commerce')) {
      const totalCommercePages =
        contentInputs.commerce.ownMall +
        contentInputs.commerce.smartstore +
        contentInputs.commerce.coupang
      tokens += totalCommercePages * TOKEN_TABLE.product_page
    }

    // 홈페이지 (체크된 경우만)
    if (selectedCategories.has('homepage')) {
      tokens += contentInputs.homepage.pages * TOKEN_TABLE.homepage_page
    }

    // 분석 깊이 적용
    tokens *= LEVEL_MULTIPLIER[analysisLevel]

    // 1회 토큰 (분석 깊이 적용 후)
    const tokensPerRun = Math.round(tokens)

    // 월 사용 횟수 적용
    const monthlyTokens = tokensPerRun * monthlyRuns

    return {
      tokensPerRun,
      monthlyTokens
    }
  }

  // 비용 산출
  const calculateCost = (totalTokens: number) => {
    const aiCost = (totalTokens / 1000) * AI_COST_PER_1K * SAFETY_FACTOR

    return {
      aiCost: Math.round(aiCost),
      price_min: Math.round(aiCost * 4),
      price_standard: Math.round(aiCost * 5),
      price_premium: Math.round(aiCost * 6)
    }
  }

  // 계산 결과
  const calculationResult = useMemo(() => {
    if (selectedCategories.size === 0) {
      return null
    }

    const { tokensPerRun, monthlyTokens } = calculateTotalTokens()
    const cost = calculateCost(monthlyTokens)

    // 분석 콘텐츠 수 계산
    let totalContentCount = 0
    if (selectedCategories.has('youtube')) {
      totalContentCount += contentInputs.youtube.longform + contentInputs.youtube.shortform
    }
    if (selectedCategories.has('blog')) {
      totalContentCount +=
        contentInputs.blog.official +
        contentInputs.blog.experience +
        contentInputs.blog.general
    }
    if (selectedCategories.has('sns')) {
      totalContentCount +=
        contentInputs.sns.instagram +
        contentInputs.sns.facebook +
        contentInputs.sns.tiktok +
        contentInputs.sns.threads
    }
    if (selectedCategories.has('commerce')) {
      totalContentCount +=
        contentInputs.commerce.ownMall +
        contentInputs.commerce.smartstore +
        contentInputs.commerce.coupang
    }
    if (selectedCategories.has('homepage')) {
      totalContentCount += contentInputs.homepage.pages
    }

    return {
      tokensPerRun,
      monthlyTokens,
      totalContentCount,
      cost,
      exceedsLimit: monthlyTokens > MAX_MONTHLY_TOKENS
    }
  }, [selectedCategories, contentInputs, analysisLevel, monthlyRuns])

  // 숫자 포맷팅 (천 단위 쉼표)
  const formatNumber = (num: number) => {
    return num.toLocaleString('ko-KR')
  }

  // 통화 포맷팅
  const formatCurrency = (num: number) => {
    return `₩${formatNumber(num)}`
  }

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">정밀진단 비용 산출기</h1>
          <p className="mt-2 text-sm text-gray-600">
            관리자 전용 - MIF 분석 카테고리와 콘텐츠 수를 기준으로 AI 토큰 예상량과 비용을 계산합니다.
          </p>
          <p className="mt-1 text-xs text-red-600">
            ⚠️ 토큰 수는 내부 원가 관리용이며 고객에게는 노출하지 않습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 입력 패널 */}
          <div className="lg:col-span-2 space-y-6">
            {/* [A] MIF 분석 카테고리 선택 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                분석 카테고리 선택
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {analysisCategories.map(category => (
                  <label
                    key={category.id}
                    className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.has(category.id)}
                      onChange={() => toggleCategory(category.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{category.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* [B] 채널별 콘텐츠 수 입력 */}
            <div className="bg-white rounded-lg shadow p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                채널별 콘텐츠 수 입력
              </h2>

              {/* 유튜브 */}
              {selectedCategories.has('youtube') && (
                <div className="border-b pb-4">
                  <h3 className="text-md font-medium text-gray-800 mb-3">유튜브</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">롱폼 영상</label>
                      <input
                        type="number"
                        min="0"
                        value={contentInputs.youtube.longform}
                        onChange={e =>
                          updateContentInput('youtube', 'longform', parseInt(e.target.value) || 0)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">숏폼 영상</label>
                      <input
                        type="number"
                        min="0"
                        value={contentInputs.youtube.shortform}
                        onChange={e =>
                          updateContentInput('youtube', 'shortform', parseInt(e.target.value) || 0)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 블로그 */}
              {selectedCategories.has('blog') && (
                <div className="border-b pb-4">
                  <h3 className="text-md font-medium text-gray-800 mb-3">블로그</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">공식 블로그</label>
                      <input
                        type="number"
                        min="0"
                        value={contentInputs.blog.official}
                        onChange={e =>
                          updateContentInput('blog', 'official', parseInt(e.target.value) || 0)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">체험단 콘텐츠</label>
                      <input
                        type="number"
                        min="0"
                        value={contentInputs.blog.experience}
                        onChange={e =>
                          updateContentInput('blog', 'experience', parseInt(e.target.value) || 0)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">일반 블로그</label>
                      <input
                        type="number"
                        min="0"
                        value={contentInputs.blog.general}
                        onChange={e =>
                          updateContentInput('blog', 'general', parseInt(e.target.value) || 0)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SNS */}
              {selectedCategories.has('sns') && (
                <div className="border-b pb-4">
                  <h3 className="text-md font-medium text-gray-800 mb-3">SNS</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Instagram</label>
                      <input
                        type="number"
                        min="0"
                        value={contentInputs.sns.instagram}
                        onChange={e =>
                          updateContentInput('sns', 'instagram', parseInt(e.target.value) || 0)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Facebook</label>
                      <input
                        type="number"
                        min="0"
                        value={contentInputs.sns.facebook}
                        onChange={e =>
                          updateContentInput('sns', 'facebook', parseInt(e.target.value) || 0)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">TikTok</label>
                      <input
                        type="number"
                        min="0"
                        value={contentInputs.sns.tiktok}
                        onChange={e =>
                          updateContentInput('sns', 'tiktok', parseInt(e.target.value) || 0)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Threads</label>
                      <input
                        type="number"
                        min="0"
                        value={contentInputs.sns.threads}
                        onChange={e =>
                          updateContentInput('sns', 'threads', parseInt(e.target.value) || 0)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 커머스 */}
              {selectedCategories.has('commerce') && (
                <div className="border-b pb-4">
                  <h3 className="text-md font-medium text-gray-800 mb-3">커머스</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">자사몰</label>
                      <input
                        type="number"
                        min="0"
                        value={contentInputs.commerce.ownMall}
                        onChange={e =>
                          updateContentInput('commerce', 'ownMall', parseInt(e.target.value) || 0)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">스마트스토어</label>
                      <input
                        type="number"
                        min="0"
                        value={contentInputs.commerce.smartstore}
                        onChange={e =>
                          updateContentInput(
                            'commerce',
                            'smartstore',
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">쿠팡</label>
                      <input
                        type="number"
                        min="0"
                        value={contentInputs.commerce.coupang}
                        onChange={e =>
                          updateContentInput('commerce', 'coupang', parseInt(e.target.value) || 0)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 홈페이지 */}
              {selectedCategories.has('homepage') && (
                <div>
                  <h3 className="text-md font-medium text-gray-800 mb-3">홈페이지</h3>
                  <div className="max-w-xs">
                    <label className="block text-sm text-gray-600 mb-1">페이지 수</label>
                    <input
                      type="number"
                      min="0"
                      value={contentInputs.homepage.pages}
                      onChange={e =>
                        updateContentInput('homepage', 'pages', parseInt(e.target.value) || 0)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* [C] 분석 깊이 선택 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">분석 깊이</h2>
              <div className="flex gap-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="analysisLevel"
                    value="lite"
                    checked={analysisLevel === 'lite'}
                    onChange={e => setAnalysisLevel(e.target.value as 'lite')}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Lite (0.7x)</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="analysisLevel"
                    value="standard"
                    checked={analysisLevel === 'standard'}
                    onChange={e => setAnalysisLevel(e.target.value as 'standard')}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Standard (1.0x)</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="analysisLevel"
                    value="premium"
                    checked={analysisLevel === 'premium'}
                    onChange={e => setAnalysisLevel(e.target.value as 'premium')}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Premium (1.5x)</span>
                </label>
              </div>
            </div>

            {/* [D] 월 사용 횟수 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">월 사용 횟수</h2>
              <div className="flex gap-4">
                {[1, 2, 4, 8].map(runs => (
                  <label key={runs} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="monthlyRuns"
                      value={runs}
                      checked={monthlyRuns === runs}
                      onChange={e => setMonthlyRuns(parseInt(e.target.value) as 1 | 2 | 4 | 8)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{runs}회</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* 계산 결과 패널 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">계산 결과</h2>

              {!calculationResult ? (
                <div className="text-sm text-gray-500 text-center py-8">
                  분석 카테고리를 선택하세요
                </div>
              ) : (
                <div className="space-y-6">
                  {/* 계산 결과 */}
                  <div>
                    <h3 className="text-md font-medium text-gray-800 mb-3">토큰 정보</h3>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-gray-600">선택된 카테고리</dt>
                        <dd className="font-medium text-gray-900">
                          {selectedCategories.size}개
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">분석 콘텐츠 수</dt>
                        <dd className="font-medium text-gray-900">
                          {formatNumber(calculationResult.totalContentCount)}개
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">1회 예상 토큰</dt>
                        <dd className="font-medium text-gray-900">
                          {formatNumber(calculationResult.tokensPerRun)}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">월 사용 횟수</dt>
                        <dd className="font-medium text-gray-900">{monthlyRuns}회</dd>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <dt className="text-gray-900 font-medium">월 총 토큰</dt>
                        <dd
                          className={`font-bold ${
                            calculationResult.exceedsLimit ? 'text-red-600' : 'text-gray-900'
                          }`}
                        >
                          {formatNumber(calculationResult.monthlyTokens)}
                        </dd>
                      </div>
                    </dl>

                    {calculationResult.exceedsLimit && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-800 font-medium">
                          ⚠️ 월 토큰 상한 초과 (최대: {formatNumber(MAX_MONTHLY_TOKENS)})
                        </p>
                        <p className="text-xs text-red-600 mt-1">
                          실행이 차단됩니다. 콘텐츠 수 또는 월 사용 횟수를 줄이세요.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 비용 요약 */}
                  <div>
                    <h3 className="text-md font-medium text-gray-800 mb-3">비용 요약</h3>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between border-b pb-2">
                        <dt className="text-gray-600">내부 AI 원가</dt>
                        <dd className="font-medium text-gray-900">
                          {formatCurrency(calculationResult.cost.aiCost)}
                        </dd>
                      </div>
                      <div className="pt-2">
                        <dt className="text-gray-600 mb-2">권장 판매가</dt>
                        <dl className="space-y-1 pl-2">
                          <div className="flex justify-between">
                            <dt className="text-gray-500 text-xs">최소</dt>
                            <dd className="font-medium text-gray-900">
                              {formatCurrency(calculationResult.cost.price_min)}
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-500 text-xs">표준</dt>
                            <dd className="font-medium text-blue-600">
                              {formatCurrency(calculationResult.cost.price_standard)}
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-500 text-xs">프리미엄</dt>
                            <dd className="font-medium text-gray-900">
                              {formatCurrency(calculationResult.cost.price_premium)}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </dl>
                  </div>

                  {/* 분석 깊이 정보 */}
                  <div className="pt-4 border-t">
                    <div className="text-xs text-gray-500 space-y-1">
                      <div className="flex justify-between">
                        <span>분석 깊이:</span>
                        <span className="font-medium text-gray-700">
                          {analysisLevel.toUpperCase()} (
                          {LEVEL_MULTIPLIER[analysisLevel]}x)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
