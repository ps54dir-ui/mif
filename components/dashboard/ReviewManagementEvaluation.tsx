'use client'

import React, { useState } from 'react'

interface Review {
  id: string
  platform: 'naver_place' | 'google' | 'kakao' | 'instagram' | 'facebook'
  author: string
  rating: number
  content: string
  date: string
  has_photo: boolean
  sentiment: 'positive' | 'neutral' | 'negative'
  response_status: 'pending' | 'responded' | 'no_response_needed'
  response_time_hours?: number
  keywords: string[]
}

interface ReviewManagementMetrics {
  total_reviews: number
  average_rating: number
  response_rate: number // 답글률 (%)
  average_response_time_hours: number
  sentiment_distribution: {
    positive: number
    neutral: number
    negative: number
  }
  recent_reviews: Review[]
  top_keywords: {
    keyword: string
    count: number
    sentiment: 'positive' | 'neutral' | 'negative'
  }[]
  issues: {
    type: 'low_response_rate' | 'slow_response' | 'negative_reviews' | 'keyword_trends'
    priority: 'HIGH' | 'MEDIUM' | 'LOW'
    message: string
    recommendation: string
  }[]
}

interface ReviewManagementEvaluationProps {
  metrics: ReviewManagementMetrics
}

export function ReviewManagementEvaluation({ metrics }: ReviewManagementEvaluationProps) {
  const [selectedReview, setSelectedReview] = useState<string | null>(null)
  const [filterSentiment, setFilterSentiment] = useState<'all' | 'positive' | 'neutral' | 'negative'>('all')

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'neutral':
        return 'bg-gray-100 text-gray-700 border-gray-300'
      case 'negative':
        return 'bg-red-100 text-red-700 border-red-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-700 border-red-300'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'LOW':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getResponseStatusBadge = (status: string, time?: number) => {
    switch (status) {
      case 'responded':
        return (
          <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-700">
            응답 완료 {time ? `(${time}h)` : ''}
          </span>
        )
      case 'pending':
        return (
          <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-700">
            응답 대기 {time ? `(${time}h 경과)` : ''}
          </span>
        )
      case 'no_response_needed':
        return (
          <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-700">
            응답 불필요
          </span>
        )
      default:
        return null
    }
  }

  const filteredReviews = metrics.recent_reviews.filter(review => 
    filterSentiment === 'all' || review.sentiment === filterSentiment
  )

  const responseRateStatus = metrics.response_rate >= 80 ? '우수' : metrics.response_rate >= 60 ? '양호' : '개선 필요'
  const responseRateColor = metrics.response_rate >= 80 ? 'text-green-600' : metrics.response_rate >= 60 ? 'text-yellow-600' : 'text-red-600'

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-pink-600 to-rose-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">💬 리뷰 관리 및 평가</h2>
            <p className="text-pink-100 text-sm">리뷰 답글률, 응답 시간, 감정 분석 종합 평가</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{metrics.average_rating.toFixed(1)}</div>
            <div className="text-sm text-pink-100">평균 평점</div>
            <div className="text-2xl font-bold mt-2">{metrics.total_reviews}</div>
            <div className="text-sm text-pink-100">전체 리뷰</div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 주요 지표 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
            <div className="text-xs text-gray-600 mb-1">답글률</div>
            <div className={`text-2xl font-bold ${responseRateColor} mb-1`}>
              {metrics.response_rate.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-600">{responseRateStatus}</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className={`h-2 rounded-full ${metrics.response_rate >= 80 ? 'bg-green-500' : metrics.response_rate >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${metrics.response_rate}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg border border-green-200 p-4">
            <div className="text-xs text-gray-600 mb-1">평균 응답 시간</div>
            <div className="text-2xl font-bold text-green-600 mb-1">
              {metrics.average_response_time_hours.toFixed(1)}h
            </div>
            <div className="text-xs text-gray-600">
              {metrics.average_response_time_hours <= 24 ? '우수' : metrics.average_response_time_hours <= 48 ? '양호' : '개선 필요'}
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
            <div className="text-xs text-gray-600 mb-1">긍정 리뷰</div>
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {metrics.sentiment_distribution.positive}
            </div>
            <div className="text-xs text-gray-600">
              {((metrics.sentiment_distribution.positive / metrics.total_reviews) * 100).toFixed(1)}%
            </div>
          </div>

          <div className="bg-red-50 rounded-lg border border-red-200 p-4">
            <div className="text-xs text-gray-600 mb-1">부정 리뷰</div>
            <div className="text-2xl font-bold text-red-600 mb-1">
              {metrics.sentiment_distribution.negative}
            </div>
            <div className="text-xs text-gray-600">
              {((metrics.sentiment_distribution.negative / metrics.total_reviews) * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* 주요 키워드 */}
        {metrics.top_keywords.length > 0 && (
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">주요 키워드</h3>
            <div className="flex flex-wrap gap-2">
              {metrics.top_keywords.map((kw, idx) => (
                <span
                  key={idx}
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${getSentimentColor(kw.sentiment)}`}
                >
                  {kw.keyword} ({kw.count})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 주요 이슈 및 개선사항 */}
        {metrics.issues.length > 0 && (
          <div className="bg-red-50 rounded-lg border border-red-200 p-4">
            <h3 className="font-semibold text-red-900 mb-3">⚠️ 주요 이슈 및 개선사항</h3>
            <div className="space-y-3">
              {metrics.issues.map((issue, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border ${getPriorityColor(issue.priority)}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm">{issue.message}</span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(issue.priority)}`}>
                      {issue.priority}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 mt-1">
                    💡 <span className="font-medium">권장사항:</span> {issue.recommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 최근 리뷰 목록 */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">최근 리뷰</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterSentiment('all')}
                className={`px-3 py-1 rounded text-xs font-medium ${
                  filterSentiment === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                }`}
              >
                전체
              </button>
              <button
                onClick={() => setFilterSentiment('positive')}
                className={`px-3 py-1 rounded text-xs font-medium ${
                  filterSentiment === 'positive' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}
              >
                긍정
              </button>
              <button
                onClick={() => setFilterSentiment('neutral')}
                className={`px-3 py-1 rounded text-xs font-medium ${
                  filterSentiment === 'neutral' ? 'bg-gray-100 text-gray-700' : 'bg-gray-50 text-gray-600'
                }`}
              >
                중립
              </button>
              <button
                onClick={() => setFilterSentiment('negative')}
                className={`px-3 py-1 rounded text-xs font-medium ${
                  filterSentiment === 'negative' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                }`}
              >
                부정
              </button>
            </div>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredReviews.map((review) => (
              <div
                key={review.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedReview === review.id ? 'ring-2 ring-blue-500 border-blue-300' : 'border-gray-200'
                } ${getSentimentColor(review.sentiment)}`}
                onClick={() => setSelectedReview(selectedReview === review.id ? null : review.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{review.author}</span>
                    <span className="text-xs text-gray-600">{review.platform}</span>
                    <div className="flex items-center gap-1">
                      {'★'.repeat(review.rating)}
                      {'☆'.repeat(5 - review.rating)}
                    </div>
                    {review.has_photo && <span className="text-xs">📷</span>}
                  </div>
                  {getResponseStatusBadge(review.response_status, review.response_time_hours)}
                </div>
                <p className="text-sm mb-2">{review.content}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">{review.date}</span>
                  {review.keywords.length > 0 && (
                    <div className="flex gap-1">
                      {review.keywords.slice(0, 3).map((kw, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded text-xs bg-white/50 text-gray-700">
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
