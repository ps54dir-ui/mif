'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users, FileText, Building2, BarChart3, 
  Eye, EyeOff, Search, Download, Calendar,
  TrendingUp, User as UserIcon, AlertCircle, Trash2
} from 'lucide-react'
import { getAllUsers, getUserReports, getAdminStatistics, updateUserStatus, getUserReportData, deleteUser } from '@/lib/api/adminApi'
import { isAdmin, isAuthenticated } from '@/lib/auth/auth'
import type { UserSummary, AdminReport, AdminStatistics } from '@/lib/api/adminApi'

export default function AdminDashboardPage() {
  const router = useRouter()
  const [users, setUsers] = useState<UserSummary[]>([])
  const [selectedUser, setSelectedUser] = useState<UserSummary | null>(null)
  const [userReports, setUserReports] = useState<AdminReport[]>([])
  const [statistics, setStatistics] = useState<AdminStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showUserReports, setShowUserReports] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window === 'undefined') return
    setIsMounted(true)
    
    // 관리자 권한 확인
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }
    
    if (!isAdmin()) {
      alert('관리자 권한이 필요합니다.')
      router.push('/dashboard')
      return
    }

    loadData()
  }, [router])

  const loadData = async () => {
    try {
      setLoading(true)
      const [usersData, statsData] = await Promise.all([
        getAllUsers(),
        getAdminStatistics()
      ])
      setUsers(usersData)
      setStatistics(statsData)
    } catch (error) {
      console.error('데이터 로드 오류:', error)
      alert(error instanceof Error ? error.message : '데이터 로드에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleUserClick = async (user: UserSummary) => {
    try {
      setSelectedUser(user)
      const reports = await getUserReports(user.id)
      setUserReports(reports)
      setShowUserReports(true)
    } catch (error) {
      console.error('리포트 로드 오류:', error)
      alert(error instanceof Error ? error.message : '리포트 로드에 실패했습니다.')
    }
  }

  const handleToggleUserStatus = async (user: UserSummary) => {
    if (!confirm(`사용자 "${user.username}"를 ${user.is_active ? '비활성화' : '활성화'}하시겠습니까?`)) {
      return
    }

    try {
      await updateUserStatus(user.id, !user.is_active)
      await loadData() // 목록 새로고침
      if (selectedUser?.id === user.id) {
        setSelectedUser({ ...selectedUser, is_active: !user.is_active })
      }
      alert('사용자 상태가 업데이트되었습니다.')
    } catch (error) {
      console.error('사용자 상태 업데이트 오류:', error)
      alert(error instanceof Error ? error.message : '사용자 상태 업데이트에 실패했습니다.')
    }
  }

  const handleDeleteUser = async (user: UserSummary) => {
    if (user.is_admin) {
      alert('관리자는 삭제할 수 없습니다.')
      return
    }

    if (!confirm(`사용자 "${user.username}"를 정말로 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없으며, 모든 관련 데이터가 삭제됩니다.`)) {
      return
    }

    try {
      await deleteUser(user.id)
      await loadData() // 목록 새로고침
      if (selectedUser?.id === user.id) {
        setShowUserReports(false)
        setSelectedUser(null)
        setUserReports([])
      }
      alert('사용자가 삭제되었습니다.')
    } catch (error) {
      console.error('사용자 삭제 오류:', error)
      alert(error instanceof Error ? error.message : '사용자 삭제에 실패했습니다.')
    }
  }

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!isMounted || loading) {
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">관리자 대시보드</h1>
          <p className="text-gray-600">모든 사용자 데이터 조회 및 관리</p>
        </div>

        {/* 통계 카드 */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">전체 사용자</p>
                  <p className="text-3xl font-bold text-gray-900">{statistics.total_users}</p>
                  <p className="text-xs text-green-600 mt-1">활성: {statistics.active_users}</p>
                </div>
                <Users className="w-12 h-12 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">전체 리포트</p>
                  <p className="text-3xl font-bold text-gray-900">{statistics.total_reports}</p>
                </div>
                <FileText className="w-12 h-12 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">전체 회사</p>
                  <p className="text-3xl font-bold text-gray-900">{statistics.total_companies}</p>
                </div>
                <Building2 className="w-12 h-12 text-purple-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">최근 리포트</p>
                  <p className="text-3xl font-bold text-gray-900">{statistics.recent_reports.length}</p>
                </div>
                <TrendingUp className="w-12 h-12 text-orange-600" />
              </div>
            </div>
          </div>
        )}

        {/* 리포트 타입별 통계 */}
        {statistics && statistics.reports_by_type && Object.keys(statistics.reports_by_type).length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">리포트 타입별 통계</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(statistics.reports_by_type).map(([type, count]) => (
                <div key={type} className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">
                    {type === 'initial' ? '초회 진단' :
                     type === 'consulting_effect' ? '컨설팅 효과' :
                     type === 'comparison' ? '비교 리포트' : type}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 사용자 목록 */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">사용자 목록</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="사용자명 또는 이메일 검색..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">사용자</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">리포트</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">회사</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">가입일</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작업</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <UserIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.username}</div>
                          <div className="text-sm text-gray-500">{user.email || '-'}</div>
                          {user.is_admin && (
                            <span className="inline-block mt-1 px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-800 rounded">
                              관리자
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.report_count}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.company_count}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.is_active ? '활성' : '비활성'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleUserClick(user)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        리포트 보기
                      </button>
                      <button
                        onClick={() => handleToggleUserStatus(user)}
                        className={`${user.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                        title={user.is_active ? '비활성화' : '활성화'}
                      >
                        {user.is_active ? <EyeOff className="w-4 h-4 inline" /> : <Eye className="w-4 h-4 inline" />}
                      </button>
                      {!user.is_admin && (
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="text-red-600 hover:text-red-900"
                          title="사용자 삭제"
                        >
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 사용자 리포트 모달 */}
        {showUserReports && selectedUser && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedUser.username}의 리포트</h3>
                  <p className="text-sm text-gray-600 mt-1">총 {userReports.length}개의 리포트</p>
                </div>
                <button
                  onClick={() => {
                    setShowUserReports(false)
                    setSelectedUser(null)
                    setUserReports([])
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>
              
              <div className="p-6">
                {userReports.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    리포트가 없습니다.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userReports.map((report) => (
                      <div
                        key={report.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                v{report.version}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                report.report_type === 'initial'
                                  ? 'bg-green-100 text-green-700'
                                  : report.report_type === 'consulting_effect'
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'bg-orange-100 text-orange-700'
                              }`}>
                                {report.report_type === 'initial' ? '초회 진단' :
                                 report.report_type === 'consulting_effect' ? '컨설팅 효과' :
                                 report.report_type === 'comparison' ? '비교 리포트' : report.report_type}
                              </span>
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">
                              {report.report_name}
                            </h4>
                            <div className="flex items-center gap-6 text-sm text-gray-600">
                              <span>회사: {report.company_name}</span>
                              <span>발행일: {new Date(report.issued_at).toLocaleDateString('ko-KR')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
