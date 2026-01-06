'use client'

interface DataCollectionSummaryProps {
  analysisPeriod?: {
    months: number
    startDate?: string
    endDate?: string
  }
  totalDataCount?: number
  channels?: {
    [key: string]: {
      count?: number
      status?: string
    }
  }
}

export function DataCollectionSummary({ 
  analysisPeriod = { months: 3 },
  totalDataCount,
  channels 
}: DataCollectionSummaryProps) {
  const { months, startDate, endDate } = analysisPeriod
  
  // 시작일/종료일이 없으면 계산
  const end = endDate ? new Date(endDate) : new Date()
  const start = startDate ? new Date(startDate) : (() => {
    const date = new Date()
    date.setMonth(date.getMonth() - months)
    return date
  })()
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }
  
  // 채널별 데이터 수집 개수 합계
  const channelCount = channels ? Object.values(channels).reduce((sum, channel) => {
    return sum + (channel.count || 0)
  }, 0) : 0
  
  const displayCount = totalDataCount || channelCount
  
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-lg">📅</span>
          </div>
          <div>
            <div className="font-semibold text-gray-900">
              분석 기간: 최근 {months}개월
            </div>
            <div className="text-sm text-gray-600">
              {formatDate(start)} ~ {formatDate(end)}
            </div>
          </div>
        </div>
        
        {displayCount > 0 && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">수집된 데이터</div>
              <div className="text-2xl font-bold text-blue-600">
                {displayCount.toLocaleString()}개
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}