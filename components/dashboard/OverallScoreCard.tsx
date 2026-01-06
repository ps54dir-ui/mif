'use client'

interface OverallScoreCardProps {
  score: number
}

export function OverallScoreCard({ score }: OverallScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200'
    if (score >= 60) return 'bg-yellow-50 border-yellow-200'
    if (score >= 40) return 'bg-orange-50 border-orange-200'
    return 'bg-red-50 border-red-200'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return '우수'
    if (score >= 60) return '양호'
    if (score >= 40) return '보통'
    return '개선 필요'
  }

  return (
    <div className={`rounded-lg border-2 p-8 ${getScoreBgColor(score)}`}>
      <div className="text-center">
        <div className="text-sm font-medium text-gray-600 mb-2">종합 마케팅 건강도</div>
        <div className={`text-7xl font-bold ${getScoreColor(score)} mb-2`}>
          {score}
          <span className="text-4xl text-gray-500">/100</span>
        </div>
        <div className={`text-lg font-semibold ${getScoreColor(score)}`}>
          {getScoreLabel(score)}
        </div>
        <div className="mt-4 text-sm text-gray-600">
          네이버 플레이스, SEO, GEO/AEO, GA4 데이터 종합 분석
        </div>
      </div>
    </div>
  )
}
