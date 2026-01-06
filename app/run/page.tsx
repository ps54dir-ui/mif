'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth/auth'

/**
 * MIF 모바일 실행 페이지
 * 
 * 고정 URL: https://run.mif.co
 * 
 * 로그인 상태에 따른 자동 분기:
 * - 로그인됨 → MIF 실행 화면 (회사 검색)
 * - 비로그인 → 로그인 페이지로 리다이렉트
 */
export default function RunPage() {
  const router = useRouter()

  useEffect(() => {
    // 로그인 상태 확인
    const authenticated = isAuthenticated()

    if (authenticated) {
      // 로그인됨 → MIF 실행 화면 (회사 검색 페이지)
      router.replace('/company-search')
    } else {
      // 비로그인 → 로그인 페이지로 리다이렉트 (리다이렉트 URL 포함)
      router.replace('/login?redirect=/run')
    }
  }, [router])

  // 리다이렉트 중 로딩 표시
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">로딩 중...</p>
      </div>
    </div>
  )
}
