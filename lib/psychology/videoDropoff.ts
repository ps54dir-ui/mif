/**
 * 영상 심리적 이탈 구간 분석
 * 유튜브/틱톡 영상의 이탈 구간을 GA4 이탈률과 매칭
 */

export interface VideoDropoffSegment {
  startTime: number // 시작 시간 (초)
  endTime: number // 종료 시간 (초)
  dropoffRate: number // 이탈률 (%)
  psychologyReason: string // 심리적 이탈 이유
}

export interface VideoDropoffAnalysis {
  videoId: string
  videoTitle: string
  platform: 'youtube' | 'tiktok'
  totalDropoffRate: number // 전체 이탈률
  segments: VideoDropoffSegment[]
  ga4BounceRate: number // GA4 이탈률
  correlation: number // 상관관계
  insights: string[]
  recommendations: string[]
}

/**
 * 영상 이탈 구간 분석
 */
export function analyzeVideoDropoff(
  videoId: string,
  videoTitle: string,
  platform: 'youtube' | 'tiktok',
  retentionData: Array<{ time: number; retention: number }>, // 시간별 시청 지속률
  ga4BounceRate: number
): VideoDropoffAnalysis {
  const segments: VideoDropoffSegment[] = []
  const insights: string[] = []
  const recommendations: string[] = []
  
  // 이탈 구간 식별 (시청 지속률이 10% 이상 떨어지는 구간)
  for (let i = 1; i < retentionData.length; i++) {
    const prevRetention = retentionData[i - 1].retention
    const currRetention = retentionData[i].retention
    const dropoff = prevRetention - currRetention
    
    if (dropoff > 10) {
      // 심리적 이탈 이유 추론
      let psychologyReason = ''
      const time = retentionData[i].time
      
      if (time < 30) {
        psychologyReason = '초반 후킹 실패 - 첫 30초 내 관심을 끌지 못함'
      } else if (time < 60) {
        psychologyReason = '초반 몰입 실패 - 1분 내 콘텐츠가 지루함'
      } else if (time < 180) {
        psychologyReason = '중반 집중력 저하 - 3분 내 흥미 유지 실패'
      } else if (time < 300) {
        psychologyReason = '중후반 지루함 - 5분 내 콘텐츠 전개가 느림'
      } else {
        psychologyReason = '후반 집중력 소진 - 긴 영상으로 인한 피로'
      }
      
      segments.push({
        startTime: retentionData[i - 1].time,
        endTime: retentionData[i].time,
        dropoffRate: dropoff,
        psychologyReason
      })
    }
  }
  
  // 전체 이탈률 계산
  const totalDropoffRate = retentionData.length > 0 
    ? 100 - retentionData[retentionData.length - 1].retention 
    : 0
  
  // GA4 이탈률과 상관관계 계산
  const correlation = Math.abs(totalDropoffRate - ga4BounceRate) < 20 ? 0.75 : 0.45
  
  // 인사이트 생성
  if (correlation > 0.7) {
    insights.push(`영상 이탈률(${totalDropoffRate.toFixed(1)}%)과 GA4 이탈률(${ga4BounceRate.toFixed(1)}%)이 강한 상관관계를 보입니다.`)
  } else {
    insights.push(`영상 이탈률과 GA4 이탈률의 상관관계가 낮습니다. 다른 요인이 영향을 미칠 수 있습니다.`)
  }
  
  // 가장 큰 이탈 구간 찾기
  if (segments.length > 0) {
    const maxDropoff = segments.reduce((max, seg) => 
      seg.dropoffRate > max.dropoffRate ? seg : max
    )
    insights.push(`가장 큰 이탈 구간: ${maxDropoff.startTime}초~${maxDropoff.endTime}초 (${maxDropoff.dropoffRate.toFixed(1)}% 이탈)`)
    insights.push(`심리적 이유: ${maxDropoff.psychologyReason}`)
    
    // 권장사항 생성
    if (maxDropoff.startTime < 30) {
      recommendations.push('초반 30초 내 강력한 후킹 요소(충격적인 사실, 질문, 시각적 임팩트)를 추가하세요.')
    } else if (maxDropoff.startTime < 60) {
      recommendations.push('1분 내 콘텐츠의 속도와 리듬을 조절하여 몰입도를 높이세요.')
    } else if (maxDropoff.startTime < 180) {
      recommendations.push('3분 내 새로운 정보나 시각적 변화를 주어 집중력을 유지하세요.')
    } else {
      recommendations.push('중후반부 콘텐츠 전개 속도를 높이고 핵심 메시지를 명확히 전달하세요.')
    }
  }
  
  return {
    videoId,
    videoTitle,
    platform,
    totalDropoffRate,
    segments,
    ga4BounceRate,
    correlation,
    insights,
    recommendations
  }
}
