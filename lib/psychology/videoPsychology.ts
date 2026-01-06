/**
 * 영상 심리 분석 모듈
 * 유튜브/틱톡 시청 지속 심리 지수 및 바이럴 트리거 분석
 */

export interface VideoEngagementMetrics {
  videoId: string
  platform: 'youtube' | 'tiktok'
  title: string
  views: number
  avgWatchDuration: number // 평균 시청 시간 (초)
  totalWatchTime: number // 총 시청 시간 (초)
  retentionRate: number // 시청 지속률 (%)
  likes: number
  comments: number
  shares: number
  completionRate: number // 완료율 (%)
}

export interface ViewingPersistencePsychology {
  videoId: string
  persistenceScore: number // 시청 지속 심리 지수 (0-100)
  psychologyFactors: Array<{
    factor: string
    impact: number
    description: string
  }>
  engagementLevel: 'HIGH' | 'MEDIUM' | 'LOW'
}

export interface ViralTrigger {
  videoId: string
  triggerType: 'curiosity' | 'emotion' | 'controversy' | 'trend' | 'humor' | 'value'
  strength: number // 0-100
  description: string
  evidence: string[]
}

/**
 * 시청 지속 심리 지수 계산
 */
export function calculateViewingPersistencePsychology(
  metrics: VideoEngagementMetrics
): ViewingPersistencePsychology {
  const factors: Array<{ factor: string; impact: number; description: string }> = []
  
  // 완료율이 높으면 시청 지속 심리가 강함
  if (metrics.completionRate > 70) {
    factors.push({
      factor: '높은 완료율',
      impact: (metrics.completionRate - 70) * 0.5,
      description: '대부분의 시청자가 영상을 끝까지 봤습니다. 콘텐츠 몰입도가 높습니다.'
    })
  } else if (metrics.completionRate < 40) {
    factors.push({
      factor: '낮은 완료율',
      impact: -(40 - metrics.completionRate) * 0.3,
      description: '시청자가 중간에 이탈하는 비율이 높습니다. 후킹 포인트가 부족합니다.'
    })
  }
  
  // 시청 지속률이 높으면 심리적 몰입이 높음
  if (metrics.retentionRate > 60) {
    factors.push({
      factor: '높은 시청 지속률',
      impact: (metrics.retentionRate - 60) * 0.4,
      description: '시청자가 영상 중간까지 지속적으로 시청합니다.'
    })
  }
  
  // 평균 시청 시간이 길면 몰입도가 높음
  const avgDurationMinutes = metrics.avgWatchDuration / 60
  if (avgDurationMinutes > 5) {
    factors.push({
      factor: '긴 평균 시청 시간',
      impact: (avgDurationMinutes - 5) * 2,
      description: '시청자가 평균적으로 오래 시청합니다. 콘텐츠가 지루하지 않습니다.'
    })
  } else if (avgDurationMinutes < 2) {
    factors.push({
      factor: '짧은 평균 시청 시간',
      impact: -(2 - avgDurationMinutes) * 3,
      description: '시청자가 빨리 이탈합니다. 초반 후킹이 부족합니다.'
    })
  }
  
  // 참여도 (좋아요, 댓글, 공유)
  const engagementRate = ((metrics.likes + metrics.comments * 2 + metrics.shares * 3) / metrics.views) * 100
  if (engagementRate > 5) {
    factors.push({
      factor: '높은 참여도',
      impact: (engagementRate - 5) * 2,
      description: '시청자가 적극적으로 반응합니다. 공감대 형성이 잘 됩니다.'
    })
  }
  
  const totalImpact = factors.reduce((sum, f) => sum + f.impact, 50) // 기본 50점
  const persistenceScore = Math.min(100, Math.max(0, totalImpact))
  
  let engagementLevel: 'HIGH' | 'MEDIUM' | 'LOW'
  if (persistenceScore >= 70) engagementLevel = 'HIGH'
  else if (persistenceScore >= 40) engagementLevel = 'MEDIUM'
  else engagementLevel = 'LOW'
  
  return {
    videoId: metrics.videoId,
    persistenceScore: Math.round(persistenceScore),
    psychologyFactors: factors,
    engagementLevel
  }
}

/**
 * 바이럴 트리거 분석
 */
export function analyzeViralTriggers(
  metrics: VideoEngagementMetrics,
  title: string,
  description: string
): ViralTrigger[] {
  const triggers: ViralTrigger[] = []
  const text = (title + ' ' + description).toLowerCase()
  
  // 호기심 트리거
  const curiosityKeywords = ['비밀', '숨겨진', '이것', '알고싶다', '궁금', '신기', 'secret', 'hidden', 'this', 'want to know']
  const curiosityCount = curiosityKeywords.filter(kw => text.includes(kw)).length
  if (curiosityCount > 0) {
    triggers.push({
      videoId: metrics.videoId,
      triggerType: 'curiosity',
      strength: Math.min(100, curiosityCount * 15 + (metrics.shares / metrics.views) * 100),
      description: '호기심을 자극하는 요소가 강합니다',
      evidence: ['제목에 호기심 키워드 포함', `공유율 ${((metrics.shares / metrics.views) * 100).toFixed(1)}%`]
    })
  }
  
  // 감정 트리거
  const emotionKeywords = ['감동', '눈물', '사랑', '행복', '슬픔', '분노', 'touching', 'tears', 'love', 'happy', 'sad', 'angry']
  const emotionCount = emotionKeywords.filter(kw => text.includes(kw)).length
  if (emotionCount > 0) {
    triggers.push({
      videoId: metrics.videoId,
      triggerType: 'emotion',
      strength: Math.min(100, emotionCount * 12 + (metrics.likes / metrics.views) * 100),
      description: '감정적 공감대를 형성합니다',
      evidence: ['감정 키워드 포함', `좋아요율 ${((metrics.likes / metrics.views) * 100).toFixed(1)}%`]
    })
  }
  
  // 논란 트리거
  const controversyKeywords = ['논란', '충격', '사건', '문제', '이슈', 'controversy', 'shock', 'issue', 'problem']
  const controversyCount = controversyKeywords.filter(kw => text.includes(kw)).length
  if (controversyCount > 0) {
    triggers.push({
      videoId: metrics.videoId,
      triggerType: 'controversy',
      strength: Math.min(100, controversyCount * 20 + (metrics.comments / metrics.views) * 100),
      description: '논란을 일으켜 토론을 유발합니다',
      evidence: ['논란 키워드 포함', `댓글율 ${((metrics.comments / metrics.views) * 100).toFixed(1)}%`]
    })
  }
  
  // 트렌드 트리거
  const trendKeywords = ['트렌드', '인기', '핫', '바이럴', '화제', 'trend', 'popular', 'hot', 'viral', 'trending']
  const trendCount = trendKeywords.filter(kw => text.includes(kw)).length
  if (trendCount > 0 || metrics.views > 100000) {
    triggers.push({
      videoId: metrics.videoId,
      triggerType: 'trend',
      strength: Math.min(100, trendCount * 10 + Math.min(50, (metrics.views / 100000) * 10)),
      description: '트렌드에 부합하여 확산됩니다',
      evidence: ['트렌드 키워드 포함', `조회수 ${metrics.views.toLocaleString()}회`]
    })
  }
  
  // 유머 트리거
  const humorKeywords = ['웃음', '재미', '코미디', '개그', 'funny', 'comedy', 'laugh', 'humor']
  const humorCount = humorKeywords.filter(kw => text.includes(kw)).length
  if (humorCount > 0) {
    triggers.push({
      videoId: metrics.videoId,
      triggerType: 'humor',
      strength: Math.min(100, humorCount * 15 + (metrics.shares / metrics.views) * 100),
      description: '유머 요소가 공유를 유도합니다',
      evidence: ['유머 키워드 포함', `공유율 ${((metrics.shares / metrics.views) * 100).toFixed(1)}%`]
    })
  }
  
  // 가치 트리거
  const valueKeywords = ['팁', '꿀', '정보', '도움', '유용', 'tip', 'hack', 'useful', 'helpful', 'value']
  const valueCount = valueKeywords.filter(kw => text.includes(kw)).length
  if (valueCount > 0) {
    triggers.push({
      videoId: metrics.videoId,
      triggerType: 'value',
      strength: Math.min(100, valueCount * 12 + metrics.completionRate * 0.5),
      description: '실용적 가치가 완료율을 높입니다',
      evidence: ['가치 키워드 포함', `완료율 ${metrics.completionRate.toFixed(1)}%`]
    })
  }
  
  // 강도순 정렬
  return triggers.sort((a, b) => b.strength - a.strength)
}
