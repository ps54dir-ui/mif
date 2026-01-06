/**
 * 자동 개선 계획 생성기
 * Layer 2-4: 위반 사항별 개선 계획
 */

'use client'

import { useState } from 'react'
import { nikeRemediationPlan } from '@/data/layer2MockData'

interface RemediationPlanGeneratorProps {
  companyName?: string
}

export function RemediationPlanGenerator({ companyName = '삼성생명' }: RemediationPlanGeneratorProps) {
  const [plan] = useState(nikeRemediationPlan)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">자동 개선 계획</h2>
          <p className="text-gray-600 mt-1">{companyName} 위반 사항별 개선 계획</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600 mb-1">총 과태료 위험</div>
          <div className="text-3xl font-bold text-red-600">
            {plan.totalFineRisk.toLocaleString()}원
          </div>
          <div className="text-sm text-gray-600 mt-2">
            예상 해결 시간: {plan.estimatedResolutionTime}
          </div>
        </div>
      </div>

      {/* 위반 사항 목록 */}
      {plan.violations.length > 0 ? (
        <div className="space-y-6">
          {plan.violations.map((violation, index) => (
            <div key={index} className="bg-white rounded-lg border-2 border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{violation.violation}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>적용 법률: {violation.applicableLaw}</span>
                    <span>과태료 위험: {violation.fineRisk}</span>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getSeverityColor(violation.severity)}`}>
                  {violation.severity === 'critical' ? '긴급' :
                   violation.severity === 'high' ? '높음' :
                   violation.severity === 'medium' ? '중간' : '낮음'}
                </span>
              </div>

              {/* 필요 조치 */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-3">필요 조치</h4>
                <div className="space-y-3">
                  {violation.requiredActions.map((action, actionIndex) => (
                    <div key={actionIndex} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{action.action}</div>
                          <div className="text-sm text-gray-600 mt-1">마감일: {new Date(action.deadline).toLocaleDateString('ko-KR')}</div>
                        </div>
                        <div className="text-sm text-gray-600">담당자: {action.responsible}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 검증 */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-3">검증 방법</h4>
                <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
                  <div className="text-sm text-gray-700">
                    <div className="mb-2"><span className="font-semibold">방법:</span> {violation.verification.method}</div>
                    <div className="mb-2"><span className="font-semibold">예상 결과:</span> {violation.verification.expectedResult}</div>
                    <div><span className="font-semibold">검증 방법:</span> {violation.verification.howToVerify}</div>
                  </div>
                </div>
              </div>

              {/* 예방 */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">재발 방지 조치</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4 bg-green-50">
                    <div className="font-semibold text-sm text-gray-700 mb-2">정책 변경</div>
                    <div className="text-sm text-gray-600">{violation.prevention.policyChange}</div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 bg-yellow-50">
                    <div className="font-semibold text-sm text-gray-700 mb-2">직원 교육</div>
                    <div className="text-sm text-gray-600">{violation.prevention.staffTraining}</div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
                    <div className="font-semibold text-sm text-gray-700 mb-2">모니터링</div>
                    <div className="text-sm text-gray-600">{violation.prevention.monitoring}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-8 text-center">
          <div className="text-4xl mb-4">✅</div>
          <h3 className="text-xl font-semibold text-green-900 mb-2">위반 사항이 없습니다</h3>
          <p className="text-green-700">현재 모든 법규를 준수하고 있습니다.</p>
        </div>
      )}

      {/* 우선순위 순서 */}
      {plan.priorityOrder.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">우선순위 순서</h3>
          <ol className="space-y-2">
            {plan.priorityOrder.map((item, index) => (
              <li key={index} className="flex items-center gap-3 text-gray-700">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
                  {index + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* 체크리스트 */}
      {plan.checklist.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">개선 체크리스트</h3>
          <div className="space-y-3">
            {plan.checklist.map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                <input
                  type="checkbox"
                  checked={item.completed}
                  readOnly
                  className="w-5 h-5 text-blue-600"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{item.item}</div>
                  <div className="text-sm text-gray-600">마감일: {new Date(item.deadline).toLocaleDateString('ko-KR')}</div>
                </div>
                {item.completed && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                    완료
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
