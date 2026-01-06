'use client'

import React, { useState } from 'react'
import type { RiskManagement } from '@/lib/types/consulting'

interface RiskManagementProps {
  risks: RiskManagement
  brandName?: string
}

export function RiskManagementComponent({ risks, brandName = '브랜드' }: RiskManagementProps) {
  const [selectedRisk, setSelectedRisk] = useState<number | null>(null)

  const getSeverityColor = (severity: number) => {
    if (severity >= 70) return 'bg-red-100 text-red-800 border-red-300'
    if (severity >= 40) return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    return 'bg-green-100 text-green-800 border-green-300'
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 p-6 text-white">
        <div>
          <h2 className="text-2xl font-bold mb-1">⚠️ 리스크 관리 & 대응 계획</h2>
          <p className="text-red-100 text-sm">식별된 위험 요소 및 대응 전략</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 위험 매트릭스 */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
          <h3 className="font-bold text-gray-900 mb-4">위험 매트릭스</h3>
          <div className="space-y-3">
            {risks.identifiedRisks.map((risk) => (
              <div
                key={risk.riskId}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedRisk === risk.riskId
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => setSelectedRisk(selectedRisk === risk.riskId ? null : risk.riskId)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-gray-900">{risk.riskName}</span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityColor(risk.assessment.severity)}`}>
                        심각도: {risk.assessment.severity}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">{risk.description}</div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>발생 확률: {risk.assessment.occurrenceProbability}%</span>
                      <span>영향도: {risk.assessment.impact}</span>
                      <span>카테고리: {risk.riskCategory}</span>
                    </div>
                  </div>
                </div>

                {selectedRisk === risk.riskId && (
                  <div className="mt-4 pt-4 border-t border-gray-300 space-y-4">
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">잠재적 영향</h5>
                      <div className="text-sm text-gray-700">
                        매출 영향: {risk.potentialImpact.revenue > 0 ? '+' : ''}{risk.potentialImpact.revenue}% | 
                        타임라인: {risk.potentialImpact.timeline} | 
                        영향 채널: {risk.potentialImpact.affectedChannels.join(', ')}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">대응 전략</h5>
                      <div className="space-y-2">
                        {risk.mitigationStrategies.map((strategy, idx) => (
                          <div key={idx} className="bg-white rounded-lg border border-gray-200 p-3">
                            <div className="font-medium text-gray-900 mb-1">{strategy.strategy}</div>
                            <div className="text-xs text-gray-600 mb-2">
                              기간: {strategy.timeline} | 비용: {strategy.cost.toLocaleString()}원 | 효과: {strategy.effectiveness}%
                            </div>
                            <div className="text-xs text-gray-700">
                              {strategy.actionItems.map((item, itemIdx) => (
                                <div key={itemIdx}>• {item}</div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-3">
                      <h5 className="font-semibold text-yellow-900 mb-2">비상 계획</h5>
                      <div className="text-sm text-yellow-800">
                        <div className="mb-1">트리거: {risk.contingencyPlan.trigger}</div>
                        <div className="mb-1">즉시 조치: {risk.contingencyPlan.immediateActions.join(', ')}</div>
                        <div className="mb-1">타임라인: {risk.contingencyPlan.timeline}</div>
                        <div>담당자: {risk.contingencyPlan.contactPerson}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 시나리오 분석 */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4">시나리오 분석</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-50 rounded-lg border border-red-200 p-4">
              <h4 className="font-bold text-red-900 mb-2">최악 시나리오</h4>
              <div className="text-sm text-gray-700 mb-2">{risks.scenarioAnalysis.worstCase.scenario}</div>
              <div className="text-xs text-gray-600 mb-2">확률: {risks.scenarioAnalysis.worstCase.probability}%</div>
              <div className="text-sm text-red-700 font-medium">
                매출: {risks.scenarioAnalysis.worstCase.impact.sales}
              </div>
            </div>
            <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
              <h4 className="font-bold text-yellow-900 mb-2">예상 시나리오</h4>
              <div className="text-sm text-gray-700 mb-2">{risks.scenarioAnalysis.mostLikelyCase.scenario}</div>
              <div className="text-xs text-gray-600 mb-2">확률: {risks.scenarioAnalysis.mostLikelyCase.probability}%</div>
              <div className="text-sm text-yellow-700 font-medium">
                매출: {risks.scenarioAnalysis.mostLikelyCase.impact.sales}
              </div>
            </div>
            <div className="bg-green-50 rounded-lg border border-green-200 p-4">
              <h4 className="font-bold text-green-900 mb-2">최선 시나리오</h4>
              <div className="text-sm text-gray-700 mb-2">{risks.scenarioAnalysis.bestCase.scenario}</div>
              <div className="text-xs text-gray-600 mb-2">확률: {risks.scenarioAnalysis.bestCase.probability}%</div>
              <div className="text-sm text-green-700 font-medium">
                매출: {risks.scenarioAnalysis.bestCase.impact.sales}
              </div>
            </div>
          </div>
        </div>

        {/* 위기 관리 */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
          <h3 className="font-bold text-gray-900 mb-4">위기 관리 계획</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <div className="text-sm font-medium text-gray-700 mb-2">위기 팀</div>
              <div className="text-xs text-gray-600">
                리더: {risks.crisisManagement.crisisTeam.leader}
              </div>
              <div className="text-xs text-gray-600">
                멤버: {risks.crisisManagement.crisisTeam.members.join(', ')}
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <div className="text-sm font-medium text-gray-700 mb-2">회복 계획</div>
              <div className="space-y-1">
                {risks.crisisManagement.recoveryPlan.phases.map((phase, idx) => (
                  <div key={idx} className="text-xs text-gray-600">
                    {phase.phase}: {phase.timeline}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <div className="text-sm font-medium text-gray-700 mb-2">커뮤니케이션</div>
              <div className="text-xs text-gray-600">
                프로토콜: {risks.crisisManagement.crisisTeam.communicationProtocol}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
