/**
 * 대시보드 API 클라이언트
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface DashboardSummary {
  overallScore: number
  fourAxes: {
    inflow: number
    persuasion: number
    trust: number
    circulation: number
  }
  seoGeoAeoReports: Array<{
    type: 'SEO' | 'GEO' | 'AEO'
    score: number
    issues: string[]
  }>
  icePriorities: Array<{
    id: string
    strategyName: string
    impact: number
    confidence: number
    ease: number
    finalScore: number
    description?: string
  }>
  diagnosisHistory: Array<{
    date: string
    overallScore: number
    version: number
  }>
}

export async function fetchDashboardSummary(
  reportId: string
): Promise<DashboardSummary> {
  const response = await fetch(`${API_BASE_URL}/api/dashboard/summary?report_id=${reportId}`)
  
  if (!response.ok) {
    throw new Error('대시보드 데이터 로딩 실패')
  }
  
  return response.json()
}
