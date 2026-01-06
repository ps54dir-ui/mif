'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { deleteAccount } from '@/lib/api/userDataApi'

export default function ChangePasswordPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)

  const validatePassword = (password: string) => {
    const strength = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }
    setPasswordStrength(strength)
    return Object.values(strength).filter(Boolean).length >= 3
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
    
    if (field === 'new_password') {
      validatePassword(value)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    // 유효성 검증
    if (!formData.current_password) {
      setError('현재 비밀번호를 입력해주세요.')
      return
    }

    if (!formData.new_password) {
      setError('새 비밀번호를 입력해주세요.')
      return
    }

    if (formData.new_password.length < 8) {
      setError('새 비밀번호는 최소 8자 이상이어야 합니다.')
      return
    }

    const validCount = Object.values(passwordStrength).filter(Boolean).length
    if (validCount < 3) {
      setError('새 비밀번호는 대문자, 소문자, 숫자, 특수문자 중 3가지 이상을 포함해야 합니다.')
      return
    }

    if (formData.new_password !== formData.confirm_password) {
      setError('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.')
      return
    }

    if (formData.current_password === formData.new_password) {
      setError('새 비밀번호는 현재 비밀번호와 다르게 설정해야 합니다.')
      return
    }

    setLoading(true)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const token = typeof window !== 'undefined' 
        ? localStorage.getItem('access_token') 
        : null

      if (!token) {
        throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.')
      }

      const response = await fetch(`${apiUrl}/api/user-data/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          current_password: formData.current_password,
          new_password: formData.new_password
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || '비밀번호 변경에 실패했습니다.')
      }

      setSuccess(true)
      setFormData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      })
      setPasswordStrength({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
      })

      // 3초 후 메인 페이지로 이동
      setTimeout(() => {
        router.push('/')
      }, 3000)
    } catch (err) {
      console.error('비밀번호 변경 오류:', err)
      setError(err instanceof Error ? err.message : '비밀번호 변경 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== '탈퇴') {
      setError('정확히 "탈퇴"라고 입력해주세요.')
      return
    }

    if (!confirm('정말로 회원탈퇴를 하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return
    }

    setDeleting(true)
    setError('')

    try {
      await deleteAccount()
      
      // 로컬 스토리지 정리
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
      }

      alert('회원탈퇴가 완료되었습니다.')
      router.push('/login')
    } catch (err) {
      console.error('회원탈퇴 오류:', err)
      setError(err instanceof Error ? err.message : '회원탈퇴 중 오류가 발생했습니다.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              비밀번호 변경
            </span>
          </h1>
          <p className="text-gray-300">
            보안을 위해 정기적으로 비밀번호를 변경해주세요
          </p>
        </div>

        {/* 비밀번호 변경 폼 */}
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

          {success && (
            <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-start gap-3 mb-6">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold text-green-400">성공</div>
                <div className="text-sm text-green-300 mt-1">
                  비밀번호가 성공적으로 변경되었습니다. 3초 후 메인 페이지로 이동합니다.
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 현재 비밀번호 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                현재 비밀번호 <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={formData.current_password}
                  onChange={(e) => handleChange('current_password', e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  placeholder="현재 비밀번호를 입력하세요"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* 새 비밀번호 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                새 비밀번호 <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={formData.new_password}
                  onChange={(e) => handleChange('new_password', e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  placeholder="새 비밀번호를 입력하세요"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.new_password && (
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
                </div>
              )}
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                새 비밀번호 확인 <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirm_password}
                  onChange={(e) => handleChange('confirm_password', e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  placeholder="새 비밀번호를 다시 입력하세요"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.confirm_password && formData.new_password !== formData.confirm_password && (
                <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  비밀번호가 일치하지 않습니다.
                </p>
              )}
            </div>

            {/* 버튼 */}
            <div className="flex gap-4 pt-4">
              <Link
                href="/"
                className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all duration-300 text-center"
              >
                취소
              </Link>
              <button
                type="submit"
                disabled={loading || success}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>변경 중...</span>
                  </>
                ) : (
                  <>
                    <span>비밀번호 변경</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* 회원탈퇴 섹션 */}
          <div className="mt-8 pt-8 border-t border-white/20">
            <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              회원탈퇴
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              회원탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
            </p>
            
            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold rounded-lg transition-all duration-300 border border-red-500/50"
              >
                회원탈퇴하기
              </button>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    확인을 위해 <span className="text-red-400 font-bold">&quot;탈퇴&quot;</span>라고 입력하세요
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => {
                      setDeleteConfirmText(e.target.value)
                      setError('')
                    }}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="탈퇴"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeleteConfirm(false)
                      setDeleteConfirmText('')
                      setError('')
                    }}
                    className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all duration-300"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={deleting || deleteConfirmText !== '탈퇴'}
                    className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>탈퇴 중...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        <span>회원탈퇴 확인</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 안내 */}
        <div className="mt-6 text-center text-sm text-gray-400">
          <p>비밀번호는 정기적으로 변경하여 보안을 강화하세요.</p>
        </div>
      </div>
    </div>
  )
}
