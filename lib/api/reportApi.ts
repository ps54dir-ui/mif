/**
 * 리포트 저장 API 클라이언트
 */

import { fetchWithAuth } from '@/lib/auth/auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface SaveReportRequest {
  report_name: string
  report_type: 'initial' | 'consulting_effect' | 'comparison' | 'custom'
  company_name: string
  report_data: any
  issued_at: string
  version: number
  is_published: boolean
}

export interface Report {
  id: string
  user_id: string
  report_name: string
  report_type: string
  company_name: string
  issued_at: string
  version: number
  is_published: boolean
  pdf_file_path?: string
  created_at: string
  updated_at: string
}

export interface ReportListResponse {
  reports: Report[]
  total: number
}

export async function saveReport(reportData: SaveReportRequest): Promise<Report> {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/reports/save`, {
    method: 'POST',
    body: JSON.stringify(reportData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || '리포트 저장에 실패했습니다.')
  }

  return response.json()
}

export async function getUserReports(params?: {
  company_name?: string
  report_type?: string
}): Promise<ReportListResponse> {
  const queryParams = new URLSearchParams()
  if (params?.company_name) queryParams.append('company_name', params.company_name)
  if (params?.report_type) queryParams.append('report_type', params.report_type)

  const url = `${API_BASE_URL}/api/reports/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  const response = await fetchWithAuth(url)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || '리포트 조회에 실패했습니다.')
  }

  return response.json()
}

export async function getReport(reportId: string): Promise<Report> {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/reports/${reportId}`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || '리포트 조회에 실패했습니다.')
  }

  return response.json()
}

export async function getReportData(reportId: string): Promise<any> {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/reports/${reportId}/data`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || '리포트 데이터 조회에 실패했습니다.')
  }

  return response.json()
}

export async function deleteReport(reportId: string): Promise<void> {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/reports/${reportId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || '리포트 삭제에 실패했습니다.')
  }
}

export async function updateReportPdf(reportId: string, pdfFilePath: string): Promise<void> {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/reports/${reportId}/pdf`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pdf_file_path: pdfFilePath }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'PDF 경로 업데이트에 실패했습니다.')
  }
}
