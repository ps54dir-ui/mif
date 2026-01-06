'use client'

import React, { useState } from 'react'
import type { StrategicRoadmap } from '@/lib/types/consulting'

interface StrategicRoadmapProps {
  roadmap: StrategicRoadmap
  brandName?: string
}

export function StrategicRoadmapComponent({ roadmap, brandName = '브랜드' }: StrategicRoadmapProps) {
  const [selectedPhase, setSelectedPhase] = useState<number | null>(1)

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 text-white">
        <div>
          <h2 className="text-2xl font-bold mb-1">🗺️ 3-6개월 전략 로드맵</h2>
          <p className="text-indigo-100 text-sm">단계별 성장 계획 및 마일스톤</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Phase 타임라인 */}
        <div className="flex gap-4 overflow-x-auto pb-4">
          {roadmap.phases.map((phase) => (
            <button
              key={phase.phaseNumber}
              onClick={() => setSelectedPhase(phase.phaseNumber)}
              className={`flex-shrink-0 px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
                selectedPhase === phase.phaseNumber
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="text-center">
                <div className="font-bold">Phase {phase.phaseNumber}</div>
                <div className="text-xs mt-1">{phase.phaseName}</div>
                <div className="text-xs mt-1">{phase.timeline}</div>
              </div>
            </button>
          ))}
        </div>

        {/* 선택된 Phase 상세 */}
        {selectedPhase && (() => {
          const phase = roadmap.phases.find(p => p.phaseNumber === selectedPhase)
          if (!phase) return null

          return (
            <div className="space-y-6">
              {/* Phase 목표 */}
              <div className="bg-indigo-50 rounded-lg border border-indigo-200 p-4">
                <h3 className="font-bold text-indigo-900 mb-4">Phase {phase.phaseNumber} 목표</h3>
                <div className="space-y-3">
                  {phase.objectives.map((obj, idx) => (
                    <div key={idx} className="bg-white rounded-lg border border-indigo-200 p-3">
                      <div className="font-semibold text-gray-900 mb-1">{obj.objective}</div>
                      <div className="text-sm text-gray-600 mb-1">{obj.rationale}</div>
                      <div className="text-sm text-indigo-700 font-medium">→ {obj.expectedOutcome}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 마일스톤 */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">마일스톤</h3>
                <div className="space-y-3">
                  {phase.milestones.map((milestone, idx) => (
                    <div key={idx} className="bg-white rounded-lg border border-gray-200 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">{milestone.milestone}</span>
                        <span className="text-sm text-gray-600">
                          {new Date(milestone.targetDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-1">담당: {milestone.owner}</div>
                      <div className="text-xs text-gray-500">
                        목표: {milestone.metrics.metric} = {milestone.metrics.target}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Phase KPI */}
              <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                <h3 className="font-bold text-green-900 mb-4">Phase KPI</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {phase.phaseKPIs.map((kpi, idx) => (
                    <div key={idx} className="bg-white rounded-lg border border-green-200 p-3">
                      <div className="text-sm text-gray-600 mb-1">{kpi.metric}</div>
                      <div className="text-xl font-bold text-green-600">{kpi.target}</div>
                      <div className={`text-xs mt-1 ${
                        kpi.status === 'on-track' ? 'text-green-600' :
                        kpi.status === 'at-risk' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {kpi.status === 'on-track' ? '✅ 정상' :
                         kpi.status === 'at-risk' ? '⚠️ 위험' : '❌ 지연'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })()}

        {/* 성장 시나리오 */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4">성장 시나리오</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
              <h4 className="font-bold text-blue-900 mb-2">보수적</h4>
              <div className="text-sm text-gray-700 mb-2">{roadmap.growthScenarios.conservative.description}</div>
              <div className="text-xs text-gray-600 mb-2">확률: {roadmap.growthScenarios.conservative.probability}%</div>
              <div className="text-sm font-bold text-blue-600">
                매출: {roadmap.growthScenarios.conservative.metrics.revenue.toLocaleString()}원
              </div>
              <div className="text-sm font-bold text-blue-600">
                시장 점유율: {roadmap.growthScenarios.conservative.metrics.marketShare}%
              </div>
            </div>
            <div className="bg-green-50 rounded-lg border border-green-200 p-4">
              <h4 className="font-bold text-green-900 mb-2">현실적</h4>
              <div className="text-sm text-gray-700 mb-2">{roadmap.growthScenarios.realistic.description}</div>
              <div className="text-xs text-gray-600 mb-2">확률: {roadmap.growthScenarios.realistic.probability}%</div>
              <div className="text-sm font-bold text-green-600">
                매출: {roadmap.growthScenarios.realistic.metrics.revenue.toLocaleString()}원
              </div>
              <div className="text-sm font-bold text-green-600">
                시장 점유율: {roadmap.growthScenarios.realistic.metrics.marketShare}%
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
              <h4 className="font-bold text-purple-900 mb-2">공격적</h4>
              <div className="text-sm text-gray-700 mb-2">{roadmap.growthScenarios.aggressive.description}</div>
              <div className="text-xs text-gray-600 mb-2">확률: {roadmap.growthScenarios.aggressive.probability}%</div>
              <div className="text-sm font-bold text-purple-600">
                매출: {roadmap.growthScenarios.aggressive.metrics.revenue.toLocaleString()}원
              </div>
              <div className="text-sm font-bold text-purple-600">
                시장 점유율: {roadmap.growthScenarios.aggressive.metrics.marketShare}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
