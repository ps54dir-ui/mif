/**
 * jsPDF 고급 템플릿
 * 차트, 이미지, 고급 스타일링 지원
 */

import jsPDF from 'jspdf'
import type { DashboardData } from '@/lib/api/dashboardApi'

interface AdvancedPDFOptions {
  title: string
  companyName: string
  data: DashboardData
  includeCharts?: boolean
  language?: 'ko' | 'en'
}

/**
 * 고급 PDF 생성
 */
export async function generateAdvancedPDF(options: AdvancedPDFOptions): Promise<jsPDF> {
  const { title, companyName, data, includeCharts = false, language = 'ko' } = options

  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 20
  let yPosition = margin

  // 헤더
  pdf.setFillColor(59, 130, 246) // blue-500
  pdf.rect(0, 0, pageWidth, 40, 'F')
  
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text(title, pageWidth / 2, 20, { align: 'center' })
  
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'normal')
  pdf.text(companyName, pageWidth / 2, 30, { align: 'center' })

  yPosition = 50

  // 종합 점수 섹션
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(18)
  pdf.setFont('helvetica', 'bold')
  pdf.text(language === 'ko' ? '종합 진단 점수' : 'Overall Score', margin, yPosition)
  
  yPosition += 10
  pdf.setFontSize(48)
  pdf.setTextColor(59, 130, 246)
  pdf.text(`${data.overallScore}`, margin, yPosition)
  
  pdf.setFontSize(14)
  pdf.setTextColor(100, 100, 100)
  pdf.text('/ 100', margin + 50, yPosition - 5)

  yPosition += 20

  // 4대 축 분석
  pdf.setFontSize(16)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(0, 0, 0)
  pdf.text(language === 'ko' ? '4대 축 분석' : 'Four Axes Analysis', margin, yPosition)
  
  yPosition += 10
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'normal')

  const axes = [
    { name: language === 'ko' ? '유입' : 'Inflow', score: data.fourAxes.inflow },
    { name: language === 'ko' ? '설득' : 'Persuasion', score: data.fourAxes.persuasion },
    { name: language === 'ko' ? '신뢰' : 'Trust', score: data.fourAxes.trust },
    { name: language === 'ko' ? '순환' : 'Circulation', score: data.fourAxes.circulation },
  ]

  axes.forEach((axis, index) => {
    const xPos = margin + (index % 2) * 90
    const yPos = yPosition + Math.floor(index / 2) * 15

    pdf.text(`${axis.name}:`, xPos, yPos)
    pdf.setFont('helvetica', 'bold')
    pdf.text(`${axis.score}점`, xPos + 30, yPos)
    pdf.setFont('helvetica', 'normal')

    // 진행 바 (간단한 시각화)
    const barWidth = 40
    const barHeight = 3
    const barX = xPos + 40
    const barY = yPos - 2
    
    pdf.setFillColor(200, 200, 200)
    pdf.rect(barX, barY, barWidth, barHeight, 'F')
    
    pdf.setFillColor(59, 130, 246)
    pdf.rect(barX, barY, (barWidth * axis.score) / 100, barHeight, 'F')
  })

  yPosition += 30

  // ICE Score 우선순위
  if (data.icePriorities && data.icePriorities.length > 0) {
    if (yPosition > pageHeight - 40) {
      pdf.addPage()
      yPosition = margin
    }

    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.text(language === 'ko' ? 'ICE Score 우선순위' : 'ICE Score Priorities', margin, yPosition)
    
    yPosition += 10
    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'normal')

    data.icePriorities.slice(0, 5).forEach((priority, index) => {
      if (yPosition > pageHeight - 20) {
        pdf.addPage()
        yPosition = margin
      }

      pdf.text(`${index + 1}. ${priority.strategyName}`, margin, yPosition)
      pdf.setFont('helvetica', 'bold')
      pdf.text(`ICE: ${priority.finalScore.toFixed(1)}`, margin + 80, yPosition)
      pdf.setFont('helvetica', 'normal')
      
      yPosition += 8
    })
  }

  // 페이지 번호
  const totalPages = pdf.internal.pages.length - 1
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i)
    pdf.setFontSize(10)
    pdf.setTextColor(150, 150, 150)
    pdf.text(
      `${i} / ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    )
  }

  return pdf
}

/**
 * 차트를 이미지로 변환하여 PDF에 추가
 */
export async function addChartToPDF(
  pdf: jsPDF,
  chartElement: HTMLElement,
  x: number,
  y: number,
  width: number,
  height: number
): Promise<void> {
  try {
    const html2canvas = (await import('html2canvas')).default
    const canvas = await html2canvas(chartElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    })

    const imgData = canvas.toDataURL('image/png')
    pdf.addImage(imgData, 'PNG', x, y, width, height)
  } catch (error) {
    console.error('차트 추가 실패:', error)
  }
}

/**
 * 다국어 지원 텍스트
 */
export const translations = {
  ko: {
    overallScore: '종합 진단 점수',
    fourAxes: '4대 축 분석',
    icePriorities: 'ICE Score 우선순위',
    page: '페이지',
  },
  en: {
    overallScore: 'Overall Score',
    fourAxes: 'Four Axes Analysis',
    icePriorities: 'ICE Score Priorities',
    page: 'Page',
  },
}
