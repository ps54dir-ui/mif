/**
 * 대시보드 네비게이션 메뉴
 * 사이드바 및 상단 네비게이션
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Shield,
  TrendingUp,
  FileText,
  AlertTriangle,
  UserCheck,
  Award,
  Wrench,
  Search,
  Flag,
  FileCheck,
  ChevronRight,
  Menu,
  X,
  BarChart3,
  Users
} from 'lucide-react'

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  children?: NavItem[]
}

export function DashboardNavigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems: NavItem[] = [
    {
      title: '대시보드',
      href: '#',
      icon: LayoutDashboard,
      children: [
        {
          title: '진단 및 분석',
          href: '/dashboard/diagnosis',
          icon: Search
        },
        {
          title: '전략 수립 제안',
          href: '/dashboard/strategy',
          icon: TrendingUp
        },
        {
          title: '데이터 비교',
          href: '/dashboard/comparison',
          icon: BarChart3
        }
      ]
    },
    {
      title: '컴플라이언스 (Layer 2)',
      href: '#',
      icon: Shield,
      children: [
        {
          title: '규정 준수 세부 검증',
          href: '/compliance/detail',
          icon: FileText
        },
        {
          title: '위험 자가진단',
          href: '/compliance/self-diagnosis',
          icon: AlertTriangle
        },
        {
          title: '컴플라이언스 스코어카드',
          href: '/compliance/scorecard',
          icon: Award
        },
        {
          title: '자동 개선 계획',
          href: '/compliance/remediation',
          icon: Wrench
        }
      ]
    },
    {
      title: '시장 보호 (Layer 3)',
      href: '#',
      icon: TrendingUp,
      children: [
        {
          title: '경쟁사 부정행위 감지',
          href: '/market/competitors',
          icon: Search
        },
        {
          title: '악플/공격 감시',
          href: '/market/reviews',
          icon: Flag
        },
        {
          title: '신고 도구',
          href: '/market/reporting',
          icon: FileCheck
        }
      ]
    }
  ]

  const isActive = (href: string) => {
    // 대시보드 관련 경로 처리
    if (href === '/dashboard' || href === '/dashboard/diagnosis') {
      return pathname === '/dashboard' || pathname === '/dashboard/diagnosis'
    }
    return pathname?.startsWith(href)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-white rounded-lg shadow-lg border border-gray-200"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-gray-700" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="p-6 border-b border-gray-200">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">OS</span>
              </div>
              <span className="font-bold text-gray-900">마케팅 OS</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const hasChildren = item.children && item.children.length > 0
                const isItemActive = isActive(item.href)

                return (
                  <li key={item.title}>
                    {hasChildren ? (
                      <div className="mb-2">
                        <div className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                          <Icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </div>
                        <ul className="mt-1 space-y-1 ml-4">
                          {item.children!.map((child) => {
                            const ChildIcon = child.icon
                            const isChildActive = isActive(child.href)

                            return (
                              <li key={child.title}>
                                <Link
                                  href={child.href}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                                    isChildActive
                                      ? 'bg-blue-50 text-blue-700 font-medium'
                                      : 'text-gray-700 hover:bg-gray-50'
                                  }`}
                                >
                                  <ChildIcon className="w-4 h-4" />
                                  <span>{child.title}</span>
                                </Link>
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                          isItemActive
                            ? 'bg-blue-50 text-blue-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* 회원사 관리 메뉴 (맨 하단) */}
          <div className="p-4 border-t border-gray-200">
            <Link
              href="/sales/clients"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                pathname?.startsWith('/sales/clients')
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>회원사 관리</span>
            </Link>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span>← 홈으로</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
