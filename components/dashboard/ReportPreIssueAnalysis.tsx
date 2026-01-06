/**
 * 리포트 발행 전 분석 섹션
 * 종합평가 및 분석, 전략수립을 포함한 리포트 발행 전 대시보드
 */

'use client'

import { useState } from 'react'
import { TrendingUp, Target, AlertCircle, CheckCircle2, BarChart3, Lightbulb, ArrowRight } from 'lucide-react'

interface ReportPreIssueAnalysisProps {
  companyName: string
  currentScore: number
  previousScores?: Array<{
    date: Date
    score: number
    version: number
  }>
  onGenerateStrategy?: () => void
}

export function ReportPreIssueAnalysis({
  companyName,
  currentScore,
  previousScores = [],
  onGenerateStrategy
}: ReportPreIssueAnalysisProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'1month' | '3month' | '6month' | 'all'>('3month')

  // 점수 변화 계산
  const getScoreChange = () => {
    if (previousScores.length === 0) return null
    const previousScore = previousScores[previousScores.length - 1]?.score || 0
    const change = currentScore - previousScore
    const changeRate = previousScore > 0 ? ((change / previousScore) * 100).toFixed(1) : '0.0'
    return { change, changeRate, previousScore }
  }

  const scoreChange = getScoreChange()

  // 기간별 필터링
  const getFilteredScores = () => {
    if (!previousScores.length) return []
    
    const now = new Date()
    const filterDate = new Date()
    
    switch (selectedPeriod) {
      case '1month':
        filterDate.setMonth(now.getMonth() - 1)
        break
      case '3month':
        filterDate.setMonth(now.getMonth() - 3)
        break
      case '6month':
        filterDate.setMonth(now.getMonth() - 6)
        break
      case 'all':
        return [...previousScores, { date: new Date(), score: currentScore, version: previousScores.length + 1 }]
    }
    
    return [
      ...previousScores.filter(s => s.date >= filterDate),
      { date: new Date(), score: currentScore, version: previousScores.length + 1 }
    ]
  }

  const filteredScores = getFilteredScores()

  // 종합평가
  const getOverallEvaluation = () => {
    if (scoreChange === null) {
      return {
        grade: 'B',
        gradeLabel: '양호',
        evaluation: '초회 진단입니다. 현재 점수를 기준으로 지속적인 개선이 필요합니다.',
        color: 'blue'
      }
    }

    const { change, changeRate } = scoreChange
    
    if (change > 5) {
      return {
        grade: 'A+',
        gradeLabel: '우수',
        evaluation: `${changeRate}%의 점수 향상이 있었습니다. 전략 실행이 효과적으로 이루어지고 있습니다.`,
        color: 'green'
      }
    } else if (change > 0) {
      return {
        grade: 'A',
        gradeLabel: '양호',
        evaluation: `${changeRate}%의 점수 향상이 있었습니다. 안정적인 성장 추세입니다.`,
        color: 'blue'
      }
    } else if (change === 0) {
      return {
        grade: 'B',
        gradeLabel: '보통',
        evaluation: '점수 변화가 없습니다. 전략 실행을 강화할 필요가 있습니다.',
        color: 'yellow'
      }
    } else {
      return {
        grade: 'C',
        gradeLabel: '주의',
        evaluation: `${Math.abs(parseFloat(changeRate))}%의 점수 하락이 있었습니다. 즉시 개선 조치가 필요합니다.`,
        color: 'red'
      }
    }
  }

  const evaluation = getOverallEvaluation()

  // 주요 발견사항
  const keyFindings = [
    {
      type: 'strength' as const,
      title: '강점 영역',
      items: [
        'SEO 점수 95점으로 최상위 수준',
        '유튜브 채널 성과 우수 (92점)',
        '컴플라이언스 점수 92점으로 안전',
        'ICE Score 기반 전략 실행 효과적'
      ]
    },
    {
      type: 'weakness' as const,
      title: '개선 필요 영역',
      items: [
        '틱톡 설득 지수 개선 필요 (62.1점)',
        'AEO 최적화 필요 (68점)',
        'GEO 스키마 보강 필요',
        '일부 채널 간 비대칭 존재'
      ]
    },
    {
      type: 'opportunity' as const,
      title: '기회',
      items: [
        '숏폼 콘텐츠 전략 강화 가능',
        'AI 엔진 최적화를 통한 검색 점유율 확대',
        '커뮤니티 참여도 향상 여지',
        '리타겟팅 전략 고도화'
      ]
    },
    {
      type: 'threat' as const,
      title: '위협',
      items: [
        '경쟁사 부정행위 모니터링 필요',
        '플랫폼 정책 변경 리스크',
        '컴플라이언스 규정 강화 대응',
        '시장 경쟁 심화'
      ]
    }
  ]

  // 전략수립 항목
  const strategyItems = [
    {
      priority: 'critical' as const,
      title: '틱톡 설득 지수 개선 - 콘텐츠 전략 재구성',
      description: '유튜브 유입은 강하지만, 틱톡의 설득 지수가 낮습니다(62.1점). 틱톡 특성에 맞는 짧고 임팩트 있는 콘텐츠로 전환',
      impact: 'HIGH',
      timeline: '1-2개월',
      expectedImprovement: '설득 지수 15점 향상 예상'
    },
    {
      priority: 'high' as const,
      title: 'AEO 최적화 - 사용자 질문형 콘텐츠 보강',
      description: 'AI 답변 엔진(AEO) 최적화를 위해 FAQ/Q&A 형식 콘텐츠 추가 및 구조화',
      impact: 'HIGH',
      timeline: '2-3개월',
      expectedImprovement: 'AEO 점수 10점 향상 예상'
    },
    {
      priority: 'high' as const,
      title: 'GEO 스키마 강화',
      description: 'JSON-LD 스키마 추가 및 통계/인용구 보강을 통한 생성형 AI 응답 품질 개선',
      impact: 'MEDIUM',
      timeline: '1개월',
      expectedImprovement: 'GEO 점수 8점 향상 예상'
    },
    {
      priority: 'medium' as const,
      title: '채널 간 비대칭 해소',
      description: '유튜브와 틱톡 간 설득 지수 차이를 줄이기 위한 통합 콘텐츠 전략 수립',
      impact: 'MEDIUM',
      timeline: '3개월',
      expectedImprovement: '전반적 채널 균형 개선'
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300'
    }
  }

  const getGradeColor = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-green-500'
      case 'blue':
        return 'bg-blue-500'
      case 'yellow':
        return 'bg-yellow-500'
      case 'red':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">리포트 발행 전 분석</h2>
        <p className="text-blue-100">
          {companyName}의 종합 평가 및 전략 수립을 위한 분석 리포트
        </p>
      </div>

      {/* 종합평가 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">종합평가</h3>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-600">현재 점수</div>
              <div className="text-3xl font-bold text-gray-900">{currentScore}점</div>
            </div>
            {scoreChange && (
              <div className={`px-4 py-2 rounded-lg ${
                scoreChange.change >= 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <div className="text-sm text-gray-600">변화</div>
                <div className={`text-xl font-bold ${
                  scoreChange.change >= 0 ? 'text-green-700' : 'text-red-700'
                }`}>
                  {scoreChange.change >= 0 ? '+' : ''}{scoreChange.change}점 ({scoreChange.changeRate}%)
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`${getGradeColor(evaluation.color)} rounded-lg p-6 text-white text-center`}>
            <div className="text-5xl font-bold mb-2">{evaluation.grade}</div>
            <div className="text-lg font-semibold">{evaluation.gradeLabel}</div>
          </div>
          <div className="md:col-span-2 p-6 bg-gray-50 rounded-lg">
            <div className="flex items-start gap-3">
              <BarChart3 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <div className="font-semibold text-gray-900 mb-2">평가 내용</div>
                <div className="text-gray-700">{evaluation.evaluation}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 기간별 비교 데이터 */}
      {previousScores.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">기간별 비교 데이터</h3>
            <div className="flex gap-2">
              {(['1month', '3month', '6month', 'all'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedPeriod === period
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {period === '1month' ? '1개월' :
                   period === '3month' ? '3개월' :
                   period === '6month' ? '6개월' : '전체'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredScores.map((score, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-32 text-sm text-gray-600">
                  {score.date.toLocaleDateString('ko-KR')}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold text-gray-900">{score.score}점</div>
                    {index > 0 && (
                      <span className={`text-sm font-medium ${
                        score.score > filteredScores[index - 1].score ? 'text-green-600' :
                        score.score < filteredScores[index - 1].score ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {score.score > filteredScores[index - 1].score ? '↑' :
                         score.score < filteredScores[index - 1].score ? '↓' : '→'}
                        {Math.abs(score.score - filteredScores[index - 1].score)}점
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  v{score.version}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 주요 발견사항 (SWOT 분석) */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">주요 발견사항</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {keyFindings.map((finding, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className={`flex items-center gap-2 mb-4 ${
                finding.type === 'strength' ? 'text-green-700' :
                finding.type === 'weakness' ? 'text-red-700' :
                finding.type === 'opportunity' ? 'text-blue-700' : 'text-orange-700'
              }`}>
                {finding.type === 'strength' && <CheckCircle2 className="w-5 h-5" />}
                {finding.type === 'weakness' && <AlertCircle className="w-5 h-5" />}
                {finding.type === 'opportunity' && <TrendingUp className="w-5 h-5" />}
                {finding.type === 'threat' && <AlertCircle className="w-5 h-5" />}
                <h4 className="font-semibold text-lg">{finding.title}</h4>
              </div>
              <ul className="space-y-2">
                {finding.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 전략수립 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Lightbulb className="w-6 h-6 text-yellow-600" />
            <h3 className="text-xl font-semibold text-gray-900">전략수립</h3>
          </div>
          {onGenerateStrategy && (
            <button
              onClick={onGenerateStrategy}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium transition-colors flex items-center gap-2"
            >
              <Target className="w-4 h-4" />
              전략 재생성
            </button>
          )}
        </div>

        <div className="space-y-4">
          {strategyItems.map((strategy, index) => (
            <div key={index} className={`border-2 rounded-lg p-5 ${getPriorityColor(strategy.priority)}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-white/50 rounded-full text-xs font-semibold">
                      {strategy.priority === 'critical' ? '긴급' :
                       strategy.priority === 'high' ? '높음' :
                       strategy.priority === 'medium' ? '중간' : '낮음'}
                    </span>
                    <span className="text-xs px-2 py-1 bg-white/50 rounded">
                      영향도: {strategy.impact}
                    </span>
                    <span className="text-xs px-2 py-1 bg-white/50 rounded">
                      {strategy.timeline}
                    </span>
                  </div>
                  <h4 className="font-semibold text-lg mb-2">{strategy.title}</h4>
                  <p className="text-sm mb-3">{strategy.description}</p>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <ArrowRight className="w-4 h-4" />
                    <span>예상 효과: {strategy.expectedImprovement}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 전략 실행 로드맵 */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-3">전략 실행 로드맵</h4>
          <div className="space-y-2 text-sm text-blue-800">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span><strong>1개월 내:</strong> GEO 스키마 강화, 틱톡 콘텐츠 전략 시작</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span><strong>2-3개월:</strong> AEO 최적화, 채널 간 비대칭 개선</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span><strong>3개월+:</strong> 통합 전략 실행 및 성과 모니터링</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
