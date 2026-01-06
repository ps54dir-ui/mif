'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react'
import {
  searchCompanies,
  getCompanyDetail,
  verifyCompany,
  selectCompanyAndDiagnose,
  type CompanySearchResult,
  type VerifyResponse
} from '@/lib/api/businessDirectory'

interface CompanySearchFlowProps {
  onCompanySelected?: (companyId: string) => void
  onDiagnosisStart?: (companyId: string) => void
}

export default function CompanySearchFlow({
  onCompanySelected,
  onDiagnosisStart
}: CompanySearchFlowProps) {
  const router = useRouter()
  const [companyName, setCompanyName] = useState('')
  const [searchResults, setSearchResults] = useState<CompanySearchResult[]>([])
  const [selectedCompany, setSelectedCompany] = useState<CompanySearchResult | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const [businessNumber, setBusinessNumber] = useState('')
  const [verificationResult, setVerificationResult] = useState<VerifyResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounced 검색
  const handleSearch = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    setError(null)

    try {
      const response = await searchCompanies(query)
      setSearchResults(response.results)
    } catch (err: any) {
      setError(err.message || '검색 중 오류가 발생했습니다.')
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  // 입력 변경 시 debounce 검색
  const handleInputChange = (value: string) => {
    setCompanyName(value)
    setSelectedCompany(null)
    setSearchResults([])
    setError(null)

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(value)
    }, 300)
  }

  // 업체 선택
  const handleSelectCompany = async (company: CompanySearchResult) => {
    setSelectedCompany(company)
    setError(null)

    try {
      // 진단 진행 가능 여부 확인
      const response = await selectCompanyAndDiagnose(company.id)

      if (response.can_proceed) {
        // Verified → 즉시 진단 실행
        if (onDiagnosisStart) {
          onDiagnosisStart(company.id)
        } else {
          router.push(`/diagnosis?company_id=${company.id}`)
        }
      } else if (response.requires_verification) {
        // Unverified → 사업자등록번호 입력 유도
        setShowVerificationModal(true)
      }
    } catch (err: any) {
      setError(err.message || '처리 중 오류가 발생했습니다.')
    }
  }

  // 사업자등록번호 검증
  const handleVerify = async () => {
    if (!selectedCompany || !businessNumber.trim()) {
      setError('사업자등록번호를 입력해주세요.')
      return
    }

    // 하이픈 제거
    const cleanNumber = businessNumber.replace(/[-\s]/g, '')
    if (cleanNumber.length !== 10) {
      setError('사업자등록번호는 10자리 숫자입니다.')
      return
    }

    setIsVerifying(true)
    setError(null)

    try {
      const result = await verifyCompany(selectedCompany.id, cleanNumber)

      setVerificationResult(result)

      if (result.can_proceed_diagnosis) {
        // 계속사업자 → 진단 실행
        setTimeout(() => {
          setShowVerificationModal(false)
          if (onDiagnosisStart) {
            onDiagnosisStart(selectedCompany.id)
          } else {
            router.push(`/diagnosis?company_id=${selectedCompany.id}`)
          }
        }, 1500)
      }
      // 휴업/폐업은 메시지만 표시
    } catch (err: any) {
      setError(err.message || '검증 중 오류가 발생했습니다.')
    } finally {
      setIsVerifying(false)
    }
  }

  // 상태 배지 컴포넌트
  const StatusBadge = ({ status }: { status: string }) => {
    if (status === 'verified') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200">
          <CheckCircle2 className="w-3.5 h-3.5" />
          확인됨
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full border border-amber-200">
        <AlertCircle className="w-3.5 h-3.5" />
        미확인
      </span>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* 검색 입력 */}
      <div className="relative mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={companyName}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="업체명을 입력하세요 (예: 삼성전자, 네이버)"
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          />
          {isSearching && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* 검색 결과 리스트 */}
      {searchResults.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {/* 헤더 */}
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">
                검색 결과 ({searchResults.length}개)
              </h3>
              {searchResults.length > 1 && (
                <p className="text-xs text-gray-500">
                  같은 이름의 업체가 여러 개 있습니다. 대표자명이나 주소를 확인하여 선택하세요.
                </p>
              )}
            </div>
          </div>

          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {searchResults.map((company) => (
              <button
                key={company.id}
                onClick={() => handleSelectCompany(company)}
                className={`w-full text-left p-5 hover:bg-blue-50 transition-all ${
                  selectedCompany?.id === company.id 
                    ? 'bg-blue-50 ring-2 ring-blue-500 ring-inset' 
                    : 'bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* 왼쪽: 업체 정보 */}
                  <div className="flex-1 min-w-0">
                    {/* 업체명 + 상태 배지 */}
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-bold text-gray-900 truncate">
                        {company.name}
                      </h3>
                      <StatusBadge status={company.verified_status} />
                    </div>

                    {/* 구분 정보 (대표자명, 주소) */}
                    <div className="space-y-2">
                      {/* 대표자명 - 강조 표시 */}
                      {company.ceo_name_masked && (
                        <div className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-16 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            대표자
                          </span>
                          <span className="text-base font-medium text-gray-900">
                            {company.ceo_name_masked}
                          </span>
                        </div>
                      )}

                      {/* 주소 - 강조 표시 */}
                      {company.address && (
                        <div className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-16 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            주소
                          </span>
                          <span className="text-sm text-gray-700 leading-relaxed">
                            {company.address}
                          </span>
                        </div>
                      )}

                      {/* 업체가 없을 경우 안내 */}
                      {!company.ceo_name_masked && !company.address && (
                        <div className="text-xs text-gray-400 italic">
                          추가 정보 없음
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 오른쪽: 선택 표시 */}
                  <div className="flex-shrink-0 flex items-center justify-center">
                    {selectedCompany?.id === company.id ? (
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xs text-blue-600 font-medium">선택됨</span>
                      </div>
                    ) : (
                      <div className="w-6 h-6 border-2 border-gray-300 rounded-full hover:border-blue-500 transition-colors" />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* 선택 안내 */}
          {searchResults.length > 1 && !selectedCompany && (
            <div className="bg-blue-50 border-t border-blue-200 px-4 py-3">
              <p className="text-sm text-blue-700">
                <span className="font-semibold">💡 팁:</span> 동일한 상호의 업체가 여러 개일 경우, 
                <span className="font-medium"> 대표자명</span> 또는 <span className="font-medium">주소</span>를 확인하여 
                정확한 업체를 선택하세요.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 검색 결과 없음 */}
      {companyName && !isSearching && searchResults.length === 0 && !error && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-12">
          <div className="text-center">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-sm text-gray-500">
              &quot;{companyName}&quot;에 대한 검색 결과를 찾을 수 없습니다.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              다른 검색어를 입력하거나 업체명을 다시 확인해주세요.
            </p>
          </div>
        </div>
      )}

      {/* 검증 모달 */}
      {showVerificationModal && selectedCompany && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">사업자등록번호 입력</h3>
            <p className="text-sm text-gray-600 mb-4">
              선택한 업체: <span className="font-medium">{selectedCompany.name}</span>
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사업자등록번호
              </label>
              <input
                type="text"
                value={businessNumber}
                onChange={(e) => {
                  // 숫자와 하이픈만 허용
                  const value = e.target.value.replace(/[^\d-]/g, '')
                  setBusinessNumber(value)
                }}
                placeholder="123-45-67890"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={12}
              />
              <p className="mt-1 text-xs text-gray-500">
                하이픈 포함 또는 제외하여 입력 가능합니다.
              </p>
            </div>

            {/* 검증 결과 */}
            {verificationResult && (
              <div
                className={`mb-4 p-4 rounded-lg ${
                  verificationResult.can_proceed_diagnosis
                    ? 'bg-green-50 border border-green-200 text-green-700'
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  {verificationResult.can_proceed_diagnosis ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                  <p className="font-medium">{verificationResult.message}</p>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowVerificationModal(false)
                  setBusinessNumber('')
                  setVerificationResult(null)
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                disabled={isVerifying}
              >
                취소
              </button>
              <button
                onClick={handleVerify}
                disabled={isVerifying || !businessNumber.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    검증 중...
                  </>
                ) : (
                  '검증하기'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
