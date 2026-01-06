'use client'

interface ICEPriority {
  id: string
  strategyName: string
  impact: number
  confidence: number
  ease: number
  finalScore: number
  description?: string
}

interface ICETodoListProps {
  priorities: ICEPriority[]
}

export function ICETodoList({ priorities }: ICETodoListProps) {
  // 상위 3개만 표시
  const top3 = priorities.slice(0, 3)

  const getPriorityColor = (index: number) => {
    switch (index) {
      case 0:
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          badge: 'bg-red-500',
          text: 'text-red-700'
        }
      case 1:
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          badge: 'bg-orange-500',
          text: 'text-orange-700'
        }
      case 2:
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          badge: 'bg-yellow-500',
          text: 'text-yellow-700'
        }
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          badge: 'bg-gray-500',
          text: 'text-gray-700'
        }
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          지금 당장 매출을 올리기 위해 해야 할 일
        </h2>
        <span className="text-sm text-gray-500">ICE Score 기준</span>
      </div>

      <div className="space-y-4">
        {top3.length > 0 ? (
          top3.map((priority, index) => {
            const colors = getPriorityColor(index)

            return (
              <div
                key={priority.id}
                className={`rounded-lg border-2 p-4 ${colors.bg} ${colors.border}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-white text-xs font-bold ${colors.badge}`}>
                        {index + 1}순위
                      </span>
                      <h3 className={`font-semibold ${colors.text}`}>
                        {priority.strategyName}
                      </h3>
                    </div>
                    {priority.description && (
                      <p className="text-sm text-gray-600 mb-3">{priority.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">Impact:</span>
                        <span className="font-semibold">{priority.impact}/10</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">Confidence:</span>
                        <span className="font-semibold">{priority.confidence}/10</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">Ease:</span>
                        <span className="font-semibold">{priority.ease}/10</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">ICE Score:</span>
                        <span className="font-bold text-gray-900">{priority.finalScore.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-8 text-gray-500">
            우선순위 전략이 없습니다.
          </div>
        )}
      </div>

      {priorities.length > 3 && (
        <div className="mt-4 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            전체 {priorities.length}개 전략 보기 →
          </button>
        </div>
      )}
    </div>
  )
}
