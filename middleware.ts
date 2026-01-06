import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 로그인 페이지와 공개 페이지는 체크하지 않음
  const publicPaths = ['/login', '/']
  const pathname = request.nextUrl.pathname

  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  // 관리자 페이지는 클라이언트에서 체크 (서버에서는 체크하지 않음)
  // 실제로는 클라이언트에서 토큰 확인 후 리다이렉트
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
