/**
 * 브랜드 히스토리 데이터베이스 인터페이스
 * 진단할 때마다 브랜드의 흑역사와 성장기 기록
 */

export interface BrandHistoryEntry {
  id: string
  brand: string
  date: string
  type: 'DIAGNOSIS' | 'STRATEGY' | 'EXECUTION' | 'SUCCESS' | 'FAILURE'
  title: string
  description: string
  data: Record<string, any>
  tags: string[]
}

export interface BrandHistory {
  brand: string
  entries: BrandHistoryEntry[]
  overallTrend: 'GROWING' | 'STABLE' | 'DECLINING'
  keyMilestones: BrandHistoryEntry[]
  blackHistory: BrandHistoryEntry[]
}

/**
 * 진단 결과를 브랜드 히스토리에 기록
 */
export function archiveDiagnosis(
  brand: string,
  channelScores: Record<string, number>,
  overallScore: number,
  insight: string
): BrandHistoryEntry {
  return {
    id: `history-${Date.now()}`,
    brand,
    date: new Date().toISOString(),
    type: 'DIAGNOSIS',
    title: `${brand} 마케팅 진단 리포트`,
    description: insight,
    data: {
      overallScore,
      channelScores,
      timestamp: new Date().toISOString()
    },
    tags: Object.entries(channelScores)
      .filter(([_, score]) => score < 75)
      .map(([channel]) => channel)
  }
}

/**
 * 전략 수립을 브랜드 히스토리에 기록
 */
export function archiveStrategy(
  brand: string,
  strategyTitle: string,
  strategyDescription: string,
  targetChannel: string
): BrandHistoryEntry {
  return {
    id: `history-${Date.now()}`,
    brand,
    date: new Date().toISOString(),
    type: 'STRATEGY',
    title: strategyTitle,
    description: strategyDescription,
    data: {
      targetChannel,
      timestamp: new Date().toISOString()
    },
    tags: [targetChannel, 'strategy']
  }
}

/**
 * 실행 결과를 브랜드 히스토리에 기록
 */
export function archiveExecution(
  brand: string,
  strategyId: string,
  success: boolean,
  result: string
): BrandHistoryEntry {
  return {
    id: `history-${Date.now()}`,
    brand,
    date: new Date().toISOString(),
    type: success ? 'SUCCESS' : 'FAILURE',
    title: success ? '전략 실행 성공' : '전략 실행 실패',
    description: result,
    data: {
      strategyId,
      success,
      timestamp: new Date().toISOString()
    },
    tags: [success ? 'success' : 'failure', 'execution']
  }
}

/**
 * 브랜드 히스토리 조회 (Mock)
 * 실제로는 백엔드 API를 호출
 */
export async function getBrandHistory(brand: string): Promise<BrandHistory> {
  // 실제로는 백엔드 API 호출
  // const response = await fetch(`/api/brand-history/${brand}`)
  // return await response.json()
  
  // Mock 데이터 반환
  return {
    brand,
    entries: [],
    overallTrend: 'GROWING',
    keyMilestones: [],
    blackHistory: []
  }
}

/**
 * 브랜드 히스토리 저장 (Mock)
 * 실제로는 백엔드 API를 호출
 */
export async function saveBrandHistory(entry: BrandHistoryEntry): Promise<void> {
  // 실제로는 백엔드 API 호출
  // await fetch('/api/brand-history', {
  //   method: 'POST',
  //   body: JSON.stringify(entry)
  // })
  
  // Mock: 로컬 스토리지에 저장
  const history = JSON.parse(localStorage.getItem(`brand-history-${entry.brand}`) || '[]')
  history.push(entry)
  localStorage.setItem(`brand-history-${entry.brand}`, JSON.stringify(history))
}
