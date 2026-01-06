/**
 * 상세페이지 레이아웃별 GA4 이탈률 오버레이
 */

export interface PageLayout {
  id: string
  name: string
  position: 'header' | 'hero' | 'features' | 'reviews' | 'cta' | 'footer'
  bounceRate: number
  avgTimeOnSection: number
  clickThroughRate: number
}

export interface PageOverlayData {
  pageUrl: string
  layouts: PageLayout[]
  overallBounceRate: number
  hotspots: Array<{
    x: number
    y: number
    bounceRate: number
    section: string
  }>
}

/**
 * 상세페이지 레이아웃별 이탈률 데이터 생성
 */
export function generatePageOverlayData(
  pageUrl: string,
  overallBounceRate: number
): PageOverlayData {
  const layouts: PageLayout[] = [
    {
      id: 'header',
      name: '헤더',
      position: 'header',
      bounceRate: overallBounceRate * 0.3, // 헤더에서 이탈률 낮음
      avgTimeOnSection: 5,
      clickThroughRate: 85
    },
    {
      id: 'hero',
      name: '히어로 섹션',
      position: 'hero',
      bounceRate: overallBounceRate * 0.8, // 히어로에서 이탈률 높음
      avgTimeOnSection: 15,
      clickThroughRate: 45
    },
    {
      id: 'features',
      name: '제품 특징',
      position: 'features',
      bounceRate: overallBounceRate * 0.6,
      avgTimeOnSection: 30,
      clickThroughRate: 60
    },
    {
      id: 'reviews',
      name: '리뷰 섹션',
      position: 'reviews',
      bounceRate: overallBounceRate * 0.4, // 리뷰에서 이탈률 낮음
      avgTimeOnSection: 45,
      clickThroughRate: 70
    },
    {
      id: 'cta',
      name: '구매 버튼',
      position: 'cta',
      bounceRate: overallBounceRate * 0.2, // CTA에서 이탈률 매우 낮음
      avgTimeOnSection: 10,
      clickThroughRate: 25
    },
    {
      id: 'footer',
      name: '푸터',
      position: 'footer',
      bounceRate: overallBounceRate * 0.1, // 푸터에서 이탈률 매우 낮음
      avgTimeOnSection: 8,
      clickThroughRate: 15
    }
  ]
  
  // 핫스팟 생성 (이탈률이 높은 구간)
  const hotspots = layouts
    .filter(layout => layout.bounceRate > overallBounceRate * 0.5)
    .map((layout, idx) => ({
      x: 50 + (idx * 20), // 간단한 위치 시뮬레이션
      y: 30 + (idx * 15),
      bounceRate: layout.bounceRate,
      section: layout.name
    }))
  
  return {
    pageUrl,
    layouts,
    overallBounceRate,
    hotspots
  }
}
