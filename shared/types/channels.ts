// 온라인 채널 진단 공용 타입 정의

export interface OnlineChannelDiagnosticsData {
  youtube: {
    video_mentions_growth: number
    viral_index: number
  }
  tiktok?: {
    video_mentions_growth: number
    viral_index: number
  }
  instagram: {
    engagement_index: number
    hashtag_spread_rank: string
  }
  threads?: {
    engagement_index: number
    hashtag_spread_rank: string
  }
  naver_cafe?: {
    positive_review_ratio: number
    response_speed: string
  }
  daum_cafe?: {
    positive_review_ratio: number
    response_speed: string
  }
  own_mall?: {
    conversion_rate: number
    repeat_visit_rate: number
  }
  x_twitter?: {
    mentions_growth: number
    engagement_rate: number
  }
  smartstore?: {
    conversion_rate: number
    review_score: number
  }
  coupang?: {
    sales_performance: number
    review_score: number
  }
  facebook?: {
    engagement_index: number
    reach_growth: number
  }
  youtube_shorts?: {
    views_growth: number
    engagement_rate: number
  }
}

export interface OnlineChannelDiagnosticsProps {
  diagnostics: OnlineChannelDiagnosticsData
  analysis_type?: 'actual' | 'inference' | 'unavailable'
  analysis_type_label?: string
  analysis_type_description?: string
}
