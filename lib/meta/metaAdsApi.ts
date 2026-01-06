/**
 * 메타 광고 API 모듈
 * Ads Manager 데이터와 GA4 유입 데이터 매칭
 */

export interface MetaAdCreative {
  id: string
  name: string
  imageUrl: string
  headline: string
  description: string
  cta: string
  psychologyType: 'dopamine' | 'cortisol' | 'mixed'
  psychologyScore: number // 0-100
}

export interface MetaAdCampaign {
  id: string
  name: string
  status: 'active' | 'paused' | 'archived'
  budget: number
  impressions: number
  clicks: number
  ctr: number // Click-Through Rate
  cpc: number // Cost Per Click
  spend: number
  conversions: number
  conversionRate: number
  roas: number // Return on Ad Spend
  creatives: MetaAdCreative[]
  startDate: string
  endDate?: string
}

export interface MetaAdsPerformance {
  campaigns: MetaAdCampaign[]
  totalImpressions: number
  totalClicks: number
  totalSpend: number
  totalConversions: number
  averageCTR: number
  averageCPC: number
  averageROAS: number
  lastUpdated: string
}

export interface MetaGA4Match {
  campaignId: string
  campaignName: string
  metaClicks: number
  ga4Sessions: number
  matchRate: number // 메타 클릭 대비 GA4 세션 매칭률
  ga4Conversions: number
  conversionRate: number // GA4 전환율
  attributionGap: number // 메타 전환과 GA4 전환의 차이
}

/**
 * 메타 광고 성과 데이터 가져오기 (모의 API)
 */
export async function fetchMetaAdsPerformance(): Promise<MetaAdsPerformance> {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const creatives: MetaAdCreative[] = [
    {
      id: 'creative-1',
      name: '나이키 에어맥스 프로모션',
      imageUrl: '/images/nike-air-max.jpg',
      headline: 'Just Do It - 새로운 도전을 시작하세요',
      description: '나이키 에어맥스로 더 높이, 더 멀리. 지금 구매하고 특별 할인을 받으세요.',
      cta: '지금 구매하기',
      psychologyType: 'dopamine',
      psychologyScore: 78
    },
    {
      id: 'creative-2',
      name: '나이키 러닝화 한정 판매',
      imageUrl: '/images/nike-running.jpg',
      headline: '마지막 기회! 재고 소진 임박',
      description: '인기 러닝화가 곧 품절됩니다. 놓치지 마세요!',
      cta: '지금 주문하기',
      psychologyType: 'cortisol',
      psychologyScore: 65
    },
    {
      id: 'creative-3',
      name: '나이키 스포츠웨어 컬렉션',
      imageUrl: '/images/nike-sportswear.jpg',
      headline: '프리미엄 스포츠웨어로 완성하는 스타일',
      description: '편안함과 스타일을 동시에. 나이키 스포츠웨어 컬렉션을 만나보세요.',
      cta: '컬렉션 보기',
      psychologyType: 'mixed',
      psychologyScore: 72
    }
  ]
  
  const campaigns: MetaAdCampaign[] = [
    {
      id: 'campaign-1',
      name: '나이키 에어맥스 런칭 캠페인',
      status: 'active',
      budget: 5000000,
      impressions: 2500000,
      clicks: 125000,
      ctr: 5.0,
      cpc: 40,
      spend: 5000000,
      conversions: 3750,
      conversionRate: 3.0,
      roas: 4.5,
      creatives: [creatives[0], creatives[1]],
      startDate: '2024-01-01',
      endDate: '2024-01-31'
    },
    {
      id: 'campaign-2',
      name: '나이키 스포츠웨어 프로모션',
      status: 'active',
      budget: 3000000,
      impressions: 1800000,
      clicks: 90000,
      ctr: 5.0,
      cpc: 33,
      spend: 2970000,
      conversions: 2700,
      conversionRate: 3.0,
      roas: 4.0,
      creatives: [creatives[2]],
      startDate: '2024-01-15'
    }
  ]
  
  return {
    campaigns,
    totalImpressions: campaigns.reduce((sum, c) => sum + c.impressions, 0),
    totalClicks: campaigns.reduce((sum, c) => sum + c.clicks, 0),
    totalSpend: campaigns.reduce((sum, c) => sum + c.spend, 0),
    totalConversions: campaigns.reduce((sum, c) => sum + c.conversions, 0),
    averageCTR: campaigns.reduce((sum, c) => sum + c.ctr, 0) / campaigns.length,
    averageCPC: campaigns.reduce((sum, c) => sum + c.cpc, 0) / campaigns.length,
    averageROAS: campaigns.reduce((sum, c) => sum + c.roas, 0) / campaigns.length,
    lastUpdated: new Date().toISOString()
  }
}

/**
 * 메타 광고 데이터와 GA4 데이터 매칭
 */
export function matchMetaAdsWithGA4(
  metaPerformance: MetaAdsPerformance,
  ga4Sessions: number,
  ga4Conversions: number
): MetaGA4Match[] {
  return metaPerformance.campaigns.map(campaign => {
    // 메타 클릭 대비 GA4 세션 매칭률 계산 (일반적으로 70-90% 매칭)
    const matchRate = 0.75 + Math.random() * 0.15
    const matchedSessions = Math.round(campaign.clicks * matchRate)
    
    // GA4 전환 데이터 매칭
    const conversionRate = (ga4Conversions / ga4Sessions) * 100
    const matchedConversions = Math.round(matchedSessions * (conversionRate / 100))
    
    // 어트리뷰션 갭 계산 (메타 전환과 GA4 전환의 차이)
    const attributionGap = campaign.conversions - matchedConversions
    
    return {
      campaignId: campaign.id,
      campaignName: campaign.name,
      metaClicks: campaign.clicks,
      ga4Sessions: matchedSessions,
      matchRate: matchRate * 100,
      ga4Conversions: matchedConversions,
      conversionRate,
      attributionGap
    }
  })
}
