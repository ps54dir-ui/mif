'use client'

import React, { useState } from 'react'
import type { CustomerAnalysis } from '@/lib/types/consulting'

interface CustomerPsychologyAnalysisProps {
  analysis: CustomerAnalysis
  brandName?: string
}

export function CustomerPsychologyAnalysis({ analysis, brandName = '브랜드' }: CustomerPsychologyAnalysisProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'journey' | 'psychology'>('profile')
  const [selectedSegment, setSelectedSegment] = useState<number | null>(null)

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">🧠 고객 심리 & 행동 분석</h2>
            <p className="text-pink-100 text-sm">타겟 고객 프로필, 구매 여정, 심리적 영향 요소</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'profile' ? 'bg-white text-pink-600' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              고객 프로필
            </button>
            <button
              onClick={() => setActiveTab('journey')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'journey' ? 'bg-white text-pink-600' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              구매 여정
            </button>
            <button
              onClick={() => setActiveTab('psychology')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'psychology' ? 'bg-white text-pink-600' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              심리 요소
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 고객 프로필 탭 */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* 인구통계 */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
              <h3 className="font-bold text-blue-900 mb-4">인구통계</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white rounded-lg border border-blue-200 p-3 text-center">
                  <div className="text-xs text-gray-600 mb-1">연령대</div>
                  <div className="font-bold text-blue-600">{analysis.targetProfile.demographics.ageRange}</div>
                </div>
                <div className="bg-white rounded-lg border border-blue-200 p-3 text-center">
                  <div className="text-xs text-gray-600 mb-1">성별</div>
                  <div className="font-bold text-blue-600">{analysis.targetProfile.demographics.gender}</div>
                </div>
                <div className="bg-white rounded-lg border border-blue-200 p-3 text-center">
                  <div className="text-xs text-gray-600 mb-1">소득</div>
                  <div className="font-bold text-blue-600">{analysis.targetProfile.demographics.income}</div>
                </div>
                <div className="bg-white rounded-lg border border-blue-200 p-3">
                  <div className="text-xs text-gray-600 mb-1">지역</div>
                  <div className="font-bold text-blue-600 text-sm">
                    {analysis.targetProfile.demographics.location.join(', ')}
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-blue-200 p-3">
                  <div className="text-xs text-gray-600 mb-1">직업</div>
                  <div className="font-bold text-blue-600 text-sm">
                    {analysis.targetProfile.demographics.occupation.join(', ')}
                  </div>
                </div>
              </div>
            </div>

            {/* 라이프스타일 세그먼트 */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4">라이프스타일 세그먼트</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.targetProfile.psychographics.lifestyleSegments.map((segment, index) => (
                  <div
                    key={index}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedSegment === index
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedSegment(selectedSegment === index ? null : index)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-gray-900">{segment.segment}</h4>
                        <div className="text-sm text-gray-600">전체의 {segment.size}%</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-pink-600">{segment.size}%</div>
                        <div className="text-xs text-gray-500">비율</div>
                      </div>
                    </div>

                    <div className="mb-2">
                      <div className="text-xs font-medium text-gray-600 mb-1">특징</div>
                      <div className="flex flex-wrap gap-1">
                        {segment.characteristics.map((char, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                            {char}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <span className="text-gray-600">구매력: </span>
                        <span className={`font-semibold ${
                          segment.spendingPower === 'high' ? 'text-green-600' :
                          segment.spendingPower === 'medium' ? 'text-yellow-600' : 'text-gray-600'
                        }`}>
                          {segment.spendingPower === 'high' ? '높음' :
                           segment.spendingPower === 'medium' ? '보통' : '낮음'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">브랜드 충성도: </span>
                        <span className="font-bold text-blue-600">{segment.brandLoyalty}</span>
                      </div>
                    </div>

                    {/* 확장된 정보 */}
                    {selectedSegment === index && (
                      <div className="mt-3 pt-3 border-t border-gray-300">
                        <div className="text-sm text-gray-700">
                          <div className="font-medium mb-1">타겟팅 전략:</div>
                          <div className="text-xs text-gray-600">
                            이 세그먼트는 {segment.characteristics.join(', ')} 특성을 가진 고객으로,
                            {segment.spendingPower === 'high' ? '프리미엄 제품과 서비스' :
                             segment.spendingPower === 'medium' ? '균형잡힌 가격대 제품' :
                             '가성비 중심 제품'}에 관심이 높습니다.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 가치, 동기, 두려움, 열망 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                <h4 className="font-bold text-green-900 mb-3">가치 & 동기</h4>
                <div className="space-y-2">
                  <div>
                    <div className="text-xs font-medium text-gray-600 mb-1">핵심 가치</div>
                    <div className="flex flex-wrap gap-1">
                      {analysis.targetProfile.psychographics.values.map((value, idx) => (
                        <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                          {value}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-600 mb-1">구매 동기</div>
                    <div className="flex flex-wrap gap-1">
                      {analysis.targetProfile.psychographics.motivations.map((motivation, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                          {motivation}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 rounded-lg border border-red-200 p-4">
                <h4 className="font-bold text-red-900 mb-3">두려움 & 열망</h4>
                <div className="space-y-2">
                  <div>
                    <div className="text-xs font-medium text-gray-600 mb-1">주요 두려움</div>
                    <div className="flex flex-wrap gap-1">
                      {analysis.targetProfile.psychographics.fears.map((fear, idx) => (
                        <span key={idx} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                          {fear}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-600 mb-1">열망</div>
                    <div className="flex flex-wrap gap-1">
                      {analysis.targetProfile.psychographics.aspirations.map((aspiration, idx) => (
                        <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                          {aspiration}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 디지털 행동 */}
            <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
              <h3 className="font-bold text-purple-900 mb-4">디지털 행동</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-lg border border-purple-200 p-3">
                  <div className="text-sm text-gray-600 mb-1">기기 선호도</div>
                  <div className="font-bold text-purple-600">{analysis.targetProfile.digitalBehavior.devicePreference}</div>
                </div>
                <div className="bg-white rounded-lg border border-purple-200 p-3">
                  <div className="text-sm text-gray-600 mb-1">재구매율</div>
                  <div className="font-bold text-purple-600">{analysis.targetProfile.digitalBehavior.purchaseProcess.repurchaseRate}%</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">채널별 선호도</h4>
                <div className="space-y-2">
                  {analysis.targetProfile.digitalBehavior.channelPreferences.map((channel, idx) => (
                    <div key={idx} className="bg-white rounded-lg border border-purple-200 p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">{channel.channel}</span>
                        <span className="text-sm text-gray-600">일 {channel.usage}시간</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex flex-wrap gap-1">
                          {channel.purpose.map((purpose, pIdx) => (
                            <span key={pIdx} className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                              {purpose}
                            </span>
                          ))}
                        </div>
                        <span className="font-bold text-purple-600">신뢰도: {channel.trustLevel}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 구매 여정 탭 */}
        {activeTab === 'journey' && (
          <div className="space-y-6">
            {/* 4단계 여정 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* 인지 단계 */}
              <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                <div className="text-center mb-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-2">
                    1
                  </div>
                  <h4 className="font-bold text-blue-900">인지</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <div className="font-medium text-gray-700 mb-1">트리거 이벤트</div>
                    {analysis.customerJourney.awareness.triggerEvents.map((event, idx) => (
                      <div key={idx} className="text-xs text-gray-600 mb-1">
                        • {event.event} ({event.channel}) - {event.conversionRate}%
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="font-medium text-gray-700 mb-1">고객 니즈</div>
                    {analysis.customerJourney.awareness.contentNeeds.map((need, idx) => (
                      <div key={idx} className="text-xs text-gray-600">
                        • {need}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 고려 단계 */}
              <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
                <div className="text-center mb-3">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-2">
                    2
                  </div>
                  <h4 className="font-bold text-yellow-900">고려</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <div className="font-medium text-gray-700 mb-1">정보 니즈</div>
                    {analysis.customerJourney.consideration.informationNeeds.slice(0, 2).map((need, idx) => (
                      <div key={idx} className="text-xs text-gray-600 mb-1">
                        • {need.need} (신뢰도: {need.trustImportance})
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="font-medium text-gray-700 mb-1">주요 우려</div>
                    {analysis.customerJourney.consideration.mainConcerns.slice(0, 2).map((concern, idx) => (
                      <div key={idx} className="text-xs text-gray-600">
                        • {concern.concern} ({concern.concern_rate}%)
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 결정 단계 */}
              <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                <div className="text-center mb-3">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-2">
                    3
                  </div>
                  <h4 className="font-bold text-green-900">결정</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <div className="font-medium text-gray-700 mb-1">최종 푸시 요소</div>
                    {analysis.customerJourney.decision.finalPushFactors.map((factor, idx) => (
                      <div key={idx} className="text-xs text-gray-600 mb-1">
                        • {factor.factor} (+{factor.impact}%)
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="font-medium text-gray-700 mb-1">이탈 이유</div>
                    {analysis.customerJourney.decision.abandonmentReasons.slice(0, 1).map((reason, idx) => (
                      <div key={idx} className="text-xs text-gray-600">
                        • {reason.reason}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 유지 단계 */}
              <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
                <div className="text-center mb-3">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-2">
                    4
                  </div>
                  <h4 className="font-bold text-purple-900">유지</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <div className="font-medium text-gray-700 mb-1">기대사항</div>
                    {analysis.customerJourney.retention.expectations.slice(0, 2).map((expectation, idx) => (
                      <div key={idx} className="text-xs text-gray-600 mb-1">
                        • {expectation}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="font-medium text-gray-700 mb-1">충성도 트리거</div>
                    {analysis.customerJourney.retention.loyaltyTriggers.map((trigger, idx) => (
                      <div key={idx} className="text-xs text-gray-600">
                        • {trigger}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 상세 분석 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                <h4 className="font-bold text-gray-900 mb-3">의사결정 기준</h4>
                <div className="space-y-2">
                  {analysis.customerJourney.consideration.decisionCriteria.map((criteria, idx) => (
                    <div key={idx} className="bg-white rounded-lg border border-gray-200 p-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">{criteria.criteria}</span>
                        <span className="text-sm font-bold text-blue-600">{criteria.weight}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${criteria.weight}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                <h4 className="font-bold text-gray-900 mb-3">이탈 방지 전략</h4>
                <div className="space-y-2">
                  {analysis.customerJourney.decision.obstacles.map((obstacle, idx) => (
                    <div key={idx} className="bg-white rounded-lg border border-gray-200 p-2">
                      <div className="font-medium text-gray-900 mb-1">• {obstacle.obstacle}</div>
                      <div className="text-sm text-green-700">→ {obstacle.overcomingStrategy}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 심리 요소 탭 */}
        {activeTab === 'psychology' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 사회적 증거 */}
              <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                <h3 className="font-bold text-blue-900 mb-4">사회적 증거 (Social Proof)</h3>
                <div className="bg-white rounded-lg border border-blue-200 p-3 mb-3">
                  <div className="text-sm text-gray-600 mb-1">중요도</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full"
                        style={{ width: `${analysis.psychologicalFactors.socialProof.importance}%` }}
                      ></div>
                    </div>
                    <span className="font-bold text-blue-600">{analysis.psychologicalFactors.socialProof.importance}/100</span>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">리뷰 수 증가:</span>{' '}
                    <span className="text-green-600 font-bold">+{analysis.psychologicalFactors.socialProof.effectiveness.reviewCount}% CTR</span>
                  </div>
                  <div>
                    <span className="font-medium">별점 증가:</span>{' '}
                    <span className="text-green-600 font-bold">+{analysis.psychologicalFactors.socialProof.effectiveness.starRating}% per star</span>
                  </div>
                  <div>
                    <span className="font-medium">UGC:</span>{' '}
                    <span className="text-green-600 font-bold">+{analysis.psychologicalFactors.socialProof.effectiveness.userGeneratedContent}% 참여도</span>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-xs font-medium text-gray-600 mb-1">전략</div>
                  <div className="flex flex-wrap gap-1">
                    {analysis.psychologicalFactors.socialProof.tactics.map((tactic, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                        {tactic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 희소성 */}
              <div className="bg-red-50 rounded-lg border border-red-200 p-4">
                <h3 className="font-bold text-red-900 mb-4">희소성 (Scarcity)</h3>
                <div className="bg-white rounded-lg border border-red-200 p-3 mb-3">
                  <div className="text-sm text-gray-600 mb-1">인식도</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-red-600 h-3 rounded-full"
                        style={{ width: `${analysis.psychologicalFactors.scarcity.perception}%` }}
                      ></div>
                    </div>
                    <span className="font-bold text-red-600">{analysis.psychologicalFactors.scarcity.perception}/100</span>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="text-sm font-medium text-gray-700 mb-2">전환율 증가: <span className="text-green-600 font-bold">+{analysis.psychologicalFactors.scarcity.conversionLift}%</span></div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-600 mb-1">트리거</div>
                  <div className="flex flex-wrap gap-1">
                    {analysis.psychologicalFactors.scarcity.triggers.map((trigger, idx) => (
                      <span key={idx} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                        {trigger}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 권위 */}
              <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
                <h3 className="font-bold text-purple-900 mb-4">권위 (Authority)</h3>
                <div className="space-y-2">
                  {analysis.psychologicalFactors.authority.credibilityFactors.map((factor, idx) => (
                    <div key={idx} className="bg-white rounded-lg border border-purple-200 p-2">
                      <div className="font-medium text-gray-900 mb-1">{factor.factor}</div>
                      <div className="text-sm text-purple-600 font-bold">신뢰도 +{factor.trustLift}%</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 호혜성 */}
              <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                <h3 className="font-bold text-green-900 mb-4">호혜성 (Reciprocity)</h3>
                <div className="bg-white rounded-lg border border-green-200 p-3 mb-3">
                  <div className="text-sm text-gray-600 mb-1">예상 반환율</div>
                  <div className="text-2xl font-bold text-green-600">{analysis.psychologicalFactors.reciprocity.expectedReturn}%</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-600 mb-1">제공 전략</div>
                  <div className="flex flex-wrap gap-1">
                    {analysis.psychologicalFactors.reciprocity.giveStrategies.map((strategy, idx) => (
                      <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                        {strategy}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
