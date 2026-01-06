/**
 * 컴플라이언스 스코어카드 생성기
 * Layer 2-3: 등급 배지 및 증명서 시스템
 */

'use client'

import { useState } from 'react'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts'
import { nikeComplianceScorecard } from '@/data/layer2MockData'

interface ComplianceScorecardGeneratorProps {
  companyName?: string
}

export function ComplianceScorecardGenerator({ companyName = '삼성생명' }: ComplianceScorecardGeneratorProps) {
  const [scorecard] = useState<typeof nikeComplianceScorecard>(nikeComplianceScorecard)

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'AAA':
        return 'bg-gradient-to-br from-green-500 to-green-700 text-white'
      case 'AA':
        return 'bg-gradient-to-br from-blue-500 to-blue-700 text-white'
      case 'A':
        return 'bg-gradient-to-br from-yellow-500 to-yellow-700 text-white'
      case 'B':
        return 'bg-gradient-to-br from-orange-500 to-orange-700 text-white'
      case 'C':
        return 'bg-gradient-to-br from-red-500 to-red-700 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  // 레이더 차트 데이터 준비
  const radarData = [
    {
      category: '가격 윤리',
      score: scorecard.categoryScores.pricingEthics.score,
      fullMark: 100
    },
    {
      category: '광고 정직성',
      score: scorecard.categoryScores.advertisingHonesty.score,
      fullMark: 100
    },
    {
      category: '트래픽 정당성',
      score: scorecard.categoryScores.trafficLegitimacy.score,
      fullMark: 100
    },
    {
      category: '리뷰 진실성',
      score: scorecard.categoryScores.reviewAuthenticity.score,
      fullMark: 100
    },
    {
      category: '데이터 보호',
      score: scorecard.categoryScores.dataPrivacy.score,
      fullMark: 100
    },
    {
      category: '지적재산권',
      score: scorecard.categoryScores.intellectualProperty.score,
      fullMark: 100
    },
    {
      category: '소비자 보호',
      score: scorecard.categoryScores.consumerProtection.score,
      fullMark: 100
    }
  ]

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">컴플라이언스 스코어카드</h2>
          <p className="text-gray-600 mt-1">{companyName} 컴플라이언스 등급 증명서</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600 mb-1">종합 점수</div>
          <div className="text-4xl font-bold text-blue-600">
            {scorecard.overallScore}
            <span className="text-2xl text-gray-500">/100</span>
          </div>
        </div>
      </div>

      {/* 등급 배지 */}
      <div className={`${getRatingColor(scorecard.rating)} rounded-2xl p-8 text-center shadow-lg`}>
        <div className="mb-4">
          <div className="text-6xl font-bold mb-2">{scorecard.rating}</div>
          <div className="text-xl opacity-90">컴플라이언스 등급</div>
        </div>
        <div className="mt-6 pt-6 border-t border-white/30">
          <div className="text-sm opacity-80">발행일: {scorecard.issuedDate.toLocaleDateString('ko-KR')}</div>
          <div className="text-sm opacity-80">유효기간: {scorecard.validUntil.toLocaleDateString('ko-KR')}까지</div>
        </div>
      </div>

      {/* 증명서 정보 */}
      <div className="bg-white rounded-lg border-2 border-blue-300 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">증명서 정보</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600 mb-1">증명서 ID</div>
            <div className="text-lg font-mono font-semibold text-blue-600">{scorecard.certificate.uniqueId}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">검증 URL</div>
            <a
              href={scorecard.certificate.verificationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg text-blue-600 hover:underline break-all"
            >
              {scorecard.certificate.verificationUrl}
            </a>
          </div>
          <div className="col-span-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={scorecard.certificate.canDisplayBadge}
                readOnly
                className="w-5 h-5"
              />
              <label className="text-sm text-gray-700">웹사이트에 배지 표시 가능</label>
            </div>
          </div>
        </div>
      </div>

      {/* 레이더 차트 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">카테고리별 점수 분석</h3>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="category" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
            <Radar
              name="점수"
              dataKey="score"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* 카테고리별 상세 점수 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">카테고리별 상세 점수</h3>
        <div className="space-y-4">
          {Object.entries(scorecard.categoryScores).map(([key, category]) => (
            <div key={key} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">
                    {key === 'pricingEthics' ? '가격 윤리' :
                     key === 'advertisingHonesty' ? '광고 정직성' :
                     key === 'trafficLegitimacy' ? '트래픽 정당성' :
                     key === 'reviewAuthenticity' ? '리뷰 진실성' :
                     key === 'dataPrivacy' ? '데이터 보호' :
                     key === 'intellectualProperty' ? '지적재산권' :
                     key === 'consumerProtection' ? '소비자 보호' : key}
                  </div>
                  <div className="text-sm text-gray-600">가중치: {category.weight}%</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{category.score}점</div>
                  <div className="text-xs text-gray-500">/ 100점</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${category.score}%` }}
                />
              </div>
              {category.details.length > 0 && (
                <div className="mt-3 space-y-1">
                  {category.details.map((detail, index) => (
                    <div key={index} className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 개선 필요 사항 */}
      {scorecard.improvementsNeeded && Array.isArray(scorecard.improvementsNeeded) && scorecard.improvementsNeeded.length > 0 && (
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-4">개선 필요 사항</h3>
          <div className="space-y-3">
            {(scorecard.improvementsNeeded as Array<{ area: string; currentStatus: string; requiredAction: string; timeline: string; priority: 'critical' | 'high' | 'medium' | 'low' }>).map((improvement, index) => (
              <div key={index} className={`border-2 rounded-lg p-4 ${getPriorityColor(improvement.priority)}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-semibold mb-1">{improvement.area}</div>
                    <div className="text-sm mb-2">현재 상태: {improvement.currentStatus}</div>
                    <div className="text-sm font-medium mb-1">필요 조치: {improvement.requiredAction}</div>
                    <div className="text-xs opacity-80">기한: {improvement.timeline}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(improvement.priority)}`}>
                    {improvement.priority === 'critical' ? '긴급' :
                     improvement.priority === 'high' ? '높음' :
                     improvement.priority === 'medium' ? '중간' : '낮음'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 법적 상태 */}
      <div className={`rounded-lg border-2 p-6 ${scorecard.legalStatus.violationsFound ? 'bg-red-50 border-red-300' : 'bg-green-50 border-green-300'}`}>
        <h3 className="text-lg font-semibold mb-4">
          {scorecard.legalStatus.violationsFound ? '⚠️ 법적 위반 사항 발견' : '✅ 법적 상태 양호'}
        </h3>
        <div className="space-y-2">
          {scorecard.legalStatus.violationsFound && scorecard.legalStatus.criticalIssues.length > 0 && (
            <div>
              <div className="text-sm font-semibold mb-2">심각한 문제:</div>
              <ul className="list-disc list-inside space-y-1">
                {scorecard.legalStatus.criticalIssues.map((issue, index) => (
                  <li key={index} className="text-sm">{issue}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="text-sm">
            <div className="font-semibold mb-1">권장사항:</div>
            <div>{scorecard.legalStatus.recommendation}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
