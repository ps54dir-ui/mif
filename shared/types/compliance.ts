/**
 * 컴플라이언스 및 규정 준수 타입 정의
 */

export interface ComplianceCheck {
  law_name: string
  compliance_status: 'compliant' | 'non_compliant' | 'partial'
  violations: Violation[]
  required_actions: string[]
  fine_amount?: string
  severity?: 'critical' | 'high' | 'medium' | 'low'
  score: number // 0-100
}

export interface Violation {
  id: string
  description: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  applicable_law: string
  potential_fine?: string
  required_action: string
  resolution_criteria: string
}

export interface RiskSelfDiagnosis {
  overall_risk_score: number
  risk_factors: RiskFactor[]
  immediate_concerns: string[]
  legal_exposure: {
    total_fine_risk: number
    critical_violations: number
    legal_action_probability: string
    recommendation: string
  }
}

export interface RiskFactor {
  category: string
  questions: SelfDiagnosisQuestion[]
  auto_assessment: {
    risk_level: 'low' | 'medium' | 'high' | 'critical'
    risk_score: number
    issues_found: string[]
  }
  recommendation: {
    actions: string[]
    timeline: string
    priority: 'critical' | 'high' | 'medium' | 'low'
  }
}

export interface SelfDiagnosisQuestion {
  id: string
  question: string
  risk_if_yes: 'critical' | 'high' | 'medium' | 'low'
  fine_amount?: string
  consequence?: string
  violation?: string
  legal_action?: string
  example?: string
}

export interface ComplianceScorecard {
  company_name: string
  issued_date: string
  valid_until: string
  category_scores: {
    [category: string]: {
      weight: number
      score: number
      details?: any
    }
  }
  overall_score: number // 0-100
  rating: 'AAA' | 'AA' | 'A' | 'B' | 'C'
  certificate: {
    unique_id: string
    verification_url: string
    can_display_badge: boolean
  }
  improvements_needed: string[]
  legal_status: {
    violations_found: boolean
    critical_issues: string[]
    recommendation: string
  }
}

export interface RemediationPlan {
  company: string
  generated_date: string
  violations_count: number
  total_fine_risk: number
  estimated_resolution_time: string
  remediation_actions: RemediationAction[]
  priority_order: string[]
  checklist: ChecklistItem[]
  final_recommendation: string
}

export interface RemediationAction {
  violation: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  law: string
  fine_risk?: string
  current_status: string
  required_actions: Array<{
    action: string
    timeline: string
    responsible_person: string
    completion_date: string
  }>
  verification: {
    method: string
    expected_result: string
    how_to_verify: string
  }
  prevention: {
    policy_change?: string
    staff_training?: string
    monitoring?: string
  }
}

export interface ChecklistItem {
  id: string
  task: string
  status: 'pending' | 'in_progress' | 'completed'
  due_date: string
  responsible: string
}

export interface ComplianceDashboard {
  current_status: {
    compliance_score: number
    rating: string
    violations: number
    warnings: number
    last_update: string
  }
  regulatory_compliance: {
    korean_laws: ComplianceCheck[]
    international_laws: ComplianceCheck[]
    platform_policies: ComplianceCheck[]
  }
  self_assessment: {
    risk_factors: RiskFactor[]
    critical_risks: string[]
    overall_risk_score: number
  }
  scorecard: ComplianceScorecard
  remediation_plan: RemediationPlan
  next_steps: Array<{
    action: string
    deadline: string
    priority: string
  }>
}
