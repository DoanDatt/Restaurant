'use client'

import { checkAndRefreshToken } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

const UNAUTHENTICATED_PATH = ['/login', '/logout', 'refresh-token']
export default function RefreshToken() {
  const router = useRouter()
  const pathname = usePathname()
  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, prefer-const
    let interval: any = null
    checkAndRefreshToken({
      onError: () => {
        clearInterval(interval)
      }
    })
    const TIMEOUT = 1000
    interval = setInterval(
      () =>
        checkAndRefreshToken({
          onError: () => {
            clearInterval(interval)
            router.push('/login')
          }
        }),
      TIMEOUT
    )
    return () => {
      clearInterval(interval)
    }
  }, [pathname])
  return null
}
