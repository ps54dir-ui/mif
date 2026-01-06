/**
 * 기업명 검증 유틸리티
 */

// 금지 단어 목록
const FORBIDDEN_WORDS = [
  '테스트', 'test', '테스트업체', 'test company',
  '예시', 'example', '샘플', 'sample',
  '임시', 'temp', 'temporary',
  '없음', 'none', 'null', 'undefined',
  '123', 'abc', '가나다', 'aaa', 'bbb', 'qqq', 'www', 'eee'
]

// 무의미한 패턴 (반복 문자, 무작위 문자열 등)
const MEANINGLESS_PATTERNS = [
  /^[a-z]{3,10}$/,  // 3-10자 소문자만 (qwewqe 같은 경우)
  /^[A-Z]{3,10}$/,  // 3-10자 대문자만
  /^(.)\1{2,}$/,    // 같은 문자 3번 이상 반복 (aaa, bbb 등)
]

export interface ValidationResult {
  isValid: boolean
  errorMessage: string
}

export function validateCompanyName(companyName: string): ValidationResult {
  if (!companyName) {
    return {
      isValid: false,
      errorMessage: '기업명을 입력해주세요.'
    }
  }

  const trimmed = companyName.trim()

  // 최소 길이 검증
  if (trimmed.length < 2) {
    return {
      isValid: false,
      errorMessage: '기업명은 최소 2자 이상이어야 합니다.'
    }
  }

  // 최대 길이 검증
  if (trimmed.length > 100) {
    return {
      isValid: false,
      errorMessage: '기업명은 100자 이하여야 합니다.'
    }
  }

  // 금지 단어 검증
  const lowerCase = trimmed.toLowerCase()
  for (const forbidden of FORBIDDEN_WORDS) {
    if (lowerCase.includes(forbidden.toLowerCase())) {
      return {
        isValid: false,
        errorMessage: `'${forbidden}'는 사용할 수 없는 단어입니다. 실제 기업명을 입력해주세요.`
      }
    }
  }

  // 숫자만 있는지 검증
  if (/^[0-9]+$/.test(trimmed)) {
    return {
      isValid: false,
      errorMessage: '유효한 기업명 형식이 아닙니다. 실제 기업명을 입력해주세요.'
    }
  }

  // 특수문자만 있는지 검증
  if (/^[^가-힣a-zA-Z0-9\s]+$/.test(trimmed)) {
    return {
      isValid: false,
      errorMessage: '유효한 기업명 형식이 아닙니다. 실제 기업명을 입력해주세요.'
    }
  }

  // 1-2자 영문만 있는지 검증
  if (/^[a-zA-Z]{1,2}$/.test(trimmed)) {
    return {
      isValid: false,
      errorMessage: '유효한 기업명 형식이 아닙니다. 실제 기업명을 입력해주세요.'
    }
  }

  // 1자 한글만 있는지 검증
  if (/^[가-힣]{1}$/.test(trimmed)) {
    return {
      isValid: false,
      errorMessage: '유효한 기업명 형식이 아닙니다. 실제 기업명을 입력해주세요.'
    }
  }

  // 한글, 영문, 숫자, 공백, 일부 특수문자만 허용
  const validPattern = /^[가-힣a-zA-Z0-9\s&.\-()]+$/
  if (!validPattern.test(trimmed)) {
    return {
      isValid: false,
      errorMessage: '기업명에는 한글, 영문, 숫자, 공백 및 일부 특수문자(&, -, ., (, ))만 사용할 수 있습니다.'
    }
  }

  // 연속된 공백 검증
  if (trimmed.includes('  ')) {
    return {
      isValid: false,
      errorMessage: '기업명에 연속된 공백을 사용할 수 없습니다.'
    }
  }

  // 실제 기업명처럼 보이는지 검증 (한글 또는 영문이 포함되어야 함)
  const hasKorean = /[가-힣]/.test(trimmed)
  const hasEnglish = /[a-zA-Z]/.test(trimmed)

  if (!hasKorean && !hasEnglish) {
    return {
      isValid: false,
      errorMessage: '기업명에는 한글 또는 영문이 포함되어야 합니다.'
    }
  }

  // 무의미한 패턴 검증 (영문만 있는 경우)
  if (hasEnglish && !hasKorean) {
    // 영문만 있는 경우, 무의미한 패턴인지 확인
    for (const pattern of MEANINGLESS_PATTERNS) {
      if (pattern.test(trimmed)) {
        return {
          isValid: false,
          errorMessage: '실제 기업명을 입력해주세요. 무의미한 문자열은 사용할 수 없습니다.'
        }
      }
    }

    // 영문만 있고 3-10자 사이인 경우, 실제 기업명처럼 보이는지 추가 검증
    if (trimmed.length >= 3 && trimmed.length <= 10) {
      // 모두 소문자이고 공백/특수문자가 없으면 의심
      const isAllLowercase = trimmed === trimmed.toLowerCase()
      const hasSpace = trimmed.includes(' ')
      const hasUpperCase = /[A-Z]/.test(trimmed)

      if (isAllLowercase && !hasSpace && !hasUpperCase) {
        return {
          isValid: false,
          errorMessage: '실제 기업명을 입력해주세요. 영문 기업명은 대문자로 시작하거나 공백이 포함되어야 합니다.'
        }
      }
    }
  }

  return {
    isValid: true,
    errorMessage: ''
  }
}
