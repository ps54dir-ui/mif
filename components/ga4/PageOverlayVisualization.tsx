'use client'

import { useState } from 'react'
import type { PageOverlayData } from '@/lib/ga4/pageOverlay'

interface PageOverlayVisualizationProps {
  overlayData: PageOverlayData
}

export default function PageOverlayVisualization({ overlayData }: PageOverlayVisualizationProps) {
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  
  return (
    <div className="bg-white rounded-lg border-2 border-blue-300 p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        📊 상세페이지 레이아웃별 이탈률 오버레이
      </h3>
      
      {/* 페이지 레이아웃 시뮬레이션 */}
      <div className="relative bg-gray-100 rounded-lg p-4 mb-4 min-h-[400px]">
        {/* 헤더 */}
        <div
          className={`p-4 mb-2 rounded border-2 ${
            selectedSection === 'header' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
          }`}
          onClick={() => setSelectedSection('header')}
          style={{ cursor: 'pointer' }}
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold">헤더</span>
            <span className={`text-sm font-bold ${
              overlayData.layouts.find(l => l.id === 'header')?.bounceRate || 0 > 30 ? 'text-red-600' : 'text-green-600'
            }`}>
              이탈률: {overlayData.layouts.find(l => l.id === 'header')?.bounceRate.toFixed(1)}%
            </span>
          </div>
        </div>
        
        {/* 히어로 섹션 */}
        <div
          className={`p-8 mb-2 rounded border-2 ${
            selectedSection === 'hero' ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
          }`}
          onClick={() => setSelectedSection('hero')}
          style={{ cursor: 'pointer' }}
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold">히어로 섹션 (제품 이미지/메인 메시지)</span>
            <span className="text-sm font-bold text-red-600">
              이탈률: {overlayData.layouts.find(l => l.id === 'hero')?.bounceRate.toFixed(1)}% ⚠️
            </span>
          </div>
        </div>
        
        {/* 제품 특징 */}
        <div
          className={`p-4 mb-2 rounded border-2 ${
            selectedSection === 'features' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-300 bg-white'
          }`}
          onClick={() => setSelectedSection('features')}
          style={{ cursor: 'pointer' }}
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold">제품 특징</span>
            <span className="text-sm font-bold text-yellow-600">
              이탈률: {overlayData.layouts.find(l => l.id === 'features')?.bounceRate.toFixed(1)}%
            </span>
          </div>
        </div>
        
        {/* 리뷰 섹션 */}
        <div
          className={`p-4 mb-2 rounded border-2 ${
            selectedSection === 'reviews' ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-white'
          }`}
          onClick={() => setSelectedSection('reviews')}
          style={{ cursor: 'pointer' }}
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold">리뷰 섹션</span>
            <span className="text-sm font-bold text-green-600">
              이탈률: {overlayData.layouts.find(l => l.id === 'reviews')?.bounceRate.toFixed(1)}%
            </span>
          </div>
        </div>
        
        {/* CTA 버튼 */}
        <div
          className={`p-4 mb-2 rounded border-2 ${
            selectedSection === 'cta' ? 'border-purple-500 bg-purple-50' : 'border-gray-300 bg-white'
          }`}
          onClick={() => setSelectedSection('cta')}
          style={{ cursor: 'pointer' }}
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold">구매 버튼 (CTA)</span>
            <span className="text-sm font-bold text-green-600">
              이탈률: {overlayData.layouts.find(l => l.id === 'cta')?.bounceRate.toFixed(1)}%
            </span>
          </div>
        </div>
        
        {/* 푸터 */}
        <div
          className={`p-4 rounded border-2 ${
            selectedSection === 'footer' ? 'border-gray-500 bg-gray-50' : 'border-gray-300 bg-white'
          }`}
          onClick={() => setSelectedSection('footer')}
          style={{ cursor: 'pointer' }}
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold">푸터</span>
            <span className="text-sm font-bold text-green-600">
              이탈률: {overlayData.layouts.find(l => l.id === 'footer')?.bounceRate.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
      
      {/* 선택된 섹션 상세 정보 */}
      {selectedSection && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          {(() => {
            const layout = overlayData.layouts.find(l => l.id === selectedSection)
            if (!layout) return null
            
            return (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">{layout.name} 상세 분석</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">이탈률</div>
                    <div className={`font-bold ${
                      layout.bounceRate > 50 ? 'text-red-600' :
                      layout.bounceRate > 30 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {layout.bounceRate.toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">평균 체류 시간</div>
                    <div className="font-bold text-gray-700">{layout.avgTimeOnSection}초</div>
                  </div>
                  <div>
                    <div className="text-gray-600">클릭률</div>
                    <div className="font-bold text-blue-600">{layout.clickThroughRate}%</div>
                  </div>
                </div>
                {layout.bounceRate > 50 && (
                  <div className="mt-3 p-2 bg-red-100 rounded border border-red-300">
                    <p className="text-sm text-red-700">
                      ⚠️ 이 섹션의 이탈률이 높습니다. 콘텐츠 개선이 필요합니다.
                    </p>
                  </div>
                )}
              </div>
            )
          })()}
        </div>
      )}
      
      {/* 전체 통계 */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="p-3 bg-gray-50 rounded border border-gray-200">
          <div className="text-xs text-gray-600 mb-1">전체 이탈률</div>
          <div className="text-lg font-bold text-gray-900">
            {overlayData.overallBounceRate.toFixed(1)}%
          </div>
        </div>
        <div className="p-3 bg-gray-50 rounded border border-gray-200">
          <div className="text-xs text-gray-600 mb-1">문제 구간</div>
          <div className="text-lg font-bold text-red-600">
            {overlayData.hotspots.length}개
          </div>
        </div>
        <div className="p-3 bg-gray-50 rounded border border-gray-200">
          <div className="text-xs text-gray-600 mb-1">최고 이탈 구간</div>
          <div className="text-lg font-bold text-red-600">
            {overlayData.layouts.reduce((max, l) => l.bounceRate > max.bounceRate ? l : max).name}
          </div>
        </div>
      </div>
    </div>
  )
}
