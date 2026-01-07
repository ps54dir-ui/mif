/**
 * API 응답 검증 사용 예제
 * 
 * 이 파일은 예제입니다. 실제 API 클라이언트에서 다음과 같이 사용하세요:
 */

import { z } from 'zod'
import { safeApiCall, validateApiResponse } from './api-validation'

// 1. Zod 스키마 정의
const DashboardDataSchema = z.object({
  overallScore: z.number().min(0).max(100),
  fourAxes: z.object({
    inflow: z.number().min(0).max(100),
    persuasion: z.number().min(0).max(100),
    trust: z.number().min(0).max(100),
    circulation: z.number().min(0).max(100),
  }),
  seoGeoAeoReports: z.array(
    z.object({
      type: z.enum(['SEO', 'GEO', 'AEO']),
      score: z.number().min(0).max(100),
      issues: z.array(z.string()),
    })
  ),
  icePriorities: z.array(
    z.object({
      id: z.string(),
      strategyName: z.string(),
      impact: z.number().min(1).max(10),
      confidence: z.number().min(1).max(10),
      ease: z.number().min(1).max(10),
      finalScore: z.number(),
      description: z.string().optional(),
    })
  ),
  diagnosisHistory: z.array(
    z.object({
      date: z.string(),
      overallScore: z.number(),
      version: z.number(),
    })
  ),
  onlineChannelDiagnostics: z.object({
    youtube: z.object({
      video_mentions_growth: z.number(),
      viral_index: z.number(),
    }),
    instagram: z.object({
      engagement_index: z.number(),
      hashtag_spread_rank: z.string(),
    }),
  }).optional(),
  channelDiagnostics: z.record(z.any()),
})

type DashboardData = z.infer<typeof DashboardDataSchema>

// 2. safeApiCall 사용 예제
export async function fetchDashboardDataExample(brandName: string): Promise<DashboardData> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  
  return safeApiCall<DashboardData>(
    `${API_BASE_URL}/api/dashboard/brand/${encodeURIComponent(brandName)}`,
    DashboardDataSchema,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}

// 3. validateApiResponse 직접 사용 예제
export async function fetchDashboardDataManual(brandName: string): Promise<DashboardData> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  
  const response = await fetch(
    `${API_BASE_URL}/api/dashboard/brand/${encodeURIComponent(brandName)}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  return validateApiResponse(response, DashboardDataSchema)
}
