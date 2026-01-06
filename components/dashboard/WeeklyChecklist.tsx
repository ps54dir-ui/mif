'use client'

import { useState, useEffect } from 'react'
import { Download, CheckCircle2 } from './icons'

interface Task {
  task: string
  description?: string
  category: string
  priority: string
  estimated_time: string
  owner: string
  ice_score?: number
}

interface WeeklyChecklistProps {
  brandId: string
}

export function WeeklyChecklist({ brandId }: WeeklyChecklistProps) {
  const [checklist, setChecklist] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    fetchChecklist()
  }, [brandId])

  const fetchChecklist = async () => {
    try {
      // Mock 데이터 사용
      if (typeof window === 'undefined') {
        return
      }
      const urlParams = new URLSearchParams(window.location.search)
      const brandName = urlParams.get('brand_name') || '삼성생명'
      
      const { getMockBrandData } = await import('@/lib/api/mockData')
      const mockData = getMockBrandData(brandName) || getMockBrandData('삼성생명')
      
      if (mockData) {
        setChecklist(mockData.weeklyChecklist)
      } else {
        setChecklist(null)
      }
    } catch (error) {
      console.error('체크리스트 오류:', error)
      // 에러가 발생해도 Mock 데이터 사용
      const { getMockBrandData } = await import('@/lib/api/mockData')
      const mockData = getMockBrandData('삼성생명')
      setChecklist(mockData?.weeklyChecklist || null)
    } finally {
      setLoading(false)
    }
  }

  const downloadPDF = async () => {
    try {
      setDownloading(true)
      
      // Mock 모드에서는 PDF 생성 불가 (백엔드 필요)
      // 대신 체크리스트를 텍스트로 다운로드
      if (!checklist) return
      
      const checklistText = `
이번 주 업무 리스트
기간: ${checklist.week_start} ~ ${checklist.week_end}
총 작업 수: ${checklist.total_tasks}개

${checklist.tasks.map((task: Task, index: number) => `
${index + 1}. ${task.task}
   카테고리: ${task.category}
   우선순위: ${task.priority}
   담당자: ${task.owner}
   예상 시간: ${task.estimated_time}
   ${task.description ? `설명: ${task.description}` : ''}
`).join('\n')}
      `.trim()
      
      const blob = new Blob([checklistText], { type: 'text/plain;charset=utf-8' })
      if (typeof window === 'undefined') {
        return
      }
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `weekly_checklist_${new Date().toISOString().split('T')[0]}.txt`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('체크리스트 다운로드 오류:', error)
      alert('체크리스트 다운로드에 실패했습니다.')
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-4">로딩 중...</div>
  }

  if (!checklist || !checklist.tasks || checklist.tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-gray-500 text-center">이번 주 업무 리스트가 없습니다.</p>
      </div>
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-700 border-red-300'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">이번 주 업무 리스트</h2>
          <p className="text-sm text-gray-600 mt-1">
            {checklist.week_start} ~ {checklist.week_end} | 총 {checklist.total_tasks}개 작업
          </p>
        </div>
        <button
          onClick={downloadPDF}
          disabled={downloading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {downloading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>생성 중...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>PDF 다운로드</span>
            </>
          )}
        </button>
      </div>

      <div className="space-y-4">
        {checklist.tasks.map((task: Task, index: number) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-2 ${getPriorityColor(task.priority)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <h3 className="font-semibold text-gray-900">{task.task}</h3>
                  <span className="text-xs px-2 py-1 bg-white rounded">
                    {task.category}
                  </span>
                </div>
                {task.description && (
                  <p className="text-sm text-gray-700 mb-2 ml-6">{task.description}</p>
                )}
                <div className="flex items-center gap-4 text-xs ml-6">
                  <span>담당자: {task.owner}</span>
                  <span>예상 시간: {task.estimated_time}</span>
                  {task.ice_score && (
                    <span>ICE Score: {task.ice_score.toFixed(1)}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
