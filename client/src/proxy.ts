import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const privatePath = ['/manage']
const unAuthPath = ['/login']
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value
  // chưa đăng nhập thì không cho vào private path
  if (privatePath.some((path) => pathname.startsWith(path)) && !refreshToken) {
    // return Response.redirect(new URL('/login', request.url))
    const url = new URL('/login', request.url)
    url.searchParams.set('clearTokens', 'true')
    return NextResponse.redirect(url)
  }
  // đăng nhập rồi thì không cho vào unAuthPath
  if (unAuthPath.some((path) => pathname.startsWith(path)) && refreshToken) {
    return Response.redirect(new URL('/', request.url))
  }
  if (privatePath.some((path) => pathname.startsWith(path)) && !accessToken && refreshToken) {
    const url = new URL('/refresh-token', request.url)
    // Tạo URL mới trỏ đến /logout, dựa trên domain hiện tại (request.url)
    url.searchParams.set('refreshToken', refreshToken)
    // Gắn refreshToken vào làm query param: /logout?refreshToken=xxx
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
    //Redirect trình duyệt đến URL đó
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/manage/:path*', '/login']
}
