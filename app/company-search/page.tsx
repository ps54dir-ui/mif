'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, ArrowRight, AlertCircle, Plus, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface CompanyMatch {
  id?: string | null
  company_name: string
  manager_name?: string | null
  company_url?: string | null
  email?: string | null
  phone?: string | null
  contact?: string | null
  source?: string | null
  category?: string | null
  match_score?: number | null
  verified_status?: string | null
}

export default function CompanySearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // URL 파라미터 안전하게 가져오기
  const query = searchParams?.get('q') || ''
  const hasError = searchParams?.get('error') === 'true'
  const isTimeout = searchParams?.get('error') === 'timeout'

  const [searchQuery, setSearchQuery] = useState(query)
  const [results, setResults] = useState<CompanyMatch[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [error, setError] = useState<string | null>(
    hasError 
      ? (isTimeout ? '검색 시간이 초과되었습니다. 다시 시도해주세요.' : '검색 중 오류가 발생했습니다.')
      : null
  )
  const [lastSearchedQuery, setLastSearchedQuery] = useState<string>('')
  const abortControllerRef = useRef<AbortController | null>(null)

  // URL query가 변경되면 자동 검색
  useEffect(() => {
    if (query && query.trim() && query !== lastSearchedQuery) {
      setSearchQuery(query)
      setLastSearchedQuery(query)
      handleSearch(query, false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])
  
  // 컴포넌트 언마운트 시 요청 취소
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const handleSearch = async (searchTerm: string, updateUrl: boolean = true) => {
    const trimmedSearch = searchTerm.trim()
    
    // 빈 문자열이면 반환
    if (!trimmedSearch) {
      return
    }
    
    // URL 업데이트 모드
    if (updateUrl && trimmedSearch !== query) {
      // 이전 요청 취소
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
        abortControllerRef.current = null
      }
      
      // URL만 업데이트 (실제 검색은 useEffect에서)
      router.push(`/company-search?q=${encodeURIComponent(trimmedSearch)}`)
      return
    }
    
    // 직접 검색 모드
    setIsSearching(true)
    setError(null)
    
    // 이전 요청 취소
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    
    const controller = new AbortController()
    abortControllerRef.current = controller
    
    // 타임아웃 설정 (25초)
    const timeoutId = setTimeout(() => {
      controller.abort()
    }, 25000)
    
    try {
      const token = localStorage.getItem('access_token')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`${apiUrl}/api/company-search/search`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          company_name: trimmedSearch
        }),
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null
      }

      if (!response.ok) {
        let errorMessage = '검색 중 오류가 발생했습니다.'
        try {
          const errorData = await response.json()
          errorMessage = errorData.detail || errorMessage
          console.error('[ERROR] 검색 API 오류 응답:', errorData)
        } catch {
          const errorText = await response.text()
          console.error('[ERROR] 검색 API 오류 (텍스트):', response.status, errorText)
        }
        setError(errorMessage)
        setResults([])
        setLastSearchedQuery(trimmedSearch)
        setHasSearched(true)
        setIsSearching(false)
        return
      }

      const data = await response.json()
      console.log('[SEARCH] API 응답:', { 
        matchesCount: data.matches?.length || 0, 
        totalCount: data.total_count,
        hasExactMatch: data.has_exact_match 
      })
      
      if (!data.matches || data.matches.length === 0) {
        console.log('[SEARCH] 검색 결과 없음, fallback 사용')
        if (trimmedSearch && trimmedSearch.length >= 2) {
          setResults([{
            id: null,
            company_name: trimmedSearch,
            manager_name: null,
            company_url: null,
            email: null,
            phone: null,
            contact: null,
            source: 'user_input'
          }])
        } else {
          setResults([])
        }
      } else {
        console.log('[SEARCH] 검색 결과 설정:', data.matches.length, '개')
        setResults(data.matches)
      }
      
      setLastSearchedQuery(trimmedSearch)
      setHasSearched(true)
      setIsSearching(false)
    } catch (fetchErr: any) {
      clearTimeout(timeoutId)
      
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null
      }
      
      if (fetchErr.name === 'AbortError' || fetchErr.message?.includes('aborted')) {
        console.log('[INFO] 검색 요청이 취소되었습니다 (새로운 검색이 시작됨)')
        setIsSearching(false)
        return
      }
      
      console.error('검색 오류:', fetchErr)
      
      if (fetchErr.name === 'TimeoutError' || fetchErr.message?.includes('timeout')) {
        setError('검색 시간이 초과되었습니다. 다시 시도해주세요.')
        if (trimmedSearch && trimmedSearch.length >= 2) {
          setResults([{
            id: null,
            company_name: trimmedSearch,
            manager_name: null,
            company_url: null,
            email: null,
            phone: null,
            contact: null,
            source: 'user_input'
          }])
        }
      } else {
        setError('검색 중 오류가 발생했습니다.')
        setResults([])
      }
      
      setHasSearched(true)
      setIsSearching(false)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelectCompany = async (companyId: string | null, companyName: string) => {
    router.push(`/data-collection-results?company_name=${encodeURIComponent(companyName)}${companyId ? `&company_id=${companyId}` : ''}`)
  }

  const handleRegisterNew = () => {
    router.push(`/sales/clients?company_name=${encodeURIComponent(searchQuery.trim())}`)
  }

  const handleAdvancedSearch = async (searchParams: {
    representative_name?: string
    business_number?: string
    address?: string
  }) => {
    setIsSearching(true)
    setError(null)

    try {
      const token = localStorage.getItem('access_token')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const requestBody: any = {
        company_name: searchQuery.trim() || ''
      }
      
      if (searchParams.representative_name) {
        requestBody.representative_name = searchParams.representative_name
      }
      if (searchParams.business_number) {
        requestBody.business_number = searchParams.business_number
      }
      if (searchParams.address) {
        requestBody.address = searchParams.address
      }

      const response = await fetch(`${apiUrl}/api/company-search/search`, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorText = await response.text()
        setError('검색 중 오류가 발생했습니다.')
        setResults([])
        return
      }

      const data = await response.json()
      setResults(data.matches || [])
      setLastSearchedQuery(searchQuery || '')
      
      if (data.matches && data.matches.length > 0) {
        const params = new URLSearchParams()
        if (requestBody.company_name) params.set('q', requestBody.company_name)
        if (requestBody.representative_name) params.set('rep', requestBody.representative_name)
        if (requestBody.address) params.set('addr', requestBody.address)
        router.push(`/company-search?${params.toString()}`)
      }
    } catch (err) {
      console.error('고급 검색 오류:', err)
      setError('검색 중 오류가 발생했습니다.')
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-purple-900 to-blue-800">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 검색 바 */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    handleSearch(searchQuery)
                  }
                }}
                placeholder="회사명을 입력하세요"
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => handleSearch(searchQuery)}
              disabled={!searchQuery.trim() || isSearching}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>검색 중...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>검색</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* 검색 결과 */}
        {!isSearching && (results.length > 0 || hasSearched || error || (searchQuery && searchQuery.trim())) && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-4">
              검색 결과 ({results.length}개)
            </h2>

            {results.length === 0 ? (
              <div className="bg-white/5 border border-white/20 rounded-xl p-8 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 mb-6">검색 결과가 없습니다.</p>

                {/* 추가 검색 옵션 */}
                <div className="bg-white/5 border border-white/20 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-bold text-white mb-4">다른 방법으로 검색하기</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300 font-medium">대표자명으로 검색</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          id="search-by-manager"
                          placeholder="대표자명 입력"
                          className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const input = e.currentTarget as HTMLInputElement
                              if (input.value.trim()) {
                                handleAdvancedSearch({ representative_name: input.value.trim() })
                              }
                            }
                          }}
                        />
                        <button
                          onClick={() => {
                            const input = document.getElementById('search-by-manager') as HTMLInputElement
                            if (input?.value.trim()) {
                              handleAdvancedSearch({ representative_name: input.value.trim() })
                            }
                          }}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          검색
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-gray-300 font-medium">사업자등록번호로 검색</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          id="search-by-business-number"
                          placeholder="사업자등록번호 입력"
                          className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const input = e.currentTarget as HTMLInputElement
                              if (input.value.trim()) {
                                handleAdvancedSearch({ business_number: input.value.trim() })
                              }
                            }
                          }}
                        />
                        <button
                          onClick={() => {
                            const input = document.getElementById('search-by-business-number') as HTMLInputElement
                            if (input?.value.trim()) {
                              handleAdvancedSearch({ business_number: input.value.trim() })
                            }
                          }}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          검색
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleRegisterNew}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  <span>새 회사 등록하기</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {results.map((match, index) => (
                  <button
                    key={match.id || index}
                    onClick={() => handleSelectCompany(match.id || null, match.company_name)}
                    className="w-full text-left px-6 py-4 bg-white/5 hover:bg-blue-500/20 border border-white/20 hover:border-blue-400/50 rounded-lg transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-white group-hover:text-blue-300 text-lg">
                            {match.company_name}
                          </h3>
                          {match.source && (
                            <span className={`px-2 py-0.5 text-xs rounded-full border ${
                              match.source === 'naver_search' || match.source === 'naver_local' || match.source === 'naver_web'
                                ? 'bg-green-500/20 text-green-300 border-green-500/30'
                                : match.source === 'kakao_local'
                                ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                                : match.source === 'business_directory' || match.source === 'public_data'
                                ? 'bg-green-500/20 text-green-300 border-green-500/30'
                                : match.source === 'client_master'
                                ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                            }`}>
                              {match.source === 'naver_search' || match.source === 'naver_local' || match.source === 'naver_web' ? '네이버' :
                               match.source === 'kakao_local' ? '카카오' :
                               match.source === 'business_directory' || match.source === 'public_data' ? '공공데이터' :
                               match.source === 'client_master' ? '등록된 회사' :
                               match.source === 'user_input' ? '입력값 기반' : match.source}
                            </span>
                          )}
                          {match.verified_status === 'verified' && (
                            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                              검증됨
                            </span>
                          )}
                        </div>
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-300">
                            {match.manager_name && (
                              <div className="flex items-center gap-2">
                                <span className="text-gray-400">👤 대표자:</span> 
                                <span className="text-white font-medium">{match.manager_name}</span>
                              </div>
                            )}
                            {match.contact && (
                              <div className="flex-1 min-w-[200px]">
                                <span className="text-gray-400">📍 주소:</span> 
                                <span className="text-white">{match.contact}</span>
                              </div>
                            )}
                            {match.phone && (
                              <div>
                                <span className="text-gray-400">📞 전화:</span> 
                                <span className="text-white font-medium">{match.phone}</span>
                              </div>
                            )}
                            {match.category && (
                              <div>
                                <span className="text-gray-400">🏷️ 업종:</span> 
                                <span className="text-white">{match.category}</span>
                              </div>
                            )}
                            {match.company_url && (
                              <div className="flex-1 min-w-[200px]">
                                <span className="text-gray-400">🌐 웹사이트:</span> 
                                <a 
                                  href={match.company_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:text-blue-300 underline truncate max-w-xs inline-block"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {match.company_url}
                                </a>
                              </div>
                            )}
                          </div>
                          {(match.email || (match.match_score !== null && match.match_score !== undefined)) && (
                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-400 pt-2 border-t border-white/10">
                              {match.email && (
                                <div>
                                  <span className="text-gray-400">✉️ 이메일:</span> 
                                  <span className="text-white ml-1">{match.email}</span>
                                </div>
                              )}
                              {match.match_score !== null && match.match_score !== undefined && (
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-400">🎯 매칭점수:</span> 
                                  <span className={`font-medium ${
                                    match.match_score >= 0.7 ? 'text-green-400' : 
                                    match.match_score >= 0.4 ? 'text-yellow-400' : 
                                    'text-orange-400'
                                  }`}>
                                    {(match.match_score * 100).toFixed(0)}%
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-4" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 뒤로가기 버튼 */}
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