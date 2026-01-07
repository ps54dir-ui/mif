/**
 * API 응답 검증 및 정규화 유틸리티
 * Zod를 사용한 타입 안전한 API 응답 처리
 */

import { z } from 'zod'

/**
 * API 응답을 Zod 스키마로 검증하고 정규화
 * 
 * @param response - fetch Response 객체
 * @param schema - Zod 스키마
 * @returns 검증된 데이터
 * @throws ZodError - 검증 실패 시
 */
export async function validateApiResponse<T>(
  response: Response,
  schema: z.ZodSchema<T>
): Promise<T> {
  // HTTP 에러 체크
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`API 요청 실패 (${response.status}): ${errorText}`)
  }

  // JSON 파싱
  let data: unknown
  try {
    data = await response.json()
  } catch (error) {
    throw new Error(`JSON 파싱 실패: ${error instanceof Error ? error.message : String(error)}`)
  }

  // Zod 검증
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('API 응답 검증 실패:', {
        errors: error.errors,
        received: data
      })
      throw new Error(
        `API 응답 검증 실패:\n${error.errors.map(e => `  - ${e.path.join('.')}: ${e.message}`).join('\n')}`
      )
    }
    throw error
  }
}

/**
 * 안전한 API 호출 래퍼
 * 
 * @param url - API URL
 * @param options - fetch 옵션
 * @param schema - Zod 스키마
 * @returns 검증된 데이터
 */
export async function safeApiCall<T>(
  url: string,
  schema: z.ZodSchema<T>,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    return await validateApiResponse(response, schema)
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error(`알 수 없는 에러: ${String(error)}`)
  }
}

/**
 * 에러 응답 스키마
 */
export const ErrorResponseSchema = z.object({
  detail: z.string().optional(),
  message: z.string().optional(),
  error: z.string().optional(),
})

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>
