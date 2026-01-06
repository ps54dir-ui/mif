'use client'

import { useState } from 'react'
import { generateAdvancedPDF } from '@/lib/pdf/advancedTemplate'
import type { DashboardData } from '@/lib/api/dashboardApi'
import { checkRequiredData } from '@/lib/api/onboarding'

// SVG 아이콘 컴포넌트
const FileText = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

interface PDFExportButtonProps {
  reportId: string
  companyName?: string
  dashboardData?: DashboardData
  useAdvancedTemplate?: boolean
  brandId?: string  // 필수 데이터 검증용
}

export function PDFExportButton({ 
  reportId, 
  companyName = '마케팅 진단 리포트',
  dashboardData,
  useAdvancedTemplate = false,
  brandId
}: PDFExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const exportToPDF = async () => {
    try {
      setIsExporting(true)
      setValidationError(null)
      
      // 필수 데이터 수령 여부 확인
      if (brandId) {
        try {
          const requiredCheck = await checkRequiredData(brandId)
          if (!requiredCheck.is_complete) {
            setValidationError(requiredCheck.message)
            setIsExporting(false)
            return
          }
        } catch (error) {
          console.warn('필수 데이터 확인 실패 (계속 진행):', error)
          // 검증 실패해도 계속 진행 (온보딩 데이터가 없을 수 있음)
        }
      }
      
      // 고급 템플릿 사용
      if (useAdvancedTemplate && dashboardData) {
        const pdf = await generateAdvancedPDF({
          title: '마케팅 진단 리포트',
          companyName,
          data: dashboardData,
          includeCharts: true,
          language: 'ko'
        })
        
        const fileName = `${companyName}_마케팅진단리포트_${new Date().toISOString().split('T')[0]}.pdf`
        pdf.save(fileName)
        setIsExporting(false)
        return
      }
      
      // 기본 템플릿 (기존 방식)
      const html2canvas = (await import('html2canvas')).default
      const jsPDF = (await import('jspdf')).default
      
      // 대시보드 컨테이너 선택 (여러 가능한 ID 시도)
      let element = document.getElementById('dashboard-container') 
        || document.querySelector('main')
        || document.querySelector('.dashboard-content')
        || document.body
      
      if (!element) {
        throw new Error('대시보드 컨테이너를 찾을 수 없습니다.')
      }
      
      // 캔버스 생성
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      })
      
      const imgData = canvas.toDataURL('image/png')
      
      // PDF 생성
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 297 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      
      let position = 0
      
      // 첫 페이지
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
      
      // 여러 페이지 처리
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }
      
      // PDF 다운로드
      const fileName = `${companyName}_마케팅진단리포트_${new Date().toISOString().split('T')[0]}.pdf`
      pdf.save(fileName)
      
      setIsExporting(false)
    } catch (error) {
      console.error('PDF 생성 실패:', error)
      alert('PDF 생성에 실패했습니다. 다시 시도해주세요.')
      setIsExporting(false)
    }
  }

  return (
    <div>
      {validationError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">데이터 부족</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{validationError}</p>
                <p className="mt-2">
                  온보딩 대시보드에서 필수 데이터를 수령해주세요.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <button
        onClick={exportToPDF}
        disabled={isExporting || !!validationError}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
      {isExporting ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>생성 중...</span>
        </>
      ) : (
        <>
          <FileText className="w-4 h-4" />
          <span>PDF 리포트 다운로드</span>
        </>
      )}
      </button>
    </div>
  )
}
