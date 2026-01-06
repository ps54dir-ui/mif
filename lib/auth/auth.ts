/**
 * 인증 관련 유틸리티 함수
 */

export interface User {
  id: string
  username: string
  email?: string
  is_admin: boolean
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('access_token')
}

export function setAccessToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('access_token', token)
}

export function removeAccessToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('access_token')
  localStorage.removeItem('user')
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null
  const userStr = localStorage.getItem('user')
  if (!userStr) return null
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export function setCurrentUser(user: User): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('user', JSON.stringify(user))
}

export function isAuthenticated(): boolean {
  return getAccessToken() !== null
}

export function isAdmin(): boolean {
  const user = getCurrentUser()
  return user?.is_admin || false
}

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  // 서버 사이드에서는 실행하지 않음
  if (typeof window === 'undefined') {
    throw new Error('fetchWithAuth는 클라이언트 사이드에서만 실행할 수 있습니다.')
  }
  
  const token = getAccessToken()
  
  const headers = new Headers(options.headers)
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  headers.set('Content-Type', 'application/json')

  return fetch(url, {
    ...options,
    headers,
  })
}

export async function logout(): Promise<void> {
  removeAccessToken()
  if (typeof window !== 'undefined') {
    window.location.href = '/login'
  }
}
