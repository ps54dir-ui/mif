/**
 * 시장 보호 및 감시 시스템 타입 정의
 */

export interface CompetitorAnalysis {
  company_name: string
  category: string
  market_share: number
  fraud_detection: {
    fake_traffic_detected: boolean
    fake_reviews_detected: boolean
    price_manipulation: boolean
    false_advertising: boolean
    details: {
      fake_traffic: any
      fake_reviews: any
      pricing: any
      advertising: any
    }
  }
  risk_level: 'low' | 'medium' | 'high' | 'critical'
  threat_score: number
  actions_available: string[]
  impact_on_you: {
    unfair_advantage: string
    lost_revenue: string
    reputation_damage: string
  }
}

export interface Threat {
  type: string
  competitor?: string
  detected_date: string
  attack_strength: 'high' | 'medium' | 'low'
  impact_on_rating?: number
  confidence: number
  evidence: {
    similar_content?: any
    timing_pattern?: any
    reviewer_connections?: any
  }
  recommended_action: string
  legal_action_available: boolean
}

export interface PlatformStatus {
  platform: string
  health_score: number
  status: 'healthy' | 'warning' | 'critical'
  systemic_issues: Array<{
    issue: string
    severity: 'high' | 'medium' | 'low'
    impact_on_you: string
    complaint_mechanism: string
  }>
  recent_policy_changes: any[]
  your_account_status: {
    standing: 'good' | 'warning' | 'at_risk'
    score: number
    issues: string[]
  }
  moderation_quality: {
    false_positive_rate: number
    consistency: number
    appeal_success_rate: number
  }
}

export interface MaliciousReview {
  review_id: string
  reviewer_name: string
  content: string
  rating: number
  malice_indicators: {
    fake_account: boolean
    coordinated_attack: boolean
    competitor_initiated: boolean
    bot_generated: boolean
  }
  authenticity_score: number
  is_real_customer: boolean
  recommended_action: 'flag' | 'report' | 'respond'
  legal_evidence_value: 'high' | 'medium' | 'low'
  can_sue: boolean
}

export interface CoordinatedAttack {
  attack_id: string
  attack_date: string
  attacker_profile: {
    type: 'competitor' | 'disgruntled_customer' | 'hate_group' | 'unknown'
    identified_competitor?: string
    motivation: string
  }
  review_count: number
  period: string
  frequency: number
  impact_on_rating: number
  estimated_revenue_loss: number
  evidence_for_report: string[]
  report_options: {
    report_to_platform: {
      available: boolean
      success_rate: number
      timeline: string
    }
    report_to_police: {
      available: boolean
      requires_evidence: boolean
      charge: string
    }
    legal_action: {
      available: boolean
      damages_claim: number
      proof_needed: string
    }
  }
}

export interface MarketHealthAnalysis {
  category_health: {
    category: string
    fraud_rate_in_category: number
    ethical_sellers_percentage: number
    safety_index: number
    main_threats: string[]
    threat_severity: 'high' | 'medium' | 'low'
    ethical_competitor_count: number
    your_rank_among_ethical: number
    market_outlook: 'improving' | 'stable' | 'deteriorating'
  }
  competitive_landscape: {
    total_competitors: number
    ethical_competitors: number
    questionable_competitors: number
    fraudulent_competitors: number
    fairness_index: number
    assessment: string
    your_position: {
      market_share: number
      ethics_ranking: string
      competitive_advantage: 'strong' | 'moderate' | 'weak'
    }
  }
  market_threats: Array<{
    threat: string
    likelihood: 'high' | 'medium' | 'low'
    potential_impact: string
    affected_sellers: number
    impact_on_you: {
      direct: string
      indirect: string
    }
    protection_available: boolean
    mitigation_strategies: string[]
  }>
  ethical_opportunities: Array<{
    opportunity: string
    market_gap: string
    potential_revenue: number
    fit_with_your_strengths: 'high' | 'medium' | 'low'
    competition_level: 'low' | 'medium' | 'high'
    required_action: string
  }>
  overall_assessment: {
    market_health_score: number
    recommendation: string
    long_term_outlook: string
  }
}

export interface Evidence {
  screenshots: string[]
  data_analysis: {
    statistical_evidence: any
    pattern_analysis: any
    timeline: any
  }
  expert_opinion: any
  legal_strength: 'strong' | 'moderate' | 'weak'
}

export interface ReportResult {
  report_id: string
  platform: string
  submitted_date: string
  violation_type: string
  evidence_summary: string
  expected_outcome: {
    removal_likelihood: number
    timeline: string
    appeal_available: boolean
  }
  tracking_url: string
  follow_up_required: boolean
}

export interface MarketProtectionDashboard {
  threat_monitoring: {
    active_threats: Threat[]
    threat_level: 'critical' | 'high' | 'medium' | 'low'
    alerts_this_week: number
    critical_alerts: number
  }
  competitor_analysis: {
    monitored_competitors: number
    fraudulent_competitors: number
    recommended_actions: string[]
  }
  platform_status: {
    naver: string
    coupang: string
    google_shop: string
  }
  review_protection: {
    malicious_reviews_detected: number
    coordinated_attacks: number
    your_rating_protected: boolean
  }
  market_health: {
    category_fraud_rate: string
    your_position: string
    market_fairness: string
  }
  recommended_actions: string[]
}
