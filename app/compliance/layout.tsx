import type { Metadata } from 'next'
import { DashboardNavigation } from '@/components/dashboard/DashboardNavigation'

export const metadata: Metadata = {
  title: '컴플라이언스 시스템',
  description: '규정 준수 및 컴플라이언스 관리',
}

export default function ComplianceLayout({
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
