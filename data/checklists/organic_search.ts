/**
 * Organic Search (SEO) 체크리스트
 * 100점 만점, 카테고리별 세분화
 */

export interface ChecklistRubric {
  score: number
  description: string
  criteria: string[]
}

export interface BenchmarkCriteria {
  score: number
  value: string | number // 기준값 (예: "1초", 5.0)
  percentile: number // 백분위수
  label: string // 설명
}

export interface ChecklistItem {
  id: string
  category: string
  item: string // 항목명 (명확하고 구체적)
  max_score: number // 최대 점수 (4-5점)
  description: string
  rubric: Record<number, string> // 각 점수 수준의 명확한 기준
  industry_benchmark?: BenchmarkCriteria[] // 업계 벤치마크 (Top 1%, 10%, 중앙값 등) - 선택적
  improvement_actions?: string[] // 구체적인 액션 아이템 - 선택적
  evaluation_guide?: string // 평가 가이드 (선택적)
  improvement_action?: string // 개선 액션 (선택적, improvement_actions와 호환)
  expected_improvement?: {
    score_increase?: number // "+X점"
    cvr_impact?: number // "CVR +Y%"
    description: string // 기대 효과 설명
  }
  priority: 'high' | 'medium' | 'low'
  checked: boolean
  current_score?: number
  current_value?: string | number // 현재 측정값
}

export const ORGANIC_SEARCH_CHECKLIST: ChecklistItem[] = [
  // SEO 기초 (40점) - 10개 항목
  {
    id: 'seo-basic-001',
    category: 'seo_basics',
    item: 'Meta Title 최적화',
    max_score: 4,
    description: '검색어 포함 + 브랜드명 + 구체적 (50-60자)',
    rubric: {
      4: '완벽 (키워드 앞부분, 브랜드명, 50-60자, 고유성)',
      3: '좋음 (키워드 포함, 길이만 부적절)',
      2: '미흡 (키워드 없거나 브랜드명 없음)',
      1: '나쁨 (검색 최적화 없음, 중복 타이틀)'
    },
    industry_benchmark: [
      { score: 4, value: 'optimal', percentile: 99, label: '최적화 완료 (상위 1%)' },
      { score: 3, value: 'good', percentile: 75, label: '대부분 최적화 (상위 25%)' },
      { score: 2, value: 'partial', percentile: 50, label: '일부 최적화 (중앙값)' },
      { score: 1, value: 'poor', percentile: 25, label: '최적화 없음 (하위 25%)' }
    ],
    improvement_actions: [
      '핵심 키워드를 타이틀 앞부분에 배치',
      '브랜드명 추가 (뒷부분 권장)',
      '50-60자로 조정 (모바일에서 잘림 방지)',
      '각 페이지마다 고유한 타이틀 작성',
      'CTA 요소 포함 ("구매하기", "더 알아보기" 등)'
    ],
    expected_improvement: {
      score_increase: 2,
      cvr_impact: 3,
      description: '최적화 완료 시 +2점, CVR +3% (검색 결과 클릭률 향상)'
    },
    priority: 'high',
    checked: false
  },
  {
    id: 'seo-basic-002',
    category: 'seo_basics',
    item: 'Meta Description 최적화',
    max_score: 4,
    description: '매력적이고 CTA 포함 (150-160자)',
    rubric: {
      4: '완벽 (CTA 포함, 매력적, 150-160자, 고유성)',
      3: '좋음 (CTA 있으나 매력도 부족)',
      2: '미흡 (CTA 없음, 길이 부적절)',
      1: '나쁨 (설명 없음, 중복)'
    },
    industry_benchmark: [
      { score: 4, value: 'optimal', percentile: 99, label: '최적화 완료 (상위 1%)' },
      { score: 3, value: 'good', percentile: 75, label: '대부분 최적화 (상위 25%)' },
      { score: 2, value: 'partial', percentile: 50, label: '일부 최적화 (중앙값)' },
      { score: 1, value: 'poor', percentile: 25, label: '최적화 없음 (하위 25%)' }
    ],
    improvement_actions: [
      'CTA 문구 추가 ("지금 확인하기", "더 알아보기" 등)',
      '혜택이나 가치 제안 포함',
      '150-160자로 조정 (검색 결과에서 완전히 표시)',
      '각 페이지마다 고유한 디스크립션 작성',
      '키워드 자연스럽게 포함'
    ],
    expected_improvement: {
      score_increase: 2,
      cvr_impact: 5,
      description: '최적화 완료 시 +2점, CVR +5% (검색 결과 클릭률 및 전환율 향상)'
    },
    priority: 'high',
    checked: false
  },
  {
    id: 'seo-basic-003',
    category: 'seo_basics',
    item: '내부 링크 구조',
    max_score: 4,
    description: '논리적 구조, 깊이 3단계 이하',
    rubric: {
      4: '완벽 (논리적 구조, 깊이 3단계 이하)',
      3: '좋음 (구조는 좋으나 깊이 4단계)',
      2: '미흡 (구조 불명확)',
      1: '나쁨 (내부 링크 없음)'
    },
    evaluation_guide: '사이트의 내부 링크 구조를 확인합니다. 논리적인 계층 구조를 가지고 있으며, 모든 페이지가 3클릭 이내에 도달 가능한지 확인합니다.',
    improvement_action: '1) 사이트맵 구조 재설계\n2) 카테고리별 논리적 그룹화\n3) 깊이 3단계 이하로 조정\n4) 관련 콘텐츠 간 내부 링크 추가',
    priority: 'high',
    checked: false
  },
  {
    id: 'seo-basic-004',
    category: 'seo_basics',
    item: 'URL 구조 최적화',
    max_score: 4,
    description: '간결하고 키워드 포함',
    rubric: {
      4: '완벽 (키워드 포함, 간결함)',
      3: '좋음 (키워드 있으나 길음)',
      2: '미흡 (키워드 없음)',
      1: '나쁨 (랜덤 문자열)'
    },
    evaluation_guide: 'URL이 간결하고 키워드를 포함하는지 확인합니다. 불필요한 파라미터나 긴 경로가 없는지 확인합니다.',
    improvement_action: '1) URL에 핵심 키워드 포함\n2) 짧고 명확한 URL 구조\n3) 불필요한 파라미터 제거\n4) 하이픈(-)으로 단어 구분',
    priority: 'medium',
    checked: false
  },
  {
    id: 'seo-basic-005',
    category: 'seo_basics',
    item: '헤딩 태그 구조 (H1-H6)',
    max_score: 4,
    description: '논리적 계층 구조',
    rubric: {
      4: '완벽 (H1 1개, 논리적 계층)',
      3: '좋음 (H1 여러 개)',
      2: '미흡 (헤딩 구조 없음)',
      1: '나쁨 (헤딩 태그 미사용)'
    },
    evaluation_guide: '각 페이지에 H1 태그가 1개만 있는지, H2-H6가 논리적인 계층 구조를 이루는지 확인합니다.',
    improvement_action: '1) 각 페이지에 H1 1개만 사용\n2) H2-H6 논리적 순서 유지\n3) 키워드를 헤딩에 포함\n4) 콘텐츠 구조에 맞게 헤딩 배치',
    priority: 'high',
    checked: false
  },
  {
    id: 'seo-basic-006',
    category: 'seo_basics',
    item: '이미지 Alt 텍스트',
    max_score: 4,
    description: '모든 이미지에 적절한 Alt 텍스트',
    rubric: {
      4: '완벽 (모든 이미지에 Alt, 키워드 포함)',
      3: '좋음 (대부분 Alt 있음)',
      2: '미흡 (일부만 Alt 있음)',
      1: '나쁨 (Alt 없음)'
    },
    evaluation_guide: '모든 이미지에 적절한 Alt 텍스트가 있는지 확인합니다. 키워드가 자연스럽게 포함되어 있는지 확인합니다.',
    improvement_action: '1) 모든 이미지에 Alt 텍스트 추가\n2) 키워드 자연스럽게 포함\n3) 이미지 내용을 정확히 설명\n4) 장식용 이미지는 빈 Alt 사용',
    priority: 'medium',
    checked: false
  },
  {
    id: 'seo-basic-007',
    category: 'seo_basics',
    item: 'XML 사이트맵',
    max_score: 4,
    description: '생성 및 제출 완료',
    rubric: {
      4: '완벽 (생성, 제출, 정기 업데이트)',
      3: '좋음 (생성 및 제출 완료)',
      2: '미흡 (생성만 완료)',
      1: '나쁨 (사이트맵 없음)'
    },
    evaluation_guide: 'XML 사이트맵이 생성되어 있고, Google Search Console에 제출되었는지 확인합니다.',
    improvement_action: '1) XML 사이트맵 생성\n2) Google Search Console에 제출\n3) 정기적으로 업데이트\n4) 모든 중요 페이지 포함 확인',
    priority: 'high',
    checked: false
  },
  {
    id: 'seo-basic-008',
    category: 'seo_basics',
    item: '로봇.txt 파일',
    max_score: 4,
    description: '올바른 크롤링 규칙 설정',
    rubric: {
      4: '완벽 (규칙 명확, 최적화)',
      3: '좋음 (기본 규칙 있음)',
      2: '미흡 (규칙 불명확)',
      1: '나쁨 (로봇.txt 없음)'
    },
    evaluation_guide: '로봇.txt 파일이 올바르게 설정되어 있는지 확인합니다. 중요한 페이지가 차단되지 않았는지 확인합니다.',
    improvement_action: '1) 로봇.txt 파일 생성\n2) 크롤링 규칙 명확히 설정\n3) 중요 페이지 차단 확인\n4) 사이트맵 위치 명시',
    priority: 'medium',
    checked: false
  },
  {
    id: 'seo-basic-009',
    category: 'seo_basics',
    item: 'HTTPS 사용',
    max_score: 4,
    description: 'SSL 인증서 설치 및 리다이렉트',
    rubric: {
      4: '완벽 (HTTPS, 리다이렉트 완료)',
      3: '좋음 (HTTPS만 있음)',
      2: '미흡 (일부만 HTTPS)',
      1: '나쁨 (HTTP만 사용)'
    },
    evaluation_guide: '사이트가 HTTPS로 보호되고 있는지 확인합니다. HTTP에서 HTTPS로 자동 리다이렉트되는지 확인합니다.',
    improvement_action: '1) SSL 인증서 설치\n2) HTTPS 리다이렉트 설정\n3) 혼합 콘텐츠 오류 수정\n4) 보안 헤더 설정',
    priority: 'high',
    checked: false
  },
  {
    id: 'seo-basic-010',
    category: 'seo_basics',
    item: '모바일 최적화',
    max_score: 4,
    description: '뷰포트 메타 태그 및 반응형 디자인',
    rubric: {
      4: '완벽 (반응형, 모바일 친화적)',
      3: '좋음 (반응형이지만 일부 문제)',
      2: '미흡 (모바일 버전 있으나 최적화 부족)',
      1: '나쁨 (모바일 최적화 없음)'
    },
    evaluation_guide: '모바일 뷰포트 메타 태그가 설정되어 있고, 반응형 디자인이 적용되어 있는지 확인합니다.',
    improvement_action: '1) viewport 메타 태그 추가\n2) 반응형 디자인 적용\n3) 모바일 친화적 테스트\n4) 터치 타겟 크기 확인',
    priority: 'high',
    checked: false
  },
  
  // 콘텐츠 품질 (30점) - 6개 항목
  {
    id: 'seo-content-001',
    category: 'content_quality',
    item: '타겟 키워드 최적화',
    max_score: 5,
    description: '키워드 밀도 1-2%, 자연스러운 배치',
    rubric: {
      5: '완벽 (키워드 밀도 1-2%, 자연스러움, LSI 포함)',
      4: '좋음 (키워드 있으나 밀도 2-3%)',
      3: '미흡 (키워드 밀도 0.5-1% 또는 3-4%)',
      2: '나쁨 (키워드 스터핑, 밀도 4% 이상)',
      1: '나쁨 (키워드 없음, 밀도 0.5% 미만)'
    },
    industry_benchmark: [
      { score: 5, value: '1-2%', percentile: 99, label: '최적 밀도 (상위 1%)' },
      { score: 4, value: '2-3%', percentile: 75, label: '양호한 밀도 (상위 25%)' },
      { score: 3, value: '0.5-1% or 3-4%', percentile: 50, label: '일반적 밀도 (중앙값)' },
      { score: 2, value: '4%+', percentile: 25, label: '과도한 밀도 (하위 25%)' },
      { score: 1, value: '<0.5%', percentile: 10, label: '부족한 밀도 (하위 10%)' }
    ],
    improvement_actions: [
      '키워드 밀도 1-2% 유지 (자연스러운 배치)',
      '관련 키워드(LSI) 포함 (의미론적 키워드)',
      '키워드 스터핑 피하기 (과도한 반복 금지)',
      'H1, H2 태그에 키워드 포함',
      '첫 문단에 키워드 자연스럽게 배치'
    ],
    expected_improvement: {
      score_increase: 2,
      cvr_impact: 4,
      description: '최적화 완료 시 +2점, CVR +4% (검색 순위 향상으로 유입 증가)'
    },
    priority: 'high',
    checked: false
  },
  {
    id: 'seo-content-002',
    category: 'content_quality',
    item: '콘텐츠 길이',
    max_score: 5,
    description: '최소 1,000자 이상, 심층 콘텐츠',
    rubric: {
      5: '완벽 (2,000자 이상, 심층, 다양한 섹션)',
      4: '좋음 (1,500-2,000자, 충분한 내용)',
      3: '미흡 (1,000-1,500자, 기본 내용)',
      2: '나쁨 (500-1,000자, 내용 부족)',
      1: '나쁨 (500자 미만, 매우 부족)'
    },
    industry_benchmark: [
      { score: 5, value: 2000, percentile: 99, label: '2,000자 이상 (상위 1%)' },
      { score: 4, value: 1500, percentile: 75, label: '1,500-2,000자 (상위 25%)' },
      { score: 3, value: 1000, percentile: 50, label: '1,000-1,500자 (중앙값)' },
      { score: 2, value: 500, percentile: 25, label: '500-1,000자 (하위 25%)' },
      { score: 1, value: 0, percentile: 10, label: '500자 미만 (하위 10%)' }
    ],
    improvement_actions: [
      '최소 1,000자 이상 작성 (주제를 깊이 있게 다루기)',
      '예시, 사례, 통계 추가 (신뢰성 향상)',
      'FAQ 섹션 추가 (사용자 질문 대응)',
      '비교표, 인포그래픽 포함 (시각적 요소)',
      '관련 주제 확장 (LSI 키워드 활용)'
    ],
    expected_improvement: {
      score_increase: 2,
      cvr_impact: 6,
      description: '2,000자 이상 작성 시 +2점, CVR +6% (검색 순위 향상 및 체류 시간 증가)'
    },
    priority: 'medium',
    checked: false
  },
  {
    id: 'seo-content-003',
    category: 'content_quality',
    item: 'E-E-A-T (경험, 전문성, 권위성, 신뢰성)',
    max_score: 5,
    description: 'E-E-A-T 요소 충분히 포함',
    rubric: {
      5: '완벽 (모든 E-E-A-T 요소 포함, 작성자 프로필, 출처 인용)',
      4: '좋음 (대부분 요소 포함, 일부 보완 필요)',
      3: '미흡 (일부 요소만 포함, 작성자 정보 부족)',
      2: '나쁨 (E-E-A-T 부족, 출처 없음)',
      1: '나쁨 (E-E-A-T 없음, 익명 작성)'
    },
    industry_benchmark: [
      { score: 5, value: 'all_elements', percentile: 99, label: '모든 요소 포함 (상위 1%)' },
      { score: 4, value: 'mostly_elements', percentile: 75, label: '대부분 요소 포함 (상위 25%)' },
      { score: 3, value: 'partial_elements', percentile: 50, label: '일부 요소 포함 (중앙값)' },
      { score: 2, value: 'few_elements', percentile: 25, label: '요소 부족 (하위 25%)' },
      { score: 1, value: 'no_elements', percentile: 10, label: '요소 없음 (하위 10%)' }
    ],
    improvement_actions: [
      '작성자 프로필 추가 (전문성, 경력 표시)',
      '전문 지식 표시 (자격증, 인증)',
      '신뢰할 수 있는 출처 인용 (학술 논문, 공식 통계)',
      '실제 경험 공유 (케이스 스터디, 사용자 리뷰)',
      '업데이트 날짜 및 검토 정보 표시'
    ],
    expected_improvement: {
      score_increase: 2,
      cvr_impact: 5,
      description: 'E-E-A-T 완성 시 +2점, CVR +5% (검색 순위 향상 및 신뢰도 증가)'
    },
    priority: 'high',
    checked: false
  },
  {
    id: 'seo-content-004',
    category: 'content_quality',
    item: '콘텐츠 최신성',
    max_score: 5,
    description: '정기적 업데이트, 최신 정보',
    rubric: {
      5: '완벽 (월 1회 이상 업데이트)',
      4: '좋음 (분기 1회 업데이트)',
      3: '미흡 (반기 1회 업데이트)',
      2: '나쁨 (연 1회 업데이트)',
      1: '나쁨 (업데이트 없음)'
    },
    evaluation_guide: '콘텐츠가 최신 정보로 업데이트되고 있는지 확인합니다. 마지막 업데이트 날짜가 표시되어 있는지 확인합니다.',
    improvement_action: '1) 정기적 콘텐츠 업데이트\n2) 최신 정보 반영\n3) 업데이트 날짜 표시\n4) 오래된 정보 제거',
    priority: 'medium',
    checked: false
  },
  {
    id: 'seo-content-005',
    category: 'content_quality',
    item: '내부 링크 전략',
    max_score: 5,
    description: '관련 콘텐츠로의 전략적 링크',
    rubric: {
      5: '완벽 (전략적 링크, 앵커 텍스트 최적)',
      4: '좋음 (링크 있으나 전략 부족)',
      3: '미흡 (일부 링크만 있음)',
      2: '나쁨 (링크 부족)',
      1: '나쁨 (내부 링크 없음)'
    },
    evaluation_guide: '관련 콘텐츠로의 내부 링크가 전략적으로 배치되어 있는지 확인합니다.',
    improvement_action: '1) 관련 콘텐츠 링크 추가\n2) 키워드 앵커 텍스트 사용\n3) 클러스터 구조 구축\n4) 링크 수 3-5개 유지',
    priority: 'medium',
    checked: false
  },
  {
    id: 'seo-content-006',
    category: 'content_quality',
    item: '외부 링크 품질',
    max_score: 5,
    description: '권위 있는 사이트로의 링크',
    rubric: {
      5: '완벽 (권위 있는 사이트만 링크)',
      4: '좋음 (대부분 권위 있는 사이트)',
      3: '미흡 (일부 권위 있는 사이트)',
      2: '나쁨 (권위 없는 사이트 링크)',
      1: '나쁨 (외부 링크 없음)'
    },
    evaluation_guide: '신뢰할 수 있는 외부 사이트로 링크되어 있는지 확인합니다.',
    improvement_action: '1) 권위 있는 사이트 링크\n2) 관련 콘텐츠 링크\n3) 스팸 사이트 링크 피하기\n4) 링크 수 2-3개 유지',
    priority: 'low',
    checked: false
  },
  
  // 기술적 SEO (20점) - 5개 항목
  {
    id: 'seo-tech-001',
    category: 'technical_seo',
    item: '페이지 로딩 속도',
    max_score: 4,
    description: '페이지 로딩 시간 (LCP 기준)',
    rubric: {
      4: '완벽 (< 1초, Core Web Vitals 양호)',
      3: '좋음 (1-2초, 대부분 양호)',
      2: '미흡 (2-3초, 일부 개선 필요)',
      1: '나쁨 (> 3초, 개선 시급)'
    },
    industry_benchmark: [
      { score: 4, value: 1, percentile: 99, label: '< 1초 (상위 1%)' },
      { score: 3, value: 2, percentile: 75, label: '1-2초 (상위 25%)' },
      { score: 2, value: 3, percentile: 50, label: '2-3초 (중앙값)' },
      { score: 1, value: 4, percentile: 25, label: '> 3초 (하위 25%)' }
    ],
    improvement_actions: [
      '이미지 최적화 (WebP 포맷, lazy loading)',
      'CDN 도입 (Cloudflare, AWS CloudFront)',
      '캐싱 활용 (브라우저 캐시, 서버 캐시)',
      'CSS/JS 압축 및 번들링',
      '불필요한 리소스 제거'
    ],
    expected_improvement: {
      score_increase: 1,
      cvr_impact: 7,
      description: '로딩 시간 1초 단축 시 +1점, CVR +7% (로딩 속도는 CVR에 직접 영향)'
    },
    priority: 'high',
    checked: false,
    current_value: 2.5 // 예시: 현재 2.5초
  },
  {
    id: 'seo-tech-002',
    category: 'technical_seo',
    item: 'Core Web Vitals',
    max_score: 4,
    description: 'LCP, FID, CLS 점수 양호',
    rubric: {
      4: '완벽 (모든 지표 양호: LCP<2.5s, FID<100ms, CLS<0.1)',
      3: '좋음 (대부분 양호: 1-2개 지표 개선 필요)',
      2: '미흡 (일부 개선 필요: 2-3개 지표 개선 필요)',
      1: '나쁨 (모든 지표 나쁨: 전면 개선 필요)'
    },
    industry_benchmark: [
      { score: 4, value: 'all_good', percentile: 99, label: '모든 지표 양호 (상위 1%)' },
      { score: 3, value: 'mostly_good', percentile: 75, label: '대부분 양호 (상위 25%)' },
      { score: 2, value: 'needs_improvement', percentile: 50, label: '일부 개선 필요 (중앙값)' },
      { score: 1, value: 'poor', percentile: 25, label: '전면 개선 필요 (하위 25%)' }
    ],
    improvement_actions: [
      'LCP 최적화 (이미지 최적화, 폰트 preload)',
      'FID 개선 (JavaScript 최적화, 코드 분할)',
      'CLS 최소화 (레이아웃 시프트 방지, 이미지 크기 지정)',
      'PageSpeed Insights 모니터링',
      '서버 응답 시간 개선'
    ],
    expected_improvement: {
      score_increase: 2,
      cvr_impact: 8,
      description: '모든 지표 양호 달성 시 +2점, CVR +8% (사용자 경험 향상으로 전환율 증가)'
    },
    priority: 'high',
    checked: false
  },
  {
    id: 'seo-tech-003',
    category: 'technical_seo',
    item: '구조화된 데이터 (Schema)',
    max_score: 4,
    description: 'JSON-LD 스키마 마크업 적용',
    rubric: {
      4: '완벽 (스키마 적용, Rich Snippets 표시)',
      3: '좋음 (스키마 적용)',
      2: '미흡 (일부만 적용)',
      1: '나쁨 (스키마 없음)'
    },
    evaluation_guide: 'JSON-LD 스키마 마크업이 적용되어 있는지 확인합니다.',
    improvement_action: '1) Schema.org 마크업 추가\n2) Rich Snippets 테스트\n3) 제품, 리뷰, FAQ 스키마 적용\n4) Google Search Console 확인',
    priority: 'medium',
    checked: false
  },
  {
    id: 'seo-tech-004',
    category: 'technical_seo',
    item: '캐노니컬 URL',
    max_score: 4,
    description: '중복 콘텐츠 방지',
    rubric: {
      4: '완벽 (모든 페이지에 캐노니컬 설정)',
      3: '좋음 (대부분 설정)',
      2: '미흡 (일부만 설정)',
      1: '나쁨 (캐노니컬 없음)'
    },
    evaluation_guide: '중복 콘텐츠 방지를 위한 캐노니컬 URL이 설정되어 있는지 확인합니다.',
    improvement_action: '1) 캐노니컬 태그 추가\n2) 중복 콘텐츠 확인\n3) URL 정규화\n4) 301 리다이렉트 설정',
    priority: 'medium',
    checked: false
  },
  {
    id: 'seo-tech-005',
    category: 'technical_seo',
    item: '404 에러 처리',
    max_score: 4,
    description: '적절한 404 페이지 및 리다이렉트',
    rubric: {
      4: '완벽 (404 페이지, 리다이렉트 완료)',
      3: '좋음 (404 페이지만 있음)',
      2: '미흡 (기본 404)',
      1: '나쁨 (404 처리 없음)'
    },
    evaluation_guide: '404 에러가 적절히 처리되고 리다이렉트가 설정되어 있는지 확인합니다.',
    improvement_action: '1) 404 페이지 최적화\n2) 깨진 링크 수정\n3) 301 리다이렉트 설정\n4) 사이트맵 업데이트',
    priority: 'low',
    checked: false
  },
  
  // 백링크 & 권위 (10점) - 2개 항목
  {
    id: 'seo-authority-001',
    category: 'backlinks_authority',
    item: '권위 백링크',
    max_score: 5,
    description: '권위 있는 사이트로부터 백링크',
    rubric: {
      5: '완벽 (고품질 백링크 100개 이상, DA 50+ 사이트)',
      4: '좋음 (품질 좋은 백링크 50-100개)',
      3: '미흡 (일부 백링크 있음, 20-50개)',
      2: '나쁨 (저품질 백링크, 10-20개)',
      1: '나쁨 (백링크 없음, 10개 미만)'
    },
    industry_benchmark: [
      { score: 5, value: 100, percentile: 99, label: '100개 이상 고품질 (상위 1%)' },
      { score: 4, value: 50, percentile: 75, label: '50-100개 (상위 25%)' },
      { score: 3, value: 20, percentile: 50, label: '20-50개 (중앙값)' },
      { score: 2, value: 10, percentile: 25, label: '10-20개 (하위 25%)' },
      { score: 1, value: 0, percentile: 10, label: '10개 미만 (하위 10%)' }
    ],
    improvement_actions: [
      '백링크 구축 전략 수립 (장기 계획)',
      '고품질 사이트와 협력 (DA 50+ 사이트)',
      '게스트 포스팅 (관련 블로그, 매체)',
      '디렉토리 제출 (업계 디렉토리)',
      '브로큰 링크 구축 (관련 사이트의 깨진 링크 교체)'
    ],
    expected_improvement: {
      score_increase: 2,
      cvr_impact: 3,
      description: '고품질 백링크 50개 이상 확보 시 +2점, CVR +3% (검색 순위 향상으로 유입 증가)'
    },
    priority: 'medium',
    checked: false
  },
  {
    id: 'seo-authority-002',
    category: 'backlinks_authority',
    item: '도메인 권위 점수',
    max_score: 5,
    description: 'DA/DR 점수 업계 평균 이상',
    rubric: {
      5: '완벽 (DA/DR 70 이상)',
      4: '좋음 (DA/DR 60-70)',
      3: '미흡 (DA/DR 50-60)',
      2: '나쁨 (DA/DR 40-50)',
      1: '나쁨 (DA/DR 40 미만)'
    },
    evaluation_guide: '도메인 권위 점수(DA/DR)가 업계 평균 이상인지 확인합니다.',
    improvement_action: '1) 도메인 권위 점수 확인\n2) 백링크 품질 개선\n3) 콘텐츠 품질 향상\n4) 시간이 걸리는 작업이므로 장기 전략 필요',
    priority: 'medium',
    checked: false
  }
]

/**
 * 카테고리별 점수 합계
 */
export function calculateCategoryScores(checklist: ChecklistItem[]): Record<string, { max: number; current: number }> {
  const categoryScores: Record<string, { max: number; current: number }> = {}
  
  checklist.forEach(item => {
    if (!categoryScores[item.category]) {
      categoryScores[item.category] = { max: 0, current: 0 }
    }
    categoryScores[item.category].max += item.max_score
    if (item.checked && item.current_score !== undefined) {
      categoryScores[item.category].current += item.current_score
    }
  })
  
  return categoryScores
}
