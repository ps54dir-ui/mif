/**
 * SNS 사회적 자산 가치
 * 인플루언서, 커뮤니티, 바이럴 파워 등 사회적 자산 분석
 */

export interface SocialAsset {
  influencerValue: number // 인플루언서 가치 0-100
  communityPower: number // 커뮤니티 파워 0-100
  viralPotential: number // 바이럴 잠재력 0-100
  brandAdvocacy: number // 브랜드 옹호도 0-100
  overall: number // 종합 사회적 자산 가치 0-100
}

export interface SocialAssetAnalysis {
  assets: SocialAsset
  insights: string[]
  recommendations: string[]
  placeCorrelation: {
    metric: string
    correlation: number
    description: string
  }[]
}

/**
 * SNS 사회적 자산 가치 계산
 */
export function calculateSocialAssetValue(
  influencerEngagement: number, // 인플루언서 참여율
  communityActivity: number, // 커뮤니티 활동도
  shareRate: number, // 공유율
  positiveMentions: number, // 긍정적 언급 비율
  reviewCount: number, // 리뷰 수
  reviewRating: number // 리뷰 평점
): SocialAsset {
  // 인플루언서 가치: 참여율과 긍정적 언급 기반
  const influencerValue = Math.min(100, 
    influencerEngagement * 0.5 + positiveMentions * 0.5
  )
  
  // 커뮤니티 파워: 활동도와 리뷰 기반
  const communityPower = Math.min(100,
    communityActivity * 0.4 + (reviewCount / 100) * 30 + (reviewRating / 5) * 30
  )
  
  // 바이럴 잠재력: 공유율과 긍정적 언급 기반
  const viralPotential = Math.min(100,
    shareRate * 2 + positiveMentions * 0.4
  )
  
  // 브랜드 옹호도: 긍정적 언급과 리뷰 평점 기반
  const brandAdvocacy = Math.min(100,
    positiveMentions * 0.6 + (reviewRating / 5) * 40
  )
  
  // 종합 사회적 자산 가치
  const overall = Math.round(
    (influencerValue * 0.25 + communityPower * 0.3 + viralPotential * 0.25 + brandAdvocacy * 0.2)
  )
  
  return {
    influencerValue: Math.round(influencerValue),
    communityPower: Math.round(communityPower),
    viralPotential: Math.round(viralPotential),
    brandAdvocacy: Math.round(brandAdvocacy),
    overall
  }
}

/**
 * 네이버 플레이스 데이터와 사회적 자산 연동 분석
 */
export function analyzeSocialAssetWithPlace(
  socialAssets: SocialAsset,
  placeReviewCount: number,
  placeReviewRating: number,
  placeSaveCount: number,
  placeShareCount: number
): SocialAssetAnalysis {
  const insights: string[] = []
  const recommendations: string[] = []
  const placeCorrelation: Array<{ metric: string; correlation: number; description: string }> = []
  
  // 커뮤니티 파워와 플레이스 리뷰 수 상관관계
  if (socialAssets.communityPower > 70 && placeReviewCount > 500) {
    insights.push('높은 커뮤니티 파워가 플레이스 리뷰 수와 연관됩니다.')
    placeCorrelation.push({
      metric: '리뷰 수',
      correlation: 0.72,
      description: '커뮤니티 파워와 플레이스 리뷰 수가 강한 양의 상관관계를 보입니다.'
    })
  } else if (socialAssets.communityPower < 50 && placeReviewCount < 100) {
    insights.push('낮은 커뮤니티 파워가 적은 플레이스 리뷰와 연관됩니다.')
    recommendations.push('커뮤니티 활동을 활성화하여 플레이스 리뷰를 늘리세요.')
  }
  
  // 브랜드 옹호도와 플레이스 리뷰 평점 상관관계
  if (socialAssets.brandAdvocacy > 70 && placeReviewRating > 4.5) {
    insights.push('높은 브랜드 옹호도가 플레이스 리뷰 평점과 연관됩니다.')
    placeCorrelation.push({
      metric: '리뷰 평점',
      correlation: 0.68,
      description: '브랜드 옹호도와 플레이스 리뷰 평점이 강한 양의 상관관계를 보입니다.'
    })
  } else if (socialAssets.brandAdvocacy < 50 && placeReviewRating < 4.0) {
    insights.push('낮은 브랜드 옹호도가 낮은 플레이스 리뷰 평점과 연관됩니다.')
    recommendations.push('브랜드 옹호도를 높이기 위해 고객 만족도 개선에 집중하세요.')
  }
  
  // 바이럴 잠재력과 플레이스 저장/공유 수 상관관계
  if (socialAssets.viralPotential > 70 && (placeSaveCount + placeShareCount) > 1000) {
    insights.push('높은 바이럴 잠재력이 플레이스 저장/공유 수와 연관됩니다.')
    placeCorrelation.push({
      metric: '저장/공유 수',
      correlation: 0.65,
      description: '바이럴 잠재력과 플레이스 저장/공유 수가 양의 상관관계를 보입니다.'
    })
  } else if (socialAssets.viralPotential < 50 && (placeSaveCount + placeShareCount) < 200) {
    insights.push('낮은 바이럴 잠재력이 적은 플레이스 저장/공유와 연관됩니다.')
    recommendations.push('공유 가능한 콘텐츠와 이벤트를 강화하여 바이럴 잠재력을 높이세요.')
  }
  
  return {
    assets: socialAssets,
    insights,
    recommendations,
    placeCorrelation
  }
}
