/**
 * 크로스 채널 워크플로우
 * 유튜브 바이럴 → 플레이스 예약 연결
 */

export interface WorkflowStep {
  id: string
  channel: string
  action: string
  metric: string
  value: number
  nextStep: string | null
}

export interface CrossChannelWorkflow {
  id: string
  title: string
  description: string
  steps: WorkflowStep[]
  expectedConversion: number // 예상 전환 수
  expectedRevenue: number // 예상 매출
  efficiency: number // 효율 점수 0-100
}

/**
 * 크로스 채널 워크플로우 생성
 */
export function generateCrossChannelWorkflow(
  youtubeViews: number,
  youtubeShares: number,
  placeCurrentReservations: number,
  placeConversionRate: number
): CrossChannelWorkflow {
  const steps: WorkflowStep[] = [
    {
      id: 'youtube-viral',
      channel: 'youtube',
      action: '바이럴 영상 조회',
      metric: '조회수',
      value: youtubeViews,
      nextStep: 'youtube-cta'
    },
    {
      id: 'youtube-cta',
      channel: 'youtube',
      action: '영상 내 플레이스 링크 클릭',
      metric: '클릭률',
      value: Math.round(youtubeViews * 0.05), // 5% 클릭률 가정
      nextStep: 'place-landing'
    },
    {
      id: 'place-landing',
      channel: 'naver_place',
      action: '플레이스 페이지 방문',
      metric: '방문자',
      value: Math.round(youtubeViews * 0.05 * 0.8), // 80% 랜딩률
      nextStep: 'place-reservation'
    },
    {
      id: 'place-reservation',
      channel: 'naver_place',
      action: '예약 완료',
      metric: '예약 수',
      value: Math.round(youtubeViews * 0.05 * 0.8 * (placeConversionRate / 100)),
      nextStep: null
    }
  ]
  
  const finalReservations = steps[steps.length - 1].value
  const expectedRevenue = finalReservations * 50000 // 평균 예약당 5만원 가정
  const efficiency = Math.min(100, (finalReservations / youtubeViews) * 10000) // 효율 점수
  
  return {
    id: 'youtube-to-place',
    title: '유튜브 바이럴 → 네이버 플레이스 예약 연결',
    description: '유튜브 영상의 바이럴 파워를 네이버 플레이스 예약으로 직접 연결하는 워크플로우',
    steps,
    expectedConversion: finalReservations,
    expectedRevenue,
    efficiency: Math.round(efficiency)
  }
}
