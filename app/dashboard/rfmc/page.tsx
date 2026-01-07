'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { RFMCDashboard, RFMCSegmentTable } from '@/components/dashboard'
import { Upload, FileSpreadsheet } from 'lucide-react'

export default function RFMCPage() {
  const searchParams = useSearchParams()
  const brandId = searchParams.get('brand_id') || ''
  const [selectedSegment, setSelectedSegment] = useState<string | undefined>()
  const [showImportModal, setShowImportModal] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)

  if (!brandId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">브랜드 ID가 필요합니다.</p>
          <p className="text-sm text-gray-500">
            URL에 <code className="bg-gray-200 px-2 py-1 rounded">?brand_id=YOUR_BRAND_ID</code>를 추가해주세요.
          </p>
        </div>
      </div>
    )
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImportFile(file)
    }
  }

  const handleImport = async () => {
    if (!importFile) return

    try {
      setImporting(true)
      
      // CSV 파일 읽기 (간단한 파싱)
      const text = await importFile.text()
      const lines = text.split('\n')
      const headers = lines[0].split(',').map(h => h.trim())
      
      const transactions = []
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue
        
        const values = lines[i].split(',').map(v => v.trim())
        const transaction: Record<string, any> = {}
        
        headers.forEach((header, idx) => {
          transaction[header] = values[idx]
        })
        
        // 필수 필드 확인 및 변환
        if (transaction.customer_id && transaction.transaction_date && transaction.transaction_amount) {
          transactions.push({
            customer_id: transaction.customer_id,
            customer_name: transaction.customer_name || null,
            transaction_date: transaction.transaction_date,
            transaction_amount: parseFloat(transaction.transaction_amount) || 0,
            transaction_quantity: parseInt(transaction.transaction_quantity || '1'),
            category: transaction.category || null,
            channel: transaction.channel || null,
            product_id: transaction.product_id || null,
            product_name: transaction.product_name || null,
            payment_method: transaction.payment_method || null,
            status: transaction.status || 'COMPLETED',
            metadata: transaction.metadata ? JSON.parse(transaction.metadata) : null
          })
        }
      }
      
      // API로 전송
      const response = await fetch('http://localhost:8000/api/rfmc/transactions/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand_id: brandId,
          transactions: transactions
        })
      })
      
      if (!response.ok) {
        throw new Error('거래 데이터 가져오기에 실패했습니다.')
      }
      
      const result = await response.json()
      alert(`${result.imported_count}개의 거래가 성공적으로 가져와졌습니다.`)
      setShowImportModal(false)
      setImportFile(null)
      
      // 페이지 새로고침
      window.location.reload()
    } catch (err) {
      alert(err instanceof Error ? err.message : '가져오기 중 오류가 발생했습니다.')
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">RFMC 분석</h1>
              <p className="mt-2 text-sm text-gray-600">
                Recency, Frequency, Monetary, Category/Channel 분석을 통한 고객 세그먼테이션
              </p>
            </div>
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Upload className="h-5 w-5" />
              거래 데이터 가져오기
            </button>
          </div>
        </div>

        {/* RFMC 대시보드 */}
        <div className="mb-8">
          <RFMCDashboard brandId={brandId} />
        </div>

        {/* 세그먼트별 고객 테이블 */}
        <div className="mb-8">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              세그먼트 필터
            </label>
            <select
              value={selectedSegment || ''}
              onChange={(e) => setSelectedSegment(e.target.value || undefined)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">전체 세그먼트</option>
              <option value="CHAMPIONS">CHAMPIONS</option>
              <option value="LOYAL_CUSTOMERS">LOYAL_CUSTOMERS</option>
              <option value="POTENTIAL_LOYALISTS">POTENTIAL_LOYALISTS</option>
              <option value="NEW_CUSTOMERS">NEW_CUSTOMERS</option>
              <option value="PROMISING">PROMISING</option>
              <option value="NEED_ATTENTION">NEED_ATTENTION</option>
              <option value="ABOUT_TO_SLEEP">ABOUT_TO_SLEEP</option>
              <option value="AT_RISK">AT_RISK</option>
              <option value="CANNOT_LOSE_THEM">CANNOT_LOSE_THEM</option>
              <option value="HIBERNATING">HIBERNATING</option>
              <option value="LOST">LOST</option>
            </select>
          </div>
          <RFMCSegmentTable brandId={brandId} segmentName={selectedSegment} />
        </div>

        {/* 가져오기 모달 */}
        {showImportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">거래 데이터 가져오기</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CSV 파일 선택
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="csv-file-input"
                  />
                  <label
                    htmlFor="csv-file-input"
                    className="cursor-pointer text-blue-600 hover:text-blue-700"
                  >
                    {importFile ? importFile.name : '파일 선택'}
                  </label>
                </div>
              </div>

              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">CSV 파일 형식:</p>
                <pre className="text-xs text-gray-600 bg-white p-2 rounded border">
{`customer_id,customer_name,transaction_date,transaction_amount,transaction_quantity,category,channel,product_id,product_name,payment_method,status
customer1,홍길동,2024-01-15T10:00:00Z,50000,1,의류,ONLINE,prod1,상품A,CARD,COMPLETED
customer2,김철수,2024-01-16T14:30:00Z,30000,2,신발,SEO,prod2,상품B,CARD,COMPLETED`}
                </pre>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowImportModal(false)
                    setImportFile(null)
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={importing}
                >
                  취소
                </button>
                <button
                  onClick={handleImport}
                  disabled={!importFile || importing}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {importing ? '가져오는 중...' : '가져오기'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
