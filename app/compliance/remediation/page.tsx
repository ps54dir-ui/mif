/**
 * 자동 개선 계획 상세 페이지
 */

import { RemediationPlanGenerator } from '@/components/dashboard/RemediationPlanGenerator'

export default function RemediationPlanPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RemediationPlanGenerator />
      </div>
    </div>
  )
}
