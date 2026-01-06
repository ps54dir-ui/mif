'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, BarChart3, Shield, TrendingUp, Zap, Target, Layers, CheckCircle2, Search, Sparkles, User, LogIn, FileText, TrendingUp as TrendingUpIcon, Calendar, Upload, ChevronDown, Youtube, Facebook, Instagram, BookOpen, Users, ShoppingCart, Store, Globe, MessageSquare, MapPin } from 'lucide-react'
import { isAuthenticated, getCurrentUser } from '@/lib/auth/auth'
import { validateCompanyName } from '@/lib/validation/companyValidation'
import MIFCopilot from '@/components/copilot/MIFCopilot'

export default function HomeDashboard() {
  const router = useRouter()
  const [brandName, setBrandName] = useState('')
  const [representativeName, setRepresentativeName] = useState('')
  const [companyUrl, setCompanyUrl] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [showChannelUpload, setShowChannelUpload] = useState(false)
  const [channelInput, setChannelInput] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [user, setUser] = useState<any>(null)
  const [companyMatches, setCompanyMatches] = useState<any[]>([])
  const [showCompanySelection, setShowCompanySelection] = useState(false)
  const [isCheckingDuplicates, setIsCheckingDuplicates] = useState(false)
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<any[]>([])
  const [showAutocomplete, setShowAutocomplete] = useState(false)
  const [isLoadingAutocomplete, setIsLoadingAutocomplete] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const autocompleteTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<HTMLDivElement>(null)

  // 클라이언트 마운트 확인 (Hydration 오류 방지)
  useEffect(() => {
    setIsMounted(true)
    if (typeof window !== 'undefined') {
      setUser(getCurrentUser())
    }
  }, [])

  // 외부 클릭 시 자동완성 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        autocompleteRef.current &&
        !autocompleteRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowAutocomplete(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // 자동완성 검색 함수
  const searchAutocomplete = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setAutocompleteSuggestions([])
      setShowAutocomplete(false)
      return
    }

    try {
      setIsLoadingAutocomplete(true)
      const token = localStorage.getItem('access_token')
      if (!token) {
        setAutocompleteSuggestions([])
        setShowAutocomplete(false)
        return
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

      const response = await fetch(`${apiUrl}/api/company-search/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          company_name: query.trim()
        })
      })

      if (!response.ok) {
        setAutocompleteSuggestions([])
        setShowAutocomplete(false)
        return
      }

      const data = await response.json()
      
      if (data.matches && data.matches.length > 0) {
        setAutocompleteSuggestions(data.matches.slice(0, 5)) // 최대 5개만 표시
        setShowAutocomplete(true)
      } else {
        setAutocompleteSuggestions([])
        setShowAutocomplete(false)
      }
    } catch (error) {
      console.error('자동완성 검색 오류:', error)
      setAutocompleteSuggestions([])
      setShowAutocomplete(false)
    } finally {
      setIsLoadingAutocomplete(false)
    }
  }, [])

  // Debounced 자동완성 검색
  const handleBrandNameChange = (value: string) => {
    setBrandName(value)
    setShowAutocomplete(false)

    // 기존 타이머 취소
    if (autocompleteTimeoutRef.current) {
      clearTimeout(autocompleteTimeoutRef.current)
    }

    // 300ms 후에 검색 실행 (debounce)
    autocompleteTimeoutRef.current = setTimeout(() => {
      searchAutocomplete(value)
    }, 300)
  }

  // 자동완성 항목 선택
  const handleSelectAutocomplete = (company: any) => {
    setBrandName(company.company_name)
    if (company.manager_name) {
      setRepresentativeName(company.manager_name)
    }
    if (company.company_url) {
      setCompanyUrl(company.company_url)
    }
    setShowAutocomplete(false)
    setAutocompleteSuggestions([])
  }

  const checkCompanyDuplicates = async () => {
    // 기업명, 대표자명, 회사 URL 중 하나만 입력해도 검색 가능
    if (!brandName.trim() && !representativeName.trim() && !companyUrl.trim()) {
      alert('기업명, 대표자명, 회사 URL 중 하나 이상을 입력해주세요.')
      return
    }

    setIsCheckingDuplicates(true)
    
    // 타임아웃 설정 (25초 - AbortSignal.timeout보다 길게)
    const timeoutId = setTimeout(() => {
      console.warn('회사 검색 타임아웃 (25초 초과)')
      setIsCheckingDuplicates(false)
      // 타임아웃 시에도 검색 결과 페이지로 이동
      const searchQuery = brandName.trim() || representativeName.trim() || companyUrl.trim()
      router.push(`/company-search?q=${encodeURIComponent(searchQuery)}&error=timeout`)
    }, 25000)
    
    try {
      const token = localStorage.getItem('access_token')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

      console.log('회사 검색 시작:', {
        company_name: brandName.trim() || undefined,
        representative_name: representativeName.trim() || undefined,
        company_url: companyUrl.trim() || undefined
      })

      // 로그인 여부와 관계없이 검색 API 호출 시도
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      // 빈 문자열이 아닌 경우에만 전송 (2개 이상 입력 시 AND 조건)
      const requestBody: any = {}
      if (brandName.trim()) {
        requestBody.company_name = brandName.trim()
      }
      if (representativeName.trim()) {
        requestBody.representative_name = representativeName.trim()
      }
      if (companyUrl.trim()) {
        requestBody.company_url = companyUrl.trim()
      }

      const response = await fetch(`${apiUrl}/api/company-search/search`, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(20000) // 20초 타임아웃 (백엔드에서 여러 소스 조회로 시간 소요)
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('회사 검색 API 오류:', response.status, errorText)
        // API 오류 시에도 검색 결과 페이지로 이동 (오류 상태 표시)
        setIsCheckingDuplicates(false)
        router.push(`/company-search?q=${encodeURIComponent(brandName.trim())}&error=true`)
        return
      }

      const data = await response.json()
      console.log('회사 검색 결과:', data)

      // 검색 결과가 있으면 검색 결과 페이지로 이동
      if (data.matches && data.matches.length > 0) {
        console.log('검색 결과 발견:', data.matches.length, '개')
        setIsCheckingDuplicates(false)
        // 검색 결과 페이지로 이동 (검색어는 입력된 값 중 하나)
        const searchQuery = brandName.trim() || representativeName.trim() || companyUrl.trim()
        router.push(`/company-search?q=${encodeURIComponent(searchQuery)}`)
        return
      }

      // 매칭되는 회사가 없으면 검색 결과 페이지로 이동 (확인 메시지 없이)
      console.log('매칭되는 회사 없음, 검색 결과 페이지로 이동')
      setIsCheckingDuplicates(false)
      // 검색 결과 페이지로 이동 (결과 없음 상태 표시)
      const searchQuery = brandName.trim() || representativeName.trim() || companyUrl.trim()
      router.push(`/company-search?q=${encodeURIComponent(searchQuery)}`)
      
    } catch (error: any) {
      clearTimeout(timeoutId)
      console.error('회사 검색 오류:', error)
      
      // 타임아웃 에러인지 확인
      if (error.name === 'AbortError' || error.name === 'TimeoutError') {
        console.warn('회사 검색 타임아웃')
        setIsCheckingDuplicates(false)
        const searchQuery = brandName.trim() || representativeName.trim() || companyUrl.trim()
        router.push(`/company-search?q=${encodeURIComponent(searchQuery)}&error=timeout`)
      } else {
        // 기타 오류 발생 시 검색 결과 페이지로 이동 (오류 상태 표시)
        setIsCheckingDuplicates(false)
        const searchQuery = brandName.trim() || representativeName.trim() || companyUrl.trim()
        router.push(`/company-search?q=${encodeURIComponent(searchQuery)}&error=true`)
      }
    } finally {
      clearTimeout(timeoutId)
      setIsCheckingDuplicates(false)
    }
  }

  const startDiagnosisWithCompany = async (companyId: string | null) => {
    setIsSearching(true)
    
    try {
      // 진단 시작 API 호출 - Supabase에 즉시 기록
      const { startDiagnosis } = await import('@/lib/api/diagnosticsApi')
      
      const channelInfo: any = {}
      if (channelInput.trim()) {
        channelInfo.channels = [channelInput.trim()]
      }
      if (uploadedFile) {
        channelInfo.excel_data = { filename: uploadedFile.name }
      }
      if (companyId) {
        channelInfo.company_id = companyId
      }
      
      const diagnosisResult = await startDiagnosis({
        company_name: brandName.trim(),
        brand_name: brandName.trim(),
        channel_info: Object.keys(channelInfo).length > 0 ? channelInfo : undefined,
      })
      
      // 진단 ID와 리포트 ID를 URL 파라미터로 전달
      router.push(
        `/dashboard?brand_name=${encodeURIComponent(brandName.trim())}&diagnosis_id=${diagnosisResult.diagnosis_id}&report_id=${diagnosisResult.report_id}`
      )
    } catch (error) {
      console.error('진단 시작 오류:', error)
      // 오류가 발생해도 대시보드로 이동 (기존 동작 유지)
      router.push(`/dashboard?brand_name=${encodeURIComponent(brandName.trim())}`)
    } finally {
      setIsSearching(false)
      setShowCompanySelection(false)
    }
  }

  const handleBrandSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 기업명, 대표자명, 회사 URL 중 하나만 입력해도 검색 가능
    if (!brandName.trim() && !representativeName.trim() && !companyUrl.trim()) {
      alert('기업명, 대표자명, 회사 URL 중 하나 이상을 입력해주세요.')
      return
    }

    // 기업명이 입력된 경우에만 유효성 검증
    if (brandName.trim()) {
      const validation = validateCompanyName(brandName.trim())
      if (!validation.isValid) {
        alert(validation.errorMessage)
        return
      }
    }

    // 중복 검사 및 검색 시작
    await checkCompanyDuplicates()
  }

  const handleSelectCompany = async (companyId: string) => {
    await startDiagnosisWithCompany(companyId)
  }
  const features = [
    {
      icon: FileText,
      title: '리뷰 관리 및 분석',
      description: '온라인 리뷰 수집, 감정 분석, 악플 감지 및 대응 전략',
      link: '/market/reviews'
    },
    {
      icon: Search,
      title: 'SEO/GEO/AEO 진단',
      description: '검색 엔진 최적화, 지역 검색, AI 답변 엔진 최적화',
      link: '/dashboard?category=seo-geo-aeo'
    },
    {
      icon: Shield,
      title: '컴플라이언스 시스템',
      description: '한국/국제 규정 및 플랫폼 정책 검증, 위험 진단, 개선 계획',
      link: '/compliance/detail'
    },
    {
      icon: TrendingUp,
      title: '시장 보호 시스템',
      description: '경쟁사 부정행위 감지, 악플/공격 감시, 신고 도구',
      link: '/market/competitors'
    },
    {
      icon: Layers,
      title: '심리 분석 모듈',
      description: '고객 심리 기반 CVR 예측, 가격 심리, 재타겟팅 전략',
      link: '/dashboard?category=psychology'
    },
    {
      icon: Zap,
      title: 'ICE Score 우선순위',
      description: '영향도, 확신도, 용이성을 기반한 전략 우선순위 수립',
      link: '/dashboard?category=ice-score'
    },
    {
      icon: BarChart3,
      title: '리포트 생성 및 관리',
      description: '종합 리포트 생성, PDF 내보내기, 리포트 비교 분석',
      link: '/dashboard?category=reports'
    },
    {
      icon: TrendingUp,
      title: '성과 시뮬레이션',
      description: '마케팅 전략 시뮬레이션 및 예측 성과 분석',
      link: '/dashboard?category=simulation'
    },
    {
      icon: CheckCircle2,
      title: '진단 히스토리 비교',
      description: '날짜별 진단 결과 비교, 성장 추이 분석',
      link: '/company-growth-comparison'
    },
    {
      icon: FileText,
      title: '종합 의견 및 전략',
      description: 'SWOT 분석, 종합 평가, 전략 수립 및 실행 계획',
      link: '/comprehensive-opinion'
    },
    // 채널별 진단 및 분석
    {
      icon: BarChart3,
      title: 'GA4 진단 및 분석',
      description: 'Google Analytics 4 데이터 분석, 전환율, 사용자 행동 분석',
      link: '/dashboard?category=ga4'
    },
    {
      icon: Facebook,
      title: 'Meta (Facebook/Instagram)',
      description: 'Facebook, Instagram 도달, 참여, 전환 데이터 분석',
      link: '/dashboard?category=meta'
    },
    {
      icon: Youtube,
      title: 'YouTube 진단 및 분석',
      description: 'YouTube 채널 성과, 조회수, 구독자, 참여도 분석',
      link: '/dashboard?category=youtube'
    },
    {
      icon: BookOpen,
      title: '블로그 (네이버 블로그)',
      description: '네이버 블로그 게시물, 조회수, 댓글, 참여율 분석',
      link: '/dashboard?category=blog'
    },
    {
      icon: Users,
      title: '카페 진단 및 분석(네이버, 다음)',
      description: '네이버 카페, 다음 카페 회원, 게시물, 활동량 분석',
      link: '/dashboard?category=cafe'
    },
    {
      icon: ShoppingCart,
      title: '판매 사이트 분석(네이버, 쿠팡)',
      description: '네이버 스마트스토어, 쿠팡 매출, 주문, 전환율 분석',
      link: '/dashboard?category=sales-sites'
    },
    {
      icon: Store,
      title: '자사몰 진단 및 분석',
      description: '자사 온라인 스토어 방문자, 주문, 매출, 전환율 분석',
      link: '/dashboard?category=own-store'
    },
    {
      icon: Globe,
      title: '상세페이지 진단 및 분석',
      description: '홈페이지 방문자, 페이지뷰, 이탈률, 전환율 분석',
      link: '/dashboard?category=homepage'
    },
    {
      icon: MessageSquare,
      title: 'SNS (Twitter/TikTok/Threads) 진단 및 분석',
      description: 'Twitter, TikTok, Threads 팔로워, 게시물, 참여도 분석',
      link: '/dashboard?category=sns'
    },
    {
      icon: Search,
      title: '네이버 검색 진단 및 분석',
      description: '네이버 검색 노출, 클릭률, 순위, SEO/GEO/AEO 분석',
      link: '/dashboard?category=naver-search'
    },
    {
      icon: MapPin,
      title: '네이버 플레이스 진단 및 분석',
      description: '네이버 플레이스 리뷰, 평점, 방문자, 검색 노출 분석',
      link: '/dashboard?category=naver-place'
    }
  ]

  const stats = [
    // 현재 홈 "전체 기능" 구성 기준으로 표시
    { label: '진단 항목', value: '21', color: 'text-blue-600' },
    { label: '지원 채널', value: '11', color: 'text-purple-600' }, // GA4, Meta, YouTube, 블로그, 카페, 판매사이트, 자사몰, 상세페이지, SNS, 네이버검색, 네이버플레이스
    { label: '분석 레이어', value: '3', color: 'text-green-600' },
    // 검증 불가능한 정확도 수치 대신 시스템이 보장하는 표준을 노출
    { label: '응답 표준', value: 'JSON', color: 'text-orange-600' }
  ]

  // CSV 템플릿 다운로드 함수
  const downloadChannelTemplate = () => {
    const csvContent = `회사명,홈페이지URL,채널유형,권한상태,채널명또는URL,비고
나이키코리아,https://www.nike.com/kr,GA4,승인,GA4-123456789,Google Analytics 4 접근 권한 부여 완료
나이키코리아,https://www.nike.com/kr,Meta (Facebook/Instagram),승인,1234567890,비즈니스 관리자 권한 부여 완료
나이키코리아,https://www.nike.com/kr,YouTube,미승인,UC1234567890,채널 ID 확인됨, 권한 미부여
나이키코리아,https://www.nike.com/kr,Instagram,승인,@nike_korea,인스타그램 계정 연결 완료
나이키코리아,https://www.nike.com/kr,네이버 블로그,미요청,,운영하지 않음
나이키코리아,https://www.nike.com/kr,네이버 카페,미승인,cafe.naver.com/nike,카페 운영 중, 권한 미부여
나이키코리아,https://www.nike.com/kr,다음 카페,미요청,,운영하지 않음
나이키코리아,https://www.nike.com/kr,네이버 스마트스토어,승인,store_12345,스마트스토어 API 키 제공 완료
나이키코리아,https://www.nike.com/kr,쿠팡,미승인,partner.coupang.com,쿠팡 파트너스 운영 중
나이키코리아,https://www.nike.com/kr,자사몰,미승인,shop.nike.com/kr,자사 온라인 스토어 운영 중
나이키코리아,https://www.nike.com/kr,네이버 플레이스,승인,place_12345,스마트플레이스 관리자 권한 부여 완료
나이키코리아,https://www.nike.com/kr,네이버 서치어드바이저,미승인,searchadvisor.naver.com,사이트 등록됨, 권한 미부여
나이키코리아,https://www.nike.com/kr,네이버 통합 광고주센터,승인,ads.naver.com,광고 계정 보고서 열람 권한 부여 완료
나이키코리아,https://www.nike.com/kr,Twitter/X,미요청,,운영하지 않음
나이키코리아,https://www.nike.com/kr,TikTok,미승인,@nike_korea,티크톡 계정 운영 중
나이키코리아,https://www.nike.com/kr,Threads,미요청,,운영하지 않음
`
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', 'mif-channel-permission-template.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 파일 형식 검증
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ]
    const validExtensions = ['.xlsx', '.xls', '.csv']
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()

    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
      alert('엑셀 파일(.xlsx, .xls) 또는 CSV(.csv) 파일만 업로드 가능합니다.')
      return
    }

    setUploadedFile(file)
    
    // 엑셀 파일이 업로드되면 바로 배치 리포트 생성 시작
    try {
      setIsSearching(true)
      
      const formData = new FormData()
      formData.append('file', file)

      const token = localStorage.getItem('access_token')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

      const response = await fetch(`${apiUrl}/api/batch-report/upload-and-generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = '배치 리포트 생성에 실패했습니다.'
        
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.detail || errorMessage
        } catch {
          errorMessage = errorText || errorMessage
        }
        
        throw new Error(errorMessage)
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.message || '배치 리포트 생성에 실패했습니다.')
      }

      // 결과를 sessionStorage에 저장
      sessionStorage.setItem('batch_report_result', JSON.stringify(result))
      
      // 결과 페이지로 이동
      router.push('/sales/clients/batch-result')
    } catch (error) {
      console.error('배치 리포트 생성 오류:', error)
      const errorMessage = error instanceof Error ? error.message : '배치 리포트 생성에 실패했습니다.'
      alert(errorMessage)
    } finally {
      setIsSearching(false)
    }
  }

  // 서버 사이드 렌더링 시 기본 구조만 반환 (Hydration 오류 방지)
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-400">로딩 중...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header with Auth Buttons */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-end items-center gap-4">
            {isAuthenticated() && user ? (
              <>
                <div className="flex items-center gap-2 text-white">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{user.username || user.email}</span>
                </div>
                <Link
                  href="/login"
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white text-sm font-medium rounded-lg transition-all"
                >
                  로그아웃
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white text-sm font-medium rounded-lg transition-all flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  로그인
                </Link>
                <Link
                  href="/login?mode=register"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-8">
              <Zap className="w-4 h-4" />
              <span>세계 최고 수준의 마케팅 진단 시스템</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">AI Marketing Intelligence Framework</span>
            </h1>
            
            {/* Stats as Horizontal Title Banner */}
            <div className="mb-12 max-w-5xl mx-auto">
              <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-md border-2 border-white/20 rounded-2xl p-6 shadow-2xl">
                <div className="text-center mb-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    AI 기반 종합 마케팅 진단 및 전략 대시보드
                  </h2>
                  <p className="text-gray-300 text-lg">
                    AI와 데이터 기반 의사결정으로 마케팅 성과를 극대화하세요
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {stats.map((stat, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        // 각 통계 클릭 시 해당 섹션으로 스크롤 또는 상세 페이지 이동
                        console.log(`Clicked: ${stat.label}`)
                      }}
                      className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-blue-400/50 rounded-xl p-4 transition-all duration-300 cursor-pointer group"
                    >
                      <div className={`text-3xl font-bold ${stat.color} mb-1 group-hover:scale-110 transition-transform`}>{stat.value}</div>
                      <div className="text-sm text-gray-300 group-hover:text-white transition-colors">{stat.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Brand Search Form - 진단할 기업명 입력 */}
            <div className="max-w-3xl mx-auto mb-12">
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  기업 진단 시작하기
                </h2>
                <p className="text-gray-300 text-lg">
                  진단할 기업명을 입력하여 종합 마케팅 진단을 시작하세요
                </p>
              </div>
              
              <form onSubmit={handleBrandSearch} className="relative">
                <div className="space-y-3 bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-2xl p-4 shadow-2xl">
                  {/* 기업명 입력 (자동완성) */}
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-1">
                      <Search className="w-4 h-4 text-blue-400" />
                      <label className="text-xs text-gray-300 font-medium">기업명 입력 (선택)</label>
                    </div>
                    <div className="relative">
                      <input
                        ref={inputRef}
                        type="text"
                        value={brandName}
                        onChange={(e) => handleBrandNameChange(e.target.value)}
                        onFocus={() => {
                          if (autocompleteSuggestions.length > 0) {
                            setShowAutocomplete(true)
                          }
                        }}
                        placeholder="예: 나이키, 애플, 삼성, 현대자동차 등"
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition-all"
                        disabled={isSearching || isCheckingDuplicates}
                      />
                      {isLoadingAutocomplete && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                        </div>
                      )}

                      {/* 자동완성 드롭다운 */}
                      {showAutocomplete && autocompleteSuggestions.length > 0 && (
                        <div
                          ref={autocompleteRef}
                          className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-md border border-white/30 rounded-xl shadow-2xl max-h-60 overflow-y-auto"
                        >
                          {autocompleteSuggestions.map((company, index) => (
                            <button
                              key={company.id || `public-${index}`}
                              type="button"
                              onClick={() => handleSelectAutocomplete(company)}
                              className="w-full text-left px-4 py-3 hover:bg-blue-500/20 border-b border-white/10 last:border-b-0 transition-colors group"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-900 group-hover:text-blue-600">
                                      {company.company_name}
                                    </span>
                                    {company.source === 'public_data' && (
                                      <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                                        공공데이터
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                                    {company.manager_name && (
                                      <span className="text-xs text-gray-500">
                                        대표자: {company.manager_name}
                                      </span>
                                    )}
                                    {company.company_url && (
                                      <span className="text-xs text-gray-500 truncate max-w-xs">
                                        {company.company_url}
                                      </span>
                                    )}
                                    {company.phone && (
                                      <span className="text-xs text-gray-500">
                                        {company.phone}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-blue-600 rotate-[-90deg] transition-transform" />
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 추가 정보 입력 (중복 회사 구분용) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-300 font-medium mb-1 block">대표자명 (선택)</label>
                      <input
                        type="text"
                        value={representativeName}
                        onChange={(e) => setRepresentativeName(e.target.value)}
                        placeholder="대표자명을 입력하세요"
                        className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                        disabled={isSearching || isCheckingDuplicates}
                      />
                      <p className="text-xs text-gray-400 mt-1">동일 회사명 구분용</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-300 font-medium mb-1 block">회사 URL (선택)</label>
                      <input
                        type="text"
                        value={companyUrl}
                        onChange={(e) => setCompanyUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                        disabled={isSearching || isCheckingDuplicates}
                      />
                      <p className="text-xs text-gray-400 mt-1">동일 회사명 구분용</p>
                    </div>
                  </div>

                  {/* 회사 선택 화면 */}
                  {showCompanySelection && companyMatches.length > 0 && (
                    <div className="bg-white/10 border border-yellow-400/50 rounded-lg p-4">
                      <div className="flex items-start gap-2 mb-3">
                        <span className="text-yellow-300 text-lg">⚠️</span>
                        <div>
                          <p className="text-sm text-yellow-300 font-medium">
                            &quot;{brandName}&quot;로 검색한 결과 {companyMatches.length}개의 회사가 발견되었습니다.
                          </p>
                          <p className="text-xs text-gray-300 mt-1">
                            진단할 회사를 선택해주세요. 목록에 없으면 &quot;새로 등록&quot;을 선택하세요.
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2 max-h-60 overflow-y-auto mb-3">
                        {companyMatches.map((match, index) => (
                          <button
                            key={match.id}
                            onClick={() => handleSelectCompany(match.id)}
                            className="w-full text-left px-4 py-3 bg-white/5 hover:bg-blue-500/20 border border-white/20 hover:border-blue-400/50 rounded-lg transition-all group"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="font-medium text-white group-hover:text-blue-300">
                                  {match.company_name}
                                </div>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                                  {match.manager_name && (
                                    <div className="text-xs text-gray-300">
                                      <span className="text-gray-400">대표자:</span> {match.manager_name}
                                    </div>
                                  )}
                                  {match.company_url && (
                                    <div className="text-xs text-gray-300 truncate max-w-xs">
                                      <span className="text-gray-400">URL:</span> {match.company_url}
                                    </div>
                                  )}
                                  {match.email && (
                                    <div className="text-xs text-gray-300">
                                      <span className="text-gray-400">이메일:</span> {match.email}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => startDiagnosisWithCompany(null)}
                        className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg transition-all"
                      >
                        목록에 없음 - 새로 등록하고 진단 시작
                      </button>
                    </div>
                  )}

                  {/* 검색 시작 버튼 */}
                  <button
                    type="submit"
                    disabled={(!brandName.trim() && !representativeName.trim() && !companyUrl.trim()) || isSearching || isCheckingDuplicates}
                    className="w-full px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                  >
                    {isCheckingDuplicates ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>검색 중...</span>
                      </>
                    ) : isSearching ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>분석 중...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        <span>검색 시작</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Channel Input Section */}
              <div className="mt-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4 text-blue-400" />
                    <label className="text-sm text-gray-300 font-medium">채널 정보 입력</label>
                  </div>
                  <Link
                    href={`/channel-management?brand_name=${encodeURIComponent(brandName.trim() || '')}`}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors underline"
                  >
                    내부 전용 페이지로 이동 →
                  </Link>
                </div>
                
                {/* 엑셀 업로드 */}
                <div className="mb-3 space-y-2">
                  {/* 템플릿 다운로드 버튼 */}
                  <button
                    onClick={downloadChannelTemplate}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-lg transition-colors"
                  >
                    <FileText className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-300">📥 템플릿 다운로드 (CSV)</span>
                  </button>
                  
                  {/* 파일 업로드 */}
                  <label className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg cursor-pointer transition-colors w-full">
                    <Upload className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">엑셀/CSV 파일 업로드</span>
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  {uploadedFile && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-green-400">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{uploadedFile.name}</span>
                    </div>
                  )}
                </div>

                {/* 채널명 또는 URL 입력 */}
                <div className="space-y-2">
                  <input
                    type="text"
                    value={channelInput}
                    onChange={(e) => setChannelInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && channelInput.trim()) {
                        router.push(`/channel-management?brand_name=${encodeURIComponent(brandName.trim() || '')}&channel=${encodeURIComponent(channelInput.trim())}`)
                      }
                    }}
                    placeholder="채널명 또는 URL 입력 (예: @nike, https://instagram.com/nike)"
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <p className="text-xs text-gray-400">
                    채널명 또는 URL 또는 엑셀 업로드 해주시기 바랍니다.
                  </p>
                  {channelInput.trim() && (
                    <button
                      onClick={() => {
                        router.push(`/channel-management?brand_name=${encodeURIComponent(brandName.trim() || '')}&channel=${encodeURIComponent(channelInput.trim())}`)
                      }}
                      className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      입력한 채널로 내부 페이지 이동
                    </button>
                  )}
                </div>
              </div>

              <p className="text-center text-gray-400 text-sm mt-4">
                💡 기업명을 입력하면 자동으로 채널을 탐색하고 종합 마케팅 진단을 시작합니다
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <Link 
                href="/diagnosis-results"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600/80 to-blue-700/80 hover:from-blue-600 hover:to-blue-700 backdrop-blur-sm border border-blue-400/30 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg shadow-blue-500/30"
              >
                <FileText className="w-5 h-5" />
                <span>전체 분석 자료</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                href="/comprehensive-opinion"
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600/80 to-purple-700/80 hover:from-purple-600 hover:to-purple-700 backdrop-blur-sm border border-purple-400/30 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg shadow-purple-500/30"
              >
                <TrendingUpIcon className="w-5 h-5" />
                <span>종합의견</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link 
                href="/company-growth-comparison"
                className="group relative px-8 py-4 bg-gradient-to-r from-green-600/80 to-green-700/80 hover:from-green-600 hover:to-green-700 backdrop-blur-sm border border-green-400/30 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg shadow-green-500/30"
              >
                <Calendar className="w-5 h-5" />
                <span>기업성장비교</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* Quick Access Section removed per new navigation spec */}

      {/* Features Section - 전체 기능 (태그/배지 형태) */}
      <div className="relative bg-white/5 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              전체 기능
            </h2>
            <p className="text-gray-400 text-lg">
              세계 최고 수준의 마케팅 진단 및 분석 도구
            </p>
          </div>

          {/* 태그/배지 형태의 기능 표시 */}
          <div className="flex flex-wrap justify-center gap-3">
            {features.map((feature, index) => {
              const Icon = feature.icon
              const colors = [
                'from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-300',
                'from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-300',
                'from-green-500/20 to-green-600/20 border-green-500/30 text-green-300',
                'from-red-500/20 to-red-600/20 border-red-500/30 text-red-300',
                'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30 text-yellow-300',
                'from-cyan-500/20 to-cyan-600/20 border-cyan-500/30 text-cyan-300',
                'from-pink-500/20 to-pink-600/20 border-pink-500/30 text-pink-300',
                'from-orange-500/20 to-orange-600/20 border-orange-500/30 text-orange-300',
                'from-indigo-500/20 to-indigo-600/20 border-indigo-500/30 text-indigo-300',
                'from-teal-500/20 to-teal-600/20 border-teal-500/30 text-teal-300',
                'from-rose-500/20 to-rose-600/20 border-rose-500/30 text-rose-300',
                'from-violet-500/20 to-violet-600/20 border-violet-500/30 text-violet-300'
              ]
              const colorClass = colors[index % colors.length]
              
              return (
                <Link
                  key={index}
                  href={feature.link}
                  className={`group relative bg-gradient-to-r ${colorClass} backdrop-blur-sm border rounded-full px-5 py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium whitespace-nowrap">
                      {feature.title}
                    </span>
                  </div>
                  {/* 툴팁 */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                    <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-xl whitespace-normal w-48 text-center">
                      {feature.description}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                        <div className="border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* 추가 정보: 기능 카테고리별 그룹핑 */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                분석 및 진단
              </h3>
              <div className="space-y-2">
                {features.filter(f => 
                  [
                    'SEO/GEO/AEO 진단',
                    '심리 분석 모듈',
                    'GA4 진단 및 분석',
                    'Meta (Facebook/Instagram)',
                    'YouTube 진단 및 분석',
                    '블로그 (네이버 블로그)',
                    '카페 진단 및 분석(네이버, 다음)',
                    '판매 사이트 분석(네이버, 쿠팡)',
                    '자사몰 진단 및 분석',
                    '상세페이지 진단 및 분석',
                    'SNS (Twitter/TikTok/Threads) 진단 및 분석',
                    '네이버 검색 진단 및 분석',
                    '네이버 플레이스 진단 및 분석'
                  ].includes(f.title)
                ).map((feature, idx) => (
                  <div key={idx} className="text-sm text-gray-300 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    {feature.title}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-400" />
                관리 및 보호
              </h3>
              <div className="space-y-2">
                {features.filter(f => 
                  ['컴플라이언스 시스템', '시장 보호 시스템', '리뷰 관리 및 분석'].includes(f.title)
                ).map((feature, idx) => (
                  <div key={idx} className="text-sm text-gray-300 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                    {feature.title}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                전략 및 최적화
              </h3>
              <div className="space-y-2">
                {features.filter(f => 
                  ['ICE Score 우선순위', '리포트 생성 및 관리', '성과 시뮬레이션', '진단 히스토리 비교', '종합 의견 및 전략'].includes(f.title)
                ).map((feature, idx) => (
                  <div key={idx} className="text-sm text-gray-300 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    {feature.title}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative border-t border-white/10 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400 text-sm">
            <p>© 2024 Marketing OS. All rights reserved.</p>
            <p className="mt-2">Powered by AI-driven insights and data analytics</p>
          </div>
        </div>
      </div>

      {/* MIF Copilot - 홈 대시보드에서도 사용 가능 (클라이언트 전용) */}
      {typeof window !== 'undefined' && (
        <MIFCopilot
          companyName={brandName || undefined}
          contextOptions={{
            channels: ['naver', 'ga4'],
            include: ['company_profile', 'kpi_summary', 'issues']
          }}
        />
      )}
    </div>
  )
}
