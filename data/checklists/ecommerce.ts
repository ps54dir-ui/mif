/**
 * 전자상거래 (E-Commerce) 체크리스트
 * 100점 만점, 상품 페이지 최적화 및 전환 퍼널 중심
 */

import { ChecklistItem } from './organic_search'

export const ECOMMERCE_CHECKLIST: ChecklistItem[] = [
  // 상품 페이지 최적화 (30점) - 8개 항목
  {
    id: 'ecom-product-001',
    category: 'product_page_optimization',
    item: '상품 이미지 최적화',
    max_score: 4,
    description: '고해상도 이미지, 다각도 촬영, 줌 기능',
    rubric: {
      4: '완벽 (10장 이상, 다각도, 줌 기능, WebP 포맷)',
      3: '좋음 (5-10장, 기본 다각도)',
      2: '미흡 (3-5장, 단일 각도)',
      1: '나쁨 (3장 미만, 저해상도)'
    },
    industry_benchmark: [
      { score: 4, value: 'optimal', percentile: 99, label: '10장 이상 고품질 (상위 1%)' },
      { score: 3, value: 'good', percentile: 75, label: '5-10장 양호 (상위 25%)' },
      { score: 2, value: 'partial', percentile: 50, label: '3-5장 기본 (중앙값)' },
      { score: 1, value: 'poor', percentile: 25, label: '3장 미만 (하위 25%)' }
    ],
    improvement_actions: [
      '상품 이미지 10장 이상 확보 (정면, 측면, 뒷면, 디테일)',
      '고해상도 이미지 사용 (최소 1000x1000px)',
      'WebP 포맷으로 최적화 (로딩 속도 개선)',
      '이미지 줌 기능 추가',
      '360도 뷰 또는 비디오 추가'
    ],
    expected_improvement: {
      score_increase: 2,
      cvr_impact: 8,
      description: '이미지 최적화 완료 시 +2점, CVR +8% (시각적 신뢰도 증가)'
    },
    priority: 'high',
    checked: false
  },
  {
    id: 'ecom-product-002',
    category: 'product_page_optimization',
    item: '상품 스키마 마크업',
    max_score: 4,
    description: 'Product 스키마, 가격, 리뷰, 재고 정보',
    rubric: {
      4: '완벽 (모든 스키마 포함, 검증 완료)',
      3: '좋음 (기본 스키마 포함)',
      2: '미흡 (일부 스키마만)',
      1: '나쁨 (스키마 없음)'
    },
    industry_benchmark: [
      { score: 4, value: 'complete', percentile: 99, label: '모든 스키마 완료 (상위 1%)' },
      { score: 3, value: 'basic', percentile: 75, label: '기본 스키마 (상위 25%)' },
      { score: 2, value: 'partial', percentile: 50, label: '일부 스키마 (중앙값)' },
      { score: 1, value: 'none', percentile: 25, label: '스키마 없음 (하위 25%)' }
    ],
    improvement_actions: [
      'Product 스키마 마크업 추가 (가격, 재고, 평점)',
      'Review 스키마 추가 (리뷰 평점 표시)',
      'BreadcrumbList 스키마 추가',
      'Google Rich Results 테스트 도구로 검증',
      'AggregateRating 스키마 추가'
    ],
    expected_improvement: {
      score_increase: 2,
      cvr_impact: 5,
      description: '스키마 마크업 완료 시 +2점, CVR +5% (검색 결과 개선)'
    },
    priority: 'high',
    checked: false
  },
  {
    id: 'ecom-product-003',
    category: 'product_page_optimization',
    item: '상품 설명 최적화',
    max_score: 4,
    description: '상세 설명, 스펙, 사용법, FAQ',
    rubric: {
      4: '완벽 (상세 설명, 스펙, FAQ, 비디오)',
      3: '좋음 (상세 설명, 기본 스펙)',
      2: '미흡 (간단한 설명만)',
      1: '나쁨 (설명 없음)'
    },
    industry_benchmark: [
      { score: 4, value: 'comprehensive', percentile: 99, label: '포괄적 설명 (상위 1%)' },
      { score: 3, value: 'detailed', percentile: 75, label: '상세 설명 (상위 25%)' },
      { score: 2, value: 'basic', percentile: 50, label: '기본 설명 (중앙값)' },
      { score: 1, value: 'minimal', percentile: 25, label: '최소 설명 (하위 25%)' }
    ],
    improvement_actions: [
      '상품 상세 설명 500자 이상 작성',
      '제품 스펙 표 형식으로 정리',
      '사용법, 주의사항 포함',
      'FAQ 섹션 추가',
      '비디오 리뷰 또는 사용 영상 추가'
    ],
    expected_improvement: {
      score_increase: 2,
      cvr_impact: 6,
      description: '상품 설명 최적화 시 +2점, CVR +6% (정보 제공으로 신뢰도 증가)'
    },
    priority: 'high',
    checked: false
  },
  {
    id: 'ecom-product-004',
    category: 'product_page_optimization',
    item: '가격 표시 및 할인 정보',
    max_score: 3,
    description: '명확한 가격, 할인율, 배송비',
    rubric: {
      3: '완벽 (가격, 할인율, 배송비 명확)',
      2: '좋음 (가격, 할인율 표시)',
      1: '나쁨 (가격만 표시)'
    },
    industry_benchmark: [
      { score: 3, value: 'complete', percentile: 99, label: '모든 정보 표시 (상위 1%)' },
      { score: 2, value: 'partial', percentile: 75, label: '일부 정보 (상위 25%)' },
      { score: 1, value: 'basic', percentile: 50, label: '기본 정보 (중앙값)' }
    ],
    improvement_actions: [
      '정가와 할인가 명확히 표시',
      '할인율 퍼센트 표시',
      '배송비 정보 명확히 표시',
      '무료배송 조건 표시',
      '가격 비교 정보 제공 (경쟁사 대비)'
    ],
    expected_improvement: {
      score_increase: 1,
      cvr_impact: 4,
      description: '가격 정보 명확화 시 +1점, CVR +4% (가격 투명성 증가)'
    },
    priority: 'medium',
    checked: false
  },
  {
    id: 'ecom-product-005',
    category: 'product_page_optimization',
    item: '리뷰 및 평점 표시',
    max_score: 4,
    description: '리뷰 수, 평점, 사진 리뷰 비율',
    rubric: {
      4: '완벽 (100개 이상, 4.5점 이상, 사진 리뷰 30% 이상)',
      3: '좋음 (50-100개, 4.0점 이상)',
      2: '미흡 (10-50개, 3.5점 이상)',
      1: '나쁨 (10개 미만)'
    },
    industry_benchmark: [
      { score: 4, value: 'excellent', percentile: 99, label: '100개 이상, 4.5점 이상 (상위 1%)' },
      { score: 3, value: 'good', percentile: 75, label: '50-100개, 4.0점 이상 (상위 25%)' },
      { score: 2, value: 'fair', percentile: 50, label: '10-50개, 3.5점 이상 (중앙값)' },
      { score: 1, value: 'poor', percentile: 25, label: '10개 미만 (하위 25%)' }
    ],
    improvement_actions: [
      '리뷰 수집 전략 수립 (구매 후 이메일, 인센티브)',
      '리뷰 평점 4.5점 이상 목표',
      '사진 리뷰 유도 (추가 혜택 제공)',
      '리뷰 필터링 기능 (별점, 키워드)',
      '리뷰 답변 관리 (판매자 답변)'
    ],
    expected_improvement: {
      score_increase: 2,
      cvr_impact: 10,
      description: '리뷰 최적화 시 +2점, CVR +10% (사회적 증거 강화)'
    },
    priority: 'high',
    checked: false
  },
  {
    id: 'ecom-product-006',
    category: 'product_page_optimization',
    item: 'CTA 버튼 최적화',
    max_score: 3,
    description: '장바구니, 바로구매 버튼 위치 및 디자인',
    rubric: {
      3: '완벽 (명확한 위치, 큰 버튼, 스크롤 고정)',
      2: '좋음 (명확한 위치, 적절한 크기)',
      1: '나쁨 (불명확한 위치, 작은 버튼)'
    },
    industry_benchmark: [
      { score: 3, value: 'optimal', percentile: 99, label: '최적화 완료 (상위 1%)' },
      { score: 2, value: 'good', percentile: 75, label: '양호 (상위 25%)' },
      { score: 1, value: 'poor', percentile: 50, label: '개선 필요 (중앙값)' }
    ],
    improvement_actions: [
      'CTA 버튼 상단 고정 (스크롤 시에도 보임)',
      '버튼 크기 확대 (최소 44x44px)',
      '명확한 문구 사용 ("지금 구매하기", "장바구니 담기")',
      '색상 대비 강화 (눈에 띄는 색상)',
      '마이크로 인터랙션 추가 (호버 효과)'
    ],
    expected_improvement: {
      score_increase: 1,
      cvr_impact: 5,
      description: 'CTA 최적화 시 +1점, CVR +5% (클릭률 증가)'
    },
    priority: 'high',
    checked: false
  },
  {
    id: 'ecom-product-007',
    category: 'product_page_optimization',
    item: '재고 정보 표시',
    max_score: 3,
    description: '재고 수량, 품절 알림, 재입고 알림',
    rubric: {
      3: '완벽 (실시간 재고, 품절 알림, 재입고 알림)',
      2: '좋음 (재고 정보 표시)',
      1: '나쁨 (재고 정보 없음)'
    },
    industry_benchmark: [
      { score: 3, value: 'real_time', percentile: 99, label: '실시간 재고 (상위 1%)' },
      { score: 2, value: 'basic', percentile: 75, label: '기본 재고 정보 (상위 25%)' },
      { score: 1, value: 'none', percentile: 50, label: '재고 정보 없음 (중앙값)' }
    ],
    improvement_actions: [
      '실시간 재고 수량 표시',
      '재고 부족 시 경고 메시지',
      '품절 시 재입고 알림 기능',
      '재고 소진 임박 표시 (희소성)',
      '재고 정보 API 연동'
    ],
    expected_improvement: {
      score_increase: 1,
      cvr_impact: 3,
      description: '재고 정보 표시 시 +1점, CVR +3% (신뢰도 및 긴급성 증가)'
    },
    priority: 'medium',
    checked: false
  },
  {
    id: 'ecom-product-008',
    category: 'product_page_optimization',
    item: '배송 정보 명확화',
    max_score: 3,
    description: '배송비, 배송 기간, 배송 옵션',
    rubric: {
      3: '완벽 (배송비, 기간, 옵션 모두 명확)',
      2: '좋음 (배송비, 기간 표시)',
      1: '나쁨 (배송 정보 불명확)'
    },
    industry_benchmark: [
      { score: 3, value: 'complete', percentile: 99, label: '모든 정보 명확 (상위 1%)' },
      { score: 2, value: 'partial', percentile: 75, label: '일부 정보 (상위 25%)' },
      { score: 1, value: 'unclear', percentile: 50, label: '정보 불명확 (중앙값)' }
    ],
    improvement_actions: [
      '배송비 명확히 표시 (무료배송 조건 포함)',
      '배송 기간 표시 (예: 2-3일)',
      '배송 옵션 제공 (일반, 당일, 익일)',
      '배송 추적 기능 제공',
      '반품/교환 정책 명확히 표시'
    ],
    expected_improvement: {
      score_increase: 1,
      cvr_impact: 4,
      description: '배송 정보 명확화 시 +1점, CVR +4% (신뢰도 증가)'
    },
    priority: 'medium',
    checked: false
  },

  // 전환 퍼널 최적화 (25점) - 7개 항목
  {
    id: 'ecom-funnel-001',
    category: 'conversion_funnel',
    item: '장바구니 페이지 최적화',
    max_score: 4,
    description: '장바구니 이탈 방지, 관련 상품 추천',
    rubric: {
      4: '완벽 (이탈 방지, 추천, 쿠폰 적용)',
      3: '좋음 (기본 최적화)',
      2: '미흡 (일부 최적화)',
      1: '나쁨 (최적화 없음)'
    },
    industry_benchmark: [
      { score: 4, value: 'optimal', percentile: 99, label: '완벽 최적화 (상위 1%)' },
      { score: 3, value: 'good', percentile: 75, label: '양호 (상위 25%)' },
      { score: 2, value: 'partial', percentile: 50, label: '일부 (중앙값)' },
      { score: 1, value: 'poor', percentile: 25, label: '미흡 (하위 25%)' }
    ],
    improvement_actions: [
      '장바구니 이탈 방지 팝업 (할인 쿠폰 제공)',
      '관련 상품 추천 (추가 구매 유도)',
      '쿠폰 적용 기능',
      '무료배송 달성 알림',
      '장바구니 저장 기능 (나중에 구매)'
    ],
    expected_improvement: {
      score_increase: 2,
      cvr_impact: 8,
      description: '장바구니 최적화 시 +2점, CVR +8% (이탈률 감소)'
    },
    priority: 'high',
    checked: false
  },
  {
    id: 'ecom-funnel-002',
    category: 'conversion_funnel',
    item: '결제 프로세스 단순화',
    max_score: 4,
    description: '결제 단계 최소화, 게스트 체크아웃',
    rubric: {
      4: '완벽 (1단계 결제, 게스트 체크아웃)',
      3: '좋음 (2단계 결제)',
      2: '미흡 (3단계 결제)',
      1: '나쁨 (4단계 이상)'
    },
    industry_benchmark: [
      { score: 4, value: 'one_step', percentile: 99, label: '1단계 결제 (상위 1%)' },
      { score: 3, value: 'two_step', percentile: 75, label: '2단계 결제 (상위 25%)' },
      { score: 2, value: 'three_step', percentile: 50, label: '3단계 결제 (중앙값)' },
      { score: 1, value: 'four_plus', percentile: 25, label: '4단계 이상 (하위 25%)' }
    ],
    improvement_actions: [
      '결제 단계 최소화 (1-2단계 목표)',
      '게스트 체크아웃 옵션 제공',
      '결제 정보 자동 저장',
      '다양한 결제 수단 제공',
      '결제 진행률 표시 (프로그레스 바)'
    ],
    expected_improvement: {
      score_increase: 2,
      cvr_impact: 12,
      description: '결제 단순화 시 +2점, CVR +12% (이탈률 대폭 감소)'
    },
    priority: 'high',
    checked: false
  },
  {
    id: 'ecom-funnel-003',
    category: 'conversion_funnel',
    item: '이탈 방지 전략',
    max_score: 4,
    description: '이탈 시 팝업, 할인 쿠폰, 재방문 유도',
    rubric: {
      4: '완벽 (스마트 팝업, 개인화 쿠폰)',
      3: '좋음 (기본 팝업, 쿠폰)',
      2: '미흡 (간단한 팝업)',
      1: '나쁨 (이탈 방지 없음)'
    },
    industry_benchmark: [
      { score: 4, value: 'smart', percentile: 99, label: '스마트 팝업 (상위 1%)' },
      { score: 3, value: 'basic', percentile: 75, label: '기본 팝업 (상위 25%)' },
      { score: 2, value: 'simple', percentile: 50, label: '간단한 팝업 (중앙값)' },
      { score: 1, value: 'none', percentile: 25, label: '이탈 방지 없음 (하위 25%)' }
    ],
    improvement_actions: [
      '이탈 시 할인 쿠폰 팝업',
      '개인화된 메시지 (장바구니 상품 기반)',
      '재방문 유도 이메일',
      '리타겟팅 광고 연동',
      'A/B 테스트로 최적 팝업 찾기'
    ],
    expected_improvement: {
      score_increase: 2,
      cvr_impact: 7,
      description: '이탈 방지 전략 시 +2점, CVR +7% (재방문 증가)'
    },
    priority: 'high',
    checked: false
  },
  {
    id: 'ecom-funnel-004',
    category: 'conversion_funnel',
    item: '신뢰 요소 표시',
    max_score: 3,
    description: '보안 배지, 결제 보호, 환불 정책',
    rubric: {
      3: '완벽 (모든 신뢰 요소 표시)',
      2: '좋음 (일부 신뢰 요소)',
      1: '나쁨 (신뢰 요소 없음)'
    },
    industry_benchmark: [
      { score: 3, value: 'complete', percentile: 99, label: '모든 요소 (상위 1%)' },
      { score: 2, value: 'partial', percentile: 75, label: '일부 요소 (상위 25%)' },
      { score: 1, value: 'none', percentile: 50, label: '요소 없음 (중앙값)' }
    ],
    improvement_actions: [
      'SSL 인증서 배지 표시',
      '결제 보호 서비스 로고',
      '환불/교환 정책 명확히 표시',
      '고객센터 연락처 표시',
      '인증 마크 표시 (신뢰도 향상)'
    ],
    expected_improvement: {
      score_increase: 1,
      cvr_impact: 5,
      description: '신뢰 요소 표시 시 +1점, CVR +5% (구매 안심감 증가)'
    },
    priority: 'medium',
    checked: false
  },
  {
    id: 'ecom-funnel-005',
    category: 'conversion_funnel',
    item: '추가 구매 유도',
    max_score: 3,
    description: '관련 상품, 번들 상품, 크로스셀',
    rubric: {
      3: '완벽 (스마트 추천, 번들 할인)',
      2: '좋음 (기본 추천)',
      1: '나쁨 (추천 없음)'
    },
    industry_benchmark: [
      { score: 3, value: 'smart', percentile: 99, label: '스마트 추천 (상위 1%)' },
      { score: 2, value: 'basic', percentile: 75, label: '기본 추천 (상위 25%)' },
      { score: 1, value: 'none', percentile: 50, label: '추천 없음 (중앙값)' }
    ],
    improvement_actions: [
      'AI 기반 상품 추천',
      '번들 상품 할인 제공',
      '함께 구매한 상품 추천',
      'AOV 증가 목표 설정',
      '추가 구매 시 할인 쿠폰'
    ],
    expected_improvement: {
      score_increase: 1,
      cvr_impact: 6,
      description: '추가 구매 유도 시 +1점, AOV +6% (평균 주문 금액 증가)'
    },
    priority: 'medium',
    checked: false
  },
  {
    id: 'ecom-funnel-006',
    category: 'conversion_funnel',
    item: '모바일 최적화',
    max_score: 4,
    description: '모바일 결제, 터치 최적화, 빠른 로딩',
    rubric: {
      4: '완벽 (모바일 우선, 빠른 로딩)',
      3: '좋음 (모바일 최적화)',
      2: '미흡 (기본 반응형)',
      1: '나쁨 (모바일 미최적화)'
    },
    industry_benchmark: [
      { score: 4, value: 'mobile_first', percentile: 99, label: '모바일 우선 (상위 1%)' },
      { score: 3, value: 'optimized', percentile: 75, label: '최적화 완료 (상위 25%)' },
      { score: 2, value: 'responsive', percentile: 50, label: '기본 반응형 (중앙값)' },
      { score: 1, value: 'poor', percentile: 25, label: '미최적화 (하위 25%)' }
    ],
    improvement_actions: [
      '모바일 우선 디자인',
      '터치 타겟 크기 확대 (44x44px)',
      '모바일 결제 간소화',
      '로딩 속도 최적화 (3초 이하)',
      '모바일 앱 연동 (앱 딥링크)'
    ],
    expected_improvement: {
      score_increase: 2,
      cvr_impact: 9,
      description: '모바일 최적화 시 +2점, CVR +9% (모바일 전환율 증가)'
    },
    priority: 'high',
    checked: false
  },
  {
    id: 'ecom-funnel-007',
    category: 'conversion_funnel',
    item: '구매 후 경험 최적화',
    max_score: 3,
    description: '주문 확인, 배송 알림, 리뷰 유도',
    rubric: {
      3: '완벽 (자동화된 커뮤니케이션)',
      2: '좋음 (기본 알림)',
      1: '나쁨 (알림 없음)'
    },
    industry_benchmark: [
      { score: 3, value: 'automated', percentile: 99, label: '완전 자동화 (상위 1%)' },
      { score: 2, value: 'basic', percentile: 75, label: '기본 알림 (상위 25%)' },
      { score: 1, value: 'none', percentile: 50, label: '알림 없음 (중앙값)' }
    ],
    improvement_actions: [
      '주문 확인 이메일 자동 발송',
      '배송 알림 SMS/이메일',
      '배송 추적 링크 제공',
      '구매 후 리뷰 유도 (인센티브)',
      '재구매 쿠폰 제공'
    ],
    expected_improvement: {
      score_increase: 1,
      cvr_impact: 4,
      description: '구매 후 경험 최적화 시 +1점, 재구매율 +4%'
    },
    priority: 'medium',
    checked: false
  },

  // SEO & 스키마 마크업 (20점) - 5개 항목
  {
    id: 'ecom-seo-001',
    category: 'seo_schema',
    item: '상품 페이지 SEO',
    max_score: 4,
    description: '상품명, 설명, 키워드 최적화',
    rubric: {
      4: '완벽 (키워드 최적화, 메타 태그)',
      3: '좋음 (기본 SEO)',
      2: '미흡 (일부 SEO)',
      1: '나쁨 (SEO 없음)'
    },
    industry_benchmark: [
      { score: 4, value: 'optimal', percentile: 99, label: '완벽 최적화 (상위 1%)' },
      { score: 3, value: 'good', percentile: 75, label: '양호 (상위 25%)' },
      { score: 2, value: 'partial', percentile: 50, label: '일부 (중앙값)' },
      { score: 1, value: 'poor', percentile: 25, label: '미흡 (하위 25%)' }
    ],
    improvement_actions: [
      '상품명에 키워드 포함',
      '상품 설명 SEO 최적화',
      '메타 타이틀, 설명 최적화',
      'URL 구조 최적화',
      '이미지 Alt 텍스트 최적화'
    ],
    expected_improvement: {
      score_increase: 2,
      cvr_impact: 4,
      description: 'SEO 최적화 시 +2점, 유기 검색 트래픽 +4%'
    },
    priority: 'high',
    checked: false
  },
  {
    id: 'ecom-seo-002',
    category: 'seo_schema',
    item: '카테고리 페이지 최적화',
    max_score: 4,
    description: '카테고리 설명, 필터, 페이지네이션',
    rubric: {
      4: '완벽 (설명, 필터, SEO)',
      3: '좋음 (기본 최적화)',
      2: '미흡 (일부 최적화)',
      1: '나쁨 (최적화 없음)'
    },
    industry_benchmark: [
      { score: 4, value: 'optimal', percentile: 99, label: '완벽 최적화 (상위 1%)' },
      { score: 3, value: 'good', percentile: 75, label: '양호 (상위 25%)' },
      { score: 2, value: 'partial', percentile: 50, label: '일부 (중앙값)' },
      { score: 1, value: 'poor', percentile: 25, label: '미흡 (하위 25%)' }
    ],
    improvement_actions: [
      '카테고리 설명 추가 (200자 이상)',
      '필터 기능 최적화',
      '페이지네이션 SEO 최적화',
      '카테고리별 메타 태그',
      '카테고리 이미지 최적화'
    ],
    expected_improvement: {
      score_increase: 2,
      cvr_impact: 3,
      description: '카테고리 최적화 시 +2점, 카테고리 페이지 트래픽 +3%'
    },
    priority: 'medium',
    checked: false
  },
  {
    id: 'ecom-seo-003',
    category: 'seo_schema',
    item: '리뷰 스키마 마크업',
    max_score: 4,
    description: 'Review 스키마, AggregateRating',
    rubric: {
      4: '완벽 (모든 리뷰 스키마)',
      3: '좋음 (기본 스키마)',
      2: '미흡 (일부 스키마)',
      1: '나쁨 (스키마 없음)'
    },
    industry_benchmark: [
      { score: 4, value: 'complete', percentile: 99, label: '완전 구현 (상위 1%)' },
      { score: 3, value: 'basic', percentile: 75, label: '기본 구현 (상위 25%)' },
      { score: 2, value: 'partial', percentile: 50, label: '일부 구현 (중앙값)' },
      { score: 1, value: 'none', percentile: 25, label: '구현 없음 (하위 25%)' }
    ],
    improvement_actions: [
      'Review 스키마 마크업 추가',
      'AggregateRating 스키마 추가',
      '리뷰 평점 검색 결과 표시',
      'Google Rich Results 테스트',
      '리뷰 데이터 구조화'
    ],
    expected_improvement: {
      score_increase: 2,
      cvr_impact: 6,
      description: '리뷰 스키마 시 +2점, 검색 결과 클릭률 +6%'
    },
    priority: 'high',
    checked: false
  },
  {
    id: 'ecom-seo-004',
    category: 'seo_schema',
    item: 'FAQ 스키마 마크업',
    max_score: 4,
    description: 'FAQPage 스키마, 검색 결과 표시',
    rubric: {
      4: '완벽 (FAQ 스키마, 검색 표시)',
      3: '좋음 (FAQ 스키마)',
      2: '미흡 (FAQ만 있음)',
      1: '나쁨 (FAQ 없음)'
    },
    industry_benchmark: [
      { score: 4, value: 'schema', percentile: 99, label: '스키마 완료 (상위 1%)' },
      { score: 3, value: 'faq', percentile: 75, label: 'FAQ 있음 (상위 25%)' },
      { score: 2, value: 'partial', percentile: 50, label: '일부 FAQ (중앙값)' },
      { score: 1, value: 'none', percentile: 25, label: 'FAQ 없음 (하위 25%)' }
    ],
    improvement_actions: [
      'FAQ 섹션 추가 (10개 이상)',
      'FAQPage 스키마 마크업',
      '검색 결과 FAQ 표시',
      '고객 문의 기반 FAQ 작성',
      'FAQ 정기 업데이트'
    ],
    expected_improvement: {
      score_increase: 2,
      cvr_impact: 4,
      description: 'FAQ 스키마 시 +2점, 검색 트래픽 +4%'
    },
    priority: 'medium',
    checked: false
  },
  {
    id: 'ecom-seo-005',
    category: 'seo_schema',
    item: '사이트맵 및 인덱싱',
    max_score: 4,
    description: 'XML 사이트맵, robots.txt, 인덱싱 최적화',
    rubric: {
      4: '완벽 (사이트맵, 인덱싱 완료)',
      3: '좋음 (기본 설정)',
      2: '미흡 (일부 설정)',
      1: '나쁨 (설정 없음)'
    },
    industry_benchmark: [
      { score: 4, value: 'complete', percentile: 99, label: '완전 설정 (상위 1%)' },
      { score: 3, value: 'basic', percentile: 75, label: '기본 설정 (상위 25%)' },
      { score: 2, value: 'partial', percentile: 50, label: '일부 설정 (중앙값)' },
      { score: 1, value: 'none', percentile: 25, label: '설정 없음 (하위 25%)' }
    ],
    improvement_actions: [
      'XML 사이트맵 생성 및 제출',
      'robots.txt 최적화',
      '상품 페이지 인덱싱 확인',
      '중복 콘텐츠 제거',
      '검색 콘솔 모니터링'
    ],
    expected_improvement: {
      score_increase: 2,
      cvr_impact: 3,
      description: '인덱싱 최적화 시 +2점, 검색 노출 +3%'
    },
    priority: 'medium',
    checked: false
  },

  // 광고 최적화 (15점) - 4개 항목
  {
    id: 'ecom-ads-001',
    category: 'advertising',
    item: 'Meta Ads 최적화',
    max_score: 4,
    description: '타겟팅, 크리에이티브, 전환 추적',
    rubric: {
      4: '완벽 (고급 타겟팅, A/B 테스트)',
      3: '좋음 (기본 타겟팅)',
      2: '미흡 (광범위 타겟팅)',
      1: '나쁨 (타겟팅 없음)'
    },
    industry_benchmark: [
      { score: 4, value: 'advanced', percentile: 99, label: '고급 타겟팅 (상위 1%)' },
      { score: 3, value: 'basic', percentile: 75, label: '기본 타겟팅 (상위 25%)' },
      { score: 2, value: 'broad', percentile: 50, label: '광범위 타겟팅 (중앙값)' },
      { score: 1, value: 'none', percentile: 25, label: '타겟팅 없음 (하위 25%)' }
    ],
    improvement_actions: [
      '고급 타겟팅 설정 (관심사, 행동)',
      '리타겟팅 캠페인 운영',
      'A/B 테스트 (크리에이티브, 타겟팅)',
      '전환 추적 설정 (픽셀)',
      '동적 광고 활용'
    ],
    expected_improvement: {
      score_increase: 2,
      cvr_impact: 8,
      description: 'Meta Ads 최적화 시 +2점, ROAS +8%'
    },
    priority: 'high',
    checked: false
  },
  {
    id: 'ecom-ads-002',
    category: 'advertising',
    item: 'Google Shopping 광고',
    max_score: 4,
    description: '상품 피드, 쇼핑 광고 최적화',
    rubric: {
      4: '완벽 (피드 최적화, 광고 운영)',
      3: '좋음 (기본 피드)',
      2: '미흡 (피드만 있음)',
      1: '나쁨 (피드 없음)'
    },
    industry_benchmark: [
      { score: 4, value: 'optimal', percentile: 99, label: '완벽 최적화 (상위 1%)' },
      { score: 3, value: 'basic', percentile: 75, label: '기본 피드 (상위 25%)' },
      { score: 2, value: 'partial', percentile: 50, label: '일부 피드 (중앙값)' },
      { score: 1, value: 'none', percentile: 25, label: '피드 없음 (하위 25%)' }
    ],
    improvement_actions: [
      'Google Merchant Center 등록',
      '상품 피드 최적화 (이미지, 가격, 설명)',
      '쇼핑 광고 캠페인 운영',
      '피드 정기 업데이트',
      '성과 모니터링 및 최적화'
    ],
    expected_improvement: {
      score_increase: 2,
      cvr_impact: 7,
      description: 'Shopping 광고 시 +2점, 쇼핑 트래픽 +7%'
    },
    priority: 'high',
    checked: false
  },
  {
    id: 'ecom-ads-003',
    category: 'advertising',
    item: '리타겟팅 전략',
    max_score: 4,
    description: '이탈 고객 리타겟팅, 동적 광고',
    rubric: {
      4: '완벽 (다채널 리타겟팅)',
      3: '좋음 (기본 리타겟팅)',
      2: '미흡 (일부 리타겟팅)',
      1: '나쁨 (리타겟팅 없음)'
    },
    industry_benchmark: [
      { score: 4, value: 'multi_channel', percentile: 99, label: '다채널 리타겟팅 (상위 1%)' },
      { score: 3, value: 'basic', percentile: 75, label: '기본 리타겟팅 (상위 25%)' },
      { score: 2, value: 'partial', percentile: 50, label: '일부 리타겟팅 (중앙값)' },
      { score: 1, value: 'none', percentile: 25, label: '리타겟팅 없음 (하위 25%)' }
    ],
    improvement_actions: [
      '이탈 고객 리타겟팅 캠페인',
      '장바구니 이탈 리타겟팅',
      '동적 제품 광고 (DPA)',
      '다채널 리타겟팅 (Meta, Google)',
      '리타겟팅 빈도 관리'
    ],
    expected_improvement: {
      score_increase: 2,
      cvr_impact: 10,
      description: '리타겟팅 시 +2점, 재방문 전환율 +10%'
    },
    priority: 'high',
    checked: false
  },
  {
    id: 'ecom-ads-004',
    category: 'advertising',
    item: '광고 성과 분석',
    max_score: 3,
    description: 'ROAS 추적, 전환 분석, 최적화',
    rubric: {
      3: '완벽 (실시간 분석, 최적화)',
      2: '좋음 (기본 분석)',
      1: '나쁨 (분석 없음)'
    },
    industry_benchmark: [
      { score: 3, value: 'real_time', percentile: 99, label: '실시간 분석 (상위 1%)' },
      { score: 2, value: 'basic', percentile: 75, label: '기본 분석 (상위 25%)' },
      { score: 1, value: 'none', percentile: 50, label: '분석 없음 (중앙값)' }
    ],
    improvement_actions: [
      'ROAS 추적 설정',
      '전환 경로 분석',
      '캠페인별 성과 비교',
      'A/B 테스트 결과 분석',
      '주간/월간 리포트 작성'
    ],
    expected_improvement: {
      score_increase: 1,
      cvr_impact: 5,
      description: '성과 분석 시 +1점, 광고 효율 +5%'
    },
    priority: 'medium',
    checked: false
  },

  // 재구매 전략 (10점) - 3개 항목
  {
    id: 'ecom-retention-001',
    category: 'repurchase_strategy',
    item: '이메일 마케팅',
    max_score: 4,
    description: '뉴스레터, 재구매 유도, 개인화',
    rubric: {
      4: '완벽 (개인화, 자동화)',
      3: '좋음 (기본 이메일)',
      2: '미흡 (일부 이메일)',
      1: '나쁨 (이메일 없음)'
    },
    industry_benchmark: [
      { score: 4, value: 'personalized', percentile: 99, label: '개인화 완료 (상위 1%)' },
      { score: 3, value: 'basic', percentile: 75, label: '기본 이메일 (상위 25%)' },
      { score: 2, value: 'partial', percentile: 50, label: '일부 이메일 (중앙값)' },
      { score: 1, value: 'none', percentile: 25, label: '이메일 없음 (하위 25%)' }
    ],
    improvement_actions: [
      '구매 후 이메일 시퀀스',
      '재구매 유도 이메일 (할인 쿠폰)',
      '개인화된 상품 추천',
      '이메일 오픈율, 클릭률 최적화',
      'A/B 테스트 (제목, 내용)'
    ],
    expected_improvement: {
      score_increase: 2,
      cvr_impact: 6,
      description: '이메일 마케팅 시 +2점, 재구매율 +6%'
    },
    priority: 'high',
    checked: false
  },
  {
    id: 'ecom-retention-002',
    category: 'repurchase_strategy',
    item: '로열티 프로그램',
    max_score: 3,
    description: '포인트, 적립금, 멤버십',
    rubric: {
      3: '완벽 (포인트, 멤버십)',
      2: '좋음 (기본 포인트)',
      1: '나쁨 (로열티 없음)'
    },
    industry_benchmark: [
      { score: 3, value: 'complete', percentile: 99, label: '완전 프로그램 (상위 1%)' },
      { score: 2, value: 'basic', percentile: 75, label: '기본 포인트 (상위 25%)' },
      { score: 1, value: 'none', percentile: 50, label: '프로그램 없음 (중앙값)' }
    ],
    improvement_actions: [
      '포인트 적립 시스템 구축',
      '멤버십 등급 제도',
      '생일 쿠폰, 특별 혜택',
      'VIP 고객 관리',
      '로열티 프로그램 마케팅'
    ],
    expected_improvement: {
      score_increase: 1,
      cvr_impact: 8,
      description: '로열티 프로그램 시 +1점, 재구매율 +8%'
    },
    priority: 'medium',
    checked: false
  },
  {
    id: 'ecom-retention-003',
    category: 'repurchase_strategy',
    item: '재구매 쿠폰 전략',
    max_score: 3,
    description: '구매 후 쿠폰, 생일 쿠폰, 시즌 쿠폰',
    rubric: {
      3: '완벽 (자동화, 개인화)',
      2: '좋음 (기본 쿠폰)',
      1: '나쁨 (쿠폰 없음)'
    },
    industry_benchmark: [
      { score: 3, value: 'automated', percentile: 99, label: '자동화 완료 (상위 1%)' },
      { score: 2, value: 'basic', percentile: 75, label: '기본 쿠폰 (상위 25%)' },
      { score: 1, value: 'none', percentile: 50, label: '쿠폰 없음 (중앙값)' }
    ],
    improvement_actions: [
      '구매 후 자동 쿠폰 발급',
      '생일 쿠폰 자동 발송',
      '장기 미구매 고객 재유도 쿠폰',
      '시즌별 특별 쿠폰',
      '쿠폰 사용률 분석 및 최적화'
    ],
    expected_improvement: {
      score_increase: 1,
      cvr_impact: 5,
      description: '재구매 쿠폰 시 +1점, 재구매율 +5%'
    },
    priority: 'medium',
    checked: false
  }
]
