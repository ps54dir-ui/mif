'use client'

import React, { useState } from 'react'
import type { ChannelStrategy } from '@/lib/types/consulting'

interface ChannelDetailedStrategyProps {
  strategy: ChannelStrategy
  brandName?: string
}

export function ChannelDetailedStrategy({ strategy, brandName = '브랜드' }: ChannelDetailedStrategyProps) {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'overview' | 'content' | 'engagement' | 'paid'>('overview')

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">📱 채널별 상세 전략</h2>
            <p className="text-teal-100 text-sm">각 채널의 현재 상태, 목표, 실행 전략</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 채널 선택 탭 */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
          {strategy.channels.map((channel) => (
            <button
              key={channel.channelName}
              onClick={() => setSelectedChannel(
                selectedChannel === channel.channelName ? null : channel.channelName
              )}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedChannel === channel.channelName
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {channel.channelName}
            </button>
          ))}
        </div>

        {/* 선택된 채널 상세 */}
        {selectedChannel && (() => {
          const channel = strategy.channels.find(c => c.channelName === selectedChannel)
          if (!channel) return null

          return (
            <div className="space-y-6">
              {/* 현재 vs 목표 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                  <h3 className="font-bold text-blue-900 mb-4">현재 상태</h3>
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg border border-blue-200 p-3">
                      <div className="text-sm text-gray-600 mb-1">팔로워</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {channel.currentMetrics.followers.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg border border-blue-200 p-3">
                      <div className="text-sm text-gray-600 mb-1">참여율</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {channel.currentMetrics.engagement.rate}%
                      </div>
                    </div>
                    <div className="bg-white rounded-lg border border-blue-200 p-3">
                      <div className="text-sm text-gray-600 mb-1">월간 도달</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {channel.currentMetrics.reach.monthlyReach.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
                  <h3 className="font-bold text-purple-900 mb-4">목표 (3-6개월)</h3>
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg border border-purple-200 p-3">
                      <div className="text-sm text-gray-600 mb-1">3개월 목표</div>
                      <div className="text-lg font-bold text-purple-600">
                        팔로워: {channel.goals.shortTerm.followers.toLocaleString()} (+{Math.round((channel.goals.shortTerm.followers / channel.currentMetrics.followers - 1) * 100)}%)
                      </div>
                      <div className="text-lg font-bold text-purple-600">
                        참여율: {channel.goals.shortTerm.engagement}% (+{Math.round(channel.goals.shortTerm.engagement - channel.currentMetrics.engagement.rate)}%p)
                      </div>
                    </div>
                    <div className="bg-white rounded-lg border border-purple-200 p-3">
                      <div className="text-sm text-gray-600 mb-1">6개월 목표</div>
                      <div className="text-lg font-bold text-purple-600">
                        팔로워: {channel.goals.mediumTerm.followers.toLocaleString()} (+{Math.round((channel.goals.mediumTerm.followers / channel.currentMetrics.followers - 1) * 100)}%)
                      </div>
                      <div className="text-lg font-bold text-purple-600">
                        참여율: {channel.goals.mediumTerm.engagement}% (+{Math.round(channel.goals.mediumTerm.engagement - channel.currentMetrics.engagement.rate)}%p)
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 벤치마크 */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                <h3 className="font-bold text-gray-900 mb-4">벤치마크 비교</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
                    <div className="text-sm text-gray-600 mb-1">당신</div>
                    <div className="text-2xl font-bold text-blue-600">{channel.benchmark.yourEngagement}%</div>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
                    <div className="text-sm text-gray-600 mb-1">최고 경쟁사</div>
                    <div className="text-2xl font-bold text-red-600">{channel.benchmark.topCompetitor}%</div>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
                    <div className="text-sm text-gray-600 mb-1">업계 평균</div>
                    <div className="text-2xl font-bold text-gray-600">{channel.benchmark.industry}%</div>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="text-sm text-yellow-800">
                    <span className="font-medium">기회:</span> {channel.benchmark.opportunity}
                  </div>
                </div>
              </div>

              {/* 전략 탭 */}
              <div className="border-b border-gray-200">
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('overview')}
                    className={`px-4 py-2 rounded-t-lg text-sm font-medium ${
                      viewMode === 'overview' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    개요
                  </button>
                  <button
                    onClick={() => setViewMode('content')}
                    className={`px-4 py-2 rounded-t-lg text-sm font-medium ${
                      viewMode === 'content' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    콘텐츠 전략
                  </button>
                  <button
                    onClick={() => setViewMode('engagement')}
                    className={`px-4 py-2 rounded-t-lg text-sm font-medium ${
                      viewMode === 'engagement' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    참여 전략
                  </button>
                  <button
                    onClick={() => setViewMode('paid')}
                    className={`px-4 py-2 rounded-t-lg text-sm font-medium ${
                      viewMode === 'paid' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    광고 전략
                  </button>
                </div>
              </div>

              {/* 콘텐츠 전략 */}
              {viewMode === 'content' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">콘텐츠 기둥 (Pillars)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {channel.strategy.contentStrategy.pillars.map((pillar, idx) => (
                        <div key={idx} className="bg-white rounded-lg border border-gray-200 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-900">{pillar.pillar}</span>
                            <span className="text-sm font-bold text-teal-600">{pillar.percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div
                              className="bg-teal-600 h-2 rounded-full"
                              style={{ width: `${pillar.percentage}%` }}
                            ></div>
                          </div>
                          <div className="text-sm text-gray-600 mb-1">
                            형식: {pillar.formats.join(', ')}
                          </div>
                          <div className="text-sm text-gray-600">
                            빈도: {pillar.cadence}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">콘텐츠 캘린더 (4주)</h4>
                    <div className="space-y-2">
                      {channel.strategy.contentStrategy.contentCalendar.map((week, idx) => (
                        <div key={idx} className="bg-white rounded-lg border border-gray-200 p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-900">Week {week.week}: {week.theme}</span>
                            <span className="text-sm text-gray-600">{week.posts}개 게시물</span>
                          </div>
                          <div className="text-sm text-gray-600 mb-1">
                            주제: {week.topics.join(', ')}
                          </div>
                          <div className="text-xs text-gray-500">
                            예상 도달: {week.estimatedReach.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 참여 전략 */}
              {viewMode === 'engagement' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">참여 전술</h4>
                    <div className="space-y-3">
                      {channel.strategy.engagementStrategy.tactics.map((tactic, idx) => (
                        <div key={idx} className="bg-white rounded-lg border border-gray-200 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-900">{tactic.tactic}</span>
                            <span className="text-sm font-bold text-green-600">+{tactic.expectedLift}%</span>
                          </div>
                          <div className="text-sm text-gray-600 mb-1">
                            타겟: {tactic.target}
                          </div>
                          <div className="text-sm text-gray-600">
                            기간: {tactic.timeline}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                    <h4 className="font-bold text-blue-900 mb-3">커뮤니티 관리</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="bg-white rounded-lg border border-blue-200 p-3">
                        <div className="text-sm text-gray-600 mb-1">응답 시간</div>
                        <div className="font-bold text-blue-600">{channel.strategy.engagementStrategy.communityManagement.responseTime}</div>
                      </div>
                      <div className="bg-white rounded-lg border border-blue-200 p-3">
                        <div className="text-sm text-gray-600 mb-1">답변률</div>
                        <div className="font-bold text-blue-600">{channel.strategy.engagementStrategy.communityManagement.answerRate}%</div>
                      </div>
                      <div className="bg-white rounded-lg border border-blue-200 p-3">
                        <div className="text-sm text-gray-600 mb-1">전환 전략</div>
                        <div className="text-sm text-gray-700">{channel.strategy.engagementStrategy.communityManagement.conversionStrategy}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 광고 전략 */}
              {viewMode === 'paid' && (
                <div className="space-y-4">
                  <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
                    <h4 className="font-bold text-purple-900 mb-3">월간 예산 배분</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                      <div className="bg-white rounded-lg border border-purple-200 p-3 text-center">
                        <div className="text-sm text-gray-600 mb-1">총 예산</div>
                        <div className="text-xl font-bold text-purple-600">
                          {channel.strategy.paidStrategy.budget.monthly.toLocaleString()}원
                        </div>
                      </div>
                      <div className="bg-white rounded-lg border border-purple-200 p-3 text-center">
                        <div className="text-sm text-gray-600 mb-1">인지도</div>
                        <div className="text-xl font-bold text-purple-600">
                          {channel.strategy.paidStrategy.budget.allocation.awareness}%
                        </div>
                      </div>
                      <div className="bg-white rounded-lg border border-purple-200 p-3 text-center">
                        <div className="text-sm text-gray-600 mb-1">고려</div>
                        <div className="text-xl font-bold text-purple-600">
                          {channel.strategy.paidStrategy.budget.allocation.consideration}%
                        </div>
                      </div>
                      <div className="bg-white rounded-lg border border-purple-200 p-3 text-center">
                        <div className="text-sm text-gray-600 mb-1">전환</div>
                        <div className="text-xl font-bold text-purple-600">
                          {channel.strategy.paidStrategy.budget.allocation.conversion}%
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">캠페인 계획</h4>
                    <div className="space-y-3">
                      {channel.strategy.paidStrategy.campaigns.map((campaign, idx) => (
                        <div key={idx} className="bg-white rounded-lg border border-gray-200 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-900">{campaign.campaignName}</span>
                            <span className="text-sm font-bold text-green-600">ROI: {campaign.expectedROI}%</span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                            <div>목표: {campaign.objective}</div>
                            <div>예산: {campaign.budget.toLocaleString()}원</div>
                            <div>기간: {campaign.duration}</div>
                            <div>타겟: {campaign.targetAudience}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 주간 액션 */}
              <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
                <h4 className="font-bold text-yellow-900 mb-3">주간 액션 아이템</h4>
                <div className="space-y-2">
                  {channel.weeklyActions.map((action, idx) => (
                    <div key={idx} className="bg-white rounded-lg border border-yellow-200 p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{action.action}</div>
                          <div className="text-sm text-gray-600">담당: {action.owner} | 마감: {action.deadline}</div>
                        </div>
                        <div className="text-sm text-yellow-700 font-medium">{action.expectedImpact}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 성공 지표 */}
              <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                <h4 className="font-bold text-green-900 mb-3">성공 지표</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg border border-green-200 p-3">
                    <div className="text-sm text-gray-600 mb-1">주요 KPI</div>
                    <div className="font-bold text-green-600">{channel.successMetrics.primary.metric}</div>
                    <div className="text-sm text-gray-600">목표: {channel.successMetrics.primary.target} | 측정: {channel.successMetrics.primary.measurement}</div>
                  </div>
                  <div className="bg-white rounded-lg border border-green-200 p-3">
                    <div className="text-sm text-gray-600 mb-1">보조 KPI</div>
                    <div className="space-y-1">
                      {channel.successMetrics.secondary.map((metric, idx) => (
                        <div key={idx} className="text-sm">
                          <span className="font-medium">{metric.metric}:</span>{' '}
                          <span className="text-green-600 font-bold">{metric.target}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}
