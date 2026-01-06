'use client'

import React, { useState, useRef } from 'react'

interface BatchReportUploadProps {
  onSuccess?: () => void
}

export default function BatchReportUpload({ onSuccess }: BatchReportUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [statusMessage, setStatusMessage] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // 파일 형식 검증
    const validExtensions = ['.xlsx', '.xls', '.csv']
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    
    if (!validExtensions.includes(fileExtension)) {
      setError('엑셀(.xlsx, .xls) 또는 CSV(.csv) 파일만 업로드 가능합니다.')
      setSelectedFile(null)
      return
    }

    setError(null)
    setSelectedFile(file)
    setUploadedFileName(file.name)
  }

  const handleUpload = async (file: File) => {
    try {
      setUploading(true)
      setError(null)
      setUploadProgress(0)
      setUploadedFileName(file.name)
      setStatusMessage('파일 업로드 중...')

      const formData = new FormData()
      formData.append('file', file)

      const token = localStorage.getItem('access_token')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

      // 진행률 시뮬레이션 (업로드 단계)
      setUploadProgress(20)
      setStatusMessage('파일 업로드 중...')

      const response = await fetch(`${apiUrl}/api/batch-report/upload-and-generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      setUploadProgress(50)
      setStatusMessage('파일 처리 중...')

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = '배치 리포트 생성에 실패했습니다.'
        
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.detail || errorMessage
        } catch {
          errorMessage = errorText || errorMessage
        }
        
        throw new Error(errorMessage)
      }

      setUploadProgress(70)
      setStatusMessage('리포트 생성 중...')

      // JSON 응답 받기
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.message || '배치 리포트 생성에 실패했습니다.')
      }

      setUploadProgress(90)
      setStatusMessage('완료 처리 중...')

      // 결과를 sessionStorage에 저장
      sessionStorage.setItem('batch_report_result', JSON.stringify(result))
      
      setUploadProgress(100)
      setStatusMessage(`✅ 완료! ${result.succeeded}개 리포트 생성됨`)

      // 성공 메시지 표시 후 결과 페이지로 이동
      setTimeout(() => {
        window.location.href = '/sales/clients/batch-result'
      }, 1500)

      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('배치 리포트 업로드 실패:', error)
      const errorMessage = error instanceof Error ? error.message : '배치 리포트 생성에 실패했습니다.'
      setError(errorMessage)
      setStatusMessage('')
      setUploadedFileName(null)
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleDownloadTemplate = async () => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        alert('로그인이 필요합니다. 다시 로그인해주세요.')
        return
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const url = `${apiUrl}/api/batch-report/template`

      console.log('템플릿 다운로드 시작:', url)

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        },
        credentials: 'include'
      })

      console.log('응답 상태:', response.status, response.statusText)
      console.log('Content-Type:', response.headers.get('Content-Type'))
      console.log('Content-Length:', response.headers.get('Content-Length'))

      if (!response.ok) {
        let errorMessage = '템플릿 다운로드에 실패했습니다.'
        
        try {
          const errorText = await response.text()
          console.error('에러 응답:', errorText)
          
          try {
            const errorData = JSON.parse(errorText)
            errorMessage = errorData.detail || errorData.message || errorMessage
          } catch {
            errorMessage = errorText || errorMessage
          }
        } catch (parseError) {
          console.error('에러 파싱 실패:', parseError)
          errorMessage = `서버 오류 (${response.status}): ${response.statusText}`
        }
        
        throw new Error(errorMessage)
      }

      const blob = await response.blob()
      console.log('Blob 생성 완료:', blob.size, 'bytes', blob.type)
      
      if (blob.size === 0) {
        throw new Error('다운로드된 파일이 비어있습니다.')
      }

      // 파일명 추출 (Content-Disposition 헤더에서)
      let filename = '배치리포트_템플릿.xlsx'
      const contentDisposition = response.headers.get('Content-Disposition')
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '')
        }
      }
      
      // 다운로드 실행
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      
      // 정리
      setTimeout(() => {
        document.body.removeChild(link)
        window.URL.revokeObjectURL(downloadUrl)
      }, 100)

      console.log('템플릿 다운로드 완료:', filename)
    } catch (error) {
      console.error('템플릿 다운로드 실패:', error)
      const errorMessage = error instanceof Error ? error.message : '템플릿 다운로드에 실패했습니다.'
      
      let fullMessage = `템플릿 다운로드에 실패했습니다.\n\n${errorMessage}`
      
      if (errorMessage.includes('401') || errorMessage.includes('인증')) {
        fullMessage += '\n\n로그인이 필요합니다. 페이지를 새로고침하고 다시 로그인해주세요.'
      } else if (errorMessage.includes('500') || errorMessage.includes('서버')) {
        fullMessage += '\n\n백엔드 서버가 실행 중인지 확인하고, openpyxl 패키지가 설치되어 있는지 확인해주세요.'
      }
      
      alert(fullMessage)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">📦 배치 리포트 생성</h2>
          <p className="text-sm text-gray-600">
            엑셀/CSV 파일을 업로드하여 여러 업체의 리포트를 한꺼번에 생성할 수 있습니다.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* 템플릿 다운로드 */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleDownloadTemplate}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            📥 템플릿 다운로드
          </button>
          <p className="text-xs text-gray-500">
            템플릿을 다운로드하여 업체 정보를 입력한 후 업로드하세요.
          </p>
        </div>

        {/* 파일 업로드 */}
        <div className={`border-2 border-dashed rounded-lg p-6 transition-all ${
          uploading 
            ? 'border-blue-400 bg-blue-50' 
            : selectedFile && !uploading
            ? 'border-green-400 bg-green-50'
            : 'border-gray-300'
        }`}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
            id="batch-report-file"
          />
          <label
            htmlFor="batch-report-file"
            className={`flex flex-col items-center justify-center cursor-pointer ${
              uploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
            } transition-colors`}
          >
            {selectedFile && !uploading ? (
              <>
                <div className="text-4xl mb-2">📄</div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  파일이 선택되었습니다. 아래 업로드 버튼을 클릭하세요.
                </p>
              </>
            ) : (
              <>
                <div className="text-4xl mb-2">📄</div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  {uploading ? statusMessage || '리포트 생성 중...' : '파일을 선택하거나 드래그하여 업로드'}
                </p>
                <p className="text-xs text-gray-500">
                  엑셀(.xlsx, .xls) 또는 CSV(.csv) 파일
                </p>
              </>
            )}
          </label>

          {/* 선택된 파일이 있을 때 업로드 버튼 표시 */}
          {selectedFile && !uploading && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => handleUpload(selectedFile)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
              >
                📤 업로드 및 리포트 생성
              </button>
            </div>
          )}

          {uploading && (
            <div className="mt-4 w-full">
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2"
                  style={{ width: `${uploadProgress}%` }}
                >
                  {uploadProgress > 20 && (
                    <span className="text-xs text-white font-medium">
                      {uploadProgress}%
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-sm font-medium text-blue-700">
                  {statusMessage || '처리 중...'}
                </p>
                {uploadedFileName && (
                  <p className="text-xs text-gray-500">
                    {uploadedFileName}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* 사용 가이드 */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">📋 파일 형식 가이드</h3>
          <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
            <li><strong>필수 컬럼:</strong> 업체명 (company_name 또는 업체명)</li>
            <li><strong>선택 컬럼:</strong> 담당자명, 연락처, 회사 URL</li>
            <li><strong>상태 컬럼:</strong> GA4 상태, SNS 상태, API 상태 (None/Pending/Completed)</li>
            <li>템플릿을 다운로드하여 형식을 확인하세요.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
