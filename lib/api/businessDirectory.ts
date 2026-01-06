/**
 * 업체명 기반 진단 시스템 - API 클라이언트
 */

export interface CompanySearchResult {
  id: string
  name: string
  address: string
  ceo_name_masked: string
  verified_status: 'verified' | 'unverified'
  has_business_number: boolean
}

export interface CompanySearchResponse {
  results: CompanySearchResult[]
  total: number
}

export interface CompanyDetail {
  id: string
  name: string
  address: string
  ceo_name_masked: string
  verified_status: 'verified' | 'unverified'
  has_business_number: boolean
  can_proceed_diagnosis: boolean
}

export interface VerifyResponse {
  success: boolean
  status: '계속' | '휴업' | '폐업' | 'unknown'
  message: string
  can_proceed_diagnosis: boolean
}

export interface SelectAndDiagnoseResponse {
  can_proceed: boolean
  requires_verification: boolean
  message: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

/**
 * 업체명으로 검색
 */
export async function searchCompanies(
  companyName: string
): Promise<CompanySearchResponse> {
  const token = localStorage.getItem('access_token')
  if (!token) {
    throw new Error('인증 토큰이 없습니다.')
  }

  const response = await fetch(`${API_URL}/api/business-directory/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ company_name: companyName })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || '검색 중 오류가 발생했습니다.')
  }

  return response.json()
}

/**
 * 업체 상세 정보 조회
 */
export async function getCompanyDetail(
  companyId: string
): Promise<CompanyDetail> {
  const token = localStorage.getItem('access_token')
  if (!token) {
    throw new Error('인증 토큰이 없습니다.')
  }

  const response = await fetch(`${API_URL}/api/business-directory/${companyId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || '업체 정보 조회 중 오류가 발생했습니다.')
  }

  return response.json()
}

/**
 * 업체 검증 (사업자등록번호로)
 */
export async function verifyCompany(
  companyId: string,
  businessNumber: string
): Promise<VerifyResponse> {
  const token = localStorage.getItem('access_token')
  if (!token) {
    throw new Error('인증 토큰이 없습니다.')
  }

  const response = await fetch(`${API_URL}/api/business-directory/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      company_id: companyId,
      business_number: businessNumber
    })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || '검증 중 오류가 발생했습니다.')
  }

  return response.json()
}

/**
 * 업체 선택 후 진단 진행 가능 여부 확인
 */
export async function selectCompanyAndDiagnose(
  companyId: string
): Promise<SelectAndDiagnoseResponse> {
  const token = localStorage.getItem('access_token')
  if (!token) {
    throw new Error('인증 토큰이 없습니다.')
  }

  const response = await fetch(`${API_URL}/api/business-directory/select-and-diagnose`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ company_id: companyId })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || '처리 중 오류가 발생했습니다.')
  }

  return response.json()
}
