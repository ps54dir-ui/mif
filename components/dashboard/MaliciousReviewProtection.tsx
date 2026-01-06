/**
 * 악플/공격 감시
 * Layer 3-2: 악의적 리뷰 및 공격 감지
 */

'use client'

import { useState } from 'react'
import { nikeMaliciousReviews } from '@/data/layer3MockData'

interface MaliciousReviewProtectionProps {
  companyName?: string
}

export function MaliciousReviewProtection({ companyName = '삼성생명' }: MaliciousReviewProtectionProps) {
  const [data] = useState(nikeMaliciousReviews)

  const getActionColor = (action: string) => {
    switch (action) {
      case 'flag':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'report':
        return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'respond':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getEvidenceColor = (value: string) => {
    switch (value) {
      case 'high':
        return 'text-green-600 bg-green-50'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50'
      case 'low':
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
          <h2 className="text-2xl font-bold text-gray-900">악플/공격 감시</h2>
          <p className="text-gray-600 mt-1">{companyName} 악의적 리뷰 및 공격 감지</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600 mb-1">악의적 리뷰</div>
          <div className="text-3xl font-bold text-red-600">
            {data.maliciousReviews.length}건
          </div>
        </div>
      </div>

      {/* 악의적 리뷰 목록 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">악의적 리뷰 감지</h3>
        <div className="space-y-4">
          {data.maliciousReviews.map((review, index) => (
            <div key={index} className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-gray-900">{review.reviewerName}</span>
                    <span className="text-sm text-gray-600">평점: {review.rating}점</span>
                    <span className="text-xs px-2 py-1 bg-red-200 text-red-800 rounded-full">
                      진실성 점수: {review.authenticityScore}점
                    </span>
                  </div>
                  <div className="text-gray-700 mb-3">{review.content}</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className={`p-2 rounded text-xs text-center ${review.maliceIndicators.fakeAccount ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                      {review.maliceIndicators.fakeAccount ? '❌ 가짜 계정' : '✅ 실제 계정'}
                    </div>
                    <div className={`p-2 rounded text-xs text-center ${review.maliceIndicators.coordinatedAttack ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                      {review.maliceIndicators.coordinatedAttack ? '❌ 조직적 공격' : '✅ 개별 리뷰'}
                    </div>
                    <div className={`p-2 rounded text-xs text-center ${review.maliceIndicators.competitorInitiated ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                      {review.maliceIndicators.competitorInitiated ? '❌ 경쟁사 개입' : '✅ 경쟁사 무관'}
                    </div>
                    <div className={`p-2 rounded text-xs text-center ${review.maliceIndicators.botGenerated ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                      {review.maliceIndicators.botGenerated ? '❌ 봇 생성' : '✅ 인간 작성'}
                    </div>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${getActionColor(review.recommendedAction)}`}>
                    {review.recommendedAction === 'flag' ? '🏷️ 표시' :
                     review.recommendedAction === 'report' ? '📢 신고' : '💬 응답'}
                  </span>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getEvidenceColor(review.legalEvidenceValue)}`}>
                    증거 가치: {review.legalEvidenceValue === 'high' ? '높음' :
                               review.legalEvidenceValue === 'medium' ? '중간' : '낮음'}
                  </div>
                  {review.canSue && (
                    <div className="mt-2 text-xs text-red-600 font-semibold">✅ 소송 가능</div>
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-600">
                실제 고객 여부: {review.isRealCustomer ? '✅ 예' : '❌ 아니오'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 조직적 공격 */}
      {data.coordinatedAttacks.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">조직적 공격 감지</h3>
          <div className="space-y-6">
            {data.coordinatedAttacks.map((attack, index) => (
              <div key={index} className="border-2 border-red-300 rounded-lg p-6 bg-red-50">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-red-900 mb-2">공격 ID: {attack.attackId}</h4>
                    <div className="text-sm text-gray-600">공격 일자: {attack.attackDate.toLocaleDateString('ko-KR')}</div>
                  </div>
                </div>

                {/* 공격자 프로필 */}
                <div className="mb-4">
                  <h5 className="font-semibold text-gray-900 mb-2">공격자 프로필</h5>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">유형:</span>
                        <span className="ml-2 font-semibold">
                          {attack.attackerProfile.type === 'competitor' ? '경쟁사' :
                           attack.attackerProfile.type === 'disgruntled_customer' ? '불만 고객' :
                           attack.attackerProfile.type === 'hate_group' ? '악의적 그룹' : '알 수 없음'}
                        </span>
                      </div>
                      {attack.attackerProfile.identifiedCompetitor && (
                        <div>
                          <span className="text-gray-600">식별된 경쟁사:</span>
                          <span className="ml-2 font-semibold text-red-600">{attack.attackerProfile.identifiedCompetitor}</span>
                        </div>
                      )}
                      <div className="col-span-2">
                        <span className="text-gray-600">동기:</span>
                        <span className="ml-2">{attack.attackerProfile.motivation}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 공격 규모 */}
                <div className="mb-4">
                  <h5 className="font-semibold text-gray-900 mb-2">공격 규모</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-xs text-gray-600 mb-1">리뷰 수</div>
                      <div className="text-xl font-bold text-red-600">{attack.attackScale.reviewCount}건</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-xs text-gray-600 mb-1">기간</div>
                      <div className="text-sm font-semibold">{attack.attackScale.period}</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-xs text-gray-600 mb-1">빈도</div>
                      <div className="text-xl font-bold">{attack.attackScale.frequency}건/일</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-xs text-gray-600 mb-1">평점 영향</div>
                      <div className="text-xl font-bold text-red-600">{attack.attackScale.impactOnRating}</div>
                    </div>
                  </div>
                </div>

                {/* 증거 */}
                <div className="mb-4">
                  <h5 className="font-semibold text-gray-900 mb-2">수집된 증거</h5>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {Object.entries(attack.evidence).map(([key, value]) => (
                      <div key={key} className={`p-2 rounded text-xs text-center ${value ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                        {value ? '✅' : '❌'} {key === 'identicalContentAnalysis' ? '동일 내용' :
                                            key === 'timingPatternAnalysis' ? '타이밍 패턴' :
                                            key === 'reviewerNetworkAnalysis' ? '리뷰어 네트워크' :
                                            key === 'ipAddressClustering' ? 'IP 클러스터링' :
                                            key === 'writingStyleAnalysis' ? '작성 스타일' : key}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 신고 옵션 */}
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">신고 옵션</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* 플랫폼 신고 */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="font-semibold text-sm mb-2">플랫폼 신고</div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>가능: {attack.reportOptions.reportToPlatform.available ? '✅ 예' : '❌ 아니오'}</div>
                        <div>성공률: {attack.reportOptions.reportToPlatform.successRate}%</div>
                        <div>소요 시간: {attack.reportOptions.reportToPlatform.timeline}</div>
                      </div>
                    </div>

                    {/* 경찰 신고 */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="font-semibold text-sm mb-2">경찰 신고</div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>가능: {attack.reportOptions.reportToPolice.available ? '✅ 예' : '❌ 아니오'}</div>
                        <div>증거 필요: {attack.reportOptions.reportToPolice.requiresEvidence ? '✅ 예' : '❌ 아니오'}</div>
                        <div>혐의: {attack.reportOptions.reportToPolice.charge}</div>
                      </div>
                    </div>

                    {/* 법적 조치 */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="font-semibold text-sm mb-2">법적 조치</div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>가능: {attack.reportOptions.legalAction.available ? '✅ 예' : '❌ 아니오'}</div>
                        <div>손해 배상: {attack.reportOptions.legalAction.damagesClaim.toLocaleString()}원</div>
                        <div className="text-xs">필요 증거: {attack.reportOptions.legalAction.proofNeeded}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 경쟁사 개입 */}
      {data.competitorInvolvement && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-red-900 mb-4">경쟁사 개입 감지</h3>
          <div className="space-y-4">
            <div>
              <div className="font-semibold text-gray-900 mb-2">개입한 경쟁사</div>
              <div className="flex gap-2">
                {data.competitorInvolvement.involvedCompetitors.map((competitor, index) => (
                  <span key={index} className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-sm font-semibold">
                    {competitor}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="font-semibold text-gray-900 mb-2">개입 증거</div>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                {data.competitorInvolvement.evidenceOfInvolvement.map((evidence, index) => (
                  <li key={index}>{evidence}</li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-red-200">
                <div className="text-sm text-gray-600 mb-1">법적 조치 가능</div>
                <div className="text-lg font-semibold">{data.competitorInvolvement.legalActionAvailable ? '✅ 예' : '❌ 아니오'}</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-red-200">
                <div className="text-sm text-gray-600 mb-1">손해 배상 청구 가능</div>
                <div className="text-lg font-semibold">{data.competitorInvolvement.canSeekDamages ? '✅ 예' : '❌ 아니오'}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
