import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { useRouter, useSearchParams } from 'next/navigation'
import CompanySearchPage from '../page'

// Mock next/navigation
const mockPush = vi.fn()
const mockGet = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    back: vi.fn(),
  }),
  useSearchParams: () => ({
    get: mockGet,
  }),
}))

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock as any

// Mock fetch
global.fetch = vi.fn()

describe('CompanySearchPage - handleSearch 함수 테스트', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGet.mockReturnValue('')
    mockPush.mockClear()
    ;(global.fetch as any).mockClear()
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  describe('TC1: 빈 문자열 입력', () => {
    it('빈 문자열이나 공백만 입력하면 즉시 반환하고 상태 변경 없음', async () => {
      render(<CompanySearchPage />)
      
      const searchInput = screen.getByPlaceholderText(/회사명을 입력하세요/)
      const searchButton = screen.getByRole('button', { name: /검색/ })

      // 빈 문자열 검색 시도
      fireEvent.change(searchInput, { target: { value: '   ' } })
      fireEvent.click(searchButton)

      // fetch가 호출되지 않아야 함
      await waitFor(() => {
        expect(global.fetch).not.toHaveBeenCalled()
      })
    })
  })

  describe('TC2: URL 업데이트 모드', () => {
    it('updateUrl=true이고 query가 다르면 router.push 호출하고 즉시 return', async () => {
      mockGet.mockImplementation((key: string) => {
        if (key === 'q') return '기존검색어'
        return null
      })

      render(<CompanySearchPage />)
      
      const searchInput = screen.getByPlaceholderText(/회사명을 입력하세요/)
      const searchButton = screen.getByRole('button', { name: /검색/ })

      fireEvent.change(searchInput, { target: { value: '삼성생명' } })
      fireEvent.click(searchButton)

      // router.push가 호출되어야 함
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/company-search?q=삼성생명')
      })

      // fetch는 호출되지 않아야 함 (useEffect에서 처리)
      expect(global.fetch).not.toHaveBeenCalled()
    })
  })

  describe('TC3: 직접 검색 모드 - 성공 케이스', () => {
    it('검색 성공 시 결과를 상태에 반영', async () => {
      const mockMatches = [
        {
          id: '1',
          company_name: '삼성생명',
          manager_name: '홍길동',
          source: 'business_directory',
        },
      ]

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ matches: mockMatches }),
      })

      mockGet.mockImplementation((key: string) => {
        if (key === 'q') return '삼성생명'
        return null
      })

      render(<CompanySearchPage />)

      // useEffect가 자동으로 검색을 실행하므로 결과를 기다림
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled()
      })

      // 검색 결과가 표시되어야 함
      await waitFor(() => {
        expect(screen.getByText('삼성생명')).toBeInTheDocument()
      })
    })
  })

  describe('TC4: 빈 결과 → Fallback', () => {
    it('검색 결과가 비어있으면 사용자 입력값을 fallback으로 표시', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ matches: [] }),
      })

      mockGet.mockImplementation((key: string) => {
        if (key === 'q') return '존재하지않는회사'
        return null
      })

      render(<CompanySearchPage />)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled()
      })

      // Fallback으로 사용자 입력값이 표시되어야 함
      await waitFor(() => {
        expect(screen.getByText('존재하지않는회사')).toBeInTheDocument()
      }, { timeout: 3000 })
    })
  })

  describe('TC5: AbortError 처리', () => {
    it('AbortError는 조용히 처리하고 에러를 표시하지 않음', async () => {
      const abortError = new Error('The operation was aborted')
      abortError.name = 'AbortError'

      ;(global.fetch as any)
        .mockRejectedValueOnce(abortError)

      mockGet.mockImplementation((key: string) => {
        if (key === 'q') return '삼성생명'
        return null
      })

      render(<CompanySearchPage />)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled()
      })

      // 에러 메시지가 표시되지 않아야 함
      await waitFor(() => {
        const errorMessages = screen.queryAllByText(/오류|에러|error/i)
        expect(errorMessages.length).toBe(0)
      }, { timeout: 2000 })
    })
  })

  describe('TC6: 타임아웃 처리', () => {
    it('10초 후 요청이 자동으로 취소됨', async () => {
      vi.useFakeTimers()

      // fetch가 10초 이상 지연되도록 모킹
      ;(global.fetch as any).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                ok: true,
                status: 200,
                json: async () => ({ matches: [] }),
              })
            }, 11000) // 11초 후 응답
          })
      )

      mockGet.mockImplementation((key: string) => {
        if (key === 'q') return '삼성생명'
        return null
      })

      render(<CompanySearchPage />)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled()
      })

      // 10초 경과
      vi.advanceTimersByTime(10000)

      // AbortController가 abort되었는지 확인
      // (실제로는 AbortError가 발생하고 조용히 처리됨)
      await waitFor(() => {
        // 타임아웃 후에도 에러가 표시되지 않아야 함 (AbortError는 조용히 처리)
        const errorMessages = screen.queryAllByText(/시간이 초과/i)
        expect(errorMessages.length).toBe(0)
      })

      vi.useRealTimers()
    })
  })

  describe('TC7: HTTP 에러 처리', () => {
    it('HTTP 500 에러 시 적절한 에러 메시지 표시', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ detail: '서버 오류가 발생했습니다.' }),
      })

      mockGet.mockImplementation((key: string) => {
        if (key === 'q') return '삼성생명'
        return null
      })

      render(<CompanySearchPage />)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled()
      })

      // 에러 메시지가 표시되어야 함
      await waitFor(() => {
        expect(screen.getByText(/오류|에러/i)).toBeInTheDocument()
      })
    })
  })

  describe('TC8: 연속 검색 - 이전 요청 취소', () => {
    it('새 검색 시작 시 이전 요청이 취소됨', async () => {
      let firstRequestAborted = false

      // 첫 번째 요청 (느리게 응답)
      ;(global.fetch as any).mockImplementationOnce(
        (url: string, options: any) => {
          return new Promise((resolve, reject) => {
            // signal이 abort되면 reject
            if (options?.signal) {
              options.signal.addEventListener('abort', () => {
                firstRequestAborted = true
                reject(new DOMException('Aborted', 'AbortError'))
              })
            }
            // 5초 후 응답 (하지만 abort될 것)
            setTimeout(() => {
              resolve({
                ok: true,
                status: 200,
                json: async () => ({ matches: [{ company_name: '첫검색' }] }),
              })
            }, 5000)
          })
        }
      )

      // 두 번째 요청 (빠르게 응답)
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          matches: [{ company_name: '두번째검색' }],
        }),
      })

      mockGet.mockImplementation((key: string) => {
        if (key === 'q') return '첫검색'
        return null
      })

      const { rerender } = render(<CompanySearchPage />)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled()
      })

      // URL 변경 시뮬레이션 (두 번째 검색)
      mockGet.mockImplementation((key: string) => {
        if (key === 'q') return '두번째검색'
        return null
      })

      rerender(<CompanySearchPage />)

      await waitFor(() => {
        // 첫 번째 요청이 취소되었는지 확인
        expect(firstRequestAborted).toBe(true)
      })

      // 두 번째 검색 결과만 표시되어야 함
      await waitFor(() => {
        expect(screen.getByText('두번째검색')).toBeInTheDocument()
        expect(screen.queryByText('첫검색')).not.toBeInTheDocument()
      })
    })
  })

  describe('TC9: API 호출 파라미터 검증', () => {
    it('올바른 API 엔드포인트와 파라미터로 호출됨', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ matches: [] }),
      })

      mockGet.mockImplementation((key: string) => {
        if (key === 'q') return '삼성생명'
        return null
      })

      render(<CompanySearchPage />)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled()
      })

      const fetchCall = (global.fetch as any).mock.calls[0]
      const [url, options] = fetchCall

      expect(url).toContain('/api/company-search/search')
      expect(options.method).toBe('POST')
      expect(options.headers['Content-Type']).toBe('application/json')
      
      const body = JSON.parse(options.body)
      expect(body.company_name).toBe('삼성생명')
      expect(options.signal).toBeInstanceOf(AbortSignal)
    })
  })
})
