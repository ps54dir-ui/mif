# 사업자 상태 조회 API

## 엔드포인트
`POST /api/business-status`

## 요청

### Body
```json
{
  "businessNumber": "1234567890"
}
```

### 파라미터
- `businessNumber` (string, required): 사업자등록번호 (10자리 숫자, 하이픈 포함/제외 가능)

## 응답

### 성공 (200)
```json
{
  "status": "계속",
  "checkedAt": "2024-01-01T00:00:00.000Z"
}
```

### 실패 (400/500)
```json
{
  "error": true,
  "message": "상태 조회 실패"
}
```

## 처리 흐름

1. **캐시 확인**: `business_status_cache` 테이블에서 조회
   - `expires_at > now()` 이면 캐시 결과 반환
2. **캐시 없음/만료**: 국세청 API 호출
   - `NTS_SERVICE_KEY` 환경변수 사용
3. **응답 표준화**: status를 "계속" | "휴업" | "폐업" 중 하나로 변환
4. **캐시 저장**: `business_status_cache`에 upsert
   - `expires_at = now() + 3 days`
5. **결과 반환**: `{ status, checkedAt }`

## 환경변수

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # 서버 사이드에서 사용

# 국세청 API
NTS_SERVICE_KEY=your_nts_service_key

# MOCK 모드 (선택적)
BUSINESS_STATUS_MOCK_MODE=true  # true일 경우 항상 { status: "계속" } 반환
```

## MOCK 모드

국세청 API 연동 전까지는 MOCK 모드로 동작할 수 있습니다.

환경변수 `BUSINESS_STATUS_MOCK_MODE=true`로 설정하면:
- 국세청 API 호출 없이 항상 `{ status: "계속" }` 반환
- 캐시에는 저장 (선택적)

## 사용 예시

```typescript
const response = await fetch('/api/business-status', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    businessNumber: '123-45-67890'
  })
})

const data = await response.json()
// { status: "계속", checkedAt: "2024-01-01T00:00:00.000Z" }
```

## 주의사항

1. **DB 스키마**: `business_status_cache.business_number`가 `VARCHAR(10)`인 경우, 해시값 저장에 충분하지 않을 수 있습니다. 실제 프로덕션에서는 `VARCHAR(64)` 이상으로 변경하는 것을 권장합니다.

2. **국세청 API**: 실제 API 엔드포인트와 응답 형식은 공공데이터포털 문서를 참조하여 `callNationalTaxServiceAPI` 함수를 수정해야 합니다.

3. **에러 처리**: API 호출 실패 시 에러 메시지를 반환하지만, 캐시 저장 실패는 치명적이지 않으므로 로그만 남깁니다.
