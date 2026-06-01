'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ClipboardList } from 'lucide-react'

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex">
        <Link
          href="/"
          className={`flex flex-1 flex-col items-center py-3 gap-1 text-xs font-medium transition-colors ${
            pathname === '/' ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          <ClipboardList className="w-6 h-6" />
          업무 목록
        </Link>
      </div>
    </nav>
  )
}
