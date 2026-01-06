'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { type DashboardData } from '@/lib/api/dashboardApi'
import { getDashboardData } from '@/lib/api/userDataApi'
import { isAuthenticated } from '@/lib/auth/auth'
import { NIKE_DATA } from './dashboardData'

export function useDashboardData() {
  const searchParams = useSearchParams()
  const [dashboardData, setDashboardData] = useState<DashboardData>(NIKE_DATA)
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
          // 저장된 데이터가 없으면 기본 데이터 사용
        }
      }
      setLoading(false)
    }

    loadData()
  }, [companyName])

  return { dashboardData, loading, companyName }
}
