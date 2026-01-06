/**
 * 사업자 상태 조회 API - 간단한 버전 (테스트용)
 */

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { businessNumber } = body || {}

    if (!businessNumber || typeof businessNumber !== 'string') {
      return NextResponse.json(
        { error: true, message: '사업자등록번호가 필요합니다.' },
        { status: 400 }
      )
    }

    // 하이픈 제거
    const cleanNumber = businessNumber.replace(/[-\s]/g, '')

    // 10자리 검증
    if (cleanNumber.length !== 10 || !/^\d+$/.test(cleanNumber)) {
      return NextResponse.json(
        { error: true, message: '사업자등록번호는 10자리 숫자여야 합니다.' },
        { status: 400 }
      )
    }

    // MOCK 응답 반환
    return NextResponse.json({
      status: '계속',
      checkedAt: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('API 오류:', error)
    return NextResponse.json(
      { error: true, message: error?.message || '상태 조회 실패' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: true, message: 'POST 메서드만 지원합니다.' },
    { status: 405 }
  )
}
