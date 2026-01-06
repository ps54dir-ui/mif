'use client'

import React from 'react'
import type { MetaAdsPerformance, MetaGA4Match } from '@/lib/meta/metaAdsApi'
import type { CreativePsychologyDiagnosis } from '@/lib/meta/creativePsychology'
import type { AdsOptimizationReport } from '@/lib/meta/adsOptimization'

interface MetaAdsDashboardProps {
  metaPerformance: MetaAdsPerformance
  ga4Matches: MetaGA4Match[]
  psychologyDiagnoses: CreativePsychologyDiagnosis[]
  optimizationReport: AdsOptimizationReport
}

export default function MetaAdsDashboard({
  metaPerformance,
  ga4Matches,
  psychologyDiagnoses,
  optimizationReport
}: MetaAdsDashboardProps) {
  return (
    <div className="space-y-6">
      {/* 메타 광고 성과 요약 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-400 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">
          📱 메타 광고 성과 통합 대시보드
        </h2>
        
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="p-4 bg-white rounded-lg border border-blue-200">
            <div className="text-xs text-gray-600 mb-1">총 노출수</div>
            <div className="text-2xl font-bold text-blue-600">
              {metaPerformance.totalImpressions.toLocaleString()}
            </div>
          </div>
          <div className="p-4 bg-white rounded-lg border border-blue-200">
            <div className="text-xs text-gray-600 mb-1">총 클릭수</div>
            <div className="text-2xl font-bold text-green-600">
              {metaPerformance.totalClicks.toLocaleString()}
            </div>
          </div>
          <div className="p-4 bg-white rounded-lg border border-blue-200">
            <div className="text-xs text-gray-600 mb-1">평균 CTR</div>
            <div className="text-2xl font-bold text-purple-600">
              {metaPerformance.averageCTR.toFixed(2)}%
            </div>
          </div>
          <div className="p-4 bg-white rounded-lg border border-blue-200">
            <div className="text-xs text-gray-600 mb-1">평균 ROAS</div>
            <div className="text-2xl font-bold text-orange-600">
              {metaPerformance.averageROAS.toFixed(2)}x
            </div>
          </div>
        </div>
        
        <div className="text-xs text-gray-600">
          마지막 업데이트: {new Date(metaPerformance.lastUpdated).toLocaleString('ko-KR')}
        </div>
      </div>
      
      {/* GA4 매칭 데이터 */}
      <div className="bg-white rounded-lg border-2 border-green-300 p-6 shadow-lg">
        <h3 className="text-xl font-bold text-green-900 mb-4">
          🔗 메타 광고 ↔ GA4 데이터 매칭
        </h3>
        
        <div className="space-y-4">
          {ga4Matches.map((match) => (
            <div key={match.campaignId} className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-gray-900 mb-3">{match.campaignName}</h4>
              
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div>
                  <div className="text-xs text-gray-600 mb-1">메타 클릭</div>
                  <div className="font-bold text-blue-600">{match.metaClicks.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">GA4 세션</div>
                  <div className="font-bold text-green-600">{match.ga4Sessions.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">매칭률</div>
                  <div className="font-bold text-purple-600">{match.matchRate.toFixed(1)}%</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-gray-600 mb-1">GA4 전환</div>
                  <div className="font-bold text-indigo-600">{match.ga4Conversions.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">전환율</div>
                  <div className="font-bold text-orange-600">{match.conversionRate.toFixed(2)}%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">어트리뷰션 갭</div>
                  <div className={`font-bold ${match.attributionGap > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {match.attributionGap > 0 ? '+' : ''}{match.attributionGap.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 심리 기반 소재 진단 */}
      <div className="bg-white rounded-lg border-2 border-purple-300 p-6 shadow-lg">
        <h3 className="text-xl font-bold text-purple-900 mb-4">
          🧠 심리 기반 광고 소재 진단
        </h3>
        
        <div className="space-y-4">
          {psychologyDiagnoses.map((diagnosis) => (
            <div key={diagnosis.creativeId} className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-gray-900 mb-2">{diagnosis.creativeName}</h4>
              
              <div className="mb-3 p-3 bg-white rounded border">
                <div className="text-sm text-gray-600 mb-1">헤드라인</div>
                <div className="font-semibold text-gray-900">{diagnosis.headline}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="text-xs text-gray-600 mb-1">심리 타입</div>
                  <div className="font-bold text-purple-600">
                    {diagnosis.psychology.type === 'dopamine' ? '도파민 (기대감)' :
                     diagnosis.psychology.type === 'cortisol' ? '코르티솔 (긴급성)' : '혼합'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">심리 점수</div>
                  <div className="font-bold text-indigo-600">{diagnosis.psychology.overallScore}점</div>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="text-xs text-gray-600 mb-1">도파민 vs 코르티솔</div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <div className="text-xs text-gray-600 mb-1">도파민 (기대감)</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${diagnosis.psychology.dopamineScore}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{diagnosis.psychology.dopamineScore}%</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-600 mb-1">코르티솔 (긴급성)</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-600 h-2 rounded-full"
                        style={{ width: `${diagnosis.psychology.cortisolScore}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{diagnosis.psychology.cortisolScore}%</div>
                  </div>
                </div>
              </div>
              
              <div className="mb-3 p-3 bg-white rounded border">
                <div className="text-xs text-gray-600 mb-1">톤</div>
                <div className="text-sm text-gray-700">{diagnosis.psychology.tone}</div>
              </div>
              
              <div className={`p-3 rounded border-2 ${
                diagnosis.pagePsychologyMatch.isAligned
                  ? 'bg-green-50 border-green-300'
                  : 'bg-red-50 border-red-300'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold text-gray-700">상세페이지 일치도</div>
                  <div className={`font-bold ${
                    diagnosis.pagePsychologyMatch.isAligned ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {diagnosis.pagePsychologyMatch.matchScore}점
                    {diagnosis.pagePsychologyMatch.isAligned ? ' ✓' : ' ⚠️'}
                  </div>
                </div>
                <p className="text-sm text-gray-700">{diagnosis.pagePsychologyMatch.recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 최적화 전략 리포트 */}
      <div className="bg-white rounded-lg border-2 border-orange-300 p-6 shadow-lg">
        <h3 className="text-xl font-bold text-orange-900 mb-4">
          🎯 메타 광고 최적화 전략
        </h3>
        
        <div className="mb-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
          <p className="text-sm text-orange-900">{optimizationReport.overallInsight}</p>
        </div>
        
        {optimizationReport.strategies.length > 0 && (
          <div className="space-y-4">
            {optimizationReport.strategies.map((strategy) => (
              <div
                key={strategy.id}
                className={`p-4 rounded-lg border-2 ${
                  strategy.priority === 'CRITICAL' ? 'bg-red-50 border-red-400' :
                  strategy.priority === 'HIGH' ? 'bg-orange-50 border-orange-400' :
                  strategy.priority === 'MEDIUM' ? 'bg-yellow-50 border-yellow-400' :
                  'bg-blue-50 border-blue-400'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-lg font-bold text-gray-900">{strategy.title}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    strategy.priority === 'CRITICAL' ? 'bg-red-600 text-white' :
                    strategy.priority === 'HIGH' ? 'bg-orange-600 text-white' :
                    strategy.priority === 'MEDIUM' ? 'bg-yellow-600 text-white' :
                    'bg-blue-600 text-white'
                  }`}>
                    {strategy.priority}
                  </span>
                </div>
                
                <div className="mb-3 p-3 bg-white rounded border">
                  <div className="text-sm font-semibold text-gray-700 mb-1">문제:</div>
                  <p className="text-sm text-gray-600">{strategy.problem}</p>
                </div>
                
                <div className="mb-3 p-3 bg-white rounded border">
                  <div className="text-sm font-semibold text-gray-700 mb-1">인사이트:</div>
                  <p className="text-sm text-gray-600">{strategy.insight}</p>
                </div>
                
                <div className="mb-3 p-3 bg-white rounded border">
                  <div className="text-sm font-semibold text-gray-700 mb-1">실행 방안:</div>
                  <p className="text-sm text-gray-600">{strategy.action}</p>
                </div>
                
                <div className="p-3 bg-green-50 rounded border border-green-200">
                  <div className="text-xs font-semibold text-green-700 mb-1">예상 효과:</div>
                  <p className="text-sm text-green-800 font-semibold">{strategy.expectedImpact}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
