'use client'

import React, { useState } from 'react'
import { generateReviewBasedStrategy, type ReviewBasedStrategyReport, type Review } from '@/lib/marketing/reviewBasedStrategy'

interface ReviewBasedStrategyProps {
  reviews: Review[]
  brandName?: string
}

export function ReviewBasedStrategy({ reviews, brandName = '브랜드' }: ReviewBasedStrategyProps) {
  const [activeTab, setActiveTab] = useState<'marketing' | 'improvement' | 'insights'>('marketing')
  const [selectedReview, setSelectedReview] = useState<string | null>(null)

  const strategyReport: ReviewBasedStrategyReport = generateReviewBasedStrategy(reviews)

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-green-600 via-teal-600 to-cyan-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">💬 리뷰 기반 마케팅 & 개선 전략</h2>
            <p className="text-green-100 text-sm">긍정 리뷰는 광고 활용, 부정 리뷰는 개선 데이터로 전환</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{reviews.length}개</div>
            <div className="text-sm text-green-100">분석된 리뷰</div>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('marketing')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'marketing'
                ? 'bg-green-50 text-green-700 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            📢 마케팅 활용 ({strategyReport.positiveReviewsForMarketing.length}개)
          </button>
          <button
            onClick={() => setActiveTab('improvement')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'improvement'
                ? 'bg-red-50 text-red-700 border-b-2 border-red-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            🔧 개선 액션 ({strategyReport.negativeReviewsForImprovement.length}개)
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'insights'
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            💡 주요 인사이트
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* 마케팅 활용 탭 */}
        {activeTab === 'marketing' && (
          <div className="space-y-6">
            {/* 카피 제안 */}
            {strategyReport.marketingCopySuggestions.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">📝 추천 마케팅 카피</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {strategyReport.marketingCopySuggestions.map((suggestion, index) => (
                    <div key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200 p-4">
                      <div className="text-xs font-medium text-purple-600 mb-2">{suggestion.useCase}</div>
                      <h4 className="font-bold text-gray-900 mb-2">{suggestion.headline}</h4>
                      <p className="text-sm text-gray-700 mb-3">{suggestion.description}</p>
                      <div className="text-xs text-gray-500">
                        출처: {suggestion.sourceReviewIds.length}개 리뷰
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 긍정 리뷰 목록 */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">⭐ 마케팅에 활용할 긍정 리뷰</h3>
              <div className="space-y-4">
                {strategyReport.positiveReviewsForMarketing.slice(0, 10).map((review) => (
                  <div
                    key={review.reviewId}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedReview === review.reviewId
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 bg-white hover:border-green-300'
                    }`}
                    onClick={() => setSelectedReview(selectedReview === review.reviewId ? null : review.reviewId)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                          <span className="text-sm text-gray-600">{review.author}</span>
                          <span className="text-xs text-gray-500">({review.platform})</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            review.useCase === 'testimonial' ? 'bg-blue-100 text-blue-700' :
                            review.useCase === 'social_proof' ? 'bg-purple-100 text-purple-700' :
                            review.useCase === 'feature_highlight' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {review.useCase === 'testimonial' ? '고객 추천' :
                             review.useCase === 'social_proof' ? '소셜 증거' :
                             review.useCase === 'feature_highlight' ? '기능 강조' : 'CTA'}
                          </span>
                        </div>
                        <blockquote className="text-gray-700 italic border-l-4 border-green-400 pl-3 mb-2">
                          &quot;{review.quote}&quot;
                        </blockquote>
                        {review.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {review.keywords.map((kw, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                                {kw}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 확장된 정보 */}
                    {selectedReview === review.reviewId && (
                      <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-2">💡 추천 카피:</div>
                          <div className="space-y-1">
                            {review.suggestedCopy.map((copy, idx) => (
                              <div key={idx} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                {copy}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-2">📍 배치 위치:</div>
                          <div className="flex flex-wrap gap-2">
                            {review.placement.map((place, idx) => (
                              <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                {place}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 개선 액션 탭 */}
        {activeTab === 'improvement' && (
          <div className="space-y-6">
            {strategyReport.improvementActions.map((categoryAction, index) => (
              <div key={index} className="bg-red-50 rounded-lg border border-red-200 p-4">
                <h3 className="text-lg font-bold text-red-900 mb-4">{categoryAction.category} 개선</h3>
                <div className="space-y-3">
                  {categoryAction.actions.map((action, actionIndex) => (
                    <div key={actionIndex} className="bg-white rounded-lg border border-red-200 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{action.action}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          action.priority === 'IMMEDIATE' ? 'bg-red-100 text-red-700' :
                          action.priority === 'SHORT_TERM' ? 'bg-orange-100 text-orange-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {action.priority === 'IMMEDIATE' ? '긴급' :
                           action.priority === 'SHORT_TERM' ? '단기' : '중장기'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-700">
                        <span className="font-medium">예상 효과:</span> {action.expectedImpact}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* 개선이 필요한 부정 리뷰 */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">⚠️ 개선이 필요한 이슈</h3>
              <div className="space-y-3">
                {strategyReport.negativeReviewsForImprovement.slice(0, 10).map((review) => (
                  <div key={review.reviewId} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            review.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                            review.severity === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                            review.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {review.severity}
                          </span>
                          <span className="text-xs text-gray-600">{review.category}</span>
                          <span className="text-xs text-gray-500">{review.frequency}회 언급</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{review.issue}</p>
                        {review.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {review.keywords.map((kw, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">
                                {kw}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* 제안된 액션 */}
                    {review.suggestedActions.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-300">
                        <div className="text-xs font-medium text-gray-600 mb-2">제안된 개선 액션:</div>
                        <div className="space-y-1">
                          {review.suggestedActions.slice(0, 3).map((action, idx) => (
                            <div key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                              <span>•</span>
                              <span>{action.action}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 주요 인사이트 탭 */}
        {activeTab === 'insights' && (
          <div className="space-y-6">
            {/* 주요 강점 */}
            <div className="bg-green-50 rounded-lg border border-green-200 p-4">
              <h3 className="text-lg font-bold text-green-900 mb-4">💪 주요 강점</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {strategyReport.keyInsights.topStrengths.map((strength, index) => (
                  <div key={index} className="bg-white rounded-lg border border-green-200 p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 font-bold">#{index + 1}</span>
                      <span className="text-gray-900 font-medium">{strength}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 주요 약점 */}
            <div className="bg-red-50 rounded-lg border border-red-200 p-4">
              <h3 className="text-lg font-bold text-red-900 mb-4">⚠️ 주요 약점</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {strategyReport.keyInsights.topWeaknesses.map((weakness, index) => (
                  <div key={index} className="bg-white rounded-lg border border-red-200 p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-red-600 font-bold">#{index + 1}</span>
                      <span className="text-gray-900 font-medium">{weakness}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 기회 */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
              <h3 className="text-lg font-bold text-blue-900 mb-4">🚀 기회</h3>
              <div className="space-y-2">
                {strategyReport.keyInsights.opportunities.map((opportunity, index) => (
                  <div key={index} className="bg-white rounded-lg border border-blue-200 p-3">
                    <div className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-1">→</span>
                      <span className="text-gray-900">{opportunity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
