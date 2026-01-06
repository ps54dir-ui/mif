/**
 * 경쟁사 부정행위 감지
 * Layer 3-1: 경쟁사 감시 및 분석
 */

'use client'

import { useState } from 'react'
import { nikeCompetitorAnalysis } from '@/data/layer3MockData'

interface CompetitorFraudDetectionProps {
  companyName?: string
}

export function CompetitorFraudDetection({ companyName = '삼성생명' }: CompetitorFraudDetectionProps) {
  const [analysis] = useState(nikeCompetitorAnalysis)

  const getRiskColor = (risk: string) => {
    switch (risk) {
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

  const getThreatScoreColor = (score: number) => {
    if (score >= 70) return 'text-red-600'
    if (score >= 50) return 'text-orange-600'
    if (score >= 30) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">경쟁사 부정행위 감지</h2>
          <p className="text-gray-600 mt-1">{companyName} 경쟁사 감시 및 분석</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600 mb-1">감시 중인 경쟁사</div>
          <div className="text-3xl font-bold text-purple-600">
            {analysis.monitoredCompetitors.length}개
          </div>
        </div>
      </div>

      {/* 경쟁사 목록 */}
      <div className="space-y-6">
        {analysis.monitoredCompetitors.map((competitor, index) => (
          <div key={index} className="bg-white rounded-lg border-2 border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{competitor.companyName}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>카테고리: {competitor.category}</span>
                  <span>시장 점유율: {competitor.marketShare}%</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">위협 점수</div>
                <div className={`text-3xl font-bold ${getThreatScoreColor(competitor.threatScore)}`}>
                  {competitor.threatScore}
                </div>
                <div className="text-xs text-gray-500">/ 100점</div>
                <span className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRiskColor(competitor.riskLevel)}`}>
                  {competitor.riskLevel === 'high' ? '높음' :
                   competitor.riskLevel === 'medium' ? '중간' : '낮음'}
                </span>
              </div>
            </div>

            {/* 부정행위 감지 */}
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 mb-3">감지된 부정행위</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className={`p-3 rounded-lg border-2 ${competitor.fraudDetection.fakeTrafficDetected ? 'bg-red-50 border-red-300' : 'bg-green-50 border-green-300'}`}>
                  <div className="text-sm text-gray-600 mb-1">가짜 트래픽</div>
                  <div className="text-lg font-semibold">{competitor.fraudDetection.fakeTrafficDetected ? '❌ 감지' : '✅ 없음'}</div>
                </div>
                <div className={`p-3 rounded-lg border-2 ${competitor.fraudDetection.fakeReviewsDetected ? 'bg-red-50 border-red-300' : 'bg-green-50 border-green-300'}`}>
                  <div className="text-sm text-gray-600 mb-1">가짜 리뷰</div>
                  <div className="text-lg font-semibold">{competitor.fraudDetection.fakeReviewsDetected ? '❌ 감지' : '✅ 없음'}</div>
                </div>
                <div className={`p-3 rounded-lg border-2 ${competitor.fraudDetection.priceManipulation ? 'bg-red-50 border-red-300' : 'bg-green-50 border-green-300'}`}>
                  <div className="text-sm text-gray-600 mb-1">가격 조작</div>
                  <div className="text-lg font-semibold">{competitor.fraudDetection.priceManipulation ? '❌ 감지' : '✅ 없음'}</div>
                </div>
                <div className={`p-3 rounded-lg border-2 ${competitor.fraudDetection.falseAdvertising ? 'bg-red-50 border-red-300' : 'bg-green-50 border-green-300'}`}>
                  <div className="text-sm text-gray-600 mb-1">허위 광고</div>
                  <div className="text-lg font-semibold">{competitor.fraudDetection.falseAdvertising ? '❌ 감지' : '✅ 없음'}</div>
                </div>
              </div>
            </div>

            {/* 상세 정보 */}
            <div className="space-y-4">
              {/* 가짜 트래픽 */}
              {competitor.fraudDetection.fakeTrafficDetected && (
                <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <h5 className="font-semibold text-red-900 mb-2">가짜 트래픽 상세</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <div className="text-gray-600">봇 활동</div>
                      <div className="font-semibold">{competitor.details.fakeTraffic.botActivity}%</div>
                    </div>
                    <div>
                      <div className="text-gray-600">프록시 사용</div>
                      <div className="font-semibold">{competitor.details.fakeTraffic.proxyUsage}%</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-gray-600">의심 패턴</div>
                      <div className="text-xs">
                        {competitor.details.fakeTraffic.trafficPatternAnomalies.join(', ')}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 가짜 리뷰 */}
              {competitor.fraudDetection.fakeReviewsDetected && (
                <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <h5 className="font-semibold text-red-900 mb-2">가짜 리뷰 상세</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <div className="text-gray-600">표절 리뷰</div>
                      <div className="font-semibold">{competitor.details.fakeReviews.plagiarizedReviews}건</div>
                    </div>
                    <div>
                      <div className="text-gray-600">조직적 리뷰</div>
                      <div className="font-semibold">{competitor.details.fakeReviews.coordinatedReviews}건</div>
                    </div>
                    <div>
                      <div className="text-gray-600">의심 리뷰어</div>
                      <div className="font-semibold">{competitor.details.fakeReviews.suspiciousReviewers}명</div>
                    </div>
                  </div>
                  {competitor.details.fakeReviews.ratingAnomalies.length > 0 && (
                    <div className="mt-2 text-xs text-red-700">
                      이상 패턴: {competitor.details.fakeReviews.ratingAnomalies.join(', ')}
                    </div>
                  )}
                </div>
              )}

              {/* 가격 조작 */}
              {competitor.fraudDetection.priceManipulation && (
                <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                  <h5 className="font-semibold text-orange-900 mb-2">가격 조작 상세</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <div className="text-gray-600">원가 부풀리기</div>
                      <div className="font-semibold">{competitor.details.pricing.originalPriceInflation}%</div>
                    </div>
                    <div>
                      <div className="text-gray-600">덤핑</div>
                      <div className="font-semibold">{competitor.details.pricing.priceDumping ? '❌ 예' : '✅ 아니오'}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">번개 세일 남용</div>
                      <div className="font-semibold">{competitor.details.pricing.flashSaleAbuse ? '❌ 예' : '✅ 아니오'}</div>
                    </div>
                  </div>
                  {competitor.details.pricing.artificialDiscounts.length > 0 && (
                    <div className="mt-2 text-xs text-orange-700">
                      의심 할인: {competitor.details.pricing.artificialDiscounts.join(', ')}
                    </div>
                  )}
                </div>
              )}

              {/* 영향 분석 */}
              <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                <h5 className="font-semibold text-purple-900 mb-2">나에게 미치는 영향</h5>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-semibold">불공정 우위:</span> {competitor.impactOnYou.unfairAdvantage}
                  </div>
                  <div>
                    <span className="font-semibold">손실 매출:</span> {competitor.impactOnYou.lostRevenue.toLocaleString()}원
                  </div>
                  <div>
                    <span className="font-semibold">평판 손상:</span> {competitor.impactOnYou.reputationDamage}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 윤리적 경쟁사 */}
      {analysis.ethicalCompetitors.length > 0 && (
        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-green-900 mb-4">윤리적 경쟁사 (벤치마킹 대상)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analysis.ethicalCompetitors.map((competitor, index) => (
              <div key={index} className="bg-white rounded-lg border border-green-200 p-4">
                <div className="font-semibold text-gray-900 mb-2">{competitor.name}</div>
                <div className="text-sm text-gray-600 mb-3">
                  컴플라이언스 점수: <span className="font-semibold text-green-600">{competitor.complianceScore}점</span>
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  벤치마킹 가치: <span className="font-semibold">{competitor.benchmarkingValue}점</span>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-gray-700 mb-1">윤리적 실천:</div>
                  {competitor.ethicalPractices.map((practice, pIndex) => (
                    <div key={pIndex} className="text-xs text-gray-600 flex items-center gap-1">
                      <span className="text-green-600">✓</span>
                      <span>{practice}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
