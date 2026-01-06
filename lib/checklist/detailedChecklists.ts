/**
 * 채널별 상세 체크리스트 (50-100개 항목, 카테고리별 세분화)
 */

import { ChecklistItem, MarketingChannel } from './channelChecklists'

export interface ChecklistCategory {
  name: string
  maxPoints: number
  items: ChecklistItem[]
  completedPoints: number
  completionRate: number
}

export interface DetailedChannelChecklist {
  channel: MarketingChannel
  totalPoints: number
  categories: ChecklistCategory[]
  overallCompletionRate: number
}

/**
 * SEO 체크리스트 (100점 만점, 카테고리별 세분화)
 */
export const SEO_DETAILED_CHECKLIST: ChecklistItem[] = [
  // SEO 기초 (40점) - 10개 항목
  { id: 'seo-basic-001', category: 'SEO 기초', title: 'Meta Title 최적화', description: '각 페이지에 고유하고 설명적인 메타 타이틀 태그 (50-60자)', points: 4, priority: 'high', checked: false, actionItems: ['모든 페이지에 메타 타이틀 추가', '타이틀에 핵심 키워드 포함', '50-60자 이내로 작성'] },
  { id: 'seo-basic-002', category: 'SEO 기초', title: 'Meta Description 최적화', description: '각 페이지에 고유하고 매력적인 메타 디스크립션 (150-160자)', points: 4, priority: 'high', checked: false, actionItems: ['모든 페이지에 메타 디스크립션 추가', 'CTA 포함', '150-160자 이내로 작성'] },
  { id: 'seo-basic-003', category: 'SEO 기초', title: '내부 링크 구조', description: '내부 링크가 논리적으로 연결되어 있고 깊이가 3단계 이하인가?', points: 4, priority: 'high', checked: false, actionItems: ['사이트맵 구조 확인', '내부 링크 최적화', '깊이 3단계 이하로 조정'] },
  { id: 'seo-basic-004', category: 'SEO 기초', title: 'URL 구조 최적화', description: 'URL이 간결하고 키워드를 포함하는가?', points: 4, priority: 'medium', checked: false, actionItems: ['URL에 키워드 포함', '짧고 명확한 URL 구조'] },
  { id: 'seo-basic-005', category: 'SEO 기초', title: '헤딩 태그 구조 (H1-H6)', description: 'H1-H6 태그가 논리적으로 구조화되어 있는가?', points: 4, priority: 'high', checked: false, actionItems: ['각 페이지에 H1 1개만 사용', 'H2-H6 논리적 순서 유지'] },
  { id: 'seo-basic-006', category: 'SEO 기초', title: '이미지 Alt 텍스트', description: '모든 이미지에 적절한 Alt 텍스트가 있는가?', points: 4, priority: 'medium', checked: false, actionItems: ['모든 이미지에 Alt 텍스트 추가', '키워드 포함'] },
  { id: 'seo-basic-007', category: 'SEO 기초', title: 'XML 사이트맵', description: 'XML 사이트맵이 생성되고 제출되었는가?', points: 4, priority: 'high', checked: false, actionItems: ['XML 사이트맵 생성', 'Google Search Console에 제출'] },
  { id: 'seo-basic-008', category: 'SEO 기초', title: '로봇.txt 파일', description: '로봇.txt 파일이 올바르게 설정되어 있는가?', points: 4, priority: 'medium', checked: false, actionItems: ['로봇.txt 파일 생성', '크롤링 규칙 설정'] },
  { id: 'seo-basic-009', category: 'SEO 기초', title: 'HTTPS 사용', description: '사이트가 HTTPS로 보호되고 있는가?', points: 4, priority: 'high', checked: false, actionItems: ['SSL 인증서 설치', 'HTTPS 리다이렉트 설정'] },
  { id: 'seo-basic-010', category: 'SEO 기초', title: '모바일 최적화', description: '모바일 뷰포트 메타 태그와 반응형 디자인이 있는가?', points: 4, priority: 'high', checked: false, actionItems: ['viewport 메타 태그 추가', '모바일 친화적 디자인 확인'] },
  
  // 콘텐츠 품질 (30점) - 6개 항목
  { id: 'seo-content-001', category: '콘텐츠 품질', title: '타겟 키워드 최적화', description: '타겟 키워드가 콘텐츠에 자연스럽게 포함되어 있는가?', points: 5, priority: 'high', checked: false, actionItems: ['키워드 밀도 1-2% 유지', '자연스러운 키워드 배치'] },
  { id: 'seo-content-002', category: '콘텐츠 품질', title: '콘텐츠 길이', description: '콘텐츠가 충분한 길이(최소 1,000자)를 가지고 있는가?', points: 5, priority: 'medium', checked: false, actionItems: ['최소 1,000자 이상 작성', '심층 콘텐츠 제공'] },
  { id: 'seo-content-003', category: '콘텐츠 품질', title: 'E-E-A-T (경험, 전문성, 권위성, 신뢰성)', description: 'E-E-A-T 요소가 충분히 포함되어 있는가?', points: 5, priority: 'high', checked: false, actionItems: ['작성자 프로필 추가', '전문 지식 표시', '신뢰할 수 있는 출처 인용'] },
  { id: 'seo-content-004', category: '콘텐츠 품질', title: '콘텐츠 최신성', description: '콘텐츠가 최신 정보로 업데이트되고 있는가?', points: 5, priority: 'medium', checked: false, actionItems: ['정기적 콘텐츠 업데이트', '최신 정보 반영'] },
  { id: 'seo-content-005', category: '콘텐츠 품질', title: '내부 링크 전략', description: '관련 콘텐츠로의 내부 링크가 전략적으로 배치되어 있는가?', points: 5, priority: 'medium', checked: false, actionItems: ['관련 콘텐츠 링크 추가', '키워드 앵커 텍스트 사용'] },
  { id: 'seo-content-006', category: '콘텐츠 품질', title: '외부 링크 품질', description: '신뢰할 수 있는 외부 사이트로 링크되어 있는가?', points: 5, priority: 'low', checked: false, actionItems: ['권위 있는 사이트 링크', '관련 콘텐츠 링크'] },
  
  // 기술적 SEO (20점) - 5개 항목
  { id: 'seo-tech-001', category: '기술적 SEO', title: '페이지 로딩 속도', description: '페이지 로딩 시간이 3초 이하인가?', points: 4, priority: 'high', checked: false, actionItems: ['이미지 최적화', 'CSS/JS 압축', 'CDN 사용', '캐싱 설정'] },
  { id: 'seo-tech-002', category: '기술적 SEO', title: 'Core Web Vitals', description: 'Core Web Vitals (LCP, FID, CLS) 점수가 양호한가?', points: 4, priority: 'high', checked: false, actionItems: ['LCP 최적화', 'FID 개선', 'CLS 최소화'] },
  { id: 'seo-tech-003', category: '기술적 SEO', title: '구조화된 데이터 (Schema)', description: 'JSON-LD 스키마 마크업이 적용되어 있는가?', points: 4, priority: 'medium', checked: false, actionItems: ['Schema.org 마크업 추가', 'Rich Snippets 테스트'] },
  { id: 'seo-tech-004', category: '기술적 SEO', title: '캐노니컬 URL', description: '중복 콘텐츠 방지를 위한 캐노니컬 URL이 설정되어 있는가?', points: 4, priority: 'medium', checked: false, actionItems: ['캐노니컬 태그 추가', '중복 콘텐츠 확인'] },
  { id: 'seo-tech-005', category: '기술적 SEO', title: '404 에러 처리', description: '404 에러가 적절히 처리되고 리다이렉트가 설정되어 있는가?', points: 4, priority: 'low', checked: false, actionItems: ['404 페이지 최적화', '깨진 링크 수정'] },
  
  // 백링크 & 권위 (10점) - 2개 항목
  { id: 'seo-authority-001', category: '백링크 & 권위', title: '권위 백링크', description: '권위 있는 사이트로부터 백링크를 받고 있는가?', points: 5, priority: 'medium', checked: false, actionItems: ['백링크 구축 전략 수립', '고품질 사이트와 협력'] },
  { id: 'seo-authority-002', category: '백링크 & 권위', title: '도메인 권위 점수', description: '도메인 권위 점수(DA/DR)가 업계 평균 이상인가?', points: 5, priority: 'medium', checked: false, actionItems: ['도메인 권위 점수 확인', '백링크 품질 개선'] }
]

/**
 * Naver Place 체크리스트 (100점 만점)
 */
export const NAVER_PLACE_DETAILED_CHECKLIST: ChecklistItem[] = [
  // 발견성 (30점) - 8개 항목
  { id: 'place-discovery-001', category: '발견성', title: '플레이스 순위', description: '핵심 키워드 검색 시 상위 노출(1-5위)되어 있는가?', points: 4, priority: 'high', checked: false },
  { id: 'place-discovery-002', category: '발견성', title: '검색 최적화', description: '플레이스 이름, 카테고리, 태그가 검색 키워드에 최적화되어 있는가?', points: 4, priority: 'high', checked: false },
  { id: 'place-discovery-003', category: '발견성', title: '플레이스 광고 ROAS', description: '플레이스 광고 ROAS가 3.0 이상인가?', points: 4, priority: 'medium', checked: false },
  { id: 'place-discovery-004', category: '발견성', title: 'CPC 효율', description: 'CPC가 업계 평균 이하인가?', points: 4, priority: 'medium', checked: false },
  { id: 'place-discovery-005', category: '발견성', title: '키워드 다양성', description: '브랜드명 외 확장 키워드로도 노출되는가?', points: 4, priority: 'medium', checked: false },
  { id: 'place-discovery-006', category: '발견성', title: '지역 정보 최적화', description: '지역 정보(주소, 전화번호)가 정확하고 최적화되어 있는가?', points: 3, priority: 'high', checked: false },
  { id: 'place-discovery-007', category: '발견성', title: '영업 시간 정보', description: '영업 시간 정보가 정확하고 업데이트되어 있는가?', points: 3, priority: 'medium', checked: false },
  { id: 'place-discovery-008', category: '발견성', title: '지도 최적화', description: '지도 위치가 정확하고 접근성이 좋은가?', points: 4, priority: 'medium', checked: false },
  
  // 매력도 (40점) - 10개 항목
  { id: 'place-attractiveness-001', category: '매력도', title: '대표 이미지', description: '매력적이고 고품질의 대표 이미지가 있는가?', points: 4, priority: 'high', checked: false },
  { id: 'place-attractiveness-002', category: '매력도', title: '이미지 개수', description: '최소 10장 이상의 고품질 이미지가 있는가?', points: 4, priority: 'high', checked: false },
  { id: 'place-attractiveness-003', category: '매력도', title: '사진 리뷰 비중', description: '리뷰 중 사진 리뷰 비중이 50% 이상인가?', points: 4, priority: 'high', checked: false },
  { id: 'place-attractiveness-004', category: '매력도', title: '상세 설명', description: '매력적이고 정보가 풍부한 상세 설명이 있는가?', points: 4, priority: 'medium', checked: false },
  { id: 'place-attractiveness-005', category: '매력도', title: '메뉴/서비스 정보', description: '메뉴나 서비스 정보가 명확하게 표시되어 있는가?', points: 4, priority: 'medium', checked: false },
  { id: 'place-attractiveness-006', category: '매력도', title: '가격 정보', description: '가격 정보가 투명하게 공개되어 있는가?', points: 4, priority: 'medium', checked: false },
  { id: 'place-attractiveness-007', category: '매력도', title: '혜택/이벤트', description: '특별 혜택이나 이벤트 정보가 표시되어 있는가?', points: 4, priority: 'low', checked: false },
  { id: 'place-attractiveness-008', category: '매력도', title: 'CTR (클릭률)', description: 'CTR이 3% 이상인가?', points: 4, priority: 'high', checked: false },
  { id: 'place-attractiveness-009', category: '매력도', title: '저장하기/공유하기', description: '저장하기나 공유하기 비율이 5% 이상인가?', points: 4, priority: 'medium', checked: false },
  { id: 'place-attractiveness-010', category: '매력도', title: '영상 콘텐츠', description: '영상 콘텐츠가 있는가?', points: 4, priority: 'low', checked: false },
  
  // 전환력 (20점) - 5개 항목
  { id: 'place-conversion-001', category: '전환력', title: '예약 건수', description: '네이버 예약 전환율이 5% 이상인가?', points: 4, priority: 'high', checked: false },
  { id: 'place-conversion-002', category: '전환력', title: '전화 걸기 클릭', description: '전화 걸기 클릭률이 10% 이상인가?', points: 4, priority: 'high', checked: false },
  { id: 'place-conversion-003', category: '전환력', title: '길 찾기 클릭', description: '길 찾기 클릭률이 15% 이상인가?', points: 4, priority: 'medium', checked: false },
  { id: 'place-conversion-004', category: '전환력', title: '예약 프로세스 최적화', description: '예약 프로세스가 간단하고 명확한가?', points: 4, priority: 'high', checked: false },
  { id: 'place-conversion-005', category: '전환력', title: 'CTA 버튼 최적화', description: '명확하고 눈에 띄는 CTA 버튼이 있는가?', points: 4, priority: 'medium', checked: false },
  
  // 브랜드 (10점) - 2개 항목
  { id: 'place-brand-001', category: '브랜드', title: '신뢰도', description: '리뷰 수가 충분하고(100개 이상) 평점이 높은가(4.0 이상)?', points: 5, priority: 'high', checked: false },
  { id: 'place-brand-002', category: '브랜드', title: '리뷰 관리', description: '리뷰 답글률이 80% 이상이고 신속하게 대응하는가?', points: 5, priority: 'high', checked: false }
]

/**
 * YouTube 체크리스트 (100점 만점)
 */
export const YOUTUBE_DETAILED_CHECKLIST: ChecklistItem[] = [
  // 채널 최적화 (25점) - 6개 항목
  { id: 'youtube-channel-001', category: '채널 최적화', title: '채널 아트 & 프로필', description: '매력적인 채널 아트와 프로필 이미지가 있는가?', points: 5, priority: 'high', checked: false },
  { id: 'youtube-channel-002', category: '채널 최적화', title: '채널 설명', description: '명확하고 키워드가 포함된 채널 설명이 있는가?', points: 4, priority: 'high', checked: false },
  { id: 'youtube-channel-003', category: '채널 최적화', title: '채널 트레일러', description: '매력적인 채널 트레일러가 있는가?', points: 4, priority: 'medium', checked: false },
  { id: 'youtube-channel-004', category: '채널 최적화', title: '채널 섹션 구성', description: '채널 섹션이 논리적으로 구성되어 있는가?', points: 4, priority: 'medium', checked: false },
  { id: 'youtube-channel-005', category: '채널 최적화', title: '구독자 수', description: '구독자 수가 지속적으로 증가하고 있는가?', points: 4, priority: 'high', checked: false },
  { id: 'youtube-channel-006', category: '채널 최적화', title: '채널 키워드', description: '채널 키워드가 최적화되어 있는가?', points: 4, priority: 'low', checked: false },
  
  // 콘텐츠 전략 (30점) - 8개 항목
  { id: 'youtube-content-001', category: '콘텐츠 전략', title: '콘텐츠 일관성', description: '정기적으로 콘텐츠를 업로드하고 있는가?', points: 4, priority: 'high', checked: false },
  { id: 'youtube-content-002', category: '콘텐츠 전략', title: '썸네일 최적화', description: '클릭을 유도하는 고품질 썸네일을 사용하는가?', points: 4, priority: 'high', checked: false },
  { id: 'youtube-content-003', category: '콘텐츠 전략', title: '타이틀 최적화', description: '검색 가능하고 클릭을 유도하는 타이틀을 사용하는가?', points: 4, priority: 'high', checked: false },
  { id: 'youtube-content-004', category: '콘텐츠 전략', title: '설명란 최적화', description: '키워드와 링크가 포함된 상세한 설명란이 있는가?', points: 4, priority: 'medium', checked: false },
  { id: 'youtube-content-005', category: '콘텐츠 전략', title: '태그 최적화', description: '관련 태그를 적절히 사용하고 있는가?', points: 4, priority: 'medium', checked: false },
  { id: 'youtube-content-006', category: '콘텐츠 전략', title: '영상 길이', description: '콘텐츠 유형에 맞는 적절한 영상 길이인가?', points: 3, priority: 'medium', checked: false },
  { id: 'youtube-content-007', category: '콘텐츠 전략', title: '영상 품질', description: '고화질 영상(1080p 이상)을 제공하는가?', points: 4, priority: 'high', checked: false },
  { id: 'youtube-content-008', category: '콘텐츠 전략', title: '자막/CC', description: '자막이나 자동 자막이 제공되는가?', points: 3, priority: 'medium', checked: false },
  
  // 참여도 (25점) - 6개 항목
  { id: 'youtube-engagement-001', category: '참여도', title: '평균 시청 시간', description: '평균 시청 시간이 영상 길이의 50% 이상인가?', points: 5, priority: 'high', checked: false },
  { id: 'youtube-engagement-002', category: '참여도', title: '좋아요/싫어요 비율', description: '좋아요 비율이 95% 이상인가?', points: 4, priority: 'high', checked: false },
  { id: 'youtube-engagement-003', category: '참여도', title: '댓글 수', description: '댓글 수가 충분하고 활발한가?', points: 4, priority: 'medium', checked: false },
  { id: 'youtube-engagement-004', category: '참여도', title: '댓글 응답', description: '댓글에 적극적으로 응답하고 있는가?', points: 4, priority: 'high', checked: false },
  { id: 'youtube-engagement-005', category: '참여도', title: '공유 수', description: '공유 수가 증가하고 있는가?', points: 4, priority: 'medium', checked: false },
  { id: 'youtube-engagement-006', category: '참여도', title: '구독 전환율', description: '시청자 대비 구독 전환율이 높은가?', points: 4, priority: 'high', checked: false },
  
  // 커뮤니티 (20점) - 5개 항목
  { id: 'youtube-community-001', category: '커뮤니티', title: '커뮤니티 탭 활용', description: '커뮤니티 탭을 활발히 활용하고 있는가?', points: 4, priority: 'medium', checked: false },
  { id: 'youtube-community-002', category: '커뮤니티', title: '멤버십 프로그램', description: '멤버십 프로그램을 운영하고 있는가?', points: 4, priority: 'low', checked: false },
  { id: 'youtube-community-003', category: '커뮤니티', title: '라이브 스트리밍', description: '정기적으로 라이브 스트리밍을 하는가?', points: 4, priority: 'medium', checked: false },
  { id: 'youtube-community-004', category: '커뮤니티', title: 'Shorts 활용', description: 'YouTube Shorts를 활용하고 있는가?', points: 4, priority: 'medium', checked: false },
  { id: 'youtube-community-005', category: '커뮤니티', title: '협업/게스트', description: '다른 크리에이터와 협업하거나 게스트를 초대하는가?', points: 4, priority: 'low', checked: false }
]

/**
 * 카테고리별로 체크리스트 구성
 */
export function createDetailedChecklist(
  channel: MarketingChannel,
  checkedItems: string[] = []
): DetailedChannelChecklist {
  let items: ChecklistItem[] = []
  
  switch (channel) {
    case 'SEO':
      items = SEO_DETAILED_CHECKLIST
      break
    case 'NAVER_PLACE':
      items = NAVER_PLACE_DETAILED_CHECKLIST
      break
    case 'YOUTUBE':
      items = YOUTUBE_DETAILED_CHECKLIST
      break
    default:
      items = []
  }
  
  // 체크 상태 적용
  const itemsWithChecked = items.map(item => ({
    ...item,
    checked: checkedItems.includes(item.id)
  }))
  
  // 카테고리별로 그룹화
  const categoryMap = new Map<string, ChecklistItem[]>()
  itemsWithChecked.forEach(item => {
    if (!categoryMap.has(item.category)) {
      categoryMap.set(item.category, [])
    }
    categoryMap.get(item.category)!.push(item)
  })
  
  // 카테고리별 정보 계산
  const categories: ChecklistCategory[] = Array.from(categoryMap.entries()).map(([name, categoryItems]) => {
    const maxPoints = categoryItems.reduce((sum, item) => sum + item.points, 0)
    const completedPoints = categoryItems
      .filter(item => item.checked)
      .reduce((sum, item) => sum + item.points, 0)
    const completionRate = maxPoints > 0 ? (completedPoints / maxPoints) * 100 : 0
    
    return {
      name,
      maxPoints,
      items: categoryItems,
      completedPoints,
      completionRate: Math.round(completionRate)
    }
  })
  
  const totalPoints = items.reduce((sum, item) => sum + item.points, 0)
  const totalCompletedPoints = itemsWithChecked
    .filter(item => item.checked)
    .reduce((sum, item) => sum + item.points, 0)
  const overallCompletionRate = totalPoints > 0 ? (totalCompletedPoints / totalPoints) * 100 : 0
  
  return {
    channel,
    totalPoints,
    categories,
    overallCompletionRate: Math.round(overallCompletionRate)
  }
}
