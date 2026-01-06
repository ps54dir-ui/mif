/**
 * 리포트 템플릿 생성기
 * 리포트 타입별 양식 생성 (초회 진단 / 컨설팅 효과 / 비교 리포트)
 */

'use client'

import { useState } from 'react'
import { FileText, Download, Calendar, TrendingUp, Target, CheckCircle2, AlertCircle } from 'lucide-react'

type ReportType = 'initial' | 'consulting_effect' | 'comparison'

interface ReportData {
  companyName: string
  reportType: ReportType
  issuedAt: Date
  version: number
  overallScore: number
  previousScore?: number
  previousReportId?: string
}

interface ReportTemplateGeneratorProps {
  reportData: ReportData
  onExport?: (reportType: ReportType) => void
}

export function ReportTemplateGenerator({ reportData, onExport }: ReportTemplateGeneratorProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      // PDF 생성 로직 (실제로는 html2canvas + jspdf 사용)
      await new Promise(resolve => setTimeout(resolve, 1500))
      onExport?.(reportData.reportType)
      alert(`${getReportTypeLabel(reportData.reportType)}가 생성되었습니다.`)
    } finally {
      setIsExporting(false)
    }
  }

  const getReportTypeLabel = (type: ReportType) => {
    switch (type) {
      case 'initial':
        return '초회 종합 마케팅 진단 리포트'
      case 'consulting_effect':
        return '컨설팅 효과 분석 리포트'
      case 'comparison':
        return '진단 비교 리포트'
      default:
        return '리포트'
    }
  }

  // 초회 진단 리포트 양식
  const renderInitialReport = () => (
    <div className="space-y-8">
      {/* 커버 */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl p-12 text-white text-center">
        <h1 className="text-4xl font-bold mb-4">{getReportTypeLabel('initial')}</h1>
        <div className="text-2xl mb-2">{reportData.companyName}</div>
        <div className="text-lg opacity-90">
          {reportData.issuedAt.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
        <div className="mt-8 text-6xl font-bold">
          {reportData.overallScore}<span className="text-3xl">/100</span>
        </div>
      </div>

      {/* 목차 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">목차</h2>
        <ol className="space-y-2 text-gray-700">
          <li className="flex items-center gap-2">
            <span className="font-semibold">1.</span>
            <span>Executive Summary (종합 요약)</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="font-semibold">2.</span>
            <span>종합 진단 점수 및 4대 축 분석</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="font-semibold">3.</span>
            <span>SEO/GEO/AEO 진단 결과</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="font-semibold">4.</span>
            <span>채널별 성과 분석 (7개 채널)</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="font-semibold">5.</span>
            <span>ICE Score 우선순위 전략</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="font-semibold">6.</span>
            <span>컴플라이언스 검증 (Layer 2)</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="font-semibold">7.</span>
            <span>시장 보호 현황 (Layer 3)</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="font-semibold">8.</span>
            <span>전략 실행 계획</span>
          </li>
        </ol>
      </div>

      {/* Executive Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Executive Summary</h2>
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed">
            본 리포트는 {reportData.companyName}의 종합 마케팅 건강도를 진단하고, 
            데이터 기반 전략을 수립하기 위한 초회 진단 리포트입니다.
          </p>
          <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500">
            <p className="font-semibold text-blue-900 mb-2">핵심 발견사항</p>
            <ul className="list-disc list-inside text-blue-800 space-y-1">
              <li>종합 점수: {reportData.overallScore}점 (100점 만점)</li>
              <li>주요 강점 영역과 개선이 필요한 영역을 식별했습니다</li>
              <li>ICE Score 기반 우선순위 전략을 제시합니다</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 전략 수립 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. 전략 실행 계획</h2>
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-green-900 mb-2">우선순위 전략 1</h3>
                <p className="text-green-800 text-sm">
                  ICE Score 기반 최우선 전략 실행을 통해 종합 점수 향상을 목표로 합니다.
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Target className="w-6 h-6 text-yellow-600 mt-1" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-2">예상 효과</h3>
                <p className="text-yellow-800 text-sm">
                  전략 실행 후 3개월 내 종합 점수 {reportData.overallScore + 5}점 달성 예상
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // 컨설팅 효과 분석 리포트 양식
  const renderConsultingEffectReport = () => (
    <div className="space-y-8">
      {/* 커버 */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-700 rounded-xl p-12 text-white text-center">
        <h1 className="text-4xl font-bold mb-4">{getReportTypeLabel('consulting_effect')}</h1>
        <div className="text-2xl mb-2">{reportData.companyName}</div>
        <div className="text-lg opacity-90">
          {reportData.issuedAt.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
        {reportData.previousScore !== undefined && (
          <div className="mt-8">
            <div className="text-4xl font-bold mb-2">
              {reportData.previousScore}점 → {reportData.overallScore}점
            </div>
            <div className="text-2xl">
              <TrendingUp className="w-8 h-8 inline mr-2" />
              +{reportData.overallScore - reportData.previousScore}점 개선
            </div>
          </div>
        )}
      </div>

      {/* 컨설팅 효과 분석 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">컨설팅 실행 효과 분석</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-700 mb-1">이전 점수</div>
            <div className="text-3xl font-bold text-blue-900">{reportData.previousScore || 0}점</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-sm text-green-700 mb-1">현재 점수</div>
            <div className="text-3xl font-bold text-green-900">{reportData.overallScore}점</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-sm text-purple-700 mb-1">개선율</div>
            <div className="text-3xl font-bold text-purple-900">
              +{reportData.previousScore ? (reportData.overallScore - reportData.previousScore) : 0}점
            </div>
          </div>
        </div>
        
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed mb-4">
            컨설팅 실행 후 {reportData.previousScore ? (reportData.overallScore - reportData.previousScore) : 0}점의 개선이 있었습니다.
            주요 개선 영역과 효과를 분석합니다.
          </p>
        </div>
      </div>

      {/* 효과 분석 상세 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">주요 개선 영역</h2>
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border-l-4 border-green-500">
            <h3 className="font-semibold text-green-900 mb-2">✅ 개선된 영역</h3>
            <ul className="list-disc list-inside text-green-800 space-y-1">
              <li>채널별 성과 최적화</li>
              <li>컴플라이언스 점수 향상</li>
              <li>전략 실행 효과</li>
            </ul>
          </div>
          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500">
            <h3 className="font-semibold text-yellow-900 mb-2">⚠️ 추가 개선 필요 영역</h3>
            <ul className="list-disc list-inside text-yellow-800 space-y-1">
              <li>일부 채널의 성과 개선 여지</li>
              <li>고급 전략 적용 기회</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )

  // 비교 리포트 양식
  const renderComparisonReport = () => {
    const scoreChange = reportData.previousScore 
      ? reportData.overallScore - reportData.previousScore 
      : 0
    const changeRate = reportData.previousScore
      ? ((scoreChange / reportData.previousScore) * 100).toFixed(1)
      : '0.0'

    return (
      <div className="space-y-8">
        {/* 커버 */}
        <div className="bg-gradient-to-br from-orange-600 to-red-700 rounded-xl p-12 text-white text-center">
          <h1 className="text-4xl font-bold mb-4">{getReportTypeLabel('comparison')}</h1>
          <div className="text-2xl mb-2">{reportData.companyName}</div>
          <div className="text-lg opacity-90 mb-8">
            {reportData.issuedAt.toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          <div className="flex items-center justify-center gap-8">
            <div>
              <div className="text-sm opacity-90 mb-1">이전 리포트</div>
              <div className="text-4xl font-bold">{reportData.previousScore || 0}점</div>
            </div>
            <div className="text-4xl">→</div>
            <div>
              <div className="text-sm opacity-90 mb-1">현재 리포트</div>
              <div className="text-4xl font-bold">{reportData.overallScore}점</div>
            </div>
          </div>
          <div className="mt-6 text-2xl">
            {scoreChange >= 0 ? (
              <TrendingUp className="w-8 h-8 inline mr-2" />
            ) : (
              <AlertCircle className="w-8 h-8 inline mr-2" />
            )}
            {scoreChange >= 0 ? '+' : ''}{scoreChange}점 ({changeRate}%)
          </div>
        </div>

        {/* 비교 분석 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">상세 비교 분석</h2>
          
          {/* 점수 비교 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">종합 점수 비교</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-600 mb-1">이전 리포트 (v{reportData.version - 1})</div>
                <div className="text-3xl font-bold text-gray-900">{reportData.previousScore || 0}점</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-600 mb-1">현재 리포트 (v{reportData.version})</div>
                <div className="text-3xl font-bold text-blue-900">{reportData.overallScore}점</div>
              </div>
            </div>
            <div className={`mt-4 p-4 rounded-lg ${
              scoreChange >= 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className={`font-semibold mb-1 ${
                scoreChange >= 0 ? 'text-green-900' : 'text-red-900'
              }`}>
                변화: {scoreChange >= 0 ? '+' : ''}{scoreChange}점 ({changeRate}%)
              </div>
              <div className={`text-sm ${
                scoreChange >= 0 ? 'text-green-800' : 'text-red-800'
              }`}>
                {scoreChange >= 0 
                  ? '전반적인 개선 추세를 보이고 있습니다.'
                  : '일부 영역에서 개선이 필요합니다.'}
              </div>
            </div>
          </div>

          {/* 채널별 비교 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">채널별 점수 변화</h3>
            <div className="space-y-3">
              {['SEO', 'SNS', '광고', '커뮤니티'].map((channel, index) => (
                <div key={channel} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">{channel}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-600">{75 + index * 3}점</span>
                    <span className="text-gray-400">→</span>
                    <span className="font-semibold text-blue-600">{78 + index * 3}점</span>
                    <span className="text-green-600 font-semibold">+{3}점</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 개선/하락 영역 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">개선 및 하락 영역</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-green-50 border-l-4 border-green-500">
              <h3 className="font-semibold text-green-900 mb-3">✅ 개선된 영역</h3>
              <ul className="list-disc list-inside text-green-800 space-y-1">
                <li>SEO 점수 향상</li>
                <li>SNS 참여도 증가</li>
                <li>컴플라이언스 점수 개선</li>
              </ul>
            </div>
            <div className="p-4 bg-red-50 border-l-4 border-red-500">
              <h3 className="font-semibold text-red-900 mb-3">⚠️ 하락한 영역</h3>
              <ul className="list-disc list-inside text-red-800 space-y-1">
                <li>일부 채널 성과 감소</li>
                <li>추가 모니터링 필요</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderReportContent = () => {
    switch (reportData.reportType) {
      case 'initial':
        return renderInitialReport()
      case 'consulting_effect':
        return renderConsultingEffectReport()
      case 'comparison':
        return renderComparisonReport()
      default:
        return renderInitialReport()
    }
  }

  return (
    <div className="space-y-6">
      {/* 리포트 미리보기 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{getReportTypeLabel(reportData.reportType)}</h2>
            <p className="text-gray-600 text-sm mt-1">
              {reportData.companyName} • v{reportData.version} • {' '}
              {reportData.issuedAt.toLocaleDateString('ko-KR')}
            </p>
          </div>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>생성 중...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>PDF 다운로드</span>
              </>
            )}
          </button>
        </div>

        {/* 리포트 내용 */}
        <div className="border border-gray-200 rounded-lg p-8 bg-gray-50">
          {renderReportContent()}
        </div>
      </div>
    </div>
  )
}
