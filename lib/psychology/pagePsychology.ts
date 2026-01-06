/**
 * 상세페이지 심리 분석 모듈
 * 심리적 장치 분석 및 처방
 */

export interface PsychologicalDevice {
  type: 'scarcity' | 'social_proof' | 'trust' | 'authority' | 'reciprocity' | 'commitment'
  present: boolean
  strength: number // 0-100
  description: string
}

export interface PagePsychologyAnalysis {
  pageUrl: string
  overallPsychologyScore: number // 0-100
  devices: PsychologicalDevice[]
  weaknesses: string[]
  recommendations: Array<{
    device: string
    action: string
    priority: 'HIGH' | 'MEDIUM' | 'LOW'
    expectedImpact: number
  }>
}

/**
 * 상세페이지 심리적 장치 분석
 */
export function analyzePagePsychology(
  pageUrl: string,
  hasScarcity: boolean,
  hasSocialProof: boolean,
  hasTrustSignals: boolean,
  hasAuthority: boolean,
  hasReciprocity: boolean,
  hasCommitment: boolean
): PagePsychologyAnalysis {
  const devices: PsychologicalDevice[] = [
    {
      type: 'scarcity',
      present: hasScarcity,
      strength: hasScarcity ? 75 : 0,
      description: '희소성 전략 (재고 부족, 한정판 등)'
    },
    {
      type: 'social_proof',
      present: hasSocialProof,
      strength: hasSocialProof ? 60 : 0,
      description: '사회적 증거 (리뷰, 구매자 수 등)'
    },
    {
      type: 'trust',
      present: hasTrustSignals,
      strength: hasTrustSignals ? 45 : 0,
      description: '신뢰 신호 (인증, 보장, 정품 인증 등)'
    },
    {
      type: 'authority',
      present: hasAuthority,
      strength: hasAuthority ? 70 : 0,
      description: '권위 (전문가 추천, 수상 내역 등)'
    },
    {
      type: 'reciprocity',
      present: hasReciprocity,
      strength: hasReciprocity ? 50 : 0,
      description: '호혜성 (무료 샘플, 할인 쿠폰 등)'
    },
    {
      type: 'commitment',
      present: hasCommitment,
      strength: hasCommitment ? 55 : 0,
      description: '일관성 (체험 프로그램, 약속 등)'
    }
  ]
  
  const overallScore = Math.round(
    devices.reduce((sum, d) => sum + d.strength, 0) / devices.length
  )
  
  const weaknesses: string[] = []
  const recommendations: Array<{
    device: string
    action: string
    priority: 'HIGH' | 'MEDIUM' | 'LOW'
    expectedImpact: number
  }> = []
  
  // 신뢰 장치가 부족한 경우
  if (!hasTrustSignals || devices.find(d => d.type === 'trust')?.strength || 0 < 50) {
    weaknesses.push('사용자 신뢰를 주는 심리적 장치가 부족합니다')
    recommendations.push({
      device: '신뢰',
      action: '정품 인증 배지, 보장 마크, 고객 보호 프로그램 표시 추가',
      priority: 'HIGH',
      expectedImpact: 25
    })
  }
  
  // 희소성 장치는 있으나 신뢰가 부족한 경우
  if (hasScarcity && !hasTrustSignals) {
    weaknesses.push('희소성 전략은 좋으나 신뢰 장치가 부족합니다')
    recommendations.push({
      device: '신뢰 + 희소성',
      action: '희소성 메시지와 함께 신뢰 신호(정품 인증, 보장)를 함께 강조',
      priority: 'HIGH',
      expectedImpact: 30
    })
  }
  
  // 사회적 증거가 부족한 경우
  if (!hasSocialProof) {
    weaknesses.push('사회적 증거가 부족하여 구매 결정을 돕지 못합니다')
    recommendations.push({
      device: '사회적 증거',
      action: '실제 구매자 리뷰, 구매자 수 표시, 인플루언서 추천 추가',
      priority: 'MEDIUM',
      expectedImpact: 20
    })
  }
  
  // 권위가 부족한 경우
  if (!hasAuthority) {
    recommendations.push({
      device: '권위',
      action: '전문가 추천, 수상 내역, 언론 보도 추가',
      priority: 'MEDIUM',
      expectedImpact: 15
    })
  }
  
  return {
    pageUrl,
    overallPsychologyScore: overallScore,
    devices,
    weaknesses,
    recommendations
  }
}

/**
 * 심리 기반 Action Item 생성
 */
export function generatePsychologicalActionItems(
  analysis: PagePsychologyAnalysis
): Array<{
  title: string
  description: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  psychologicalBasis: string
}> {
  const actionItems: Array<{
    title: string
    description: string
    priority: 'HIGH' | 'MEDIUM' | 'LOW'
    psychologicalBasis: string
  }> = []
  
  if (analysis.weaknesses.length > 0) {
    analysis.weaknesses.forEach(weakness => {
      const recommendation = analysis.recommendations.find(r => 
        weakness.includes(r.device) || r.device.includes(weakness.split(' ')[0])
      )
      
      if (recommendation) {
        actionItems.push({
          title: `${recommendation.device} 심리 장치 강화`,
          description: recommendation.action,
          priority: recommendation.priority,
          psychologicalBasis: weakness
        })
      }
    })
  }
  
  // 기본 Action Item
  if (actionItems.length === 0 && analysis.overallPsychologyScore < 70) {
    actionItems.push({
      title: '전반적 심리적 설득력 강화',
      description: '상세페이지에 다양한 심리적 장치를 추가하여 구매 결정을 돕습니다',
      priority: 'HIGH',
      psychologicalBasis: '심리 점수가 낮아 전환율에 부정적 영향을 미칩니다'
    })
  }
  
  return actionItems
}
