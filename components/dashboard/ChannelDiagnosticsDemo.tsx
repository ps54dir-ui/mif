'use client'

import { useState } from 'react'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

interface ChannelDiagnosticsDemoProps {
  brandName: string
}

// 나이키 온라인 채널 진단 데이터 (하드코딩)
const nikeChannelData = {
  youtube: {
    score: 92,
    insight: '러닝화 리뷰 키워드 점유율 압도적'
  },
  instagram: {
    score: 85,
    insight: 'Z세대 브랜드 선호도 1위 유지'
  },
  community: {
    score: 70,
    insight: '리셀 시장 과열로 인한 실사용자 불만 모니터링 필요'
  },
  tiktok: {
    score: 88,
    insight: '챌린지 참여를 통한 발견성 지표 우수'
  }
}

export function ChannelDiagnosticsDemo({ brandName }: ChannelDiagnosticsDemoProps) {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null)

  // 레이더 차트 데이터
  const radarData = [
    {
      channel: '유튜브',
      score: nikeChannelData.youtube.score
    },
    {
      channel: '인스타그램',
      score: nikeChannelData.instagram.score
    },
    {
      channel: '커뮤니티/X',
      score: nikeChannelData.community.score
    },
    {
      channel: '틱톡/숏폼',
      score: nikeChannelData.tiktok.score
    }
  ]

  // Bar Chart 데이터
  const barData = radarData.map(item => ({
    name: item.channel,
    점수: item.score
  }))

  // 통찰 카드 데이터
  const insights = [
    {
      title: '유튜브 진단',
      score: nikeChannelData.youtube.score,
      insight: nikeChannelData.youtube.insight,
      color: 'red',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-900',
      scoreColor: 'text-red-600'
    },
    {
      title: '인스타그램 진단',
      score: nikeChannelData.instagram.score,
      insight: nikeChannelData.instagram.insight,
      color: 'pink',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      textColor: 'text-pink-900',
      scoreColor: 'text-pink-600'
    },
    {
      title: '커뮤니티/X 진단',
      score: nikeChannelData.community.score,
      insight: nikeChannelData.community.insight,
      color: 'orange',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-900',
      scoreColor: 'text-orange-600'
    },
    {
      title: '틱톡/숏폼 진단',
      score: nikeChannelData.tiktok.score,
      insight: nikeChannelData.tiktok.insight,
      color: 'purple',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-900',
      scoreColor: 'text-purple-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {brandName} 온라인 채널 진단 리포트
            </h1>
            <p className="text-gray-600 mt-2">종합 분석 및 채널별 인사이트</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            새로 검색
          </button>
        </div>

        {/* 통찰 카드 (간단한 형태) */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-6 shadow-lg mb-6">
          <h2 className="text-xl font-bold text-blue-900 mb-4">
            💡 핵심 통찰 (Insight)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((item, index) => (
              <div
                key={index}
                className={`${item.bgColor} rounded-lg p-4 border-2 ${item.borderColor} cursor-pointer hover:shadow-md transition-shadow`}
                onClick={() => setSelectedChannel(selectedChannel === item.title ? null : item.title)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`text-sm font-semibold ${item.textColor}`}>
                    {item.title}
                  </h3>
                  <div className={`text-2xl font-bold ${item.scoreColor}`}>
                    {item.score}점
                  </div>
                </div>
                <p className={`text-sm ${item.textColor} leading-relaxed`}>
                  {item.insight}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 레이더 차트 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            채널 진단 레이더 차트
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
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

        {/* Bar Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            채널별 점수 비교
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
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
              <Bar dataKey="점수" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 선택된 채널 상세 정보 */}
        {selectedChannel && (
          <div className="bg-white rounded-lg border-2 border-blue-300 p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {selectedChannel} 상세 정보
            </h2>
            {insights.find(item => item.title === selectedChannel) && (
              <div className="space-y-2">
                <div>
                  <span className="font-semibold text-gray-700">점수: </span>
                  <span className="text-blue-600 font-bold">
                    {insights.find(item => item.title === selectedChannel)?.score}점
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">인사이트: </span>
                  <span className="text-gray-700">
                    {insights.find(item => item.title === selectedChannel)?.insight}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 요약 정보 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            종합 요약
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round((nikeChannelData.youtube.score + nikeChannelData.instagram.score + nikeChannelData.community.score + nikeChannelData.tiktok.score) / 4)}
              </div>
              <div className="text-sm text-gray-600">평균 점수</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {nikeChannelData.youtube.score}
              </div>
              <div className="text-sm text-gray-600">최고 점수 (유튜브)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {nikeChannelData.community.score}
              </div>
              <div className="text-sm text-gray-600">최저 점수 (커뮤니티)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {nikeChannelData.youtube.score - nikeChannelData.community.score}
              </div>
              <div className="text-sm text-gray-600">점수 차이</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
