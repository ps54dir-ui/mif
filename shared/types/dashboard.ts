// shared/types/dashboard.ts

export interface ICEPriority {
  id: string
  strategyName: string
  impact: number
  confidence: number
  ease: number
  finalScore: number
  description?: string
}

export type SeoGeoAeoType = 'SEO' | 'GEO' | 'AEO'

export interface SeoGeoAeoReportItem {
  type: SeoGeoAeoType
  score: number
  issues: any[]
}

export interface SimpleReport {
  score: number
  insights: any[]
}

export interface FourAxes {
  inflow: number
  persuasion: number
  trust: number
  circulation: number
}

export interface DashboardData {
  overallScore: number
  fourAxes: FourAxes

  seoGeoAeoReports: SeoGeoAeoReportItem[]
  seoReport: SimpleReport
  geoReport: SimpleReport
  aeoReport: SimpleReport

  icePriorities: ICEPriority[]

  diagnosisHistory: any[]
  onlineChannelDiagnostics: Record<string, any>
  channelDiagnostics: Record<string, any>
}
