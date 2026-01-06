import type { Metadata } from 'next'
import { DashboardNavigation } from '@/components/dashboard/DashboardNavigation'

export const metadata: Metadata = {
  title: '마케팅 진단 대시보드',
  description: '종합 마케팅 진단 전략 대시보드',
}

export default function DashboardLayout({
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
