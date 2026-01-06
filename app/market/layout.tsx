import type { Metadata } from 'next'
import { DashboardNavigation } from '@/components/dashboard/DashboardNavigation'

export const metadata: Metadata = {
  title: '시장 보호 시스템',
  description: '경쟁사 감시 및 시장 보호',
}

export default function MarketLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardNavigation />
      <main className="flex-1 overflow-y-auto lg:ml-64">
        {children}
      </main>
    </div>
  )
}
