/**
 * 업종 선택 컴포넌트
 * 진단 시작 시 업종을 선택하거나 자동 감지
 */

'use client'

import { useState } from 'react'
import { IndustryType, getAllIndustries } from '@/data/industries/industryConfig'
import { detectIndustry, selectIndustryManually, type CompanyData } from '@/lib/industry/industryDetector'

interface IndustrySelectorProps {
  onIndustrySelected: (industry: IndustryType, profile: ReturnType<typeof selectIndustryManually>) => void
  initialCompanyData?: CompanyData
}

export default function IndustrySelector({ onIndustrySelected, initialCompanyData }: IndustrySelectorProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType | null>(null)
  const [autoDetected, setAutoDetected] = useState<ReturnType<typeof selectIndustryManually> | null>(null)
  const [isDetecting, setIsDetecting] = useState(false)
  const [companyData, setCompanyData] = useState<CompanyData>(initialCompanyData || {
    description: '',
    business_type: '',
    revenue_model: '',
    traffic_sources: [],
    keywords: [],
    features: []
  })

  const industries = getAllIndustries()

  // 자동 업종 감지
  const handleAutoDetect = async () => {
    setIsDetecting(true)
    try {
      const profile = await detectIndustry(companyData)
      setAutoDetected(profile)
      setSelectedIndustry(profile.industry_type)
    } catch (error) {
      console.error('업종 감지 실패:', error)
    } finally {
      setIsDetecting(false)
    }
  }

  // 수동 업종 선택
  const handleManualSelect = (industry: IndustryType) => {
    const profile = selectIndustryManually(industry)
    setSelectedIndustry(industry)
    setAutoDetected(profile)
  }

  // 진단 시작
  const handleStartDiagnosis = () => {
    if (selectedIndustry && autoDetected) {
      onIndustrySelected(selectedIndustry, autoDetected)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🎯 업종 선택
          </h1>
          <p className="text-lg text-gray-600">
            회사 정보를 입력하거나 업종을 직접 선택하세요
          </p>
        </div>

        {/* 회사 정보 입력 */}
        <div className="bg-white rounded-lg border-2 border-gray-300 p-6 shadow-lg mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">회사 정보 입력 (자동 감지용)</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사업 설명
              </label>
              <textarea
                value={companyData.description}
                onChange={(e) => setCompanyData({ ...companyData, description: e.target.value })}
                placeholder="예: 온라인 의류 쇼핑몰, SaaS CRM 솔루션 등"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  사업 유형
                </label>
                <input
                  type="text"
                  value={companyData.business_type || ''}
                  onChange={(e) => setCompanyData({ ...companyData, business_type: e.target.value })}
                  placeholder="예: 전자상거래, SaaS 등"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  수익 모델
                </label>
                <input
                  type="text"
                  value={companyData.revenue_model || ''}
                  onChange={(e) => setCompanyData({ ...companyData, revenue_model: e.target.value })}
                  placeholder="예: 구매, 구독, 예약 등"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              onClick={handleAutoDetect}
              disabled={isDetecting || !companyData.description}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold"
            >
              {isDetecting ? '감지 중...' : '🔍 자동 업종 감지'}
            </button>
          </div>
        </div>

        {/* 자동 감지 결과 */}
        {autoDetected && (
          <div className="bg-green-50 rounded-lg border-2 border-green-300 p-6 shadow-lg mb-6">
            <h2 className="text-xl font-bold text-green-900 mb-4">✅ 감지된 업종</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">업종</div>
                <div className="text-2xl font-bold text-green-700">
                  {autoDetected.industry_type === 'ecommerce' && '전자상거래/쇼핑'}
                  {autoDetected.industry_type === 'saas' && 'SaaS/B2B Software'}
                  {autoDetected.industry_type === 'local_business' && '로컬 비즈니스'}
                  {autoDetected.industry_type === 'creator_economy' && '크리에이터'}
                  {autoDetected.industry_type === 'media' && '미디어/출판'}
                  {autoDetected.industry_type === 'healthcare' && '의료/건강'}
                  {autoDetected.industry_type === 'services' && '전문서비스'}
                  {autoDetected.industry_type === 'non_profit' && '비영리/시민단체'}
                  {autoDetected.industry_type === 'food_beverage' && '식음료'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">신뢰도</div>
                <div className="text-2xl font-bold text-green-700">
                  {autoDetected.confidence}%
                </div>
              </div>
            </div>
            {autoDetected.sub_category && (
              <div className="mt-4">
                <div className="text-sm text-gray-600">서브 카테고리</div>
                <div className="text-lg font-semibold text-gray-900">
                  {autoDetected.sub_category}
                </div>
              </div>
            )}
            <div className="mt-4">
              <div className="text-sm text-gray-600 mb-2">주요 지표</div>
              <div className="flex flex-wrap gap-2">
                {autoDetected.key_metrics.map((metric, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm"
                  >
                    {metric}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 업종 선택 그리드 */}
        <div className="bg-white rounded-lg border-2 border-gray-300 p-6 shadow-lg mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">또는 업종을 직접 선택하세요</h2>
          <div className="grid grid-cols-3 gap-4">
            {industries.map((industry) => {
              const isSelected = selectedIndustry === industry.id
              return (
                <button
                  key={industry.id}
                  onClick={() => handleManualSelect(industry.id)}
                  className={`p-6 rounded-lg border-2 transition-all text-left ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="text-2xl mb-2">
                    {industry.id === 'ecommerce' && '🛒'}
                    {industry.id === 'saas' && '💼'}
                    {industry.id === 'local_business' && '📍'}
                    {industry.id === 'creator_economy' && '🎬'}
                    {industry.id === 'media' && '📰'}
                    {industry.id === 'healthcare' && '🏥'}
                    {industry.id === 'services' && '⚖️'}
                    {industry.id === 'non_profit' && '🤝'}
                    {industry.id === 'food_beverage' && '🍽️'}
                  </div>
                  <div className="font-bold text-gray-900 mb-1">{industry.name}</div>
                  <div className="text-sm text-gray-600">{industry.description}</div>
                  {isSelected && (
                    <div className="mt-3 text-sm font-semibold text-blue-600">
                      ✓ 선택됨
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* 선택된 업종 정보 */}
        {selectedIndustry && autoDetected && (
          <div className="bg-white rounded-lg border-2 border-blue-300 p-6 shadow-lg mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">선택된 업종 정보</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-gray-600 mb-2">주요 목표</div>
                <div className="text-lg font-semibold text-gray-900">
                  {autoDetected.characteristics.join(', ')}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-2">우선 채널</div>
                <div className="flex flex-wrap gap-2">
                  {autoDetected.priority_channels.slice(0, 4).map((channel, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {channel.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 진단 시작 버튼 */}
        {selectedIndustry && autoDetected && (
          <div className="text-center">
            <button
              onClick={handleStartDiagnosis}
              className="px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold text-lg shadow-lg transition-all"
            >
              🚀 진단 시작하기
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
