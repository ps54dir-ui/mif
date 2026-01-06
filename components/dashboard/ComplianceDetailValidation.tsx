/**
 * 규정 준수 세부 검증 시스템
 * Layer 2-1: 5개 한국 법규 + 국제 규정 + 플랫폼 정책 상세 검증
 */

'use client'

import { useState } from 'react'
import { nikeComplianceValidation } from '@/data/layer2MockData'

type LawStatus = 'compliant' | 'warning' | 'violation'
type RiskLevel = 'none' | 'low' | 'medium' | 'high' | 'critical'
type Severity = 'critical' | 'high' | 'medium' | 'low'

interface ComplianceDetailValidationProps {
  companyName?: string
}

export function ComplianceDetailValidation({ companyName = '삼성생명' }: ComplianceDetailValidationProps) {
  const [selectedLaw, setSelectedLaw] = useState<string>('ecommerceLaw')
  const data = nikeComplianceValidation

  const koreanLaws = [
    { key: 'ecommerceLaw', label: '전자상거래법' },
    { key: 'unfairCompetitionLaw', label: '부정경쟁방지법' },
    { key: 'advertisingLaw', label: '광고법' },
    { key: 'personalInfoLaw', label: '개인정보보호법' },
    { key: 'priceDisplayLaw', label: '가격표시법' }
  ]

  const getStatusColor = (status: LawStatus) => {
    switch (status) {
      case 'compliant':
        return 'text-green-600 bg-green-50 border-green-300'
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-300'
      case 'violation':
        return 'text-red-600 bg-red-50 border-red-300'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-300'
    }
  }

  const getStatusLabel = (status: LawStatus) => {
    switch (status) {
      case 'compliant':
        return '✅ 준수'
      case 'warning':
        return '⚠️ 주의'
      case 'violation':
        return '❌ 위반'
      default:
        return '미확인'
    }
  }

  const getSeverityColor = (severity: Severity) => {
    switch (severity) {
      case 'critical':
        return 'text-red-700 bg-red-100'
      case 'high':
        return 'text-orange-700 bg-orange-100'
      case 'medium':
        return 'text-yellow-700 bg-yellow-100'
      case 'low':
        return 'text-blue-700 bg-blue-100'
      default:
        return 'text-gray-700 bg-gray-100'
    }
  }

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case 'none':
        return 'text-green-600 bg-green-50'
      case 'low':
        return 'text-blue-600 bg-blue-50'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50'
      case 'high':
        return 'text-orange-600 bg-orange-50'
      case 'critical':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'AAA':
        return 'text-green-600 bg-green-50'
      case 'AA':
        return 'text-blue-600 bg-blue-50'
      case 'A':
        return 'text-yellow-600 bg-yellow-50'
      case 'B':
        return 'text-orange-600 bg-orange-50'
      case 'C':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const currentLaw = data.koreanLawValidation[selectedLaw as keyof typeof data.koreanLawValidation]

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">규정 준수 세부 검증</h2>
          <p className="text-gray-600 mt-1">{companyName} 법규 준수 상세 분석</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600 mb-1">종합 컴플라이언스 점수</div>
          <div className="text-4xl font-bold text-blue-600">
            {data.overallComplianceScore}
            <span className="text-2xl text-gray-500">/100</span>
          </div>
          <div className={`mt-2 px-3 py-1 rounded-full text-sm font-semibold inline-block ${getRatingColor(data.complianceRating)}`}>
            등급: {data.complianceRating}
          </div>
          <div className={`mt-1 px-3 py-1 rounded-full text-sm font-semibold inline-block ${getRiskColor(data.riskLevel)}`}>
            위험도: {data.riskLevel === 'low' ? '낮음' : data.riskLevel === 'medium' ? '중간' : data.riskLevel === 'high' ? '높음' : data.riskLevel === 'critical' ? '심각' : '없음'}
          </div>
        </div>
      </div>

      {/* 한국 법규 탭 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">한국 규정 검증 (5가지 법률)</h3>
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {koreanLaws.map((law) => (
            <button
              key={law.key}
              onClick={() => setSelectedLaw(law.key)}
              className={`px-4 py-2 font-medium transition-colors ${
                selectedLaw === law.key
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {law.label}
            </button>
          ))}
        </div>

        {/* 선택된 법규 상세 정보 */}
        {currentLaw && (
          <div className="space-y-4">
            <div className={`border-2 rounded-lg p-6 ${getStatusColor(currentLaw.status)}`}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-2xl font-bold">{currentLaw.name}</h4>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold">{getStatusLabel(currentLaw.status)}</span>
                  {('maxFine' in currentLaw) && currentLaw.maxFine && (
                    <span className="text-sm px-3 py-1 bg-white/50 rounded-full">
                      최대 과태료: {currentLaw.maxFine}
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-2">위반 건수</div>
                <div className="text-3xl font-bold">{currentLaw.violationCount}건</div>
              </div>

              {/* 체크 항목 */}
              <div className="space-y-3 mt-6">
                <h5 className="font-semibold text-lg mb-3">검증 항목</h5>
                {currentLaw.checks.map((check, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                      check.passed
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{check.passed ? '✅' : '❌'}</span>
                      <span className="font-medium">{check.item}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(check.severity)}`}>
                      {check.severity === 'critical' ? '중요' : check.severity === 'high' ? '높음' : check.severity === 'medium' ? '중간' : '낮음'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 국제 규정 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">국제 규정 검증</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* GDPR */}
          <div className={`border-2 rounded-lg p-4 ${data.internationalLawValidation.gdpr.applicable ? 'border-blue-300 bg-blue-50' : 'border-gray-300 bg-gray-50'}`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-lg">{data.internationalLawValidation.gdpr.name}</h4>
              {data.internationalLawValidation.gdpr.applicable ? (
                <span className="text-xs px-2 py-1 bg-blue-200 rounded-full">적용</span>
              ) : (
                <span className="text-xs px-2 py-1 bg-gray-200 rounded-full">미적용</span>
              )}
            </div>
            <div className="text-xs text-gray-600 mb-2">최대 과태료: {data.internationalLawValidation.gdpr.maxFine}</div>
            <div className="space-y-2">
              {data.internationalLawValidation.gdpr.checks.map((check, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span>{check.item}</span>
                  <span className={check.passed ? 'text-green-600' : 'text-red-600'}>
                    {check.passed ? '✅' : '❌'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CCPA */}
          <div className={`border-2 rounded-lg p-4 ${data.internationalLawValidation.ccpa.applicable ? 'border-blue-300 bg-blue-50' : 'border-gray-300 bg-gray-50'}`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-lg">{data.internationalLawValidation.ccpa.name}</h4>
              {data.internationalLawValidation.ccpa.applicable ? (
                <span className="text-xs px-2 py-1 bg-blue-200 rounded-full">적용</span>
              ) : (
                <span className="text-xs px-2 py-1 bg-gray-200 rounded-full">미적용</span>
              )}
            </div>
            <div className="text-xs text-gray-600 mb-2">최대 과태료: {data.internationalLawValidation.ccpa.maxFine}</div>
            <div className="space-y-2">
              {data.internationalLawValidation.ccpa.checks.map((check, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span>{check.item}</span>
                  <span className={check.passed ? 'text-green-600' : 'text-red-600'}>
                    {check.passed ? '✅' : '❌'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* FTA */}
          <div className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-lg">{data.internationalLawValidation.fta.name}</h4>
            </div>
            <div className="space-y-2">
              {data.internationalLawValidation.fta.checks.map((check, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span>{check.item}</span>
                  <span className={check.passed ? 'text-green-600' : 'text-red-600'}>
                    {check.passed ? '✅' : '❌'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 플랫폼 정책 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">플랫폼 정책 검증</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.values(data.platformPolicyValidation).map((platform, index) => (
            <div key={index} className="border-2 border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-lg">{platform.platform}</h4>
                {'suspensionRisk' in platform && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    platform.suspensionRisk === 'none' ? 'bg-green-200 text-green-800' :
                    platform.suspensionRisk === 'low' ? 'bg-yellow-200 text-yellow-800' :
                    platform.suspensionRisk === 'medium' ? 'bg-orange-200 text-orange-800' :
                    platform.suspensionRisk === 'high' ? 'bg-red-200 text-red-800' :
                    'bg-gray-200 text-gray-800'
                  }`}>
                    {platform.suspensionRisk === 'none' ? '안전' :
                     platform.suspensionRisk === 'low' ? '낮음' :
                     platform.suspensionRisk === 'medium' ? '중간' :
                     platform.suspensionRisk === 'high' ? '높음' : '심각'}
                  </span>
                )}
              </div>
              {'suspensionRisk' in platform && (
                <div className="text-xs text-gray-600 mb-3">정지 위험도</div>
              )}
              {platform.violations.length > 0 && (
                <div className="mb-3">
                  <div className="text-sm font-semibold text-red-600 mb-1">위반 사항:</div>
                  {platform.violations.map((violation, i) => (
                    <div key={i} className="text-xs text-red-700">• {violation}</div>
                  ))}
                </div>
              )}
              <div className="space-y-2">
                {platform.checks.map((check, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span>{check.item}</span>
                    <span className={check.passed ? 'text-green-600' : 'text-red-600'}>
                      {check.passed ? '✅' : '❌'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 즉시 조치 필요 사항 */}
      {data.immediateActions.length > 0 && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-3">⚠️ 즉시 조치 필요 사항</h3>
          <ul className="space-y-2">
            {data.immediateActions.map((action, index) => (
              <li key={index} className="flex items-start gap-2 text-red-800">
                <span className="text-red-600 mt-1">•</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
