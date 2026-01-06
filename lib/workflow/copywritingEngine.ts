/**
 * AI 카피라이팅 엔진 인터페이스
 * 전략을 기반으로 콘텐츠 생성
 */

export interface CopywritingRequest {
  brand: string
  strategy: string
  description: string
  targetChannel: string
  actions: string[]
  tone: string
  targetAudience: string
  keyMessage: string
}

export interface CopywritingResult {
  id: string
  title: string
  headline: string
  body: string
  callToAction: string
  hashtags: string[]
  platform: string
  createdAt: string
}

/**
 * AI 카피라이팅 엔진 (Mock)
 * 실제로는 백엔드 API를 호출하지만, 현재는 Mock 데이터 반환
 */
export async function generateCopywriting(request: CopywritingRequest): Promise<CopywritingResult> {
  // 실제로는 백엔드 API 호출
  // const response = await fetch('/api/copywriting/generate', {
  //   method: 'POST',
  //   body: JSON.stringify(request)
  // })
  // return await response.json()
  
  // Mock 데이터 반환
  const mockResults: Record<string, CopywritingResult> = {
    community: {
      id: `copy-${Date.now()}`,
      title: '커뮤니티 신뢰도 회복 캠페인',
      headline: `${request.brand}와 함께하는 진정성 있는 스토리`,
      body: `우리는 ${request.brand}의 진정성을 믿습니다. 공식 채널을 통한 정품 인증으로 더욱 안전하고 신뢰할 수 있는 쇼핑 경험을 제공합니다. 리셀 이슈를 해결하고, 고객과의 소통을 강화하여 브랜드 신뢰도를 회복하겠습니다.`,
      callToAction: '공식 채널에서 확인하기',
      hashtags: ['#정품인증', '#신뢰', '#브랜드스토리'],
      platform: request.targetChannel,
      createdAt: new Date().toISOString()
    },
    tiktok: {
      id: `copy-${Date.now()}`,
      title: '틱톡 발견성 향상 캠페인',
      headline: `${request.brand} 챌린지에 도전하세요!`,
      body: `트렌딩 해시태그를 활용한 ${request.brand} 챌린지에 참여하고, 당신만의 스타일을 보여주세요. 바이럴 콘텐츠로 많은 사람들에게 발견되세요!`,
      callToAction: '챌린지 참여하기',
      hashtags: ['#챌린지', '#트렌드', '#바이럴'],
      platform: request.targetChannel,
      createdAt: new Date().toISOString()
    },
    instagram: {
      id: `copy-${Date.now()}`,
      title: '인스타그램 Z세대 참여율 증대 캠페인',
      headline: `Z세대가 선택한 ${request.brand}`,
      body: `릴스 챌린지에 참여하고 ${request.brand}와 함께하는 순간을 공유하세요. UGC 캠페인에 참여하면 특별한 혜택을 드립니다!`,
      callToAction: '릴스 챌린지 참여하기',
      hashtags: ['#릴스챌린지', '#UGC', '#Z세대'],
      platform: request.targetChannel,
      createdAt: new Date().toISOString()
    },
    youtube: {
      id: `copy-${Date.now()}`,
      title: '유튜브 리뷰 콘텐츠 다양성 확대',
      headline: `${request.brand} 신제품 리뷰`,
      body: `다양한 리뷰어들이 ${request.brand}의 신제품을 리뷰합니다. 장기 콘텐츠 시리즈를 통해 제품의 모든 면을 확인해보세요.`,
      callToAction: '리뷰 영상 보기',
      hashtags: ['#리뷰', '#신제품', '#제품리뷰'],
      platform: request.targetChannel,
      createdAt: new Date().toISOString()
    }
  }
  
  return mockResults[request.targetChannel] || mockResults.community
}
