'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { LogIn, UserPlus, AlertCircle } from 'lucide-react'
import Link from 'next/link'

// 소셜 로그인 아이콘 컴포넌트
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

const KakaoIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#3C1E1E">
    <path d="M12 3C6.48 3 2 6.48 2 11c0 2.84 1.8 5.36 4.5 6.8L6 21l3.5-1.5c.96.24 1.96.36 2.96.36h.08c5.52 0 10-3.48 10-8s-4.48-8-10-8z"/>
  </svg>
)

const NaverIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#03C75A">
    <path d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z"/>
  </svg>
)

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [usernameError, setUsernameError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [passwordStrength, setPasswordStrength] = useState<{
    length: boolean
    uppercase: boolean
    lowercase: boolean
    number: boolean
    special: boolean
  }>({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  })

  // 사용자명 중복 체크
  const checkUsernameAvailability = async (value: string) => {
    if (!value || value.length < 3) {
      setUsernameAvailable(null)
      setUsernameError('')
      return
    }

    setIsCheckingUsername(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/api/auth/check-username?username=${encodeURIComponent(value)}`, {
        signal: AbortSignal.timeout(5000) // 5초 타임아웃
      })
      
      if (response.ok) {
        const data = await response.json()
        setUsernameAvailable(data.available)
        // usernameAvailable 상태로만 표시하므로 usernameError는 설정하지 않음
        setUsernameError('')
      } else {
        // 서버 오류 시에도 에러 메시지는 설정하지 않음 (중복 체크 실패만 표시)
        setUsernameAvailable(null)
        setUsernameError('')
      }
    } catch (err) {
      console.error('사용자명 중복 체크 실패:', err)
      // 네트워크 오류는 무시 (중복 체크만 실패한 것으로 처리)
      setUsernameAvailable(null)
      setUsernameError('')
    } finally {
      setIsCheckingUsername(false)
    }
  }

  // 사용자명 유효성 검증
  const validateUsername = (value: string) => {
    if (!value) {
      setUsernameError('')
      setUsernameAvailable(null)
      return true
    }
    
    if (value.length < 3) {
      setUsernameError('사용자명은 최소 3자 이상이어야 합니다.')
      setUsernameAvailable(null)
      return false
    }
    
    if (value.length > 20) {
      setUsernameError('사용자명은 최대 20자까지 가능합니다.')
      setUsernameAvailable(null)
      return false
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      setUsernameError('사용자명은 영문, 숫자, 언더스코어(_)만 사용할 수 있습니다.')
      setUsernameAvailable(null)
      return false
    }
    
    // 모든 유효성 검증 통과 시 에러 메시지 초기화
    setUsernameError('')
    
    // 회원가입 모드일 때만 중복 체크
    if (!isLogin) {
      checkUsernameAvailability(value)
    }
    
    return true
  }

  // 비밀번호 유효성 검증
  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError('')
      setPasswordStrength({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
      })
      return true
    }
    
    const strength = {
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /[0-9]/.test(value),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(value)
    }
    
    setPasswordStrength(strength)
    
    if (!isLogin) {
      // 회원가입 시에만 엄격한 검증
      const validCount = Object.values(strength).filter(Boolean).length
      
      if (value.length < 8) {
        setPasswordError('비밀번호는 최소 8자 이상이어야 합니다.')
        return false
      }
      
      if (validCount < 3) {
        setPasswordError('비밀번호는 대문자, 소문자, 숫자, 특수문자 중 3가지 이상을 포함해야 합니다.')
        return false
      }
    }
    
    setPasswordError('')
    return true
  }

  // URL 파라미터에서 mode 확인
  useEffect(() => {
    const mode = searchParams.get('mode')
    if (mode === 'register') {
      setIsLogin(false)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // 회원가입 시 유효성 검증
    if (!isLogin) {
      const isUsernameValid = validateUsername(username)
      const isPasswordValid = validatePassword(password)
      
      if (!isUsernameValid || !isPasswordValid) {
        setLoading(false)
        return
      }
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const fullUrl = `${apiUrl}${endpoint}`
      
      console.log('🔵 API 호출 시작:', {
        url: fullUrl,
        method: 'POST',
        username,
        apiUrl,
        endpoint,
        env: process.env.NEXT_PUBLIC_API_URL
      })
      
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password
        }),
        signal: AbortSignal.timeout(10000) // 10초 타임아웃
      })
      
      console.log('🟢 API 응답 받음:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      })

      if (!response.ok) {
        // 응답 본문을 먼저 읽기
        let errorData
        try {
          errorData = await response.json()
        } catch {
          errorData = { detail: `HTTP ${response.status}: ${response.statusText}` }
        }
        console.error('API 오류 응답:', response.status, errorData)
        
        // 에러 메시지 한글화
        let errorMessage = errorData.detail || errorData.message || `서버 오류 (${response.status})`
        if (errorMessage.includes('Invalid username or password')) {
          errorMessage = '사용자명 또는 비밀번호가 올바르지 않습니다.'
        } else if (errorMessage.includes('Username already exists')) {
          errorMessage = '이미 사용 중인 사용자명입니다.'
        } else if (errorMessage.includes('User not found')) {
          errorMessage = '사용자를 찾을 수 없습니다. 회원가입이 필요합니다.'
        }
        
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log('API 응답:', response.status, data)


      // 토큰 저장
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('user', JSON.stringify(data.user))
      }

      // 회원가입인 경우 프로필 입력 페이지로 이동
      if (!isLogin) {
        console.log('회원가입 성공, 프로필 입력 페이지로 이동')
        router.push('/register/profile')
      } else {
        // 로그인인 경우 리다이렉트 URL 확인 또는 홈으로 이동
        const redirectUrl = searchParams.get('redirect') || '/'
        console.log('로그인 성공, 리다이렉트:', redirectUrl)
        router.push(redirectUrl)
      }
    } catch (err) {
      console.error('회원가입/로그인 오류:', err)
      console.error('오류 상세:', {
        name: err instanceof Error ? err.name : 'Unknown',
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined
      })
      
      let errorMessage = '오류가 발생했습니다.'
      
      if (err instanceof Error) {
        errorMessage = err.message
        
        // 네트워크 오류 체크
        if (err.message.includes('Failed to fetch') || 
            err.message.includes('NetworkError') ||
            err.message.includes('Network request failed') ||
            err.name === 'TypeError' && err.message.includes('fetch')) {
          errorMessage = '서버에 연결할 수 없습니다. 백엔드 서버(http://localhost:8000)가 실행 중인지 확인해주세요.'
        }
      } else if (typeof err === 'string') {
        errorMessage = err
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Marketing Intelligence Framework</span>
          </h1>
          <p className="text-gray-300">
            {isLogin ? '로그인하여 계속하기' : '새 계정 만들기'}
          </p>
        </div>

        {/* 로그인/회원가입 폼 */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-semibold text-red-400">오류</div>
                  <div className="text-sm text-red-300 mt-1">{error}</div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                사용자명
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                  if (!isLogin) validateUsername(e.target.value)
                }}
                onBlur={() => !isLogin && validateUsername(username)}
                required
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
                  usernameError 
                    ? 'border-red-500/50 focus:ring-red-500' 
                    : 'border-white/20 focus:ring-blue-500'
                }`}
                placeholder={isLogin ? "사용자명을 입력하세요" : "3-20자, 영문/숫자/_만 가능"}
                minLength={3}
                maxLength={20}
                pattern="^[a-zA-Z0-9_]+$"
              />
              {usernameError && (
                <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {usernameError}
                </p>
              )}
              {!isLogin && isCheckingUsername && username.length >= 3 && (
                <p className="mt-1 text-xs text-gray-400 flex items-center gap-1">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-400"></div>
                  사용자명 확인 중...
                </p>
              )}
              {!isLogin && !isCheckingUsername && !usernameError && usernameAvailable === true && username.length >= 3 && (
                <p className="mt-1 text-xs text-green-400 flex items-center gap-1">
                  <span>✓</span>
                  사용 가능한 사용자명입니다
                </p>
              )}
              {!isLogin && !isCheckingUsername && usernameAvailable === false && !usernameError && (
                <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  이미 사용 중인 사용자명입니다.
                </p>
              )}
              {!isLogin && (
                <p className="mt-1 text-xs text-gray-400">
                  • 3-20자 • 영문, 숫자, 언더스코어(_)만 사용 가능
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (!isLogin) validatePassword(e.target.value)
                }}
                onBlur={() => !isLogin && validatePassword(password)}
                required
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
                  passwordError 
                    ? 'border-red-500/50 focus:ring-red-500' 
                    : 'border-white/20 focus:ring-blue-500'
                }`}
                placeholder={isLogin ? "비밀번호를 입력하세요" : "최소 8자, 3가지 이상 조합"}
                minLength={isLogin ? 6 : 8}
              />
              {passwordError && (
                <p className="mt-1 text-xs text-red-400">{passwordError}</p>
              )}
              {!isLogin && password && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className={passwordStrength.length ? 'text-green-400' : 'text-gray-400'}>
                      {passwordStrength.length ? '✓' : '○'} 최소 8자
                    </span>
                    <span className={passwordStrength.uppercase ? 'text-green-400' : 'text-gray-400'}>
                      {passwordStrength.uppercase ? '✓' : '○'} 대문자
                    </span>
                    <span className={passwordStrength.lowercase ? 'text-green-400' : 'text-gray-400'}>
                      {passwordStrength.lowercase ? '✓' : '○'} 소문자
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={passwordStrength.number ? 'text-green-400' : 'text-gray-400'}>
                      {passwordStrength.number ? '✓' : '○'} 숫자
                    </span>
                    <span className={passwordStrength.special ? 'text-green-400' : 'text-gray-400'}>
                      {passwordStrength.special ? '✓' : '○'} 특수문자
                    </span>
                  </div>
                  {Object.values(passwordStrength).filter(Boolean).length >= 3 && !passwordError && (
                    <p className="mt-1 text-xs text-green-400">✓ 안전한 비밀번호입니다</p>
                  )}
                </div>
              )}
              {!isLogin && (
                <p className="mt-1 text-xs text-gray-400">
                  • 최소 8자 • 대문자, 소문자, 숫자, 특수문자 중 3가지 이상 조합
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>처리 중...</span>
                </>
              ) : (
                <>
                  {isLogin ? (
                    <>
                      <LogIn className="w-5 h-5" />
                      <span>로그인</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      <span>회원가입</span>
                    </>
                  )}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
                setUsername('')
                setPassword('')
              }}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium"
            >
              {isLogin ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
            </button>
          </div>

          {/* 소셜 로그인 구분선 */}
          <div className="mt-6 mb-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/10 text-gray-300">또는</span>
              </div>
            </div>
          </div>

          {/* 소셜 로그인 버튼 */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => {
                // 구글 로그인 처리 (실제로는 OAuth 인증 플로우)
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
                window.location.href = `${apiUrl}/api/auth/google`
              }}
              className="w-full px-4 py-3 bg-white hover:bg-gray-50 text-gray-900 font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-md hover:shadow-lg"
            >
              <GoogleIcon />
              <span>구글로 로그인</span>
            </button>

            <button
              type="button"
              onClick={() => {
                // 카카오톡 로그인 처리
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
                window.location.href = `${apiUrl}/api/auth/kakao`
              }}
              className="w-full px-4 py-3 bg-[#FEE500] hover:bg-[#FDD835] text-[#3C1E1E] font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-md hover:shadow-lg"
            >
              <KakaoIcon />
              <span>카카오톡으로 로그인</span>
            </button>

            <button
              type="button"
              onClick={() => {
                // 네이버 로그인 처리
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
                window.location.href = `${apiUrl}/api/auth/naver`
              }}
              className="w-full px-4 py-3 bg-[#03C75A] hover:bg-[#02B350] text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-md hover:shadow-lg"
            >
              <NaverIcon />
              <span>네이버로 로그인</span>
            </button>
          </div>
        </div>

        {/* 데모 계정 안내 */}
        <div className="mt-6 text-center text-sm text-gray-400">
          <p>데모 계정으로 체험해보세요</p>
          <p className="mt-1 text-xs">관리자: admin / admin123</p>
        </div>
      </div>
    </div>
  )
}
