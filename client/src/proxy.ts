import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const privatePath = ['/manage']
const unAuthPath = ['/login']
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAuth = Boolean(request.cookies.get('accessToken')?.value)
  if (privatePath.some((path) => pathname.startsWith(path)) && !isAuth) {
    return Response.redirect(new URL('/login', request.url))
  }
  if (unAuthPath.some((path) => pathname.startsWith(path)) && isAuth) {
    return Response.redirect(new URL('/', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/manage/:path*', '/login']
}
