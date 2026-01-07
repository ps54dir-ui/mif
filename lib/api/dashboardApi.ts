/**
 * 대시보드 API 호출 함수
 * 실제 API 연동 시 이 파일의 함수들을 구현하면 됩니다.
 */

import { getMockBrandData, type MockBrandData } from './mockData'
import type { DashboardData } from '../../shared/types/dashboard'

// 공용 타입을 re-export
export type { DashboardData } from '../../shared/types/dashboard'

/**
 * Mock 데이터를 DashboardData 형식으로 변환
 */
function convertMockDataToDashboardData(mockData: MockBrandData): DashboardData {
  // seoGeoAeoReports에서 각 타입별 점수 추출
  const seoReport = mockData.seoGeoAeoReports.find(r => r.type === 'SEO')
  const geoReport = mockData.seoGeoAeoReports.find(r => r.type === 'GEO')
  const aeoReport = mockData.seoGeoAeoReports.find(r => r.type === 'AEO')

  return {
    overallScore: mockData.overallScore,
    fourAxes: mockData.fourAxes,
    seoGeoAeoReports: mockData.seoGeoAeoReports,
    seoReport: {
      score: seoReport?.score || 0,
      insights: seoReport?.issues || []
    },
    geoReport: {
      score: geoReport?.score || 0,
      insights: geoReport?.issues || []
    },
    aeoReport: {
      score: aeoReport?.score || 0,
      insights: aeoReport?.issues || []
    },
    icePriorities: mockData.icePriorities,
    diagnosisHistory: mockData.diagnosisHistory,
    onlineChannelDiagnostics: mockData.onlineChannelDiagnostics,
    channelDiagnostics: mockData.channelDiagnostics || {}
  }
}

/**
 * 브랜드 이름으로 대시보드 데이터 조회
 * 
 * @param brandName 브랜드 이름 (예: '나이키')
 * @returns DashboardData
 * 
 * TODO: 실제 API 연동 시 아래 주석을 해제하고 구현
 * 
 * ```typescript
 * export async function fetchDashboardDataByBrandName(brandName: string): Promise<DashboardData> {
 *   const response = await fetch(`/api/dashboard/brand/${encodeURIComponent(brandName)}`)
 *   if (!response.ok) {
 *     throw new Error(`대시보드 데이터 조회 실패: ${response.statusText}`)
 *   }
 *   return await response.json()
 * }
 * ```
 */
export async function fetchDashboardDataByBrandName(brandName: string): Promise<DashboardData> {
  // TODO: 실제 API 호출로 교체
  // const response = await fetch(`/api/dashboard/brand/${encodeURIComponent(brandName)}`)
  // if (!response.ok) {
  //   throw new Error(`대시보드 데이터 조회 실패: ${response.statusText}`)
  // }
  // return await response.json()
  
  // 실제 API 호출 필요
  throw new Error('API 연동이 필요합니다. 실제 API 엔드포인트를 구현해주세요.')
}

/**
 * 브랜드 ID로 대시보드 데이터 조회
 * 
 * @param brandId 브랜드 ID
 * @returns DashboardData
 * 
 * TODO: 실제 API 연동 시 아래 주석을 해제하고 구현
 * 
 * ```typescript
 * export async function fetchDashboardDataByBrandId(brandId: string): Promise<DashboardData> {
 *   const response = await fetch(`/api/dashboard/brand/${brandId}`)
 *   if (!response.ok) {
 *     throw new Error(`대시보드 데이터 조회 실패: ${response.statusText}`)
 *   }
 *   return await response.json()
 * }
 * ```
 */
export async function fetchDashboardDataByBrandId(brandId: string): Promise<DashboardData> {
  // TODO: 실제 API 호출로 교체
  // const response = await fetch(`/api/dashboard/brand/${brandId}`)
  // if (!response.ok) {
  //   throw new Error(`대시보드 데이터 조회 실패: ${response.statusText}`)
  // }
  // return await response.json()
  
  // 실제 API 호출 필요
  throw new Error('API 연동이 필요합니다. 실제 API 엔드포인트를 구현해주세요.')
}

/**
 * 리포트 ID로 대시보드 데이터 조회
 * 
 * @param reportId 리포트 ID
 * @returns DashboardData
 * 
 * TODO: 실제 API 연동 시 아래 주석을 해제하고 구현
 * 
 * ```typescript
 * export async function fetchDashboardDataByReportId(reportId: string): Promise<DashboardData> {
 *   const response = await fetch(`/api/dashboard/report/${reportId}`)
 *   if (!response.ok) {
 *     throw new Error(`대시보드 데이터 조회 실패: ${response.statusText}`)
 *   }
 *   return await response.json()
 * }
 * ```
 */
export async function fetchDashboardDataByReportId(reportId: string): Promise<DashboardData> {
  // TODO: 실제 API 호출로 교체
  // const response = await fetch(`/api/dashboard/report/${reportId}`)
  // if (!response.ok) {
  //   throw new Error(`대시보드 데이터 조회 실패: ${response.statusText}`)
  // }
  // return await response.json()
  
  // 실제 API 호출 필요
  throw new Error('API 연동이 필요합니다. 실제 API 엔드포인트를 구현해주세요.')
}
