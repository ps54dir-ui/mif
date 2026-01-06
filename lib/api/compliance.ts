/**
 * 컴플라이언스 API 클라이언트
 */

import { ComplianceDashboard, ComplianceScorecard, RemediationPlan, RiskSelfDiagnosis } from '@/shared/types/compliance';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface CompanyInfo {
  name: string
  business_registration_number?: string
  business_name?: string
  business_address?: string
  phone_number?: string
  email?: string
  [key: string]: any
}

/**
 * 통합 컴플라이언스 대시보드 조회
 */
export async function getComplianceDashboard(
  company: CompanyInfo
): Promise<ComplianceDashboard> {
  const response = await fetch(`${API_BASE_URL}/api/compliance/dashboard`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(company),
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch compliance dashboard: ${response.statusText}`)
  }

  return response.json()
}

/**
 * 컴플라이언스 스코어카드 발급
 */
export async function getComplianceScorecard(
  company: CompanyInfo
): Promise<ComplianceScorecard> {
  const response = await fetch(`${API_BASE_URL}/api/compliance/scorecard`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(company),
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch compliance scorecard: ${response.statusText}`)
  }

  return response.json()
}

/**
 * 위험 자가진단 실행
 */
export async function runSelfDiagnosis(
  company: CompanyInfo
): Promise<RiskSelfDiagnosis> {
  const response = await fetch(`${API_BASE_URL}/api/compliance/self-diagnosis`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(company),
  })

  if (!response.ok) {
    throw new Error(`Failed to run self diagnosis: ${response.statusText}`)
  }

  return response.json()
}

/**
 * 개선 계획 생성
 */
export async function getRemediationPlan(
  company: CompanyInfo
): Promise<RemediationPlan> {
  const response = await fetch(`${API_BASE_URL}/api/compliance/remediation-plan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(company),
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch remediation plan: ${response.statusText}`)
  }

  return response.json()
}
