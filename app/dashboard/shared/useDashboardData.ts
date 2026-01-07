'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { type DashboardData } from '@/lib/api/dashboardApi'
import { getDashboardData } from '@/lib/api/userDataApi'
import { isAuthenticated } from '@/lib/auth/auth'
import type { OnlineChannelDiagnosticsData } from '@/shared/types/channels'

// 빈 DashboardData 초기값
const EMPTY_DASHBOARD_DATA: DashboardData = {
  overallScore: 0,
  fourAxes: {
    inflow: 0,
    persuasion: 0,
    trust: 0,
    circulation: 0
  },
  seoGeoAeoReports: [],
  seoReport: {
    score: 0,
    insights: []
  },
  geoReport: {
    score: 0,
    insights: []
  },
  aeoReport: {
    score: 0,
    insights: []
  },
  icePriorities: [],
  diagnosisHistory: [],
  onlineChannelDiagnostics: {
    youtube: {
      video_mentions_growth: 0,
      viral_index: 0
    },
    instagram: {
      engagement_index: 0,
      hashtag_spread_rank: ''
    }
  } as any,
  channelDiagnostics: {}
}

export function useDashboardData() {
  const searchParams = useSearchParams()
  const [dashboardData, setDashboardData] = useState<DashboardData>(EMPTY_DASHBOARD_DATA)
  const [loading, setLoading] = useState(true)
  // brand_name 또는 brand name (공백) 모두 지원 (방어 코드)
  const companyName = searchParams.get('brand_name') || searchParams.get('brand name') || '삼성생명'

  useEffect(() => {
    const loadData = async () => {
      // 로그인한 경우 저장된 데이터 로드 시도
      if (isAuthenticated()) {
        try {
          const savedData = await getDashboardData(companyName)
          if (savedData && savedData.dashboard_data) {
            setDashboardData(savedData.dashboard_data as DashboardData)
          }
        } catch (error) {
          console.error('저장된 데이터 로드 실패:', error)
          // 저장된 데이터가 없으면 빈 데이터 유지
        }
      }
      setLoading(false)
    }

    loadData()
  }, [companyName])

  return { dashboardData, loading, companyName }
}
