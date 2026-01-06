/**
 * 포괄적인 AEO 최적화 전략 생성
 * 블로그 외 다양한 콘텐츠 타입과 전략 포함
 */

export interface AEOOptimizationStrategy {
  id: string
  category: 'content_structure' | 'structured_data' | 'expert_content' | 'user_engagement' | 'multimedia' | 'metadata'
  title: string
  description: string
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  impact: number // 1-10
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  estimatedTime: string
  actionItems: {
    action: string
    description: string
    examples: string[]
    expectedImpact: string
  }[]
  contentTypes: string[]
  successMetrics: string[]
}

export interface ComprehensiveAEOStrategyReport {
  overallScore: number
  strategies: AEOOptimizationStrategy[]
  recommendedOrder: string[]
  timeline: string
  expectedImpact: string
}

/**
 * 포괄적인 AEO 최적화 전략 생성
 */
export function generateComprehensiveAEOStrategies(
  currentAEOScore: number,
  hasStructuredData: boolean,
  faqCount: number,
  statisticsCount: number,
  citationCount: number,
  hasVideoContent: boolean,
  hasTableContent: boolean
): ComprehensiveAEOStrategyReport {
  const strategies: AEOOptimizationStrategy[] = []

  // 1. 구조화된 데이터 전략
  if (!hasStructuredData || currentAEOScore < 70) {
    strategies.push({
      id: 'structured-data-optimization',
      category: 'structured_data',
      title: 'JSON-LD 구조화된 데이터 마크업 강화',
      description: 'AI 엔진이 콘텐츠를 이해하고 인용하기 쉽도록 다양한 구조화된 데이터를 추가합니다.',
      priority: currentAEOScore < 50 ? 'CRITICAL' : 'HIGH',
      impact: 9,
      difficulty: 'MEDIUM',
      estimatedTime: '2-3일',
      actionItems: [
        {
          action: 'FAQPage 스키마 추가',
          description: '자주 묻는 질문을 FAQPage JSON-LD로 구조화',
          examples: [
            '제품 FAQ 페이지에 FAQPage 스키마 적용',
            '서비스 페이지에 Q&A 섹션 구조화',
            '고객 지원 페이지에 FAQ 섹션 추가'
          ],
          expectedImpact: 'FAQ 검색 결과에서 리치 스니펫 표시, AI 답변 인용률 40% 증가'
        },
        {
          action: 'Article/NewsArticle 스키마 적용',
          description: '블로그 글과 뉴스 콘텐츠에 Article 스키마 추가',
          examples: [
            '모든 블로그 포스트에 Article 스키마 적용',
            '뉴스/공지사항에 NewsArticle 스키마 추가',
            '작성자 정보, 발행일, 수정일 등 메타데이터 포함'
          ],
          expectedImpact: '검색 결과에서 날짜, 작성자 정보 표시, 신뢰도 30% 향상'
        },
        {
          action: 'HowTo 스키마로 단계별 가이드 구조화',
          description: '튜토리얼, 가이드 콘텐츠를 HowTo 스키마로 구조화',
          examples: [
            '제품 사용법 가이드를 HowTo 스키마로 구조화',
            '설치/설정 방법을 단계별로 구조화',
            '요리 레시피, DIY 가이드 등에 적용'
          ],
          expectedImpact: '검색 결과에서 단계별 가이드 표시, 체류 시간 25% 증가'
        },
        {
          action: 'Product/Service 스키마 적용',
          description: '제품 및 서비스 페이지에 구조화된 데이터 추가',
          examples: [
            '제품 페이지에 가격, 평점, 리뷰 수 등 정보 구조화',
            '서비스 설명, 가격, 특징을 Service 스키마로 구조화',
            'LocalBusiness 스키마로 매장 정보 구조화'
          ],
          expectedImpact: '제품 검색 결과에서 가격, 평점 표시, 클릭률 35% 증가'
        },
        {
          action: 'BreadcrumbList 스키마 추가',
          description: '사이트 네비게이션을 구조화하여 AI가 사이트 구조 이해',
          examples: [
            '모든 페이지에 BreadcrumbList 스키마 적용',
            '카테고리 구조를 명확히 표현',
            '페이지 계층 구조 시각화'
          ],
          expectedImpact: '사이트 이해도 향상, 크롤링 효율성 20% 증가'
        }
      ],
      contentTypes: ['FAQ', 'Article', 'HowTo', 'Product', 'Service', 'BreadcrumbList'],
      successMetrics: ['구조화된 데이터 적용 페이지 수', '리치 스니펫 표시율', 'AI 인용 횟수 증가']
    })
  }

  // 2. FAQ/Q&A 콘텐츠 전략
  if (faqCount < 10 || currentAEOScore < 70) {
    strategies.push({
      id: 'faq-content-expansion',
      category: 'content_structure',
      title: 'FAQ/Q&A 콘텐츠 대폭 확장',
      description: '사용자가 자주 묻는 질문과 AI 답변 엔진에서 인용되기 쉬운 Q&A 형식 콘텐츠를 추가합니다.',
      priority: 'HIGH',
      impact: 10,
      difficulty: 'MEDIUM',
      estimatedTime: '1-2주',
      actionItems: [
        {
          action: '제품/서비스별 FAQ 섹션 구축',
          description: '각 제품과 서비스에 맞춤형 FAQ 섹션 생성',
          examples: [
            '제품별 특징, 사용법, 문제해결 FAQ',
            '서비스 이용 방법, 결제, 취소/환불 FAQ',
            '기술 지원, 계정 관리, 보안 FAQ'
          ],
          expectedImpact: '고객 지원 문의 30% 감소, AI 답변 인용률 50% 증가'
        },
        {
          action: '산업/카테고리별 전문 FAQ 작성',
          description: '업계 전문 지식을 담은 깊이 있는 FAQ 콘텐츠',
          examples: [
            '업계 트렌드, 용어, 베스트 프랙티스 FAQ',
            '비교 분석, 선택 가이드, 추천 FAQ',
            '법률, 규정, 컴플라이언스 관련 FAQ'
          ],
          expectedImpact: '전문성 인식 40% 향상, 장문 질문 대응률 60% 증가'
        },
        {
          action: '고객 리뷰 기반 Q&A 생성',
          description: '실제 고객 리뷰에서 추출한 질문과 답변 작성',
          examples: [
            '부정 리뷰에서 개선이 필요한 질문 도출',
            '긍정 리뷰에서 강점을 강조하는 Q&A 작성',
            '고객 문의 데이터 분석하여 FAQ 우선순위 결정'
          ],
          expectedImpact: '고객 만족도 25% 증가, 실제 질문 대응률 70% 향상'
        },
        {
          action: '비교형 Q&A 콘텐츠',
          description: '경쟁사와의 비교, 옵션 선택을 돕는 Q&A',
          examples: [
            '"A vs B 제품 비교" 형식의 Q&A',
            '"어떤 옵션을 선택해야 할까요?" 형태의 가이드',
            '"언제/왜/어떻게" 형태의 의사결정 지원 Q&A'
          ],
          expectedImpact: '전환율 20% 증가, 고객 의사결정 시간 30% 단축'
        }
      ],
      contentTypes: ['FAQ', 'Q&A', '가이드', '비교 콘텐츠'],
      successMetrics: ['FAQ 개수', 'FAQ 페이지 조회수', 'AI 인용 횟수', '고객 문의 감소율']
    })
  }

  // 3. 통계 및 인용구 강화
  if (statisticsCount < 5 || citationCount < 3 || currentAEOScore < 70) {
    strategies.push({
      id: 'statistics-citations-enhancement',
      category: 'expert_content',
      title: '신뢰성 있는 통계 데이터 및 전문가 인용 추가',
      description: 'AI 엔진이 신뢰하고 인용할 수 있는 권위 있는 통계와 출처를 추가합니다.',
      priority: 'HIGH',
      impact: 8,
      difficulty: 'MEDIUM',
      estimatedTime: '1-2주',
      actionItems: [
        {
          action: '업계 통계 데이터 수집 및 시각화',
          description: '신뢰할 수 있는 소스에서 통계를 수집하고 표/그래프로 표현',
          examples: [
            '시장 조사 보고서 데이터 인용 (예: "2024년 한국 전자상거래 시장은 전년 대비 15% 성장")',
            '자체 데이터 분석 결과 공유 (예: "우리 고객의 80%가 1개월 내 재구매")',
            '정부 기관, 학술 기관 통계 인용'
          ],
          expectedImpact: '콘텐츠 신뢰도 45% 향상, 전문가 콘텐츠 인용률 60% 증가'
        },
        {
          action: '전문가 인용 및 인터뷰',
          description: '업계 전문가의 의견과 인용을 콘텐츠에 포함',
          examples: [
            '업계 리더 인터뷰 및 인용',
            '학술 논문, 연구 결과 인용',
            '인증 기관, 협회의 권위 있는 의견 인용'
          ],
          expectedImpact: '권위성 인식 50% 증가, 백링크 획득률 30% 향상'
        },
        {
          action: '케이스 스터디 및 성공 사례',
          description: '구체적인 데이터를 포함한 실사례 공유',
          examples: [
            '고객 성공 스토리 (구체적 수치 포함)',
            '프로젝트 결과 사례 연구',
            'A/B 테스트 결과 및 데이터'
          ],
          expectedImpact: '신뢰도 35% 증가, 전환율 18% 향상'
        },
        {
          action: '인포그래픽 및 데이터 시각화',
          description: '복잡한 통계를 이해하기 쉽게 시각화',
          examples: [
            '차트, 그래프로 데이터 표현',
            '인포그래픽으로 핵심 정보 전달',
            '대화형 데이터 시각화 도구 활용'
          ],
          expectedImpact: '콘텐츠 공유율 40% 증가, 체류 시간 30% 증가'
        }
      ],
      contentTypes: ['통계', '인용', '케이스 스터디', '인포그래픽', '데이터 시각화'],
      successMetrics: ['통계 데이터 개수', '인용 횟수', '신뢰도 지표', '백링크 횟수']
    })
  }

  // 4. 콘텐츠 구조화 (표/불렛포인트)
  if (!hasTableContent || currentAEOScore < 70) {
    strategies.push({
      id: 'content-structure-optimization',
      category: 'content_structure',
      title: '서술형 콘텐츠를 표/불렛포인트로 구조화',
      description: 'AI가 요약하고 인용하기 쉬운 구조화된 형식으로 콘텐츠를 재구성합니다.',
      priority: 'MEDIUM',
      impact: 7,
      difficulty: 'EASY',
      estimatedTime: '3-5일',
      actionItems: [
        {
          action: '비교 정보를 표(Table) 형식으로 전환',
          description: '제품 비교, 가격 비교, 기능 비교를 표로 구조화',
          examples: [
            '제품 사양 비교표',
            '가격 플랜 비교표',
            '서비스 특징 비교표',
            '옵션별 차이점 비교표'
          ],
          expectedImpact: 'AI 인용 용이성 50% 향상, 사용자 이해도 35% 증가'
        },
        {
          action: '핵심 정보를 불렛포인트로 정리',
          description: '긴 문단을 핵심 포인트로 추출하여 리스트 형식으로 표현',
          examples: [
            '주요 특징을 불렛포인트로 정리',
            '장점/단점을 구조화된 리스트로 표현',
            '단계별 가이드를 번호 리스트로 구성',
            '체크리스트 형식으로 정보 제공'
          ],
          expectedImpact: '가독성 40% 향상, 스캔 가능성 60% 증가'
        },
        {
          action: '데이터를 표 형식으로 구조화',
          description: '가격, 스펙, 통계 등 수치 데이터를 표로 정리',
          examples: [
            '가격 정보 표',
            '제품 스펙 표',
            '통계 데이터 표',
            '일정/타임라인 표'
          ],
          expectedImpact: '정보 검색 속도 45% 단축, 전환율 20% 증가'
        }
      ],
      contentTypes: ['표', '불렛포인트', '리스트', '체크리스트'],
      successMetrics: ['표 개수', '불렛포인트 사용 비율', '가독성 점수', 'AI 인용 용이성']
    })
  }

  // 5. 비디오 콘텐츠 전략
  if (!hasVideoContent || currentAEOScore < 70) {
    strategies.push({
      id: 'video-content-strategy',
      category: 'multimedia',
      title: '비디오 콘텐츠를 통한 AEO 최적화',
      description: 'YouTube 비디오와 비디오 FAQ를 활용하여 AI가 시각적 정보도 이해할 수 있도록 합니다.',
      priority: 'MEDIUM',
      impact: 6,
      difficulty: 'HARD',
      estimatedTime: '2-4주',
      actionItems: [
        {
          action: 'FAQ 비디오 제작',
          description: '자주 묻는 질문에 대한 비디오 답변 제작',
          examples: [
            '제품 사용법 비디오 튜토리얼',
            '문제 해결 가이드 비디오',
            '설치/설정 방법 비디오',
            '비교/리뷰 비디오'
          ],
          expectedImpact: 'YouTube 검색 노출 50% 증가, 체류 시간 60% 증가'
        },
        {
          action: '비디오 스크립트 구조화',
          description: '비디오 콘텐츠를 텍스트로도 접근 가능하게 구조화',
          examples: [
            '비디오 설명란에 타임스탬프와 주요 포인트 추가',
            '비디오 스크립트를 블로그 포스트로 변환',
            '비디오 자막(CC) 추가 및 최적화'
          ],
          expectedImpact: 'SEO 효과 40% 증가, 접근성 50% 향상'
        },
        {
          action: '비디오 썸네일 및 메타데이터 최적화',
          description: 'YouTube 검색과 AI 인식을 위한 메타데이터 최적화',
          examples: [
            '키워드가 포함된 제목 및 설명',
            '태그 및 카테고리 최적화',
            '썸네일에 핵심 정보 표시',
            'YouTube Shorts 활용'
          ],
          expectedImpact: 'YouTube 검색 랭킹 30% 향상, 조회수 45% 증가'
        }
      ],
      contentTypes: ['YouTube 비디오', '비디오 FAQ', '튜토리얼 비디오', 'YouTube Shorts'],
      successMetrics: ['비디오 조회수', 'YouTube 검색 랭킹', '평균 시청 시간', '구독자 증가율']
    })
  }

  // 6. 전문가 콘텐츠 및 권위 구축
  strategies.push({
    id: 'expert-authority-building',
    category: 'expert_content',
    title: '전문가 권위 콘텐츠 구축',
    description: '업계 전문가로 인정받을 수 있는 깊이 있는 콘텐츠를 지속적으로 발행합니다.',
    priority: currentAEOScore < 60 ? 'HIGH' : 'MEDIUM',
    impact: 9,
    difficulty: 'HARD',
    estimatedTime: '지속적 (월 2-4회)',
    actionItems: [
      {
        action: '연구 기반 백서/화이트페이퍼 작성',
        description: '업계 트렌드와 인사이트를 담은 깊이 있는 연구 콘텐츠',
        examples: [
          '시장 조사 보고서 발행',
          '트렌드 분석 백서',
          '업계 베스트 프랙티스 가이드',
          '데이터 기반 인사이트 리포트'
        ],
        expectedImpact: '전문성 인식 60% 향상, 백링크 획득률 80% 증가'
      },
      {
        action: '웹사이트에 About/팀 소개 강화',
        description: '전문가 팀과 회사 소개를 통해 권위 구축',
        examples: [
          '팀 멤버 전문성 강조',
          '수상 내역, 인증, 협회 멤버십 표시',
          '미디어 출연, 인터뷰 링크',
          '학력, 경력, 전문 분야 명시'
        ],
        expectedImpact: '신뢰도 35% 증가, E-E-A-T 점수 25% 향상'
      },
      {
        action: '게스트 포스팅 및 협업',
        description: '다른 권위 있는 사이트에 기고하고 협업',
        examples: [
          '업계 블로그에 게스트 포스팅',
          '언론 매체 기고',
          '팟캐스트 출연 및 협업',
          '웹inar 및 온라인 이벤트 개최'
        ],
        expectedImpact: '백링크 50% 증가, 도메인 권위 40% 향상'
      }
    ],
    contentTypes: ['백서', '화이트페이퍼', '연구 보고서', 'About 페이지', '게스트 포스팅'],
    successMetrics: ['백서 다운로드 수', '백링크 횟수', '도메인 권위', '전문성 지표']
  })

  // 7. 메타데이터 및 기술적 최적화
  strategies.push({
    id: 'metadata-technical-optimization',
    category: 'metadata',
    title: '메타데이터 및 기술적 AEO 최적화',
    description: 'AI가 콘텐츠를 더 잘 이해할 수 있도록 메타데이터와 기술적 요소를 최적화합니다.',
    priority: 'MEDIUM',
    impact: 6,
    difficulty: 'EASY',
    estimatedTime: '1주',
    actionItems: [
      {
        action: '메타 타이틀 및 디스크립션 최적화',
        description: '검색 엔진과 AI가 이해하기 쉬운 메타데이터 작성',
        examples: [
          '명확하고 구체적인 메타 타이틀 (60자 이내)',
          '핵심 키워드와 답변이 포함된 디스크립션 (160자 이내)',
          'FAQ 페이지는 질문이 타이틀에 포함되도록',
          '각 페이지별 고유한 메타데이터'
        ],
        expectedImpact: '검색 클릭률 25% 증가, AI 이해도 30% 향상'
      },
      {
        action: '헤딩 구조 최적화',
        description: '계층적 헤딩 구조로 콘텐츠 구조 명확화',
        examples: [
          'H1에는 주요 키워드와 질문 포함',
          'H2/H3로 섹션을 논리적으로 구분',
          'FAQ 섹션은 각 질문을 H2 또는 H3로 구성',
          '헤딩에 핵심 키워드 포함'
        ],
        expectedImpact: '콘텐츠 이해도 40% 향상, 구조 파악 용이성 50% 증가'
      },
      {
        action: '이미지 alt 텍스트 및 캡션 최적화',
        description: '이미지가 무엇을 보여주는지 명확히 설명',
        examples: [
          '모든 이미지에 의미 있는 alt 텍스트 추가',
          '차트/그래프는 데이터를 텍스트로도 설명',
          '이미지 캡션으로 추가 설명 제공',
          '파일명도 의미 있게 명명'
        ],
        expectedImpact: '접근성 60% 향상, 이미지 검색 노출 35% 증가'
      },
      {
        action: '내부 링크 구조 최적화',
        description: '관련 콘텐츠 간 논리적 연결 구조 구축',
        examples: [
          'FAQ 간 상호 링크',
          '관련 주제로 자연스러운 내부 링크',
          '상위/하위 페이지 계층 구조 명확화',
          '사이트맵 최적화'
        ],
        expectedImpact: '사이트 이해도 30% 향상, 체류 시간 25% 증가'
      }
    ],
    contentTypes: ['메타데이터', '헤딩', '이미지 최적화', '내부 링크'],
    successMetrics: ['메타데이터 완성도', '헤딩 구조 점수', '이미지 최적화율', '내부 링크 수']
  })

  // 우선순위 정렬 및 추천 순서 결정
  const recommendedOrder = strategies
    .sort((a, b) => {
      const priorityOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 }
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
      if (priorityDiff !== 0) return priorityDiff
      return b.impact - a.impact
    })
    .map(s => s.id)

  // 예상 영향 계산
  const expectedImpact = strategies.length > 0
    ? `AEO 점수 ${Math.min(100, currentAEOScore + (strategies.length * 8))}점 달성, AI 인용률 ${strategies.length * 15}% 증가, 자연 유입 트래픽 ${strategies.length * 20}% 증가 예상`
    : '현재 AEO 최적화 상태가 양호합니다. 지속적인 모니터링과 개선을 유지하세요.'

  return {
    overallScore: currentAEOScore,
    strategies,
    recommendedOrder,
    timeline: '3-6개월 (단계별 실행)',
    expectedImpact
  }
}
