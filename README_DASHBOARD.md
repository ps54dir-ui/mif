# 종합 전략 대시보드

## 개요

수집된 모든 데이터(네이버 플레이스, SEO/GEO/AEO, GA4 등)를 통합하여 보여주는 종합 전략 대시보드입니다.

## 주요 기능

### 1. 종합 점수 시각화

**메인 화면 중앙:**
- 100점 만점 종합 점수 대형 표시
- 점수에 따른 색상 구분 (우수/양호/보통/개선 필요)

**4대 축 레이더 차트:**
- 유입 (Inflow): SEO + 네이버 플레이스 발견성
- 설득 (Persuasion): 전환율 + 매력도
- 신뢰 (Trust): trust_score + E-E-A-T
- 순환 (Circulation): 재진단 개선율

### 2. SEO/GEO/AEO 리포트 카드

각 최적화 점수와 AI 분석 보완 사항을 카드 형태로 표시:

- **SEO 리포트**: Technical SEO, E-E-A-T 점수
  - 보완 사항 예: "메타 태그 최적화 필요", "E-E-A-T 점수 개선 필요", "검색 의도와 콘텐츠 불일치"

- **GEO 리포트**: 구조화된 데이터, 통계/인용구 점수
  - 보완 사항 예: "스키마 마크업 미비", "통계 및 인용구 부족", "FAQ/Q&A 포맷 부족"

- **AEO 리포트**: 콘텐츠 구조 점수
  - 보완 사항 예: "서술형 콘텐츠 → 표/불렛포인트 필요"

### 3. ICE Score 기반 To-do List

"지금 당장 매출을 올리기 위해 해야 할 일" 우선순위 상위 3개:

- 1순위: 빨간색 강조
- 2순위: 주황색
- 3순위: 노란색

각 항목 표시 정보:
- 전략명
- Impact, Confidence, Ease 점수
- ICE Score
- 설명

### 4. 반복 진단 타임라인

이전 진단 대비 점수 변화를 보여주는 꺾은선 그래프:

- X축: 진단 날짜
- Y축: 종합 점수 (0-100)
- 이전 대비 변화율 표시
- "마케팅 플라이휠이 가속화/정체되고 있습니다" 메시지

## 페이지 구조

```
/dashboard
├── 종합 점수 카드 (중앙)
├── 4대 축 레이더 차트
├── SEO/GEO/AEO 리포트 카드 (3개)
├── ICE Score To-do List (좌측)
└── 반복 진단 타임라인 (우측)
```

## API 엔드포인트

### GET /api/dashboard/summary?report_id={report_id}

종합 대시보드 데이터 조회

**Response:**
```json
{
  "overallScore": 75,
  "fourAxes": {
    "inflow": 68.5,
    "persuasion": 72.3,
    "trust": 78.2,
    "circulation": 65.0
  },
  "seoGeoAeoReports": [
    {
      "type": "SEO",
      "score": 75,
      "issues": ["메타 태그 최적화 필요", "E-E-A-T 점수 개선 필요"]
    },
    {
      "type": "GEO",
      "score": 65,
      "issues": ["스키마 마크업 미비", "서술형 콘텐츠 → 표/불렛포인트 필요"]
    },
    {
      "type": "AEO",
      "score": 65,
      "issues": ["스키마 마크업 미비", "서술형 콘텐츠 → 표/불렛포인트 필요"]
    }
  ],
  "icePriorities": [
    {
      "id": "uuid",
      "strategyName": "플레이스 사진 업데이트",
      "impact": 8,
      "confidence": 9,
      "ease": 7,
      "finalScore": 8.0,
      "description": "..."
    },
    ...
  ],
  "diagnosisHistory": [
    {
      "date": "2024-01-15T00:00:00Z",
      "overallScore": 75,
      "version": 3
    },
    ...
  ]
}
```

## 사용 기술

- **Next.js 14**: App Router
- **Recharts**: 차트 라이브러리 (레이더 차트, 꺾은선 그래프)
- **Tailwind CSS**: 스타일링
- **date-fns**: 날짜 포맷팅

## 컴포넌트 구조

```
components/
├── dashboard/
│   ├── OverallScoreCard.tsx        # 종합 점수 카드
│   ├── RadarChartComponent.tsx     # 4대 축 레이더 차트
│   ├── SEOGEOReportCards.tsx      # SEO/GEO/AEO 리포트 카드
│   ├── ICETodoList.tsx            # ICE Score To-do List
│   └── DiagnosisTimeline.tsx     # 반복 진단 타임라인
└── common/
    └── LoadingSpinner.tsx         # 로딩 스피너
```

## 실행 방법

```bash
cd frontend
npm install
npm run dev
```

대시보드 접속: `http://localhost:3000/dashboard?report_id={report_id}`

## 디자인 특징

- 전문가용 분석 도구 스타일
- 깔끔하고 직관적인 UI
- 반응형 디자인 (모바일/태블릿/데스크톱)
- 색상 코딩으로 상태 구분
- 명확한 정보 계층 구조
