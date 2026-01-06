/**
 * 사용자별 데이터 저장 API 클라이언트
 */

import { fetchWithAuth } from '@/lib/auth/auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface SaveDashboardDataRequest {
  company_name: string
  dashboard_data: any
}

export interface DashboardData {
  id: string
  user_id: string
  company_name: string
  saved_at: string
  updated_at: string
}

export interface Brand {
  id: string
  user_id: string
  brand_name: string
  company_name?: string
  industry?: string
  created_at: string
  updated_at: string
}

export interface UserCompanies {
  companies: Array<{
    company_name: string
    saved_at: string
    updated_at: string
  }>
  total: number
}

export async function saveDashboardData(data: SaveDashboardDataRequest): Promise<DashboardData> {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/user-data/dashboard`, {
    method: 'POST',
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || '대시보드 데이터 저장에 실패했습니다.')
  }

  return response.json()
}

export async function getDashboardData(companyName: string): Promise<any> {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/user-data/dashboard/${encodeURIComponent(companyName)}`)

  if (!response.ok) {
    if (response.status === 404) {
      return null // 데이터가 없으면 null 반환
    }
    const error = await response.json()
    throw new Error(error.detail || '대시보드 데이터 조회에 실패했습니다.')
  }

  return response.json()
}

export async function getUserCompanies(): Promise<UserCompanies> {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/user-data/dashboard`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || '회사 목록 조회에 실패했습니다.')
  }

  return response.json()
}

export async function saveBrand(brand: {
  brand_name: string
  company_name?: string
  industry?: string
}): Promise<Brand> {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/user-data/brands`, {
    method: 'POST',
    body: JSON.stringify(brand),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || '브랜드 저장에 실패했습니다.')
  }

  return response.json()
}

export async function getUserBrands(): Promise<Brand[]> {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/user-data/brands`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || '브랜드 목록 조회에 실패했습니다.')
  }

  return response.json()
}

export async function deleteBrand(brandId: string): Promise<void> {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/user-data/brands/${brandId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || '브랜드 삭제에 실패했습니다.')
  }
}

export async function deleteAccount(): Promise<void> {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/user-data/profile`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || '회원탈퇴에 실패했습니다.')
  }
}
