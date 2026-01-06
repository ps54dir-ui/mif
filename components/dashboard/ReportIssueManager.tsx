/**
 * 리포트 발행 관리 시스템
 * 달력 날짜/시간으로 리포트 발행 관리 및 히스토리
 */

'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, FileText, TrendingUp, GitCompare, Download, X, Settings } from 'lucide-react'
import { ReportTemplateGenerator } from './ReportTemplateGenerator'
import { ReportTemplateCustomizer } from './ReportTemplateCustomizer'
import { ReportPreIssueAnalysis } from './ReportPreIssueAnalysis'
import { NotionSyncButton } from '@/components/integrations/NotionSyncButton'
import { saveReport, getUserReports, deleteReport } from '@/lib/api/reportApi'
import { isAuthenticated } from '@/lib/auth/auth'

type ReportType = 'initial' | 'consulting_effect' | 'comparison'
type ReportStatus = 'draft' | 'published'

interface Report {
  id: string
  companyName: string
  reportType: ReportType
  status: ReportStatus
  issuedAt: Date
  version: number
  title: string
  overallScore?: number
  previousReportId?: string
}

interface ReportIssueManagerProps {
  companyName?: string
}

export function ReportIssueManager({ companyName = '삼성생명' }: ReportIssueManagerProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>(
    new Date().toTimeString().slice(0, 5)
  )
  const [reportType, setReportType] = useState<ReportType>('initial')
  const [reports, setReports] = useState<Report[]>([])
  const [isIssuing, setIsIssuing] = useState(false)
  const [showTemplateCustomizer, setShowTemplateCustomizer] = useState(false)

  // Mock 데이터: 기존 리포트 히스토리
  useEffect(() => {
    const mockReports: Report[] = [
      {
        id: 'report-001',
        companyName: companyName,
        reportType: 'initial',
        status: 'published',
        issuedAt: new Date('2024-01-01T10:00:00'),
        version: 1,
        title: '초회 종합 마케팅 진단 리포트',
        overallScore: 82
      },
      {
        id: 'report-002',
        companyName: companyName,
        reportType: 'consulting_effect',
        status: 'published',
        issuedAt: new Date('2024-01-15T14:30:00'),
        version: 2,
        title: '컨설팅 효과 분석 리포트',
        overallScore: 85,
        previousReportId: 'report-001'
      },
      {
        id: 'report-003',
        companyName: companyName,
        reportType: 'comparison',
        status: 'published',
        issuedAt: new Date('2024-02-01T09:00:00'),
        version: 3,
        title: '진단 비교 리포트',
        overallScore: 88,
        previousReportId: 'report-002'
      }
    ]
    setReports(mockReports)
  }, [])

  const getReportTypeLabel = (type: ReportType) => {
    switch (type) {
      case 'initial':
        return '초회 진단 리포트'
      case 'consulting_effect':
        return '컨설팅 효과 분석 리포트'
      case 'comparison':
        return '비교 리포트'
      default:
        return '리포트'
    }
  }

  const getReportTypeDescription = (type: ReportType) => {
    switch (type) {
      case 'initial':
        return '최초 진단 분석 및 전략 수립 리포트'
      case 'consulting_effect':
        return '컨설팅 실행 후 효과 분석 리포트'
      case 'comparison':
        return '이전 리포트와 비교 분석 리포트'
      default:
        return ''
    }
  }

  const handleIssueReport = async () => {
    if (!isAuthenticated()) {
      alert('로그인이 필요합니다.')
      return
    }

    setIsIssuing(true)
    
    try {
      // 날짜와 시간 결합
      const [hours, minutes] = selectedTime.split(':').map(Number)
      const issueDate = new Date(selectedDate)
      issueDate.setHours(hours, minutes, 0, 0)

      // 다음 버전 번호 계산
      const nextVersion = reports.length > 0 
        ? Math.max(...reports.map(r => r.version)) + 1
        : 1

      // 이전 리포트 찾기
      const previousReport = reports.length > 0 
        ? reports.sort((a, b) => b.issuedAt.getTime() - a.issuedAt.getTime())[0]
        : null

      // 리포트 타입 결정
      let finalReportType: ReportType = reportType
      if (!previousReport && reportType !== 'initial') {
        finalReportType = 'initial' // 첫 리포트는 무조건 초회 진단
      } else if (previousReport && reportType === 'initial') {
        finalReportType = previousReport.reportType === 'initial' 
          ? 'consulting_effect' 
          : 'comparison'
      }

      const reportTitle = `${getReportTypeLabel(finalReportType)} (v${nextVersion})`

      // 리포트 데이터 준비 (실제로는 현재 대시보드 데이터를 가져와야 함)
      const reportData = {
        overallScore: 88, // 실제로는 현재 대시보드 데이터에서 가져와야 함
        reportType: finalReportType,
        version: nextVersion,
        previousReportId: previousReport?.id,
        // 추가 리포트 데이터...
      }

      // 리포트 저장 (API 호출)
      const savedReport = await saveReport({
        report_name: reportTitle,
        report_type: finalReportType,
        company_name: companyName,
        report_data: reportData,
        issued_at: issueDate.toISOString(),
        version: nextVersion,
        is_published: true
      })

      // 로컬 상태 업데이트
      const newReport: Report = {
        id: savedReport.id,
        companyName,
        reportType: finalReportType,
        status: 'published',
        issuedAt: issueDate,
        version: nextVersion,
        title: reportTitle,
        overallScore: 88,
        previousReportId: previousReport?.id
      }

      setReports(prev => [...prev, newReport].sort((a, b) => 
        b.issuedAt.getTime() - a.issuedAt.getTime()
      ))
      
      alert('리포트가 발행되고 저장되었습니다!')
    } catch (error) {
      console.error('리포트 저장 오류:', error)
      alert(error instanceof Error ? error.message : '리포트 발행에 실패했습니다.')
    } finally {
      setIsIssuing(false)
    }
  }

  const [selectedReportForExport, setSelectedReportForExport] = useState<Report | null>(null)

  const handleExportReport = (reportId: string) => {
    const report = reports.find(r => r.id === reportId)
    if (report) {
      setSelectedReportForExport(report)
    }
  }

  const handleCloseExport = () => {
    setSelectedReportForExport(null)
  }

  if (showTemplateCustomizer) {
    return (
      <div>
        <div className="mb-4">
          <button
            onClick={() => setShowTemplateCustomizer(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 flex items-center gap-2"
          >
            ← 리포트 발행 관리로 돌아가기
          </button>
        </div>
        <ReportTemplateCustomizer
          companyName={companyName}
          onSave={(template) => {
            console.log('템플릿 저장됨:', template)
          }}
          onLoad={(template) => {
            console.log('템플릿 로드됨:', template)
          }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 리포트 템플릿 커스터마이저 버튼 */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">리포트 템플릿 관리</h3>
            <p className="text-sm text-gray-600 mt-1">
              리포트 구성 요소를 선택하여 커스텀 템플릿을 만들고 저장할 수 있습니다
            </p>
          </div>
          <button
            onClick={() => setShowTemplateCustomizer(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            템플릿 커스터마이저 열기
          </button>
        </div>
      </div>

      {/* 헤더 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">리포트 발행 관리</h2>
            <p className="text-gray-600 mt-1">{companyName} 리포트 발행 및 관리</p>
          </div>
        </div>
      </div>

      {/* 리포트 발행 폼 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">새 리포트 발행</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 날짜 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              발행 일자
            </label>
            <input
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* 시간 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-2" />
              발행 시간
            </label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* 리포트 타입 선택 */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              리포트 타입
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(['initial', 'consulting_effect', 'comparison'] as ReportType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setReportType(type)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    reportType === type
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900 mb-1">
                    {getReportTypeLabel(type)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {getReportTypeDescription(type)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 발행 버튼 */}
        <div className="mt-6">
          <button
            onClick={handleIssueReport}
            disabled={isIssuing}
            className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isIssuing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>발행 중...</span>
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                <span>리포트 발행</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 리포트 발행 전 분석 */}
      <ReportPreIssueAnalysis
        companyName={companyName}
        currentScore={88} // 실제로는 현재 대시보드 데이터에서 가져와야 함
        previousScores={reports.map(r => ({
          date: r.issuedAt,
          score: r.overallScore || 0,
          version: r.version
        }))}
        onGenerateStrategy={() => {
          alert('전략 재생성 기능은 곧 제공될 예정입니다.')
        }}
      />

      {/* 리포트 히스토리 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">발행 히스토리</h3>
          {reports.length > 0 && (
            <div className="flex items-center gap-2">
              <NotionSyncButton
                type="report"
                databaseId={process.env.NEXT_PUBLIC_NOTION_DATABASE_ID || ''}
                companyName={companyName}
                onSyncComplete={(pageUrl) => {
                  window.open(pageUrl, '_blank')
                }}
              />
            </div>
          )}
        </div>
        
        {reports.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            발행된 리포트가 없습니다.
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        v{report.version}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        report.reportType === 'initial'
                          ? 'bg-green-100 text-green-700'
                          : report.reportType === 'consulting_effect'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {getReportTypeLabel(report.reportType)}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        report.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {report.status === 'published' ? '발행됨' : '초안'}
                      </span>
                    </div>
                    
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {report.title}
                    </h4>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {report.issuedAt.toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>
                          {report.issuedAt.toLocaleTimeString('ko-KR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      {report.overallScore !== undefined && (
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          <span className="font-semibold text-blue-600">
                            종합 점수: {report.overallScore}점
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <NotionSyncButton
                      type="report"
                      databaseId={process.env.NEXT_PUBLIC_NOTION_DATABASE_ID || ''}
                      reportId={report.id}
                      companyName={companyName}
                      onSyncComplete={(pageUrl) => {
                        window.open(pageUrl, '_blank')
                      }}
                    />
                    {report.previousReportId && (
                      <button
                        onClick={() => alert(`이전 리포트 (${report.previousReportId})와 비교`)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="이전 리포트와 비교"
                      >
                        <GitCompare className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleExportReport(report.id)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="리포트 출력"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 리포트 출력 선택 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">리포트 출력</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              업체명
            </label>
            <input
              type="text"
              value={companyName}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              발행 일자 선택
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">발행 일자 선택</option>
              {reports.map((report) => (
                <option key={report.id} value={report.id}>
                  {report.issuedAt.toLocaleDateString('ko-KR')} - {report.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button 
          onClick={() => {
            const latestReport = reports.length > 0 
              ? reports.sort((a, b) => b.issuedAt.getTime() - a.issuedAt.getTime())[0]
              : null
            if (latestReport) {
              setSelectedReportForExport(latestReport)
            }
          }}
          className="mt-4 w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          <span>리포트 출력</span>
        </button>
      </div>

      {/* 리포트 템플릿 생성기 모달 */}
      {selectedReportForExport && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
              <h3 className="text-xl font-bold text-gray-900">리포트 미리보기 및 출력</h3>
              <button
                onClick={handleCloseExport}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="p-6">
              <ReportTemplateGenerator
                reportData={{
                  companyName: selectedReportForExport.companyName,
                  reportType: selectedReportForExport.reportType,
                  issuedAt: selectedReportForExport.issuedAt,
                  version: selectedReportForExport.version,
                  overallScore: selectedReportForExport.overallScore || 0,
                  previousScore: reports
                    .filter(r => r.id !== selectedReportForExport.id && r.issuedAt < selectedReportForExport.issuedAt)
                    .sort((a, b) => b.issuedAt.getTime() - a.issuedAt.getTime())[0]?.overallScore,
                  previousReportId: selectedReportForExport.previousReportId
                }}
                onExport={(type) => {
                  alert(`${getReportTypeLabel(type)} PDF가 생성되었습니다.`)
                  handleCloseExport()
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
