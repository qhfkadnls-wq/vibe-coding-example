'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ClipboardList, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { User } from '@/types'

interface SidebarProps {
  currentUser: User
}

export default function Sidebar({ currentUser }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">부서 플래너</h1>
        <p className="text-sm text-gray-500 mt-1">공동 업무 관리</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <Link
          href="/"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
            pathname === '/'
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <ClipboardList className="w-5 h-5" />
          업무 목록
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm">
            {currentUser.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{currentUser.name}</p>
            <p className="text-xs text-gray-500 truncate">{currentUser.department}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          로그아웃
        </button>
      </div>
    </aside>
  )
}
