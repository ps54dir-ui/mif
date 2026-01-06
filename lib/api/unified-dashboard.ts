/**
 * 통합 대시보드 API 클라이언트
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function getUnifiedDashboard(companyId: string) {
  const response = await fetch(`${API_BASE_URL}/api/dashboard/unified/${companyId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!response.ok) {
    throw new Error(`Failed to get unified dashboard: ${response.statusText}`)
  }

  const result = await response.json()
  return result.data
}
