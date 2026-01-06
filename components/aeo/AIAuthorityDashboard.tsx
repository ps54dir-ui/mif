'use client'

import React from 'react'
import type { AIAuthorityIndex } from '@/lib/aeo/aiAuthorityDiagnosis'

interface AIAuthorityDashboardProps {
  authorityIndex: AIAuthorityIndex
}

export default function AIAuthorityDashboard({ authorityIndex }: AIAuthorityDashboardProps) {
  const getEngineLabel = (engine: string) => {
    const labels: Record<string, string> = {
      'chatgpt': 'ChatGPT',
      'claude': 'Claude',
      'gemini': 'Gemini',
      'perplexity': 'Perplexity',
      'copilot': 'Copilot'
    }
    return labels[engine] || engine
  }
  
  return (
    <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-400 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-cyan-900 mb-4">
        🤖 AI 권위 진단 (AEO) - AI 신뢰 지수
      </h2>
      
      {/* 전체 점수 */}
      <div className="mb-6 p-6 bg-white rounded-lg border-2 border-cyan-300">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-gray-600 mb-1">AI 신뢰 지수</div>
            <div className="text-4xl font-bold text-cyan-600">
              {authorityIndex.overallScore}점
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 mb-1">평균 추천 점수</div>
            <div className="text-2xl font-bold text-blue-600">
              {authorityIndex.averageRecommendationScore}점
            </div>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
          <div
            className="bg-cyan-600 h-4 rounded-full"
            style={{ width: `${authorityIndex.overallScore}%` }}
          ></div>
        </div>
        
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="p-3 bg-cyan-50 rounded border border-cyan-200">
            <div className="text-xs text-gray-600 mb-1">총 언급 횟수</div>
            <div className="font-bold text-cyan-600">{authorityIndex.totalMentions.toLocaleString()}</div>
          </div>
          <div className="p-3 bg-blue-50 rounded border border-blue-200">
            <div className="text-xs text-gray-600 mb-1">긍정 비율</div>
            <div className="font-bold text-blue-600">{authorityIndex.positiveSentimentRatio}%</div>
          </div>
          <div className="p-3 bg-green-50 rounded border border-green-200">
            <div className="text-xs text-gray-600 mb-1">전문성</div>
            <div className="font-bold text-green-600">{authorityIndex.trustFactors.expertise}점</div>
          </div>
          <div className="p-3 bg-purple-50 rounded border border-purple-200">
            <div className="text-xs text-gray-600 mb-1">권위</div>
            <div className="font-bold text-purple-600">{authorityIndex.trustFactors.authority}점</div>
          </div>
        </div>
      </div>
      
      {/* AI 엔진별 평가 */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">AI 엔진별 평가</h3>
        <div className="grid grid-cols-2 gap-4">
          {authorityIndex.evaluations.map((evaluation, idx) => (
            <div key={idx} className="p-4 bg-white rounded-lg border border-cyan-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{getEngineLabel(evaluation.engine)}</h4>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  evaluation.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                  evaluation.sentiment === 'neutral' ? 'bg-gray-100 text-gray-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {evaluation.sentiment === 'positive' ? '긍정' :
                   evaluation.sentiment === 'neutral' ? '중립' : '부정'}
                </span>
              </div>
              
              <div className="mb-3">
                <div className="text-xs text-gray-600 mb-1">추천 점수</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-cyan-600 h-2 rounded-full"
                      style={{ width: `${evaluation.recommendationScore}%` }}
                    ></div>
                  </div>
                  <span className="font-bold text-cyan-600">{evaluation.recommendationScore}점</span>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="text-xs text-gray-600 mb-1">언급 횟수</div>
                <div className="font-semibold text-gray-900">{evaluation.brandMention.toLocaleString()}회</div>
              </div>
              
              <div className="mb-3">
                <div className="text-xs text-gray-600 mb-1">핵심 키워드</div>
                <div className="flex flex-wrap gap-1">
                  {evaluation.keyPhrases.map((phrase, pIdx) => (
                    <span key={pIdx} className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded text-xs">
                      {phrase}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="p-2 bg-gray-50 rounded text-xs text-gray-600">
                {evaluation.context}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 신뢰 요소 */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">신뢰 요소 분석</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-lg border border-cyan-200">
            <div className="text-sm text-gray-600 mb-2">전문성</div>
            <div className="text-2xl font-bold text-green-600 mb-2">
              {authorityIndex.trustFactors.expertise}점
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${authorityIndex.trustFactors.expertise}%` }}
              ></div>
            </div>
          </div>
          
          <div className="p-4 bg-white rounded-lg border border-cyan-200">
            <div className="text-sm text-gray-600 mb-2">권위</div>
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {authorityIndex.trustFactors.authority}점
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${authorityIndex.trustFactors.authority}%` }}
              ></div>
            </div>
          </div>
          
          <div className="p-4 bg-white rounded-lg border border-cyan-200">
            <div className="text-sm text-gray-600 mb-2">신뢰도</div>
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {authorityIndex.trustFactors.trustworthiness}점
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full"
                style={{ width: `${authorityIndex.trustFactors.trustworthiness}%` }}
              ></div>
            </div>
          </div>
          
          <div className="p-4 bg-white rounded-lg border border-cyan-200">
            <div className="text-sm text-gray-600 mb-2">인지도</div>
            <div className="text-2xl font-bold text-orange-600 mb-2">
              {authorityIndex.trustFactors.popularity}점
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-600 h-2 rounded-full"
                style={{ width: `${authorityIndex.trustFactors.popularity}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 인사이트 및 권장사항 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-gray-900 mb-3">인사이트</h4>
          <ul className="text-sm text-gray-700 space-y-2">
            {authorityIndex.insights.map((insight, idx) => (
              <li key={idx} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-semibold text-gray-900 mb-3">권장사항</h4>
          <ul className="text-sm text-gray-700 space-y-2">
            {authorityIndex.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
