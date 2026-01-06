'use client'

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts'
import { AnalysisTypeBadge } from './AnalysisTypeBadge'

interface ChannelDiagnosticsCardProps {
  diagnostics: {
    youtube: {
      score: number
      insight: string
    }
    instagram: {
      score: number
      insight: string
    }
    community: {
      score: number
      insight: string
    }
    tiktok: {
      score: number
      insight: string
    }
    threads?: {
      score: number
      insight: string
    }
    facebook?: {
      score: number
      insight: string
    }
    youtube_shorts?: {
      score: number
      insight: string
    }
  }
  analysis_type?: 'actual' | 'inference' | 'unavailable'
  analysis_type_label?: string
  analysis_type_description?: string
}

export function ChannelDiagnosticsCard({ diagnostics, analysis_type, analysis_type_label, analysis_type_description }: ChannelDiagnosticsCardProps) {
  // 레이더 차트 데이터
  const radarData = [
    {
      channel: '유튜브',
      score: diagnostics.youtube.score
    },
    ...(diagnostics.youtube_shorts ? [{
      channel: '유튜브 쇼츠',
      score: diagnostics.youtube_shorts.score
    }] : []),
    {
      channel: '인스타그램',
      score: diagnostics.instagram.score
    },
    ...(diagnostics.threads ? [{
      channel: '쓰레드',
      score: diagnostics.threads.score
    }] : []),
    {
      channel: '틱톡',
      score: diagnostics.tiktok.score
    },
    {
      channel: '커뮤니티',
      score: diagnostics.community.score
    },
    ...(diagnostics.facebook ? [{
      channel: '페이스북',
      score: diagnostics.facebook.score
    }] : [])
  ]

  const chartData = radarData.map(item => ({
    ...item,
    fullMark: 100
  }))

  return (
    <div className="space-y-6">
      {/* 레이더 차트 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            온라인 채널 진단 레이더 차트
          </h2>
          {/* 분석 타입 배지 */}
          <AnalysisTypeBadge 
            analysisType={analysis_type || 'inference'}
            label={analysis_type_label}
            description={analysis_type_description}
            size="sm"
          />
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={chartData}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis
              dataKey="channel"
              tick={{ fill: '#6b7280', fontSize: 14 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <Radar
              name="채널 점수"
              dataKey="score"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* 각 채널별 상세 진단 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 유튜브 */}
        <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-red-900">유튜브</h3>
            <div className="text-3xl font-bold text-red-600">
              {diagnostics.youtube.score}점
            </div>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            {diagnostics.youtube.insight}
          </p>
        </div>

        {/* 유튜브 쇼츠 */}
        {diagnostics.youtube_shorts && (
          <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-red-900">유튜브 쇼츠</h3>
              <div className="text-3xl font-bold text-red-600">
                {diagnostics.youtube_shorts.score}점
              </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {diagnostics.youtube_shorts.insight}
            </p>
          </div>
        )}

        {/* 인스타그램 */}
        <div className="bg-pink-50 rounded-lg p-6 border-2 border-pink-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-pink-900">인스타그램</h3>
            <div className="text-3xl font-bold text-pink-600">
              {diagnostics.instagram.score}점
            </div>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            {diagnostics.instagram.insight}
          </p>
        </div>

        {/* 쓰레드 */}
        {diagnostics.threads && (
          <div className="bg-indigo-50 rounded-lg p-6 border-2 border-indigo-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-indigo-900">쓰레드</h3>
              <div className="text-3xl font-bold text-indigo-600">
                {diagnostics.threads.score}점
              </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {diagnostics.threads.insight}
            </p>
          </div>
        )}

        {/* 틱톡 */}
        <div className="bg-purple-50 rounded-lg p-6 border-2 border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-purple-900">틱톡</h3>
            <div className="text-3xl font-bold text-purple-600">
              {diagnostics.tiktok.score}점
            </div>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            {diagnostics.tiktok.insight}
          </p>
        </div>

        {/* 커뮤니티 */}
        <div className="bg-orange-50 rounded-lg p-6 border-2 border-orange-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-orange-900">커뮤니티</h3>
            <div className="text-3xl font-bold text-orange-600">
              {diagnostics.community.score}점
            </div>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            {diagnostics.community.insight}
          </p>
        </div>

        {/* 페이스북 */}
        {diagnostics.facebook && (
          <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-blue-900">페이스북</h3>
              <div className="text-3xl font-bold text-blue-600">
                {diagnostics.facebook.score}점
              </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {diagnostics.facebook.insight}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
