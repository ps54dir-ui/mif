'use client'

export const dynamic = 'force-dynamic'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import ClientListTable from '@/components/client-channel/ClientListTable'
import BatchReportUpload from '@/components/batch-report/BatchReportUpload'
import type { ClientMaster, CreateClientRequest } from '@/lib/api/clientMaster'

export default function ClientsManagementPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [clients, setClients] = useState<ClientMaster[]>([])
  const [stats, setStats] = useState<any>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [formData, setFormData] = useState<CreateClientRequest & { manager_contact?: string }>({
    company_name: '',
    manager_name: '',
    contact: '',
    manager_contact: ''
  })

  useEffect(() => {
    // 클라이언트 사이드에서만 마운트
    if (typeof window !== 'undefined') {
      setMounted(true)
    }
  }, [])

  useEffect(() => {
    // URL 쿼리 파라미터에서 회사명 가져오기
    if (mounted && searchParams) {
      const companyName = searchParams.get('company_name')
      if (companyName) {
        // 회사명이 있으면 등록 모달 열고 회사명 입력
        setFormData(prev => ({
          ...prev,
          company_name: decodeURIComponent(companyName)
        }))
        setShowCreateModal(true)
        // URL에서 쿼리 파라미터 제거
        router.replace('/sales/clients')
      }
    }
  }, [mounted, searchParams, router])

  useEffect(() => {
    if (!mounted) return
    loadData()
  }, [mounted])

  const loadData = async () => {
    if (typeof window === 'undefined') return
    
    try {
      setLoading(true)
      // 동적 import로 클라이언트 사이드에서만 로드
      const clientMasterModule = await import('@/lib/api/clientMaster')
      const { getMyClients, getClientStats } = clientMasterModule
      
      const [clientsData, statsData] = await Promise.all([
        getMyClients(),
        getClientStats()
      ])
      setClients(clientsData)
      setStats(statsData)
    } catch (error) {
      console.error('데이터 로드 실패:', error)
      alert('데이터를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault()
    if (typeof window === 'undefined') return
    
    try {
      setCreating(true)
      const clientMasterModule = await import('@/lib/api/clientMaster')
      const { createClient } = clientMasterModule
      
      const submitData: CreateClientRequest = {
        company_name: formData.company_name
      }
      await createClient(submitData)
      setShowCreateModal(false)
      setFormData({
        company_name: '',
        manager_name: '',
        contact: '',
        manager_contact: ''
      })
      await loadData()
      alert('회원사가 등록되었습니다.')
    } catch (error) {
      console.error('회원사 등록 실패:', error)
      alert('회원사 등록에 실패했습니다: ' + (error as Error).message)
    } finally {
      setCreating(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      'Completed': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'None': 'bg-gray-100 text-gray-800',
      'Active': 'bg-blue-100 text-blue-800',
      'Inactive': 'bg-gray-100 text-gray-800',
      'OnHold': 'bg-orange-100 text-orange-800',
      'Lost': 'bg-red-100 text-red-800'
    }
    return styles[status] || styles['None']
  }

  const getGradeBadge = (grade: string) => {
    const styles: Record<string, string> = {
      'A': 'bg-purple-100 text-purple-800 font-bold',
      'B': 'bg-blue-100 text-blue-800 font-bold',
      'C': 'bg-gray-100 text-gray-800 font-bold'
    }
    return styles[grade] || styles['C']
  }

  const getGradeLabel = (grade: string) => {
    const labels: Record<string, string> = {
      'A': 'A (실측)',
      'B': 'B (부분)',
      'C': 'C (추론)'
    }
    return labels[grade] || grade
  }

  // 서버 사이드에서는 로딩 화면만 표시
  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 text-white mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">회원사 관리 대시보드</h1>
              <p className="text-blue-100">담당 회원사 목록 및 온보딩 상태 관리</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              + 신규 업체 등록
            </button>
          </div>
        </div>

        {/* 통계 카드 */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-sm text-gray-600 mb-1">전체 회원사</div>
              <div className="text-2xl font-bold text-gray-900">{stats.total_clients}</div>
            </div>
            <div className="bg-green-50 rounded-lg border border-green-200 p-4">
              <div className="text-sm text-gray-600 mb-1">활성 회원사</div>
              <div className="text-2xl font-bold text-green-600">{stats.active_clients}</div>
            </div>
          </div>
        )}

        {/* 배치 리포트 업로드 */}
        <BatchReportUpload onSuccess={loadData} />

        {/* 회원사 목록 테이블 */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">담당 회원사 목록</h2>
        </div>
        <ClientListTable clients={clients} onUpdate={loadData} />

        {/* 신규 업체 등록 모달 */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]" onClick={() => setShowCreateModal(false)}>
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto z-[10000]" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">신규 업체 등록</h2>
              </div>
              
              <form onSubmit={handleCreateClient} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      업체명 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.company_name}
                      onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="회사명을 입력하세요"
                      autoFocus
                    />
                  </div>
                  
                    <p className="mt-1 text-sm text-gray-500">
                      나머지 정보는 담당 회원사 목록에서 편집할 수 있습니다.
                    </p>
                </div>
                
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {creating ? '등록 중...' : '등록'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
