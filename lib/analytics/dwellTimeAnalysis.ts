/**
 * 체류 시간 분석 모듈
 * 채널별 평균 체류 시간과 CTR-CVR-Retention 연결 분석
 */

export interface ChannelDwellTime {
  channel: string
  averageDwellTime: number // 초 단위
  bounceRate: number
  pagesPerSession: number
  psychologyType: 'dopamine' | 'cortisol' | 'empathy' | 'fear' | 'mixed'
  psychologyScore: number // 0-100
}

export interface DwellTimeDiagnosis {
  channel: string
  currentDwellTime: number
  benchmarkDwellTime: number
  issue: string
  insight: string
  recommendation: string
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  expectedImprovement: string
}

export interface CTRCVRRetentionConnection {
  channel: string
  ctr: number
  cvr: number
  retentionRate: number
  dwellTime: number
  correlation: {
    dwellTimeCTR: number // 체류 시간과 CTR 상관관계
    dwellTimeCVR: number // 체류 시간과 CVR 상관관계
    dwellTimeRetention: number // 체류 시간과 Retention 상관관계
  }
  insight: string
}

/**
 * 채널별 체류 시간 데이터 생성
 */
export function generateChannelDwellTimeData(): ChannelDwellTime[] {
  return [
    {
      channel: '블로그',
      averageDwellTime: 12, // 15초 미만 - 문제
      bounceRate: 75,
      pagesPerSession: 1.2,
      psychologyType: 'fear',
      psychologyScore: 45
    },
    {
      channel: '유튜브',
      averageDwellTime: 180,
      bounceRate: 35,
      pagesPerSession: 2.8,
      psychologyType: 'empathy',
      psychologyScore: 82
    },
    {
      channel: '인스타그램',
      averageDwellTime: 45,
      bounceRate: 55,
      pagesPerSession: 1.8,
      psychologyType: 'dopamine',
      psychologyScore: 75
    },
    {
      channel: '메타 광고',
      averageDwellTime: 25,
      bounceRate: 65,
      pagesPerSession: 1.5,
      psychologyType: 'cortisol',
      psychologyScore: 68
    },
    {
      channel: '네이버 플레이스',
      averageDwellTime: 90,
      bounceRate: 40,
      pagesPerSession: 2.2,
      psychologyType: 'empathy',
      psychologyScore: 78
    }
  ]
}

/**
 * 체류 시간 기반 진단 생성
 */
export function diagnoseDwellTimeIssues(
  channelData: ChannelDwellTime[]
): DwellTimeDiagnosis[] {
  const diagnoses: DwellTimeDiagnosis[] = []
  
  // 채널별 벤치마크 체류 시간 (초)
  const benchmarks: Record<string, number> = {
    '블로그': 60,
    '유튜브': 120,
    '인스타그램': 30,
    '메타 광고': 40,
    '네이버 플레이스': 60
  }
  
  channelData.forEach(channel => {
    const benchmark = benchmarks[channel.channel] || 30
    const isLow = channel.averageDwellTime < benchmark
    
    if (isLow) {
      let issue = ''
      let insight = ''
      let recommendation = ''
      let priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM'
      
      if (channel.averageDwellTime < 15) {
        priority = 'CRITICAL'
        issue = `체류 시간이 ${channel.averageDwellTime}초로 매우 낮습니다 (벤치마크: ${benchmark}초)`
        insight = '사용자가 페이지를 즉시 이탈하고 있습니다. 도입부의 심리적 후킹이 실패했을 가능성이 높습니다.'
        
        if (channel.psychologyType === 'fear') {
          recommendation = `도입부의 심리적 후킹을 '공포'에서 '공감'으로 바꾸세요. 사용자의 고민과 니즈를 공감하는 메시지로 시작하면 체류 시간이 증가합니다.`
        } else if (channel.psychologyType === 'cortisol') {
          recommendation = `긴급성(코르티솔) 위주의 메시지를 줄이고, 사용자의 성공 스토리나 공감대를 형성하는 콘텐츠로 전환하세요.`
        } else {
          recommendation = `도입부에 사용자의 공감을 이끌어내는 스토리나 질문을 배치하여 체류 시간을 늘리세요.`
        }
      } else if (channel.averageDwellTime < benchmark * 0.7) {
        priority = 'HIGH'
        issue = `체류 시간이 ${channel.averageDwellTime}초로 벤치마크(${benchmark}초) 대비 낮습니다`
        insight = '콘텐츠의 초반 경험이 개선이 필요합니다.'
        recommendation = `첫 3초 내에 사용자의 관심을 끌 수 있는 시각적 요소나 메시지를 강화하세요.`
      }
      
      const expectedImprovement = priority === 'CRITICAL' 
        ? '체류 시간 200% 증가 예상'
        : '체류 시간 50% 증가 예상'
      
      diagnoses.push({
        channel: channel.channel,
        currentDwellTime: channel.averageDwellTime,
        benchmarkDwellTime: benchmark,
        issue,
        insight,
        recommendation,
        priority,
        expectedImprovement
      })
    }
  })
  
  return diagnoses
}

/**
 * CTR-CVR-Retention 연결 분석
 */
export function analyzeCTRCVRRetentionConnection(
  channelData: ChannelDwellTime[],
  ctrData: Record<string, number>,
  cvrData: Record<string, number>,
  retentionData: Record<string, number>
): CTRCVRRetentionConnection[] {
  return channelData.map(channel => {
    const ctr = ctrData[channel.channel] || 0
    const cvr = cvrData[channel.channel] || 0
    const retention = retentionData[channel.channel] || 0
    const dwellTime = channel.averageDwellTime
    
    // 상관관계 계산 (간단한 시뮬레이션)
    // 체류 시간이 길수록 CTR, CVR, Retention이 높아지는 가정
    const dwellTimeCTR = Math.min(1.0, dwellTime / 180) // 최대 180초 기준
    const dwellTimeCVR = Math.min(1.0, dwellTime / 120) // 최대 120초 기준
    const dwellTimeRetention = Math.min(1.0, dwellTime / 90) // 최대 90초 기준
    
    let insight = ''
    if (dwellTime < 15 && ctr > 4.0) {
      insight = `CTR(${ctr.toFixed(2)}%)은 높으나 체류 시간(${dwellTime}초)이 매우 낮습니다. 광고는 효과적이나 랜딩 페이지가 기대에 못 미칩니다.`
    } else if (dwellTime > 60 && cvr < 2.0) {
      insight = `체류 시간(${dwellTime}초)은 양호하나 전환율(${cvr.toFixed(2)}%)이 낮습니다. 설득력 있는 CTA나 혜택 메시지가 부족할 수 있습니다.`
    } else if (dwellTime > 90 && retention < 20) {
      insight = `체류 시간(${dwellTime}초)과 전환율은 양호하나 재방문율(${retention.toFixed(1)}%)이 낮습니다. 팬덤 형성 전략이 필요합니다.`
    } else {
      insight = `체류 시간(${dwellTime}초)과 전환 지표가 균형을 이루고 있습니다.`
    }
    
    return {
      channel: channel.channel,
      ctr,
      cvr,
      retentionRate: retention,
      dwellTime,
      correlation: {
        dwellTimeCTR: Math.round(dwellTimeCTR * 100) / 100,
        dwellTimeCVR: Math.round(dwellTimeCVR * 100) / 100,
        dwellTimeRetention: Math.round(dwellTimeRetention * 100) / 100
      },
      insight
    }
  })
}
