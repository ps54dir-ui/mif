'use client'

export const dynamic = 'force-dynamic'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface BatchResult {
  total: number
  succeeded: number
  failed: number
  results: Array<{
    row: number
    company_name: string
    status: 'success' | 'failed'
    pdf_filename?: string
    error?: string
  }>
  zip_file_id?: string
}

export default function BatchResultPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [result, setResult] = useState<BatchResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    // URL에서 결과 데이터 가져오기 (또는 sessionStorage에서)
    const resultData = sessionStorage.getItem('batch_report_result')
    if (resultData) {
      try {
        setResult(JSON.parse(resultData))
      } catch (error) {
        console.error('결과 데이터 파싱 실패:', error)
      }
    }
    setLoading(false)
  }, [])

  const handleDownloadZip = async () => {
    if (!result?.zip_file_id) {
      alert('다운로드할 파일이 없습니다.')
      return
    }

    try {
      setDownloading(true)
      const token = localStorage.getItem('access_token')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

      const response = await fetch(`${apiUrl}/api/batch-report/download-zip/${result.zip_file_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('ZIP 파일 다운로드 실패')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `배치리포트_${result.zip_file_id}.zip`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('ZIP 다운로드 실패:', error)
      alert('ZIP 파일 다운로드에 실패했습니다: ' + (error as Error).message)
    } finally {
      setDownloading(false)
    }
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

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">결과 데이터를 찾을 수 없습니다.</p>
          <Link
            href="/sales/clients"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            회원사 관리로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  const successResults = result.results.filter(r => r.status === 'success')
  const failedResults = result.results.filter(r => r.status === 'failed')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 text-white mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">배치 리포트 생성 결과</h1>
              <p className="text-blue-100">업로드된 파일 처리 결과</p>
            </div>
            <Link
              href="/sales/clients"
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              ← 목록으로
            </Link>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-1">전체 업체</div>
            <div className="text-3xl font-bold text-gray-900">{result.total}</div>
          </div>
          <div className="bg-green-50 rounded-lg border border-green-200 p-6">
            <div className="text-sm text-gray-600 mb-1">성공</div>
            <div className="text-3xl font-bold text-green-600">{result.succeeded}</div>
          </div>
          <div className="bg-red-50 rounded-lg border border-red-200 p-6">
            <div className="text-sm text-gray-600 mb-1">실패</div>
            <div className="text-3xl font-bold text-red-600">{result.failed}</div>
          </div>
        </div>

        {/* 다운로드 버튼 */}
        {result.succeeded > 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">리포트 다운로드</h2>
                <p className="text-sm text-gray-600">
                  {result.succeeded}개의 리포트가 생성되었습니다. ZIP 파일로 다운로드하세요.
                </p>
              </div>
              <button
                onClick={handleDownloadZip}
                disabled={downloading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {downloading ? (
                  <>
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    다운로드 중...
                  </>
                ) : (
                  '📦 ZIP 파일 다운로드'
                )}
              </button>
            </div>
          </div>
        )}

        {/* 성공한 업체 목록 */}
        {successResults.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              ✅ 성공한 업체 ({successResults.length}개)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">행 번호</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">업체명</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">파일명</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {successResults.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.row}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{item.company_name}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          성공
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.pdf_filename || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 실패한 업체 목록 */}
        {failedResults.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              ❌ 실패한 업체 ({failedResults.length}개)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">행 번호</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">업체명</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">오류 메시지</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {failedResults.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.row}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{item.company_name || '-'}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                          실패
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-red-600">{item.error || '알 수 없는 오류'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 액션 버튼 */}
        <div className="mt-6 flex justify-center gap-4">
          <Link
            href="/sales/clients"
            className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            회원사 관리로 돌아가기
          </Link>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            다시 업로드
          </button>
        </div>
      </div>
    </div>
  )
}
