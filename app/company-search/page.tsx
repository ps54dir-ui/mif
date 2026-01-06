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
  contact?: string | null  // 주소 (검증용)
  source?: string | null  // 'naver_search', 'kakao_local', 'business_directory', etc.
  category?: string | null  // 카테고리 (검증용)
  match_score?: number | null  // 매칭 점수 (0.0 ~ 1.0)
  verified_status?: string | null  // 검증 상태
}

export default function CompanySearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const hasError = searchParams.get('error') === 'true'
  const isTimeout = searchParams.get('error') === 'timeout'

  const [searchQuery, setSearchQuery] = useState(query)
  const [results, setResults] = useState<CompanyMatch[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false) // 검색이 실행되었는지 추적
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
    if (!searchTerm.trim()) return

    const trimmedSearch = searchTerm.trim()
    
    // URL 변경이 필요한 경우
    if (updateUrl && trimmedSearch !== query) {
      // URL 변경 전에 이전 요청 취소
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
        abortControllerRef.current = null
      }
      router.push(`/company-search?q=${encodeURIComponent(trimmedSearch)}`)
      return // URL이 변경되면 useEffect가 새로운 검색을 실행
    }

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


      // 이전 요청 취소
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      
      // 새 요청 생성
      const controller = new AbortController()
      abortControllerRef.current = controller
      
      // 타임아웃 설정 (25초 - 백엔드에서 여러 소스 조회로 시간 소요)
      const timeoutId = setTimeout(() => {
        controller.abort()
      }, 25000)
      
      try {
        const response = await fetch(`${apiUrl}/api/company-search/search`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            company_name: searchTerm.trim()
          }),
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        
        // 요청이 성공적으로 완료되면 controller 참조 제거
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
          return
        }

        const data = await response.json()
        
        // 검색 결과 처리
        if (!data.matches || data.matches.length === 0) {
          // 검색 결과가 없으면 사용자 입력값을 fallback으로 사용
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
          setResults(data.matches)
        }
        
        setLastSearchedQuery(trimmedSearch)
        setHasSearched(true)
        setIsSearching(false)
      } catch (fetchErr: any) {
        clearTimeout(timeoutId)
        
        // AbortError는 정상적인 취소이므로 에러로 표시하지 않음
        if (fetchErr.name === 'AbortError' || fetchErr.message?.includes('aborted')) {
          console.log('[INFO] 검색 요청이 취소되었습니다 (새로운 검색이 시작됨)')
          // 이전 검색 결과는 유지하고, 검색 중 상태만 해제
          setIsSearching(false)
          // AbortError 발생 시:
          // 1. 이전 검색 결과가 있다면 유지 (hasSearched는 변경하지 않음)
          // 2. 이전 검색 결과가 없고 검색어가 있다면 fallback으로 사용자 입력값 표시
          if (results.length === 0 && trimmedSearch && trimmedSearch.length >= 2) {
            console.log('[INFO] AbortError 발생, fallback 결과 추가')
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
            setHasSearched(true)
          }
          return // 에러 표시하지 않고 조용히 종료
        }
        
        console.error('[ERROR] 검색 요청 중 오류:', fetchErr)
        // 다른 에러는 다시 throw하여 외부 catch에서 처리
        throw fetchErr
      } finally {
        clearTimeout(timeoutId)
        // 요청이 완료되면 controller 참조 제거
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null
        }
      }
    } catch (err: any) {
      console.error('검색 오류:', err)
      
      // AbortError는 이미 내부에서 처리되었으므로 여기서는 무시
      if (err.name === 'AbortError' || err.message?.includes('aborted')) {
        console.log('[INFO] 외부 catch: AbortError 무시')
        return
      }
      
      // 타임아웃 에러 처리
      if (err.name === 'TimeoutError') {
        setError('검색 시간이 초과되었습니다. 다시 시도해주세요.')
      } else {
        setError('검색 중 오류가 발생했습니다.')
      }
      
      setResults([])
      setHasSearched(true) // 오류 발생 시에도 검색 시도했음을 표시하여 결과 영역 표시
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelectCompany = async (companyId: string | null, companyName: string) => {
    // 데이터 수집 결과 페이지로 이동
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

      // 검색 파라미터 구성 (업체명은 기존 검색어 사용)
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
      
      // 검색 결과가 있으면 URL 업데이트
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            회사 검색
          </h1>
          <p className="text-gray-300">
            검색할 회사명을 입력하세요
          </p>
        </div>

        {/* 검색 입력 */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 mb-6">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSearch(searchQuery)
            }}
            className="flex gap-3"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="회사명을 입력하세요 (예: 삼성, 네이버)"
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
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
          </form>
        </div>

        {/* 오류 메시지 */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-300 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* 검색 중일 때는 로딩 표시 */}
        {isSearching && (
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-400 mr-3" />
              <span className="text-white text-lg">검색 중...</span>
            </div>
          </div>
        )}

        {/* 검색 완료 후 결과 표시 */}
        {hasSearched && !isSearching && (
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">
                검색 결과
                {results.length > 0 && (
                  <span className="text-blue-300 ml-2">({results.length}개)</span>
                )}
              </h2>
              {results.length === 0 && (
                <button
                  onClick={handleRegisterNew}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>새로 등록</span>
                </button>
              )}
            </div>

            {results.length === 0 ? (
              <div className="py-8">
                <div className="text-center mb-8">
                  <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300 text-lg mb-2">
                    &quot;{searchQuery}&quot;에 대한 검색 결과가 없습니다.
                  </p>
                  <p className="text-gray-400 text-sm">
                    다른 검색 조건으로 다시 시도해보세요.
                  </p>
                </div>

                {/* 추가 검색 옵션 */}
                <div className="bg-white/5 border border-white/20 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-bold text-white mb-4">다른 방법으로 검색하기</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 대표자명으로 검색 */}
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

                    {/* 사업자등록번호로 검색 */}
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300 font-medium">사업자등록번호로 검색</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          id="search-by-business-number"
                          placeholder="사업자등록번호 입력 (예: 123-45-67890)"
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

                    {/* 주소로 검색 */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm text-gray-300 font-medium">주소로 검색</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          id="search-by-address"
                          placeholder="주소 입력 (예: 서울특별시 강남구 또는 서울 강남구)"
                          className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const input = e.currentTarget as HTMLInputElement
                              if (input.value.trim()) {
                                handleAdvancedSearch({ address: input.value.trim() })
                              }
                            }
                          }}
                        />
                        <button
                          onClick={() => {
                            const input = document.getElementById('search-by-address') as HTMLInputElement
                            if (input?.value.trim()) {
                              handleAdvancedSearch({ address: input.value.trim() })
                            }
                          }}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          검색
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 업체명 다시 입력 */}
                  <div className="mt-6 pt-6 border-t border-white/20">
                    <label className="text-sm text-gray-300 font-medium block mb-2">업체명 다시 입력</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="업체명을 다시 입력하세요"
                        className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && searchQuery.trim()) {
                            handleSearch(searchQuery)
                          }
                        }}
                      />
                      <button
                        onClick={() => handleSearch(searchQuery)}
                        disabled={!searchQuery.trim() || isSearching}
                        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        검색
                      </button>
                    </div>
                  </div>
                </div>

                {/* 새 회사 등록 버튼 */}
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-4">
                    여전히 찾지 못하셨나요?
                  </p>
                  <button
                    onClick={handleRegisterNew}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2 mx-auto"
                  >
                    <Plus className="w-5 h-5" />
                    <span>새 회사 등록하기</span>
                  </button>
                </div>
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
                          {match.source === 'naver_search' || match.source === 'naver_local' || match.source === 'naver_web' && (
                            <span className="px-2 py-0.5 bg-green-500/20 text-green-300 text-xs rounded-full border border-green-500/30">
                              네이버
                            </span>
                          )}
                          {match.source === 'kakao_local' && (
                            <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-300 text-xs rounded-full border border-yellow-500/30">
                              카카오
                            </span>
                          )}
                          {(match.source === 'public_data' || match.source === 'business_directory') && (
                            <span className="px-2 py-0.5 bg-green-500/20 text-green-300 text-xs rounded-full border border-green-500/30">
                              공공데이터
                            </span>
                          )}
                          {(match.source === 'local_db' || match.source === 'client_master') && (
                            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                              등록된 회사
                            </span>
                          )}
                          {match.source === 'user_input' && (
                            <span className="px-2 py-0.5 bg-gray-500/20 text-gray-300 text-xs rounded-full border border-gray-500/30">
                              입력값 기반
                            </span>
                          )}
                          {match.verified_status === 'verified' && (
                            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                              검증됨
                            </span>
                          )}
                        </div>
                        <div className="space-y-2">
                          {/* 검증 정보: 주소, 전화번호, 카테고리 */}
                          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-300">
                            {match.contact && (
                              <div className="flex-1 min-w-[200px]">
                                <span className="text-gray-400">📍 주소:</span> <span className="text-white">{match.contact}</span>
                              </div>
                            )}
                            {match.phone && (
                              <div>
                                <span className="text-gray-400">📞 전화:</span> <span className="text-white">{match.phone}</span>
                              </div>
                            )}
                            {match.category && (
                              <div>
                                <span className="text-gray-400">🏷️ 업종:</span> <span className="text-white">{match.category}</span>
                              </div>
                            )}
                          </div>
                          {/* 추가 정보 */}
                          {(match.manager_name || match.company_url || match.email) && (
                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-400 pt-1 border-t border-white/10">
                              {match.manager_name && (
                                <div>
                                  <span>대표자:</span> {match.manager_name}
                                </div>
                              )}
                              {match.company_url && (
                                <div className="truncate max-w-xs">
                                  <span>URL:</span> {match.company_url}
                                </div>
                              )}
                              {match.email && (
                                <div>
                                  <span>이메일:</span> {match.email}
                                </div>
                              )}
                              {match.match_score !== null && match.match_score !== undefined && (
                                <div>
                                  <span>매칭점수:</span> {(match.match_score * 100).toFixed(0)}%
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
