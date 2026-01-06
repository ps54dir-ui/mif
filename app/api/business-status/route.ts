/**
 * 사업자 상태 조회 API
 * Next.js App Router Route Handler
 * 
 * 방어적 프로그래밍 원칙 적용:
 * 1. 모든 입력값 null/undefined/빈 값 체크
 * 2. 외부 API 실패 시 fallback
 * 3. TypeScript 타입 안정성 보장
 * 4. 각 실패 시나리오에 대한 방어 코드
 */

import { NextRequest, NextResponse } from 'next/server'

// ============================================================================
// 타입 정의
// ============================================================================

interface BusinessStatusResponse {
  status: '계속' | '휴업' | '폐업'
  checkedAt: string
}

interface ErrorResponse {
  error: true
  message: string
  code?: string
}

type ApiResponse = BusinessStatusResponse | ErrorResponse

interface ValidationResult {
  isValid: boolean
  cleanNumber?: string
  error?: string
  errorCode?: string
}

// ============================================================================
// 상수 정의
// ============================================================================

const BUSINESS_NUMBER_LENGTH = 10
const MOCK_MODE = process.env.BUSINESS_STATUS_MOCK_MODE !== 'false' // 기본값: true

// ============================================================================
// 입력 검증 함수 (방어적)
// ============================================================================

/**
 * 사업자등록번호 검증
 * 
 * 처리하는 케이스:
 * - null/undefined/빈 값
 * - 문자열이 아닌 타입
 * - 하이픈 포함/미포함
 * - 길이 검증
 * - 숫자만 허용
 */
function validateBusinessNumber(input: unknown): ValidationResult {
  // 시나리오 1: null/undefined 처리
  if (input == null) {
    return {
      isValid: false,
      error: '사업자등록번호가 필요합니다.',
      errorCode: 'REQUIRED'
    }
  }

  // 시나리오 2: 타입 검증
  if (typeof input !== 'string') {
    return {
      isValid: false,
      error: '사업자등록번호는 문자열이어야 합니다.',
      errorCode: 'INVALID_TYPE'
    }
  }

  // 시나리오 3: 빈 문자열 처리
  const trimmed = input.trim()
  if (trimmed.length === 0) {
    return {
      isValid: false,
      error: '사업자등록번호가 비어있습니다.',
      errorCode: 'EMPTY'
    }
  }

  // 하이픈 제거
  const clean = trimmed.replace(/[-\s]/g, '')

  // 시나리오 4: 길이 검증
  if (clean.length !== BUSINESS_NUMBER_LENGTH) {
    return {
      isValid: false,
      error: `사업자등록번호는 ${BUSINESS_NUMBER_LENGTH}자리 숫자여야 합니다. (입력: ${clean.length}자리)`,
      errorCode: 'INVALID_LENGTH'
    }
  }

  // 시나리오 5: 숫자만 허용
  if (!/^\d+$/.test(clean)) {
    return {
      isValid: false,
      error: '사업자등록번호는 숫자만 입력할 수 있습니다.',
      errorCode: 'INVALID_FORMAT'
    }
  }

  return {
    isValid: true,
    cleanNumber: clean
  }
}

// ============================================================================
// MOCK 응답 생성 (항상 성공 보장)
// ============================================================================

/**
 * MOCK 응답 생성
 * 외부 의존성 없이 항상 성공하는 응답
 */
function createMockResponse(): BusinessStatusResponse {
  return {
    status: '계속',
    checkedAt: new Date().toISOString()
  }
}

// ============================================================================
// 안전한 요청 본문 파싱
// ============================================================================

/**
 * 요청 본문 파싱 (방어적)
 * 
 * 처리하는 케이스:
 * - JSON 파싱 실패
 * - 요청 본문 없음
 * - 잘못된 JSON 형식
 */
async function parseRequestBody(request: NextRequest): Promise<Record<string, unknown>> {
  try {
    const body = await request.json()
    
    // body가 null/undefined인 경우 빈 객체 반환
    if (body == null || typeof body !== 'object' || Array.isArray(body)) {
      return {}
    }
    
    return body as Record<string, unknown>
  } catch (error) {
    // JSON 파싱 실패 시 빈 객체 반환 (검증 단계에서 에러 처리)
    console.warn('Request body parse failed:', error)
    return {}
  }
}

// ============================================================================
// 에러 응답 생성 헬퍼
// ============================================================================

function createErrorResponse(
  message: string,
  status: number = 400,
  code?: string
): NextResponse<ErrorResponse> {
  const response: ErrorResponse = {
    error: true,
    message
  }
  
  if (code) {
    response.code = code
  }
  
  return NextResponse.json(response, { status })
}

// ============================================================================
// 성공 응답 생성 헬퍼
// ============================================================================

function createSuccessResponse(data: BusinessStatusResponse): NextResponse<BusinessStatusResponse> {
  return NextResponse.json(data)
}

// ============================================================================
// 메인 POST 핸들러
// ============================================================================

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    // Step 1: 요청 본문 파싱 (시나리오 1 방어: JSON 파싱 실패)
    const body = await parseRequestBody(request)
    
    // Step 2: 입력값 추출 및 null 체크
    const businessNumber = body.businessNumber
    
    // Step 3: 입력 검증 (모든 엣지 케이스 처리)
    const validation = validateBusinessNumber(businessNumber)
    
    if (!validation.isValid) {
      return createErrorResponse(
        validation.error || '입력값 검증 실패',
        400,
        validation.errorCode
      )
    }

    // validation.cleanNumber는 이 시점에서 반드시 존재함 (타입 가드)
    const cleanNumber = validation.cleanNumber!

    // Step 4: MOCK 모드 처리 (환경변수 없어도 동작 보장)
    // 외부 API나 캐시 실패와 관계없이 항상 응답 가능
    if (MOCK_MODE || !process.env.NTS_SERVICE_KEY) {
      const mockResponse = createMockResponse()
      return createSuccessResponse(mockResponse)
    }

    // TODO: 향후 캐시 및 실제 API 연동 시 아래 로직 추가
    // Step 5: 캐시 조회 (실패해도 계속 진행)
    // Step 6: 국세청 API 호출 (실패 시 MOCK 응답)

    // 현재는 MOCK 응답만 반환
    const response = createMockResponse()
    return createSuccessResponse(response)

  } catch (error: unknown) {
    // 예상치 못한 모든 에러 처리 (최후의 방어선)
    console.error('Unexpected API error:', error)
    
    // 에러 타입에 따른 처리
    let errorMessage = '상태 조회 중 오류가 발생했습니다.'
    let errorCode = 'UNKNOWN_ERROR'
    
    if (error instanceof Error) {
      errorMessage = error.message || errorMessage
      errorCode = error.name || errorCode
    }
    
    // 심각한 에러 발생 시에도 MOCK 응답으로 서비스 지속성 보장
    // (선택: 에러 반환 vs MOCK 응답)
    // 여기서는 명확한 에러 반환을 선택
    return createErrorResponse(errorMessage, 500, errorCode)
  }
}

// ============================================================================
// GET 핸들러 (방어적)
// ============================================================================

export async function GET(): Promise<NextResponse<ErrorResponse>> {
  return createErrorResponse('POST 메서드만 지원합니다.', 405, 'METHOD_NOT_ALLOWED')
}

// ============================================================================
// 이 코드의 취약점 (자기 비판)
// ============================================================================

/*
## 취약점 분석

### 1. 타입 안정성
- ✅ any 타입 제거 완료
- ✅ 모든 반환 타입 명시
- ⚠️ validation.cleanNumber에 non-null assertion 사용 (!) - 타입 가드로 안전하지만, 향후 리팩토링 시 주의 필요

### 2. 에러 처리
- ✅ 모든 단계에서 try-catch
- ✅ 각 시나리오별 명확한 에러 코드
- ⚠️ 최종 catch에서 에러 반환 vs MOCK 응답 선택이 명확하지 않음 (비즈니스 요구사항에 따라 결정 필요)

### 3. 로깅
- ✅ 에러 로깅 포함
- ⚠️ 성공 케이스 로깅 없음 (모니터링을 위해 필요할 수 있음)
- ⚠️ 구조화된 로깅 없음 (추적을 위한 requestId 등)

### 4. 성능
- ✅ MOCK 응답으로 빠른 응답 보장
- ⚠️ 향후 캐시 추가 시 동시성 제어 필요 (race condition 가능)
- ⚠️ 입력 검증만으로는 요청 제한 없음 (DDoS 취약)

### 5. 보안
- ✅ 입력 검증 포함
- ⚠️ 요청 크기 제한 없음 (큰 JSON 요청 가능)
- ⚠️ Rate limiting 없음
- ⚠️ CORS 설정 없음 (다른 도메인에서 호출 가능)

### 6. 확장성
- ⚠️ 캐시 로직이 TODO로 남아있음 (실제 사용 시 추가 필요)
- ⚠️ 실제 국세청 API 연동 로직 없음
- ⚠️ 환경변수 검증이 런타임에만 수행 (빌드 타임 검증 없음)

### 7. 테스트 가능성
- ✅ 함수들이 분리되어 있어 테스트 용이
- ⚠️ 단위 테스트 없음
- ⚠️ 통합 테스트 시나리오 문서화 없음

### 개선 제안
1. 로깅: 구조화된 로깅 추가 (winston, pino 등)
2. 보안: Rate limiting 미들웨어 추가
3. 모니터링: 메트릭 수집 (응답 시간, 에러율 등)
4. 테스트: 단위 테스트 및 통합 테스트 작성
5. 문서화: API 문서 자동 생성 (OpenAPI/Swagger)
*/
