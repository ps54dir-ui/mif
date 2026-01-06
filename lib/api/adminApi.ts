/**
 * 관리자 API 클라이언트
 */

import { fetchWithAuth } from '@/lib/auth/auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface UserSummary {
  id: string
  username: string
  email?: string
  is_admin: boolean
  is_active: boolean
  created_at: string
  last_login_at?: string
  report_count: number
  company_count: number
}

export interface AdminReport {
  id: string
  user_id: string
  username: string
  report_name: string
  report_type: string
  company_name: string
  issued_at: string
  version: number
  is_published: boolean
  created_at: string
}

export interface AdminStatistics {
  total_users: number
  active_users: number
  total_reports: number
  total_companies: number
  reports_by_type: Record<string, number>
  recent_reports: AdminReport[]
}

export async function getAllUsers(): Promise<UserSummary[]> {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/admin/users`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || '사용자 목록 조회에 실패했습니다.')
  }

  return response.json()
}

export async function getUserReports(userId: string, companyName?: string): Promise<AdminReport[]> {
  const queryParams = new URLSearchParams()
  if (companyName) queryParams.append('company_name', companyName)

  const url = `${API_BASE_URL}/api/admin/users/${userId}/reports${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  const response = await fetchWithAuth(url)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || '리포트 조회에 실패했습니다.')
  }

  return response.json()
}

export async function getAdminStatistics(): Promise<AdminStatistics> {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/admin/statistics`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || '통계 조회에 실패했습니다.')
  }

  return response.json()
}

export async function updateUserStatus(userId: string, isActive: boolean): Promise<void> {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/admin/users/${userId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ is_active: isActive }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || '사용자 상태 업데이트에 실패했습니다.')
  }
}

export async function getUserReportData(userId: string, reportId: string): Promise<any> {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/admin/users/${userId}/reports/${reportId}/data`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || '리포트 데이터 조회에 실패했습니다.')
  }

  return response.json()
}

export async function deleteUser(userId: string): Promise<void> {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/admin/users/${userId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || '사용자 삭제에 실패했습니다.')
  }
}
