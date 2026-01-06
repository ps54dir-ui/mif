# handleSearch 함수 기대 동작 명세

## 개요
`handleSearch` 함수는 회사명 검색을 수행하는 핵심 함수입니다. URL 업데이트, 요청 취소, 타임아웃, 에러 처리, 결과 fallback 등 복잡한 로직을 포함합니다.

## 함수 시그니처
```typescript
handleSearch(searchTerm: string, updateUrl: boolean = true): Promise<void>
```

## 기대 동작

### 1. 입력 검증
- **빈 문자열 처리**: `searchTerm.trim()`이 빈 문자열이면 즉시 반환 (아무 동작도 하지 않음)
- **공백 제거**: 입력값은 항상 `trim()` 처리됨

### 2. URL 업데이트 로직 (`updateUrl === true`)
- **조건**: `updateUrl === true`이고 `trimmedSearch !== query`인 경우
- **동작**:
  1. 이전 요청이 있으면 취소 (`abortControllerRef.current.abort()`)
  2. `abortControllerRef.current`를 `null`로 설정
  3. `router.push()`로 URL 업데이트
  4. 즉시 `return` (실제 검색은 `useEffect`에서 URL 변경 감지 후 실행)

### 3. 직접 검색 로직 (`updateUrl === false` 또는 `trimmedSearch === query`)
- **상태 업데이트**:
  - `setIsSearching(true)` - 검색 시작
  - `setError(null)` - 에러 초기화

- **이전 요청 취소**:
  - `abortControllerRef.current`가 존재하면 `abort()` 호출
  - 새 `AbortController` 생성 및 `abortControllerRef.current`에 저장

- **타임아웃 설정**:
  - 10초 후 자동 취소 (`setTimeout`으로 `controller.abort()` 호출)

- **API 호출**:
  - `POST /api/company-search/search`
  - Body: `{ company_name: trimmedSearch }`
  - Headers: `Content-Type: application/json`, `Authorization: Bearer {token}` (토큰이 있는 경우)
  - Signal: `controller.signal`

### 4. 성공 응답 처리
- **HTTP 200 OK**:
  - `data.matches`가 비어있지 않으면 `setResults(data.matches)`
  - `data.matches`가 비어있고 `trimmedSearch.length >= 2`이면:
    - Fallback: `setResults([{ company_name: trimmedSearch, source: 'user_input', ... }])`
  - `setLastSearchedQuery(trimmedSearch)`
  - `clearTimeout(timeoutId)`
  - `abortControllerRef.current`가 현재 controller와 같으면 `null`로 설정

- **HTTP 에러 (4xx, 5xx)**:
  - 에러 메시지 파싱 시도 (`response.json()` 또는 `response.text()`)
  - `setError(errorMessage)`
  - `setResults([])`
  - `setLastSearchedQuery(trimmedSearch)`

### 5. 에러 처리
- **AbortError**:
  - `fetchErr.name === 'AbortError'` 또는 `fetchErr.message?.includes('aborted')`
  - 조용히 종료 (에러 표시하지 않음)
  - `setIsSearching(false)`만 호출
  - `return` (다른 에러 처리 스킵)

- **TimeoutError**:
  - `err.name === 'TimeoutError'`
  - `setError('검색 시간이 초과되었습니다. 다시 시도해주세요.')`

- **기타 에러**:
  - `setError('검색 중 오류가 발생했습니다.')`

- **최종 정리**:
  - `finally` 블록에서:
    - `clearTimeout(timeoutId)`
    - `abortControllerRef.current`가 현재 controller와 같으면 `null`로 설정
    - `setIsSearching(false)` (외부 `finally` 블록)

### 6. 리소스 정리
- **타임아웃 정리**: `clearTimeout(timeoutId)`는 성공/실패/취소 모든 경우에 호출
- **AbortController 정리**: 요청 완료 시 `abortControllerRef.current = null`
- **컴포넌트 언마운트**: `useEffect` cleanup에서 남은 요청 취소

## 테스트 케이스

### TC1: 빈 문자열 입력
- **입력**: `handleSearch('   ')`
- **기대**: 즉시 반환, 상태 변경 없음

### TC2: URL 업데이트 모드 (새 검색어)
- **입력**: `handleSearch('삼성생명', true)`, `query !== '삼성생명'`
- **기대**: 
  - 이전 요청 취소
  - `router.push('/company-search?q=삼성생명')` 호출
  - 즉시 return (실제 검색은 useEffect에서)

### TC3: 직접 검색 모드 (성공)
- **입력**: `handleSearch('삼성생명', false)`
- **Mock**: `fetch`가 `{ matches: [{ company_name: '삼성생명', ... }] }` 반환
- **기대**:
  - `setIsSearching(true)` → `false`
  - `setResults([...])` 호출
  - `setLastSearchedQuery('삼성생명')` 호출
  - 타임아웃 정리

### TC4: 직접 검색 모드 (빈 결과 → Fallback)
- **입력**: `handleSearch('존재하지않는회사', false)`
- **Mock**: `fetch`가 `{ matches: [] }` 반환
- **기대**:
  - `setResults([{ company_name: '존재하지않는회사', source: 'user_input', ... }])` 호출
  - Fallback 로직 작동

### TC5: AbortError 처리
- **입력**: 빠른 연속 검색 (이전 요청 취소)
- **Mock**: `fetch`가 `AbortError` throw
- **기대**:
  - 에러 표시하지 않음
  - `setIsSearching(false)`만 호출
  - 조용히 종료

### TC6: 타임아웃 처리
- **입력**: `handleSearch('삼성생명', false)`
- **Mock**: `fetch`가 10초 이상 지연
- **기대**:
  - 10초 후 `controller.abort()` 호출
  - `AbortError` 발생 및 조용히 처리

### TC7: HTTP 에러 처리
- **입력**: `handleSearch('삼성생명', false)`
- **Mock**: `fetch`가 `{ status: 500, ok: false }` 반환
- **기대**:
  - `setError('검색 중 오류가 발생했습니다.')` 호출
  - `setResults([])` 호출

### TC8: 연속 검색 (이전 요청 취소)
- **입력**: 
  1. `handleSearch('삼성', false)` (진행 중)
  2. `handleSearch('삼성생명', false)` (새 검색)
- **기대**:
  - 첫 번째 요청의 `AbortController.abort()` 호출
  - 두 번째 요청만 완료
  - 첫 번째 요청은 `AbortError`로 조용히 종료

### TC9: 컴포넌트 언마운트 시 정리
- **입력**: 검색 진행 중 컴포넌트 언마운트
- **기대**:
  - `useEffect` cleanup에서 `abortControllerRef.current.abort()` 호출
  - 메모리 누수 없음

## 경계 조건

1. **동시 요청**: 여러 요청이 동시에 발생하면 마지막 요청만 완료되어야 함
2. **빠른 타이핑**: 사용자가 빠르게 타이핑하면 이전 요청들이 모두 취소되어야 함
3. **네트워크 오류**: 네트워크 오류 시 적절한 에러 메시지 표시
4. **타임아웃 경계**: 정확히 10초 후 취소되어야 함
5. **Fallback 조건**: `trimmedSearch.length >= 2`일 때만 fallback 작동
