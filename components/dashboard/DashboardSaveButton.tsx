/**
 * 대시보드 저장 버튼
 * 현재 대시보드 데이터를 사용자별로 저장
 */

'use client'

import { useState } from 'react'
import { Save, CheckCircle2, AlertCircle } from 'lucide-react'
import { saveDashboardData } from '@/lib/api/userDataApi'
import { isAuthenticated } from '@/lib/auth/auth'

interface DashboardSaveButtonProps {
  companyName: string
  dashboardData: any
  onSaveSuccess?: () => void
}

export function DashboardSaveButton({ 
  companyName, 
  dashboardData,
  onSaveSuccess 
}: DashboardSaveButtonProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSave = async () => {
    if (!isAuthenticated()) {
      alert('로그인이 필요합니다. 로그인 후 저장할 수 있습니다.')
      return
    }

    setIsSaving(true)
    setSaveStatus('idle')
    setErrorMessage('')

    try {
      await saveDashboardData({
        company_name: companyName,
        dashboard_data: dashboardData
      })
      
      setSaveStatus('success')
      onSaveSuccess?.()
      
      // 3초 후 상태 초기화
      setTimeout(() => {
        setSaveStatus('idle')
      }, 3000)
    } catch (error) {
      setSaveStatus('error')
      setErrorMessage(error instanceof Error ? error.message : '저장에 실패했습니다.')
      
      // 5초 후 상태 초기화
      setTimeout(() => {
        setSaveStatus('idle')
        setErrorMessage('')
      }, 5000)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleSave}
        disabled={isSaving}
        className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
          saveStatus === 'success'
            ? 'bg-green-600 text-white'
            : saveStatus === 'error'
            ? 'bg-red-600 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isSaving ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>저장 중...</span>
          </>
        ) : saveStatus === 'success' ? (
          <>
            <CheckCircle2 className="w-4 h-4" />
            <span>저장 완료</span>
          </>
        ) : saveStatus === 'error' ? (
          <>
            <AlertCircle className="w-4 h-4" />
            <span>저장 실패</span>
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            <span>대시보드 저장</span>
          </>
        )}
      </button>
      
      {errorMessage && (
        <div className="absolute top-full left-0 mt-2 p-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800 max-w-xs z-10">
          {errorMessage}
        </div>
      )}
    </div>
  )
}
