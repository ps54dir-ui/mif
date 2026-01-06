/**
 * 각 항목의 "왜 중요한가?" 설명 문서
 * 계산 공식, 근거, 데이터 출처 포함
 */

export interface ImportanceDocumentation {
  itemId: string
  itemName: string
  whyImportant: string
  calculationFormula: string
  evidence: string
  dataSource: string
  cvrConnection: string
  researchLinks: string[]
}

/**
 * SEO 항목별 중요성 설명
 */
export const SEO_IMPORTANCE_DOCS: Record<string, ImportanceDocumentation> = {
  'seo-tech-001': {
    itemId: 'seo-tech-001',
    itemName: '페이지 로딩 속도',
    whyImportant: '페이지 로딩 속도는 사용자 경험과 검색 순위에 직접적인 영향을 미칩니다. Google의 연구에 따르면 로딩 시간이 1초에서 3초로 증가하면 이탈률이 32% 증가하고, 5초로 증가하면 90% 증가합니다. 또한 Google은 페이지 속도를 검색 순위 요소로 사용합니다.',
    calculationFormula: `
점수 계산 공식:
- 4점: 로딩 시간 < 1초 (LCP < 1s)
- 3점: 로딩 시간 1-2초 (LCP 1-2s)
- 2점: 로딩 시간 2-3초 (LCP 2-3s)
- 1점: 로딩 시간 > 3초 (LCP > 3s)

CVR 영향 공식:
CVR 변화 = (현재 로딩 시간 - 목표 로딩 시간) × 0.07
예: 3초 → 2초 개선 시 CVR +7%
    `,
    evidence: `
근거:
1. Google 연구 (2018): 로딩 시간이 0.1초 개선될 때마다 전환율이 1% 증가
2. Akamai 연구: 로딩 시간이 1초 지연될 때마다 전환율이 7% 감소
3. Google PageSpeed Insights: LCP(Largest Contentful Paint)가 2.5초 이하일 때 "양호" 평가
4. 실제 사례: Amazon은 로딩 시간 1초 단축으로 매출 1% 증가 보고
    `,
    dataSource: 'Google PageSpeed Insights, Akamai "State of Online Retail Performance" (2017), Google Web.dev',
    cvrConnection: `
CVR 연결:
- 로딩 시간 1초 단축 → CVR +7%
- 로딩 시간 2초 단축 → CVR +14%
- 로딩 시간 3초 단축 → CVR +21%

이유: 사용자는 빠른 로딩을 기대하며, 지연은 불안감과 이탈을 유발합니다.
빠른 로딩은 신뢰도를 높이고 전환 의도를 증가시킵니다.
    `,
    researchLinks: [
      'https://web.dev/lcp/',
      'https://www.thinkwithgoogle.com/marketing-strategies/app-and-mobile/mobile-page-speed-load-time/',
      'https://www.akamai.com/us/en/multimedia/documents/report/akamai-state-of-online-retail-performance-report-2017.pdf'
    ]
  },
  'seo-basic-001': {
    itemId: 'seo-basic-001',
    itemName: 'Meta Title 최적화',
    whyImportant: 'Meta Title은 검색 결과에서 가장 먼저 보이는 요소이며, 클릭률(CTR)에 직접적인 영향을 미칩니다. Google의 연구에 따르면 최적화된 타이틀은 CTR을 평균 30% 향상시킵니다. 또한 타이틀에 키워드가 포함되면 검색 순위에도 긍정적인 영향을 줍니다.',
    calculationFormula: `
점수 계산 기준:
- 4점: 키워드 앞부분 + 브랜드명 + 50-60자 + 고유성
- 3점: 키워드 포함 + 길이만 부적절
- 2점: 키워드 없음 또는 브랜드명 없음
- 1점: 검색 최적화 없음, 중복 타이틀

CTR 영향 공식:
CTR 변화 = (타이틀 최적화 점수 / 4) × 0.30
예: 2점 → 4점 개선 시 CTR +15%
    `,
    evidence: `
근거:
1. Google Search Console 데이터: 최적화된 타이틀은 평균 CTR 30% 향상
2. Moz 연구: 타이틀에 키워드가 포함된 경우 검색 순위 상승
3. 실제 A/B 테스트: 타이틀 최적화로 CTR 25-40% 증가 사례 다수
4. Google 가이드라인: 타이틀은 50-60자 권장 (모바일에서 완전히 표시)
    `,
    dataSource: 'Google Search Central, Moz "Title Tag Optimization" (2023), Search Engine Journal',
    cvrConnection: `
CVR 연결:
- CTR 10% 증가 → 유입 10% 증가 → CVR 동일 시 전환 10% 증가
- 타이틀 최적화로 CTR +15% → 유입 +15% → 전환 +15%
- 실제 CVR 영향: +3-5% (유입 증가 + 클릭 의도 향상)

이유: 최적화된 타이틀은 더 정확한 유저를 유입시켜 전환율을 향상시킵니다.
    `,
    researchLinks: [
      'https://developers.google.com/search/docs/appearance/title-link',
      'https://moz.com/learn/seo/title-tag',
      'https://www.searchenginejournal.com/title-tag-optimization/'
    ]
  },
  'seo-content-001': {
    itemId: 'seo-content-001',
    itemName: '타겟 키워드 최적화',
    whyImportant: '타겟 키워드 최적화는 검색 엔진이 콘텐츠의 주제를 이해하고 적절한 검색 결과에 노출시키는 핵심 요소입니다. 키워드 밀도가 1-2%일 때 최적의 검색 순위를 얻을 수 있으며, 과도한 키워드 사용(스터핑)은 오히려 순위를 하락시킵니다.',
    calculationFormula: `
키워드 밀도 계산:
키워드 밀도 = (키워드 출현 횟수 / 전체 단어 수) × 100

점수 계산 기준:
- 5점: 키워드 밀도 1-2%, 자연스러운 배치, LSI 키워드 포함
- 4점: 키워드 밀도 2-3%, 자연스러운 배치
- 3점: 키워드 밀도 0.5-1% 또는 3-4%
- 2점: 키워드 밀도 4% 이상 (스터핑)
- 1점: 키워드 밀도 0.5% 미만

검색 순위 영향:
순위 변화 = (키워드 최적화 점수 / 5) × 0.20
예: 3점 → 5점 개선 시 검색 순위 평균 8% 향상
    `,
    evidence: `
근거:
1. Google 알고리즘: 키워드 밀도 1-2%가 최적 (과도한 사용은 스팸으로 간주)
2. Ahrefs 연구: 키워드 최적화된 페이지는 검색 순위 상위 10위 확률 2배 증가
3. 실제 사례: 키워드 최적화로 유기 검색 트래픽 40-60% 증가
4. LSI 키워드: 관련 키워드 포함 시 검색 순위 추가 향상
    `,
    dataSource: 'Google Search Central, Ahrefs "Keyword Research" (2024), SEMrush 업계 리포트',
    cvrConnection: `
CVR 연결:
- 검색 순위 1위 → 3위: 유입 -20%, CVR -2%
- 검색 순위 3위 → 1위: 유입 +25%, CVR +4%
- 키워드 최적화로 순위 향상 → 유입 증가 → 전환 증가

이유: 정확한 키워드 최적화는 의도가 명확한 유저를 유입시켜 전환율을 높입니다.
    `,
    researchLinks: [
      'https://developers.google.com/search/docs/fundamentals/creating-helpful-content',
      'https://ahrefs.com/blog/keyword-research/',
      'https://www.semrush.com/blog/keyword-density/'
    ]
  },
  'seo-content-002': {
    itemId: 'seo-content-002',
    itemName: '콘텐츠 길이',
    whyImportant: '콘텐츠 길이는 검색 엔진이 주제를 깊이 있게 다루고 있다고 판단하는 중요한 신호입니다. Backlinko의 연구에 따르면 상위 10위 검색 결과의 평균 콘텐츠 길이는 1,447자이며, 2,000자 이상의 콘텐츠는 평균적으로 더 높은 검색 순위를 얻습니다.',
    calculationFormula: `
점수 계산 기준:
- 5점: 2,000자 이상, 심층 콘텐츠, 다양한 섹션
- 4점: 1,500-2,000자, 충분한 내용
- 3점: 1,000-1,500자, 기본 내용
- 2점: 500-1,000자, 내용 부족
- 1점: 500자 미만, 매우 부족

검색 순위 영향:
순위 변화 = (콘텐츠 길이 점수 / 5) × 0.15
예: 1,000자 → 2,000자 개선 시 검색 순위 평균 6% 향상

체류 시간 영향:
체류 시간 증가 = (콘텐츠 길이 증가 / 1000) × 30초
예: 1,000자 → 2,000자 증가 시 체류 시간 +30초
    `,
    evidence: `
근거:
1. Backlinko 연구 (2020): 상위 10위 결과의 평균 콘텐츠 길이 1,447자
2. HubSpot 연구: 2,500자 이상 콘텐츠는 평균적으로 더 많은 백링크 획득
3. 실제 사례: 콘텐츠 길이 1,000자 → 2,000자로 증가 시 유기 검색 트래픽 50% 증가
4. Google E-E-A-T: 깊이 있는 콘텐츠는 전문성과 권위성을 보여줌
    `,
    dataSource: 'Backlinko "SEO Statistics" (2020), HubSpot "Blog Length Research" (2023), Google Search Central',
    cvrConnection: `
CVR 연결:
- 체류 시간 30초 증가 → 이탈률 -5% → CVR +3%
- 콘텐츠 길이 2,000자 이상 → 검색 순위 향상 → 유입 +25% → 전환 +6%
- 심층 콘텐츠 → 신뢰도 증가 → 전환 의도 향상

이유: 긴 콘텐츠는 사용자에게 더 많은 정보를 제공하여 구매 결정을 돕고,
검색 순위 향상으로 더 많은 유입을 얻습니다.
    `,
    researchLinks: [
      'https://backlinko.com/content-length-study',
      'https://blog.hubspot.com/marketing/blog-post-length',
      'https://developers.google.com/search/docs/fundamentals/creating-helpful-content'
    ]
  },
  'seo-tech-002': {
    itemId: 'seo-tech-002',
    itemName: 'Core Web Vitals',
    whyImportant: 'Core Web Vitals는 Google이 사용자 경험을 측정하는 핵심 지표입니다. 2021년부터 검색 순위 요소로 사용되며, LCP, FID, CLS 세 가지 지표를 종합 평가합니다. 양호한 Core Web Vitals 점수는 검색 순위 향상과 사용자 전환율 증가에 직접적인 영향을 미칩니다.',
    calculationFormula: `
Core Web Vitals 점수 계산:
- LCP (Largest Contentful Paint): 메인 콘텐츠 로딩 시간
  - 양호: < 2.5초
  - 개선 필요: 2.5-4.0초
  - 나쁨: > 4.0초

- FID (First Input Delay): 사용자 상호작용 반응 시간
  - 양호: < 100ms
  - 개선 필요: 100-300ms
  - 나쁨: > 300ms

- CLS (Cumulative Layout Shift): 레이아웃 안정성
  - 양호: < 0.1
  - 개선 필요: 0.1-0.25
  - 나쁨: > 0.25

종합 점수:
- 4점: 모든 지표 양호
- 3점: 1-2개 지표 개선 필요
- 2점: 2-3개 지표 개선 필요
- 1점: 모든 지표 나쁨

CVR 영향:
CVR 변화 = (Core Web Vitals 점수 / 4) × 0.08
예: 2점 → 4점 개선 시 CVR +8%
    `,
    evidence: `
근거:
1. Google 공식 발표 (2021): Core Web Vitals를 검색 순위 요소로 사용
2. Google 연구: Core Web Vitals 개선 시 검색 트래픽 평균 15% 증가
3. 실제 사례: LCP 2.5초 → 1.5초 개선 시 전환율 8% 증가
4. Think with Google: 모바일에서 Core Web Vitals 양호한 사이트는 전환율 2배 높음
    `,
    dataSource: 'Google Search Central, Google PageSpeed Insights, Think with Google (2021)',
    cvrConnection: `
CVR 연결:
- LCP 1초 단축 → 이탈률 -7% → CVR +5%
- FID 100ms 개선 → 상호작용 증가 → CVR +2%
- CLS 0.1 개선 → 사용자 경험 향상 → CVR +1%
- 종합: Core Web Vitals 양호 달성 시 CVR +8%

이유: 빠르고 안정적인 페이지는 사용자 신뢰를 높이고 전환 의도를 증가시킵니다.
    `,
    researchLinks: [
      'https://web.dev/vitals/',
      'https://developers.google.com/search/docs/appearance/page-speed',
      'https://www.thinkwithgoogle.com/marketing-strategies/app-and-mobile/mobile-page-speed-load-time/'
    ]
  }
}

/**
 * 항목별 중요성 문서 가져오기
 */
export function getImportanceDoc(itemId: string): ImportanceDocumentation | null {
  return SEO_IMPORTANCE_DOCS[itemId] || null
}

/**
 * 모든 중요성 문서 가져오기
 */
export function getAllImportanceDocs(): ImportanceDocumentation[] {
  return Object.values(SEO_IMPORTANCE_DOCS)
}
