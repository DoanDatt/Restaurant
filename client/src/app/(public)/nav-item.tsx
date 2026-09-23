'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const menuItems = [
  {
    title: 'Món ăn',
    href: '/menu'
  },
  {
    title: 'Đơn hàng',
    href: '/orders'
  },
  {
    title: 'Đăng nhập',
    href: '/login',
    authRequired: false
  },
  {
    title: 'Quản lý',
    href: '/manage/dashboard',
    authRequired: true
  }
]

export default function NavItems({ className }: { className?: string }) {
  const pathname = usePathname()

  return menuItems.map((item) => {
    const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

    return (
      <Link
        href={item.href}
        key={item.href}
        className={cn(
          'group relative py-1.5 transition-colors duration-200',
          isActive ? 'text-[#E85D28]' : 'text-[#A79C8E] hover:text-[#F5EFE6]',
          className
        )}
      >
        {item.title}
        <span
          className={cn(
            'absolute -bottom-0.5 left-0 h-[1.5px] w-full origin-left scale-x-0 bg-[#E85D28] transition-transform duration-300 ease-out group-hover:scale-x-100',
            isActive && 'scale-x-100'
          )}
        />
      </Link>
    )
  })
}
