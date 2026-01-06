/**
 * 전환율 분석 모듈
 * 네이버 플레이스 순위와 전환율(CVR) 데이터 매칭
 */

export interface NaverPlaceRanking {
  date: string
  keyword: string
  rank: number
  impressions: number
  clicks: number
}

export interface ConversionData {
  date: string
  channel: string
  visitors: number
  conversions: number
  conversionRate: number // CVR (%)
  revenue: number
}

export interface ChannelEfficiency {
  channel: string
  visitors: number
  conversions: number
  conversionRate: number
  revenue: number
  efficiencyScore: number // 0-100
  costPerConversion: number
}

/**
 * 네이버 플레이스 순위와 전환율 매칭
 */
export function matchPlaceRankingWithConversion(
  placeRankings: NaverPlaceRanking[],
  conversionData: ConversionData[]
): Array<{
  date: string
  keyword: string
  rank: number
  conversionRate: number
  revenue: number
  correlation: number // 순위와 전환율의 상관관계
}> {
  const matched = placeRankings.map(ranking => {
    const conversion = conversionData.find(
      c => c.date === ranking.date && c.channel === 'naver_place'
    )
    
    if (!conversion) {
      return {
        date: ranking.date,
        keyword: ranking.keyword,
        rank: ranking.rank,
        conversionRate: 0,
        revenue: 0,
        correlation: 0
      }
    }
    
    // 순위가 높을수록(숫자가 작을수록) 전환율이 높아지는 상관관계 계산
    const correlation = ranking.rank <= 3 ? 0.9 : ranking.rank <= 10 ? 0.7 : 0.5
    
    return {
      date: ranking.date,
      keyword: ranking.keyword,
      rank: ranking.rank,
      conversionRate: conversion.conversionRate,
      revenue: conversion.revenue,
      correlation
    }
  })
  
  return matched
}

/**
 * 채널별 전환 효율 분석
 */
export function analyzeChannelEfficiency(
  conversionData: ConversionData[]
): ChannelEfficiency[] {
  const channelMap = new Map<string, {
    visitors: number
    conversions: number
    revenue: number
  }>()
  
  // 채널별 데이터 집계
  conversionData.forEach(data => {
    const existing = channelMap.get(data.channel) || {
      visitors: 0,
      conversions: 0,
      revenue: 0
    }
    
    channelMap.set(data.channel, {
      visitors: existing.visitors + data.visitors,
      conversions: existing.conversions + data.conversions,
      revenue: existing.revenue + data.revenue
    })
  })
  
  // 효율 점수 계산
  const efficiencies: ChannelEfficiency[] = []
  let maxConversionRate = 0
  let maxRevenue = 0
  
  channelMap.forEach((data, channel) => {
    const conversionRate = data.visitors > 0 
      ? (data.conversions / data.visitors) * 100 
      : 0
    
    if (conversionRate > maxConversionRate) maxConversionRate = conversionRate
    if (data.revenue > maxRevenue) maxRevenue = data.revenue
  })
  
  channelMap.forEach((data, channel) => {
    const conversionRate = data.visitors > 0 
      ? (data.conversions / data.visitors) * 100 
      : 0
    
    const costPerConversion = data.conversions > 0 
      ? data.revenue / data.conversions 
      : 0
    
    // 효율 점수 = (전환율 점수 50% + 매출 점수 50%)
    const conversionRateScore = maxConversionRate > 0 
      ? (conversionRate / maxConversionRate) * 50 
      : 0
    const revenueScore = maxRevenue > 0 
      ? (data.revenue / maxRevenue) * 50 
      : 0
    const efficiencyScore = conversionRateScore + revenueScore
    
    efficiencies.push({
      channel,
      visitors: data.visitors,
      conversions: data.conversions,
      conversionRate: Math.round(conversionRate * 100) / 100,
      revenue: data.revenue,
      efficiencyScore: Math.round(efficiencyScore * 100) / 100,
      costPerConversion: Math.round(costPerConversion)
    })
  })
  
  // 효율 점수 기준 내림차순 정렬
  return efficiencies.sort((a, b) => b.efficiencyScore - a.efficiencyScore)
}

/**
 * 플레이스 순위 상승 시 전환율 변화 예측
 */
export function predictConversionByRankChange(
  currentRank: number,
  targetRank: number,
  currentConversionRate: number
): {
  predictedConversionRate: number
  improvement: number
  expectedRevenueIncrease: number
} {
  // 순위 개선에 따른 전환율 증가율 (경험적 데이터 기반)
  const rankImprovement = currentRank - targetRank
  const conversionMultiplier = 1 + (rankImprovement * 0.15) // 순위 1개 개선당 15% 증가
  
  const predictedConversionRate = currentConversionRate * conversionMultiplier
  const improvement = predictedConversionRate - currentConversionRate
  
  // 예상 매출 증가 (전환율 증가 * 평균 주문 금액)
  const avgOrderValue = 150000 // 평균 주문 금액 (가정)
  const monthlyVisitors = 10000 // 월 방문자 수 (가정)
  const expectedRevenueIncrease = (improvement / 100) * monthlyVisitors * avgOrderValue
  
  return {
    predictedConversionRate: Math.round(predictedConversionRate * 100) / 100,
    improvement: Math.round(improvement * 100) / 100,
    expectedRevenueIncrease: Math.round(expectedRevenueIncrease)
  }
}
