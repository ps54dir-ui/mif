'use client'

// SVG 아이콘 컴포넌트
const CheckCircle2 = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const AlertCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
)

const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

interface PriorityAlertProps {
  topPriority: {
    id: string
    strategyName: string
    impact: number
    confidence: number
    ease: number
    finalScore: number
    description?: string
  }
  executionGuide?: {
    todos: Array<{
      task: string
      description: string
      priority: string
      estimated_time: string
      owner: string
    }>
  }
}

export function PriorityAlert({ topPriority, executionGuide }: PriorityAlertProps) {
  return (
    <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-lg p-6 mb-6 shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-bold text-red-900">
              🚨 최우선 실행 과제
            </h2>
            <span className="px-3 py-1 bg-red-600 text-white text-sm font-bold rounded-full">
              1순위
            </span>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {topPriority.strategyName}
            </h3>
            {topPriority.description && (
              <p className="text-gray-700 mb-3">{topPriority.description}</p>
            )}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-gray-600">ICE Score:</span>
                <span className="font-bold text-red-600">{topPriority.finalScore.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-600">Impact:</span>
                <span className="font-semibold">{topPriority.impact}/10</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-600">Confidence:</span>
                <span className="font-semibold">{topPriority.confidence}/10</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-600">Ease:</span>
                <span className="font-semibold">{topPriority.ease}/10</span>
              </div>
            </div>
          </div>

          {executionGuide && executionGuide.todos.length > 0 && (
            <div className="mt-4 pt-4 border-t border-red-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                실행 가이드 (Checklist)
              </h4>
              <ul className="space-y-2">
                {executionGuide.todos.map((todo, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{todo.task}</div>
                      <div className="text-sm text-gray-600 mt-1">{todo.description}</div>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span>예상 시간: {todo.estimated_time}</span>
                        <span>담당자: {todo.owner}</span>
                        <span className={`px-2 py-0.5 rounded ${
                          todo.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                          todo.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {todo.priority}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <ChevronRight className="w-6 h-6 text-red-600 flex-shrink-0" />
      </div>
    </div>
  )
}
