# Frontend - Next.js 14

마케팅 진단 전략 리포트 프로그램의 프론트엔드 애플리케이션입니다.

## 환경 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 설치

```bash
npm install
```

## 실행

개발 모드:
```bash
npm run dev
```

프로덕션 빌드:
```bash
npm run build
npm start
```

애플리케이션은 `http://localhost:3000`에서 실행됩니다.

## 프로젝트 구조

```
frontend/
├── app/                 # Next.js App Router
│   ├── layout.tsx      # 루트 레이아웃
│   ├── page.tsx        # 홈 페이지
│   └── globals.css     # 전역 스타일
├── components/          # React 컴포넌트 (향후 추가)
├── lib/                # 유틸리티 및 헬퍼 함수 (향후 추가)
└── package.json        # 의존성 및 스크립트
```
