/**
 * 시장 보호 API 클라이언트
 */

import {
  MarketProtectionDashboard,
  CompetitorAnalysis,
  Threat,
  PlatformStatus,
  MaliciousReview,
  CoordinatedAttack,
  MarketHealthAnalysis,
  Evidence,
  ReportResult
} from '@/shared/types/market-protection';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface CompanyInfo {
  name: string
  category?: string
  [key: string]: any
}

/**
 * 통합 시장 보호 대시보드 조회
 */
export async function getMarketProtectionDashboard(
  company: CompanyInfo
): Promise<MarketProtectionDashboard> {
  const response = await fetch(`${API_BASE_URL}/api/market-protection/dashboard`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(company),
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch market protection dashboard: ${response.statusText}`)
  }

  return response.json()
}

/**
 * 경쟁사 모니터링
 */
export async function monitorCompetitors(
  company: CompanyInfo
): Promise<{ monitored_competitors: CompetitorAnalysis[], ethical_competitors: any[] }> {
  const response = await fetch(`${API_BASE_URL}/api/market-protection/competitors/monitor`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(company),
  })

  if (!response.ok) {
    throw new Error(`Failed to monitor competitors: ${response.statusText}`)
  }

  return response.json()
}

/**
 * 위협 감지
 */
export async function detectThreats(
  company: CompanyInfo
): Promise<{ threats_detected: number, threats: Threat[], critical_threats: Threat[] }> {
  const response = await fetch(`${API_BASE_URL}/api/market-protection/threats/detect`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(company),
  })

  if (!response.ok) {
    throw new Error(`Failed to detect threats: ${response.statusText}`)
  }

  return response.json()
}

/**
 * 증거 수집
 */
export async function collectEvidence(
  company: CompanyInfo,
  fraudType: string,
  target: string
): Promise<Evidence> {
  const response = await fetch(
    `${API_BASE_URL}/api/market-protection/evidence/collect?fraud_type=${fraudType}&target=${target}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(company),
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to collect evidence: ${response.statusText}`)
  }

  return response.json()
}

/**
 * 네이버에 신고
 */
export async function reportToNaver(
  evidence: Evidence,
  details: { violation_type: string, [key: string]: any }
): Promise<ReportResult> {
  const response = await fetch(`${API_BASE_URL}/api/market-protection/report/naver`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ evidence, details }),
  })

  if (!response.ok) {
    throw new Error(`Failed to report to Naver: ${response.statusText}`)
  }

  return response.json()
}
