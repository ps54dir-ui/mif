/**
 * 종합 진단 대시보드
 * 벤치마킹, 체크리스트, 심리 분석, CVR 예측을 통합한 대시보드
 * 업종별 맞춤형 진단 지원
 */

'use client'

import { useState, useEffect } from 'react'
import { loadBenchmarks, loadAllBenchmarks, type ChannelName } from '@/data/benchmarks/loader'
import { loadChecklist, loadAllChecklists, type ChecklistChannel } from '@/data/checklists/loader'
import { predictCVRFromPsychology, type PsychologicalProfile, type CVRPrediction } from '@/lib/psychology/cvrPredictor'
import { getImportanceDoc } from '@/data/checklists/whyImportant'
import { calculateTotalScore, getRecommendedImprovements } from '@/lib/checklist/checklistUtils'
import { ORGANIC_SEARCH_CHECKLIST } from '@/data/checklists/organic_search'
import { IndustryType, getIndustryConfig } from '@/data/industries/industryConfig'
import { selectIndustryManually } from '@/lib/industry/industryDetector'
import { calculateIndustryScore, type IndustryMetricValue } from '@/lib/industry/industryScoreCalculator'
import { measureIndustryPsychology, type IndustryPsychologyTriggers } from '@/lib/psychology/industryPsychologyTriggers'
import { compareIndustries } from '@/lib/industry/industryComparison'
import { getSuccessCases, recommendSimilarMethods } from '@/lib/industry/industryComparison'
import IndustrySelector from './IndustrySelector'

interface ComprehensiveDiagnosisDashboardProps {
  company_name: string
  benchmarks?: ReturnType<typeof loadAllBenchmarks>
  checklists?: ReturnType<typeof loadAllChecklists>
  cvrPrediction?: CVRPrediction
  psychologyProfile?: PsychologicalProfile
  industry?: IndustryType
  industryProfile?: ReturnType<typeof selectIndustryManually>
}

export default function ComprehensiveDiagnosisDashboard({
  company_name,
  benchmarks: initialBenchmarks,
  checklists: initialChecklists,
  cvrPrediction: initialCVRPrediction,
  psychologyProfile: initialPsychologyProfile,
  industry: initialIndustry,
  industryProfile: initialIndustryProfile
}: ComprehensiveDiagnosisDashboardProps) {
  // 업종 선택 상태
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType | null>(initialIndustry || null)
  const [industryProfile, setIndustryProfile] = useState<ReturnType<typeof selectIndustryManually> | null>(
    initialIndustryProfile || null
  )
  const [showIndustrySelector, setShowIndustrySelector] = useState(!initialIndustry)
  const [benchmarks, setBenchmarks] = useState(initialBenchmarks || loadAllBenchmarks())
  const [checklists, setChecklists] = useState(initialChecklists || loadAllChecklists())
  const [selectedChannel, setSelectedChannel] = useState<ChannelName>('organic_search')
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [psychologyProfile, setPsychologyProfile] = useState<PsychologicalProfile>(
    initialPsychologyProfile || {
      dopamine_score: 7.5,
      cortisol_score: 3.2,
      trust_score: 8.1,
      urgency_score: 6.5,
      cognitive_load: 4.2
    }
  )
  const [cvrPrediction, setCVRPrediction] = useState<CVRPrediction | null>(
    initialCVRPrediction || null
  )

  // CVR 예측 계산
  useEffect(() => {
    const prediction = predictCVRFromPsychology(psychologyProfile, 0.02)
    setCVRPrediction(prediction)
  }, [psychologyProfile])

  // 업종 선택 핸들러
  const handleIndustrySelected = (industry: IndustryType, profile: ReturnType<typeof selectIndustryManually>) => {
    setSelectedIndustry(industry)
    setIndustryProfile(profile)
    setShowIndustrySelector(false)
  }

  // 업종별 점수 계산
  const industryScore = selectedIndustry && industryProfile
    ? calculateIndustryScore(industryProfile.industry_type, [])
    : null

  // 업종별 심리 트리거
  const industryPsychology = selectedIndustry && industryProfile
    ? measureIndustryPsychology(industryProfile.industry_type, {})
    : null

  // 성공 사례
  const successCases = selectedIndustry
    ? getSuccessCases(selectedIndustry)
    : []

  const currentChecklist = checklists[selectedChannel as ChecklistChannel]
  const currentBenchmark = benchmarks[selectedChannel]
  const importanceDoc = selectedItem ? getImportanceDoc(selectedItem) : null

  // 체크리스트 점수 계산
  const checklistScore = currentChecklist
    ? calculateTotalScore(currentChecklist.items)
    : { maxScore: 0, currentScore: 0, completionRate: 0 }

  // 추천 개선 항목
  const recommendations = currentChecklist
    ? getRecommendedImprovements(currentChecklist.items, 5)
    : []

  // 업종 선택 화면 표시
  if (showIndustrySelector) {
    return (
      <IndustrySelector
        onIndustrySelected={handleIndustrySelected}
        initialCompanyData={{
          description: '',
          business_type: '',
          revenue_model: ''
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              📊 종합 마케팅 진단 대시보드
            </h1>
            <p className="text-xl text-gray-600">{company_name}</p>
            {selectedIndustry && industryProfile && (
              <div className="mt-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                  {industryProfile.industry_type === 'ecommerce' && '🛒 전자상거래'}
                  {industryProfile.industry_type === 'saas' && '💼 SaaS'}
                  {industryProfile.industry_type === 'local_business' && '📍 로컬 비즈니스'}
                  {industryProfile.industry_type === 'creator_economy' && '🎬 크리에이터'}
                  {industryProfile.industry_type === 'media' && '📰 미디어'}
                  {industryProfile.industry_type === 'healthcare' && '🏥 의료'}
                  {industryProfile.industry_type === 'services' && '⚖️ 전문서비스'}
                  {industryProfile.industry_type === 'non_profit' && '🤝 비영리'}
                  {industryProfile.industry_type === 'food_beverage' && '🍽️ 식음료'}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowIndustrySelector(true)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            업종 변경
          </button>
        </div>

        {/* 100점 만점 스코어카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* 종합 점수 */}
          <div className="bg-white rounded-lg border-2 border-blue-300 p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">종합 점수</h2>
            <div className="text-5xl font-bold text-blue-600 mb-2">
              {checklistScore.currentScore}
            </div>
            <div className="text-sm text-gray-600">/ {checklistScore.maxScore}점</div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all"
                  style={{ width: `${checklistScore.completionRate}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                완료율: {checklistScore.completionRate}%
              </div>
            </div>
          </div>

          {/* 예측 CVR */}
          {cvrPrediction && (
            <div className="bg-white rounded-lg border-2 border-green-300 p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">예측 CVR</h2>
              <div className="text-5xl font-bold text-green-600 mb-2">
                {(cvrPrediction.predicted_cvr * 100).toFixed(2)}%
              </div>
              <div className="text-sm text-gray-600">
                기준선: {(cvrPrediction.baseline_cvr * 100).toFixed(2)}%
                {cvrPrediction.cvr_change > 0 && (
                  <span className="text-green-600 ml-2">
                    (+{cvrPrediction.cvr_change_percent.toFixed(1)}%)
                  </span>
                )}
              </div>
              <div className="mt-4 text-xs text-gray-500">
                신뢰도: {cvrPrediction.confidence}%
              </div>
            </div>
          )}

          {/* 심리적 병목 */}
          {cvrPrediction && (
            <div className="bg-white rounded-lg border-2 border-red-300 p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">심리적 병목</h2>
              <div className="text-lg font-semibold text-red-600 mb-2">
                {cvrPrediction.bottleneck}
              </div>
              <div className="text-sm text-gray-600 mt-4">
                우선 개선 필요 항목
              </div>
            </div>
          )}
        </div>

        {/* 채널별 점수 */}
        <div className="bg-white rounded-lg border-2 border-gray-300 p-6 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">채널별 점수</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(benchmarks).map(([channel, data]) => {
              const checklist = checklists[channel as ChecklistChannel]
              const score = checklist ? calculateTotalScore(checklist.items) : null
              
              return (
                <button
                  key={channel}
                  onClick={() => setSelectedChannel(channel as ChannelName)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedChannel === channel
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-sm font-semibold text-gray-700 mb-2">
                    {channel.replace('_', ' ').toUpperCase()}
                  </div>
                  {score ? (
                    <>
                      <div className="text-3xl font-bold text-blue-600">
                        {score.currentScore}
                      </div>
                      <div className="text-xs text-gray-600">/ {score.maxScore}점</div>
                    </>
                  ) : (
                    <div className="text-sm text-gray-400">데이터 없음</div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* 세부 항목 (클릭 시) */}
        {currentChecklist && (
          <div className="bg-white rounded-lg border-2 border-gray-300 p-6 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {selectedChannel.replace('_', ' ').toUpperCase()} 체크리스트
            </h2>
            <div className="space-y-4">
              {currentChecklist.items.slice(0, 10).map((item) => {
                const importance = getImportanceDoc(item.id)
                const isSelected = selectedItem === item.id
                
                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedItem(isSelected ? null : item.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.item}</h3>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold text-blue-600">
                          {item.current_score || item.max_score}
                        </div>
                        <div className="text-xs text-gray-600">/ {item.max_score}점</div>
                      </div>
                    </div>
                    
                    {isSelected && importance && (
                      <div className="mt-4 p-4 bg-white rounded border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-2">왜 중요한가?</h4>
                        <p className="text-sm text-gray-700 mb-3">{importance.whyImportant}</p>
                        
                        <h4 className="font-semibold text-gray-900 mb-2">계산 공식</h4>
                        <pre className="text-xs text-gray-600 bg-gray-50 p-3 rounded mb-3 whitespace-pre-wrap">
                          {importance.calculationFormula}
                        </pre>
                        
                        <h4 className="font-semibold text-gray-900 mb-2">근거</h4>
                        <pre className="text-xs text-gray-600 bg-gray-50 p-3 rounded mb-3 whitespace-pre-wrap">
                          {importance.evidence}
                        </pre>
                        
                        <div className="text-xs text-gray-500 mb-2">
                          <strong>데이터 출처:</strong> {importance.dataSource}
                        </div>
                        
                        <h4 className="font-semibold text-gray-900 mb-2">CVR 연결</h4>
                        <pre className="text-xs text-gray-600 bg-gray-50 p-3 rounded whitespace-pre-wrap">
                          {importance.cvrConnection}
                        </pre>
                      </div>
                    )}
                    
                    {isSelected && item.improvement_actions && (
                      <div className="mt-4 p-4 bg-green-50 rounded border border-green-200">
                        <h4 className="font-semibold text-green-900 mb-2">개선 액션</h4>
                        <ul className="space-y-2">
                          {item.improvement_actions.map((action, idx) => (
                            <li key={idx} className="text-sm text-green-800 flex items-start">
                              <span className="mr-2">•</span>
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                        {item.expected_improvement && (
                          <div className="mt-3 p-2 bg-white rounded border border-green-200">
                            <div className="text-sm font-semibold text-green-900">
                              기대 효과: {item.expected_improvement.description}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* 심리 분석 */}
        {cvrPrediction && (
          <div className="bg-white rounded-lg border-2 border-purple-300 p-6 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">심리 분석 → CVR 예측</h2>
            
            {/* 심리 프로필 입력 */}
            <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-gray-900 mb-4">심리 프로필 (1-10 스케일)</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(psychologyProfile).map(([key, value]) => (
                  <div key={key}>
                    <label className="text-sm text-gray-700 mb-1 block">
                      {key.replace('_', ' ').replace('score', '')}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      step="0.1"
                      value={value}
                      onChange={(e) => {
                        setPsychologyProfile({
                          ...psychologyProfile,
                          [key]: parseFloat(e.target.value)
                        })
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 예측 결과 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-2">예측 CVR</h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {(cvrPrediction.predicted_cvr * 100).toFixed(2)}%
                </div>
                <div className="text-sm text-gray-600">
                  기준선: {(cvrPrediction.baseline_cvr * 100).toFixed(2)}%
                  {cvrPrediction.cvr_change > 0 && (
                    <span className="text-green-600 ml-2">
                      (+{cvrPrediction.cvr_change_percent.toFixed(1)}%)
                    </span>
                  )}
                </div>
              </div>
              
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <h3 className="font-semibold text-gray-900 mb-2">심리적 병목</h3>
                <div className="text-lg font-semibold text-red-600">
                  {cvrPrediction.bottleneck}
                </div>
              </div>
            </div>

            {/* 공식 설명 */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">계산 공식</h3>
              <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                {cvrPrediction.formula_explanation}
              </pre>
              <div className="text-xs text-gray-500 mt-2">
                <strong>데이터 출처:</strong> {cvrPrediction.data_source}
              </div>
            </div>

            {/* 상세 내역 */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">심리 요소별 영향</h3>
              <div className="space-y-2">
                {cvrPrediction.breakdown.map((item, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{item.factor}</div>
                        <div className="text-sm text-gray-600">{item.message}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          item.impact > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {item.impact > 0 ? '+' : ''}
                          {(item.impact * 100).toFixed(2)}%p
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 액션 플랜 */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">액션 플랜 (우선순위)</h3>
              <div className="space-y-4">
                {cvrPrediction.actions.map((action) => (
                  <div
                    key={action.id}
                    className={`p-4 rounded-lg border-2 ${
                      action.priority === 'high'
                        ? 'bg-red-50 border-red-300'
                        : action.priority === 'medium'
                        ? 'bg-yellow-50 border-yellow-300'
                        : 'bg-blue-50 border-blue-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{action.action}</h4>
                        <div className="text-sm text-gray-600 mt-1">
                          {action.expected_effect}
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        action.priority === 'high'
                          ? 'bg-red-600 text-white'
                          : action.priority === 'medium'
                          ? 'bg-yellow-600 text-white'
                          : 'bg-blue-600 text-white'
                      }`}>
                        {action.priority.toUpperCase()}
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <div className="text-gray-600">CVR 영향</div>
                        <div className="font-bold text-green-600">
                          +{(action.cvr_impact * 100).toFixed(1)}%p
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">난이도</div>
                        <div className="font-semibold">{action.difficulty}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">소요 시간</div>
                        <div className="font-semibold">{action.time_to_implement}</div>
                      </div>
                    </div>
                    {action.roi_estimate && (
                      <div className="mt-2 text-xs text-gray-600">
                        예상 ROI: +{action.roi_estimate.toFixed(1)}%
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 업종별 점수 */}
        {industryScore && (
          <div className="bg-white rounded-lg border-2 border-purple-300 p-6 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">업종별 종합 점수</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-sm text-gray-600 mb-2">종합 점수</div>
                <div className="text-4xl font-bold text-purple-600">
                  {industryScore.totalScore}
                </div>
                <div className="text-sm text-gray-600 mt-2">/ 100점</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-sm text-gray-600 mb-2">주요 목표</div>
                <div className="text-lg font-semibold text-gray-900">
                  {industryScore.primaryGoal}
                </div>
              </div>
            </div>
            
            {/* 강점/약점 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-green-700 mb-3">✅ 강점</h3>
                <div className="space-y-2">
                  {industryScore.topStrengths.map((strength, idx) => (
                    <div key={idx} className="p-3 bg-green-50 rounded border border-green-200">
                      <div className="font-semibold text-gray-900">{strength.metric}</div>
                      <div className="text-sm text-gray-600">{strength.score}점</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-red-700 mb-3">⚠️ 약점</h3>
                <div className="space-y-2">
                  {industryScore.topWeaknesses.map((weakness, idx) => (
                    <div key={idx} className="p-3 bg-red-50 rounded border border-red-200">
                      <div className="font-semibold text-gray-900">{weakness.metric}</div>
                      <div className="text-sm text-gray-600">{weakness.score}점</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 추천사항 */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">💡 추천사항</h3>
              <div className="space-y-2">
                {industryScore.recommendations.map((rec, idx) => (
                  <div key={idx} className="p-3 bg-blue-50 rounded border border-blue-200">
                    <div className="text-sm text-gray-700">{rec}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 업종별 심리 트리거 */}
        {industryPsychology && (
          <div className="bg-white rounded-lg border-2 border-pink-300 p-6 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">업종별 심리 트리거 분석</h2>
            <div className="mb-6">
              <div className="text-sm text-gray-600 mb-2">종합 점수</div>
              <div className="text-4xl font-bold text-pink-600">
                {industryPsychology.overallScore}
              </div>
              <div className="text-sm text-gray-600 mt-2">/ 100점</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {industryPsychology.measurements.map((measurement, idx) => (
                <div key={idx} className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-gray-900">{measurement.trigger}</div>
                    <div className="text-2xl font-bold text-pink-600">
                      {measurement.score.toFixed(1)}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">{measurement.measurement}</div>
                  {measurement.recommendation && (
                    <div className="text-xs text-pink-700 bg-pink-100 p-2 rounded">
                      💡 {measurement.recommendation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 우선순위 액션 */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">🎯 우선순위 액션</h3>
              <div className="space-y-3">
                {industryPsychology.priorityActions.map((action, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border-2 ${
                      action.priority === 'high'
                        ? 'bg-red-50 border-red-300'
                        : action.priority === 'medium'
                        ? 'bg-yellow-50 border-yellow-300'
                        : 'bg-blue-50 border-blue-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{action.action}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          트리거: {action.trigger}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          {action.expectedImpact}
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          action.priority === 'high'
                            ? 'bg-red-600 text-white'
                            : action.priority === 'medium'
                            ? 'bg-yellow-600 text-white'
                            : 'bg-blue-600 text-white'
                        }`}>
                          {action.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 성공 사례 */}
        {successCases && successCases.length > 0 && (
          <div className="bg-white rounded-lg border-2 border-green-300 p-6 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🏆 업종별 성공 사례</h2>
            <div className="space-y-6">
              {successCases.map((case_, idx) => (
                <div key={idx} className="p-6 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{case_.company}</h3>
                      <div className="text-sm text-gray-600 mt-1">
                        {case_.metric}: {case_.achievement}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        +{case_.benchmark.improvement}%
                      </div>
                      <div className="text-xs text-gray-600">개선율</div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="text-sm font-semibold text-gray-700 mb-2">성공 방법:</div>
                    <ul className="space-y-2">
                      {case_.methods.map((method, methodIdx) => (
                        <li key={methodIdx} className="text-sm text-gray-700 flex items-start">
                          <span className="mr-2">✓</span>
                          <span>{method}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">이전</div>
                      <div className="font-bold">{case_.benchmark.before}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">이후</div>
                      <div className="font-bold text-green-600">{case_.benchmark.after}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">개선</div>
                      <div className="font-bold text-green-600">
                        +{case_.benchmark.improvement}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 예측 시뮬레이터 */}
        <div className="bg-white rounded-lg border-2 border-indigo-300 p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">예측 시뮬레이터</h2>
          <p className="text-gray-600 mb-4">
            심리 프로필을 변경하여 CVR 변화를 시뮬레이션하세요.
          </p>
          {/* 시뮬레이터는 위의 심리 분석 섹션과 통합됨 */}
        </div>
      </div>
    </div>
  )
}
