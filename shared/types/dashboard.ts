// shared/types/dashboard.ts

import type { OnlineChannelDiagnosticsData } from './channels'

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
  onlineChannelDiagnostics?: OnlineChannelDiagnosticsData
  channelDiagnostics: Record<string, any>
  
  channelAsymmetry?: {
    insights: Array<{
      type: string
      channel1: string
      channel2: string
      metric: string
      message: string
    }>
    summary: string
  }
  digitalShare?: {
    overall_digital_share: number
    seo_contribution: number
    sns_contribution: number
    channel_contributions: Record<string, number>
    breakdown: {
      seo_score: number
      average_sns_score: number
      sns_channels: Record<string, number>
    }
  }
}
