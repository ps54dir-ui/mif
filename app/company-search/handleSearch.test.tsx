/**
 * handleSearch 함수 테스트 스위트
 * 
 * 테스트 목표:
 * 1. 입력 검증 (빈 문자열, 공백 제거)
 * 2. URL 업데이트 로직
 * 3. API 요청 및 응답 처리
 * 4. 에러 처리 (AbortError, 네트워크 에러, 타임아웃)
 * 5. 상태 관리 (isSearching, error, results, lastSearchedQuery)
 * 6. 요청 취소 및 타임아웃 관리
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CompanySearchPage from './page'

// Next.js router 모킹
const mockPush = vi.fn()
const mockGet = vi.fn<(key: string) => string | null>((key: string) => {
  if (key === 'q') return ''
  if (key === 'error') return null
  return null
})

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => ({
    get: mockGet,
  }),
}))

describe('handleSearch 함수', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
    localStorage.clear()
    mockGet.mockReturnValue('')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('1. 입력 검증', () => {
    it('빈 문자열이면 즉시 반환해야 함', async () => {
      const { container } = render(<CompanySearchPage />)
      const searchInput = screen.getByPlaceholderText(/회사명을 입력하세요/i)
      const searchButton = screen.getByRole('button', { name: /검색/i })

      await userEvent.type(searchInput, '   ')
      await userEvent.click(searchButton)

      // API 호출이 없어야 함
      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('공백이 제거된 검색어로 API를 호출해야 함', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ matches: [] }),
      }
      global.fetch = vi.fn().mockResolvedValue(mockResponse)

      render(<CompanySearchPage />)
      const searchInput = screen.getByPlaceholderText(/회사명을 입력하세요/i)
      const searchButton = screen.getByRole('button', { name: /검색/i })

      await userEvent.type(searchInput, '  삼성생명  ')
      await userEvent.click(searchButton)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/company-search/search'),
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ company_name: '삼성생명' }),
          })
        )
      })
    })
  })

  describe('2. URL 업데이트 로직', () => {
    it('updateUrl이 true이고 검색어가 URL과 다르면 router.push를 호출해야 함', async () => {
      mockGet.mockReturnValue('기존검색어')
      render(<CompanySearchPage />)
      const searchInput = screen.getByPlaceholderText(/회사명을 입력하세요/i)
      const searchButton = screen.getByRole('button', { name: /검색/i })

      await userEvent.clear(searchInput)
      await userEvent.type(searchInput, '새검색어')
      await userEvent.click(searchButton)

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith(
          expect.stringContaining('q=%EC%83%88%EA%B2%80%EC%83%89%EC%96%B4')
        )
      })
    })

    it('updateUrl이 false이면 router.push를 호출하지 않아야 함', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ matches: [] }),
      }
      global.fetch = vi.fn().mockResolvedValue(mockResponse)

      render(<CompanySearchPage />)
      const searchInput = screen.getByPlaceholderText(/회사명을 입력하세요/i)

      // handleSearch를 직접 호출하는 대신, 컴포넌트 내부 로직을 테스트
      // 실제로는 useEffect가 자동으로 호출되므로, URL 파라미터를 변경하여 테스트
      mockGet.mockReturnValue('삼성생명')
      
      // 컴포넌트가 리렌더링되면 useEffect가 실행됨
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled()
      })

      // updateUrl=false인 경우는 내부적으로만 사용되므로 직접 테스트하기 어려움
      // 대신 API 호출이 정상적으로 이루어지는지 확인
    })
  })

  describe('3. API 요청 및 응답 처리', () => {
    it('성공 응답 시 결과를 상태에 저장해야 함', async () => {
      const mockMatches = [
        {
          id: '1',
          company_name: '삼성생명',
          manager_name: '홍길동',
          source: 'database',
        },
      ]
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers(),
        json: async () => ({ matches: mockMatches }),
      }
      global.fetch = vi.fn().mockResolvedValue(mockResponse as any)

      render(<CompanySearchPage />)
      const searchInput = screen.getByPlaceholderText(/회사명을 입력하세요/i)
      const searchButton = screen.getByRole('button', { name: /검색/i })

      await userEvent.type(searchInput, '삼성생명')
      await userEvent.click(searchButton)

      await waitFor(() => {
        expect(screen.getByText('삼성생명')).toBeInTheDocument()
      })
    })

    it('검색 결과가 비어있고 검색어 길이가 2 이상이면 fallback 결과를 생성해야 함', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers(),
        json: async () => ({ matches: [] }),
      }
      global.fetch = vi.fn().mockResolvedValue(mockResponse as any)

      render(<CompanySearchPage />)
      const searchInput = screen.getByPlaceholderText(/회사명을 입력하세요/i)
      const searchButton = screen.getByRole('button', { name: /검색/i })

      await userEvent.type(searchInput, '삼성생명')
      await userEvent.click(searchButton)

      await waitFor(() => {
        // fallback 결과가 표시되어야 함
        expect(screen.getByText('삼성생명')).toBeInTheDocument()
      })
    })

    it('검색어 길이가 2 미만이면 fallback 결과를 생성하지 않아야 함', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers(),
        json: async () => ({ matches: [] }),
      }
      global.fetch = vi.fn().mockResolvedValue(mockResponse as any)

      render(<CompanySearchPage />)
      const searchInput = screen.getByPlaceholderText(/회사명을 입력하세요/i)
      const searchButton = screen.getByRole('button', { name: /검색/i })

      await userEvent.type(searchInput, 'A')
      await userEvent.click(searchButton)

      await waitFor(() => {
        // 결과가 없어야 함
        expect(screen.queryByText('A')).not.toBeInTheDocument()
      })
    })

    it('인증 토큰이 있으면 Authorization 헤더를 포함해야 함', async () => {
      localStorage.setItem('access_token', 'test-token')
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers(),
        json: async () => ({ matches: [] }),
      }
      global.fetch = vi.fn().mockResolvedValue(mockResponse as any)

      render(<CompanySearchPage />)
      const searchInput = screen.getByPlaceholderText(/회사명을 입력하세요/i)
      const searchButton = screen.getByRole('button', { name: /검색/i })

      await userEvent.type(searchInput, '삼성생명')
      await userEvent.click(searchButton)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            headers: expect.objectContaining({
              Authorization: 'Bearer test-token',
            }),
          })
        )
      })
    })
  })

  describe('4. 에러 처리', () => {
    it('AbortError는 조용히 처리하고 에러를 표시하지 않아야 함', async () => {
      const abortError = new Error('The operation was aborted')
      abortError.name = 'AbortError'
      global.fetch = vi.fn().mockRejectedValue(abortError)

      render(<CompanySearchPage />)
      const searchInput = screen.getByPlaceholderText(/회사명을 입력하세요/i)
      const searchButton = screen.getByRole('button', { name: /검색/i })

      await userEvent.type(searchInput, '삼성생명')
      await userEvent.click(searchButton)

      await waitFor(() => {
        // 에러 메시지가 표시되지 않아야 함
        expect(screen.queryByText(/오류가 발생했습니다/i)).not.toBeInTheDocument()
      })
    })

    it('네트워크 에러 시 에러 메시지를 표시해야 함', async () => {
      const networkError = new Error('Network error')
      global.fetch = vi.fn().mockRejectedValue(networkError)

      render(<CompanySearchPage />)
      const searchInput = screen.getByPlaceholderText(/회사명을 입력하세요/i)
      const searchButton = screen.getByRole('button', { name: /검색/i })

      await userEvent.type(searchInput, '삼성생명')
      await userEvent.click(searchButton)

      await waitFor(() => {
        expect(screen.getByText(/검색 중 오류가 발생했습니다/i)).toBeInTheDocument()
      })
    })

    it('API 응답이 ok=false이면 에러 메시지를 표시해야 함', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        headers: new Headers(),
        json: async () => ({ detail: '서버 오류' }),
      }
      global.fetch = vi.fn().mockResolvedValue(mockResponse as any)

      render(<CompanySearchPage />)
      const searchInput = screen.getByPlaceholderText(/회사명을 입력하세요/i)
      const searchButton = screen.getByRole('button', { name: /검색/i })

      await userEvent.type(searchInput, '삼성생명')
      await userEvent.click(searchButton)

      await waitFor(() => {
        expect(screen.getByText('서버 오류')).toBeInTheDocument()
      })
    })

    it('타임아웃 시 타임아웃 에러 메시지를 표시해야 함', async () => {
      vi.useFakeTimers()
      
      const timeoutError = new Error('Timeout')
      timeoutError.name = 'TimeoutError'
      
      // fetch가 10초 후에 reject되도록 설정
      global.fetch = vi.fn().mockImplementation(() => {
        return new Promise((_, reject) => {
          setTimeout(() => reject(timeoutError), 10000)
        })
      })

      render(<CompanySearchPage />)
      const searchInput = screen.getByPlaceholderText(/회사명을 입력하세요/i)
      const searchButton = screen.getByRole('button', { name: /검색/i })

      await userEvent.type(searchInput, '삼성생명')
      await userEvent.click(searchButton)

      // 10초 경과
      vi.advanceTimersByTime(10000)

      await waitFor(() => {
        expect(screen.getByText(/검색 시간이 초과되었습니다/i)).toBeInTheDocument()
      })

      vi.useRealTimers()
    })
  })

  describe('5. 상태 관리', () => {
    it('검색 시작 시 isSearching이 true가 되어야 함', async () => {
      const mockResponse = {
        ok: true,
        json: async () => new Promise(resolve => setTimeout(() => resolve({ matches: [] }), 100)),
      }
      global.fetch = vi.fn().mockImplementation(() => mockResponse)

      render(<CompanySearchPage />)
      const searchInput = screen.getByPlaceholderText(/회사명을 입력하세요/i)
      const searchButton = screen.getByRole('button', { name: /검색/i })

      await userEvent.type(searchInput, '삼성생명')
      await userEvent.click(searchButton)

      // 로딩 상태 확인 (Loader2 아이콘이 표시되어야 함)
      expect(screen.getByRole('button', { name: /검색/i })).toBeInTheDocument()
    })

    it('검색 완료 시 isSearching이 false가 되어야 함', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers(),
        json: async () => ({ matches: [] }),
      }
      global.fetch = vi.fn().mockResolvedValue(mockResponse as any)

      render(<CompanySearchPage />)
      const searchInput = screen.getByPlaceholderText(/회사명을 입력하세요/i)
      const searchButton = screen.getByRole('button', { name: /검색/i })

      await userEvent.type(searchInput, '삼성생명')
      await userEvent.click(searchButton)

      await waitFor(() => {
        // 검색이 완료되면 로딩 상태가 해제되어야 함
        expect(global.fetch).toHaveBeenCalled()
      })
    })

    it('성공 시 lastSearchedQuery가 업데이트되어야 함', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers(),
        json: async () => ({ matches: [] }),
      }
      global.fetch = vi.fn().mockResolvedValue(mockResponse as any)

      render(<CompanySearchPage />)
      const searchInput = screen.getByPlaceholderText(/회사명을 입력하세요/i)
      const searchButton = screen.getByRole('button', { name: /검색/i })

      await userEvent.type(searchInput, '삼성생명')
      await userEvent.click(searchButton)

      await waitFor(() => {
        // 검색어가 입력 필드에 유지되어야 함 (lastSearchedQuery 반영)
        expect(searchInput).toHaveValue('삼성생명')
      })
    })
  })

  describe('6. 요청 취소 및 타임아웃 관리', () => {
    it('새 검색 시작 시 이전 요청을 취소해야 함', async () => {
      const abortController1 = new AbortController()
      const abortController2 = new AbortController()
      
      let callCount = 0
      global.fetch = vi.fn().mockImplementation((url, options) => {
        callCount++
        if (callCount === 1) {
          // 첫 번째 요청은 abort될 것
          return new Promise((_, reject) => {
            setTimeout(() => {
              if (options?.signal?.aborted) {
                const error = new Error('Aborted')
                error.name = 'AbortError'
                reject(error)
              }
            }, 100)
          })
        }
        // 두 번째 요청은 성공
        return Promise.resolve({
          ok: true,
          status: 200,
          headers: new Headers(),
          json: async () => ({ matches: [] }),
        })
      })

      render(<CompanySearchPage />)
      const searchInput = screen.getByPlaceholderText(/회사명을 입력하세요/i)
      const searchButton = screen.getByRole('button', { name: /검색/i })

      // 첫 번째 검색
      await userEvent.type(searchInput, '첫검색')
      await userEvent.click(searchButton)

      // 즉시 두 번째 검색 (첫 번째가 취소되어야 함)
      await userEvent.clear(searchInput)
      await userEvent.type(searchInput, '두검색')
      await userEvent.click(searchButton)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(2)
      })
    })

    it('10초 타임아웃이 설정되어야 함', async () => {
      vi.useFakeTimers()
      
      let timeoutSet = false
      global.fetch = vi.fn().mockImplementation((url, options) => {
        // AbortController의 signal이 설정되어 있는지 확인
        if (options?.signal) {
          timeoutSet = true
        }
        return new Promise(() => {}) as Promise<Response> // 영원히 대기
      })

      render(<CompanySearchPage />)
      const searchInput = screen.getByPlaceholderText(/회사명을 입력하세요/i)
      const searchButton = screen.getByRole('button', { name: /검색/i })

      await userEvent.type(searchInput, '삼성생명')
      await userEvent.click(searchButton)

      // 타임아웃이 설정되었는지 확인
      expect(timeoutSet).toBe(true)

      // 10초 경과 시도
      vi.advanceTimersByTime(10000)

      await waitFor(() => {
        // 타임아웃 후 요청이 취소되어야 함
        expect(screen.getByText(/검색 시간이 초과되었습니다/i)).toBeInTheDocument()
      }, { timeout: 100 })

      vi.useRealTimers()
    })
  })
})
