'use client'

import React, { useState } from 'react'
import type { InvestmentAnalysis } from '@/lib/types/consulting'

interface InvestmentROIProps {
  analysis: InvestmentAnalysis
  brandName?: string
}

export function InvestmentROI({ analysis, brandName = '브랜드' }: InvestmentROIProps) {
  const [selectedScenario, setSelectedScenario] = useState<'conservative' | 'realistic' | 'aggressive'>('realistic')

  const scenario = analysis.roiAnalysis.scenarios[selectedScenario]

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-6 text-white">
        <div>
          <h2 className="text-2xl font-bold mb-1">💰 투자 분석 & ROI</h2>
          <p className="text-emerald-100 text-sm">투자 계획, 예상 수익, ROI 분석</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 투자 계획 요약 */}
        <div className="bg-emerald-50 rounded-lg border border-emerald-200 p-4">
          <h3 className="font-bold text-emerald-900 mb-4">투자 계획 요약</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-emerald-200 p-3">
              <div className="text-sm text-gray-600 mb-1">총 투자액</div>
              <div className="text-2xl font-bold text-emerald-600">
                {analysis.investmentPlan.totalInvestment.toLocaleString()}원
              </div>
              <div className="text-xs text-gray-500 mt-1">{analysis.investmentPlan.period}</div>
            </div>
            <div className="bg-white rounded-lg border border-emerald-200 p-3">
              <div className="text-sm text-gray-600 mb-1">인력 비용</div>
              <div className="text-lg font-bold text-emerald-600">
                {(analysis.investmentPlan.costs.teamCosts.marketingDirector.totalCost +
                  analysis.investmentPlan.costs.teamCosts.contentCreators.totalCost +
                  analysis.investmentPlan.costs.teamCosts.designers.totalCost).toLocaleString()}원
              </div>
            </div>
            <div className="bg-white rounded-lg border border-emerald-200 p-3">
              <div className="text-sm text-gray-600 mb-1">광고 예산</div>
              <div className="text-lg font-bold text-emerald-600">
                {analysis.investmentPlan.costs.advertisingBudget.total6months.toLocaleString()}원
              </div>
            </div>
            <div className="bg-white rounded-lg border border-emerald-200 p-3">
              <div className="text-sm text-gray-600 mb-1">콘텐츠 제작</div>
              <div className="text-lg font-bold text-emerald-600">
                {analysis.investmentPlan.costs.contentProduction.total6months.toLocaleString()}원
              </div>
            </div>
          </div>
        </div>

        {/* 시나리오 선택 */}
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedScenario('conservative')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              selectedScenario === 'conservative'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            보수적
          </button>
          <button
            onClick={() => setSelectedScenario('realistic')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              selectedScenario === 'realistic'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            현실적
          </button>
          <button
            onClick={() => setSelectedScenario('aggressive')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              selectedScenario === 'aggressive'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            공격적
          </button>
        </div>

        {/* ROI 분석 */}
        <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border border-green-200 p-4">
          <h3 className="font-bold text-green-900 mb-4">ROI 분석 ({selectedScenario})</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-white rounded-lg border border-green-200 p-3">
              <div className="text-sm text-gray-600 mb-1">투자액</div>
              <div className="text-xl font-bold text-green-600">{scenario.investment.toLocaleString()}원</div>
            </div>
            <div className="bg-white rounded-lg border border-green-200 p-3">
              <div className="text-sm text-gray-600 mb-1">6개월 수익</div>
              <div className="text-xl font-bold text-green-600">{scenario.revenue6Month.toLocaleString()}원</div>
            </div>
            <div className="bg-white rounded-lg border border-green-200 p-3">
              <div className="text-sm text-gray-600 mb-1">12개월 수익</div>
              <div className="text-xl font-bold text-green-600">{scenario.revenue12Month.toLocaleString()}원</div>
            </div>
            <div className="bg-white rounded-lg border border-green-200 p-3">
              <div className="text-sm text-gray-600 mb-1">12개월 ROI</div>
              <div className={`text-xl font-bold ${
                scenario.roi12Month > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {scenario.roi12Month > 0 ? '+' : ''}{scenario.roi12Month}%
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-green-200 p-3">
            <div className="text-sm text-gray-600 mb-1">본전 회수 시점</div>
            <div className="text-lg font-bold text-green-600">{scenario.breakeven}</div>
          </div>
        </div>

        {/* 월별 예상 수익 */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4">월별 예상 수익</h3>
          <div className="space-y-2">
            {analysis.expectedRevenue.monthlyProjection.map((month) => (
              <div key={month.month} className="bg-white rounded-lg border border-gray-200 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-gray-900">{month.month}월</span>
                    <span className="text-sm text-gray-600 ml-2">
                      기준: {month.baseline.toLocaleString()}원
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      {month.projected.toLocaleString()}원
                    </div>
                    <div className="text-xs text-gray-500">
                      증가: +{month.increment.toLocaleString()}원 ({Math.round((month.increment / month.baseline) * 100)}%)
                    </div>
                  </div>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${(month.projected / analysis.expectedRevenue.monthlyProjection[5].projected) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 투자 권고 */}
        <div className={`rounded-lg border-2 p-4 ${
          analysis.recommendation.verdict === 'GO' ? 'bg-green-50 border-green-300' :
          analysis.recommendation.verdict === 'NO-GO' ? 'bg-red-50 border-red-300' :
          'bg-yellow-50 border-yellow-300'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900">투자 권고</h3>
            <span className={`px-4 py-2 rounded-lg font-bold text-white ${
              analysis.recommendation.verdict === 'GO' ? 'bg-green-600' :
              analysis.recommendation.verdict === 'NO-GO' ? 'bg-red-600' :
              'bg-yellow-600'
            }`}>
              {analysis.recommendation.verdict === 'GO' ? '진행 권고' :
               analysis.recommendation.verdict === 'NO-GO' ? '진행 비권고' :
               '조건부 진행'}
            </span>
          </div>
          <div className="text-sm text-gray-700 mb-2">{analysis.recommendation.rationale}</div>
          <div className="text-sm text-gray-600">
            <div className="font-medium mb-1">조건:</div>
            <ul className="list-disc list-inside space-y-1">
              {analysis.recommendation.conditions.map((condition, idx) => (
                <li key={idx}>{condition}</li>
              ))}
            </ul>
          </div>
          <div className="mt-3 text-sm">
            <span className="font-medium">기대 수익:</span>{' '}
            <span className="font-bold text-green-600">{analysis.recommendation.expectedReturn.toLocaleString()}원</span>
            {' '}|{' '}
            <span className="font-medium">위험도:</span>{' '}
            <span className={`font-bold ${
              analysis.recommendation.riskLevel === 'low' ? 'text-green-600' :
              analysis.recommendation.riskLevel === 'medium' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {analysis.recommendation.riskLevel === 'low' ? '낮음' :
               analysis.recommendation.riskLevel === 'medium' ? '보통' : '높음'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
