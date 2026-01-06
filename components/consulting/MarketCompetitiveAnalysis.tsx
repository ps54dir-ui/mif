'use client'

import React, { useState } from 'react'
import type { MarketAnalysis } from '@/lib/types/consulting'

interface MarketCompetitiveAnalysisProps {
  analysis: MarketAnalysis
  brandName?: string
}

export function MarketCompetitiveAnalysis({ analysis, brandName = '브랜드' }: MarketCompetitiveAnalysisProps) {
  const [selectedCompetitor, setSelectedCompetitor] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<'overview' | 'competitors' | 'positioning'>('overview')

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">📊 시장 & 경쟁 분석</h2>
            <p className="text-blue-100 text-sm">시장 규모, 경쟁사 분석, 포지셔닝 전략</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('overview')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'overview' ? 'bg-white text-blue-600' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              개요
            </button>
            <button
              onClick={() => setViewMode('competitors')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'competitors' ? 'bg-white text-blue-600' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              경쟁사
            </button>
            <button
              onClick={() => setViewMode('positioning')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'positioning' ? 'bg-white text-blue-600' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              포지셔닝
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 시장 규모 & 성장 */}
        {viewMode === 'overview' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">시장 규모 & 성장</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg border border-blue-200 p-4">
                  <div className="text-sm text-gray-600 mb-1">현재 시장 규모</div>
                  <div className="text-3xl font-bold text-blue-600">
                    {analysis.marketSize.currentSize.value.toLocaleString()} {analysis.marketSize.currentSize.currency}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{analysis.marketSize.currentSize.period}</div>
                </div>
                <div className="bg-white rounded-lg border border-indigo-200 p-4">
                  <div className="text-sm text-gray-600 mb-1">연간 성장률</div>
                  <div className="text-3xl font-bold text-indigo-600">
                    {analysis.marketSize.growth.yearOverYear}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">YoY</div>
                </div>
                <div className="bg-white rounded-lg border border-purple-200 p-4">
                  <div className="text-sm text-gray-600 mb-1">3년 후 예상</div>
                  <div className="text-3xl font-bold text-purple-600">
                    {analysis.marketSize.growth.projection.threeYear.toLocaleString()} {analysis.marketSize.currentSize.currency}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">CAGR {analysis.marketSize.growth.cagr}%</div>
                </div>
              </div>

              {/* 시장 트렌드 */}
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-3">주요 시장 트렌드</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {analysis.marketSize.marketTrends.map((trend, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        trend.impact === 'positive'
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{trend.trend}</span>
                        <span className={`text-sm font-bold ${
                          trend.impact === 'positive' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          +{trend.growthRate}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 기회 & 위협 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                <h4 className="font-bold text-green-900 mb-3">🚀 기회</h4>
                <div className="space-y-3">
                  {analysis.opportunities.map((opp, index) => (
                    <div key={index} className="bg-white rounded-lg border border-green-200 p-3">
                      <div className="font-semibold text-gray-900 mb-1">{opp.opportunity}</div>
                      <div className="text-sm text-gray-600 mb-2">
                        시장 규모: {opp.estimatedMarketSize.toLocaleString()}억원
                      </div>
                      <div className="text-xs text-gray-500 mb-2">타이밍: {opp.timingWindow}</div>
                      <div className="text-sm text-green-700 font-medium">→ {opp.actionRequired}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-red-50 rounded-lg border border-red-200 p-4">
                <h4 className="font-bold text-red-900 mb-3">⚠️ 위협</h4>
                <div className="space-y-3">
                  {analysis.threats.map((threat, index) => (
                    <div key={index} className="bg-white rounded-lg border border-red-200 p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-900">{threat.threat}</span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          threat.likelihood === 'high' ? 'bg-red-100 text-red-700' :
                          threat.likelihood === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {threat.likelihood === 'high' ? '높음' :
                           threat.likelihood === 'medium' ? '보통' : '낮음'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        영향: {threat.potentialImpact > 0 ? '+' : ''}{threat.potentialImpact}%
                      </div>
                      <div className="text-sm text-red-700 font-medium">→ {threat.contingencyPlan}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 경쟁사 분석 */}
        {viewMode === 'competitors' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">경쟁사 상세 분석</h3>
              <div className="text-sm text-gray-600">
                총 {analysis.competitorAnalysis.length}개 경쟁사
              </div>
            </div>

            {/* 경쟁사 목록 */}
            <div className="space-y-4">
              {analysis.competitorAnalysis.map((competitor) => (
                <div
                  key={competitor.rank}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedCompetitor === competitor.rank
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedCompetitor(
                    selectedCompetitor === competitor.rank ? null : competitor.rank
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-700">
                        #{competitor.rank}
                      </span>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{competitor.companyName}</h4>
                        <div className="text-sm text-gray-600">시장 점유율: {competitor.marketShare}%</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{competitor.marketShare}%</div>
                      <div className="text-xs text-gray-500">시장 점유율</div>
                    </div>
                  </div>

                  {/* 디지털 강점 */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="text-xs text-gray-600 mb-1">브랜드 인지도</div>
                      <div className="text-lg font-bold text-gray-900">{competitor.digitalStrengths.brandRecognition}</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="text-xs text-gray-600 mb-1">웹사이트 UX</div>
                      <div className="text-lg font-bold text-gray-900">{competitor.digitalStrengths.websiteUX}</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="text-xs text-gray-600 mb-1">참여도</div>
                      <div className="text-lg font-bold text-gray-900">{competitor.digitalStrengths.socialMediaEngagement}%</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="text-xs text-gray-600 mb-1">전환율</div>
                      <div className="text-lg font-bold text-gray-900">{competitor.digitalStrengths.conversionRate}%</div>
                    </div>
                  </div>

                  {/* 확장된 정보 */}
                  {selectedCompetitor === competitor.rank && (
                    <div className="mt-4 pt-4 border-t border-gray-300 space-y-4">
                      {/* 마케팅 전략 */}
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">마케팅 전략</h5>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">채널:</span>{' '}
                            {competitor.marketingStrategy.channels.join(', ')}
                          </div>
                          <div>
                            <span className="font-medium">콘텐츠 테마:</span>{' '}
                            {competitor.marketingStrategy.contentThemes.join(', ')}
                          </div>
                          <div>
                            <span className="font-medium">캠페인 빈도:</span>{' '}
                            {competitor.marketingStrategy.campaignFrequency}
                          </div>
                          <div>
                            <span className="font-medium">예상 예산:</span>{' '}
                            {competitor.marketingStrategy.budgetEstimate}
                          </div>
                        </div>
                      </div>

                      {/* 약점 (당신의 기회) */}
                      {competitor.weaknesses.length > 0 && (
                        <div className="bg-green-50 rounded-lg border border-green-200 p-3">
                          <h5 className="font-semibold text-green-900 mb-2">약점 → 당신의 기회</h5>
                          <div className="space-y-2">
                            {competitor.weaknesses.map((weakness, idx) => (
                              <div key={idx} className="text-sm">
                                <div className="font-medium text-gray-900">• {weakness.weakness}</div>
                                <div className="text-green-700 ml-4">
                                  → {weakness.yourOpportunity} (예상 성장: +{weakness.estimatedGain}%)
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 위협 */}
                      {competitor.threats.length > 0 && (
                        <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-3">
                          <h5 className="font-semibold text-yellow-900 mb-2">위협 & 대응 전략</h5>
                          <div className="space-y-2">
                            {competitor.threats.map((threat, idx) => (
                              <div key={idx} className="text-sm">
                                <div className="font-medium text-gray-900">
                                  • {threat.threat} ({threat.impact === 'high' ? '높음' :
                                                       threat.impact === 'medium' ? '보통' : '낮음'})
                                </div>
                                <div className="text-yellow-700 ml-4">→ {threat.yourCounterStrategy}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 포지셔닝 */}
        {viewMode === 'positioning' && (
          <div className="space-y-6">
            {/* 현재 vs 목표 포지션 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                <h3 className="font-bold text-blue-900 mb-4">현재 포지션</h3>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg border border-blue-200 p-3">
                    <div className="text-sm text-gray-600 mb-1">시장 점유율</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {analysis.yourPositioning.currentPosition.marketShare}%
                    </div>
                  </div>
                  <div className="bg-white rounded-lg border border-blue-200 p-3">
                    <div className="text-sm text-gray-600 mb-1">순위</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {analysis.yourPositioning.currentPosition.ranking}위
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">강점 영역</div>
                    <div className="flex flex-wrap gap-2">
                      {analysis.yourPositioning.currentPosition.strengthAreas.map((area, idx) => (
                        <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">약점 영역</div>
                    <div className="flex flex-wrap gap-2">
                      {analysis.yourPositioning.currentPosition.weakAreas.map((area, idx) => (
                        <span key={idx} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
                <h3 className="font-bold text-purple-900 mb-4">목표 포지션 (6개월)</h3>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg border border-purple-200 p-3">
                    <div className="text-sm text-gray-600 mb-1">목표 시장 점유율</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {analysis.yourPositioning.desiredPosition.targetMarketShare}%
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      (+{(analysis.yourPositioning.desiredPosition.targetMarketShare - analysis.yourPositioning.currentPosition.marketShare).toFixed(1)}%p)
                    </div>
                  </div>
                  <div className="bg-white rounded-lg border border-purple-200 p-3">
                    <div className="text-sm text-gray-600 mb-1">목표 순위</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {analysis.yourPositioning.desiredPosition.targetRanking}위
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      ({analysis.yourPositioning.currentPosition.ranking - analysis.yourPositioning.desiredPosition.targetRanking}단계 상승)
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">고유 가치 제안</div>
                    <div className="p-2 bg-white rounded border border-purple-200 text-sm text-gray-900">
                      {analysis.yourPositioning.desiredPosition.uniqueValueProposition}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">차별화 요소</div>
                    <div className="flex flex-wrap gap-2">
                      {analysis.yourPositioning.desiredPosition.differentiation.map((diff, idx) => (
                        <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                          {diff}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 경쟁 우위 */}
            <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border border-green-200 p-4">
              <h3 className="font-bold text-green-900 mb-4">경쟁 우위</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {analysis.yourPositioning.competitiveAdvantage.map((advantage, idx) => (
                  <div key={idx} className="bg-white rounded-lg border border-green-200 p-3">
                    <div className="font-semibold text-gray-900 mb-2">{advantage.advantage}</div>
                    <div className="flex items-center justify-between text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        advantage.defensibility === 'high' ? 'bg-green-100 text-green-700' :
                        advantage.defensibility === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {advantage.defensibility === 'high' ? '높은 방어력' :
                         advantage.defensibility === 'medium' ? '보통 방어력' : '낮은 방어력'}
                      </span>
                      <span className="text-gray-600">모방 시간: {advantage.timeToImitate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
