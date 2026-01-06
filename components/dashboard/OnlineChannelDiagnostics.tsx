'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { AnalysisTypeBadge } from './AnalysisTypeBadge'

interface OnlineChannelDiagnosticsProps {
  diagnostics: {
    youtube: {
      video_mentions_growth: number  // 200% 상승
      viral_index: number  // 92점
    }
    tiktok: {
      video_mentions_growth: number
      viral_index: number
    }
    instagram: {
      engagement_index: number  // 85점
      hashtag_spread_rank: string  // 상위 1%
    }
    threads: {
      engagement_index: number
      hashtag_spread_rank: string
    }
    naver_cafe?: {
      positive_review_ratio: number  // 78%
      response_speed: string  // '매우 빠름'
    }
    daum_cafe?: {
      positive_review_ratio: number
      response_speed: string
    }
    own_mall?: {
      conversion_rate: number  // 전환율
      repeat_visit_rate: number  // 재방문율
    }
    x_twitter?: {
      mentions_growth: number  // 언급량 증가
      engagement_rate: number  // 참여율
    }
    smartstore?: {
      conversion_rate: number  // 전환율
      review_score: number  // 리뷰 점수
    }
    coupang?: {
      sales_performance: number  // 판매 성과
      review_score: number  // 리뷰 점수
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
  analysis_type?: 'actual' | 'inference' | 'unavailable'
  analysis_type_label?: string
  analysis_type_description?: string
}

export function OnlineChannelDiagnostics({ diagnostics, analysis_type, analysis_type_label, analysis_type_description }: OnlineChannelDiagnosticsProps) {
  const chartData = [
    {
      name: '유튜브',
      '영상 언급량 증가': diagnostics.youtube.video_mentions_growth,
      '바이럴 지수': diagnostics.youtube.viral_index
    },
    ...(diagnostics.tiktok ? [{
      name: '틱톡',
      '영상 언급량 증가': diagnostics.tiktok.video_mentions_growth,
      '바이럴 지수': diagnostics.tiktok.viral_index
    }] : []),
    {
      name: '인스타그램',
      '소통 지수': diagnostics.instagram.engagement_index,
      '해시태그 확산력': 99  // 상위 1% = 99점
    },
    ...(diagnostics.threads ? [{
      name: '쓰레드',
      '소통 지수': diagnostics.threads.engagement_index,
      '해시태그 확산력': 99
    }] : []),
    ...(diagnostics.naver_cafe ? [{
      name: '네이버카페',
      '긍정 후기 비율': diagnostics.naver_cafe.positive_review_ratio,
      '대응 속도 점수': 95  // '매우 빠름' = 95점
    }] : []),
    ...(diagnostics.daum_cafe ? [{
      name: '다음 카페',
      '긍정 후기 비율': diagnostics.daum_cafe.positive_review_ratio,
      '대응 속도 점수': 90
    }] : []),
    ...(diagnostics.own_mall ? [{
      name: '자사몰',
      '전환율': diagnostics.own_mall.conversion_rate,
      '재방문율': diagnostics.own_mall.repeat_visit_rate
    }] : []),
    ...(diagnostics.x_twitter ? [{
      name: 'X',
      '언급량 증가': diagnostics.x_twitter.mentions_growth,
      '참여율': diagnostics.x_twitter.engagement_rate
    }] : []),
    ...(diagnostics.smartstore ? [{
      name: '스마트스토어',
      '전환율': diagnostics.smartstore.conversion_rate,
      '리뷰 점수': diagnostics.smartstore.review_score
    }] : []),
    ...(diagnostics.coupang ? [{
      name: '쿠팡',
      '판매 성과': diagnostics.coupang.sales_performance,
      '리뷰 점수': diagnostics.coupang.review_score
    }] : []),
    ...(diagnostics.facebook ? [{
      name: '페이스북',
      '소통 지수': diagnostics.facebook.engagement_index,
      '도달률 증가': diagnostics.facebook.reach_growth
    }] : []),
    ...(diagnostics.youtube_shorts ? [{
      name: '유튜브 쇼츠',
      '조회수 증가': diagnostics.youtube_shorts.views_growth,
      '참여율': diagnostics.youtube_shorts.engagement_rate * 10  // 퍼센트를 점수로 변환
    }] : [])
  ]

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#f97316']

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          온라인 채널 진단
        </h2>
        {/* 분석 타입 배지 */}
        <AnalysisTypeBadge 
          analysisType={analysis_type || 'inference'}
          label={analysis_type_label}
          description={analysis_type_description}
          size="sm"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
        {/* 유튜브 */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">유튜브</h3>
          <div className="space-y-2">
            <div>
              <div className="text-xs text-gray-600">영상 언급량 증가</div>
              <div className="text-2xl font-bold text-blue-600">
                +{diagnostics.youtube.video_mentions_growth}%
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600">바이럴 지수</div>
              <div className="text-xl font-semibold text-blue-700">
                {diagnostics.youtube.viral_index}점
              </div>
            </div>
          </div>
        </div>

        {/* 틱톡 */}
        {diagnostics.tiktok && (
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <h3 className="text-sm font-semibold text-purple-900 mb-2">틱톡</h3>
            <div className="space-y-2">
              <div>
                <div className="text-xs text-gray-600">영상 언급량 증가</div>
                <div className="text-2xl font-bold text-purple-600">
                  +{diagnostics.tiktok.video_mentions_growth}%
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600">바이럴 지수</div>
                <div className="text-xl font-semibold text-purple-700">
                  {diagnostics.tiktok.viral_index}점
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 인스타그램 */}
        <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
          <h3 className="text-sm font-semibold text-pink-900 mb-2">인스타그램</h3>
          <div className="space-y-2">
            <div>
              <div className="text-xs text-gray-600">소통 지수</div>
              <div className="text-2xl font-bold text-pink-600">
                {diagnostics.instagram.engagement_index}점
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600">해시태그 확산력</div>
              <div className="text-xl font-semibold text-pink-700">
                {diagnostics.instagram.hashtag_spread_rank}
              </div>
            </div>
          </div>
        </div>

        {/* 쓰레드 */}
        {diagnostics.threads && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">쓰레드</h3>
            <div className="space-y-2">
              <div>
                <div className="text-xs text-gray-600">소통 지수</div>
                <div className="text-2xl font-bold text-gray-600">
                  {diagnostics.threads.engagement_index}점
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600">해시태그 확산력</div>
                <div className="text-xl font-semibold text-gray-700">
                  {diagnostics.threads.hashtag_spread_rank}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 네이버카페 */}
        {diagnostics.naver_cafe && (
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h3 className="text-sm font-semibold text-green-900 mb-2">네이버카페</h3>
            <div className="space-y-2">
              <div>
                <div className="text-xs text-gray-600">긍정 후기 비율</div>
                <div className="text-2xl font-bold text-green-600">
                  {diagnostics.naver_cafe.positive_review_ratio}%
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600">대응 속도</div>
                <div className="text-xl font-semibold text-green-700">
                  {diagnostics.naver_cafe.response_speed}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 다음 카페 */}
        {diagnostics.daum_cafe && (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">다음 카페</h3>
            <div className="space-y-2">
              <div>
                <div className="text-xs text-gray-600">긍정 후기 비율</div>
                <div className="text-2xl font-bold text-blue-600">
                  {diagnostics.daum_cafe.positive_review_ratio}%
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600">대응 속도</div>
                <div className="text-xl font-semibold text-blue-700">
                  {diagnostics.daum_cafe.response_speed}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 자사몰 */}
        {diagnostics.own_mall && (
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <h3 className="text-sm font-semibold text-purple-900 mb-2">자사몰</h3>
            <div className="space-y-2">
              <div>
                <div className="text-xs text-gray-600">전환율</div>
                <div className="text-2xl font-bold text-purple-600">
                  {diagnostics.own_mall.conversion_rate}%
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600">재방문율</div>
                <div className="text-xl font-semibold text-purple-700">
                  {diagnostics.own_mall.repeat_visit_rate}%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* X (트위터) */}
        {diagnostics.x_twitter && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">X</h3>
            <div className="space-y-2">
              <div>
                <div className="text-xs text-gray-600">언급량 증가</div>
                <div className="text-2xl font-bold text-gray-600">
                  +{diagnostics.x_twitter.mentions_growth}%
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600">참여율</div>
                <div className="text-xl font-semibold text-gray-700">
                  {diagnostics.x_twitter.engagement_rate}%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 스마트스토어 */}
        {diagnostics.smartstore && (
          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
            <h3 className="text-sm font-semibold text-indigo-900 mb-2">스마트스토어</h3>
            <div className="space-y-2">
              <div>
                <div className="text-xs text-gray-600">전환율</div>
                <div className="text-2xl font-bold text-indigo-600">
                  {diagnostics.smartstore.conversion_rate}%
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600">리뷰 점수</div>
                <div className="text-xl font-semibold text-indigo-700">
                  {diagnostics.smartstore.review_score}점
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 쿠팡 */}
        {diagnostics.coupang && (
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <h3 className="text-sm font-semibold text-orange-900 mb-2">쿠팡</h3>
            <div className="space-y-2">
              <div>
                <div className="text-xs text-gray-600">판매 성과</div>
                <div className="text-2xl font-bold text-orange-600">
                  {diagnostics.coupang.sales_performance}점
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600">리뷰 점수</div>
                <div className="text-xl font-semibold text-orange-700">
                  {diagnostics.coupang.review_score}점
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 페이스북 */}
        {diagnostics.facebook && (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">페이스북</h3>
            <div className="space-y-2">
              <div>
                <div className="text-xs text-gray-600">소통 지수</div>
                <div className="text-2xl font-bold text-blue-600">
                  {diagnostics.facebook.engagement_index}점
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600">도달률 증가</div>
                <div className="text-xl font-semibold text-blue-700">
                  +{diagnostics.facebook.reach_growth}%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 유튜브 쇼츠 */}
        {diagnostics.youtube_shorts && (
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <h3 className="text-sm font-semibold text-red-900 mb-2">유튜브 쇼츠</h3>
            <div className="space-y-2">
              <div>
                <div className="text-xs text-gray-600">조회수 증가</div>
                <div className="text-2xl font-bold text-red-600">
                  +{diagnostics.youtube_shorts.views_growth}%
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600">참여율</div>
                <div className="text-xl font-semibold text-red-700">
                  {diagnostics.youtube_shorts.engagement_rate}%
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="name"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            stroke="#9ca3af"
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            stroke="#9ca3af"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
          <Legend />
          <Bar dataKey="바이럴 지수" name="바이럴 지수" fill="#3b82f6" />
          <Bar dataKey="소통 지수" name="소통 지수" fill="#ec4899" />
          <Bar dataKey="긍정 후기 비율" name="긍정 후기 비율" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
