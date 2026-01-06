'use client'

import React from 'react'
import type { ChannelDwellTime, DwellTimeDiagnosis, CTRCVRRetentionConnection } from '@/lib/analytics/dwellTimeAnalysis'
import type { RetentionCohort, LTVAnalysis } from '@/lib/analytics/retentionCohort'

interface DwellTimeDashboardProps {
  channelData: ChannelDwellTime[]
  diagnoses: DwellTimeDiagnosis[]
  connections: CTRCVRRetentionConnection[]
  cohorts: RetentionCohort[]
  ltvAnalysis: LTVAnalysis
}

export default function DwellTimeDashboard({
  channelData,
  diagnoses,
  connections,
  cohorts,
  ltvAnalysis
}: DwellTimeDashboardProps) {
  return (
    <div className="space-y-6">
      {/* 채널별 평균 체류 시간 */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-400 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-indigo-900 mb-4">
          ⏱️ 채널별 평균 체류 시간
        </h2>
        
        <div className="grid grid-cols-5 gap-4">
          {channelData.map((channel) => (
            <div key={channel.channel} className="p-4 bg-white rounded-lg border border-indigo-200">
              <div className="text-sm font-semibold text-gray-700 mb-2">{channel.channel}</div>
              <div className="text-2xl font-bold text-indigo-600 mb-2">
                {channel.averageDwellTime}초
              </div>
              <div className="text-xs text-gray-600 mb-2">
                이탈률: {channel.bounceRate.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-600">
                페이지/세션: {channel.pagesPerSession.toFixed(1)}
              </div>
              <div className="mt-2">
                <span className={`text-xs px-2 py-1 rounded ${
                  channel.psychologyType === 'empathy' ? 'bg-green-100 text-green-700' :
                  channel.psychologyType === 'dopamine' ? 'bg-blue-100 text-blue-700' :
                  channel.psychologyType === 'cortisol' ? 'bg-red-100 text-red-700' :
                  channel.psychologyType === 'fear' ? 'bg-orange-100 text-orange-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {channel.psychologyType === 'empathy' ? '공감' :
                   channel.psychologyType === 'dopamine' ? '기대감' :
                   channel.psychologyType === 'cortisol' ? '긴급성' :
                   channel.psychologyType === 'fear' ? '공포' : '혼합'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 체류 시간 진단 */}
      {diagnoses.length > 0 && (
        <div className="bg-white rounded-lg border-2 border-red-300 p-6 shadow-lg">
          <h3 className="text-xl font-bold text-red-900 mb-4">
            🔍 체류 시간 진단 및 개선 전략
          </h3>
          
          <div className="space-y-4">
            {diagnoses.map((diagnosis, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-2 ${
                  diagnosis.priority === 'CRITICAL' ? 'bg-red-50 border-red-400' :
                  diagnosis.priority === 'HIGH' ? 'bg-orange-50 border-orange-400' :
                  diagnosis.priority === 'MEDIUM' ? 'bg-yellow-50 border-yellow-400' :
                  'bg-blue-50 border-blue-400'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-lg font-bold text-gray-900">{diagnosis.channel}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    diagnosis.priority === 'CRITICAL' ? 'bg-red-600 text-white' :
                    diagnosis.priority === 'HIGH' ? 'bg-orange-600 text-white' :
                    diagnosis.priority === 'MEDIUM' ? 'bg-yellow-600 text-white' :
                    'bg-blue-600 text-white'
                  }`}>
                    {diagnosis.priority}
                  </span>
                </div>
                
                <div className="mb-3 p-3 bg-white rounded border">
                  <div className="text-sm font-semibold text-gray-700 mb-1">문제:</div>
                  <p className="text-sm text-gray-600">{diagnosis.issue}</p>
                </div>
                
                <div className="mb-3 p-3 bg-white rounded border">
                  <div className="text-sm font-semibold text-gray-700 mb-1">인사이트:</div>
                  <p className="text-sm text-gray-600">{diagnosis.insight}</p>
                </div>
                
                <div className="mb-3 p-3 bg-white rounded border">
                  <div className="text-sm font-semibold text-gray-700 mb-1">권장사항:</div>
                  <p className="text-sm text-gray-600">{diagnosis.recommendation}</p>
                </div>
                
                <div className="p-3 bg-green-50 rounded border border-green-200">
                  <div className="text-xs font-semibold text-green-700 mb-1">예상 개선 효과:</div>
                  <p className="text-sm text-green-800 font-semibold">{diagnosis.expectedImprovement}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* CTR-CVR-Retention 연결 분석 */}
      <div className="bg-white rounded-lg border-2 border-blue-300 p-6 shadow-lg">
        <h3 className="text-xl font-bold text-blue-900 mb-4">
          🔗 CTR-CVR-Retention 유기적 연결 분석
        </h3>
        
        <div className="space-y-4">
          {connections.map((connection) => (
            <div key={connection.channel} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-3">{connection.channel}</h4>
              
              <div className="grid grid-cols-4 gap-4 mb-3">
                <div>
                  <div className="text-xs text-gray-600 mb-1">CTR</div>
                  <div className="font-bold text-blue-600">{connection.ctr.toFixed(2)}%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">CVR</div>
                  <div className="font-bold text-green-600">{connection.cvr.toFixed(2)}%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">재방문율</div>
                  <div className="font-bold text-purple-600">{connection.retentionRate.toFixed(1)}%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">체류 시간</div>
                  <div className="font-bold text-indigo-600">{connection.dwellTime}초</div>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="text-xs text-gray-600 mb-2">상관관계:</div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-2 bg-white rounded border">
                    <div className="text-gray-600 mb-1">체류↔CTR</div>
                    <div className="font-semibold text-blue-600">
                      {connection.correlation.dwellTimeCTR.toFixed(2)}
                    </div>
                  </div>
                  <div className="p-2 bg-white rounded border">
                    <div className="text-gray-600 mb-1">체류↔CVR</div>
                    <div className="font-semibold text-green-600">
                      {connection.correlation.dwellTimeCVR.toFixed(2)}
                    </div>
                  </div>
                  <div className="p-2 bg-white rounded border">
                    <div className="text-gray-600 mb-1">체류↔재방문</div>
                    <div className="font-semibold text-purple-600">
                      {connection.correlation.dwellTimeRetention.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-white rounded border">
                <div className="text-sm font-semibold text-gray-700 mb-1">인사이트:</div>
                <p className="text-sm text-gray-600">{connection.insight}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* LTV 및 재방문 코호트 */}
      <div className="bg-white rounded-lg border-2 border-green-300 p-6 shadow-lg">
        <h3 className="text-xl font-bold text-green-900 mb-4">
          💰 LTV 및 재방문 코호트 분석
        </h3>
        
        <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="text-sm font-semibold text-gray-700 mb-2">평균 LTV</div>
          <div className="text-3xl font-bold text-green-600">
            {ltvAnalysis.averageLTV.toLocaleString()}원
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm font-semibold text-gray-700 mb-2">상위 20% 세그먼트</div>
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {Math.round(ltvAnalysis.highValueSegment.avgLTV).toLocaleString()}원
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              {ltvAnalysis.highValueSegment.characteristics.map((char, idx) => (
                <div key={idx}>• {char}</div>
              ))}
            </div>
          </div>
          
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="text-sm font-semibold text-gray-700 mb-2">하위 30% 세그먼트</div>
            <div className="text-2xl font-bold text-red-600 mb-2">
              {Math.round(ltvAnalysis.lowValueSegment.avgLTV).toLocaleString()}원
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              {ltvAnalysis.lowValueSegment.characteristics.map((char, idx) => (
                <div key={idx}>• {char}</div>
              ))}
            </div>
          </div>
        </div>
        
        {ltvAnalysis.recommendations.length > 0 && (
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="text-sm font-semibold text-gray-700 mb-2">권장사항:</div>
            <ul className="text-sm text-gray-600 space-y-1">
              {ltvAnalysis.recommendations.map((rec, idx) => (
                <li key={idx}>• {rec}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* 코호트 테이블 */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left border">코호트</th>
                <th className="p-2 text-left border">총 사용자</th>
                <th className="p-2 text-left border">1주차</th>
                <th className="p-2 text-left border">2주차</th>
                <th className="p-2 text-left border">3주차</th>
                <th className="p-2 text-left border">4주차</th>
                <th className="p-2 text-left border">2개월</th>
                <th className="p-2 text-left border">LTV</th>
              </tr>
            </thead>
            <tbody>
              {cohorts.map((cohort) => (
                <tr key={cohort.cohort} className="border-b">
                  <td className="p-2 border font-semibold">{cohort.cohort}</td>
                  <td className="p-2 border">{cohort.totalUsers.toLocaleString()}</td>
                  <td className="p-2 border">{cohort.week1.toFixed(1)}%</td>
                  <td className="p-2 border">{cohort.week2.toFixed(1)}%</td>
                  <td className="p-2 border">{cohort.week3.toFixed(1)}%</td>
                  <td className="p-2 border">{cohort.week4.toFixed(1)}%</td>
                  <td className="p-2 border">{cohort.month2.toFixed(1)}%</td>
                  <td className="p-2 border font-semibold text-green-600">
                    {Math.round(cohort.ltv).toLocaleString()}원
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
