'use client'

import React, { useState } from 'react'
import type { DetailedExecutionPlan } from '@/lib/types/consulting'

interface ExecutionPlanProps {
  plan: DetailedExecutionPlan
  brandName?: string
}

export function ExecutionPlan({ plan, brandName = '브랜드' }: ExecutionPlanProps) {
  const [selectedWeek, setSelectedWeek] = useState<number | null>(1)

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 p-6 text-white">
        <div>
          <h2 className="text-2xl font-bold mb-1">📅 주간/월간 실행 계획</h2>
          <p className="text-orange-100 text-sm">구체적인 실행 액션 아이템 및 리소스 배분</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 기간 정보 */}
        <div className="bg-orange-50 rounded-lg border border-orange-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border border-orange-200 p-3">
              <div className="text-sm text-gray-600 mb-1">계획 기간</div>
              <div className="font-bold text-orange-600">{plan.planningPeriod.duration}</div>
            </div>
            <div className="bg-white rounded-lg border border-orange-200 p-3">
              <div className="text-sm text-gray-600 mb-1">시작일</div>
              <div className="font-bold text-orange-600">
                {new Date(plan.planningPeriod.startDate).toLocaleDateString()}
              </div>
            </div>
            <div className="bg-white rounded-lg border border-orange-200 p-3">
              <div className="text-sm text-gray-600 mb-1">종료일</div>
              <div className="font-bold text-orange-600">
                {new Date(plan.planningPeriod.endDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* 주간 플랜 */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">주간 실행 계획</h3>
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {plan.weeklyPlans.map((week) => (
              <button
                key={week.week}
                onClick={() => setSelectedWeek(week.week)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  selectedWeek === week.week
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Week {week.week}
              </button>
            ))}
          </div>

          {selectedWeek && (() => {
            const week = plan.weeklyPlans.find(w => w.week === selectedWeek)
            if (!week) return null

            return (
              <div className="space-y-4">
                {/* 주간 포커스 */}
                <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                  <h4 className="font-bold text-blue-900 mb-3">주간 포커스</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-white rounded-lg border border-blue-200 p-3">
                      <div className="text-sm text-gray-600 mb-1">우선순위</div>
                      <div className="font-bold text-blue-600">{week.focus.priority}</div>
                    </div>
                    <div className="bg-white rounded-lg border border-blue-200 p-3">
                      <div className="text-sm text-gray-600 mb-1">목표</div>
                      <div className="font-bold text-blue-600">{week.focus.objective}</div>
                    </div>
                    <div className="bg-white rounded-lg border border-blue-200 p-3">
                      <div className="text-sm text-gray-600 mb-1">예상 결과</div>
                      <div className="font-bold text-blue-600">{week.focus.expectedOutcome}</div>
                    </div>
                  </div>
                </div>

                {/* 채널별 액션 */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-3">채널별 실행 액션</h4>
                  <div className="space-y-4">
                    {week.channelActions.map((channelAction, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                        <h5 className="font-semibold text-gray-900 mb-3">{channelAction.channel}</h5>
                        <div className="space-y-3">
                          {channelAction.actions.map((action) => (
                            <div key={action.actionNumber} className="bg-white rounded-lg border border-gray-200 p-3">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold">
                                      {action.actionNumber}
                                    </span>
                                    <span className="font-semibold text-gray-900">{action.task}</span>
                                  </div>
                                  <div className="text-sm text-gray-600 ml-8 mb-2">{action.description}</div>
                                  <div className="ml-8 text-xs text-gray-500">
                                    담당: {action.owner} | 마감: {action.deadline} | 예상 시간: {action.estimatedHours}시간
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-bold text-orange-600">
                                    {action.budget.toLocaleString()}원
                                  </div>
                                  <div className="text-xs text-gray-500">예산</div>
                                </div>
                              </div>
                              <div className="ml-8 mt-2 p-2 bg-green-50 rounded border border-green-200">
                                <div className="text-xs font-medium text-green-800">
                                  예상 효과: {action.expectedImpact}
                                </div>
                              </div>
                              {action.checklist.length > 0 && (
                                <div className="ml-8 mt-2">
                                  <div className="text-xs font-medium text-gray-600 mb-1">체크리스트:</div>
                                  <div className="space-y-1">
                                    {action.checklist.map((item, itemIdx) => (
                                      <div key={itemIdx} className="text-xs text-gray-600 flex items-center gap-1">
                                        <input type="checkbox" className="rounded" />
                                        <span>{item}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 리소스 */}
                <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
                  <h4 className="font-bold text-purple-900 mb-3">필요 리소스</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">팀 구성</div>
                      <div className="space-y-1">
                        {week.resources.team.map((member, idx) => (
                          <div key={idx} className="text-sm text-gray-600">
                            • {member.role}: {member.hours}시간
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">도구</div>
                      <div className="flex flex-wrap gap-1">
                        {week.resources.tools.map((tool, idx) => (
                          <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                            {tool}
                          </span>
                        ))}
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        주간 예산: {week.resources.budget.toLocaleString()}원
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })()}
        </div>

        {/* 월간 계획 */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">월간 계획</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plan.monthlyPlans.map((month) => (
              <div key={month.month} className="bg-indigo-50 rounded-lg border border-indigo-200 p-4">
                <h4 className="font-bold text-indigo-900 mb-3">{month.monthName} ({month.month}월)</h4>
                <div className="text-sm text-gray-700 mb-3">
                  <span className="font-medium">포커스:</span> {month.focus}
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-600 mb-2">마일스톤</div>
                  <div className="space-y-1">
                    {month.milestones.map((milestone, idx) => (
                      <div key={idx} className="text-xs text-gray-600">
                        • {milestone.milestone}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 리소스 배분 */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
          <h3 className="font-bold text-gray-900 mb-4">리소스 배분</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">팀 구성</h4>
              <div className="space-y-2">
                {plan.resourceAllocation.team.map((member, idx) => (
                  <div key={idx} className="bg-white rounded-lg border border-gray-200 p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">{member.role}</span>
                      <span className="text-sm font-bold text-blue-600">{member.hours}시간/주</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      급여: {member.salary.toLocaleString()}원/월
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">예산 배분</h4>
              <div className="bg-white rounded-lg border border-gray-200 p-3 mb-3">
                <div className="text-sm text-gray-600 mb-1">총 예산</div>
                <div className="text-2xl font-bold text-indigo-600">
                  {plan.resourceAllocation.budget.totalBudget.toLocaleString()}원
                </div>
              </div>
              <div className="space-y-2">
                <div className="bg-white rounded-lg border border-gray-200 p-2">
                  <div className="flex justify-between text-sm">
                    <span>콘텐츠</span>
                    <span className="font-bold">{plan.resourceAllocation.budget.allocation.content}%</span>
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-2">
                  <div className="flex justify-between text-sm">
                    <span>광고</span>
                    <span className="font-bold">{plan.resourceAllocation.budget.allocation.advertising}%</span>
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-2">
                  <div className="flex justify-between text-sm">
                    <span>도구</span>
                    <span className="font-bold">{plan.resourceAllocation.budget.allocation.tools}%</span>
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-2">
                  <div className="flex justify-between text-sm">
                    <span>테스트</span>
                    <span className="font-bold">{plan.resourceAllocation.budget.allocation.testing}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
