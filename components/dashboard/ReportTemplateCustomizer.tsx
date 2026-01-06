/**
 * 리포트 템플릿 커스터마이저
 * 리포트 구성 요소를 체크박스로 선택하여 커스텀 리포트 템플릿 생성 및 저장
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { Save, FolderOpen, Plus, Trash2, FileText, CheckSquare, Square } from 'lucide-react'

interface ReportSection {
  id: string
  label: string
  category: 'overview' | 'diagnosis' | 'strategy' | 'compliance' | 'market' | 'analytics'
  required?: boolean
}

const AVAILABLE_SECTIONS: ReportSection[] = [
  // 개요
  { id: 'executive_summary', label: 'Executive Summary (종합 요약)', category: 'overview', required: true },
  { id: 'overall_score', label: '종합 진단 점수', category: 'overview', required: true },
  { id: 'four_axes', label: '4대 축 분석 (유입/설득/신뢰/순환)', category: 'overview' },
  
  // 진단
  { id: 'seo_geo_aeo', label: 'SEO/GEO/AEO 진단 결과', category: 'diagnosis' },
  { id: 'channel_diagnostics', label: '채널별 성과 분석', category: 'diagnosis' },
  { id: 'online_channel', label: '온라인 채널 진단 (유튜브/틱톡 등)', category: 'diagnosis' },
  { id: 'channel_asymmetry', label: '채널 간 비대칭 분석', category: 'diagnosis' },
  { id: 'digital_share', label: '종합 디지털 점유율', category: 'diagnosis' },
  
  // 전략
  { id: 'ice_priorities', label: 'ICE Score 우선순위 전략', category: 'strategy' },
  { id: 'execution_plan', label: '전략 실행 계획', category: 'strategy' },
  { id: 'weekly_checklist', label: '주간 업무 체크리스트', category: 'strategy' },
  
  // 컴플라이언스
  { id: 'compliance_overview', label: '컴플라이언스 개요', category: 'compliance' },
  { id: 'compliance_detail', label: '규정 준수 세부 검증', category: 'compliance' },
  { id: 'compliance_scorecard', label: '컴플라이언스 스코어카드', category: 'compliance' },
  { id: 'remediation_plan', label: '자동 개선 계획', category: 'compliance' },
  
  // 시장 보호
  { id: 'market_protection', label: '시장 보호 현황', category: 'market' },
  { id: 'competitor_fraud', label: '경쟁사 부정행위 감지', category: 'market' },
  { id: 'malicious_review', label: '악플/공격 감시', category: 'market' },
  { id: 'reporting_tools', label: '신고 도구', category: 'market' },
  
  // 분석
  { id: 'ga4_analytics', label: 'GA4 실시간 분석', category: 'analytics' },
  { id: 'page_overlay', label: '상세페이지 이탈률 분석', category: 'analytics' },
  { id: 'meta_ads', label: '메타 광고 분석', category: 'analytics' },
  { id: 'ai_authority', label: 'AI 권위 진단', category: 'analytics' },
  { id: 'dwell_time', label: '체류 시간 & Retention 분석', category: 'analytics' },
  { id: 'retargeting', label: '리타겟팅 전략', category: 'analytics' },
  { id: 'price_psychology', label: '가격 심리 분석', category: 'analytics' },
  { id: 'performance_simulator', label: '성과 예측 시뮬레이터', category: 'analytics' },
  { id: 'diagnosis_comparison', label: '진단 비교 (재진단 시)', category: 'analytics' }
]

interface SavedTemplate {
  id: string
  name: string
  description?: string
  selectedSections: string[]
  createdAt: Date
  updatedAt: Date
}

interface ReportTemplateCustomizerProps {
  companyName: string
  onSave?: (template: SavedTemplate) => void
  onLoad?: (template: SavedTemplate) => void
}

export function ReportTemplateCustomizer({ companyName, onSave, onLoad }: ReportTemplateCustomizerProps) {
  const [selectedSections, setSelectedSections] = useState<Set<string>>(new Set())
  const [templateName, setTemplateName] = useState('')
  const [templateDescription, setTemplateDescription] = useState('')
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)

  // 필수 섹션 자동 선택
  useEffect(() => {
    const required = AVAILABLE_SECTIONS.filter(s => s.required).map(s => s.id)
    setSelectedSections(new Set(required))
  }, [])

  const loadSavedTemplates = useCallback(() => {
    try {
      if (typeof window === 'undefined') return
      const stored = localStorage.getItem(`report_templates_${companyName}`)
      if (stored) {
        const templates = JSON.parse(stored).map((t: any) => ({
          ...t,
          createdAt: new Date(t.createdAt),
          updatedAt: new Date(t.updatedAt)
        }))
        setSavedTemplates(templates)
      }
    } catch (error) {
      console.error('템플릿 로드 실패:', error)
    }
  }, [companyName])

  // 저장된 템플릿 불러오기
  useEffect(() => {
    loadSavedTemplates()
  }, [loadSavedTemplates])

  const handleSectionToggle = (sectionId: string) => {
    const section = AVAILABLE_SECTIONS.find(s => s.id === sectionId)
    if (section?.required) return // 필수 섹션은 선택 해제 불가

    const newSelected = new Set(selectedSections)
    if (newSelected.has(sectionId)) {
      newSelected.delete(sectionId)
    } else {
      newSelected.add(sectionId)
    }
    setSelectedSections(newSelected)
  }

  const handleSelectAll = (category?: string) => {
    const newSelected = new Set(selectedSections)
    const sectionsToSelect = category
      ? AVAILABLE_SECTIONS.filter(s => s.category === category)
      : AVAILABLE_SECTIONS

    sectionsToSelect.forEach(section => {
      newSelected.add(section.id)
    })
    setSelectedSections(newSelected)
  }

  const handleDeselectAll = (category?: string) => {
    const newSelected = new Set(selectedSections)
    const sectionsToDeselect = category
      ? AVAILABLE_SECTIONS.filter(s => s.category === category && !s.required)
      : AVAILABLE_SECTIONS.filter(s => !s.required)

    sectionsToDeselect.forEach(section => {
      newSelected.delete(section.id)
    })
    setSelectedSections(newSelected)
  }

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      alert('템플릿 이름을 입력해주세요.')
      return
    }

    setIsSaving(true)
    try {
      const newTemplate: SavedTemplate = {
        id: `template-${Date.now()}`,
        name: templateName,
        description: templateDescription,
        selectedSections: Array.from(selectedSections),
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const updatedTemplates = [...savedTemplates, newTemplate]
      if (typeof window !== 'undefined') {
        localStorage.setItem(`report_templates_${companyName}`, JSON.stringify(updatedTemplates))
      }
      setSavedTemplates(updatedTemplates)
      setTemplateName('')
      setTemplateDescription('')
      setShowSaveModal(false)
      onSave?.(newTemplate)
      alert('템플릿이 저장되었습니다.')
    } catch (error) {
      console.error('템플릿 저장 실패:', error)
      alert('템플릿 저장에 실패했습니다.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleLoadTemplate = (template: SavedTemplate) => {
    setSelectedSections(new Set(template.selectedSections))
    onLoad?.(template)
    alert(`"${template.name}" 템플릿을 불러왔습니다.`)
  }

  const handleDeleteTemplate = (templateId: string) => {
    if (!confirm('이 템플릿을 삭제하시겠습니까?')) return

    const updatedTemplates = savedTemplates.filter(t => t.id !== templateId)
    if (typeof window !== 'undefined') {
      localStorage.setItem(`report_templates_${companyName}`, JSON.stringify(updatedTemplates))
    }
    setSavedTemplates(updatedTemplates)
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      overview: '개요',
      diagnosis: '진단',
      strategy: '전략',
      compliance: '컴플라이언스',
      market: '시장 보호',
      analytics: '분석'
    }
    return labels[category] || category
  }

  const categories = ['overview', 'diagnosis', 'strategy', 'compliance', 'market', 'analytics'] as const

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">리포트 템플릿 커스터마이저</h2>
          <p className="text-sm text-gray-600 mt-1">
            리포트에 포함할 섹션을 선택하여 커스텀 리포트 템플릿을 만들 수 있습니다
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowSaveModal(true)}
            disabled={selectedSections.size === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            템플릿 저장
          </button>
        </div>
      </div>

      {/* 선택된 섹션 수 표시 */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-blue-900">
              선택된 섹션: {selectedSections.size}개 / {AVAILABLE_SECTIONS.length}개
            </div>
            <div className="text-sm text-blue-700 mt-1">
              필수 섹션은 자동으로 포함됩니다
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleSelectAll()}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              전체 선택
            </button>
            <button
              onClick={() => handleDeselectAll()}
              className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              전체 해제
            </button>
          </div>
        </div>
      </div>

      {/* 저장된 템플릿 목록 */}
      {savedTemplates.length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            저장된 템플릿 ({savedTemplates.length}개)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {savedTemplates.map((template) => (
              <div
                key={template.id}
                className="p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{template.name}</div>
                    {template.description && (
                      <div className="text-xs text-gray-600 mt-1">{template.description}</div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      {template.selectedSections.length}개 섹션
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                    title="삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => handleLoadTemplate(template)}
                  className="w-full mt-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FolderOpen className="w-3 h-3" />
                  불러오기
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 섹션 선택 */}
      <div className="space-y-6">
        {categories.map((category) => {
          const categorySections = AVAILABLE_SECTIONS.filter(s => s.category === category)
          const selectedCount = categorySections.filter(s => selectedSections.has(s.id)).length

          return (
            <div key={category} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {getCategoryLabel(category)} ({selectedCount}/{categorySections.length})
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSelectAll(category)}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    전체 선택
                  </button>
                  <button
                    onClick={() => handleDeselectAll(category)}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  >
                    전체 해제
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                {categorySections.map((section) => {
                  const isSelected = selectedSections.has(section.id)
                  return (
                    <label
                      key={section.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-blue-50 border-2 border-blue-300'
                          : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                      } ${section.required ? 'opacity-75' : ''}`}
                    >
                      {section.required ? (
                        <CheckSquare className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      ) : isSelected ? (
                        <CheckSquare className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{section.label}</div>
                        {section.required && (
                          <div className="text-xs text-blue-600 mt-0.5">필수 포함</div>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSectionToggle(section.id)}
                        disabled={section.required}
                        className="sr-only"
                      />
                    </label>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* 템플릿 저장 모달 */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">템플릿 저장</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    템플릿 이름 *
                  </label>
                  <input
                    type="text"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="예: 고객사용 간단 리포트"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    설명 (선택)
                  </label>
                  <textarea
                    value={templateDescription}
                    onChange={(e) => setTemplateDescription(e.target.value)}
                    placeholder="이 템플릿에 대한 설명을 입력하세요"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-sm text-blue-900">
                    선택된 섹션: <span className="font-semibold">{selectedSections.size}개</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowSaveModal(false)
                    setTemplateName('')
                    setTemplateDescription('')
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  취소
                </button>
                <button
                  onClick={handleSaveTemplate}
                  disabled={!templateName.trim() || isSaving}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>저장 중...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>저장</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
