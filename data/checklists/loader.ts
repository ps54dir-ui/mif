/**
 * 체크리스트 로더
 * 모든 채널의 체크리스트를 로드하고 관리
 */

import { ORGANIC_SEARCH_CHECKLIST, ChecklistItem } from './organic_search'

export type ChecklistChannel = 
  | 'organic_search'
  | 'naver_place'
  | 'youtube'
  | 'meta_ads'
  | 'ga4_funnel'
  | 'sem'
  | 'email'
  | 'social_media'

export interface ChannelChecklistData {
  channel: ChecklistChannel
  items: ChecklistItem[]
  totalPoints: number
  categories: string[]
  dataSource: string
  lastUpdated: string
  description: string
}

/**
 * 채널별 체크리스트 로드
 */
export function loadChecklist(channel: ChecklistChannel): ChannelChecklistData | null {
  let items: ChecklistItem[] = []
  let dataSource = ''
  let description = ''
  
  switch (channel) {
    case 'organic_search':
      items = ORGANIC_SEARCH_CHECKLIST
      dataSource = 'Google Search Central 가이드라인, Moz SEO 벤치마크, Ahrefs 업계 리포트 (2024)'
      description = 'SEO 최적화를 위한 100개 평가 항목 (SEO 기초, 콘텐츠 품질, 기술적 SEO, 백링크 & 권위)'
      break
    case 'naver_place':
      // TODO: Naver Place 체크리스트 구현
      items = []
      dataSource = '네이버 비즈니스 플랫폼 가이드라인, 업계 벤치마크 (2024)'
      description = '네이버 플레이스 최적화를 위한 평가 항목'
      break
    case 'youtube':
      // TODO: YouTube 체크리스트 구현
      items = []
      dataSource = 'YouTube Creator Academy, Social Blade 업계 리포트 (2024)'
      description = 'YouTube 채널 최적화를 위한 평가 항목'
      break
    default:
      return null
  }
  
  if (items.length === 0) {
    return null
  }
  
  const totalPoints = items.reduce((sum, item) => sum + item.max_score, 0)
  const categories = [...new Set(items.map(item => item.category))]
  
  return {
    channel,
    items,
    totalPoints,
    categories,
    dataSource,
    lastUpdated: '2024-01-01',
    description
  }
}

/**
 * 모든 채널의 체크리스트 로드
 */
export function loadAllChecklists(): Record<ChecklistChannel, ChannelChecklistData | null> {
  const channels: ChecklistChannel[] = [
    'organic_search',
    'naver_place',
    'youtube',
    'meta_ads',
    'ga4_funnel',
    'sem',
    'email',
    'social_media'
  ]
  
  const result: Record<string, ChannelChecklistData | null> = {}
  
  channels.forEach(channel => {
    result[channel] = loadChecklist(channel)
  })
  
  return result as Record<ChecklistChannel, ChannelChecklistData | null>
}

/**
 * 체크리스트 항목 검색
 */
export function searchChecklistItems(
  channel: ChecklistChannel,
  query: string
): ChecklistItem[] {
  const checklist = loadChecklist(channel)
  if (!checklist) return []
  
  const lowerQuery = query.toLowerCase()
  return checklist.items.filter(item =>
    item.item.toLowerCase().includes(lowerQuery) ||
    item.description.toLowerCase().includes(lowerQuery) ||
    item.category.toLowerCase().includes(lowerQuery)
  )
}
