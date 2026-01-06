'use client'

import React from 'react'
import type { CustomerSegmentData } from '@/lib/retargeting/retargetingStrategy'
import type { RetargetingStrategy } from '@/lib/retargeting/retargetingStrategy'

interface RetargetingStrategyProps {
  segments: CustomerSegmentData[]
  strategies: RetargetingStrategy[]
}

export default function RetargetingStrategyComponent({
  segments,
  strategies
}: RetargetingStrategyProps) {
  const getSegmentLabel = (segment: string) => {
    switch (segment) {
      case 'purchased': return '구매 고객'
      case 'abandoned_cart': return '장바구니 이탈'
      case 'bounced': return '이탈 고객'
      case 'engaged_no_purchase': return '참여 고객 (미구매)'
      default: return segment
    }
  }
  
  const getPsychologyLabel = (psychology: string) => {
    switch (psychology) {
      case 'dopamine': return '도파민 (기대감)'
      case 'cortisol': return '코르티솔 (긴급성)'
      case 'empathy': return '공감'
      case 'social_proof': return '사회적 증거'
      default: return psychology
    }
  }
  
  return (
    <div className="space-y-6">
      {/* 고객 세그먼트 분류 */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-400 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-purple-900 mb-4">
          👥 고객 세그먼트 분류
        </h2>
        
        <div className="grid grid-cols-4 gap-4">
          {segments.map((segment) => (
            <div key={segment.segment} className="p-4 bg-white rounded-lg border border-purple-200">
              <div className="text-sm font-semibold text-gray-700 mb-2">
                {getSegmentLabel(segment.segment)}
              </div>
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {segment.count.toLocaleString()}명
              </div>
              <div className="text-xs text-gray-600 mb-3">
                {segment.percentage.toFixed(1)}%
              </div>
              
              <div className="mb-3">
                <div className="text-xs text-gray-600 mb-1">심리 상태</div>
                <div className="text-xs font-semibold text-gray-700 mb-2">
                  {segment.psychologyState.emotion === 'positive' ? '긍정적' :
                   segment.psychologyState.emotion === 'negative' ? '부정적' :
                   segment.psychologyState.emotion === 'curious' ? '호기심' : '중립'}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${segment.psychologyState.engagement}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-600">참여도: {segment.psychologyState.engagement}%</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${segment.psychologyState.purchaseIntent}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-600">구매 의향: {segment.psychologyState.purchaseIntent}%</div>
              </div>
              
              <div className="text-xs text-gray-600 space-y-1">
                {segment.characteristics.map((char, idx) => (
                  <div key={idx}>• {char}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 리타겟팅 전략 */}
      <div className="bg-white rounded-lg border-2 border-orange-300 p-6 shadow-lg">
        <h3 className="text-xl font-bold text-orange-900 mb-4">
          🎯 리타겟팅 광고 전략 (팬덤 형성용)
        </h3>
        
        <div className="space-y-4">
          {strategies.map((strategy) => (
            <div
              key={strategy.segment}
              className={`p-4 rounded-lg border-2 ${
                strategy.priority === 'CRITICAL' ? 'bg-red-50 border-red-400' :
                strategy.priority === 'HIGH' ? 'bg-orange-50 border-orange-400' :
                strategy.priority === 'MEDIUM' ? 'bg-yellow-50 border-yellow-400' :
                'bg-blue-50 border-blue-400'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{strategy.strategyName}</h4>
                  <div className="text-sm text-gray-600 mt-1">
                    대상: {getSegmentLabel(strategy.segment)}
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  strategy.priority === 'CRITICAL' ? 'bg-red-600 text-white' :
                  strategy.priority === 'HIGH' ? 'bg-orange-600 text-white' :
                  strategy.priority === 'MEDIUM' ? 'bg-yellow-600 text-white' :
                  'bg-blue-600 text-white'
                }`}>
                  {strategy.priority}
                </span>
              </div>
              
              <div className="mb-3 grid grid-cols-2 gap-4">
                <div className="p-3 bg-white rounded border">
                  <div className="text-xs text-gray-600 mb-1">심리 접근법</div>
                  <div className="font-semibold text-purple-600">
                    {getPsychologyLabel(strategy.psychologyApproach)}
                  </div>
                </div>
                <div className="p-3 bg-white rounded border">
                  <div className="text-xs text-gray-600 mb-1">예상 전환율</div>
                  <div className="font-semibold text-green-600">
                    {strategy.expectedConversionRate.toFixed(1)}%
                  </div>
                </div>
              </div>
              
              <div className="mb-3 p-3 bg-white rounded border">
                <div className="text-sm font-semibold text-gray-700 mb-1">메시지:</div>
                <p className="text-sm text-gray-600">{strategy.message}</p>
              </div>
              
              <div className="p-3 bg-white rounded border">
                <div className="text-sm font-semibold text-gray-700 mb-2">크리에이티브 가이드라인:</div>
                <ul className="text-sm text-gray-600 space-y-1">
                  {strategy.creativeGuidelines.map((guideline, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{guideline}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
