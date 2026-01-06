'use client'

import React from 'react'

interface ComplianceData {
  overallScore: number
  koreanLaws: Array<{
    law: string
    status: 'COMPLIANT' | 'WARNING' | 'VIOLATION'
    score: number
    issues: string[]
  }>
  internationalLaws: Array<{
    law: string
    status: 'COMPLIANT' | 'WARNING' | 'VIOLATION'
    score: number
    issues: string[]
  }>
  platformPolicies: Array<{
    platform: string
    status: 'COMPLIANT' | 'WARNING' | 'VIOLATION'
    score: number
    issues: string[]
  }>
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  recommendations: string[]
}

interface ComplianceDashboardProps {
  complianceData?: ComplianceData
}

// Mock 데이터
const MOCK_COMPLIANCE_DATA: ComplianceData = {
  overallScore: 85,
  koreanLaws: [
    {
      law: '개인정보보호법',
      status: 'COMPLIANT',
      score: 95,
      issues: []
    },
    {
      law: '정보통신망법',
      status: 'COMPLIANT',
      score: 90,
      issues: []
    },
    {
      law: '전자상거래법',
      status: 'WARNING',
      score: 75,
      issues: ['환불 정책 명시 보완 필요']
    },
    {
      law: '표시광고법',
      status: 'COMPLIANT',
      score: 88,
      issues: []
    },
    {
      law: '공정거래법',
      status: 'COMPLIANT',
      score: 92,
      issues: []
    }
  ],
  internationalLaws: [
    {
      law: 'GDPR',
      status: 'COMPLIANT',
      score: 88,
      issues: []
    },
    {
      law: 'CCPA',
      status: 'WARNING',
      score: 72,
      issues: ['개인정보 처리 동의서 보완 필요']
    },
    {
      law: 'FTA',
      status: 'COMPLIANT',
      score: 85,
      issues: []
    }
  ],
  platformPolicies: [
    {
      platform: '네이버',
      status: 'COMPLIANT',
      score: 90,
      issues: []
    },
    {
      platform: '구글',
      status: 'COMPLIANT',
      score: 88,
      issues: []
    },
    {
      platform: '페이스북',
      status: 'WARNING',
      score: 75,
      issues: ['광고 정책 준수 확인 필요']
    }
  ],
  riskLevel: 'LOW',
  recommendations: [
    '전자상거래법: 환불 정책을 명확하게 명시하세요',
    'CCPA: 개인정보 처리 동의서를 보완하세요',
    '페이스북: 광고 정책 준수 여부를 정기적으로 확인하세요'
  ]
}

export function ComplianceDashboard({ complianceData = MOCK_COMPLIANCE_DATA }: ComplianceDashboardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLIANT':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'WARNING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'VIOLATION':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'COMPLIANT':
        return '준수'
      case 'WARNING':
        return '주의'
      case 'VIOLATION':
        return '위반'
      default:
        return '미확인'
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW':
        return 'text-green-600 bg-green-50'
      case 'MEDIUM':
        return 'text-yellow-600 bg-yellow-50'
      case 'HIGH':
        return 'text-orange-600 bg-orange-50'
      case 'CRITICAL':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">컴플라이언스 시스템</h2>
          <p className="text-gray-600 mt-1">법규 준수 및 정책 검증 현황</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600 mb-1">종합 컴플라이언스 점수</div>
          <div className="text-4xl font-bold text-blue-600">{complianceData.overallScore}<span className="text-2xl text-gray-500">/100</span></div>
          <div className={`mt-2 px-3 py-1 rounded-full text-sm font-semibold inline-block ${getRiskColor(complianceData.riskLevel)}`}>
            위험도: {complianceData.riskLevel === 'LOW' ? '낮음' : complianceData.riskLevel === 'MEDIUM' ? '중간' : complianceData.riskLevel === 'HIGH' ? '높음' : '심각'}
          </div>
        </div>
      </div>

      {/* 한국 법규 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">한국 규정 검증 (5가지 법률)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {complianceData.koreanLaws.map((law, index) => (
            <div key={index} className={`border-2 rounded-lg p-4 ${getStatusColor(law.status)}`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{law.law}</h4>
                <span className="text-xs px-2 py-1 rounded-full bg-white/50">{getStatusLabel(law.status)}</span>
              </div>
              <div className="text-2xl font-bold mb-2">{law.score}점</div>
              {law.issues.length > 0 && (
                <div className="mt-2 space-y-1">
                  {law.issues.map((issue, i) => (
                    <div key={i} className="text-xs">• {issue}</div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 국제 규정 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">국제 규정 검증 (GDPR, CCPA, FTA)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {complianceData.internationalLaws.map((law, index) => (
            <div key={index} className={`border-2 rounded-lg p-4 ${getStatusColor(law.status)}`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{law.law}</h4>
                <span className="text-xs px-2 py-1 rounded-full bg-white/50">{getStatusLabel(law.status)}</span>
              </div>
              <div className="text-2xl font-bold mb-2">{law.score}점</div>
              {law.issues.length > 0 && (
                <div className="mt-2 space-y-1">
                  {law.issues.map((issue, i) => (
                    <div key={i} className="text-xs">• {issue}</div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 플랫폼 정책 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">플랫폼 정책 검증</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {complianceData.platformPolicies.map((policy, index) => (
            <div key={index} className={`border-2 rounded-lg p-4 ${getStatusColor(policy.status)}`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{policy.platform}</h4>
                <span className="text-xs px-2 py-1 rounded-full bg-white/50">{getStatusLabel(policy.status)}</span>
              </div>
              <div className="text-2xl font-bold mb-2">{policy.score}점</div>
              {policy.issues.length > 0 && (
                <div className="mt-2 space-y-1">
                  {policy.issues.map((issue, i) => (
                    <div key={i} className="text-xs">• {issue}</div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 권장 사항 */}
      {complianceData.recommendations.length > 0 && (
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-3">권장 개선 사항</h3>
          <ul className="space-y-2">
            {complianceData.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2 text-yellow-800">
                <span className="text-yellow-600 mt-1">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
