/**
 * 체크리스트 유틸리티 함수
 * 업계 벤치마크와 연동하여 점수 계산 및 개선안 생성
 */

import { ChecklistItem, BenchmarkCriteria } from '@/data/checklists/organic_search'
import { findBenchmarkTier, calculateScoreFromBenchmark } from '@/data/benchmarks'

/**
 * 현재 측정값으로부터 점수 계산
 */
export function calculateScoreFromValue(
  item: ChecklistItem,
  currentValue: string | number
): number {
  // 업계 벤치마크 기준으로 점수 계산
  if (item.industry_benchmark && item.industry_benchmark.length > 0) {
    // 숫자 값인 경우
    if (typeof currentValue === 'number') {
      // 벤치마크 기준값과 비교
      for (const benchmark of item.industry_benchmark) {
        if (typeof benchmark.value === 'number') {
          if (currentValue <= benchmark.value) {
            return benchmark.score
          }
        }
      }
      // 가장 낮은 점수 반환
      return item.industry_benchmark[item.industry_benchmark.length - 1].score
    }
    
    // 문자열 값인 경우 (예: "optimal", "good")
    if (typeof currentValue === 'string') {
      const matchedBenchmark = item.industry_benchmark.find(
        b => b.value === currentValue
      )
      if (matchedBenchmark) {
        return matchedBenchmark.score
      }
    }
  }
  
  // 기본값: 최대 점수의 50%
  return Math.floor(item.max_score * 0.5)
}

/**
 * 점수 개선 시 기대 효과 계산
 */
export function calculateExpectedImprovement(
  item: ChecklistItem,
  currentScore: number,
  targetScore: number
): {
  scoreIncrease: number
  cvrImpact: number
  description: string
} {
  const scoreIncrease = targetScore - currentScore
  
  // CVR 영향 계산 (항목별 가중치 적용)
  const cvrWeight: Record<string, number> = {
    '페이지 로딩 속도': 7,
    'Core Web Vitals': 8,
    'Meta Title 최적화': 3,
    'Meta Description 최적화': 5,
    '타겟 키워드 최적화': 4,
    '콘텐츠 길이': 6,
    'E-E-A-T': 5,
    '권위 백링크': 3
  }
  
  const baseCVRImpact = cvrWeight[item.item] || 2
  const cvrImpact = (scoreIncrease / item.max_score) * baseCVRImpact
  
  const description = `${item.item} 개선 시 +${scoreIncrease}점, CVR +${cvrImpact.toFixed(1)}%`
  
  return {
    scoreIncrease,
    cvrImpact: Math.round(cvrImpact * 10) / 10,
    description
  }
}

/**
 * 우선순위별 개선 항목 추천
 */
export function getRecommendedImprovements(
  items: ChecklistItem[],
  limit: number = 5
): Array<{
  item: ChecklistItem
  currentScore: number
  potentialScore: number
  scoreIncrease: number
  cvrImpact: number
  priority: 'high' | 'medium' | 'low'
}> {
  const recommendations: Array<{
    item: ChecklistItem
    currentScore: number
    potentialScore: number
    scoreIncrease: number
    cvrImpact: number
    priority: 'high' | 'medium' | 'low'
  }> = []
  
  items.forEach(item => {
    const currentScore = item.current_score || calculateScoreFromValue(item, item.current_value || 0)
    const potentialScore = item.max_score
    const scoreIncrease = potentialScore - currentScore
    
    if (scoreIncrease > 0) {
      const improvement = calculateExpectedImprovement(item, currentScore, potentialScore)
      
      recommendations.push({
        item,
        currentScore,
        potentialScore,
        scoreIncrease,
        cvrImpact: improvement.cvrImpact,
        priority: item.priority
      })
    }
  })
  
  // 우선순위 및 CVR 영향 순으로 정렬
  return recommendations
    .sort((a, b) => {
      // 우선순위 먼저
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      // CVR 영향 순
      return b.cvrImpact - a.cvrImpact
    })
    .slice(0, limit)
}

/**
 * 카테고리별 점수 요약
 */
export function getCategorySummary(
  items: ChecklistItem[]
): Record<string, {
  maxPoints: number
  currentPoints: number
  completionRate: number
  items: ChecklistItem[]
}> {
  const categoryMap: Record<string, ChecklistItem[]> = {}
  
  items.forEach(item => {
    if (!categoryMap[item.category]) {
      categoryMap[item.category] = []
    }
    categoryMap[item.category].push(item)
  })
  
  const summary: Record<string, {
    maxPoints: number
    currentPoints: number
    completionRate: number
    items: ChecklistItem[]
  }> = {}
  
  Object.entries(categoryMap).forEach(([category, categoryItems]) => {
    const maxPoints = categoryItems.reduce((sum, item) => sum + item.max_score, 0)
    const currentPoints = categoryItems.reduce((sum, item) => {
      const score = item.current_score || calculateScoreFromValue(item, item.current_value || 0)
      return sum + score
    }, 0)
    const completionRate = maxPoints > 0 ? (currentPoints / maxPoints) * 100 : 0
    
    summary[category] = {
      maxPoints,
      currentPoints: Math.round(currentPoints),
      completionRate: Math.round(completionRate),
      items: categoryItems
    }
  })
  
  return summary
}

/**
 * 전체 점수 계산
 */
export function calculateTotalScore(items: ChecklistItem[]): {
  maxScore: number
  currentScore: number
  completionRate: number
} {
  const maxScore = items.reduce((sum, item) => sum + item.max_score, 0)
  const currentScore = items.reduce((sum, item) => {
    const score = item.current_score || calculateScoreFromValue(item, item.current_value || 0)
    return sum + score
  }, 0)
  const completionRate = maxScore > 0 ? (currentScore / maxScore) * 100 : 0
  
  return {
    maxScore,
    currentScore: Math.round(currentScore),
    completionRate: Math.round(completionRate)
  }
}
