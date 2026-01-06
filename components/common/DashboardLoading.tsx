'use client'

/**
 * 대시보드 로딩 애니메이션 컴포넌트
 * 멋진 로딩 효과를 제공합니다
 */
export function DashboardLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="text-center">
        {/* 메인 로딩 스피너 */}
        <div className="relative inline-block mb-8">
          {/* 외부 회전 링 */}
          <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          
          {/* 내부 회전 링 (반대 방향) */}
          <div className="absolute top-2 left-2 w-16 h-16 border-4 border-purple-200 border-b-purple-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
          
          {/* 중심 점 */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-600 rounded-full"></div>
        </div>

        {/* 로딩 텍스트 */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-800 animate-pulse">
            마케팅 진단 데이터 로딩 중
          </h2>
          <p className="text-gray-600">
            <span className="inline-block animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
            <span className="inline-block animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
            <span className="inline-block animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
          </p>
        </div>

        {/* 진행 바 */}
        <div className="mt-8 w-64 mx-auto">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full animate-[loading_2s_ease-in-out_infinite]"></div>
          </div>
        </div>

        {/* 추가 애니메이션 요소 */}
        <div className="mt-8 flex justify-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
        </div>
      </div>

    </div>
  )
}

/**
 * 간단한 로딩 스피너 (작은 영역용)
 */
export function SimpleLoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    </div>
  )
}
