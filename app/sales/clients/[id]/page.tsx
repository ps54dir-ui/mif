'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  getClientDetail,
  updateClient,
  type ClientMaster,
  type UpdateClientRequest
} from '@/lib/api/clientMaster'
import DataCollectionTable from '@/components/data-collection/DataCollectionTable'
import ClientChannelManagement from '@/components/client-channel/ClientChannelManagement'
import MIFCopilot from '@/components/copilot/MIFCopilot'

export default function ClientDetailPage() {
  const router = useRouter()
  const params = useParams()
  const clientId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [client, setClient] = useState<ClientMaster | null>(null)
  const [updating, setUpdating] = useState(false)
  const [showGuideModal, setShowGuideModal] = useState(false)
  const [guideContent, setGuideContent] = useState<{ subject: string; html_body: string; text_body: string } | null>(null)
  const [loadingGuide, setLoadingGuide] = useState(false)
  const [generatingReport, setGeneratingReport] = useState(false)
  const [localStatus, setLocalStatus] = useState({
    ga4_status: 'None' as 'None' | 'Pending' | 'Completed',
    api_status: 'None' as 'None' | 'Pending' | 'Completed',
    sns_status: 'None' as 'None' | 'Pending' | 'Completed'
  })

  useEffect(() => {
    if (clientId) {
      loadClientDetail()
    }
  }, [clientId])

  const loadClientDetail = async () => {
    try {
      setLoading(true)
      const data = await getClientDetail(clientId)
      setClient(data)
      setLocalStatus({
        ga4_status: data.ga4_status,
        api_status: data.api_status,
        sns_status: data.sns_status
      })
    } catch (error) {
      console.error('회원사 상세 조회 실패:', error)
      alert('회원사 정보를 불러오는데 실패했습니다.')
      router.push('/sales/clients')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (
    field: 'ga4_status' | 'api_status' | 'sns_status',
    value: 'None' | 'Pending' | 'Completed'
  ) => {
    const newStatus = { ...localStatus, [field]: value }
    setLocalStatus(newStatus)
    
    try {
      setUpdating(true)
      const updateData: UpdateClientRequest = {
        [field]: value
      }
      
      const updated = await updateClient(clientId, updateData)
      setClient(updated)
      
      // 성공 메시지
      const statusLabels: Record<string, string> = {
        ga4_status: 'GA4 권한',
        api_status: '확장프로그램',
        sns_status: '수기'
      }
      alert(`${statusLabels[field]} 상태가 업데이트되었습니다.`)
    } catch (error) {
      console.error('상태 업데이트 실패:', error)
      alert('상태 업데이트에 실패했습니다: ' + (error as Error).message)
      // 실패 시 원래 상태로 복구
      if (client) {
        setLocalStatus({
          ga4_status: client.ga4_status,
          api_status: client.api_status,
          sns_status: client.sns_status
        })
      }
    } finally {
      setUpdating(false)
    }
  }

  const handleShowGuide = async () => {
    try {
      setLoadingGuide(true)
      
      // 인증 헤더 가져오기
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access_token')
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }
      }
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/api/guide-template/client/${clientId}`, {
        method: 'GET',
        headers: headers,
        credentials: 'include'
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = '지침서를 불러오는데 실패했습니다.'
        
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.detail || errorData.message || errorMessage
        } catch {
          errorMessage = errorText || errorMessage
        }
        
        throw new Error(`${errorMessage} (상태 코드: ${response.status})`)
      }
      
      const result = await response.json()
      
      if (!result.success || !result.data) {
        throw new Error('지침서 데이터 형식이 올바르지 않습니다.')
      }
      
      setGuideContent(result.data)
      setShowGuideModal(true)
    } catch (error) {
      console.error('지침서 로드 실패:', error)
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      alert(`지침서를 불러오는데 실패했습니다.\n\n${errorMessage}\n\n백엔드 서버가 실행 중인지 확인해주세요.`)
    } finally {
      setLoadingGuide(false)
    }
  }

  const handleCopyGuide = (format: 'html' | 'text') => {
    if (!guideContent) return
    
    const content = format === 'html' ? guideContent.html_body : guideContent.text_body
    navigator.clipboard.writeText(content).then(() => {
      alert('지침서 내용이 클립보드에 복사되었습니다.')
    }).catch(() => {
      alert('복사에 실패했습니다. 내용을 직접 선택하여 복사해주세요.')
    })
  }

  const handleGenerateReport = async () => {
    try {
      setGeneratingReport(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/client-master/${clientId}/generate-report`,
        {
          method: 'POST',
          credentials: 'include',
        }
      )
      
      if (!response.ok) {
        throw new Error('리포트 생성 실패')
      }
      
      // PDF 다운로드
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${client?.company_name || 'report'}_마케팅진단리포트_${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      alert('PDF 리포트가 생성되었습니다.')
    } catch (error) {
      console.error('리포트 생성 실패:', error)
      alert('리포트 생성에 실패했습니다: ' + (error as Error).message)
    } finally {
      setGeneratingReport(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      'Completed': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'None': 'bg-gray-100 text-gray-800'
    }
    return styles[status] || styles['None']
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!client) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 text-white mb-6">
          <div className="flex justify-between items-start">
            <div>
              <button
                onClick={() => router.push('/sales/clients')}
                className="mb-4 text-blue-100 hover:text-white transition-colors"
              >
                ← 목록으로
              </button>
              <h1 
                onClick={() => router.push('/sales/clients')}
                className="text-3xl font-bold mb-2 cursor-pointer hover:underline transition-all"
              >
                {client.company_name}
              </h1>
              <p className="text-blue-100">온보딩 상태 관리</p>
            </div>
            <div className="text-right">
              <div className="mt-4 space-y-2">
                <button
                  onClick={handleShowGuide}
                  disabled={loadingGuide}
                  className="w-full px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loadingGuide ? (
                    <>
                      <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></span>
                      로딩 중...
                    </>
                  ) : (
                    '📋 지침서'
                  )}
                </button>
                <button
                  onClick={handleGenerateReport}
                  disabled={generatingReport}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {generatingReport ? (
                    <>
                      <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      생성 중...
                    </>
                  ) : (
                    '📄 PDF 리포트 생성'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 기본 정보 */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">기본 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">담당자</div>
              <div className="text-lg font-medium text-gray-900">
                {client.manager_name || '-'}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">연락처</div>
              <div className="text-lg font-medium text-gray-900">
                {client.contact || '-'}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">회사 URL</div>
              <div className="text-lg font-medium text-gray-900">
                {client.company_url ? (
                  <a
                    href={client.company_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {client.company_url}
                  </a>
                ) : (
                  '-'
                )}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">상태</div>
              <div className="text-lg font-medium text-gray-900">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${getStatusBadge(
                    client.client_status
                  )}`}
                >
                  {client.client_status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 온보딩 체크리스트 */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">온보딩 체크리스트</h2>
          
          <div className="space-y-6">
            {/* 1순위: GA4 권한 */}
            <div className="border-l-4 border-blue-500 pl-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    1순위: GA4 권한
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Google Analytics 4 접근 권한 수령
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(
                      localStatus.ga4_status
                    )}`}
                  >
                    {localStatus.ga4_status}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="ga4_status"
                    checked={localStatus.ga4_status === 'None'}
                    onChange={() => handleStatusChange('ga4_status', 'None')}
                    disabled={updating}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">None</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="ga4_status"
                    checked={localStatus.ga4_status === 'Pending'}
                    onChange={() => handleStatusChange('ga4_status', 'Pending')}
                    disabled={updating}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Pending</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="ga4_status"
                    checked={localStatus.ga4_status === 'Completed'}
                    onChange={() => handleStatusChange('ga4_status', 'Completed')}
                    disabled={updating}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Completed</span>
                </label>
              </div>
            </div>

            {/* 2순위: 확장프로그램 */}
            <div className="border-l-4 border-green-500 pl-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    2순위: 확장프로그램
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    브라우저 확장 프로그램을 통한 데이터 수집
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(
                      localStatus.api_status
                    )}`}
                  >
                    {localStatus.api_status}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="api_status"
                    checked={localStatus.api_status === 'None'}
                    onChange={() => handleStatusChange('api_status', 'None')}
                    disabled={updating}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">None</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="api_status"
                    checked={localStatus.api_status === 'Pending'}
                    onChange={() => handleStatusChange('api_status', 'Pending')}
                    disabled={updating}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Pending</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="api_status"
                    checked={localStatus.api_status === 'Completed'}
                    onChange={() => handleStatusChange('api_status', 'Completed')}
                    disabled={updating}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Completed</span>
                </label>
              </div>
            </div>

            {/* 3순위: 수기 */}
            <div className="border-l-4 border-purple-500 pl-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    3순위: 수기
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    SNS 데이터 수기 입력
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(
                      localStatus.sns_status
                    )}`}
                  >
                    {localStatus.sns_status}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="sns_status"
                    checked={localStatus.sns_status === 'None'}
                    onChange={() => handleStatusChange('sns_status', 'None')}
                    disabled={updating}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">None</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="sns_status"
                    checked={localStatus.sns_status === 'Pending'}
                    onChange={() => handleStatusChange('sns_status', 'Pending')}
                    disabled={updating}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Pending</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="sns_status"
                    checked={localStatus.sns_status === 'Completed'}
                    onChange={() => handleStatusChange('sns_status', 'Completed')}
                    disabled={updating}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Completed</span>
                </label>
              </div>
            </div>
          </div>

        </div>

        {/* 운영 채널 및 데이터 제공 현황 관리 */}
        <div className="mb-6">
          <ClientChannelManagement clientId={clientId} />
        </div>

        {/* 메모 */}
        {client.notes && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">메모</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{client.notes}</p>
          </div>
        )}

        {/* 지침서 모달 */}
        {showGuideModal && guideContent && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] p-4" 
            onClick={() => setShowGuideModal(false)}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <div 
              className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col z-[10000]" 
              onClick={(e) => e.stopPropagation()}
              style={{ maxHeight: '95vh' }}
            >
              {/* 헤더 */}
              <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <h2 className="text-2xl font-bold">📋 데이터 수집 지침서</h2>
                <button
                  onClick={() => setShowGuideModal(false)}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors text-xl font-bold"
                  aria-label="닫기"
                >
                  ✕
                </button>
              </div>

              {/* 본문 */}
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                {/* 복사 버튼 */}
                <div className="mb-6 flex gap-3 sticky top-0 bg-gray-50 pb-4 z-10">
                  <button
                    onClick={() => handleCopyGuide('html')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md"
                  >
                    📋 HTML 복사
                  </button>
                  <button
                    onClick={() => handleCopyGuide('text')}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold shadow-md"
                  >
                    📋 텍스트 복사
                  </button>
                </div>

                {/* 이메일 제목 */}
                <div className="mb-6 p-4 bg-white rounded-lg border-2 border-blue-200 shadow-sm">
                  <div className="text-sm font-semibold text-gray-700 mb-2">📧 이메일 제목:</div>
                  <div className="text-lg font-medium text-gray-900">{guideContent.subject}</div>
                </div>

                {/* HTML 본문 미리보기 */}
                <div className="mb-6">
                  <div className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <span>🌐 HTML 본문 미리보기:</span>
                    <span className="text-xs text-gray-500">(이메일 클라이언트에서 이 형식으로 표시됩니다)</span>
                  </div>
                  <div 
                    className="border-2 border-gray-300 rounded-lg p-6 bg-white overflow-auto shadow-inner"
                    style={{ 
                      maxHeight: '400px',
                      minHeight: '200px'
                    }}
                    dangerouslySetInnerHTML={{ __html: guideContent.html_body }}
                  />
                </div>

                {/* 텍스트 본문 */}
                <div className="mb-6">
                  <div className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <span>📄 텍스트 본문:</span>
                    <span className="text-xs text-gray-500">(HTML을 지원하지 않는 이메일 클라이언트용)</span>
                  </div>
                  <pre 
                    className="border-2 border-gray-300 rounded-lg p-6 bg-white overflow-auto text-sm whitespace-pre-wrap font-mono shadow-inner"
                    style={{ 
                      maxHeight: '400px',
                      minHeight: '200px'
                    }}
                  >
                    {guideContent.text_body}
                  </pre>
                </div>
              </div>

              {/* 푸터 */}
              <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 mb-1">사용 방법:</p>
                    <p className="text-sm text-gray-600">
                      위의 <strong>&quot;HTML 복사&quot;</strong> 또는 <strong>&quot;텍스트 복사&quot;</strong> 버튼을 클릭하여 지침서 내용을 복사한 후, 
                      이메일 클라이언트에 붙여넣어 고객에게 발송하세요.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MIF Copilot */}
      <MIFCopilot
        companyId={clientId}
        companyName={client?.company_name}
        contextOptions={{
          channels: ['naver', 'ga4'],
          include: ['company_profile', 'kpi_summary', 'issues']
        }}
      />
    </div>
  )
}
