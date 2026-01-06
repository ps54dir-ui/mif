'use client'

import { DetailedSEOGEODiagnosis } from './DetailedSEOGEODiagnosis'
import { AnalysisTypeBadge } from './AnalysisTypeBadge'
import { useState } from 'react'

interface SEOGEOReport {
  type: 'SEO' | 'GEO' | 'AEO'
  score: number
  issues: string[]
  analysis_type?: 'actual' | 'inference' | 'unavailable'
  analysis_type_label?: string
  analysis_type_description?: string
}

interface SEOGEOReportCardsProps {
  reports: SEOGEOReport[]
  showDetailed?: boolean // 상세 진단 표시 여부
}

export function SEOGEOReportCards({ reports, showDetailed = true }: SEOGEOReportCardsProps) {
  const [expandedReport, setExpandedReport] = useState<string | null>(null)
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'SEO':
        return 'SEO 최적화'
      case 'GEO':
        return 'GEO 최적화'
      case 'AEO':
        return 'AEO 최적화'
      default:
        return type
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'SEO':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-700',
          score: 'text-blue-600'
        }
      case 'GEO':
        return {
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          text: 'text-purple-700',
          score: 'text-purple-600'
        }
      case 'AEO':
        return {
          bg: 'bg-indigo-50',
          border: 'border-indigo-200',
          text: 'text-indigo-700',
          score: 'text-indigo-600'
        }
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-700',
          score: 'text-gray-600'
        }
    }
  }

  const getScoreStatus = (score: number) => {
    if (score >= 80) return { label: '우수', color: 'text-green-600' }
    if (score >= 60) return { label: '양호', color: 'text-yellow-600' }
    if (score >= 40) return { label: '보통', color: 'text-orange-600' }
    return { label: '개선 필요', color: 'text-red-600' }
  }

  // 상세 진단 데이터 생성 (모의 데이터 - 실제로는 백엔드에서 받아와야 함)
  const generateDetailedEvaluations = (report: SEOGEOReport) => {
    const reportKey = report.type.toLowerCase()
    
    if (reportKey === 'seo') {
      return {
        evaluations: [
          {
            name: 'Technical SEO (40점)',
            score: Math.round(report.score * 0.4),
            maxScore: 40,
            status: (report.score >= 80 ? 'excellent' : report.score >= 60 ? 'good' : report.score >= 40 ? 'needs_improvement' : 'poor') as 'excellent' | 'good' | 'needs_improvement' | 'poor',
            strengths: report.score >= 70 ? ['메타 태그가 잘 구성되어 있습니다', '모바일 최적화가 양호합니다'] : [],
            improvements: report.score < 80 && report.score >= 50 ? ['로딩 속도 개선이 필요합니다', 'OG 태그 보강이 필요합니다'] : [],
            weaknesses: report.score < 50 ? ['메타 태그가 부족합니다', '모바일 최적화가 미흡합니다', '로딩 속도가 느립니다'] : [],
            recommendations: [
              '메타 타이틀과 디스크립션을 키워드 중심으로 최적화하세요',
              'OG 태그를 추가하여 소셜 미디어 공유 시 이미지와 설명이 표시되도록 하세요',
              '페이지 로딩 속도를 3초 이내로 개선하세요',
              '모바일 뷰포트 메타 태그를 확인하세요'
            ]
          },
          {
            name: 'Content SEO - E-E-A-T (60점)',
            score: Math.round(report.score * 0.6),
            maxScore: 60,
            status: (report.score >= 80 ? 'excellent' : report.score >= 60 ? 'good' : 'needs_improvement') as 'excellent' | 'good' | 'needs_improvement' | 'poor',
            strengths: report.score >= 70 ? ['전문성이 잘 표현되어 있습니다', '신뢰할 수 있는 정보가 포함되어 있습니다'] : [],
            improvements: report.score < 80 && report.score >= 50 ? ['경험 기반 콘텐츠 보강이 필요합니다', '권위 있는 출처 인용을 늘리세요'] : [],
            weaknesses: report.score < 50 ? ['E-E-A-T 요소가 부족합니다', '전문성 표시가 미흡합니다', '신뢰성이 낮습니다'] : [],
            recommendations: [
              '실제 경험을 바탕으로 한 콘텐츠를 추가하세요',
              '전문가 인용 및 권위 있는 출처를 명시하세요',
              '신뢰성을 높이기 위한 인증, 보증 정보를 추가하세요'
            ]
          }
        ]
      }
    } else if (reportKey === 'geo') {
      return {
        evaluations: [
          {
            name: '구조화된 데이터 (30점)',
            score: Math.round(report.score * 0.3),
            maxScore: 30,
            status: (report.score >= 80 ? 'excellent' : report.score >= 60 ? 'good' : 'needs_improvement') as 'excellent' | 'good' | 'needs_improvement' | 'poor',
            strengths: report.score >= 70 ? ['JSON-LD 스키마가 포함되어 있습니다'] : [],
            improvements: report.score < 80 && report.score >= 50 ? ['FAQPage 스키마 추가가 필요합니다', 'Article 스키마 보강이 필요합니다'] : [],
            weaknesses: report.score < 50 ? ['JSON-LD 스키마가 없습니다', '구조화된 데이터가 전혀 없습니다'] : [],
            recommendations: [
              'JSON-LD 스키마를 추가하여 AI가 콘텐츠를 이해하기 쉽게 하세요',
              'FAQPage 스키마를 추가하여 FAQ 섹션을 구조화하세요',
              'Article 스키마를 사용하여 글 콘텐츠를 마크업하세요',
              'HowTo 스키마를 활용하여 단계별 가이드를 제공하세요'
            ]
          },
          {
            name: '통계 및 인용구 (30점)',
            score: Math.round(report.score * 0.3),
            maxScore: 30,
            status: (report.score >= 80 ? 'excellent' : report.score >= 60 ? 'good' : 'needs_improvement') as 'excellent' | 'good' | 'needs_improvement' | 'poor',
            strengths: report.score >= 70 ? ['통계 데이터가 잘 활용되고 있습니다', '인용구가 적절히 사용되었습니다'] : [],
            improvements: report.score < 80 && report.score >= 50 ? ['통계 데이터를 더 추가하세요', '출처를 명확히 표기하세요'] : [],
            weaknesses: report.score < 50 ? ['통계 데이터가 부족합니다', '인용구 및 출처 표기가 없습니다'] : [],
            recommendations: [
              '구체적인 통계 데이터(숫자, 퍼센트)를 10개 이상 추가하세요',
              '신뢰할 수 있는 출처를 명시하고 인용구를 사용하세요',
              '연구 결과나 조사 데이터를 인용하여 신뢰성을 높이세요'
            ]
          },
          {
            name: 'FAQ/Q&A 포맷 (40점)',
            score: Math.round(report.score * 0.4),
            maxScore: 40,
            status: (report.score >= 80 ? 'excellent' : report.score >= 60 ? 'good' : 'needs_improvement') as 'excellent' | 'good' | 'needs_improvement' | 'poor',
            strengths: report.score >= 70 ? ['FAQ 섹션이 잘 구성되어 있습니다'] : [],
            improvements: report.score < 80 && report.score >= 50 ? ['FAQ 개수를 늘리세요', 'Q&A 형식의 콘텐츠를 추가하세요'] : [],
            weaknesses: report.score < 50 ? ['FAQ/Q&A 형식이 없습니다', '질문-답변 구조가 부족합니다'] : [],
            recommendations: [
              '사용자 질문에 대한 Q&A 섹션을 10개 이상 추가하세요',
              'FAQPage 스키마를 사용하여 구조화하세요',
              '자주 묻는 질문을 먼저 배치하세요'
            ]
          }
        ]
      }
    } else { // AEO
      return {
        evaluations: [
          {
            name: '콘텐츠 구조 (20점)',
            score: Math.round(report.score * 0.2),
            maxScore: 20,
            status: (report.score >= 80 ? 'excellent' : report.score >= 60 ? 'good' : 'needs_improvement') as 'excellent' | 'good' | 'needs_improvement' | 'poor',
            strengths: report.score >= 70 ? ['표와 불렛포인트가 잘 활용되고 있습니다'] : [],
            improvements: report.score < 80 && report.score >= 50 ? ['표 형식 데이터를 더 추가하세요', '불렛포인트 활용을 늘리세요'] : [],
            weaknesses: report.score < 50 ? ['서술형 콘텐츠가 많아 AI가 요약하기 어렵습니다', '표와 불렛포인트가 부족합니다'] : [],
            recommendations: [
              '핵심 정보를 표(Table) 형식으로 정리하세요',
              '주요 내용을 불렛포인트로 정리하여 AI가 인용하기 쉽게 하세요',
              '비교 데이터, 가격 정보, 스펙 등을 표로 제공하세요',
              '서술형 콘텐츠를 구조화된 형식으로 전환하세요'
            ]
          },
          {
            name: 'AI 엔진별 평가 (80점)',
            score: Math.round(report.score * 0.8),
            maxScore: 80,
            status: (report.score >= 80 ? 'excellent' : report.score >= 60 ? 'good' : 'needs_improvement') as 'excellent' | 'good' | 'needs_improvement' | 'poor',
            strengths: report.score >= 70 ? ['AI 엔진에서 긍정적으로 평가되고 있습니다'] : [],
            improvements: report.score < 80 && report.score >= 50 ? ['AI 엔진 노출 빈도를 높이세요', '브랜드 언급 횟수를 늘리세요'] : [],
            weaknesses: report.score < 50 ? ['AI 엔진에서 거의 언급되지 않습니다', '부정적 감정이 감지됩니다'] : [],
            recommendations: [
              'AI가 인용하기 좋은 구조화된 데이터(JSON-LD)를 강화하세요',
              '브랜드의 전문성과 혁신성을 강조하는 콘텐츠를 지속적으로 발행하세요',
              'FAQ 섹션을 강화하여 AI가 직접 답변할 수 있는 구조로 개선하세요'
            ]
          }
        ]
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">📊 종합 진단 - SEO/GEO/AEO 최적화</h2>
        <p className="text-gray-600 text-sm">검색 엔진 최적화(SEO), 생성형 AI 최적화(GEO), 답변 엔진 최적화(AEO) 종합 진단 결과</p>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reports.map((report, index) => {
          const colors = getTypeColor(report.type)
          const status = getScoreStatus(report.score)

          return (
            <div
              key={index}
              className={`rounded-lg border-2 p-6 ${colors.bg} ${colors.border} shadow-sm cursor-pointer hover:shadow-md transition-shadow ${
                expandedReport === report.type ? 'ring-2 ring-offset-2 ring-blue-500' : ''
              }`}
              onClick={() => showDetailed && setExpandedReport(expandedReport === report.type ? null : report.type)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold ${colors.text} mb-2`}>
                    {getTypeLabel(report.type)}
                  </h3>
                  {/* 분석 타입 배지 */}
                  <AnalysisTypeBadge 
                    analysisType={report.analysis_type || 'inference'}
                    label={report.analysis_type_label}
                    description={report.analysis_type_description}
                    size="sm"
                  />
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${colors.score}`}>
                    {report.score}
                    <span className="text-lg text-gray-500">/100</span>
                  </div>
                  <div className={`text-xs font-medium ${status.color}`}>
                    {status.label}
                  </div>
                </div>
              </div>

              {report.issues.length > 0 && (
                <div className="mt-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">주요 이슈:</div>
                  <ul className="space-y-1">
                    {report.issues.slice(0, 2).map((issue, issueIndex) => (
                      <li key={issueIndex} className="text-sm text-gray-600 flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        <span className="line-clamp-2">{issue}</span>
                      </li>
                    ))}
                  </ul>
                  {report.issues.length > 2 && (
                    <div className="text-xs text-gray-500 mt-2">+ {report.issues.length - 2}개 더</div>
                  )}
                </div>
              )}

              {report.issues.length === 0 && (
                <div className="mt-4 text-sm text-green-600 font-medium">
                  ✓ 최적화 상태 양호
                </div>
              )}

              {showDetailed && (
                <div className="mt-4 text-xs text-gray-500 text-center">
                  {expandedReport === report.type ? '▼ 상세 접기' : '▶ 상세 보기'}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* 상세 진단 결과 */}
      {showDetailed && expandedReport && (() => {
        const report = reports.find(r => r.type === expandedReport)
        if (!report) return null
        const detailed = generateDetailedEvaluations(report)
        return (
          <DetailedSEOGEODiagnosis
            type={report.type}
            totalScore={report.score}
            evaluations={detailed.evaluations}
          />
        )
      })()}
    </div>
  )
}
