'use client'

import React, { useState } from 'react'
import type { SimulationInput, SimulationResult } from '@/lib/simulation/performanceSimulator'
import { simulatePerformance, compareScenarios } from '@/lib/simulation/performanceSimulator'

export default function PerformanceSimulator() {
  const [input, setInput] = useState<SimulationInput>({
    budget: 1000000,
    channel: 'meta',
    strategy: 'conversion',
    creativeQuality: 7,
    targetingPrecision: 8,
    psychologyMatch: 75
  })
  
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [comparisons, setComparisons] = useState<Array<{ scenario: string; result: SimulationResult; improvement: number }> | null>(null)
  
  const handleSimulate = () => {
    const simulationResult = simulatePerformance(input)
    setResult(simulationResult)
    
    // 시나리오 비교
    const alternativeScenarios: SimulationInput[] = [
      { ...input, budget: input.budget * 1.5 },
      { ...input, budget: input.budget * 0.7 },
      { ...input, strategy: 'awareness' as const },
      { ...input, creativeQuality: 9 },
      { ...input, psychologyMatch: 90 }
    ]
    
    const comparisonResults = compareScenarios(input, alternativeScenarios)
    setComparisons(comparisonResults)
  }
  
  return (
    <div className="bg-gradient-to-r from-violet-50 to-purple-50 border-2 border-violet-400 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-violet-900 mb-4">
        🎯 성과 예측 시뮬레이터
      </h2>
      
      {/* 입력 폼 */}
      <div className="mb-6 p-4 bg-white rounded-lg border border-violet-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">시뮬레이션 변수 설정</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">예산 (원)</label>
            <input
              type="number"
              value={input.budget}
              onChange={(e) => setInput({ ...input, budget: Number(e.target.value) })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">채널</label>
            <select
              value={input.channel}
              onChange={(e) => setInput({ ...input, channel: e.target.value as any })}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="meta">메타 광고</option>
              <option value="google">구글 광고</option>
              <option value="youtube">유튜브</option>
              <option value="instagram">인스타그램</option>
              <option value="blog">블로그</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">전략</label>
            <select
              value={input.strategy}
              onChange={(e) => setInput({ ...input, strategy: e.target.value as any })}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="awareness">인지도</option>
              <option value="consideration">고려</option>
              <option value="conversion">전환</option>
              <option value="retention">재방문</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">크리에이티브 품질 (1-10)</label>
            <input
              type="range"
              min="1"
              max="10"
              value={input.creativeQuality}
              onChange={(e) => setInput({ ...input, creativeQuality: Number(e.target.value) })}
              className="w-full"
            />
            <div className="text-sm text-gray-600 text-center">{input.creativeQuality}</div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">타겟팅 정밀도 (1-10)</label>
            <input
              type="range"
              min="1"
              max="10"
              value={input.targetingPrecision}
              onChange={(e) => setInput({ ...input, targetingPrecision: Number(e.target.value) })}
              className="w-full"
            />
            <div className="text-sm text-gray-600 text-center">{input.targetingPrecision}</div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">심리 일치도 (0-100)</label>
            <input
              type="range"
              min="0"
              max="100"
              value={input.psychologyMatch}
              onChange={(e) => setInput({ ...input, psychologyMatch: Number(e.target.value) })}
              className="w-full"
            />
            <div className="text-sm text-gray-600 text-center">{input.psychologyMatch}%</div>
          </div>
        </div>
        
        <button
          onClick={handleSimulate}
          className="w-full py-3 px-4 bg-violet-600 text-white font-semibold rounded-md hover:bg-violet-700 transition-colors"
        >
          시뮬레이션 실행
        </button>
      </div>
      
      {/* 결과 */}
      {result && (
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">예측 결과</h3>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="p-4 bg-white rounded-lg border border-violet-200">
              <div className="text-sm text-gray-600 mb-1">예상 CVR</div>
              <div className="text-2xl font-bold text-violet-600">{result.expectedCVR}%</div>
            </div>
            <div className="p-4 bg-white rounded-lg border border-violet-200">
              <div className="text-sm text-gray-600 mb-1">예상 ROAS</div>
              <div className="text-2xl font-bold text-green-600">{result.expectedROAS}x</div>
            </div>
            <div className="p-4 bg-white rounded-lg border border-violet-200">
              <div className="text-sm text-gray-600 mb-1">예상 CPA</div>
              <div className="text-2xl font-bold text-orange-600">{result.expectedCPA.toLocaleString()}원</div>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="p-3 bg-white rounded-lg border border-violet-200">
              <div className="text-xs text-gray-600 mb-1">예상 노출수</div>
              <div className="font-bold text-gray-900">{result.expectedImpressions.toLocaleString()}</div>
            </div>
            <div className="p-3 bg-white rounded-lg border border-violet-200">
              <div className="text-xs text-gray-600 mb-1">예상 클릭수</div>
              <div className="font-bold text-blue-600">{result.expectedClicks.toLocaleString()}</div>
            </div>
            <div className="p-3 bg-white rounded-lg border border-violet-200">
              <div className="text-xs text-gray-600 mb-1">예상 전환수</div>
              <div className="font-bold text-green-600">{result.expectedConversions.toLocaleString()}</div>
            </div>
            <div className="p-3 bg-white rounded-lg border border-violet-200">
              <div className="text-xs text-gray-600 mb-1">예상 매출</div>
              <div className="font-bold text-purple-600">{result.expectedRevenue.toLocaleString()}원</div>
            </div>
          </div>
          
          <div className="p-4 bg-white rounded-lg border border-violet-200">
            <div className="text-sm font-semibold text-gray-700 mb-2">예측 신뢰도</div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div
                className="bg-violet-600 h-3 rounded-full"
                style={{ width: `${result.confidence}%` }}
              ></div>
            </div>
            <div className="text-sm text-gray-600">{result.confidence}%</div>
          </div>
        </div>
      )}
      
      {/* 시나리오 비교 */}
      {comparisons && comparisons.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">시나리오 비교</h3>
          <div className="space-y-3">
            {comparisons.map((comparison, idx) => (
              <div key={idx} className="p-4 bg-white rounded-lg border border-violet-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-gray-900">{comparison.scenario}</div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    comparison.improvement > 0 ? 'bg-green-100 text-green-700' :
                    comparison.improvement < 0 ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {comparison.improvement > 0 ? '+' : ''}{comparison.improvement.toFixed(1)}%
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">CVR</div>
                    <div className="font-bold text-violet-600">{comparison.result.expectedCVR}%</div>
                  </div>
                  <div>
                    <div className="text-gray-600">ROAS</div>
                    <div className="font-bold text-green-600">{comparison.result.expectedROAS}x</div>
                  </div>
                  <div>
                    <div className="text-gray-600">예상 매출</div>
                    <div className="font-bold text-purple-600">{comparison.result.expectedRevenue.toLocaleString()}원</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
