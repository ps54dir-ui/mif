'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { LogIn, LogOut, User, Menu, X, Trash2, Shield } from 'lucide-react'
import Link from 'next/link'
import { deleteAccount } from '@/lib/api/userDataApi'
import { isAdmin } from '@/lib/auth/auth'

interface UserInfo {
  id: string
  username: string
  email?: string
  is_admin?: boolean
}

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<UserInfo | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = () => {
    if (typeof window === 'undefined') return

    const token = localStorage.getItem('access_token')
    const userStr = localStorage.getItem('user')

    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr)
        setUser(userData)
        setIsLoggedIn(true)
      } catch (error) {
        console.error('사용자 정보 파싱 오류:', error)
        clearAuth()
      }
    } else {
      clearAuth()
    }
  }

  const clearAuth = () => {
    setIsLoggedIn(false)
    setUser(null)
  }

  const handleLogout = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const token = localStorage.getItem('access_token')

      if (token) {
        // 백엔드에 로그아웃 요청 (선택사항)
        try {
          await fetch(`${apiUrl}/api/auth/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
        } catch (error) {
          console.error('로그아웃 API 호출 실패:', error)
          // API 실패해도 로컬 로그아웃은 진행
        }
      }

      // 로컬 스토리지 정리
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      
      clearAuth()
      setShowUserMenu(false)

      // 로그인 페이지로 리다이렉트
      router.push('/login')
    } catch (error) {
      console.error('로그아웃 오류:', error)
      // 오류가 발생해도 로컬 정리는 진행
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      clearAuth()
      router.push('/login')
    }
  }

  const handleLogin = () => {
    router.push('/login')
  }

  const handleDeleteAccount = async () => {
    if (!confirm('정말로 회원탈퇴를 하시겠습니까?\n\n이 작업은 되돌릴 수 없으며, 모든 데이터가 삭제됩니다.')) {
      return
    }

    const confirmText = prompt('확인을 위해 "탈퇴"라고 입력하세요:')
    if (confirmText !== '탈퇴') {
      alert('입력이 올바르지 않습니다.')
      return
    }

    try {
      await deleteAccount()
      
      // 로컬 스토리지 정리
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
      
      clearAuth()
      setShowUserMenu(false)
      
      alert('회원탈퇴가 완료되었습니다.')
      router.push('/login')
    } catch (error) {
      console.error('회원탈퇴 오류:', error)
      alert(error instanceof Error ? error.message : '회원탈퇴 중 오류가 발생했습니다.')
    }
  }

  // 로그인 페이지에서는 헤더를 표시하지 않음
  if (pathname === '/login') {
    return null
  }

  return (
    <header className="sticky top-0 z-[100] w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 로고 및 홈 링크 */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">OS</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                마케팅 OS
              </span>
            </Link>
          </div>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/dashboard"
              className={`text-sm font-medium transition-colors ${
                pathname === '/dashboard'
                  ? 'text-blue-600'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              대시보드
            </Link>
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                pathname === '/'
                  ? 'text-blue-600'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              홈
            </Link>
            {isLoggedIn && isAdmin() && (
              <Link
                href="/admin"
                className={`text-sm font-medium transition-colors flex items-center gap-1 ${
                  pathname === '/admin'
                    ? 'text-purple-600'
                    : 'text-gray-700 hover:text-purple-600'
                }`}
              >
                <Shield className="w-4 h-4" />
                관리자
              </Link>
            )}
          </nav>

          {/* 사용자 메뉴 */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {user?.username || '사용자'}
                  </span>
                </button>

                {/* 사용자 드롭다운 메뉴 */}
                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-[90]"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-[110]">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                        {user?.email && (
                          <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                        )}
                        {user?.is_admin && (
                          <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded">
                            관리자
                          </span>
                        )}
                      </div>
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        대시보드
                      </Link>
                      {user?.is_admin && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 flex items-center gap-2"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Shield className="w-4 h-4" />
                          관리자 페이지
                        </Link>
                      )}
                      <Link
                        href="/settings/password"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        비밀번호 변경
                      </Link>
                      <div className="border-t border-gray-200 my-1"></div>
                      <button
                        onClick={handleDeleteAccount}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>회원탈퇴</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>로그아웃</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-sm hover:shadow-md"
              >
                <LogIn className="w-4 h-4" />
                <span className="text-sm font-medium">로그인</span>
              </button>
            )}

            {/* 모바일 메뉴 버튼 */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {showMobileMenu ? (
                <X className="w-5 h-5 text-gray-700" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-2">
              <Link
                href="/dashboard"
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  pathname === '/dashboard'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setShowMobileMenu(false)}
              >
                대시보드
              </Link>
              <Link
                href="/"
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  pathname === '/'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setShowMobileMenu(false)}
              >
                홈
              </Link>
              {isLoggedIn && isAdmin() && (
                <Link
                  href="/admin"
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                    pathname === '/admin'
                      ? 'bg-purple-50 text-purple-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Shield className="w-4 h-4" />
                  관리자
                </Link>
              )}
              {isLoggedIn && (
                <button
                  onClick={() => {
                    handleLogout()
                    setShowMobileMenu(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>로그아웃</span>
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
