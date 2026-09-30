import { checkAndRefreshToken, getRefreshTokenFormLocalStorage } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function RefreshTokenPage() {
  const router = useRouter()
  const searchParam = useSearchParams()
  const refreshTokenFromUrl = searchParam.get('refreshToken')
  const redirectPathName = searchParam.get('redirect')
  useEffect(() => {
    if (refreshTokenFromUrl && refreshTokenFromUrl === getRefreshTokenFormLocalStorage()) {
      checkAndRefreshToken({
        onSuccess() {
          router.push(redirectPathName || '')
        }
      })
    } else {
      router.push('/')
    }
  }, [router, refreshTokenFromUrl, redirectPathName])
  return <div>RefreshToken</div>
}
