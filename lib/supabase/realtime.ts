/**
 * Supabase 실시간 구독 유틸리티
 * 리포트 및 대시보드 데이터 실시간 업데이트
 */

import { createClient, RealtimeChannel } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase 환경 변수가 설정되지 않았습니다.')
}

const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export interface ReportUpdate {
  id: string
  report_name: string
  report_type: string
  company_name: string
  overall_score?: number
  issued_at: string
  version: number
  is_published: boolean
}

export interface DashboardUpdate {
  company_name: string
  overall_score: number
  updated_at: string
}

/**
 * 리포트 변경사항 실시간 구독
 */
export function subscribeToReports(
  userId: string,
  companyName: string,
  onUpdate: (payload: ReportUpdate) => void,
  onError?: (error: Error) => void
): RealtimeChannel | null {
  if (!supabase) {
    console.warn('Supabase 클라이언트가 초기화되지 않았습니다.')
    return null
  }

  try {
    const channel = supabase
      .channel(`reports:${userId}:${companyName}`)
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'saved_reports',
          filter: `user_id=eq.${userId} AND company_name=eq.${companyName}`,
        },
        (payload) => {
          if (payload.new) {
            onUpdate(payload.new as ReportUpdate)
          } else if (payload.old) {
            // 삭제된 경우
            onUpdate(payload.old as ReportUpdate)
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('리포트 실시간 구독 성공')
        } else if (status === 'CHANNEL_ERROR') {
          onError?.(new Error('리포트 구독 오류'))
        }
      })

    return channel
  } catch (error) {
    onError?.(error instanceof Error ? error : new Error('구독 실패'))
    return null
  }
}

/**
 * 대시보드 데이터 실시간 구독
 */
export function subscribeToDashboard(
  userId: string,
  companyName: string,
  onUpdate: (payload: DashboardUpdate) => void,
  onError?: (error: Error) => void
): RealtimeChannel | null {
  if (!supabase) {
    console.warn('Supabase 클라이언트가 초기화되지 않았습니다.')
    return null
  }

  try {
    const channel = supabase
      .channel(`dashboard:${userId}:${companyName}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_dashboard_data',
          filter: `user_id=eq.${userId} AND company_name=eq.${companyName}`,
        },
        (payload) => {
          if (payload.new) {
            const data = payload.new as any
            onUpdate({
              company_name: data.company_name,
              overall_score: data.dashboard_data?.overall_score || 0,
              updated_at: data.updated_at,
            })
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('대시보드 실시간 구독 성공')
        } else if (status === 'CHANNEL_ERROR') {
          onError?.(new Error('대시보드 구독 오류'))
        }
      })

    return channel
  } catch (error) {
    onError?.(error instanceof Error ? error : new Error('구독 실패'))
    return null
  }
}

/**
 * 구독 해제
 */
export function unsubscribe(channel: RealtimeChannel | null): void {
  if (!supabase || !channel) {
    return
  }

  try {
    supabase.removeChannel(channel)
    console.log('구독 해제 완료')
  } catch (error) {
    console.error('구독 해제 실패:', error)
  }
}

/**
 * Supabase 클라이언트 가져오기
 */
export function getSupabaseClient() {
  return supabase
}
