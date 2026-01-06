'use client'

// SVG 아이콘 (icons 파일 의존성 제거)
const AlertTriangle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
)

interface ChannelAsymmetryProps {
  asymmetry: {
    insights: Array<{
      type: string
      channel1: string
      channel2: string
      metric: string
      message: string
    }>
    summary: string
  }
}

export function ChannelAsymmetryAnalysis({ asymmetry }: ChannelAsymmetryProps) {
  if (!asymmetry || !asymmetry.insights || asymmetry.insights.length === 0) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-start gap-3 mb-4">
        <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            채널 간 비대칭 분석
          </h2>
          <p className="text-base text-gray-800 font-medium mb-4">
            {asymmetry.summary}
          </p>
          
          <div className="space-y-3">
            {asymmetry.insights.map((insight, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-orange-700">
                    {insight.channel1} vs {insight.channel2}
                  </span>
                  <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded">
                    {insight.metric}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{insight.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
