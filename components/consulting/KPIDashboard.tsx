'use client'

import React from 'react'
import type { KPIFramework } from '@/lib/types/consulting'

interface KPIDashboardProps {
  kpis: KPIFramework
  brandName?: string
}

export function KPIDashboard({ kpis, brandName = '브랜드' }: KPIDashboardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-6 text-white">
        <div>
          <h2 className="text-2xl font-bold mb-1">📊 KPI & 성공 지표 대시보드</h2>
          <p className="text-green-100 text-sm">전략 목표와 연결된 핵심 성과 지표</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 전략 목표 */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">전략 목표 & KPI</h3>
          <div className="space-y-4">
            {kpis.strategicObjectives.map((objective, idx) => (
              <div key={idx} className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border border-green-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-gray-900">{objective.objective}</h4>
                  <span className="text-sm text-gray-600">기간: {objective.timeframe}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {objective.kpis.map((kpi, kpiIdx) => (
                    <div key={kpiIdx} className="bg-white rounded-lg border border-green-200 p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">{kpi.kpiName}</span>
                        <span className="text-xs text-gray-500">{kpi.unit}</span>
                      </div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-2xl font-bold text-green-600">{kpi.baseline.toLocaleString()}</div>
                        <span className="text-gray-400">→</span>
                        <div className="text-2xl font-bold text-teal-600">{kpi.target.toLocaleString()}</div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${(kpi.baseline / kpi.target) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        측정: {kpi.measurement.frequency} | 담당: {kpi.measurement.owner}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 채널별 KPI */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">채널별 KPI</h3>
          <div className="space-y-4">
            {kpis.channelKPIs.map((channel, idx) => (
              <div key={idx} className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                <h4 className="font-bold text-blue-900 mb-3">{channel.channel}</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="bg-white rounded-lg border border-blue-200 p-3">
                    <div className="text-xs text-gray-600 mb-1">주요 KPI</div>
                    <div className="font-bold text-blue-600">{channel.primaryKPI.metric}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {channel.primaryKPI.baseline} → {channel.primaryKPI.target}
                    </div>
                    <div className="text-xs text-gray-500">가중치: {channel.primaryKPI.weight}%</div>
                  </div>
                  {channel.supportingKPIs.map((kpi, kpiIdx) => (
                    <div key={kpiIdx} className="bg-white rounded-lg border border-blue-200 p-3">
                      <div className="text-xs text-gray-600 mb-1">{kpi.metric}</div>
                      <div className="font-bold text-blue-600">
                        {kpi.baseline} → {kpi.target}
                      </div>
                      <div className="text-xs text-gray-500">가중치: {kpi.weight}%</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 실시간 대시보드 */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
          <h3 className="font-bold text-gray-900 mb-4">실시간 대시보드</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <div className="text-xs text-gray-600 mb-1">오늘 매출</div>
              <div className="text-2xl font-bold text-green-600">{kpis.realtimeDashboard.today.sales.toLocaleString()}</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <div className="text-xs text-gray-600 mb-1">오늘 도달</div>
              <div className="text-2xl font-bold text-blue-600">{kpis.realtimeDashboard.today.reach.toLocaleString()}</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <div className="text-xs text-gray-600 mb-1">오늘 참여</div>
              <div className="text-2xl font-bold text-purple-600">{kpis.realtimeDashboard.today.engagement}%</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <div className="text-xs text-gray-600 mb-1">오늘 리드</div>
              <div className="text-2xl font-bold text-orange-600">{kpis.realtimeDashboard.today.leads}</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <div className="text-sm text-gray-600 mb-1">주간 비교</div>
              <div className={`text-lg font-bold ${
                kpis.realtimeDashboard.week.weeklyComparison > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {kpis.realtimeDashboard.week.weeklyComparison > 0 ? '+' : ''}
                {kpis.realtimeDashboard.week.weeklyComparison}%
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <div className="text-sm text-gray-600 mb-1">월간 진행률</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      kpis.realtimeDashboard.month.progress >= 75 ? 'bg-green-600' :
                      kpis.realtimeDashboard.month.progress >= 50 ? 'bg-yellow-600' : 'bg-red-600'
                    }`}
                    style={{ width: `${kpis.realtimeDashboard.month.progress}%` }}
                  ></div>
                </div>
                <span className="font-bold text-gray-900">{kpis.realtimeDashboard.month.progress}%</span>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {kpis.realtimeDashboard.month.onTrack ? '✅ 정상 진행' : '⚠️ 조정 필요'}
              </div>
            </div>
          </div>
        </div>

        {/* 성공 기준 */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">단계별 성공 기준</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
              <h4 className="font-bold text-yellow-900 mb-3">단기 ({kpis.successCriteria.shortTerm.timeline})</h4>
              <div className="space-y-2">
                {kpis.successCriteria.shortTerm.targets.map((target, idx) => (
                  <div key={idx} className="text-sm text-gray-700">
                    • {target.criterion}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-orange-50 rounded-lg border border-orange-200 p-4">
              <h4 className="font-bold text-orange-900 mb-3">중기 ({kpis.successCriteria.mediumTerm.timeline})</h4>
              <div className="space-y-2">
                {kpis.successCriteria.mediumTerm.targets.map((target, idx) => (
                  <div key={idx} className="text-sm text-gray-700">
                    • {target.criterion}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-red-50 rounded-lg border border-red-200 p-4">
              <h4 className="font-bold text-red-900 mb-3">장기 ({kpis.successCriteria.longTerm.timeline})</h4>
              <div className="space-y-2">
                {kpis.successCriteria.longTerm.targets.map((target, idx) => (
                  <div key={idx} className="text-sm text-gray-700">
                    • {target.criterion}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
