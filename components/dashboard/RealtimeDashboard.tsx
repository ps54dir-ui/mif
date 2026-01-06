/**
 * 실시간 대시보드 컴포넌트
 * Supabase 실시간 구독을 통한 자동 업데이트
 */

'use client'

import { useEffect, useState, useRef } from 'react'
import { Wifi, WifiOff, RefreshCw } from 'lucide-react'
import { subscribeToDashboard, subscribeToReports, unsubscribe, type DashboardUpdate, type ReportUpdate } from '@/lib/supabase/realtime'
import { getCurrentUser } from '@/lib/auth/auth'

interface RealtimeDashboardProps {
  companyName: string
  onDashboardUpdate?: (update: DashboardUpdate) => void
  onReportUpdate?: (update: ReportUpdate) => void
}

export function RealtimeDashboard({
  companyName,
  onDashboardUpdate,
  onReportUpdate,
}: RealtimeDashboardProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const dashboardChannelRef = useRef<any>(null)
  const reportsChannelRef = useRef<any>(null)

  useEffect(() => {
    const user = getCurrentUser()
    if (!user || !user.id) {
      return
    }

    // 대시보드 구독
    const dashboardChannel = subscribeToDashboard(
      user.id,
      companyName,
      (update) => {
        setIsConnected(true)
        setLastUpdate(new Date())
        onDashboardUpdate?.(update)
      },
      (error) => {
        console.error('대시보드 구독 오류:', error)
        setIsConnected(false)
      }
    )
    dashboardChannelRef.current = dashboardChannel

    // 리포트 구독
    const reportsChannel = subscribeToReports(
      user.id,
      companyName,
      (update) => {
        setIsConnected(true)
        setLastUpdate(new Date())
        onReportUpdate?.(update)
      },
      (error) => {
        console.error('리포트 구독 오류:', error)
        setIsConnected(false)
      }
    )
    reportsChannelRef.current = reportsChannel

    // 구독 상태 확인
    if (dashboardChannel || reportsChannel) {
      setIsConnected(true)
    }

    // 클린업
    return () => {
      unsubscribe(dashboardChannel)
      unsubscribe(reportsChannel)
    }
  }, [companyName, onDashboardUpdate, onReportUpdate])

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 flex items-center gap-3">
        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <Wifi className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-700">실시간 연결됨</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">연결 안 됨</span>
            </>
          )}
        </div>
        {lastUpdate && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <RefreshCw className="w-3 h-3" />
            <span>{lastUpdate.toLocaleTimeString('ko-KR')}</span>
          </div>
        )}
      </div>
    </div>
  )
}
