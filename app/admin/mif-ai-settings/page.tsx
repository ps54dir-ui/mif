'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Trash2, Eye, EyeOff, Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { getAPIKeyStatus, saveAPIKey, deleteAPIKey, type APIKeyStatus } from '@/lib/api/mifAISettings'

export default function MIFAISettingsPage() {
  const router = useRouter()
  const [apiKeyStatus, setAPIKeyStatus] = useState<APIKeyStatus | null>(null)
  const [apiKeyInput, setAPIKeyInput] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // API Key 상태 조회
  useEffect(() => {
    loadAPIKeyStatus()
  }, [])

  const loadAPIKeyStatus = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const status = await getAPIKeyStatus()
      setAPIKeyStatus(status)
    } catch (err: any) {
      setError(err.message || 'API Key 상태 조회 실패')
      // 403 에러 시 관리자 권한 없음
      if (err.message?.includes('403') || err.message?.includes('관리자')) {
        router.push('/')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!apiKeyInput.trim()) {
      setError('API Key를 입력해주세요')
      return
    }

    if (!apiKeyInput.trim().startsWith('sk-')) {
      setError('유효하지 않은 OpenAI API Key 형식입니다 (sk-로 시작해야 합니다)')
      return
    }

    setIsSaving(true)
    setError(null)
    setSuccess(null)

    try {
      await saveAPIKey(apiKeyInput.trim())
      setSuccess('API Key가 저장되었습니다')
      setAPIKeyInput('')
      await loadAPIKeyStatus()
    } catch (err: any) {
      setError(err.message || 'API Key 저장 실패')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('정말 API Key를 삭제하시겠습니까?')) {
      return
    }

    setIsDeleting(true)
    setError(null)
    setSuccess(null)

    try {
      await deleteAPIKey()
      setSuccess('API Key가 삭제되었습니다')
      await loadAPIKeyStatus()
    } catch (err: any) {
      setError(err.message || 'API Key 삭제 실패')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-purple-900 to-blue-800 p-8">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            MIF AI 설정
          </h1>
          <p className="text-gray-300">
            OpenAI API Key를 관리합니다. API Key는 암호화되어 안전하게 저장됩니다.
          </p>
        </div>

        {/* 현재 상태 */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5" />
              현재 API Key 상태
            </h2>
            {isLoading && <Loader2 className="w-5 h-5 animate-spin text-gray-400" />}
          </div>

          {isLoading ? (
            <div className="text-gray-300">로딩 중...</div>
          ) : apiKeyStatus?.has_key ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">API Key가 설정되어 있습니다</span>
              </div>
              <div className="bg-black/20 rounded-lg p-4 font-mono text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">
                    {showApiKey ? apiKeyStatus.key_preview : apiKeyStatus.key_preview?.replace(/./g, '•')}
                  </span>
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>삭제 중...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>API Key 삭제</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-yellow-400">
              <AlertCircle className="w-5 h-5" />
              <span>API Key가 설정되지 않았습니다</span>
            </div>
          )}
        </div>

        {/* API Key 입력 */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            API Key 입력
          </h2>

          {/* 에러/성공 메시지 */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-300 font-medium">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-green-300 font-medium">{success}</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="api-key" className="block text-sm font-medium text-gray-300 mb-2">
                OpenAI API Key
              </label>
              <input
                id="api-key"
                type={showApiKey ? "text" : "password"}
                value={apiKeyInput}
                onChange={(e) => setAPIKeyInput(e.target.value)}
                placeholder="sk-..."
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              />
              <p className="mt-2 text-sm text-gray-400">
                OpenAI API Key는 <code className="bg-black/20 px-1 rounded">sk-</code>로 시작해야 합니다.
                <br />
                API Key는 암호화되어 저장되며, 프론트엔드에 노출되지 않습니다.
              </p>
            </div>

            <button
              onClick={handleSave}
              disabled={isSaving || !apiKeyInput.trim()}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>저장 중...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>API Key 저장</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 보안 안내 */}
        <div className="mt-6 bg-blue-500/20 border border-blue-500/50 rounded-xl p-4">
          <h3 className="text-sm font-bold text-blue-300 mb-2">보안 안내</h3>
          <ul className="text-sm text-blue-200 space-y-1 list-disc list-inside">
            <li>API Key는 암호화되어 데이터베이스에 저장됩니다</li>
            <li>API Key는 백엔드에서만 사용되며, 프론트엔드에 노출되지 않습니다</li>
            <li>관리자 권한이 있는 사용자만 이 페이지에 접근할 수 있습니다</li>
            <li>API Key는 OpenAI에서 발급받을 수 있습니다: <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">platform.openai.com/api-keys</a></li>
          </ul>
        </div>
      </div>
    </div>
  )
}
