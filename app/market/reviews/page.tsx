/**
 * 악플/공격 감시 상세 페이지
 */

import { MaliciousReviewProtection } from '@/components/dashboard/MaliciousReviewProtection'

export default function MaliciousReviewProtectionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MaliciousReviewProtection />
      </div>
    </div>
  )
}
