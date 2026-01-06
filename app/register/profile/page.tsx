'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, Phone, Mail, ArrowRight, AlertCircle } from 'lucide-react'

interface ProfileData {
  username: string
  phone: string
  email: string
}

export default function ProfileSetupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [profileData, setProfileData] = useState<ProfileData>({
    username: '',
    phone: '',
    email: ''
  })
  const [validationErrors, setValidationErrors] = useState<Partial<ProfileData>>({})

  // 로그인 상태 확인
  useEffect(() => {
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('access_token') 
      : null
    
    if (!token) {
      // 토큰이 없으면 로그인 페이지로 리다이렉트
      router.push('/login?mode=register')
    }
  }, [router])

  const validateField = (field: keyof ProfileData, value: string) => {
    const errors = { ...validationErrors }
    
    switch (field) {
      case 'username':
        if (!value.trim()) {
          errors.username = '사용자명을 입력해주세요.'
        } else if (value.length < 2) {
          errors.username = '사용자명은 최소 2자 이상이어야 합니다.'
        } else {
          delete errors.username
        }
        break
      case 'phone':
        if (!value.trim()) {
          errors.phone = '핸드폰번호를 입력해주세요.'
        } else if (!/^[0-9-]+$/.test(value)) {
          errors.phone = '올바른 핸드폰번호 형식이 아닙니다.'
        } else {
          delete errors.phone
        }
        break
      case 'email':
        if (!value.trim()) {
          errors.email = '이메일 주소를 입력해주세요.'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = '올바른 이메일 주소 형식이 아닙니다.'
        } else {
          delete errors.email
        }
        break
      default:
        delete errors[field]
    }
    
    setValidationErrors(errors)
  }

  const handleChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
    validateField(field, value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // 필수 필드 검증
    if (!profileData.username.trim()) {
      setError('사용자명은 필수 입력 항목입니다.')
      setLoading(false)
      return
    }
    
    if (!profileData.phone.trim()) {
      setError('핸드폰번호는 필수 입력 항목입니다.')
      setLoading(false)
      return
    }
    
    if (!profileData.email.trim()) {
      setError('이메일 주소는 필수 입력 항목입니다.')
      setLoading(false)
      return
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const token = typeof window !== 'undefined' 
        ? localStorage.getItem('access_token') 
        : null

      if (!token) {
        throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.')
      }

      // 사용자 프로필 정보 저장
      const response = await fetch(`${apiUrl}/api/user-data/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      })

      if (!response.ok) {
        let errorData
        try {
          errorData = await response.json()
        } catch {
          errorData = { detail: `HTTP ${response.status}: ${response.statusText}` }
        }
        console.error('프로필 저장 API 오류:', response.status, errorData)
        throw new Error(errorData.detail || errorData.message || '프로필 저장에 실패했습니다.')
      }

      // 메인 페이지로 이동
      router.push('/')
    } catch (err) {
      console.error('프로필 저장 오류:', err)
      setError(err instanceof Error ? err.message : '프로필 저장 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              프로필 정보 입력
            </span>
          </h1>
          <p className="text-gray-300">
            서비스를 더 효과적으로 이용하기 위한 정보를 입력해주세요
          </p>
        </div>

        {/* 프로필 입력 폼 */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-3 mb-6">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold text-red-400">오류</div>
                <div className="text-sm text-red-300 mt-1">{error}</div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 사용자명 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                사용자명 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={profileData.username}
                onChange={(e) => handleChange('username', e.target.value)}
                onBlur={() => validateField('username', profileData.username)}
                required
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
                  validationErrors.username
                    ? 'border-red-500/50 focus:ring-red-500'
                    : 'border-white/20 focus:ring-blue-500'
                }`}
                placeholder="사용자명을 입력하세요"
              />
              {validationErrors.username && (
                <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.username}
                </p>
              )}
            </div>

            {/* 핸드폰번호 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                핸드폰번호 <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                onBlur={() => validateField('phone', profileData.phone)}
                required
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
                  validationErrors.phone
                    ? 'border-red-500/50 focus:ring-red-500'
                    : 'border-white/20 focus:ring-blue-500'
                }`}
                placeholder="010-1234-5678"
              />
              {validationErrors.phone && (
                <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.phone}
                </p>
              )}
            </div>

            {/* 이메일 주소 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                이메일 주소 <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => validateField('email', profileData.email)}
                required
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
                  validationErrors.email
                    ? 'border-red-500/50 focus:ring-red-500'
                    : 'border-white/20 focus:ring-blue-500'
                }`}
                placeholder="example@email.com"
              />
              {validationErrors.email && (
                <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* 버튼 */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading || !!validationErrors.username || !!validationErrors.phone || !!validationErrors.email}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>저장 중...</span>
                  </>
                ) : (
                  <>
                    <span>완료</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* 안내 */}
        <div className="mt-6 text-center text-sm text-gray-400">
          <p>프로필 정보는 나중에 설정에서 수정할 수 있습니다.</p>
        </div>
      </div>
    </div>
  )
}
