/**
 * 채널별 체크리스트 시스템
 * 각 채널마다 50-100개의 표준화된 체크리스트와 점수 체계
 */

export type MarketingChannel = 
  | 'SEO' 
  | 'SEM' 
  | 'SOCIAL_MEDIA' 
  | 'EMAIL' 
  | 'CONTENT' 
  | 'PAID_ADS'
  | 'YOUTUBE'
  | 'INSTAGRAM'
  | 'TIKTOK'
  | 'NAVER_PLACE'
  | 'BLOG'

export interface ChecklistItem {
  id: string
  category: string // 카테고리 (예: "Technical SEO", "Content Strategy")
  title: string // 체크리스트 항목 제목
  description: string // 상세 설명
  points: number // 해당 항목의 점수
  priority: 'high' | 'medium' | 'low' // 우선순위
  checked: boolean // 체크 여부
  evidence?: string // 증거/참고 자료
  actionItems?: string[] // 구체적 실행 항목
}

export interface ChannelChecklist {
  channel: MarketingChannel
  totalPoints: number // 전체 만점
  items: ChecklistItem[]
  categories: string[] // 카테고리 목록
  completedPoints: number // 완료된 점수
  completionRate: number // 완료율 (0-100)
}

/**
 * SEO 체크리스트 (100개 항목, 총 100점)
 */
export const SEO_CHECKLIST: ChecklistItem[] = [
  // Technical SEO (40점)
  { id: 'seo-001', category: 'Technical SEO', title: '메타 타이틀 최적화', description: '각 페이지에 고유하고 설명적인 메타 타이틀 태그가 있는가? (50-60자)', points: 5, priority: 'high', checked: false, actionItems: ['모든 페이지에 메타 타이틀 추가', '타이틀에 핵심 키워드 포함', '50-60자 이내로 작성'] },
  { id: 'seo-002', category: 'Technical SEO', title: '메타 디스크립션 최적화', description: '각 페이지에 고유하고 매력적인 메타 디스크립션이 있는가? (150-160자)', points: 5, priority: 'high', checked: false, actionItems: ['모든 페이지에 메타 디스크립션 추가', 'CTA 포함', '150-160자 이내로 작성'] },
  { id: 'seo-003', category: 'Technical SEO', title: 'OG 태그 설정', description: '소셜 미디어 공유를 위한 Open Graph 태그가 설정되어 있는가?', points: 5, priority: 'medium', checked: false, actionItems: ['og:title, og:description, og:image 추가'] },
  { id: 'seo-004', category: 'Technical SEO', title: '페이지 로딩 속도 최적화', description: '페이지 로딩 시간이 3초 이하인가?', points: 15, priority: 'high', checked: false, actionItems: ['이미지 최적화', 'CSS/JS 압축', 'CDN 사용', '캐싱 설정'] },
  { id: 'seo-005', category: 'Technical SEO', title: '모바일 최적화', description: '모바일 뷰포트 메타 태그가 설정되어 있고 반응형 디자인인가?', points: 10, priority: 'high', checked: false, actionItems: ['viewport 메타 태그 추가', '모바일 친화적 디자인 확인'] },
  
  // Content SEO - E-E-A-T (60점)
  { id: 'seo-006', category: 'Content SEO', title: 'Experience (경험) 표시', description: '실제 경험 기반 콘텐츠인가? (사용자 리뷰, 케이스 스터디 등)', points: 15, priority: 'high', checked: false, actionItems: ['실제 사용 경험 공유', '케이스 스터디 작성', '사용자 리뷰 포함'] },
  { id: 'seo-007', category: 'Content SEO', title: 'Expertise (전문성) 표시', description: '전문 지식과 자격이 명확히 표시되어 있는가?', points: 15, priority: 'high', checked: false, actionItems: ['작성자 프로필 추가', '전문 자격 인증 표시', '전문 용어 정확히 사용'] },
  { id: 'seo-008', category: 'Content SEO', title: 'Authoritativeness (권위성)', description: '권위 있는 출처를 인용하고 있는가?', points: 15, priority: 'medium', checked: false, actionItems: ['신뢰할 수 있는 출처 인용', '통계 데이터 포함', '전문가 인용'] },
  { id: 'seo-009', category: 'Content SEO', title: 'Trustworthiness (신뢰성)', description: '신뢰할 수 있는 정보인가? (연락처, 약관, 개인정보처리방침 등)', points: 15, priority: 'high', checked: false, actionItems: ['연락처 정보 명시', '약관 페이지 추가', '개인정보처리방침 명시'] },
  
  // 추가 SEO 항목들 (나머지 90개 항목은 간략화)
  { id: 'seo-010', category: 'Technical SEO', title: 'HTTPS 사용', description: '사이트가 HTTPS로 보호되고 있는가?', points: 2, priority: 'high', checked: false },
  { id: 'seo-011', category: 'Technical SEO', title: 'XML 사이트맵', description: 'XML 사이트맵이 제출되어 있는가?', points: 2, priority: 'medium', checked: false },
  { id: 'seo-012', category: 'Technical SEO', title: '로봇.txt 파일', description: '로봇.txt 파일이 올바르게 설정되어 있는가?', points: 1, priority: 'low', checked: false },
  { id: 'seo-013', category: 'Content SEO', title: '헤딩 태그 구조', description: 'H1-H6 태그가 논리적으로 구조화되어 있는가?', points: 3, priority: 'medium', checked: false },
  { id: 'seo-014', category: 'Content SEO', title: '내부 링크 구조', description: '내부 링크가 논리적으로 연결되어 있는가?', points: 3, priority: 'medium', checked: false },
  { id: 'seo-015', category: 'Content SEO', title: '외부 링크 품질', description: '신뢰할 수 있는 외부 사이트로 링크되어 있는가?', points: 2, priority: 'low', checked: false },
  // ... (나머지 85개 항목은 실제 구현 시 추가)
]

/**
 * SEM 체크리스트 (80개 항목, 총 100점)
 */
export const SEM_CHECKLIST: ChecklistItem[] = [
  { id: 'sem-001', category: 'Keyword Strategy', title: '키워드 리서치 완료', description: '타겟 키워드 리서치가 완료되었는가?', points: 10, priority: 'high', checked: false, actionItems: ['Google Keyword Planner 사용', '경쟁사 키워드 분석', '검색량 대비 경쟁도 분석'] },
  { id: 'sem-002', category: 'Keyword Strategy', title: '키워드 매칭 타입 최적화', description: '각 키워드에 적절한 매칭 타입이 설정되어 있는가?', points: 8, priority: 'high', checked: false },
  { id: 'sem-003', category: 'Ad Copy', title: '광고 문구 A/B 테스트', description: '광고 문구 A/B 테스트를 진행하고 있는가?', points: 10, priority: 'high', checked: false },
  { id: 'sem-004', category: 'Ad Copy', title: 'CTA 명확성', description: '광고에 명확한 CTA가 포함되어 있는가?', points: 8, priority: 'high', checked: false },
  { id: 'sem-005', category: 'Landing Page', title: '랜딩 페이지 최적화', description: '광고와 랜딩 페이지 메시지가 일치하는가?', points: 12, priority: 'high', checked: false },
  { id: 'sem-006', category: 'Bidding Strategy', title: '입찰 전략 최적화', description: '목표에 맞는 입찰 전략이 설정되어 있는가?', points: 10, priority: 'medium', checked: false },
  { id: 'sem-007', category: 'Performance', title: '전환 추적 설정', description: '전환 추적이 올바르게 설정되어 있는가?', points: 10, priority: 'high', checked: false },
  { id: 'sem-008', category: 'Performance', title: 'ROAS 모니터링', description: 'ROAS를 정기적으로 모니터링하고 있는가?', points: 8, priority: 'high', checked: false },
  // ... (나머지 72개 항목)
]

/**
 * Social Media 체크리스트 (70개 항목, 총 100점)
 */
export const SOCIAL_MEDIA_CHECKLIST: ChecklistItem[] = [
  { id: 'social-001', category: 'Content Strategy', title: '콘텐츠 캘린더', description: '정기적인 콘텐츠 캘린더가 수립되어 있는가?', points: 10, priority: 'high', checked: false },
  { id: 'social-002', category: 'Content Strategy', title: '브랜드 톤앤매너', description: '일관된 브랜드 톤앤매너가 유지되고 있는가?', points: 8, priority: 'high', checked: false },
  { id: 'social-003', category: 'Engagement', title: '댓글 응답률', description: '댓글 응답률이 80% 이상인가?', points: 12, priority: 'high', checked: false },
  { id: 'social-004', category: 'Engagement', title: '해시태그 전략', description: '효과적인 해시태그 전략이 수립되어 있는가?', points: 8, priority: 'medium', checked: false },
  { id: 'social-005', category: 'Analytics', title: '성과 분석', description: '정기적으로 소셜 미디어 성과를 분석하고 있는가?', points: 10, priority: 'high', checked: false },
  // ... (나머지 65개 항목)
]

/**
 * 채널별 체크리스트 맵
 */
export const CHANNEL_CHECKLISTS: Record<MarketingChannel, ChecklistItem[]> = {
  SEO: SEO_CHECKLIST,
  SEM: SEM_CHECKLIST,
  SOCIAL_MEDIA: SOCIAL_MEDIA_CHECKLIST,
  EMAIL: [], // TODO: 구현 필요
  CONTENT: [], // TODO: 구현 필요
  PAID_ADS: [], // TODO: 구현 필요
  YOUTUBE: [], // TODO: 구현 필요
  INSTAGRAM: [], // TODO: 구현 필요
  TIKTOK: [], // TODO: 구현 필요
  NAVER_PLACE: [], // TODO: 구현 필요
  BLOG: [] // TODO: 구현 필요
}

/**
 * 채널 체크리스트 생성
 */
export function createChannelChecklist(
  channel: MarketingChannel,
  checkedItems: string[] = [] // 체크된 항목 ID 목록
): ChannelChecklist {
  const items = CHANNEL_CHECKLISTS[channel].map(item => ({
    ...item,
    checked: checkedItems.includes(item.id)
  }))
  
  const totalPoints = items.reduce((sum, item) => sum + item.points, 0)
  const completedPoints = items
    .filter(item => item.checked)
    .reduce((sum, item) => sum + item.points, 0)
  const completionRate = totalPoints > 0 ? (completedPoints / totalPoints) * 100 : 0
  
  const categories = [...new Set(items.map(item => item.category))]
  
  return {
    channel,
    totalPoints,
    items,
    categories,
    completedPoints,
    completionRate: Math.round(completionRate)
  }
}

/**
 * 체크리스트 항목 업데이트
 */
export function updateChecklistItem(
  checklist: ChannelChecklist,
  itemId: string,
  checked: boolean
): ChannelChecklist {
  const updatedItems = checklist.items.map(item =>
    item.id === itemId ? { ...item, checked } : item
  )
  
  const completedPoints = updatedItems
    .filter(item => item.checked)
    .reduce((sum, item) => sum + item.points, 0)
  const completionRate = checklist.totalPoints > 0 
    ? (completedPoints / checklist.totalPoints) * 100 
    : 0
  
  return {
    ...checklist,
    items: updatedItems,
    completedPoints,
    completionRate: Math.round(completionRate)
  }
}

/**
 * 우선순위별 체크리스트 필터링
 */
export function filterChecklistByPriority(
  checklist: ChannelChecklist,
  priority: 'high' | 'medium' | 'low'
): ChecklistItem[] {
  return checklist.items.filter(item => item.priority === priority)
}

/**
 * 미완료 항목 중 우선순위 높은 항목 추천
 */
export function getRecommendedItems(
  checklist: ChannelChecklist,
  limit: number = 5
): ChecklistItem[] {
  return checklist.items
    .filter(item => !item.checked)
    .sort((a, b) => {
      // 우선순위: high > medium > low
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      // 같은 우선순위면 점수 높은 순
      return b.points - a.points
    })
    .slice(0, limit)
}
