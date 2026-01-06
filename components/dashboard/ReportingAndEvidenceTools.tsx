/**
 * 신고 도구
 * Layer 3-3: 증거 수집 및 신고 시스템
 */

'use client'

import { useState } from 'react'
import { nikeReportingTools } from '@/data/layer3MockData'

interface ReportingAndEvidenceToolsProps {
  companyName?: string
}

export function ReportingAndEvidenceTools({ companyName = '삼성생명' }: ReportingAndEvidenceToolsProps) {
  const [tools] = useState(nikeReportingTools)

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'weak':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">신고 도구</h2>
          <p className="text-gray-600 mt-1">{companyName} 증거 수집 및 신고 시스템</p>
        </div>
      </div>

      {/* 증거 수집 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">증거 수집</h3>
        <div className="space-y-4">
          {/* 스크린샷 */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">스크린샷</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {tools.evidenceCollection.screenshots.map((screenshot, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50 text-center">
                  <div className="text-4xl mb-2">📷</div>
                  <div className="text-sm text-gray-600 truncate">{screenshot}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 데이터 분석 */}
          <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
            <h4 className="font-semibold text-gray-900 mb-3">데이터 분석</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-semibold">통계적 증거:</span>
                <span className="ml-2">{tools.evidenceCollection.dataAnalysis.statisticalEvidence}</span>
              </div>
              <div>
                <span className="font-semibold">패턴 분석:</span>
                <span className="ml-2">{tools.evidenceCollection.dataAnalysis.patternAnalysis}</span>
              </div>
              <div>
                <span className="font-semibold">타임라인:</span>
                <span className="ml-2">{tools.evidenceCollection.dataAnalysis.timeline}</span>
              </div>
            </div>
          </div>

          {/* 전문가 의견 */}
          <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
            <h4 className="font-semibold text-gray-900 mb-2">전문가 의견</h4>
            <p className="text-sm text-gray-700">{tools.evidenceCollection.expertOpinion}</p>
          </div>

          {/* 법적 강도 */}
          <div className={`border-2 rounded-lg p-4 ${getStrengthColor(tools.evidenceCollection.legalStrength)}`}>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold mb-1">법적 증거 강도</h4>
                <p className="text-sm opacity-90">
                  {tools.evidenceCollection.legalStrength === 'strong' ? '강력함' :
                   tools.evidenceCollection.legalStrength === 'medium' ? '보통' : '약함'}
                </p>
              </div>
              <div className="text-3xl">
                {tools.evidenceCollection.legalStrength === 'strong' ? '✅' :
                 tools.evidenceCollection.legalStrength === 'medium' ? '⚠️' : '❌'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 플랫폼 신고 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">플랫폼 신고</h3>
        <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">신고 ID</div>
              <div className="font-mono font-semibold text-blue-600">{tools.platformReport.reportId}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">플랫폼</div>
              <div className="font-semibold">
                {tools.platformReport.platform === 'naver_smart_store' ? '네이버 스마트스토어' :
                 tools.platformReport.platform === 'coupang' ? '쿠팡' :
                 tools.platformReport.platform === 'google_shop' ? '구글 쇼핑' : tools.platformReport.platform}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">제출일</div>
              <div>{new Date(tools.platformReport.submittedDate).toLocaleDateString('ko-KR')}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">위반 유형</div>
              <div className="font-semibold">{tools.platformReport.violationType}</div>
            </div>
            <div className="col-span-2">
              <div className="text-sm text-gray-600 mb-1">증거 요약</div>
              <div className="text-sm">{tools.platformReport.evidenceSummary}</div>
            </div>
            <div className="col-span-2">
              <div className="text-sm text-gray-600 mb-2">예상 결과</div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="text-xs text-gray-600 mb-1">제거 가능성</div>
                  <div className="text-xl font-bold text-blue-600">{tools.platformReport.expectedOutcome.removalLikelihood}%</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="text-xs text-gray-600 mb-1">소요 시간</div>
                  <div className="text-sm font-semibold">{tools.platformReport.expectedOutcome.timeline}</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="text-xs text-gray-600 mb-1">이의 제기 가능</div>
                  <div className="text-sm font-semibold">{tools.platformReport.expectedOutcome.appealAvailable ? '✅ 예' : '❌ 아니오'}</div>
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <div className="text-sm text-gray-600 mb-1">추적 URL</div>
              <a
                href={tools.platformReport.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {tools.platformReport.trackingUrl}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 경찰 신고 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">경찰 신고</h3>
        <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">범죄 유형</div>
              <div className="font-semibold">
                {tools.policeReport.offenseType === 'fraud' ? '사기' :
                 tools.policeReport.offenseType === 'defamation' ? '명예훼손' :
                 tools.policeReport.offenseType === 'intellectual_property_theft' ? '지적재산권 침해' : tools.policeReport.offenseType}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">의심자 정보</div>
              <div className="font-semibold">{tools.policeReport.suspectInfo}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">증거 요약</div>
              <div className="text-sm">{tools.policeReport.evidenceSummary}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-2">적용 법률</div>
              <div className="flex flex-wrap gap-2">
                {tools.policeReport.applicableLaws.map((law, index) => (
                  <span key={index} className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm">
                    {law}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-2">필요 서류</div>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {tools.policeReport.requiredDocuments.map((doc, index) => (
                  <li key={index}>{doc}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-2">다음 단계</div>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {tools.policeReport.nextSteps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">예상 소요 시간</div>
              <div className="font-semibold">{tools.policeReport.estimatedTimeline}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 민사소송 준비 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">민사소송 준비</h3>
        <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">사건 유형</div>
              <div className="font-semibold">민사소송</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-2">법적 근거</div>
              <div className="flex flex-wrap gap-2">
                {tools.lawsuitPreparation.legalGrounds.map((ground, index) => (
                  <span key={index} className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm">
                    {ground}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-2">손해 배상 청구</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="text-xs text-gray-600 mb-1">실제 손해</div>
                  <div className="text-sm font-semibold">{tools.lawsuitPreparation.damagesClaim.actualDamages.toLocaleString()}원</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="text-xs text-gray-600 mb-1">손실 이익</div>
                  <div className="text-sm font-semibold">{tools.lawsuitPreparation.damagesClaim.lostProfit.toLocaleString()}원</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="text-xs text-gray-600 mb-1">징벌적 손해</div>
                  <div className="text-sm font-semibold">{tools.lawsuitPreparation.damagesClaim.exemplaryDamages.toLocaleString()}원</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-purple-200 bg-purple-100">
                  <div className="text-xs text-gray-600 mb-1">총 청구액</div>
                  <div className="text-lg font-bold text-purple-600">{tools.lawsuitPreparation.damagesClaim.totalClaim.toLocaleString()}원</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`border-2 rounded-lg p-4 ${getStrengthColor(tools.lawsuitPreparation.evidenceStrength)}`}>
                <div className="text-sm text-gray-600 mb-1">증거 강도</div>
                <div className="text-xl font-semibold">
                  {tools.lawsuitPreparation.evidenceStrength === 'strong' ? '강력함' :
                   tools.lawsuitPreparation.evidenceStrength === 'medium' ? '보통' : '약함'}
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="text-sm text-gray-600 mb-1">승소 확률</div>
                <div className="text-3xl font-bold text-blue-600">{tools.lawsuitPreparation.winProbability}%</div>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-2">예상 비용</div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="text-xs text-gray-600 mb-1">변호사 비용</div>
                  <div className="text-sm font-semibold">{tools.lawsuitPreparation.estimatedCost.attorneyFees.toLocaleString()}원</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="text-xs text-gray-600 mb-1">법원 비용</div>
                  <div className="text-sm font-semibold">{tools.lawsuitPreparation.estimatedCost.courtFees.toLocaleString()}원</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="text-xs text-gray-600 mb-1">전문가 증인</div>
                  <div className="text-sm font-semibold">{tools.lawsuitPreparation.estimatedCost.expertWitness.toLocaleString()}원</div>
                </div>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">예상 소요 시간</div>
              <div className="font-semibold">{tools.lawsuitPreparation.estimatedDuration}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
