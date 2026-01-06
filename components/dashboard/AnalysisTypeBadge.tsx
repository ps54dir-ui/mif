'use client'

interface AnalysisTypeBadgeProps {
  analysisType: 'actual' | 'inference' | 'unavailable'
  label?: string
  description?: string
  size?: 'sm' | 'md' | 'lg'
  showDescription?: boolean
}

export function AnalysisTypeBadge({ 
  analysisType, 
  label,
  description,
  size = 'sm',
  showDescription = false 
}: AnalysisTypeBadgeProps) {
  const defaultLabels = {
    'actual': '실질분석 (RAG 기반)',
    'inference': '추론분석',
    'unavailable': '분석불가'
  }
  
  const defaultDescriptions = {
    'actual': '실제 수집 데이터와 AI가 직접 분석한 결과입니다.',
    'inference': '데이터가 부족하여 추론으로 분석한 결과입니다.',
    'unavailable': '분석에 필요한 데이터가 없어 분석할 수 없습니다.'
  }
  
  const displayLabel = label || defaultLabels[analysisType]
  const displayDescription = description || defaultDescriptions[analysisType]
  
  const colorClasses = {
    'actual': {
      bg: 'bg-green-100',
      text: 'text-green-700',
      border: 'border-green-300',
      dot: 'bg-green-500'
    },
    'inference': {
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
      border: 'border-yellow-300',
      dot: 'bg-yellow-500'
    },
    'unavailable': {
      bg: 'bg-red-100',
      text: 'text-red-700',
      border: 'border-red-300',
      dot: 'bg-red-500'
    }
  }
  
  const sizeClasses = {
    'sm': {
      container: 'px-2 py-1 text-xs',
      text: 'text-xs',
      dot: 'w-1.5 h-1.5'
    },
    'md': {
      container: 'px-3 py-1.5 text-sm',
      text: 'text-sm',
      dot: 'w-2 h-2'
    },
    'lg': {
      container: 'px-4 py-2 text-base',
      text: 'text-base',
      dot: 'w-2.5 h-2.5'
    }
  }
  
  const colors = colorClasses[analysisType]
  const sizes = sizeClasses[size]
  
  // 안전성 검사: colors가 undefined인 경우 기본값 사용
  if (!colors) {
    console.warn(`Invalid analysisType: ${analysisType}, using 'unavailable' as fallback`)
    const fallbackColors = colorClasses['unavailable']
    return (
      <div className="flex flex-col gap-1">
        <div className={`inline-flex items-center gap-1.5 ${fallbackColors.bg} ${fallbackColors.text} ${fallbackColors.border} border rounded-full ${sizes.container} font-medium`}>
          <span className={`${fallbackColors.dot} ${sizes.dot} rounded-full`}></span>
          <span className={sizes.text}>{displayLabel || '분석불가'}</span>
        </div>
      </div>
    )
  }
  
  return (
    <div className="flex flex-col gap-1">
      <div className={`inline-flex items-center gap-1.5 ${colors.bg} ${colors.text} ${colors.border} border rounded-full ${sizes.container} font-medium`}>
        <span className={`${colors.dot} ${sizes.dot} rounded-full`}></span>
        <span className={sizes.text}>{displayLabel}</span>
      </div>
      {showDescription && displayDescription && (
        <p className={`${colors.text} ${sizes.text} italic opacity-80`}>
          {displayDescription}
        </p>
      )}
    </div>
  )
}