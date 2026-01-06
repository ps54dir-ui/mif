/**
 * 위험 자가진단 시스템
 * Layer 2-2: 7가지 부정행위 카테고리 자가진단
 */

'use client'

import { useState } from 'react'
import { nikeRiskDiagnosis } from '@/data/layer2MockData'

type RiskLevel = 'safe' | 'warning' | 'critical'

interface RiskSelfDiagnosisEngineProps {
  companyName?: string
}

export function RiskSelfDiagnosisEngine({ companyName = '삼성생명' }: RiskSelfDiagnosisEngineProps) {
  const [diagnosisData, setDiagnosisData] = useState(nikeRiskDiagnosis)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    pricing: true,
    advertising: false,
    traffic: false,
    reviews: false,
    dataPrivacy: false,
    copyrightIP: false,
    spam: false
  })

  const toggleCategory = (categoryKey: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryKey]: !prev[categoryKey]
    }))
  }

  const handleAnswer = (categoryKey: string, questionId: string, answer: boolean) => {
    setDiagnosisData(prev => {
      const newData = { ...prev }
      const category = newData.categories[categoryKey as keyof typeof newData.categories]
      
      const question = category.questions.find((q: any) => q.id === questionId)
      if (question) {
        question.yourAnswer = answer
        
        // 카테고리 점수 재계산
        const yesAnswers = category.questions.filter((q: any) => q.yourAnswer === true)
        const criticalCount = yesAnswers.filter((q: any) => q.riskIfYes === 'critical').length
        const highCount = yesAnswers.filter((q: any) => q.riskIfYes === 'high').length
        const mediumCount = yesAnswers.filter((q: any) => q.riskIfYes === 'medium').length
        
        category.riskScore = Math.min(100, criticalCount * 50 + highCount * 30 + mediumCount * 15)
        
        if (category.riskScore >= 50) {
          category.status = 'critical'
        } else if (category.riskScore >= 20) {
          category.status = 'warning'
        } else {
          category.status = 'safe'
        }
      }
      
      // 전체 점수 재계산
      const allCategories = Object.values(newData.categories)
      newData.overallRiskScore = Math.round(
        allCategories.reduce((sum, cat) => sum + cat.riskScore, 0) / allCategories.length
      )
      
      if (newData.overallRiskScore >= 50) {
        newData.riskLevel = 'critical'
      } else if (newData.overallRiskScore >= 20) {
        newData.riskLevel = 'warning'
      } else {
        newData.riskLevel = 'safe'
      }
      
      // 즉시 조치 필요 사항 업데이트
      const criticalIssues: string[] = []
      const immediateActions: Array<{ action: string; timeline: string; consequence: string }> = []
      
      allCategories.forEach(cat => {
        if (cat.status === 'critical') {
          criticalIssues.push(`${cat.name}에서 심각한 위험이 감지되었습니다.`)
          immediateActions.push({
            action: `${cat.name} 관련 부정행위 즉시 중단`,
            timeline: '즉시',
            consequence: '법적 처벌 및 평판 손상'
          })
        }
      })
      
      newData.criticalIssues = criticalIssues
      newData.immediateActions = immediateActions
      
      return newData
    })
  }

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case 'safe':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getRiskIcon = (risk: RiskLevel) => {
    switch (risk) {
      case 'safe':
        return '🟢'
      case 'warning':
        return '🟡'
      case 'critical':
        return '🔴'
      default:
        return '⚪'
    }
  }

  const getRiskLabel = (risk: RiskLevel) => {
    switch (risk) {
      case 'safe':
        return '안전'
      case 'warning':
        return '주의'
      case 'critical':
        return '심각'
      default:
        return '미확인'
    }
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">위험 자가진단 시스템</h2>
          <p className="text-gray-600 mt-1">{companyName} 부정행위 자가진단</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600 mb-1">종합 위험도 점수</div>
          <div className="text-4xl font-bold text-red-600">
            {diagnosisData.overallRiskScore}
            <span className="text-2xl text-gray-500">/100</span>
          </div>
          <div className={`mt-2 px-4 py-2 rounded-full text-sm font-semibold inline-block ${getRiskColor(diagnosisData.riskLevel)}`}>
            {getRiskIcon(diagnosisData.riskLevel)} {getRiskLabel(diagnosisData.riskLevel)}
          </div>
        </div>
      </div>

      {/* 카테고리별 진단 */}
      <div className="space-y-4">
        {Object.entries(diagnosisData.categories).map(([categoryKey, category]) => (
          <div key={categoryKey} className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleCategory(categoryKey)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{getRiskIcon(category.status)}</span>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-600">위험도 점수: {category.riskScore}점</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskColor(category.status)}`}>
                  {getRiskLabel(category.status)}
                </span>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${expandedCategories[categoryKey] ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {expandedCategories[categoryKey] && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="space-y-4">
                  {category.questions.map((question: any) => (
                    <div key={question.id} className="bg-white rounded-lg border border-gray-200 p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 mb-2">{question.question}</p>
                          {question.example && (
                            <p className="text-sm text-gray-600 mb-2">예시: {question.example}</p>
                          )}
                          {question.fineAmount && (
                            <p className="text-sm text-red-600 font-semibold">과태료: {question.fineAmount}</p>
                          )}
                          {question.consequence && (
                            <p className="text-sm text-orange-600">결과: {question.consequence}</p>
                          )}
                          {question.violation && (
                            <p className="text-sm text-red-600">위반: {question.violation}</p>
                          )}
                          {question.detection && (
                            <p className="text-sm text-yellow-600">감지: {question.detection}</p>
                          )}
                          {question.legalAction && (
                            <p className="text-sm text-purple-600">법적 조치: {question.legalAction}</p>
                          )}
                          {question.breachRisk && (
                            <p className="text-sm text-red-600">데이터 유출 위험 있음</p>
                          )}
                          {question.legalRequired && (
                            <p className="text-sm text-blue-600">법적 요구사항: {question.legalRequired}</p>
                          )}
                          {question.platformAction && (
                            <p className="text-sm text-red-600">플랫폼 조치: {question.platformAction}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-4 mt-4">
                        <button
                          onClick={() => handleAnswer(categoryKey, question.id, true)}
                          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                            question.yourAnswer === true
                              ? 'bg-red-100 text-red-700 border-2 border-red-500'
                              : 'bg-gray-100 text-gray-700 border-2 border-gray-300 hover:bg-gray-200'
                          }`}
                        >
                          예 (위험 있음)
                        </button>
                        <button
                          onClick={() => handleAnswer(categoryKey, question.id, false)}
                          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                            question.yourAnswer === false
                              ? 'bg-green-100 text-green-700 border-2 border-green-500'
                              : 'bg-gray-100 text-gray-700 border-2 border-gray-300 hover:bg-gray-200'
                          }`}
                        >
                          아니오 (안전)
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 종합 결과 */}
      <div className={`rounded-lg border-2 p-6 ${getRiskColor(diagnosisData.riskLevel)}`}>
        <h3 className="text-xl font-bold mb-4">종합 진단 결과</h3>
        <div className="space-y-4">
          <div>
            <div className="text-sm text-gray-600 mb-1">종합 위험도 점수</div>
            <div className="text-3xl font-bold">{diagnosisData.overallRiskScore}점 / 100점</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">위험도 등급</div>
            <div className="text-2xl font-semibold">
              {getRiskIcon(diagnosisData.riskLevel)} {getRiskLabel(diagnosisData.riskLevel)}
            </div>
          </div>
          {diagnosisData.criticalIssues.length > 0 && (
            <div className="mt-4">
              <div className="text-sm font-semibold mb-2">⚠️ 심각한 문제 발견:</div>
              <ul className="list-disc list-inside space-y-1">
                {diagnosisData.criticalIssues.map((issue, index) => (
                  <li key={index} className="text-sm">{issue}</li>
                ))}
              </ul>
            </div>
          )}
          {diagnosisData.immediateActions.length > 0 && (
            <div className="mt-4">
              <div className="text-sm font-semibold mb-2">🚨 즉시 조치 필요:</div>
              <ul className="space-y-2">
                {diagnosisData.immediateActions.map((action, index) => (
                  <li key={index} className="text-sm bg-white/50 rounded p-2">
                    <div className="font-semibold">{action.action}</div>
                    <div className="text-xs text-gray-600">기한: {action.timeline}</div>
                    <div className="text-xs text-red-600">결과: {action.consequence}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
