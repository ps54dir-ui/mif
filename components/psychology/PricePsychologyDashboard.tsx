'use client'

import React from 'react'
import type { PricePsychologyAnalysis } from '@/lib/psychology/pricePsychology'

interface PricePsychologyDashboardProps {
  analysis: PricePsychologyAnalysis
}

export default function PricePsychologyDashboard({ analysis }: PricePsychologyDashboardProps) {
  const getApproachLabel = (approach: string) => {
    const labels: Record<string, string> = {
      'premium': '프리미엄',
      'value': '가치',
      'scarcity': '희소성',
      'social_proof': '사회적 증거'
    }
    return labels[approach] || approach
  }
  
  return (
    <div className="bg-gradient-to-r from-pink-50 to-rose-50 border-2 border-pink-400 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-pink-900 mb-4">
        💰 가격 심리 분석 - 심리적 가격 저항선
      </h2>
      
      {/* 최적 가격대 및 심리적 가격 포인트 */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded-lg border-2 border-pink-300">
          <div className="text-sm text-gray-600 mb-2">최적 가격대</div>
          <div className="text-2xl font-bold text-pink-600">{analysis.optimalPriceRange}</div>
        </div>
        <div className="p-4 bg-white rounded-lg border-2 border-pink-300">
          <div className="text-sm text-gray-600 mb-2">심리적 가격 포인트</div>
          <div className="text-2xl font-bold text-pink-600">
            {analysis.psychologicalPricePoint.toLocaleString()}원
          </div>
        </div>
      </div>
      
      {/* 가격 저항선 시각화 */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">가격대별 저항선</h3>
        <div className="space-y-3">
          {analysis.resistancePoints.map((point, idx) => (
            <div key={idx} className="p-4 bg-white rounded-lg border border-pink-200">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-gray-900">{point.priceRange}</div>
                <div className={`font-bold ${
                  point.resistanceLevel > 60 ? 'text-red-600' :
                  point.resistanceLevel > 40 ? 'text-orange-600' :
                  'text-green-600'
                }`}>
                  저항도: {point.resistanceLevel}%
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className={`h-3 rounded-full ${
                    point.resistanceLevel > 60 ? 'bg-red-600' :
                    point.resistanceLevel > 40 ? 'bg-orange-600' :
                    'bg-green-600'
                  }`}
                  style={{ width: `${point.resistanceLevel}%` }}
                ></div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">세그먼트</div>
                  <div className="font-semibold text-gray-900">{point.customerSegment}</div>
                </div>
                <div>
                  <div className="text-gray-600">리뷰 감정</div>
                  <div className={`font-semibold ${
                    point.reviewSentiment === 'positive' ? 'text-green-600' :
                    point.reviewSentiment === 'negative' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {point.reviewSentiment === 'positive' ? '긍정' :
                     point.reviewSentiment === 'negative' ? '부정' : '중립'}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">구매율</div>
                  <div className="font-semibold text-blue-600">{point.purchaseRate.toFixed(2)}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 평균 저항도 */}
      <div className="mb-6 p-4 bg-white rounded-lg border-2 border-pink-300">
        <div className="text-sm text-gray-600 mb-2">평균 저항도</div>
        <div className="flex items-center gap-4">
          <div className="text-3xl font-bold text-pink-600">{analysis.averageResistance}%</div>
          <div className="flex-1">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full ${
                  analysis.averageResistance > 60 ? 'bg-red-600' :
                  analysis.averageResistance > 40 ? 'bg-orange-600' :
                  'bg-green-600'
                }`}
                style={{ width: `${analysis.averageResistance}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 카피라이팅 전략 */}
      <div className="mb-6 p-4 bg-white rounded-lg border-2 border-pink-300">
        <h3 className="text-lg font-bold text-gray-900 mb-4">카피라이팅 전략 추천</h3>
        
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-semibold">
              {getApproachLabel(analysis.copywritingStrategy.approach)} 접근법
            </span>
            <span className="text-sm text-gray-600">{analysis.copywritingStrategy.tone}</span>
          </div>
          
          <p className="text-sm text-gray-700 mb-4">{analysis.copywritingStrategy.message}</p>
          
          <div>
            <div className="text-sm font-semibold text-gray-700 mb-2">핵심 키워드:</div>
            <div className="flex flex-wrap gap-2">
              {analysis.copywritingStrategy.keyPhrases.map((phrase, idx) => (
                <span key={idx} className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
                  {phrase}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* 인사이트 */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-gray-900 mb-3">인사이트</h4>
        <ul className="text-sm text-gray-700 space-y-2">
          {analysis.insights.map((insight, idx) => (
            <li key={idx} className="flex items-start">
              <span className="mr-2">•</span>
              <span>{insight}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
