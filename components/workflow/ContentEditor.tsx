'use client'

import { useState } from 'react'
import type { ContentPrompt } from '@/lib/workflow/promptGenerator'

interface ContentEditorProps {
  initialPrompt: ContentPrompt | null
  onContentGenerated?: (content: string) => void
}

export default function ContentEditor({ initialPrompt, onContentGenerated }: ContentEditorProps) {
  const [prompt, setPrompt] = useState(initialPrompt?.prompt || '')
  const [generatedContent, setGeneratedContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  
  // 프롬프트가 변경되면 자동으로 업데이트
  if (initialPrompt && prompt !== initialPrompt.prompt) {
    setPrompt(initialPrompt.prompt)
  }
  
  const handleGenerate = async () => {
    setIsGenerating(true)
    
    // 시뮬레이션: 실제로는 AI API 호출
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const mockContent = `[생성된 콘텐츠]

${initialPrompt?.contentType === 'reels' ? '📱 인스타그램 릴스 대본' : '📝 콘텐츠'}

${initialPrompt?.tone ? `톤: ${initialPrompt.tone}` : ''}

---

${initialPrompt?.keyPoints.map((point, idx) => `• ${point}`).join('\n')}

---

[실제 콘텐츠 내용]
${prompt.includes('재방문율') ? `
🔥 나이키 팬덤 여러분! 

오늘은 여러분이 나이키를 선택한 이유를 다시 한번 생각해보는 시간이에요.

나이키는 단순한 운동화가 아니라, 여러분의 꿈을 실현하는 파트너입니다.

💪 함께 달려온 모든 순간들이 소중하죠?

이번 주말, 나이키와 함께 새로운 도전을 시작해보세요!

#나이키 #JustDoIt #팬덤 #재구매혜택 #나이키러버
` : prompt.includes('상세페이지') ? `
[제품명]의 진짜 가치를 아시나요?

✅ 10,000명이 선택한 이유
✅ 정품 인증 보장
✅ 전문가 추천 제품
✅ 30일 무료 반품

지금 바로 확인하세요!
` : `
나이키와 함께 새로운 시작을!

최고의 품질과 디자인으로 여러분의 라이프스타일을 업그레이드하세요.

#나이키 #신상품 #특가
`}
`
    
    setGeneratedContent(mockContent)
    setIsGenerating(false)
    
    if (onContentGenerated) {
      onContentGenerated(mockContent)
    }
  }
  
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">AI 콘텐츠 편집기</h3>
        {initialPrompt && (
          <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-xs text-gray-600 mb-1">데이터 기반 프롬프트:</div>
            <div className="text-sm text-gray-700 italic">&quot;{initialPrompt.context}&quot;</div>
            <div className="text-xs text-gray-500 mt-1">
              타겟: {initialPrompt.targetChannel} | 형식: {initialPrompt.contentType} | 톤: {initialPrompt.tone}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            프롬프트 입력
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="콘텐츠 생성 프롬프트를 입력하세요..."
          />
        </div>
        
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isGenerating ? (
            <>
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              생성 중...
            </>
          ) : (
            '✨ AI 콘텐츠 생성'
          )}
        </button>
        
        {generatedContent && (
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              생성된 콘텐츠
            </label>
            <textarea
              value={generatedContent}
              onChange={(e) => setGeneratedContent(e.target.value)}
              className="w-full h-64 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="생성된 콘텐츠가 여기에 표시됩니다..."
            />
            <div className="mt-2 flex gap-2">
              <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                복사
              </button>
              <button className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700">
                다운로드
              </button>
              <button className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700">
                공유
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
