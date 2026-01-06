'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Send, RefreshCw, FileText, X, MessageSquare, CheckCircle, XCircle } from 'lucide-react'

interface MIFEvolution {
  proposed_rule?: string | null
  rationale?: string | null
  requires_approval?: boolean
  approved?: boolean
  rejected?: boolean
  rule_id?: string | null
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  citations?: Array<{
    source: string
    source_id?: string
    date_range?: string
    note?: string
    sample_size?: number
  }>
  action_plan?: string[]
  needs_more_data?: string[]
  mif_evolution?: MIFEvolution
  confidence?: number
  used_context_summary?: {
    sources?: number
    records?: number
    context_size?: number
    confidence?: number
    channels?: string[]
  }
  created_at?: string
}

interface ContextChip {
  label: string
  value: string
}

interface MIFCopilotProps {
  companyId?: string
  companyName?: string
  contextOptions?: {
    dateRange?: { from: string; to: string }
    channels?: string[]
    include?: string[]
  }
}

export default function MIFCopilot({
  companyId,
  companyName,
  contextOptions
}: MIFCopilotProps) {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [threadId, setThreadId] = useState<string | null>(null)
  const [contextChips, setContextChips] = useState<ContextChip[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 클라이언트 전용 렌더링을 위한 마운트 체크
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (companyId || companyName) {
      // 컨텍스트 칩 업데이트
      const chips: ContextChip[] = []
      if (companyName) {
        chips.push({ label: '회사', value: companyName })
      }
      if (contextOptions?.dateRange) {
        chips.push({
          label: '기간',
          value: `${contextOptions.dateRange.from} ~ ${contextOptions.dateRange.to}`
        })
      }
      if (contextOptions?.channels && contextOptions.channels.length > 0) {
        chips.push({
          label: '채널',
          value: contextOptions.channels.join(', ')
        })
      }
      setContextChips(chips)
    }
  }, [companyId, companyName, contextOptions])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      created_at: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      // 로그인하지 않아도 사용 가능 (토큰이 없어도 됨)
      const token = localStorage.getItem('access_token')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

      // thread_id가 없으면 먼저 스레드 생성 (정석 방법)
      let currentThreadId = threadId
      if (!currentThreadId) {
        console.log('[MIFCopilot] 스레드 생성 시작')
        try {
          const createHeaders: Record<string, string> = {
            'Content-Type': 'application/json'
          }
          if (token) {
            createHeaders['Authorization'] = `Bearer ${token}`
          }

          const createResponse = await fetch(`${apiUrl}/api/copilot/thread/create`, {
            method: 'POST',
            headers: createHeaders,
            body: JSON.stringify({
              company_id: companyId,
              company_name: companyName,
              title: input.slice(0, 50) || 'New chat'
            })
          })

          if (createResponse.ok) {
            const createData = await createResponse.json()
            currentThreadId = createData.thread_id
            setThreadId(currentThreadId)
            console.log('[MIFCopilot] 스레드 생성 성공:', currentThreadId)
          } else {
            // 스레드 생성 실패 (익명 사용자일 수 있음) - 서버에서 자동 생성하도록 진행
            console.warn('[MIFCopilot] 스레드 생성 실패, 서버에서 자동 생성 시도')
          }
        } catch (error) {
          // 스레드 생성 오류 - 서버에서 자동 생성하도록 진행
          console.warn('[MIFCopilot] 스레드 생성 오류:', error)
        }
      }

      console.log('[MIFCopilot] API 호출 시작:', {
        apiUrl: `${apiUrl}/api/copilot/chat`,
        companyId,
        companyName,
        threadId: currentThreadId,
        hasToken: !!token,
        anonymous: !token
      })

      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }
      // 토큰이 있으면 포함 (선택적)
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      // 타임아웃 설정 (30초)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30초 타임아웃
      
      let response: Response | null = null
      try {
        response = await fetch(`${apiUrl}/api/copilot/chat`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            company_id: companyId,
            company_name: companyName,
            thread_id: currentThreadId,
            user_message: userMessage.content,
            context_options: contextOptions
          }),
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
      } catch (fetchError) {
        clearTimeout(timeoutId)
        
        // AbortError는 타임아웃
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          throw new Error('요청 시간이 초과되었습니다. 서버 응답이 너무 오래 걸립니다. 다시 시도해주세요.')
        }
        
        // 다른 오류는 그대로 전달
        throw fetchError
      }

      if (!response) {
        throw new Error('응답을 받을 수 없습니다.')
      }

      console.log('[MIFCopilot] API 응답 상태:', response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = `HTTP ${response.status}`
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.detail || errorData.message || errorMessage
        } catch {
          errorMessage = errorText || errorMessage
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log('[MIFCopilot] API 응답 데이터:', data)

      // mif_evolution 추출 (vnext_data에서)
      const mifEvolution = data.used_context_summary?.vnext_data?.mif_evolution || 
                          data.vnext_data?.mif_evolution || 
                          null

      const assistantMessage: Message = {
        id: data.thread_id + '-' + Date.now(),
        role: 'assistant',
        content: data.assistant_message,
        citations: data.citations || [],
        action_plan: data.action_plan || [],
        needs_more_data: data.needs_more_data || [],
        mif_evolution: mifEvolution || undefined,
        confidence: data.confidence || data.used_context_summary?.confidence,
        used_context_summary: data.used_context_summary,
        created_at: new Date().toISOString()
      }

      setMessages(prev => [...prev, assistantMessage])
      setThreadId(data.thread_id)
    } catch (error) {
      console.error('[MIFCopilot] Copilot 채팅 실패:', error)
      console.error('[MIFCopilot] 오류 상세:', {
        error,
        errorType: error instanceof Error ? error.constructor.name : typeof error,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined
      })
      let errorContent = '죄송합니다. 응답을 생성하는 중 오류가 발생했습니다. 다시 시도해주세요.'
      let shouldRedirect = false
      
      // 오류 메시지 처리 (401은 익명 사용자 허용이므로 리다이렉트하지 않음)
      if (error instanceof Error) {
        if (error.message.includes('table') || error.message.includes('테이블')) {
          errorContent = '데이터베이스 설정이 필요합니다. 관리자에게 문의해주세요.'
        } else {
          errorContent = `오류: ${error.message}`
        }
      }
      
      const errorMessage: Message = {
        id: 'error-' + Date.now(),
        role: 'assistant',
        content: errorContent,
        created_at: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleRefreshContext = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

      const response = await fetch(`${apiUrl}/api/copilot/context/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({
          company_id: companyId,
          company_name: companyName,
          context_options: contextOptions
        })
      })

      if (response.ok) {
        const data = await response.json()
        alert(`컨텍스트가 갱신되었습니다.\n소스: ${data.context_summary.sources}개, 레코드: ${data.context_summary.records}개`)
      } else {
        throw new Error(`HTTP ${response.status}`)
      }
    } catch (error) {
      console.error('컨텍스트 갱신 실패:', error)
      alert('컨텍스트 갱신에 실패했습니다.')
    }
  }

  const handleSummarize = async () => {
    if (!threadId) {
      alert('대화가 없습니다.')
      return
    }

    try {
      const token = localStorage.getItem('access_token')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

      const response = await fetch(`${apiUrl}/api/copilot/thread/${threadId}/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        }
      })

      if (response.ok) {
        const data = await response.json()
        const summaryMessage: Message = {
          id: 'summary-' + Date.now(),
          role: 'assistant',
          content: `📋 대화 요약\n\n${data.summary}\n\n주요 포인트:\n${data.key_points.map((p: string) => `• ${p}`).join('\n')}`,
          created_at: new Date().toISOString()
        }
        setMessages(prev => [...prev, summaryMessage])
      } else {
        throw new Error(`HTTP ${response.status}`)
      }
    } catch (error) {
      console.error('대화 요약 실패:', error)
      alert('대화 요약에 실패했습니다.')
    }
  }

  // 서버 사이드 렌더링 방지 (Hydration 오류 해결)
  if (!isMounted) {
    return null
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all"
        aria-label="Copilot 열기"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          <h3 className="font-semibold">MIF Copilot</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="hover:bg-blue-700 rounded p-1"
          aria-label="닫기"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Context Chips */}
      {contextChips.length > 0 && (
        <div className="p-3 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-wrap gap-2">
            {contextChips.map((chip, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {chip.label}: {chip.value}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>안녕하세요! MIF Copilot입니다.</p>
            <p className="text-sm mt-1">질문을 입력해주세요.</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>

              {/* Citations */}
              {message.citations && message.citations.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-300">
                  <p className="text-xs font-semibold mb-1">근거:</p>
                  {message.citations.map((citation, idx) => (
                    <p key={idx} className="text-xs">
                      • {citation.source}
                      {citation.date_range && ` (${citation.date_range})`}
                    </p>
                  ))}
                </div>
              )}

              {/* Action Plan */}
              {message.action_plan && message.action_plan.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-300">
                  <p className="text-xs font-semibold mb-1">액션플랜:</p>
                  <ul className="text-xs list-disc list-inside">
                    {message.action_plan.map((action, idx) => (
                      <li key={idx}>{action}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Needs More Data */}
              {message.needs_more_data && message.needs_more_data.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-300">
                  <p className="text-xs font-semibold mb-1">추가 데이터 필요:</p>
                  <ul className="text-xs list-disc list-inside">
                    {message.needs_more_data.map((need, idx) => (
                      <li key={idx}>{need}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 신뢰도 표시 */}
              {message.confidence !== undefined && message.confidence !== null && (
                <div className="mt-2 pt-2 border-t border-gray-300">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold">신뢰도:</span>
                    <span className={message.confidence < 0.7 ? 'text-orange-600' : 'text-green-600'}>
                      {message.confidence >= 1 ? `${message.confidence.toFixed(1)}/5.0` : `${(message.confidence * 100).toFixed(0)}%`}
                    </span>
                    {message.confidence < 0.7 && (
                      <span className="text-orange-600 text-xs">(낮음 - 추가 데이터 필요)</span>
                    )}
                  </div>
                </div>
              )}

              {/* 컨텍스트 요약 표시 */}
              {message.used_context_summary && (
                <div className="mt-2 pt-2 border-t border-gray-300">
                  <p className="text-xs font-semibold mb-1">사용된 데이터:</p>
                  <div className="text-xs text-gray-600 space-y-0.5">
                    {message.used_context_summary.sources !== undefined && (
                      <div>• 데이터 소스: {message.used_context_summary.sources}개</div>
                    )}
                    {message.used_context_summary.records !== undefined && (
                      <div>• 분석 레코드: {message.used_context_summary.records}개</div>
                    )}
                    {message.used_context_summary.channels && message.used_context_summary.channels.length > 0 && (
                      <div>• 분석 채널: {message.used_context_summary.channels.join(', ')}</div>
                    )}
                  </div>
                </div>
              )}

              {/* MIF Evolution Proposal */}
              {message.mif_evolution && message.mif_evolution.proposed_rule && (
                <EvolutionApprovalUI
                  evolution={message.mif_evolution}
                  messageId={message.id}
                  threadId={threadId || ''}
                  companyId={companyId}
                  onApproved={() => {
                    // 승인 후 메시지 업데이트
                    setMessages(prev => prev.map(msg => 
                      msg.id === message.id && msg.mif_evolution
                        ? { ...msg, mif_evolution: { ...msg.mif_evolution, approved: true } }
                        : msg
                    ))
                  }}
                  onRejected={() => {
                    // 거부 후 메시지 업데이트
                    setMessages(prev => prev.map(msg => 
                      msg.id === message.id && msg.mif_evolution
                        ? { ...msg, mif_evolution: { ...msg.mif_evolution, rejected: true } }
                        : msg
                    ))
                  }}
                />
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-3">
        <div className="flex gap-2 mb-2">
          <button
            onClick={handleRefreshContext}
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded flex items-center gap-1"
            title="컨텍스트 갱신"
          >
            <RefreshCw className="w-3 h-3" />
            갱신
          </button>
          <button
            onClick={handleSummarize}
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded flex items-center gap-1"
            title="대화 요약"
          >
            <FileText className="w-3 h-3" />
            요약
          </button>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="질문을 입력하세요..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg px-4 py-2 flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// MIF Evolution 승인 UI 컴포넌트
interface EvolutionApprovalUIProps {
  evolution: MIFEvolution
  messageId: string
  threadId: string
  companyId?: string
  onApproved: () => void
  onRejected: () => void
}

function EvolutionApprovalUI({
  evolution,
  messageId,
  threadId,
  companyId,
  onApproved,
  onRejected
}: EvolutionApprovalUIProps) {
  const [processing, setProcessing] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  const handleApprove = async () => {
    if (processing) return
    
    try {
      setProcessing(true)
      const token = localStorage.getItem('access_token')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

      const response = await fetch(`${apiUrl}/api/copilot/evolution/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({
          thread_id: threadId || undefined,
          message_id: messageId || undefined,
          rule_id: evolution.rule_id || undefined,
          rule_name: evolution.proposed_rule || '새 규칙',
          rule_description: evolution.proposed_rule || '',
          rule_content: {
            rule: evolution.proposed_rule,
            rationale: evolution.rationale
          },
          rule_category: 'general',
          proposal_rationale: evolution.rationale || '',
          approval: true,
          company_id: companyId || undefined
        })
      })

      if (response.ok) {
        const data = await response.json()
        console.log('[MIFCopilot] 규칙 승인 완료:', data)
        onApproved()
        alert('규칙이 승인되었습니다.')
      } else {
        const errorData = await response.json()
        throw new Error(errorData.detail || '규칙 승인 실패')
      }
    } catch (error) {
      console.error('[MIFCopilot] 규칙 승인 실패:', error)
      alert(error instanceof Error ? error.message : '규칙 승인에 실패했습니다.')
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async () => {
    if (processing) return
    
    try {
      setProcessing(true)
      onRejected()
      alert('규칙이 거부되었습니다.')
    } catch (error) {
      console.error('[MIFCopilot] 규칙 거부 실패:', error)
      alert('규칙 거부에 실패했습니다.')
    } finally {
      setProcessing(false)
    }
  }

  if (evolution.approved) {
    return (
      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2 text-green-800">
          <CheckCircle className="w-4 h-4" />
          <p className="text-xs font-semibold">규칙이 승인되었습니다</p>
        </div>
      </div>
    )
  }

  if (evolution.rejected) {
    return (
      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center gap-2 text-red-800">
          <XCircle className="w-4 h-4" />
          <p className="text-xs font-semibold">규칙이 거부되었습니다</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="mb-2">
        <h4 className="text-xs font-semibold text-blue-900 mb-1">✨ 새 규칙 제안</h4>
        <p className="text-xs text-blue-800 mb-2">{evolution.proposed_rule}</p>
        {evolution.rationale && (
          <p className="text-xs text-blue-600 mb-2">이유: {evolution.rationale}</p>
        )}
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleApprove}
          disabled={processing}
          className="flex-1 px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
        >
          <CheckCircle className="w-3 h-3" />
          승인
        </button>
        <button
          onClick={handleReject}
          disabled={processing}
          className="flex-1 px-3 py-1.5 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
        >
          <XCircle className="w-3 h-3" />
          거부
        </button>
      </div>
    </div>
  )
}
