/**
 * 리뷰 관리 API 클라이언트
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface Review {
  id: string
  platform: 'naver' | 'coupang' | 'blog' | 'instagram' | 'other'
  product_id: string
  rating: number
  title: string
  content: string
  helpful_count: number
  images: string[]
  verified_purchase: boolean
  date: string
  language: string
  source_url: string
}

export async function collectReviews(
  sources: string[],
  productId?: string
): Promise<Review[]> {
  const response = await fetch(`${API_BASE_URL}/api/reviews/collect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sources, product_id: productId }),
  })

  if (!response.ok) {
    throw new Error(`Failed to collect reviews: ${response.statusText}`)
  }

  const result = await response.json()
  return result.data
}

export async function analyzeSentiment(reviews: Review[]) {
  const response = await fetch(`${API_BASE_URL}/api/reviews/analyze-sentiment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reviews }),
  })

  if (!response.ok) {
    throw new Error(`Failed to analyze sentiment: ${response.statusText}`)
  }

  const result = await response.json()
  return result.data
}

export async function classifyReviews(reviews: Review[]) {
  const response = await fetch(`${API_BASE_URL}/api/reviews/classify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reviews }),
  })

  if (!response.ok) {
    throw new Error(`Failed to classify reviews: ${response.statusText}`)
  }

  const result = await response.json()
  return result.data
}

export async function extractImprovements(reviews: Review[]) {
  const response = await fetch(`${API_BASE_URL}/api/reviews/extract-improvements`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reviews }),
  })

  if (!response.ok) {
    throw new Error(`Failed to extract improvements: ${response.statusText}`)
  }

  const result = await response.json()
  return result.data
}

export async function getReviewDashboard(productId: string) {
  const response = await fetch(`${API_BASE_URL}/api/reviews/dashboard/${productId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!response.ok) {
    throw new Error(`Failed to get dashboard: ${response.statusText}`)
  }

  const result = await response.json()
  return result.data
}
