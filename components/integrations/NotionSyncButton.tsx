/**
 * Notion 동기화 버튼 컴포넌트
 * 리포트를 Notion에 자동 동기화
 */

'use client'

import { useState } from 'react'
import { FileText, Loader2, ExternalLink, CheckCircle2 } from 'lucide-react'
import { syncReportToNotion, syncDashboardToNotion, type NotionSyncRequest } from '@/lib/api/integrationsApi'

interface NotionSyncButtonProps {
  type: 'report' | 'dashboard'
  databaseId?: string
  reportId?: string
  pageId?: string
  companyName?: string
  onSyncComplete?: (pageUrl: string) => void
}

export function NotionSyncButton({
  type,
  databaseId,
  reportId,
  pageId,
  companyName = '삼성생명',
  onSyncComplete,
}: NotionSyncButtonProps) {
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState<{ success: boolean; pageUrl?: string; message: string } | null>(null)

  const handleSync = async () => {
    if (!databaseId) {
      alert('Notion Database ID를 입력해주세요.')
      return
    }

    setIsSyncing(true)
    setSyncResult(null)

    try {
      let result
      
      if (type === 'report') {
        const request: NotionSyncRequest = {
          database_id: databaseId,
          report_id: reportId,
          page_id: pageId,
        }
        result = await syncReportToNotion(request)
      } else {
        result = await syncDashboardToNotion(databaseId, companyName)
      }

      setSyncResult(result)
      
      if (result.success && result.page_url) {
        onSyncComplete?.(result.page_url)
      }
    } catch (error) {
      setSyncResult({
        success: false,
        message: error instanceof Error ? error.message : '동기화 실패',
      })
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleSync}
        disabled={isSyncing || !databaseId}
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
      >
        {isSyncing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>동기화 중...</span>
          </>
        ) : (
          <>
            <FileText className="w-4 h-4" />
            <span>Notion에 동기화</span>
          </>
        )}
      </button>

      {syncResult && (
        <div
          className={`flex items-center gap-2 p-3 rounded-lg ${
            syncResult.success
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {syncResult.success ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm">{syncResult.message}</span>
              {syncResult.pageUrl && (
                <a
                  href={syncResult.pageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto flex items-center gap-1 text-sm hover:underline"
                >
                  <span>Notion에서 보기</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </>
          ) : (
            <>
              <span className="text-sm">{syncResult.message}</span>
            </>
          )}
        </div>
      )}
    </div>
  )
}
